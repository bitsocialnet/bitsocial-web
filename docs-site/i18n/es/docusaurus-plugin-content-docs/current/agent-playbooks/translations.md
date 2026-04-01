# Flujo de trabajo de traducciones

Este proyecto utiliza archivos de traducción i18next en `public/translations/{lang}/default.json`.

## regla

No edite manualmente todos los archivos de idioma. Utilice `scripts/update-translations.js`.

## Agregar o actualizar una clave

1. Cree un archivo de diccionario temporal, p. `translations-temp.json`:

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Aplicar el mapa de traducción:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Elimine el archivo de diccionario temporal.

## Otros comandos útiles

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
