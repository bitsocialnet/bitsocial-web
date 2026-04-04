# Surprises connues

Ce fichier suit les points de confusion spécifiques au référentiel qui ont provoqué des erreurs d'agent.

## Critères d'entrée

Ajoutez une entrée uniquement si tous sont vrais :

- Il est spécifique à ce référentiel (pas de conseil générique).
- Il est probable que cela se reproduise pour les futurs agents.
- Il existe une atténuation concrète qui peut être suivie.

En cas de doute, demandez au développeur avant d'ajouter une entrée.

## Modèle d'entrée

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entrées

### Portless modifie l'URL canonique de l'application locale

- **Date :** 2026-03-18
- **Observé par :** Codex
- **Contexte :** Vérification du navigateur et flux de fumée
- **Ce qui était surprenant :** L'URL locale par défaut n'est pas le port Vite habituel. Le dépôt attend `http://bitsocial.localhost:1355` via Portless, donc vérifier `localhost:3000` ou `localhost:5173` peut toucher la mauvaise application ou rien du tout.
- **Impact :** Les vérifications du navigateur peuvent échouer ou valider la mauvaise cible même lorsque le serveur de développement est sain.
- **Atténuation :** Utilisez d'abord `http://bitsocial.localhost:1355`. Contournez-le uniquement avec `PORTLESS=0 corepack yarn start` lorsque vous avez explicitement besoin d'un port Vite direct.
- **Statut :** confirmé

### Les hooks de validation bloquent les validations non interactives

- **Date :** 2026-03-18
- **Observé par :** Codex
- **Contexte :** Workflows de validation pilotés par un agent
- **Ce qui était surprenant :** `git commit` déclenche Commitizen via Husky et attend une entrée TTY interactive, qui bloque les shells d'agent non interactifs.
- **Impact :** Les agents peuvent bloquer indéfiniment pendant ce qui devrait être une validation normale.
- **Atténuation :** Utilisez `git commit --no-verify -m "message"` pour les validations créées par l'agent. Les humains peuvent toujours utiliser `corepack yarn commit` ou `corepack yarn exec cz`.
- **Statut :** confirmé

### Corepack est requis pour éviter Yarn classic

- **Date :** 2026-03-19
- **Observé par :** Codex
- **Contexte :** Migration du gestionnaire de packages vers Yarn 4
- **Ce qui était surprenant :** La machine dispose toujours d'une installation classique globale de Yarn sur `PATH`, donc l'exécution de `yarn` peut être résolue en v1 au lieu de la version Yarn 4 épinglée.
- **Impact :** Les développeurs peuvent accidentellement contourner l'épinglage du gestionnaire de packages du dépôt et obtenir un comportement d'installation ou une sortie de fichier de verrouillage différent.
- **Atténuation :** Utilisez `corepack yarn ...` pour les commandes shell, ou exécutez d'abord `corepack enable` pour que `yarn` soit résolu en version Yarn 4 épinglée.
- **Statut :** confirmé

### Correction des noms d'applications sans port qui entrent en collision dans les arbres de travail Web Bitsocial

- **Date :** 2026-03-30
- **Observé par :** Codex
- **Contexte :** Démarrage de `yarn start` dans une arborescence de travail Web Bitsocial alors qu'une autre arborescence de travail était déjà diffusée via Portless
- **Ce qui était surprenant :** L'utilisation du nom littéral de l'application sans port `bitsocial` dans chaque arbre de travail provoque une collision de la route elle-même, même lorsque les ports de support sont différents, de sorte que le deuxième processus échoue car `bitsocial.localhost` est déjà enregistré.
- **Impact :** Les branches Web parallèles Bitsocial peuvent se bloquer même si Portless est censé les laisser coexister en toute sécurité.
- **Atténuation :** Conservez le démarrage sans port derrière `scripts/start-dev.mjs`, qui utilise désormais une route `*.bitsocial.localhost:1355` à portée de branche en dehors du cas canonique et revient à une route à portée de branche lorsque le nom nu `bitsocial.localhost` est déjà occupé.
- **Statut :** confirmé

### Aperçu de la documentation utilisé pour coder en dur le port 3001

- **Date :** 2026-03-30
- **Observé par :** Codex
- **Contexte :** Exécution de `yarn start` aux côtés d'autres dépôts et agents locaux
- **Ce qui était surprenant :** La commande de développement racine exécutait l'espace de travail de documentation avec `docusaurus start --port 3001`, de sorte que toute la session de développement échouait chaque fois qu'un autre processus possédait déjà `3001`, même si l'application principale utilisait déjà Portless.
- **Impact :** `yarn start` pourrait tuer le processus Web immédiatement après son démarrage, interrompant ainsi le travail local non lié en raison d'une collision entre le port et la documentation.
- **Atténuation :** Conservez le démarrage des documents derrière `yarn start:docs`, qui utilise désormais Portless plus `scripts/start-docs.mjs` pour honorer un port libre injecté ou revenir au prochain port disponible lorsqu'il est exécuté directement.
- **Statut :** confirmé
