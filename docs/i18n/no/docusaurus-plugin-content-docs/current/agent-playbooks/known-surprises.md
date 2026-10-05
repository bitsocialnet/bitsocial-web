# Kjente overraskelser

Denne filen holder oversikt over repo-spesifikke forvirringspunkter som har ført til agentfeil.

## Kriterier for oppføring

Legg bare til en oppføring hvis alt dette stemmer:

- Den er spesifikk for dette repoet (ikke generelle råd).
- Den vil sannsynligvis dukke opp igjen for framtidige agenter.
- Den har et konkret tiltak som lar seg følge.

Er du i tvil, spør utvikleren før du legger til en oppføring.

## Mal for oppføring

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

## Oppføringer

### Produksjonsdomener for Vercel-apper kan drive tilbake til deployer fra Git master

- **Dato:** 2026-04-28
- **Observert av:** Tommaso + Codex
- **Kontekst:** Verifisering av appspeilene for Seedit og 5chan i appkatalogen på Bitsocial Web.
- **Det overraskende:** Vercel-prosjektene `seedit` og `5chan` hadde `gitProviderOptions.createDeployments = "enabled"`, så push til `master` på GitHub ble forfremmet til produksjonsdomenene, selv om repo-policyen forventer at appspeil i produksjon utelukkende serverer utgivelsesartefakter.
- **Konsekvens:** Merkene for verifiserte speil i appkatalogen kan bli usanne, fordi produksjonsdomenene serverer siste utviklingscommit i stedet for GitHub-utgivelsens ZIP, der hashen til `index.html` er registrert i `about/src/lib/apps-data.ts`.
- **Tiltak:** Før du legger til eller oppdaterer metadata for speilverifisering, sjekk Vercel-prosjektet med `vercel api /v9/projects/<project-id>` og bekreft at `gitProviderOptions.createDeployments = "disabled"`. Deploy innholdet i utgivelses-ZIP-en med `vercel deploy --prebuilt --prod`, og bruk `seedit-omega.vercel.app` eller `5chan-omega.vercel.app` til utviklingsdeployer.
- **Status:** confirmed

### Portless 0.11 gjenbruker gammel proxy-tilstand med mindre starteren tvinger fram HTTPS

- **Dato:** 2026-04-28
- **Observert av:** Tommaso + Codex
- **Kontekst:** Oppgradering av den vanlige `yarn start`-flyten fra den gamle proxy-URL-en `http://bitsocial.localhost:1355` til `https://bitsocial.localhost`.
- **Det overraskende:** Selv med `portless@0.11.1` installert gjenbrukte Portless den eksisterende HTTP-proxyen fra `~/.portless/proxy.port = 1355` og skrev ut den gamle `:1355`-URL-en.
- **Konsekvens:** Det holder ikke å oppdatere pakkeversjoner og dokumentasjon; `yarn start` kan fortsatt annonsere og bruke den gamle URL-en når en bidragsyter har gammel Portless-tilstand kjørende.
- **Tiltak:** Sørg for at oppstartsskriptene uttrykkelig starter Portless sin HTTPS-proxy på port `443` før apprutene registreres, slik at kjøreflyten migrerer bort fra lagret `1355`-tilstand i stedet for å arve den.
- **Status:** confirmed

### Portless endrer den kanoniske lokale app-URL-en

- **Dato:** 2026-03-18
- **Observert av:** Codex
- **Kontekst:** Nettleserverifisering og røyktester
- **Det overraskende:** Standard lokal URL er ikke den vanlige Vite-porten. Repoet forventer `https://bitsocial.localhost` via Portless, så å sjekke `localhost:3000` eller `localhost:5173` kan treffe feil app, eller ingenting i det hele tatt.
- **Konsekvens:** Nettlesersjekker kan feile eller validere feil mål selv når dev-serveren er sunn.
- **Tiltak:** Bruk `https://bitsocial.localhost` først. Omgå den bare med `PORTLESS=0 corepack yarn start` når du uttrykkelig trenger en direkte Vite-port.
- **Status:** confirmed

### Commitizen-hooks blokkerer ikke-interaktive commits

- **Dato:** 2026-03-18
- **Observert av:** Codex
- **Kontekst:** Agentdrevne commit-arbeidsflyter
- **Det overraskende:** `git commit` utløser Commitizen via Husky og venter på interaktiv TTY-inndata, noe som henger i ikke-interaktive agentskall.
- **Konsekvens:** Agenter kan stoppe opp på ubestemt tid under det som skulle vært en helt vanlig commit.
- **Tiltak:** Bruk `git commit --no-verify -m "message"` for commits laget av agenter. Mennesker kan fortsatt bruke `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** confirmed

### Corepack er nødvendig for å unngå Yarn classic

- **Dato:** 2026-03-19
- **Observert av:** Codex
- **Kontekst:** Migrering av pakkebehandler til Yarn 4
- **Det overraskende:** Maskinen har fortsatt en global installasjon av Yarn classic på `PATH`, så det å kjøre `yarn` uten videre kan treffe v1 i stedet for den pinnede Yarn 4-versjonen.
- **Konsekvens:** Utviklere kan ved et uhell omgå repoets pinning av pakkebehandler og få annen installasjonsatferd eller andre lockfile-utdata.
- **Tiltak:** Bruk `corepack yarn ...` i skallkommandoer, eller kjør `corepack enable` først slik at `yarn` uten videre treffer den pinnede Yarn 4-versjonen.
- **Status:** confirmed

### Faste Portless-appnavn kolliderer på tvers av Bitsocial Web-worktrees

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Kjøring av `yarn start` i én Bitsocial Web-worktree mens en annen worktree allerede serverte via Portless
- **Det overraskende:** Å bruke det bokstavelige Portless-appnavnet `bitsocial` i hver worktree gjør at selve ruten kolliderer, selv når de bakenforliggende portene er forskjellige, så den andre prosessen feiler fordi `bitsocial.localhost` allerede er registrert.
- **Konsekvens:** Parallelle Bitsocial Web-brancher kan blokkere hverandre, selv om Portless er ment å la dem sameksistere trygt.
- **Tiltak:** Hold Portless-oppstarten bak `scripts/start-dev.mjs`, som nå bruker en branch-basert `*.bitsocial.localhost`-rute utenfor det kanoniske tilfellet, og som faller tilbake til en branch-basert rute når det nakne navnet `bitsocial.localhost` allerede er opptatt.
- **Status:** confirmed

### Forhåndsvisningen av dokumentasjonen hardkodet tidligere port 3001

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Kjøring av `yarn start` samtidig med andre lokale repoer og agenter
- **Det overraskende:** Dev-kommandoen på rotnivå kjørte docs-workspacet med `docusaurus start --port 3001`, så hele dev-økten feilet så snart en annen prosess allerede eide `3001`, selv om hovedappen allerede brukte Portless.
- **Konsekvens:** `yarn start` kunne drepe web-prosessen rett etter oppstart og avbryte urelatert lokalt arbeid på grunn av en portkollisjon i dokumentasjonen.
- **Tiltak:** Hold docs-oppstarten bak `yarn start:docs`, som nå bruker Portless pluss `scripts/start-docs.mjs` for å respektere en injisert ledig port, eller falle tilbake til neste ledige port når den kjøres direkte.
- **Status:** confirmed

### Portless-vertsnavnet for dokumentasjonen var hardkodet

- **Dato:** 2026-04-03
- **Observert av:** Codex
- **Kontekst:** Kjøring av `yarn start` i en sekundær Bitsocial Web-worktree mens en annen worktree allerede serverte dokumentasjonen via Portless
- **Det overraskende:** `start:docs` registrerte fortsatt det bokstavelige vertsnavnet `docs.bitsocial.localhost`, så `yarn start` kunne feile selv om about-appen allerede visste hvordan den skulle unngå Portless-rutekollisjoner for sitt eget vertsnavn.
- **Konsekvens:** Parallelle worktrees kunne ikke bruke dev-kommandoen på rotnivå på en pålitelig måte, fordi docs-prosessen avsluttet først og `concurrently` deretter drepte resten av økten.
- **Tiltak:** Hold docs-oppstarten bak `scripts/start-docs.mjs`, som nå utleder det samme branch-baserte Portless-vertsnavnet som about-appen, og injiserer den delte offentlige URL-en inn i målet for dev-proxyen på `/docs`.
- **Status:** confirmed

### Worktree-skall kan bomme på repoets pinnede Node-versjon

- **Dato:** 2026-04-03
- **Observert av:** Codex
- **Kontekst:** Kjøring av `yarn start` i Git-worktrees som `.claude/worktrees/*` eller sidestilte worktree-utsjekker
- **Det overraskende:** Enkelte worktree-skall løste `node` og `yarn node` til Homebrew-Node `25.2.1`, selv om repoet pinner `22.12.0` i `.nvmrc`, så `yarn start` kunne stille og rolig kjøre dev-starterne på feil kjøretidsmiljø.
- **Konsekvens:** Dev-serverens atferd kan drive fra hverandre mellom hovedutsjekken og worktrees, noe som gjør feil vanskelige å reprodusere og bryter med Node 22-verktøykjeden repoet forventer.
- **Tiltak:** Hold dev-starterne bak `scripts/start-dev.mjs` og `scripts/start-docs.mjs`, som nå starter seg selv på nytt under Node-binæren fra `.nvmrc` når gjeldende skall har feil versjon. Skalloppsett bør fortsatt foretrekke `nvm use`.
- **Status:** confirmed

### Rester av `docs-site/` kan skjule manglende dokumentasjonskilde etter refaktoreringen

- **Dato:** 2026-04-01
- **Observert av:** Codex
- **Kontekst:** Opprydding i monorepoet etter merge, da Docusaurus-prosjektet ble flyttet fra `docs-site/` til `docs/`
- **Det overraskende:** Den gamle mappen `docs-site/` kan bli liggende igjen på disk med utdaterte, men viktige filer som `i18n/`, også etter at det sporede repoet gikk over til `docs/`. Det får refaktoreringen til å se duplisert ut lokalt, og kan skjule at sporede dokumentasjonsoversettelser aldri ble flyttet inn i `docs/`.
- **Konsekvens:** Agenter kan slette den gamle mappen som «søppel» og ved et uhell miste den eneste lokale kopien av dokumentasjonsoversettelsene, eller fortsette å redigere skript som fortsatt peker på den døde stien `docs-site/`.
- **Tiltak:** Behandle `docs/` som det eneste kanoniske dokumentasjonsprosjektet. Før du sletter lokale rester av `docs-site/`, gjenopprett sporet kildemateriale som `docs/i18n/` og oppdater skript og hooks slik at de slutter å referere til `docs-site`.
- **Status:** confirmed

### Flerspråklig forhåndsvisning av dokumentasjonen kan gi RAM-topper under verifisering

- **Dato:** 2026-04-01
- **Observert av:** Codex
- **Kontekst:** Retting av i18n, lokale-ruting og Pagefind-atferd i dokumentasjonen med `yarn start:docs` pluss Playwright
- **Det overraskende:** Standardmodusen for forhåndsvisning av dokumentasjonen gjør nå en full flerspråklig docs-build pluss Pagefind-indeksering før den begynner å servere, og å holde den prosessen i live ved siden av flere Playwright- eller Chrome-økter kan bruke mye mer RAM enn en vanlig Vite-loop eller en Docusaurus-dev-loop for én lokale.
- **Konsekvens:** Maskinen kan gå tom for minne, nettleserøkter kan krasje, og avbrutte kjøringer kan etterlate utdaterte docs-servere eller headless nettlesere som fortsetter å bruke minne.
- **Tiltak:** For dokumentasjonsarbeid som ikke trenger verifisering av lokale-ruter eller Pagefind, foretrekk `DOCS_START_MODE=live yarn start:docs`. Bruk bare den flerspråklige standardforhåndsvisningen når du må validere oversatte ruter eller Pagefind. Hold deg til én enkelt Playwright-økt, lukk gamle nettleserøkter før du åpner nye, og stopp docs-serveren etter verifisering hvis du ikke trenger den lenger.
- **Status:** confirmed

### `translate-docs.py` kan etterlate docs-lokaler halvoversatt eller med ødelagte lenkemål

- **Dato:** 2026-04-06
- **Observert av:** Codex
- **Kontekst:** Retting av lokaliserte dokumentasjonsruter og innhold etter at `yarn start:docs` serverte engelske detaljsider eller ikke klarte å bygge lokale-utdata
- **Det overraskende:** Oversettelsespipelinen for dokumentasjonen hadde to repo-spesifikke feilmoduser samtidig: `scripts/translate-docs.py` hentet bare ut en liten delmengde av `DocsHome`-meldingene når `tr(...)`-kall brukte former den ikke klarte å parse, og oversatt markdown under `docs/i18n/**` kunne inneholde maskinoversatte slugger eller `ZXQPLACEHOLDER`-artefakter inne i lenkemål.
- **Konsekvens:** Lokaliserte hjemmesider kan stille og rolig falle tilbake til engelsk, lokaliserte detaljsider kan se uoversatte ut, og en full `yarn docs:build` kan feile på ødelagte lokale-lenker selv om kildedokumentasjonen er gyldig.
- **Tiltak:** Etter endringer i dokumentasjonsoversettelser eller regenerering av lokale-filer, kjør alltid `yarn docs:build` fra repo-roten, søk gjennom markdown under `docs/i18n/**` etter `ZXQPLACEHOLDER`, og bekreft at oversatte lenker fortsatt peker til kanoniske dokumentslugger som `/apps/5chan/` i stedet for oversatte URL-stier. Hvis teksten i `DocsHome` er endret, bekreft at `scripts/translate-docs.py` fortsatt henter ut alle `docs.home.*`-meldinger.
- **Status:** confirmed

### No-JS-sjekker for about-siden må bruke Portless-ruten, ikke en frittstående SSR-forhåndsvisning

- **Dato:** 2026-04-12
- **Observert av:** Codex
- **Kontekst:** Verifisering av no-JS-støtte for siden `about/` fra en branch-worktree
- **Det overraskende:** En frittstående SSR-forhåndsvisning kan se sunn ut mens den faktiske branch-baserte Portless-ruten fortsatt serverer feil app-skall eller en eldre prosess. I dette repoet er den reelle lokale kontrakten Portless-vertsnavnet fra `yarn start`, ikke en ad hoc forhåndsvisningsserver.
- **Konsekvens:** Agenter kan feilaktig hevde at no-JS-støtten fungerer, eller overse regresjoner som bare viser seg på `*.bitsocial.localhost`.
- **Tiltak:** For nettleserverifisering av `about/`, start alltid den ekte lokale serveren med `yarn start` eller `yarn start:about` og test den branch-baserte Portless-URL-en først. Ser et Portless-vertsnavn utdatert ut, undersøk og stopp den gamle prosessen før du tester på nytt.
- **Status:** confirmed

### `chain/` var usynlig for `yarn build:verify` og `yarn doctor`

- **Dato:** 2026-07-05
- **Observert av:** Codex
- **Kontekst:** Verifisering av en diff som bare berørte chain/, etter at workspacet `chain/` (frittstående Vite-app for `chain.bitsocial.net`) ble lagt til i monorepoet.
- **Det overraskende:** `scripts/verify-build.mjs` gjenkjente bare stiprefiksene `about/`, `docs/` og `stats/`, så en diff som bare berørte chain/ skrev ut "No targeted build checks matched the current diff" og kjørte ingen build i det hele tatt, selv om `build:chain` allerede fantes i `package.json` på rotnivå. I tillegg var `yarn doctor` hardkodet til `react-doctor about -y`, så React-endringer under `chain/src` fikk null dekning fra React Doctor.
- **Konsekvens:** Agenter som verifiserte chain-endringer måtte vite at de skulle kalle `yarn build:chain` direkte i stedet for å stole på `yarn build:verify`, og React-problemer i `chain/src` (effekter, hooks, død kode) ble ikke oppdaget av `yarn doctor`.
- **Tiltak:** `scripts/verify-build.mjs` har nå en gren for `chain/` som speiler grenen for `about/`, og `doctor` / `doctor:verbose` kjører nå `react-doctor --project about,chain -y` i ett enkelt kall. `doctor:score` gjelder fortsatt bare `about`, fordi `--score` stille og rolig skriver ut ingenting når det kombineres med `--project` for mer enn ett prosjekt; bruk `yarn react-doctor --project about,chain --verbose -y` (eller `--json`) hvis du trenger en score for chain.
- **Status:** confirmed

### Browser-P2P kjører på sikre WebSockets; pkc-js avviser WebRTC og WebTransport som standard

- **Dato:** 2026-08-02
- **Observert av:** Claude
- **Kontekst:** Skriving av tekst til landingsside og dokumentasjon om hvordan Bitsocial browser-P2P fungerer
- **Det overraskende:** `@pkcprotocol/pkc-js` leveres med en standard tilkoblingsvokter som avviser WebRTC- og WebTransport-oppkall i nettleseren — `dist/browser/helia/dial-transport-filter.js` eksporterer `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Kommentaren i kilden oppgir grunnen: i nettleseren legger disse transportene til lange og ofte mislykkede løp for å opprette forbindelse (STUN/ICE, rotasjon av certhash) som gjør innlastingen tregere, mens WebSocket er direkte og pålitelig. Hver aktive peer i P2P-statuspanelet på bloggen viser "Secure WebSocket". Vokteren ligger i `node_modules`, så ingenting i repoet antyder at den finnes.
- **Konsekvens:** Det er svært lett å skrive teknisk plausibel, men usann offentlig tekst — for eksempel å gi WebTransport sin ankomst til Baseline i nettleserne i mars 2026 æren for at Bitsocial browser-P2P ble mulig. Den påstanden rakk å bli publisert på landingssiden, i sammenligningstabellen og på to dokumentasjonssider før utvikleren oppdaget den. Feilaktige arkitekturpåstander på offentlige sider blir kontrollert av nøyaktig det utviklerpublikummet nettstedet retter seg mot.
- **Tiltak:** Aldri utled hvilke transporter Bitsocial bruker fra hva libp2p eller nettleserplattformen støtter i prinsippet. Sjekk `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` for gjeldende avvisningsliste, bekreft at ingen overstyring av `connectionGater` finnes under `about/src/`, og les de aktive transportetikettene i panelet "P2P status" på bloggen før du fremsetter offentlige påstander. Oppstrømsendringen som faktisk åpnet for publisering fra nettleseren, var fiksen for monoton seqno i gossipsub i `@libp2p/gossipsub` 15.0.21 (mai 2026); pkc-js leverer for tiden 16.0.4.
- **Status:** confirmed

### Relative `./page.md`-lenker fra en uoversatt dokumentasjonsside ødelegger hver lokaliserte build

- **Dato:** 2026-08-02
- **Observert av:** Claude
- **Kontekst:** Å legge til en ny engelskspråklig side, `docs/browser-p2p.md`, som lenket til eksisterende dokumentasjon med `./peer-to-peer-protocol.md` og `./apps/5chan.md`
- **Det overraskende:** Hver lokale under `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` speiler dokumentasjonstreet. En ny side som mangler i disse speilene blir likevel rendret i alle lokaler via engelsk fallback, men de relative markdown-lenkene løses ikke lenger opp — Docusaurus genererer `/ar/browser-p2p/peer-to-peer-protocol.md/` og feiler buildet med "Docusaurus found broken links!". Det avgjørende er at `yarn build:verify` og `yarn docs:build:verify` bare bygger `en` og går rent gjennom; bare en full `yarn docs:build` avdekker problemet, og den avbryter på den første lokalen alfabetisk (`ar`).
- **Konsekvens:** En dokumentasjonsendring kan passere alle raske lokale sjekker og likevel ødelegge den flerspråklige produksjonsbuilden. Feilen ser dessuten urelatert ut til endringen, siden feilmeldingen navngir en lokale-sti forfatteren aldri har rørt.
- **Tiltak:** På dokumentasjonssider som ikke er speilet inn i `docs/i18n/**`, bruk rot-relative lenker (`/peer-to-peer-protocol/`, `/apps/5chan/`) i stedet for relative lenker med `.md`; Docusaurus setter lokale-prefikset foran automatisk. `docs/build-your-own-client.md` er det eksisterende eksempelet. Kjør en full `yarn docs:build` — ikke bare `build:verify` — før du overleverer en endring som legger til eller lenker til en dokumentasjonsside.
- **Status:** confirmed

### Samtidige kjøringer av `update-translations.js` mister nøkler i stillhet

- **Dato:** 2026-08-02
- **Observert av:** Claude
- **Kontekst:** Å ta i bruk 26 oversatte i18next-nøkler på tvers av alle 36 lokaler via ferdigheten `translate`
- **Det overraskende:** Hvert kall er en les-endre-skriv-runde over alle 36 lokale-filer, så to kall som kjører samtidig overskriver hverandre, og en nøkkel forsvinner uten feilmelding. Ferdigheten `translate` instruerer uttrykkelig om å starte opptil 4 underagenter samtidig, og hver av dem ville kalle skriptet.
- **Konsekvens:** Feiler i stillhet: nøkler forsvinner fra vilkårlige lokaler, og diffen ser fortsatt plausibel ut.
- **Tiltak:** La aldri oversetter-underagenter skrive lokale-filer samtidig — la dem bare produsere ordbok-JSON-filer, og ta deretter i bruk hver nøkkel serielt fra foreldreagenten. Etter at nøklene er tatt i bruk, verifiser programmatisk at hver nøkkel finnes i alle 35 ikke-engelske lokaler, og at ingen verdi er byte-identisk med den engelske kilden.
- **Status:** confirmed
- **Oppdatering (2026-08-10):** Skriptet løste tidligere også målet sitt som `path.join(process.cwd(), "public", "translations")`, så den dokumenterte kommandoen fra repo-roten feilet med "Translations directory not found" og måtte kjøres fra `about/`. Nå finner det arbeidsområdet ut fra gjeldende mappe eller sin egen plassering, og fungerer fra hvor som helst. Samtidighetsfellen ovenfor er uendret.

### Annoteringskontroller under utvikling kan fange opp automatiserte klikk

- **Kontekst:** About- og chain-nettstedene har faste kontroller i nedre høyre hjørne, der Agentation-verktøylinjen også vises under utvikling.
- **Tiltak:** `scripts/pw-session.sh open` registrerer `window.__NO_DEV_TOOLBAR__ = true` før siden lastes inn på nytt. Agentation-initialiseringen respekterer også `__VISUAL_TESTING__` og `__PROFILING__`; kildeinspeksjon er fortsatt tilgjengelig uavhengig av dette. Direkte nettleserautomatisering må sette det samme flagget før applikasjonen lastes inn.

### `skills add` installerer kopiene for Codex og Cursor i den git-ignorerte mappen `.agents/`

- **Dato:** 2026-08-18
- **Observert av:** Tommaso + Claude
- **Kontekst:** Installering av ferdigheten `improve-threejs` fra `millionco/react-doctor` med `skills`-CLI-en (`vercel-labs/skills`).
- **Det overraskende:** `npx skills add <repo> --skill <name> --agent codex` og `--agent cursor` skriver begge til `.agents/skills/<name>/`, ikke til `.codex/skills/` eller `.cursor/skills/`. `AGENTS.md` forbyr en `.agents/`-mappe på reponivå, og `.gitignore:29` ignorerer den, så begge kopiene blir stille usporet. Bare `--agent claude-code` skriver til den forventede `.claude/skills/`. I tillegg feiler den dokumenterte kommaseparerte formen (`--agent claude-code,codex,cursor`) med "Invalid agents" og installerer ingenting, selv om hvert navn er gyldig hver for seg.
- **Konsekvens:** Installasjonen melder suksess mens to av de tre verktøykjedekopiene havner et sted som aldri blir sjekket inn, så Codex og Cursor mangler ferdigheten i stillhet etter en fersk kloning. Kommaformen kan også gi en installasjon som ikke gjør noe, men som ser ut som en suksess.
- **Nåværende tiltak:** Repoet sporer nå `.agents/skills` som kanonisk kilde og genererer Claude-kopier med `yarn ai-workflow:sync`. Det tidligere forbudet mot `.agents` og ignoreringsregelen er fjernet. Ikke kopier nye ferdigheter inn i tre uavhengige rotmapper; sjekk pariteten i de genererte filene og appkatalogen etter at du har lagt til en ferdighet.
- **Status:** confirmed
