# Langvarig agentarbeidsflyt

Bruk denne spilleboken når en oppgave sannsynligvis vil strekke seg over flere økter, overleveringer eller avlede agenter.

## Mål

- Gi hver ferske økt en rask måte å gjenvinne konteksten på
- Hold arbeidet inkrementelt i stedet for å ta en stor endring
- Fang en ødelagt lokal grunnlinje før du legger til mer kode
- Legg igjen holdbare gjenstander som neste økt kan stole på

## Hvor å holde staten

- Bruk `docs/agent-runs/<slug>/` når mennesker, anmeldelsesroboter eller flere verktøykjeder trenger samme oppgavestatus.
- Bruk en verktøylokalkatalog som `.codex/runs/<slug>/` bare når oppgavetilstanden med vilje er lokal for én arbeidsstasjon eller én verktøykjede.
- Ikke skjul delt tilstand for flere økter i en privat skrapefil hvis en annen bidragsyter eller agent vil trenge det senere.

## Nødvendige filer

Opprett disse filene ved starten av den langvarige oppgaven:

- `feature-list.json`
- `progress.md`

Bruk malene i `docs/agent-playbooks/templates/feature-list.template.json` og `docs/agent-playbooks/templates/progress.template.md`.

Foretrekk JSON for funksjonslisten slik at agenter kan oppdatere et lite antall felt uten å skrive om hele dokumentet.

## Sjekkliste for øktstart

1. Kjør `pwd`.
2. Les `progress.md`.
3. Les `feature-list.json`.
4. Kjør `git log --oneline -20`.
5. Kjør `./scripts/agent-init.sh --smoke`.
6. Velg nøyaktig ett element med høyest prioritet som fortsatt er `pending`, `in_progress` eller `blocked`.

Hvis røyktrinnet mislykkes, fikser du den ødelagte grunnlinjen før du implementerer en ny funksjonsdel.

## Sesjonsregler

- Arbeid med én funksjon eller oppgavedel om gangen.
- Hold funksjonslisten maskinlesbar og stabil. Oppdater status, notater, filer og bekreftelsesfelt i stedet for å omskrive ikke-relaterte elementer.
- Merk bare et element som bekreftet etter å ha kjørt kommandoen eller brukerflyten som er oppført i det elementet.
- Bruk opprettede agenter for avgrensede stykker, ikke for totalt oppgave-statseierskap.
- Når en underordnet agent eier én vare, gi den nøyaktig vare-ID, akseptkriterier og filer den kan berøre.

## Sjekkliste for avsluttet økt

1. Legg til en kort fremdriftsoppføring til `progress.md`.
2. Oppdater det berørte elementet i `feature-list.json`.
3. Registrer de nøyaktige kommandoene som kjøres for verifisering.
4. Fang blokkere, oppfølginger og det nest beste elementet å gjenoppta.

## Anbefalt fremdriftsoppføringsform

Bruk en kort struktur som:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
