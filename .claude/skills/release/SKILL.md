---
name: release
description: Preview, prepare, or perform an authorized Bitsocial Web release.
---

<!-- Generated from .agents/skills/release/SKILL.md; run yarn ai-workflow:sync. -->

# Release

Determine whether the request is a preview, local preparation, or publication. A preview reads history and returns proposed version/notes without changing files. Infer the bump from an explicit version or scope; ask only when the version cannot be determined.

Inspect the current package/workspace versions, relevant release tag, and `.github/workflows/` before choosing release actions. Summarize actual user-visible changes since the applicable tag. Do not invent a changelog or blotter.

For preparation, update only the requested version manifests, run Corepack Yarn install, and verify the release scope with the appropriate workspace build, lint, typecheck and format checks. Use `yarn build` for a requested full production release, including docs locales. See `docs/agent-playbooks/verification.md`.

Only commit, tag, push, or publish when authorized. Stage explicit release files, keep Git hooks enabled, verify the exact commit/tag, and push only the requested branch/tag. A preparation request does not authorize a release. Reuse existing authorization instead of asking again.
