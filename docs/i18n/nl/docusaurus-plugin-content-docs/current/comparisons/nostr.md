---
title: Bitsocial en Nostr
description: Hoe het op relays gebaseerde model van Nostr zich verhoudt tot de peer-to-peer-communities van Bitsocial, van datapad en identiteit tot groepen, spambestrijding en moderatie.
---

# Bitsocial en Nostr

Nostr past niet netjes in de categorie federatie of blockchain. Gebruikers krijgen geen account van
een instance, en er is geen chain, consensus, gas of globale volgorde. Nostr kun je beter omschrijven
als **sociale media op basis van relays**: gebruikers hebben sleutelparen, ondertekenen events en
publiceren die naar relays, gewone servers die ze opslaan en uitleveren
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). De eigen
[README](https://github.com/nostr-protocol/nostr) van Nostr zegt dat het niet op
peer-to-peer-technieken leunt.

Daarmee staat Nostr op één belangrijk punt dichter bij Bitsocial dan gefedereerde systemen of
blockchainsystemen: identiteit is cryptografisch en overdraagbaar. De verschillen zitten in de
datalaag en in wie de poort bewaakt.

## Hoe Nostr werkt

- **Events en relays.** Elke post, elk profiel en elke reactie is een ondertekend JSON-event. Clients
  publiceren events via WebSockets naar relays en abonneren zich met filters; relays slaan events op
  en leveren ze weer uit. Relays communiceren niet met elkaar.
- **Replicatie.** Gebruikers publiceren meestal naar meerdere relays. Een onderzoek naar 712 relays
  in 2023 vond de gemiddelde post op 34,6 daarvan ([Wei en Tyson](https://arxiv.org/abs/2402.05709)).
- **Iemands posts vinden.** Gebruikers publiceren een lijst van de relays waarnaar ze schrijven en
  waarvan ze lezen ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), en clients
  halen de posts van een gebruiker op bij diens schrijfrelays.
- **Identiteit.** Elke gebruiker is een secp256k1-sleutel die met Schnorr-handtekeningen ondertekent.
  De specificaties definiëren geen sleutelrotatie of -herstel, dus een verloren sleutel is een
  verloren account. Optionele identifiers in de vorm `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) worden gecontroleerd aan de
  hand van een bestand op de webserver van dat domein.
- **Groepen.** Het aanbevolen mechanisme voor communities is groepen op basis van relays
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): een relay host een groep,
  handhaaft de regels voor lidmaatschap en posten voordat hij een post accepteert, en ondertekent de
  metadata van de groep. De oudere communities met moderatorgoedkeuring
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) zijn inmiddels gemarkeerd als
  niet aanbevolen, ten gunste van NIP-29.
- **Spambestrijding.** Elke relay kiest zijn eigen poort: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), authenticatie en allowlists
  ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), betaling of rate limits.
  Clients voegen mutelijsten en vertrouwensscores toe.
- **Media.** Afbeeldingen en video worden geüpload naar aparte HTTP-bestandsservers.

## Waar ze verschillen

### Wie posts opslaat en uitlevert

Bij Nostr zijn relays de opslag- en bezorglaag: een server moet elke post online houden. Bij
Bitsocial helpen HTTP-routers clients alleen om peers te vinden. Ze slaan geen posts, profielen,
communitymetadata of moderatiestatus op; clients halen inhoud op bij de node van de community en bij
de peers die die seeden. Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/).

### Wie de poort bewaakt

De schrijfpoorten van Nostr zijn in handen van relaybeheerders. Buiten NIP-29-groepen kan een sleutel
die door één relay wordt geweigerd hetzelfde event publiceren naar elke relay die het wel accepteert,
en wat lezers zien hangt af van de relays die hun client leest. Een NIP-29-groep lijkt meer op een
Bitsocial-community: de hostrelay accepteert of weigert posts. Toch bepaalt de relay nog steeds wat
groepsrollen mogen, en blijft de geschiedenis van de groep aan die relay gebonden, tenzij een andere
relay ermee instemt die over te nemen.

Bij Bitsocial is een community een cryptografisch object met een eigen sleutelpaar. De node van de
community voert de challenge uit die de eigenaar kiest en publiceert de geaccepteerde staat naar het
peer-to-peer-netwerk. Zie [Aangepaste antispamuitdagingen](/custom-challenges/).

### De infrastructuur draaien

Een relay is een server met een domein en een WebSocket-endpoint, en populaire relays dragen de
opslag- en bandbreedtekosten van wat ze uitleveren. Het onderzoek uit 2023 schatte dat ongeveer 95%
van de gratis relays hun kosten niet uit donaties kon dekken. Een Bitsocial-communitynode draait op
consumentenhardware, en peers die een community lezen kunnen helpen die te delen.

### Browser

Een Nostr-webclient opent WebSocket-verbindingen rechtstreeks naar relays, dus er is geen appserver
nodig. Een Bitsocial-webapp draait een peer-to-peer-node in het tabblad en haalt inhoud op bij peers.
Zie [Peer-to-peer in de browser](/browser-p2p/).

### Oude inhoud

Nostr-posts worden op grote schaal over relays gerepliceerd, wat helpt om oude posts te laten
voortbestaan. Bitsocial bewaart de nieuwste staat van een community en garandeert oude inhoud niet
voor altijd.

## Vergelijking

| Vraag                  | Nostr                                                                                             | Bitsocial                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Categorie              | Protocol op basis van relays                                                                      | Peer-to-peer-netwerk van communities                                           |
| Identiteit             | secp256k1-gebruikerssleutel, zonder rotatie in de specificaties                                   | Ed25519-sleutelparen voor gebruikers en communities                            |
| Waar posts staan       | Relays die de auteur kiest, vaak veel                                                             | De node van de community-eigenaar en de peers die de community lezen en seeden |
| Wie houdt het online   | Relaybeheerders                                                                                   | Node van de community-eigenaar plus helpende seeders                           |
| Communities            | Groepen die op relays worden gehost (NIP-29)                                                      | Volwaardige objecten waarvan de node posts accepteert of weigert               |
| Spambestrijding        | Het beleid van elke relay: proof-of-work, authenticatie, betaling, allowlists, rate limits        | De challenge van elke community voordat een post wordt geaccepteerd            |
| Moderatie              | Relaybeleid, mutelijsten in clients, labels en meldingen                                          | Community-eigenaren modereren hun community; apps kiezen wat ze tonen          |
| Namen                  | Optionele identifiers in de vorm `name@domain`, gecontroleerd via HTTPS                           | `.bso`- en `.eth`-namen die naar sleutels verwijzen                            |
| Browser                | WebSocket-client van relays                                                                       | Peer-to-peer-node in een gewoon browsertabblad                                 |
| Belangrijkste afweging | Overdraagbare identiteit en brede replicatie, maar beschikbaarheid en beleid hangen af van relays | Minder afhankelijk van relays, maar oude inhoud is niet voor altijd verzekerd  |
