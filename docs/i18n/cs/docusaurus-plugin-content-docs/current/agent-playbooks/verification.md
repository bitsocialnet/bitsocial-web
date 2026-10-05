# Ověřování

Kontroly vybírejte podle změněného chování a zbývající nejistoty. Úspěšné důkazy pro tentýž konečný stav znovu využijte; po relevantních úpravách nebo selháních kontroly spusťte znovu. Výslovné požadavky CI, vydání nebo uživatele nadále platí.

| Změna                                                      | Vhodné kontroly                                                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Pouze text, komentáře nebo formátování                     | Diff, odkazy, relevantní generátory; žádný build aplikace                                                                       |
| Zdroje a konfigurace AI workflow                           | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; při změně kontextu znovu vygenerujte indexy pro LLM |
| Izolovaný pomocný kód nebo skript                          | Cílené spuštění nebo fixtures a kontroly syntaxe, typů či lintu pro dotčený kód                                                 |
| Změna sdíleného runtime, závislostí, buildu nebo integrace | Cílené kontroly dotčených částí plus relevantní kontroly buildu, typů a lintu uvedené níže                                      |
| Pouze CSS, motiv nebo layout                               | Dotčené trasy, viewporty a motivy ve vybraných prohlížečích; build, pokud se změnily importy, assety nebo zpracování CSS        |
| Stav, efekty nebo výkon v Reactu                           | Dotčené chování a použitelná doporučení pro React; Doctor, pokud diagnostika pomůže vyřešit konkrétní problém                   |

## Kontroly projektu

- `yarn build:verify` vybere dotčený workspace. Pro známý rozsah použijte `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` nebo `yarn docs:build:verify`.
- `yarn build` záměrně spouští plný produkční build webu about a dokumentace, včetně všech jazykových verzí dokumentace. Používejte ho pro validaci celého vydání nebo pro změny, které takový rozsah opravňují.
- `yarn lint`, `yarn typecheck` a `yarn format:check` pokrývají stávající brány repozitáře; při úzké úpravě skriptu nejprve použijte jeho cílené kontroly syntaxe, fixtures a formátu.
- Změny manifestu nebo lockfile vyžadují `corepack yarn install`, `yarn deps:check-pinned` a `yarn deps:check-hardened`. `yarn knip` má u závislostí a importů jen poradní charakter.
- Kontroly překladů dokumentace popisuje [translations.md](translations.md); při cílené změně dokumentace nespouštějte hromadný skript pro zápis překladů.

## Důkazy z prohlížeče a vlastnictví relací

Pro malé izolované změny v prohlížeči použijte Chrome. Firefox a WebKit přidejte u sdíleného CSS, layoutu a responzivity, u API citlivých na prohlížeč, rozsáhlých interakcí, vydání nebo výslovných kritérií pro více prohlížečů. Zahrňte dotčené mobilní layouty a dotykové chování. Samotná změna velikosti viewportu není emulace dotyku. Skutečné trasy a obsah zjistěte ze zdrojového kódu a nepředpokládejte, že ukázkové příklady jsou k dispozici.

`playwright-cli` používejte přes `./scripts/pw-session.sh`. V rámci celého stroje smí být aktivní jen jeden prohlížeč; vybrané enginy běží postupně a každá vlastní relace se zavírá přesně podle svého názvu, a to i po selhání. Autorizovanou relaci, kterou vlastní volající, použijte znovu, aniž byste ji zavírali. Nikdy nepoužívejte globální úklid prohlížečů a nezastavujte server, jehož vlastník není jasný. Pro čistě dokumentační práci není prohlížeč ani server potřeba.

Při práci na výkonu porovnávejte stejný postup se stejným viewportem, obsahem, nastavením sítě a CPU, režimem buildu a režií měření. Odlišujte pozorování od domnělých příčin. Dovednost pro profilování použijte tehdy, když tato měření odpovídají na skutečný požadavek.

## Závěrečné důkazy

Těžké ověřování vlastní jeden agent. Zjistěte, jaké úlohy právě běží; instalace, buildy či plné sady testů, Doctor, práci na Androidu nebo Electronu a profilování v prohlížeči spouštějte postupně. Uveďte příkazy a jejich výsledky i konkrétní omezení; chybějící data nebo vynechaný engine nejsou úspěšným výsledkem. Fixtures nástrojů ověřují formáty a mechaniku, nikoli end-to-end objevování v aplikaci ani kvalitu rozhodování modelu.

## Automatické kontroly Reactu

`yarn agent:verify` spustí vybrané buildy a po nich `yarn doctor:check` a `yarn perf:check`. `perf:check` zahrnuje selftest kompatibility kolektoru a záměrně vyvolané regrese, takže ani CI, ani agentní ověřovací cesta nepotřebují samostatný průchod `perf:test`. Připnuté nástroje pro prohlížeč nainstalujte jednou pomocí `yarn perf:install` (v Linux CI s `--with-deps`). Po plném relevantním průchodu používejte pro cílená opakovaná spuštění filtry cílů a scénářů. Rozpočty scénářů jsou výslovně uvedeny v `scripts/react-perf/config.mjs`; zachovejte důkazy a regresi opravte dřív, než začnete zvažovat odůvodněnou změnu referenčních hodnot. Běžné produkční buildy Bippy vynechávají; oficiální profilovací instrumentaci Reactu dodávají samostatné příkazy `build:profile:*`.

Tempo scénáře `apps-search` na webu about určují commitnuté hodnoty URL a vstupu pro každý znak. Jeho úspěšný výsledek pokrývá právě tuto commitnutou sekvenci dotazu, nikoli odezvu při rychlém psaní. Při posuzování ztráty znaků nebo odezvy vstupu použijte samostatnou reprodukci s rychlým vstupem.
