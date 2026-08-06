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

### Vercel app production domains can drift back to Git master deployments

- **Date:** 2026-04-28
- **Observed by:** Tommaso + Codex
- **Context:** Verifying Seedit and 5chan app mirrors in the Bitsocial Web app directory.
- **What was surprising:** The Vercel `seedit` and `5chan` projects had `gitProviderOptions.createDeployments = "enabled"`, so GitHub `master` pushes were promoted to the production domains even though the repo policy expects production app mirrors to serve release artifacts only.
- **Impact:** App-directory verified mirror badges can become false because production domains serve the latest development commit instead of the GitHub release ZIP whose `index.html` hash is recorded in `about/src/lib/apps-data.ts`.
- **Mitigation:** Before adding or refreshing mirror verification metadata, check the Vercel project with `vercel api /v9/projects/<project-id>` and confirm `gitProviderOptions.createDeployments = "disabled"`. Deploy release ZIP contents with `vercel deploy --prebuilt --prod` and use `seedit-omega.vercel.app` or `5chan-omega.vercel.app` for development deployments.
- **Status:** confirmed

### Portless 0.11 reuses legacy proxy state unless the launcher forces HTTPS

- **Date:** 2026-04-28
- **Observed by:** Tommaso + Codex
- **Context:** Upgrading the normal `yarn start` flow from the old `http://bitsocial.localhost:1355` proxy URL to `https://bitsocial.localhost`.
- **What was surprising:** Even with `portless@0.11.1` installed, Portless reused the existing `~/.portless/proxy.port = 1355` HTTP proxy and printed the legacy `:1355` URL.
- **Impact:** Updating package versions and docs is not enough; `yarn start` can still advertise and use the old URL when a contributor has legacy Portless state running.
- **Mitigation:** Keep the start scripts explicitly starting the Portless HTTPS proxy on port `443` before registering app routes, so the runtime flow migrates away from persisted `1355` state instead of inheriting it.
- **Status:** confirmed

### Portless changes the canonical local app URL

- **Date:** 2026-03-18
- **Observed by:** Codex
- **Context:** Browser verification and smoke flows
- **What was surprising:** The default local URL is not the usual Vite port. The repo expects `https://bitsocial.localhost` through Portless, so checking `localhost:3000` or `localhost:5173` can hit the wrong app or nothing at all.
- **Impact:** Browser checks can fail or validate the wrong target even when the dev server is healthy.
- **Mitigation:** Use `https://bitsocial.localhost` first. Only bypass it with `PORTLESS=0 corepack yarn start` when you explicitly need a direct Vite port.
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
- **Mitigation:** Keep Portless startup behind `scripts/start-dev.mjs`, which now uses a branch-scoped `*.bitsocial.localhost` route outside the canonical case and falls back to a branch-scoped route when the bare `bitsocial.localhost` name is already occupied.
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

### Multilocale docs preview can spike RAM during verification

- **Date:** 2026-04-01
- **Observed by:** Codex
- **Context:** Fixing docs i18n, locale routing, and Pagefind behavior with `yarn start:docs` plus Playwright
- **What was surprising:** The default docs preview mode now does a full multilocale docs build plus Pagefind indexing before serving, and keeping that process alive alongside multiple Playwright or Chrome sessions can consume much more RAM than a normal Vite or single-locale Docusaurus dev loop.
- **Impact:** The machine can become memory-constrained, browser sessions can crash, and interrupted runs can leave stale docs servers or headless browsers behind that keep consuming memory.
- **Mitigation:** For docs work that does not need locale-route or Pagefind verification, prefer `DOCS_START_MODE=live yarn start:docs`. Only use the default multilocale preview when you need to validate translated routes or Pagefind. Keep a single Playwright session, close old browser sessions before opening new ones, and stop the docs server after verification if you no longer need it.
- **Status:** confirmed

### `translate-docs.py` can leave docs locales half-translated or with broken link targets

- **Date:** 2026-04-06
- **Observed by:** Codex
- **Context:** Fixing localized docs routes and content after `yarn start:docs` served English detail pages or failed to build locale output
- **What was surprising:** The docs translation pipeline had two repo-specific failure modes at once: `scripts/translate-docs.py` only extracted a small subset of `DocsHome` messages when `tr(...)` calls used forms it did not parse, and translated markdown under `docs/i18n/**` could contain machine-translated slugs or `ZXQPLACEHOLDER` artifacts inside link targets.
- **Impact:** Localized homepages can silently fall back to English, localized detail pages can appear untranslated, and full `yarn docs:build` can fail on broken locale links even though the source docs are valid.
- **Mitigation:** After changing docs translations or regenerating locale files, always run `yarn docs:build` from the repo root, scan `docs/i18n/**` markdown for `ZXQPLACEHOLDER`, and verify translated links still point to canonical doc slugs such as `/apps/5chan/` instead of translated URL paths. If `DocsHome` copy changed, confirm `scripts/translate-docs.py` still extracts all `docs.home.*` messages.
- **Status:** confirmed

### About-site no-JS checks must use the Portless route, not a standalone SSR preview

- **Date:** 2026-04-12
- **Observed by:** Codex
- **Context:** Verifying no-JS support for the `about/` site from a branch worktree
- **What was surprising:** A standalone SSR preview can look healthy while the actual branch-scoped Portless route is still serving the wrong app shell or an older process. In this repo, the real local contract is the Portless hostname from `yarn start`, not an ad hoc preview server.
- **Impact:** Agents can incorrectly claim no-JS support works, or miss regressions that only show up on `*.bitsocial.localhost`.
- **Mitigation:** For `about/` browser verification, always start the real local server with `yarn start` or `yarn start:about` and test the branch-scoped Portless URL first. If a Portless hostname looks stale, inspect and stop the old process before retesting.
- **Status:** confirmed

### `chain/` was invisible to `yarn build:verify` and `yarn doctor`

- **Date:** 2026-07-05
- **Observed by:** Codex
- **Context:** Verifying a chain/-only diff after the `chain/` workspace (standalone Vite app for `chain.bitsocial.net`) was added to the monorepo.
- **What was surprising:** `scripts/verify-build.mjs` only recognized `about/`, `docs/`, and `stats/` path prefixes, so a chain/-only diff printed "No targeted build checks matched the current diff" and ran no build at all, even though `build:chain` already existed in the root `package.json`. Separately, `yarn doctor` was hard-coded to `react-doctor about -y`, so React changes under `chain/src` got zero React Doctor coverage.
- **Impact:** Agents verifying chain changes had to know to call `yarn build:chain` directly instead of trusting `yarn build:verify`, and React issues in `chain/src` (effects, hooks, dead code) went undetected by `yarn doctor`.
- **Mitigation:** `scripts/verify-build.mjs` now has a `chain/` branch mirroring the `about/` one, and `doctor` / `doctor:verbose` now run `react-doctor --project about,chain -y` in a single invocation. `doctor:score` stays `about`-only because `--score` silently prints nothing when combined with `--project` for more than one project; use `yarn react-doctor --project about,chain --verbose -y` (or `--json`) if a chain score is needed.
- **Status:** confirmed

### Browser P2P runs on secure WebSockets; pkc-js denies WebRTC and WebTransport by default

- **Date:** 2026-08-02
- **Observed by:** Claude
- **Context:** Writing landing-page and docs copy about how Bitsocial browser P2P works
- **What was surprising:** `@pkcprotocol/pkc-js` ships a default connection gater that rejects WebRTC and WebTransport dials in the browser — `dist/browser/helia/dial-transport-filter.js` exports `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Its source comment gives the reason: in the browser those transports add long, often-failing connection-establishment paths (STUN/ICE, certhash rotation) that slow loads, while WebSocket is direct and reliable. Every live peer on the blog's P2P status panel shows "Secure WebSocket". The gater lives in `node_modules`, so nothing in the repo hints at it.
- **Impact:** It is very easy to write technically plausible but false public copy — for example crediting WebTransport reaching browser Baseline in March 2026 for making Bitsocial browser P2P possible. That claim shipped into the landing page, the comparison table, and two docs pages before the developer caught it. Wrong architecture claims on public pages are checked by exactly the developer audience the site targets.
- **Mitigation:** Never infer which transports Bitsocial uses from what libp2p or the browser platform supports in principle. Check `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` for the current deny list, confirm no `connectionGater` override exists under `about/src/`, and read the live transport labels in the blog's "P2P status" panel before making any public claim. The upstream change that actually unblocked browser publishing was the gossipsub monotonic-seqno fix in `@libp2p/gossipsub` 15.0.21 (May 2026); pkc-js currently ships 16.0.4.
- **Status:** confirmed

### Relative `./page.md` links from an untranslated docs page break every localized build

- **Date:** 2026-08-02
- **Observed by:** Claude
- **Context:** Adding a new English-only page, `docs/browser-p2p.md`, that linked to existing docs with `./peer-to-peer-protocol.md` and `./apps/5chan.md`
- **What was surprising:** Each locale under `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` mirrors the docs tree. A new page absent from those mirrors still renders in every locale via English fallback, but its relative markdown links no longer resolve — Docusaurus emits `/ar/browser-p2p/peer-to-peer-protocol.md/` and fails the build with "Docusaurus found broken links!". Crucially, `yarn build:verify` and `yarn docs:build:verify` build only `en` and pass cleanly; only a full `yarn docs:build` surfaces it, and it aborts on the first locale alphabetically (`ar`).
- **Impact:** A docs change can pass every fast local check and still break the production multilocale build. The failure also looks unrelated to the change, since the error names a locale path the author never touched.
- **Mitigation:** In any docs page that is not mirrored into `docs/i18n/**`, use root-relative links (`/peer-to-peer-protocol/`, `/apps/5chan/`) instead of relative `.md` links; Docusaurus prefixes them with the locale automatically. `docs/build-your-own-client.md` is the existing example. Run a full `yarn docs:build` — not just `build:verify` — before handing off any change that adds or links a docs page.
- **Status:** confirmed

### `update-translations.js` must be run from `about/`, and concurrent runs silently lose keys

- **Date:** 2026-08-02
- **Observed by:** Claude
- **Context:** Applying 26 translated i18next keys across all 36 locales via the `translate` skill
- **What was surprising:** Two separate traps in the same script. First, `scripts/update-translations.js` resolves its target as `path.join(process.cwd(), "public", "translations")`, but this repo keeps translations at `about/public/translations`. Running the documented command from the repo root fails every invocation with "Translations directory not found" — `docs/agent-playbooks/translations.md` shows `node scripts/update-translations.js ...`, which reads as a repo-root command. Second, each invocation is a read-modify-write over all 36 locale files, so two invocations running at once clobber each other and one key vanishes with no error. The `translate` skill explicitly instructs spawning up to 4 subagents concurrently, each of which would call the script.
- **Impact:** The repo-root form fails loudly and wastes a full pass. The concurrency issue fails silently: keys go missing from arbitrary locales, and the diff still looks plausible.
- **Mitigation:** Run it as `cd about && node ../scripts/update-translations.js --key <key> --map <abs-path> --write`. Never let translator subagents write locale files concurrently — have them emit dictionary JSON files only, then apply every key serially from the parent agent. After applying, verify programmatically that each key exists in all 35 non-English locales and that no value is byte-identical to the English source.
- **Status:** confirmed
