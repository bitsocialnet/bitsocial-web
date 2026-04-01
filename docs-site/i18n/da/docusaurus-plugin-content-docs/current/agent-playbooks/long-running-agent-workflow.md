# Langvarig agentarbejdsgang

Brug denne spillebog, når en opgave sandsynligvis vil strække sig over flere sessioner, overdragelser eller affødte agenter.

## Mål

- Giv hver frisk session en hurtig måde at genvinde kontekst på
- Hold arbejdet trinvist i stedet for at foretage en stor ændring
- Fang en ødelagt lokal baseline, før du tilføjer mere kode
- Efterlad holdbare artefakter, som den næste session kan stole på

## Hvor skal man holde staten

- Brug `docs/agent-runs/<slug>/`, når mennesker, anmeldelsesbots eller flere værktøjskæder har brug for den samme opgavetilstand.
- Brug kun en værktøjslokal mappe såsom `.codex/runs/<slug>/`, når opgavetilstanden med vilje er lokal for én arbejdsstation eller én værktøjskæde.
- Skjul ikke delt tilstand med flere sessioner i en privat skrabefil, hvis en anden bidragyder eller agent får brug for det senere.

## Nødvendige filer

Opret disse filer ved starten af den langvarige opgave:

- `feature-list.json`
- `progress.md`

Brug skabelonerne i `docs/agent-playbooks/templates/feature-list.template.json` og `docs/agent-playbooks/templates/progress.template.md`.

Foretrækker JSON til funktionslisten, så agenter kan opdatere et lille antal felter uden at omskrive hele dokumentet.

## Tjekliste for sessionstart

1. Kør `pwd`.
2. Læs `progress.md`.
3. Læs `feature-list.json`.
4. Kør `git log --oneline -20`.
5. Kør `./scripts/agent-init.sh --smoke`.
6. Vælg præcis ét element med højeste prioritet, som stadig er `pending`, `in_progress` eller `blocked`.

Hvis røgtrinnet mislykkes, skal du rette den ødelagte basislinje, før du implementerer en ny funktionsslice.

## Sessionsregler

- Arbejd på én funktion eller opgaveudsnit ad gangen.
- Hold funktionslisten maskinlæsbar og stabil. Opdater status, noter, filer og verifikationsfelter i stedet for at omskrive ikke-relaterede elementer.
- Markér kun et element som bekræftet efter at have kørt kommandoen eller brugerflowet, der er angivet i det pågældende element.
- Brug affødte agenter til afgrænsede udsnit, ikke til overordnet opgave-statsejerskab.
- Når en underordnet agent ejer en vare, skal du give den det nøjagtige vare-id, acceptkriterier og filer, som den kan berøre.

## Tjekliste for afslutning af session

1. Tilføj en kort statuspost til `progress.md`.
2. Opdater det berørte element i `feature-list.json`.
3. Registrer de nøjagtige kommandoer, der køres til verifikation.
4. Optag blokkere, opfølgninger og det næstbedste element at genoptage.

## Anbefalet fremskridtsindtastningsform

Brug en kort struktur som:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
