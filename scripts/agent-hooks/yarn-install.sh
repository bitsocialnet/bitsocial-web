#!/bin/bash

# afterFileEdit hook: run corepack yarn install when package.json is changed
# Receives JSON via stdin: {"file_path": "...", "edits": [...]}

input=$(cat)
file_path=$(echo "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*:.*"\([^"]*\)"/\1/')

if [ -z "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  package.json|*/package.json)
    repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
    cd "$repo_root" || exit 0
    echo "package.json changed - running corepack yarn deps:install:hardened to update yarn.lock..."
    corepack yarn deps:install:hardened
    ;;
esac

exit 0
