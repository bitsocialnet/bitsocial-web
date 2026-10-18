---
title: Bitsocial e Quorum
description: Come Quorum, l'app di messaggistica di gruppo con cifratura end-to-end di Quilibrium, organizzata in Space in stile Discord, si confronta con le comunità pubbliche peer-to-peer di Bitsocial.
---

# Bitsocial e Quorum

[Quorum](https://www.quorummessenger.com/) è un'app di messaggistica di gruppo di Quilibrium Inc.,
la società che sta dietro la rete [Quilibrium](https://quilibrium.com/). È organizzata come
Discord, con Space, canali, ruoli e messaggi diretti, e i suoi messaggi sono cifrati end-to-end.
Viene citata accanto a Bitsocial perché entrambi si descrivono come peer-to-peer e resistenti alla
censura, con gruppi che stabiliscono le proprie regole. Puntano però a obiettivi diversi: Quorum alla
chat di gruppo privata, Bitsocial a comunità pubbliche che chiunque può leggere.

Quilibrium si descrive come un'alternativa decentralizzata alle piattaforme cloud: una rete di nodi
che conservano i dati in un ipergrafo cifrato e si accordano sul suo stato tramite un meccanismo di
consenso che chiama Proof of Meaningful Work. I nodi guadagnano QUIL, il token della rete, con cui si
pagano le commissioni d'uso. Quorum è nata nel 2018 come Howler, l'idea di un'alternativa privata a
Discord, ed è diventata la prima app a entrare in funzione su Quilibrium, secondo la
[storia di Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc., fondata
da Cassie Heart, sviluppa il protocollo e offre Quorum come uno dei suoi servizi gestiti
([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Come funziona Quorum

I dettagli che seguono provengono dal codice sorgente dei client di Quorum, aggiornato a ottobre
2026: [quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) per le app web e desktop
e [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile).

- **Identità.** L'identità principale di un utente è un insieme di chiavi Ed448, e ogni dispositivo
  riceve le proprie chiavi X448 ed Ed448. Nel browser le chiavi sono normalmente protette da una
  passkey; l'app mobile le ricava da una frase di recupero. Gli indirizzi sono hash che iniziano con
  `Qm`, e gli utenti possono mostrare un nome utente preso dal servizio dei nomi di Quilibrium.
- **Cifratura.** I messaggi diretti usano il Double Ratchet tra dispositivi. Uno Space condivide
  un'unica sessione Triple Ratchet tra i suoi membri, che firmano i propri messaggi con chiavi
  specifiche dello Space. Ogni Space è cifrato. Quorum afferma che il suo sistema di intermediazione
  dei messaggi impedisce di collegare mittenti e destinatari, ma il client web e desktop si iscrive
  a tutte le caselle di posta di un dispositivo, compresa quella indicata nella registrazione
  pubblica dell'utente, con
  [un'unica richiesta](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  al servizio, che può quindi ricondurle all'indirizzo dell'utente.
- **Accesso.** Si entra negli Space tramite link di invito. Un link monouso porta nell'URL le chiavi
  per entrare; un link pubblico le recupera dal servizio Quorum, e gli Space pubblici possono essere
  elencati in una directory ricercabile.
- **Trasporto.** Per la messaggistica, i client web, desktop e mobile si collegano tutti, via HTTPS
  e tramite un WebSocket, a un unico servizio,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Questo inoltra i messaggi cifrati alla casella di posta di ciascun membro e li conserva finché il
  client non ne conferma la ricezione. Memorizza inoltre le registrazioni degli utenti, i profili
  pubblici attivati volontariamente, il manifest cifrato di ogni Space (canali, ruoli, emoji), il
  materiale degli inviti, la directory pubblica e la sincronizzazione cifrata e facoltativa delle
  impostazioni. Il software dei nodi di Quilibrium ha un servizio di inbox e di hub con la stessa
  struttura, ma né i client né la documentazione di Quilibrium spiegano come questo servizio si
  collochi rispetto alla rete.
- **Cronologia.** Il client di ogni membro conserva la propria copia dello Space nello storage
  locale, ed entrambi i client recuperano dalle proprie caselle di posta sul servizio i messaggi
  inviati mentre erano offline. Per la cronologia più vecchia, il client web e desktop chiede a un
  membro online di sincronizzarsi, mentre il client mobile riproduce un log durevole che il servizio
  conserva per ogni Space.
- **Moderazione.** I ruoli concedono la possibilità di eliminare, fissare, silenziare e usare le
  menzioni `@everyone`. Il client di ogni membro verifica la firma su ogni azione di moderazione e la
  applica solo se il firmatario ha il ruolo giusto. Il proprietario può espellere un membro, il che
  ruota le chiavi dello Space in modo che il membro espulso non possa leggere i nuovi messaggi. Uno
  Space può richiedere messaggi firmati o lasciare che i membri pubblichino messaggi non firmati e
  ripudiabili. Le voci della directory pubblica hanno uno stato di revisione, e gli utenti possono
  segnalare al servizio Quorum gli Space e, dall'app mobile, i singoli messaggi.
- **Codice.** Il client web e desktop è distribuito con licenza AGPL-3.0 e il client mobile con
  licenza GPL-3.0. Il client mobile include anche un wallet crypto, l'integrazione con Farcaster e
  Apex, un abbonamento a pagamento descritto più avanti.

## Dove differiscono

### Gruppi privati e comunità pubbliche

Uno Space di Quorum è un gruppo di membri: solo chi ne possiede le chiavi può leggerlo, e per
entrare serve un link di invito. Un link pubblico permette a chiunque di entrare, ma solo unendosi
allo Space. Una comunità Bitsocial non prevede iscrizioni. Chiunque può leggerla, da qualsiasi app,
senza unirsi, e chiunque può provare a pubblicarvi, a condizione di superare la sfida della
comunità.

### Cosa tiene online un gruppo

Uno Space di Quorum non ha un nodo host. I membri inviano i messaggi tramite il servizio Quorum, che
ne conserva una copia per ciascun membro finché il suo client non la ritira, e il proprietario non
deve essere online perché gli altri possano conversare. Una comunità Bitsocial vive sul nodo del suo
proprietario, che accetta o rifiuta ogni post e pubblica l'ultimo stato della comunità. La comunità
resta leggibile finché i peer ne fanno il seeding, ma non può accettare nuovi post finché il suo
nodo è offline. Vedi [Protocollo peer-to-peer](/peer-to-peer-protocol/).

### Chi fa rispettare le regole

In Quorum le regole vengono applicate ai margini della rete. Il client di ogni membro decide se
applicare un'eliminazione, un fissaggio o un silenziamento in base al ruolo del firmatario, e
un'espulsione funziona spostando tutti gli altri su nuove chiavi. Inoltre, il gestore del servizio
riceve le segnalazioni ed esamina la directory pubblica. In Bitsocial le regole vengono applicate
sul nodo della comunità: un post che non supera la sfida della comunità non viene mai accettato, e
il nodo applica le rimozioni decise dai suoi moderatori. Vedi
[Moderazione locale, non divieti globali](/local-moderation/).

### Controllo dello spam

Quorum tiene fuori lo spam soprattutto tramite gli inviti. Un link monouso ammette una persona, un
link pubblico ammette chiunque lo possieda, e il proprietario può poi espellere e cambiare le
chiavi. I client limitano anche la velocità con cui un membro può inviare messaggi, e il client web
e desktop scarta, per qualsiasi mittente, i messaggi negli Space oltre i 10 in 10 secondi. Le
identità Bitsocial sono coppie di chiavi gratuite, quindi ogni comunità sceglie una sfida da
eseguire prima di accettare un post, come un captcha, un pagamento, un saldo di token o una
allowlist. Vedi [Sfide anti-spam personalizzate](/custom-challenges/).

### Il client e la rete

Un'app Quorum è un client del servizio Quorum, gestito da Quilibrium Inc. Le app non partecipano
esse stesse a una rete peer-to-peer, quindi raggiungere uno Space dipende da quell'unico endpoint.
Separatamente, Quilibrium è una rete a sé: a ottobre 2026 il suo
[explorer](https://dashboard.quilibrium.com/) mostrava 114 peer raggiungibili e 181 prover
distribuiti su 99 shard.

Un'app web Bitsocial può eseguire un nodo libp2p nella scheda, recuperare i contenuti della comunità
dai peer e pubblicare tramite gossipsub. La scoperta dei peer passa per router HTTP che restituiscono
solo indirizzi dei fornitori; chiunque può gestirne uno, e i client possono cambiare router
modificando la propria configurazione. Vedi [Peer-to-peer nel browser](/browser-p2p/).

### Economia

Quilibrium ha al centro un token. QUIL viene minato dai nodi e serve a pagare le commissioni di rete,
e una versione wrapped, wQUIL, circola su Ethereum. Quorum di per sé è gratuita e non richiede
pagamenti né un numero di telefono. Il suo abbonamento facoltativo Apex costa
[5 dollari al mese](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
pagati in wQUIL, SNAP o USDC su Ethereum e ripartiti tra Quilibrium Inc. e quattro Space scelti
dall'abbonato. Bitsocial non ha un livello di pagamento nel protocollo; una comunità può richiedere
un pagamento o un token tramite la sua sfida.

### Messaggi privati

Qui Quorum è più forte. I messaggi diretti e quelli degli Space sono cifrati end-to-end con forward
secrecy, e il contenuto dei messaggi raggiunge il servizio Quorum solo come testo cifrato, tranne
quando un membro segnala un messaggio dall'app mobile, che ne invia il contenuto ai moderatori di
Quorum. Bitsocial si concentra sulle comunità pubbliche e non ha ancora messaggi diretti nativi. Un
post Bitsocial è cifrato con la chiave del nodo della comunità mentre viaggia su pubsub, ma una
volta accettato è pubblico.

## Stato del progetto

A ottobre 2026 il repository di Quorum definiva l'app web una beta, e il sito di Quorum elencava
ancora le app per Google Play e App Store come «in arrivo». Anche i due client divergono: l'app
mobile ha le funzioni di wallet, Farcaster e Apex, mentre il client web e desktop mostra le sue
pagine Wallet e Farcaster come «in arrivo», e i due recuperano la cronologia degli Space in modi
diversi.

La mainnet di Quilibrium ha raggiunto la versione 2.1 il 30 settembre 2025, quando la rete è
ripartita dopo un arresto ([annuncio](https://x.com/QuilibriumInc/status/1973082817236984270)). Nel
2026 il nodo è stato riscritto in Rust, con firme post-quantistiche per il consenso e un protocollo
di rete che i nodi più vecchi non sanno parlare. Parti della documentazione descrivono il progetto
anziché il codice in esecuzione: descrivono il
[routing mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/). I nodi
inoltrano effettivamente il traffico tra loro attraverso circuiti con onion routing, ma nel nodo
2.1.0.25 il servizio mixnet è uno
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
che accetta i messaggi senza mescolarli.

## Confronto

| Domanda                      | Quorum                                                                                                                     | Bitsocial                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Categoria                    | App di messaggistica di gruppo con cifratura end-to-end di Quilibrium Inc.                                                 | Rete di comunità peer-to-peer                                                                              |
| Identità                     | Insieme di chiavi principale Ed448 più chiavi per dispositivo, protette da una passkey o da una frase di recupero          | Coppie di chiavi Ed25519 per utenti e comunità                                                             |
| Chi può leggere              | I membri che possiedono le chiavi di uno Space                                                                             | Chiunque, da qualsiasi app                                                                                 |
| Dove risiedono i messaggi    | Il dispositivo di ogni membro; il servizio Quorum conserva le copie non ancora consegnate e un log per Space per il mobile | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding                      |
| A cosa si collegano i client | Il servizio Quorum su `api.quorummessenger.com`                                                                            | Peer tramite libp2p, trovati attraverso router HTTP, anche da una scheda del browser                       |
| Comunità                     | Space con canali, ruoli e link di invito                                                                                   | Oggetti di prima classe il cui nodo accetta o rifiuta i post                                               |
| Controllo dello spam         | Link di invito, espulsioni con cambio delle chiavi, limiti di frequenza lato client                                        | La sfida di ciascuna comunità prima che un post venga accettato                                            |
| Moderazione                  | Ruoli fatti rispettare dal client di ogni membro; il proprietario espelle; le segnalazioni vanno al gestore del servizio   | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                                  |
| Messaggi privati             | Messaggi diretti cifrati end-to-end                                                                                        | Comunità pubbliche; ancora nessun messaggio diretto nativo                                                 |
| Economia                     | Token di rete QUIL; abbonamento Apex facoltativo da 5 dollari al mese                                                      | Niente nel protocollo; una sfida può richiedere un pagamento o un token                                    |
| Compromesso principale       | Gruppi privati e cifrati, ma ogni client dipende da un unico servizio                                                      | Identità gratuite e accesso dal browser, ma niente messaggistica privata e si conserva solo l'ultimo stato |
