# Hook-uri pentru agenți

Hook-urile de ciclu de viață incluse în depozit doar formatează, prin oxfmt instalat, fișierele JavaScript/TypeScript editate cu succes. Logica comună se află în `scripts/agent-hooks/format.mjs`; fiecare înveliș nativ deleagă către ea.

| Aplicație | Configurație nativă | Eveniment |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude nu citește un fișier `.claude/hooks.json` de sine stătător. Fiecare aplicație controlează în continuare încrederea în proiect și activarea hook-urilor; inspectați setările ei curente, în loc să ocoliți mecanismul de încredere. `.codex/config.toml` este configurație a depozitului, nu un registru de comenzi pentru hook-uri.

Formatorul validează evenimentul și payload-ul, reușita editării, extensia fișierului și apartenența la depozit, inclusiv prin linkuri simbolice. Dependențele lipsă sau intrările irelevante nu declanșează nicio acțiune. Comenzile folosesc un tablou de argumente, cu accesul la rețea al Corepack dezactivat; hook-urile nu instalează dependențe, nu rulează build-uri sau revizuiri și nu modifică starea Git.

Rulați verificările explicit, conform [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). După modificarea fluxului de lucru, rulați `yarn ai-workflow:sync`, `yarn ai-workflow:check` și `yarn ai-workflow:test`. Fixture-urile folosesc fișiere de unică folosință și invocări simulate ale formatorului; ele nu dovedesc că fiecare aplicație și-a încărcat configurația. După actualizări, reîncărcați aplicația și inspectați-i catalogul.

Skill-ul de design Impeccable și helperele lui executabile rămân disponibile la cerere în `.agents/skills/impeccable`. Fostul lui hook pentru Codex indica un director inexistent; fluxul de lucru de design rulează acum atunci când skill-ul este selectat, fără vreun hook de design mereu activ. Skill-ul nu trebuie să reconfigureze hook-urile proiectului ca pas incidental de design.
