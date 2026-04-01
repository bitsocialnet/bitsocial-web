# Kendte overraskelser

Denne fil sporer lagerspecifikke forvirringspunkter, der forårsagede agentfejl.

## Indgangskriterier

Tilføj kun en post, hvis alle er sande:

- Det er specifikt for dette lager (ikke generisk rådgivning).
- Det vil sandsynligvis gentage sig for fremtidige agenter.
- Det har en konkret afbødning, der kan følges.

Spørg udvikleren, hvis du er usikker, før du tilføjer en post.

## Indgangsskabelon

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

## Indgange

### Portless ændrer den kanoniske lokale app-URL

- **Dato:** 2026-03-18
- **Observeret af:** Codex
- **Kontekst:** Browserbekræftelse og røgstrømme
- **Hvad var overraskende:** Den lokale standardwebadresse er ikke den sædvanlige Vite-port. Repo'en forventer `http://bitsocial.localhost:1355` gennem Portless, så kontrol af `localhost:3000` eller `localhost:5173` kan ramme den forkerte app eller slet intet.
- **Konsekvens:** Browsertjek kan mislykkes eller validere det forkerte mål, selv når udviklerserveren er sund.
- **Afbødning:** Brug først `http://bitsocial.localhost:1355`. Omgå det kun med `PORTLESS=0 corepack yarn start`, når du eksplicit har brug for en direkte Vite-port.
- **Status:** bekræftet

### Commitizen hooks blokerer ikke-interaktive commits

- **Dato:** 2026-03-18
- **Observeret af:** Codex
- **Kontekst:** Agentdrevne forpligtelsesarbejdsgange
- **Hvad var overraskende:** `git commit` udløser Commitizen gennem Husky og venter på interaktiv TTY-input, som hænger ikke-interaktive agentskaller.
- **Påvirkning:** Agenter kan gå i stå på ubestemt tid under, hvad der burde være en normal forpligtelse.
- **Afbødning:** Brug `git commit --no-verify -m "message"` til agent-oprettede commits. Mennesker kan stadig bruge `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** bekræftet

### Corepack er påkrævet for at undgå Yarn classic

- **Dato:** 2026-03-19
- **Observeret af:** Codex
- **Kontekst:** Pakkeadministratormigrering til Yarn 4
- **Hvad var overraskende:** Maskinen har stadig en global Garnklassikerinstallation på `PATH`, så at køre almindelig `yarn` kan løses til v1 i stedet for den fastgjorte Yarn 4-version.
- **Påvirkning:** Udviklere kan ved et uheld omgå repo's pakke-manager pinning og få anden installationsadfærd eller låsefil-output.
- **Afbødning:** Brug `corepack yarn ...` til shell-kommandoer, eller kør `corepack enable` først, så almindelig `yarn` løses til den fastgjorte Yarn 4-version.
- **Status:** bekræftet

### Faste portløse appnavne kolliderer på tværs af Bitsocial Web-arbejdstræer

- **Dato:** 30-03-2026
- **Observeret af:** Codex
- **Kontekst:** Start af `yarn start` i ét Bitsocial Web-arbejdstræ, mens et andet arbejdstræ allerede serverede via Portless
- **Hvad var overraskende:** Brug af det bogstavelige Portless-appnavn `bitsocial` i hvert arbejdstræ får selve ruten til at kollidere, selv når de understøttende porte er forskellige, så den anden proces mislykkes, fordi `bitsocial.localhost` allerede er registreret.
- **Indvirkning:** Parallelle Bitsocial-webgrene kan blokere hinanden, selvom Portless er beregnet til at lade dem sameksistere sikkert.
- **Afbødning:** Hold portløs opstart bag `scripts/start-dev.mjs`, som nu bruger en gren-omfattet `*.bitsocial.localhost:1355`-rute uden for det kanoniske tilfælde og falder tilbage til en gren-omfattet rute, når det blottede `bitsocial.localhost`-navn allerede er optaget.
- **Status:** bekræftet

### Dokumenteksempel bruges til at hardkode port 3001

- **Dato:** 30-03-2026
- **Observeret af:** Codex
- **Kontekst:** Kører `yarn start` sammen med andre lokale reposer og agenter
- **Hvad var overraskende:** Root-dev-kommandoen kørte docs-arbejdsområdet med `docusaurus start --port 3001`, så hele dev-sessionen mislykkedes, når en anden proces allerede ejede `3001`, selvom hovedappen allerede brugte Portless.
- **Konsekvens:** `yarn start` kunne dræbe webprocessen umiddelbart efter den er startet, og afbryde ikke-relateret lokalt arbejde over en docs-port-kollision.
- **Afbødning:** Hold opstart af dokumenter bag `yarn start:docs`, som nu bruger Portless plus `scripts/start-docs.mjs` til at honorere en injiceret fri port eller falde tilbage til den næste tilgængelige port, når den køres direkte.
- **Status:** bekræftet
