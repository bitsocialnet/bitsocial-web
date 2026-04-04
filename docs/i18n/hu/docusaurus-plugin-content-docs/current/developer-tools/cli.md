---
title: CLI
description: Parancssori interfész Bitsocial csomópont futtatásához, közösségek létrehozásához és protokollműveletek kezeléséhez.
sidebar_position: 2
---

# CLI

:::warning Legacy névadás
Ez a csomag jelenleg a korábbi függőségéből örökölt elnevezési konvenciókat használ. A parancsokban, a kimenetben és a konfigurációban a „plebbit”-re való hivatkozások „bitsocial”-ra költöztetnek egy jövőbeli kiadásban. A funkcionalitást ez nem érinti.
:::

A `bitsocial-cli` egy parancssori eszköz a Bitsocial protokoll hátterével való interakcióhoz. Lehetővé teszi helyi P2P démon futtatását, közösségek létrehozását és konfigurálását, valamint tartalom közzétételét – mindezt a terminálról.

A `plebbit-js` tetejére épül, és a [5chan](/apps/5chan/) és a [Seedit](/apps/seedit/) használja a közösség létrehozására és a csomópontok kezelésére.

## Telepítés

Előre beépített bináris fájlok állnak rendelkezésre Windows, macOS és Linux rendszereken. Töltse le a platform legújabb kiadását a GitHubról:

**[Letöltés a GitHub-kiadásokból](https://github.com/bitsocialnet/bitsocial-cli/releases)**

A letöltés után tegye a bináris fájlt végrehajthatóvá (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## A Daemon futtatása

A CLI legáltalánosabb használata egy Bitsocial csomópont futtatása. A démon elindítja a P2P hálózati réteget, és felfed egy helyi API-t, amelyhez az ügyfelek csatlakozhatnak.

```bash
bitsocial-cli daemon
```

Az első indításkor a démon hivatkozásokat ad ki a **WebUI**-ra, amely egy böngésző alapú grafikus felület a csomópont, a közösségek és a beállítások kezelésére. Ez akkor hasznos, ha a GUI-t részesíti előnyben a terminálparancsokkal szemben.

## Kulcsparancsok

| Parancs             | Leírás                                                    |
| ------------------- | --------------------------------------------------------- |
| `daemon`            | Indítsa el a Bitsocial P2P csomópontot                    |
| `create subplebbit` | Hozz létre egy új közösséget                              |
| `subplebbit edit`   | Közösségi beállítások frissítése (cím, leírás, szabályok) |
| `subplebbit list`   | Listázza ki az ezen a csomóponton tárolt közösségeket     |
| `subplebbit start`  | Kezdj el egy adott közösséget szolgálni                   |
| `subplebbit stop`   | Hagyja abba egy adott közösség kiszolgálását              |

Futtassa bármelyik parancsot `--help` az elérhető opciók és jelzők megtekintéséhez:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Tipikus munkafolyamat

Egy közös beállítási folyamat új közösség fogadásához:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

A közösség már él a Bitsocial hálózaton, és bármely kompatibilis ügyfélről elérhető.

## Linkek

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
