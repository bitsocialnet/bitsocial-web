# Surprises connues

Ce fichier recense les points de confusion propres à ce dépôt qui ont causé des erreurs d'agent.

## Critères d'ajout

N'ajoutez une entrée que si toutes ces conditions sont réunies :

- Elle est propre à ce dépôt (ce n'est pas un conseil générique).
- Elle a de fortes chances de se reproduire pour de futurs agents.
- Elle s'accompagne d'une atténuation concrète et applicable.

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

### Les domaines de production des applications Vercel peuvent revenir à des déploiements Git master

- **Date :** 2026-04-28
- **Observé par :** Tommaso + Codex
- **Contexte :** Vérification des miroirs des applications Seedit et 5chan dans le répertoire d'applications de Bitsocial Web.
- **Ce qui a surpris :** Les projets Vercel `seedit` et `5chan` avaient `gitProviderOptions.createDeployments = "enabled"`, si bien que les pushes GitHub sur `master` étaient promus vers les domaines de production, alors que la politique du dépôt attend des miroirs d'applications en production qu'ils ne servent que des artefacts de release.
- **Impact :** Les badges de miroir vérifié du répertoire d'applications peuvent devenir faux, parce que les domaines de production servent le dernier commit de développement au lieu du ZIP de release GitHub dont le hash du fichier `index.html` est enregistré dans `about/src/lib/apps-data.ts`.
- **Atténuation :** Avant d'ajouter ou de rafraîchir des métadonnées de vérification de miroir, inspectez le projet Vercel avec `vercel api /v9/projects/<project-id>` et confirmez que `gitProviderOptions.createDeployments = "disabled"`. Déployez le contenu du ZIP de release avec `vercel deploy --prebuilt --prod` et utilisez `seedit-omega.vercel.app` ou `5chan-omega.vercel.app` pour les déploiements de développement.
- **Statut :** confirmé

### Portless 0.11 réutilise un état de proxy hérité si le lanceur ne force pas HTTPS

- **Date :** 2026-04-28
- **Observé par :** Tommaso + Codex
- **Contexte :** Migration du flux `yarn start` habituel de l'ancienne URL de proxy `http://bitsocial.localhost:1355` vers `https://bitsocial.localhost`.
- **Ce qui a surpris :** Même avec `portless@0.11.1` installé, Portless réutilisait le proxy HTTP existant `~/.portless/proxy.port = 1355` et affichait l'ancienne URL en `:1355`.
- **Impact :** Mettre à jour les versions de paquets et la documentation ne suffit pas : `yarn start` peut encore annoncer et utiliser l'ancienne URL quand un contributeur a un état Portless hérité en cours d'exécution.
- **Atténuation :** Faites en sorte que les scripts de démarrage lancent explicitement le proxy HTTPS de Portless sur le port `443` avant d'enregistrer les routes d'application, pour que le flux d'exécution s'éloigne de l'état `1355` persistant au lieu d'en hériter.
- **Statut :** confirmé

### Portless change l'URL locale canonique de l'application

- **Date :** 2026-03-18
- **Observé par :** Codex
- **Contexte :** Vérifications en navigateur et parcours de smoke test
- **Ce qui a surpris :** L'URL locale par défaut n'est pas le port Vite habituel. Le dépôt attend `https://bitsocial.localhost` via Portless, donc vérifier `localhost:3000` ou `localhost:5173` peut atteindre la mauvaise application, voire rien du tout.
- **Impact :** Les vérifications en navigateur peuvent échouer, ou valider la mauvaise cible, même quand le serveur de développement fonctionne correctement.
- **Atténuation :** Utilisez `https://bitsocial.localhost` en premier. Ne le contournez avec `PORTLESS=0 corepack yarn start` que si vous avez explicitement besoin d'un port Vite direct.
- **Statut :** confirmé

### Les hooks Commitizen bloquent les commits non interactifs

- **Date :** 2026-03-18
- **Observé par :** Codex
- **Contexte :** Workflows de commit pilotés par un agent
- **Ce qui a surpris :** `git commit` déclenche Commitizen via Husky et attend une saisie sur un TTY interactif, ce qui fige les shells d'agent non interactifs.
- **Impact :** Les agents peuvent rester bloqués indéfiniment sur ce qui devrait être un commit ordinaire.
- **Atténuation :** Utilisez `git commit --no-verify -m "message"` pour les commits créés par un agent. Les humains peuvent toujours passer par `corepack yarn commit` ou `corepack yarn exec cz`.
- **Statut :** confirmé

### Corepack est nécessaire pour éviter Yarn classic

- **Date :** 2026-03-19
- **Observé par :** Codex
- **Contexte :** Migration du gestionnaire de paquets vers Yarn 4
- **Ce qui a surpris :** La machine possède encore une installation globale de Yarn classic dans le `PATH`, donc lancer simplement `yarn` peut résoudre vers la v1 au lieu de la version Yarn 4 épinglée.
- **Impact :** Les développeurs peuvent contourner sans le vouloir l'épinglage du gestionnaire de paquets du dépôt et obtenir un comportement d'installation ou un lockfile différents.
- **Atténuation :** Utilisez `corepack yarn ...` pour les commandes shell, ou exécutez d'abord `corepack enable` pour que `yarn` seul résolve vers la version Yarn 4 épinglée.
- **Statut :** confirmé

### Les noms d'application Portless figés entrent en collision entre les worktrees Bitsocial Web

- **Date :** 2026-03-30
- **Observé par :** Codex
- **Contexte :** Lancement de `yarn start` dans un worktree Bitsocial Web alors qu'un autre worktree servait déjà via Portless
- **Ce qui a surpris :** Utiliser le nom d'application Portless littéral `bitsocial` dans chaque worktree fait entrer la route elle-même en collision, même quand les ports sous-jacents diffèrent : le second processus échoue parce que `bitsocial.localhost` est déjà enregistré.
- **Impact :** Des branches Bitsocial Web parallèles peuvent se bloquer mutuellement, alors que Portless est justement censé leur permettre de coexister sans risque.
- **Atténuation :** Gardez le démarrage de Portless derrière `scripts/start-dev.mjs`, qui utilise désormais une route `*.bitsocial.localhost` cadrée sur la branche en dehors du cas canonique, et bascule sur une route cadrée sur la branche quand le nom nu `bitsocial.localhost` est déjà occupé.
- **Statut :** confirmé

### L'aperçu de la documentation codait en dur le port 3001

- **Date :** 2026-03-30
- **Observé par :** Codex
- **Contexte :** Exécution de `yarn start` en parallèle d'autres dépôts et agents locaux
- **Ce qui a surpris :** La commande de développement racine lançait l'espace de travail de documentation avec `docusaurus start --port 3001`, si bien que toute la session de développement échouait dès qu'un autre processus occupait déjà `3001`, alors même que l'application principale utilisait déjà Portless.
- **Impact :** `yarn start` pouvait tuer le processus web juste après son démarrage et interrompre un travail local sans rapport, à cause d'une collision sur le port de la documentation.
- **Atténuation :** Gardez le démarrage de la documentation derrière `yarn start:docs`, qui utilise désormais Portless et `scripts/start-docs.mjs` pour respecter un port libre injecté, ou se rabattre sur le prochain port disponible quand il est lancé directement.
- **Statut :** confirmé

### Le nom d'hôte Portless de la documentation était codé en dur

- **Date :** 2026-04-03
- **Observé par :** Codex
- **Contexte :** Lancement de `yarn start` dans un worktree Bitsocial Web secondaire alors qu'un autre worktree servait déjà la documentation via Portless
- **Ce qui a surpris :** `start:docs` enregistrait encore le nom d'hôte littéral `docs.bitsocial.localhost`, donc `yarn start` pouvait échouer alors que l'application about savait déjà éviter les collisions de route Portless pour son propre nom d'hôte.
- **Impact :** Des worktrees parallèles ne pouvaient pas utiliser de façon fiable la commande de développement racine, parce que le processus de documentation s'arrêtait en premier et que `concurrently` tuait ensuite le reste de la session.
- **Atténuation :** Gardez le démarrage de la documentation derrière `scripts/start-docs.mjs`, qui dérive désormais le même nom d'hôte Portless cadré sur la branche que l'application about, et injecte cette URL publique partagée dans la cible du proxy de développement `/docs`.
- **Statut :** confirmé

### Les shells de worktree peuvent rater la version de Node épinglée par le dépôt

- **Date :** 2026-04-03
- **Observé par :** Codex
- **Contexte :** Lancement de `yarn start` dans des worktrees Git comme `.claude/worktrees/*` ou dans des checkouts de worktrees voisins
- **Ce qui a surpris :** Certains shells de worktree résolvaient `node` et `yarn node` vers le Node `25.2.1` de Homebrew alors que le dépôt épingle `22.12.0` dans `.nvmrc`, si bien que `yarn start` pouvait exécuter silencieusement les lanceurs de développement sur le mauvais runtime.
- **Impact :** Le comportement du serveur de développement peut diverger entre le checkout principal et les worktrees, ce qui rend les bugs difficiles à reproduire et enfreint la chaîne d'outils Node 22 attendue par le dépôt.
- **Atténuation :** Gardez les lanceurs de développement derrière `scripts/start-dev.mjs` et `scripts/start-docs.mjs`, qui se réexécutent désormais avec le binaire Node de `.nvmrc` quand le shell courant est sur la mauvaise version. La configuration du shell devrait tout de même privilégier `nvm use`.
- **Statut :** confirmé

### Les restes de `docs-site/` peuvent masquer l'absence des sources de documentation après le refactor

- **Date :** 2026-04-01
- **Observé par :** Codex
- **Contexte :** Nettoyage du monorepo après la fusion, une fois le projet Docusaurus déplacé de `docs-site/` vers `docs/`
- **Ce qui a surpris :** L'ancien dossier `docs-site/` peut rester sur le disque avec des fichiers obsolètes mais importants comme `i18n/`, même après le passage du dépôt suivi à `docs/`. Le refactor semble alors dupliqué en local, et cela peut masquer le fait que les traductions de documentation suivies n'ont jamais été déplacées dans `docs/`.
- **Impact :** Les agents peuvent supprimer l'ancien dossier en le prenant pour un « déchet » et perdre par accident la seule copie locale des traductions de documentation, ou continuer à modifier des scripts qui pointent encore vers le chemin mort `docs-site/`.
- **Atténuation :** Traitez `docs/` comme le seul projet de documentation canonique. Avant de supprimer des restes locaux de `docs-site/`, restaurez les sources suivies comme `docs/i18n/` et mettez à jour les scripts et les hooks pour qu'ils cessent de référencer `docs-site`.
- **Statut :** confirmé

### L'aperçu multi-locale de la documentation peut faire grimper la RAM pendant la vérification

- **Date :** 2026-04-01
- **Observé par :** Codex
- **Contexte :** Correction de l'i18n de la documentation, du routage des locales et du comportement de Pagefind avec `yarn start:docs` et Playwright
- **Ce qui a surpris :** Le mode d'aperçu par défaut de la documentation effectue désormais un build multi-locale complet suivi d'une indexation Pagefind avant de servir les pages ; maintenir ce processus actif à côté de plusieurs sessions Playwright ou Chrome peut consommer beaucoup plus de RAM qu'une boucle de développement Vite ou Docusaurus mono-locale ordinaire.
- **Impact :** La machine peut se retrouver à court de mémoire, les sessions de navigateur peuvent planter, et des exécutions interrompues peuvent laisser derrière elles des serveurs de documentation obsolètes ou des navigateurs headless qui continuent de consommer de la mémoire.
- **Atténuation :** Pour le travail de documentation qui n'a pas besoin de vérifier les routes de locale ni Pagefind, préférez `DOCS_START_MODE=live yarn start:docs`. N'utilisez l'aperçu multi-locale par défaut que lorsque vous devez valider des routes traduites ou Pagefind. Gardez une seule session Playwright, fermez les anciennes sessions de navigateur avant d'en ouvrir de nouvelles, et arrêtez le serveur de documentation après vérification si vous n'en avez plus besoin.
- **Statut :** confirmé

### `translate-docs.py` peut laisser les locales de documentation à moitié traduites ou avec des cibles de lien cassées

- **Date :** 2026-04-06
- **Observé par :** Codex
- **Contexte :** Correction des routes et du contenu localisés de la documentation, après que `yarn start:docs` a servi des pages de détail en anglais ou n'a pas réussi à produire la sortie de locale
- **Ce qui a surpris :** Le pipeline de traduction de la documentation cumulait deux modes de défaillance propres au dépôt : `scripts/translate-docs.py` n'extrayait qu'un petit sous-ensemble des messages de `DocsHome` quand les appels `tr(...)` prenaient des formes qu'il ne savait pas analyser, et le markdown traduit sous `docs/i18n/**` pouvait contenir des slugs traduits automatiquement ou des artefacts `ZXQPLACEHOLDER` à l'intérieur des cibles de lien.
- **Impact :** Les pages d'accueil localisées peuvent retomber silencieusement sur l'anglais, les pages de détail localisées peuvent sembler non traduites, et un `yarn docs:build` complet peut échouer sur des liens de locale cassés alors même que la documentation source est valide.
- **Atténuation :** Après avoir modifié les traductions de la documentation ou régénéré les fichiers de locale, lancez toujours `yarn docs:build` depuis la racine du dépôt, cherchez `ZXQPLACEHOLDER` dans le markdown de `docs/i18n/**`, et vérifiez que les liens traduits pointent encore vers des slugs de documentation canoniques comme `/apps/5chan/` plutôt que vers des chemins d'URL traduits. Si le texte de `DocsHome` a changé, confirmez que `scripts/translate-docs.py` extrait toujours tous les messages `docs.home.*`.
- **Statut :** confirmé

### Les vérifications sans JS du site about doivent utiliser la route Portless, pas un aperçu SSR autonome

- **Date :** 2026-04-12
- **Observé par :** Codex
- **Contexte :** Vérification du support sans JS du site `about/` depuis un worktree de branche
- **Ce qui a surpris :** Un aperçu SSR autonome peut sembler en bonne santé alors que la vraie route Portless cadrée sur la branche sert encore la mauvaise coquille d'application ou un processus plus ancien. Dans ce dépôt, le contrat local réel est le nom d'hôte Portless issu de `yarn start`, pas un serveur d'aperçu improvisé.
- **Impact :** Les agents peuvent affirmer à tort que le support sans JS fonctionne, ou passer à côté de régressions qui n'apparaissent que sur `*.bitsocial.localhost`.
- **Atténuation :** Pour la vérification en navigateur de `about/`, démarrez toujours le vrai serveur local avec `yarn start` ou `yarn start:about`, et testez d'abord l'URL Portless cadrée sur la branche. Si un nom d'hôte Portless semble obsolète, inspectez et arrêtez l'ancien processus avant de retester.
- **Statut :** confirmé

### `chain/` était invisible pour `yarn build:verify` et `yarn doctor`

- **Date :** 2026-07-05
- **Observé par :** Codex
- **Contexte :** Vérification d'un diff touchant uniquement chain/ après l'ajout au monorepo de l'espace de travail `chain/` (application Vite autonome pour `chain.bitsocial.net`).
- **Ce qui a surpris :** `scripts/verify-build.mjs` ne reconnaissait que les préfixes de chemin `about/`, `docs/` et `stats/` ; un diff limité à chain/ affichait donc « No targeted build checks matched the current diff » et ne lançait aucun build, alors même que `build:chain` existait déjà dans le `package.json` racine. Par ailleurs, `yarn doctor` était codé en dur sur `react-doctor about -y`, si bien que les changements React sous `chain/src` ne recevaient aucune couverture React Doctor.
- **Impact :** Les agents qui vérifiaient des changements sur chain devaient savoir qu'il fallait appeler `yarn build:chain` directement au lieu de faire confiance à `yarn build:verify`, et les problèmes React dans `chain/src` (effets, hooks, code mort) passaient inaperçus pour `yarn doctor`.
- **Atténuation :** `scripts/verify-build.mjs` possède désormais une branche `chain/` calquée sur celle de `about/`, et `doctor` ainsi que `doctor:verbose` exécutent maintenant `react-doctor --project about,chain -y` en une seule invocation. `doctor:score` reste limité à `about`, parce que `--score` n'affiche silencieusement rien quand il est combiné à `--project` pour plus d'un projet ; utilisez `yarn react-doctor --project about,chain --verbose -y` (ou `--json`) si un score pour chain est nécessaire.
- **Statut :** confirmé

### Le P2P navigateur passe par des WebSockets sécurisés ; pkc-js refuse WebRTC et WebTransport par défaut

- **Date :** 2026-08-02
- **Observé par :** Claude
- **Contexte :** Rédaction du texte de la page d'accueil et de la documentation expliquant le fonctionnement du P2P navigateur de Bitsocial
- **Ce qui a surpris :** `@pkcprotocol/pkc-js` embarque un connection gater par défaut qui rejette les dials WebRTC et WebTransport dans le navigateur : `dist/browser/helia/dial-transport-filter.js` exporte `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Le commentaire de son code source en donne la raison : dans le navigateur, ces transports ajoutent des chemins d'établissement de connexion longs et souvent défaillants (STUN/ICE, rotation de certhash) qui ralentissent le chargement, alors que WebSocket est direct et fiable. Chaque pair actif du panneau d'état P2P du blog affiche « Secure WebSocket ». Le gater vit dans `node_modules`, donc rien dans le dépôt n'en laisse deviner l'existence.
- **Impact :** Il est très facile d'écrire un texte public techniquement plausible mais faux — par exemple en attribuant à l'arrivée de WebTransport dans la Baseline des navigateurs en mars 2026 le mérite d'avoir rendu possible le P2P navigateur de Bitsocial. Cette affirmation a été publiée sur la page d'accueil, dans le tableau comparatif et sur deux pages de documentation avant que le développeur ne la repère. Les affirmations erronées sur l'architecture, quand elles sont publiques, sont vérifiées précisément par le public de développeurs que le site vise.
- **Atténuation :** Ne déduisez jamais les transports utilisés par Bitsocial de ce que libp2p ou la plateforme navigateur prennent en charge en principe. Vérifiez la liste de refus actuelle dans `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, confirmez qu'aucune surcharge de `connectionGater` n'existe sous `about/src/`, et lisez les libellés de transport en direct dans le panneau « P2P status » du blog avant toute affirmation publique. Le changement amont qui a réellement débloqué la publication depuis le navigateur est la correction du seqno monotone de gossipsub dans `@libp2p/gossipsub` 15.0.21 (mai 2026) ; pkc-js embarque actuellement la 16.0.4.
- **Statut :** confirmé

### Les liens relatifs `./page.md` depuis une page de documentation non traduite cassent tous les builds localisés

- **Date :** 2026-08-02
- **Observé par :** Claude
- **Contexte :** Ajout d'une page en anglais uniquement, `docs/browser-p2p.md`, qui pointait vers des pages existantes avec `./peer-to-peer-protocol.md` et `./apps/5chan.md`
- **Ce qui a surpris :** Chaque locale sous `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` reproduit l'arborescence de la documentation. Une page absente de ces miroirs s'affiche quand même dans toutes les locales grâce au repli sur l'anglais, mais ses liens markdown relatifs ne se résolvent plus : Docusaurus produit `/ar/browser-p2p/peer-to-peer-protocol.md/` et fait échouer le build avec « Docusaurus found broken links! ». Point crucial : `yarn build:verify` et `yarn docs:build:verify` ne construisent que `en` et passent sans rien signaler ; seul un `yarn docs:build` complet fait apparaître le problème, et il s'interrompt sur la première locale par ordre alphabétique (`ar`).
- **Impact :** Un changement de documentation peut passer toutes les vérifications locales rapides et casser malgré tout le build multi-locale de production. L'échec semble en plus sans rapport avec le changement, puisque l'erreur nomme un chemin de locale que l'auteur n'a jamais touché.
- **Atténuation :** Dans toute page de documentation qui n'est pas répliquée dans `docs/i18n/**`, utilisez des liens relatifs à la racine (`/peer-to-peer-protocol/`, `/apps/5chan/`) plutôt que des liens `.md` relatifs ; Docusaurus les préfixe automatiquement avec la locale. `docs/build-your-own-client.md` en est l'exemple existant. Lancez un `yarn docs:build` complet — et pas seulement `build:verify` — avant de livrer tout changement qui ajoute une page de documentation ou en référence une.
- **Statut :** confirmé

### Les exécutions concurrentes de `update-translations.js` perdent des clés silencieusement

- **Date :** 2026-08-02
- **Observé par :** Claude
- **Contexte :** Application de 26 clés i18next traduites sur les 36 locales via le skill `translate`
- **Ce qui a surpris :** Chaque invocation est un cycle lecture-modification-écriture sur les 36 fichiers de locale : deux invocations simultanées s'écrasent mutuellement et une clé disparaît sans la moindre erreur. Le skill `translate` demande explicitement de lancer jusqu'à 4 sous-agents en parallèle, dont chacun appellerait ce script.
- **Impact :** L'échec est silencieux : des clés disparaissent de locales arbitraires et le diff garde toute son apparence de plausibilité.
- **Atténuation :** Ne laissez jamais des sous-agents traducteurs écrire des fichiers de locale en parallèle : faites-leur produire uniquement des fichiers JSON de dictionnaire, puis appliquez chaque clé en série depuis l'agent parent. Après application, vérifiez par script que chaque clé existe dans les 35 locales non anglaises et qu'aucune valeur n'est identique octet pour octet à la source anglaise.
- **Statut :** confirmé
- **Mise à jour (2026-08-10) :** Le script résolvait aussi sa cible comme `path.join(process.cwd(), "public", "translations")`, si bien que la commande documentée, lancée depuis la racine du dépôt, échouait avec « Translations directory not found » et devait être exécutée depuis `about/`. Il résout désormais l'espace de travail à partir du répertoire courant ou de son propre emplacement, et fonctionne depuis n'importe où. Le piège de concurrence décrit ci-dessus reste inchangé.

### Les commandes d'annotation de développement peuvent intercepter les clics automatisés

- **Contexte :** Les sites about et chain comportent des commandes fixes dans le coin inférieur droit, là où la barre d'outils Agentation apparaît aussi en développement.
- **Atténuation :** `scripts/pw-session.sh open` enregistre `window.__NO_DEV_TOOLBAR__ = true` avant de recharger la page. L'initialiseur d'Agentation respecte aussi `__VISUAL_TESTING__` et `__PROFILING__` ; l'inspection du code source reste disponible indépendamment. L'automatisation directe du navigateur doit définir le même indicateur avant de charger l'application.

### `skills add` installe les copies Codex et Cursor dans le répertoire `.agents/` ignoré par Git

- **Date :** 2026-08-18
- **Observé par :** Tommaso + Claude
- **Contexte :** Installation du skill `improve-threejs` depuis `millionco/react-doctor` avec la CLI `skills` (`vercel-labs/skills`).
- **Ce qui a surpris :** `npx skills add <repo> --skill <name> --agent codex` et `--agent cursor` écrivent tous deux dans `.agents/skills/<name>/`, et non dans `.codex/skills/` ou `.cursor/skills/`. `AGENTS.md` interdit un répertoire `.agents/` au niveau du dépôt et `.gitignore:29` l'ignore, si bien que les deux copies restent silencieusement non suivies. Seul `--agent claude-code` écrit dans le `.claude/skills/` attendu. Par ailleurs, la forme documentée séparée par des virgules (`--agent claude-code,codex,cursor`) échoue avec « Invalid agents » et n'installe rien, alors que chaque nom est valide pris isolément.
- **Impact :** L'installation signale un succès alors que deux des trois copies destinées aux chaînes d'outils atterrissent à un endroit qui ne sera jamais commité ; Codex et Cursor se retrouvent donc silencieusement privés du skill après un clone neuf. La forme avec virgules peut aussi produire une installation sans effet qui passe pour un succès.
- **Atténuation actuelle :** Le dépôt suit désormais `.agents/skills` comme source canonique et génère les copies Claude avec `yarn ai-workflow:sync`. L'ancienne interdiction de `.agents` et la règle d'exclusion correspondante ont été supprimées. Ne copiez pas de nouveaux skills dans trois racines indépendantes ; après l'ajout d'un skill, vérifiez la parité des fichiers générés et le catalogue de l'application.
- **Statut :** confirmé
