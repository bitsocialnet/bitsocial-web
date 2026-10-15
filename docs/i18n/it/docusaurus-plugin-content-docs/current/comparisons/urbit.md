---
title: Bitsocial e Urbit
description: Come Urbit, una rete di server personali con Urbit ID basati su Ethereum e gruppi ospitati da un host in Tlon Messenger, si confronta con le comunità peer-to-peer di Bitsocial.
---

# Bitsocial e Urbit

[Urbit](https://urbit.org/) è una rete di server personali. Ogni utente ha un computer sempre
acceso, chiamato nave, che esegue il sistema operativo proprio di Urbit (Arvo), scritto nei
linguaggi propri di Urbit (Nock e Hoon), ed è identificato da un Urbit ID. La sua principale app
social è [Tlon Messenger](https://tlon.io/), realizzata da Tlon, l'azienda fondata nel 2013 per
sviluppare Urbit.

Urbit punta a sostituire l'intero stack informatico, quindi è un progetto molto più ampio di
Bitsocial. Il suo livello social, però, usa un modello vicino a quello di Bitsocial: una comunità
vive sul nodo del suo proprietario, ed è quel nodo a decidere cosa può entrare. I due differiscono
su chi deve far girare un server e su come si tiene fuori lo spam.

## Come funziona Urbit

- **Urbit ID.** Ogni nave ha un Urbit ID: un numero mostrato come un nome pronunciabile, per
  esempio `~sampel-palnet`. Gli ID di Layer 1 sono NFT la cui proprietà e le cui chiavi pubbliche di
  rete sono registrate nei contratti Azimuth su Ethereum. Gli ID di Layer 2, aggiunti nel 2021 per
  ridurre le commissioni, usano un «rollup ingenuo»: le loro transazioni vengono pubblicate su
  Ethereum a lotti, ma la loro proprietà non è memorizzata nel contratto Azimuth, e ogni nave la
  calcola localmente. Tlon gestisce un roller che chiunque può usare gratuitamente, secondo la
  [documentazione di Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) e
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Una gerarchia fissa.** Lo spazio degli indirizzi comprende 256 galassie, 65.536 stelle e circa
  4 miliardi di pianeti per l'uso quotidiano. Le galassie emettono stelle, le stelle emettono
  pianeti, e ogni pianeta può emettere lune per i propri dispositivi. Le comete sono ID gratuiti
  che una nave genera per sé e che non toccano mai la blockchain. I proprietari delle galassie
  formano il Galactic Senate, che vota gli aggiornamenti dei contratti Azimuth ed elegge il
  consiglio di amministrazione della Urbit Foundation.
- **Rete.** Le navi si scambiano pacchetti cifrati peer-to-peer. Da luglio 2026 il protocollo di
  rete è [Directed Messaging](https://urbit.org/blog/directed-messaging), una riscrittura
  incentrata sui contenuti del vecchio protocollo Ames. Le galassie si occupano della scoperta dei
  peer: ciascuna tiene traccia di dove si trovano le navi sotto di lei e inoltra loro i pacchetti
  finché le due navi non riescono a raggiungersi direttamente, o per tutto il tempo in cui un
  firewall lo impedisce, secondo
  l'[articolo su Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Gruppi.** In Tlon Messenger un gruppo è ospitato dalla nave di chi lo ha creato. I membri
  inviano i messaggi all'host, che li distribuisce alla nave di ogni membro, e la nave di ogni
  membro conserva la propria copia, secondo le [FAQ di Tlon](https://tlon.io/posts/faq). L'host
  controlla ruoli, canali e ammissioni. Un gruppo può essere pubblico, privato o segreto, e può
  [bandire singole navi o interi ranghi di ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  I canali sono chat, taccuini o raccolte di immagini e link.
- **Hosting.** Registrandosi con Tlon, un nuovo utente riceve una nave gestita da Tlon, con chiavi
  che Tlon tiene in custodia. Un utente può esportare la nave e il suo master ticket e farla girare
  altrove: su un dispositivo [Native Planet](https://www.nativeplanet.io/), oppure con il runtime
  Vere su Linux, macOS o Windows. Le navi non possono ancora memorizzare direttamente file di
  grandi dimensioni, quindi Tlon Messenger mette immagini e altri contenuti multimediali in uno
  storage cloud compatibile con S3.

## Dove differiscono

### Chi deve far girare un server

Su Urbit ogni partecipante è un server. Le app di Tlon sono front end per la nave dell'utente, e
perfino leggere un gruppo passa attraverso di essa. Chi non fa girare una nave in proprio ne
affitta una, il che riporta in gioco un fornitore di hosting: Tlon detiene le chiavi degli utenti
ospitati e mantiene un accesso limitato per la manutenzione, anche se gli utenti possono andarsene
portando con sé l'intera nave.

Su Bitsocial solo i proprietari delle comunità hanno bisogno di un nodo sempre acceso. Chi legge e
chi pubblica può eseguire un nodo peer-to-peer dentro una scheda del browser, e il suo account è
una coppia di chiavi che l'app conserva. Vedi [Peer-to-peer nel browser](/browser-p2p/). Quando
qualcuno usa comunque un nodo in hosting, il design di Bitsocial punta a consentirgli di delegare
la disponibilità senza cedere la custodia della propria identità. Vedi
[Identità e proprietà della comunità](/identity-and-ownership/).

### L'host della comunità

È qui che i due sono più vicini. Un gruppo Tlon e una comunità Bitsocial vivono entrambi sul nodo
del loro proprietario. L'host decide chi può pubblicare, applica la moderazione e distribuisce il
risultato, e nessuno dei due protocolli mette un moderatore al di sopra dell'host. In entrambi,
l'host deve essere online. Le FAQ di Tlon dicono che se l'host va offline «il gruppo cade insieme a
lui», e una comunità Bitsocial non può accettare nuovi post finché il suo nodo è offline.

Conservano i contenuti in modo diverso. La nave di ogni membro conserva una copia della cronologia
del gruppo, quindi i membri possono ancora leggere ciò che hanno già ricevuto mentre l'host non è
raggiungibile. Un lettore Bitsocial recupera l'ultimo stato della comunità dal nodo della comunità
o dai peer che ne fanno il seeding, quindi una comunità offline resta leggibile finché i peer ce
l'hanno, ma la rete conserva solo l'ultimo stato.

Un gruppo Tlon ha anche un elenco di membri, e il suo host può renderlo accessibile solo su invito.
Una comunità Bitsocial non prevede iscrizioni: chiunque può leggerla, e chiunque può provare a
pubblicarvi, a condizione di superare la sua sfida.

### Spam e identità

Urbit combatte lo spam rendendo l'identità scarsa. Il numero di pianeti è fisso e ciascuno è
emesso da una stella. Le comete gratuite aggirano questa scarsità, quindi i gruppi che vogliono che
regga le respingono: la documentazione di Urbit osserva che alcuni gruppi rifiutano le comete, e un
gruppo Tlon può bandire l'intero rango delle comete con una sola impostazione. Una volta escluse le
comete, un utente bandito ha bisogno di un altro pianeta, ottenuto dal proprietario di una stella,
per tornare. Anche la reputazione può seguire la gerarchia: Azimuth include un contratto Censures
che consente a galassie e stelle di segnalare ID. Poiché la scarsità è incorporata nello spazio
degli indirizzi, funziona allo stesso modo in ogni gruppo che respinge le comete.

Le identità Bitsocial sono coppie di chiavi gratuite. Ogni comunità sceglie la propria sfida prima
di accettare un post, come un captcha, un pagamento, un saldo di token o una allowlist, e altre
comunità possono scegliere diversamente. Vedi
[Sfide anti-spam personalizzate](/custom-challenges/).

### Blockchain e governance

Il livello di identità di Urbit dipende da Ethereum. I contratti Azimuth registrano la proprietà
di Layer 1 e le chiavi di rete, le transazioni di Layer 2 vengono pubblicate su Ethereum a lotti, e
il Galactic Senate può aggiornare il contratto che governa Azimuth. Le stesse 256 galassie
gestiscono anche la scoperta dei peer e l'inoltro, quindi un insieme fisso di identità regge sia la
governance sia una parte dell'instradamento della rete.

Le identità Bitsocial sono coppie di chiavi che non richiedono alcuna registrazione. I nomi `.bso`
e `.eth` sono alias facoltativi che si risolvono in esse. La scoperta dei peer passa per router
HTTP che restituiscono solo indirizzi dei fornitori; chiunque può gestirne uno, e i client possono
cambiare router modificando la propria configurazione.

### Ambito

Urbit è un computer di uso generale. Una nave può ospitare un remote Git, una base di conoscenza
personale o agenti di IA, e Tlon Messenger è un programma tra tanti. Sviluppare per Urbit
significa per lo più scrivere app Hoon per Arvo. Bitsocial è un protocollo per comunità pubbliche,
con app come [5chan](/apps/5chan/) e [Seedit](/apps/seedit/). Gira sullo stack esistente (libp2p,
IPFS e il browser) invece di sostituirlo, e i suoi client si costruiscono con i normali strumenti
del web. Vedi [Crea il tuo client](/build-your-own-client/).

### Messaggi privati

Qui Urbit è più forte. I messaggi diretti vanno da una nave direttamente all'altra, tutto il
traffico tra navi è cifrato, e i gruppi possono essere privati o segreti. Tlon precisa che i
messaggi sono cifrati in transito ma memorizzati in chiaro sulla nave. Bitsocial si concentra
sulle comunità pubbliche e non ha ancora messaggi diretti nativi.

## Stato del progetto

Urbit ha attraversato un periodo di sconvolgimenti. Nell'agosto 2024 la Urbit Foundation,
l'organizzazione no profit che guida lo sviluppo del core, ha licenziato il suo direttore
esecutivo; il fondatore Curtis Yarvin è tornato a guidare la strategia senza un titolo formale,
diversi sviluppatori del core se ne sono andati, e le risorse della Foundation bastavano ormai solo
per pochi mesi,
[secondo CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin ha proposto di spostare Azimuth su un layer 2 di Ethereum già esistente, con Base come
scelta probabile, e di emettere token fungibili «visto» convertibili in pianeti. A ottobre 2026 la
[documentazione degli ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) di Urbit descrive
ancora Azimuth su Ethereum con il suo rollup ingenuo. Nell'ottobre 2025 il Galactic Senate ha
sostituito il consiglio di amministrazione della Foundation, e il nuovo consiglio ha nominato un
nuovo direttore esecutivo
([annuncio](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Lo sviluppo continua. Directed Messaging è entrato in funzione con la release 408k il
14 luglio 2026. A giugno 2026 Tlon Messenger
[ha aperto le registrazioni pubbliche senza lista d'attesa](https://urbit.org/blog/this-month-in-urbit-june-2026),
e Tlon ora si presenta come un luogo in cui persone e agenti di IA lavorano insieme.

## Confronto

| Domanda                 | Urbit                                                                                                | Bitsocial                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Categoria               | Rete di server personali e sistema operativo                                                         | Rete di comunità peer-to-peer                                                                              |
| Identità                | Urbit ID: circa 4 miliardi di pianeti su Ethereum o sul suo rollup di Layer 2, più comete gratuite   | Coppie di chiavi Ed25519 per utenti e comunità                                                             |
| Chi fa girare un server | Ogni utente, sulla propria nave o su una in hosting                                                  | I proprietari delle comunità; chi legge e chi pubblica può usare una scheda del browser                    |
| Dove risiedono i post   | La nave dell'host del gruppo e una copia sulla nave di ogni membro                                   | Il nodo del proprietario della comunità e i peer che la leggono e ne fanno il seeding                      |
| Comunità                | Gruppi ospitati dalla nave del loro creatore, con elenchi di membri                                  | Oggetti di prima classe il cui nodo accetta o rifiuta i post                                               |
| Controllo dello spam    | ID scarsi emessi dalle stelle; i gruppi bandiscono navi o interi ranghi                              | La sfida di ciascuna comunità prima che un post venga accettato                                            |
| Moderazione             | Ruoli e ban decisi dall'host del gruppo                                                              | I proprietari moderano la propria comunità; le app scelgono cosa mostrare                                  |
| Scoperta dei peer       | Le galassie tengono traccia delle navi sotto di loro e fanno da relay per esse                       | I router HTTP restituiscono i peer fornitori e non memorizzano contenuti                                   |
| Governance              | Il Galactic Senate delle 256 galassie vota gli aggiornamenti di Azimuth                              | Nessuna autorità a livello di protocollo su identità o comunità                                            |
| Messaggi privati        | Messaggi diretti cifrati e gruppi solo su invito                                                     | Comunità pubbliche; ancora nessun messaggio diretto nativo                                                 |
| Compromesso principale  | Un intero computer personale con gruppi privati, ma ogni utente ha bisogno di una nave sempre accesa | Identità gratuite e accesso dal browser, ma niente messaggistica privata e si conserva solo l'ultimo stato |
