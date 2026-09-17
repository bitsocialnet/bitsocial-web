# AGENTS.md

## Purpose and priority

Shared instructions for agents working on bitsocial-web. Explicit user instructions take precedence over repository workflow guidance. MUST rules are requirements; SHOULD rules are defaults. Read linked playbooks only when relevant.

Define completion for non-trivial work and continue through implementation, appropriate verification, and fixes within the requested scope. Use judgment for routine choices; ask only when missing information materially changes the result or an action lacks authorization. Skills do not create additional approval gates.

## Product and source of truth

Bitsocial Web is the public web monorepo for the about site, Bitsocial Chain landing site, Docusaurus documentation, and stats infrastructure. Preserve static deployment, existing routes, and workspace boundaries unless the user requests architectural changes.

Source, manifests, tests, docs, and runtime evidence establish behavior. AGENTS, skills, playbooks, task logs, and generated `llms*.txt` orient the agent; verify technical claims against source. Check the installed dependency version before assuming a sibling repository provides its implementation.

Record recurring repository surprises with concrete mitigation in [known-surprises.md](docs/agent-playbooks/known-surprises.md) after contributor confirmation. Continue independent work while any needed detail is unresolved.

## Working principles

- Understand the affected flow before editing. Prefer skipping unnecessary work, reusing repository code, native/standard-library features, then installed dependencies before adding code.
- Preserve unrelated edits. Keep changes scoped; avoid adjacent cleanup or broad reformatting without a task reason.
- Simplicity must preserve correctness, validation, accessibility, security, error handling, and useful tests.
- For a bug tied to a file/line, inspect `git log` or `git blame`, then relevant `git show`. Use reproduction or conclusive source/runtime evidence before fixing; see [bug-investigation.md](docs/agent-playbooks/bug-investigation.md).
- Prefer existing evidence before instrumentation. Remove only task-owned temporary logs/artifacts once verification is complete.

## Task router

| Task                                              | Guidance/check                                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Files in a directory with AGENTS.md               | Read that directory's instructions                                                                  |
| Code or automation changed                        | Select checks by impact in [verification.md](docs/agent-playbooks/verification.md)                  |
| React state/effects/data flow/performance changed | Read relevant React skill rules; use Doctor when diagnostics resolve a concern                      |
| UI/layout changed                                 | Verify affected flows; choose browsers/viewports using the verification playbook                    |
| Translation keys/values                           | Use `translate`; one writer applies all locale changes                                              |
| `package.json` changed                            | Run `corepack yarn install` and keep `yarn.lock` synchronized                                       |
| Dependencies/imports changed                      | Run advisory `yarn knip`; resolve relevant new findings                                             |
| AI workflow files changed                         | Edit shared sources; run `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test` |
| Bug fix or substantive review correction exposes a preventable mistake | Use [retro](.agents/skills/retro/SKILL.md) for the smallest worthwhile prevention |
| Public English docs or AI context changed         | Run `yarn llms:generate` and include resulting tracked indexes                                      |
| Open PR feedback or merge readiness               | Use `review-and-merge-pr` within the requested scope                                                |
| Durable handoff/resumption needed                 | Use [long-running-agent-workflow.md](docs/agent-playbooks/long-running-agent-workflow.md)           |
| Frontend design or visual review                  | Use `impeccable`; preserve the requested visual scope and existing product truth                    |
| Dependency manifest/lock changed                  | Keep `deps:check-pinned` and `deps:check-hardened` passing                                          |

## Code and product constraints

### Package and Dependency Rules

- Use Yarn 4 via Corepack, never `npm` or `bun`.
- Use exact versions for `dependencies`, `devDependencies`, and `optionalDependencies` in every tracked `package.json`. Do not introduce semver ranges, `^`, `~`, wildcard ranges, or tags like `latest`.
- Keep the repo's Yarn registry hardening enabled: exact-version defaults, checksum verification, and a 3-day `npmMinimalAgeGate`. If a dependency or lockfile change needs to bypass the age gate, document the reason before introducing a preapproval exception.
- Keep `yarn.lock` synchronized when dependency manifests change.
- Keep Yarn configured to add exact versions by default, keep `yarn deps:check-pinned` passing, and run `yarn deps:check-hardened` when dependency manifests or `yarn.lock` change.
- Respect the repo's existing dependency versioning style. Do not rewrite version ranges just to satisfy a personal preference.

### React Architecture Rules

- Keep route composition in `about/src/pages/`, reusable UI in `about/src/components/`, and shared helpers in `about/src/lib/`.
- Do not use `useEffect` to synchronize derived state that can be calculated during render.
- Prefer extracting repeated UI or logic instead of copy-pasting across pages.
- Use `@/` imports for `about/src/**`. Do not introduce new `../` imports into that source tree.
- Preserve `prefers-reduced-motion` fallbacks whenever you add or change animation.
- Use React Router for navigation instead of manual `window.location` changes unless there is a clear reason.

### Code Organization Rules

- Keep page components focused on page composition. Move reusable sections and primitives into `about/src/components/`.
- Follow the existing visual system in `about/src/index.css` and `about/tailwind.config.ts` instead of inventing a parallel styling layer.
- Add comments only for non-obvious reasoning, constraints, or tradeoffs.

### Security and Boundaries

- Never commit secrets or API keys.
- Never push to a remote unless the user explicitly asks.
- Do not build wallet integration, authentication, governance, token dashboards, or backend services in this repo.

## Git and ownership

- Keep `master` releasable. Default to short-lived `codex/feature/*`, `codex/fix/*`, `codex/docs/*`, or `codex/chore/*` branches unless the user asks otherwise.
- For an unrelated task on another active branch, use a descriptive worktree from `master`; never switch branches underneath another agent. Related delegated slices may share a checkout with non-overlapping ownership.
- Stage only task-owned changes, using selective patches for mixed files. Do not use `git add -A` by default. Preserve secrets, unrelated edits, and preexisting artifacts during cleanup.
- Only commit, push, publish, or merge when authorized; existing authorization persists through necessary steps. When a PR is requested, target `master` and make it ready for review unless a draft was requested.
- After an authorized merge, remove only the verified merged branch/worktree. Never perform Git cleanup from lifecycle hooks.
- Use `gh` for GitHub operations. Use [commit-issue-format.md](docs/agent-playbooks/commit-issue-format.md) for requested wording or actual commit/issue creation, not automatic suggestions.

## Verification and resources

- Use the narrowest reliable behavior checks first. Run applicable checks once for the final state, repeating only after changes, failures, or unresolved concerns. Preserve explicit CI/release/user requirements.
- Documentation-only work needs document/workflow checks, not an app build. Add regression tests for non-trivial testable bugs, not wording changes.
- Inspect active workloads before heavy work. Serialize installs, builds/full suites, React Doctor, Android/Electron work, and browser profiling across the task. One owner runs heavy verification; never stop processes of unclear ownership.
- Reuse a compatible dev server in the same worktree when safe. Otherwise record and clean up only the processes this task starts; never start a server for documentation-only work.
- Run browser engines sequentially through `./scripts/pw-session.sh open <session> ...` and `close <session>`. One browser is active machine-wide. Exit 75 means busy; defer or use the bounded wait. Close the exact owned session even after failure, never `close-all` or `kill-all`.
- Default to isolated sessions; personal-browser reuse requires authorization. A caller-owned session can be reused by a delegated helper without taking over its lifecycle.
- Review the final task-owned diff. Use `code-quality-review` for non-trivial changes or an explicit review; apply high-confidence in-scope findings. Doctor, Knip, and coverage are diagnostics, not new repository-wide gates.

## Skills and delegation

- Shared skills live in `.agents/skills/`; `.agents/roles/` is the repository's generator source, not a native discovery path. Commit generated `.claude/skills/`, `.codex/agents/`, `.claude/agents/`, and `.cursor/agents/` alongside sources. See [skills-and-tools.md](docs/agent-playbooks/skills-and-tools.md).
- Keep harness-specific hooks, permissions, and metadata explicit. Leave model and reasoning fields out of committed skills/custom agents so runtime invocation, user defaults, and inheritance control selection. Do not invent a `latest` model alias.
- Use built-in worker/explorer roles for ordinary implementation/research; custom roles cover browser checks, profiling, translation, review, and applicable Android checks. Avoid compulsory specialist chains.
- Delegate substantial independent work when it improves speed or context isolation. Give scope, acceptance criteria, context, ownership, and expected evidence. At most four workers by default; no overlapping writes or concurrent browser work.
- Use relevant React guidance for the changed state/effect/data flow; load `you-might-not-need-an-effect` for a focused uncertain effect/memo review. Do not apply Next.js/server rules indiscriminately to Vite clients.
- Prefer installed tools and CLIs. Look up current external APIs when needed; do not install skills merely because a normal task mentions their domain. Keep tool catalogs relevant; unused integrations add choices even when schemas are deferred.

## Commands and playbooks

Canonical dev URL: `https://bitsocial.localhost`; worktrees may use branch-scoped routes. `PORTLESS=0 yarn start` bypasses Portless. Workspace commands include `yarn start:about`, `yarn start:chain`, `yarn start:docs`, `yarn start:stats-monitor`. USB preview: `yarn start:android-usb` (`ANDROID_USB_OPEN_BROWSER=0` skips browser launch).

Use `yarn build:verify` for the affected workspace; `yarn build` is the full about/docs production build. Other checks: `yarn lint`, `yarn typecheck`, `yarn format:check`, `yarn doctor`, `yarn knip`. Preserve Yarn exact pins, hardening, and the existing age gate.

Load details when needed: [hooks](docs/agent-playbooks/hooks-setup.md), [verification](docs/agent-playbooks/verification.md), [skills/tools](docs/agent-playbooks/skills-and-tools.md), [long-running work](docs/agent-playbooks/long-running-agent-workflow.md), [known surprises](docs/agent-playbooks/known-surprises.md).

## React diagnostics and visual feedback

- Run `yarn agent:verify` after React integration changes: affected builds, automatic `doctor:check`, then `perf:check`. CI runs Doctor and deterministic runtime checks on affected frontend/tooling changes. Formatting hooks remain lightweight.
- Bippy is pinned and starts before React in development/profiling builds. Use `perf:record --target <about|chain|docs>` for committed render counts and official Profiler timings, and `perf:check` after React/Bippy/collector changes; its compatibility selftest runs automatically. Read `.agents/skills/profile-browsing/references/measurement.md`; missing instrumentation or dropped events is unavailable evidence, not a passing zero.
- Use explicit `build:profile:about`, `build:profile:chain`, or `build:profile:docs` outputs for production React profiling. Ordinary production bundles omit the collector. Keep browser ownership serialized and preserve JSON/trace evidence under `.react-perf/`.
- Doctor is a source diagnostic, with optional native tracing; its runtime JSON summary does not replace the committed-render collector. Agentation supplies visual feedback and is suppressed during profiling/automation. Use `inspect-elements` for independent source attribution.
