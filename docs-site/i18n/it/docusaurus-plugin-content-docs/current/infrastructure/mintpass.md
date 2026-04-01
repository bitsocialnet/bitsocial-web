---
title: Mintpass
description: Sistema di autenticazione basato su NFT che aiuta le comunità Bitsocial a verificare gli utenti e a ridurre gli attacchi sybil.
sidebar_position: 2
---

# Mintpass

Mintpass è un sistema di autenticazione basato su NFT per le comunità Bitsocial. Gli utenti coniano un NFT di verifica non trasferibile dopo aver completato una sfida (come SMS OTP) e le comunità possono verificare la proprietà NFT per proteggersi da attacchi sybil come voti falsi, ban evasione e spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licenza**: MIT

## Come funziona

Il flusso di verifica ha quattro passaggi:

1. **Richiesta** -- L'utente visita `mintpass.org/request` per iniziare il processo.
2. **Sfida** -- L'utente completa una verifica tramite SMS con password monouso.
3. **Conia** -- Una volta completata con successo la verifica, un NFT non trasferibile viene coniato nel portafoglio dell'utente.
4. **Verifica** -- Le comunità interrogano la proprietà NFT per confermare che l'utente è stato verificato.

Poiché l'NFT non è trasferibile, rimane vincolato al portafoglio che ha completato la verifica, impedendo agli utenti di scambiare o vendere il proprio stato verificato.

## Struttura del progetto

Il repository è organizzato in tre aree principali:

| Directory    |
| ------------ | ----------------------------------------------------- |
| `contracts/` | .                                                     |
| `challenge/` | Integration layer for the Bitsocial challenge system. |
| `web/`       | Next.js and React frontend for the minting flow.      |

## Privacy and Data Handling

Mintpass takes a minimal-data approach:

- **Operational data** (OTP codes, session token) viene archiviato in Redis con TTL brevi e scade automaticamente.
- **Associazione Mint** (il collegamento tra un'identità verificata e un portafoglio) è l'unico record persistente.

Nessun numero di telefono o dettaglio personale viene conservato dopo la chiusura della finestra di verifica.

## Livelli di sicurezza opzionali

Gli operatori della comunità possono abilitare protezioni aggiuntive a seconda del loro modello di minaccia:

- **Controlli della reputazione IP** -- Valuta le richieste in arrivo rispetto ai database di abusi noti.
- **Rischio telefonico Assessment** -- Contrassegna numeri usa e getta o VoIP prima di lanciare una sfida.
- **Geoblocking** -- Limita la verifica a regioni specifiche.
- **Raffreddamenti per IP** -- Limita la velocità dei tentativi di verifica ripetuti dallo stesso indirizzo.

## Stack tecnologico

| Strato    | Tecnologia                                   |
| --------- | -------------------------------------------- |
| Contratti | Solidità, implementata con Hardhat e Foundry |
| Frontend  | Next.js + Reagisci                           |
| Rete      | Base (Ethereum L2)                           |

L'implementazione su Base mantiene bassi i costi del gas ereditando al tempo stesso le garanzie di sicurezza di Ethereum.

## Tabella di marcia

I miglioramenti pianificati includono:

- **Opzione pay-to-mint** -- Consenti alle comunità di richiedere una piccola commissione per il conio, aggiungendo una barriera economica sybil.
- **Segnali di verifica aggiuntivi** -- Espanditi oltre SMS ad altri segnali di identità.
- **Strumenti di amministrazione ampliati** -- Dashboard e controlli più ricchi per gli operatori della community.
