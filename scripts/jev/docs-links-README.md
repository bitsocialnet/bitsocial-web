# Advisory missing documentation links

This optional authoring helper finds **candidate** links between existing English product documentation pages. Code picks a bounded shortlist and exact source spans; Jev can judge whether each existing pair would help a reader. It never inserts links, changes documentation, approves content, or runs during an application build or CI.

## Preview without an API call

Run from the repository root with Node 22.12.0:

```sh
node scripts/jev/docs-links.mjs --limit 10
node scripts/jev/docs-links.mjs --source docs/content-discovery.md --limit 3
```

Default execution reads no credentials and makes no network calls. Every result is `unverified` with code `offline`: lexical overlap alone does not establish that a link is useful. Repeat `--source` to select up to 20 source pages; targets come from the same bounded local catalog. Unknown, omitted, or unsupported source paths fail explicitly.

Only root-level English Markdown product pages and the `anti-spam`, `apps`, `developer-tools`, and `infrastructure` directories are considered. Translations, contributor playbooks, agent-run artifacts, generated output, README/AGENTS files, and MDX pages are excluded. Individual files are limited to 64 KB, the catalog to 200 files and 2 MB. Symlinked files are ignored; symlinked catalog directories are rejected.

The extractor deliberately supports only plain prose paragraphs and headings. It excludes fenced/indented code, frontmatter, link-containing paragraphs, inline formatting, lists and tables. Documents with embedded MDX/HTML, custom `id`/`slug`, draft/unlisted frontmatter, recognizable secrets, or no plain prose are omitted. This conservative behavior misses legitimate opportunities; it is not a general Markdown parser. Omission reasons appear in the report. For example, angle-bracket placeholders can cause an otherwise ordinary page to be omitted.

## Optional Jev review

Inspect the offline selection first. Then explicitly permit sending those public excerpts:

```sh
node scripts/jev/docs-links.mjs --source docs/content-discovery.md --limit 3 --live
```

The existing [shared machine configuration](README.md) supplies the pinned model and API key. This command uses the same direct TypeSafe client as the other Jev helpers; no repository `.env`, Treg account, Gateway key, or new dependency is needed. There is no agent-generated substitute if credentials or the provider are unavailable.

Only the chosen source paragraph, exact phrase, target title, and at most 1,800 characters of target headings/prose are sent. Paths, hashes, full documents, and unrelated pages are not sent. State is marked as untrusted evidence, not instructions. Jev chooses only `useful`, `not_useful`, or `uncertain`; code owns source spans and destinations. The shared client validates the model, answer keys, allowed choices, complete probability distribution, and request/response bounds.

The maximum is 20 candidate pairs, three per source page, one per source/target pair, with no overlapping source spans. Live requests have a 10 KB per-request input ceiling, 220,000 conservative cumulative reserved input tokens, a $0.01 reservation, an 8-second per-request timeout and a 120-second total deadline. No automatic retries occur. Errors and budget limits leave items `unverified`; recorded usage distinguishes actual provider tokens from conservative reservation. Pricing is inherited from the shared client, not a billing guarantee.

## Review the report

JSON goes to stdout. The report fingerprints the questions, and each live decision records the returned model; offline/unavailable decisions have no model. Each item identifies the source file and line, exact `phrase`, `start`/`end` offsets, source and target SHA-256 hashes, existing target file, and relative Markdown `href`. Offsets are JavaScript UTF-16 code units, end-exclusive. Review against this exact snapshot and re-run after either document changes.

- `suggested`: Jev selected `useful` with selected-choice probability at least 0.9. A person still decides whether and where to add the link.
- `rejected`: Jev selected `not_useful` above the same threshold. This is advice, not evidence that no useful link exists.
- `unverified`: offline, uncertain, low probability, unavailable provider, malformed response, or exhausted budget.

The 0.9 routing threshold is an unevaluated conservative starting point, **not a measured accuracy claim**. Distribution concentration cannot prove usefulness. Candidate retrieval uses lexical overlap with titles/headings, so it misses synonyms and can produce irrelevant matches. Synthetic tests verify mechanics, not model quality.

Proposed links always point to an existing page with no fragment. Heading-anchor suggestions are intentionally unsupported rather than guessing Docusaurus IDs. An existing link to any section of a target page suppresses another suggestion to that page; inline, reference, relative, root-relative, and canonical `https://docs.bitsocial.net/` links are recognized. Self links and duplicate destinations are excluded. Ambiguous URLs conservatively suppress suggestions.

Exit `0` means the offline preview completed or all selected live decisions returned advice. Live uncertainty/unavailability and input errors return `2`; a successful exit never grants permission to edit or publish. There is no `--write` mode.

## Offline verification

```sh
node --test scripts/jev/tests/docs-links.test.mjs
node scripts/jev/docs-links.mjs --help
```

These tests use synthetic documentation and a stub transport. They cover source spans, destination resolution, already-linked sections, duplicate suppression, excluded syntax/routes, file boundaries, zero-call offline behavior, provider validation, uncertainty, and budgets. No credentials, browser, server, or paid API call is required. For a quality evaluation, have a reviewer label representative suggestions and missed opportunities before changing the retrieval or routing thresholds.
