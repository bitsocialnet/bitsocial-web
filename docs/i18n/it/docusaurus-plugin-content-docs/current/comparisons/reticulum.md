---
title: Bitsocial e Reticulum
description: Come si confronta Reticulum, lo stack di rete crittografico per LoRa e altri collegamenti a bassa larghezza di banda, con Bitsocial, e se Bitsocial potrebbe funzionare sopra di esso.
---

# Bitsocial e Reticulum

[Reticulum](https://reticulum.network/) è uno stack di rete basato sulla crittografia per costruire
reti su qualunque mezzo di trasmissione sia disponibile: radio LoRa, packet radio, collegamenti
seriali, Wi-Fi, Ethernet, TCP, UDP o I2P. Viene accostato a Bitsocial perché entrambi eliminano
l'azienda che sta nel mezzo. Lo fanno però a livelli diversi, quindi sono complementari più che
concorrenti.

## Livelli diversi

Reticulum sostituisce il livello di rete. Offre alle applicazioni endpoint cifrati e instradabili
senza indirizzi IP, DNS, autorità di certificazione o account, ed è progettato per continuare a
funzionare su collegamenti lenti fino a 5 bit al secondo con un MTU di 500 byte. Non definisce post,
comunità o moderazione; sono le applicazioni costruite sopra ad aggiungerli.

Bitsocial è un protocollo social. Gira sullo stack IPFS/libp2p su normali connessioni internet,
anche da una scheda del browser, e definisce comunità, pubblicazioni e sfide anti-spam per ogni
comunità. Vedi [Protocollo peer-to-peer](/peer-to-peer-protocol/) e
[Peer-to-peer nel browser](/browser-p2p/).

Nello stack di Bitsocial, Reticulum si collocherebbe all'incirca dove si trova libp2p, non dove si
trova il protocollo Bitsocial.

## Come funziona Reticulum

- **Identità.** Un'identità Reticulum è un insieme di chiavi da 512 bit: una chiave X25519 per la
  cifratura e una chiave Ed25519 per le firme.
- **Destinazioni.** Le applicazioni creano destinazioni, indirizzate tramite un hash SHA-256
  troncato a 16 byte. I pacchetti non riportano alcun indirizzo di origine.
- **Annunci.** Una destinazione diventa raggiungibile inviando un annuncio. I nodi di trasporto lo
  inoltrano e ricordano il salto successivo per tornare verso di essa, così nessun nodo ha bisogno
  di una mappa dell'intera rete.
- **Cifratura.** Il traffico è cifrato per impostazione predefinita, con chiavi effimere e forward
  secrecy.
- **LXMF.** Il livello di messaggistica [LXMF](https://github.com/markqvist/LXMF) aggiunge messaggi
  firmati, consegna diretta e store-and-forward tramite nodi di propagazione per i destinatari
  offline.

Tra le applicazioni costruite in questo modo ci sono
[Sideband](https://github.com/markqvist/Sideband) per la messaggistica e
[Nomad Network](https://github.com/markqvist/NomadNet) per la messaggistica e le pagine ospitate. Il
manuale di Reticulum mantiene un
[elenco di programmi](https://reticulum.network/manual/software.html).

## Confronto

| Domanda              | Reticulum                                                                                                                 | Bitsocial                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Che cos'è            | Stack di rete                                                                                                             | Protocollo social peer-to-peer e app                                                                              |
| Progettato per       | Qualsiasi mezzo di trasmissione, fino ai collegamenti radio lenti                                                         | Connessioni internet, comprese le schede del browser                                                              |
| Identità             | Insieme di chiavi X25519 ed Ed25519                                                                                       | Coppie di chiavi Ed25519 per utenti e comunità                                                                    |
| Indirizzi            | Hash di un'identità e del nome di un'applicazione                                                                         | Hash della chiave pubblica di una comunità                                                                        |
| Trovare un peer      | Annunci propagati dai nodi di trasporto                                                                                   | I router HTTP restituiscono i peer fornitori                                                                      |
| Funzionalità social  | Aggiunte da applicazioni come Nomad Network                                                                               | Comunità, post, risposte e moderazione nel protocollo                                                             |
| Controllo dello spam | Limiti di frequenza degli annunci per interfaccia; timbri proof-of-work LXMF che un destinatario o un nodo può richiedere | La sfida di ciascuna comunità prima che un post venga accettato                                                   |
| Consegna offline     | I nodi di propagazione LXMF conservano e inoltrano i messaggi                                                             | I peer continuano a servire lo stato più recente di una comunità; per pubblicare serve che il suo nodo sia online |

## Bitsocial potrebbe funzionare sopra Reticulum?

Non oggi. Bitsocial non ha un trasporto Reticulum e il suo modello dati presuppone la larghezza di
banda di internet: un client recupera dai peer i metadati delle comunità e il contenuto dei post e
scambia messaggi pubsub, cosa che si adatta male a collegamenti costruiti attorno a pacchetti da 500
byte e a un throughput misurato in bit o kilobit al secondo.

La strada realistica è più stretta: un client che funzioni su una mesh locale mentre è disconnesso,
e che poi si sincronizzi con la rete Bitsocial più ampia quando è raggiungibile un peer o un gateway
con accesso a internet. Si tratterebbe di un nuovo client con un bridge, non di una modifica al
protocollo, e non rientra nella roadmap attuale.

## Per chi sviluppa

Reticulum è distribuito con la
[Reticulum License](https://reticulum.network/manual/license.html): termini in stile MIT più due
restrizioni. Il software non può essere usato in sistemi progettati per fare del male alle persone,
né per creare dataset di addestramento per AI o machine learning. Leggila prima di includere codice
di Reticulum in un'app Bitsocial.

L'implementazione di riferimento è [scritta in Python](https://github.com/markqvist/Reticulum). I
maintainer di Reticulum avvertono che diversi port non ufficiali di Reticulum e LXMF sono generati
automaticamente e riportano dichiarazioni di licenza che considerano nulle, quindi preferisci
l'implementazione di riferimento o i programmi elencati nel manuale.
