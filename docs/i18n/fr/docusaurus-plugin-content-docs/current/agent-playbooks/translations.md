# Flux de travail de traduction

Ce projet utilise les fichiers de traduction i18next dans `public/translations/{lang}/default.json`.

## Règle

Ne modifiez pas manuellement chaque fichier de langue. Utilisez `scripts/update-translations.js`.

## Ajouter ou mettre à jour une clé

1. Créez un fichier de dictionnaire temporaire, par ex. `translations-temp.json` :

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. Appliquez la carte de traduction :

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. Supprimez le fichier de dictionnaire temporaire.

## Autres commandes utiles

```bash
# Copier une clé de l'anglais vers toutes les langues (essai puis écriture)
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# Supprimer une clé de toutes les langues
node scripts/update-translations.js --key obsolete_key --delete --write

# Audit des clés de traduction inutilisées
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
