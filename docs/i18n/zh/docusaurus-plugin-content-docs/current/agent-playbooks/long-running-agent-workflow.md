# 长时间运行的代理工作流程

当任务可能跨越多个会话、切换或派生代理时，请使用此剧本。

## 目标

- 为每次新的会话提供一种快速恢复上下文的方法
- 保持工作增量而不是一次性进行大的改变
- 在添加更多代码之前捕获损坏的本地基线
- 留下下一个会话可以信任的持久工件

## 在哪里保存状态

- 当人类、审核机器人或多个工具链需要相同的任务状态时，请使用`docs/agent-runs/<slug>/`。
- 仅当任务状态有意位于一个工作站或一个工具链的本地时，才使用工具本地目录，例如`.codex/runs/<slug>/`。
- 如果其他贡献者或代理稍后需要它，请勿将多会话共享状态隐藏在私有临时文件中。

## 所需文件

在长时间运行的任务开始时创建这些文件：

- `feature-list.json`
- `progress.md`

使用`docs/agent-playbooks/templates/feature-list.template.json` 和`docs/agent-playbooks/templates/progress.template.md` 中的模板。

优选使用 JSON 作为功能列表，以便代理可以更新少量字段，而无需重写整个文档。

## 会话开始清单

1. 运行`pwd`。
2. 阅读`progress.md`。
3. 阅读`feature-list.json`。
4. 运行`git log --oneline -20`。
5. 运行`./scripts/agent-init.sh --smoke`。
6. 准确选择一个最高优先级的项目，即`pending`、`in_progress` 或`blocked`。

如果烟雾步骤失败，请在实现新的功能切片之前修复损坏的基线。

## 会议规则

- 一次处理一项功能或一项任务。
- 保持功能列表机器可读且稳定。更新状态、注释、文件和验证字段，而不是重写不相关的项目。
- 仅在运行该项目中列出的命令或用户流程后才标记已验证的项目。
- 将生成的代理用于有界切片，而不是整体任务状态所有权。
- 当子代理拥有一项时，请为其提供准确的项目 ID、接受标准以及它可能涉及的文件。

## 会话结束清单

1. 将简短的进度条目附加到`progress.md`。
2. 更新`feature-list.json`中触摸的项目。
3. 记录运行的确切命令以供验证。
4. 捕获阻碍因素、后续行动以及下一个要恢复的最佳项目。

## 推荐的进度入口形状

使用简短的结构，例如：

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
