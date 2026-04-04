# Konfigurimi i Agent Hooks

Nëse asistenti juaj i kodimit të AI mbështet grepa të ciklit jetësor, konfiguroni ato për këtë depo.

## Grepa të rekomanduara

| Hook            | Komanda                                    | Qëllimi                                                                                                                                                                                                               |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Formatoni automatikisht skedarët pas modifikimeve të AI                                                                                                                                                               |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Ekzekutoni `corepack yarn install` kur ndryshon `package.json`                                                                                                                                                        |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Shkurtoj refs ndenjur dhe fshij degët e integruara të përkohshme të detyrave                                                                                                                                          |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Ndërtimi i portës së fortë, lintimi, kontrolli i shkrimit dhe kontrollet e formatit; mbajeni `yarn npm audit` informativ dhe ekzekutoni `yarn knip` veçmas si një auditim këshillues kur ndryshojnë varësitë/importet |

## Pse

- Formatim konsistent
- Lockfile qëndron në sinkron
- Çështjet e ndërtimit/grave/llopit u kapën herët
- Dukshmëria e sigurisë nëpërmjet `yarn npm audit`
- Zhvendosja e varësisë/importit mund të kontrollohet me `yarn knip` pa e kthyer atë në një goditje globale të zhurmshme
- Zbatim i një grepi të përbashkët si për Codex ashtu edhe për Kursorin
- Degët e përkohshme të detyrave qëndrojnë në linjë me fluksin e punës të pemës së punës së repos

## Shembull Hook Scripts

### Formati Hook

```bash
#!/bin/bash
# Formatoni automatikisht skedarët JS/TS pas modifikimeve të AI
# Hook merr JSON nëpërmjet stdin me file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Verifiko Hook

```bash
#!/bin/bash
# Ekzekutoni ndërtimin, lint, kontrollin e tipit, kontrollin e formatit dhe auditimin e sigurisë kur agjenti përfundon

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Si parazgjedhje, `scripts/agent-hooks/verify.sh` del jo zero kur një kontroll i kërkuar dështon. Cakto `AGENT_VERIFY_MODE=advisory` vetëm kur të duhet qëllimisht sinjal nga një pemë e thyer pa bllokuar grepin. Mbajeni `yarn knip` jashtë portës së vështirë, përveç nëse repo vendos në mënyrë eksplicite të dështojë për çështjet këshilluese të importit/varësisë.

### Hook i instalimit të fijeve

```bash
#!/bin/bash
# Ekzekutoni instalimin e fijeve të corepack kur ndryshohet package.json
# Hook merr JSON nëpërmjet stdin me file_path

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

Konfiguro lidhjen me grep sipas dokumenteve të veglave të agjentit (`hooks.json`, ekuivalent, etj.).

Në këtë repo, `.codex/hooks/*.sh` dhe `.cursor/hooks/*.sh` duhet të qëndrojnë si mbështjellës të hollë që delegohen te zbatimet e përbashkëta nën `scripts/agent-hooks/`.
