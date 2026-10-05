# Agent-hooks

De incheckade livscykel-hookarna formaterar endast JavaScript-/TypeScript-filer som har redigerats utan fel, via den installerade oxfmt. Den delade logiken finns i `scripts/agent-hooks/format.mjs`; varje inbyggt omslag delegerar till den.

| App | Inbyggd konfiguration | Händelse |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude läser inte en fristående `.claude/hooks.json`. Varje app styr fortfarande projektförtroendet och om hooks är aktiverade; granska appens aktuella inställningar i stället för att kringgå förtroendet. `.codex/config.toml` är repokonfiguration, inte ett register över hook-kommandon.

Formateraren validerar händelse/nyttolast, att redigeringen lyckades, filändelsen och att filen ligger inom repot, även när symboliska länkar är inblandade. Saknade beroenden eller irrelevant indata leder inte till något arbete. Kommandon använder en argumentarray med Corepacks nätverksåtkomst avstängd; hooks installerar inte beroenden, kör inte byggen eller granskningar och ändrar inte Git.

Kör kontroller uttryckligen enligt [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Kör `yarn ai-workflow:sync`, `yarn ai-workflow:check` och `yarn ai-workflow:test` efter att du har ändrat arbetsflödet. Fixturerna använder engångsfiler och fejkade formateraranrop; de bevisar inte att varje app har läst in sin konfiguration. Ladda om och granska appens katalog efter uppgraderingar.

Designskillen Impeccable och dess körbara hjälpprogram finns kvar för användning vid behov under `.agents/skills/impeccable`. Dess tidigare Codex-hook pekade på en katalog som saknades; designarbetsflödet körs nu när skillen väljs, utan någon alltid aktiv design-hook. Skillen får inte konfigurera om projektets hooks som ett sidosteg i designarbetet.
