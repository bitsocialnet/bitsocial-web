# Hooks d'agent

Les hooks de cycle de vie versionnés ne font qu'une chose : formater, avec l'oxfmt installé, les fichiers JavaScript/TypeScript modifiés avec succès. La logique partagée se trouve dans `scripts/agent-hooks/format.mjs` ; chaque wrapper natif lui délègue le travail.

| Application | Configuration native | Événement |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude ne lit pas de fichier `.claude/hooks.json` autonome. Chaque application garde la main sur la confiance accordée au projet et sur l'activation des hooks ; inspectez ses réglages actuels au lieu de contourner la confiance. `.codex/config.toml` est une configuration du dépôt, pas un registre de commandes de hooks.

Le formateur valide l'événement/la charge utile, le succès de la modification, l'extension du fichier et l'appartenance au dépôt, liens symboliques compris. Des dépendances manquantes ou une entrée non pertinente ne déclenchent aucun travail. Les commandes utilisent un tableau d'arguments, avec l'accès réseau de Corepack désactivé ; les hooks n'installent pas de dépendances, ne lancent ni builds ni revues, et ne modifient pas Git.

Lancez les vérifications explicitement, conformément à [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Exécutez `yarn ai-workflow:sync`, `yarn ai-workflow:check` et `yarn ai-workflow:test` après avoir modifié le workflow. Les fixtures utilisent des fichiers jetables et de fausses invocations du formateur ; elles ne prouvent pas que chaque application a chargé sa configuration. Après une mise à niveau, rechargez l'application et inspectez son catalogue.

Le skill de design Impeccable et ses scripts utilitaires exécutables restent disponibles à la demande sous `.agents/skills/impeccable`. Son ancien hook Codex pointait vers un répertoire manquant ; le workflow de design s'exécute désormais quand son skill est sélectionné, sans hook de design toujours actif. Le skill ne doit pas reconfigurer les hooks du projet comme étape annexe d'un travail de design.
