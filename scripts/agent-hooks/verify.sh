#!/bin/bash

# stop hook: run required repo verification commands for agent-driven changes

set -u

mode="${AGENT_VERIFY_MODE:-strict}"

if [ "${1:-}" = "--advisory" ]; then
  mode="advisory"
  shift
fi

cat > /dev/null

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)" || exit 0

cleanup_generated_dir() {
  local path="$1"

  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    return
  fi

  if git ls-files --error-unmatch "$path" >/dev/null 2>&1; then
    if git diff --quiet -- "$path"; then
      return
    fi

    echo "=== git restore --worktree $path ==="
    git restore --worktree -- "$path" 2>&1 || true
    echo ""
    return
  fi

  if [ -e "$path" ]; then
    echo "=== rm -rf $path ==="
    rm -rf "$path" 2>&1 || true
    echo ""
  fi
}

run_required_check() {
  local label="$1"
  shift

  echo "=== $label ==="
  if "$@" 2>&1; then
    echo ""
    return 0
  fi

  echo ""
  return 1
}

dependency_state_changed() {
  ! git diff --quiet -- package.json docs-site/package.json yarn.lock
}

echo "Running pinned dependency check, build, lint, typecheck, format check, and security audit..."
echo ""

failures=0

run_required_check "corepack yarn deps:check-pinned" corepack yarn deps:check-pinned || failures=1
if dependency_state_changed; then
  run_required_check "corepack yarn deps:check-hardened" corepack yarn deps:check-hardened || failures=1
fi
run_required_check "corepack yarn build" corepack yarn build || failures=1
run_required_check "corepack yarn lint" corepack yarn lint || failures=1
run_required_check "corepack yarn typecheck" corepack yarn typecheck || failures=1
run_required_check "corepack yarn format:check" corepack yarn format:check || failures=1

echo "=== corepack yarn npm audit ==="
corepack yarn npm audit 2>&1 || true
echo ""

cleanup_generated_dir dist

if [ "$failures" -ne 0 ]; then
  if [ "$mode" = "advisory" ]; then
    echo "Verification failed, but AGENT_VERIFY_MODE=advisory so the hook is exiting 0."
    exit 0
  fi

  echo "Verification failed."
  exit 1
fi

echo "Verification complete."
exit 0
