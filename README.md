[![License](https://img.shields.io/badge/license-AGPL--3.0--only-red.svg)](https://github.com/bitsocialnet/5chan/blob/master/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Bitsocial Web

Bitsocial Web is the public web monorepo for Bitsocial.

It currently serves:

- `https://bitsocial.net/` for the public Bitsocial landing/about site
- `https://bitsocial.net/docs/` for Docusaurus docs
- `https://bitsocial.net/stats/` for the Grafana-backed stats dashboard

The public URL strategy is route-first, not subdomain-first. Until the flagship web client takes over `bitsocial.net`, docs and stats stay under the main domain for SEO and brand consolidation.

## Repo Layout

```text
about/   Public Bitsocial landing/about site
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

- Contains the Bitsocial landing/about site
- Keeps static assets and translations in `about/public/`
- Should not be treated as the long-term home for the apps dashboard or the blog

### `docs/`

- Contains the canonical Docusaurus project
- Translation source lives in `docs/i18n/`
- Contributor playbooks and long-running agent state also live here

### `stats/`

- Contains the Grafana/Prometheus stack and deployment files
- The executable monitor service lives in `stats/monitor/`
- Public traffic still lands on `bitsocial.net/stats/`, with Vercel proxying to the VPS-hosted Grafana origin

### Future Splits

- The apps dashboard at `/apps` is expected to become its own subproject, and later may move to `apps.bitsocial.net`.
- The blog is also expected to become its own subproject rather than continue to live under `about/`.
- `about/` should stay focused on explaining Bitsocial as a whole.

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

### Verified App Mirror Deployments

The `/apps` catalog can show a verified check next to app mirrors when a mirror serves
the same HTML entrypoint hash as an official GitHub release artifact. This is meant to
attest release parity, not domain ownership.

For 5chan and Seedit verified web links, the Vercel `5chan` and `seedit` projects are
configured so Git pushes do not automatically create deployments:

```text
gitProviderOptions.createDeployments = "disabled"
```

Production domains such as `5chan.cc`, `5channel.org`, `5chan.app`, `seedit.app`,
`www.seedit.app`, and `p2p.seedit.app` should only be updated from a GitHub release
or tag deployment. Do not point those domains at a raw `master` deployment unless
that deployment has first been promoted into an official release and its static HTML
artifact hash has been checked.

When adding or updating mirror verification metadata in `about/src/lib/apps-data.ts`,
verify the live mirror HTML against the matching release ZIP before showing the badge.
If the live hash does not match a GitHub release artifact, leave the mirror unverified
until the mirror is redeployed from the release or a new release is cut for the served
artifact.

## Commit Workflow

This repo uses Commitizen for Conventional Commits.

- Interactive: `corepack yarn commit`
- Non-interactive agent commits should use `git commit --no-verify -m "message"` because the Husky Commitizen hook expects a TTY
