# 버그 조사 작업흐름

특정 파일/라인/코드 블록에서 버그가 보고될 때 사용하세요.

## 필수 첫 번째 단계

편집 전, 해당 코드에 대한 git 히스토리를 확인하세요. 이전 기여자가 극단적인 경우/해결 방법에 대한 동작을 도입했을 수 있습니다.

## 워크플로

1. 파일/영역에 대한 최근 커밋 제목(제목만) 검색:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. 범위가 지정된 차이점이 있는 관련 커밋만 검사:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. 기록 컨텍스트를 이해한 후 재생산을 계속하고 수정합니다.

## 문제 해결 규칙

차단되면 웹에서 최근 수정 사항/해결 방법을 검색하세요.
