---
title: Bitsocial en Secure Scuttlebutt
description: Hoe Secure Scuttlebutt (SSB) en de app Manyverse zich verhouden tot Bitsocial, van append-only feeds en replicatie via de volggraaf tot communities, spambestrijding en offline synchronisatie.
---

# Bitsocial en Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) is een peer-to-peer sociaal protocol dat Dominic
Tarr in 2014 heeft bedacht. [Manyverse](https://www.manyver.se/) is de bekendste app ervan, voor
Android, iOS en desktop; [Patchwork](https://github.com/ssbc/patchwork) was de belangrijkste
desktopclient tot het werd gearchiveerd. Van de systemen die in deze documentatie worden vergeleken,
staat SSB qua uitgangspunten het dichtst bij Bitsocial: geen servers in het datapad, geen
blockchain, geen globale volgorde en Ed25519-sleutels voor identiteit. De twee maakten tegengestelde
keuzes over wat elke peer opslaat en waar spam wordt tegengehouden.

## Hoe Scuttlebutt werkt

- **Feeds.** Elke identiteit is een Ed25519-sleutelpaar, geschreven als `@<public key>.ed25519`.
  Alles wat een gebruiker publiceert, komt in diens eigen feed terecht: een append-only log waarin
  elk ondertekend bericht een volgnummer en de hash van het vorige bericht bevat. Een bericht kan na
  het posten niet meer worden gewijzigd, volgens de
  [protocolgids](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replicatie.** Peers kopiëren hele feeds, geen losse posts, en de volggraaf bepaalt welke feeds
  een peer bewaart. Patchwork toonde bijvoorbeeld feeds tot twee hops ver en repliceerde feeds tot
  drie hops ver. Met epidemic broadcast trees (EBT) vergelijken peers per feed het laatste
  volgnummer dat ze hebben en sturen ze alleen wat ontbreekt.
- **Verbindingen.** Peers authenticeren elkaar met een secret handshake en versleutelen het verkeer
  met box stream. De handshake is gekoppeld aan een netwerkidentifier, dus peers op een afzonderlijk
  SSB-netwerk met een andere identifier kunnen geen verbinding maken met het hoofdnetwerk.
- **Peers vinden.** Peers maken zichzelf op het lokale netwerk bekend via UDP-broadcast en
  synchroniseren via LAN; Manyverse synchroniseert ook via Bluetooth. Over het internet vertrouwen
  gebruikers op **pubs**, altijd online peers die je terugvolgen nadat je een uitnodigingscode hebt
  ingewisseld en daarna je feed opslaan en uitleveren, en op **rooms**, die geen feeds opslaan maar
  verbindingen tussen hun leden tunnelen.
- **Blobs en privéberichten.** Afbeeldingen en andere bestanden zijn blobs met inhoudsadressering
  die bij peers worden opgehaald, met in de huidige implementaties een standaardlimiet van 5 MB.
  Privéberichten worden versleuteld voor maximaal zeven ontvangers en als versleutelde tekst in de
  feed van de auteur gepubliceerd.

## Waar ze verschillen

### Wat een peer opslaat

Een SSB-peer bewaart een volledige kopie van elke feed binnen zijn replicatiebereik, vanaf het
eerste bericht van die feed, en levert die feeds uit aan anderen. Daardoor werkt SSB offline, maar
de opslag groeit met elk bericht binnen het bereik, en een nieuwe installatie moet die feeds eerst
downloaden voordat ze veel laat zien. Een Bitsocial-client haalt de nieuwste staat van de
communities die hij opent op bij de node van de community en de peers die die seeden, en het netwerk
bewaart alleen die nieuwste staat. Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/).

### Verwijderen en apparaten

Omdat een feed een hashketen is, kent SSB geen verwijdering over het hele netwerk: een peer kan
berichten uit zijn eigen database schrappen, maar kan ze niet terughalen uit de kopieën van andere
peers. Wie met dezelfde sleutel post vanaf twee apparaten, of vanaf een teruggezette back-up,
splitst de feed (een fork), dus het gebruikelijke antwoord is één identiteit per apparaat. PZP, het
opvolgerprotocol van het Manyverse-team, noemt verwijderen, meerdere apparaten per account en
fork-tolerante feeds als belangrijkste wijzigingen ten opzichte van SSB
([lanceringsbericht](https://www.manyver.se/blog/2024-07-03/)). Een Bitsocial-communitynode
publiceert bij elke update een nieuwe versie van de staat van de community, dus inhoud die de
moderators verwijderen, verdwijnt uit de nieuwste staat.

### Wie je kunt horen

Het replicatiebereik van SSB doet ook dienst als spamfilter. De feed van een onbekende bereikt je
alleen als iemand binnen je hops die persoon volgt, en als je een feed blokkeert, stopt je node met
het repliceren ervan. Spam blijft buiten, maar nieuwkomers ook, totdat iemand hen volgt. Bitsocial
laat iedereen in een community publiceren, en de node van de community beslist via zijn challenge of
een post wordt geaccepteerd. Zie [Aangepaste antispamuitdagingen](/custom-challenges/).

### Communities

SSB heeft geen communityobject. Kanalen en hashtags zijn labels op afzonderlijke posts, de reacties
in een thread staan in de feeds van wie ze heeft geschreven, en hoeveel je van een thread ziet,
hangt af van welke van die feeds je node heeft. Rooms kunnen moderators en ledenlijsten hebben, maar
die bepalen wie via de room verbinding mag maken, niet wat er wordt gepubliceerd. Een
Bitsocial-community is een volwaardig object met een eigen sleutelpaar, regels, moderators en
challenge.

### Infrastructuur

Beide houden servers buiten het datapad, en beide leunen op helpers. Pubs komen bij SSB het dichtst
in de buurt van een gehoste dienst: ze slaan de feeds op van iedereen die ze volgen en leveren die
uit. Rooms lijken meer op de HTTP-routers van Bitsocial, omdat geen van beide inhoud opslaat, maar
een room geeft de verbinding tussen zijn leden door, terwijl een router alleen adressen van
aanbieders teruggeeft en geen rol speelt bij de overdracht. Net als een SSB-peer draait een
Bitsocial-communitynode op consumentenhardware, en hij moet online zijn om nieuwe posts te
accepteren.

### Offline en lokale netwerken

Hier is SSB sterker. Twee SSB-peers op hetzelfde Wi-Fi-netwerk, of via Bluetooth in Manyverse,
kunnen zonder internetverbinding synchroniseren, en alles wat al is gerepliceerd, blijft offline
leesbaar. Het uitgesproken hoofddoel van Manyverse is sociale netwerken onafhankelijk te maken van
internetconnectiviteit. Bitsocial heeft een internetverbinding nodig om peers te vinden en om te
publiceren.

### Browser

De belangrijkste SSB-apps leveren een volledige SSB-node mee: Manyverse bundelt er een in zijn
mobiele apps en desktopapps. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) draaide
SSB in een browser met gedeeltelijke replicatie en verbindingen via rooms, en werd in 2022
gearchiveerd. Bitsocial-apps draaien een peer-to-peer-node in een gewoon browsertabblad. Zie
[Peer-to-peer in de browser](/browser-p2p/).

### Privéberichten

SSB heeft versleutelde privéberichten ingebouwd. Bitsocial richt zich op openbare communities en
heeft nog geen ingebouwde privéberichten.

## Projectstatus

André Staltz, die Manyverse bouwde, trok zich in april 2024 terug uit SSB, Manyverse en hun geplande
opvolger ([zijn laatste update](https://www.manyver.se/blog/2024-04-05/)). In juli 2024 lanceerde
Jacob Karlsson die opvolger als [PZP](https://pzp.wiki/) en schreef hij dat hij niet meer aan
Manyverse zou werken en niemand anders kende die dat van plan was. In oktober 2026 hadden de
PZP-repository's op [Codeberg](https://codeberg.org/pzp) geen updates meer gehad sinds
december 2024. De repository van Patchwork is gearchiveerd met v3.18.1 als laatste release, en het
team achter Planetary, een SSB-app voor iOS, stapte in 2023 met zijn app Nos over naar Nostr. Het
SSB-netwerk draait nog op de peers en pubs die mensen online houden, maar de belangrijkste apps
worden niet meer ontwikkeld.

## Vergelijking

| Vraag                  | Secure Scuttlebutt                                                                                        | Bitsocial                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Categorie              | Peer-to-peer gossipprotocol                                                                               | Peer-to-peer-netwerk van communities                                                                   |
| Identiteit             | Eén Ed25519-sleutelpaar per apparaat                                                                      | Ed25519-sleutelparen voor gebruikers en communities                                                    |
| Waar posts staan       | De append-only feed van de auteur, gekopieerd door elke peer die hem repliceert                           | De node van de community-eigenaar en de peers die de community lezen en seeden                         |
| Wat een peer bewaart   | Volledige geschiedenis van elke feed binnen zijn volgbereik                                               | De nieuwste staat van de communities die hij leest of seedt                                            |
| Communities            | Geen communityobject; kanalen en hashtags labelen posts                                                   | Volwaardige objecten waarvan de node posts accepteert of weigert                                       |
| Spambestrijding        | Replicatiebereik volgens de volggraaf, plus blokkades                                                     | De challenge van elke community voordat een post wordt geaccepteerd                                    |
| Moderatie              | Wie elke gebruiker volgt en blokkeert                                                                     | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                                  |
| Hulpservers            | Pubs slaan feeds op en leveren ze uit; rooms tunnelen verbindingen                                        | HTTP-routers geven aanbiedende peers terug en slaan geen inhoud op                                     |
| Offline                | Synchronisatie via LAN en Bluetooth zonder internet                                                       | Heeft een internetverbinding nodig                                                                     |
| Browser                | Apps bundelen een volledige SSB-node                                                                      | Peer-to-peer-node in een gewoon browsertabblad                                                         |
| Netwerk                | Draait nog, maar de belangrijkste apps worden niet meer ontwikkeld                                        | Live netwerk met apps zoals [5chan](/apps/5chan/) en [Seedit](/apps/seedit/)                           |
| Belangrijkste afweging | Werkt offline en heeft geen hosting nodig, maar feeds groeien eindeloos en onbekenden blijven onzichtbaar | Open publiceren en browserondersteuning, maar heeft internet nodig en bewaart alleen de nieuwste staat |
