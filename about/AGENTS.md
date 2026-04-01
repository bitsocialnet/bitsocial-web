# about/AGENTS.md

These rules apply to the `about/` subproject. Follow the repo-root [`AGENTS.md`](../AGENTS.md) first, then use this file for work inside the marketing site.

- Treat `about/` as the public site project, not just the `/` landing route. It currently owns the home, about, apps, and blog pages.
- Keep app source rules in [`about/src/AGENTS.md`](./src/AGENTS.md) authoritative for `about/src/**`.
- Keep static assets, translations, and Vite config inside `about/`; do not recreate root-level `public/` or `src/` directories.
- When you need the user-facing wording for this subproject, prefer “about site” or “marketing site” over “landing page” unless the task is specifically about the home route.
