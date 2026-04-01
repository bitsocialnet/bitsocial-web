# Fluxo de trabalho de traduções

Este projeto usa arquivos de tradução i18next em `public/translations/{lang}/default.json`.

## Regra

Não edite manualmente todos os arquivos de idioma. Utilize `scripts/update-translations.js`.

## Adicionar ou atualizar uma chave

1. Crie um arquivo de dicionário temporário, por exemplo. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Aplique o mapa de tradução:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Exclua o arquivo de dicionário temporário.

## Outros comandos úteis

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
