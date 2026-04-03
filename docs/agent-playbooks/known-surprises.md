# Known Surprises

This file tracks repository-specific confusion points that caused agent mistakes.

## Entry Criteria

Add an entry only if all are true:

- It is specific to this repository (not generic advice).
- It is likely to recur for future agents.
- It has a concrete mitigation that can be followed.

If uncertain, ask the developer before adding an entry.

## Entry Template

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entries

### Portless changes the canonical local app URL

- **Date:** 2026-03-18
- **Observed by:** Codex
- **Context:** Browser verification and smoke flows
- **What was surprising:** The default local URL is not the usual Vite port. The repo expects `http://bitsocial.localhost:1355` through Portless, so checking `localhost:3000` or `localhost:5173` can hit the wrong app or nothing at all.
- **Impact:** Browser checks can fail or validate the wrong target even when the dev server is healthy.
- **Mitigation:** Use `http://bitsocial.localhost:1355` first. Only bypass it with `PORTLESS=0 corepack yarn start` when you explicitly need a direct Vite port.
- **Status:** confirmed

### Commitizen hooks block non-interactive commits

- **Date:** 2026-03-18
- **Observed by:** Codex
- **Context:** Agent-driven commit workflows
- **What was surprising:** `git commit` triggers Commitizen through Husky and waits for interactive TTY input, which hangs non-interactive agent shells.
- **Impact:** Agents can stall indefinitely during what should be a normal commit.
- **Mitigation:** Use `git commit --no-verify -m "message"` for agent-created commits. Humans can still use `corepack yarn commit` or `corepack yarn exec cz`.
- **Status:** confirmed

### Corepack is required to avoid Yarn classic

- **Date:** 2026-03-19
- **Observed by:** Codex
- **Context:** Package manager migration to Yarn 4
- **What was surprising:** The machine still has a global Yarn classic install on `PATH`, so running plain `yarn` can resolve to v1 instead of the pinned Yarn 4 version.
- **Impact:** Developers can accidentally bypass the repo's package-manager pinning and get different install behavior or lockfile output.
- **Mitigation:** Use `corepack yarn ...` for shell commands, or run `corepack enable` first so plain `yarn` resolves to the pinned Yarn 4 version.
- **Status:** confirmed

### Fixed Portless app names collide across Bitsocial Web worktrees

- **Date:** 2026-03-30
- **Observed by:** Codex
- **Context:** Starting `yarn start` in one Bitsocial Web worktree while another worktree was already serving through Portless
- **What was surprising:** Using the literal Portless app name `bitsocial` in every worktree makes the route itself collide, even when the backing ports are different, so the second process fails because `bitsocial.localhost` is already registered.
- **Impact:** Parallel Bitsocial Web branches can block each other even though Portless is meant to let them coexist safely.
- **Mitigation:** Keep Portless startup behind `scripts/start-dev.mjs`, which now uses a branch-scoped `*.bitsocial.localhost:1355` route outside the canonical case and falls back to a branch-scoped route when the bare `bitsocial.localhost` name is already occupied.
- **Status:** confirmed

### Docs preview used to hard-code port 3001

- **Date:** 2026-03-30
- **Observed by:** Codex
- **Context:** Running `yarn start` alongside other local repos and agents
- **What was surprising:** The root dev command ran the docs workspace with `docusaurus start --port 3001`, so the whole dev session failed whenever another process already owned `3001`, even though the main app already used Portless.
- **Impact:** `yarn start` could kill the web process immediately after it booted, interrupting unrelated local work over a docs-port collision.
- **Mitigation:** Keep docs startup behind `yarn start:docs`, which now uses Portless plus `scripts/start-docs.mjs` to honor an injected free port or fall back to the next available port when run directly.
- **Status:** confirmed

### Fixed docs Portless hostname was hard-coded

- **Date:** 2026-04-03
- **Observed by:** Codex
- **Context:** Running `yarn start` in a secondary Bitsocial Web worktree while another worktree was already serving docs through Portless
- **What was surprising:** `start:docs` still registered the literal `docs.bitsocial.localhost` hostname, so `yarn start` could fail even though the about app already knew how to avoid Portless route collisions for its own hostname.
- **Impact:** Parallel worktrees could not reliably use the root dev command because the docs process exited first and `concurrently` then killed the rest of the session.
- **Mitigation:** Keep docs startup behind `scripts/start-docs.mjs`, which now derives the same branch-scoped Portless hostname as the about app and injects that shared public URL into the `/docs` dev proxy target.
- **Status:** confirmed

### Worktree shells can miss the repo's pinned Node version

- **Date:** 2026-04-03
- **Observed by:** Codex
- **Context:** Running `yarn start` in Git worktrees such as `.claude/worktrees/*` or sibling worktree checkouts
- **What was surprising:** Some worktree shells resolved `node` and `yarn node` to Homebrew Node `25.2.1` even though the repo pins `22.12.0` in `.nvmrc`, so `yarn start` could silently run the dev launchers under the wrong runtime.
- **Impact:** Dev-server behavior can drift between the main checkout and worktrees, making bugs hard to reproduce and violating the repo's expected Node 22 toolchain.
- **Mitigation:** Keep the dev launchers behind `scripts/start-dev.mjs` and `scripts/start-docs.mjs`, which now re-exec under the `.nvmrc` Node binary when the current shell is on the wrong version. Shell setup should still prefer `nvm use`.
- **Status:** confirmed

### `docs-site/` leftovers can hide missing docs source after the refactor

- **Date:** 2026-04-01
- **Observed by:** Codex
- **Context:** Post-merge monorepo cleanup after moving the Docusaurus project from `docs-site/` to `docs/`
- **What was surprising:** The old `docs-site/` folder can remain on disk with stale but important files like `i18n/`, even after the tracked repo moved to `docs/`. That makes the refactor look duplicated locally and can hide the fact that tracked docs translations were not actually moved into `docs/`.
- **Impact:** Agents can delete the old folder as “junk” and accidentally lose the only local copy of docs translations, or keep editing scripts that still point at the dead `docs-site/` path.
- **Mitigation:** Treat `docs/` as the only canonical docs project. Before deleting any local `docs-site/` leftovers, restore tracked source like `docs/i18n/` and update scripts and hooks to stop referencing `docs-site`.
- **Status:** confirmed
