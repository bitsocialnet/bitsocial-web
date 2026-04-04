---
title: CLI
description: Rozhraní příkazového řádku pro spouštění uzlu Bitsocial, vytváření komunit a správu operací protokolu.
sidebar_position: 2
---

# CLI

:::warning Legacy Pojmenování
Tento balíček aktuálně používá starší konvence pojmenování zděděné z jeho upstream závislosti. Odkazy na „plebbit“ v příkazech, výstupu a konfiguraci budou v budoucí verzi migrovány na „bitsocial“. Funkčnost není ovlivněna.
:::

`bitsocial-cli` je nástroj příkazového řádku pro interakci s backendem protokolu Bitsocial. Umožňuje vám spouštět místního P2P démona, vytvářet a konfigurovat komunity a publikovat obsah – vše z terminálu.

Je postaven na `plebbit-js` a používají ho [5chan](/apps/5chan/) a [Seedit](/apps/seedit/) k vytváření komunity a správě uzlů.

## Instalace

K dispozici jsou předpřipravené binární soubory pro Windows a Mac OS Stáhněte si nejnovější verzi pro svou platformu z GitHubu:

**[Stáhnout z GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Po stažení vytvořte binární spustitelný soubor (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Spuštění démona

Nejčastějším použitím rozhraní CLI je spuštění uzlu Bitsocial. Démon spustí vrstvu P2P sítě a zpřístupní místní API, ke kterému se mohou klienti připojit.

```bash
bitsocial-cli daemon
```

Při prvním spuštění démon vytvoří odkazy na **WebUI**, grafické rozhraní založené na prohlížeči pro správu vašeho uzlu, komunit a nastavení. To je užitečné, pokud dáváte přednost grafickému uživatelskému rozhraní před terminálovými příkazy.

## Klíčové příkazy

| Příkaz              | Popis                                                   |
| ------------------- | ------------------------------------------------------- |
| `daemon`            | Spusťte Bitsocial P2P uzel                              |
| `create subplebbit` | Vytvořte novou komunitu                                 |
| `subplebbit edit`   | Aktualizace nastavení komunity (název, popis, pravidla) |
| `subplebbit list`   | Seznam komunit hostovaných v tomto uzlu                 |
| `subplebbit start`  | Začněte sloužit konkrétní komunitě                      |
| `subplebbit stop`   | Přestaňte sloužit konkrétní komunitě                    |

Spusťte libovolný příkaz s `--help`, abyste viděli dostupné možnosti a příznaky:

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

Komunita je nyní dostupná živě a kompatibilní na jakékoli sociální síti klient.

## Odkazy

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
