---
title: Mintpass
description: NFT-alapú hitelesítési rendszer, amely segít a Bitsocial közösségeknek ellenőrizni a felhasználókat és csökkenteni a sybil támadásokat.
sidebar_position: 2
---

# Mintpass

A Mintpass egy NFT-alapú hitelesítési rendszer a Bitsocial közösségek számára. A felhasználók egy nem átruházható ellenőrző NFT-t készítenek egy kihívás (például SMS OTP) teljesítése után, és a közösségek ellenőrizhetik az NFT tulajdonjogát, hogy megvédjék magukat az olyan szibil támadásoktól, mint a hamis szavazatok, a kitiltás és a spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Engedély**: MIT

## Hogyan működik

Az ellenőrzési folyamat négy lépésből áll:

1. **Kérés** – A felhasználó felkeresi a `mintpass.org/request` webhelyet a folyamat elindításához.
2. **Kihívás** – A felhasználó SMS-ben egyszeri jelszóellenőrzést hajt végre.
3. **Mint** -- Sikeres ellenőrzést követően egy nem átruházható NFT kerül a felhasználó pénztárcájába.
4. **Ellenőrzés** -- A közösségek lekérdezik az NFT tulajdonjogát, hogy megerősítsék, hogy a felhasználó igazolva van.

Mivel az NFT nem ruházható át, az ellenőrzést végrehajtó pénztárcához kötődik, így megakadályozza, hogy a felhasználók kereskedjenek vagy eladják ellenőrzött állapotukat.

## Projekt felépítése

Az adattár három fő területre tagolódik:

| Címtár       | Cél                                                     |
| ------------ | ------------------------------------------------------- |
| `contracts/` | Solidity intelligens szerződések az NFT ellenőrzéséhez. |
| `challenge/` | Integrációs réteg a Bitsocial kihívásrendszerhez.       |
| `web/`       | Next.js és React frontend a pénzverési folyamathoz.     |

## Adatvédelem és adatkezelés

A Mintpass minimális adatforgalmat alkalmaz:

- **Működési adatok** (OTP kódok, munkamenet tokenek) a Redisben tárolódnak rövid TTL-ekkel, és automatikusan lejárnak.
- A **Mint Association** (az ellenőrzött személyazonosság és a pénztárca közötti kapcsolat) az egyetlen állandó rekord.

Az ellenőrzési ablak bezárása után a telefonszámok vagy személyes adatok nem maradnak meg.

## Választható biztonsági rétegek

A közösségi üzemeltetők fenyegetési modelljüktől függően további védelmet is engedélyezhetnek:

- **IP-hírnév-ellenőrzés** – A bejövő kérések értékelése az ismert visszaélési adatbázisok alapján.
- **Telefonos kockázatértékelés** – Jelölje meg az eldobható vagy VoIP-számokat a kihívás kiadása előtt.
- **Geoblokkolás** – Az ellenőrzés korlátozása meghatározott régiókra.
- **IP-nkénti lehűlés** -- Ismétlődő ellenőrzési kísérletek sebességkorlátozása ugyanarról a címről.

## Technology Stack

| Réteg       | Technológia                   |
| ----------- | ----------------------------- |
| Szerződések | Solidity, Hardhat and Foundry |
| Frontend    | Next.js + React               |
| Hálózat     | Alap (Ethereum L2)            |

A bázison történő telepítés alacsonyan tartja a gázköltségeket, miközben örökli az Ethereum biztonsági garanciáit.

## Útiterv

A tervezett fejlesztések a következők:

- **Pay-to-mint opció** – Lehetővé teszi a közösségek számára, hogy csekély díjat kérjenek a pénzverésért, gazdasági szibilitási akadály hozzáadásával.
- **További ellenőrző jelek** – Az SMS-eken túl más azonosító jelekre is kiterjeszthető.
- **Kibővített adminisztrátori eszközök** – Gazdagabb irányítópultok és vezérlők a közösségi üzemeltetők számára.
