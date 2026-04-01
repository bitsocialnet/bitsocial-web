# Setup ng Agent Hooks

Kung sinusuportahan ng iyong AI coding assistant ang mga lifecycle hook, i-configure ang mga ito para sa repo na ito.

## Inirerekomendang Hooks

| Hook            | Utos                                       | Layunin                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Awtomatikong i-format ang mga file pagkatapos mag-edit ng AI                                                                                                                                                                       |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Patakbuhin ang `corepack yarn install` kapag nagbago ang `package.json`                                                                                                                                                            |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Putulin ang mga lipas na ref at tanggalin ang pinagsamang pansamantalang mga sangay ng gawain                                                                                                                                      |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate build, lint, typecheck, at mga pagsusuri sa format; panatilihing nagbibigay-kaalaman ang `yarn npm audit` at patakbuhin ang `yarn knip` nang hiwalay bilang isang advisory audit kapag nagbago ang mga dependency/import |

## Bakit

- Pare-parehong pag-format
- Nananatiling naka-sync ang Lockfile
- Ang mga isyu sa pagbuo/lint/type ay maagang nahuli
- Pagpapakita ng seguridad sa pamamagitan ng `yarn npm audit`
- Maaaring suriin ang dependency/import drift gamit ang `yarn knip` nang hindi ito ginagawang maingay na global stop hook
- Isang shared hook na pagpapatupad para sa Codex at Cursor
- Ang mga pansamantalang sangay ng gawain ay mananatiling nakahanay sa worktree workflow ng repo

## Mga Halimbawang Hook Script

### Format Hook

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

### I-verify ang Hook

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

Bilang default, ang `scripts/agent-hooks/verify.sh` ay lumalabas na hindi zero kapag nabigo ang isang kinakailangang pagsusuri. Itakda lang ang `AGENT_VERIFY_MODE=advisory` kapag sinadya mong kailangan ng signal mula sa isang sirang puno nang hindi nakaharang sa hook. Panatilihin ang `yarn knip` sa labas ng hard gate maliban kung tahasang nagpasya ang repo na mabigo sa mga isyu sa advisory import/dependency.

### Pag-install ng sinulid na Hook

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

I-configure ang hook wiring ayon sa iyong agent tool docs (`hooks.json`, katumbas, atbp.).

Sa repo na ito, dapat manatili ang `.codex/hooks/*.sh` at `.cursor/hooks/*.sh` bilang mga manipis na wrapper na nagde-delegate sa mga nakabahaging pagpapatupad sa ilalim ng `scripts/agent-hooks/`.
