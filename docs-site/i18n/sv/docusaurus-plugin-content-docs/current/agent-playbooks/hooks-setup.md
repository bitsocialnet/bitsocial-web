# Agent Hooks Setup

Om din AI-kodningsassistent stöder livscykelhakar, konfigurera dessa för denna repo.

## Rekommenderade krokar

| Krok            | Kommando                                   | Syfte                                                                                                                                                                             |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Autoformatera filer efter AI-redigeringar                                                                                                                                         |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Kör `corepack yarn install` när `package.json` ändras                                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Beskär inaktuella referenser och ta bort integrerade tillfälliga uppgiftsgrenar                                                                                                   |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate bygg-, lint-, typkontroll- och formatkontroller; hålla `yarn npm audit` informativ och kör `yarn knip` separat som en rådgivande revision när beroenden/importer ändras |

## Varför

- Konsekvent formatering
- Lockfile förblir synkroniserad
- Bygg-/ludd-/typproblem upptäcktes tidigt
- Säkerhetssynlighet via `yarn npm audit`
- Beroende/importdrift kan kontrolleras med `yarn knip` utan att förvandla den till en bullrig global stoppkrok
- En delad hook-implementering för både Codex och Cursor
- Tillfälliga uppgiftsgrenar förblir i linje med repans arbetsträdsarbetsflöde

## Exempel på Hook-skript

### Formatkrok

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

### Verifiera Hook

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

Som standard avslutas `scripts/agent-hooks/verify.sh` från noll när en obligatorisk kontroll misslyckas. Ställ in `AGENT_VERIFY_MODE=advisory` endast när du avsiktligt behöver signal från ett trasigt träd utan att blockera kroken. Håll `yarn knip` utanför den hårda porten såvida inte repet uttryckligen bestämmer sig för att misslyckas i rådgivande import-/beroendeproblem.

### Garninstallationskrok

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

Konfigurera krokledningar enligt dina agentverktygsdokument (`hooks.json`, motsvarande, etc.).

I denna repo bör `.codex/hooks/*.sh` och `.cursor/hooks/*.sh` förbli som tunna omslag som delegerar till de delade implementeringarna under `scripts/agent-hooks/`.
