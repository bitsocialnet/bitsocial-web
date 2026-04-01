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
# Copy a key from English to all languages (dry run then write)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Delete a key from all languages
node scripts/update-translations.js --key obsolete_key --delete --write

# Audit for unused translation keys
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
