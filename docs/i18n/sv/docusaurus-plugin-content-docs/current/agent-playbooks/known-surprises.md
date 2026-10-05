# Kända överraskningar

Den här filen samlar repospecifika förvirringspunkter som har lett till agentmisstag.

## Kriterier för poster

Lägg bara till en post om allt nedan stämmer:

- Den är specifik för det här repot (inte allmänna råd).
- Den kommer sannolikt att återkomma för framtida agenter.
- Den har en konkret åtgärd som går att följa.

Om du är osäker, fråga utvecklaren innan du lägger till en post.

## Mall för poster

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

## Poster

### Produktionsdomäner för Vercel-appar kan glida tillbaka till distributioner från Git-grenen master

- **Datum:** 2026-04-28
- **Observerad av:** Tommaso + Codex
- **Sammanhang:** Verifiering av app-speglarna för Seedit och 5chan i Bitsocial Webs appkatalog.
- **Det överraskande:** Vercel-projekten `seedit` och `5chan` hade `gitProviderOptions.createDeployments = "enabled"`, så pushar till `master` på GitHub befordrades till produktionsdomänerna trots att repots policy förväntar sig att produktionsspeglarna bara levererar release-artefakter.
- **Konsekvens:** Märkena för verifierade speglar i appkatalogen kan bli felaktiga, eftersom produktionsdomänerna levererar den senaste utvecklingscommiten i stället för den GitHub-release-ZIP vars `index.html`-hash är registrerad i `about/src/lib/apps-data.ts`.
- **Åtgärd:** Innan du lägger till eller uppdaterar metadata för spegelverifiering, kontrollera Vercel-projektet med `vercel api /v9/projects/<project-id>` och bekräfta att `gitProviderOptions.createDeployments = "disabled"`. Distribuera innehållet i release-ZIP:en med `vercel deploy --prebuilt --prod` och använd `seedit-omega.vercel.app` eller `5chan-omega.vercel.app` för utvecklingsdistributioner.
- **Status:** confirmed

### Portless 0.11 återanvänder gammalt proxytillstånd om inte startskriptet tvingar fram HTTPS

- **Datum:** 2026-04-28
- **Observerad av:** Tommaso + Codex
- **Sammanhang:** Uppgradering av det vanliga `yarn start`-flödet från den gamla proxy-URL:en `http://bitsocial.localhost:1355` till `https://bitsocial.localhost`.
- **Det överraskande:** Även med `portless@0.11.1` installerat återanvände Portless den befintliga HTTP-proxyn `~/.portless/proxy.port = 1355` och skrev ut den gamla `:1355`-adressen.
- **Konsekvens:** Det räcker inte att uppdatera paketversioner och dokumentation. `yarn start` kan fortfarande annonsera och använda den gamla adressen när en bidragsgivare har gammalt Portless-tillstånd igång.
- **Åtgärd:** Låt startskripten uttryckligen starta Portless HTTPS-proxy på port `443` innan appruttarna registreras, så att körningsflödet migrerar bort från det sparade `1355`-tillståndet i stället för att ärva det.
- **Status:** confirmed

### Portless ändrar den kanoniska lokala app-adressen

- **Datum:** 2026-03-18
- **Observerad av:** Codex
- **Sammanhang:** Webbläsarverifiering och röktestflöden
- **Det överraskande:** Standardadressen lokalt är inte den vanliga Vite-porten. Repot förväntar sig `https://bitsocial.localhost` via Portless, så att kontrollera `localhost:3000` eller `localhost:5173` kan träffa fel app eller ingenting alls.
- **Konsekvens:** Webbläsarkontroller kan misslyckas eller validera fel mål, även när utvecklingsservern mår bra.
- **Åtgärd:** Använd `https://bitsocial.localhost` först. Kringgå den bara med `PORTLESS=0 corepack yarn start` när du uttryckligen behöver en direkt Vite-port.
- **Status:** confirmed

### Commitizen-hooks blockerar icke-interaktiva commits

- **Datum:** 2026-03-18
- **Observerad av:** Codex
- **Sammanhang:** Agentdrivna commit-arbetsflöden
- **Det överraskande:** `git commit` utlöser Commitizen via Husky och väntar på interaktiv TTY-inmatning, vilket får icke-interaktiva agentskal att hänga sig.
- **Konsekvens:** Agenter kan fastna på obestämd tid under vad som borde vara en helt vanlig commit.
- **Åtgärd:** Använd `git commit --no-verify -m "message"` för commits som agenter skapar. Människor kan fortfarande använda `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** confirmed

### Corepack krävs för att undvika Yarn classic

- **Datum:** 2026-03-19
- **Observerad av:** Codex
- **Sammanhang:** Bytet av pakethanterare till Yarn 4
- **Det överraskande:** Maskinen har fortfarande en global installation av Yarn classic i `PATH`, så att köra enbart `yarn` kan leda till v1 i stället för den fastlåsta Yarn 4-versionen.
- **Konsekvens:** Utvecklare kan av misstag kringgå repots låsning av pakethanterare och få ett annat installationsbeteende eller en annan låsfil.
- **Åtgärd:** Använd `corepack yarn ...` för skalkommandon, eller kör `corepack enable` först så att enbart `yarn` leder till den fastlåsta Yarn 4-versionen.
- **Status:** confirmed

### Fasta Portless-appnamn krockar mellan Bitsocial Web-worktrees

- **Datum:** 2026-03-30
- **Observerad av:** Codex
- **Sammanhang:** Att köra `yarn start` i en Bitsocial Web-worktree medan en annan worktree redan levererade via Portless
- **Det överraskande:** Att använda det bokstavliga Portless-appnamnet `bitsocial` i varje worktree gör att själva rutten krockar, även när portarna bakom skiljer sig åt, så den andra processen misslyckas eftersom `bitsocial.localhost` redan är registrerad.
- **Konsekvens:** Parallella Bitsocial Web-grenar kan blockera varandra, trots att Portless är tänkt att låta dem samexistera utan problem.
- **Åtgärd:** Låt Portless-starten gå via `scripts/start-dev.mjs`, som numera använder en grenbaserad `*.bitsocial.localhost`-rutt utanför det kanoniska fallet och faller tillbaka på en grenbaserad rutt när det rena namnet `bitsocial.localhost` redan är upptaget.
- **Status:** confirmed

### Förhandsvisningen av dokumentationen brukade hårdkoda port 3001

- **Datum:** 2026-03-30
- **Observerad av:** Codex
- **Sammanhang:** Att köra `yarn start` parallellt med andra lokala repon och agenter
- **Det överraskande:** Rotens utvecklingskommando körde dokumentationsarbetsytan med `docusaurus start --port 3001`, så hela utvecklingssessionen föll så fort en annan process redan ägde `3001`, trots att huvudappen redan använde Portless.
- **Konsekvens:** `yarn start` kunde döda webbprocessen direkt efter start och avbryta orelaterat lokalt arbete på grund av en portkrock för dokumentationen.
- **Åtgärd:** Låt dokumentationsstarten gå via `yarn start:docs`, som numera använder Portless plus `scripts/start-docs.mjs` för att respektera en inmatad ledig port eller falla tillbaka på nästa lediga port när det körs direkt.
- **Status:** confirmed

### Det fasta Portless-värdnamnet för dokumentationen var hårdkodat

- **Datum:** 2026-04-03
- **Observerad av:** Codex
- **Sammanhang:** Att köra `yarn start` i en sekundär Bitsocial Web-worktree medan en annan worktree redan levererade dokumentationen via Portless
- **Det överraskande:** `start:docs` registrerade fortfarande det bokstavliga värdnamnet `docs.bitsocial.localhost`, så `yarn start` kunde misslyckas trots att about-appen redan visste hur den skulle undvika Portless-ruttkrockar för sitt eget värdnamn.
- **Konsekvens:** Parallella worktrees kunde inte använda rotens utvecklingskommando på ett tillförlitligt sätt, eftersom dokumentationsprocessen avslutades först och `concurrently` sedan dödade resten av sessionen.
- **Åtgärd:** Låt dokumentationsstarten gå via `scripts/start-docs.mjs`, som numera härleder samma grenbaserade Portless-värdnamn som about-appen och matar in den delade publika adressen som mål för utvecklingsproxyn på `/docs`.
- **Status:** confirmed

### Worktree-skal kan missa repots fastlåsta Node-version

- **Datum:** 2026-04-03
- **Observerad av:** Codex
- **Sammanhang:** Att köra `yarn start` i Git-worktrees som `.claude/worktrees/*` eller angränsande worktree-utcheckningar
- **Det överraskande:** Vissa worktree-skal löste upp `node` och `yarn node` till Homebrew-Node `25.2.1`, trots att repot låser `22.12.0` i `.nvmrc`, så `yarn start` kunde tyst köra utvecklingsstartarna på fel körtid.
- **Konsekvens:** Utvecklingsserverns beteende kan glida isär mellan huvudutcheckningen och worktrees, vilket gör buggar svåra att återskapa och bryter mot repots förväntade Node 22-verktygskedja.
- **Åtgärd:** Låt utvecklingsstartarna gå via `scripts/start-dev.mjs` och `scripts/start-docs.mjs`, som numera startar om sig själva under Node-binären från `.nvmrc` när det aktuella skalet har fel version. Skalkonfigurationen bör ändå föredra `nvm use`.
- **Status:** confirmed

### Rester av `docs-site/` kan dölja saknad dokumentationskälla efter refaktoreringen

- **Datum:** 2026-04-01
- **Observerad av:** Codex
- **Sammanhang:** Städning av monorepot efter sammanslagningen, när Docusaurus-projektet flyttades från `docs-site/` till `docs/`
- **Det överraskande:** Den gamla mappen `docs-site/` kan ligga kvar på disken med inaktuella men viktiga filer som `i18n/`, även efter att det spårade repot flyttat till `docs/`. Det får refaktoreringen att se dubblerad ut lokalt och kan dölja att spårade dokumentationsöversättningar aldrig faktiskt flyttades in i `docs/`.
- **Konsekvens:** Agenter kan radera den gamla mappen som ”skräp” och av misstag förlora den enda lokala kopian av dokumentationsöversättningarna, eller fortsätta redigera skript som fortfarande pekar på den döda `docs-site/`-sökvägen.
- **Åtgärd:** Behandla `docs/` som det enda kanoniska dokumentationsprojektet. Innan du raderar lokala rester av `docs-site/`, återställ spårad källkod som `docs/i18n/` och uppdatera skript och hooks så att de slutar referera till `docs-site`.
- **Status:** confirmed

### Flerspråkig förhandsvisning av dokumentationen kan få minnesanvändningen att skjuta i höjden under verifiering

- **Datum:** 2026-04-01
- **Observerad av:** Codex
- **Sammanhang:** Att åtgärda i18n, lokalruttning och Pagefind-beteende i dokumentationen med `yarn start:docs` plus Playwright
- **Det överraskande:** Standardläget för dokumentationsförhandsvisningen gör numera ett fullständigt flerspråkigt dokumentationsbygge plus Pagefind-indexering innan den börjar leverera, och att hålla den processen vid liv jämsides med flera Playwright- eller Chrome-sessioner kan sluka betydligt mer minne än en vanlig Vite-loop eller en Docusaurus-utvecklingsloop med en enda lokal.
- **Konsekvens:** Maskinen kan bli minnesbegränsad, webbläsarsessioner kan krascha, och avbrutna körningar kan lämna kvar inaktuella dokumentationsservrar eller huvudlösa webbläsare som fortsätter äta minne.
- **Åtgärd:** För dokumentationsarbete som inte kräver verifiering av lokalruttning eller Pagefind, föredra `DOCS_START_MODE=live yarn start:docs`. Använd bara standardläget med flerspråkig förhandsvisning när du behöver validera översatta rutter eller Pagefind. Håll en enda Playwright-session, stäng gamla webbläsarsessioner innan du öppnar nya, och stoppa dokumentationsservern efter verifieringen om du inte längre behöver den.
- **Status:** confirmed

### `translate-docs.py` kan lämna dokumentationslokaler halvöversatta eller med trasiga länkmål

- **Datum:** 2026-04-06
- **Observerad av:** Codex
- **Sammanhang:** Att åtgärda lokaliserade dokumentationsrutter och innehåll efter att `yarn start:docs` levererade engelska detaljsidor eller inte lyckades bygga lokalutdata
- **Det överraskande:** Översättningskedjan för dokumentationen hade två repospecifika felfall samtidigt: `scripts/translate-docs.py` extraherade bara en liten delmängd av `DocsHome`-meddelandena när `tr(...)`-anropen använde former som skriptet inte kunde tolka, och översatt markdown under `docs/i18n/**` kunde innehålla maskinöversatta sluggar eller `ZXQPLACEHOLDER`-artefakter inuti länkmål.
- **Konsekvens:** Lokaliserade startsidor kan tyst falla tillbaka på engelska, lokaliserade detaljsidor kan se oöversatta ut, och ett fullständigt `yarn docs:build` kan misslyckas på trasiga lokallänkar trots att källdokumentationen är korrekt.
- **Åtgärd:** Efter att du ändrat dokumentationsöversättningar eller genererat om lokalfiler ska du alltid köra `yarn docs:build` från repots rot, söka igenom markdown under `docs/i18n/**` efter `ZXQPLACEHOLDER`, och kontrollera att översatta länkar fortfarande pekar på kanoniska dokumentsluggar som `/apps/5chan/` i stället för översatta URL-sökvägar. Om texten i `DocsHome` har ändrats, bekräfta att `scripts/translate-docs.py` fortfarande extraherar alla `docs.home.*`-meddelanden.
- **Status:** confirmed

### No-JS-kontroller för about-sajten måste använda Portless-rutten, inte en fristående SSR-förhandsvisning

- **Datum:** 2026-04-12
- **Observerad av:** Codex
- **Sammanhang:** Verifiering av stöd för avstängd JavaScript på `about/`-sajten från en grenworktree
- **Det överraskande:** En fristående SSR-förhandsvisning kan se helt frisk ut medan den faktiska grenbaserade Portless-rutten fortfarande levererar fel appskal eller en äldre process. I det här repot är det verkliga lokala kontraktet Portless-värdnamnet från `yarn start`, inte en tillfällig förhandsvisningsserver.
- **Konsekvens:** Agenter kan felaktigt hävda att stödet för avstängd JavaScript fungerar, eller missa regressioner som bara syns på `*.bitsocial.localhost`.
- **Åtgärd:** För webbläsarverifiering av `about/` ska du alltid starta den riktiga lokala servern med `yarn start` eller `yarn start:about` och testa den grenbaserade Portless-adressen först. Om ett Portless-värdnamn ser inaktuellt ut, undersök och stoppa den gamla processen innan du testar igen.
- **Status:** confirmed

### `chain/` var osynlig för `yarn build:verify` och `yarn doctor`

- **Datum:** 2026-07-05
- **Observerad av:** Codex
- **Sammanhang:** Verifiering av en diff som bara rörde chain/ efter att arbetsytan `chain/` (fristående Vite-app för `chain.bitsocial.net`) lagts till i monorepot.
- **Det överraskande:** `scripts/verify-build.mjs` kände bara igen sökvägsprefixen `about/`, `docs/` och `stats/`, så en diff som bara rörde chain/ skrev ut "No targeted build checks matched the current diff" och körde inget bygge alls, trots att `build:chain` redan fanns i rotens `package.json`. Dessutom var `yarn doctor` hårdkodat till `react-doctor about -y`, så React-ändringar under `chain/src` fick noll täckning av React Doctor.
- **Konsekvens:** Agenter som verifierade chain-ändringar behövde veta att de skulle anropa `yarn build:chain` direkt i stället för att lita på `yarn build:verify`, och React-problem i `chain/src` (effekter, hooks, död kod) upptäcktes aldrig av `yarn doctor`.
- **Åtgärd:** `scripts/verify-build.mjs` har numera en `chain/`-gren som speglar `about/`-grenen, och `doctor` samt `doctor:verbose` kör nu `react-doctor --project about,chain -y` i ett enda anrop. `doctor:score` gäller fortfarande bara `about`, eftersom `--score` tyst skriver ut ingenting när det kombineras med `--project` för fler än ett projekt; använd `yarn react-doctor --project about,chain --verbose -y` (eller `--json`) om du behöver en poäng för chain.
- **Status:** confirmed

### Webbläsarens P2P körs på säkra WebSockets; pkc-js nekar WebRTC och WebTransport som standard

- **Datum:** 2026-08-02
- **Observerad av:** Claude
- **Sammanhang:** Att skriva text för landningssidan och dokumentationen om hur Bitsocials peer-to-peer i webbläsaren fungerar
- **Det överraskande:** `@pkcprotocol/pkc-js` levereras med en standardgrind för anslutningar som avvisar WebRTC- och WebTransport-uppkopplingar i webbläsaren — `dist/browser/helia/dial-transport-filter.js` exporterar `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Kommentaren i källkoden anger skälet: i webbläsaren lägger de transporterna till långa och ofta misslyckade vägar för att upprätta anslutningar (STUN/ICE, rotation av certhash) som gör sidladdningen långsammare, medan WebSocket är direkt och tillförlitlig. Varje aktiv peer i bloggens P2P-statuspanel visar "Secure WebSocket". Grinden ligger i `node_modules`, så inget i repot antyder att den finns.
- **Konsekvens:** Det är mycket lätt att skriva teknisk text som låter rimlig men är falsk — till exempel att ge WebTransport, som nådde Baseline i webbläsare i mars 2026, äran för att Bitsocials peer-to-peer i webbläsaren är möjligt. Det påståendet hann gå ut på landningssidan, i jämförelsetabellen och på två dokumentationssidor innan utvecklaren upptäckte det. Felaktiga arkitekturpåståenden på publika sidor granskas av precis den utvecklarpublik som sajten riktar sig till.
- **Åtgärd:** Härled aldrig vilka transporter Bitsocial använder från vad libp2p eller webbläsarplattformen stöder i princip. Kontrollera den aktuella nekandelistan i `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, bekräfta att ingen `connectionGater`-överstyrning finns under `about/src/`, och läs de faktiska transportetiketterna i bloggens panel "P2P status" innan du gör något publikt påstående. Uppströmsändringen som faktiskt gjorde publicering från webbläsaren möjlig var korrigeringen av monoton seqno i `@libp2p/gossipsub` 15.0.21 (maj 2026); pkc-js levererar för närvarande 16.0.4.
- **Status:** confirmed

### Relativa `./page.md`-länkar från en oöversatt dokumentationssida bryter varje lokaliserat bygge

- **Datum:** 2026-08-02
- **Observerad av:** Claude
- **Sammanhang:** Att lägga till en ny sida som bara fanns på engelska, `docs/browser-p2p.md`, som länkade till befintlig dokumentation med `./peer-to-peer-protocol.md` och `./apps/5chan.md`
- **Det överraskande:** Varje lokal under `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` speglar dokumentationsträdet. En ny sida som saknas i de speglarna renderas ändå i varje lokal via engelsk reserv, men dess relativa markdown-länkar går inte längre att lösa upp — Docusaurus genererar `/ar/browser-p2p/peer-to-peer-protocol.md/` och avbryter bygget med "Docusaurus found broken links!". Det avgörande är att `yarn build:verify` och `yarn docs:build:verify` bara bygger `en` och går igenom utan anmärkning; bara ett fullständigt `yarn docs:build` avslöjar problemet, och det avbryts på den första lokalen i bokstavsordning (`ar`).
- **Konsekvens:** En dokumentationsändring kan klara varje snabb lokal kontroll och ändå bryta det flerspråkiga produktionsbygget. Felet ser dessutom orelaterat ut till ändringen, eftersom felmeddelandet pekar ut en lokalsökväg som författaren aldrig rörde.
- **Åtgärd:** Använd rotrelativa länkar (`/peer-to-peer-protocol/`, `/apps/5chan/`) i stället för relativa `.md`-länkar på varje dokumentationssida som inte speglas in i `docs/i18n/**`; Docusaurus lägger till lokalprefixet automatiskt. `docs/build-your-own-client.md` är det befintliga exemplet. Kör ett fullständigt `yarn docs:build` — inte bara `build:verify` — innan du lämnar över en ändring som lägger till eller länkar till en dokumentationssida.
- **Status:** confirmed

### Samtidiga körningar av `update-translations.js` tappar nycklar tyst

- **Datum:** 2026-08-02
- **Observerad av:** Claude
- **Sammanhang:** Att applicera 26 översatta i18next-nycklar över alla 36 lokaler via skillen `translate`
- **Det överraskande:** Varje körning är en läs-ändra-skriv över alla 36 lokalfiler, så två körningar samtidigt skriver över varandra och en nyckel försvinner utan felmeddelande. Skillen `translate` instruerar uttryckligen att upp till 4 underagenter ska startas samtidigt, och var och en av dem skulle anropa skriptet.
- **Konsekvens:** Det misslyckas tyst: nycklar försvinner från godtyckliga lokaler, och diffen ser fortfarande rimlig ut.
- **Åtgärd:** Låt aldrig översättande underagenter skriva lokalfiler samtidigt — låt dem bara producera JSON-ordböcker, och applicera sedan varje nyckel seriellt från föräldraagenten. Verifiera programmatiskt efter appliceringen att varje nyckel finns i alla 35 icke-engelska lokaler och att inget värde är byte-identiskt med den engelska källan.
- **Status:** confirmed
- **Uppdatering (2026-08-10):** Skriptet löste tidigare också upp sitt mål som `path.join(process.cwd(), "public", "translations")`, så det dokumenterade kommandot från repots rot misslyckades med "Translations directory not found" och måste köras från `about/`. Nu löser det upp arbetsytan från den aktuella katalogen eller från sin egen plats, och fungerar varifrån som helst. Samtidighetsfällan ovan är oförändrad.

### Annoteringskontroller i utvecklingsläge kan fånga upp automatiserade klick

- **Sammanhang:** About- och chain-sajterna har fasta kontroller i nedre högra hörnet, där även Agentation-verktygsfältet visas under utveckling.
- **Åtgärd:** `scripts/pw-session.sh open` registrerar `window.__NO_DEV_TOOLBAR__ = true` innan sidan laddas om. Agentations initierare respekterar också `__VISUAL_TESTING__` och `__PROFILING__`; källkodsinspektion förblir tillgänglig oberoende av detta. Direkt webbläsarautomatisering måste sätta samma flagga innan applikationen laddas.

### `skills add` installerar Codex- och Cursor-kopior i den gitignorerade katalogen `.agents/`

- **Datum:** 2026-08-18
- **Observerad av:** Tommaso + Claude
- **Sammanhang:** Att installera skillen `improve-threejs` från `millionco/react-doctor` med `skills`-CLI:t (`vercel-labs/skills`).
- **Det överraskande:** `npx skills add <repo> --skill <name> --agent codex` och `--agent cursor` skriver båda till `.agents/skills/<name>/`, inte till `.codex/skills/` eller `.cursor/skills/`. `AGENTS.md` förbjuder en `.agents/`-katalog på reponivå och `.gitignore:29` ignorerar den, så båda kopiorna blir tyst ospårade. Bara `--agent claude-code` skriver till den förväntade `.claude/skills/`. Dessutom misslyckas den dokumenterade kommaseparerade formen (`--agent claude-code,codex,cursor`) med "Invalid agents" och installerar ingenting, trots att varje namn är giltigt för sig.
- **Konsekvens:** Installationen rapporterar att den lyckades medan två av de tre verktygskedjornas kopior hamnar någonstans där de aldrig kommer att checkas in, så Codex och Cursor saknar tyst skillen efter en ny klon. Kommaformen kan också ge en installation som inte gör något men ser ut att ha lyckats.
- **Aktuell åtgärd:** Repot spårar nu `.agents/skills` som sin kanoniska källa och genererar Claude-kopior med `yarn ai-workflow:sync`. Det tidigare förbudet mot `.agents` och ignoreringsregeln har tagits bort. Kopiera inte nya skills till tre oberoende rötter; kontrollera den genererade pariteten och appens katalog efter att du har lagt till en skill.
- **Status:** confirmed
