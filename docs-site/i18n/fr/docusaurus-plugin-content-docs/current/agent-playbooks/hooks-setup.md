# Configuration des hooks d'agent

Si votre assistant de codage AI prend en charge les hooks de cycle de vie, configurez-les pour ce référentiel.

## Crochets recommandés

| Crochet         | Commande                                   | Objectif                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formater automatiquement les fichiers après les modifications AI                                                                                                                                                                      |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Exécutez `corepack yarn install` lorsque `package.json` change                                                                                                                                                                        |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Élaguez les références obsolètes et supprimez les branches de tâches temporaires intégrées                                                                                                                                            |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Vérifications de construction, de charpie, de vérification de type et de format ; conserver `yarn npm audit` informatif et exécuter `yarn knip` séparément en tant qu'audit consultatif lorsque les dépendances/importations changent |

## Pourquoi

- Formatage cohérent
- Le fichier de verrouillage reste synchronisé
- Problèmes de construction/peluche/type détectés tôt
- Visibilité de la sécurité via `yarn npm audit`
- La dérive de dépendance/importation peut être vérifiée avec `yarn knip` sans le transformer en un crochet d'arrêt global bruyant
- Une implémentation de hook partagée pour le Codex et le Cursor
- Les branches de tâches temporaires restent alignées sur le flux de travail de l'arbre de travail du dépôt

## Exemples de scripts Hook

### Crochet de formatage

```bash
#!/bin/bash
# Auto-format JS/TS files after AI edits
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Vérifier le crochet

```bash
#!/bin/bash
# Run build, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Par défaut, `scripts/agent-hooks/verify.sh` quitte une valeur différente de zéro lorsqu'une vérification requise échoue. Définissez `AGENT_VERIFY_MODE=advisory` uniquement lorsque vous avez intentionnellement besoin du signal d'un arbre cassé sans bloquer le crochet. Gardez `yarn knip` hors de la porte dure à moins que le dépôt ne décide explicitement d'échouer en raison de problèmes d'importation/dépendance consultatifs.

### Crochet d'installation de fil

```bash
#!/bin/bash
# Run corepack yarn install when package.json is changed
# Hook receives JSON via stdin with file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

if [ "$file_path" = "package.json" ]; then
  cd "$(dirname "$0")/../.." || exit 0
  echo "package.json changed - running corepack yarn install to update yarn.lock..."
  corepack yarn install
fi

exit 0
```

Configurez le câblage du crochet en fonction de la documentation de votre outil d'agent (`hooks.json`, équivalent, etc.).

Dans ce référentiel, `.codex/hooks/*.sh` et `.cursor/hooks/*.sh` doivent rester en tant que wrappers légers qui délèguent aux implémentations partagées sous `scripts/agent-hooks/`.
