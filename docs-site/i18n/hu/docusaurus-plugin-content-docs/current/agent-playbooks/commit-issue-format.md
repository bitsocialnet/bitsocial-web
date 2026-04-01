# Kötelezettségvállalás és kiadás formátum

Használja ezt, amikor jelentős kódmódosításokat javasol vagy hajt végre.

## Javaslati formátum véglegesítése

- **Cím:** Hagyományos elkötelezettség-stílusú, rövid, hátlapba burkolt.
- A teljesítmény optimalizálásához használja a `perf`-t (nem a `fix`-t).
- **Leírás:** Nem kötelező 2-3 kötetlen mondat, amely leírja a megoldást. Tömör, technikás, pontok nélkül.

Példa:

> **A kötelezettség megnevezése:** `fix: correct date formatting in timezone conversion`
>
> Frissítve a `formatDate()` a `date-utils.ts`-ban, hogy megfelelően kezelje az időzóna-eltolásokat.

## GitHub problémajavaslat formátuma

- **Cím:** A lehető legrövidebbre, hátulsóba burkolva.
- **Leírás:** 2-3 kötetlen mondat, amely leírja a problémát (nem a megoldást), mintha még mindig megoldatlan lenne.

Példa:

> **GitHub probléma:**
>
> - **Cím:** `Date formatting displays incorrect timezone`
> - **Leírás:** A megjegyzések időbélyegei helytelen időzónát mutatnak, amikor a felhasználók különböző régiók bejegyzéseit tekintik meg. A `formatDate()` funkció nem veszi figyelembe a felhasználó helyi időzóna beállításait.
