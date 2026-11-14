---
title: Bitsocial Chain
description: Fase 3 del piano generale, dedicata al livello economico proposto per le app Bitsocial come appchain L2 di Ethereum.
---

# Bitsocial Chain

Bitsocial Chain è il livello economico proposto per le app Bitsocial, realizzato come appchain L2 di
Ethereum. Il sito dedicato alla chain è oggi
[chain.bitsocial.net](https://chain.bitsocial.net).

Il livello sociale peer-to-peer permette a comunità, identità e contenuti di esistere fuori dal
database centrale di una piattaforma. Bitsocial Chain vuole aggiungere le primitive condivise di
naming, monetizzazione e pagamento che rendono più difficile soffocare economicamente quelle app.

## Cosa dovrebbe rendere possibile

- domini Bitsocial decentralizzati come `.bso`
- premi e mance
- canali di monetizzazione durevoli
- liquidità condivisa tra le app
- strutture finanziarie più difficili da tagliare per banche o piattaforme
- effetti di rete che non dipendono da un'unica azienda proprietaria dell'intero stack

L'obiettivo non è partire dalla meccanica del token. L'obiettivo è rendere le app social utili più
durevoli, più facili da finanziare e meno dipendenti da fornitori centralizzati di pagamenti o di
nomi.

## Proof of concept attuale

Il primo proof of concept di Bitsocial Chain si concentra sui nomi nativi `.bso`. Dimostra che un
registro di nomi può essere derivato dalla storia della L1 di Ethereum senza portare on-chain i
contenuti sociali:

- gli utenti inviano intenti di registrazione, aggiornamento, trasferimento e revoca tramite normali
  transazioni sulla L1 di Ethereum
- chiunque può eseguire il nodo di derivazione e ricostruire lo stesso stato del registro `.bso`
- un resolver associa un nome `.bso` alla chiave pubblica Bitsocial che i client già usano sul
  protocollo peer-to-peer
- post, voti, moderazione, feed e contenuti delle comunità restano off-chain e peer-to-peer

Quel proof of concept non è un lancio in produzione di Stage 2. Non ha ancora un sistema di prove, un
meccanismo di contestazione, codice sottoposto ad audit, un deployment attivo, prezzi definitivi o
una governance definitiva. La sua impostazione di lungo periodo è trasparente per impostazione
predefinita e progettata per essere compatibile con la privacy: la chain principale è pubblica,
mentre le future mance, i pagamenti, i premi e la liquidità dovrebbero evitare di imporre legami
permanenti tra identità sociale e storico del wallet.

## Perché è importante

Decentralizzare comunità e identità è necessario, ma non basta a decentralizzare tutti i social
media.

Se le app social continuano a dipendere da pochi canali economici centralizzati, restano facili da
mettere sotto pressione, da escludere dalle piattaforme o da soffocare finanziariamente. Bitsocial
Chain è la risposta proposta a questo secondo livello di dipendenza.

## Relazione con le app

Bitsocial Chain dovrebbe stare sotto le app Bitsocial, non sostituirle.

Il risultato rivolto al pubblico dovrebbe essere:

- le comunità restano peer-to-peer
- le app restano differenziate
- gli utenti ottengono funzionalità pratiche di naming e monetizzazione
- creator e comunità possono ricevere supporto da qualsiasi client
- il valore può circolare nell'ecosistema senza ricreare un proprietario centralizzato della
  piattaforma

## Perché arriva dopo l'alternativa a Twitter/X

Il piano generale attuale colloca Bitsocial Chain dopo l'alternativa a Twitter/X, perché quell'app non ha bisogno della chain. I profili funzionano come nodi profilo tramite RPC non custodial, e i nomi `.bso` possono partire da un registro provvisorio sulla mainnet di Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) e spostarsi sulla chain in seguito.

Bitsocial Chain non dovrebbe sacrificare la decentralizzazione in cambio di un lancio anticipato. Non dovrebbe aggiungere alcuna assunzione di fiducia oltre a Ethereum stesso: nessuna chiave di aggiornamento, nessun consiglio di sicurezza e nessun operatore in grado di censurarla o fermarla. Il progetto principale per riuscirci, un rollup nativo, dipende da un aggiornamento di Ethereum non ancora in calendario. Finché la chain non potrà rispettare questo standard, l'alternativa a Twitter/X fa crescere la base di utenti che la chain servirà.

## Principi di progettazione

Poiché Bitsocial Chain è ancora un'infrastruttura proposta e non un prodotto già lanciato, il piano
deve restare disciplinato:

- Prima le app e le comunità. Il livello di rete deve rendere più solidi prodotti social reali.
- Prima le funzionalità pratiche. Nomi, premi, mance e pagamenti sono più facili da spiegare di
  un'architettura finanziaria astratta.
- Il contributo reale prima dell'hype. Le primitive economiche devono premiare la partecipazione, la
  costruzione e il supporto alla comunità.
- La curation è ammessa. Le app possono modellare classifiche, impostazioni predefinite e discovery
  per favorire le comunità durevoli.
- I meccanismi esatti restano aperti. Questa pagina spiega il ruolo di Bitsocial Chain, non una
  promessa vincolante sull'economia finale.
