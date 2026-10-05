# Agent-hooks

De innsjekkede livssyklus-hookene formaterer bare JavaScript-/TypeScript-filer som er redigert uten feil, gjennom installert oxfmt. Den delte logikken ligger i `scripts/agent-hooks/format.mjs`; hver native wrapper delegerer til den.

| App | Native konfigurasjon | Hendelse |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude leser ikke en frittstående `.claude/hooks.json`. Hver app styrer fortsatt selv prosjekttillit og om hooks er aktivert; undersøk de gjeldende innstillingene i stedet for å omgå tilliten. `.codex/config.toml` er repokonfigurasjon, ikke et register over hook-kommandoer.

Formatereren validerer hendelse/nyttelast, at redigeringen lyktes, filendelsen og at filen ligger i repoet, også når symlenker er involvert. Manglende avhengigheter eller irrelevant inndata fører ikke til noe arbeid. Kommandoer bruker en argumentliste med nettverkstilgang for Corepack slått av; hooks installerer ikke avhengigheter, kjører ikke bygg eller gjennomganger og endrer ikke Git.

Kjør sjekker eksplisitt i henhold til [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Kjør `yarn ai-workflow:sync`, `yarn ai-workflow:check` og `yarn ai-workflow:test` etter at du har endret arbeidsflyten. Fixtures bruker engangsfiler og falske kall til formatereren; de beviser ikke at hver app har lastet inn konfigurasjonen sin. Last inn appen på nytt og undersøk katalogen dens etter oppgraderinger.

Designferdigheten Impeccable og de kjørbare hjelperne dens er fortsatt tilgjengelige ved behov under `.agents/skills/impeccable`. Den tidligere Codex-hooken pekte til en mappe som ikke fantes; designarbeidsflyten kjører nå når ferdigheten velges, uten noen alltid aktiv design-hook. Ferdigheten skal ikke konfigurere prosjektets hooks på nytt som et tilfeldig designsteg.
