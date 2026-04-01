[![License](https://img.shields.io/badge/license-AGPL--3.0--only-red.svg)](https://github.com/bitsocialnet/5chan/blob/master/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Bitsocial Web

Bitsocial Web is the public web monorepo for Bitsocial.

It currently serves:

- `https://bitsocial.net/` for the public marketing and ecosystem site
- `https://bitsocial.net/docs/` for Docusaurus docs
- `https://bitsocial.net/stats/` for the Grafana-backed stats dashboard

The public URL strategy is route-first, not subdomain-first. Until the flagship web client takes over `bitsocial.net`, docs and stats stay under the main domain for SEO and brand consolidation.

## Repo Layout

```text
about/   Public marketing and ecosystem site
docs/    Docusaurus docs, i18n files, and contributor playbooks
stats/   Grafana, Prometheus, Docker Compose, deploy config, and monitor package
scripts/ Shared repo scripts and agent hooks
```

Each top-level subproject has its own local documentation:

- [`about/README.md`](./about/README.md)
- [`docs/README.md`](./docs/README.md)
- [`stats/README.md`](./stats/README.md)

The repo root remains the orchestration layer for installs, verification, and cross-project commands.

## Getting Started

Use the pinned Node.js version from [`.nvmrc`](./.nvmrc) and Yarn 4 via Corepack.

```bash
nvm install && nvm use
corepack enable
corepack yarn install
```

The main local URL is:

- `http://bitsocial.localhost:1355`

Portless keeps a stable named local URL. On non-`master` branches, the repo can fall back to a branch-scoped `*.bitsocial.localhost:1355` route so parallel worktrees do not collide.

## Common Commands

```bash
corepack yarn start
corepack yarn start:android-usb
corepack yarn start:ios-sim
corepack yarn build
corepack yarn lint
corepack yarn typecheck
corepack yarn format:check
corepack yarn doctor
corepack yarn build:stats-dashboards
corepack yarn stats:up
corepack yarn stats:down
corepack yarn stats:logs
```

## Verification

Before committing code changes, run:

```bash
corepack yarn build
corepack yarn lint
corepack yarn typecheck
corepack yarn format:check
```

If you changed React UI logic in `about/src/**`, also run:

```bash
corepack yarn doctor
```

If dependencies or manifests changed, also run:

```bash
corepack yarn deps:check-pinned
corepack yarn deps:check-hardened
corepack yarn knip
```

## Subproject Notes

### `about/`

- Contains the Bitsocial public site, not just the `/` landing route
- Includes the home, about, apps, and blog pages
- Keeps static assets and translations in `about/public/`

### `docs/`

- Contains the canonical Docusaurus project
- Translation source lives in `docs/i18n/`
- Contributor playbooks and long-running agent state also live here

### `stats/`

- Contains the Grafana/Prometheus stack and deployment files
- The executable monitor service lives in `stats/monitor/`
- Public traffic still lands on `bitsocial.net/stats/`, with Vercel proxying to the VPS-hosted Grafana origin

## Translations

Landing-site translations live under:

- `about/public/translations/{lang}/default.json`

Docs translations live under:

- `docs/i18n/{lang}/...`

For translation workflow details, see [`docs/agent-playbooks/translations.md`](./docs/agent-playbooks/translations.md).

## AI Contributor Policy

This repo uses tracked AI workflow files and instructions. Read [`AGENTS.md`](./AGENTS.md) before making changes.

Relevant local rules also live in:

- [`about/AGENTS.md`](./about/AGENTS.md)
- [`about/src/AGENTS.md`](./about/src/AGENTS.md)
- [`docs/AGENTS.md`](./docs/AGENTS.md)
- [`stats/AGENTS.md`](./stats/AGENTS.md)

## Deployment Shape

- `bitsocial.net` is served by Vercel
- `/docs` is served from the docs build
- `/stats` is routed through Vercel to the VPS-hosted Grafana stack
- `newsletter.bitsocial.net` remains separate

## Commit Workflow

This repo uses Commitizen for Conventional Commits.

- Interactive: `corepack yarn commit`
- Non-interactive agent commits should use `git commit --no-verify -m "message"` because the Husky Commitizen hook expects a TTY
