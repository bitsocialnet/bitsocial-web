# Agent hooks

The committed lifecycle hooks only format successfully edited JavaScript/TypeScript files through installed oxfmt. Shared logic lives in `scripts/agent-hooks/format.mjs`; each native wrapper delegates to it.

| App | Native configuration | Event |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude does not read a standalone `.claude/hooks.json`. Each app still controls project trust and whether hooks are enabled; inspect its current settings rather than bypassing trust. `.codex/config.toml` is repository configuration, not a hook command registry.

The formatter validates event/payload, edit success, file extension, and repository containment including symlinks. Missing dependencies or irrelevant input do no work. Commands use an argument array with Corepack network access disabled; hooks do not install dependencies, run builds/reviews, or mutate Git.

Run checks explicitly according to [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Run `yarn ai-workflow:sync`, `yarn ai-workflow:check`, and `yarn ai-workflow:test` after changing the workflow. Fixtures use disposable files and fake formatter invocations; they do not prove each app loaded its configuration. Reload and inspect the app catalog after upgrades.

The Impeccable design skill and its executable helpers remain available on demand under `.agents/skills/impeccable`. Its former Codex hook pointed at a missing directory; the design workflow now runs when its skill is selected, with no always-on design hook. The skill must not reconfigure project hooks as an incidental design step.
