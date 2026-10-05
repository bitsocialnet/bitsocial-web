---
title: A Bitsocial és a blokklánc-alapú közösségi hálózatok
description: Hogyan helyezi a Lens, a DeSo és a Steem a közösségi adatokat vagy szabályokat blokkláncra, és miért nem használ ilyet a Bitsocial.
---

# A Bitsocial és a blokklánc-alapú közösségi hálózatok

A Lens, a DeSo és a Steem egyaránt blokkláncra helyezi a közösségi tevékenységet. A fiókok, a
követések, a bejegyzések vagy a rájuk vonatkozó szabályok tranzakciókká válnak, amelyeket
validátorok rendeznek sorba és tárolnak. A Bitsocial nem használ blokkláncot: a közösségi médiának
nincs szüksége minden bejegyzés globális sorrendjére, ezért a Bitsocial kihagyja a konszenzust, a
gázt és a letétbe helyezést. Ennek indoklásáért lásd a
[Peer-to-peer protokoll](/peer-to-peer-protocol/) oldalt.

## Ami közös bennük

- **Minden írásért valaki fizet.** A Lens gázdíjat számít fel, amelyet az alkalmazások
  átvállalhatnak; a DeSo minden műveletért díjat kér; a Steem a letétbe helyezett tokenek alapján
  adagolja a műveleteket.
- **A lánc mindenkire ugyanazt a spamszabályzatot alkalmazza.** A díjak, a letét és a fiókköltségek
  az egész hálózatra érvényesek, ahelyett hogy minden közösség maga választaná meg őket.
- **A láncon tárolt rekordok véglegesek.** Az alkalmazások elrejthetnek tartalmat, de nem
  távolíthatják el a láncról.
- **A böngészők API-kliensek.** A webalkalmazások tranzakciókat írnak alá, és egy más által
  üzemeltetett csomóponton, indexelőn vagy API-n keresztül olvasnak.

## Lens

A [Lens](https://lens.xyz/) a Lens Chainen fut, amely a ZKsync ZK Stackjével épített Ethereum 2.
rétegbeli hálózat, és az adatok elérhetőségét az Avail biztosítja. A Mask Network
[2026 januárja óta gondozza a Lenst](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **A láncon:** a fiókok okosszerződések, a felhasználónevek névtereken belüli NFT-k, és a gráfok,
  csoportok, hírfolyamok és szabályaik szintén szerződések.
- **A láncon kívül:** a bejegyzés szövege és médiája egy URI-n elérhető JSON-fájlban található,
  általában a Grove-on, a Lens IPFS elé épített tárolószolgáltatásán. A reakciókat és a
  könyvjelzőket a Lens API tárolja, és az alkalmazások ezen az API-n keresztül olvasnak.
- **Spam és kapuk:** a tranzakciókhoz GHO-ban fizetett gáz kell, amelyet az alkalmazások
  sebességkorlátok mellett átvállalhatnak. A hírfolyamok és csoportok szabályai tokenbirtoklást vagy
  fizetést írhatnak elő.
- **A lánc működése:** az [L2BEAT](https://l2beat.com/scaling/projects/lens) a Lens Chaint Stage 0
  besorolású validiumnak minősíti, amelynek központosított üzemeltetője megtagadhatja tranzakciók
  felvételét.

## DeSo

A [DeSo](https://docs.deso.org/) közösségi alkalmazásokhoz készült 1. rétegbeli blokklánc. 2024
júliusában tért át a proof of workről a proof of stake-re.

- **A láncon:** a profilok, bejegyzések, kedvelések, követések és közvetlen üzenetek mind
  tranzakciók, amelyeket minden teljes csomópont tárol. A képeket és videókat a láncon kívül
  hosztolják; a referencia-csomópont a Google Cloud Storage-et és a Cloudflare Streamet használja.
- **Spam:** minden művelet DESO-ban fizetett díjjal jár. Az új felhasználók általában telefonos
  ellenőrzés után kapnak kezdő DESO-t egy csomóponttól.
- **Moderálás:** minden csomópont maga dönti el, mit jelenít meg, feketelistázással vagy
  szürkelistázással, de
  [a tartalom a láncon marad](https://docs.deso.org/deso-blockchain/content-moderation).
- **Közösségek:** a dokumentáció nem ír le közösségi vagy fórumprimitívet; a „közösség” egy
  alkalmazás által összeállított hírfolyam.
- **Csomópont üzemeltetése:** a
  [validátori útmutató](https://docs.deso.org/deso-validators/run-a-validator) szerint a
  validátoroknak legalább 32 GB RAM-ra és 200 GB lemezterületre van szükségük.

## Steem

A [Steem](https://steem.com/) olyan közösségi blokklánc, amely tokenekben fizeti a szerzőket és a
kurátorokat; fő blogalkalmazása a [Steemit](https://steemit.com/). A Hive 2020-ban vált ki a
Steemből; a [Hive fehér könyve](https://hive.io/whitepaper.pdf) szerint az elágazás a Steemit Inc.
Justin Sunnak történt eladását követte.

- **A láncon:** a szöveges bejegyzések, a hozzászólások, a szavazatok és a szerkesztési előzményeik,
  amelyeket 21 megválasztott tanú (witness) rendez sorba, hárommásodpercenként egy blokkot
  előállítva. A képeket a láncon kívül hosztolják.
- **Spam:** a műveletek Resource Creditet használnak fel, amely a letétbe helyezett STEEM
  mennyiségével nő. A fióklétrehozás STEEM-be kerül; a Steemit kifizeti azoknak a felhasználóknak,
  akik igazolják e-mail-címüket és telefonszámukat.
- **Közösségek:** ezek
  [egy indexelő által értelmezett egyéni műveletek](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  a konszenzuson kívül. A moderátorok némíthatják a bejegyzéseket, ami elrejti őket az
  alkalmazásokban, de a láncon hagyja őket.
- **Jutalmak:** a jutalmakat az infláció finanszírozza, a felosztásukról pedig letéttel súlyozott
  szavazatok döntenek, így a nagy tokenbirtokosok alakítják, mi kap figyelmet.

## Összehasonlítás

| Kérdés               | Lens                                                                                   | DeSo                                                                 | Steem                                                                        | Bitsocial                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Lánc                 | Ethereum 2. réteg (ZK Stack validium)                                                  | Saját 1. réteg, proof of stake                                       | Saját lánc, delegált proof of stake                                          | Nincs                                                                                                    |
| Bejegyzések tartalma | Láncon kívüli JSON, általában a Grove-on                                               | Szöveg a láncon; média a láncon kívül                                | Szöveg a láncon; képek a láncon kívül                                        | A közösség tulajdonosának csomópontján és a közösséget olvasó és seedelő társaknál                       |
| Identitás            | Okosszerződéses fiók; NFT-felhasználónevek                                             | Kulcspár láncon tárolt profillal                                     | Elnevezett láncfiók többszintű kulcsokkal                                    | Ed25519 kulcspárok a felhasználóknak és a közösségeknek                                                  |
| Közösségek           | Szabályokkal ellátott szerződésként működő csoportok és hírfolyamok                    | Nincs közösségi primitív                                             | Indexelő által értelmezett közösségek a konszenzuson kívül                   | Elsőrangú objektumok, amelyek csomópontja elfogadja vagy elutasítja a bejegyzéseket                      |
| Spamvédelem          | Gáz (gyakran átvállalva), token- vagy fizetési szabályok                               | Díj minden műveletért; kezdő összeg telefonos ellenőrzés után        | Letétből származó Resource Credit; fizetős fióklétrehozás                    | Minden közösség saját kihívása egy bejegyzés elfogadása előtt                                            |
| Moderálás            | Csoportadminisztrátorok, láncon tárolt szabályok, API-szintű elrejtés                  | Minden csomópont szűri, mit jelenít meg                              | Közösségi némítások, letéttel súlyozott negatív szavazatok, alkalmazásszűrők | A közösségek tulajdonosai moderálják a közösségüket; az alkalmazások döntik el, mit jelenítenek meg      |
| Üzemeltetés          | A lánc üzemeltetője, valamint a Lens API és a Grove                                    | Legalább 32 GB RAM-mal rendelkező validátorok                        | Megválasztott tanúk, valamint API- és indexelőcsomópontok                    | Egy közösségi csomópont fogyasztói hardveren, valamint segítő seederek                                   |
| Fő kompromisszum     | Programozható láncszabályok, de a tartalom és az olvasás a Lens szolgáltatásaitól függ | Nyílt adatkészlet, de minden művelet díjba kerül, és örökre megmarad | Beépített jutalmak, de a letét alakítja a láthatóságot és az irányítást      | Nincsenek díjak és letét, de nincs globális sorrend, és a régi tartalom nem marad meg garantáltan örökre |
