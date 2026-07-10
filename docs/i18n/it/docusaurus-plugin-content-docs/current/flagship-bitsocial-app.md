---
title: Decentralizzare Twitter/X
description: "Fase 3 del piano generale: un'alternativa a Twitter/X focalizzata e decentralizzata, pensata per la conversazione pubblica incentrata sul testo, con infrastruttura sostituibile."
---

# Decentralizzare Twitter/X

La Fase 3 prevede di costruire un'alternativa a Twitter/X focalizzata e decentralizzata. Al centro c'è la conversazione pubblica incentrata sul testo: post brevi, risposte, repost, follow, discussioni in tempo reale e comunità, con il livello della piattaforma reso aperto.

Twitter/X è ancora definito dai post, dal testo e dalla condivisione di idee. Il client della Fase 3 dovrebbe competere su questa esperienza centrale e farla funzionare eccezionalmente bene.

Questa pagina descrive la direzione del prodotto, non una specifica di rilascio definitiva. L'interfaccia esatta, il feed predefinito, il modello pubblicitario, le funzionalità AI e il marketplace RPC possono cambiare man mano che il protocollo e le prime app maturano.

## Cosa dovrebbe dimostrare

Il client dovrebbe dimostrare che un social network basato sui profili può evitare di diventare una piattaforma custodial:

- gli utenti possono possedere identità e profili
- le comunità e i nodi dei profili possono rimanere peer-to-peer
- le comunità possono portare effetti di rete tra i client Bitsocial
- i provider RPC possono rendere il client comodo senza assumerne la custodia
- gli algoritmi dei feed possono essere servizi facoltativi anziché regole imposte dalla piattaforma
- altri client possono comunque competere sulla stessa rete

L'obiettivo è costruire il client più solido possibile per la conversazione pubblica e dimostrare fin dove può arrivare il protocollo.

## Familiare nello scopo, sostituibile per progettazione

L'esperienza predefinita dovrebbe competere con il cuore di Twitter/X: un feed principale veloce, post di testo, follow, risposte, distribuzione in stile repost, comunità, notifiche, ricerca e una vista classificata For You che funzioni subito.

Bitsocial Forge può gestire il primo servizio RPC e il primo servizio di feed predefiniti. Questa configurazione può includere un feed classificato e annunci, così il client risulta completo fin dal primo giorno senza chiedere agli utenti comuni di assemblare da soli l'intero stack.

La differenza è che la configurazione predefinita non deve diventare una prigione. Un utente dovrebbe poter cambiare RPC, feed, istanze, sistemi di classificazione, annunci e provider di scoperta, oppure eliminare del tutto la classificazione. Il client può proporre scelte precise al primo avvio, mantenendo sostituibili tutti i servizi principali.

Ciò rende il client più personalizzabile di una piattaforma convenzionale. Un utente potrebbe mantenere il feed classificato predefinito con gli annunci. Un altro potrebbe usare un feed cronologico senza classificazione. Un altro ancora potrebbe scegliere un RPC orientato alla privacy, un servizio di scoperta gestito dalla comunità, un feed a pagamento senza annunci o un algoritmo di nicchia creato per una specifica sottocultura.

## Comunità tra client

Le comunità dovrebbero essere molto più importanti di gruppi isolati all'interno di una sola app.

Su X/Twitter, le comunità sono confinate dentro X. Possono essere utili, ma ereditano i limiti di un'unica piattaforma, un unico sistema di account, un unico stack di raccomandazioni e un'unica superficie di prodotto.

Una comunità Bitsocial può essere creata, ospitata, scoperta e usata attraverso client diversi. Ciò significa che il client della Fase 3 può mostrare comunità e post provenienti dalla rete Bitsocial più ampia, non soltanto dagli utenti che hanno iniziato al suo interno. Una comunità potrebbe ricevere contemporaneamente attività da un client imageboard, un client di discussione in stile Reddit, un client per forum di nicchia, un'app mobile e il client della Fase 3.

Questo è il principale vantaggio dell'effetto rete: un client può risultare familiare agli utenti comuni continuando a trarre valore da molti client, nodi di comunità, provider RPC e servizi indipendenti.

## Algoritmi dei feed facoltativi

Il client della Fase 3 non dovrebbe imporre a tutti un unico sistema globale di classificazione.

Gli algoritmi dei feed dovrebbero essere attivati su scelta dell'utente. Un utente potrebbe scegliere un algoritmo da un marketplace, cambiare provider, usare l'algoritmo di un'azienda, uno gestito da un operatore anonimo, uno creato da una comunità, eseguirne uno personale oppure non usare alcun algoritmo.

I provider RPC pubblici sono un luogo naturale in cui questi servizi possono competere. Possono indicizzare, classificare e consigliare contenuti, ma non dovrebbero possedere l'utente o il profilo.

Questi servizi possono competere anche sulla forma stessa del client. Un RPC potrebbe offrire un feed classificato con annunci. Un altro potrebbe offrire un feed cronologico non classificato. Un altro ancora potrebbe specializzarsi in privacy, traduzione, moderazione, scoperta delle comunità o in un grafo sociale di nicchia.

Se il modello economico funziona, i servizi di feed basati su RPC potrebbero aggiungere funzionalità AI simili a quelle che le piattaforme tradizionali stanno cercando di inserire nei loro feed: traduzioni automatiche, riepiloghi, risposte assistite da bot, risposte alle ricerche, assistenza alla moderazione o contesto in stile note della comunità.

Queste funzionalità dovrebbero essere scelte di servizio, non requisiti del protocollo. Un RPC predefinito può competere offrendo un feed più ricco, ma utenti e client concorrenti dovrebbero comunque poter scegliere alternative più semplici, private, cronologiche, senza annunci o specifiche per una comunità.

## RPC non custodiale

Ogni utente dovrebbe poter partecipare come nodo peer-to-peer completo tramite RPC senza concedere al provider RPC la proprietà della propria identità o del proprio profilo.

Il percorso gestito da un provider è importante perché la maggior parte degli utenti non inizierà eseguendo un server. Il percorso di uscita è altrettanto importante: un utente dovrebbe poter passare al proprio nodo di profilo su hardware con specifiche modeste, incluso un Raspberry Pi, quando vuole.

Questa è la differenza tra comodità e custodia.

## Conversazione pubblica, rafforzata da Bitsocial Chain

Bitsocial Chain può portare nomi durevoli, pagamenti, mance, premi e altri strumenti finanziari direttamente nella conversazione pubblica.

Il client della Fase 3 rimane incentrato su post, testo, condivisione di idee e discussioni in tempo reale, condividendo comunità ed effetti di rete con gli altri client Bitsocial.
