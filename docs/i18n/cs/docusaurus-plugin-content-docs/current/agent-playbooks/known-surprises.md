# Známá překvapení

Tento soubor sleduje záměny specifické pro úložiště, které způsobily chyby agentů.

## Vstupní kritéria

Přidejte záznam, pouze pokud jsou všechny pravdivé:

- Je to specifické pro tento repozitář (nejedná se o obecnou radu).
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
- **Co bylo překvapivé:** Výchozí místní adresa URL není obvyklý port Vite. Repo očekává `https://bitsocial.localhost` přes Portless, takže kontrola `localhost:3000` nebo `localhost:5173` může zasáhnout nesprávnou aplikaci nebo vůbec nic.
- **Dopad:** Kontroly prohlížeče mohou selhat nebo ověřit nesprávný cíl, i když je dev server v pořádku.
- **Zmírnění:** Nejprve použijte `https://bitsocial.localhost`. Pomocí `PORTLESS=0 corepack yarn start` jej obejděte pouze tehdy, když výslovně potřebujete přímý port Vite.
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
- **Co bylo překvapivé:** Stroj má stále globální instalaci Yarn classic na `PATH`, takže spuštění obyčejného `yarn` lze převést na verzi 1 namísto připojené verze Yarn 4.
- **Dopad:** Vývojáři mohou omylem obejít připnutí správce balíčků repo a získat jiné chování při instalaci nebo výstup lockfile.
- **Zmírnění:** Pro příkazy shellu použijte `corepack yarn ...` nebo nejprve spusťte `corepack enable`, aby se prostý `yarn` přenesl na připojenou verzi příze 4.
- **Stav:** potvrzeno

### Opravené názvy aplikací Portless kolidují v pracovních stromech Bitsocial Web

- **Datum:** 2026-03-30
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` v jednom pracovním stromu Bitsocial Web, zatímco jiný pracovní strom již sloužil přes Portless
- **Co bylo překvapivé:** Použití doslovného názvu aplikace Portless `bitsocial` v každém pracovním stromu způsobí kolizi samotné trasy, i když jsou podpůrné porty různé, takže druhý proces selže, protože `bitsocial.localhost` je již zaregistrován.
- **Dopad:** Paralelní pobočky Bitsocial Web se mohou navzájem blokovat, i když je Portless má umožnit bezpečně koexistovat.
- **Zmírnění:** Udržujte spuštění Portless za `scripts/start-dev.mjs`, které nyní používá směrování `*.bitsocial.localhost` s rozsahem větve mimo kanonický případ a vrátí se zpět na směrování s rozsahem větve, když je již obsazený holý název `bitsocial.localhost`.
- **Stav:** potvrzeno

### Náhled dokumentů použitý k pevnému zakódování portu 3001

- **Datum:** 2026-03-30
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` spolu s dalšími místními repozitáři a agenty
- **Co bylo překvapivé:** Příkaz root dev spustil pracovní prostor dokumentů pomocí `docusaurus start --port 3001`, takže celá dev relace selhala, kdykoli jiný proces již vlastnil `3001`, i když hlavní aplikace již používala Portless.
- **Dopad:** `yarn start` by mohl zabít webový proces okamžitě po jeho spuštění a přerušit nesouvisející místní práci kvůli kolizi portů dokumentů.
- **Zmírnění:** Udržujte spouštění dokumentů za `yarn start:docs`, který nyní používá Portless plus `scripts/start-docs.mjs` k respektování vloženého volného portu nebo přechodu zpět na další dostupný port při přímém spuštění.
- **Stav:** potvrzeno

### Opravené dokumenty Portless název hostitele byl pevně zakódován

- **Datum:** 2026-04-03
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` v sekundárním pracovním stromu Bitsocial Web, zatímco jiný pracovní strom již obsluhoval dokumenty prostřednictvím Portless
- **Co bylo překvapivé:** `start:docs` stále registroval doslovný název hostitele `docs.bitsocial.localhost`, takže `yarn start` mohlo selhat, i když aplikace about již věděla, jak se vyhnout kolizím tras bez portů pro svůj vlastní název hostitele.
- **Dopad:** Paralelní pracovní stromy nemohly spolehlivě používat příkaz root dev, protože proces docs skončil jako první a `concurrently` pak ukončil zbytek relace.
- **Zmírnění:** Udržujte spouštění dokumentů za `scripts/start-docs.mjs`, který nyní odvozuje stejný název hostitele Portless v rozsahu větve jako aplikace About a vkládá sdílenou veřejnou adresu URL do cílového proxy serveru `/docs` pro vývojáře.
- **Stav:** potvrzeno

### Skořápky Worktree mohou postrádat připnutou verzi Node repo

- **Datum:** 2026-04-03
- **Dodržováno:** Kodex
- **Kontext:** Spuštění `yarn start` v pracovních stromech Git, jako je `.claude/worktrees/*` nebo sourozenecké pokladny
- **Co bylo překvapivé:** Některé shelly pracovního stromu vyřešily `node` a `yarn node` na domácí uzel `25.2.1`, i když repo piny `22.12.0` v `.nvmrc` se mohly spustit ZXQZPLACEX tiše pod nesprávným spuštěním runtime.
- **Dopad:** Chování dev-serveru se může pohybovat mezi hlavní pokladnou a pracovními stromy, což ztěžuje reprodukci chyb a porušuje očekávaný řetězec nástrojů Node 22 repo.
- **Zmírnění:** Udržujte spouštěče pro vývojáře za `scripts/start-dev.mjs` a `scripts/start-docs.mjs`, které se nyní znovu spouštějí pod binárním uzlem `.nvmrc`, když je aktuální shell na nesprávné verzi. Nastavení prostředí by mělo stále preferovat `nvm use`.
- **Stav:** potvrzeno

### `docs-site/` zbytky mohou skrýt chybějící zdroj dokumentů po refaktorování

- **Datum:** 2026-04-01
- **Dodržováno:** Kodex
- **Kontext:** Vyčištění monorepo po sloučení po přesunutí projektu Docusaurus ze `docs-site/` na `docs/`
- **Co bylo překvapivé:** Stará složka `docs-site/` může zůstat na disku se zastaralými, ale důležitými soubory, jako je `i18n/`, a to i poté, co se sledované repo přesunulo do `docs/`. Díky tomu vypadá refaktor lokálně duplikovaně a může zakrýt skutečnost, že překlady sledovaných dokumentů nebyly ve skutečnosti přesunuty do `docs/`.
- **Dopad:** Agenti mohou smazat starou složku jako „nevyžádané“ a náhodně ztratit jedinou místní kopii překladů dokumentů nebo pokračovat v úpravách skriptů, které stále ukazují na mrtvou cestu `docs-site/`.
- **Zmírnění:** Považujte `docs/` za jediný projekt kanonických dokumentů. Před odstraněním jakýchkoli místních zbytků `docs-site/` obnovte sledovaný zdroj, jako je `docs/i18n/`, a aktualizujte skripty a háčky, abyste přestali odkazovat na `docs-site`.
- **Stav:** potvrzeno

### Multilokální náhled dokumentů může během ověřování narušit RAM

- **Datum:** 2026-04-01
- **Dodržováno:** Kodex
- **Kontext:** Oprava dokumentů i18n, směrování národního prostředí a chování Pagefind pomocí `yarn start:docs` plus Playwright
- **Co bylo překvapivé:** Výchozí režim náhledu dokumentů nyní před poskytováním provádí úplné sestavení vícelokálních dokumentů plus indexování Pagefind a udržování tohoto procesu naživu spolu s několika relacemi Playwright nebo Chrome může spotřebovat mnohem více paměti RAM než běžná vývojová smyčka Vite nebo jednolokální Docusaurus.
- **Dopad:** Počítač může být omezený na paměť, relace prohlížeče mohou selhat a přerušené běhy mohou zanechat zastaralé servery dokumentů nebo bezhlavé prohlížeče, které neustále spotřebovávají paměť.
- **Zmírnění:** Pro práci s dokumenty, která nevyžaduje ověření locale-route nebo Pagefind, preferujte `DOCS_START_MODE=live yarn start:docs`. Výchozí multilokální náhled použijte pouze v případě, že potřebujete ověřit přeložené trasy nebo Pagefind. Udržujte jednu relaci Playwright, zavřete staré relace prohlížeče před otevřením nových a zastavte server dokumentů po ověření, pokud jej již nepotřebujete.
- **Stav:** potvrzeno
