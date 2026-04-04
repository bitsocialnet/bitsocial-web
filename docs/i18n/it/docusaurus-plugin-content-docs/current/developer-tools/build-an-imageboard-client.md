---
title: Costruisci un client imageboard
description: Guida ai contributi della Fase 1 per gli sviluppatori che desiderano pubblicare nuove esperienze di imageboard su Bitsocial.
sidebar_position: 1
---

# Costruisci un client imageboard

La Fase 1 non riguarda un'app ufficiale che copra l'intera categoria. 5chan è il primo punto di prova, ma l'obiettivo reale è un ampio ecosistema di imageboard: più client Bitsocial con diversi linguaggi visivi, impostazioni predefinite di moderazione, modelli di directory e comunità target.

## Di cosa ha bisogno la Fase 1

- Client familiari in stile 4chan per l'onboarding tradizionale
- Clienti ispirati ad Altchan con culture e pacchetti di tavole diverse
- Client mobile-first o con larghezza di banda ridotta
- Clienti appartenenti a una singola comunità o di nicchia con valori predefiniti fortemente supponenti
- Migliori flussi di moderazione, media, onboarding o scoperta rispetto a quelli forniti dalla prima app

## Il modo più veloce per aiutare

Se desideri il percorso più breve per la spedizione, contribuisci prima direttamente a 5chan:

- Esplora l'app live su [5chan.app](https://5chan.app)
- Controlla la fonte su [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Partecipa alla chat del costruttore su [t.me/fivechandev](https://t.me/fivechandev)

## Costruisci il tuo cliente

Se 5chan non corrisponde alla community o all'interfaccia desiderata, crea invece un client separato. I client Bitsocial compatibili possono condividere la stessa rete senza condividere le stesse decisioni sul prodotto.

1. Impara gli strumenti di interfacciamento con il protocollo:
   - [Ganci Bitsocial React](../react-hooks/)
   - [CLI Bitsocial](../cli/)
2. Decidi che tipo di imageboard stai effettivamente costruendo.
Scegli prima la struttura del consiglio, i presupposti di identità, il modello di moderazione, il flusso di scoperta e il linguaggio visivo.
3. Scegli il percorso di implementazione adatto al progetto.
Fork 5chan se vuoi muoverti velocemente con una base di imageboard familiare. Ricomincia da capo se l'interfaccia utente o il modello di interazione devono essere radicalmente diversi.
4. Spedisci una prima versione stretta.
Un cliente che serve bene una vera comunità è più prezioso di un vago clone destinato a soddisfare tutti.
5. Pubblica il risultato e lascia che le comunità lo testino.
Bitsocial migliora quando i costruttori esterni forniscono clienti supponenti che competono sulla qualità del prodotto invece di aspettare che un'app ufficiale faccia tutto.

## Principio di progettazione

Bitsocial non vince avendo un cliente benedetto. Vince quando molti clienti possono coesistere, dividersi, specializzarsi e soddisfare esigenze che la prima app non potrà mai fare.
