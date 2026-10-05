# Hosszan futó ügynöki munka

Használjon tartós feladatállapotot, ha a munkát később folytatni vagy át kell adni, vagy ha egyetlen futás olyan hosszú, hogy a kontextustömörítés miatt elveszhet a hátralévő munka fonala. A kis feladatokhoz nem kell tábla vagy előrehaladási fájl. Közös munkánál tartson egy tömör `feature-list.json` és `progress.md` fájlt egy feladatspecifikus `docs/agent-runs/<slug>/` könyvtárban, ahol hasznos, a meglévő sablonok felhasználásával.

Rögzítse a kért eredményt, az aktuális ágat/munkafát, a fájlok tulajdonjogát, az elkészült változtatásokat, az ellenőrzéseket az eredményeikkel, a saját folyamatokat/munkameneteket és a következő megoldatlan lépést. Ne tároljon hitelesítő adatokat vagy tetszőleges forráskódkiírásokat. Egy funkciót csak akkor jelöljön késznek, ha az elfogadási feltételeit ellenőrizte.

Folytatáskor szerkesztés előtt vizsgálja meg a Git-állapotot, a legutóbbi előrehaladást és a releváns forráskódot. Használja újra a kompatibilis saját erőforrásokat; fejlesztői kiszolgálót csak akkor indítson, ha a következő ellenőrzéshez szükség van rá. Az ellenőrzéseket a hatásuk alapján válassza ki a [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md) segítségével, ahelyett hogy változatlanul megismételne egy teljes futást.

A kapcsolódó delegált munka legyen jól körülhatárolt és átfedésmentes. A nehéz ellenőrzéseket és a böngésző-munkameneteket egyetlen ügynök birtokolja. Frissítse a tartós állapotot, ha egy elkészült szelet, egy blokkoló vagy egy átadás megváltoztatja azt, amit a következő közreműködőnek tudnia kell; ne naplózzon gépiesen minden parancsot.
