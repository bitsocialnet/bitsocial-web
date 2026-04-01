---
title: CLI
description: Rozhraní příkazového řádku pro spouštění uzlu Bitsocial, vytváření komunit a správu operací protokolu.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Tento balíček aktuálně používá starší konvence pojmenování zděděné z jeho upstream závislosti. Odkazy na „plebbit“ v příkazech, výstupu a konfiguraci budou v budoucí verzi migrovány na „bitsocial“. Funkčnost není ovlivněna.
:::

`bitsocial-cli` je nástroj příkazového řádku pro interakci s backendem protokolu Bitsocial. Umožňuje vám spouštět místního P2P démona, vytvářet a konfigurovat komunity a publikovat obsah – to vše z terminálu.

Je postaven na `plebbit-js` a je používán [5kanál](/apps/5chan/) a [Seedit](/apps/seedit/) pro vytváření komunit a správu uzlů.

## Instalace

Předpřipravené binární soubory jsou k dispozici pro Windows, macOS a Linux. Stáhněte si nejnovější verzi pro vaši platformu z GitHubu:

**[Stáhnout z GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Po stažení vytvořte binární spustitelný soubor (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Spuštění démona

Nejběžnějším použitím CLI je provozování uzlu Bitsocial. Démon spustí vrstvu P2P sítě a zpřístupní místní API, ke kterému se mohou klienti připojit.

```bash
bitsocial-cli daemon
```

Při prvním spuštění démon vytvoří odkazy na **WebUI**, grafické rozhraní založené na prohlížeči pro správu vašeho uzlu, komunit a nastavení. To je užitečné, pokud dáváte přednost GUI před terminálovými příkazy.

## Klíčové příkazy

| Příkaz              | Popis                                                    |
| ------------------- | -------------------------------------------------------- |
| `daemon`            | Spusťte Bitsocial P2P uzel                               |
| `create subplebbit` | Vytvořit novou komunitu                                  |
| `subplebbit edit`   | Aktualizovat nastavení komunity (název, popis, pravidla) |
| `subplebbit list`   | Seznam komunit hostovaných na tomto uzlu                 |
| `subplebbit start`  | Začněte sloužit konkrétní komunitě                       |
| `subplebbit stop`   | Přestat sloužit konkrétní komunitě                       |

Spuštěním libovolného příkazu pomocí `--help` zobrazíte dostupné možnosti a příznaky:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typický pracovní postup

Běžný postup nastavení pro hostování nové komunity:

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

Komunita je nyní živá na síti Bitsocial a je přístupná z jakéhokoli kompatibilního klienta.

## Odkazy

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
