# Známá překvapení

Tento soubor sleduje záměny specifické pro úložiště, které způsobily chyby agentů.

## Vstupní kritéria

Přidejte záznam, pouze pokud jsou všechny pravdivé:

- Je to specifické pro tento repozitář (nejedná se o obecné rady).
- Je pravděpodobné, že se to bude opakovat u budoucích agentů.
- Má konkrétní zmírnění, které lze následovat.

Pokud si nejste jisti, zeptejte se vývojáře, než přidáte záznam.

## Vstupní šablona

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

## Příspěvky

### Portless změní kanonickou adresu URL místní aplikace

- **Datum:** 2026-03-18
- **Dodržováno:** Kodex
- **Kontext:** Ověření prohlížeče a toky kouře
- **Co bylo překvapivé:** Výchozí místní adresa URL není obvyklý port Vite. Repo očekává `http://bitsocial.localhost:1355` přes Portless, takže kontrola `localhost:3000` nebo `localhost:5173` může zasáhnout nesprávnou aplikaci nebo vůbec nic.
- **Dopad:** Kontroly prohlížeče mohou selhat nebo ověřit nesprávný cíl, i když je dev server v pořádku.
- **Zmírnění:** Nejprve použijte `http://bitsocial.localhost:1355`. Pomocí `PORTLESS=0 corepack yarn start` ho obejděte pouze tehdy, když výslovně potřebujete přímý port Vite.
- **Stav:** potvrzeno

### Háky potvrzení blokují neinteraktivní potvrzení

- **Datum:** 2026-03-18
- **Dodržováno:** Kodex
- **Kontext:** Pracovní postupy odevzdání řízené agenty
- **Co bylo překvapivé:** `git commit` spouští Commitizen přes Husky a čeká na interaktivní TTY vstup, který zavěsí neinteraktivní shelly agentů.
- **Dopad:** Agenti se mohou během normálního odevzdání zastavit na neurčito.
- **Zmírnění:** Použijte `git commit --no-verify -m "message"` pro potvrzení vytvořená agentem. Lidé mohou stále používat `corepack yarn commit` nebo `corepack yarn exec cz`.
- **Stav:** potvrzeno

### Corepack je vyžadován, aby se zabránilo Yarn classic

- **Datum:** 2026-03-19
- **Dodržováno:** Kodex
- **Kontext:** Migrace správce balíčků na Yarn 4
- **Co bylo překvapivé:** Stroj má stále globální instalaci Yarn classic na `PATH`, takže spuštění obyčejného `yarn` lze vyřešit na verzi 1 namísto připojené verze Yarn 4.
- **Dopad:** Vývojáři mohou omylem obejít připnutí správce balíčků repo a získat jiné chování při instalaci nebo výstup lockfile.
- **Zmírnění:** Pro příkazy shellu použijte `corepack yarn ...` nebo nejprve spusťte `corepack enable`, aby se prostý `yarn` přenesl na připojenou verzi příze 4.
- **Stav:** potvrzeno

### Opravené názvy aplikací Portless kolidují v pracovních stromech Bitsocial Web

- **Datum:** 2026-03-30
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` v jednom pracovním stromu Bitsocial Web, zatímco jiný pracovní strom již sloužil přes Portless
- **Co bylo překvapivé:** Použití doslovného názvu aplikace Portless `bitsocial` v každém pracovním stromu způsobí kolizi samotné trasy, i když jsou podpůrné porty různé, takže druhý proces selže, protože `bitsocial.localhost` je již zaregistrován.
- **Dopad:** Paralelní pobočky Bitsocial Web se mohou navzájem blokovat, i když je Portless má umožnit bezpečně koexistovat.
- **Zmírnění:** Ponechte spouštění Portless za `scripts/start-dev.mjs`, které nyní používá směrování `*.bitsocial.localhost:1355` v rozsahu vět mimo kanonický případ a přejde zpět na směrování v rozsahu větve, když je již obsazený holý název `bitsocial.localhost`.
- **Stav:** potvrzeno

### Náhled dokumentů použitý k pevnému zakódování portu 3001

- **Datum:** 2026-03-30
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` spolu s dalšími místními repozitáři a agenty
- **Co bylo překvapivé:** Příkaz root dev spustil pracovní prostor dokumentů pomocí `docusaurus start --port 3001`, takže celá dev relace selhala, kdykoli jiný proces již vlastnil `3001`, i když hlavní aplikace již používala Portless.
- **Dopad:** `yarn start` by mohl zabít webový proces okamžitě po jeho spuštění a přerušit nesouvisející místní práci kvůli kolizi portů dokumentů.
- **Zmírnění:** Udržujte spouštění dokumentů za `yarn start:docs`, který nyní používá Portless plus `scripts/start-docs.mjs` k respektování vloženého volného portu nebo přechodu zpět na další dostupný port při přímém spuštění.
- **Stav:** potvrzeno
