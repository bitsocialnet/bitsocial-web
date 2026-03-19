# AGENTS.md

## Purpose

This file defines the always-on rules for AI agents working on Bitsocial Web.
Use this as the default policy. Load linked playbooks only when their trigger condition applies.

## Surprise Handling

The role of this file is to reduce recurring agent mistakes and confusion points in this repository.
If you encounter something surprising or ambiguous while working, alert the developer immediately.
After confirmation, add a concise entry to `docs/agent-playbooks/known-surprises.md` so future agents avoid the same issue.
Only record items that are repo-specific, likely to recur, and have a concrete mitigation.

## Project Overview

Bitsocial Web is the public-facing landing page and ecosystem entrypoint for Bitsocial.

## Instruction Priority

- **MUST** rules are mandatory.
- **SHOULD** rules are strong defaults unless task context requires a different choice.
- If guidance conflicts, prefer: user request > MUST > SHOULD > playbooks.

## Task Router (Read First)

| Situation                                                                                                                    | Required action                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React UI logic changed (`src/components`, `src/pages`, `src/app.tsx`, `src/main.tsx`, `src/lib`)                             | Follow React architecture rules below and run `yarn doctor`                                                                                                                                          |
| `package.json` changed                                                                                                       | Run `yarn install` to keep `yarn.lock` in sync                                                                                                                                                        |
| Translation key/value changed                                                                                                | Use `docs/agent-playbooks/translations.md`                                                                                                                                                           |
| Bug report in a specific file/line                                                                                           | Start with git history scan from `docs/agent-playbooks/bug-investigation.md` before editing                                                                                                          |
| UI or visual behavior changed                                                                                                | Verify in browser with `playwright-cli`; check desktop and mobile behavior when relevant                                                                                                             |
| Browsing performance regression, rerender hotspot, or route jank needs investigation                                         | Use the `profile-browsing` skill                                                                                                                                                                     |
| Need to map a rendered DOM node back to the React file that produced it                                                      | Use the `inspect-elements` skill                                                                                                                                                                     |
| Long-running task spans multiple sessions, handoffs, or spawned agents                                                       | Use `docs/agent-playbooks/long-running-agent-workflow.md`, keep a machine-readable feature list plus a progress log, and run `./scripts/agent-init.sh --smoke` before starting a fresh feature slice |
| New reviewable feature, fix, docs change, or chore started while on `master`                                                 | Create a short-lived `codex/feature/*`, `codex/fix/*`, `codex/docs/*`, or `codex/chore/*` branch from `master` before editing; use a separate worktree only for parallel tasks                       |
| New unrelated task started while another task branch is already checked out or being worked on by another agent              | Create a separate worktree from `master`, create a new short-lived task branch there, and keep each agent on its own worktree, branch, and PR                                                        |
| Open PR needs feedback triage or merge readiness check                                                                       | Use the `review-and-merge-pr` skill                                                                                                                                                                  |
| Repo AI workflow files changed (`.codex/**`, `.cursor/**`, `AGENTS.md`, `docs/agent-playbooks/**`, `scripts/agent-hooks/**`) | Keep the Codex and Cursor copies aligned when they represent the same workflow; update `AGENTS.md` if the default agent policy changes                                                               |
| GitHub operation needed                                                                                                      | Use `gh` CLI, not GitHub MCP                                                                                                                                                                         |
| User asks for commit or issue phrasing                                                                                       | Use `docs/agent-playbooks/commit-issue-format.md`                                                                                                                                                    |
| Surprising or ambiguous repo behavior encountered                                                                            | Alert the developer and, once confirmed, document it in `docs/agent-playbooks/known-surprises.md`                                                                                                    |

## Stack

- React 18 + TypeScript
- React Router v6
- Vite
- Yarn 4 via Corepack
- Tailwind CSS
- Radix UI
- i18next
- react-doctor
- oxlint
- oxfmt
- tsgo

## Project Structure

```text
src/
├── components/   # Reusable UI components
├── pages/        # Route-level page composition
├── lib/          # Utilities and helpers
├── assets/       # Imported static assets
└── index.css     # Global styles
```

## Core MUST Rules

### Package and Dependency Rules

- Use Yarn 4 via Corepack, never `npm` or `bun`.
- Keep `yarn.lock` synchronized when dependency manifests change.
- Respect the repo's existing dependency versioning style. Do not rewrite version ranges just to satisfy a personal preference.

### React Architecture Rules

- Keep route composition in `src/pages/`, reusable UI in `src/components/`, and shared helpers in `src/lib/`.
- Do not use `useEffect` to synchronize derived state that can be calculated during render.
- Prefer extracting repeated UI or logic instead of copy-pasting across pages.
- Use `@/` imports for `src/**`. Do not introduce new `../` imports into the source tree.
- Preserve `prefers-reduced-motion` fallbacks whenever you add or change animation.
- Use React Router for navigation instead of manual `window.location` changes unless there is a clear reason.

### Code Organization Rules

- Keep page components focused on page composition. Move reusable sections and primitives into `src/components/`.
- Follow the existing visual system in `src/index.css` and `tailwind.config.ts` instead of inventing a parallel styling layer.
- Add comments only for non-obvious reasoning, constraints, or tradeoffs.

### Git Workflow Rules

- Keep `master` releasable. Do not treat `master` as a scratch branch.
- If the user asks for a reviewable feature or fix and the current branch is `master`, create a short-lived task branch before making code changes unless the user explicitly asks to work directly on `master`.
- Name short-lived AI task branches by intent under the Codex prefix: `codex/feature/*`, `codex/fix/*`, `codex/docs/*`, `codex/chore/*`.
- Open PRs from task branches into `master` so review bots can run against the actual change.
- Prefer short-lived task branches over long-lived staging branches unless the user explicitly asks otherwise.
- Use worktrees only when parallel tasks need isolated checkouts. One active task branch per worktree.
- If a new task is unrelated to the currently checked out branch, do not stack it on that branch. Create a new worktree from `master` and create a separate short-lived task branch there.
- Prefer `./scripts/create-task-worktree.sh <feature|fix|docs|chore> <slug>` when you need a new task worktree and do not have a stronger repo-specific reason to create it manually.
- Treat branch and worktree as different things: the branch is the change set; the worktree is the checkout where that branch is worked on.
- For parallel unrelated tasks, give each task its own branch from `master`, its own worktree, and its own PR into `master`.

### Bug Investigation Rules

- For bug reports tied to a specific file or line, check relevant git history before any fix.
- Minimum sequence: `git log --oneline` or `git blame` first, then scoped `git show` for relevant commits.
- Full workflow: `docs/agent-playbooks/bug-investigation.md`.

### Verification Rules

- Never mark work complete without verification.
- Use the Node 22.12.0 toolchain from `.nvmrc`; after `corepack enable`, run plain `yarn` commands.
- After code changes, run `yarn build`, `yarn lint`, and `yarn typecheck`.
- Before handing off a PR or commit, also run `yarn format:check`.
- After React UI logic changes, run `yarn doctor`.
- Treat React Doctor output as actionable guidance; prioritize `error` then `warning`.
- For UI or visual changes, verify with `playwright-cli` on the local dev URL and cover a mobile viewport flow when the change affects layout, touch behavior, or responsiveness.
- The shared hook verification path is strict by default. Only set `AGENT_VERIFY_MODE=advisory` when you intentionally need signal from a broken tree without blocking the session.
- If verification fails, fix and re-run until passing or until you hit a real blocker you can explain concretely.
- Do not commit or force-add generated build output. `dist/` is the main generated output in this repo; remove or restore it after local verification before committing.

### Tooling Constraints

- Use `gh` CLI for GitHub work.
- Do not use GitHub MCP.
- Do not use browser MCP servers. Use `playwright-cli`.
- If many MCP tools are present in context, warn the user and suggest disabling the unused ones.

### AI Tooling Rules

- Treat `.codex/` and `.cursor/` as repo-managed contributor tooling, not private scratch space.
- Keep equivalent workflow files aligned across both toolchains when both directories contain the same skill, hook, or agent.
- Keep shared policy in tracked files when possible: `AGENTS.md`, `src/AGENTS.md`, `scripts/AGENTS.md`, `docs/agent-playbooks/**`, and `scripts/agent-hooks/**`.
- When changing shared agent behavior, update the relevant files in `.codex/skills/`, `.cursor/skills/`, `.codex/agents/`, `.cursor/agents/`, `.codex/hooks/`, `.cursor/hooks/`, and their `hooks.json` or config entry points as needed.
- Review `.codex/config.toml` and `.cursor/hooks.json` before changing agent orchestration or hook behavior, because they are the entry points contributors will actually load.
- Directory-specific auto-loaded rules live under `src/AGENTS.md` and `scripts/AGENTS.md`; read them before editing files in those trees.
- For work expected to span multiple sessions, keep explicit task state in a `feature-list.json` plus `progress.md` pair using `docs/agent-playbooks/long-running-agent-workflow.md`.
- If more than one human or toolchain needs the same task state, keep it in a tracked location such as `docs/agent-runs/<slug>/` instead of burying it in a tool-specific hidden directory.

### Security and Boundaries

- Never commit secrets or API keys.
- Never push to a remote unless the user explicitly asks.
- Do not build wallet integration, authentication, governance, token dashboards, or backend services in this repo.

## Core SHOULD Rules

- Keep context lean: delegate heavy or verbose tasks when possible.
- For complex work, parallelize independent checks.
- When touching already-covered logic, prefer extending nearby tests or clearly call out the missing coverage if the repo area has no existing test harness.
- When proposing or implementing meaningful code changes, include both:
  - a Conventional Commit title suggestion
  - a short GitHub issue suggestion
    Use the format playbook: `docs/agent-playbooks/commit-issue-format.md`.
- When stuck on a bug, search the web for recent fixes or workarounds.
- After user corrections, identify the root cause and apply the lesson in subsequent steps.

## Local Development URLs

This project uses [Portless](https://github.com/vercel-labs/portless) for local dev. The dev server is available at `http://bitsocial.localhost:1355` instead of a random port. To bypass Portless, use `PORTLESS=0 yarn dev`.

## Common Commands

```bash
yarn install
yarn dev            # http://bitsocial.localhost:1355
yarn build
yarn lint
yarn typecheck
yarn format:check
yarn doctor
yarn doctor:score
yarn doctor:verbose
./scripts/create-task-worktree.sh chore ai-workflow-improvement
./scripts/agent-init.sh --smoke
```

## Playbooks (Load On Demand)

Use these only when relevant to the active task:

- Hooks setup and scripts: `docs/agent-playbooks/hooks-setup.md`
- Long-running agent workflow: `docs/agent-playbooks/long-running-agent-workflow.md`
- Translations workflow: `docs/agent-playbooks/translations.md`
- Commit and issue output format: `docs/agent-playbooks/commit-issue-format.md`
- Skills and tools setup: `docs/agent-playbooks/skills-and-tools.md`
- Bug investigation workflow: `docs/agent-playbooks/bug-investigation.md`
- Known surprises log: `docs/agent-playbooks/known-surprises.md`
