---
title: Seedit
description: Szerver nélküli, decentralizált Reddit-stílusú fórum, amely a Bitsocial protokollra épül, ahol bárki létrehozhat és birtokolhat közösségeket.
sidebar_position: 2
---

# Seedit

A Seedit a régi stílusú Reddit szerver nélküli, adminisztrátor nélküli és teljesen decentralizált alternatívája, amely a Bitsocial protokollra épül. Teljes tulajdonjogot biztosít a felhasználóknak közösségeik felett – bárki létrehozhat egyet, és több közösség is versenghet ugyanazért a rövid útvonalért, például a `/s/funny` útvonalért.

## Letöltések

| Platform  | Link                                                              |
| --------- | ----------------------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                                  |
| Web (ENS) | `seedit.eth` a Brave böngészőn vagy az IPFS Companionon keresztül |
| Asztali   | Elérhető Mac, Windows és Linux rendszerekhez                      |
| Mobil     | Elérhető Android                                                  |

## Hogyan működnek a közösségek

A Seedit a subredditekhez hasonló közösségekbe rendezi a tartalmat. Minden közösség a létrehozója tulajdonában van, és központosított adminisztráció nélkül működik. Több közösség is versenghet ugyanazért a [címtár](/directories/)-útvonalért, például a `/s/funny` útvonalért, amely az aktuális győztest nyitja meg. A feliratkozások és a bejegyzéslinkek mindig a pontosan meghatározott közösségre mutatnak.

### Közösség létrehozása

Kétféleképpen hozhat létre új közösséget:

1. **Asztali kliens** — Használja az asztali alkalmazás beépített grafikus felhasználói felületét a közösség beállításához és konfigurálásához.
2. **bitsocial-cli** — Futtassa a CLI eszközt a közösségek parancssorból történő létrehozásához és kezeléséhez.

### Alapértelmezett közösséglista

Az új fiókok pontosan megadott közösségek alapértelmezett listájára iratkoznak fel, amelyet a [bitsocialnet/lists](https://github.com/bitsocialnet/lists) tároló `seedit-default-subscriptions.json` fájlja határoz meg. A címtárak jelöltjei ugyanebben a tárolóban, `seedit-directories/seedit-<code>-directory.json` fájlokban szerepelnek. Ha bármelyik listához hozzá szeretné adni a közösségét, küldjön be egy pull requestet a közösség adataival.

## Linkek

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licenc**: csak GPL-2.0
