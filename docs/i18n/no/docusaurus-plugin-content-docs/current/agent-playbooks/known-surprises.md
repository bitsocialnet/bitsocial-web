# Kjente overraskelser

Denne filen sporer depotspesifikke forvirringspunkter som forårsaket agentfeil.

## Inngangskriterier

Legg til en oppføring bare hvis alle er sanne:

- Det er spesifikt for dette depotet (ikke generisk råd).
- Det vil sannsynligvis gjenta seg for fremtidige agenter.
- Den har en konkret avbøtelse som kan følges.

Hvis du er usikker, spør utvikleren før du legger til en oppføring.

## Oppføringsmal

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

### Portless endrer den kanoniske lokale app-URLen

- **Dato:** 2026-03-18
- **Observert av:** Codex
- **Kontekst:** Nettleserbekreftelse og røykstrømmer
- **Hva var overraskende:** Standard lokal URL er ikke den vanlige Vite-porten. Repoen forventer `https://bitsocial.localhost` gjennom Portless, så å sjekke `localhost:3000` eller `localhost:5173` kan treffe feil app eller ingenting i det hele tatt.
- **Konsekvens:** Nettlesersjekker kan mislykkes eller validere feil mål selv når utviklerserveren er frisk.
- **Begrensning:** Bruk `https://bitsocial.localhost` først. Bare omgå den med `PORTLESS=0 corepack yarn start` når du eksplisitt trenger en direkte Vite-port.
- **Status:** bekreftet

### Commitizen-hooks blokkerer ikke-interaktive forpliktelser

- **Dato:** 2026-03-18
- **Observert av:** Codex
- **Kontekst:** Agentdrevne forpliktelsesarbeidsflyter
- **Hva var overraskende:** `git commit` utløser Commitizen gjennom Husky og venter på interaktive TTY-inndata, som henger opp ikke-interaktive agentskall.
- **Effekt:** Agenter kan stoppe på ubestemt tid under det som burde være en normal forpliktelse.
- **Begrensning:** Bruk `git commit --no-verify -m "message"` for agentskapte forpliktelser. Mennesker kan fortsatt bruke `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** bekreftet

### Corepack er nødvendig for å unngå Yarn classic

- **Dato:** 2026-03-19
- **Observert av:** Codex
- **Kontekst:** Pakkeadministratormigrering til Yarn 4
- **Hva var overraskende:** Maskinen har fortsatt en global Yarn classic-installasjon på `PATH`, så å kjøre vanlig `yarn` kan løses til v1 i stedet for den festede Yarn 4-versjonen.
- **Effekt:** Utviklere kan ved et uhell omgå repoens pakke-manager-festing og få annen installasjonsatferd eller låsefilutdata.
- **Begrensning:** Bruk `corepack yarn ...` for skallkommandoer, eller kjør `corepack enable` først så vanlig `yarn` løser seg til den festede Yarn 4-versjonen.
- **Status:** bekreftet

### Faste portløse appnavn kolliderer på tvers av Bitsocial Web-arbeidstrær

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Starter `yarn start` i ett Bitsocial Web-arbeidstre mens et annet arbeidstre allerede tjente gjennom Portless
- **Hva var overraskende:** Ved å bruke det bokstavelige portløse appnavnet `bitsocial` i hvert arbeidstre får ruten i seg selv til å kollidere, selv når støtteportene er forskjellige, så den andre prosessen mislykkes fordi `bitsocial.localhost` allerede er registrert.
- **Effekt:** Parallelle Bitsocial Web-grener kan blokkere hverandre selv om Portless er ment å la dem sameksistere trygt.
- **Begrensning:** Hold portløs oppstart bak `scripts/start-dev.mjs`, som nå bruker en grenomfanget `*.bitsocial.localhost`-rute utenfor det kanoniske tilfellet og faller tilbake til en grenomfanget rute når det blotte `bitsocial.localhost`-navnet allerede er opptatt.
- **Status:** bekreftet

### Forhåndsvisning av dokumenter brukes til å hardkode port 3001

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Kjører `yarn start` sammen med andre lokale repoer og agenter
- **Hva var overraskende:** Rotdev-kommandoen kjørte dokumentarbeidsområdet med `docusaurus start --port 3001`, så hele utviklerøkten mislyktes hver gang en annen prosess allerede eide `3001`, selv om hovedappen allerede brukte Portless.
- **Konsekvens:** `yarn start` kan drepe nettprosessen umiddelbart etter at den ble startet opp, og avbryte ikke-relatert lokalt arbeid over en dokument-port-kollisjon.
- **Begrensning:** Hold oppstart av dokumenter bak `yarn start:docs`, som nå bruker Portless pluss `scripts/start-docs.mjs` for å respektere en injisert ledig port eller falle tilbake til neste tilgjengelige port når den kjøres direkte.
- **Status:** bekreftet

### Faste dokumenter Portløst vertsnavn ble hardkodet

- **Dato:** 2026-04-03
- **Observert av:** Codex
- **Kontekst:** Kjører `yarn start` i et sekundært Bitsocial Web-arbeidstre mens et annet arbeidstre allerede leverte dokumenter gjennom Portless
- **Hva var overraskende:** `start:docs` registrerte fortsatt det bokstavelige `docs.bitsocial.localhost` vertsnavnet, så `yarn start` kunne mislykkes selv om om-appen allerede visste hvordan den skulle unngå portløse rutekollisjoner for sitt eget vertsnavn.
- **Ivirkning:** Parallelle arbeidstrær kunne ikke bruke root dev-kommandoen på en pålitelig måte fordi dokumentprosessen avsluttet først og `concurrently` deretter drepte resten av økten.
- **Begrensning:** Hold oppstart av dokumenter bak `scripts/start-docs.mjs`, som nå henter det samme portløse vertsnavnet med grenomfang som om-appen og injiserer den delte offentlige URL-adressen i `/docs`-utviklerproxy-målet.
- **Status:** bekreftet

### Worktree-skall kan gå glipp av repoens festede Node-versjon

- **Dato:** 2026-04-03
- **Observert av:** Codex
- **Kontekst:** Kjører `yarn start` i Git-arbeidstre som `.claude/worktrees/*` eller søskenarbeidstre-kasser
- **Hva var overraskende:** Noen arbeidstre-skall løste `node` og `yarn node` til Homebrew Node `25.2.1` selv om repo-pinnene `22.12.0` i `.nvmrc`, så ZXZQXPLACEHOLDER kunne kjøre feilen under feil. kjøretid.
- **Konsekvens:** Dev-serveradferd kan drive mellom hovedkassen og arbeidstrærne, noe som gjør feil vanskelig å reprodusere og bryter repoens forventede Node 22-verktøykjede.
- **Begrensning:** Hold utviklerstarterne bak `scripts/start-dev.mjs` og `scripts/start-docs.mjs`, som nå gjenopptas under `.nvmrc` Node binær når gjeldende skall er på feil versjon. Shell-oppsettet bør fortsatt foretrekke `nvm use`.
- **Status:** bekreftet

### `docs-site/` rester kan skjule manglende dokumentkilde etter refactor

- **Dato:** 2026-04-01
- **Observert av:** Codex
- **Kontekst:** Opprydding etter sammenslåing av monorepo etter flytting av Docusaurus-prosjektet fra `docs-site/` til `docs/`
- **Hva var overraskende:** Den gamle `docs-site/`-mappen kan forbli på disk med gamle, men viktige filer som `i18n/`, selv etter at den sporede repoen ble flyttet til `docs/`. Det får refaktoren til å se duplisert ut lokalt og kan skjule det faktum at oversettelser av sporede dokumenter faktisk ikke ble flyttet til `docs/`.
- **Konsekvens:** Agenter kan slette den gamle mappen som "søppel" og ved et uhell miste den eneste lokale kopien av dokumentoversettelser, eller fortsette å redigere skript som fortsatt peker på den døde `docs-site/`-banen.
- **Begrensning:** Behandle `docs/` som det eneste kanoniske dokumentprosjektet. Før du sletter eventuelle lokale `docs-site/`-rester, gjenopprett sporet kilde som `docs/i18n/` og oppdater skript og kroker for å slutte å referere til `docs-site`.
- **Status:** bekreftet

### Multilocale docs forhåndsvisning kan øke RAM under verifisering

- **Dato:** 2026-04-01
- **Observert av:** Codex
- **Kontekst:** Fiksing av docs i18n, lokalitetsruting og Pagefind-atferd med `yarn start:docs` pluss Playwright
- **Hva var overraskende:** Standard forhåndsvisningsmodus for dokumenter utfører nå en full multilocale docs build pluss Pagefind-indeksering før visning, og å holde denne prosessen i live sammen med flere Playwright- eller Chrome-økter kan forbruke mye mer RAM enn en vanlig Vite- eller enkeltlokal Docusaurus-utviklersløyfe.
- **Konsekvens:** Maskinen kan bli minnebegrenset, nettleserøkter kan krasje, og avbrutt kjøring kan etterlate foreldede dokumentservere eller hodeløse nettlesere som fortsetter å forbruke minne.
- **Begrensning:** For dokumentarbeid som ikke trenger lokalrute- eller Pagefind-verifisering, foretrekk `DOCS_START_MODE=live yarn start:docs`. Bruk bare standard multilokale forhåndsvisning når du trenger å validere oversatte ruter eller Pagefind. Behold en enkelt Playwright-økt, lukk gamle nettleserøkter før du åpner nye, og stopp dokumentserveren etter bekreftelse hvis du ikke lenger trenger den.
- **Status:** bekreftet
