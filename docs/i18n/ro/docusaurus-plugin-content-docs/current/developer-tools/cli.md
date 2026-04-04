---
title: CLI
description: Interfață de linie de comandă pentru rularea unui nod Bitsocial, crearea comunităților și gestionarea operațiunilor de protocol.
sidebar_position: 2
---

# CLI

:::warning Denumire moștenită
Acest pachet utilizează în prezent convențiile de denumire moștenite din dependența sa în amonte. Referințele la „plebbit” în comenzi, ieșire și configurare vor fi migrate la „bitsocial” într-o versiune viitoare. Funcționalitatea este neafectată.
:::

`bitsocial-cli` este un instrument de linie de comandă pentru interacțiunea cu backend-ul protocolului Bitsocial. Vă permite să rulați un demon P2P local, să creați și să configurați comunități și să publicați conținut -- totul din terminal.

Este construit pe `plebbit-js` și este folosit de [5chan](/apps/5chan/) și [Seedit](/apps/seedit/) pentru crearea comunității și gestionarea nodurilor.

## Instalare

Binarele prefabricate sunt disponibile pentru Windows, macOS și Linux. Descărcați cea mai recentă versiune pentru platforma dvs. de pe GitHub:

**[Descărcați din versiunile GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

După descărcare, faceți binarul executabil (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Conducerea Daemonului

Cea mai comună utilizare a CLI este rularea unui nod Bitsocial. Daemonul pornește stratul de rețea P2P și expune un API local la care clienții se pot conecta.

```bash
bitsocial-cli daemon
```

La prima lansare, demonul afișează link-uri către **WebUI**, o interfață grafică bazată pe browser pentru gestionarea nodului, comunităților și setărilor. Acest lucru este util dacă preferați o GUI decât comenzile terminalului.

## Comenzi cheie

| Comanda             | Descriere                                                   |
| ------------------- | ----------------------------------------------------------- |
| `daemon`            | Porniți nodul Bitsocial P2P                                 |
| `create subplebbit` | Creați o nouă comunitate                                    |
| `subplebbit edit`   | Actualizați setările comunității (titlu, descriere, reguli) |
| `subplebbit list`   | Listează comunitățile găzduite pe acest nod                 |
| `subplebbit start`  | Începeți să deserviți o anumită comunitate                  |
| `subplebbit stop`   | Nu mai deservi o anumită comunitate                         |

Rulați orice comandă cu `--help` pentru a vedea opțiunile și semnalizatoarele disponibile:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Flux de lucru tipic

Un flux comun de configurare pentru găzduirea unei noi comunități:

```bash
# 1. Porniți demonul
bitsocial-cli daemon

# 2. Într-un alt terminal, creați o comunitate
bitsocial-cli create subplebbit

# 3. Configurați comunitatea
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Începeți să-l serviți
bitsocial-cli subplebbit start <address>
```

Comunitatea este acum live pe rețeaua Bitsocial și accesibilă de la orice client compatibil.

## Legături

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
