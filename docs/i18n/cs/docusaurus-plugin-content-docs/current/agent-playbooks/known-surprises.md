# Známá překvapení

Tento soubor eviduje místa v repozitáři, která vedla k záměnám a chybám agentů.

## Kritéria pro zápis

Záznam přidejte pouze tehdy, pokud platí všechny tři body:

- Týká se konkrétně tohoto repozitáře (nejde o obecnou radu).
- Je pravděpodobné, že se to bude budoucím agentům opakovat.
- Existuje konkrétní opatření, kterým se tomu dá předejít.

Pokud si nejste jisti, zeptejte se před přidáním záznamu vývojáře.

## Šablona záznamu

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

## Záznamy

### Produkční domény aplikací na Vercelu se mohou vrátit k nasazením z Gitu z větve master

- **Datum:** 2026-04-28
- **Zjistil:** Tommaso + Codex
- **Kontext:** Ověřování zrcadel aplikací Seedit a 5chan v adresáři aplikací na webu Bitsocial Web.
- **Co bylo překvapivé:** Projekty `seedit` a `5chan` na Vercelu měly nastaveno `gitProviderOptions.createDeployments = "enabled"`, takže pushe do `master` na GitHubu byly povyšovány na produkční domény, přestože pravidla repozitáře očekávají, že produkční zrcadla aplikací budou obsluhovat pouze release artefakty.
- **Dopad:** Odznaky ověřených zrcadel v adresáři aplikací se mohou stát nepravdivými, protože produkční domény obsluhují nejnovější vývojový commit místo release ZIPu z GitHubu, jehož hash souboru `index.html` je zaznamenán v `about/src/lib/apps-data.ts`.
- **Opatření:** Než přidáte nebo obnovíte metadata ověření zrcadla, zkontrolujte projekt na Vercelu příkazem `vercel api /v9/projects/<project-id>` a potvrďte, že platí `gitProviderOptions.createDeployments = "disabled"`. Obsah release ZIPu nasazujte pomocí `vercel deploy --prebuilt --prod` a pro vývojová nasazení používejte `seedit-omega.vercel.app` nebo `5chan-omega.vercel.app`.
- **Stav:** potvrzeno

### Portless 0.11 znovu použije starý stav proxy, pokud launcher nevynutí HTTPS

- **Datum:** 2026-04-28
- **Zjistil:** Tommaso + Codex
- **Kontext:** Převod běžného postupu `yarn start` ze staré proxy adresy `http://bitsocial.localhost:1355` na `https://bitsocial.localhost`.
- **Co bylo překvapivé:** I s nainstalovaným `portless@0.11.1` Portless znovu použil existující HTTP proxy `~/.portless/proxy.port = 1355` a vypsal starou adresu s `:1355`.
- **Dopad:** Aktualizovat verze balíčků a dokumentaci nestačí; `yarn start` může starou adresu dál inzerovat i používat, pokud má přispěvatel spuštěný starý stav Portless.
- **Opatření:** Startovací skripty musí HTTPS proxy Portless na portu `443` spouštět explicitně ještě před registrací tras aplikace, aby běhový postup od uloženého stavu `1355` odešel místo toho, aby jej zdědil.
- **Stav:** potvrzeno

### Portless mění kanonickou lokální adresu aplikace

- **Datum:** 2026-03-18
- **Zjistil:** Codex
- **Kontext:** Ověřování v prohlížeči a smoke testy
- **Co bylo překvapivé:** Výchozí lokální adresa není obvyklý port Vite. Repozitář očekává `https://bitsocial.localhost` přes Portless, takže kontrola `localhost:3000` nebo `localhost:5173` může zasáhnout špatnou aplikaci nebo vůbec nic.
- **Dopad:** Kontroly v prohlížeči mohou selhat nebo ověřovat špatný cíl, i když je vývojový server v pořádku.
- **Opatření:** Nejprve použijte adresu `https://bitsocial.localhost` a obejděte ji pomocí `PORTLESS=0 corepack yarn start` jen tehdy, když výslovně potřebujete přímý port Vite.
- **Stav:** potvrzeno

### Hooky Commitizen blokují neinteraktivní commity

- **Datum:** 2026-03-18
- **Zjistil:** Codex
- **Kontext:** Postupy commitování řízené agentem
- **Co bylo překvapivé:** `git commit` spustí přes Husky nástroj Commitizen a ten čeká na interaktivní vstup z TTY, což zablokuje neinteraktivní shelly agentů.
- **Dopad:** Agenti mohou při běžném commitu uvíznout na neurčito.
- **Opatření:** Pro commity vytvářené agentem používejte `git commit --no-verify -m "message"`. Lidé mohou dál používat `corepack yarn commit` nebo `corepack yarn exec cz`.
- **Stav:** potvrzeno

### Corepack je nutný, aby se nepoužil Yarn classic

- **Datum:** 2026-03-19
- **Zjistil:** Codex
- **Kontext:** Přechod správce balíčků na Yarn 4
- **Co bylo překvapivé:** Na stroji je stále globální instalace Yarn classic v `PATH`, takže spuštění prostého `yarn` se může přeložit na v1 místo připnuté verze Yarn 4.
- **Dopad:** Vývojáři mohou nedopatřením obejít připnutí správce balíčků v repozitáři a získat jiné chování instalace nebo jiný výstup do lockfile.
- **Opatření:** V shellu používejte `corepack yarn ...`, nebo nejdřív spusťte `corepack enable`, aby se prosté `yarn` překládalo na připnutou verzi Yarn 4.
- **Stav:** potvrzeno

### Pevné názvy aplikací v Portless kolidují napříč worktree Bitsocial Web

- **Datum:** 2026-03-30
- **Zjistil:** Codex
- **Kontext:** Spuštění `yarn start` v jednom worktree Bitsocial Web ve chvíli, kdy jiný worktree už obsluhoval přes Portless
- **Co bylo překvapivé:** Použití doslovného názvu aplikace `bitsocial` v každém worktree způsobí kolizi samotné trasy, i když jsou porty na pozadí různé, takže druhý proces selže, protože `bitsocial.localhost` už je zaregistrován.
- **Dopad:** Paralelní větve Bitsocial Web se mohou navzájem blokovat, přestože Portless má umožnit jejich bezpečné souběžné fungování.
- **Opatření:** Spouštění Portless nechte za `scripts/start-dev.mjs`, který nyní mimo kanonický případ používá trasu `*.bitsocial.localhost` odvozenou od větve a přejde na tuto trasu i tehdy, když je holý název `bitsocial.localhost` již obsazen.
- **Stav:** potvrzeno

### Náhled dokumentace míval napevno zadaný port 3001

- **Datum:** 2026-03-30
- **Zjistil:** Codex
- **Kontext:** Spouštění `yarn start` souběžně s dalšími lokálními repozitáři a agenty
- **Co bylo překvapivé:** Kořenový vývojový příkaz spouštěl workspace dokumentace příkazem `docusaurus start --port 3001`, takže celá vývojová relace selhala vždy, když port `3001` už vlastnil jiný proces, i když hlavní aplikace už Portless používala.
- **Dopad:** `yarn start` mohl webový proces zabít hned po jeho nastartování a kvůli kolizi portu dokumentace přerušit nesouvisející lokální práci.
- **Opatření:** Spouštění dokumentace nechte za `yarn start:docs`, který nyní používá Portless spolu se `scripts/start-docs.mjs`, aby respektoval vložený volný port nebo při přímém spuštění přešel na další dostupný port.
- **Stav:** potvrzeno

### Pevný název hostitele dokumentace v Portless byl zadán napevno

- **Datum:** 2026-04-03
- **Zjistil:** Codex
- **Kontext:** Spuštění `yarn start` v druhém worktree Bitsocial Web ve chvíli, kdy jiný worktree už obsluhoval dokumentaci přes Portless
- **Co bylo překvapivé:** `start:docs` stále registroval doslovný název hostitele `docs.bitsocial.localhost`, takže `yarn start` mohl selhat, přestože aplikace about už uměla kolizím tras v Portless pro svůj vlastní název hostitele předcházet.
- **Dopad:** Paralelní worktree nemohly kořenový vývojový příkaz spolehlivě používat, protože proces dokumentace skončil jako první a `concurrently` pak ukončil zbytek relace.
- **Opatření:** Spouštění dokumentace nechte za `scripts/start-docs.mjs`, který nyní odvozuje stejný název hostitele Portless podle větve jako aplikace about a tuto sdílenou veřejnou adresu vkládá do cíle vývojové proxy `/docs`.
- **Stav:** potvrzeno

### Shelly ve worktree mohou minout verzi Node připnutou v repozitáři

- **Datum:** 2026-04-03
- **Zjistil:** Codex
- **Kontext:** Spouštění `yarn start` v Git worktree, například `.claude/worktrees/*`, nebo v sesterských checkoutech worktree
- **Co bylo překvapivé:** Některé shelly ve worktree přeložily `node` a `yarn node` na Homebrew Node `25.2.1`, přestože repozitář v `.nvmrc` připíná `22.12.0`, takže `yarn start` mohl vývojové launchery tiše spustit pod špatným běhovým prostředím.
- **Dopad:** Chování vývojového serveru se může mezi hlavním checkoutem a worktree rozcházet, což ztěžuje reprodukci chyb a porušuje očekávaný toolchain Node 22.
- **Opatření:** Vývojové launchery nechte za `scripts/start-dev.mjs` a `scripts/start-docs.mjs`, které se nyní znovu spustí pod binárkou Node z `.nvmrc`, pokud je aktuální shell na špatné verzi. Nastavení shellu by mělo i tak upřednostňovat `nvm use`.
- **Stav:** potvrzeno

### Zbytky `docs-site/` mohou po refaktoru zamaskovat chybějící zdroje dokumentace

- **Datum:** 2026-04-01
- **Zjistil:** Codex
- **Kontext:** Úklid monorepa po sloučení, které přesunulo projekt Docusaurus z `docs-site/` do `docs/`
- **Co bylo překvapivé:** Stará složka `docs-site/` může na disku zůstat i se zastaralými, ale důležitými soubory jako `i18n/`, přestože se sledovaný repozitář už přesunul do `docs/`. Refaktor pak lokálně vypadá zduplikovaně a může to zakrýt fakt, že sledované překlady dokumentace do `docs/` ve skutečnosti přesunuty nebyly.
- **Dopad:** Agenti mohou starou složku smazat jako „harampádí“ a nechtěně přijít o jedinou lokální kopii překladů dokumentace, nebo dál upravovat skripty, které stále míří na mrtvou cestu `docs-site/`.
- **Opatření:** Považujte `docs/` za jediný kanonický projekt dokumentace. Než smažete jakékoli lokální zbytky `docs-site/`, obnovte sledované zdroje jako `docs/i18n/` a upravte skripty a hooky tak, aby na `docs-site` už neodkazovaly.
- **Stav:** potvrzeno

### Vícejazyčný náhled dokumentace může při ověřování vystřelit spotřebu RAM

- **Datum:** 2026-04-01
- **Zjistil:** Codex
- **Kontext:** Opravy i18n dokumentace, směrování jazykových verzí a chování Pagefind pomocí `yarn start:docs` a Playwrightu
- **Co bylo překvapivé:** Výchozí režim náhledu dokumentace nyní před obsluhou provede plný vícejazyčný build dokumentace plus indexaci Pagefind, a udržovat tento proces naživu vedle několika relací Playwrightu nebo Chromu může spotřebovat mnohem víc RAM než běžná vývojová smyčka Vite nebo Docusaurus s jedinou jazykovou verzí.
- **Dopad:** Stroji může dojít paměť, relace prohlížeče mohou spadnout a přerušené běhy mohou zanechat zastaralé servery dokumentace nebo headless prohlížeče, které paměť dál spotřebovávají.
- **Opatření:** Pro práci na dokumentaci, která nepotřebuje ověřovat jazykové trasy ani Pagefind, upřednostněte `DOCS_START_MODE=live yarn start:docs`. Výchozí vícejazyčný náhled používejte jen tehdy, když potřebujete ověřit přeložené trasy nebo Pagefind. Udržujte jedinou relaci Playwrightu, před otevřením nové zavřete staré relace prohlížeče a po ověření server dokumentace zastavte, pokud jej už nepotřebujete.
- **Stav:** potvrzeno

### `translate-docs.py` může nechat jazykové verze dokumentace přeložené jen zpola nebo s rozbitými cíli odkazů

- **Datum:** 2026-04-06
- **Zjistil:** Codex
- **Kontext:** Opravy lokalizovaných tras a obsahu dokumentace poté, co `yarn start:docs` obsluhoval anglické detailní stránky nebo selhal při sestavení jazykového výstupu
- **Co bylo překvapivé:** Překladová pipeline dokumentace měla naráz dva režimy selhání specifické pro tento repozitář: `scripts/translate-docs.py` extrahoval jen malou podmnožinu zpráv `DocsHome`, když volání `tr(...)` používala tvary, které neuměl rozparsovat, a přeložený markdown pod `docs/i18n/**` mohl v cílech odkazů obsahovat strojově přeložené slugy nebo artefakty `ZXQPLACEHOLDER`.
- **Dopad:** Lokalizované domovské stránky mohou tiše spadnout zpět na angličtinu, lokalizované detailní stránky mohou vypadat nepřeložené a plný `yarn docs:build` může selhat na rozbitých jazykových odkazech, přestože zdrojová dokumentace je v pořádku.
- **Opatření:** Po změně překladů dokumentace nebo po regeneraci jazykových souborů vždy spusťte `yarn docs:build` z kořene repozitáře, prohledejte markdown v `docs/i18n/**` na výskyty `ZXQPLACEHOLDER` a ověřte, že přeložené odkazy stále míří na kanonické slugy dokumentů jako `/apps/5chan/`, a ne na přeložené cesty URL. Pokud se změnily texty `DocsHome`, potvrďte, že `scripts/translate-docs.py` stále extrahuje všechny zprávy `docs.home.*`.
- **Stav:** potvrzeno

### Kontroly webu about bez JavaScriptu musí používat trasu Portless, ne samostatný SSR náhled

- **Datum:** 2026-04-12
- **Zjistil:** Codex
- **Kontext:** Ověřování podpory běhu bez JavaScriptu pro web `about/` z worktree větve
- **Co bylo překvapivé:** Samostatný SSR náhled může vypadat zdravě, zatímco skutečná trasa Portless odvozená od větve stále obsluhuje špatný shell aplikace nebo starší proces. V tomto repozitáři je skutečným lokálním kontraktem název hostitele Portless z `yarn start`, ne ad hoc náhledový server.
- **Dopad:** Agenti mohou nesprávně tvrdit, že podpora běhu bez JavaScriptu funguje, nebo minout regrese, které se projeví jen na `*.bitsocial.localhost`.
- **Opatření:** Pro ověřování `about/` v prohlížeči vždy spusťte skutečný lokální server pomocí `yarn start` nebo `yarn start:about` a testujte nejdřív adresu Portless odvozenou od větve. Pokud název hostitele Portless vypadá zastarale, prozkoumejte a zastavte starý proces, než budete testovat znovu.
- **Stav:** potvrzeno

### `chain/` byl pro `yarn build:verify` a `yarn doctor` neviditelný

- **Datum:** 2026-07-05
- **Zjistil:** Codex
- **Kontext:** Ověřování diffu týkajícího se pouze chain/ poté, co byl do monorepa přidán workspace `chain/` (samostatná aplikace Vite pro `chain.bitsocial.net`).
- **Co bylo překvapivé:** `scripts/verify-build.mjs` rozpoznával jen prefixy cest `about/`, `docs/` a `stats/`, takže diff jen v chain/ vypsal „No targeted build checks matched the current diff“ a nespustil vůbec žádný build, přestože `build:chain` už v kořenovém `package.json` existoval. Kromě toho bylo `yarn doctor` napevno nastaveno na `react-doctor about -y`, takže změny Reactu pod `chain/src` neměly od React Doctoru žádné pokrytí.
- **Dopad:** Agenti ověřující změny v chain museli vědět, že mají volat přímo `yarn build:chain`, místo aby se spolehli na `yarn build:verify`, a problémy Reactu v `chain/src` (efekty, hooky, mrtvý kód) zůstaly pro `yarn doctor` neodhalené.
- **Opatření:** `scripts/verify-build.mjs` má nyní větev pro `chain/`, která zrcadlí tu pro `about/`, a `doctor` i `doctor:verbose` nyní spouštějí `react-doctor --project about,chain -y` v jediném volání. `doctor:score` zůstává jen pro `about`, protože `--score` v kombinaci s `--project` pro více než jeden projekt tiše nevypíše nic; pokud potřebujete skóre pro chain, použijte `yarn react-doctor --project about,chain --verbose -y` (nebo `--json`).
- **Stav:** potvrzeno

### P2P v prohlížeči běží na zabezpečených WebSockets; pkc-js ve výchozím stavu odmítá WebRTC a WebTransport

- **Datum:** 2026-08-02
- **Zjistil:** Claude
- **Kontext:** Psaní textů pro landing page a dokumentaci o tom, jak u Bitsocial funguje P2P v prohlížeči
- **Co bylo překvapivé:** `@pkcprotocol/pkc-js` obsahuje výchozí connection gater, který v prohlížeči odmítá navazování spojení přes WebRTC a WebTransport — `dist/browser/helia/dial-transport-filter.js` exportuje `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Komentář v jeho zdrojovém kódu uvádí důvod: v prohlížeči tyto transporty přidávají dlouhé a často selhávající cesty k navázání spojení (STUN/ICE, rotace certhash), které zpomalují načítání, zatímco WebSocket je přímý a spolehlivý. U každého živého peeru v panelu stavu P2P na blogu se ukazuje „Secure WebSocket“. Gater žije v `node_modules`, takže v repozitáři na něj nic neupozorňuje.
- **Dopad:** Je velmi snadné napsat technicky věrohodný, ale nepravdivý veřejný text — například připsat zásluhu WebTransportu, který v březnu 2026 dosáhl v prohlížečích na Baseline, za to, že je P2P v prohlížeči u Bitsocial vůbec možné. Toto tvrzení se dostalo na landing page, do srovnávací tabulky a na dvě stránky dokumentace, než si ho vývojář všiml. Nesprávná tvrzení o architektuře na veřejných stránkách kontroluje přesně to vývojářské publikum, na které web cílí.
- **Opatření:** Nikdy neodvozujte, které transporty Bitsocial používá, z toho, co v principu podporuje libp2p nebo platforma prohlížeče. Aktuální seznam zakázaných transportů najdete v `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js`, potvrďte, že pod `about/src/` neexistuje žádné přepsání `connectionGater`, a než uděláte jakékoli veřejné tvrzení, přečtěte si živé popisky transportů v panelu „P2P status“ na blogu. Upstreamová změna, která publikování z prohlížeče skutečně odblokovala, byla oprava monotónního seqno v gossipsubu v `@libp2p/gossipsub` 15.0.21 (květen 2026); pkc-js aktuálně dodává 16.0.4.
- **Stav:** potvrzeno

### Relativní odkazy `./page.md` z nepřeložené stránky dokumentace rozbijí každý lokalizovaný build

- **Datum:** 2026-08-02
- **Zjistil:** Claude
- **Kontext:** Přidání nové stránky jen v angličtině, `docs/browser-p2p.md`, která odkazovala na existující dokumenty pomocí `./peer-to-peer-protocol.md` a `./apps/5chan.md`
- **Co bylo překvapivé:** Každá jazyková verze pod `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` zrcadlí strom dokumentace. Nová stránka, která v těchto zrcadlech chybí, se sice díky anglickému fallbacku vykreslí v každé jazykové verzi, ale její relativní markdownové odkazy se už nerozřeší — Docusaurus vygeneruje `/ar/browser-p2p/peer-to-peer-protocol.md/` a build selže s hláškou „Docusaurus found broken links!“. Podstatné je, že `yarn build:verify` a `yarn docs:build:verify` sestavují jen `en` a projdou bez chyby; problém odhalí až plný `yarn docs:build`, a ten se zastaví hned na první jazykové verzi podle abecedy (`ar`).
- **Dopad:** Změna dokumentace může projít všemi rychlými lokálními kontrolami a přesto rozbít produkční vícejazyčný build. Selhání navíc vypadá, že s danou změnou nesouvisí, protože chyba zmiňuje cestu jazykové verze, které se autor nikdy nedotkl.
- **Opatření:** V každé stránce dokumentace, která není zrcadlena do `docs/i18n/**`, používejte odkazy relativní ke kořeni (`/peer-to-peer-protocol/`, `/apps/5chan/`) místo relativních odkazů na `.md`; Docusaurus k nim prefix jazykové verze doplní automaticky. Existujícím příkladem je `docs/build-your-own-client.md`. Než předáte jakoukoli změnu, která přidává stránku dokumentace nebo na ni odkazuje, spusťte plný `yarn docs:build`, ne jen `build:verify`.
- **Stav:** potvrzeno

### Souběžné běhy `update-translations.js` tiše ztrácejí klíče

- **Datum:** 2026-08-02
- **Zjistil:** Claude
- **Kontext:** Aplikování 26 přeložených klíčů i18next do všech 36 jazykových verzí pomocí dovednosti `translate`
- **Co bylo překvapivé:** Každé volání je operace čtení, úpravy a zápisu nad všemi 36 jazykovými soubory, takže dvě souběžně běžící volání se navzájem přepíší a jeden klíč zmizí bez jakékoli chyby. Dovednost `translate` přitom výslovně nabádá ke spuštění až 4 souběžných subagentů, z nichž každý by tento skript volal.
- **Dopad:** Selhává tiše: klíče chybí v náhodných jazykových verzích a diff přesto vypadá věrohodně.
- **Opatření:** Nikdy nenechte překladatelské subagenty zapisovat jazykové soubory souběžně — nechte je pouze vygenerovat slovníkové soubory JSON a pak z rodičovského agenta aplikujte každý klíč sériově. Po aplikování programově ověřte, že každý klíč existuje ve všech 35 neanglických jazykových verzích a že žádná hodnota není bajt po bajtu totožná s anglickým zdrojem.
- **Stav:** potvrzeno
- **Aktualizace (2026-08-10):** Skript dříve navíc odvozoval svůj cíl jako `path.join(process.cwd(), "public", "translations")`, takže dokumentovaný příkaz z kořene repozitáře selhal s hláškou „Translations directory not found“ a musel se spouštět z `about/`. Nyní odvozuje workspace z aktuálního adresáře nebo ze svého vlastního umístění a funguje odkudkoli. Výše popsaná past se souběžností zůstává beze změny.

### Vývojové ovládací prvky pro anotace mohou zachytit kliknutí z automatizace

- **Kontext:** Weby about a chain mají v pravém dolním rohu pevně umístěné ovládací prvky a právě tam se ve vývojovém režimu objevuje i panel nástrojů Agentation.
- **Opatření:** `scripts/pw-session.sh open` před opětovným načtením stránky zaregistruje `window.__NO_DEV_TOOLBAR__ = true`. Inicializátor Agentation respektuje také `__VISUAL_TESTING__` a `__PROFILING__`; inspekce zdrojového kódu zůstává dostupná nezávisle na tom. Přímá automatizace prohlížeče musí stejný příznak nastavit ještě před načtením aplikace.

### `skills add` instaluje kopie pro Codex a Cursor do adresáře `.agents/`, který Git ignoruje

- **Datum:** 2026-08-18
- **Zjistil:** Tommaso + Claude
- **Kontext:** Instalace dovednosti `improve-threejs` z `millionco/react-doctor` pomocí CLI `skills` (`vercel-labs/skills`).
- **Co bylo překvapivé:** `npx skills add <repo> --skill <name> --agent codex` i `--agent cursor` zapisují do `.agents/skills/<name>/`, ne do `.codex/skills/` nebo `.cursor/skills/`. `AGENTS.md` zakazuje adresář `.agents/` na úrovni repozitáře a `.gitignore:29` ho ignoruje, takže obě kopie tiše zůstanou nesledované. Do očekávaného `.claude/skills/` zapisuje jen `--agent claude-code`. Kromě toho dokumentovaný tvar s hodnotami oddělenými čárkami (`--agent claude-code,codex,cursor`) selže s hláškou „Invalid agents“ a nenainstaluje nic, přestože každý z názvů je sám o sobě platný.
- **Dopad:** Instalace hlásí úspěch, zatímco dvě ze tří kopií pro jednotlivé toolchainy skončí tam, kde nikdy nebudou commitnuty, takže Codexu a Cursoru po čerstvém klonování dovednost tiše chybí. Tvar s čárkami navíc může vést k instalaci, která nic neudělá, a přesto vypadá jako úspěch.
- **Aktuální opatření:** Repozitář nyní sleduje `.agents/skills` jako svůj kanonický zdroj a kopie pro Claude generuje pomocí `yarn ai-workflow:sync`. Dřívější zákaz `.agents` i pravidlo pro jeho ignorování byly odstraněny. Nové dovednosti nekopírujte do tří nezávislých kořenů; po přidání dovednosti zkontrolujte paritu vygenerovaných souborů a katalog aplikace.
- **Stav:** potvrzeno
