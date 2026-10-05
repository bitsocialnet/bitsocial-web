# Ismert meglepetések

Ez a fájl azokat a repóspecifikus zavaró pontokat gyűjti össze, amelyek ügynöki hibákat okoztak.

## Felvételi feltételek

Csak akkor vegyen fel bejegyzést, ha az alábbiak mindegyike teljesül:

- Kifejezetten ehhez a repóhoz kötődik (nem általános tanács).
- Nagy eséllyel a jövőbeli ügynököknél is megismétlődik.
- Van hozzá konkrét, követhető enyhítő lépés.

Ha bizonytalan, kérdezze meg a fejlesztőt, mielőtt bejegyzést ad hozzá.

## Bejegyzéssablon

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

## Bejegyzések

### A Vercel-alkalmazások éles domainjei visszasodródhatnak a Git master telepítéseihez

- **Dátum:** 2026-04-28
- **Megfigyelte:** Tommaso + Codex
- **Kontextus:** A Seedit és az 5chan alkalmazástükrök ellenőrzése a Bitsocial Web alkalmazáskatalógusában.
- **Ami meglepő volt:** A Vercel `seedit` és `5chan` projektjeiben `gitProviderOptions.createDeployments = "enabled"` volt beállítva, így a GitHub `master` ágára küldött push-ok az éles domainekre kerültek, pedig a repó házirendje szerint az éles alkalmazástükrök csak kiadási artefaktumokat szolgálhatnak ki.
- **Hatás:** Az alkalmazáskatalógus „ellenőrzött tükör” jelvényei hamissá válhatnak, mert az éles domainek a legfrissebb fejlesztői commitot szolgálják ki a GitHub-kiadás ZIP-je helyett, amelynek `index.html` hashe az `about/src/lib/apps-data.ts` fájlban van rögzítve.
- **Enyhítés:** Tükörellenőrzési metaadatok hozzáadása vagy frissítése előtt vizsgálja meg a Vercel-projektet a `vercel api /v9/projects/<project-id>` paranccsal, és győződjön meg róla, hogy `gitProviderOptions.createDeployments = "disabled"`. A kiadási ZIP tartalmát a `vercel deploy --prebuilt --prod` paranccsal telepítse, fejlesztői telepítésekhez pedig a `seedit-omega.vercel.app` vagy a `5chan-omega.vercel.app` címet használja.
- **Állapot:** megerősítve

### A Portless 0.11 újrahasznosítja a régi proxyállapotot, hacsak az indító nem kényszeríti ki a HTTPS-t

- **Dátum:** 2026-04-28
- **Megfigyelte:** Tommaso + Codex
- **Kontextus:** A megszokott `yarn start` folyamat átállítása a régi `http://bitsocial.localhost:1355` proxy-URL-ről erre: `https://bitsocial.localhost`.
- **Ami meglepő volt:** Telepített `portless@0.11.1` mellett is a Portless a meglévő `~/.portless/proxy.port = 1355` HTTP-proxyt használta újra, és a régi `:1355` URL-t írta ki.
- **Hatás:** A csomagverziók és a dokumentáció frissítése önmagában nem elég; a `yarn start` továbbra is a régi URL-t hirdetheti és használhatja, ha a közreműködő gépén régi Portless-állapot fut.
- **Enyhítés:** Az indítószkriptek indítsák el explicit módon a Portless HTTPS-proxyt a `443` porton, még az alkalmazás-útvonalak regisztrálása előtt, hogy a futásidejű folyamat elhagyja a megőrzött `1355` állapotot ahelyett, hogy örökölné.
- **Állapot:** megerősítve

### A Portless megváltoztatja a kanonikus helyi alkalmazás-URL-t

- **Dátum:** 2026-03-18
- **Megfigyelte:** Codex
- **Kontextus:** Böngészős ellenőrzés és füstteszt-folyamatok
- **Ami meglepő volt:** Az alapértelmezett helyi URL nem a megszokott Vite-port. A repó a Portlessen keresztül elérhető `https://bitsocial.localhost` címet várja, így a `localhost:3000` vagy a `localhost:5173` vizsgálata rossz alkalmazást vagy éppen semmit sem talál.
- **Hatás:** A böngészős ellenőrzések elbukhatnak vagy rossz célpontot validálhatnak akkor is, ha a fejlesztői kiszolgáló egészséges.
- **Enyhítés:** Először a `https://bitsocial.localhost` címet használja. Csak akkor kerülje meg a `PORTLESS=0 corepack yarn start` paranccsal, ha kifejezetten közvetlen Vite-portra van szüksége.
- **Állapot:** megerősítve

### A Commitizen hookok blokkolják a nem interaktív commitokat

- **Dátum:** 2026-03-18
- **Megfigyelte:** Codex
- **Kontextus:** Ügynökök által vezérelt commit-munkafolyamatok
- **Ami meglepő volt:** A `git commit` a Huskyn keresztül elindítja a Commitizent, amely interaktív TTY-bemenetre vár, és ezzel megakasztja a nem interaktív ügynöki shelleket.
- **Hatás:** Az ügynökök a végtelenségig elakadhatnak egy egyébként hétköznapi commit közben.
- **Enyhítés:** Ügynök által létrehozott commitokhoz a `git commit --no-verify -m "message"` formát használja. Emberi közreműködők továbbra is használhatják a `corepack yarn commit` vagy a `corepack yarn exec cz` parancsot.
- **Állapot:** megerősítve

### A Corepack elengedhetetlen a Yarn classic elkerüléséhez

- **Dátum:** 2026-03-19
- **Megfigyelte:** Codex
- **Kontextus:** Csomagkezelő-migráció a Yarn 4-re
- **Ami meglepő volt:** A gépen továbbra is fent van egy globális Yarn classic telepítés a `PATH`-on, így a sima `yarn` a rögzített Yarn 4 verzió helyett a v1-re oldódhat fel.
- **Hatás:** A fejlesztők véletlenül megkerülhetik a repó csomagkezelő-rögzítését, és eltérő telepítési viselkedést vagy lockfile-kimenetet kaphatnak.
- **Enyhítés:** Shellparancsokhoz a `corepack yarn ...` formát használja, vagy futtasson előbb `corepack enable` parancsot, hogy a sima `yarn` a rögzített Yarn 4 verzióra oldódjon fel.
- **Állapot:** megerősítve

### A rögzített Portless-alkalmazásnevek ütköznek a Bitsocial Web munkafái között

- **Dátum:** 2026-03-30
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` indítása az egyik Bitsocial Web munkafában, miközben egy másik munkafa már a Portlessen keresztül szolgált ki
- **Ami meglepő volt:** Ha minden munkafa a szó szerinti `bitsocial` Portless-alkalmazásnevet használja, maga az útvonal ütközik, még eltérő háttérportok esetén is, így a második folyamat elbukik, mert a `bitsocial.localhost` már regisztrálva van.
- **Hatás:** A párhuzamos Bitsocial Web ágak blokkolhatják egymást, pedig a Portless éppen azért van, hogy biztonságosan megférjenek egymás mellett.
- **Enyhítés:** A Portless indítása maradjon a `scripts/start-dev.mjs` mögött, amely mostantól a kanonikus eseten kívül ág-hatókörű `*.bitsocial.localhost` útvonalat használ, és ág-hatókörű útvonalra vált akkor is, ha a csupasz `bitsocial.localhost` név már foglalt.
- **Állapot:** megerősítve

### A dokumentáció-előnézet korábban be volt égetve a 3001-es portra

- **Dátum:** 2026-03-30
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása más helyi repók és ügynökök mellett
- **Ami meglepő volt:** A gyökérszintű fejlesztői parancs a `docusaurus start --port 3001` paranccsal indította a dokumentációs workspace-t, így az egész fejlesztői munkamenet elbukott, valahányszor egy másik folyamat már birtokolta a `3001`-es portot, pedig a fő alkalmazás már a Portlesst használta.
- **Hatás:** A `yarn start` közvetlenül a bootolás után leállíthatta a webes folyamatot, és egy dokumentációs portütközés miatt megszakíthatta a nem kapcsolódó helyi munkát.
- **Enyhítés:** A dokumentáció indítása maradjon a `yarn start:docs` mögött, amely mostantól a Portlesst és a `scripts/start-docs.mjs` szkriptet használja, hogy figyelembe vegyen egy injektált szabad portot, közvetlen futtatáskor pedig a következő elérhető portra váltson.
- **Állapot:** megerősítve

### A dokumentáció Portless-hosztneve be volt égetve

- **Dátum:** 2026-04-03
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása egy másodlagos Bitsocial Web munkafában, miközben egy másik munkafa már a Portlessen keresztül szolgálta ki a dokumentációt
- **Ami meglepő volt:** A `start:docs` továbbra is a szó szerinti `docs.bitsocial.localhost` hosztnevet regisztrálta, így a `yarn start` akkor is elbukhatott, amikor az about-alkalmazás már tudta, hogyan kerülje el a Portless-útvonalütközéseket a saját hosztneve esetében.
- **Hatás:** A párhuzamos munkafák nem tudták megbízhatóan használni a gyökérszintű fejlesztői parancsot, mert a dokumentációs folyamat lépett ki elsőként, a `concurrently` pedig ezután leállította a munkamenet többi részét.
- **Enyhítés:** A dokumentáció indítása maradjon a `scripts/start-docs.mjs` mögött, amely mostantól ugyanazt az ág-hatókörű Portless-hosztnevet vezeti le, mint az about-alkalmazás, és ezt a közös nyilvános URL-t injektálja a `/docs` fejlesztői proxy célpontjába.
- **Állapot:** megerősítve

### A munkafák shelljei elvéthetik a repó rögzített Node-verzióját

- **Dátum:** 2026-04-03
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása Git-munkafákban, például a `.claude/worktrees/*` alatt vagy testvér munkafa-checkoutokban
- **Ami meglepő volt:** Egyes munkafa-shellek a `node` és a `yarn node` parancsot a Homebrew Node `25.2.1` verziójára oldották fel, pedig a repó a `.nvmrc` fájlban a `22.12.0` verziót rögzíti, így a `yarn start` csendben rossz futtatókörnyezet alatt indíthatta el a fejlesztői indítókat.
- **Hatás:** A fejlesztői kiszolgáló viselkedése elsodródhat a fő checkout és a munkafák között, ami megnehezíti a hibák reprodukálását, és sérti a repó elvárt Node 22-es eszközláncát.
- **Enyhítés:** A fejlesztői indítók maradjanak a `scripts/start-dev.mjs` és a `scripts/start-docs.mjs` mögött, amelyek mostantól a `.nvmrc` szerinti Node bináris alatt indulnak újra, ha az aktuális shell rossz verziót használ. A shell beállításánál továbbra is az `nvm use` az ajánlott.
- **Állapot:** megerősítve

### A `docs-site/` maradványai elrejthetik a hiányzó dokumentációs forrást az átalakítás után

- **Dátum:** 2026-04-01
- **Megfigyelte:** Codex
- **Kontextus:** Merge utáni monorepo-takarítás, miután a Docusaurus-projekt a `docs-site/` könyvtárból a `docs/` könyvtárba került
- **Ami meglepő volt:** A régi `docs-site/` mappa elavult, de fontos fájlokkal, például az `i18n/` könyvtárral együtt a lemezen maradhat akkor is, ha a követett repó már a `docs/` könyvtárra váltott. Ettől az átalakítás helyben duplikáltnak látszik, és elfedheti, hogy a követett dokumentációs fordításokat valójában nem helyezték át a `docs/` alá.
- **Hatás:** Az ügynökök szemétként törölhetik a régi mappát, és véletlenül elveszíthetik a dokumentációs fordítások egyetlen helyi példányát, vagy tovább szerkeszthetnek olyan szkripteket, amelyek még a halott `docs-site/` útvonalra mutatnak.
- **Enyhítés:** A `docs/` könyvtárat kezelje az egyetlen kanonikus dokumentációs projektként. Bármilyen helyi `docs-site/` maradvány törlése előtt állítsa vissza a követett forrásokat, például a `docs/i18n/` könyvtárat, és frissítse a szkripteket és hookokat, hogy ne hivatkozzanak a `docs-site` útvonalra.
- **Állapot:** megerősítve

### A többnyelvű dokumentáció-előnézet megugraszthatja a memóriahasználatot ellenőrzés közben

- **Dátum:** 2026-04-01
- **Megfigyelte:** Codex
- **Kontextus:** A dokumentáció i18n-, lokálútvonal- és Pagefind-viselkedésének javítása `yarn start:docs` és Playwright segítségével
- **Ami meglepő volt:** Az alapértelmezett dokumentáció-előnézeti mód mostantól teljes többnyelvű dokumentációs buildet és Pagefind-indexelést végez a kiszolgálás előtt, és ha ez a folyamat több Playwright- vagy Chrome-munkamenet mellett marad életben, sokkal több memóriát fogyaszthat, mint egy szokásos Vite- vagy egynyelvű Docusaurus-fejlesztőciklus.
- **Hatás:** A gép memóriahiányossá válhat, a böngésző-munkamenetek összeomolhatnak, a megszakadt futások pedig elavult dokumentációs kiszolgálókat vagy fej nélküli böngészőket hagyhatnak hátra, amelyek tovább fogyasztják a memóriát.
- **Enyhítés:** Olyan dokumentációs munkához, amelyhez nem kell lokálútvonal- vagy Pagefind-ellenőrzés, a `DOCS_START_MODE=live yarn start:docs` az ajánlott. Az alapértelmezett többnyelvű előnézetet csak akkor használja, ha lefordított útvonalakat vagy a Pagefindet kell validálnia. Tartson életben egyetlen Playwright-munkamenetet, zárja be a régi böngésző-munkameneteket az újak megnyitása előtt, és állítsa le a dokumentációs kiszolgálót az ellenőrzés után, ha már nincs rá szüksége.
- **Állapot:** megerősítve

### A `translate-docs.py` félig lefordított dokumentációs lokálokat vagy hibás linkcélokat hagyhat maga után

- **Dátum:** 2026-04-06
- **Megfigyelte:** Codex
- **Kontextus:** Lokalizált dokumentációs útvonalak és tartalom javítása, miután a `yarn start:docs` angol nyelvű részletoldalakat szolgált ki, vagy nem tudta felépíteni a lokálkimenetet
- **Ami meglepő volt:** A dokumentációs fordítási folyamatnak egyszerre két repóspecifikus hibamódja volt: a `scripts/translate-docs.py` csak a `DocsHome` üzenetek szűk részhalmazát vonta ki, amikor a `tr(...)` hívások olyan formában szerepeltek, amelyet nem tudott értelmezni, a `docs/i18n/**` alatti lefordított markdown pedig gépi fordítású slugokat vagy `ZXQPLACEHOLDER` maradványokat tartalmazhatott a linkcélokban.
- **Hatás:** A lokalizált kezdőoldalak csendben visszaeshetnek az angolra, a lokalizált részletoldalak lefordítatlannak tűnhetnek, és a teljes `yarn docs:build` elbukhat a hibás lokállinkeken, pedig a forrásdokumentáció érvényes.
- **Enyhítés:** Dokumentációs fordítások módosítása vagy lokálfájlok újragenerálása után mindig futtassa a `yarn docs:build` parancsot a repó gyökeréből, keressen `ZXQPLACEHOLDER` előfordulásokat a `docs/i18n/**` alatti markdownban, és ellenőrizze, hogy a lefordított linkek továbbra is kanonikus dokumentumslugokra mutatnak, például a `/apps/5chan/` címre a lefordított URL-útvonalak helyett. Ha a `DocsHome` szövege változott, győződjön meg róla, hogy a `scripts/translate-docs.py` továbbra is kivonja az összes `docs.home.*` üzenetet.
- **Állapot:** megerősítve

### Az about-oldal JS nélküli ellenőrzéseinek a Portless-útvonalat kell használniuk, nem különálló SSR-előnézetet

- **Dátum:** 2026-04-12
- **Megfigyelte:** Codex
- **Kontextus:** Az `about/` oldal JS nélküli támogatásának ellenőrzése egy ág-munkafából
- **Ami meglepő volt:** Egy különálló SSR-előnézet egészségesnek látszhat, miközben a tényleges ág-hatókörű Portless-útvonal még mindig rossz alkalmazásvázat vagy egy régebbi folyamatot szolgál ki. Ebben a repóban a valódi helyi szerződés a `yarn start` által adott Portless-hosztnév, nem pedig egy alkalmi előnézeti kiszolgáló.
- **Hatás:** Az ügynökök tévesen állíthatják, hogy a JS nélküli támogatás működik, vagy elszalaszthatnak olyan regressziókat, amelyek csak a `*.bitsocial.localhost` címen jelentkeznek.
- **Enyhítés:** Az `about/` böngészős ellenőrzéséhez mindig indítsa el a valódi helyi kiszolgálót a `yarn start` vagy a `yarn start:about` paranccsal, és először az ág-hatókörű Portless-URL-t tesztelje. Ha egy Portless-hosztnév elavultnak látszik, vizsgálja meg és állítsa le a régi folyamatot, mielőtt újratesztel.
- **Állapot:** megerősítve

### A `chain/` láthatatlan volt a `yarn build:verify` és a `yarn doctor` számára

- **Dátum:** 2026-07-05
- **Megfigyelte:** Codex
- **Kontextus:** Csak a chain könyvtárat érintő diff ellenőrzése, miután a `chain/` workspace (a `chain.bitsocial.net` önálló Vite-alkalmazása) bekerült a monorepóba.
- **Ami meglepő volt:** A `scripts/verify-build.mjs` csak az `about/`, a `docs/` és a `stats/` útvonal-előtagot ismerte fel, így egy csak a chain könyvtárat érintő diff a „No targeted build checks matched the current diff” üzenetet írta ki, és egyáltalán nem futtatott buildet, pedig a `build:chain` már létezett a gyökérszintű `package.json` fájlban. Ettől függetlenül a `yarn doctor` be volt égetve a `react-doctor about -y` parancsra, így a `chain/src` alatti React-változások semmilyen React Doctor-lefedettséget nem kaptak.
- **Hatás:** A chain-változásokat ellenőrző ügynököknek tudniuk kellett, hogy a `yarn build:verify` helyett közvetlenül a `yarn build:chain` parancsot kell hívniuk, a `chain/src` alatti React-problémák (effektek, hookok, halott kód) pedig észrevétlenek maradtak a `yarn doctor` számára.
- **Enyhítés:** A `scripts/verify-build.mjs` mostantól tartalmaz egy `chain/` ágat az `about/` mintájára, a `doctor` és a `doctor:verbose` pedig egyetlen hívásban futtatja a `react-doctor --project about,chain -y` parancsot. A `doctor:score` továbbra is csak az `about` projektre vonatkozik, mert a `--score` csendben semmit sem ír ki, ha a `--project` kapcsolóval egynél több projektre alkalmazzák; ha chain-pontszámra van szükség, használja a `yarn react-doctor --project about,chain --verbose -y` (vagy `--json`) parancsot.
- **Állapot:** megerősítve

### A böngészős P2P biztonságos WebSockets kapcsolatokon fut; a pkc-js alapértelmezés szerint tiltja a WebRTC-t és a WebTransportot

- **Dátum:** 2026-08-02
- **Megfigyelte:** Claude
- **Kontextus:** Landing-oldali és dokumentációs szöveg írása arról, hogyan működik a Bitsocial böngészős P2P
- **Ami meglepő volt:** A `@pkcprotocol/pkc-js` alapértelmezett kapcsolatszűrőt (connection gater) szállít, amely a böngészőben elutasítja a WebRTC- és WebTransport-hívásokat: a `dist/browser/helia/dial-transport-filter.js` a `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]` értéket exportálja. A forráskódbeli megjegyzés meg is indokolja: a böngészőben ezek a transportok hosszú, gyakran sikertelen kapcsolatfelépítési utakat (STUN/ICE, certhash-rotáció) adnak hozzá, amelyek lassítják a betöltést, míg a WebSockets kapcsolat közvetlen és megbízható. A blog P2P-állapotpaneljén minden élő peer „Secure WebSocket” címkét mutat. A szűrő a `node_modules` könyvtárban él, így a repóban semmi nem utal rá.
- **Hatás:** Nagyon könnyű technikailag hihető, mégis hamis nyilvános szöveget írni: például a Bitsocial böngészős P2P működését annak tulajdonítani, hogy a WebTransport 2026 márciusában elérte a böngészős Baseline szintet. Ez az állítás eljutott a landing-oldalra, az összehasonlító táblázatba és két dokumentációs oldalra, mielőtt a fejlesztő észrevette. A nyilvános oldalakon szereplő téves architektúra-állításokat pontosan az a fejlesztői közönség ellenőrzi, amelyet az oldal megcéloz.
- **Enyhítés:** Soha ne abból következtessen a Bitsocial által használt transportokra, hogy a libp2p vagy a böngészőplatform elvben mit támogat. Nézze meg az aktuális tiltólistát a `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` fájlban, ellenőrizze, hogy nincs `connectionGater` felülbírálás az `about/src/` alatt, és olvassa el az élő transport-címkéket a blog „P2P status” paneljén, mielőtt bármilyen nyilvános állítást tesz. Az a felsőbb szintű változás, amely valóban feloldotta a böngészős publikálást, a gossipsub monoton seqno-javítása volt a `@libp2p/gossipsub` 15.0.21-es verziójában (2026 május); a pkc-js jelenleg a 16.0.4-es verziót szállítja.
- **Állapot:** megerősítve

### A lefordítatlan dokumentációs oldalakról induló relatív `./page.md` linkek minden lokalizált buildet elrontanak

- **Dátum:** 2026-08-02
- **Megfigyelte:** Claude
- **Kontextus:** Új, csak angol nyelvű oldal (`docs/browser-p2p.md`) hozzáadása, amely a `./peer-to-peer-protocol.md` és a `./apps/5chan.md` hivatkozással mutatott meglévő dokumentumokra
- **Ami meglepő volt:** A `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` alatti minden lokál tükrözi a dokumentációs fát. Az ezekből a tükrökből hiányzó új oldal az angol tartalék révén minden lokálban megjelenik, de a relatív markdownlinkjei már nem oldódnak fel: a Docusaurus `/ar/browser-p2p/peer-to-peer-protocol.md/` útvonalat állít elő, és a build a „Docusaurus found broken links!” hibával elbukik. A lényeg: a `yarn build:verify` és a `yarn docs:build:verify` csak az `en` lokált építi, és tisztán lefut; a problémát egyedül a teljes `yarn docs:build` hozza felszínre, az pedig ábécésorrendben az első lokálnál (`ar`) áll meg.
- **Hatás:** Egy dokumentációs változás átmehet minden gyors helyi ellenőrzésen, és mégis eltörheti az éles többnyelvű buildet. A hiba ráadásul a változástól függetlennek látszik, mert az üzenet olyan lokálútvonalat nevez meg, amelyhez a szerző hozzá sem nyúlt.
- **Enyhítés:** Minden olyan dokumentációs oldalon, amely nincs tükrözve a `docs/i18n/**` alá, a relatív `.md` linkek helyett gyökérrelatív linkeket használjon (`/peer-to-peer-protocol/`, `/apps/5chan/`); a Docusaurus automatikusan elé fűzi a lokált. A meglévő példa a `docs/build-your-own-client.md`. Mielőtt átad egy olyan változást, amely dokumentációs oldalt ad hozzá vagy hivatkozik rá, futtasson teljes `yarn docs:build` parancsot, ne csak `build:verify` ellenőrzést.
- **Állapot:** megerősítve

### A párhuzamos `update-translations.js` futások csendben kulcsokat veszítenek

- **Dátum:** 2026-08-02
- **Megfigyelte:** Claude
- **Kontextus:** 26 lefordított i18next kulcs alkalmazása mind a 36 lokálra a `translate` skillel
- **Ami meglepő volt:** Minden hívás olvasás-módosítás-írás ciklust végez mind a 36 lokálfájlon, így két egyszerre futó hívás felülírja egymást, és egy kulcs hibaüzenet nélkül eltűnik. A `translate` skill kifejezetten azt írja elő, hogy legfeljebb 4 alügynököt kell párhuzamosan indítani, amelyek mindegyike meghívná a szkriptet.
- **Hatás:** Csendben bukik el: kulcsok tűnnek el tetszőleges lokálokból, a diff pedig továbbra is hihetőnek látszik.
- **Enyhítés:** Soha ne engedje, hogy fordító alügynökök egyszerre írjanak lokálfájlokat; csak szótár-JSON fájlokat állítsanak elő, majd a szülőügynök alkalmazza az összes kulcsot sorosan. Az alkalmazás után programozottan ellenőrizze, hogy minden kulcs szerepel-e mind a 35 nem angol lokálban, és hogy egyik érték sem byte-azonos az angol forrással.
- **Állapot:** megerősítve
- **Frissítés (2026-08-10):** A szkript korábban a célkönyvtárat is `path.join(process.cwd(), "public", "translations")` alakban oldotta fel, így a dokumentált, repó gyökeréből futtatott parancs a „Translations directory not found” hibával leállt, és az `about/` könyvtárból kellett futtatni. Mostantól a workspace-t az aktuális könyvtárból vagy a saját helyéből oldja fel, és bárhonnan működik. A fenti párhuzamossági csapda változatlan.

### A fejlesztői annotációs vezérlők elfoghatják az automatizált kattintásokat

- **Kontextus:** Az about és a chain oldalon a jobb alsó sarokban rögzített vezérlők vannak, és fejlesztői módban ugyanott jelenik meg az Agentation eszköztár is.
- **Enyhítés:** A `scripts/pw-session.sh open` az oldal újratöltése előtt regisztrálja a `window.__NO_DEV_TOOLBAR__ = true` beállítást. Az Agentation inicializálója a `__VISUAL_TESTING__` és a `__PROFILING__` jelzőt is figyelembe veszi; a forráskód-vizsgálat ettől függetlenül elérhető marad. A közvetlen böngészőautomatizálásnak ugyanezt a jelzőt kell beállítania az alkalmazás betöltése előtt.

### A `skills add` a Codex- és Cursor-példányokat a gitignore által kizárt `.agents/` könyvtárba telepíti

- **Dátum:** 2026-08-18
- **Megfigyelte:** Tommaso + Claude
- **Kontextus:** Az `improve-threejs` skill telepítése a `millionco/react-doctor` repóból a `skills` CLI-vel (`vercel-labs/skills`).
- **Ami meglepő volt:** Az `npx skills add <repo> --skill <name> --agent codex` és a `--agent cursor` egyaránt a `.agents/skills/<name>/` könyvtárba ír, nem a `.codex/skills/` vagy a `.cursor/skills/` könyvtárba. Az `AGENTS.md` tiltja a repószintű `.agents/` könyvtárat, a `.gitignore:29` pedig kizárja, így mindkét példány csendben követetlen marad. Csak a `--agent claude-code` ír a várt `.claude/skills/` könyvtárba. Ettől függetlenül a dokumentált, vesszővel elválasztott forma (`--agent claude-code,codex,cursor`) az „Invalid agents” hibával elbukik, és semmit sem telepít, pedig önmagában mindegyik név érvényes.
- **Hatás:** A telepítés sikert jelez, miközben a három eszközlánc-példányból kettő olyan helyre kerül, amely soha nem lesz commitolva, így egy friss klónozás után a Codexből és a Cursorból csendben hiányzik a skill. A vesszős forma ráadásul olyan üres telepítést is eredményezhet, amely sikeresnek látszik.
- **Jelenlegi enyhítés:** A repó mostantól a `.agents/skills` könyvtárat követi kanonikus forrásként, és a Claude-példányokat a `yarn ai-workflow:sync` paranccsal generálja. A `.agents` korábbi tiltását és kizárási szabályát eltávolították. Ne másoljon új skilleket három független gyökérbe; skill hozzáadása után ellenőrizze a generált példányok egyezését és az alkalmazáskatalógust.
- **Állapot:** megerősítve
