---
title: 5chan
description: Szerver nélküli, decentralizált képtábla, amely a Bitsocial protokollra épül, ahol bárki létrehozhat és birtokolhat táblákat.
sidebar_position: 1
---

# 5chan

Az 5chan egy szerver nélküli, adminisztrátor nélküli és teljesen decentralizált képtábla, amely a Bitsocial protokollon fut. Követi az ismert imageboard könyvtárstruktúrát, miközben bevezeti a decentralizált tulajdonjogot – bárki létrehozhat egy táblát, és több tábla is versenyezhet ugyanarra a címtárhelyre egy szavazási mechanizmuson keresztül.

## Letöltések

| Platform | Link                                         |
| -------- | -------------------------------------------- |
| Web      | [5chan.app](https://5chan.app)               |
| Asztali  | Elérhető Mac, Windows és Linux rendszerekhez |
| Mobil    | Elérhető Android                             |

## Hogyan működnek a táblák

Az 5chan a tartalmat táblákba rendezi klasszikus könyvtárelrendezéssel (pl. `/b/`, `/g/`). A hagyományos imageboardokkal ellentétben, ahol minden táblát központi adminisztrátor vezérel, az 5chan lehetővé teszi bármely felhasználó számára, hogy saját táblát hozzon létre és birtokoljon. Ha több tábla célozza meg ugyanazt a könyvtárhelyet, szavazással versenyeznek az adott pozícióért.

### Tábla létrehozása

Új tábla létrehozásához a `bitsocial-cli` programot peer-to-peer csomópontként kell futtatnia. Ez biztosítja, hogy a tábla decentralizált módon kerül elhelyezésre anélkül, hogy bármilyen központi szerverre támaszkodna.

### Címtár-hozzárendelések

A címtárhely-hozzárendelések (melyik kártya melyik elérési útvonalon jelenik meg) jelenleg a GitHub lekérései által kezelve a `5chan-directories.json` fájlba. Ez egy ideiglenes folyamat – a jövőbeli kiadások támogatni fogják az alkalmazáson belüli fórumon belüli létrehozást és a pub-alapú szavazást a címtár-hozzárendelések automatikus kezeléséhez.

## Belsők

A motorháztető alatt az 5chan a megosztott Bitsocial protokoll kliens réteget használja a hálózati interakciókhoz. Az 5chan.app webalkalmazása egy Helia-csomópontot is futtathat a böngészőben, ha a P2P engedélyezve van a Speciális beállításokból, így az olvasók központi IPFS-átjáró nélkül tölthetnek be társaikról. Lásd a böngésző P2P szakaszát a peer-to-peer protokoll megjegyzéseiben.

## Linkek

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenc**: csak GPL-2.0
