# バグ調査ワークフロー

特定のファイル/行/コード ブロックでバグが報告された場合にこれを使用します。

## 必須の最初のステップ

編集する前に、関連するコードの git 履歴を確認してください。以前の寄稿者がエッジ ケース/回避策の動作を導入している可能性があります。

## ワークフロー

1. ファイル/エリアの最近のコミット タイトル (タイトルのみ) をスキャンします:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. スコープ付きの差分を使用して関連するコミットのみを検査します:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. 履歴コンテキストを理解した後で再現を続行し、修正します。

## トラブルシューティング ルール

ブロックされている場合は、Web で最新の修正/回避策を検索してください。
