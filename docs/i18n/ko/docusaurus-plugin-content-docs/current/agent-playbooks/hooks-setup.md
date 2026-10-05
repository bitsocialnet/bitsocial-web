# 에이전트 훅

커밋된 라이프사이클 훅은 성공적으로 편집된 JavaScript/TypeScript 파일을 설치된 oxfmt로 포맷하는 일만 합니다. 공용 로직은 `scripts/agent-hooks/format.mjs`에 있고, 각 네이티브 래퍼는 이 로직에 위임합니다.

| 앱 | 네이티브 설정 | 이벤트 |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude는 독립된 `.claude/hooks.json`을 읽지 않습니다. 프로젝트 신뢰 여부와 훅 활성화 여부는 여전히 각 앱이 제어합니다. 신뢰 설정을 우회하지 말고 해당 앱의 현재 설정을 확인하세요. `.codex/config.toml`은 저장소 설정이지 훅 명령 레지스트리가 아닙니다.

포매터는 이벤트/페이로드, 편집 성공 여부, 파일 확장자, 그리고 심볼릭 링크까지 포함해 파일이 저장소 안에 있는지를 검증합니다. 의존성이 없거나 관련 없는 입력이면 아무 작업도 하지 않습니다. 명령은 Corepack 네트워크 접근을 끈 상태에서 인수 배열로 실행됩니다. 훅은 의존성을 설치하거나, 빌드/리뷰를 실행하거나, Git 상태를 변경하지 않습니다.

검사는 [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md)에 따라 명시적으로 실행하세요. 워크플로를 바꾼 뒤에는 `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`를 실행하세요. 픽스처는 일회용 파일과 가짜 포매터 호출을 사용하므로, 각 앱이 실제로 설정을 불러왔는지는 증명하지 못합니다. 앱을 업그레이드한 뒤에는 앱을 다시 불러오고 카탈로그를 확인하세요.

Impeccable 디자인 스킬과 그 실행 가능한 헬퍼는 `.agents/skills/impeccable` 아래에서 필요할 때 계속 사용할 수 있습니다. 예전 Codex 훅은 존재하지 않는 디렉터리를 가리키고 있었습니다. 이제 디자인 워크플로는 해당 스킬이 선택될 때 실행되며, 항상 켜져 있는 디자인 훅은 없습니다. 이 스킬은 디자인 작업의 부수적인 단계로 프로젝트 훅을 재구성해서는 안 됩니다.
