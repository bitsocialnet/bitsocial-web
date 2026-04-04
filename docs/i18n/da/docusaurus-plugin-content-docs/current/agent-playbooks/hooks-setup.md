# Agent Hooks-opsætning

Hvis din AI-kodningsassistent understøtter livscykluskroge, skal du konfigurere disse til denne repo.

## Anbefalede kroge

| Krog            | Kommando                                   | Formål                                                                                                                                                                       |
| --------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Autoformater filer efter AI-redigeringer                                                                                                                                     |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Kør `corepack yarn install`, når `package.json` ændres                                                                                                                       |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Beskær forældede refs og slet integrerede midlertidige opgavegrene                                                                                                           |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate build, lint, typecheck og format checks; hold `yarn npm audit` informativ og kør `yarn knip` separat som en rådgivende revision, når afhængigheder/importer ændres |

## Hvorfor

- Konsekvent formatering
- Lockfile forbliver synkroniseret
- Bygge/fnug/type problemer fanget tidligt
- Sikkerhedssynlighed via `yarn npm audit`
- Afhængighed/importdrift kan kontrolleres med `yarn knip` uden at gøre den til en larmende global stopkrog
- En delt hook-implementering til både Codex og Cursor
- Midlertidige opgavegrene forbliver på linje med repo's worktree workflow

## Eksempel Hook Scripts

### Formater krog

```bash
#!/bin/bash
# Autoformater JS/TS-filer efter AI-redigeringer
# Hook modtager JSON via stdin med file_path

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

case "$file_path" in
  *.js|*.jsx|*.ts|*.tsx|*.mjs|*.cjs|*.json|*.css) corepack yarn exec oxfmt "$file_path" 2>/dev/null ;;
esac
exit 0
```

### Bekræft Hook

```bash
#!/bin/bash
# Kør build, lint, typecheck, format check og security audit, når agenten er færdig

cat > /dev/null  # consume stdin
status=0
corepack yarn build || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

Som standard afsluttes `scripts/agent-hooks/verify.sh` ikke-nul, når en påkrævet kontrol mislykkes. Indstil kun `AGENT_VERIFY_MODE=advisory`, når du med vilje har brug for signal fra et knækket træ uden at blokere krogen. Hold `yarn knip` ude af den hårde gate, medmindre repoen udtrykkeligt beslutter sig for at fejle i rådgivende import/afhængighedsproblemer.

### Garnmonteringskrog

```bash
#!/bin/bash
# Kør corepack yarn installation, når package.json ændres
# Hook modtager JSON via stdin med file_path

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

Konfigurer krogledninger i henhold til dine agentværktøjsdokumenter (`hooks.json`, tilsvarende osv.).

I denne repo bør `.codex/hooks/*.sh` og `.cursor/hooks/*.sh` forblive som tynde omslag, der uddelegerer til de delte implementeringer under `scripts/agent-hooks/`.
