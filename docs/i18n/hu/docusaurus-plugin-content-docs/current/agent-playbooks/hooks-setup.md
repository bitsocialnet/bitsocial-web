# Agent Hooks beállítása

Ha az AI-kódolási asszisztens támogatja az életciklus-horogokat, konfigurálja ezeket ehhez a repóhoz.

## Ajánlott horgok

| Horog           | Parancs                                    | Cél                                                                                                                                                                                                               |
| --------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Auto-format files after AI edits                                                                                                                                                                                  |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | A `corepack yarn install` futtatása, amikor a `package.json` megváltozik                                                                                                                                          |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Az elavult hivatkozások levágása és az integrált ideiglenes feladatágak törlése                                                                                                                                   |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate összeépítés, szösz, típusellenőrzés és formátumellenőrzés; a `yarn npm audit` információs megőrzése és a `yarn knip` külön futtatása tanácsadó auditként, amikor a függőségek/importálások megváltoznak |

## Miért

- Következetes formázás
- A zárolt fájl szinkronban marad
- Az építési/bolyhosodási/típusú problémákat korán észlelték
- Biztonsági láthatóság a `yarn npm audit` segítségével
- A függőség/import elsodródás ellenőrizhető a `yarn knip`-val anélkül, hogy zajos globális stophookgá alakítaná
- Egy megosztott horog megvalósítás a Codex és a Cursor számára
- Az ideiglenes feladatágak összhangban maradnak a repo munkafa munkafolyamatával

## Példa Hook szkriptekre

### Format Hook

```bash
#!/bin/bash
# A JS/TS fájlok automatikus formázása a mesterséges intelligencia szerkesztése után
# A Hook stdin-n keresztül fogadja a JSON-t a file_path paraméterrel

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Ellenőrizze Hook

```bash
#!/bin/bash
# Futtassa az összeállítást, a szöszölést, a típusellenőrzést, a formátumellenőrzést és a biztonsági auditot, amikor az ügynök befejeződik

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Alapértelmezés szerint a `scripts/agent-hooks/verify.sh` nem nulláról lép ki, ha a szükséges ellenőrzés sikertelen. Csak akkor állítsa be a `AGENT_VERIFY_MODE=advisory`-t, ha szándékosan jelre van szüksége egy törött fáról anélkül, hogy elzárná a horgot. Tartsa távol a `yarn knip`-t a keménykapun, kivéve, ha a repo kifejezetten úgy dönt, hogy meghiúsul tanácsadó importálási/függőségi problémák miatt.

### Fonal telepítési horog

```bash
#!/bin/bash
# Futtassa a corepack yarn telepítését a package.json módosításakor
# A Hook stdin-n keresztül fogadja a JSON-t a file_path paraméterrel

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

Konfigurálja a horgos vezetékezést az ügynöki eszköz dokumentumai szerint (`hooks.json`, egyenértékű stb.).

Ebben a repóban a `.codex/hooks/*.sh` és a `.cursor/hooks/*.sh` vékony burkolók maradnak, amelyek a `scripts/agent-hooks/` alatti megosztott megvalósításokra delegálnak.
