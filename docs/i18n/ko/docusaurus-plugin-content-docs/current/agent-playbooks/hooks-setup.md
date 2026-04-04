# 에이전트 후크 설정

AI 코딩 도우미가 수명 주기 후크를 지원하는 경우 이 저장소에 대해 이를 구성하세요.

## 권장 후크

| 후크            | 명령                                       | 목적                                                                                                                                               |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI 편집 후 파일 자동 포맷                                                                                                                          |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json`가 변경되면 `corepack yarn install` 실행                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | 오래된 참조 정리 및 통합된 임시 작업 분기 삭제                                                                                                     |
| `stop`          | `scripts/agent-hooks/verify.sh`            | 하드 게이트 빌드, Lint, 유형 확인 및 형식 확인; `yarn npm audit` 정보를 유지하고 종속성/가져오기가 변경될 때 `yarn knip`를 자문 감사로 별도로 실행 |

## 왜

- 일관적인 형식 지정
- Lockfile이 동기화 상태로 유지
- 빌드/린트/유형 문제가 조기에 발견됨
- 보안 가시성 `yarn npm audit`
- 종속성/가져오기 드리프트는 시끄러운 전역 중지 후크로 전환하지 않고 `yarn knip`를 사용하여 확인할 수 있습니다.
- Codex 및 Cursor 모두에 대한 단일 공유 후크 구현
- 임시 작업 분기는 저장소의 작업 트리 워크플로와 정렬됩니다

## 예제 후크 스크립트

### 형식 후크

```bash
#!/bin/bash
# AI 편집 후 JS/TS 파일 자동 포맷
# Hook은 file_path를 사용하여 stdin을 통해 JSON을 수신합니다.

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### 후크 확인

```bash
#!/bin/bash
# 에이전트가 완료되면 빌드, Lint, 유형 확인, 형식 확인 및 보안 감사를 실행합니다.

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

기본적으로 `scripts/agent-hooks/verify.sh`는 필수 검사가 실패할 경우 0이 아닌 값으로 종료됩니다. 후크를 막지 않고 의도적으로 부러진 나무의 신호가 필요한 경우에만 `AGENT_VERIFY_MODE=advisory`를 설정하십시오. 저장소가 권고 가져오기/종속성 문제로 인해 실패하기로 명시적으로 결정하지 않는 한 `yarn knip`를 하드 게이트에서 제외하세요.

### Yarn 설치 후크

```bash
#!/bin/bash
# package.json이 변경되면 corepack Yarn 설치를 실행하세요.
# Hook은 file_path를 사용하여 stdin을 통해 JSON을 수신합니다.

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

에이전트 도구 문서(`hooks.json`, 이에 상응하는 등)에 따라 후크 연결을 구성하세요.

이 저장소에서 `.codex/hooks/*.sh` 및 `.cursor/hooks/*.sh`는 `scripts/agent-hooks/` 아래의 공유 구현에 위임하는 씬 래퍼로 유지되어야 합니다.
