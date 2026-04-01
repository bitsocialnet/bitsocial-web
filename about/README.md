# About Site

This subproject contains the public Bitsocial landing/about site served from `https://bitsocial.net/`.

## What Lives Here

- React application source in [`about/src`](./src)
- Static assets and translations in [`about/public`](./public)
- Vite and Tailwind config for the public site

## Important Notes

- This folder is intentionally named `about`, not `landing-page`.
- Its long-term role is the Bitsocial landing/about site, not the permanent home for the apps dashboard or the blog.
- `/apps` and `/blog` may exist in the current web app during the transition, but they should be treated as future separate subprojects.
- The repo root orchestrates installs and top-level quality checks. Use the root `README.md` for the canonical command list.
- For source-tree rules, read [`about/src/AGENTS.md`](./src/AGENTS.md).
