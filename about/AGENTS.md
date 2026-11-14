# about/AGENTS.md

These rules apply to the `about/` subproject. Follow the repo-root [`AGENTS.md`](../AGENTS.md) first, then use this file for work inside the landing/about site.

- Treat `about/` as the landing/about project for Bitsocial as a whole.
- Keep app source rules in [`about/src/AGENTS.md`](./src/AGENTS.md) authoritative for `about/src/**`.
- Keep static assets, translations, and Vite config inside `about/`; do not recreate root-level `public/` or `src/` directories.
- Do not expand `about/` into the long-term home for the apps dashboard or the blog. Those are intended to become separate subprojects.
- When you need the user-facing wording for this subproject, prefer “about site” over “landing page” unless the task is specifically about the home route.
- Project logos listed in `syncedAppLogos` in `vite.config.ts` (currently MintPass, Modelswarm and WeTube) are copied from each project's repository on every build. Change them in that repository, not in `public/assets/apps/`; commit the refreshed copy when a build updates it. Add a logo to that list when it is an unmodified file from the project's repository.
