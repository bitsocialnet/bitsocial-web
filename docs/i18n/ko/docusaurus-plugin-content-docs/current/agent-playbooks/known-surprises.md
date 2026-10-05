# 알려진 함정

이 문서는 에이전트가 실수하게 만든, 이 저장소 특유의 혼동 지점을 기록합니다.

## 등록 기준

다음이 모두 참일 때만 항목을 추가하세요.

- 이 저장소에만 해당하는 내용입니다(일반적인 조언이 아닙니다).
- 앞으로 다른 에이전트에게도 다시 발생할 가능성이 높습니다.
- 그대로 따라 할 수 있는 구체적인 완화 방법이 있습니다.

확실하지 않다면 항목을 추가하기 전에 개발자에게 문의하세요.

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

### Vercel 앱의 프로덕션 도메인이 Git master 배포로 되돌아갈 수 있음

- **날짜:** 2026-04-28
- **관찰자:** Tommaso + Codex
- **맥락:** Bitsocial Web 앱 디렉터리에서 Seedit과 5chan 앱 미러를 검증하던 중.
- **의외였던 점:** Vercel의 `seedit`, `5chan` 프로젝트에 `gitProviderOptions.createDeployments = "enabled"`가 걸려 있었습니다. 저장소 정책상 프로덕션 앱 미러는 릴리스 산출물만 제공해야 하는데도, GitHub `master` 푸시가 프로덕션 도메인으로 승격되고 있었습니다.
- **영향:** 프로덕션 도메인이 `about/src/lib/apps-data.ts`에 기록된 `index.html` 해시를 가진 GitHub 릴리스 ZIP 대신 최신 개발 커밋을 서빙하게 되므로, 앱 디렉터리의 미러 검증 배지가 사실과 달라질 수 있습니다.
- **완화 방법:** 미러 검증 메타데이터를 추가하거나 갱신하기 전에 `vercel api /v9/projects/<project-id>`로 Vercel 프로젝트를 조회해 `gitProviderOptions.createDeployments = "disabled"`인지 확인하세요. 릴리스 ZIP 내용은 `vercel deploy --prebuilt --prod`로 배포하고, 개발용 배포에는 `seedit-omega.vercel.app` 또는 `5chan-omega.vercel.app`을 사용하세요.
- **상태:** 확인됨

### 런처가 HTTPS를 강제하지 않으면 Portless 0.11이 예전 프록시 상태를 재사용함

- **날짜:** 2026-04-28
- **관찰자:** Tommaso + Codex
- **맥락:** 일반 `yarn start` 플로우를 기존 `http://bitsocial.localhost:1355` 프록시 URL에서 새 주소로 옮기던 작업. 새 주소는 `https://bitsocial.localhost`.
- **의외였던 점:** `portless@0.11.1`이 설치돼 있는데도 Portless가 기존 `~/.portless/proxy.port = 1355` HTTP 프록시를 그대로 재사용하면서 예전 `:1355` URL을 출력했습니다.
- **영향:** 패키지 버전과 문서를 갱신하는 것만으로는 충분하지 않습니다. 기여자의 머신에 예전 Portless 상태가 남아 있으면 `yarn start`가 여전히 옛 URL을 안내하고 실제로 사용할 수 있습니다.
- **완화 방법:** 시작 스크립트가 앱 라우트를 등록하기 전에 Portless HTTPS 프록시를 `443` 포트에서 명시적으로 띄우도록 유지하세요. 그래야 런타임 흐름이 남아 있는 `1355` 상태를 물려받지 않고 벗어납니다.
- **상태:** 확인됨

### Portless는 표준 로컬 앱 URL을 바꿉니다

- **날짜:** 2026-03-18
- **관찰자:** Codex
- **맥락:** 브라우저 검증과 스모크 플로우
- **의외였던 점:** 기본 로컬 URL은 흔히 쓰는 Vite 포트가 아닙니다. 이 저장소는 Portless를 거친 `https://bitsocial.localhost` 주소를 전제로 하므로, `localhost:3000`이나 `localhost:5173`을 확인하면 엉뚱한 앱에 접속하거나 아무것도 뜨지 않을 수 있습니다.
- **영향:** 개발 서버가 정상인데도 브라우저 검사가 실패하거나 엉뚱한 대상을 검증할 수 있습니다.
- **완화 방법:** 먼저 `https://bitsocial.localhost` 주소를 사용하세요. Vite 포트로 직접 접근해야 할 명확한 이유가 있을 때만 `PORTLESS=0 corepack yarn start`로 우회하세요.
- **상태:** 확인됨

### Commitizen 훅이 비대화형 커밋을 막습니다

- **날짜:** 2026-03-18
- **관찰자:** Codex
- **맥락:** 에이전트가 주도하는 커밋 워크플로
- **의외였던 점:** `git commit`은 Husky를 거쳐 Commitizen을 실행하고 대화형 TTY 입력을 기다리므로, 비대화형 에이전트 셸에서는 그대로 멈춥니다.
- **영향:** 평범한 커밋이어야 할 지점에서 에이전트가 무기한 대기 상태에 빠질 수 있습니다.
- **완화 방법:** 에이전트가 만드는 커밋에는 `git commit --no-verify -m "message"`를 사용하세요. 사람은 여전히 `corepack yarn commit`이나 `corepack yarn exec cz`를 쓸 수 있습니다.
- **상태:** 확인됨

### Yarn classic을 피하려면 Corepack이 필요합니다

- **날짜:** 2026-03-19
- **관찰자:** Codex
- **맥락:** Yarn 4로의 패키지 매니저 마이그레이션
- **의외였던 점:** 이 머신에는 여전히 전역 Yarn classic이 `PATH`에 설치돼 있어서, 그냥 `yarn`을 실행하면 고정된 Yarn 4 버전 대신 v1이 잡힐 수 있습니다.
- **영향:** 개발자가 저장소의 패키지 매니저 고정을 무심코 건너뛰고 다른 설치 동작이나 다른 lockfile 결과를 얻을 수 있습니다.
- **완화 방법:** 셸 명령에는 `corepack yarn ...`을 쓰거나, 먼저 `corepack enable`을 실행해 그냥 `yarn`이 고정된 Yarn 4 버전으로 잡히게 하세요.
- **상태:** 확인됨

### 고정된 Portless 앱 이름이 Bitsocial Web 워크트리끼리 충돌합니다

- **날짜:** 2026-03-30
- **관찰자:** Codex
- **맥락:** 다른 워크트리가 이미 Portless로 서비스 중인 상태에서 또 다른 Bitsocial Web 워크트리에서 `yarn start`를 실행
- **의외였던 점:** 모든 워크트리에서 Portless 앱 이름을 문자 그대로 `bitsocial`로 쓰면 뒤에 붙는 포트가 서로 달라도 라우트 자체가 충돌하므로, `bitsocial.localhost`가 이미 등록돼 있으면 두 번째 프로세스가 실패합니다.
- **영향:** Portless는 병렬 브랜치가 안전하게 공존하도록 해 주는 도구인데도, Bitsocial Web 브랜치들이 서로를 막을 수 있습니다.
- **완화 방법:** Portless 시작 로직을 `scripts/start-dev.mjs` 뒤에 두세요. 이 스크립트는 이제 표준 경우가 아닐 때 브랜치 단위 `*.bitsocial.localhost` 라우트를 쓰고, 기본 `bitsocial.localhost` 이름이 이미 점유돼 있으면 브랜치 단위 라우트로 넘어갑니다.
- **상태:** 확인됨

### 문서 미리보기가 예전에는 3001 포트를 하드코딩했습니다

- **날짜:** 2026-03-30
- **관찰자:** Codex
- **맥락:** 다른 로컬 저장소나 에이전트와 함께 `yarn start`를 실행
- **의외였던 점:** 루트 개발 명령이 문서 워크스페이스를 `docusaurus start --port 3001`로 실행했기 때문에, 메인 앱은 이미 Portless를 쓰는데도 다른 프로세스가 `3001`을 점유하고 있으면 개발 세션 전체가 실패했습니다.
- **영향:** `yarn start`가 방금 띄운 웹 프로세스를 곧바로 죽여서, 문서 포트 충돌 하나 때문에 무관한 로컬 작업까지 중단될 수 있었습니다.
- **완화 방법:** 문서 시작 로직을 `yarn start:docs` 뒤에 두세요. 이제 Portless와 `scripts/start-docs.mjs`를 사용해, 주입된 빈 포트를 존중하거나 직접 실행할 때는 다음으로 사용 가능한 포트로 넘어갑니다.
- **상태:** 확인됨

### 문서용 Portless 호스트명이 고정값으로 하드코딩돼 있었습니다

- **날짜:** 2026-04-03
- **관찰자:** Codex
- **맥락:** 다른 워크트리가 이미 Portless로 문서를 서비스 중인 상태에서 보조 Bitsocial Web 워크트리에서 `yarn start`를 실행
- **의외였던 점:** `start:docs`는 여전히 `docs.bitsocial.localhost` 호스트명을 문자 그대로 등록했습니다. about 앱은 자기 호스트명에 대한 Portless 라우트 충돌을 이미 피할 줄 알았는데도 `yarn start`가 실패할 수 있었습니다.
- **영향:** 문서 프로세스가 먼저 종료되고 `concurrently`가 나머지 세션을 죽였기 때문에, 병렬 워크트리에서는 루트 개발 명령을 안정적으로 쓸 수 없었습니다.
- **완화 방법:** 문서 시작 로직을 `scripts/start-docs.mjs` 뒤에 두세요. 이제 about 앱과 동일한 브랜치 단위 Portless 호스트명을 도출하고, 그 공유 공개 URL을 `/docs` 개발 프록시 대상으로 주입합니다.
- **상태:** 확인됨

### 워크트리 셸이 저장소에 고정된 Node 버전을 놓칠 수 있습니다

- **날짜:** 2026-04-03
- **관찰자:** Codex
- **맥락:** `.claude/worktrees/*` 같은 Git 워크트리나 형제 워크트리 체크아웃에서 `yarn start`를 실행
- **의외였던 점:** 저장소가 `.nvmrc`에 `22.12.0`을 고정해 두었는데도 일부 워크트리 셸에서 `node`와 `yarn node`가 Homebrew Node `25.2.1`로 잡혔고, 그 결과 `yarn start`가 잘못된 런타임에서 개발 런처를 조용히 실행할 수 있었습니다.
- **영향:** 메인 체크아웃과 워크트리 사이에서 개발 서버 동작이 달라져 버그 재현이 어려워지고, 저장소가 기대하는 Node 22 툴체인 규칙도 깨집니다.
- **완화 방법:** 개발 런처를 `scripts/start-dev.mjs`와 `scripts/start-docs.mjs` 뒤에 두세요. 두 스크립트는 이제 현재 셸의 버전이 다르면 `.nvmrc`의 Node 바이너리로 자신을 다시 실행합니다. 셸 설정 자체는 여전히 `nvm use`를 우선하는 편이 좋습니다.
- **상태:** 확인됨

### 리팩터링 이후 남은 `docs-site/` 잔여물이 빠진 문서 소스를 가릴 수 있습니다

- **날짜:** 2026-04-01
- **관찰자:** Codex
- **맥락:** Docusaurus 프로젝트를 `docs-site/`에서 `docs/`로 옮긴 뒤의 병합 후 모노레포 정리
- **의외였던 점:** 추적되는 저장소가 `docs/`로 옮겨간 뒤에도 예전 `docs-site/` 폴더가 `i18n/`처럼 오래됐지만 중요한 파일과 함께 디스크에 남아 있을 수 있습니다. 그러면 로컬에서는 리팩터링이 중복된 것처럼 보이고, 추적되던 문서 번역이 실제로는 `docs/`로 옮겨지지 않았다는 사실이 가려집니다.
- **영향:** 에이전트가 예전 폴더를 "쓸모없는 것"으로 판단해 지우면서 문서 번역의 유일한 로컬 사본을 잃거나, 죽은 `docs-site/` 경로를 여전히 가리키는 스크립트를 계속 손볼 수 있습니다.
- **완화 방법:** `docs/`를 유일한 표준 문서 프로젝트로 취급하세요. 로컬에 남은 `docs-site/` 잔여물을 지우기 전에 `docs/i18n/` 같은 추적 대상 소스를 복원하고, 스크립트와 훅이 `docs-site`를 더 이상 참조하지 않도록 갱신하세요.
- **상태:** 확인됨

### 다국어 문서 미리보기가 검증 중에 RAM을 크게 잡아먹을 수 있습니다

- **날짜:** 2026-04-01
- **관찰자:** Codex
- **맥락:** `yarn start:docs`와 Playwright로 문서 i18n, 로케일 라우팅, Pagefind 동작을 고치던 중
- **의외였던 점:** 이제 기본 문서 미리보기 모드는 서빙 전에 전체 다국어 문서 빌드와 Pagefind 인덱싱을 수행합니다. 그 프로세스를 여러 Playwright 또는 Chrome 세션과 함께 살려 두면 일반적인 Vite나 단일 로케일 Docusaurus 개발 루프보다 훨씬 많은 RAM을 소비할 수 있습니다.
- **영향:** 머신 메모리가 부족해지고 브라우저 세션이 죽을 수 있으며, 중단된 실행이 남긴 문서 서버나 헤드리스 브라우저가 계속 메모리를 소비할 수 있습니다.
- **완화 방법:** 로케일 라우트나 Pagefind 검증이 필요 없는 문서 작업에는 `DOCS_START_MODE=live yarn start:docs`를 사용하세요. 번역된 라우트나 Pagefind를 검증해야 할 때만 기본 다국어 미리보기를 쓰세요. Playwright 세션은 하나만 유지하고, 새 세션을 열기 전에 이전 세션을 닫고, 검증이 끝나 더 필요 없다면 문서 서버를 종료하세요.
- **상태:** 확인됨

### `translate-docs.py`가 문서 로케일을 반쯤 번역된 상태나 깨진 링크 대상으로 남길 수 있습니다

- **날짜:** 2026-04-06
- **관찰자:** Codex
- **맥락:** `yarn start:docs`가 영어 상세 페이지를 서빙하거나 로케일 출력 빌드에 실패한 뒤, 지역화된 문서 라우트와 콘텐츠를 고치던 중
- **의외였던 점:** 문서 번역 파이프라인에 이 저장소 특유의 실패 모드 두 가지가 동시에 있었습니다. `scripts/translate-docs.py`는 `tr(...)` 호출이 이 스크립트가 해석하지 못하는 형태일 때 `DocsHome` 메시지 중 일부만 추출했고, `docs/i18n/**` 아래의 번역된 마크다운에는 기계 번역된 슬러그나 `ZXQPLACEHOLDER` 잔재가 링크 대상 안에 들어 있을 수 있었습니다.
- **영향:** 지역화된 홈페이지가 조용히 영어로 되돌아가거나, 지역화된 상세 페이지가 번역되지 않은 것처럼 보이거나, 소스 문서가 멀쩡한데도 전체 `yarn docs:build`가 깨진 로케일 링크 때문에 실패할 수 있습니다.
- **완화 방법:** 문서 번역을 바꾸거나 로케일 파일을 다시 생성한 뒤에는 항상 저장소 루트에서 `yarn docs:build`를 실행하고, `docs/i18n/**` 마크다운에 `ZXQPLACEHOLDER`가 있는지 훑어보고, 번역된 링크가 여전히 `/apps/5chan/` 같은 표준 문서 슬러그를 가리키는지(번역된 URL 경로가 아닌지) 확인하세요. `DocsHome` 문구가 바뀌었다면 `scripts/translate-docs.py`가 여전히 모든 `docs.home.*` 메시지를 추출하는지 확인하세요.
- **상태:** 확인됨

### about 사이트의 no-JS 검사는 별도 SSR 미리보기가 아니라 Portless 라우트로 해야 합니다

- **날짜:** 2026-04-12
- **관찰자:** Codex
- **맥락:** 브랜치 워크트리에서 `about/` 사이트의 no-JS 지원을 검증하던 중
- **의외였던 점:** 별도 SSR 미리보기는 멀쩡해 보이는데도 실제 브랜치 단위 Portless 라우트는 여전히 잘못된 앱 셸이나 예전 프로세스를 서빙하고 있을 수 있습니다. 이 저장소에서 진짜 로컬 계약은 즉석에서 띄운 미리보기 서버가 아니라 `yarn start`가 만드는 Portless 호스트명입니다.
- **영향:** 에이전트가 no-JS 지원이 잘 동작한다고 잘못 주장하거나, `*.bitsocial.localhost`에서만 드러나는 회귀를 놓칠 수 있습니다.
- **완화 방법:** `about/` 브라우저 검증에서는 항상 `yarn start`나 `yarn start:about`으로 실제 로컬 서버를 띄우고 브랜치 단위 Portless URL을 먼저 확인하세요. Portless 호스트명이 오래된 것 같으면 다시 테스트하기 전에 예전 프로세스를 확인하고 종료하세요.
- **상태:** 확인됨

### `chain/`이 `yarn build:verify`와 `yarn doctor`에 잡히지 않았습니다

- **날짜:** 2026-07-05
- **관찰자:** Codex
- **맥락:** `chain/` 워크스페이스(`chain.bitsocial.net`용 독립 Vite 앱)를 모노레포에 추가한 뒤 chain 전용 diff를 검증하던 중.
- **의외였던 점:** `scripts/verify-build.mjs`는 `about/`, `docs/`, `stats/` 경로 접두사만 인식했습니다. 그래서 루트 `package.json`에 이미 `build:chain`이 있는데도 chain 전용 diff는 "No targeted build checks matched the current diff"만 출력하고 빌드를 전혀 실행하지 않았습니다. 별개로 `yarn doctor`는 `react-doctor about -y`로 하드코딩돼 있어서 `chain/src` 아래의 React 변경은 React Doctor 검사를 전혀 받지 못했습니다.
- **영향:** chain 변경을 검증하는 에이전트는 `yarn build:verify`를 믿는 대신 `yarn build:chain`을 직접 호출해야 한다는 사실을 알고 있어야 했고, `chain/src`의 React 문제(이펙트, 훅, 죽은 코드)는 `yarn doctor`에 전혀 잡히지 않았습니다.
- **완화 방법:** 이제 `scripts/verify-build.mjs`에는 `about/` 분기를 그대로 본뜬 `chain/` 분기가 있고, `doctor`와 `doctor:verbose`는 한 번의 호출로 `react-doctor --project about,chain -y`를 실행합니다. `doctor:score`는 `about` 전용으로 남습니다. `--score`를 프로젝트 두 개 이상과 함께 `--project`로 조합하면 아무것도 출력하지 않고 조용히 넘어가기 때문입니다. chain 점수가 필요하면 `yarn react-doctor --project about,chain --verbose -y`(또는 `--json`)를 사용하세요.
- **상태:** 확인됨

### 브라우저 P2P는 보안 WebSockets 위에서 동작하며, pkc-js는 WebRTC와 WebTransport를 기본적으로 거부합니다

- **날짜:** 2026-08-02
- **관찰자:** Claude
- **맥락:** Bitsocial 브라우저 P2P의 동작 방식을 설명하는 랜딩 페이지와 문서 문구를 쓰던 중
- **의외였던 점:** `@pkcprotocol/pkc-js`에는 브라우저에서 WebRTC와 WebTransport 다이얼을 거부하는 기본 연결 게이터가 들어 있습니다. `dist/browser/helia/dial-transport-filter.js`가 `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`를 내보냅니다. 소스 주석이 그 이유를 밝힙니다. 브라우저에서 이 전송 방식들은 길고 자주 실패하는 연결 수립 경로(STUN/ICE, certhash 교체)를 더해 로딩을 느리게 만드는 반면, WebSocket은 직접적이고 안정적이라는 것입니다. 블로그의 P2P 상태 패널에 나타나는 라이브 피어는 모두 "Secure WebSocket"으로 표시됩니다. 이 게이터는 `node_modules` 안에 있어서 저장소에는 아무런 단서도 없습니다.
- **영향:** 기술적으로 그럴듯하지만 사실이 아닌 공개 문구를 쓰기가 아주 쉽습니다. 예를 들어 2026년 3월 WebTransport가 브라우저 Baseline에 도달한 덕분에 Bitsocial 브라우저 P2P가 가능해졌다고 쓰는 식입니다. 그 주장은 개발자가 잡아내기 전까지 랜딩 페이지와 비교 표, 문서 두 페이지에 실제로 실렸습니다. 공개 페이지의 잘못된 아키텍처 주장은 이 사이트가 겨냥하는 바로 그 개발자 독자들이 검증합니다.
- **완화 방법:** libp2p나 브라우저 플랫폼이 원리적으로 지원하는 것을 근거로 Bitsocial이 어떤 전송 방식을 쓰는지 추론하지 마세요. 현재 거부 목록은 `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`에서 확인하고, `about/src/` 아래에 `connectionGater` 재정의가 없는지 확인하고, 공개적으로 어떤 주장을 하기 전에 블로그 "P2P status" 패널의 실제 전송 방식 라벨을 읽으세요. 브라우저 게시를 실제로 가능하게 한 업스트림 변경은 `@libp2p/gossipsub` 15.0.21(2026년 5월)의 gossipsub 단조 seqno 수정이며, pkc-js는 현재 16.0.4를 포함합니다.
- **상태:** 확인됨

### 번역되지 않은 문서 페이지의 상대 `./page.md` 링크가 모든 지역화 빌드를 깨뜨립니다

- **날짜:** 2026-08-02
- **관찰자:** Claude
- **맥락:** `./peer-to-peer-protocol.md`와 `./apps/5chan.md`로 기존 문서를 링크하는 영어 전용 신규 페이지 `docs/browser-p2p.md`를 추가하던 중
- **의외였던 점:** `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` 아래의 각 로케일은 문서 트리를 그대로 미러링합니다. 그 미러에 없는 새 페이지도 영어 폴백을 통해 모든 로케일에서 렌더링되지만, 그 페이지의 상대 마크다운 링크는 더 이상 해석되지 않습니다. Docusaurus는 `/ar/browser-p2p/peer-to-peer-protocol.md/`를 내보내고 "Docusaurus found broken links!"와 함께 빌드를 실패시킵니다. 결정적으로 `yarn build:verify`와 `yarn docs:build:verify`는 `en`만 빌드하므로 깔끔하게 통과합니다. 전체 `yarn docs:build`만 이 문제를 드러내며, 알파벳 순으로 첫 번째 로케일인 `ar`에서 중단됩니다.
- **영향:** 문서 변경이 모든 빠른 로컬 검사를 통과하고도 프로덕션 다국어 빌드를 깨뜨릴 수 있습니다. 오류 메시지가 작성자가 건드린 적 없는 로케일 경로를 지목하기 때문에 실패 자체가 변경과 무관해 보이기도 합니다.
- **완화 방법:** `docs/i18n/**`로 미러링되지 않는 문서 페이지에서는 상대 `.md` 링크 대신 루트 기준 링크(`/peer-to-peer-protocol/`, `/apps/5chan/`)를 사용하세요. Docusaurus가 로케일 접두사를 자동으로 붙여 줍니다. 기존 예시는 `docs/build-your-own-client.md`입니다. 문서 페이지를 추가하거나 링크하는 변경을 넘기기 전에 `build:verify`만이 아니라 전체 `yarn docs:build`를 실행하세요.
- **상태:** 확인됨

### 동시에 실행한 `update-translations.js`가 키를 조용히 잃어버립니다

- **날짜:** 2026-08-02
- **관찰자:** Claude
- **맥락:** `translate` 스킬로 번역된 i18next 키 26개를 36개 로케일 전체에 적용하던 중
- **의외였던 점:** 호출 한 번이 36개 로케일 파일 전체에 대한 읽기-수정-쓰기이므로, 두 호출이 동시에 돌면 서로를 덮어쓰고 키 하나가 아무 오류 없이 사라집니다. `translate` 스킬은 서브에이전트를 최대 4개까지 동시에 띄우라고 명시하는데, 그 서브에이전트들이 각각 이 스크립트를 호출하게 됩니다.
- **영향:** 조용히 실패합니다. 임의의 로케일에서 키가 사라지는데도 diff는 그럴듯해 보입니다.
- **완화 방법:** 번역 서브에이전트가 로케일 파일을 동시에 쓰게 두지 마세요. 서브에이전트는 딕셔너리 JSON 파일만 내보내게 하고, 부모 에이전트가 모든 키를 순차적으로 적용해야 합니다. 적용한 뒤에는 각 키가 영어를 제외한 35개 로케일 모두에 존재하는지, 그리고 어떤 값도 영어 원문과 바이트 단위로 동일하지 않은지 프로그램으로 검증하세요.
- **상태:** 확인됨
- **업데이트(2026-08-10):** 예전에는 이 스크립트가 대상 경로를 `path.join(process.cwd(), "public", "translations")`로도 계산했기 때문에, 문서에 적힌 저장소 루트 명령이 "Translations directory not found"로 실패했고 `about/`에서 실행해야 했습니다. 이제는 현재 디렉터리나 스크립트 자신의 위치를 기준으로 워크스페이스를 찾으므로 어디에서 실행해도 동작합니다. 위의 동시성 함정은 그대로입니다.

### 개발용 주석 도구 컨트롤이 자동화된 클릭을 가로챌 수 있습니다

- **맥락:** about 사이트와 chain 사이트에는 오른쪽 아래 구석에 고정된 컨트롤이 있는데, 개발 환경에서는 같은 위치에 Agentation 툴바도 나타납니다.
- **완화 방법:** `scripts/pw-session.sh open`은 페이지를 다시 불러오기 전에 `window.__NO_DEV_TOOLBAR__ = true`를 등록합니다. Agentation 초기화 코드는 `__VISUAL_TESTING__`과 `__PROFILING__`도 인식하며, 소스 검사 기능은 이와 별개로 계속 사용할 수 있습니다. 브라우저를 직접 자동화할 때는 애플리케이션을 불러오기 전에 같은 플래그를 설정해야 합니다.

### `skills add`가 Codex와 Cursor용 사본을 gitignore된 `.agents/` 디렉터리에 설치합니다

- **날짜:** 2026-08-18
- **관찰자:** Tommaso + Claude
- **맥락:** `skills` CLI(`vercel-labs/skills`)로 `millionco/react-doctor`의 `improve-threejs` 스킬을 설치하던 중.
- **의외였던 점:** `npx skills add <repo> --skill <name> --agent codex`와 `--agent cursor`는 둘 다 `.codex/skills/`나 `.cursor/skills/`가 아니라 `.agents/skills/<name>/`에 씁니다. `AGENTS.md`는 저장소 수준의 `.agents/` 디렉터리를 금지하고 `.gitignore:29`가 이 디렉터리를 무시하므로, 두 사본 모두 아무 경고 없이 추적 대상에서 빠집니다. 기대한 대로 `.claude/skills/`에 쓰는 것은 `--agent claude-code`뿐입니다. 이와 별개로, 문서에 나온 쉼표 구분 형식(`--agent claude-code,codex,cursor`)은 각 이름이 단독으로는 유효한데도 "Invalid agents"로 실패하고 아무것도 설치하지 않습니다.
- **영향:** 설치는 성공했다고 보고하지만 세 툴체인 사본 중 두 개는 결코 커밋되지 않을 위치에 놓이므로, 새로 클론하면 Codex와 Cursor에는 조용히 스킬이 빠져 있게 됩니다. 쉼표 형식은 성공처럼 보이지만 실제로는 아무것도 하지 않는 설치를 만들 수도 있습니다.
- **현재 완화 방법:** 이제 저장소는 `.agents/skills`를 표준 소스로 추적하고, `yarn ai-workflow:sync`로 Claude용 사본을 생성합니다. 예전의 `.agents` 금지 규칙과 무시 규칙은 제거되었습니다. 새 스킬을 서로 독립된 세 루트에 각각 복사하지 마세요. 스킬을 추가한 뒤에는 생성된 사본의 일치 여부와 앱 카탈로그를 확인하세요.
- **상태:** 확인됨
