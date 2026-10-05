# Hooky agentů

Commitnuté hooky životního cyklu pouze formátují úspěšně upravené soubory JavaScript/TypeScript pomocí nainstalovaného oxfmt. Sdílená logika žije v `scripts/agent-hooks/format.mjs`; každý nativní obal na ni deleguje.

| Aplikace | Nativní konfigurace | Událost |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude nečte samostatný soubor `.claude/hooks.json`. Každá aplikace i nadále sama řídí důvěru v projekt a to, zda jsou hooky povolené; místo obcházení důvěry si prohlédněte její aktuální nastavení. `.codex/config.toml` je konfigurace repozitáře, nikoli registr příkazů hooků.

Formátovač ověřuje událost a payload, úspěšnost úpravy, příponu souboru a to, že soubor leží uvnitř repozitáře, včetně symbolických odkazů. Při chybějících závislostech nebo nerelevantním vstupu nic nedělá. Příkazy se předávají jako pole argumentů a Corepack má vypnutý přístup k síti; hooky neinstalují závislosti, nespouštějí buildy ani revize a nemění stav Gitu.

Kontroly spouštějte explicitně podle [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Po změně workflow spusťte `yarn ai-workflow:sync`, `yarn ai-workflow:check` a `yarn ai-workflow:test`. Fixtures používají jednorázové soubory a simulovaná volání formátovače; nedokazují, že každá aplikace svou konfiguraci skutečně načetla. Po aktualizacích aplikaci znovu načtěte a zkontrolujte její katalog.

Designová dovednost Impeccable a její spustitelné pomocné skripty zůstávají k dispozici na vyžádání pod `.agents/skills/impeccable`. Její dřívější hook pro Codex ukazoval na neexistující adresář; designový postup se nyní spouští, když je dovednost vybrána, bez trvale zapnutého designového hooku. Dovednost nesmí jako vedlejší krok designové práce překonfigurovat hooky projektu.
