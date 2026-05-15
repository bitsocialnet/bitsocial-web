---
title: Applicazione BitSocial di punta
description: "Il client Bitsocial proposto basato sul profilo: familiare come X/Twitter per impostazione predefinita, ma con RPC, feed, algoritmi, annunci e comunità sostituibili."
---

# Applicazione BitSocial di punta

L'app Bitsocial di punta è il primo client basato sul profilo proposto per la rete. Il paragone più semplice è: familiare come X/Twitter per impostazione predefinita, ma con il livello della piattaforma aperto.

Aggiungerebbe profili, follower, risposte, feed, comunità, notifiche e conversazioni pubbliche in tempo reale mantenendo i servizi sottostanti sostituibili. 5chan dimostra che le comunità anonime possono funzionare. Seedit si muove verso una discussione persistente. L’app di punta porterebbe questi effetti di rete in un feed sociale tradizionale senza rendere un’azienda proprietaria del grafico.

Questa pagina descrive la direzione del prodotto, non una specifica di rilascio bloccato. L'interfaccia esatta, il feed predefinito, il modello di annunci, le funzionalità AI e il marketplace RPC possono cambiare man mano che il protocollo e le prime app maturano.

## Cosa dovrebbe dimostrare

L'app dovrebbe dimostrare che un social network basato sui profili può evitare di diventare una piattaforma di custodia:

- gli utenti possono possedere identità e profili
- le comunità e i nodi del profilo possono rimanere peer-to-peer
- le comunità possono portare effetti di rete tra i client Bitsocial
- I fornitori RPC possono rendere l'app conveniente senza assumerne la custodia
- gli algoritmi di feed possono essere servizi opzionali anziché la legge della piattaforma
- altri clienti possono ancora competere per la stessa rete

Il punto non è rendere l'unico client Bitsocial. Il punto è creare il primo client ampio che mostri fino a che punto il protocollo può estendersi.

## Familiare per impostazione predefinita, sostituibile per progettazione

L'esperienza predefinita dovrebbe essere competitiva con le principali app di conversazione pubblica: un feed home veloce, follower, risposte, distribuzione in stile repost, community, notifiche, ricerca e una visualizzazione classificata Per te che funzioni immediatamente.

Bitsocial Forge può eseguire il primo servizio RPC e feed predefinito. Questa impostazione predefinita può includere un feed classificato e annunci pubblicitari in modo che l'app sembri completa fin dal primo giorno invece di chiedere agli utenti tradizionali di assemblare l'intero stack da soli.

La differenza è che il default non deve diventare la prigione. Un utente dovrebbe essere in grado di cambiare RPC, feed, istanze, sistemi di classificazione, annunci e provider di rilevamento o rimuovere completamente la classificazione. L'app può essere supponente al primo avvio mantenendo sostituibili tutti i servizi principali.

Ciò rende l'app più personalizzabile rispetto a una piattaforma convenzionale. Un utente potrebbe mantenere il feed classificato predefinito con gli annunci. Un altro potrebbe utilizzare un feed cronologico senza classificazione. Un altro potrebbe scegliere un RPC incentrato sulla privacy, un servizio di scoperta gestito dalla comunità, un feed senza pubblicità a pagamento o un algoritmo di nicchia creato per una sottocultura specifica.

## Comunità tra clienti

Le comunità dovrebbero essere molto più importanti dei gruppi isolati all'interno di un'app.

Su X/Twitter, le comunità sono confinate all'interno di X. Possono essere utili, ma ereditano i limiti di una piattaforma, un sistema di account, uno stack di raccomandazioni e una superficie di prodotto.

Una comunità Bitsocial può essere creata, ospitata, scoperta e utilizzata attraverso diversi client. Ciò significa che l'app di punta può mostrare community e post dal più ampio network Bitsocial, non solo dagli utenti che hanno iniziato all'interno dell'app di punta. Una comunità potrebbe avere attività da un client di imageboard, un client di discussione in stile Reddit, un client di forum di nicchia, un'app mobile e l'app di punta allo stesso tempo.

Questo è il vantaggio principale dell'effetto rete: un client può sembrare familiare agli utenti tradizionali pur continuando a trarre valore da molti client, nodi di comunità, fornitori RPC e servizi indipendenti.

## Algoritmi di feed opzionali

L’app di punta non dovrebbe imporre a tutti un sistema di classificazione globale.

Gli algoritmi dei feed dovrebbero essere attivabili. Un utente può scegliere un algoritmo da un mercato, cambiare fornitore, utilizzare un algoritmo di un’azienda, utilizzarne uno gestito da un operatore anonimo, utilizzarne uno creato da una comunità, eseguirne uno personale o non utilizzare alcun algoritmo.

I fornitori di RPC pubblici rappresentano il luogo naturale in cui questi servizi possono competere. Possono indicizzare, classificare e consigliare contenuti, ma non dovrebbero possedere l'utente o il profilo.

Tali servizi possono anche competere sulla forma dell’app stessa. Un RPC potrebbe fornire un feed classificato con annunci. Un altro potrebbe fornire un feed cronologico non classificato. Un altro potrebbe specializzarsi in privacy, traduzione, moderazione, scoperta della comunità o un grafico sociale di nicchia.

Se l’economia funziona, i servizi di feed supportati da RPC potrebbero aggiungere funzionalità di intelligenza artificiale simili a quelle che le piattaforme tradizionali stanno cercando di inserire nei loro feed: traduzioni automatiche, riepiloghi, risposte assistite da bot, risposte di ricerca, assistenza alla moderazione o contesto in stile nota della comunità.

Tali funzionalità dovrebbero essere scelte di servizio, non requisiti di protocollo. Una RPC predefinita può competere offrendo un feed più ricco, ma gli utenti e i clienti concorrenti dovrebbero comunque essere in grado di scegliere alternative più semplici, private, cronologiche, senza pubblicità o specifiche della comunità.

## RPC non detentivo

Ogni utente dovrebbe essere in grado di partecipare come nodo peer-to-peer completo tramite RPC senza conferire al provider RPC la proprietà della propria identità o profilo.

Il percorso ospitato è importante perché la maggior parte degli utenti non inizierà eseguendo un server. Il percorso di uscita è altrettanto importante: un utente dovrebbe essere in grado di spostarsi sul proprio nodo del profilo su hardware con specifiche ridotte, incluso un Raspberry Pi, ogni volta che lo desidera.

Questa è la differenza tra convenienza e custodia.

## Perché può diventare un'app tutto

Se Bitsocial Network offrisse alle app nomi durevoli, pagamenti, mance, premi e altri strumenti finanziari, l'app di punta potrebbe diventare molto più di un semplice client di feed.

Il vincolo importante è che l’app non diventi il ​​nuovo proprietario della rete. Può essere un client di grandi dimensioni, forse anche il client più popolare, lasciando comunque spazio ad app concorrenti, RPC concorrenti, algoritmi di feed concorrenti e nodi di profilo self-hosted.
