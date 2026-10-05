# Skills et outils

Les skills partagés se trouvent dans `.agents/skills/`. Modifiez ces sources, puis exécutez `yarn ai-workflow:sync` pour générer `.claude/skills/` pour Claude Code. Codex et Cursor découvrent directement `.agents/skills/` ; ne restaurez pas les racines dupliquées `.codex/skills/` ou `.cursor/skills/`.

Les prompts de rôle partagés se trouvent dans `.agents/roles/*.md`. Il s'agit d'un format source propre au dépôt, et non d'un chemin de découverte d'agents natif. `scripts/ai-workflow-files.mjs` convertit ces sources en fichiers propres à chaque application, listés ci-dessous ; `yarn ai-workflow:sync` les écrit. Commitez les fichiers générés avec leurs sources, afin qu'un checkout neuf dispose de la configuration native sans devoir d'abord lancer un générateur. Après la suppression d'une source, supprimez explicitement ses sorties générées devenues obsolètes ; le validateur les signale au lieu de supprimer des fichiers en silence.

## Chemins de découverte natifs

Vérifiés par rapport à la documentation officielle le 2026-09-12 :

| Application | Instructions du projet                                                                                | Skills utilisés par ce dépôt            | Agents personnalisés utilisés par ce dépôt |
| ----------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------ |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`        | `.codex/agents/<name>.toml` généré         |
| Cursor      | `AGENTS.md` ; `.cursor/rules/*.mdc` reste disponible pour les règles conditionnelles propres à Cursor | `.agents/skills/<name>/SKILL.md`        | `.cursor/agents/<name>.md` généré          |
| Claude Code | `CLAUDE.md` importe `@AGENTS.md`                                                                      | `.claude/skills/<name>/SKILL.md` généré | `.claude/agents/<name>.md` généré          |

Sources : [skills Codex](https://learn.chatgpt.com/docs/build-skills), [sous-agents Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [règles Cursor](https://cursor.com/docs/rules), [skills Cursor](https://cursor.com/docs/skills), [sous-agents Cursor](https://cursor.com/docs/subagents), [mémoire Claude](https://code.claude.com/docs/en/memory), [skills Claude](https://code.claude.com/docs/en/skills), [sous-agents Claude](https://code.claude.com/docs/en/sub-agents).

Ne remplacez pas les répertoires d'agents natifs par `.agents/roles` et ne supposez pas que Claude découvre `.agents/skills`. Claude peut tout de même lire un fichier référencé à cet endroit comme contexte ordinaire du projet. Cursor découvre aussi `.claude/skills` par compatibilité ; les copies restent synchronisées, mais son guide publié sur les skills ne précise pas de dédoublonnage entre ces racines. Vérifiez le catalogue de skills de l'application installée plutôt que de promettre que des entrées en double ne peuvent pas apparaître.

Les répertoires IA utilisent des fins de ligne LF via `.gitattributes`, afin que le texte généré reste identique d'une plateforme à l'autre. Les ressources annexes des skills sont copiées octet pour octet.

## Skills

| Skill                                | Objectif                                                                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Créer des commits locaux autorisés et bien délimités                                                                      |
| `commit-format`, `issue-format`      | Formater des suggestions sur demande                                                                                      |
| `make-closed-issue`                  | Créer une issue autorisée, un commit délimité et une PR                                                                   |
| `review-and-merge-pr`                | Trier les retours d'une PR ; corriger/publier/fusionner uniquement dans le périmètre demandé                              |
| `fix-merge-conflicts`                | Résoudre les conflits et vérifier le résultat de la fusion                                                                |
| `release`                            | Préparer le texte de la release et effectuer les étapes de release autorisées                                             |
| `code-quality-review`                | Relire les diffs non triviaux ou un point de qualité explicitement demandé                                                |
| `retro`                              | Transformer des erreurs avérées en vérifications ou en consignes ciblées qui empêchent qu'elles se reproduisent           |
| `refactor-pass`, `deslop`            | Nettoyage demandé de changements existants                                                                                |
| `debug-agent`                        | Débogage fondé sur des preuves, avec instrumentation si nécessaire                                                        |
| `you-might-not-need-an-effect`       | Revue ciblée des effets/memos                                                                                             |
| `vercel-react-best-practices`        | Recommandations de performance React applicables ; ignorer les règles propres à Next.js ou au serveur pour ce client Vite |
| `translate`                          | Générer des traductions, puis appliquer les dictionnaires via un seul processus d'écriture                                |
| `playwright-cli`, `inspect-elements` | Vérification en navigateur et correspondance entre le DOM et le code source                                               |
| `profile-browsing`                   | Profilage ciblé du navigateur et de React                                                                                 |
| `test-apk`                           | Vérifier un wrapper Android compagnon fourni                                                                              |
| `impeccable`, `improve-threejs`      | Design d'interface ciblé et revue du rendu Three.js                                                                       |
| `implement-plan`                     | Exécuter un plan avec une délégation optionnelle et bornée                                                                |
| `readme`                             | Maintenir une documentation de projet vérifiée                                                                            |
| `context7`                           | Récupérer la documentation de bibliothèque adaptée à la version                                                           |
| `find-skills`                        | Trouver des skills supplémentaires sur demande explicite                                                                  |

## Rôles et modèles

Conservez les rôles personnalisés `browser-check`, `profiler`, `test-apk`, `translator` et `reviewer`. Pour l'implémentation ordinaire et la découverte du code, utilisez le rôle intégré du harnais, worker/general-purpose ou explorer. Le parent attribue les critères d'acceptation et la propriété ; un seul propriétaire lance les vérifications lourdes.

Les fichiers d'agent Codex comprennent `name`, `description` et `developer_instructions`. `.codex/config.toml` plafonne à quatre le nombre d'enfants simultanés via `max_concurrent_threads_per_session`. Les métadonnées de rôle partagées contiennent le nom, la description et un mode de sandbox optionnel ; elles ne comportent délibérément aucun champ de modèle.

N'incluez pas de champs de modèle ni de raisonnement dans les skills et les agents personnalisés versionnés, dans aucune des trois applications. Cela laisse jouer les choix faits à l'invocation, les réglages par défaut de l'utilisateur et l'héritage du parent, selon l'ordre de priorité documenté de chaque application. Les alias de famille de Claude réduisent la maintenance liée aux versions, mais choisissent tout de même une famille ; un modèle Cursor versionné exigera des mises à jour. Conservez ces choix dans les réglages de l'utilisateur ou de la session si nécessaire. L'héritage ne garantit pas le choix automatique du meilleur modèle actuel. N'inventez pas d'alias `latest` et n'ajoutez pas de recherche dans le catalogue de modèles aux tâches courantes. Voir [sélection dans Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [sélection dans Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) et [sélection dans Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` correspond à la sandbox de Codex et au `readonly` de Cursor ; la liste d'outils de Claude et les instructions du rôle restreignent son workflow de revue, mais l'accès à Bash n'est pas une sandbox au niveau du système d'exploitation.

Le frontmatter des skills partagés utilise `disable-model-invocation: true` pour les workflows invoqués par l'utilisateur, le cas échéant. Le réglage correspondant de Codex se trouve dans `agents/openai.yaml`, sous la forme `policy.allow_implicit_invocation: false` ; le validateur exige les deux. Les métadonnées d'invocation complètent les règles d'autorisation explicite ; une demande de revue n'autorise jamais une publication au seul motif qu'un skill comporte des étapes de publication.

## Vérifications et découverte

- `yarn ai-workflow:sync` régénère les sorties de compatibilité à l'aide des paquets installés `js-yaml` et `smol-toml`.
- `yarn ai-workflow:check` analyse les sources, le frontmatter et les configurations, et vérifie les sorties générées, les métadonnées d'invocation, l'emplacement des champs de modèle et le câblage du hook limité au formatage. Il ne résout pas les identifiants de modèle par rapport au catalogue d'un fournisseur.
- `yarn ai-workflow:test` exécute des fixtures Node isolées pour les charges utiles des hooks et pour la génération/validation du workflow.
- Après la mise à niveau d'une application d'agent, vérifiez la découverte des skills/rôles dans cette application. Les vérifications de syntaxe/parité ne remplacent pas une vérification du chargeur. Rechargez l'application si une session existante conserve un ancien catalogue.
- Les hooks exigent la confiance accordée au projet par le harnais et la revue des hooks ; ne contournez pas la confiance pour faire passer une vérification. Voir [hooks-setup.md](hooks-setup.md).

## Maintenir des instructions utiles

Suivez les [recommandations d'OpenAI sur les skills et les prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (consultées le 2026-09-12) : gardez des descriptions précises, ne chargez les détails que lorsqu'ils sont pertinents, et respectez le périmètre demandé par l'utilisateur. Les skills partagés servent des modèles différents ; conservez les invariants propres au projet tout en laissant libres les choix d'implémentation courants.

Gardez dans `SKILL.md` l'objectif d'un skill, les limites de ses décisions et ses contraintes essentielles. Renvoyez vers les commandes ou exemples conséquents propres à un mode sous forme de références optionnelles. Placez les conditions de déclenchement tôt dans des descriptions courtes ; un simple mot-clé correspondant ne doit pas élargir la tâche. Conservez les métadonnées d'invocation existantes, sauf si vous modifiez intentionnellement leur comportement.

Après un changement substantiel des instructions, essayez quelques demandes représentatives, petites et grandes. Vérifiez quels skills/références ont été sélectionnés, si les actions sont restées dans le périmètre, si la vérification correspondait au changement et si le travail autorisé a été mené à terme. Les tests de schéma et de fixtures établissent la justesse de l'outillage, pas la qualité des décisions de l'agent.

## Outils et propriété du navigateur

Privilégiez le catalogue existant de skills/outils et les CLI du projet déjà installées. Utilisez `gh` pour GitHub, `playwright-cli` pour la vérification en navigateur, et la documentation officielle propre à la version quand le comportement d'une bibliothèque compte. Évitez d'installer des skills en double ou de récupérer un paquet non épinglé uniquement pour lancer un formateur existant.

Le surcoût de MCP dépend du harnais : le chargement différé des outils peut éviter de charger tous les schémas d'emblée. Gardez des intégrations pertinentes plutôt que de considérer MCP lui-même comme obsolète. Les choix existants de CLI restent utiles pour la reproductibilité et le contrôle des ressources.

Toutes les sessions de navigateur passent par `./scripts/pw-session.sh`, qui impose un seul navigateur actif sur toute la machine. Par défaut, utilisez une session neuve et isolée. L'accès au navigateur personnel actuel exige une autorisation explicite ; réutilisez cette autorisation dans les étapes suivantes. Choisissez les navigateurs/viewports selon le comportement concerné, exécutez les moteurs choisis les uns après les autres, lors du nettoyage, fermez précisément la session nommée, et n'utilisez jamais `close-all`/`kill-all`. Voir le skill `playwright-cli` et [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
