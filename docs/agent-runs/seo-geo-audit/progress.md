# Progress Log

Append one entry per session.

## 2026-06-21 13:10 +07

- Item: F001
- Summary: Created the long-running SEO/GEO audit state in a dedicated task worktree and started the baseline audit slice.
- Files: `docs/agent-runs/seo-geo-audit/feature-list.json`, `docs/agent-runs/seo-geo-audit/progress.md`
- Verification: pending baseline smoke, crawl, and benchmark checks
- Blockers: none
- Next: Run `./scripts/agent-init.sh --smoke`, collect crawl/index/source evidence, then rank gaps before editing production files.

## 2026-06-21 13:24 +07

- Item: F001, F002, F003
- Summary: Completed the first audit/fix/rerun loop. Fixed the critical docs build blocker caused by `js-yaml@4.2.0` being forced onto `gray-matter`, then fixed the high-impact stale indexed `/apps` catalog URL by adding a Vercel 308 route redirect to `/projects?category=apps`.
- Files: `package.json`, `yarn.lock`, `about/vercel.json`, `docs/agent-runs/seo-geo-audit/audit.md`, `docs/agent-runs/seo-geo-audit/feature-list.json`, `docs/agent-runs/seo-geo-audit/progress.md`
- Verification: `yarn build:verify`; `node -e "JSON.parse(require('fs').readFileSync('about/vercel.json','utf8'))"`; `yarn exec oxfmt --check about/vercel.json package.json docs/agent-runs/seo-geo-audit/feature-list.json docs/agent-runs/seo-geo-audit/progress.md docs/agent-runs/seo-geo-audit/audit.md`; `yarn lint`; `yarn typecheck`; `yarn deps:check-pinned`; `yarn deps:check-hardened`; `vercel dev --listen 127.0.0.1:3120 --yes` with `/apps` and `/apps/` returning 308 and `/apps/5chan` returning 200
- Blockers: Direct AI answer-engine result extraction was not available without an interactive browser/API session; live search result cleanup requires deployment and recrawl.
- Next: After deployment, rerun the same priority-query benchmark and consider docs JSON-LD plus title/snippet strengthening for `/docs/custom-challenges/` and `/docs/build-your-own-client/`.

## 2026-06-21 13:33 +07

- Item: F004, F005
- Summary: Completed the second audit/fix/rerun loop. Added `TechArticle` JSON-LD to Docusaurus doc pages, strengthened the builder and CLI docs titles/H1s, fixed the indexable docs search page's missing H1, regenerated LLM indexes, and reran the local crawl plus live search benchmark.
- Files: `docs/src/theme/DocItem/Metadata/index.tsx`, `docs/build-your-own-client.md`, `docs/developer-tools/cli.md`, `docs/search.mdx`, `about/public/llms.txt`, `about/public/llms-full.txt`, `docs/static/llms.txt`, `docs/static/llms-full.txt`, `docs/agent-runs/seo-geo-audit/audit.md`, `docs/agent-runs/seo-geo-audit/feature-list.json`, `docs/agent-runs/seo-geo-audit/progress.md`
- Verification: `yarn llms:generate`; `yarn docs:build:verify`; `yarn build:verify`; local HTML crawl over 40 built pages with 0 scoped failures; priority docs JSON-LD URL-to-canonical comparison; `yarn typecheck`; `yarn lint`; `yarn knip` advisory; `yarn format:check`; targeted `yarn exec oxfmt --check ...`
- Blockers: Live SERP cleanup and answer-engine citation changes require deployment plus crawler recrawl; direct Perplexity/You.com answer extraction still unavailable without interactive/API access.
- Next: Deploy the branch, rerun live crawl/benchmark after search recrawl, and decide whether low-priority generated category-index JSON-LD is worth adding.

## 2026-06-21 13:41 +07

- Item: F006
- Summary: Extended the answer-engine benchmark with `playwright-cli`. Perplexity was blocked by Cloudflare verification and You.com required login, so I fixed the highest-leverage local GEO gap still visible from benchmark evidence: brand/entity ambiguity. The homepage Organization/WebSite/WebPage JSON-LD now includes disambiguation, topical `knowsAbout`/`keywords`, Bluesky `sameAs`, and citations to source docs plus GitHub.
- Files: `about/src/lib/seo.ts`, `docs/agent-runs/seo-geo-audit/audit.md`, `docs/agent-runs/seo-geo-audit/feature-list.json`, `docs/agent-runs/seo-geo-audit/progress.md`
- Verification: `yarn llms:generate`; `yarn build:verify`; `yarn typecheck`; `yarn lint`; `yarn doctor`; SSR structured-data parse via `dist/server/entry-server.js`; direct served response parse from `PORTLESS=0 ABOUT_PORT=3100 yarn start:about`; targeted `yarn exec oxfmt --check ...`
- Blockers: Direct answer-engine answers still require login or passing bot verification. Live benchmark changes still require deployment and recrawl.
- Next: Before handoff/PR, run advisory code-quality review and final verification; after deployment, rerun live SERP and answer-engine checks.

## 2026-06-21 14:02 +07

- Item: F007
- Summary: Ran the advisory code-quality review pass and found one worthwhile internal-link refinement: the Docusaurus footer still used generic anchor text for the builder and CLI priority pages. Updated those links to match the improved titles/H1s.
- Files: `docs/docusaurus.config.ts`, `docs/agent-runs/seo-geo-audit/audit.md`, `docs/agent-runs/seo-geo-audit/feature-list.json`, `docs/agent-runs/seo-geo-audit/progress.md`
- Verification: `yarn llms:generate`; `yarn build:verify`; `yarn typecheck`; `yarn lint` with 512 existing warnings and 0 errors; targeted `yarn exec oxfmt --check ...`; built HTML check for the updated docs footer anchors
- Blockers: Live benchmark changes still require deployment and search-engine recrawl; direct Perplexity/You.com answer extraction still requires login or bot-verification access.
- Next: Deploy the branch, rerun live SERP checks after recrawl, and rerun AI answer-engine checks with authenticated or verification-passed access.
