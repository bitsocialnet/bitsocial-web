# エージェントフック

コミットされているライフサイクルフックが行うのは、編集に成功した JavaScript/TypeScript ファイルを、インストール済みの oxfmt でフォーマットすることだけです。共通のロジックは `scripts/agent-hooks/format.mjs` にあり、各ネイティブラッパーはそこに処理を委譲します。

| アプリ | ネイティブの設定 | イベント |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude は単独の `.claude/hooks.json` を読み込みません。プロジェクトの信頼や、フックを有効にするかどうかは、引き続き各アプリが制御します。信頼の確認を回避するのではなく、アプリの現在の設定を確認してください。`.codex/config.toml` はリポジトリの設定であり、フックコマンドのレジストリではありません。

フォーマッターは、イベントとペイロード、編集の成否、ファイル拡張子、そしてシンボリックリンクも含めてファイルがリポジトリ内にあるかを検証します。依存関係が欠けている場合や、関係のない入力に対しては何もしません。コマンドは引数配列で実行され、Corepack のネットワークアクセスは無効化されています。フックは依存関係のインストール、ビルドやレビューの実行、Git の変更を行いません。

チェックは [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) に従って明示的に実行してください。ワークフローを変更した後は `yarn ai-workflow:sync`、`yarn ai-workflow:check`、`yarn ai-workflow:test` を実行します。フィクスチャは使い捨てのファイルと偽のフォーマッター呼び出しを使うため、各アプリが設定を読み込んだことまでは証明しません。アップグレード後はアプリを再読み込みし、カタログを確認してください。

Impeccable デザインスキルとその実行可能なヘルパーは、引き続き `.agents/skills/impeccable` 配下で必要に応じて利用できます。以前の Codex フックは存在しないディレクトリを指していました。現在、デザインのワークフローはそのスキルが選択されたときに実行され、常時有効なデザインフックはありません。このスキルは、デザイン作業のついでにプロジェクトのフックを設定し直してはいけません。
