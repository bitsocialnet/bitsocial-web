# Bekende verrassingen

Dit bestand houdt repository-specifieke verwarringspunten bij die agentfouten veroorzaakten.

## Invoercriteria

Voeg alleen een item toe als ze allemaal waar zijn:

- Het is specifiek voor deze repository (geen algemeen advies).
- Het zal zich waarschijnlijk herhalen voor toekomstige agenten.
- Het heeft een concrete oplossing die kan worden aangepakt gevolgd.

Als u het niet zeker weet, vraag het dan aan de ontwikkelaar voordat u een item toevoegt.

## Invoersjabloon

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Invoer

### Portless wijzigt de canonieke lokale app-URL

- **Datum:** 18-03-2026
- **Waargenomen door:** Codex
- **Context:** Browser verificatie en rookstromen
- **Wat verrassend was:** De standaard lokale URL is niet de gebruikelijke Vite-poort. De repository verwacht `http://bitsocial.localhost:1355` via Portless, dus het controleren van `localhost:3000` of `localhost:5173` kan de verkeerde app of helemaal niets opleveren.
- **Impact:** Browsercontroles kunnen mislukken of het verkeerde doel valideren, zelfs als de ontwikkelaarsserver in orde is.
- **Mitigatie:** Gebruik `http://bitsocial.localhost:1355` eerst. Omzeil dit alleen met `PORTLESS=0 corepack yarn start` als je expliciet een directe Vite-poort nodig hebt.
- **Status:** bevestigd

### Commitizen-hooks blokkeren niet-interactieve commits

- **Datum:** 18-03-2026
- **Waargenomen door:** Codex
- **Context:** Agent-gestuurde commit-workflows
- **Wat verrassend was:** `git commit` activeert Commitizen via Husky en wacht op interactief TTY-invoer, waardoor niet-interactieve agentshells vastlopen.
- **Impact:** Agents kunnen voor onbepaalde tijd vastlopen tijdens wat een normale commit zou moeten zijn.
- **Mitigatie:** Gebruik `git commit --no-verify -m "message"` voor door agenten gemaakte commits. Mensen kunnen nog steeds `corepack yarn commit` of `corepack yarn exec cz` gebruiken.
- **Status:** bevestigd

### Corepack is vereist om Yarn classic te vermijden

- **Datum:** 19-03-2026
- **Waargenomen door:** Codex
- **Context:** Pakketbeheerdermigratie naar Yarn 4
- **Wat was verrassend:** Op de machine is nog steeds een globale Yarn classic-installatie geïnstalleerd `PATH`, zodat het uitvoeren van gewone `yarn` kan worden omgezet naar v1 in plaats van de vastgezette versie van Yarn 4.
- **Impact:** Ontwikkelaars kunnen per ongeluk het vastzetten van de pakketbeheerder van de opslagplaats omzeilen en ander installatiegedrag krijgen of de uitvoer van bestanden vergrendelen.
- **Mitigatie:** Gebruik `corepack yarn ...` voor shell-opdrachten, of voer deze uit `corepack enable` eerst zo duidelijk `yarn` wordt omgezet naar de vastgezette versie van Yarn 4.
- **Status:** bevestigd

### Opgelost: poortloze app-namen botsen in Bitsocial Web-werkbomen

- **Datum:** 30-03-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` starten in één Bitsocial Web-werkboom terwijl een andere werkboom al via Portless werkte
- **Wat verrassend was:** Het gebruik van de letterlijke Portless-app-naam `bitsocial` in elke werkboom zorgt ervoor dat de route zelf botst, zelfs als de backing-poorten verschillend zijn, dus het tweede proces mislukt omdat `bitsocial.localhost` al is geregistreerd.
- **Impact:** Parallelle Bitsocial-webvertakkingen kunnen elkaar blokkeren, ook al is Portless bedoeld om ze toe te staan veilig naast elkaar bestaan.
- **Mitigatie:** Houd Portless opstarten achter `scripts/start-dev.mjs`, dat nu een branch-scoped `*.bitsocial.localhost:1355`-route gebruikt buiten de canonieke case en terugvalt naar een branch-scoped route wanneer de kale `bitsocial.localhost`-naam al bezet is.
- **Status:** bevestigd

### Docs preview gebruikt om de poort hard te coderen 3001

- **Datum:** 30-03-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` uitvoeren naast andere lokale opslagplaatsen en agenten
- **Wat verrassend was:** Het root dev-commando voerde de docs-werkruimte uit met `docusaurus start --port 3001`, dus de hele dev-sessie mislukte wanneer een ander proces al eigenaar was van `3001`, ook al gebruikte de hoofdapp al Portless.
- **Impact:** `yarn start` kon het webproces onmiddellijk beëindigen nadat het was opgestart, waardoor niet-gerelateerd lokaal werk via een docs-port werd onderbroken botsing.
- **Mitigatie:** Houd het opstarten van documenten achter `yarn start:docs`, dat nu Portless plus `scripts/start-docs.mjs` gebruikt om een geïnjecteerde vrije poort te honoreren of terug te vallen naar de volgende beschikbare poort wanneer deze direct wordt uitgevoerd.
- **Status:** bevestigd
