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

## Newsletter Env Vars

The newsletter box stays disabled unless the build includes:

```bash
VITE_NEWSLETTER_SUBSCRIBE_URL=https://newsletter.bitsocial.net/api/bitsocial/subscribe
VITE_NEWSLETTER_LIST_UUIDS=<list-uuid>
```

The subscribe URL should point at the Bitsocial newsletter gateway, not raw listmonk, so server-side delivery providers and welcome emails can change without touching the frontend.

Optional:

```bash
VITE_NEWSLETTER_CONFIRMATION_REQUIRED=false
```

Set `VITE_NEWSLETTER_CONFIRMATION_REQUIRED=true` only when the backend really uses a double opt-in flow.
Leave production envs unset until the listmonk SMTP flow is ready. Use preview-only build envs when testing.
