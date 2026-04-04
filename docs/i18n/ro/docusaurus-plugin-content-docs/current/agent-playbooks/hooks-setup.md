# Configurare Agent Hooks

Dacă asistentul dvs. de codare AI acceptă cârlige pentru ciclul de viață, configurați-le pentru acest depozit.

## Cârlige recomandate

| Cârlig          | Comanda                                    | Scop                                                                                                                                                                                                              |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formatați automat fișierele după editările AI                                                                                                                                                                     |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Rulați `corepack yarn install` când `package.json` se modifică                                                                                                                                                    |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Eliminați referințele învechite și ștergeți ramurile de sarcini temporare integrate                                                                                                                               |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Verificări de construcție hard-gate, scame, verificare tip și format; păstrați `yarn npm audit` informațional și rulați `yarn knip` separat ca audit consultativ atunci când dependențele/importurile se modifică |

## De ce

- Formatare consistentă
- Lockfile rămâne sincronizat
- Problemele de construcție/scame/tip au fost detectate devreme
- Vizibilitate de securitate prin `yarn npm audit`
- Derivarea dependenței/importului poate fi verificată cu `yarn knip` fără a o transforma într-un cârlig de oprire global zgomotos
- O implementare de cârlig partajată atât pentru Codex, cât și pentru Cursor
- Ramurile de sarcini temporare rămân aliniate cu fluxul de lucru al arborelui de lucru al repo

## Exemple de Scripturi Hook

### Format Hook

```bash
#!/bin/bash
# Formatați automat fișierele JS/TS după editările AI
# Hook primește JSON prin stdin cu calea_fișier

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Verificați Hook

```bash
#!/bin/bash
# Rulați build, lint, typecheck, format check și audit de securitate când agentul termină

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

În mod implicit, `scripts/agent-hooks/verify.sh` iese diferit de zero atunci când o verificare necesară eșuează. Setați `AGENT_VERIFY_MODE=advisory` numai atunci când aveți nevoie în mod intenționat de semnal de la un copac rupt, fără a bloca cârligul. Păstrați `yarn knip` departe de poarta rigidă, cu excepția cazului în care repo decide în mod explicit să eșueze din cauza problemelor de importare/dependență.

### Cârlig de instalare a firelor

```bash
#!/bin/bash
# Rulați corepack yarn install atunci când package.json este schimbat
# Hook primește JSON prin stdin cu calea_fișier

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

Configurați cablajul cârligului în funcție de documentele instrumentului dvs. de agent (`hooks.json`, echivalent etc.).

În acest depozit, `.codex/hooks/*.sh` și `.cursor/hooks/*.sh` ar trebui să rămână ca pachete subțiri care deleg implementările partajate sub `scripts/agent-hooks/`.
