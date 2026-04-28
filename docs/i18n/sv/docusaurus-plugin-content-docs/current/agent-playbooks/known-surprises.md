# Kända överraskningar

Den här filen spårar förvarsspecifika förvirringspunkter som orsakade agentmisstag.

## Inträdeskriterier

Lägg bara till en post om alla är sanna:

- Det är specifikt för detta förvar (inte generiska råd).
- Det kommer sannolikt att återkomma för framtida agenter.
- Den har en konkret begränsning som kan följas.

Om du är osäker, fråga utvecklaren innan du lägger till en post.

## Inmatningsmall

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

## Inlägg

### Portless ändrar den kanoniska lokala app-URL

- **Datum:** 2026-03-18
- **Observerat av:** Codex
- **Kontext:** Webbläsarverifiering och rökflöden
- **Vad var överraskande:** Den lokala standardwebbadressen är inte den vanliga Vite-porten. Repet förväntar sig `https://bitsocial.localhost` genom Portless, så att kontrollera `localhost:3000` eller `localhost:5173` kan träffa fel app eller ingenting alls.
- **Effekt:** Webbläsarkontroller kan misslyckas eller validera fel mål även när utvecklarservern är frisk.
- **Limitation:** Använd `https://bitsocial.localhost` först. Förbi det bara med `PORTLESS=0 corepack yarn start` när du uttryckligen behöver en direkt Vite-port.
- **Status:** bekräftad

### Commitizen hooks blockerar icke-interaktiva commits

- **Datum:** 2026-03-18
- **Observerat av:** Codex
- **Kontext:** Agentdrivna commit-arbetsflöden
- **Vad var överraskande:** `git commit` utlöser Commitizen genom Husky och väntar på interaktiv TTY-inmatning, som hänger upp icke-interaktiva agentskal.
- **Påverkan:** Agenter kan stanna på obestämd tid under vad som borde vara ett normalt engagemang.
- **Limitation:** Använd `git commit --no-verify -m "message"` för agentskapade åtaganden. Människor kan fortfarande använda `corepack yarn commit` eller `corepack yarn exec cz`.
- **Status:** bekräftad

### Corepack krävs för att undvika Yarn classic

- **Datum:** 2026-03-19
- **Observerat av:** Codex
- **Kontext:** Migrering av pakethanterare till Yarn 4
- **Vad var överraskande:** Maskinen har fortfarande en global Yarn classic-installation på `PATH`, så att köra vanlig `yarn` kan lösas till v1 istället för den pinned Yarn 4-versionen.
- **Påverkan:** Utvecklare kan av misstag kringgå repos pakethanterare-fästning och få annat installationsbeteende eller låsfilsutdata.
- **Limitation:** Använd `corepack yarn ...` för skalkommandon, eller kör `corepack enable` först så vanlig `yarn` löser sig till den pinned Yarn 4-versionen.
- **Status:** bekräftad

### Fasta portlösa appnamn kolliderar över Bitsocial Web-arbetsträd

- **Datum:** 2026-03-30
- **Observerat av:** Codex
- **Kontext:** Startar `yarn start` i ett Bitsocial Web-arbetsträd medan ett annat arbetsträd redan tjänstgjorde via Portless
- **Vad var överraskande:** Att använda det bokstavliga portlösa appnamnet `bitsocial` i varje arbetsträd gör att själva rutten kolliderar, även när stödportarna är olika, så den andra processen misslyckas eftersom `bitsocial.localhost` redan är registrerad.
- **Påverkan:** Parallella Bitsocial Web-grenar kan blockera varandra även om Portless är tänkt att låta dem samexistera på ett säkert sätt.
- **Lättnad:** Håll portlös start bakom `scripts/start-dev.mjs`, som nu använder en grenomfattad `*.bitsocial.localhost`-rutt utanför det kanoniska fallet och faller tillbaka till en grenomfattad rutt när det blotta `bitsocial.localhost`-namnet redan är upptaget.
- **Status:** bekräftad

### Dokumentförhandsgranskning används för att hårdkoda port 3001

- **Datum:** 2026-03-30
- **Observerat av:** Codex
- **Kontext:** Kör `yarn start` tillsammans med andra lokala repor och agenter
- **Vad var överraskande:** Root dev-kommandot körde docs-arbetsytan med `docusaurus start --port 3001`, så hela dev-sessionen misslyckades när en annan process redan ägde `3001`, även om huvudappen redan använde Portless.
- **Effekt:** `yarn start` kan döda webbprocessen omedelbart efter att den startat, vilket avbryter icke-relaterat lokalt arbete över en dokument-portkollision.
- **Lättnad:** Håll dokumentstarten bakom `yarn start:docs`, som nu använder Portless plus `scripts/start-docs.mjs` för att hedra en injicerad ledig port eller falla tillbaka till nästa tillgängliga port när den körs direkt.
- **Status:** bekräftad
