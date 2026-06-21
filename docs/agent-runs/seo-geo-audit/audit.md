# SEO/GEO Audit

Date: 2026-06-21
Worktree: `/Users/Tommaso/Desktop/bitsocial/bitsocial-web-seo-geo-audit`
Branch: `codex/chore/seo-geo-audit`

## Scope

Audited crawlability, indexation, page intent, titles, internal links, structured data, source citations, and answer-first content for the public about app and docs app.

Evidence sources:

- Local production build: `yarn build:verify`
- Local SSR crawl: `PORTLESS=0 ABOUT_PORT=3100 yarn start:about`
- Local Vercel route smoke: `vercel dev --listen 127.0.0.1:3120 --yes`
- Live crawl samples: `https://bitsocial.net/apps`, `https://bitsocial.net/projects`
- Local docs HTML crawl over `dist/docs`
- Search benchmark via web search for priority queries, rerun after each local fix loop
- AI answer-engine browser benchmark using `playwright-cli` against Perplexity and You.com
- GEO readiness proxy: `llms.txt`, `llms-full.txt`, answer-first snippets, structured data, and source links.

## Priority Query Map

| Query                                                    | Intended answer-ready page                                                                                 | Benchmark result                                                                          | Status                         |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| `Bitsocial`                                              | `https://bitsocial.net/`                                                                                   | Homepage appears, but Bit Social WordPress plugin also competes for the exact brand term. | Improved local entity metadata |
| `Bitsocial peer-to-peer social network`                  | `https://bitsocial.net/` and `/docs/peer-to-peer-protocol/`                                                | Homepage result exposes the core answer-first description.                                | Good                           |
| `Bitsocial IPFS social apps`                             | `https://bitsocial.net/` and `/docs/peer-to-peer-protocol/`                                                | Homepage and external Reddit/GitHub references appear.                                    | Good                           |
| `Bitsocial 5chan`                                        | `/apps/5chan` and `/docs/apps/5chan/`                                                                      | GitHub repo appears prominently; app/docs pages are valid crawl targets.                  | Good                           |
| `decentralized social network no servers no global bans` | `https://bitsocial.net/`                                                                                   | Homepage appears for the concept query.                                                   | Good                           |
| `Bitsocial anti spam challenge`                          | `https://bitsocial.net/#arbitrary-challenges`, `/docs/custom-challenges/`, `/docs/anti-spam/spam-blocker/` | Homepage appears; stale `/apps` result also appears.                                      | Fixed technical gap            |
| `Bitsocial CLI peer to peer social`                      | `/apps/bitsocial-cli`, `/docs/developer-tools/cli/`                                                        | Clear internal target pages exist; doc title/H1 now says `Bitsocial CLI`.                 | Improved                       |
| `build Bitsocial client`                                 | `/docs/build-your-own-client/`                                                                             | Internal target exists; doc title/H1 now says `Build your own Bitsocial client`.          | Improved                       |

## Ranked Gaps

1. Critical: docs build and local crawl baseline failed because the root resolution forced `gray-matter`'s `js-yaml@^3.13.1` dependency to `js-yaml@4.2.0`, where `safeLoad` is removed. This blocked reliable docs build verification and local production crawl evidence.
2. High: `https://bitsocial.net/apps` is still indexed in search results as the old catalog URL, while current public catalog intent lives at `/projects`. Live `/apps` returned 200 with a noindex 404 shell, wasting ranking signals and confusing answer engines.
3. Medium: priority docs pages had titles, descriptions, canonicals, and H1s, but no JSON-LD. This was an enhancement opportunity, not a critical crawl/index issue.
4. Low: docs `/search/` rendered without an H1 while remaining indexable in the sitemap.
5. Medium: `Bitsocial anti spam challenge` currently maps most clearly to the homepage section and GitHub topic results; `/docs/custom-challenges/` is the better long-form target but is not the strongest benchmark result yet.
6. Medium: exact brand and answer-engine queries can collide with similarly named WordPress/plugin and crypto surfaces. The homepage had strong Organization/WebSite JSON-LD, but no explicit disambiguating description, topic list, or structured source citations.

## Fixes Applied

1. Restored `gray-matter` compatibility by pinning only the legacy `js-yaml@^3.13.1` range to `js-yaml@3.14.2`, while leaving the modern `js-yaml@^4.1.0` consumers on `4.2.0`.
2. Added a Vercel `routes`-native 308 redirect for exact `/apps` and `/apps/` requests to `/projects?category=apps`. App detail routes such as `/apps/5chan` still return 200.
3. Added Docusaurus doc-item JSON-LD for docs pages as `TechArticle`, with canonical URL, headline, description, language, publisher, author, and modified date when available.
4. Strengthened priority doc titles/H1s:
   - `/docs/build-your-own-client/`: `Build your own Bitsocial client`
   - `/docs/developer-tools/cli/`: `Bitsocial CLI`
5. Added a visible H1 to `/docs/search/` while keeping the reusable Pagefind component heading as an H2.
6. Added homepage entity disambiguation and source-citation metadata:
   - Organization `legalName`, `disambiguatingDescription`, `knowsAbout`, and Bluesky `sameAs`.
   - WebSite topical `keywords`.
   - WebPage `citation` links to the peer-to-peer protocol, custom challenges, local moderation, identity/ownership docs, and GitHub organization.
7. Tightened footer internal-link anchor text for two priority docs targets:
   - `/docs/build-your-own-client/`: `Build your own Bitsocial client`
   - `/docs/developer-tools/cli/`: `Bitsocial CLI`

## After Checks

- `yarn build:verify`: passes after dependency fix.
- Local SSR sample pages `/`, `/projects`, `/privacy`, `/apps/5chan`, `/apps/bitsocial-cli`, `/apps/ai-moderation-challenge`: all returned 200 with title, canonical, indexable robots, H1, and JSON-LD.
- Generated `dist/robots.txt`: allows crawl, disallows `/api/` and `/stats`, points to both about and docs sitemaps.
- Generated `dist/sitemap.xml`: lists canonical about routes.
- Generated `dist/docs/sitemap.xml`: lists docs routes.
- Priority docs local crawl after the JSON-LD fix:
  - `/docs/build-your-own-client/`: title, canonical, one H1, indexable defaults, and `TechArticle` JSON-LD with URL matching canonical.
  - `/docs/developer-tools/cli/`: title, canonical, one H1, indexable defaults, and `TechArticle` JSON-LD with URL matching canonical.
  - `/docs/custom-challenges/`: title, canonical, one H1, indexable defaults, and `TechArticle` JSON-LD with URL matching canonical.
  - `/docs/peer-to-peer-protocol/`: title, canonical, one H1, indexable defaults, and `TechArticle` JSON-LD with URL matching canonical.
- Local docs/about crawl check after the search H1 fix: 40 HTML pages checked; 39 docs pages; 37 pages with JSON-LD; 0 failures for title, canonical, H1, noindex, or priority-doc JSON-LD checks.
- Live `https://bitsocial.net/robots.txt`: allows crawl, disallows `/api/` and `/stats`, and lists both `https://bitsocial.net/sitemap.xml` and `https://bitsocial.net/docs/sitemap.xml`.
- Live `https://bitsocial.net/docs/sitemap.xml`: includes `/docs/build-your-own-client/`, `/docs/custom-challenges/`, `/docs/developer-tools/cli/`, and `/docs/peer-to-peer-protocol/`.
- Live benchmark rerun on 2026-06-21:
  - `Bitsocial peer-to-peer social network`: homepage remains a strong answer-first result.
  - `Bitsocial anti spam challenge`: homepage and GitHub topic results appear; live stale `/apps` still appears until this branch deploys and search engines recrawl.
  - `build Bitsocial client`: broad search competition remains; homepage appears for builder intent, and the local docs page now has clearer title/H1 once deployed.
  - Exact `site:bitsocial.net/docs` title searches did not return stable results through the available web search tool, but live robots and sitemap expose the target docs URLs.
- Vercel local route smoke:
  - `/apps`: 308 to `/projects?category=apps`
  - `/apps/`: 308 to `/projects?category=apps`
  - `/apps/5chan`: 200 OK
- AI answer-engine benchmark on 2026-06-21:
  - Perplexity headless Chrome request to `https://www.perplexity.ai/search?q=what%20is%20Bitsocial` reached Cloudflare security verification (`Just a moment...`) and did not expose an answer.
  - You.com headless Chrome request to `https://you.com/search?q=what%20is%20Bitsocial` loaded but returned `Please log in to use You.com.` instead of an answer.
  - Both browser sessions were closed after capture.
- Entity-disambiguation verification:
  - `yarn build:verify` passed after the schema update.
  - Direct SSR render from `dist/server/entry-server.js` includes Organization `disambiguatingDescription`, `knowsAbout`, Bluesky `sameAs`, WebSite `keywords`, and WebPage citations.
  - Direct served response from `PORTLESS=0 ABOUT_PORT=3100 yarn start:about` at `http://127.0.0.1:3100/` returned one H1 and the same disambiguation/citation structured data.
- Footer internal-link verification:
  - `docs/docusaurus.config.ts` now uses the same Bitsocial-specific anchor text as the priority docs titles/H1s for the builder and CLI pages.
  - `yarn llms:generate` completed after the footer copy update.
  - `yarn build:verify`, `yarn typecheck`, and targeted `yarn exec oxfmt --check ...` passed after the footer copy update.
  - `yarn lint` completed with 512 existing warnings and 0 errors.
  - Built `dist/docs/index.html` contains the updated `Build your own Bitsocial client` and `Bitsocial CLI` footer anchors.

## Remaining Non-Critical Opportunities

- Generated Docusaurus category index pages for contributor playbooks still do not receive doc-item JSON-LD because they are not normal doc items. They are low-priority public workflow pages, not priority product/query pages.
- After deployment, rerun the same search benchmark and wait for recrawl before expecting the stale `/apps` result to disappear.
- Direct AI answer-engine extraction from Perplexity/You.com remains unavailable without login or passing bot verification; use deployed `llms.txt`, `llms-full.txt`, structured data citations, and live answer snippets as the current GEO proxy.
