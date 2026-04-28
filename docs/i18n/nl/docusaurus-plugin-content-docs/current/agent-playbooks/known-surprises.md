# Bekende verrassingen

Dit bestand houdt repository-specifieke verwarringspunten bij die agentfouten veroorzaakten.

## Toegangscriteria

Voeg alleen een item toe als alles waar is:

- Het is specifiek voor deze repository (geen algemeen advies).
- Het is waarschijnlijk dat dit zich zal herhalen voor toekomstige agenten.
- Er is sprake van een concrete beperking die gevolgd kan worden.

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

## Inzendingen

### Portless wijzigt de canonieke lokale app-URL

- **Datum:** 18-03-2026
- **Waargenomen door:** Codex
- **Context:** Browserverificatie en rookstromen
- **Wat verrassend was:** De standaard lokale URL is niet de gebruikelijke Vite-poort. De repository verwacht `https://bitsocial.localhost` via Portless, dus het controleren van `localhost:3000` of `localhost:5173` kan de verkeerde app of helemaal niets opleveren.
- **Impact:** Browsercontroles kunnen mislukken of het verkeerde doel valideren, zelfs als de ontwikkelaarsserver in orde is.
- **Beperking:** Gebruik eerst `https://bitsocial.localhost`. Omzeil het alleen met `PORTLESS=0 corepack yarn start` als je expliciet een directe Vite-poort nodig hebt.
- **Status:** bevestigd

### Commitzen hooks blokkeren niet-interactieve commits

- **Datum:** 18-03-2026
- **Waargenomen door:** Codex
- **Context:** Agentgestuurde commit-workflows
- **Wat verrassend was:** `git commit` activeert Commitizen via Husky en wacht op interactieve TTY-invoer, waardoor niet-interactieve agentshells vastlopen.
- **Impact:** Agents kunnen voor onbepaalde tijd blijven hangen tijdens wat een normale commit zou moeten zijn.
- **Mitigatie:** Gebruik `git commit --no-verify -m "message"` voor door agenten gemaakte commits. Mensen kunnen nog steeds `corepack yarn commit` of `corepack yarn exec cz` gebruiken.
- **Status:** bevestigd

### Corepack is vereist om Yarn classic te vermijden

- **Datum:** 19-03-2026
- **Waargenomen door:** Codex
- **Context:** Migratie van pakketbeheerder naar Garen 4
- **Wat verrassend was:** De machine heeft nog steeds een globale Yarn-klassieke installatie op `PATH`, dus het uitvoeren van gewone `yarn` kan worden omgezet naar v1 in plaats van de vastgezette Yarn 4-versie.
- **Impact:** Ontwikkelaars kunnen per ongeluk het vastzetten van de pakketbeheerder van de repository omzeilen en ander installatiegedrag of lockfile-uitvoer krijgen.
- **Beperking:** Gebruik `corepack yarn ...` voor shell-opdrachten, of voer eerst `corepack enable` uit, zodat `yarn` wordt omgezet naar de vastgezette versie van Garen 4.
- **Status:** bevestigd

### Probleem opgelost dat poortloze app-namen botsen in de werkbomen van Bitsocial Web

- **Datum:** 30-03-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` starten in een Bitsocial Web-werkboom terwijl een andere werkboom al via Portless werkte
- **Wat verrassend was:** Het gebruik van de letterlijke poortloze app-naam `bitsocial` in elke werkboom zorgt ervoor dat de route zelf botst, zelfs als de backing-poorten verschillend zijn, dus het tweede proces mislukt omdat `bitsocial.localhost` al is geregistreerd.
- **Impact:** Parallelle Bitsocial-webtakken kunnen elkaar blokkeren, ook al is Portless bedoeld om ze veilig naast elkaar te laten bestaan.
- **Mitigatie:** Houd Portless opstarten achter `scripts/start-dev.mjs`, dat nu een vertakkingsgerichte `*.bitsocial.localhost`-route buiten het canonieke geval gebruikt en terugvalt op een vertakkingsgerichte route wanneer de kale `bitsocial.localhost`-naam al bezet is.
- **Status:** bevestigd

### Documentenvoorbeeld gebruikt om poort 3001 hard te coderen

- **Datum:** 30-03-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` uitvoeren naast andere lokale opslagplaatsen en agenten
- **Wat verrassend was:** Het root dev-commando voerde de docs-werkruimte uit met `docusaurus start --port 3001`, dus de hele dev-sessie mislukte wanneer een ander proces al eigenaar was van `3001`, ook al gebruikte de hoofdapp al Portless.
- **Impact:** `yarn start` kan het webproces onmiddellijk beëindigen nadat het is opgestart, waardoor niet-gerelateerd lokaal werk wordt onderbroken vanwege een botsing met de docs-poort.
- **Mitigatie:** Houd het opstarten van documenten achter `yarn start:docs`, dat nu Portless plus `scripts/start-docs.mjs` gebruikt om een geïnjecteerde vrije poort te honoreren of terug te vallen naar de volgende beschikbare poort wanneer deze direct wordt uitgevoerd.
- **Status:** bevestigd

### Vaste documenten Poortloze hostnaam was hardgecodeerd

- **Datum:** 03-04-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` uitvoeren in een secundaire Bitsocial Web-werkboom terwijl een andere werkboom al documenten via Portless aanleverde
- **Wat verrassend was:** `start:docs` registreerde nog steeds de letterlijke `docs.bitsocial.localhost`-hostnaam, dus `yarn start` kon mislukken, ook al wist de about-app al hoe poortloze routebotsingen voor zijn eigen hostnaam moesten worden vermeden.
- **Impact:** Parallelle werkbomen konden het root dev-commando niet betrouwbaar gebruiken omdat het docs-proces eerst werd afgesloten en `concurrently` vervolgens de rest van de sessie beëindigde.
- **Mitigatie:** Houd het opstarten van documenten achter `scripts/start-docs.mjs`, die nu dezelfde branch-scope Portless-hostnaam afleidt als de about-app en die gedeelde openbare URL injecteert in het `/docs` dev-proxydoel.
- **Status:** bevestigd

### Worktree-shells kunnen de vastgezette Node-versie van de repository missen

- **Datum:** 03-04-2026
- **Waargenomen door:** Codex
- **Context:** `yarn start` uitvoeren in Git-werkbomen zoals `.claude/worktrees/*` of kassa's van een soortgelijke werkboom
- **Wat verrassend was:** Sommige werkboomshells hebben `node` en `yarn node` omgezet in Homebrew-knooppunt `25.2.1`, ook al pint de repository `22.12.0` in `.nvmrc`, zodat `yarn start` de dev-launchers stilletjes onder de verkeerde runtime kon uitvoeren.
- **Impact:** Het gedrag van de ontwikkelaarsserver kan variëren tussen de belangrijkste betaal- en werkbomen, waardoor bugs moeilijk te reproduceren zijn en de verwachte Node 22-toolchain van de repository wordt geschonden.
- **Beperking:** Houd de dev-launchers achter `scripts/start-dev.mjs` en `scripts/start-docs.mjs`, die nu opnieuw worden uitgevoerd onder het binaire `.nvmrc`-knooppunt wanneer de huidige shell de verkeerde versie heeft. Shell-installatie zou nog steeds de voorkeur moeten geven aan `nvm use`.
- **Status:** bevestigd

### `docs-site/` restjes kunnen de ontbrekende documentbron verbergen na de refactor

- **Datum:** 01-04-2026
- **Waargenomen door:** Codex
- **Context:** Monorepo-opschoning na het samenvoegen na het verplaatsen van het Docusaurus-project van `docs-site/` naar `docs/`
- **Wat verrassend was:** De oude map `docs-site/` kan op de schijf blijven staan met verouderde maar belangrijke bestanden zoals `i18n/`, zelfs nadat de bijgehouden repository is verplaatst naar `docs/`. Dat zorgt ervoor dat de refactor er lokaal gedupliceerd uitziet en kan het feit verbergen dat de vertalingen van bijgehouden documenten niet daadwerkelijk naar `docs/` zijn verplaatst.
- **Impact:** Agenten kunnen de oude map als 'ongewenst' verwijderen en per ongeluk de enige lokale kopie van documentvertalingen kwijtraken, of scripts blijven bewerken die nog steeds naar het dode `docs-site/`-pad verwijzen.
- **Mitigatie:** Behandel `docs/` als het enige canonieke documentproject. Voordat u eventuele lokale `docs-site/`-resten verwijdert, herstelt u de bijgehouden bron zoals `docs/i18n/` en werkt u scripts en hooks bij om te stoppen met verwijzen naar `docs-site`.
- **Status:** bevestigd

### Voorvertoningen van meerdere lokale documenten kunnen het RAM-geheugen verhogen tijdens verificatie

- **Datum:** 01-04-2026
- **Waargenomen door:** Codex
- **Context:** Documenten i18n, locale routing en Pagefind-gedrag opgelost met `yarn start:docs` plus Playwright
- **Wat verrassend was:** De standaard documentvoorbeeldmodus voert nu een volledige multilocale documentbuild uit plus Pagefind-indexering voordat het wordt weergegeven, en het levend houden van dat proces naast meerdere Playwright- of Chrome-sessies kan veel meer RAM verbruiken dan een normale Vite of Docusaurus-ontwikkelloop met één land.
- **Impact:** De machine kan geheugenbeperkt raken, browsersessies kunnen crashen en onderbroken uitvoeringen kunnen verouderde docs-servers of headless browsers achterlaten die geheugen blijven verbruiken.
- **Mitigatie:** Voor documentwerk waarvoor geen locale-route- of Pagefind-verificatie nodig is, geeft u de voorkeur aan `DOCS_START_MODE=live yarn start:docs`. Gebruik alleen de standaard multilocale preview wanneer u vertaalde routes of Pagefind moet valideren. Houd één Playwright-sessie aan, sluit oude browsersessies voordat u nieuwe opent en stop de docs-server na verificatie als u deze niet langer nodig heeft.
- **Status:** bevestigd
