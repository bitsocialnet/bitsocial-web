---
title: CLI
description: Interfície de línia d'ordres per executar un node Bitsocial, crear comunitats i gestionar operacions de protocol.
sidebar_position: 2
---

# CLI

:::warning Noms heretats
Aquest paquet actualment utilitza convencions de denominació heretades de la seva dependència amunt. Les referències a "plebbit" a les ordres, la sortida i la configuració es migraran a "bitsocial" en una versió futura. La funcionalitat no es veu afectada.
:::

`bitsocial-cli` és una eina de línia d'ordres per interactuar amb el backend del protocol Bitsocial. Us permet executar un dimoni P2P local, crear i configurar comunitats i publicar contingut, tot des del terminal.

Està construït a sobre de `plebbit-js` i l'utilitzen [5chan](/apps/5chan/) i [Seedit](/apps/seedit/) per a la creació de comunitats i la gestió de nodes.

## Instal·lació

Els sistemes binaris preconstruïts estan disponibles per a Windows i Linux. Baixeu la darrera versió per a la vostra plataforma des de GitHub:

**[Baixeu des de les versions de GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Després de baixar-lo, feu que el binari sigui executable (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Executant el Daemon

L'ús més comú de la CLI és executar un node Bitsocial. El dimoni inicia la capa de xarxa P2P i exposa una API local a la qual es poden connectar els clients.

```bash
bitsocial-cli daemon
```

En el primer llançament, el dimoni mostra enllaços a la **WebUI**, una interfície gràfica basada en navegador per gestionar el vostre node, comunitats i configuració. Això és útil si preferiu una interfície gràfica gràfica sobre les ordres del terminal.

## Comandes clau

| Comandament         | Descripció                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| `daemon`            | Inicieu el node Bitsocial P2P                                          |
| `create subplebbit` | Crea una nova comunitat                                                |
| `subplebbit edit`   | Actualitza la configuració de la comunitat (títol, descripció, regles) |
| `subplebbit list`   | Llista les comunitats allotjades en aquest node                        |
| `subplebbit start`  | Comença a servir una comunitat específica                              |
| `subplebbit stop`   | Deixeu de servir una comunitat específica                              |

Executeu qualsevol ordre amb `--help` per veure les opcions i les marques disponibles:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Flux de treball típic

Un flux de configuració comú per allotjar una nova comunitat:

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

La comunitat Bit és compatible i en directe des de qualsevol xarxa social. client.

## Enllaços

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
