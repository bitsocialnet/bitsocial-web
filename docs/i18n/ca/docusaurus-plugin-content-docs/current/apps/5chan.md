---
title: 5canal
description: Un tauler d'imatges descentralitzat i sense servidor basat en el protocol Bitsocial on qualsevol pot crear i tenir taulers.
sidebar_position: 1
---

# 5canal

5chan és un tauler d'imatges sense servidor, sense administrador i totalment descentralitzat que s'executa amb el protocol Bitsocial. Segueix l'estructura de directoris del tauler d'imatges familiar mentre introdueix la propietat descentralitzada: qualsevol pot crear un tauler i diversos taulers poden competir pel mateix espai de directori mitjançant un mecanisme de votació.

## Descàrregues

| Plataforma | Enllaç                                |
| ---------- | ------------------------------------- |
| Web        | [5can.app](https://5chan.app)         |
| Escriptori | Disponible per a Mac, Windows i Linux |
| Mòbil      | Disponible per a Android              |

## Com funcionen els taulers

5chan organitza el contingut en taulers utilitzant un disseny de directori clàssic (p. ex., `/b/`, `/g/`). A diferència dels taulers d'imatges tradicionals on un administrador central controla tots els taulers, 5chan permet a qualsevol usuari crear i ser propietari del seu propi tauler. Quan diversos taulers es dirigeixen al mateix espai de directori, competeixen per aquesta posició mitjançant la votació.

### Creació d'un tauler

Per crear un tauler nou, heu d'executar `bitsocial-cli` com a node peer-to-peer. Això garanteix que el vostre tauler estigui allotjat de manera descentralitzada sense dependre de cap servidor central.

### Assignacions de directori

Les assignacions d'espai de directori (quin tauler apareix en quin camí) es gestionen actualment mitjançant sol·licituds d'extracció de GitHub al fitxer `5chan-directories.json`. Aquest és un procés temporal: les versions futures admetran la creació de taulers a l'aplicació i la votació basada en pubsub per gestionar les assignacions de directoris automàticament.

## Interns

Sota el capó, 5chan utilitza la capa de client de protocol Bitsocial compartida per a les seves interaccions de xarxa. L'aplicació web de 5chan.app també pot executar un node Helia al navegador quan el navegador P2P està habilitat des de la configuració avançada, de manera que els lectors poden carregar des d'un mateix sense una passarel·la IPFS centralitzada. Consulteu la secció P2P del navegador a les notes del protocol peer-to-peer.

## Enllaços

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegrama**: [t.me/fivechandev](https://t.me/fivechandev)
- **Llicència**: només GPL-2.0
