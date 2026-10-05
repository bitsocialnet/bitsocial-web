# Mga agent hook

Ang mga naka-commit na lifecycle hook ay nagfo-format lamang ng mga JavaScript/TypeScript file na matagumpay na na-edit, sa pamamagitan ng naka-install na oxfmt. Nasa `scripts/agent-hooks/format.mjs` ang nakabahaging lohika; nagde-delegate dito ang bawat native wrapper.

| App | Native na configuration | Event |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Hindi binabasa ng Claude ang isang hiwalay na `.claude/hooks.json`. Kontrolado pa rin ng bawat app ang project trust at kung naka-enable ang mga hook; suriin ang kasalukuyang mga setting nito sa halip na lampasan ang trust. Configuration ng repository ang `.codex/config.toml`, hindi registry ng mga hook command.

Bine-validate ng formatter ang event/payload, ang tagumpay ng pag-edit, ang extension ng file, at ang pagkakapaloob sa repository kasama ang mga symlink. Walang ginagawang trabaho kapag kulang ang mga dependency o hindi kaugnay ang input. Gumagamit ang mga command ng argument array na naka-disable ang network access ng Corepack; hindi nag-i-install ng mga dependency ang mga hook, hindi nagpapatakbo ng mga build/review, at hindi binabago ang Git.

Patakbuhin nang tahasan ang mga pagsusuri ayon sa [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Patakbuhin ang `yarn ai-workflow:sync`, `yarn ai-workflow:check`, at `yarn ai-workflow:test` pagkatapos baguhin ang workflow. Gumagamit ang mga fixture ng mga disposable na file at pekeng pagtawag sa formatter; hindi nito pinapatunayan na na-load ng bawat app ang configuration nito. I-reload at suriin ang catalog ng app pagkatapos ng mga upgrade.

Available pa rin kapag kailangan ang Impeccable design skill at ang mga executable helper nito sa ilalim ng `.agents/skills/impeccable`. Nakaturo sa isang nawawalang direktoryo ang dati nitong Codex hook; tumatakbo na ngayon ang design workflow kapag pinili ang skill nito, nang walang palaging-aktibong design hook. Hindi dapat i-reconfigure ng skill ang mga hook ng proyekto bilang hakbang na isinisingit lamang sa gawaing disenyo.
