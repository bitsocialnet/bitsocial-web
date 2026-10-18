---
title: Bitsocial en Quorum
description: Hoe Quorum, de end-to-end versleutelde groepsmessenger van Quilibrium met Spaces in Discord-stijl, zich verhoudt tot de openbare peer-to-peer-communities van Bitsocial.
---

# Bitsocial en Quorum

[Quorum](https://www.quorummessenger.com/) is een groepsmessenger die Quilibrium Inc. heeft gebouwd
op zijn eigen netwerk, [Quilibrium](https://quilibrium.com/). Het is opgezet zoals Discord, met
Spaces, kanalen, rollen en directe berichten, en de berichten zijn end-to-end versleuteld. Het wordt
naast Bitsocial genoemd omdat beide zichzelf omschrijven als peer-to-peer en censuurbestendig, met
groepen die hun eigen regels bepalen. Ze mikken op verschillende dingen: Quorum op privégroepschats,
Bitsocial op openbare communities die iedereen kan lezen.

Quilibrium omschrijft zichzelf als een gedecentraliseerd alternatief voor cloudplatforms: een
netwerk van nodes die gegevens bewaren in een versleutelde hypergraaf en het eens worden over de
staat daarvan via een consensusmechanisme dat het Proof of Meaningful Work noemt. Nodes verdienen
QUIL, het token van het netwerk, waarmee gebruikskosten worden betaald. Quorum begon in 2018 als
Howler, een idee voor een privéalternatief voor Discord, en werd de eerste app die live ging op
Quilibrium, volgens het
[verhaal van Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc.,
opgericht door Cassie Heart, ontwikkelt het protocol en biedt Quorum aan als een van zijn beheerde
diensten ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Hoe Quorum werkt

De onderstaande details komen uit de broncode van de clients van Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) voor de web- en desktopapps en
[quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), zoals die er in oktober 2026
uitzag.

- **Identiteiten.** De hoofdidentiteit van een gebruiker is een Ed448-sleutelset, en elk apparaat
  krijgt eigen X448- en Ed448-sleutels. In de browser worden de sleutels beschermd door een passkey.
  Adressen zijn hashes die beginnen met `Qm`, en gebruikers kunnen een gebruikersnaam uit de
  naamdienst van Quilibrium tonen.
- **Versleuteling.** Directe berichten gebruiken de Double Ratchet tussen apparaten. Een Space deelt
  één Triple Ratchet-sessie tussen zijn leden, die hun berichten ondertekenen met Space-specifieke
  sleutels. Elke Space is versleuteld, en Quorum zegt dat zijn berichtbemiddeling voorkomt dat de
  dienst die berichten doorstuurt afzenders en ontvangers aan elkaar kan koppelen.
- **Toetreden.** Spaces worden betreden via uitnodigingslinks. Een eenmalige link bevat de sleutels
  om toe te treden in de URL; een openbare link haalt ze op bij de Quorum-dienst, en openbare Spaces
  kunnen worden vermeld in een doorzoekbare directory.
- **Transport.** De web-, desktop- en mobiele clients maken allemaal via HTTPS en een WebSocket
  verbinding met één dienst,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Die dienst stuurt versleutelde berichten door naar de inbox van elk lid, en slaat
  gebruikersregistraties op, het versleutelde manifest van elke Space (kanalen, rollen, emoji),
  uitnodigingsmateriaal, de openbare directory en optionele versleutelde synchronisatie van
  instellingen. De nodesoftware van Quilibrium heeft een inbox- en hubdienst met dezelfde opzet,
  maar noch de clients noch de documentatie van Quilibrium zeggen hoe deze dienst zich tot het
  netwerk verhoudt.
- **Geschiedenis.** De client van elk lid bewaart een eigen kopie van de Space in lokale opslag. De
  web- en desktopclient vult de geschiedenis aan door een lid dat online is om synchronisatie te
  vragen; de mobiele client speelt een log af dat de dienst voor elke Space bijhoudt, zodat hij kan
  bijwerken wanneer geen ander lid online is.
- **Moderatie.** Rollen geven het recht om te verwijderen, vast te pinnen, te dempen en `@everyone`
  te vermelden. De client van elk lid controleert de handtekening op elke moderatieactie en past die
  alleen toe als de ondertekenaar de juiste rol heeft. De eigenaar kan een lid eruit zetten (kick),
  waarbij de sleutels van de Space worden vervangen zodat het verwijderde lid geen nieuwe berichten
  kan lezen. Een Space kan ondertekende berichten verplichten of leden ongetekende, ontkenbare
  berichten laten plaatsen.
- **Code.** De web- en desktopclient valt onder de AGPL-3.0-licentie en de mobiele client onder de
  GPL-3.0. De mobiele client heeft ook een cryptowallet, Farcaster-integratie en Apex, een betaald
  abonnement dat hieronder wordt beschreven.

## Waar ze verschillen

### Privégroepen en openbare communities

Een Quorum-Space is een groep leden: alleen wie de sleutels ervan heeft, kan hem lezen, en toetreden
vereist een uitnodigingslink. Met een openbare link kan iedereen erin, maar pas na het toetreden.
Een Bitsocial-community heeft geen lidmaatschap. Iedereen kan haar lezen, vanuit elke app, zonder
toe te treden, en iedereen kan proberen te posten, maar moet dan wel de challenge van de community
doorstaan.

### Wat een groep online houdt

Een Quorum-Space heeft geen hostnode. Leden sturen berichten via de Quorum-dienst, de client van elk
lid bewaart een kopie, en anderen kunnen met elkaar praten zonder dat de eigenaar online is. Een
Bitsocial-community staat op de node van haar eigenaar, die elke post accepteert of weigert en de
nieuwste staat van de community publiceert. De community blijft leesbaar zolang peers haar seeden,
maar kan geen nieuwe posts accepteren zolang haar node offline is. Zie
[Peer-to-peer-protocol](/peer-to-peer-protocol/).

### Wie de regels handhaaft

In Quorum gebeurt de handhaving aan de rand. De client van elk lid beslist op basis van de rol van
de ondertekenaar of een verwijdering, een pin of een demping wordt toegepast, en een kick werkt door
alle anderen naar nieuwe sleutels te verplaatsen. In Bitsocial gebeurt de handhaving op de
communitynode: een post die niet door de challenge of de regels van de community komt, wordt nooit
deel van de community. Zie [Lokale moderatie, geen mondiale verboden](/local-moderation/).

### Spambestrijding

Quorum houdt spam vooral buiten via uitnodigingen. Een eenmalige link laat één persoon toe, een
openbare link laat iedereen toe die hem heeft, en de eigenaar kan achteraf leden eruit zetten en
nieuwe sleutels instellen; de client beperkt ook de snelheid van zijn eigen verzendingen.
Bitsocial-identiteiten zijn gratis sleutelparen, dus elke community kiest een challenge die ze
uitvoert voordat ze een post accepteert, zoals een captcha, een betaling, een tokensaldo of een
allowlist. Zie [Aangepaste antispamuitdagingen](/custom-challenges/).

### De client en het netwerk

Een Quorum-app is een client van de Quorum-dienst, die Quilibrium Inc. draait. De apps nemen zelf
niet deel aan een peer-to-peer-netwerk, dus het bereiken van een Space hangt af van dat ene
endpoint. Daarachter is Quilibrium een netwerk op zich: in oktober 2026 toonde de
[explorer](https://dashboard.quilibrium.com/) ervan 114 bereikbare peers en 181 provers verdeeld
over 99 shards.

Een Bitsocial-webapp kan een libp2p-node in het tabblad draaien, communitycontent bij peers ophalen
en publiceren via gossipsub. Peers worden gevonden via HTTP-routers die alleen adressen van
aanbieders teruggeven; iedereen kan zo'n router draaien, en clients kunnen van router wisselen door
hun configuratie aan te passen. Zie [Peer-to-peer in de browser](/browser-p2p/).

### Economie

Quilibrium heeft een token als kern. QUIL wordt gemined door nodes en betaalt netwerkkosten, en een
wrapped versie, wQUIL, circuleert op Ethereum. Quorum zelf is gratis en vraagt geen betaling of
telefoonnummer. Het optionele Apex-abonnement kost
[$5 per maand](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
wordt betaald in wQUIL, SNAP of USDC op Ethereum en wordt verdeeld tussen Quilibrium Inc. en vier
Spaces die de abonnee kiest. Bitsocial heeft geen betaallaag in het protocol; een community kan via
haar challenge een betaling of een token vereisen.

### Privéberichten

Hier is Quorum sterker. Directe berichten en berichten in Spaces zijn end-to-end versleuteld met
forward secrecy, en de inhoud van berichten bereikt de Quorum-dienst alleen als versleutelde tekst.
Bitsocial richt zich op openbare communities en heeft nog geen ingebouwde privéberichten. Een
Bitsocial-post is versleuteld met de sleutel van de communitynode terwijl hij via pubsub reist, maar
zodra hij is geaccepteerd, is hij openbaar.

## Projectstatus

In oktober 2026 noemde de Quorum-repository de webapp een bèta, en vermeldde de Quorum-website de
apps voor Google Play en de App Store nog steeds als binnenkort beschikbaar. De twee clients lopen
ook uiteen: de mobiele app heeft de wallet-, Farcaster- en Apex-functies, terwijl de web- en
desktopclient zijn Wallet- en Farcaster-pagina's als binnenkort beschikbaar toont, en de twee halen
de geschiedenis van een Space op verschillende manieren in.

Het mainnet van Quilibrium bereikte versie 2.1 op 30 september 2025, toen het netwerk na een
stilstand weer op gang kwam
([aankondiging](https://x.com/QuilibriumInc/status/1973082817236984270)). In 2026 werd de node
herschreven in Rust, met post-kwantumhandtekeningen voor de consensus en een wireprotocol dat oudere
nodes niet spreken. Delen van de documentatie beschrijven het ontwerp in plaats van de code die
werkelijk draait: ze beschrijven
[mixnetroutering](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), maar in
node 2.1.0.25 is de mixnetdienst een
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
die berichten accepteert zonder ze te mixen.

## Vergelijking

| Vraag                     | Quorum                                                                                          | Bitsocial                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Categorie                 | End-to-end versleutelde groepsmessenger op het Quilibrium-netwerk                               | Peer-to-peer-netwerk van communities                                                                              |
| Identiteit                | Ed448-hoofdsleutelset plus sleutels per apparaat, beschermd door een passkey                    | Ed25519-sleutelparen voor gebruikers en communities                                                               |
| Wie kan lezen             | Leden die de sleutels van een Space hebben                                                      | Iedereen, vanuit elke app                                                                                         |
| Waar berichten staan      | Het apparaat van elk lid; de mobiele client speelt ook een log af dat de Quorum-dienst bijhoudt | De node van de community-eigenaar en de peers die de community lezen en seeden                                    |
| Waarmee clients verbinden | De Quorum-dienst op `api.quorummessenger.com`                                                   | Peers via libp2p, ook vanuit een browsertabblad                                                                   |
| Communities               | Spaces met kanalen, rollen en uitnodigingslinks                                                 | Volwaardige objecten waarvan de node posts accepteert of weigert                                                  |
| Spambestrijding           | Uitnodigingslinks, kicks met nieuwe sleutels, snelheidslimieten in de client                    | De challenge van elke community voordat een post wordt geaccepteerd                                               |
| Moderatie                 | Rollen die de client van elk lid handhaaft; de eigenaar zet leden eruit                         | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                                             |
| Privéberichten            | End-to-end versleutelde directe berichten                                                       | Openbare communities; nog geen ingebouwde privéberichten                                                          |
| Economie                  | QUIL-netwerktoken; optioneel Apex-abonnement van $5 per maand                                   | Niets in het protocol; een challenge kan een betaling of token vereisen                                           |
| Belangrijkste afweging    | Privé, versleutelde groepen, maar elke client is afhankelijk van één dienst                     | Gratis identiteiten en toegang via de browser, maar geen privéberichten en alleen de nieuwste staat wordt bewaard |
