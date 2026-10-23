---
title: Crea il tuo client Bitsocial
description: Guida per chi vuole realizzare client Bitsocial indipendenti, dagli imageboard ai forum fino alle app sociali di nicchia.
---

# Crea il tuo client Bitsocial

Bitsocial non vince avendo un'unica app ufficiale per ogni caso d'uso. Vince quando molti client
possono condividere lo stesso protocollo mentre competono su interfaccia, cultura, scoperta dei
contenuti, impostazioni predefinite e modello di business.

5chan e Seedit sono le prime conferme, non un tetto. Chi costruisce deve poter pubblicare un nuovo
imageboard, un forum, un client per i profili, un'app sociale pensata prima per il mobile, uno
strumento per una comunità di nicchia o un client centralizzato che usa Bitsocial come base, senza
chiedere il permesso al proprietario di una piattaforma.

## Cosa possono cambiare gli sviluppatori

Un client Bitsocial può competere sulle scelte di prodotto senza forkare l'intera rete:

- interfaccia e linguaggio visivo
- flusso di onboarding
- impostazioni predefinite della comunità
- superfici di moderazione
- modello di scoperta dei contenuti
- esperienza multimediale
- vincoli mobile, desktop o di banda ridotta
- monetizzazione e modello di business

Il livello comune è il protocollo. Il livello di prodotto è aperto alla concorrenza.

## Il modo più rapido per imparare

Parti dalle app che esistono già:

- Prova [5chan](https://5chan.app) per le comunità imageboard anonime.
- Prova [Seedit](https://seedit.app) per la discussione in stile Reddit.
- Leggi la documentazione degli [hook React di Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) per
  l'integrazione lato client.
- Leggi la documentazione della [CLI di Bitsocial](/developer-tools/cli/) per le operazioni su nodi
  e comunità.

Se vuoi muoverti in fretta, contribuisci prima a un'app esistente. Se l'interfaccia, la cultura o il
modello di comunità che hai in mente non ci rientrano, costruisci un client separato.

## Scegli una prima versione ristretta

La prima versione migliore non è un'app sociale universale. È un client con un pubblico chiaro e una
solida ragione di esistere.

Buoni punti di partenza sono:

- un client imageboard più pulito per una cultura specifica
- un client forum pensato prima per il mobile
- un'app dedicata a una sola comunità con impostazioni predefinite rigide
- un client per comunità di creator
- un client di sola lettura per la scoperta dei contenuti
- una console di moderazione o per operatori
- un client ottimizzato per una lingua, una regione o una classe di dispositivi

I client piccoli sono utili perché Bitsocial permette loro di crescere dentro la stessa rete, invece
di intrappolare i loro utenti in un database privato.

## Percorsi di implementazione

Esistono tre percorsi pratici:

1. Forkare un client esistente, quando la tua idea è vicina a 5chan o Seedit.
2. Costruire un nuovo client React con gli [hook React di Bitsocial](https://hooks.bitsocial.net/).
3. Costruire la propria integrazione sopra le API dei nodi e l'infrastruttura RPC pubblica.

L'RPC pubblico dovrebbe rendere il terzo percorso molto più praticabile. Un utente può iniziare
tramite un provider RPC ospitato e non custodiale, per poi passare in seguito al self-hosting o a un
provider concorrente.

## Principio di progettazione

Costruisci il client che dovrebbe esistere per la tua comunità, poi lascia che i client compatibili
competano in pubblico.
