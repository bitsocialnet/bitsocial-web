# Långvarigt agentarbetsflöde

Använd den här spelboken när en uppgift sannolikt kommer att sträcka sig över flera sessioner, handoffs eller skapade agenter.

## Mål

- Ge varje ny session ett snabbt sätt att återfå sammanhanget
- Håll arbetet stegvis istället för att göra en stor förändring
- Fånga en trasig lokal baslinje innan du lägger till mer kod
- Lämna hållbara artefakter som nästa session kan lita på

## Var ska man hålla staten

- Använd `docs/agent-runs/<slug>/` när människor, recensionsrobotar eller flera verktygskedjor behöver samma uppgiftstillstånd.
- Använd en verktygslokal katalog som `.codex/runs/<slug>/` endast när uppgiftstillståndet avsiktligt är lokalt för en arbetsstation eller en verktygskedja.
- Dölj inte delat tillstånd för flera sessioner i en privat skrapfil om en annan bidragsgivare eller agent kommer att behöva det senare.

## Obligatoriska filer

Skapa dessa filer i början av den långa uppgiften:

- `feature-list.json`
- `progress.md`

Använd mallarna i `docs/agent-playbooks/templates/feature-list.template.json` och `docs/agent-playbooks/templates/progress.template.md`.

Föredrar JSON för funktionslistan så att agenter kan uppdatera ett litet antal fält utan att skriva om hela dokumentet.

## Checklista för sessionsstart

1. Kör `pwd`.
2. Läs `progress.md`.
3. Läs `feature-list.json`.
4. Kör `git log --oneline -20`.
5. Kör `./scripts/agent-init.sh --smoke`.
6. Välj exakt ett objekt med högst prioritet som fortfarande är `pending`, `in_progress` eller `blocked`.

Om röksteget misslyckas, fixa den trasiga baslinjen innan du implementerar en ny funktionsskiva.

## Sessionsregler

- Arbeta med en funktion eller uppgiftsdel åt gången.
- Håll funktionslistan maskinläsbar och stabil. Uppdatera status, anteckningar, filer och verifieringsfält istället för att skriva om orelaterade objekt.
- Markera endast ett objekt som verifierat efter att ha kört kommandot eller användarflödet som anges i det objektet.
- Använd genererade agenter för avgränsade delar, inte för övergripande uppgifts-tillståndsägande.
- När en underordnad agent äger en artikel, ge den exakt artikel-id, acceptanskriterier och filer som den kan röra.

## Checklista för avslutad session

1. Bifoga en kort förloppspost till `progress.md`.
2. Uppdatera objektet som du har berört i `feature-list.json`.
3. Spela in de exakta kommandona som körs för verifiering.
4. Fånga blockerare, uppföljningar och det näst bästa objektet att återuppta.

## Rekommenderad form för framstegsinmatning

Använd en kort struktur som:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
