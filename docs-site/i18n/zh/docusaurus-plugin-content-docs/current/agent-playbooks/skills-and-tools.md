# 技能和工具

设置/调整技能和外部工具时使用此手册。

## 推荐技能

### Context7（库文档）

有关库的最新文档。

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### 剧作家 CLI

使用 `playwright-cli` 进行浏览器自动化（导航、交互、屏幕截图、测试、提取）。

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

技能安装位置：

- ZXQ占位符0ZXQ
- ZXQ占位符0ZXQ

### Vercel React 最佳实践

获取更深入的 React/Next 性能指导。

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### 寻找技能

从开放生态系统中发现/安装技能。

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP 政策理由

避免在此项目中使用 GitHub MCP 和浏览器 MCP 服务器，因为它们会增加大量的工具架构/上下文开销。

- GitHub操作：使用`gh` CLI。
- 浏览器操作：使用`playwright-cli`。
