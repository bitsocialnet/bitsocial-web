# Bekende verrassingen

Dit bestand houdt repository-specifieke verwarringspunten bij die tot fouten van agents hebben geleid.

## Criteria voor een vermelding

Voeg alleen een vermelding toe als alle onderstaande punten kloppen:

- Het is specifiek voor deze repository (geen algemeen advies).
- De kans is groot dat toekomstige agents er opnieuw tegenaan lopen.
- Er is een concrete mitigatie die te volgen is.

Vraag het bij twijfel eerst aan de ontwikkelaar voordat je een vermelding toevoegt.

## Sjabloon voor een vermelding

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

## Vermeldingen

### Productiedomeinen van Vercel-apps kunnen terugvallen op deployments vanaf Git-master

- **Datum:** 2026-04-28
- **Waargenomen door:** Tommaso + Codex
- **Context:** Het verifiëren van de Seedit- en 5chan-appmirrors in de appdirectory van Bitsocial Web.
- **Wat verrassend was:** De Vercel-projecten `seedit` en `5chan` hadden `gitProviderOptions.createDeployments = "enabled"`, waardoor pushes naar `master` op GitHub werden gepromoveerd naar de productiedomeinen, terwijl het repositorybeleid verwacht dat productiemirrors van apps uitsluitend release-artefacten serveren.
- **Impact:** Badges voor geverifieerde mirrors in de appdirectory kunnen onjuist worden, doordat de productiedomeinen de nieuwste ontwikkelcommit serveren in plaats van de GitHub-release-ZIP waarvan de `index.html`-hash is vastgelegd in `about/src/lib/apps-data.ts`.
- **Mitigatie:** Controleer het Vercel-project met `vercel api /v9/projects/<project-id>` voordat je verificatiemetadata voor mirrors toevoegt of ververst, en bevestig `gitProviderOptions.createDeployments = "disabled"`. Deploy de inhoud van de release-ZIP met `vercel deploy --prebuilt --prod` en gebruik `seedit-omega.vercel.app` of `5chan-omega.vercel.app` voor ontwikkeldeployments.
- **Status:** bevestigd

### Portless 0.11 hergebruikt oude proxystatus tenzij de launcher HTTPS afdwingt

- **Datum:** 2026-04-28
- **Waargenomen door:** Tommaso + Codex
- **Context:** Het omzetten van de normale `yarn start`-flow van de oude proxy-URL `http://bitsocial.localhost:1355` naar `https://bitsocial.localhost`.
- **Wat verrassend was:** Zelfs met `portless@0.11.1` geïnstalleerd hergebruikte Portless de bestaande HTTP-proxy op `~/.portless/proxy.port = 1355` en toonde het de oude `:1355`-URL.
- **Impact:** Pakketversies en documentatie bijwerken is niet genoeg; `yarn start` kan de oude URL nog steeds tonen en gebruiken wanneer een bijdrager oude Portless-status draaiend heeft.
- **Mitigatie:** Zorg dat de startscripts de Portless HTTPS-proxy expliciet op poort `443` starten voordat app-routes worden geregistreerd, zodat de runtime-flow wegmigreert van de opgeslagen `1355`-status in plaats van die over te nemen.
- **Status:** bevestigd

### Portless verandert de canonieke lokale app-URL

- **Datum:** 2026-03-18
- **Waargenomen door:** Codex
- **Context:** Browserverificatie en smoke-flows
- **Wat verrassend was:** De standaard lokale URL is niet de gebruikelijke Vite-poort. De repository verwacht `https://bitsocial.localhost` via Portless, dus het controleren van `localhost:3000` of `localhost:5173` kan de verkeerde app treffen of helemaal niets.
- **Impact:** Browsercontroles kunnen mislukken of het verkeerde doel valideren, zelfs wanneer de dev-server prima draait.
- **Mitigatie:** Gebruik `https://bitsocial.localhost` als eerste keuze. Omzeil dit alleen met `PORTLESS=0 corepack yarn start` wanneer je expliciet een directe Vite-poort nodig hebt.
- **Status:** bevestigd

### Commitizen-hooks blokkeren niet-interactieve commits

- **Datum:** 2026-03-18
- **Waargenomen door:** Codex
- **Context:** Agentgestuurde commit-workflows
- **Wat verrassend was:** `git commit` start Commitizen via Husky en wacht op interactieve TTY-invoer, waardoor niet-interactieve agent-shells blijven hangen.
- **Impact:** Agents kunnen eindeloos vastlopen tijdens wat een gewone commit zou moeten zijn.
- **Mitigatie:** Gebruik `git commit --no-verify -m "message"` voor commits die door agents worden gemaakt. Mensen kunnen nog steeds `corepack yarn commit` of `corepack yarn exec cz` gebruiken.
- **Status:** bevestigd

### Corepack is nodig om Yarn classic te vermijden

- **Datum:** 2026-03-19
- **Waargenomen door:** Codex
- **Context:** Migratie van de pakketbeheerder naar Yarn 4
- **Wat verrassend was:** De machine heeft nog altijd een globale installatie van Yarn classic in `PATH`, waardoor een kaal `yarn`-commando naar v1 kan verwijzen in plaats van naar de vastgezette Yarn 4-versie.
- **Impact:** Ontwikkelaars kunnen per ongeluk de pakketbeheerderpinning van de repository omzeilen en ander installatiegedrag of andere lockfile-uitvoer krijgen.
- **Mitigatie:** Gebruik `corepack yarn ...` voor shell-commando's, of voer eerst `corepack enable` uit zodat een kaal `yarn` naar de vastgezette Yarn 4-versie verwijst.
- **Status:** bevestigd

### Vaste Portless-appnamen botsen tussen Bitsocial Web-worktrees

- **Datum:** 2026-03-30
- **Waargenomen door:** Codex
- **Context:** `yarn start` starten in de ene Bitsocial Web-worktree terwijl een andere worktree al via Portless serveerde
- **Wat verrassend was:** Door in elke worktree de letterlijke Portless-appnaam `bitsocial` te gebruiken, botst de route zelf, zelfs wanneer de onderliggende poorten verschillen. Het tweede proces mislukt dan omdat `bitsocial.localhost` al geregistreerd is.
- **Impact:** Parallelle Bitsocial Web-branches kunnen elkaar blokkeren, terwijl Portless juist bedoeld is om ze veilig naast elkaar te laten bestaan.
- **Mitigatie:** Houd het starten van Portless achter `scripts/start-dev.mjs`, dat inmiddels buiten het canonieke geval een branch-specifieke `*.bitsocial.localhost`-route gebruikt en terugvalt op een branch-specifieke route wanneer de kale naam `bitsocial.localhost` al bezet is.
- **Status:** bevestigd

### De docs-preview had poort 3001 hard-coded

- **Datum:** 2026-03-30
- **Waargenomen door:** Codex
- **Context:** `yarn start` draaien naast andere lokale repositories en agents
- **Wat verrassend was:** Het dev-commando in de root draaide de docs-workspace met `docusaurus start --port 3001`, waardoor de hele dev-sessie mislukte zodra een ander proces `3001` al in gebruik had, ook al gebruikte de hoofdapp al Portless.
- **Impact:** `yarn start` kon het webproces meteen na het opstarten afbreken en zo ongerelateerd lokaal werk onderbreken vanwege een botsing om de docs-poort.
- **Mitigatie:** Houd het starten van docs achter `yarn start:docs`, dat inmiddels Portless plus `scripts/start-docs.mjs` gebruikt om een geïnjecteerde vrije poort te respecteren of terug te vallen op de eerstvolgende beschikbare poort bij directe uitvoering.
- **Status:** bevestigd

### De vaste Portless-hostnaam voor docs was hard-coded

- **Datum:** 2026-04-03
- **Waargenomen door:** Codex
- **Context:** `yarn start` draaien in een tweede Bitsocial Web-worktree terwijl een andere worktree de docs al via Portless serveerde
- **Wat verrassend was:** `start:docs` registreerde nog steeds de letterlijke hostnaam `docs.bitsocial.localhost`, waardoor `yarn start` kon mislukken hoewel de about-app al wist hoe ze route-botsingen in Portless voor haar eigen hostnaam moest vermijden.
- **Impact:** Parallelle worktrees konden het dev-commando in de root niet betrouwbaar gebruiken, omdat het docs-proces als eerste stopte en `concurrently` daarna de rest van de sessie afsloot.
- **Mitigatie:** Houd het starten van docs achter `scripts/start-docs.mjs`, dat inmiddels dezelfde branch-specifieke Portless-hostnaam afleidt als de about-app en die gedeelde publieke URL injecteert in het doel van de `/docs`-dev-proxy.
- **Status:** bevestigd

### Worktree-shells kunnen de vastgezette Node-versie van de repository missen

- **Datum:** 2026-04-03
- **Waargenomen door:** Codex
- **Context:** `yarn start` draaien in Git-worktrees zoals `.claude/worktrees/*` of naastgelegen worktree-checkouts
- **Wat verrassend was:** Sommige worktree-shells losten `node` en `yarn node` op naar Homebrew Node `25.2.1`, terwijl de repository `22.12.0` vastzet in `.nvmrc`. Daardoor kon `yarn start` de dev-launchers stilzwijgend onder de verkeerde runtime draaien.
- **Impact:** Het gedrag van de dev-server kan verschillen tussen de hoofdcheckout en worktrees, waardoor bugs moeilijk reproduceerbaar worden en de verwachte Node 22-toolchain van de repository wordt geschonden.
- **Mitigatie:** Houd de dev-launchers achter `scripts/start-dev.mjs` en `scripts/start-docs.mjs`, die zichzelf inmiddels opnieuw uitvoeren onder de Node-binary uit `.nvmrc` wanneer de huidige shell op de verkeerde versie staat. De shell-configuratie zou nog steeds `nvm use` moeten verkiezen.
- **Status:** bevestigd

### Restanten van `docs-site/` kunnen na de refactor verhullen dat docs-bronbestanden ontbreken

- **Datum:** 2026-04-01
- **Waargenomen door:** Codex
- **Context:** Opruimen van de monorepo na de merge, nadat het Docusaurus-project van `docs-site/` naar `docs/` was verplaatst
- **Wat verrassend was:** De oude map `docs-site/` kan op schijf achterblijven met verouderde maar belangrijke bestanden zoals `i18n/`, zelfs nadat de getrackte repository naar `docs/` is verhuisd. Daardoor lijkt de refactor lokaal gedupliceerd en kan verborgen blijven dat getrackte docs-vertalingen nooit echt naar `docs/` zijn verplaatst.
- **Impact:** Agents kunnen de oude map als “rommel” verwijderen en per ongeluk de enige lokale kopie van de docs-vertalingen kwijtraken, of scripts blijven bewerken die nog naar het dode pad `docs-site/` verwijzen.
- **Mitigatie:** Behandel `docs/` als het enige canonieke docs-project. Herstel getrackte bronbestanden zoals `docs/i18n/` voordat je lokale restanten van `docs-site/` verwijdert, en werk scripts en hooks bij zodat ze niet langer naar `docs-site` verwijzen.
- **Status:** bevestigd

### De multilocale docs-preview kan tijdens verificatie veel RAM opslokken

- **Datum:** 2026-04-01
- **Waargenomen door:** Codex
- **Context:** Docs-i18n, locale-routing en Pagefind-gedrag repareren met `yarn start:docs` plus Playwright
- **Wat verrassend was:** De standaard previewmodus voor docs doet inmiddels een volledige multilocale docs-build plus Pagefind-indexering voordat er wordt geserveerd. Dat proces draaiend houden naast meerdere Playwright- of Chrome-sessies kan veel meer RAM verbruiken dan een normale Vite-lus of een Docusaurus-devlus voor één locale.
- **Impact:** De machine kan geheugenkrap raken, browsersessies kunnen crashen, en afgebroken runs kunnen verouderde docs-servers of headless browsers achterlaten die geheugen blijven opslokken.
- **Mitigatie:** Kies voor docs-werk dat geen verificatie van locale-routes of Pagefind vereist liever `DOCS_START_MODE=live yarn start:docs`. Gebruik de standaard multilocale preview alleen wanneer je vertaalde routes of Pagefind moet valideren. Houd één Playwright-sessie aan, sluit oude browsersessies voordat je nieuwe opent, en stop de docs-server na de verificatie als je die niet meer nodig hebt.
- **Status:** bevestigd

### `translate-docs.py` kan docs-locales half vertaald of met kapotte linkdoelen achterlaten

- **Datum:** 2026-04-06
- **Waargenomen door:** Codex
- **Context:** Gelokaliseerde docs-routes en -inhoud repareren nadat `yarn start:docs` Engelse detailpagina's serveerde of geen locale-uitvoer kon bouwen
- **Wat verrassend was:** De vertaalpijplijn voor docs had twee repository-specifieke faalwijzen tegelijk: `scripts/translate-docs.py` haalde slechts een kleine subset van de `DocsHome`-teksten op wanneer `tr(...)`-aanroepen vormen gebruikten die het script niet kon parsen, en de vertaalde markdown onder `docs/i18n/**` kon machinaal vertaalde slugs of `ZXQPLACEHOLDER`-resten in linkdoelen bevatten.
- **Impact:** Gelokaliseerde homepages kunnen stilzwijgend terugvallen op het Engels, gelokaliseerde detailpagina's kunnen onvertaald lijken, en een volledige `yarn docs:build` kan stuklopen op kapotte locale-links terwijl de brondocumentatie zelf geldig is.
- **Mitigatie:** Voer na het wijzigen van docs-vertalingen of het opnieuw genereren van locale-bestanden altijd `yarn docs:build` uit vanuit de root van de repository, scan de markdown onder `docs/i18n/**` op `ZXQPLACEHOLDER`, en controleer of vertaalde links nog naar canonieke doc-slugs zoals `/apps/5chan/` verwijzen in plaats van naar vertaalde URL-paden. Bevestig bij gewijzigde `DocsHome`-teksten dat `scripts/translate-docs.py` nog steeds alle `docs.home.*`-berichten ophaalt.
- **Status:** bevestigd

### No-JS-controles van de about-site moeten de Portless-route gebruiken, niet een losstaande SSR-preview

- **Datum:** 2026-04-12
- **Waargenomen door:** Codex
- **Context:** No-JS-ondersteuning verifiëren voor de site in `about/` vanuit een branch-worktree
- **Wat verrassend was:** Een losstaande SSR-preview kan er gezond uitzien terwijl de daadwerkelijke branch-specifieke Portless-route nog de verkeerde app-shell of een ouder proces serveert. In deze repository is het echte lokale contract de Portless-hostnaam uit `yarn start`, niet een ad-hoc previewserver.
- **Impact:** Agents kunnen ten onrechte beweren dat no-JS-ondersteuning werkt, of regressies missen die zich alleen op `*.bitsocial.localhost` voordoen.
- **Mitigatie:** Start voor browserverificatie van `about/` altijd de echte lokale server met `yarn start` of `yarn start:about` en test eerst de branch-specifieke Portless-URL. Als een Portless-hostnaam verouderd lijkt, inspecteer dan het oude proces en stop het voordat je opnieuw test.
- **Status:** bevestigd

### `chain/` was onzichtbaar voor `yarn build:verify` en `yarn doctor`

- **Datum:** 2026-07-05
- **Waargenomen door:** Codex
- **Context:** Een diff met alleen wijzigingen in chain/ verifiëren nadat de workspace `chain/` (een op zichzelf staande Vite-app voor `chain.bitsocial.net`) aan de monorepo was toegevoegd.
- **Wat verrassend was:** `scripts/verify-build.mjs` herkende alleen de padprefixen `about/`, `docs/` en `stats/`, waardoor een diff met alleen chain/-wijzigingen "No targeted build checks matched the current diff" printte en helemaal geen build draaide, hoewel `build:chain` al bestond in de root-`package.json`. Daarnaast was `yarn doctor` hard-coded op `react-doctor about -y`, waardoor React-wijzigingen onder `chain/src` nul dekking van React Doctor kregen.
- **Impact:** Agents die chain-wijzigingen verifieerden moesten weten dat ze `yarn build:chain` rechtstreeks moesten aanroepen in plaats van op `yarn build:verify` te vertrouwen, en React-problemen in `chain/src` (effects, hooks, dode code) bleven onopgemerkt door `yarn doctor`.
- **Mitigatie:** `scripts/verify-build.mjs` heeft nu een tak voor `chain/` die die van `about/` spiegelt, en `doctor` / `doctor:verbose` draaien nu `react-doctor --project about,chain -y` in één aanroep. `doctor:score` blijft alleen voor `about`, omdat `--score` stilzwijgend niets print in combinatie met `--project` voor meer dan één project; gebruik `yarn react-doctor --project about,chain --verbose -y` (of `--json`) als je een score voor chain nodig hebt.
- **Status:** bevestigd

### Browser-P2P draait op secure WebSockets; pkc-js weigert WebRTC en WebTransport standaard

- **Datum:** 2026-08-02
- **Waargenomen door:** Claude
- **Context:** Teksten schrijven voor de landingspagina en de documentatie over hoe Bitsocial browser-P2P werkt
- **Wat verrassend was:** `@pkcprotocol/pkc-js` levert een standaard connection gater mee die WebRTC- en WebTransport-dials in de browser afwijst — `dist/browser/helia/dial-transport-filter.js` exporteert `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Het commentaar in de broncode geeft de reden: in de browser voegen die transports lange, vaak mislukkende verbindingsopbouwpaden toe (STUN/ICE, certhash-rotatie) die het laden vertragen, terwijl WebSocket direct en betrouwbaar is. Elke live peer in het P2P-statuspaneel van de blog toont "Secure WebSocket". De gater zit in `node_modules`, dus niets in de repository wijst erop.
- **Impact:** Het is heel eenvoudig om technisch plausibele maar onjuiste publieke teksten te schrijven — bijvoorbeeld door te stellen dat Bitsocial browser-P2P mogelijk werd doordat WebTransport in maart 2026 browser-Baseline bereikte. Die bewering belandde in de landingspagina, de vergelijkingstabel en twee documentatiepagina's voordat de ontwikkelaar het opmerkte. Onjuiste architectuurbeweringen op publieke pagina's worden gecontroleerd door precies het ontwikkelaarspubliek waarop de site zich richt.
- **Mitigatie:** Leid nooit af welke transports Bitsocial gebruikt uit wat libp2p of het browserplatform in theorie ondersteunt. Controleer `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` op de actuele weigerlijst, bevestig dat er geen `connectionGater`-override bestaat onder `about/src/`, en lees de live transportlabels in het "P2P status"-paneel van de blog voordat je een publieke bewering doet. De upstream-wijziging die publiceren vanuit de browser daadwerkelijk mogelijk maakte, was de monotone-seqno-fix voor gossipsub in `@libp2p/gossipsub` 15.0.21 (mei 2026); pkc-js levert momenteel 16.0.4 mee.
- **Status:** bevestigd

### Relatieve `./page.md`-links vanaf een onvertaalde docs-pagina breken elke gelokaliseerde build

- **Datum:** 2026-08-02
- **Waargenomen door:** Claude
- **Context:** Een nieuwe, alleen-Engelse pagina `docs/browser-p2p.md` toevoegen die met `./peer-to-peer-protocol.md` en `./apps/5chan.md` naar bestaande documentatie verwees
- **Wat verrassend was:** Elke locale onder `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` spiegelt de docs-boom. Een nieuwe pagina die in die spiegels ontbreekt, wordt via de Engelse fallback nog steeds in elke locale gerenderd, maar de relatieve markdown-links daarin lossen niet meer op — Docusaurus genereert `/ar/browser-p2p/peer-to-peer-protocol.md/` en laat de build falen met "Docusaurus found broken links!". Cruciaal detail: `yarn build:verify` en `yarn docs:build:verify` bouwen alleen `en` en slagen probleemloos; alleen een volledige `yarn docs:build` legt het bloot, en die breekt af op de alfabetisch eerste locale (`ar`).
- **Impact:** Een docs-wijziging kan elke snelle lokale controle doorstaan en tóch de multilocale productiebuild breken. De fout lijkt bovendien los te staan van de wijziging, omdat de melding een localepad noemt dat de auteur nooit heeft aangeraakt.
- **Mitigatie:** Gebruik in elke docs-pagina die niet naar `docs/i18n/**` is gespiegeld root-relatieve links (`/peer-to-peer-protocol/`, `/apps/5chan/`) in plaats van relatieve `.md`-links; Docusaurus zet daar automatisch de locale voor. `docs/build-your-own-client.md` is het bestaande voorbeeld. Draai een volledige `yarn docs:build` — niet alleen `build:verify` — voordat je een wijziging overdraagt die een docs-pagina toevoegt of ernaar linkt.
- **Status:** bevestigd

### Gelijktijdige runs van `update-translations.js` verliezen stilzwijgend sleutels

- **Datum:** 2026-08-02
- **Waargenomen door:** Claude
- **Context:** 26 vertaalde i18next-sleutels toepassen op alle 36 locales via de `translate`-skill
- **Wat verrassend was:** Elke aanroep is een read-modify-write over alle 36 locale-bestanden, dus twee gelijktijdige aanroepen overschrijven elkaar en er verdwijnt zonder foutmelding een sleutel. De `translate`-skill schrijft expliciet voor om tot 4 subagents tegelijk te starten, die het script elk zouden aanroepen.
- **Impact:** Faalt stilzwijgend: sleutels verdwijnen uit willekeurige locales en de diff ziet er nog steeds plausibel uit.
- **Mitigatie:** Laat vertaal-subagents nooit gelijktijdig locale-bestanden schrijven — laat ze alleen JSON-woordenboekbestanden produceren en pas daarna elke sleutel serieel toe vanuit de bovenliggende agent. Controleer na het toepassen programmatisch dat elke sleutel in alle 35 niet-Engelse locales bestaat en dat geen enkele waarde byte-identiek is aan de Engelse bron.
- **Status:** bevestigd
- **Update (2026-08-10):** Het script bepaalde zijn doelmap vroeger ook als `path.join(process.cwd(), "public", "translations")`, waardoor het gedocumenteerde commando vanuit de repository-root mislukte met "Translations directory not found" en vanuit `about/` moest worden uitgevoerd. Het bepaalt de workspace nu op basis van de huidige map of van zijn eigen locatie en werkt vanaf elke plek. De gelijktijdigheidsvalkuil hierboven is ongewijzigd.

### Annotatiebediening voor development kan aangestuurde klikken onderscheppen

- **Context:** De about- en chain-sites hebben vaste bedieningselementen in de rechteronderhoek, waar in development ook de Agentation-toolbar verschijnt.
- **Mitigatie:** `scripts/pw-session.sh open` registreert `window.__NO_DEV_TOOLBAR__ = true` voordat de pagina opnieuw wordt geladen. De Agentation-initializer respecteert ook `__VISUAL_TESTING__` en `__PROFILING__`; broninspectie blijft daar los van beschikbaar. Directe browserautomatisering moet dezelfde vlag instellen voordat de applicatie wordt geladen.

### `skills add` installeert de kopieën voor Codex en Cursor in de door Git genegeerde map `.agents/`

- **Datum:** 2026-08-18
- **Waargenomen door:** Tommaso + Claude
- **Context:** De skill `improve-threejs` uit `millionco/react-doctor` installeren met de `skills`-CLI (`vercel-labs/skills`).
- **Wat verrassend was:** `npx skills add <repo> --skill <name> --agent codex` en `--agent cursor` schrijven allebei naar `.agents/skills/<name>/`, niet naar `.codex/skills/` of `.cursor/skills/`. `AGENTS.md` verbiedt een `.agents/`-map op repositoryniveau en `.gitignore:29` negeert die, dus beide kopieën blijven stilzwijgend ongetrackt. Alleen `--agent claude-code` schrijft naar de verwachte `.claude/skills/`. Daarnaast mislukt de gedocumenteerde kommagescheiden vorm (`--agent claude-code,codex,cursor`) met "Invalid agents" en wordt er niets geïnstalleerd, hoewel elke naam afzonderlijk geldig is.
- **Impact:** De installatie meldt succes, terwijl twee van de drie toolchainkopieën terechtkomen op een plek die nooit wordt gecommit, zodat Codex en Cursor de skill na een verse clone stilzwijgend missen. De kommavorm kan ook een installatie opleveren die niets doet maar als succes oogt.
- **Huidige mitigatie:** De repository trackt `.agents/skills` nu als canonieke bron en genereert Claude-kopieën met `yarn ai-workflow:sync`. Het vroegere verbod op `.agents` en de bijbehorende ignore-regel zijn verwijderd. Kopieer nieuwe skills niet naar drie onafhankelijke roots; controleer na het toevoegen van een skill de pariteit van de gegenereerde bestanden en de catalogus van de app.
- **Status:** bevestigd
