# Kendte overraskelser

Denne fil holder styr på repo-specifikke forvirringspunkter, der har ført til fejl hos agenter.

## Kriterier for poster

Tilføj kun en post, hvis alt herunder er sandt:

- Den er specifik for dette repo (ikke generelle råd).
- Den vil sandsynligvis dukke op igen for fremtidige agenter.
- Den har en konkret afhjælpning, som kan følges.

Er du i tvivl, så spørg udvikleren, før du tilføjer en post.

## Skabelon til poster

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

### Produktionsdomæner for Vercel-apps kan glide tilbage til deployments fra Git master

- **Dato:** 2026-04-28
- **Observeret af:** Tommaso + Codex
- **Kontekst:** Verifikation af Seedit- og 5chan-app-mirrors i app-kataloget på Bitsocial Web.
- **Hvad var overraskende:** Vercel-projekterne `seedit` og `5chan` havde `gitProviderOptions.createDeployments = "enabled"`, så push til `master` på GitHub blev forfremmet til produktionsdomænerne, selvom repo-politikken forventer, at produktions-mirrors kun serverer release-artefakter.
- **Konsekvens:** Badges for verificerede mirrors i app-kataloget kan blive misvisende, fordi produktionsdomænerne serverer den nyeste udviklings-commit i stedet for den GitHub-release-ZIP, hvis `index.html`-hash er registreret i `about/src/lib/apps-data.ts`.
- **Afhjælpning:** Før du tilføjer eller opdaterer metadata for mirror-verifikation, så tjek Vercel-projektet med `vercel api /v9/projects/<project-id>` og bekræft `gitProviderOptions.createDeployments = "disabled"`. Deploy indholdet af release-ZIP'en med `vercel deploy --prebuilt --prod`, og brug `seedit-omega.vercel.app` eller `5chan-omega.vercel.app` til udviklingsdeployments.
- **Status:** bekræftet

### Portless 0.11 genbruger gammel proxy-tilstand, medmindre starteren fremtvinger HTTPS

- **Dato:** 2026-04-28
- **Observeret af:** Tommaso + Codex
- **Kontekst:** Opgradering af det normale `yarn start`-flow fra den gamle proxy-URL `http://bitsocial.localhost:1355` til `https://bitsocial.localhost`.
- **Hvad var overraskende:** Selv med `portless@0.11.1` installeret genbrugte Portless den eksisterende HTTP-proxy `~/.portless/proxy.port = 1355` og udskrev den gamle `:1355`-URL.
- **Konsekvens:** Det er ikke nok at opdatere pakkeversioner og dokumentation; `yarn start` kan stadig annoncere og bruge den gamle URL, når en bidragyder har gammel Portless-tilstand kørende.
- **Afhjælpning:** Sørg for, at start-scriptsene eksplicit starter Portless' HTTPS-proxy på port `443`, før app-ruter registreres, så runtime-flowet migrerer væk fra den gemte `1355`-tilstand i stedet for at arve den.
- **Status:** bekræftet

### Portless ændrer den kanoniske lokale app-URL

- **Dato:** 2026-03-18
- **Observeret af:** Codex
- **Kontekst:** Browserverifikation og røgtest-flows
- **Hvad var overraskende:** Standard-URL'en lokalt er ikke den sædvanlige Vite-port. Repoet forventer `https://bitsocial.localhost` gennem Portless, så et tjek af `localhost:3000` eller `localhost:5173` kan ramme den forkerte app eller slet ingenting.
- **Konsekvens:** Browserkontroller kan fejle eller validere det forkerte mål, selv når dev-serveren kører fint.
- **Afhjælpning:** Brug `https://bitsocial.localhost` først. Omgå den kun med `PORTLESS=0 corepack yarn start`, når du eksplicit har brug for en direkte Vite-port.
- **Status:** bekræftet

### Commitizen-hooks blokerer ikke-interaktive commits

- **Dato:** 2026-03-18
- **Observeret af:** Codex
- **Kontekst:** Agentdrevne commit-arbejdsgange
- **Hvad var overraskende:** `git commit` udløser Commitizen via Husky og venter på interaktivt TTY-input, hvilket får ikke-interaktive agent-shells til at hænge.
- **Konsekvens:** Agenter kan gå i stå på ubestemt tid under det, der burde være en helt almindelig commit.
- **Afhjælpning:** Brug `git commit --no-verify -m "message"` til commits oprettet af agenter. Mennesker kan stadig bruge `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** bekræftet

### Corepack er nødvendigt for at undgå Yarn classic

- **Dato:** 2026-03-19
- **Observeret af:** Codex
- **Kontekst:** Migrering af pakkehåndtering til Yarn 4
- **Hvad var overraskende:** Maskinen har stadig en global installation af Yarn classic i `PATH`, så en almindelig `yarn`-kørsel kan ramme v1 i stedet for den fastlåste Yarn 4-version.
- **Konsekvens:** Udviklere kan ved et uheld omgå repoets fastlåsning af pakkehåndtering og få anden installationsadfærd eller andet lockfile-output.
- **Afhjælpning:** Brug `corepack yarn ...` til shell-kommandoer, eller kør `corepack enable` først, så almindelig `yarn` peger på den fastlåste Yarn 4-version.
- **Status:** bekræftet

### Faste Portless-appnavne kolliderer på tværs af Bitsocial Web-worktrees

- **Dato:** 2026-03-30
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` i én Bitsocial Web-worktree, mens en anden worktree allerede serverede gennem Portless
- **Hvad var overraskende:** Når det bogstavelige Portless-appnavn `bitsocial` bruges i alle worktrees, kolliderer selve ruten, også når de bagvedliggende porte er forskellige, så den anden proces fejler, fordi `bitsocial.localhost` allerede er registreret.
- **Konsekvens:** Parallelle Bitsocial Web-grene kan blokere hinanden, selvom Portless netop skal lade dem sameksistere sikkert.
- **Afhjælpning:** Hold Portless-opstart bag `scripts/start-dev.mjs`, som nu bruger en grenafhængig `*.bitsocial.localhost`-rute uden for det kanoniske tilfælde og falder tilbage til en grenafhængig rute, når det bare navn `bitsocial.localhost` allerede er optaget.
- **Status:** bekræftet

### Docs-previewen hardkodede tidligere port 3001

- **Dato:** 2026-03-30
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` sammen med andre lokale repos og agenter
- **Hvad var overraskende:** Dev-kommandoen i roden kørte docs-workspacet med `docusaurus start --port 3001`, så hele dev-sessionen fejlede, hver gang en anden proces allerede havde `3001`, selvom hovedappen allerede brugte Portless.
- **Konsekvens:** `yarn start` kunne dræbe web-processen umiddelbart efter opstart og afbryde urelateret lokalt arbejde på grund af en portkollision i docs.
- **Afhjælpning:** Hold docs-opstart bag `yarn start:docs`, som nu bruger Portless plus `scripts/start-docs.mjs` til at respektere en indsprøjtet ledig port eller falde tilbage til den næste ledige port, når den køres direkte.
- **Status:** bekræftet

### Det faste Portless-værtsnavn til docs var hardkodet

- **Dato:** 2026-04-03
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` i en sekundær Bitsocial Web-worktree, mens en anden worktree allerede serverede docs gennem Portless
- **Hvad var overraskende:** `start:docs` registrerede stadig det bogstavelige værtsnavn `docs.bitsocial.localhost`, så `yarn start` kunne fejle, selvom about-appen allerede vidste, hvordan den undgik Portless-rutekollisioner for sit eget værtsnavn.
- **Konsekvens:** Parallelle worktrees kunne ikke bruge dev-kommandoen i roden pålideligt, fordi docs-processen afsluttede først, og `concurrently` derefter dræbte resten af sessionen.
- **Afhjælpning:** Hold docs-opstart bag `scripts/start-docs.mjs`, som nu udleder det samme grenafhængige Portless-værtsnavn som about-appen og indsprøjter den fælles offentlige URL i dev-proxyens mål for `/docs`.
- **Status:** bekræftet

### Worktree-shells kan misse repoets fastlåste Node-version

- **Dato:** 2026-04-03
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` i Git-worktrees såsom `.claude/worktrees/*` eller sideordnede worktree-checkouts
- **Hvad var overraskende:** Nogle worktree-shells fandt `node` og `yarn node` som Homebrew-Node `25.2.1`, selvom repoet fastlåser `22.12.0` i `.nvmrc`, så `yarn start` kunne køre dev-starterne under den forkerte runtime uden at sige noget.
- **Konsekvens:** Dev-serverens adfærd kan afvige mellem hovedcheckout og worktrees, hvilket gør fejl svære at reproducere og bryder repoets forventede Node 22-værktøjskæde.
- **Afhjælpning:** Hold dev-starterne bag `scripts/start-dev.mjs` og `scripts/start-docs.mjs`, som nu genstarter under Node-binæren fra `.nvmrc`, når den aktuelle shell er på den forkerte version. Shell-opsætning bør stadig foretrække `nvm use`.
- **Status:** bekræftet

### Rester fra `docs-site/` kan skjule manglende docs-kilde efter refaktoreringen

- **Dato:** 2026-04-01
- **Observeret af:** Codex
- **Kontekst:** Oprydning i monorepoet efter merge, da Docusaurus-projektet blev flyttet fra `docs-site/` til `docs/`
- **Hvad var overraskende:** Den gamle mappe `docs-site/` kan blive liggende på disken med forældede, men vigtige filer som `i18n/`, også efter at det versionsstyrede repo er flyttet til `docs/`. Det får refaktoreringen til at se dubleret ud lokalt og kan skjule, at versionsstyrede docs-oversættelser aldrig blev flyttet ind i `docs/`.
- **Konsekvens:** Agenter kan slette den gamle mappe som "skrald" og ved et uheld miste den eneste lokale kopi af docs-oversættelserne, eller de kan blive ved med at redigere scripts, der stadig peger på den døde sti `docs-site/`.
- **Afhjælpning:** Behandl `docs/` som det eneste kanoniske docs-projekt. Før du sletter lokale rester af `docs-site/`, så genskab versionsstyret kilde som `docs/i18n/` og opdater scripts og hooks, så de ikke længere refererer til `docs-site`.
- **Status:** bekræftet

### Docs-preview med flere sprog kan få RAM-forbruget til at eksplodere under verifikation

- **Dato:** 2026-04-01
- **Observeret af:** Codex
- **Kontekst:** Rettelse af docs-i18n, sprogruter og Pagefind-adfærd med `yarn start:docs` plus Playwright
- **Hvad var overraskende:** Standardtilstanden for docs-preview laver nu et fuldt docs-build med alle sprog plus Pagefind-indeksering, før den serverer, og at holde den proces i live sammen med flere Playwright- eller Chrome-sessioner kan bruge langt mere RAM end en normal Vite- eller Docusaurus-dev-løkke med ét sprog.
- **Konsekvens:** Maskinen kan løbe tør for hukommelse, browsersessioner kan crashe, og afbrudte kørsler kan efterlade forældede docs-servere eller headless browsere, der bliver ved med at bruge hukommelse.
- **Afhjælpning:** Til docs-arbejde, der ikke kræver verifikation af sprogruter eller Pagefind, så foretræk `DOCS_START_MODE=live yarn start:docs`. Brug kun standard-previewen med flere sprog, når du skal validere oversatte ruter eller Pagefind. Hold én Playwright-session ad gangen, luk gamle browsersessioner, før du åbner nye, og stop docs-serveren efter verifikation, hvis du ikke længere har brug for den.
- **Status:** bekræftet

### `translate-docs.py` kan efterlade docs-sprog halvt oversat eller med ødelagte linkmål

- **Dato:** 2026-04-06
- **Observeret af:** Codex
- **Kontekst:** Rettelse af lokaliserede docs-ruter og indhold efter at `yarn start:docs` serverede engelske detaljesider eller ikke kunne bygge sprogoutput
- **Hvad var overraskende:** Oversættelsespipelinen til docs havde to repo-specifikke fejltilstande på én gang: `scripts/translate-docs.py` udtrak kun en lille delmængde af `DocsHome`-beskederne, når `tr(...)`-kald brugte former, den ikke kunne parse, og oversat markdown under `docs/i18n/**` kunne indeholde maskinoversatte slugs eller `ZXQPLACEHOLDER`-artefakter inde i linkmål.
- **Konsekvens:** Lokaliserede forsider kan i stilhed falde tilbage til engelsk, lokaliserede detaljesider kan fremstå uoversatte, og et fuldt `yarn docs:build` kan fejle på ødelagte sproglinks, selvom kildedokumenterne er gyldige.
- **Afhjælpning:** Efter ændringer i docs-oversættelser eller regenerering af sprogfiler skal du altid køre `yarn docs:build` fra repo-roden, gennemsøge markdown i `docs/i18n/**` for `ZXQPLACEHOLDER` og kontrollere, at oversatte links stadig peger på kanoniske doc-slugs såsom `/apps/5chan/` i stedet for oversatte URL-stier. Hvis teksten i `DocsHome` er ændret, så bekræft, at `scripts/translate-docs.py` stadig udtrækker alle `docs.home.*`-beskeder.
- **Status:** bekræftet

### No-JS-kontroller af about-sitet skal bruge Portless-ruten, ikke en selvstændig SSR-preview

- **Dato:** 2026-04-12
- **Observeret af:** Codex
- **Kontekst:** Verifikation af no-JS-understøttelse for `about/`-sitet fra en gren-worktree
- **Hvad var overraskende:** En selvstændig SSR-preview kan se sund ud, mens den faktiske grenafhængige Portless-rute stadig serverer den forkerte app-shell eller en ældre proces. I dette repo er den rigtige lokale kontrakt Portless-værtsnavnet fra `yarn start`, ikke en ad hoc-preview-server.
- **Konsekvens:** Agenter kan fejlagtigt påstå, at no-JS-understøttelse virker, eller overse regressioner, der kun viser sig på `*.bitsocial.localhost`.
- **Afhjælpning:** Til browserverifikation af `about/` skal du altid starte den rigtige lokale server med `yarn start` eller `yarn start:about` og teste den grenafhængige Portless-URL først. Hvis et Portless-værtsnavn ser forældet ud, så undersøg og stop den gamle proces, før du tester igen.
- **Status:** bekræftet

### `chain/` var usynlig for `yarn build:verify` og `yarn doctor`

- **Dato:** 2026-07-05
- **Observeret af:** Codex
- **Kontekst:** Verifikation af en diff, der kun rørte chain/, efter at `chain/`-workspacet (selvstændig Vite-app til `chain.bitsocial.net`) var føjet til monorepoet.
- **Hvad var overraskende:** `scripts/verify-build.mjs` genkendte kun sti-præfikserne `about/`, `docs/` og `stats/`, så en diff, der kun rørte chain/, skrev "No targeted build checks matched the current diff" og kørte slet intet build, selvom `build:chain` allerede fandtes i `package.json` i roden. Derudover var `yarn doctor` hardkodet til `react-doctor about -y`, så React-ændringer under `chain/src` fik nul dækning fra React Doctor.
- **Konsekvens:** Agenter, der verificerede chain-ændringer, skulle vide, at de skulle kalde `yarn build:chain` direkte i stedet for at stole på `yarn build:verify`, og React-problemer i `chain/src` (effects, hooks, død kode) blev ikke opdaget af `yarn doctor`.
- **Afhjælpning:** `scripts/verify-build.mjs` har nu en `chain/`-gren, der spejler `about/`-grenen, og `doctor` / `doctor:verbose` kører nu `react-doctor --project about,chain -y` i ét enkelt kald. `doctor:score` er fortsat kun `about`, fordi `--score` i stilhed ikke udskriver noget, når den kombineres med `--project` for mere end ét projekt; brug `yarn react-doctor --project about,chain --verbose -y` (eller `--json`), hvis der er brug for en score for chain.
- **Status:** bekræftet

### Browser-P2P kører på sikre WebSockets; pkc-js afviser WebRTC og WebTransport som standard

- **Dato:** 2026-08-02
- **Observeret af:** Claude
- **Kontekst:** Skrivning af tekst til landingsside og dokumentation om, hvordan Bitsocial browser-P2P fungerer
- **Hvad var overraskende:** `@pkcprotocol/pkc-js` leveres med en standard-connection-gater, der afviser WebRTC- og WebTransport-opkald i browseren — `dist/browser/helia/dial-transport-filter.js` eksporterer `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Kommentaren i kildekoden angiver årsagen: i browseren tilføjer de transporter lange og ofte fejlende forbindelsesopbygninger (STUN/ICE, rotation af certhash), som gør indlæsningen langsom, mens WebSocket er direkte og pålidelig. Alle aktive peers i bloggens P2P-statuspanel viser "Secure WebSocket". Gateren ligger i `node_modules`, så intet i repoet antyder, at den findes.
- **Konsekvens:** Det er meget nemt at skrive teknisk plausibel, men forkert offentlig tekst — for eksempel at give WebTransport, der nåede browser-baseline i marts 2026, æren for at gøre Bitsocial browser-P2P mulig. Den påstand nåede ud på landingssiden, i sammenligningstabellen og på to dokumentationssider, før udvikleren opdagede den. Forkerte arkitekturpåstande på offentlige sider bliver efterprøvet af præcis det udviklerpublikum, sitet henvender sig til.
- **Afhjælpning:** Udled aldrig hvilke transporter Bitsocial bruger ud fra, hvad libp2p eller browserplatformen understøtter i princippet. Tjek `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` for den aktuelle afvisningsliste, bekræft at der ikke findes en `connectionGater`-override under `about/src/`, og læs de aktuelle transportetiketter i bloggens "P2P status"-panel, før du fremsætter offentlige påstande. Den opstrømsændring, der reelt gjorde publicering fra browseren mulig, var rettelsen af monotont seqno i gossipsub i `@libp2p/gossipsub` 15.0.21 (maj 2026); pkc-js leverer i øjeblikket 16.0.4.
- **Status:** bekræftet

### Relative `./page.md`-links fra en uoversat docs-side ødelægger alle lokaliserede builds

- **Dato:** 2026-08-02
- **Observeret af:** Claude
- **Kontekst:** Tilføjelse af en ny side, der kun fandtes på engelsk, `docs/browser-p2p.md`, som linkede til eksisterende dokumentation med `./peer-to-peer-protocol.md` og `./apps/5chan.md`
- **Hvad var overraskende:** Hvert sprog under `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` spejler docs-træet. En ny side, der mangler i de spejle, vises stadig på alle sprog via engelsk fallback, men dens relative markdown-links kan ikke længere slås op — Docusaurus udsender `/ar/browser-p2p/peer-to-peer-protocol.md/` og fejler buildet med "Docusaurus found broken links!". Det afgørende er, at `yarn build:verify` og `yarn docs:build:verify` kun bygger `en` og består uden problemer; kun et fuldt `yarn docs:build` afslører det, og det afbryder ved det første sprog alfabetisk (`ar`).
- **Konsekvens:** En docs-ændring kan bestå alle hurtige lokale kontroller og alligevel ødelægge produktionsbuildet med flere sprog. Fejlen ser desuden ud til at være urelateret til ændringen, fordi fejlmeddelelsen nævner en sprogsti, forfatteren aldrig har rørt.
- **Afhjælpning:** På enhver docs-side, der ikke er spejlet ind i `docs/i18n/**`, skal du bruge rod-relative links (`/peer-to-peer-protocol/`, `/apps/5chan/`) i stedet for relative `.md`-links; Docusaurus sætter automatisk sprogpræfikset foran. `docs/build-your-own-client.md` er det eksisterende eksempel. Kør et fuldt `yarn docs:build` — ikke bare `build:verify` — før du afleverer en ændring, der tilføjer eller linker til en docs-side.
- **Status:** bekræftet

### Samtidige kørsler af `update-translations.js` taber nøgler i stilhed

- **Dato:** 2026-08-02
- **Observeret af:** Claude
- **Kontekst:** Anvendelse af 26 oversatte i18next-nøgler på tværs af alle 36 sprog via `translate`-skillen
- **Hvad var overraskende:** Hvert kald er en læs-modificer-skriv hen over alle 36 sprogfiler, så to kald, der kører samtidig, overskriver hinanden, og en nøgle forsvinder uden nogen fejl. `translate`-skillen instruerer eksplicit i at starte op til 4 subagenter samtidig, og hver af dem ville kalde scriptet.
- **Konsekvens:** Fejlen sker i stilhed: nøgler forsvinder fra tilfældige sprog, og diffen ser stadig plausibel ud.
- **Afhjælpning:** Lad aldrig oversætter-subagenter skrive sprogfiler samtidig — lad dem kun udsende JSON-ordbogsfiler, og anvend derefter hver nøgle serielt fra forældreagenten. Efter anvendelsen skal du programmatisk verificere, at hver nøgle findes i alle 35 ikke-engelske sprog, og at ingen værdi er byte-identisk med den engelske kilde.
- **Status:** bekræftet
- **Opdatering (2026-08-10):** Scriptet opløste tidligere også sit mål som `path.join(process.cwd(), "public", "translations")`, så den dokumenterede kommando fra repo-roden fejlede med "Translations directory not found" og måtte køres fra `about/`. Nu finder det workspacet ud fra den aktuelle mappe eller ud fra sin egen placering og virker uanset hvor det køres fra. Samtidighedsfælden ovenfor er uændret.

### Annoteringsværktøjer i udviklingstilstand kan opsnappe automatiserede klik

- **Kontekst:** Både about-sitet og chain-sitet har faste kontrolelementer i nederste højre hjørne, hvor Agentation-værktøjslinjen også vises under udvikling.
- **Afhjælpning:** `scripts/pw-session.sh open` registrerer `window.__NO_DEV_TOOLBAR__ = true`, før siden genindlæses. Agentations initialiseringskode respekterer også `__VISUAL_TESTING__` og `__PROFILING__`; kildeinspektion er fortsat tilgængelig uafhængigt af det. Direkte browserautomatisering skal sætte det samme flag, før applikationen indlæses.

### `skills add` installerer Codex- og Cursor-kopier i den gitignorerede mappe `.agents/`

- **Dato:** 2026-08-18
- **Observeret af:** Tommaso + Claude
- **Kontekst:** Installation af `improve-threejs`-skillen fra `millionco/react-doctor` med `skills`-CLI'en (`vercel-labs/skills`).
- **Hvad var overraskende:** `npx skills add <repo> --skill <name> --agent codex` og `--agent cursor` skriver begge til `.agents/skills/<name>/`, ikke til `.codex/skills/` eller `.cursor/skills/`. `AGENTS.md` forbyder en `.agents/`-mappe på repo-niveau, og `.gitignore:29` ignorerer den, så begge kopier forbliver uversionerede uden nogen advarsel. Kun `--agent claude-code` skriver til den forventede `.claude/skills/`. Derudover fejler den dokumenterede kommaseparerede form (`--agent claude-code,codex,cursor`) med "Invalid agents" og installerer intet, selvom hvert navn er gyldigt for sig.
- **Konsekvens:** Installationen melder succes, mens to af de tre kopier til værktøjskæderne havner et sted, hvor de aldrig bliver committet, så Codex og Cursor i stilhed mangler skillen efter en frisk klon. Kommaformen kan også give en installation, der ikke gør noget, men som ligner en succes.
- **Nuværende afhjælpning:** Repoet versionsstyrer nu `.agents/skills` som sin kanoniske kilde og genererer Claude-kopier med `yarn ai-workflow:sync`. Det tidligere forbud mod `.agents` og ignoreringsreglen er fjernet. Kopiér ikke nye skills ind i tre uafhængige rodmapper; tjek den genererede paritet og appens katalog, når du har tilføjet en skill.
- **Status:** bekræftet
