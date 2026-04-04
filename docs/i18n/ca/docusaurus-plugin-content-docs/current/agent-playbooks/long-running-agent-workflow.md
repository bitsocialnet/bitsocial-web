# Flux de treball d'agent de llarga durada

Utilitzeu aquest llibre de jugades quan és probable que una tasca abasti diverses sessions, traspassos o agents generats.

## Gols

- Doneu a cada sessió nova una manera ràpida de recuperar context
- Mantingueu el treball incremental en comptes de fer un gran canvi d'un sol cop
- Captura una línia de base local trencada abans d'afegir més codi
- Deixeu artefactes duradors en els quals la propera sessió pugui confiar

## On mantenir l'estat

- Utilitzeu `docs/agent-runs/<slug>/` quan els humans, els robots de revisió o diverses cadenes d'eines necessiten el mateix estat de la tasca.
- Utilitzeu un directori local d'eines com `.codex/runs/<slug>/` només quan l'estat de la tasca sigui intencionadament local a una estació de treball o una cadena d'eines.
- No amagueu l'estat compartit de diverses sessions en un fitxer de treball privat si un altre col·laborador o agent ho necessitarà més endavant.

## Fitxers obligatoris

Creeu aquests fitxers al començament de la tasca de llarga durada:

- `feature-list.json`
- `progress.md`

Utilitzeu les plantilles a `docs/agent-playbooks/templates/feature-list.template.json` i `docs/agent-playbooks/templates/progress.template.md`.

Preferiu JSON per a la llista de funcions perquè els agents puguin actualitzar un petit nombre de camps sense reescriure tot el document.

## Llista de verificació d'inici de sessió

1. Executeu `pwd`.
2. Llegiu `progress.md`.
3. Llegiu `feature-list.json`.
4. Executeu `git log --oneline -20`.
5. Executeu `./scripts/agent-init.sh --smoke`.
6. Trieu exactament un element de prioritat més alta que encara sigui `pending`, `in_progress` o `blocked`.

Si el pas de fum falla, arregleu la línia de base trencada abans d'implementar una nova secció de funció.

## Normes de la sessió

- Treballeu en una funció o secció de tasca alhora.
- Mantingueu la llista de funcions llegible per màquina i estable. Actualitzeu l'estat, les notes, els fitxers i els camps de verificació en lloc de reescriure elements no relacionats.
- Marqueu només un element verificat després d'executar l'ordre o el flux d'usuari que s'indica en aquest element.
- Utilitzeu agents generats per a les seccions limitades, no per a la propietat general de l'estat de la tasca.
- Quan un agent secundari posseeix un element, doneu-li l'identificador exacte de l'element, els criteris d'acceptació i els fitxers que pugui tocar.

## Llista de verificació de finalització de la sessió

1. Afegiu una breu entrada de progrés a `progress.md`.
2. Actualitza l'element tocat a `feature-list.json`.
3. Enregistreu les ordres exactes executades per a la verificació.
4. Captura bloquejadors, seguiments i el següent millor element per reprendre.

## Forma d'entrada de progrés recomanada

Utilitzeu una estructura curta com:

```markdown
## 2026-03-17 14:30

- Item: F003
- Summary: Updated the browser-check flow to use the shared init/bootstrap path.
- Files: `.cursor/agents/browser-check.md`, `.codex/agents/browser-check.toml`
- Verification: `corepack yarn build`, `corepack yarn lint`, `corepack yarn typecheck`
- Next: Run the smoke flow and update the task-board status.
```
