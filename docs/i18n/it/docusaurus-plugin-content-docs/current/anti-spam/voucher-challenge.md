---
title: Voucher Challenge
description: Sfida anti-spam che blocca la pubblicazione dietro codici voucher univoci distribuiti dai proprietari della comunità.
sidebar_position: 3
---

# Voucher Challenge

Voucher Challenge è un meccanismo anti-spam che blocca la pubblicazione di contenuti dietro codici voucher univoci. Invece di fare affidamento sul rilevamento automatico, trasferisce la fiducia al proprietario della comunità, che distribuisce manualmente i codici alle persone di cui si fida.

**Codice sorgente:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Come funziona

1. Un proprietario della comunità genera uno o più codici voucher univoci.
2. Il proprietario distribuisce tali codici agli autori fidati attraverso un canale di sua scelta (messaggio diretto, email, di persona, ecc.).
3. Quando un autore tenta di pubblicare, il sistema di sfida gli richiede un codice voucher.
4. Il codice viene convalidato: se è autentico e non è già stato utilizzato, la pubblicazione viene accettata.

Ogni codice voucher è legato a un autore specifico una volta riscattato, impedendone il riutilizzo da parte di altri.

## Quando utilizzarlo

La sfida voucher è la più adatta per:

- **Comunità solo su invito** in cui l'appartenenza è intenzionalmente limitata.
- **Spazi curati** in cui il proprietario controlla personalmente ogni partecipante.
- **Ambienti ad alta fiducia** in cui il punteggio automatico dello spam non è necessario o indesiderabile.

Poiché richiede la distribuzione manuale del codice, non è adattabile a grandi comunità aperte. Per questi scenari, considera [Spam Blocker](./spam-blocker.md) o [EVM Contract Call Challenge](./evm-contract-call.md).

## Integrazione

Voucher Challenge si collega alla stessa interfaccia di sfida utilizzata da altri pacchetti anti-spam nell'ecosistema Bitsocial. I proprietari della comunità lo abilitano attraverso le impostazioni della loro comunità e la sfida viene presentata automaticamente agli autori quando tentano di pubblicare.
