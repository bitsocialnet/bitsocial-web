# Agent-hooks

De committede livscyklus-hooks formaterer kun JavaScript-/TypeScript-filer, der er redigeret med succes, og det sker gennem den installerede oxfmt. Den fælles logik ligger i `scripts/agent-hooks/format.mjs`; hver native wrapper uddelegerer til den.

| App | Native konfiguration | Hændelse |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude læser ikke en selvstændig `.claude/hooks.json`. Hver app styrer stadig selv projekttillid, og om hooks er slået til; undersøg appens aktuelle indstillinger i stedet for at omgå tillidsmekanismen. `.codex/config.toml` er repo-konfiguration, ikke et register over hook-kommandoer.

Formatteren validerer hændelse/payload, at redigeringen lykkedes, filendelsen, og at filen ligger inden for repoet, også når symlinks er involveret. Manglende afhængigheder eller irrelevant input udløser intet arbejde. Kommandoerne bruger et argument-array med Corepacks netværksadgang slået fra; hooks installerer ikke afhængigheder, kører ikke builds/reviews og ændrer ikke Git.

Kør kontroller eksplicit i henhold til [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Kør `yarn ai-workflow:sync`, `yarn ai-workflow:check` og `yarn ai-workflow:test` efter ændringer i arbejdsgangen. Fixtures bruger engangsfiler og falske formatter-kald; de beviser ikke, at hver app faktisk har indlæst sin konfiguration. Genindlæs og gennemgå appens katalog efter opgraderinger.

Designskillen Impeccable og dens eksekverbare hjælpere er fortsat tilgængelige efter behov under `.agents/skills/impeccable`. Dens tidligere Codex-hook pegede på en mappe, der ikke fandtes; designarbejdsgangen kører nu, når dens skill vælges, uden noget design-hook, der altid er aktivt. Skillen må ikke omkonfigurere projektets hooks som et sideløbende trin i designarbejdet.
