# Flux de travail d'agent de longue durée

Utilisez ce playbook lorsqu'une tâche est susceptible de s'étendre sur plusieurs sessions, transferts ou agents générés.

## Objectifs

- Donnez à chaque nouvelle session un moyen rapide de retrouver le contexte
- Continuez à travailler de manière incrémentielle au lieu d'effectuer un changement important en une seule fois
- Attrapez une ligne de base locale cassée avant d'ajouter plus de code
- Laissez des artefacts durables auxquels la prochaine session peut faire confiance

## Où conserver l'état

- Utilisez `docs/agent-runs/<slug>/` lorsque des humains, des robots de révision ou plusieurs chaînes d'outils ont besoin du même état de tâche.
- Utilisez un répertoire local d'outil tel que `.codex/runs/<slug>/` uniquement lorsque l'état de la tâche est intentionnellement local sur un poste de travail ou une chaîne d'outils.
- Ne masquez pas l'état partagé multi-session dans un fichier de travail privé si un autre contributeur ou agent en aura besoin ultérieurement.

## Fichiers requis

Créez ces fichiers au début de la tâche de longue durée :

- `feature-list.json`
- `progress.md`

Utilisez les modèles dans `docs/agent-playbooks/templates/feature-list.template.json` et `docs/agent-playbooks/templates/progress.template.md`.

Préférez JSON pour la liste des fonctionnalités afin que les agents puissent mettre à jour un petit nombre de champs sans réécrire l'intégralité du document.

## Liste de contrôle de démarrage de session

1. Exécutez `pwd`.
2. Lisez `progress.md`.
3. Lisez `feature-list.json`.
4. Exécutez `git log --oneline -20`.
5. Exécutez `./scripts/agent-init.sh --smoke`.
6. Choisissez exactement un élément ayant la priorité la plus élevée qui est toujours `pending`, `in_progress` ou `blocked`.

Si l’étape de fumée échoue, corrigez la ligne de base brisée avant d’implémenter une nouvelle tranche de fonctionnalités.

## Règles de séance

- Travaillez sur une fonctionnalité ou une tranche de tâche à la fois.
- Gardez la liste des fonctionnalités lisible par machine et stable. Mettez à jour l'état, les notes, les fichiers et les champs de vérification au lieu de réécrire les éléments sans rapport.
- Marquez un élément comme vérifié uniquement après avoir exécuté la commande ou le flux utilisateur répertorié dans cet élément.
- Utilisez les agents générés pour les tranches délimitées, et non pour la propriété globale de l'état de la tâche.
- Lorsqu'un agent enfant possède un élément, donnez-lui l'identifiant exact de l'élément, les critères d'acceptation et les fichiers qu'il peut toucher.

## Liste de contrôle de fin de session

1. Ajoutez une courte entrée de progression à `progress.md`.
2. Mettez à jour l'élément touché dans `feature-list.json`.
3. Enregistrez les commandes exactes exécutées pour vérification.
4. Capturez les bloqueurs, les suivis et le prochain meilleur élément à reprendre.

## Forme d’entrée de progression recommandée

Utilisez une structure courte comme :

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
