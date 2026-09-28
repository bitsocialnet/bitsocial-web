# src/AGENTS.md

These rules apply to `src/**`. Follow the repo-root `AGENTS.md` first, then use this file for code inside the application source tree.

- Keep route composition in `src/pages/`, reusable UI in `src/components/`, and shared helpers in `src/lib/`.
- Before adding state, decide whether it belongs in render, local component state, a reusable hook, or shared context. Do not introduce a new global state library without a clear repo need.
- Use `@/` imports for source files.
- Avoid `useEffect` for derived state that can be computed during render.
- Select affected checks using `docs/agent-playbooks/verification.md`. Review relevant React rules for state/effect/data-flow changes; use Doctor when its diagnostics resolve a concern. Verify affected layout/interaction flows and viewports with `playwright-cli`.
- Prefer extending nearby tests when a file or behavior is already covered. If there is no existing test harness for the area, call that out instead of silently skipping verification.
