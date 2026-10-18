---
title: Bitsocial en Quorum
description: Hoe Quorum, de end-to-end versleutelde groepsmessenger van Quilibrium met Spaces in Discord-stijl, zich verhoudt tot de openbare peer-to-peer-communities van Bitsocial.
---

# Bitsocial en Quorum

[Quorum](https://www.quorummessenger.com/) is een groepsmessenger van Quilibrium Inc., het bedrijf
achter het netwerk [Quilibrium](https://quilibrium.com/). Het is opgezet zoals Discord, met Spaces,
kanalen, rollen en directe berichten, en de berichten zijn end-to-end versleuteld. Het wordt naast
Bitsocial genoemd omdat beide zichzelf omschrijven als peer-to-peer en censuurbestendig, met groepen
die hun eigen regels bepalen. Ze mikken op verschillende dingen: Quorum op privégroepschats,
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
  krijgt eigen X448- en Ed448-sleutels. In de browser worden de sleutels normaal gesproken beschermd
  door een passkey; de mobiele app leidt ze af van een herstelzin. Adressen zijn hashes die beginnen
  met `Qm`, en gebruikers kunnen een gebruikersnaam uit de naamdienst van Quilibrium tonen.
- **Versleuteling.** Directe berichten gebruiken de Double Ratchet tussen apparaten. Een Space deelt
  één Triple Ratchet-sessie tussen zijn leden, die hun berichten ondertekenen met Space-specifieke
  sleutels. Elke Space is versleuteld. Quorum zegt dat zijn berichtbemiddeling voorkomt dat
  afzenders en ontvangers aan elkaar worden gekoppeld, maar de web- en desktopclient abonneert zich
  op alle inboxen van een apparaat, inclusief de inbox die in de openbare registratie van de
  gebruiker staat, in
  [één enkel verzoek](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  aan de dienst, die ze daardoor aan het adres van de gebruiker kan koppelen.
- **Toetreden.** Spaces worden betreden via uitnodigingslinks. Een eenmalige link bevat de sleutels
  om toe te treden in de URL; een openbare link haalt ze op bij de Quorum-dienst, en openbare Spaces
  kunnen worden vermeld in een doorzoekbare directory.
- **Transport.** Voor berichtenverkeer maken de web-, desktop- en mobiele clients allemaal via HTTPS
  en een WebSocket verbinding met één dienst,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Die dienst stuurt versleutelde berichten door naar de inbox van elk lid en bewaart ze totdat de
  client de ontvangst bevestigt. Hij slaat ook gebruikersregistraties op, openbare profielen
  waarvoor gebruikers zelf kiezen, het versleutelde manifest van elke Space (kanalen, rollen,
  emoji), uitnodigingsmateriaal, de openbare directory en optionele versleutelde synchronisatie van
  instellingen. De nodesoftware van Quilibrium heeft een inbox- en hubdienst met dezelfde opzet,
  maar noch de clients noch de documentatie van Quilibrium zeggen hoe deze dienst zich tot het
  netwerk verhoudt.
- **Geschiedenis.** De client van elk lid bewaart een eigen kopie van de Space in lokale opslag, en
  beide clients halen uit hun inboxen bij de dienst de berichten op die zijn verstuurd terwijl ze
  offline waren. Voor oudere geschiedenis vraagt de web- en desktopclient een lid dat online is om
  synchronisatie, terwijl de mobiele client een duurzaam log afspeelt dat de dienst voor elke Space
  bijhoudt.
- **Moderatie.** Rollen geven het recht om te verwijderen, vast te pinnen, te dempen en `@everyone`
  te vermelden. De client van elk lid controleert de handtekening op elke moderatieactie en past die
  alleen toe als de ondertekenaar de juiste rol heeft. De eigenaar kan een lid eruit zetten (kick),
  waarbij de sleutels van de Space worden vervangen zodat het verwijderde lid geen nieuwe berichten
  kan lezen. Een Space kan ondertekende berichten verplichten of leden ongetekende, ontkenbare
  berichten laten plaatsen. Vermeldingen in de openbare directory hebben een beoordelingsstatus, en
  gebruikers kunnen Spaces, en vanuit de mobiele app ook afzonderlijke berichten, melden bij de
  Quorum-dienst.
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

Een Quorum-Space heeft geen hostnode. Leden sturen berichten via de Quorum-dienst, die voor elk lid
een kopie bewaart totdat diens client die ophaalt, en anderen kunnen met elkaar praten zonder dat de
eigenaar online is. Een Bitsocial-community staat op de node van haar eigenaar, die elke post
accepteert of weigert en de nieuwste staat van de community publiceert. De community blijft leesbaar
zolang peers haar seeden, maar kan geen nieuwe posts accepteren zolang haar node offline is. Zie
[Peer-to-peer-protocol](/peer-to-peer-protocol/).

### Wie de regels handhaaft

In Quorum gebeurt de handhaving aan de rand. De client van elk lid beslist op basis van de rol van
de ondertekenaar of een verwijdering, een pin of een demping wordt toegepast, en een kick werkt door
alle anderen naar nieuwe sleutels te verplaatsen. Daarnaast ontvangt de beheerder van de dienst
meldingen en beoordeelt hij de openbare directory. In Bitsocial gebeurt de handhaving op de
communitynode: een post die niet door de challenge van de community komt, wordt nooit geaccepteerd,
en de node past de verwijderingen van zijn moderators toe. Zie
[Lokale moderatie, geen mondiale verboden](/local-moderation/).

### Spambestrijding

Quorum houdt spam vooral buiten via uitnodigingen. Een eenmalige link laat één persoon toe, een
openbare link laat iedereen toe die hem heeft, en de eigenaar kan achteraf leden eruit zetten en
nieuwe sleutels instellen. De clients beperken ook hoe snel een lid kan verzenden, en de web- en
desktopclient negeert Space-berichten van elke afzender boven de 10 in 10 seconden.
Bitsocial-identiteiten zijn gratis sleutelparen, dus elke community kiest een challenge die ze
uitvoert voordat ze een post accepteert, zoals een captcha, een betaling, een tokensaldo of een
allowlist. Zie [Aangepaste antispamuitdagingen](/custom-challenges/).

### De client en het netwerk

Een Quorum-app is een client van de Quorum-dienst, die Quilibrium Inc. draait. De apps nemen zelf
niet deel aan een peer-to-peer-netwerk, dus het bereiken van een Space hangt af van dat ene
endpoint. Los daarvan is Quilibrium een netwerk op zich: in oktober 2026 toonde de
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
forward secrecy, en de inhoud van berichten bereikt de Quorum-dienst alleen als versleutelde tekst,
behalve wanneer een lid een bericht meldt vanuit de mobiele app, die de inhoud ervan naar de
moderators van Quorum stuurt. Bitsocial richt zich op openbare communities en heeft nog geen
ingebouwde privéberichten. Een Bitsocial-post is versleuteld met de sleutel van de communitynode
terwijl hij via pubsub reist, maar zodra hij is geaccepteerd, is hij openbaar.

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
[mixnetroutering](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/). Nodes
sturen onderling wel verkeer door via onion-gerouteerde circuits, maar in node 2.1.0.25 is de
mixnetdienst een
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
die berichten accepteert zonder ze te mixen.

## Vergelijking

| Vraag                     | Quorum                                                                                                                  | Bitsocial                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Categorie                 | End-to-end versleutelde groepsmessenger van Quilibrium Inc.                                                             | Peer-to-peer-netwerk van communities                                                                              |
| Identiteit                | Ed448-hoofdsleutelset plus sleutels per apparaat, achter een passkey of een herstelzin                                  | Ed25519-sleutelparen voor gebruikers en communities                                                               |
| Wie kan lezen             | Leden die de sleutels van een Space hebben                                                                              | Iedereen, vanuit elke app                                                                                         |
| Waar berichten staan      | Het apparaat van elk lid; de Quorum-dienst bewaart niet-afgeleverde kopieën, en een log per Space voor mobiel           | De node van de community-eigenaar en de peers die de community lezen en seeden                                    |
| Waarmee clients verbinden | De Quorum-dienst op `api.quorummessenger.com`                                                                           | Peers via libp2p, gevonden via HTTP-routers, ook vanuit een browsertabblad                                        |
| Communities               | Spaces met kanalen, rollen en uitnodigingslinks                                                                         | Volwaardige objecten waarvan de node posts accepteert of weigert                                                  |
| Spambestrijding           | Uitnodigingslinks, kicks met nieuwe sleutels, snelheidslimieten in de client                                            | De challenge van elke community voordat een post wordt geaccepteerd                                               |
| Moderatie                 | Rollen die de client van elk lid handhaaft; de eigenaar zet leden eruit; meldingen gaan naar de beheerder van de dienst | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                                             |
| Privéberichten            | End-to-end versleutelde directe berichten                                                                               | Openbare communities; nog geen ingebouwde privéberichten                                                          |
| Economie                  | QUIL-netwerktoken; optioneel Apex-abonnement van $5 per maand                                                           | Niets in het protocol; een challenge kan een betaling of token vereisen                                           |
| Belangrijkste afweging    | Privé, versleutelde groepen, maar elke client is afhankelijk van één dienst                                             | Gratis identiteiten en toegang via de browser, maar geen privéberichten en alleen de nieuwste staat wordt bewaard |
