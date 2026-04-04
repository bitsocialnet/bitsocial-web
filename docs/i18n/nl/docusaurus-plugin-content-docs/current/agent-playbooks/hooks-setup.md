# Agent Hooks instellen

Als uw AI-codeerassistent lifecycle hooks ondersteunt, configureer deze dan voor deze opslagplaats.

## Aanbevolen Hooks

| Haak            | Commando                                   | Doel                                                                                                                                                                                       |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Bestanden automatisch formatteren na AI-bewerkingen                                                                                                                                        |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Voer `corepack yarn install` uit wanneer `package.json` verandert                                                                                                                          |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Snoei verouderde refs op en verwijder geïntegreerde tijdelijke taakvertakkingen                                                                                                            |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate build-, lint-, typecheck- en formatcontroles; houd `yarn npm audit` informatief en voer `yarn knip` afzonderlijk uit als adviesaudit wanneer afhankelijkheden/imports veranderen |

## Waarom

- Consistente opmaak
- Lockfile blijft gesynchroniseerd
- Build/lint/type-problemen vroegtijdig opgemerkt
- Beveiligingszichtbaarheid via `yarn npm audit`
- Afhankelijkheid/importdrift kan worden gecontroleerd met `yarn knip` zonder er een luidruchtige globale stop hook van te maken
- Eén gedeelde hook-implementatie voor zowel Codex als Cursor
- Tijdelijke taakvertakkingen blijven afgestemd op de werkboomworkflow van de repository

## Voorbeeld Hook Scripts

### Hook opmaken

```bash
#!/bin/bash
# JS/TS-bestanden automatisch opmaken na AI-bewerkingen
# Hook ontvangt JSON via stdin met file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Hook verifiëren

```bash
#!/bin/bash
# Voer build, lint, typecheck, formatcontrole en beveiligingsaudit uit wanneer de agent klaar is

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

`scripts/agent-hooks/verify.sh` eindigt standaard niet-nul wanneer een vereiste controle mislukt. Stel `AGENT_VERIFY_MODE=advisory` alleen in als u opzettelijk een signaal van een gebroken boom nodig heeft zonder de haak te blokkeren. Houd `yarn knip` buiten de harde poort, tenzij de repository expliciet besluit te mislukken vanwege adviserende import-/afhankelijkheidsproblemen.

### Gareninstallatiehaak

```bash
#!/bin/bash
# Voer corepack-gareninstallatie uit wanneer package.json is gewijzigd
# Hook ontvangt JSON via stdin met file_path

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

Configureer hook-bedrading volgens de documentatie van uw agenttool (`hooks.json`, gelijkwaardig, enz.).

In deze repository `.codex/hooks/*.sh` en `.cursor/hooks/*.sh` moet als dunne wrappers blijven die delegeren naar de gedeelde implementaties onder `scripts/agent-hooks/`.
