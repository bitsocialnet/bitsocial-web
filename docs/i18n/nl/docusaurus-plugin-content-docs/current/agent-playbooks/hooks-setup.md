# Agent-hooks

De gecommitte lifecycle-hooks formatteren alleen succesvol bewerkte JavaScript-/TypeScript-bestanden via de geïnstalleerde oxfmt. De gedeelde logica staat in `scripts/agent-hooks/format.mjs`; elke native wrapper delegeert daarnaartoe.

| App | Native configuratie | Event |
|---|---|---|
| Codex | `.codex/hooks.json` | `PostToolUse`, `apply_patch` |
| Claude Code | `.claude/settings.json` | `PostToolUse`, `Edit|Write|MultiEdit` |
| Cursor | `.cursor/hooks.json` | `afterFileEdit` |

Claude leest geen losse `.claude/hooks.json`. Elke app bepaalt nog steeds zelf het projectvertrouwen en of hooks zijn ingeschakeld; bekijk de huidige instellingen in plaats van het vertrouwen te omzeilen. `.codex/config.toml` is repositoryconfiguratie, geen register van hook-commando's.

De formatter valideert event en payload, het slagen van de bewerking, de bestandsextensie en of het bestand binnen de repository ligt, inclusief symlinks. Bij ontbrekende dependencies of irrelevante invoer gebeurt er niets. Commando's gebruiken een argumentenarray en de netwerktoegang van Corepack staat uit; hooks installeren geen dependencies, draaien geen builds of reviews en wijzigen Git niet.

Voer checks expliciet uit volgens [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md). Voer `yarn ai-workflow:sync`, `yarn ai-workflow:check` en `yarn ai-workflow:test` uit nadat je de workflow hebt gewijzigd. Fixtures gebruiken wegwerpbestanden en nagebootste aanroepen van de formatter; ze bewijzen niet dat elke app zijn configuratie heeft geladen. Herlaad de app en bekijk de catalogus ervan na upgrades.

De designskill Impeccable en de uitvoerbare helpers ervan blijven op aanvraag beschikbaar onder `.agents/skills/impeccable`. De vroegere Codex-hook ervan wees naar een ontbrekende map; de designworkflow draait nu wanneer de skill wordt geselecteerd, zonder designhook die altijd actief is. De skill mag projecthooks niet herconfigureren als bijkomende designstap.
