---
title: Bitsocial Chain
description: A főterv 3. fázisa, amely a Bitsocial alkalmazásokhoz javasolt Ethereum L2 appchain gazdasági réteget mutatja be.
---

# Bitsocial Chain

A Bitsocial Chain a Bitsocial alkalmazásokhoz javasolt Ethereum L2 appchain gazdasági réteg. A lánccal
foglalkozó jelenlegi oldal a [chain.bitsocial.net](https://chain.bitsocial.net).

A peer-to-peer közösségi réteg lehetővé teszi, hogy a közösségek, az identitások és a tartalmak egy
központi platformadatbázison kívül mozogjanak. A Bitsocial Chain feladata, hogy ehhez hozzáadja azokat a
közös névadási, bevételszerzési és fizetési primitíveket, amelyekkel ezeket az alkalmazásokat nehezebb
pénzügyileg kiéheztetni.

## Mit hivatott működtetni

- decentralizált Bitsocial domainek, például a `.bso`
- díjazás és borravaló
- tartós bevételszerzési infrastruktúra
- alkalmazások közötti közös likviditás
- olyan pénzügyi struktúrák, amelyeket a bankok vagy a platformok nehezebben tudnak elfojtani
- hálózati hatások, amelyek nem attól függenek, hogy egyetlen vállalat birtokolja a teljes stacket

A cél nem az, hogy a tokenmechanika kerüljön előtérbe. A cél az, hogy a hasznos közösségi alkalmazások
tartósabbak és könnyebben finanszírozhatók legyenek, és kevésbé függjenek központosított fizetési vagy
névszolgáltatóktól.

## Jelenlegi proof of concept

Az első Bitsocial Chain proof of concept a natív `.bso` nevekre összpontosít. Azt bizonyítja, hogy egy
névregiszter levezethető az Ethereum L1 előzményeiből anélkül, hogy a közösségi tartalom a láncra kerülne:

- a felhasználók egyszerű Ethereum L1 tranzakciókban küldik be a regisztrációs, frissítési, átruházási
  és visszavonási szándékokat
- a levezető csomópontot bárki futtathatja, és ugyanazt a `.bso` regiszterállapotot állíthatja vissza
- egy feloldó a `.bso` nevet ahhoz a Bitsocial nyilvános kulcshoz rendeli, amelyet a kliensek a
  peer-to-peer protokollon már használnak
- a bejegyzések, a szavazatok, a moderáció, a hírfolyamok és a közösségi tartalom láncon kívül,
  peer-to-peer marad

Ez a proof of concept nem éles, Stage 2 szintű indulás. Egyelőre nincs hozzá bizonyítási rendszer,
kihívási játék, auditált kód, élő telepítés, végleges árazás vagy végleges irányítási modell. Hosszú távú
alapállása szerint alapértelmezés szerint átlátható és felépítésénél fogva adatvédelem-kompatibilis: az
alaplánc nyilvános, ugyanakkor a későbbi borravaló, fizetés, díjazás és likviditás ne kényszerítsen ki
állandó összekapcsolást a közösségi identitás és a pénztárcatörténet között.

## Miért fontos

A közösségek és az identitások decentralizálása szükséges, de a teljes közösségi média
decentralizálásához önmagában nem elég.

Ha a közösségi alkalmazások továbbra is néhány központosított gazdasági infrastruktúrára támaszkodnak,
akkor könnyen nyomás alá helyezhetők, leválaszthatók a platformról vagy pénzügyileg kiéheztethetők. A
Bitsocial Chain a javasolt válasz a függőség e második rétegére.

## Kapcsolat az alkalmazásokkal

A Bitsocial Chain a Bitsocial alkalmazások alatt helyezkedik el, nem pedig helyettesíti őket.

A nyilvánosság felé mutatkozó eredmény a következő:

- a közösségek peer-to-peer maradnak
- az alkalmazások megőrzik egyedi jellegüket
- a felhasználók gyakorlatias névadási és bevételszerzési funkciókat kapnak
- az alkotók és a közösségek több kliensen keresztül is kaphatnak támogatást
- az érték mozoghat az ökoszisztémán belül anélkül, hogy újra létrejönne egy központi platformtulajdonos

## Miért a Twitter/X-alternatíva után következik

A jelenlegi főterv a Bitsocial Chaint a Twitter/X-alternatíva után helyezi el, mert ennek az alkalmazásnak nincs szüksége a láncra. A profilok profilcsomópontként futnak nem letétkezelő RPC-n keresztül, a `.bso` nevek pedig indulhatnak egy átmeneti nyilvántartásban az Ethereum főhálózatán ([BSIP-13](https://bsips.bitsocial.net/bsip-13)), és később átkerülhetnek a láncra.

A Bitsocial Chain nem áldozhatja fel a decentralizációt egy korábbi indulásért. Nem adhat hozzá semmilyen bizalmi feltételezést magán az Ethereumon túl: nincsenek frissítési kulcsok, nincs biztonsági tanács, és nincs olyan üzemeltető, amely cenzúrázhatná vagy leállíthatná. Az ehhez vezető legígéretesebb terv, egy natív rollup, egy olyan Ethereum-frissítéstől függ, amelyet még nem ütemeztek. Amíg a lánc nem tudja teljesíteni ezt a mércét, a Twitter/X-alternatíva növeli azt a felhasználói bázist, amelyet a lánc szolgálni fog.

## Tervezési elvek

Mivel a Bitsocial Chain még javasolt infrastruktúra, nem pedig elindított termék, a tervnek fegyelmezettnek
kell maradnia:

- Először az alkalmazások és a közösségek. A hálózati rétegnek erősebbé kell tennie a valódi közösségi
  termékeket.
- Először a gyakorlatias funkciók. A neveket, a díjazást, a borravalót és a fizetést könnyebb
  elmagyarázni, mint az elvont pénzügyi architektúrát.
- Valódi hozzájárulás a hype helyett. A gazdasági primitíveknek a részvételt, az építkezést és a
  közösségi támogatást kell jutalmazniuk.
- A kurálás megengedett. Az alkalmazások alakíthatják a rangsorokat, az alapértelmezéseket és a
  felfedezést úgy, hogy a tartós közösségeket részesítsék előnyben.
- A pontos mechanizmusok továbbra is nyitottak. Ez az oldal a Bitsocial Chain szerepét magyarázza el, nem
  pedig egy rögzített ígéretet a végleges gazdasági modellről.
