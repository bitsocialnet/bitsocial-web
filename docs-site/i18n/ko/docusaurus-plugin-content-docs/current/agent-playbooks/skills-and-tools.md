# 기술 및 도구

기술 및 외부 도구를 설정/조정할 때 이 플레이북을 사용하세요.

## 권장 기술

### Context7(라이브러리 문서)

라이브러리의 최신 문서를 확인하세요.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Playwright CLI

브라우저 자동화를 위해 `playwright-cli`를 사용하세요 (탐색, 상호 작용, 스크린샷, 테스트, 추출).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

기술 설치 위치:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React 모범 사례

더 자세한 React/Next 성능 안내.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### 기술 찾기

개방형 생태계에서 기술 검색/설치.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP 정책 근거

GitHub MCP 및 브라우저 피하기 이 프로젝트의 MCP 서버는 상당한 도구 스키마/컨텍스트 오버헤드를 추가하기 때문입니다.

- GitHub 작업: `gh` CLI를 사용합니다.
- 브라우저 작업: `playwright-cli`를 사용합니다.
