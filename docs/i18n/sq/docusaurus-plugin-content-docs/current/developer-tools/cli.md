---
title: CLI
description: Ndërfaqja e linjës së komandës për ekzekutimin e një nyje Bitsocial, krijimin e komuniteteve dhe menaxhimin e operacioneve të protokollit.
sidebar_position: 2
---

# CLI

:::warning Emërtimi i trashëgimisë
Kjo paketë përdor aktualisht konventat e emërtimit të trashëguara nga varësia e saj në rrjedhën e sipërme. Referencat për "plebbit" në komanda, dalje dhe konfigurim do të migrohen në "bitsocial" në një version të ardhshëm. Funksionaliteti është i paprekur.
:::

`bitsocial-cli` është një mjet i linjës komanduese për ndërveprim me backend-in e protokollit Bitsocial. It lets you run a local P2P daemon, create and configure communities, and publish content -- all from the terminal.

Është ndërtuar në krye të `plebbit-js` dhe përdoret nga [5chan](/apps/5chan/) dhe [Seedit](/apps/seedit/) për krijimin e komunitetit dhe menaxhimin e nyjeve.

## Instalimi

Binarët e para-ndërtuar janë të disponueshëm për Windows, macOS dhe Linux. Shkarkoni versionin më të fundit për platformën tuaj nga GitHub:

**[Shkarko nga GitHub Releases](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Pas shkarkimit, bëjeni binarin të ekzekutueshëm (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Drejtimi i Daemonit

Përdorimi më i zakonshëm i CLI është drejtimi i një nyje Bitsocial. Daemon fillon shtresën e rrjetit P2P dhe ekspozon një API lokale me të cilën klientët mund të lidhen.

```bash
bitsocial-cli daemon
```

Në fillimin e parë, daemon nxjerr lidhje me **WebUI**, një ndërfaqe grafike e bazuar në shfletues për menaxhimin e nyjës, komuniteteve dhe cilësimeve tuaja. Kjo është e dobishme nëse preferoni një GUI mbi komandat e terminalit.

## Komandat kryesore

| Komanda             | Përshkrimi                                                         |
| ------------------- | ------------------------------------------------------------------ |
| `daemon`            | Filloni nyjen Bitsocial P2P                                        |
| `create subplebbit` | Krijo një komunitet të ri                                          |
| `subplebbit edit`   | Përditëso cilësimet e komunitetit (titulli, përshkrimi, rregullat) |
| `subplebbit list`   | Listoni bashkësitë e pritura në këtë nyje                          |
| `subplebbit start`  | Filloni t'i shërbeni një komuniteti specifik                       |
| `subplebbit stop`   | Ndalo shërbimin ndaj një komuniteti specifik                       |

Ekzekutoni çdo komandë me `--help` për të parë opsionet dhe flamujt e disponueshëm:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Rrjedha tipike e punës

Një rrjedhë e zakonshme konfigurimi për pritjen e një komuniteti të ri:

```bash
# 1. Filloni demonin
bitsocial-cli daemon

# 2. Në një terminal tjetër, krijoni një komunitet
bitsocial-cli create subplebbit

# 3. Konfiguro komunitetin
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Filloni ta shërbeni
bitsocial-cli subplebbit start <address>
```

Komuniteti tani është drejtpërdrejt në rrjetin Bitsocial dhe i aksesueshëm nga çdo klient i pajtueshëm.

## Lidhjet

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
