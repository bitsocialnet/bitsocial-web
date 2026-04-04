# Agent Hooks Setup

If your AI coding assistant supports lifecycle hooks, configure these for this repo.

## Recommended Hooks

| Hook            | Command                                    | Purpose                                                                                                                                                                                             |
| --------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterFileEdit` | `scripts/agent-hooks/format.sh`            | Auto-format files after AI edits                                                                                                                                                                    |
| `afterFileEdit` | `scripts/agent-hooks/yarn-install.sh`      | Run `corepack yarn install` when `package.json` changes                                                                                                                                             |
| `stop`          | `scripts/agent-hooks/sync-git-branches.sh` | Prune stale refs and delete integrated temporary task branches                                                                                                                                      |
| `stop`          | `scripts/agent-hooks/verify.sh`            | Hard-gate targeted build verification, lint, typecheck, and format checks; keep `yarn npm audit` informational and run `yarn knip` separately as an advisory audit when dependencies/imports change |

## Why

- Consistent formatting
- Lockfile stays in sync
- Workspace-relevant build/lint/type issues caught early without forcing the full multi-locale docs build on every task
- Security visibility via `yarn npm audit`
- Dependency/import drift can be checked with `yarn knip` without turning it into a noisy global stop hook
- One shared hook implementation for both Codex and Cursor
- Temporary task branches stay aligned with the repo's worktree workflow

## Example Hook Scripts

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

### Verify Hook

```bash
#!/bin/bash
# Run targeted build verification, lint, typecheck, format check, and security audit when agent finishes

cat > /dev/null  # consume stdin
status=0
corepack yarn build:verify || status=1
corepack yarn lint || status=1
corepack yarn typecheck || status=1
corepack yarn format:check || status=1
echo "=== yarn npm audit ===" && (corepack yarn npm audit || true)  # informational
exit $status
```

By default, `scripts/agent-hooks/verify.sh` exits non-zero when a required check fails. Set `AGENT_VERIFY_MODE=advisory` only when you intentionally need signal from a broken tree without blocking the hook. Keep `yarn knip` out of the hard gate unless the repo explicitly decides to fail on advisory import/dependency issues.

### Yarn Install Hook

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

Configure hook wiring according to your agent tool docs (`hooks.json`, equivalent, etc.).

In this repo, `.codex/hooks/*.sh` and `.cursor/hooks/*.sh` should stay as thin wrappers that delegate to the shared implementations under `scripts/agent-hooks/`.
