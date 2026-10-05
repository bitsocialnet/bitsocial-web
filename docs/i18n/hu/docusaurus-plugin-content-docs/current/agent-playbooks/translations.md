# Fordítások

Az about oldal i18next JSON-fájlokat használ az `about/public/translations/{lang}/default.json` útvonalon. A Docusaurus forrásfordításai ettől külön, a `docs/i18n/` könyvtárban találhatók.

## Az about oldal kulcsai

Használja a `.agents/skills/translate/SKILL.md` leírást. Az aktuális lokálokat a lemezről derítse ki, és őrizze meg a helyőrzőket, a jelölést, a szakkifejezéseket és a márkaneveket. Nagyobb kéréseknél a gyermekügynökök független szótárfájlokat állíthatnak elő, de minden lokálírást egyetlen szülőügynök alkalmaz sorosan; a frissítő szkriptnek nincs írási zára.

Használjon egyedi, a feladathoz tartozó szótárfájl-útvonalat. Előnézet: `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, majd alkalmazza ugyanazokkal az argumentumokkal és a `--write` kapcsolóval. Írás után ellenőrizze a lefedettséget/értékeket, és csak az ehhez a feladathoz tartozó ideiglenes szótárfájlokat törölje.

Kért eltávolításokhoz használja a `--delete` kapcsolót. Egy engedélyezett `--audit --write` előtt vizsgálja meg a `--audit --dry` megállapításait; a dinamikus fordítási kulcsok kézi forrásellenőrzést igényelnek. Az angol szöveget csak szakkifejezés, márkanév vagy helyőrző esetén másolja át minden lokálba.

## Docusaurus-oldalak

A `scripts/translate-docs.py` az összes oldalt/lokált egyszerre író tömeges eszköz, fájlonkénti szűrő nélkül; szűk fordítási szerkesztéshez ne használja. A `scripts/check-docs-translations.py` a csak olvasó ellenőrző, és támogatja a `--locales` és a `--paths` kapcsolót.

A kódblokkokat, a linkeket, az inline kódot, a szerződéscímeket, a címsorokat, a táblázatokat és a figyelmeztető blokkokat tartsa összhangban az angol forrással. Javítsa az ellenőrző által jelzett hibákat; márkanevek esetén `frontmatter-untranslated` figyelmeztetések várhatók. Kövesse a `docs/AGENTS.md` útmutatását, és a dokumentáció témájának vagy i18n-viselkedésének módosításakor a gyökérből buildeljen, hogy a statikus kimenet és a Pagefind összhangban maradjon.

## Opcionális szemantikai átnézés

Kiválasztott i18next kulcsokhoz használja a `scripts/jev/translation-README.md` leírást. Dokumentációs oldalakhoz először futtassa a `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` parancsot. Ez kifejezett lokál- és oldalválasztást igényel, lefuttatja a szerkezeti ellenőrzőt, és a szemantikai átnézést ellenőrizetlenként jelenti, amíg az élő inferencia nincs bekapcsolva. A `--live` kapcsolót csak a feladathoz tartozó szolgáltatói engedéllyel és költségkerettel adja hozzá; a közös privát gépkonfiguráció biztosítja a hitelesítő adatokat és egy rögzített modellt. Ezt a beállítást környezeti változók és a `--model` kapcsoló felülbírálhatják. A parancs soha nem szerkeszti a fordításokat.

Az oldaladapter megőrzi a teljes oldal kontextusát, és oldalanként 24 KB-ra, futásonként pedig 30 párra korlátoz. Nagyobb oldalakhoz készítsen kifejezetten egymáshoz igazított forrás–fordítás bekezdéspárokat a `translations.mjs --pairs` számára; a bekezdéseket ne párosítsa automatikusan index alapján. A szemantikai eredmények tanácsadó jellegűek: vizsgálja meg a jelentett problémákat és bizonytalanságokat, és tartsa meg a determinisztikus kód-, link- és címellenőrzéseket.
