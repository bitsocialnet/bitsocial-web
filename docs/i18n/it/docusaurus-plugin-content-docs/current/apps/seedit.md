---
title: Seedit
description: Un forum serverless e decentralizzato in stile Reddit, costruito sul protocollo Bitsocial in cui chiunque può creare e possedere comunità.
sidebar_position: 2
---

# Seedit

Seedit è un'alternativa serverless, senza amministrazione e completamente decentralizzata al vecchio stile Reddit, basata sul protocollo Bitsocial. Offre agli utenti la completa proprietà sulle proprie comunità: chiunque può crearne una e più comunità possono competere per lo stesso percorso breve, come `/s/funny`.

## Download

| Piattaforma | Collegamento                                        |
| ----------- | --------------------------------------------------- |
| Rete        | [seedit.app](https://seedit.app)                    |
| Web (ENS)   | `seedit.eth` tramite browser Brave o IPFS Companion |
| Desktop     | Disponibile per Mac, Windows e Linux                |
| Mobile      | Disponibile per Android                             |

## Come funzionano le comunità

Seedit organizza i contenuti in comunità simili a subreddit. Ogni comunità è di proprietà del suo creatore e funziona senza amministrazione centralizzata. Più comunità possono competere per lo stesso percorso di [directory](/directories/), come `/s/funny`, che apre la vincitrice attuale. Le iscrizioni e i link ai post puntano sempre alla comunità esatta.

### Creazione di una comunità

Esistono due modi per creare una nuova comunità:

1. **Client desktop** — Utilizza la GUI integrata nell'applicazione desktop per impostare e configurare la tua comunità.
2. **bitsocial-cli** — Esegui lo strumento CLI per creare e gestire le comunità. dalla riga di comando.

### Elenco delle comunità predefinite

I nuovi account vengono iscritti a un elenco predefinito di comunità specifiche, definito in `seedit-default-subscriptions.json` nel repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Le candidate delle directory sono elencate nei file `seedit-directories/seedit-<code>-directory.json` dello stesso repository. Per aggiungere la tua comunità a uno dei due elenchi, invia una pull request con i dettagli della tua comunità.

## Link

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licenza**: solo GPL-2.0
