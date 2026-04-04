---
title: 5chan
description: Un tauler d'imatges descentralitzat i sense servidor basat en el protocol Bitsocial on qualsevol pot crear i tenir taulers.
sidebar_position: 1
---

:::warning[Noms heretats]
La base de codi d'aquest projecte encara utilitza el nom de "plebbit" heretat d'abans del canvi de marca Bitsocial. Els noms dels paquets, les referències de l'API i una mica de terminologia interna s'actualitzaran en una versió futura. La funcionalitat que es descriu aquí és actual; només la denominació està obsoleta.
:::

# 5chan

5chan és un tauler d'imatges sense servidor, sense administrador i totalment descentralitzat que s'executa amb el protocol Bitsocial. Segueix l'estructura de directoris del tauler d'imatges familiar mentre introdueix la propietat descentralitzada: qualsevol pot crear un tauler i diversos taulers poden competir pel mateix espai de directori mitjançant un mecanisme de votació.

## Descàrregues

| Plataforma | Enllaç                                |
| ---------- | ------------------------------------- |
| Web        | [5chan.app](https://5chan.app)        |
| Escriptori | Disponible per a Mac, Windows i Linux |
| Mòbil      | Disponible per a Android              |

## Com funcionen els taulers

5chan organitza el contingut en taulers utilitzant un disseny de directori clàssic (p. ex., `/b/`, `/g/`). A diferència dels taulers d'imatges tradicionals on un administrador central controla tots els taulers, 5chan permet a qualsevol usuari crear i ser propietari del seu propi tauler. Quan diversos taulers es dirigeixen al mateix espai de directori, competeixen per aquesta posició mitjançant la votació.

### Creació d'un tauler

Per crear un tauler nou, heu d'executar `bitsocial-cli` com a node peer-to-peer. Això garanteix que el vostre tauler estigui allotjat de manera descentralitzada sense dependre de cap servidor central.

### Assignacions de directori

Les assignacions d'espais de directori (quin tauler apareix en quin camí) es gestionen actualment mitjançant sol·licituds d'extracció de GitHub al fitxer `5chan-directories.json`. Aquest és un procés temporal: les versions futures admetran la creació de taulers a l'aplicació i la votació basada en pubsub per gestionar les assignacions de directoris automàticament.

## Internals

Sota el capó, 5chan utilitza la capa d'API plebbit-js per a les seves interaccions de protocol. Com s'indica a l'advertiment anterior, aquestes referències internes encara porten noms heretats anteriors al canvi de marca de Bitsocial.

## Enllaços

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Llicència**: GPL-20.
