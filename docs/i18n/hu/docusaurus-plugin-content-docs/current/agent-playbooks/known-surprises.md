# Ismert meglepetések

Ez a fájl nyomon követi a lerakat-specifikus zavaró pontokat, amelyek ügynökhibákat okoztak.

## Belépési kritériumok

Csak akkor adjon hozzá bejegyzést, ha minden igaz:

- Kifejezetten erre az adattárra vonatkozik (nem általános tanács).
- Valószínűleg megismétlődik a jövőbeli ügynököknél.
- Ennek van egy konkrét mérséklése, ami követhető.

Ha bizonytalan, kérdezze meg a fejlesztőt a bejegyzés hozzáadása előtt.

## Belépési sablon

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

### A Portless módosítja a kanonikus helyi alkalmazás URL-címét

- **Dátum:** 2026-03-18
- **Megfigyelte:** Codex
- **Kontextus:** A böngésző ellenőrzése és füstáramlás
- **Ami meglepő volt:** Az alapértelmezett helyi URL nem a szokásos Vite port. A repo a `https://bitsocial.localhost`-t a Portlessen keresztül várja, így a `localhost:3000` vagy a `localhost:5173` ellenőrzése rossz alkalmazást vagy akár semmit sem találhat.
- **Hatás:** A böngészőellenőrzések sikertelenek lehetnek, vagy rossz célt érvényesíthetnek, még akkor is, ha a fejlesztői kiszolgáló egészséges.
- **Enyhítés:** Először használja a `https://bitsocial.localhost`-t. Csak akkor kerülje ki a `PORTLESS=0 corepack yarn start` segítségével, ha kifejezetten szüksége van egy közvetlen Vite portra.
- **Állapot:** megerősítve

### A Commitizen hook blokkolja a nem interaktív véglegesítéseket

- **Dátum:** 2026-03-18
- **Megfigyelte:** Codex
- **Kontextus:** Ügynökvezérelt véglegesítési munkafolyamatok
- **Ami meglepő volt:** A `git commit` elindítja a Commitizent a Huskyn keresztül, és az interaktív TTY-bemenetre vár, amely a nem interaktív ügynökhéjakat felfüggeszti.
- **Hatás:** Az ügynökök korlátlan ideig leállhatnak a szokásos kötelezettségvállalás során.
- **Enyhítés:** Használja a `git commit --no-verify -m "message"`-t az ügynök által létrehozott véglegesítésekhez. Az emberek továbbra is használhatják a `corepack yarn commit` vagy a `corepack yarn exec cz` elemet.
- **Állapot:** megerősítve

### Corepack szükséges a klasszikus fonal elkerüléséhez

- **Dátum:** 2026-03-19
- **Megfigyelte:** Codex
- **Kontextus:** A csomagkezelő áttelepítése a Yarn 4-re
- **Ami meglepő volt:** A gépen még mindig van egy globális Yarn classic telepítés a `PATH`-n, így a sima `yarn` futtatása feloldhatja a v1-et a rögzített Yarn 4 verzió helyett.
- **Hatás:** A fejlesztők véletlenül megkerülhetik a repo csomagkezelő rögzítését, és eltérő telepítési viselkedést vagy zárolási fájl kimenetet kaphatnak.
- **Enyhítés:** Használja a `corepack yarn ...` parancsot a shell-parancsokhoz, vagy futtassa először a `corepack enable`-t, így az egyszerű `yarn` a rögzített Yarn 4 verzióra bontakozik ki.
- **Állapot:** megerősítve

### A javított port nélküli alkalmazások nevei ütköznek a Bitsocial Web munkafáiban

- **Dátum:** 2026-03-30
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` elindítása az egyik Bitsocial Web munkafában, miközben egy másik munkafa már kiszolgált a Portlessen keresztül
- **Ami meglepő volt:** A `bitsocial` szó szerinti Portless alkalmazásnév használata minden munkafában maga az útvonal ütközését eredményezi, még akkor is, ha a háttérportok eltérőek, így a második folyamat meghiúsul, mert a `bitsocial.localhost` már regisztrálva van.
- **Hatás:** A párhuzamos Bitsocial Web ágak blokkolhatják egymást, még akkor is, ha a Portless lehetővé teszi számukra a biztonságos együttélést.
- **Enyhítés:** Tartsa a port nélküli indítást a `scripts/start-dev.mjs` mögött, amely mostantól a kanonikus eseten kívül egy elágazási hatókörű `*.bitsocial.localhost` útvonalat használ, és visszaáll egy leágazási hatókörű útvonalra, amikor a csupasz `bitsocial.localhost` név már foglalt.
- **Állapot:** megerősítve

### A 3001-es port kódolásához használt dokumentumok előnézete

- **Dátum:** 2026-03-30
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása más helyi repók és ügynökök mellett
- **Ami meglepő volt:** A root dev parancs a docs munkaterületet a `docusaurus start --port 3001` segítségével futtatta, így a teljes fejlesztői munkamenet meghiúsult, amikor egy másik folyamat már birtokolta a `3001`-t, pedig a fő alkalmazás már Portless-t használt.
- **Hatás:** A `yarn start` azonnal leállíthatja a webes folyamatot az indítás után, megszakítva ezzel a nem kapcsolódó helyi munkát egy docs-port ütközés miatt.
- **Enyhítés:** Tartsa a dokumentumok indítását a `yarn start:docs` mögött, amely mostantól a Portless plusz `scripts/start-docs.mjs` protokollt használja, hogy tiszteletben tartsa a beinjektált szabad portot, vagy közvetlenül futva visszatérjen a következő elérhető portra.
- **Állapot:** megerősítve

### Javítva a dokumentumok A port nélküli gazdagépnév kemény kódolású volt

- **Dátum:** 2026-04-03
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása egy másodlagos Bitsocial Web munkafán, miközben egy másik munkafa már dokumentumokat szolgált ki a Portlessen keresztül
- **Ami meglepő volt:** A `start:docs` továbbra is a szó szerinti `docs.bitsocial.localhost` gazdagépnevet regisztrálta, így a `yarn start` meghibásodhat, még akkor is, ha a about alkalmazás már tudta, hogyan kerülheti el a port nélküli útvonalak ütközését a saját gazdagépnevénél.
- **Hatás:** A párhuzamos munkafák nem tudták megbízhatóan használni a root dev parancsot, mert először a docs-folyamat lépett ki, és a `concurrently` ezután leállította a munkamenet többi részét.
- **Enyhítés:** Tartsa a dokumentumok indítását a `scripts/start-docs.mjs` mögött, amely mostantól ugyanazt az elágazási hatókörű Portless gazdagépnevet kapja, mint az about alkalmazás, és a megosztott nyilvános URL-t beilleszti a `/docs` fejlesztői proxy célba.
- **Állapot:** megerősítve

### A munkafa shellekből hiányozhat a repo rögzített Node verziója

- **Dátum:** 2026-04-03
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása Git-munkafákban, például `.claude/worktrees/*` vagy testvérmunkafa-pénztáraknál
- **Ami meglepő volt:** Egyes munkafa héjak a `node` és a `yarn node`-t Homebrew Node `25.2.1`-ra oldották fel, bár a repo rögzíti a `22.12.0` `.nvmrc`-t, így a `.nvmrc` csendesen futhat a `.nvmrc` alatt. rossz futásidő.
- **Hatás:** A fejlesztői kiszolgáló viselkedése sodródhat a fő pénztár és a munkafák között, ami megnehezítheti a hibák reprodukálását, és megsértheti a repo várható Node 22 eszközláncát.
- **Enyhítés:** Tartsa a fejlesztői indítókat a `scripts/start-dev.mjs` és a `scripts/start-docs.mjs` mögött, amelyek most újra végrehajtódnak a `.nvmrc` Node bináris alatt, ha az aktuális shell rossz verzión van. A shell-beállításnak továbbra is előnyben kell részesítenie a `nvm use`-t.
- **Állapot:** megerősítve

### A `docs-site/` maradékok elrejthetik a hiányzó dokumentumforrást a refaktor után

- **Dátum:** 2026-04-01
- **Megfigyelte:** Codex
- **Kontextus:** Egyesítés utáni monorepo tisztítás a Docusaurus projekt `docs-site/`-ról `docs/`-ra való áthelyezése után
- **Ami meglepő volt:** A régi `docs-site/` mappa a lemezen maradhat elavult, de fontos fájlokkal, például a `i18n/`-val, még azután is, hogy a követett repo átkerült a `docs/` fájlba. Emiatt a refaktor helyileg duplikáltnak tűnik, és elrejti azt a tényt, hogy a nyomon követett dokumentumok fordításai valójában nem kerültek át a `docs/` fájlba.
- **Hatás:** Az ügynökök törölhetik a régi mappát „szemétként”, és véletlenül elveszíthetik a dokumentumok fordításának egyetlen helyi példányát, vagy folytathatják a szkriptek szerkesztését, amelyek továbbra is a holt `docs-site/` elérési útra mutatnak.
- **Enyhítés:** Kezelje a `docs/`-t az egyetlen kanonikus dokumentumprojektként. A helyi `docs-site/` maradékok törlése előtt állítsa vissza a nyomon követett forrást, például a `docs/i18n/`-t, és frissítse a szkripteket és a hook-okat a `docs-site` hivatkozás leállításához.
- **Állapot:** megerősítve

### A több helyű dokumentumok előnézete megnövelheti a RAM-ot az ellenőrzés során

- **Dátum:** 2026-04-01
- **Megfigyelte:** Codex
- **Kontextus:** A docs i18n, a locale routing és a Pagefind viselkedés javítása a `yarn start:docs` plus Playwright segítségével
- **Ami meglepő volt:** Az alapértelmezett dokumentum-előnézeti módban a teljes, több helyű dokumentumokat, valamint a Pagefind indexelést szolgálják ki a kiszolgálás előtt, és a folyamat életben tartása több Playwright vagy Chrome munkamenet mellett sokkal több RAM-ot fogyaszthat, mint egy normál Vite vagy egyhelyű Docusaurus fejlesztői ciklus.
- **Hatás:** A gép memóriakorlátossá válhat, a böngésző munkamenetei összeomolhatnak, a megszakított futtatások pedig elavult dokumentumszervereket vagy fej nélküli böngészőket hagyhatnak hátra, amelyek folyamatosan fogyasztják a memóriát.
- **Enyhítés:** Olyan dokumentumokhoz, amelyek nem igényelnek területi útvonal- vagy Pagefind-ellenőrzést, részesítsék előnyben a `DOCS_START_MODE=live yarn start:docs`-t. Csak akkor használja az alapértelmezett multilocale előnézetet, ha ellenőriznie kell a lefordított útvonalakat vagy a Pagefind szolgáltatást. Maradjon meg egyetlen Playwright-munkamenet, zárja be a régi böngészőmunkameneteket, mielőtt újat nyitna meg, és állítsa le a dokumentumszervert az ellenőrzés után, ha már nincs rá szüksége.
- **Állapot:** megerősítve
