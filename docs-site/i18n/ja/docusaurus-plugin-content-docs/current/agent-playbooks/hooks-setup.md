# エージェント フックのセットアップ

AI コーディング アシスタントがライフサイクル フックをサポートしている場合は、このリポジトリに対してこれらを構成します。

## 推奨フック

| フック          | コマンド                                   | 目的                                                                                                                                                                                   |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | AI 編集後のファイルの自動フォーマット                                                                                                                                                  |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | `package.json` が変更されたときに `corepack yarn install` を実行します                                                                                                                 |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | 古い参照を削除し、統合された一時タスク ブランチを削除します                                                                                                                            |
| `stop`          | `scripts/agent-hooks/verify.sh`            | ハードゲートビルド、lint、タイプチェック、フォーマットチェック。 `yarn npm audit` の情報を保持し、依存関係/インポートが変更された場合は、勧告監査として `yarn knip` を個別に実行します |

## 理由

- 一貫したフォーマット
- ロックファイルの同期を維持
- ビルド/lint/type の問題を早期に検出
- セキュリティの可視性`yarn npm audit`
- 依存関係/インポート ドリフトは、ノイズの多いグローバル停止フックにならずに、`yarn knip` でチェックできます
- Codex と Cursor の両方に 1 つの共有フック実装
- 一時的なタスク ブランチはリポジトリのワークツリー ワークフローと連携した状態を維持します

## フックの例スクリプト

### フォーマット フック

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### 検証フック

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

デフォルトでは、必要なチェックが失敗した場合、`scripts/agent-hooks/verify.sh` はゼロ以外で終了します。 `AGENT_VERIFY_MODE=advisory` は、フックをブロックせずに壊れたツリーからの信号が意図的に必要な場合にのみ設定します。アドバイザリー インポート/依存関係の問題でリポジトリが明示的に失敗することを決定しない限り、`yarn knip` をハード ゲートに入れないでください。

### Yarn インストール フック

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

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

エージェント ツールのドキュメント (`hooks.json`、同等のものなど) に従ってフックの配線を構成します。

このリポジトリでは、`.codex/hooks/*.sh` と`.cursor/hooks/*.sh` は、`scripts/agent-hooks/` の下の共有実装に委任するシン ラッパーとして維持する必要があります。
