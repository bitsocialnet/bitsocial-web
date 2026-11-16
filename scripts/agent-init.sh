#!/bin/bash

set -euo pipefail

run_smoke=0
wait_timeout="${AGENT_INIT_TIMEOUT_SECONDS:-60}"
app_url=''
log_path="${AGENT_START_LOG:-${TMPDIR:-/tmp}/bitsocial-web-agent-start.log}"
# start-dev.mjs records the Portless URL it claimed (devServerUrlFile in dev-server-utils.mjs).
# Outside main/master it is <branch>.bitsocial.localhost, and the canonical URL may belong to
# another checkout, so only AGENT_APP_URL or this record identifies this checkout's server.
url_record=".dev-servers/about-url"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --smoke)
      run_smoke=1
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: ./scripts/agent-init.sh [--smoke]" >&2
      exit 1
      ;;
  esac
  shift
done

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

resolve_app_url() {
  if [ -n "${AGENT_APP_URL:-}" ]; then
    app_url="$AGENT_APP_URL"
  else
    app_url="$(sed -n '1p' "$url_record" 2>/dev/null || true)"
  fi
}

is_server_up() {
  resolve_app_url
  [ -n "$app_url" ] && curl -fsSk "$app_url" >/dev/null 2>&1
}

wait_for_server() {
  local started_at

  started_at="$(date +%s)"
  while [ $(( $(date +%s) - started_at )) -lt "$wait_timeout" ]; do
    if is_server_up; then
      return 0
    fi
    sleep 1
  done
  return 1
}

run_smoke_check() {
  local html

  html="$(curl -fsSk "$app_url")"
  if ! printf '%s' "$html" | grep -Eq 'id="root"|id='\''root'\''|Bitsocial'; then
    echo "Smoke check failed: expected app shell markers were not found at $app_url" >&2
    return 1
  fi
}

echo "Repo root: $repo_root"

if is_server_up; then
  echo "Dev server is already reachable."
else
  # The recorded server is not answering, so the record is stale.
  [ -n "${AGENT_APP_URL:-}" ] || rm -f "$url_record"
  echo "Dev server is not reachable. Starting corepack yarn start..."
  # Job control gives the server its own process group, so a timeout can stop all of it.
  set -m
  nohup corepack yarn start >"$log_path" 2>&1 &
  server_pid=$!
  set +m
  echo "Startup log: $log_path"

  if ! wait_for_server; then
    echo "Timed out waiting for ${app_url:-the URL start-dev records in $url_record}" >&2
    kill -TERM -- "-$server_pid" 2>/dev/null || true
    echo "Stopped the dev server this run started." >&2
    echo "Last log lines:" >&2
    tail -n 40 "$log_path" >&2 || true
    exit 1
  fi
fi

echo "App URL: $app_url"
echo "Dev server is ready."

if [ "$run_smoke" -eq 1 ]; then
  echo "Running smoke flow against the live dev server..."
  run_smoke_check
fi
