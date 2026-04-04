# 알려진 놀라움

이 파일은 상담원의 실수를 야기한 저장소별 혼란 지점을 추적합니다.

## 입력 기준

모두 사실인 경우에만 항목을 추가하세요.

- 이 저장소에만 해당됩니다(일반적인 조언이 아님).
- 향후 상담원에게 반복될 가능성이 있습니다.
- 이에는 구체적인 완화 조치가 있습니다.

불확실한 경우 항목을 추가하기 전에 개발자에게 문의하세요.

## 항목 템플릿

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## 항목

### 포틀리스는 표준 로컬 앱 URL을 변경합니다

- **날짜:** 2026-03-18
- **관찰 대상:** Codex
- **컨텍스트:** 브라우저 확인 및 연기 flow
- **놀랐던 점:** 기본 로컬 URL은 일반적인 Vite 포트가 아닙니다. 저장소는 포트리스를 통해 `http://bitsocial.localhost:1355`를 예상하므로 `localhost:3000` 또는 `localhost:5173`를 확인하면 잘못된 앱이 실행되거나 전혀 실행되지 않을 수 있습니다.
- **영향:** 개발 서버가 정상인 경우에도 브라우저 확인이 실패하거나 잘못된 대상을 확인할 수 있습니다.
- **완화:** 사용 먼저 `http://bitsocial.localhost:1355`입니다. 명시적으로 직접 Vite 포트가 필요한 경우에만 `PORTLESS=0 corepack yarn start`를 사용하여 우회하세요.
- **상태:** 확인됨

### Commitizen 후크는 비대화형 커밋을 차단합니다

- **날짜:** 2026-03-18
- **관찰 대상:** Codex
- **Context:** 에이전트 기반 커밋 워크플로
- **놀라운 점:** `git commit`는 Husky를 통해 Commitizen을 트리거하고 기다립니다. 비대화형 에이전트 쉘을 중단시키는 대화형 TTY 입력의 경우.
- **영향:** 에이전트는 정상적인 커밋이 진행되는 동안 무기한으로 정지될 수 있습니다.
- **완화:** 에이전트가 생성한 커밋에는 `git commit --no-verify -m "message"`를 사용하세요. 인간은 여전히 `corepack yarn commit` 또는 `corepack yarn exec cz`를 사용할 수 있습니다.
- **상태:** 확인됨

### Yarn 클래식을 피하려면 Corepack이 필요합니다

- **날짜:** 2026-03-19
- **관찰 대상:** Codex
- **컨텍스트:** Yarn 4로 패키지 관리자 마이그레이션
- **놀라운 점:** 머신에는 여전히 전역 Yarn 클래식 설치가 있습니다. `PATH`에서 일반 `yarn`를 실행하면 고정된 Yarn 4 버전 대신 v1로 확인할 수 있습니다.
- **영향:** 개발자가 실수로 저장소의 패키지 관리자 고정을 우회하고 다른 설치 동작 또는 잠금 파일 출력을 얻을 수 있습니다.
- **완화:** 셸 명령에 `corepack yarn ...`를 사용하거나 `corepack enable`를 먼저 실행하면 일반 `yarn`가 고정된 Yarn 4 버전으로 확인됩니다.
- **상태:** 확인됨

### 수정된 포트리스 앱 이름이 Bitsocial 웹 작업 트리에서 충돌합니다

- **날짜:** 2026-03-30
- **관찰 대상:** Codex
- **컨텍스트:** 하나에서 `yarn start` 시작 다른 작업 트리가 이미 Portless를 통해 서비스를 제공하고 있는 동안 다른 작업 트리
- **놀라운 점:** 모든 작업 트리에서 리터럴 Portless 앱 이름 `bitsocial`를 사용하면 지원 포트가 다른 경우에도 경로 자체가 충돌하므로 `bitsocial.localhost`가 이미 등록되어 있으므로 두 번째 프로세스가 실패합니다.
- **영향:** 병렬 Bitsocial 웹 분기가 각 작업을 차단할 수 있습니다. Portless가 안전하게 공존할 수 있도록 하기 위한 것이지만
- **완화:** Portless 시작을 `scripts/start-dev.mjs` 뒤에 유지하세요. 이제 정식 케이스 외부의 분기 범위 `*.bitsocial.localhost:1355` 경로를 사용하고 기본 `bitsocial.localhost` 이름이 이미 사용 중일 때 분기 범위 경로로 대체됩니다.
- **상태:** 확인됨

### 문서 미리보기는 이전에 하드 코드 포트 3001

- **날짜:** 2026-03-30
- **관찰 대상:** Codex
- **컨텍스트:** 다른 로컬 저장소 및 에이전트와 함께 `yarn start` 실행
- **놀라운 점:** 루트 개발 명령은 `docusaurus start --port 3001`를 사용하여 문서 작업 공간을 실행했기 때문에 기본 앱이 이미 Portless를 사용했음에도 불구하고 다른 프로세스가 이미 `3001`를 소유할 때마다 전체 개발 세션이 실패했습니다.
- **영향:** `yarn start`는 부팅 후 즉시 웹 프로세스를 종료하여 문서 포트를 통해 관련 없는 로컬 작업을 중단할 수 있습니다. 충돌.
- **완화:** 문서 시작을 `yarn start:docs` 뒤에 유지하세요. 이제 포트리스와 `scripts/start-docs.mjs`를 사용하여 주입된 여유 포트를 존중하거나 직접 실행 시 사용 가능한 다음 포트로 폴백합니다.
- **상태:** 확인됨
