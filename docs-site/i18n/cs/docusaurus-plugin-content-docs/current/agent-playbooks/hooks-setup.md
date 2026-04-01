# Nastavení Agent Hooks

Pokud váš asistent kódování AI podporuje háčky životního cyklu, nakonfigurujte je pro toto úložiště.

## Doporučené háčky

| Háček           | Příkaz                                     | Účel                                                                                                                                                                                         |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Automatické formátování souborů po úpravách AI                                                                                                                                               |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Spustit `corepack yarn install` při změně `package.json`                                                                                                                                     |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Ořízněte zastaralé odkazy a odstraňte integrované větve dočasné úlohy                                                                                                                        |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Sestavení hard-gate, lint, typová kontrola a kontrola formátu; ponechat `yarn npm audit` informační a spustit `yarn knip` samostatně jako poradenský audit, když se změní závislosti/importy |

## Proč?

- Konzistentní formátování
- Lockfile zůstává synchronizován
- Problémy se sestavením/vlákněním/typem byly zachyceny brzy
- Viditelnost zabezpečení přes `yarn npm audit`
- Posun závislosti/importu lze zkontrolovat pomocí `yarn knip`, aniž by se z něj stal hlučný globální brzdový hák
- Jedna sdílená implementace háku pro Codex i Cursor
- Větve dočasných úkolů zůstávají v souladu s pracovním postupem pracovního stromu repo

## Příklad hákových skriptů

### Formátovat háček

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

### Ověřte Hook

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

Ve výchozím nastavení se `scripts/agent-hooks/verify.sh` ukončí nenulovou hodnotou, když selže požadovaná kontrola. `AGENT_VERIFY_MODE=advisory` nastavte pouze tehdy, když záměrně potřebujete signál ze zlomeného stromu bez blokování háku. Udržujte `yarn knip` mimo pevnou bránu, pokud se repo výslovně nerozhodne selhat při problémech s importem/závislostí.

### Háček pro instalaci příze

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

Nakonfigurujte hákové zapojení podle dokumentů vašeho agenta (`hooks.json`, ekvivalent atd.).

V tomto úložišti by `.codex/hooks/*.sh` a `.cursor/hooks/*.sh` měly zůstat jako tenké obaly, které delegují sdílené implementace pod `scripts/agent-hooks/`.
