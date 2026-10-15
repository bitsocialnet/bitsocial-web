---
title: Bitsocial și Urbit
description: Cum se compară Urbit, o rețea de servere personale cu Urbit ID-uri bazate pe Ethereum și grupuri în Tlon Messenger administrate de gazda lor, cu comunitățile peer-to-peer ale Bitsocial.
---

# Bitsocial și Urbit

[Urbit](https://urbit.org/) este o rețea de servere personale. Fiecare utilizator are un computer
mereu pornit, numit navă (ship), care rulează sistemul de operare propriu al Urbit (Arvo), scris în
limbajele proprii ale Urbit (Nock și Hoon), și este identificat printr-un Urbit ID. Principala sa
aplicație socială este [Tlon Messenger](https://tlon.io/), creată de Tlon, compania fondată în 2013
pentru a dezvolta Urbit.

Urbit își propune să înlocuiască întreaga stivă de calcul, așa că este un proiect mult mai amplu
decât Bitsocial. Stratul său social folosește totuși un model apropiat de cel al Bitsocial: o
comunitate se află pe nodul proprietarului ei, iar acel nod decide ce intră. Cele două diferă în
privința celui care trebuie să ruleze un server și a modului în care este ținut spamul afară.

## Cum funcționează Urbit

- **Urbit ID-uri.** Fiecare navă are un Urbit ID: un număr afișat ca un nume pronunțabil, cum ar fi
  `~sampel-palnet`. ID-urile de Layer 1 sunt NFT-uri ale căror proprietate și chei publice de rețea
  sunt înregistrate în contractele Azimuth de pe Ethereum. ID-urile de Layer 2, adăugate în 2021
  pentru a reduce comisioanele, folosesc un „naive rollup”: tranzacțiile lor sunt publicate pe
  Ethereum în loturi, dar proprietatea lor nu este stocată în contractul Azimuth, iar fiecare navă o
  calculează local. Tlon rulează un roller pe care oricine îl poate folosi gratuit, potrivit
  [documentației Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) și paginii
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **O ierarhie fixă.** Spațiul de adrese cuprinde 256 de galaxii, 65.536 de stele și aproximativ 4
  miliarde de planete pentru uz zilnic. Galaxiile emit stele, stelele emit planete, iar fiecare
  planetă poate emite luni pentru propriile dispozitive. Cometele sunt ID-uri gratuite pe care o
  navă și le generează singură și care nu ating niciodată blockchainul. Proprietarii galaxiilor
  formează Galactic Senate, care votează actualizările contractelor Azimuth și alege consiliul de
  administrație al Urbit Foundation.
- **Rețea.** Navele schimbă pachete criptate peer-to-peer. Din iulie 2026, protocolul de rețea este
  [Directed Messaging](https://urbit.org/blog/directed-messaging), o rescriere centrată pe conținut
  a vechiului protocol Ames. Galaxiile se ocupă de descoperirea peerilor: fiecare ține evidența
  locului în care se află navele de sub ea și le retransmite pachete până când cele două nave se pot
  contacta direct sau atât timp cât un firewall împiedică acest lucru, potrivit
  [articolului despre Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Grupuri.** În Tlon Messenger, un grup este găzduit de nava creatorului său. Membrii trimit
  mesaje gazdei, care le distribuie navei fiecărui membru, iar nava fiecărui membru își păstrează
  propria copie, potrivit [FAQ-ului Tlon](https://tlon.io/posts/faq). Gazda controlează rolurile,
  canalele și admiterea. Un grup poate fi public, privat sau secret și poate
  [exclude nave individuale sau ranguri întregi de ID-uri](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Canalele sunt chaturi, caiete de notițe sau colecții de imagini și linkuri.
- **Găzduire.** La înscrierea în Tlon, un utilizator nou primește o navă pe care o rulează Tlon, cu
  chei pe care Tlon le ține în custodie. Un utilizator poate exporta nava și master ticket-ul ei și
  o poate rula în altă parte: pe un dispozitiv [Native Planet](https://www.nativeplanet.io/) sau cu
  runtime-ul Vere pe Linux, macOS ori Windows. Navele nu pot încă stoca direct fișiere mari, așa că
  Tlon Messenger pune imaginile și celelalte fișiere media într-o stocare cloud compatibilă cu S3.

## Unde diferă

### Cine trebuie să ruleze un server

În Urbit, fiecare participant este un server. Aplicațiile Tlon sunt interfețe pentru nava proprie a
utilizatorului și chiar și citirea unui grup trece prin ea. Cei care nu rulează singuri o navă
închiriază una, ceea ce readuce în scenă un furnizor de găzduire: Tlon deține cheile utilizatorilor
găzduiți și păstrează un acces limitat pentru întreținere, deși utilizatorii pot pleca împreună cu
întreaga lor navă.

În Bitsocial, doar proprietarii comunităților au nevoie de un nod mereu pornit. Cititorii și cei
care postează pot rula un nod peer-to-peer într-o filă de browser, iar contul lor este o pereche de
chei pe care o păstrează aplicația. Consultați [Peer-to-peer în browser](/browser-p2p/). Când cineva
folosește totuși un nod găzduit, designul Bitsocial urmărește să-i permită să delege
disponibilitatea fără a ceda custodia identității. Consultați
[Identitatea și proprietatea comunității](/identity-and-ownership/).

### Gazda comunității

Aici cele două sunt cel mai apropiate. Un grup Tlon și o comunitate Bitsocial se află amândouă pe
nodul proprietarului lor. Gazda decide cine poate posta, aplică moderarea și distribuie rezultatul,
iar niciunul dintre protocoale nu pune un moderator deasupra gazdei. În ambele cazuri, gazda trebuie
să fie online. FAQ-ul Tlon spune că, dacă gazda iese offline, „grupul cade odată cu ea”, iar o
comunitate Bitsocial nu poate accepta postări noi cât timp nodul ei este offline.

Conținutul este stocat diferit. Nava fiecărui membru păstrează o copie a istoricului grupului, așa
că membrii pot citi în continuare ce au primit deja cât timp gazda este căzută. Un cititor Bitsocial
preia cea mai recentă stare a comunității de la nodul comunității sau de la peerii care o seedează,
așa că o comunitate offline rămâne lizibilă cât timp peerii o au, dar rețeaua păstrează doar cea mai
recentă stare.

Un grup Tlon are și o listă de membri, iar gazda îl poate face accesibil doar pe bază de invitație.
O comunitate Bitsocial nu are membri înscriși: oricine o poate citi și oricine poate încerca să
posteze, sub rezerva provocării ei.

### Spam și identitate

Urbit combate spamul făcând identitatea rară. Oferta de planete este fixă și fiecare planetă este
emisă de o stea. Cometele gratuite ocolesc această raritate, așa că grupurile care vor ca ea să se
mențină le resping: documentația Urbit menționează că unele grupuri refuză cometele, iar un grup
Tlon poate exclude întregul rang al cometelor printr-o singură setare. Odată ce cometele sunt ținute
afară, un utilizator exclus are nevoie de o altă planetă de la proprietarul unei stele ca să revină.
Reputația poate urma și ea ierarhia: Azimuth include un contract Censures care le permite galaxiilor
și stelelor să marcheze ID-uri. Pentru că raritatea este integrată în spațiul de adrese, ea
funcționează la fel în fiecare grup care respinge cometele.

Identitățile Bitsocial sunt perechi de chei gratuite. Fiecare comunitate își alege propria provocare
înainte de a accepta o postare, cum ar fi un captcha, o plată, un sold de tokenuri sau o listă de
permisiuni, iar alte comunități pot alege altfel. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Blockchain și guvernanță

Stratul de identitate al Urbit depinde de Ethereum. Contractele Azimuth înregistrează proprietatea
și cheile de rețea de Layer 1, tranzacțiile de Layer 2 sunt publicate pe Ethereum în loturi, iar
Galactic Senate poate actualiza contractul care guvernează Azimuth. Aceleași 256 de galaxii se ocupă
și de descoperirea peerilor și de retransmitere, așa că un set fix de identități poartă atât
guvernanța, cât și o parte din rutarea rețelei.

Identitățile Bitsocial sunt perechi de chei care nu necesită înregistrare. Numele `.bso` și `.eth`
sunt aliasuri opționale care se rezolvă în ele. Descoperirea peerilor trece prin routere HTTP care
returnează doar adresele furnizorilor; oricine poate rula un astfel de router, iar clienții pot
schimba routerul modificându-și configurația.

### Amploare

Urbit este un computer de uz general. O navă poate găzdui un remote Git, o bază de cunoștințe
personală sau agenți AI, iar Tlon Messenger este doar un program printre multe altele. A dezvolta
pentru Urbit înseamnă în mare parte a scrie aplicații Hoon pentru Arvo. Bitsocial este un protocol
pentru comunități publice, cu aplicații precum [5chan](/apps/5chan/) și [Seedit](/apps/seedit/).
Rulează pe stiva existentă (libp2p, IPFS și browserul) în loc s-o înlocuiască, iar clienții săi sunt
construiți cu unelte web obișnuite. Consultați
[Construiește-ți propriul client](/build-your-own-client/).

### Mesaje private

Aici Urbit este mai puternic. Mesajele directe merg de la o navă direct la alta, tot traficul dintre
nave este criptat, iar grupurile pot fi private sau secrete. Tlon notează că mesajele sunt criptate
în tranzit, dar stocate necriptat pe navă. Bitsocial se concentrează pe comunități publice și nu are
încă mesaje directe native.

## Starea proiectului

Urbit a trecut prin zguduiri serioase. În august 2024, Urbit Foundation, organizația nonprofit care
orientează dezvoltarea de bază, și-a concediat directorul executiv; fondatorul Curtis Yarvin a
revenit ca să conducă strategia fără un titlu formal, mai mulți dezvoltatori de bază au plecat, iar
fondurile Foundation mai ajungeau doar pentru câteva luni,
[a relatat CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin a propus mutarea Azimuth pe un layer 2 existent al Ethereum, cel mai probabil Base, și
emiterea unor tokenuri fungibile de tip „viză” care se convertesc în planete. În octombrie 2026,
[documentația ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) a Urbit încă descrie Azimuth pe
Ethereum, cu naive rollup-ul său. În octombrie 2025, Galactic Senate a înlocuit consiliul de
administrație al Foundation, iar noul consiliu a numit un nou director executiv
([anunț](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Dezvoltarea continuă. Directed Messaging a intrat în funcțiune odată cu versiunea 408k, pe 14
iulie 2026. În iunie 2026, Tlon Messenger
[a deschis înscrierile publice fără listă de așteptare](https://urbit.org/blog/this-month-in-urbit-june-2026),
iar Tlon se prezintă acum ca un loc în care oamenii și agenții AI lucrează împreună.

## Comparație

| Întrebare              | Urbit                                                                                                         | Bitsocial                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Categorie              | Rețea de servere personale și sistem de operare                                                               | Rețea de comunități peer-to-peer                                                                             |
| Identitate             | Urbit ID-uri: aproximativ 4 miliarde de planete pe Ethereum sau în rollup-ul de Layer 2, plus comete gratuite | Perechi de chei Ed25519 pentru utilizatori și comunități                                                     |
| Cine rulează un server | Fiecare utilizator, pe propria navă sau pe una găzduită                                                       | Proprietarii comunităților; cititorii și cei care postează pot folosi o filă de browser                      |
| Unde se află postările | Nava gazdei grupului și o copie pe nava fiecărui membru                                                       | Nodul proprietarului comunității și peerii care o citesc și o seedează                                       |
| Comunități             | Grupuri găzduite de nava creatorului, cu liste de membri                                                      | Obiecte de prim rang, al căror nod acceptă sau respinge postări                                              |
| Controlul spamului     | ID-uri rare emise de stele; grupurile exclud nave sau ranguri întregi                                         | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                                        |
| Moderare               | Rolurile și excluderile stabilite de gazda grupului                                                           | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează                           |
| Descoperirea peerilor  | Galaxiile țin evidența navelor de sub ele și retransmit pachete pentru ele                                    | Routerele HTTP returnează peerii furnizori și nu stochează conținut                                          |
| Guvernanță             | Galactic Senate, format din 256 de galaxii, votează actualizările Azimuth                                     | Nicio autoritate la nivel de protocol asupra identităților sau comunităților                                 |
| Mesaje private         | Mesaje directe criptate și grupuri doar pe bază de invitație                                                  | Comunități publice; încă fără mesaje directe native                                                          |
| Compromisul principal  | Un computer personal complet, cu grupuri private, dar fiecare utilizator are nevoie de o navă mereu pornită   | Identități gratuite și acces din browser, dar fără mesaje private și se păstrează doar cea mai recentă stare |
