# Traductions

Le site about utilise des fichiers JSON i18next situés dans `about/public/translations/{lang}/default.json`. Les traductions des sources Docusaurus se trouvent à part, dans `docs/i18n/`.

## Clés du site about

Utilisez `.agents/skills/translate/SKILL.md`. Déterminez les locales actuelles à partir du disque, et préservez les placeholders, le balisage, les termes techniques et les noms de marque. Pour les demandes plus importantes, des agents enfants peuvent générer des dictionnaires indépendants, mais un seul parent applique en série toutes les écritures de locale ; l'outil de mise à jour n'a pas de verrou d'écriture.

Utilisez un chemin de dictionnaire unique, propre à la tâche. Prévisualisez avec `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, puis appliquez avec les mêmes arguments et `--write`. Vérifiez la couverture et les valeurs après l'écriture, et ne supprimez que les dictionnaires temporaires appartenant à cette tâche.

Utilisez `--delete` pour les suppressions demandées. Examinez les résultats de `--audit --dry` avant un `--audit --write` autorisé ; les clés de traduction dynamiques nécessitent une revue manuelle du code source. Ne copiez l'anglais dans toutes les locales que pour un terme technique, une marque ou un placeholder.

## Pages Docusaurus

`scripts/translate-docs.py` est un outil d'écriture en masse pour toutes les pages et toutes les locales, sans filtre par fichier ; ne l'utilisez pas pour une modification de traduction ciblée. `scripts/check-docs-translations.py` est le vérificateur en lecture seule et prend en charge `--locales` et `--paths`.

Gardez les blocs de code, les liens, le code inline, les adresses de contrat, les titres, les tableaux et les admonitions alignés sur la source anglaise. Corrigez les erreurs du vérificateur ; des avertissements `frontmatter-untranslated` dus à des noms de marque sont normaux. Suivez `docs/AGENTS.md` et lancez le build depuis la racine quand vous modifiez le thème ou le comportement i18n de la documentation, afin que la sortie statique et Pagefind restent alignés.

## Revue sémantique optionnelle

Pour certaines clés i18next, utilisez `scripts/jev/translation-README.md`. Pour les pages de documentation, lancez d'abord `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Cette commande exige une sélection explicite de locales/pages, exécute le vérificateur structurel et indique que la revue sémantique n'est pas vérifiée tant que l'inférence en direct n'est pas activée. N'ajoutez `--live` qu'avec l'autorisation de fournisseur et le budget prévus pour la tâche ; la configuration privée partagée de la machine fournit les identifiants et un modèle épinglé. Les variables d'environnement et `--model` peuvent remplacer cette configuration. La commande ne modifie jamais les traductions.

L'adaptateur de pages préserve le contexte de la page entière et limite chaque page à 24 Ko et chaque exécution à 30 paires. Pour les pages plus grandes, préparez des paires de paragraphes source/traduction explicitement alignées pour `translations.mjs --pairs` ; n'appariez pas automatiquement les paragraphes par indice. Les résultats sémantiques sont consultatifs : examinez les problèmes signalés et l'incertitude, et conservez les vérifications déterministes du code, des liens et des adresses.
