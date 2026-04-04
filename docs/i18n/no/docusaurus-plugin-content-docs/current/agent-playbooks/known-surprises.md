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

### Portless endrer den kanoniske nettadressen for lokale apper

- **Dato:** 2026-03-18
- **Observert av:** Codex
- **Kontekst:** Nettleserbekreftelse og røykstrømmer
- **Hva var overraskende:** Standard lokal URL er ikke den vanlige Vite-porten. Repoen forventer `http://bitsocial.localhost:1355` gjennom Portless, så å sjekke `localhost:3000` eller `localhost:5173` kan treffe feil app eller ingenting i det hele tatt.
- **Konsekvens:** Nettlesersjekker kan mislykkes eller validere feil mål selv når utviklerserveren er frisk.
- **Begrensning:** Bruk `http://bitsocial.localhost:1355` først. Bare omgå den med `PORTLESS=0 corepack yarn start` når du eksplisitt trenger en direkte Vite-port.
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
- **Effekt:** Utviklere kan ved et uhell omgå repoens pakke-manager-pinning og få annen installasjonsatferd eller låsefilutdata.
- **Begrensning:** Bruk `corepack yarn ...` for skallkommandoer, eller kjør `corepack enable` først så vanlig `yarn` løser seg til den festede Yarn 4-versjonen.
- **Status:** bekreftet

### Faste portløse appnavn kolliderer på tvers av Bitsocial Web-arbeidstrær

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Starter `yarn start` i ett Bitsocial Web-arbeidstre mens et annet arbeidstre allerede tjente gjennom Portless
- **Hva var overraskende:** Å bruke det bokstavelige Portless-appnavnet `bitsocial` i hvert arbeidstre får selve ruten til å kollidere, selv når støtteportene er forskjellige, så den andre prosessen mislykkes fordi `bitsocial.localhost` allerede er registrert.
- **Effekt:** Parallelle Bitsocial Web-grener kan blokkere hverandre selv om Portless er ment å la dem sameksistere trygt.
- **Begrensning:** Hold portløs oppstart bak `scripts/start-dev.mjs`, som nå bruker en grenomfanget `*.bitsocial.localhost:1355`-rute utenfor det kanoniske tilfellet og faller tilbake til en grenomfanget rute når det blotte `bitsocial.localhost`-navnet allerede er opptatt.
- **Status:** bekreftet

### Forhåndsvisning av dokumenter brukes til å hardkode port 3001

- **Dato:** 2026-03-30
- **Observert av:** Codex
- **Kontekst:** Kjører `yarn start` sammen med andre lokale repoer og agenter
- **Hva var overraskende:** Rotdev-kommandoen kjørte dokumentarbeidsområdet med `docusaurus start --port 3001`, så hele utviklerøkten mislyktes hver gang en annen prosess allerede eide `3001`, selv om hovedappen allerede brukte Portless.
- **Konsekvens:** `yarn start` kan drepe nettprosessen umiddelbart etter at den ble startet opp, og avbryte ikke-relatert lokalt arbeid over en dokument-port-kollisjon.
- **Begrensning:** Hold oppstart av dokumenter bak `yarn start:docs`, som nå bruker Portless pluss `scripts/start-docs.mjs` for å respektere en injisert ledig port eller falle tilbake til neste tilgjengelige port når den kjøres direkte.
- **Status:** bekreftet
