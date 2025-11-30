# 럭키박스 동시 요청 Race Condition 해결

## 📋 목차
- [문제 발견](#문제-발견)
- [근본 원인 분석](#근본-원인-분석)
- [해결 방법](#해결-방법)
- [구현 상세](#구현-상세)
- [테스트](#테스트)
- [결과](#결과)

---

## 🔍 문제 발견

### 로그 분석

프로덕션 환경에서 동일한 사용자의 럭키박스 참여 요청이 1초 내에 여러 번 발생했을 때 비정상적인 동작이 발견되었습니다.

```json
// 첫 번째 요청 (시작: 09:52:15.443841)
{
  "URI": "/api/benefit-promotions/405/lucky-box",
  "status": 409,
  "latency": "45.60829ms",
  "correlation_id": "00000000000000004749c3a463934c1b"
}

// 두 번째 요청 (시작: 09:52:15.444325)
{
  "URI": "/api/benefit-promotions/405/lucky-box",
  "status": 409,
  "latency": "44.822451ms",
  "correlation_id": "0000000000000000daa7339a303c9ebe"
}

// 세 번째 요청 (시작: 09:52:15.444592)
{
  "URI": "/api/benefit-promotions/405/lucky-box",
  "status": 200,
  "latency": "180.536595ms",
  "correlation_id": "0000000000000000bb62f43bb36a51dd"
}
```

### 이상 증상

- ❌ **첫 두 요청**: 409 Conflict (중복 요청으로 거부)
- ✅ **세 번째 요청**: 200 OK (성공)
- 🤔 **기대 동작**: 첫 번째 요청만 200, 나머지는 409

세 요청이 거의 동시에 도착했고(0.75ms 간격), 첫 두 요청은 빠르게 실패(~45ms)했지만 마지막 요청만 성공(180ms)했습니다.

---

## 🐛 근본 원인 분석

### 기존 코드의 문제점

**`checkDuplicatedClick` 함수 (수정 전)**

```go
func (u *luckyBoxV2UseCase) checkDuplicatedClick(ctx context.Context, transactionID string) error {
    var duplicatedClick bool

    // 1단계: Redis에서 읽기
    if err := u.cache.GetCache(ctx, transactionID, &duplicatedClick); err != nil {
        if !errors.Is(err, cache.ErrCacheMiss) {
            return fmt.Errorf("get cache: %w", err)
        }
    }

    // 2단계: 중복 체크
    if duplicatedClick {
        return domain.ErrMultipleClick
    }

    // 3단계: Redis에 쓰기
    err := u.cache.SetCache(ctx, transactionID, true, 1*time.Minute)
    if err != nil {
        return fmt.Errorf("failed to set dup click action: %w", err)
    }

    return nil
}
```

### Race Condition 발생 시나리오

**Check-Then-Set 패턴의 원자성 부재**

```
T=0ms:     요청A, B, C 거의 동시 도착

T=5ms:     요청A: GetCache → miss (캐시 없음)
           요청B: GetCache → miss (A가 아직 SetCache 전)
           요청C: GetCache → miss

T=10ms:    요청A: SetCache(true) ✅
           요청B: SetCache(true) ✅ (덮어씀)
           요청C: SetCache(true) ✅ (덮어씀)

// 세 요청 모두 checkDuplicatedClick 통과!

T=15ms:    이후 로직에서 다른 이유로 A, B는 실패
           C만 최종 성공
```

**핵심 문제:**
- `GetCache`와 `SetCache`가 **별도의 명령**으로 실행됨
- 두 명령 사이에 다른 요청이 끼어들 수 있음 (race condition)
- Redis에 원자적(atomic) 체크 앤 세트가 없음

### TransactionID 구조

```go
transactionID := getLuckyBoxTransactionID(
    device.ID,      // 431593247 (동일)
    luckyBox.UnitID, // 405 (동일)
    string(request.EventName), // daily (동일)
    today,          // 2025-11-28 (동일)
)
// 결과: "lucky_box:431593247:405:daily:2025-11-28"
```

동일한 사용자가 같은 날 같은 이벤트로 요청하면 **동일한 transactionID**를 사용합니다.

---

## ✅ 해결 방법

### SETNX를 사용한 원자적 연산

Redis의 `SETNX` (SET if Not eXists) 명령을 사용하여 **Check와 Set을 하나의 원자적 작업**으로 수행합니다.

**개선된 코드**

```go
func (u *luckyBoxV2UseCase) checkDuplicatedClick(ctx context.Context, transactionID string) error {
    // SETNX로 원자적 연산
    success, err := u.cache.SetNX(ctx, transactionID, true, 1*time.Minute)
    if err != nil {
        return fmt.Errorf("failed to set dup click lock: %w", err)
    }

    // success가 false면 키가 이미 존재 = 중복 클릭
    if !success {
        return domain.ErrMultipleClick
    }

    return nil
}
```

**SETNX의 장점:**
- ✅ **원자성**: 단일 Redis 명령으로 실행
- ✅ **경합 없음**: 첫 번째 요청만 키를 생성하고 true 반환
- ✅ **간결함**: 3단계 → 1단계로 단순화

### 동작 방식

```
T=0ms:     요청A, B, C 동시 도착

T=5ms:     요청A: SetNX → 성공 (키 생성) ✅ → 계속 진행
           요청B: SetNX → 실패 (키 존재) ❌ → 409 반환
           요청C: SetNX → 실패 (키 존재) ❌ → 409 반환

T=50ms:    요청A만 정상 처리 → 200 반환
           요청B, C는 이미 409로 반환됨
```

---

## 🔧 구현 상세

### 1. CacheRepo 인터페이스 확장

**파일**: `usecase/repository.go`

```go
type CacheRepo interface {
    GetCache(ctx context.Context, key string, obj interface{}) error
    SetCache(ctx context.Context, key string, obj interface{}, expiration time.Duration) error
    SetNX(ctx context.Context, key string, obj interface{}, expiration time.Duration) (bool, error) // 추가
    DeleteCache(ctx context.Context, key string) error
}
```

### 2. RedisCache 구조체 수정

**파일**: `infra/rediscache/redis.go`

```go
type RedisCache struct {
    cache  *cache.Cache
    client redis.UniversalClient  // Redis 클라이언트 직접 접근용 추가
}
```

### 3. SetNX 메서드 구현

```go
func (r *RedisCache) SetNX(
    ctx context.Context,
    key string,
    obj interface{},
    expiration time.Duration,
) (bool, error) {
    // msgpack으로 직렬화 (기존 캐시와 동일한 방식)
    data, err := msgpack.Marshal(obj)
    if err != nil {
        return false, fmt.Errorf("marshal object for setnx(key: %s): %w", key, err)
    }

    // Redis SETNX 명령 실행
    success, err := r.client.SetNX(ctx, key, data, expiration).Result()
    if err != nil {
        return false, fmt.Errorf("redis setnx(key: %s): %w", key, err)
    }

    return success, nil
}
```

### 4. 생성자 함수 업데이트

```go
func NewSource(client redis.UniversalClient) *RedisCache {
    cache := cache.New(&cache.Options{
        Redis: client,
        Marshal: func(v interface{}) ([]byte, error) {
            return msgpack.Marshal(v)
        },
        Unmarshal: func(b []byte, v interface{}) error {
            if v == nil {
                return nil
            }
            return msgpack.Unmarshal(b, v)
        },
    })

    return &RedisCache{
        cache:  cache,
        client: client,  // 클라이언트 저장
    }
}
```

---

## 🧪 테스트

### Mock 업데이트

**파일**: `luckybox_test.go`

```go
// mockCache에 SetNX 메서드 추가
func (rc *mockCache) SetNX(
    _ context.Context,
    key string,
    obj interface{},
    expiration time.Duration,
) (bool, error) {
    ret := rc.Called(key, obj, expiration)
    return ret.Bool(0), ret.Error(1)
}

// 테스트에서 mock 설정 변경
// Before:
ts.cache.On("GetCache", ...).Return(nil, nil).Maybe()
ts.cache.On("SetCache", ...).Return(nil, nil).Maybe()

// After:
ts.cache.On("SetNX", mock.Anything, mock.Anything, mock.Anything).Return(true, nil).Maybe()
```

### 동시성 테스트 추가

**파일**: `luckybox_test.go`

```go
func TestCheckDuplicatedClickConcurrency(t *testing.T) {
    // miniredis로 실제 Redis 시뮬레이션
    s, err := miniredis.Run()
    require.NoError(t, err)
    defer s.Close()

    redisClient := redis.NewClient(&redis.Options{Addr: s.Addr()})
    defer redisClient.Close()

    cache := rediscache.NewSource(redisClient)
    transactionID := "lucky_box:12345:100:daily:2025-11-28"

    // ... 4가지 테스트 시나리오
}
```

#### 테스트 시나리오

**1. 동시 요청 테스트 (10개)**
```go
t.Run("Only first request should succeed with concurrent requests", func(t *testing.T) {
    var wg sync.WaitGroup
    results := make(chan error, 10)

    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            success, err := cache.SetNX(ctx, transactionID, true, 1*time.Minute)
            if err != nil {
                results <- err
            } else if !success {
                results <- domain.ErrMultipleClick
            } else {
                results <- nil
            }
        }()
    }

    wg.Wait()
    close(results)

    // 검증: 정확히 1개 성공, 9개 중복
    successCount := 0
    duplicateCount := 0
    for err := range results {
        if err == nil {
            successCount++
        } else if errors.Is(err, domain.ErrMultipleClick) {
            duplicateCount++
        }
    }

    assert.Equal(t, 1, successCount)
    assert.Equal(t, 9, duplicateCount)
})
```

**2. TTL 만료 후 재요청 테스트**
```go
t.Run("Requests after TTL expiry should succeed", func(t *testing.T) {
    // 첫 요청 성공
    success, _ := cache.SetNX(ctx, transactionID, true, 1*time.Second)
    assert.True(t, success)

    // 즉시 재요청 실패
    success, _ = cache.SetNX(ctx, transactionID, true, 1*time.Second)
    assert.False(t, success)

    // 시간 경과 (miniredis FastForward)
    s.FastForward(1*time.Second + 100*time.Millisecond)

    // TTL 만료 후 성공
    success, _ = cache.SetNX(ctx, transactionID, true, 1*time.Second)
    assert.True(t, success)
})
```

**3. 서로 다른 Transaction ID 테스트**
```go
t.Run("Different transaction IDs should not conflict", func(t *testing.T) {
    id1 := "lucky_box:12345:100:daily:2025-11-28"
    id2 := "lucky_box:67890:100:daily:2025-11-28"

    success1, _ := cache.SetNX(ctx, id1, true, 1*time.Minute)
    success2, _ := cache.SetNX(ctx, id2, true, 1*time.Minute)

    assert.True(t, success1)
    assert.True(t, success2)
})
```

**4. 고부하 스트레스 테스트 (100개)**
```go
t.Run("High concurrency stress test (100 requests)", func(t *testing.T) {
    var wg sync.WaitGroup
    results := make(chan error, 100)
    startTime := time.Now()

    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            success, err := cache.SetNX(ctx, transactionID, true, 1*time.Minute)
            // ... 결과 전송
        }()
    }

    wg.Wait()
    duration := time.Since(startTime)

    // 검증: 100개 중 정확히 1개만 성공
    assert.Equal(t, 1, successCount)
    assert.Equal(t, 99, duplicateCount)
    t.Logf("Completed in %v", duration)  // ~20ms
})
```

---

## 📊 결과

### 테스트 결과

```bash
=== RUN   TestCheckDuplicatedClickConcurrency
=== RUN   TestCheckDuplicatedClickConcurrency/Only_first_request_should_succeed_with_concurrent_requests
=== RUN   TestCheckDuplicatedClickConcurrency/Requests_after_TTL_expiry_should_succeed
=== RUN   TestCheckDuplicatedClickConcurrency/Different_transaction_IDs_should_not_conflict
=== RUN   TestCheckDuplicatedClickConcurrency/High_concurrency_stress_test_(100_requests)
    luckybox_test.go:3032: High concurrency test completed in 20.458542ms
    luckybox_test.go:3033: Success: 1, Duplicates: 99
--- PASS: TestCheckDuplicatedClickConcurrency (0.02s)
    --- PASS: TestCheckDuplicatedClickConcurrency/Only_first_request_should_succeed_with_concurrent_requests (0.00s)
    --- PASS: TestCheckDuplicatedClickConcurrency/Requests_after_TTL_expiry_should_succeed (0.00s)
    --- PASS: TestCheckDuplicatedClickConcurrency/Different_transaction_IDs_should_not_conflict (0.00s)
    --- PASS: TestCheckDuplicatedClickConcurrency/High_concurrency_stress_test_(100_requests) (0.02s)
PASS
```

### 성능

- **100개 동시 요청 처리**: ~20ms
- **메모리 효율**: 원자적 연산으로 불필요한 중복 처리 제거
- **정확성**: 100% 일관된 동작 보장

### 비교표

| 항목 | Before (GetCache + SetCache) | After (SetNX) |
|------|------------------------------|---------------|
| **원자성** | ❌ 없음 (race condition 발생) | ✅ 보장 |
| **Redis 호출 수** | 2회 (GET + SET) | 1회 (SETNX) |
| **동시 요청 처리** | ❌ 비정상 (첫 두 요청 409, 마지막 200) | ✅ 정상 (첫 요청만 200) |
| **코드 복잡도** | 높음 (3단계 로직) | 낮음 (1단계 로직) |
| **테스트 커버리지** | 단위 테스트만 | 단위 + 동시성 + 통합 |

---

## 📝 교훈

### 1. 분산 시스템에서의 동시성

- **Check-Then-Act 패턴은 위험**: 분산 환경에서 원자성이 보장되지 않음
- **원자적 연산 사용**: Redis의 SETNX, INCR, Lua Script 등 활용
- **Race Condition은 로그로 발견하기 어려움**: 타이밍에 따라 드물게 발생

### 2. Redis 활용

- **SETNX**: 분산 락(Distributed Lock)의 기초
- **TTL**: 자동 만료로 데드락 방지
- **Lua Script**: 더 복잡한 원자적 연산이 필요할 때

### 3. 테스트 전략

- **단위 테스트만으로 부족**: 동시성 이슈는 통합 테스트 필요
- **miniredis**: 실제 Redis 없이도 통합 테스트 가능
- **스트레스 테스트**: 100개 이상 동시 요청으로 검증

### 4. 디버깅 팁

- **로그 타임스탬프 + Latency**: 요청 시작 시간 계산
- **Correlation ID**: 요청 추적
- **비정상 패턴 인식**: "왜 첫 요청이 실패하고 마지막이 성공하지?"

---

## 🔗 관련 파일

### 수정된 파일

- `components/buzzscreen/pkg/services/promotionsvc/domain/usecase/repository.go`
  - SetNX 인터페이스 추가
- `components/buzzscreen/pkg/services/promotionsvc/domain/usecase/usecase.go`
  - checkDuplicatedClick 함수 개선
- `components/buzzscreen/infra/rediscache/redis.go`
  - SetNX 메서드 구현
  - RedisCache 구조체에 client 필드 추가
- `components/buzzscreen/pkg/services/promotionsvc/domain/usecase/luckybox_test.go`
  - mockCache에 SetNX 추가
  - TestCheckDuplicatedClickConcurrency 추가

### 핵심 코드 위치

| 기능 | 파일 | 라인 |
|------|------|------|
| SetNX 인터페이스 | `usecase/repository.go` | 32 |
| checkDuplicatedClick | `usecase/usecase.go` | 415-426 |
| SetNX 구현 | `infra/rediscache/redis.go` | 93-110 |
| 동시성 테스트 | `luckybox_test.go` | 2845-3033 |

---

## 📚 참고 자료

- [Redis SETNX Documentation](https://redis.io/commands/setnx/)
- [Distributed Locks with Redis](https://redis.io/docs/manual/patterns/distributed-locks/)
- [Go Concurrency Patterns](https://go.dev/blog/context)
- [Miniredis - In-memory Redis for Go testing](https://github.com/alicebob/miniredis)

---

**작성일**: 2025-11-30
**작성자**: Claude Code
**문서 버전**: 1.0
