# docs/AGENTS.md

These rules apply to the `docs/` subproject. Follow the repo-root [`AGENTS.md`](../AGENTS.md) first.

- `docs/` is the canonical Docusaurus project. Do not reintroduce `docs-site/` paths.
- Keep source translations under `docs/i18n/`. If a script or workflow still points at `docs-site/i18n`, update it instead of copying files twice.
- Keep route/base-url assumptions aligned with `bitsocial.net/docs`.
- When changing Docusaurus theme components or i18n behavior, run the docs build through the repo root so the full static build and Pagefind index stay in sync.
