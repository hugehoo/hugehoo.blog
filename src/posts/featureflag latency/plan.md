## source docs
- /Users/limsunghoo/Documents/Obsidian Vault/blogging/featureflag-latency-investigation.md

## Context
- source docs 는 내가 몇번의 PR 작업을 거쳐 featureflag latency 를 개선한 경험을 작성한 문서야.
- `p99`, `max` latency 위주로 개선을 시도했어(p95 이하의 latency 는 미미한 수준이라 제외). 모든 내용이 적혀있진 않지만 첨부한 pr link 를 보면 어떤식으로 대응을 했는지 유추할 수 있어.
- datadog apm 링크도 첨부해뒀어. 현재 사용중인 피쳐플래그 evaluation api 의 6개월간 추이 변화를 확인할 수 있어. 내가 작성한 PR 의 배포 날짜와 latency 변화 추이를 비교하면서 어떤식으로 개선되는지 확인할 수 있어.
- 모든 PR 작업이 latency 개선에 유의미 하진 않았지만, apm latency 그래프를 보면 어떤 PR 이 유의미한 개선을 달성했는지 볼 수 있을거야.
- 글의 전체 톤은 작업 pr 을 적용하면서 latency 개선이 어떻게 이루어졌는지를 중점으로 작성하고 싶어.

## tools
- datadog mcp
- 그 외 claude code 가 필요하다고 느끼는 여러 tool 자체적으로 사용할 것.

## 플랜 품질 체크
- [X] 대상 독자 정의: feature flag 를 사용하는 개발자
- [X] 섹션별 핵심 포인트 + 예상 분량: 각 섹션별로 700~1000자
- [X] 사용할 코드 스니펫 목록 (파일 경로:라인): 소스 문서에 인라인으로 포함   
- [X] 도입/마무리 전략: 도입부는 featureflag latency 모니터링 중 p99, max latency 에서 과도하게 느려지는 경향을 파악하여 개선 작업 시도. 마무리는 여러 작업과 오픈소스 기여를 통해 문제를 해결할 수 있었다는 내용으로 정리. (그외에 너가 덧붙이면 좋을 것 같은 내용 있다면 추가 가능)
- [X] 비유/메타포 설계 (선택): claude code 가 알아서 해줘.
