# JSON인데 YAML로 파싱하고 있었다 — 집필 계획

## 목표

Pyroscope에서 `gopkg.in/yaml.yaml_parser_state_machine`이 높은 CPU 비중을 차지하는 것을 발견한 뒤, 서비스에서는 `FileFormat: "json"` 한 줄로 우선 해결하고 go-feature-flag에는 `FormatHinter`를 기여하기까지의 과정을 정리한다.

글의 중심은 단순한 설정 변경이 아니라 다음 문제 해결 흐름이다.

```text
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

### 내부 자료

- 원본 분석 노트: `/Users/imseonghu/projects/obsidian-valut/blogging/2026-05-19-featureflag-fileformat-json-yaml-parsing.md`
- Pyroscope/pprof 도입: https://github.com/Buzzvil/buzzscreen-api/pull/6698
- 서비스의 JSON FileFormat 적용: https://github.com/Buzzvil/buzzscreen-api/pull/6732
- 당시 서비스 설정: `../buzzscreen-api/components/featureflag/featureflag.go`
- 당시 의존성: go-feature-flag `v1.41.3`

### 업스트림 자료

- 문제 제기: https://github.com/thomaspoignant/go-feature-flag/issues/5321
- FormatHinter 구현: https://github.com/thomaspoignant/go-feature-flag/pull/5322
- YAML 1.2.2 명세: https://yaml.org/spec/1.2.2/
- go-yaml v3 Decode 구현: https://github.com/go-yaml/yaml/blob/v3/yaml.go
- Go encoding/json 문서: https://pkg.go.dev/encoding/json

## 확인된 사실

- Pyroscope의 특정 조회 구간에서 `gopkg.in/yaml.yaml_parser_state_machine`이 약 630M CPU cycles, 전체의 약 4%로 관측됐다.
- Redis retriever는 조회 결과를 `json.Marshal`하여 JSON bytes로 반환했다.
- go-feature-flag v1.41.3은 `FileFormat`이 비어 있으면 YAML parser를 사용했다.
- 서비스는 Redis retriever를 60초 간격으로 polling했다.
- 내부 PR #6732는 `FileFormat: "json"` 한 줄을 추가했다.
- prodmini에서 기존 동작과 일치하는 것을 확인했고 기존 테스트는 실패 없이 통과했다.
- 업스트림 PR #5322는 Redis, MongoDB, PostgreSQL retriever가 JSON을 반환한다고 선언할 수 있도록 optional `FormatHinter`를 추가했다.
- 업스트림 PR은 2026-05-28 머지됐다.
- 현재 buzzscreen-api에는 명시적인 `FileFormat: "json"` 설정이 남아 있으며, 업스트림 변경을 포함한 버전으로 전환했다는 근거는 없다.

## 표현 가드레일

### 반드시 구분할 것

- 변경 전 profile에서 YAML parser가 전체 cycle의 약 4%를 차지했다: 측정된 사실
- 변경 후 서비스 CPU가 정확히 4% 감소했다: 사후 자료가 없으면 단정할 수 없음
- 안전한 표현: “전체 CPU cycle의 약 4%를 차지하던 YAML parsing 경로를 제거했다.”

### 피해야 할 표현

- “매 Feature Flag evaluation 요청마다 YAML을 파싱했다.”
  - 실제 파싱은 60초 polling으로 Redis 데이터를 읽어 로컬 캐시를 갱신하는 경로에서 발생했다.
- “JSON parser는 상태 머신을 사용하지 않는다.”
  - JSON parser도 scanning 상태를 관리한다. YAML이 더 풍부한 문법과 중간 표현을 처리한다고 설명한다.
- “JSON은 1단계, YAML은 항상 3단계다.”
  - 이해를 위한 단순화임을 밝히거나 bytes → parse/node → decode 수준으로 표현한다.
- “YAML은 항상 JSON보다 2~3배 느리다.”
  - 동일 payload benchmark를 추가하지 않는다면 일반적인 경향이나 이번 profile의 관측으로 제한한다.
- “630M cycles가 200~300M cycles로 줄었다.”
  - 변경 후 profile이나 benchmark가 확보된 경우에만 사용한다.
- “go-feature-flag는 원래 파일 기반 전용으로 설계됐다.”
  - 공식 근거가 없으므로, YAML 기본값은 파일 기반 retriever에는 합리적이었다는 수준으로 서술한다.

## 상세 목차

### 1. 630M CPU cycle을 사용하던 낯선 함수

- Pyroscope flame graph에서 `yaml_parser_state_machine` 발견
- 해당 profile 구간에서 약 630M cycles, 전체 약 4%
- 우리는 Redis와 JSON을 사용하는데 YAML 함수가 등장한 이유를 질문으로 제시
- 며칠 전 PR #6698을 통해 Pyroscope CPU profile 수집을 가능하게 했다는 배경을 한 문단으로 설명

시각 자료:

- 변경 전 Pyroscope flame graph
- 공개가 어려우면 서비스명과 전체 수치는 가리고 함수명과 상대 비중만 노출

### 2. YAML parser까지 호출 경로를 따라가 보기

```text
Redis Hash
    ↓
Redis Retriever
    ↓ json.Marshal
JSON bytes
    ↓ global FileFormat (empty)
yaml.Unmarshal
    ↓
Feature Flag DTO
```

- Redis retriever의 `json.Marshal`
- 전역 `FileFormat`이 모든 retriever 결과에 적용되는 구조
- 빈 값은 YAML default 분기로 이동
- 60초 polling 시 로컬 캐시 갱신 경로에서 실행된다는 점 명시

코드 스니펫:

- buzzscreen-api의 `ffclient.Config`
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

- 내부 PR #6732의 실제 변경은 한 줄
- JSON bytes가 `json.Unmarshal` 분기로 직접 전달됨
- prodmini 동작 확인 및 기존 테스트 회귀 확인
- 해결 코드의 크기와 원인 분석의 크기는 비례하지 않는다는 메시지

소제목/문장 후보:

> 해결은 한 줄이었지만 원인은 한 줄에서 보이지 않았다.

### 6. 4%를 줄였다고 말해도 될까

- before profile에서 확인한 사실과 after 효과를 분리
- 사후 profile이 있으면 동일 시간 범위, 대상 pod 수, payload/트래픽 조건을 기재
- 사후 자료가 없으면 YAML parsing 경로 제거까지만 결론

### 7. 이 한 줄을 라이브러리의 기본값으로 만들 수 없는 이유

- buzzscreen-api는 Redis만 사용하므로 전역 JSON 설정으로 해결 가능
- 라이브러리는 Redis/MongoDB/PostgreSQL 외에 File/HTTP/S3/GitHub 등 원본 포맷을 전달하는 retriever도 지원
- YAML default를 JSON으로 바꾸면 기존 사용자 호환성을 깨뜨릴 수 있음
- manager에서 구체 타입을 검사하면 결합도가 증가
- 하나의 전역 FileFormat이 서로 다른 retriever 결과에 적용되는 것이 구조적 한계

시각 자료:

| Retriever | 반환 포맷 특성 | 전역 JSON 강제 가능 여부 |
|---|---|---|
| Redis/MongoDB/PostgreSQL | 항상 JSON | 가능 |
| File/HTTP/S3/GitHub 등 | 사용자의 원본 포맷 | 불가능 |

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
- Redis/MongoDB/PostgreSQL의 JSON 선언 검증
- “메서드가 문자열을 반환한다”보다 manager가 실제로 올바른 parser를 선택하는지 설명

### 10. 서비스의 한 줄에서 오픈소스 설계까지

타임라인:

1. 2026-05-15: Pyroscope 수집 환경 구축
2. 2026-05-19: 내부 서비스에 JSON FileFormat 명시
3. 2026-05-23: 업스트림 Issue #5321과 PR #5322 작성
4. 2026-05-28: `FormatHinter` 변경 머지

마무리 교훈:

- 관측 가능성이 기능적으로 정상인 성능 낭비를 발견하게 했다.
- 내부 workaround를 그대로 업스트림 해법으로 복사하지 않고 문제를 일반화해야 했다.
- 데이터에 대한 정보는 그 데이터를 생산하는 컴포넌트가 소유하는 편이 자연스럽다.

마지막 문장 후보:

> 프로덕션에서 발견한 한 줄짜리 설정 누락은, 결국 라이브러리에서 데이터 포맷의 책임을 어디에 둘 것인가라는 설계 문제로 이어졌다.

## 필요한 시각 자료

- [ ] 변경 전 Pyroscope flame graph
- [ ] 변경 전 데이터 흐름 다이어그램
- [ ] 변경 후 데이터 흐름 다이어그램
- [ ] retriever별 반환 포맷 비교표
- [ ] 내부 workaround와 업스트림 해결 비교
- [ ] 가능하다면 변경 후 동일 조건 Pyroscope profile

## 작성 전 확인 사항

- [ ] 변경 전 profile의 조회 시간 범위와 대상 pod 수
- [ ] 변경 후 동일 조건 profile 존재 여부
- [ ] 당시 flag payload 크기 또는 flag 개수
- [ ] JSON/YAML 성능 비교를 넣을 경우 재현 가능한 benchmark 추가
- [ ] 내부 서비스명, PR 링크, profile 이미지의 외부 공개 가능 여부 확인
- [ ] 현재 공개 글인 `Feature Flag API의 p99 레이턴시 개선`과 중복 설명 최소화

## 기존 글과의 역할 분리

- `src/posts/feature-flag-latency/index.mdx`: mutex와 동기 I/O로 인한 p99/max latency 문제
- 이번 글: profiling을 통한 parser CPU 병목 발견과 retriever별 포맷 소유권 설계
