# 代理挂钩设置

如果您的 AI 编码助手支持生命周期挂钩，请为此存储库配置它们。

## 推荐挂钩

| 钩              | 命令                                       | 目的                                                                                                                       |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI 编辑后自动格式化文件                                                                                                    |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | 当`package.json`改变时运行`corepack yarn install`                                                                          |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | 修剪过时的引用并删除集成的临时任务分支                                                                                     |
| `stop`          | `scripts/agent-hooks/verify.sh`            | 硬门构建、lint、类型检查和格式检查；当依赖项/导入发生变化时，保留 `yarn npm audit` 信息并单独运行 `yarn knip` 作为咨询审核 |

## 为什么

- 格式一致
- 锁定文件保持同步
- 及早发现构建/lint/类型问题
- 通过`yarn npm audit` 实现安全可见性
- 可以使用 `yarn knip` 检查依赖项/导入漂移，而无需将其变成嘈杂的全局停止钩子
- Codex 和 Cursor 的一种共享钩子实现
- 临时任务分支与存储库的工作树工作流程保持一致

## 挂钩脚本示例

### 格式挂钩

```bash
#!/bin/bash
# AI编辑后自动格式化JS/TS文件
# Hook 通过 stdin 使用 file_path 接收 JSON

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### 验证挂钩

```bash
#!/bin/bash
# 代理完成后运行构建、lint、类型检查、格式检查和安全审核

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

默认情况下，当所需的检查失败时，`scripts/agent-hooks/verify.sh` 以非零值退出。仅当您有意需要来自损坏的树的信号而不阻塞钩子时才设置`AGENT_VERIFY_MODE=advisory`。将 `yarn knip` 排除在硬门之外，除非存储库明确决定在咨询导入/依赖问题上失败。

### 纱线安装钩

```bash
#!/bin/bash
# 当 package.json 更改时运行 corepack yarn install
# Hook 通过 stdin 使用 file_path 接收 JSON

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

根据您的代理工具文档（`hooks.json`、等效文件等）配置挂钩连接。

在此存储库中，`.codex/hooks/*.sh` 和`.cursor/hooks/*.sh` 应保留为瘦包装器，委托给`scripts/agent-hooks/` 下的共享实现。
