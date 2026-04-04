# スキルとツール

スキルや外部ツールを設定/調整するときにこのプレイブックを使用します。

## 推奨スキル

### Context7 (ライブラリ ドキュメント)

ライブラリに関する最新のドキュメントについては。

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### プレイライト CLI

ブラウザの自動化には `playwright-cli` を使用します (ナビゲーション、インタラクション、スクリーンショット、テスト、抽出）。

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

スキルのインストール場所:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Vercel React のベスト プラクティス

React/Next のパフォーマンスに関する詳細なガイダンスについて。

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### スキルを見つける

オープン エコシステムからスキルを見つけてインストールします。

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## MCP ポリシーの根拠

GitHub MCP を回避するツール スキーマ/コンテキストのオーバーヘッドが大幅に増加するため、このプロジェクトの MCP サーバーとブラウザ MCP サーバーは使用できません。

- GitHub 操作: `gh` CLI を使用します。
- ブラウザ操作: `playwright-cli` を使用します。
