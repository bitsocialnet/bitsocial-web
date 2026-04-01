# 错误调查工作流程

当特定文件/行/代码块中报告错误时使用此选项。

## 强制第一步

在编辑之前，请检查相关代码的 git 历史记录。以前的贡献者可能已经引入了边缘案例/解决方法的行为。

## 工作流程

1. 扫描文件/区域的最近提交标题（仅标题）：

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. 仅检查具有范围差异的相关提交：

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. 了解历史背景后继续复制和修复。

## 故障排除规则

被阻止时，请在网络上搜索最新的修复/解决方法。
