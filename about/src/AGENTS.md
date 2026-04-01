# src/AGENTS.md

These rules apply to `src/**`. Follow the repo-root `AGENTS.md` first, then use this file for code inside the application source tree.

- Keep route composition in `src/pages/`, reusable UI in `src/components/`, and shared helpers in `src/lib/`.
- Before adding state, decide whether it belongs in render, local component state, a reusable hook, or shared context. Do not introduce a new global state library without a clear repo need.
- Use `@/` imports for source files.
- Avoid `useEffect` for derived state that can be computed during render.
- When changing React UI logic, run `corepack yarn doctor` in addition to build, lint, and typecheck. When changing layout or interaction, verify desktop and mobile behavior with `playwright-cli`.
- Prefer extending nearby tests when a file or behavior is already covered. If there is no existing test harness for the area, call that out instead of silently skipping verification.
