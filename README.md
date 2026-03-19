[![License](https://img.shields.io/badge/license-AGPL--3.0--only-red.svg)](https://github.com/bitsocialnet/5chan/blob/master/LICENSE)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Bitsocial Official Website

This repository contains the official Bitsocial web frontend.

It currently powers:

- the public landing page
- protocol documentation
- the Bitsocial apps & services explorer

Over time, this repository will evolve into the **flagship Bitsocial web client**, while the marketing and documentation content moves to subdomains (e.g. `about.bitsocial.net`).

**Live:** https://bitsocial.net

---

## Scope

**In scope**

- Public landing pages and protocol overview
- Apps & services catalog (`/apps`)
- Documentation frontend (`/docs`)
- Network status pages (`/status`)
- Shared UI, routing, and internationalization
- Performance-sensitive visualizations and animations

**Out of scope**

- Wallet integration
- Authentication / login flows
- Governance or voting UIs
- Token economics dashboards
- Backend services or indexers

This separation is intentional to keep the web frontend lightweight, durable, and relocatable as the ecosystem evolves.

---

## Getting Started

Requires [Node.js](https://nodejs.org/) 22+ and [Corepack](https://nodejs.org/api/corepack.html). This repo uses Yarn 4 via the pinned `packageManager` field.

```bash
corepack yarn install  # Install dependencies
corepack yarn dev      # Start dev server (http://bitsocial.localhost:1355)
corepack yarn build    # Production build
corepack yarn preview  # Preview production build
```

The dev server runs at http://bitsocial.localhost:1355 via [Portless](https://port1355.dev/), which gives each Bitsocial project a stable, named URL instead of a random port. To bypass Portless: `PORTLESS=0 corepack yarn dev`

---

## Contributing

This repo includes an `AGENTS.md` file with detailed guidance for AI coding agents.

When using an AI assistant to make changes, it is expected to follow the conventions defined there.

### Making Changes

1. Run `corepack yarn dev` (opens at http://bitsocial.localhost:1355)
2. Make your changes (manually or via an AI agent)
3. Test on desktop and mobile viewports
4. Verify performance and animations
5. Run all quality checks before committing

### Code Quality

All checks must pass before committing:

```bash
corepack yarn typecheck    # Type check with tsgo
corepack yarn lint         # Lint with oxlint
corepack yarn format:check # Check formatting with oxfmt
```

To auto-fix issues:

```bash
corepack yarn lint:fix
corepack yarn format
```

### Translations

We welcome translation improvements via PRs.

If you are improving an existing translation in your native language:

1. Open `public/translations/{lang}/default.json` for your language.
2. Edit only the string values for the keys you want to improve.
3. Do not add, remove, or rename keys.
4. Open a PR with just that language file updated.

If you need to add or remove keys across languages, use `scripts/update-translations.js`:

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --dry
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
node scripts/update-translations.js --key obsolete_key --delete --write
node scripts/update-translations.js --audit --dry
```

### Commits

This repo supports Commitizen for guided Conventional Commits.
Use `corepack yarn commit` (or `corepack yarn exec cz`) for the interactive prompt. `git commit` will also trigger Commitizen via Husky.

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat`: new features
- `fix`: bug fixes
- `perf`: performance improvements
- `refactor`: refactors without behavior changes
- `docs`: documentation changes
- `style`: formatting only
- `chore`: maintenance tasks

### Pre-PR Checklist

- `corepack yarn typecheck` passes
- `corepack yarn lint` passes
- `corepack yarn format:check` passes
- Tested on mobile viewport
- Animations are smooth and respect `prefers-reduced-motion`

---

## Roadmap for this repository

### Milestone #1: Frontpage

#### Topbar

- [x] Small size logo with no background, and logo text with official font (`Exo`)
- [x] Most important links, with underline animation
- [x] Language selector for as many languages as possible
- [x] Hamburger menu on mobile and mobile topbar design
- [ ] Dark/light theme button

#### Hero background graphic

- [x] Cool and impactful original hero background concept
- [x] 3D design and animation with three.js (planet graphic + p2p mesh graphic)
- [ ] Optional GSAP scroll animation (previous attempt was buggy, may revisit)
- [x] Static version for low-end devices and `prefers-reduced-motion`
- [x] Light and dark mode variants should look slightly different

#### Hero tagline text

- [x] Translated in all languages
- [x] Interactive keyword/key phrase jump to matching Core Features section
- [ ] GSAP animation to highlight each keyword

#### Hero buttons

- [x] Funnel developers to docs
- [x] Funnel users to apps dashboard

#### Core Features section

- [x] Explains hero tagline concepts
- [x] Initial card design (`S`-pattern)
- [x] Hash-link-friendly navigation to feature sections
- [x] "Learn more" expand button for each feature
- [x] GSAP animation for cards on scroll
- [ ] Fill expanded sections (or switch to full-page overlay pattern)
- [ ] Translate all expanded content
- [ ] Link each feature section to specific docs pages (card, expanded section, or both)

#### Master Plan section

- [x] Initial roadmap-like design
- [ ] Write each phase (concise and somewhat vague)
- [ ] Maybe add per-phase expand buttons (similar to Core Features)
- [ ] Improve tone and trust (honest/professional)
- [ ] Link each phase to detailed docs pages
- [ ] Cover both short-term goals and long-term vision
- [ ] Add hash links for each phase (or one for master plan)
- [x] Hidden easter egg

#### Footer

- [ ] Prominent mailing list in footer, with three.js graphic (+ static fallback for low-end devices)
- [ ] Hash link for mailing list section to share directly
- [ ] Visual quality comparable to topbar/hero, translucent design + static fallback for low-end devices
- [ ] Include all important links and mailing list field again

### Milestone #2: App Dashboard (`/apps`)

#### Goal

- Make it at least as good as [nostrapps.com](https://nostrapps.com/) while matching Bitsocial site design.

#### Scope

- [ ] Initial design similar to nostrapps.com, with Bitsocial visual language
- [ ] Categories and subcategories per app/client type (including profile-based, community-based, imageboard, blog, crowdfunding, indexers, RPC services)
- [ ] Keep useful categories visible even when empty, with translated descriptions
- [ ] Integrate lists from `bitsocialnet/lists`
- [ ] Add "submit your own" PR flow per category/subcategory
- [ ] Define and publish listing requirements

### Milestone #3: Docs (`/docs`)

#### Goal

- Build docs with strong LLM discoverability and scraping compatibility.

- [ ] Choose docs stack optimized for LLM scraping/indexing (e.g. Mintlify, GitBook, Docusaurus)
- [ ] Write essential docs first, expand over time
- [ ] Translate docs to all supported languages
- [ ] Add `/llms.txt`, `/llms-full.txt`, and `/llms-small.txt`
- [ ] Submit docs metadata to [llmstxt.cloud directory](https://directory.llmstxt.cloud/)

### Milestone #4: Status/Analytics Page (`/status`)

#### Goal

- Rebuild plebbit.online but fully rebranded and aligned with frontpage design.
- Position as "pro analytics" rather than a traditional "status page".

- [ ] Initialize status/analytics page from plebbit.online architecture, fully rebranded
- [ ] Categories and filters: default client list, merged/all lists view, and indexer-based discovery views
- [ ] Let users discover non-default subs (e.g. via ENS queries) with clear safety disclaimers
- [ ] Add ENS-query-based discovery list with explicit "search results may be unsafe" warning
- [ ] Consider "pro analytics" branding direction inspired by products like [Arkham](https://arkm.com/)

### Milestone #5: Official Core Team Blog (`/blog`)

#### Goal

- Launch an official Bitsocial Core Team blog powered by protocol-native, P2P-loaded content.
- Use it as the canonical source for development updates and team-authored long-form posts.

#### Scope

- [ ] Build a dedicated blog experience that matches the current Bitsocial visual language
- [ ] Source posts from a Bitsocial community operated in the background by the core developer team
- [ ] Load and render blog content P2P via the Bitsocial protocol
- [ ] Publish development news, release updates, and protocol progress reports
- [ ] Publish team-member articles for opinions, analysis, and ecosystem commentary
- [ ] Define simple content categories/tags (e.g. development news vs team opinions)

---

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPLv3)**.

The AGPLv3 is used to ensure that all deployed modifications to the Bitsocial web frontend remain free and open source, even when used as a hosted service.
