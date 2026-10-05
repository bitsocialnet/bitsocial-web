---
title: Bitsocial e Lapis Net
description: Come Lapis Net, un protocollo social peer-to-peer in Kotlin con punteggi di fiducia per ogni lettore e visibilità sostenuta da Bitcoin, si confronta con Bitsocial.
---

# Bitsocial e Lapis Net

[Lapis Net](https://net.lapisproject.dev/) è un protocollo per social network peer-to-peer scritto
in Kotlin per la JVM. È arrivato in modo indipendente a fondamenta vicine a quelle di Bitsocial:
identità basate su coppie di chiavi, archiviazione dei contenuti in stile IPFS e gossipsub di
libp2p. I due si differenziano per dove collocano il filtro dello spam e la curation. Lapis dà a
ogni lettore un grafo di fiducia personale e permette ai pagamenti Bitcoin e Lightning di aumentare
la visibilità; Bitsocial lascia che ogni comunità decida cosa può essere pubblicato.

Lapis è un prototipo funzionante. Secondo il suo
[repository](https://github.com/lapisproject-dev/Lapis-Net), a ottobre 2026 non aveva ancora una
rete pubblica, e collegare due nodi era un'operazione manuale.

## Come funziona Lapis

- **Identità.** Ogni identità è una coppia di chiavi secp256k1, compatibile con le chiavi Bitcoin, a
  cui è legata una chiave Ed25519 per il peer ID di libp2p.
- **Archiviazione e propagazione.** I contenuti vengono archiviati con Nabu, un'implementazione di
  IPFS su libp2p (DHT e Bitswap), e diffusi con gossipsub di libp2p.
- **Punteggi.** Quattro punteggi facoltativi poggiano su un nucleo che resta neutrale rispetto alla
  curation:
  - Veritas, una rete di fiducia calcolata a partire dal grafo di fiducia di ciascun lettore
  - Virtus, visibilità sostenuta da prove di pagamento onchain o Lightning che decadono nel tempo
  - Karma, like gratuiti pesati in base a Veritas
  - Madli, un punteggio di reputazione che i nodi mantengono sul comportamento reciproco
- **Messaggistica.** Messaggi diretti con cifratura end-to-end, chiamate vocali uno a uno e un
  sistema di messaggi asincrono simile all'e-mail fanno parte del progetto.
- **Client.** Ogni utente esegue un nodo JVM. Il client di riferimento è un'interfaccia web servita
  da quel nodo locale.

## Dove differiscono

### Chi filtra lo spam

Lapis filtra a livello del lettore. I contenuti si propagano, poi il grafo di fiducia di ciascun
lettore e le regole di pagamento dell'app che usa decidono cosa emerge. Bitsocial filtra a livello
della comunità: un post deve superare la sfida della comunità prima che il nodo della comunità lo
accetti, quindi lo spam rifiutato non entra mai a far parte della comunità. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Chi detiene il potere

In Lapis ogni lettore decide di chi fidarsi, e il gestore di ciascuna app decide come funziona lì la
visibilità a pagamento. In Bitsocial il proprietario di una comunità stabilisce le regole per quella
sola comunità, e le app scelgono cosa mostrare. Nessuno dei due ha un amministratore a livello di
protocollo.

### Economia

Lapis integra le prove di pagamento Bitcoin e Lightning nel suo punteggio di visibilità. Bitsocial
non ha un livello di pagamento nel protocollo; una comunità può richiedere un pagamento o un token
tramite la propria sfida.

### Browser

Le app Bitsocial possono eseguire un nodo peer-to-peer dentro una normale scheda del browser. Vedi
[Peer-to-peer nel browser](/browser-p2p/). L'interfaccia browser di Lapis è una pagina locale
servita dal nodo JVM dell'utente.

### Ambito

Lapis include messaggi diretti, chiamate vocali e posta. Bitsocial si concentra sulle comunità
pubbliche e non ha ancora messaggi diretti nativi.

## Confronto

| Domanda                | Lapis Net                                                                                                  | Bitsocial                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Categoria              | Protocollo social peer-to-peer (prototipo)                                                                 | Rete di comunità peer-to-peer                                                         |
| Identità               | Coppia di chiavi secp256k1 con un peer ID Ed25519 associato                                                | Coppie di chiavi Ed25519 per utenti e comunità                                        |
| Dove risiedono i post  | Archiviazione Nabu (IPFS su libp2p) sui nodi partecipanti                                                  | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding |
| Comunità               | Nessun oggetto comunità; la curation avviene per lettore e per app                                         | Oggetti di prima classe il cui nodo accetta o rifiuta i post                          |
| Controllo dello spam   | Grafo di fiducia del lettore, visibilità a pagamento, depositi Lightning per i primi messaggi              | La sfida di ciascuna comunità prima che un post venga accettato                       |
| Moderazione            | Il grafo di fiducia di ciascun lettore; i gestori delle app fissano le regole della visibilità a pagamento | I proprietari moderano la propria comunità; le app scelgono cosa mostrare             |
| Economia               | Prove di pagamento Bitcoin e Lightning nei punteggi                                                        | Nessuna nel protocollo; una sfida può richiedere un pagamento o un token              |
| Browser                | Interfaccia web locale servita da un nodo JVM                                                              | Nodo peer-to-peer dentro una normale scheda del browser                               |
| Rete                   | Prototipo senza rete pubblica                                                                              | Rete attiva con app come [5chan](/apps/5chan/) e [Seedit](/apps/seedit/)              |
| Compromesso principale | Reputazione e messaggistica integrate e ricche, ma ancora nessuna rete pubblica                            | Nucleo più piccolo che gira nei browser, ma senza reputazione o DM integrati          |

## Potrebbero funzionare insieme?

Le sfide di Bitsocial sono codice arbitrario, quindi un punteggio di fiducia in stile Lapis potrebbe
diventarne una. La sfida integrata `whitelist` può già leggere elenchi di indirizzi consentiti da
URL. Un servizio che pubblicasse gli indirizzi Bitsocial considerati affidabili da un grafo Veritas
potrebbe permettere a quegli autori di saltare un CAPTCHA in una comunità. Servirebbe un modo per
collegare un'identità Lapis a un indirizzo Bitsocial, e oggi non esiste nulla del genere.
