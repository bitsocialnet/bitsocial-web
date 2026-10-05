---
title: Bitsocial e Mirage
description: Come Mirage, un forum in stile Reddit sulla propria blockchain Cosmos SDK, si confronta con Bitsocial e con la sua app in stile Reddit, Seedit.
---

# Bitsocial e Mirage

[Mirage](https://mirage.foundation/) è una rete di discussione in stile Reddit con comunità, post a
thread e voti. Invece di un database aziendale, gira su una propria blockchain, una catena Cosmos
SDK con consenso CometBFT. Il prodotto di Bitsocial più vicino è [Seedit](/apps/seedit/), un'app in
stile Reddit sulla rete Bitsocial, quindi il confronto riguarda soprattutto il modo in cui ciascuno
ospita, possiede e modera le comunità.

## Come funziona Mirage

- **Nodi.** Un nodo Mirage è un unico container Docker che contiene un validatore, un database
  PostgreSQL, un indexer, un'API HTTP e il frontend web. Ogni nodo è anche un validatore. Secondo la
  [guida al deploy](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md),
  per gestirne uno servono un server Ubuntu su amd64 e 10.000.000 di token MIRAGE nell'account
  dell'operatore.
- **Pubblicazione.** Il browser firma ogni azione con la chiave secp256k1 dell'utente, e gli utenti
  gratuiti calcolano anche una piccola proof of work. Il nodo incapsula l'azione in una transazione
  sulla catena e paga la commissione.
- **Lettura.** L'indexer di ciascun nodo copia i dati della catena nel proprio database e serve i
  feed tramite un'API HTTP. I nodi conservano circa una settimana di blocchi, quindi la cronologia
  dei post a lungo termine risiede nel database di ciascun nodo, e un nuovo nodo parte senza la
  cronologia precedente al suo punto di sincronizzazione.
- **Account.** Un account è una chiave derivata da una seed phrase di 12 parole, e la stessa seed
  funziona su qualsiasi nodo. I nomi utente sono registrati sulla catena e sono unici in tutta la
  rete.
- **Comunità.** Ogni nome valido è già una comunità, e nessuno lo possiede. Team di curatori a
  pagamento, ciascuno composto da un massimo di dieci utenti, mantengono una vista moderata di una
  comunità; i lettori scelgono la vista di un team, quella predefinita del nodo o una vista non
  censurata. Vedi le [FAQ di Mirage](https://mirage.talk/faq).
- **Token.** Il token MIRAGE paga gli abbonamenti, ricompensa autori e nodi e dà ai validatori peso
  nella governance. Gli abbonati saltano la proof of work e hanno limiti più alti.

## Dove differiscono

### Chi possiede una comunità

In Seedit chi crea una comunità ne detiene la coppia di chiavi, ne gestisce o ne delega il nodo e la
modera. In Mirage nessuno possiede una comunità: team di curatori in concorrenza offrono viste
moderate dello stesso nome, e la vista predefinita è quella del team scelto dal maggior numero di
abbonati paganti.

### Controllo dello spam

Mirage applica un'unica regola a tutta la rete: gli utenti gratuiti pagano con una proof of work la
cui difficoltà si adegua al volume in arrivo, e gli abbonati la saltano. In Bitsocial ogni comunità
sceglie la propria sfida, dai captcha alle allowlist ai pagamenti. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Infrastruttura

Mirage richiede una blockchain. I validatori raggiungono il consenso su ogni azione, e ogni nodo
esegue uno stack server completo e deve detenere un grosso stake in token. Bitsocial non ha catena:
un nodo di comunità gira su hardware consumer dall'app desktop o da `bitsocial-cli`, e i lettori
possono aiutare a condividere i contenuti.

### Controllo su tutta la rete

Mirage ha una governance onchain pesata in base allo stake dei validatori. Può modificare
difficoltà, prezzi ed emissione dei token, coniare o bruciare token e nominare amministratori le cui
cancellazioni l'indexer di riferimento applica a qualsiasi post. Il codice della catena permette
inoltre alla governance di
[eliminare account](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
e di
[inviare token da qualsiasi indirizzo](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
A ottobre 2026 i blocchi della catena erano prodotti da quattro validatori, e i runbook del progetto
stesso li gestivano tutti e quattro.

Bitsocial non ha un amministratore a livello di protocollo. I proprietari delle comunità moderano le
proprie comunità e le app scelgono cosa mostrare. Vedi
[Moderazione locale, non divieti globali](/local-moderation/).

### Browser

Il client web di Mirage è un client HTTP di un nodo: il browser firma le azioni ma non entra in una
rete peer-to-peer. Le app Bitsocial possono eseguire un nodo peer-to-peer dentro la scheda del
browser. Vedi [Peer-to-peer nel browser](/browser-p2p/).

## Confronto

| Domanda                | Mirage                                                                                                                    | Bitsocial                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Categoria              | Forum su una propria blockchain (Cosmos SDK)                                                                              | Rete di comunità peer-to-peer                                                                                       |
| Identità               | Chiave secp256k1 da una seed di 12 parole, con un nome utente onchain                                                     | Coppie di chiavi Ed25519 per utenti e comunità                                                                      |
| Dove risiedono i post  | Transazioni sulla catena, poi il database PostgreSQL di ciascun nodo                                                      | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding                               |
| Chi lo tiene online    | Nodi validatori, ciascuno con 10.000.000 di MIRAGE                                                                        | Nodo del proprietario della comunità più i seeder di supporto                                                       |
| Comunità               | Nomi senza proprietario con team di curatori a pagamento in concorrenza                                                   | Possedute da una coppia di chiavi; il nodo del proprietario accetta o rifiuta i post                                |
| Controllo dello spam   | Proof of work su tutta la rete; gli abbonati la saltano                                                                   | La sfida di ciascuna comunità prima che un post venga accettato                                                     |
| Moderazione            | Viste dei team di curatori, filtri personali, amministratori nominati dalla governance                                    | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                                           |
| Economia               | Token MIRAGE per abbonamenti, ricompense e stake dei validatori                                                           | Nessuna nel protocollo; una sfida può richiedere un pagamento o un token                                            |
| Browser                | Client HTTP di un nodo                                                                                                    | Nodo peer-to-peer dentro una normale scheda del browser                                                             |
| Compromesso principale | Un unico stato condiviso e ordinato e un'iscrizione semplice, ma pochi validatori e poteri di governance su tutta la rete | Nessuna catena né stake necessari, ma nessun ordinamento globale e i vecchi contenuti non sono garantiti per sempre |
