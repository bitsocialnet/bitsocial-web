---
title: 5chan
description: Un tauler d'imatges descentralitzat i sense servidor, construït sobre el protocol Bitsocial, on qualsevol pot crear i posseir taulers.
sidebar_position: 1
---

# 5chan

5chan és un tauler d'imatges sense servidor, sense administradors i totalment descentralitzat que funciona sobre el protocol Bitsocial. Segueix l'estructura de directoris habitual dels taulers d'imatges i hi afegeix la propietat descentralitzada: qualsevol pot crear un tauler, i diversos taulers poden competir per la mateixa posició del directori mitjançant un mecanisme de votació.

## Descàrregues

| Plataforma | Enllaç                                |
| ---------- | ------------------------------------- |
| Web        | [5chan.app](https://5chan.app)        |
| Escriptori | Disponible per a Mac, Windows i Linux |
| Mòbil      | Disponible per a Android              |

## Com funcionen els taulers

5chan organitza el contingut en taulers seguint una disposició de directoris clàssica (p. ex., `/b/`, `/g/`). A diferència dels taulers d'imatges tradicionals, on un administrador central controla tots els taulers, 5chan permet que qualsevol usuari creï i sigui plenament propietari del seu propi tauler. Quan diversos taulers apunten a la mateixa posició del directori, competeixen per aquesta posició; vegeu [Directoris](/directories/).

### Crear un tauler

Per crear un tauler nou, cal executar `bitsocial-cli` com a node peer-to-peer. Així el vostre tauler s'allotja de manera descentralitzada, sense dependre de cap servidor central.

### Assignacions de directori

Els taulers candidats de cada directori figuren en un fitxer `5chan-directories/5chan-<code>-directory.json` del repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists), i un tauler s'uneix a un directori mitjançant una pull request a aquest fitxer. A més, 5chan fa una votació per a cada directori amb [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): cada titular d'un 5chan Pass té un vot, i votar per un tauler que no és a la llista el nomina. Ara per ara les votacions es fan a la xarxa de proves Base Sepolia, on els recomptes es mostren però no reordenen la llista.

## Interioritats

Per sota, 5chan fa servir la capa de client compartida del protocol Bitsocial per a les seves
interaccions de xarxa. L'aplicació web de 5chan.app executa per defecte un node Helia al navegador,
de manera que una pestanya normal s'uneix a la xarxa com a parell: carrega taulers d'altres parells i
publica per pubsub, sense cap passarel·la IPFS centralitzada al camí del contingut. Vegeu
[Peer-to-peer al navegador](/browser-p2p/) per saber què implica això i què encara no pot fer un node
de navegador.

## Enllaços

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Llicència**: GPL-2.0-only
