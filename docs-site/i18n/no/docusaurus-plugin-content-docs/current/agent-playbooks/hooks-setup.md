# Oppsett av Agent Hooks

Hvis AI-kodingsassistenten din støtter livssykluskroker, konfigurer disse for denne repoen.

## Anbefalte kroker

| Krok            | Kommando                                   | Formål                                                                                                                                                                       |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Autoformater filer etter AI-redigeringer                                                                                                                                     |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Kjør `corepack yarn install` når `package.json` endres                                                                                                                       |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Beskjær foreldede refs og slett integrerte midlertidige oppgavegrener                                                                                                        |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate build, lint, typecheck og format checks; hold `yarn npm audit` informativ og kjør `yarn knip` separat som en rådgivende revisjon når avhengigheter/importer endres |

## Hvorfor

- Konsekvent formatering
- Lockfile forblir synkronisert
- Bygge/lo/type problemer fanget opp tidlig
- Sikkerhetssynlighet via `yarn npm audit`
- Avhengighet/importdrift kan sjekkes med `yarn knip` uten å gjøre den om til en støyende global stoppkrok
- Én delt hook-implementering for både Codex og Cursor
- Midlertidige oppgavegrener forblir på linje med repoens arbeidstrearbeidsflyt

## Eksempel på Hook-skript

### Format krok

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

### Bekreft Hook

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

Som standard avsluttes `scripts/agent-hooks/verify.sh` fra null når en nødvendig kontroll mislykkes. Sett `AGENT_VERIFY_MODE=advisory` kun når du med vilje trenger signal fra et knust tre uten å blokkere kroken. Hold `yarn knip` utenfor den harde porten med mindre repoen eksplisitt bestemmer seg for å mislykkes på rådgivende import-/avhengighetsproblemer.

### Garnmonteringskrok

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

Konfigurer krokledninger i henhold til dokumentene for agentverktøyet (`hooks.json`, tilsvarende osv.).

I denne repoen bør `.codex/hooks/*.sh` og `.cursor/hooks/*.sh` forbli som tynne omslag som delegerer til de delte implementeringene under `scripts/agent-hooks/`.
