# 代理钩子

已提交的生命周期钩子只做一件事：通过已安装的 oxfmt 格式化成功编辑过的 JavaScript/TypeScript 文件。共享逻辑位于 `scripts/agent-hooks/format.mjs`；每个原生包装器都委托给它。

| 应用 | 原生配置 | 事件 |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude 不会读取独立的 `.claude/hooks.json`。每个应用仍然自行控制项目信任以及是否启用钩子；请检查其当前设置，而不是绕过信任机制。`.codex/config.toml` 是仓库配置，不是钩子命令注册表。

格式化器会验证事件/载荷、编辑是否成功、文件扩展名，以及文件是否位于仓库之内（包括符号链接的情况）。缺少依赖或输入无关时，它什么都不做。命令以参数数组的形式执行，并禁用 Corepack 的网络访问；钩子不会安装依赖、运行构建/审查，也不会改动 Git。

请按照 [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) 显式运行检查。修改工作流之后，运行 `yarn ai-workflow:sync`、`yarn ai-workflow:check` 和 `yarn ai-workflow:test`。Fixture 使用一次性文件和伪造的格式化器调用；它们无法证明每个应用都加载了自己的配置。升级之后，请重新加载应用并检查它的清单。

Impeccable 设计技能及其可执行辅助程序仍可在 `.agents/skills/impeccable` 下按需使用。它以前的 Codex 钩子指向一个不存在的目录；现在设计工作流会在选中该技能时运行，不再有常驻的设计钩子。该技能不得把重新配置项目钩子当作顺带的设计步骤。
