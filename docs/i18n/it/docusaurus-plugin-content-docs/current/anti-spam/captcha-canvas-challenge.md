---
title: Captcha Canvas Challenge
description: Generatore captcha autonomo basato su immagini con caratteri, dimensioni e colori configurabili.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Denominazione legacy
Questo pacchetto è stato originariamente pubblicato nell'ambito `@plebbit`. È stato rinominato in `@bitsocial/captcha-canvas-challenge`. I riferimenti al vecchio nome potrebbero ancora apparire nella documentazione o nelle basi di codice precedenti.
:::

Captcha Canvas Challenge è un generatore di captcha di immagini autonomo originariamente estratto da `plebbit-js`. Rende il testo casuale su una tela HTML e restituisce l'immagine risultante, che le comunità possono presentare agli autori come sfida anti-spam.

**Codice sorgente:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Requisiti

- **Node.js** >= 22
- **Solo ESM** -- questo pacchetto non fornisce build CommonJS.
- **Dipendenza peer runtime:** `@plebbit/plebbit-js` (migrazione a `@pkc/pkc-js`)

## Installazione

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opzioni di configurazione

| Opzione      | Digitare | Predefinito | Descrizione                                                     |
| ------------ | -------- | ----------- | --------------------------------------------------------------- |
| `characters` | `number` | `6`         | Numero di caratteri casuali visualizzati nell'immagine captcha. |
| `height`     | `number` | `100`       | Altezza dell'immagine generata in pixel.                        |
| `width`      | `number` | `300`       | Larghezza dell'immagine generata in pixel.                      |
| `colors`     | `string` | `#32cf7e`   | Colore primario utilizzato per il testo captcha.                |

## Come funziona

1. Il generatore seleziona una stringa casuale della lunghezza configurata.
2. La stringa viene renderizzata su un'area di disegno con rumore visivo per resistere all'OCR.
3. L'immagine risultante (e la risposta prevista) vengono restituite in modo che l'applicazione chiamante possa presentare la sfida e successivamente verificare la risposta.

Poiché il pacchetto è un puro generatore di immagini, non gestisce autonomamente la rete o la gestione delle sessioni. È destinato ad essere integrato in un flusso di sfide più ampio, ad esempio come uno dei tipi di sfide supportati da [Spam Blocker](./spam-blocker.md).
