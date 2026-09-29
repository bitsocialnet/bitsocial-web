# Chain Site

This subproject contains the Bitsocial Chain landing site served from `https://chain.bitsocial.net/`: the public page for BSO, the immutable ERC-20 already live on Ethereum, and Bitsocial Chain, the proposed Ethereum L2 appchain. The chain itself is not built here; its proof of concept lives in [`bitsocialnet/bitsocial-chain`](https://github.com/bitsocialnet/bitsocial-chain).

## What Lives Here

- React application source in [`chain/src`](./src), with one component per page section in [`chain/src/sections`](./src/sections)
- Static assets, translations, and the generated `llms.txt` / `llms-full.txt` in [`chain/public`](./public)
- Vite and Tailwind config for the site

## Development

Installs and the canonical command list live in the root [`README.md`](../README.md). From the repo root:

```bash
corepack yarn start:chain
corepack yarn build:chain
```

`start:chain` serves the Vite dev server behind Portless at `https://chain.bitsocial.localhost` (`PORTLESS=0` falls back to a plain `127.0.0.1` port, `CHAIN_PORT` or 5173 by default). `build:chain` typechecks [`chain/tsconfig.json`](./tsconfig.json) and writes the static build to `dist-chain/`. The root `typecheck` script does not cover this workspace, so `build:chain` (or `build:verify` on a diff touching `chain/`) is the typecheck.

## Important Notes

- The site is a single static page with no router, SSR, or backend. Sections are addressed by hash anchors.
- BSO is live; Bitsocial Chain is a proposal. Copy should describe the chain as a design rather than a running system unless that changes.
- The official BSO contract address, along with the token, project, and social links, is defined once in [`src/lib/site.ts`](./src/lib/site.ts). The Verify section asks readers to match the address character by character, so never hardcode it elsewhere.
- Page order comes from `SECTION_IDS` in [`src/lib/faq.ts`](./src/lib/faq.ts). Each section answers one reader question: its headline is the answer, and the question itself only appears in the FAQ index at the bottom. [`src/sections/index.tsx`](./src/sections/index.tsx) keys its components by those ids, so a section without a question, or a question without a section, fails to typecheck.
- The polygon mesh behind the hero is a 2D canvas that falls back to static SVGs without WebGL support, on constrained mobile hardware or connections, under reduced motion, or when the canvas fails to start; see [`src/lib/graphics-mode.tsx`](./src/lib/graphics-mode.tsx).

## Translations

All copy, including the sections and FAQ, is read through i18next from `public/translations/{lang}/default.json`. English (`en`) is the source for the other 35 locales. The language resolves from `?lang=`, then localStorage, then the browser locale, and RTL locales flip the document direction. For workflow details, see [`docs/agent-playbooks/translations.md`](../docs/agent-playbooks/translations.md).

## LLM Indexes

[`scripts/generate-llms-files.mjs`](../scripts/generate-llms-files.mjs) builds `public/llms.txt` and `public/llms-full.txt` from the English translations plus the structure of `index.html`, `src/App.tsx`, `src/sections/`, and `src/lib/faq.ts`. The FAQ's Ask ChatGPT row points assistants at those files. The generator parses source text, so it fails when:

- the `<title>` or meta description in `index.html` drifts from `meta.title` / `meta.description` in the English copy
- `SECTION_IDS` stops using double-quoted ids, or a `useSectionCopy` entry stops being shaped as `{ eyebrow: t("key"), question: t("key") }`
- a FAQ entry has no rendered section, or a section has no FAQ entry

After changing English copy or section structure, run `corepack yarn llms:generate` and commit the regenerated files.

## Newsletter Env Vars

The mailing list form stays disabled unless the build includes (see [`.env.example`](./.env.example)):

```bash
VITE_NEWSLETTER_SUBSCRIBE_URL=https://newsletter.bitsocial.net/api/bso/subscribe
VITE_NEWSLETTER_LIST_UUIDS=<list-uuid>
```

`VITE_NEWSLETTER_LIST_UUIDS` accepts a comma-separated list. Set `VITE_NEWSLETTER_CONFIRMATION_REQUIRED=true` only when the backend really uses a double opt-in flow.

## Verification

`corepack yarn build:verify` runs `build:chain` for any diff under `chain/`, and `corepack yarn doctor` covers `chain/src` alongside `about/src`. For React profiling, use `corepack yarn perf:record --target chain` against the dev server or `corepack yarn build:profile:chain` for a production profiling build; see the root [`README.md`](../README.md) for the rest of the checks.
