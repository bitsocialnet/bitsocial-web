# 스킬과 도구

공용 스킬은 `.agents/skills/`에 있습니다. 이 소스를 편집한 뒤 `yarn ai-workflow:sync`를 실행해 Claude Code용 `.claude/skills/`를 생성하세요. Codex와 Cursor는 `.agents/skills/`를 직접 인식하므로, 중복된 `.codex/skills/`나 `.cursor/skills/` 루트를 되살리지 마세요.

공용 역할 프롬프트는 `.agents/roles/*.md`에 있습니다. 이는 이 저장소 고유의 소스 형식이며, 네이티브 에이전트 탐색 경로가 아닙니다. `scripts/ai-workflow-files.mjs`가 이 소스를 아래의 앱별 파일로 변환하고, `yarn ai-workflow:sync`가 그 파일을 씁니다. 새로 체크아웃했을 때 생성기를 먼저 실행하지 않아도 네이티브 설정이 갖춰지도록, 생성된 파일을 소스와 함께 커밋하세요. 소스를 삭제했다면 더 이상 쓰이지 않는 생성 결과물도 명시적으로 삭제하세요. 검증기는 파일을 조용히 지우는 대신 그런 파일을 보고합니다.

## 네이티브 탐색 경로

2026-09-12에 공식 문서와 대조해 확인했습니다.

| 앱          | 프로젝트 지침                                                                        | 이 저장소가 사용하는 스킬               | 이 저장소가 사용하는 커스텀 에이전트 |
| ----------- | ------------------------------------------------------------------------------------ | --------------------------------------- | ------------------------------------ |
| Codex       | `AGENTS.md`                                                                          | `.agents/skills/<name>/SKILL.md`        | 생성된 `.codex/agents/<name>.toml`   |
| Cursor      | `AGENTS.md`. Cursor 전용 조건부 규칙에는 `.cursor/rules/*.mdc`도 계속 사용할 수 있음 | `.agents/skills/<name>/SKILL.md`        | 생성된 `.cursor/agents/<name>.md`    |
| Claude Code | `CLAUDE.md`가 `@AGENTS.md`를 임포트                                                  | 생성된 `.claude/skills/<name>/SKILL.md` | 생성된 `.claude/agents/<name>.md`    |

출처: [Codex 스킬](https://learn.chatgpt.com/docs/build-skills), [Codex 서브에이전트](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor 규칙](https://cursor.com/docs/rules), [Cursor 스킬](https://cursor.com/docs/skills), [Cursor 서브에이전트](https://cursor.com/docs/subagents), [Claude 메모리](https://code.claude.com/docs/en/memory), [Claude 스킬](https://code.claude.com/docs/en/skills), [Claude 서브에이전트](https://code.claude.com/docs/en/sub-agents).

네이티브 에이전트 디렉터리를 `.agents/roles`로 대체하거나, Claude가 `.agents/skills`를 인식한다고 가정하지 마세요. 다만 그 안의 파일이 참조되면 Claude는 이를 일반 프로젝트 컨텍스트로 읽을 수 있습니다. Cursor는 호환성을 위해 `.claude/skills`도 인식합니다. 사본은 동기화된 상태로 유지되지만, Cursor가 공개한 스킬 가이드는 이 루트들 사이의 중복 제거 여부를 명시하지 않습니다. 중복 항목이 나타날 수 없다고 장담하지 말고 설치된 앱의 스킬 카탈로그를 확인하세요.

AI 디렉터리는 `.gitattributes`를 통해 LF 줄 끝을 사용하므로, 생성된 텍스트가 플랫폼에 관계없이 동일하게 유지됩니다. 스킬의 보조 에셋은 바이트 그대로 복사됩니다.

## 스킬

| 스킬                                 | 목적                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| `commit`                             | 승인된 범위로 한정된 로컬 커밋 생성                                                |
| `commit-format`, `issue-format`      | 요청이 있을 때 제안 형식 지정                                                      |
| `make-closed-issue`                  | 승인된 이슈, 범위가 한정된 커밋과 PR 생성                                          |
| `review-and-merge-pr`                | PR 피드백을 분류하고, 요청된 범위 안에서만 수정/게시/병합                          |
| `fix-merge-conflicts`                | 충돌을 해결하고 병합된 결과 검증                                                   |
| `release`                            | 릴리스 문구를 준비하고 승인된 릴리스 단계 수행                                     |
| `code-quality-review`                | 사소하지 않은 diff나 명시적으로 요청된 품질 문제 검토                              |
| `retro`                              | 실제로 드러난 실수를 재발을 막는 집중 검사나 지침으로 전환                         |
| `refactor-pass`, `deslop`            | 기존 변경에 대해 요청된 정리 작업                                                  |
| `debug-agent`                        | 필요하면 계측을 곁들인 증거 기반 디버깅                                            |
| `you-might-not-need-an-effect`       | 이펙트/메모에 집중한 검토                                                          |
| `vercel-react-best-practices`        | 해당되는 React 성능 지침. 이 Vite 클라이언트에서는 Next.js/서버 전용 규칙을 건너뜀 |
| `translate`                          | 번역을 생성한 뒤 단일 작성자를 통해 맵 적용                                        |
| `playwright-cli`, `inspect-elements` | 브라우저 검증과 DOM-소스 매핑                                                      |
| `profile-browsing`                   | 범위가 한정된 브라우저 및 React 프로파일링                                         |
| `test-apk`                           | 제공된 Android 동반 래퍼 검증                                                      |
| `impeccable`, `improve-threejs`      | 범위가 한정된 인터페이스 디자인과 Three.js 렌더링 검토                             |
| `implement-plan`                     | 필요하면 제한된 위임을 활용해 계획 실행                                            |
| `readme`                             | 검증된 프로젝트 문서 유지 관리                                                     |
| `context7`                           | 버전에 맞는 라이브러리 문서 조회                                                   |
| `find-skills`                        | 명시적으로 요청받았을 때 추가 스킬 탐색                                            |

## 역할과 모델

`browser-check`, `profiler`, `test-apk`, `translator`, `reviewer` 커스텀 역할은 유지하세요. 일반적인 구현과 코드 탐색에는 하네스에 내장된 worker/general-purpose 또는 explorer 역할을 사용하세요. 부모가 수락 기준과 소유권을 할당하며, 무거운 검사는 소유자 한 명이 실행합니다.

Codex 에이전트 파일에는 `name`, `description`, `developer_instructions`가 들어 있습니다. `.codex/config.toml`은 `max_concurrent_threads_per_session`을 사용해 동시에 실행되는 자식 에이전트를 네 개로 제한합니다. 공용 역할 메타데이터에는 이름, 설명, 선택적인 샌드박스 모드가 들어 있으며, 모델 필드는 의도적으로 두지 않습니다.

세 앱 모두에서 커밋된 스킬과 커스텀 에이전트에는 모델 및 추론 관련 필드를 넣지 마세요. 그래야 각 앱이 문서화한 우선순위에 따라 런타임 호출 시의 선택, 사용자 기본값, 부모 상속이 적용됩니다. Claude 계열 별칭은 버전 관리 부담을 줄여 주지만 여전히 특정 계열을 고르는 것이고, 버전이 지정된 Cursor 모델은 나중에 갱신해야 합니다. 그런 선택이 필요하다면 사용자/세션 설정에 두세요. 상속이 현재 가장 좋은 모델을 자동으로 골라 준다는 보장은 없습니다. `latest` 별칭을 지어내거나 일상적인 작업에 모델 카탈로그 조사를 끼워 넣지 마세요. [Codex의 모델 선택](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Claude의 모델 선택](https://code.claude.com/docs/en/sub-agents#choose-a-model), [Cursor의 모델 선택](https://cursor.com/docs/subagents#model-configuration)을 참고하세요.

`sandbox-mode: read-only`는 Codex의 샌드박스와 Cursor의 `readonly`에 대응합니다. Claude의 경우 도구 목록과 역할 지침이 리뷰 워크플로를 제한하지만, Bash 접근은 OS 수준의 샌드박스가 아닙니다.

공용 스킬 프론트매터는 해당되는 경우 사용자가 직접 호출하는 워크플로에 `disable-model-invocation: true`를 사용합니다. 이에 대응하는 Codex 설정은 `agents/openai.yaml`의 `policy.allow_implicit_invocation: false`이며, 검증기는 두 설정을 모두 요구합니다. 호출 메타데이터는 명시적 권한 규칙을 보완할 뿐입니다. 스킬에 게시 단계가 들어 있다는 이유만으로 리뷰 요청이 게시를 허가하는 일은 결코 없습니다.

## 검사와 탐색

- `yarn ai-workflow:sync`는 설치된 `js-yaml`과 `smol-toml`을 사용해 호환용 출력물을 다시 생성합니다.
- `yarn ai-workflow:check`는 소스/프론트매터/설정을 파싱하고, 생성된 출력물, 호출 메타데이터, 모델 필드 위치, 포매터 전용 훅 연결을 검사합니다. 모델 식별자를 제공자 카탈로그와 대조해 확인하지는 않습니다.
- `yarn ai-workflow:test`는 훅 페이로드와 워크플로 생성/검증에 대한 격리된 Node 픽스처를 실행합니다.
- 에이전트 애플리케이션을 업그레이드한 뒤에는 해당 애플리케이션에서 스킬/역할이 제대로 인식되는지 확인하세요. 구문/일치 검사가 로더 검사를 대신하지는 못합니다. 기존 세션이 예전 카탈로그를 유지하고 있다면 애플리케이션을 다시 불러오세요.
- 훅을 쓰려면 하네스의 프로젝트 신뢰와 훅 검토를 거쳐야 합니다. 검사를 통과시키려고 신뢰를 우회하지 마세요. [hooks-setup.md](hooks-setup.md)를 참고하세요.

## 유용한 지침 유지하기

[OpenAI의 스킬 및 프롬프트 가이드](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)(2026-09-12 검토)를 따르세요. 설명은 정확하게 쓰고, 세부 내용은 관련 있을 때만 불러오고, 사용자가 요청한 범위를 지키세요. 공용 스킬은 여러 모델이 사용하므로, 프로젝트 고유의 불변 조건은 유지하되 일상적인 구현 선택은 모델에 맡기세요.

스킬의 목적, 판단 경계, 필수 제약은 `SKILL.md`에 두세요. 분량이 많은 모드별 명령이나 예시는 선택적인 참고 자료로 링크하세요. 짧은 설명의 앞부분에 트리거 조건을 두세요. 키워드가 일치한다는 이유만으로 작업 범위가 넓어져서는 안 됩니다. 동작을 의도적으로 바꾸려는 경우가 아니라면 기존 호출 메타데이터를 유지하세요.

지침을 크게 바꾼 뒤에는 대표적인 작은 요청과 큰 요청 몇 가지를 직접 시험해 보세요. 어떤 스킬/참고 자료가 선택되었는지, 작업이 범위 안에 머물렀는지, 검증이 변경 내용에 맞았는지, 승인된 작업이 완료되었는지 확인하세요. 스키마와 픽스처 테스트는 도구가 올바른지를 입증할 뿐, 에이전트의 판단 품질을 입증하지는 않습니다.

## 도구와 브라우저 소유권

기존 스킬/도구 카탈로그와 설치된 프로젝트 CLI를 우선 사용하세요. GitHub 작업에는 `gh`를, 브라우저 검증에는 `playwright-cli`를 사용하고, 라이브러리 동작이 중요할 때는 공식 문서나 버전별 문서를 참고하세요. 중복 스킬을 설치하거나, 기존 포매터를 실행하려고 버전이 고정되지 않은 패키지를 가져오는 일은 피하세요.

MCP 오버헤드는 하네스에 따라 다릅니다. 도구를 지연 로딩하면 모든 스키마를 처음부터 불러오지 않아도 됩니다. MCP 자체를 낡은 것으로 취급하지 말고 관련 있는 통합만 유지하세요. 기존의 CLI 선택은 재현성과 리소스 관리 측면에서 여전히 유용합니다.

모든 브라우저 세션은 `./scripts/pw-session.sh`를 사용하며, 이 스크립트는 머신 전체에서 활성 브라우저를 하나로 제한합니다. 기본적으로 새로운 격리 세션을 사용하세요. 현재 쓰고 있는 개인 브라우저에 접근하려면 명시적인 허가가 필요하며, 허가를 받았다면 이후 단계에서도 그 허가를 재사용하세요. 영향받는 동작에 맞게 브라우저/뷰포트를 고르고, 선택한 엔진을 순차적으로 실행하고, 정리 단계에서 이름이 지정된 바로 그 세션을 닫고, `close-all`/`kill-all`은 절대 사용하지 마세요. `playwright-cli` 스킬과 [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md)를 참고하세요.
