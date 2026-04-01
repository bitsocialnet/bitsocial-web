---
title: React Hooks
description: React hooks könyvtár decentralizált közösségi alkalmazások létrehozásához a Bitsocial protokollon.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Ez a csomag jelenleg a korábbi elnevezési konvenciókat használja, amelyeket az upstream forkjából örökölt. A kódban, API-kban és konfigurációkban a „plebbit”-re való hivatkozásokat „bitsocial”-ra költöztetjük egy jövőbeli kiadásban. A funkcionalitást ez nem érinti.
:::

A `bitsocial-react-hooks` csomag egy ismerős React hooks API-t biztosít a Bitsocial protokollal való interakcióhoz. Kezeli a hírfolyamok, megjegyzések és szerzői profilok lekérését, a fiókok kezelését, a tartalom közzétételét és a közösségekre való feliratkozást – mindezt anélkül, hogy központi szerverre támaszkodna.

Ez a könyvtár az [5chan](/apps/5chan/) és más Bitsocial ügyfélalkalmazások által használt elsődleges felület.

:::note
A `bitsocial-react-hooks` a `plebbit/plebbit-react-hooks` ideiglenes villája, amelyet mesterséges intelligencia által támogatott fejlesztésekhez tartanak fenn. Közvetlenül a GitHubról fogyasztják, nem pedig npm-nek teszik közzé.
:::

## Telepítés

Mivel a csomag még nincs npm-en, telepítse közvetlenül a GitHubból, rögzítve egy adott véglegesítési hashhez:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Cserélje le a `<commit-hash>` értéket a megcélozni kívánt véglegesítéssel.

## API áttekintése

A horgok funkcionális kategóriákba vannak rendezve. Az alábbiakban összefoglaljuk az egyes kategóriákban leggyakrabban használt horgokat. A teljes aláírások, paraméterek és visszatérési típusok megtekintéséhez lásd a [teljes API-referencia a GitHubon](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Fiókok

Helyi felhasználói fiókok, identitások és beállítások kezelése.

- `useAccount(accountName?)` -- az aktív (vagy elnevezett) fiókobjektumot adja vissza
- `useAccounts()` -- visszaadja az összes helyileg tárolt fiókot
- `useAccountComments(options?)` -- az aktív fiók által közzétett megjegyzéseket adja vissza

### Megjegyzések

Egyéni megjegyzések és szálak lekérése és interakciója.

- `useComment(commentCid?)` -- egyetlen megjegyzést kér le a CID alapján
- `useComments(commentCids?)` -- több megjegyzést tölt le kötegben
- `useEditedComment(comment?)` -- a megjegyzés legutóbbi szerkesztett verzióját adja vissza

### közösségek

Közösségi metaadatok és beállítások lekérése.

- `useSubplebbit(subplebbitAddress?)` -- cím alapján kéri le a közösséget
- `useSubplebbits(subplebbitAddresses?)` -- több közösséget tölt le
- `useSubplebbitStats(subplebbitAddress?)` -- visszaadja az előfizetők és bejegyzések számát

### Szerzők

Keresse meg a szerzői profilokat és a metaadatokat.

- `useAuthor(authorAddress?)` -- szerzői profilt kér le
- `useAuthorComments(options?)` -- egy adott szerző megjegyzéseit adja vissza
- `useResolvedAuthorAddress(authorAddress?)` -- az ember által olvasható címet (pl. ENS) a protokollcímére oldja fel

### Feedek

Iratkozzon fel a tartalmi hírcsatornákra és lapozzon.

- `useFeed(options?)` -- egy vagy több közösség bejegyzéseinek lapszámozott hírfolyamát adja vissza
- `useBufferedFeeds(feedOptions?)` – több feedet előpufferel a gyorsabb megjelenítés érdekében
- `useAuthorFeed(authorAddress?)` -- egy adott szerző bejegyzéseinek feedjét adja vissza

### Akciók

Tartalom közzététele és írási műveletek végrehajtása.

- `usePublishComment(options?)` -- új megjegyzés vagy válasz közzététele
- `usePublishVote(options?)` -- pozitív vagy negatív szavazat leadása
- `useSubscribe(options?)` -- feliratkozás vagy leiratkozás egy közösségről

### államok és RPC

Figyelje a kapcsolat állapotát, és lépjen kapcsolatba egy távoli Bitsocial démonnal.

- `useClientsStates(options?)` -- visszaadja az IPFS/pubsub ügyfelek kapcsolati állapotát
- `usePlebbitRpcSettings()` -- az aktuális RPC démon konfigurációt adja vissza

## Fejlesztés

Ha helyileg szeretne dolgozni a hooks könyvtáron:

**Előfeltételek:** Node.js, Corepack engedélyezve, Fonal 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Teszt és build parancsokat a README lerakatban talál.

## Linkek

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licenc:** Csak GPL-2.0
