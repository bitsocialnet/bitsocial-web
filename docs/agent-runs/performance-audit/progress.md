# Progress Log

Append one entry per session.

## 2026-04-28 15:00

- Item: F001
- Summary: Resumed the performance audit branch, scraped the Apr 28 PageSpeed report with firecrawl, and found the previous draft disabled mobile background animation through viewport-only fallback gates.
- Files: `about/src/components/hero.tsx`, `about/src/components/polygon-mesh-background.tsx`, `about/src/lib/graphics-mode.tsx`
- Verification: `./scripts/agent-init.sh --smoke` failed before edits by timing out at `http://bitsocial.localhost:1355`; PageSpeed source captured in ignored `.firecrawl/`.
- Blockers: Need to rerun build/lint/type/doctor and browser checks after code cleanup.
- Next: Verify live graphics remain animated on mobile and only fall back for reduced motion or unsupported WebGL.

## 2026-04-28 15:09

- Item: F001
- Summary: Removed the mobile-only static fallback gate, narrowed graphics fallback policy to reduced motion or failed WebGL, kept WebP/static asset optimizations, and verified normal mobile still renders live graphics.
- Files: `about/src/lib/graphics-mode.tsx`, `about/src/components/hero.tsx`, `about/src/components/polygon-mesh-background.tsx`, `about/src/components/mesh-graphic/index.tsx`, `about/src/components/planet-graphic/index.tsx`
- Verification: `corepack yarn build:verify`, `corepack yarn lint`, `corepack yarn typecheck`, `corepack yarn format:check`, `corepack yarn doctor`, `corepack yarn knip`, `playwright-cli` Chrome/Firefox/WebKit desktop and mobile checks at `http://127.0.0.1:4174/`, Chrome reduced-motion fallback check, Chrome simulated WebGL-failure fallback check
- Blockers: none
- Next: Review whether the pre-existing formatting-only changes in `docs/agent-playbooks/hooks-setup.md` and `scripts/start-dev.mjs` belong in this branch before opening a PR.

## 2026-04-28 15:23

- Item: F001
- Summary: Fixed the first-load fallback flash by bootstrapping graphics as `pending`, rendering reserved empty space while live graphics lazy-load, and only preloading/static-rendering fallback images after fallback mode is confirmed. Also fixed the SSR guard for Node 22's global `navigator` so server HTML no longer emits the polygon fallback background.
- Files: `about/src/lib/graphics-mode.tsx`, `about/src/lib/bootstrap.ts`, `about/src/components/hero.tsx`, `about/src/components/polygon-mesh-background.tsx`
- Verification: `curl` confirmed server HTML uses `clientDefaults.graphicsMode:"pending"` and does not render fallback graphic markup; `playwright-cli` Chrome/Firefox/WebKit desktop and 390x844 mobile checks at `http://codex-fix-performance-audit.bitsocial.localhost:1355/` found no fallback image resources, no fallback image nodes, and four animated canvases in normal mode; Chrome reduced-motion and simulated WebGL-failure checks still use the WebP fallbacks; `corepack yarn build:verify`, `corepack yarn lint`, `corepack yarn typecheck`, `corepack yarn format:check`, `corepack yarn doctor`.
- Blockers: none
- Next: Decide whether the pre-existing `docs/agent-playbooks/hooks-setup.md` and `scripts/start-dev.mjs` changes should stay in this performance branch before PR/commit cleanup.
