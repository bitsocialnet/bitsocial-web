# 장기 실행 에이전트 워크플로우

작업이 여러 세션, 핸드오프 또는 생성된 에이전트에 걸쳐 있을 가능성이 있는 경우 이 플레이북을 사용하십시오.

## 목표

- 각 새로운 세션에 컨텍스트를 다시 얻을 수 있는 빠른 방법 제공
- 대규모 변경을 일회성으로 처리하는 대신 점진적으로 작업 유지
- 더 많은 코드를 추가하기 전에 손상된 로컬 기준선 파악
- 나가기 다음 세션이 신뢰할 수 있는 내구성 있는 아티팩트

## 상태를 유지할 위치

- 사람, 검토 봇 또는 여러 툴체인에 동일한 작업 상태가 필요한 경우 `docs/agent-runs/<slug>/`를 사용하세요.
- 작업 상태가 의도적으로 하나의 워크스테이션이나 하나의 툴체인에 로컬인 경우에만 `.codex/runs/<slug>/`와 같은 도구 로컬 디렉터리를 사용하세요.
- 숨기지 마세요 나중에 다른 기여자나 에이전트가 필요할 경우 개인 스크래치 파일에 다중 세션 공유 상태를 저장하세요.

## 필수 파일

장기 실행 작업 시작 시 다음 파일을 생성하세요.

- `feature-list.json`
- `progress.md`

`docs/agent-playbooks/templates/feature-list.template.json`의 템플릿을 사용하고 `docs/agent-playbooks/templates/progress.template.md`.

상담원이 전체 문서를 다시 작성하지 않고도 소수의 필드를 업데이트할 수 있도록 기능 목록으로 JSON을 선호합니다.

## 세션 시작 체크리스트

1. `pwd`를 실행합니다.
2. `progress.md`를 읽습니다.
3. `feature-list.json`를 읽습니다.
4. `git log --oneline -20`를 실행합니다.
5. `./scripts/agent-init.sh --smoke`를 실행합니다.
6. 정확히 하나만 선택하세요. 여전히 `pending`, `in_progress` 또는 `blocked`인 가장 높은 우선순위 항목.

연기 단계가 실패하면 새 기능 슬라이스를 구현하기 전에 손상된 기준선을 수정하십시오.

## 세션 규칙

- 한 번에 하나의 기능 또는 작업 슬라이스에 대해 작업하십시오.
- 유지 기능 목록은 기계가 읽을 수 있고 안정적입니다. 관련 없는 항목을 다시 작성하는 대신 상태, 메모, 파일 및 확인 필드를 업데이트하세요.
- 해당 항목에 나열된 명령이나 사용자 흐름을 실행한 후에만 확인된 항목을 표시하세요.
- 전체 작업 상태 소유권이 아닌 제한된 조각에 대해 생성된 에이전트를 사용하세요.
- 하위 에이전트가 하나의 항목을 소유하는 경우 정확한 항목 ID, 허용 기준 및 해당 항목이 접촉할 수 있는 파일을 제공하세요.

## 세션 종료 체크리스트

1. `progress.md`에 짧은 진행 항목을 추가합니다.
2. `feature-list.json`에서 터치한 항목을 업데이트합니다.
3. 확인을 위해 실행된 정확한 명령을 기록합니다.
4. 차단 항목, 후속 조치 및 재개할 차선책 항목을 캡처합니다.

## 권장 진행 항목 Shape

다음과 같은 짧은 구조를 사용하세요.

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
