---
title: Scoperta dei contenuti
description: In che modo Bitsocial separa la scoperta tra pari dalla cura a livello di app.
---

# Scoperta dei contenuti

Bitsocial non inserisce un feed globale, un indice di ricerca o un algoritmo di classificazione nel protocollo. Separa la scoperta dei contenuti in due livelli:

1. **Ricerca rete** trova i peer che attualmente servono una comunità conosciuta.
2. La **cura delle app** decide quali comunità, bacheche, elenchi o post vengono mostrati per primi da un prodotto.

Ciò mantiene il protocollo piccolo lasciando spazio a molte esperienze di scoperta per competere.

## Ricerca di rete

Ogni comunità ha un indirizzo stabile derivato dalla sua chiave pubblica. Quando un client conosce già quell'indirizzo, interroga i router HTTP leggeri per trovare peer che si sono annunciati come fornitori per quello.

I router restituiscono solo gli indirizzi peer del provider. Non memorizzano post, metadati, elenchi di utenti o una directory di comunità leggibile dall'uomo. Dopo che il client ha ricevuto gli indirizzi dei peer, si connette a tali peer e recupera i metadati della community più recenti più i puntatori al contenuto, quindi recupera i dati effettivi dei post tramite hash.

Ciò risponde alla domanda del protocollo: "Dove posso recuperare lo stato più recente per questa comunità?"

## Cura dell'app

La domanda separata sul prodotto è: "Quali comunità dovrebbe vedere per prime un utente?"

Bitsocial lascia questo compito ad app, elenchi e utenti invece di fornire una risposta nella rete. Gli esempi includono:

- un client che mostra le comunità che l'utente già segue
- un elenco predefinito curato per un'app in stile Reddit
- slot di directory per un'app in stile imageboard
- indici di ricerca o classificazione gestiti da un'app specifica
- collegamenti diretti condivisi dagli utenti

Le app possono indicizzare, classificare, filtrare o evidenziare cose diverse senza trasformare tali scelte in leggi di protocollo. Se la superficie di rilevamento di un'app non è utile, un'altra app può crearne una diversa nelle stesse comunità sottostanti.

## App attuali

5chan attualmente utilizza percorsi di directory familiari come `/b/` o `/g/`. Oggi le assegnazioni delle directory vengono gestite tramite un elenco pubblico, con le versioni future che dovrebbero supportare la creazione di bacheche in-app e la votazione per gli slot delle directory.

Seedit utilizza elenchi di comunità predefiniti per la sua prima pagina. È comunque possibile creare e condividere comunità al di fuori dell'elenco predefinito.

In entrambi i casi, l'elenco a livello di app aiuta gli utenti a trovare qualcosa da aprire e la ricerca a livello di protocollo risolve quindi la comunità scelta tra i peer.

## Perché questa divisione è importante

Una singola rete decentralizzata necessita ancora di una buona scoperta, ma il livello di scoperta dovrebbe essere sostituibile. Il protocollo principale di Bitsocial si concentra su indirizzabilità, ricerca peer, pubblicazione e anti-spam. La curation si trova al di sopra di quel livello, dove le app possono sperimentare directory, elenchi predefiniti, feed, criteri di ricerca, voto e moderazione senza richiedere una migrazione a livello di rete.
