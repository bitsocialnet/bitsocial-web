# Ellenőrzés

Az ellenőrzéseket a megváltozott viselkedés és a fennmaradó bizonytalanság alapján válassza ki. Ugyanarra a végállapotra használja fel újra a korábbi sikeres bizonyítékokat; releváns szerkesztések vagy hibák után futtassa újra az ellenőrzéseket. A kifejezett CI-, kiadási és felhasználói követelmények továbbra is érvényesek.

| Változás                                                          | Megfelelő ellenőrzések                                                                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Csak próza/megjegyzések/formázás                                  | Diff, hivatkozások, releváns generátorok; alkalmazásbuild nélkül                                                                       |
| AI-munkafolyamat forrásai/konfigurációja                          | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; az LLM-indexek újragenerálása, ha a kontextus megváltozott |
| Elszigetelt segédmodul vagy szkript                               | Célzott meghívás/fixture-ök, valamint szintaxis- vagy típus-/lintellenőrzés az érintett kódra                                          |
| Közös futtatókörnyezet, függőség, build vagy integráció változása | Célzott ellenőrzések az érintett részekre, valamint az alábbi releváns build-/típus-/lintellenőrzések                                  |
| Csak CSS/téma/elrendezés                                          | Az érintett útvonalak/nézetablakok/témák a kiválasztott böngészőkben; build, ha importok, assetek vagy a CSS-feldolgozás változott     |
| React-állapot/effektek/teljesítmény                               | Az érintett viselkedés és az alkalmazható React-útmutatás; Doctor, ha a diagnosztikája egy konkrét aggályt tisztáz                     |

## Projektellenőrzések

- A `yarn build:verify` kiválasztja az érintett workspace-t. Ismert hatókörnél használja a `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` vagy `yarn docs:build:verify` parancsot.
- A `yarn build` szándékosan a teljes éles about/docs buildet futtatja, az összes dokumentációs lokállal együtt. Kiadásszintű validáláshoz vagy olyan változásokhoz használja, amelyek indokolják ezt a hatókört.
- A `yarn lint`, a `yarn typecheck` és a `yarn format:check` lefedi a repó meglévő kapuit; egy szűk szkriptszerkesztésnél először a szkript célzott szintaxis-, fixture- és formátumellenőrzéseit használja.
- A manifest- és lockfájl-változásokhoz `corepack yarn install`, `yarn deps:check-pinned` és `yarn deps:check-hardened` szükséges. A `yarn knip` a függőségek/importok tekintetében tanácsadó jellegű.
- A dokumentációs fordítások ellenőrzései a [translations.md](translations.md) oldalon találhatók; célzott dokumentációs változtatásnál ne futtassa a tömeges fordításíró szkriptet.

## Böngészős bizonyítékok és tulajdonjog

Kis, elszigetelt böngészős változtatásokhoz a Chrome-ot használja. Vegye hozzá a Firefoxot és a WebKitet közös CSS-, elrendezés- vagy reszponzivitásváltozásoknál, böngészőérzékeny API-knál, széles körű interakcióknál, kiadásoknál vagy kifejezett böngészőközi elfogadási feltételeknél. Vonja be az érintett mobilelrendezéseket és érintéses viselkedést is. A nézetablak átméretezése önmagában nem érintésemuláció. A tényleges útvonalakat és tartalmat a forrásból válassza ki, ahelyett hogy feltételezné, hogy a példák elérhetők.

A `playwright-cli` eszközt a `./scripts/pw-session.sh` szkripten keresztül használja. Gépszinten egyszerre egy böngésző lehet aktív; a kiválasztott motorok sorosan futnak, és minden pontosan azonosított saját munkamenet hiba után is bezárul. A hívó tulajdonában lévő, engedélyezett munkamenetet bezárás nélkül használja újra. Soha ne használjon globális böngészőtakarítást, és ne állítson le olyan kiszolgálót, amelynek tulajdonosa nem egyértelmű. A csak dokumentációs munkához nincs szükség böngészőre vagy kiszolgálóra.

Teljesítménymunkánál ugyanazt a folyamatot hasonlítsa össze egyenértékű nézetablakkal, tartalommal, hálózati/CPU-beállításokkal, buildmóddal és mérési többletterheléssel. Különítse el a megfigyeléseket a feltételezett okoktól. A profilozó skillt akkor használja, ha ezek a mérések a tényleges kérésre adnak választ.

## Záró bizonyítékok

A nehéz ellenőrzéseket egyetlen ügynök birtokolja. Vizsgálja meg az aktív terheléseket, és futtassa sorosan a telepítéseket, a buildeket/teljes tesztsorozatokat, a Doctort, az Android-/Electron-munkát és a böngészős profilozást. Jelentse a parancsokat/eredményeket és a konkrét korlátokat; a hiányzó adat vagy egy kihagyott motor nem sikeres eredmény. Az eszközök fixture-jei a formátumokat és a mechanikát ellenőrzik, nem a végponttól végpontig tartó alkalmazásbeli felfedezést vagy a modell döntéseinek minőségét.

## Automatikus React-ellenőrzések

A `yarn agent:verify` lefuttatja a kiválasztott buildeket, majd a `yarn doctor:check` és a `yarn perf:check` parancsot. A `perf:check` tartalmazza a gyűjtő kompatibilitási és szándékos regressziós önellenőrzését, így sem a CI-nek, sem az ügynöki ellenőrzési útvonalnak nincs szüksége külön `perf:test` futásra. A rögzített böngészős eszközöket egyszer telepítse a `yarn perf:install` paranccsal (Linux CI-ben a `--with-deps` kapcsolóval). A teljes releváns futás után célzott újrafuttatásokhoz használjon cél- és forgatókönyvszűrőket. A forgatókönyvek költségkeretei kifejezetten a `scripts/react-perf/config.mjs` fájlban vannak megadva; őrizze meg a bizonyítékokat, és javítsa ki a regressziót, mielőtt indokolt alapvonal-módosítást fontolna meg. A szokásos éles buildek nem tartalmazzák a Bippyt; a külön `build:profile:*` parancsok biztosítják a hivatalos React-profilozási instrumentációt.

Az about oldal `apps-search` forgatókönyvét a karakterenként véglegesített URL- és beviteli értékek ütemezik. Sikeres eredménye ezt a véglegesített lekérdezéssorozatot fedi le, nem a gyors gépelésre adott válaszkészséget. Karaktervesztés vagy a bevitel válaszkészségének értékelésekor használjon külön, gyors bevitelű reprodukciót.
