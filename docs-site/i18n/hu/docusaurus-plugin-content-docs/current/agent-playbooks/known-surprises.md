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
- **Ami meglepő volt:** Az alapértelmezett helyi URL nem a szokásos Vite port. A repo a `http://bitsocial.localhost:1355`-t a Portless rendszeren keresztül várja, így a `localhost:3000` vagy a `localhost:5173` ellenőrzése rossz alkalmazást vagy egyáltalán semmit sem találhat.
- **Hatás:** A böngészőellenőrzések sikertelenek lehetnek, vagy rossz célt érvényesíthetnek, még akkor is, ha a fejlesztői kiszolgáló egészséges.
- **Enyhítés:** Először használja a `http://bitsocial.localhost:1355`-t. Csak akkor kerülje ki a `PORTLESS=0 corepack yarn start` segítségével, ha kifejezetten szüksége van egy közvetlen Vite portra.
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
- **Enyhítés:** Tartsa a port nélküli indítást a `scripts/start-dev.mjs` mögött, amely mostantól a kanonikus eseten kívül egy elágazási hatókörű `*.bitsocial.localhost:1355` útvonalat használ, és visszaáll egy leágazási hatókörű útvonalra, amikor a csupasz `bitsocial.localhost` név már foglalt.
- **Állapot:** megerősítve

### A 3001-es port kódolásához használt dokumentumok előnézete

- **Dátum:** 2026-03-30
- **Megfigyelte:** Codex
- **Kontextus:** A `yarn start` futtatása más helyi repókkal és ügynökökkel
- **Ami meglepő volt:** A root dev parancs a docs munkaterületet a `docusaurus start --port 3001` segítségével futtatta, így a teljes fejlesztői munkamenet meghiúsult, amikor egy másik folyamat már birtokolta a `3001`-t, pedig a fő alkalmazás már Portless-t használt.
- **Hatás:** A `yarn start` azonnal leállíthatja a webes folyamatot az indítás után, megszakítva ezzel a nem kapcsolódó helyi munkát egy docs-port ütközés miatt.
- **Enyhítés:** Tartsa a dokumentumok indítását a `yarn start:docs` mögött, amely mostantól a Portless plusz `scripts/start-docs.mjs` protokollt használja, hogy tiszteletben tartsa a beinjektált szabad portot, vagy közvetlenül futva visszatérjen a következő elérhető portra.
- **Állapot:** megerősítve
