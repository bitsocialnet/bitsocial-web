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
- **Ce qui était surprenant :** L'URL locale par défaut n'est pas le port Vite habituel. Le dépôt attend `https://bitsocial.localhost` via Portless, donc vérifier `localhost:3000` ou `localhost:5173` peut toucher la mauvaise application ou rien du tout.
- **Impact :** Les vérifications du navigateur peuvent échouer ou valider la mauvaise cible même lorsque le serveur de développement est sain.
- **Atténuation :** Utilisez d'abord `https://bitsocial.localhost`. Contournez-le uniquement avec `PORTLESS=0 corepack yarn start` lorsque vous avez explicitement besoin d'un port Vite direct.
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
- **Atténuation :** Conservez le démarrage sans port derrière `scripts/start-dev.mjs`, qui utilise désormais une route `*.bitsocial.localhost` à portée de branche en dehors du cas canonique et revient à une route à portée de branche lorsque le nom nu `bitsocial.localhost` est déjà occupé.
- **Statut :** confirmé

### Aperçu de la documentation utilisé pour coder en dur le port 3001

- **Date :** 2026-03-30
- **Observé par :** Codex
- **Contexte :** Exécution de `yarn start` aux côtés d'autres dépôts et agents locaux
- **Ce qui était surprenant :** La commande de développement racine exécutait l'espace de travail de documentation avec `docusaurus start --port 3001`, de sorte que toute la session de développement échouait chaque fois qu'un autre processus possédait déjà `3001`, même si l'application principale utilisait déjà Portless.
- **Impact :** `yarn start` pourrait tuer le processus Web immédiatement après son démarrage, interrompant ainsi le travail local non lié en raison d'une collision entre le port et la documentation.
- **Atténuation :** Conservez le démarrage des documents derrière `yarn start:docs`, qui utilise désormais Portless plus `scripts/start-docs.mjs` pour honorer un port libre injecté ou revenir au prochain port disponible lorsqu'il est exécuté directement.
- **Statut :** confirmé

### Correction du nom d'hôte sans port de la documentation codé en dur

- **Date :** 2026-04-03
- **Observé par :** Codex
- **Contexte :** Exécution de `yarn start` dans une arborescence de travail Web Bitsocial secondaire alors qu'une autre arborescence de travail diffusait déjà des documents via Portless
- **Ce qui était surprenant :** `start:docs` enregistrait toujours le nom d'hôte littéral `docs.bitsocial.localhost`, donc `yarn start` pouvait échouer même si l'application à propos savait déjà comment éviter les collisions de routes sans port pour son propre nom d'hôte.
- **Impact :** Les arbres de travail parallèles n'ont pas pu utiliser de manière fiable la commande root dev, car le processus de documentation s'est arrêté en premier et `concurrently` a ensuite interrompu le reste de la session.
- **Atténuation :** Conservez le démarrage des documents derrière `scripts/start-docs.mjs`, qui dérive désormais le même nom d'hôte sans port de portée de branche que l'application À propos et injecte cette URL publique partagée dans la cible du proxy de développement `/docs`.
- **Statut :** confirmé

### Les shells Worktree peuvent manquer la version Node épinglée du dépôt

- **Date :** 2026-04-03
- **Observé par :** Codex
- **Contexte :** Exécution de `yarn start` dans des arbres de travail Git tels que `.claude/worktrees/*` ou des extractions d'arbres de travail frères
- **Ce qui était surprenant :** Certains shells d'arbre de travail ont résolu `node` et `yarn node` en nœud Homebrew `25.2.1` même si le dépôt épingle `22.12.0` dans `.nvmrc`, afin que `yarn start` puisse exécuter silencieusement les lanceurs de développement sous le mauvais moteur d'exécution.
- **Impact :** Le comportement du serveur de développement peut dériver entre la caisse principale et les arbres de travail, rendant les bogues difficiles à reproduire et violant la chaîne d'outils Node 22 attendue du dépôt.
- **Atténuation :** Conservez les lanceurs de développement derrière `scripts/start-dev.mjs` et `scripts/start-docs.mjs`, qui se réexécutent désormais sous le binaire `.nvmrc` Node lorsque le shell actuel est sur la mauvaise version. La configuration du shell devrait toujours préférer `nvm use`.
- **Statut :** confirmé

### Les restes de `docs-site/` peuvent masquer la source des documents manquants après le refactor

- **Date :** 2026-04-01
- **Observé par :** Codex
- **Contexte :** Nettoyage du monorepo après la fusion après le déplacement du projet Docusaurus de `docs-site/` vers `docs/`
- **Ce qui était surprenant :** L'ancien dossier `docs-site/` peut rester sur le disque avec des fichiers obsolètes mais importants comme `i18n/`, même après le déplacement du dépôt suivi vers `docs/`. Cela donne l'impression que le refactor est dupliqué localement et peut masquer le fait que les traductions des documents suivis n'ont pas été réellement déplacées vers `docs/`.
- **Impact :** Les agents peuvent supprimer l'ancien dossier comme étant « indésirable » et perdre accidentellement la seule copie locale des traductions de documents, ou continuer à modifier des scripts qui pointent toujours vers le chemin `docs-site/` mort.
- **Atténuation :** Traitez `docs/` comme le seul projet de documentation canonique. Avant de supprimer les restes locaux de `docs-site/`, restaurez la source suivie comme `docs/i18n/` et mettez à jour les scripts et les hooks pour arrêter de référencer `docs-site`.
- **Statut :** confirmé

### L'aperçu des documents multilocales peut augmenter la RAM lors de la vérification

- **Date :** 2026-04-01
- **Observé par :** Codex
- **Contexte :** Correction des documents i18n, du routage des paramètres régionaux et du comportement de Pagefind avec `yarn start:docs` plus Playwright
- **Ce qui était surprenant :** Le mode de prévisualisation des documents par défaut effectue désormais une création de documents multilocale complète ainsi qu'une indexation Pagefind avant de les diffuser, et maintenir ce processus en vie parallèlement à plusieurs sessions Playwright ou Chrome peut consommer beaucoup plus de RAM qu'une boucle de développement Vite normale ou Docusaurus à un seul paramètre régional.
- **Impact :** La machine peut devenir limitée en mémoire, les sessions de navigateur peuvent planter et les exécutions interrompues peuvent laisser derrière elles des serveurs de documents obsolètes ou des navigateurs sans tête qui continuent de consommer de la mémoire.
- **Atténuation :** Pour les travaux de documentation qui ne nécessitent pas de vérification de route locale ou de recherche de page, préférez `DOCS_START_MODE=live yarn start:docs`. Utilisez uniquement l'aperçu multilocale par défaut lorsque vous devez valider des itinéraires traduits ou Pagefind. Conservez une seule session Playwright, fermez les anciennes sessions de navigateur avant d'en ouvrir de nouvelles et arrêtez le serveur de documents après vérification si vous n'en avez plus besoin.
- **Statut :** confirmé
