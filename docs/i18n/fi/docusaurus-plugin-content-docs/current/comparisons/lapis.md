---
title: Bitsocial ja Lapis Net
description: Miten Lapis Net, Kotlinilla kirjoitettu sosiaalinen vertaisverkkoprotokolla, jossa on katsojakohtaiset luottamuspisteet ja Bitcoinilla tuettu näkyvyys, vertautuu Bitsocialiin.
---

# Bitsocial ja Lapis Net

[Lapis Net](https://net.lapisproject.dev/) on Kotlinilla JVM:lle kirjoitettu sosiaalisen verkon
vertaisverkkoprotokolla. Se on päätynyt itsenäisesti Bitsocialin kaltaisiin perusratkaisuihin:
avainpareihin perustuviin identiteetteihin, IPFS-tyyliseen sisällön tallennukseen ja libp2p:n
gossipsubiin. Ne eroavat siinä, mihin ne sijoittavat roskapostin suodatuksen ja kuratoinnin. Lapis
antaa jokaiselle katsojalle henkilökohtaisen luottamusgraafin ja antaa Bitcoin- ja
Lightning-maksujen nostaa näkyvyyttä; Bitsocial antaa kunkin yhteisön päättää, mitä saa julkaista.

Lapis on toimiva prototyyppi. Sen [repositorion](https://github.com/lapisproject-dev/Lapis-Net)
mukaan sillä ei lokakuussa 2026 ollut vielä julkista verkkoa, ja kahden solmun yhdistäminen oli
käsin tehtävä vaihe.

## Miten Lapis toimii

- **Identiteetit.** Jokainen identiteetti on Bitcoin-avainten kanssa yhteensopiva
  secp256k1-avainpari, johon on sidottu Ed25519-avain libp2p:n vertaistunnistetta (peer ID) varten.
- **Tallennus ja levitys.** Sisältö tallennetaan Nabulla, joka on libp2p:n päälle tehty
  IPFS-toteutus (DHT ja Bitswap), ja levitetään libp2p:n gossipsubilla.
- **Pisteytys.** Neljä valinnaista pistemäärää rakentuu ytimen päälle, joka pysyy kuratoinnin
  suhteen neutraalina:
  - Veritas, luottamusverkko (web of trust), joka lasketaan kunkin katsojan omasta
    luottamusgraafista
  - Virtus, näkyvyys, jota tukevat ketjuun tallennetut tai Lightning-maksutodisteet, joiden vaikutus
    heikkenee ajan myötä
  - Karma, ilmaiset tykkäykset Veritaksella painotettuina
  - Madli, maineluku, jota solmut pitävät toistensa käytöksestä
- **Viestintä.** Päästä päähän salatut yksityisviestit, kahdenkeskiset äänipuhelut ja sähköpostin
  kaltainen asynkroninen viestijärjestelmä kuuluvat projektiin.
- **Asiakkaat.** Jokainen käyttäjä ajaa JVM-solmua. Viiteasiakas on verkkokäyttöliittymä, jota tämä
  paikallinen solmu tarjoilee.

## Missä ne eroavat

### Kuka suodattaa roskapostin

Lapis suodattaa katsojan päässä. Sisältö leviää, ja sen jälkeen kunkin katsojan luottamusgraafi ja
hänen käyttämänsä sovelluksen maksusäännöt ratkaisevat, mikä nousee esiin. Bitsocial suodattaa
yhteisön tasolla: julkaisun on läpäistävä yhteisön haaste ennen kuin yhteisön solmu hyväksyy sen,
joten hylätty roskaposti ei koskaan tule osaksi yhteisöä. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Kenellä on valta

Lapisissa jokainen katsoja päättää, keneen hän luottaa, ja kunkin sovelluksen operaattori päättää,
miten maksettu näkyvyys siinä toimii. Bitsocialissa yhteisön omistaja asettaa säännöt kyseiselle
yhteisölle, ja sovellukset valitsevat, mitä ne näyttävät. Kummassakaan ei ole protokollatason
ylläpitäjää.

### Talous

Lapis rakentaa Bitcoin- ja Lightning-maksutodisteet osaksi näkyvyyspisteitään. Bitsocialin
protokollassa ei ole maksukerrosta; yhteisö voi vaatia maksun tai tokenin haasteensa kautta.

### Selain

Bitsocial-sovellukset voivat ajaa vertaisverkkosolmua tavallisessa selainvälilehdessä. Katso
[Selaimen peer-to-peer](/browser-p2p/). Lapisin selainkäyttöliittymä on paikallinen sivu, jota
käyttäjän JVM-solmu tarjoilee.

### Laajuus

Lapis sisältää yksityisviestit, äänipuhelut ja postin. Bitsocial keskittyy julkisiin yhteisöihin,
eikä siinä ole vielä natiiveja yksityisviestejä.

## Vertailu

| Kysymys              | Lapis Net                                                                                       | Bitsocial                                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategoria            | Sosiaalinen vertaisverkkoprotokolla (prototyyppi)                                               | Vertaisverkkopohjainen yhteisöverkko                                                                  |
| Identiteetti         | secp256k1-avainpari, johon on sidottu Ed25519-vertaistunniste                                   | Ed25519-avainparit käyttäjille ja yhteisöille                                                         |
| Missä julkaisut ovat | Nabu-tallennuksessa (IPFS libp2p:n päällä) osallistuvilla solmuilla                             | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                           |
| Yhteisöt             | Ei yhteisöobjektia; kuratointi tapahtuu katsoja- ja sovelluskohtaisesti                         | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                   |
| Roskapostin torjunta | Katsojan luottamusgraafi, maksettu näkyvyys, Lightning-talletukset ensimmäisille viesteille     | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                |
| Moderointi           | Kunkin katsojan luottamusgraafi; sovellusten operaattorit asettavat maksetun näkyvyyden säännöt | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät                 |
| Talous               | Bitcoin- ja Lightning-maksutodisteet pisteytyksessä                                             | Ei protokollassa; haaste voi vaatia maksun tai tokenin                                                |
| Selain               | JVM-solmun tarjoilema paikallinen verkkokäyttöliittymä                                          | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                                    |
| Verkko               | Prototyyppi ilman julkista verkkoa                                                              | Toiminnassa oleva verkko, jossa on sovelluksia kuten [5chan](/apps/5chan/) ja [Seedit](/apps/seedit/) |
| Tärkein kompromissi  | Monipuolinen sisäänrakennettu maine ja viestintä, mutta ei vielä julkista verkkoa               | Pienempi ydin, joka toimii selaimissa, mutta ei sisäänrakennettua mainetta eikä yksityisviestejä      |

## Voisivatko ne toimia yhdessä?

Bitsocial-haasteet ovat mielivaltaista koodia, joten Lapis-tyylisestä luottamuspisteestä voisi tehdä
haasteen. Sisäänrakennettu `whitelist`-haaste osaa jo lukea sallittujen osoitteiden listoja
URL-osoitteista. Palvelu, joka julkaisisi ne Bitsocial-osoitteet, joihin Veritas-graafi luottaa,
voisi antaa näiden kirjoittajien ohittaa CAPTCHAn yhteisössä. Se vaatisi tavan yhdistää
Lapis-identiteetti Bitsocial-osoitteeseen, eikä mitään sellaista ole tänään olemassa.
