---
title: CLI
description: Command-line interface para sa pagpapatakbo ng Bitsocial node, paglikha ng mga komunidad, at pamamahala ng mga pagpapatakbo ng protocol.
sidebar_position: 2
---

# CLI

:::warning Legacy Naming
Ang package na ito ay kasalukuyang gumagamit ng legacy na mga convention sa pagbibigay ng pangalan na minana mula sa upstream dependency nito. Ang mga sanggunian sa "plebbit" sa mga command, output, at configuration ay ililipat sa "bitsocial" sa isang release sa hinaharap. Ang pag-andar ay hindi naaapektuhan.
:::

Ang `bitsocial-cli` ay isang command-line tool para sa pakikipag-ugnayan sa Bitsocial protocol backend. Hinahayaan ka nitong magpatakbo ng lokal na P2P daemon, lumikha at mag-configure ng mga komunidad, at mag-publish ng nilalaman -- lahat mula sa terminal.

Ito ay binuo sa ibabaw ng `plebbit-js` at ginagamit ng [5chan](/apps/5chan/) at [Seedit](/apps/seedit/) para sa paggawa ng komunidad at pamamahala ng node.

## Pag-install

Available ang mga pre-built na binary para sa Windows, macOS, at Linux. I-download ang pinakabagong release para sa iyong platform mula sa GitHub:

**[Mag-download mula sa GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Pagkatapos mag-download, gawin ang binary executable (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Pagpapatakbo ng Daemon

Ang pinakakaraniwang paggamit ng CLI ay nagpapatakbo ng isang Bitsocial node. Sinisimulan ng daemon ang layer ng P2P networking at inilalantad ang isang lokal na API na maaaring kumonekta ng mga kliyente.

```bash
bitsocial-cli daemon
```

Sa unang paglunsad, naglalabas ang daemon ng mga link sa **WebUI**, isang graphical interface na nakabatay sa browser para sa pamamahala ng iyong node, mga komunidad, at mga setting. Ito ay kapaki-pakinabang kung mas gusto mo ang isang GUI kaysa sa mga terminal command.

## Mga Pangunahing Utos

| Utos                | Paglalarawan                                                                  |
| ------------------- | ----------------------------------------------------------------------------- |
| `daemon`            | Simulan ang Bitsocial P2P node                                                |
| `create subplebbit` | Lumikha ng bagong komunidad                                                   |
| `subplebbit edit`   | I-update ang mga setting ng komunidad (pamagat, paglalarawan, mga panuntunan) |
| `subplebbit list`   | Ilista ang mga komunidad na naka-host sa node na ito                          |
| `subplebbit start`  | Simulan ang paglilingkod sa isang partikular na komunidad                     |
| `subplebbit stop`   | Ihinto ang paglilingkod sa isang partikular na komunidad                      |

Patakbuhin ang anumang command gamit ang `--help` para makita ang mga available na opsyon at flag:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Karaniwang Daloy ng Trabaho

Isang karaniwang daloy ng pag-setup para sa pagho-host ng bagong komunidad:

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

Live na ngayon ang komunidad sa Bitsocial network at naa-access mula sa anumang katugmang kliyente.

## Mga link

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
