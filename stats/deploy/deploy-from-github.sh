#!/usr/bin/env bash

set -Eeuo pipefail

readonly repository="bitsocialnet/bitsocial-web"
readonly target_dir="/srv/bitsocial-web/current"
readonly deploy_script_path="/usr/local/sbin/bitsocial-stats-deploy"
readonly public_dashboard_url="http://127.0.0.1:3300/api/public/dashboards/e9277bcc0c421ddcacd29f591466678c"

log() {
  printf '[bitsocial-stats-deploy] %s\n' "$*"
  logger -t bitsocial-stats-deploy -- "$*" || true
}

get_revision() {
  if [[ $# -eq 1 && $1 =~ ^[0-9a-f]{40}$ ]]; then
    printf '%s\n' "$1"
    return
  fi

  if [[ ${SSH_ORIGINAL_COMMAND:-} =~ ^deploy[[:space:]]+([0-9a-f]{40})$ ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
    return
  fi

  printf 'Expected: deploy <40-character commit SHA>\n' >&2
  exit 64
}

wait_for_url() {
  local url=$1
  local attempts=${2:-90}

  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    if curl --fail --silent --show-error --max-time 10 "$url" >/dev/null; then
      return
    fi
    sleep 2
  done

  printf 'Timed out waiting for %s\n' "$url" >&2
  return 1
}

revision=$(get_revision "$@")
exec 9>/run/lock/bitsocial-stats-deploy.lock
if ! flock -n 9; then
  printf 'Another stats deployment is already running.\n' >&2
  exit 75
fi

work_dir=$(mktemp --directory)
trap 'rm -rf "$work_dir"' EXIT
archive_path="$work_dir/release.tar.gz"
release_root="$work_dir/release"

log "deploying revision $revision"
comparison=$(curl \
  --fail \
  --silent \
  --show-error \
  --retry 5 \
  --retry-all-errors \
  "https://api.github.com/repos/$repository/compare/$revision...master")
comparison_status=$(python3 -c 'import json, sys; print(json.load(sys.stdin)["status"])' <<< "$comparison")
if [[ $comparison_status != "ahead" && $comparison_status != "identical" ]]; then
  printf 'Revision %s is not on the master branch.\n' "$revision" >&2
  exit 67
fi

curl \
  --fail \
  --location \
  --retry 5 \
  --retry-all-errors \
  --connect-timeout 15 \
  --output "$archive_path" \
  "https://github.com/$repository/archive/$revision.tar.gz"

mkdir -p "$release_root"
tar --extract --gzip --file "$archive_path" --directory "$release_root" --strip-components=1

for required_file in \
  package.json \
  stats/deploy/compose.yaml \
  stats/deploy/deploy-from-github.sh \
  stats/grafana/dashboards/bitsocial-stats.json \
  stats/monitor/Dockerfile; do
  if [[ ! -f "$release_root/$required_file" ]]; then
    printf 'Release is missing %s\n' "$required_file" >&2
    exit 65
  fi
done

if [[ ! -f "$target_dir/stats/deploy/.env" ]]; then
  printf 'Missing protected deployment environment at %s/stats/deploy/.env\n' "$target_dir" >&2
  exit 66
fi

bash -n "$release_root/stats/deploy/deploy-from-github.sh"
python3 -m json.tool "$release_root/stats/grafana/dashboards/bitsocial-stats.json" >/dev/null
release_compose=(
  docker compose
  --env-file "$target_dir/stats/deploy/.env"
  -f "$release_root/stats/deploy/compose.yaml"
)
"${release_compose[@]}" config --quiet
"${release_compose[@]}" build ipfs monitor

rsync \
  --archive \
  --delete \
  --exclude '.firecrawl/' \
  --exclude '.git/' \
  --exclude '.playwright-cli/' \
  --exclude 'node_modules/' \
  --exclude 'stats/deploy/.env' \
  "$release_root/" \
  "$target_dir/"

cd "$target_dir"
compose=(docker compose --env-file stats/deploy/.env -f stats/deploy/compose.yaml)
"${compose[@]}" up --detach --no-build --remove-orphans

wait_for_url "http://127.0.0.1:3301/metrics/prometheus"
"${compose[@]}" run --rm grafana-bootstrap
wait_for_url "$public_dashboard_url"

metrics=$(curl --fail --silent --show-error http://127.0.0.1:3301/metrics/prometheus)
grep -q '^# HELP bitsocial_stats_network_ipns_http_routers_peer_location_count ' <<< "$metrics"

dashboard=$(curl --fail --silent --show-error "$public_dashboard_url")
grep -q '"type":"markers"' <<< "$dashboard"
grep -q '"mode":"coords"' <<< "$dashboard"

printf '%s\n' "$revision" > "$target_dir/.deploy-revision"
install -m 0755 "$release_root/stats/deploy/deploy-from-github.sh" "$deploy_script_path"
log "deployed revision $revision successfully"
printf 'deployed_revision=%s\n' "$revision"
