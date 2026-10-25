---
title: Directory
description: Come le app Bitsocial permettono alle comunità di competere per un nome di argomento, invece di lasciarlo a chi lo ha rivendicato per primo.
---

# Directory

Su Reddit, un nome come `r/opensource` può appartenere a una sola comunità, e chi la controlla se lo tiene. Se i suoi moderatori fanno scelte che agli utenti non piacciono, l'unica alternativa è aprire `r/opensource2`. La nuova comunità parte da zero iscritti, anche se la maggior parte delle persone iscritte a `r/opensource` teneva all'open source, non a quel particolare team di moderazione.

Le app Bitsocial evitano questo problema con le **directory**. Una directory è un nome di argomento, come `opensource`, per cui le comunità competono. Il percorso breve per quel nome apre la comunità che in quel momento è prima in classifica, così una comunità migliore può subentrare nel nome senza il permesso di nessuno.

## Come funziona

1. **Un codice di directory è un nome di argomento.** Seedit usa percorsi come `/s/funny`. 5chan usa percorsi da imageboard come `/g/`.
2. **Le comunità competono come candidate.** Ogni directory ha un elenco di comunità candidate, ciascuna con il proprio indirizzo esatto, come `funny-posting.bso`.
3. **La candidata meglio classificata si aggiudica il percorso.** Aprendo `/s/funny` si vede la vincitrice attuale.
4. **Perdere non cancella nulla.** Una comunità che non è la vincitrice mantiene il proprio indirizzo, i propri post e i propri iscritti, e chiunque può ancora aprirla direttamente.

## Il nome è una porta d'ingresso, non un'identità

Un codice di directory è solo un percorso di scoperta. Tutto ciò che è duraturo punta a una comunità precisa:

- Iscriversi da `/s/funny` significa iscriversi all'indirizzo esatto della vincitrice attuale. Il codice di directory in sé non viene mai salvato come iscrizione.
- I link ai post usano sempre l'indirizzo esatto della comunità, quindi un vecchio link non può iniziare a puntare a una comunità diversa dopo che la vincitrice è cambiata.
- Quando la vincitrice cambia, Seedit lascia invariate le iscrizioni esistenti e chiede a ogni iscritto se passare alla nuova vincitrice, tenere entrambe o mantenere la comunità attuale. Il passaggio automatico è un'impostazione facoltativa da attivare per ogni directory, e ogni passaggio automatico mostra un avviso con la possibilità di annullarlo.

Una comunità concorrente, quindi, non sottrae le iscrizioni a nessuno. Vince il nome: i nuovi visitatori approdano su di essa, e gli iscritti esistenti ricevono una scelta da fare con un solo clic. Chi preferiva la vecchia comunità se la tiene.

## Perché non assegnare i nomi a chi arriva prima

- **Niente accaparramento dei nomi.** Possedere un buon nome non basta. Una comunità deve restare la migliore candidata per quel nome.
- **Nessun amministratore assegna i nomi.** Un'assegnazione da parte di un amministratore ricreerebbe il veto centrale che Bitsocial è progettato per eliminare.
- **I concorrenti mantengono una via verso il pubblico.** Una comunità rivale punta allo stesso nome invece di ricominciare da capo con un nome peggiore.
- **I client concordano sulla vincitrice.** Seedit classifica le candidate in modo deterministico, quindi ogni client che legge lo stesso snapshot finalizzato della directory mostra la stessa vincitrice. Seedit non sostituisce la vincitrice con un'altra candidata solo perché è temporaneamente irraggiungibile dalla connessione di un utente.

## Come vengono scelte oggi le vincitrici

Le candidate sono pubblicate come file JSON nel repository [bitsocialnet/lists](https://github.com/bitsocialnet/lists), un file per directory, e una comunità entra in una directory tramite una pull request al relativo file. Si tratta di una fase di avvio. L'obiettivo è che il voto sostituisca le pull request come metodo per decidere le vincitrici.

- **Seedit** ordina le candidate di una directory per punteggio, poi per data di aggiunta, poi per indirizzo. Ogni file di directory riporta un numero di revisione, e qualsiasi modifica alle sue candidate o alla sua vincitrice pubblica una nuova revisione.
- **5chan** gestisce una votazione per ogni directory con [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). I client si scambiano schede firmate tramite libp2p gossipsub e calcolano da soli il conteggio, senza alcun server che conti i voti. Per votare bisogna possedere un 5chan Pass, un token non trasferibile, e ogni titolare ha diritto a un voto. Votare per una board non ancora in elenco equivale a candidarla. Le votazioni si svolgono attualmente sulla testnet Base Sepolia e, finché non usciranno dalla testnet, i conteggi vengono mostrati ma non riordinano l'elenco.

## Protocollo o app?

Le directory non fanno parte di PKC, il livello peer-to-peer che archivia e trasporta le comunità. Sono una convenzione che i client applicano al di sopra di esso, insieme agli elenchi predefiniti e alla ricerca; vedi [Scoperta dei contenuti](./content-discovery.md). Un client può leggere gli stessi file di directory, pubblicarne di propri o fare del tutto a meno delle directory, e gli utenti possono comunque aprire qualsiasi comunità tramite il suo indirizzo.
