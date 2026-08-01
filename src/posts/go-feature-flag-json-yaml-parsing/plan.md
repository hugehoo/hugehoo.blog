# JSON인데 YAML로 파싱하고 있었다 — 집필 계획

## 목표

Pyroscope에서 `gopkg.in/yaml.yaml_parser_state_machine`이 높은 CPU 비중을 차지하는 것을 발견한 과정을 정리한다.

서비스에서는 `FileFormat: "json"` 한 줄로 우선 해결하고, go-feature-flag에는 `FormatHinter`를 기여했다.

글의 중심은 단순한 설정 변경이 아니라 다음 문제 해결 흐름이다.

```bash
관측 인프라 구축
    → 예상하지 못한 YAML parser 발견
    → Redis부터 parser까지 데이터 흐름 추적
    → 서비스에서 한 줄로 우선 해결
    → 전역 FileFormat의 구조적 한계 확인
    → retriever가 포맷을 선언하는 optional interface 기여
```

## 독자와 핵심 메시지

- 대상 독자: Go 백엔드 개발자, CPU profiling과 의존성 병목 분석에 관심 있는 개발자, 하위 호환적인 라이브러리 설계에 관심 있는 개발자
- 예상 분량: 6,000~8,000자
- 예상 읽기 시간: 8~12분
- 핵심 메시지:
  - 기능적으로 정상인 코드도 성능 면에서는 잘못될 수 있다.
  - 서비스의 국소적인 workaround와 라이브러리의 범용 해법은 다르다.
  - 데이터 포맷은 데이터를 생산하는 retriever가 선언하는 편이 자연스럽다.

## 제목 후보

1. JSON인데 YAML로 파싱하고 있었다 — Pyroscope에서 시작한 go-feature-flag 개선기
2. 파싱은 성공했지만 CPU는 낭비되고 있었다
3. 서비스의 한 줄 수정에서 go-feature-flag 오픈소스 기여까지

추천 제목은 1번이다. 실제 4% 감소를 사후 측정하기 전에는 제목에서 개선율을 단정하지 않는다.

## 근거 자료

### 비공개 운영 자료

- 원본 분석 노트, 내부 변경 기록, 서비스 설정, profile을 대조했다.
- 내부 저장소 URL, commit, 서비스·환경명, endpoint, selector는 이 공개 저장소에 기록하지 않는다.
- 공개 글에는 승인된 익명 스니펫과 집계값만 싣고, 독자용 근거는 아래 공개 업스트림 자료를 사용한다.
- 재현 기준 도구는 Go `1.24.10`, go-feature-flag `v1.41.3`으로 맞춘다.

### 업스트림 자료

- 문제 제기: https://github.com/thomaspoignant/go-feature-flag/issues/5321
- FormatHinter 구현: https://github.com/thomaspoignant/go-feature-flag/pull/5322
- v1.41.3 Redis 반환 경로: https://github.com/thomaspoignant/go-feature-flag/blob/v1.41.3/retriever/redisretriever/retriever.go#L50-L77
- v1.41.3 parser 선택 경로: https://github.com/thomaspoignant/go-feature-flag/blob/v1.41.3/internal/cache/cache_manager.go#L48-L60
- FormatHinter merge commit: https://github.com/thomaspoignant/go-feature-flag/commit/fe7ed77f7d1179d9f63be8d209dc9675ed1536e2
- 최초 포함 릴리스: https://github.com/thomaspoignant/go-feature-flag/releases/tag/v1.54.0
- YAML 1.2.2 명세: https://yaml.org/spec/1.2.2/
- go-yaml v3.0.1 parse→decode 구현: https://github.com/go-yaml/yaml/blob/v3.0.1/yaml.go#L156-L166
- Go 1.24.10 encoding/json Decode 구현: https://github.com/golang/go/blob/go1.24.10/src/encoding/json/decode.go#L97-L183
- Go encoding/json 문서: https://pkg.go.dev/encoding/json

## 확인된 사실

### 코드, PR, 공식 문서로 검증 완료

- v1.41.3 Redis retriever는 Redis Hash가 아니라 prefix 기반 `SCAN`과 `GET`으로 문자열 값을 읽고, 각 값을 `json.Unmarshal`한 뒤 전체 map을 `json.Marshal`하여 반환했다.
- v1.41.3은 모든 retriever 결과에 전역 `Config.FileFormat`을 그대로 전달했다. 빈 값은 `ConvertToFlagStruct`의 `default`에서 `yaml.Unmarshal`로 갔다.
- 이 경로는 초기화 때 한 번, 이후 polling 때 실행된다. evaluation 요청마다 실행되지 않는다.
- 서비스 설정은 `PollingInterval: 60 * time.Second`와 `EnablePollingJitter: true`였다. 실제 주기는 프로세스 시작 시 정해지는 약 54~66초다.
- 서비스 코드 변경은 `FileFormat: "json"` 한 줄이다. 해당 ref의 CI와 검증 환경 rollout은 성공했다.
- “기존 동작과 일치”는 변경 기록의 체크리스트로만 남아 있다. 평가 입력, 기대값, 실제값 로그는 없다.
- 업스트림 PR #5322는 기존 `Retriever`를 바꾸지 않고 optional `FormatHinter`를 추가했다. Redis, MongoDB, PostgreSQL은 JSON hint를 반환하고, hint가 없거나 비면 기존 전역 설정으로 fallback한다.
- 업스트림 PR은 2026-05-28 머지됐고 v1.54.0에 처음 포함됐다. 2026-08-01 최신 릴리스 v1.55.1에도 구현이 유지된다.

### 원본 기록에만 있어 추가 계측이 필요한 주장

- 당시 작업 기록에는 `yaml_parser_state_machine`이 약 `630M CPU cycles`, 전체 약 4%라고 적혀 있다. 원본 pprof, 조회 URL, 시간 범위, selector가 없어 단위와 비율을 재검산할 수 없다.
- 같은 기록은 YAML parser가 JSON보다 2~3배 느리다고 적었지만 benchmark 결과가 첨부되지 않았다.
- 변경 후 YAML 경로가 제거될 것으로 기대한 것은 코드상 타당하지만, 당시 동일 조건의 after profile은 남아 있지 않다.

## 표현 가드레일

### 반드시 구분할 것

- “약 630M, 약 4%”는 당시 작업 기록이다. 원본 profile을 확보하기 전에는 독립 검증된 수치로 표현하지 않는다.
- 재조회에 사용한 CPU profile type의 단위는 `cpu:nanoseconds`다. 과거 profile이 같은 type이었다면 `630M`은 630M cycles가 아니라 약 630ms CPU time이므로, 원본 없이 `cycles` 표기를 반복하지 않는다.
- 변경 후 현재 profile에서 `ConvertToFlagStruct → encoding/json.Unmarshal` 경로와 YAML symbol 부재를 확인했다: after-only 관측 사실
- 변경 후 서비스 전체 CPU가 정확히 4% 감소했다: 동일 조건 before/after가 없으므로 단정할 수 없음
- 안전한 표현: “JSON을 YAML로 해석하던 경로를 제거했다.”

### 피해야 할 표현

- “매 Feature Flag evaluation 요청마다 YAML을 파싱했다.”
  - 실제 파싱은 초기화와 약 54~66초 polling으로 Redis 데이터를 읽어 로컬 캐시를 갱신하는 경로에서 발생했다.
- “JSON parser는 상태 머신을 사용하지 않는다.”
  - JSON parser도 scanning 상태를 관리한다. YAML이 더 풍부한 문법과 중간 표현을 처리한다고 설명한다.
- “JSON은 1단계, YAML은 항상 3단계다.”
  - 이해를 위한 단순화임을 밝히거나 bytes → parse/node → decode 수준으로 표현한다.
- “YAML은 항상 JSON보다 2~3배 느리다.”
  - 동일 payload benchmark 안에서만 결과를 말하고 서비스 전체 CPU 개선율로 외삽하지 않는다.
- “630M cycles가 200~300M cycles로 줄었다.”
  - 과거 단위부터 확인되지 않았고 after profile도 없으므로 사용하지 않는다.
- “go-feature-flag는 원래 파일 기반 전용으로 설계됐다.”
  - 공식 근거가 없으므로, YAML 기본값은 파일 기반 retriever에는 합리적이었다는 수준으로 서술한다.

## 추가 조사 항목

| 우선순위 | 필요한 정보 | 현재 상태 | 완료 조건 |
|---|---|---|---|
| P0 | 변경 전 raw profile 또는 원본 화면 | 당시 기록의 `630M`, `약 4%`만 남음 | 조회 시간·timezone·endpoint·selector·profile type·unit·pod 수를 함께 확보 |
| P0 | 비교 가능한 after profile | 당시 자료는 보존 범위 밖 | 같은 workload와 payload로 재현하거나, 수치 비교를 포기하고 경로 제거만 서술 |
| P0 | 내부 정보 공개 범위 | 미확인 | 서비스명, 변경 기록, 코드, profile 이미지별 공개 승인 |
| P1 | 실제 규모 benchmark용 payload 규모 | 미확보 | 정량 benchmark를 게재할 때만 flag 수와 byte 수 확보. 원문은 저장하거나 커밋하지 않음 |
| P1 | parser microbenchmark | 실행 scaffold 준비 완료, 실제 규모 미반영 | 실제 flag 수·byte 수로 10회 측정하고 환경과 원시 결과 기록 |
| P1 | 기능 검증 근거 | 변경 기록의 체크리스트만 존재 | 익명화한 flag의 입력·기대값·실제값·배포 ref·시각 확보 |
| P2 | 시각 자료 | 미제작 | 승인된 before 화면, 데이터 흐름, workaround/FormatHinter 비교 제작 |

업스트림 코드와 릴리스 조사는 완료됐다. 추가 웹 검색보다 위 P0 운영 데이터 확보가 우선이다.

parser 비교 수치를 본문에 싣지 않으면 flag 수·byte 수 수집과 실제 규모 benchmark는 생략한다.

## 데이터 수집 준비

### 과거 profile 보존 여부

허가된 Pyroscope endpoint들에서 당시 날짜를 조회했지만 보존된 series가 없었다. 원본 pprof나 캡처를 별도로 찾지 못하면 당시 수치는 작업 기록으로만 인용한다.

### 현재 after-only profile

인과 비교 자료가 아니라 현재 경로 확인용 보조 근거다.

최근 30분·6시간·24시간 snapshot에서 `ConvertToFlagStruct → encoding/json.Unmarshal` 경로와 YAML symbol 부재를 확인했다. 정확한 endpoint, selector, ref, series 수, sample 값은 공개 승인 전까지 저장소 밖에서 관리한다.

이 snapshot은 시간, 배포 ref, pod, workload가 과거와 다르다. “현재 JSON 분기를 사용한다”는 보조 증거로만 쓰고 4% 개선 근거로 사용하지 않는다.

재조회 명령:

```bash
PYROSCOPE_URL='승인된 endpoint'
PROFILE_SELECTOR='승인된 selector'

profilecli query profile \
  --url="$PYROSCOPE_URL" \
  --query="$PROFILE_SELECTOR" \
  --from=now-30m \
  --to=now \
  --profile-type='process_cpu:cpu:nanoseconds:cpu:nanoseconds' \
  --output=pprof=/tmp/goff-parser-cpu-30m.pprof \
  --force

go tool pprof -top -nodecount=40 \
  -focus='ConvertToFlagStruct|yaml' \
  /tmp/goff-parser-cpu-30m.pprof
```

### 통제된 before/after 재현

내부 작업 기록에서 `FileFormat` 한 줄만 다른 before/after ref를 확인했다. 식별자는 공개 승인 전까지 저장소 밖에서 관리하고, 공통으로 Go `1.24.10`, go-feature-flag `v1.41.3`을 사용한다.

`EnablePollingJitter: true`면 30분 동안 pod별 polling 횟수가 약 27~33회로 달라질 수 있다. 통제 실험에서는 두 ref 모두 jitter를 끄거나 실제 refresh 횟수로 정규화한다.

5분 warm-up 뒤 30분 측정을 3회 반복하고, Pyroscope 비율 외에 pod CPU 사용량도 함께 기록한다.

| 항목 | Before | After |
|---|---|---|
| Source ref / image digest |  |  |
| Go / go-feature-flag | `1.24.10` / `v1.41.3` | `1.24.10` / `v1.41.3` |
| Profile 시작·종료·길이 |  |  |
| Profile type / unit |  |  |
| Pod 수 / architecture |  |  |
| CPU limit / GOMAXPROCS / GOGC |  |  |
| Poll interval / jitter / refresh 수 |  |  |
| Payload flags / bytes / 비공개 hash |  |  |
| 요청 부하 또는 idle 조건 |  |  |
| 전체 CPU sample |  |  |
| YAML parser self / cumulative |  |  |
| JSON unmarshal cumulative |  |  |
| Pod CPU 사용량 |  |  |

### payload 집계

실제 payload는 승인된 경로에서만 내보내고 저장소 밖의 권한 제한 임시 파일에 둔다.

공개 저장소에는 `flag_count`, `payload_bytes`, 필요하면 variation/rule 수만 기록한다. 원문, hash, key 이름은 커밋하지 않는다.

```bash
umask 077
GOFF_PRIVATE_PAYLOAD="$(mktemp /tmp/goff-payload.XXXXXX)"
trap 'rm -f "$GOFF_PRIVATE_PAYLOAD"' EXIT

# 승인된 방식으로 Redis retriever의 최종 JSON bytes를 위 파일에 저장한 뒤 실행한다.
wc -c < "$GOFF_PRIVATE_PAYLOAD"
jq '{
  flag_count: length,
  variation_count: ([.[] | (.variations // {}) | length] | add // 0),
  targeting_rule_count: ([.[] | (.targeting // []) | length] | add // 0)
}' "$GOFF_PRIVATE_PAYLOAD"
```

### JSON/YAML parser benchmark

실행 코드는 `benchmark/`의 독립 Go module에 준비했다. 같은 JSON bytes를 단순화한 flag DTO로 decode하는 parser-only synthetic benchmark다.

실제 `ConvertToFlagStruct`나 서비스 전체 CPU를 재현하지 않으므로 결과를 서비스 개선율로 외삽하지 않는다.

정량 benchmark를 싣는다면 먼저 실제 집계값 `N`과 `B`로 두 parser가 같은 구조를 만드는지 확인한다.

```bash
cd src/posts/go-feature-flag-json-yaml-parsing/benchmark

GOTOOLCHAIN=go1.24.10 go test \
  -run '^TestJSONPayloadDecodesWithBothParsers$' \
  -count=1 \
  -v \
  -args -flags=N -bytes=B
```

그다음 단일 CPU 조건에서 10회 측정한다.

```bash
GOTOOLCHAIN=go1.24.10 go test \
  -run '^$' \
  -bench '^BenchmarkDecode$' \
  -benchmem \
  -benchtime=3s \
  -count=10 \
  -cpu=1 \
  -args -flags=N -bytes=B \
  | tee /tmp/goff-parser-benchmark.txt
```

실제 승인·익명화 payload를 쓸 때는 `-flags/-bytes` 대신 `-payload=/tmp/...`를 사용한다. 결과에는 `go version`, OS/architecture, CPU 모델, payload의 flag 수·bytes, `ns/op`, `B/op`, `allocs/op`를 남긴다.

## 상세 목차

### 1. 프로파일 상위에 나타난 낯선 YAML 함수

- Pyroscope flame graph에서 `yaml_parser_state_machine` 발견
- PR에는 약 `630M`, 전체 약 4%로 기록됐지만 raw profile을 찾기 전에는 단위를 붙이지 않음
- 우리는 Redis와 JSON을 사용하는데 YAML 함수가 등장한 이유를 질문으로 제시
- 며칠 전 내부 관측 인프라 작업으로 Pyroscope CPU profile 수집을 가능하게 했다는 배경을 한 문단으로 설명

시각 자료:

- 변경 전 Pyroscope flame graph
- 공개가 어려우면 서비스명과 전체 수치는 가리고 함수명과 상대 비중만 노출

### 2. YAML parser까지 호출 경로를 따라가 보기

```bash
Redis keys (`configured prefix + "*"`)
    ↓
SCAN + GET
    ↓ 각 값 json.Unmarshal, 전체 map json.Marshal
JSON bytes
    ↓ global FileFormat (empty)
yaml.Unmarshal
    ↓
Feature Flag DTO
```

- Redis retriever의 `json.Marshal`
- 전역 `FileFormat`이 모든 retriever 결과에 적용되는 구조
- 빈 값은 YAML default 분기로 이동
- 초기화와 약 54~66초 polling 시 로컬 캐시 갱신 경로에서 실행된다는 점 명시

코드 스니펫:

- 대상 서비스의 `ffclient.Config`를 승인된 범위에서 익명화한 예시
- go-feature-flag v1.41.3의 Redis retriever 반환부
- `ConvertToFlagStruct`의 parser switch

### 3. 잘못된 파서인데 왜 실패하지 않았을까

- YAML 1.2가 JSON 호환성을 목표로 한 배경
- JSON object/array 문법이 YAML flow style로 해석될 수 있음을 작은 예제로 설명
- 에러, 기능 테스트, evaluation 결과가 모두 정상이라 profile 없이는 찾기 어려웠다는 점 강조

핵심 문장 후보:

> 일반적인 버그는 실패하기 때문에 발견된다. 이번 문제는 성공했기 때문에 profile을 보기 전까지 발견하기 어려웠다.

### 4. YAML parser가 더 많은 일을 하는 이유

- JSON의 제한된 문법과 YAML의 block/flow style, anchor, alias, tag, scalar 처리 비교
- go-yaml v3가 parser로 node를 만든 뒤 대상 Go 값으로 decode하는 흐름 설명
- JSON은 이번 입력의 원래 포맷이고, YAML은 호환되지만 불필요하게 범용적인 포맷이었다는 결론

비교표:

| 항목 | JSON | YAML |
|---|---|---|
| 구조 표현 | 명시적인 구분자 | 들여쓰기 및 flow/block style |
| 지원 문법 | 제한된 JSON 데이터 타입 | anchor, alias, tag, 다양한 scalar 표현 |
| 이번 입력 | 원래 포맷 | 호환되지만 불필요하게 범용적 |

### 5. 서비스에서는 한 줄로 해결할 수 있었다

```diff
ffConfig := ffclient.Config{
    PollingInterval: 60 * time.Second,
+   FileFormat:      "json",
    Retriever:       &redisretriever.Retriever{...},
}
```

- 서비스의 실제 변경은 한 줄
- JSON bytes가 `json.Unmarshal` 분기로 직접 전달됨
- CI와 검증 환경 rollout 성공은 확인됨. 기능 일치 여부는 변경 기록의 체크리스트에 귀속
- 해결 코드의 크기와 원인 분석의 크기는 비례하지 않는다는 메시지

소제목/문장 후보:

> 해결은 한 줄이었지만 원인은 한 줄에서 보이지 않았다.

### 6. 4%를 줄였다고 말해도 될까

- before profile에서 확인한 사실과 after 효과를 분리
- 원본 before 수치는 raw profile이 없어 PR 작성자 관측으로 귀속
- 현재 after-only profile은 JSON 분기와 YAML symbol 부재를 보여 주지만 개선율 계산에는 사용하지 않음
- 통제 재현이 없으면 YAML parsing 경로 제거까지만 결론

### 7. 이 한 줄을 라이브러리의 기본값으로 만들 수 없는 이유

- 대상 서비스는 Redis만 사용하므로 전역 JSON 설정으로 해결 가능
- PR #5322 시점의 라이브러리는 Redis/MongoDB/PostgreSQL 외에 File/HTTP 등 원본 bytes를 전달하는 retriever도 지원
- YAML default를 JSON으로 바꾸면 기존 사용자 호환성을 깨뜨릴 수 있음
- manager에서 구체 타입을 검사하면 결합도가 증가
- 하나의 전역 FileFormat이 서로 다른 retriever 결과에 적용되는 것이 구조적 한계

시각 자료:

| Retriever | 반환 포맷 특성 | 전역 JSON 강제 가능 여부 |
|---|---|---|
| Redis/MongoDB/PostgreSQL | 항상 JSON | 가능 |
| File/HTTP 등 | 사용자의 원본 포맷 | 불가능 |

### 8. 출력 포맷의 소유권을 retriever로 옮기기

```go
type FormatHinter interface {
    OutputFormat() string
}
```

- 기존 `Retriever` 인터페이스는 변경하지 않는 optional interface
- manager가 type assertion으로 지원 여부 확인
- hint가 있으면 retriever 포맷, 없거나 빈 값이면 기존 global FileFormat 사용
- Redis/MongoDB/PostgreSQL은 `OutputFormat() string { return "json" }` 구현
- custom retriever와 기존 사용자의 하위 호환성 유지

핵심 문장 후보:

> 출력 포맷은 parser의 전역 설정이라기보다 데이터를 생산하는 retriever의 속성에 가까웠다.

### 9. 포맷 문자열이 아니라 실제 동작을 테스트하기

- TOML payload, global YAML, retriever TOML hint를 충돌시켜 hint 우선 동작 검증
- 빈 hint는 기존 global 설정으로 fallback되는지 검증
- manager 테스트는 “메서드가 문자열을 반환한다”보다 실제 parser 우선순위를 검증
- Redis/MongoDB/PostgreSQL 테스트는 각각 `OutputFormat() == "json"`을 검증한다는 범위 구분

### 10. 서비스의 한 줄에서 오픈소스 설계까지

타임라인:

1. 2026-05-15: Pyroscope 수집 환경 구축
2. 2026-05-19: 서비스에 JSON FileFormat 명시
3. 2026-05-23: 업스트림 Issue #5321과 PR #5322 작성
4. 2026-05-28: `FormatHinter` 변경 머지
5. 2026-06-04 KST: v1.54.0에 최초 포함

마무리 교훈:

- 관측 가능성이 기능적으로 정상인 성능 낭비를 발견하게 했다.
- 서비스 workaround를 그대로 업스트림 해법으로 복사하지 않고 문제를 일반화해야 했다.
- 데이터에 대한 정보는 그 데이터를 생산하는 컴포넌트가 소유하는 편이 자연스럽다.

마지막 문장 후보:

> 프로덕션에서 발견한 한 줄짜리 설정 누락은, 결국 라이브러리에서 데이터 포맷의 책임을 어디에 둘 것인가라는 설계 문제로 이어졌다.

## 필요한 시각 자료

- [ ] 변경 전 Pyroscope flame graph
- [ ] 변경 전 데이터 흐름 다이어그램
- [ ] 변경 후 데이터 흐름 다이어그램
- [ ] retriever별 반환 포맷 비교표
- [ ] 서비스 workaround와 업스트림 해결 비교
- [x] 현재 after-only Pyroscope profile 경로 확인
- [ ] 가능하다면 통제된 before/after Pyroscope profile

## 작성 전 확인 사항

- [ ] 변경 전 profile의 raw data, 조회 시간 범위, unit, selector, 대상 pod 수
- [x] 과거 profile 보존 여부 확인 — 허가된 endpoint들에 series 없음
- [x] 현재 after-only profile 수집 — 비교 효과가 아닌 경로 확인용
- [ ] 정량 benchmark 게재 시 당시 flag payload byte 크기와 flag 개수
- [x] JSON/YAML parser benchmark scaffold 추가
- [ ] 실제 payload 규모로 benchmark 10회 실행
- [ ] 내부 서비스명, PR 링크, profile 이미지의 외부 공개 가능 여부 확인
- [ ] 현재 공개 글인 `Feature Flag API의 p99 레이턴시 개선`과 중복 설명 최소화

## 기존 글과의 역할 분리

- `src/posts/feature-flag-latency/index.mdx`: mutex와 동기 I/O로 인한 p99/max latency 문제
- 이번 글: profiling을 통한 parser CPU 병목 발견과 retriever별 포맷 소유권 설계
