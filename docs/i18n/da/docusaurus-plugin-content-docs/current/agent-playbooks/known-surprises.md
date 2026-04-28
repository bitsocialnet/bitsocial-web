# Kendte overraskelser

Denne fil sporer lagerspecifikke forvirringspunkter, der forårsagede agentfejl.

## Indgangskriterier

Tilføj kun en post, hvis alle er sande:

- Det er specifikt for dette lager (ikke generisk rådgivning).
- Det vil sandsynligvis gentage sig for fremtidige agenter.
- Det har en konkret afbødning, der kan følges.

Hvis du er usikker, så spørg udvikleren, før du tilføjer en post.

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
- **Hvad var overraskende:** Den lokale standardwebadresse er ikke den sædvanlige Vite-port. Repo'en forventer `https://bitsocial.localhost` gennem Portless, så kontrol af `localhost:3000` eller `localhost:5173` kan ramme den forkerte app eller slet intet.
- **Konsekvens:** Browsertjek kan mislykkes eller validere det forkerte mål, selv når udviklerserveren er sund.
- **Afbødning:** Brug først `https://bitsocial.localhost`. Omgå det kun med `PORTLESS=0 corepack yarn start`, når du eksplicit har brug for en direkte Vite-port.
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
- **Afbødning:** Hold portløs opstart bag `scripts/start-dev.mjs`, som nu bruger en gren-omfattet `*.bitsocial.localhost`-rute uden for det kanoniske tilfælde og falder tilbage til en gren-omfattet rute, når det blottede `bitsocial.localhost`-navn allerede er optaget.
- **Status:** bekræftet

### Dokumenteksempel bruges til at hardkode port 3001

- **Dato:** 30-03-2026
- **Observeret af:** Codex
- **Kontekst:** Kører `yarn start` sammen med andre lokale reposer og agenter
- **Hvad var overraskende:** Root-dev-kommandoen kørte docs-arbejdsområdet med `docusaurus start --port 3001`, så hele dev-sessionen mislykkedes, når en anden proces allerede ejede `3001`, selvom hovedappen allerede brugte Portless.
- **Konsekvens:** `yarn start` kunne dræbe webprocessen umiddelbart efter den er startet, og afbryde ikke-relateret lokalt arbejde over en docs-port-kollision.
- **Afbødning:** Hold opstart af dokumenter bag `yarn start:docs`, som nu bruger Portless plus `scripts/start-docs.mjs` til at honorere en injiceret fri port eller falde tilbage til den næste tilgængelige port, når den køres direkte.
- **Status:** bekræftet

### Rettede dokumenter Portløst værtsnavn var hårdkodet

- **Dato:** 2026-04-03
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` i et sekundært Bitsocial Web-arbejdstræ, mens et andet arbejdstræ allerede serverede dokumenter via Portless
- **Hvad var overraskende:** `start:docs` registrerede stadig det bogstavelige `docs.bitsocial.localhost`-værtsnavn, så `yarn start` kunne fejle, selvom om-appen allerede vidste, hvordan man undgår portløse rutekollisioner for sit eget værtsnavn.
- **Ivirkning:** Parallelle arbejdstræer kunne ikke pålideligt bruge root dev-kommandoen, fordi docs-processen afsluttede først, og `concurrently` derefter dræbte resten af sessionen.
- **Afbødning:** Hold opstart af dokumenter bag `scripts/start-docs.mjs`, som nu afleder det samme portløse værtsnavn med brancheomfang som om-appen og injicerer den delte offentlige URL i `/docs`-dev-proxy-målet.
- **Status:** bekræftet

### Worktree-skaller kan gå glip af repo's fastgjorte Node-version

- **Dato:** 2026-04-03
- **Observeret af:** Codex
- **Kontekst:** Kørsel af `yarn start` i Git-arbejdstræer såsom `.claude/worktrees/*` eller søskende-arbejdstræ-checkouts
- **Hvad var overraskende:** Nogle worktree-skaller løste `node` og `yarn node` til Homebrew Node `25.2.1`, selvom repo-stifterne `22.12.0` i `.nvmrc`, så ZXQXPLACEHOLDER kunne køre forkert under lanceringen. køretid.
- **Påvirkning:** Dev-serveradfærd kan glide mellem hovedkassen og arbejdstræerne, hvilket gør fejl svære at reproducere og krænker repo's forventede Node 22-værktøjskæde.
- **Afbødning:** Hold udviklerstarterne bag `scripts/start-dev.mjs` og `scripts/start-docs.mjs`, som nu udføres igen under `.nvmrc` Node binær, når den aktuelle shell er på den forkerte version. Shell-opsætning bør stadig foretrække `nvm use`.
- **Status:** bekræftet

### `docs-site/` rester kan skjule manglende dokumentkilde efter refactor

- **Dato:** 2026-04-01
- **Observeret af:** Codex
- **Kontekst:** Oprydning efter fusion af monorepo efter flytning af Docusaurus-projektet fra `docs-site/` til `docs/`
- **Hvad var overraskende:** Den gamle `docs-site/`-mappe kan forblive på disken med forældede, men vigtige filer som `i18n/`, selv efter at den sporede repo er flyttet til `docs/`. Det får refaktoren til at se duplikeret ud lokalt og kan skjule det faktum, at oversættelser af sporede dokumenter faktisk ikke blev flyttet til `docs/`.
- **Konsekvens:** Agenter kan slette den gamle mappe som "junk" og ved et uheld miste den eneste lokale kopi af docs-oversættelser, eller blive ved med at redigere scripts, der stadig peger på den døde `docs-site/`-sti.
- **Afbødning:** Behandl `docs/` som det eneste kanoniske dokumentprojekt. Før du sletter eventuelle lokale `docs-site/`-rester, skal du gendanne sporet kilde som `docs/i18n/` og opdatere scripts og hooks for at stoppe med at referere til `docs-site`.
- **Status:** bekræftet

### Multilocale docs preview kan øge RAM under verificering

- **Dato:** 2026-04-01
- **Observeret af:** Codex
- **Kontekst:** Løsning af docs i18n, locale routing og Pagefind-adfærd med `yarn start:docs` plus Playwright
- **Hvad var overraskende:** Standarddokumentets forhåndsvisningstilstand udfører nu en fuld multilocale docs build plus Pagefind-indeksering før visning, og at holde denne proces i live sammen med flere Playwright- eller Chrome-sessioner kan forbruge meget mere RAM end en normal Vite- eller enkeltlokal Docusaurus-udviklersløjfe.
- **Påvirkning:** Maskinen kan blive hukommelsesbegrænset, browsersessioner kan gå ned, og afbrudte kørsler kan efterlade forældede dokumentservere eller hovedløse browsere, som bliver ved med at forbruge hukommelse.
- **Afbødning:** For dokumentarbejde, der ikke kræver lokal-rute eller sidefind-bekræftelse, foretrækker du `DOCS_START_MODE=live yarn start:docs`. Brug kun standard multilokale forhåndsvisning, når du skal validere oversatte ruter eller Pagefind. Behold en enkelt Playwright-session, luk gamle browsersessioner, før du åbner nye, og stop docs-serveren efter bekræftelse, hvis du ikke længere har brug for den.
- **Status:** bekræftet
