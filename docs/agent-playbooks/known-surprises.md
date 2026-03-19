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
- **Mitigation:** Use `http://bitsocial.localhost:1355` first. Only bypass it with `PORTLESS=0 corepack yarn dev` when you explicitly need a direct Vite port.
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
