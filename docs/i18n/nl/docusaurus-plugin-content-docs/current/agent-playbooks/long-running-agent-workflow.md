# Langlopende agentworkflow

Gebruik dit draaiboek als een taak waarschijnlijk meerdere sessies, overdrachten of voortgebrachte agenten zal omvatten.

## Doelen

- Geef elke nieuwe sessie een snelle manier om de context terug te krijgen
- Houd het werk stapsgewijs in plaats van in één keer een grote verandering aan te brengen
- Vang een gebroken lokale basislijn voordat u meer toevoegt code
- Laat duurzame artefacten achter waarop de volgende sessie kan vertrouwen

## Waar de status behouden blijft

- Gebruik `docs/agent-runs/<slug>/` wanneer mensen, reviewbots of meerdere toolchains dezelfde taakstatus nodig hebben.
- Gebruik een tool-local directory zoals `.codex/runs/<slug>/` alleen wanneer de taakstatus opzettelijk lokaal is voor één of één werkstation toolchain.
- Verberg de gedeelde status van meerdere sessies niet in een persoonlijk werkbestand als een andere bijdrager of agent dit later nodig heeft.

## Vereiste bestanden

Maak deze bestanden aan het begin van de langlopende taak:

- `feature-list.json`
- `progress.md`

Gebruik de sjablonen in `docs/agent-playbooks/templates/feature-list.template.json` en `docs/agent-playbooks/templates/progress.template.md`.

Geef de voorkeur aan JSON voor de lijst met functies, zodat agenten een klein aantal velden kunnen bijwerken zonder het hele document te herschrijven.

## Checklist voor sessiestart

1. Voer `pwd` uit.
2. Lees `progress.md`.
3. Lees `feature-list.json`.
4. Voer `git log --oneline -20` uit.
5. Voer `./scripts/agent-init.sh --smoke` uit.
6. Kies precies één met de hoogste prioriteit item dat nog steeds `pending`, `in_progress` of `blocked` is.

Als de smoke-stap mislukt, repareert u de gebroken basislijn voordat u een nieuwe functiesegment implementeert.

## Sessieregels

- Werk aan één functie- of taaksegment tegelijk.
- Houd de lijst met functies machineleesbaar en stabiel. Update status, notities, bestanden en verificatievelden in plaats van niet-gerelateerde items te herschrijven.
- Markeer alleen een item dat is geverifieerd na het uitvoeren van de opdracht of gebruikersstroom die in dat item wordt vermeld.
- Gebruik voortgebrachte agenten voor begrensde segmenten, niet voor het algehele eigendom van de taakstatus.
- Als een onderliggende agent eigenaar is van één item, geef hem dan de exacte item-ID, acceptatiecriteria en bestanden die deze kan aanraken.

## Sessieeinde Controlelijst

1. Voeg een korte voortgangsinvoer toe aan `progress.md`.
2. Werk het aangeraakte item bij in `feature-list.json`.
3. Registreer de exacte opdrachten die worden uitgevoerd ter verificatie.
4. Capture blockers, follow-ups en het volgende beste item om te hervatten.

## Aanbevolen voortgangsinvoer Vorm

Gebruik een korte structuur zoals:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
