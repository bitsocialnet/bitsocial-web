# 翻訳ワークフロー

このプロジェクトは、`public/translations/{lang}/default.json` の i18next 翻訳ファイルを使用します。

## ルール

すべての言語ファイルを手動で編集しないでください。 `scripts/update-translations.js` を使用します。

## キーを追加または更新します

1. 一時辞書ファイルを作成します。 `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. 変換マップを適用します:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. 一時辞書ファイルを削除します。

## その他の便利なコマンド

```bash
# 英語からすべての言語にキーをコピーします (予行実行してから書き込みます)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# すべての言語からキーを削除する
node scripts/update-translations.js --key obsolete_key --delete --write

# 未使用の変換キーを監査する
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
