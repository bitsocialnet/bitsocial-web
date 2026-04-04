# Configuració de ganxos d'agent

Si el vostre assistent de codificació d'IA admet ganxos de cicle de vida, configureu-los per a aquest dipòsit.

## Ganxos recomanats

| Ganxo           | Comandament                                | Finalitat                                                                                                                                                                                                                 |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formateu automàticament els fitxers després de les edicions d'AI                                                                                                                                                          |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Executeu `corepack yarn install` quan canviï `package.json`                                                                                                                                                               |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Elimina les refs obsoletes i elimina les branques de tasques temporals integrades                                                                                                                                         |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Comprovacions de construcció, pelusa, tipus i format de la porta dura; mantenir `yarn npm audit` informatiu i executar `yarn knip` per separat com a auditoria d'assessorament quan canvien les dependències/importacions |

## Per què

- Format coherent
- El fitxer de bloqueig es manté sincronitzat
- S'han detectat problemes de construcció/pelusa/tip d'hora
- Visibilitat de seguretat mitjançant `yarn npm audit`
- La deriva de dependència/importació es pot comprovar amb `yarn knip` sense convertir-la en un ganxo d'aturada global sorollós
- Una implementació de ganxo compartida tant per a Codex com per a Cursor
- Les branques de tasques temporals es mantenen alineades amb el flux de treball de l'arbre de treball del repo

## Exemple de scripts de ganxo

### Format Ganxo

```bash
#!/bin/bash
# Formateu automàticament els fitxers JS/TS després de les edicions d'AI
# Hook rep JSON mitjançant stdin amb file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Verifiqueu el ganxo

```bash
#!/bin/bash
# Executeu la compilació, la pelusa, la comprovació de tipus, la comprovació de format i l'auditoria de seguretat quan acabi l'agent

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Per defecte, `scripts/agent-hooks/verify.sh` surt diferent de zero quan falla una comprovació necessària. Configureu `AGENT_VERIFY_MODE=advisory` només quan necessiteu intencionadament el senyal d'un arbre trencat sense bloquejar el ganxo. Manteniu `yarn knip` fora de la porta dura tret que el repo decideixi explícitament fallar en problemes d'importació/dependència d'assessorament.

### Ganxo d'instal·lació de fil

```bash
#!/bin/bash
# Executeu corepack yarn install quan es canviï package.json
# Hook rep JSON mitjançant stdin amb file_path

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

Configureu el cablejat del ganxo segons els documents de l'eina de l'agent (`hooks.json`, equivalent, etc.).

En aquest repo, `.codex/hooks/*.sh` i `.cursor/hooks/*.sh` haurien de romandre com a embolcalls prims que deleguen a les implementacions compartides sota `scripts/agent-hooks/`.
