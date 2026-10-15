---
title: Bitsocial ja Urbit
description: Miten Urbit, henkilökohtaisten palvelinten verkko, jossa on Ethereumiin perustuvat Urbit ID:t ja Tlon Messengerin isännän ylläpitämät ryhmät, vertautuu Bitsocialin vertaisverkkoyhteisöihin.
---

# Bitsocial ja Urbit

[Urbit](https://urbit.org/) on henkilökohtaisten palvelinten verkko. Jokaisella käyttäjällä on aina
päällä oleva tietokone, jota kutsutaan alukseksi. Alus ajaa Urbitin omaa käyttöjärjestelmää (Arvo),
joka on kirjoitettu Urbitin omilla kielillä (Nock ja Hoon), ja alus tunnistetaan Urbit ID:n avulla.
Urbitin tärkein sosiaalinen sovellus on [Tlon Messenger](https://tlon.io/), jonka on rakentanut
Tlon, vuonna 2013 Urbitin kehittämistä varten perustettu yritys.

Urbit pyrkii korvaamaan koko tietotekniikkapinon, joten se on paljon laajempi hanke kuin Bitsocial.
Sen sosiaalinen kerros käyttää kuitenkin Bitsocialin kaltaista mallia: yhteisö elää omistajansa
solmulla, ja tämä solmu päättää, mitä sinne pääsee. Ne eroavat siinä, kenen on ajettava palvelinta,
ja siinä, miten roskaposti pidetään poissa.

## Miten Urbit toimii

- **Urbit ID:t.** Jokaisella aluksella on Urbit ID: numero, joka näytetään lausuttavana nimenä,
  kuten `~sampel-palnet`. Layer 1 -ID:t ovat NFT:itä, joiden omistajuus ja verkkoyhteyksien
  julkiset avaimet kirjataan Ethereumissa oleviin Azimuth-sopimuksiin. Vuonna 2021 maksujen
  pienentämiseksi lisätyt Layer 2 -ID:t käyttävät "naiivia rollupia": niiden transaktiot julkaistaan
  Ethereumiin erinä, mutta niiden omistajuutta ei tallenneta Azimuth-sopimukseen, vaan jokainen alus
  laskee sen paikallisesti. Tlon ylläpitää rolleria, jota kuka tahansa voi käyttää maksutta,
  kertovat [Urbit ID -dokumentaatio](https://docs.urbit.org/urbit-id/what-is-urbit-id) ja
  [Get on Urbit](https://docs.urbit.org/get-on-urbit) -opas.
- **Kiinteä hierarkia.** Osoiteavaruudessa on 256 galaksia, 65 536 tähteä ja noin 4 miljardia
  planeettaa jokapäiväiseen käyttöön. Galaksit myöntävät tähtiä, tähdet myöntävät planeettoja, ja
  jokainen planeetta voi myöntää kuita omille laitteilleen. Komeetat ovat ilmaisia ID:itä, jotka alus
  luo itselleen ja jotka eivät koskaan päädy lohkoketjuun. Galaksien omistajat muodostavat Galactic
  Senaten, joka äänestää Azimuth-sopimusten päivityksistä ja valitsee Urbit Foundationin hallituksen.
- **Verkkoliikenne.** Alukset vaihtavat salattuja paketteja suoraan vertaiselta vertaiselle.
  Heinäkuusta 2026 lähtien verkkoprotokollana on ollut
  [Directed Messaging](https://urbit.org/blog/directed-messaging), vanhemman Ames-protokollan
  sisältökeskeinen uudelleenkirjoitus. Galaksit huolehtivat vertaisten löytämisestä: kukin pitää
  kirjaa siitä, missä sen alaiset alukset ovat, ja välittää niille paketteja, kunnes kaksi alusta
  tavoittaa toisensa suoraan, tai niin kauan kuin palomuuri estää sen. Näin kertoo
  [Directed Messaging -artikkeli](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Ryhmät.** Tlon Messengerissä ryhmää isännöi sen luojan alus. Jäsenet lähettävät viestit
  isännälle, joka jakaa ne jokaisen jäsenen alukselle, ja jokaisen jäsenen alus säilyttää oman
  kopionsa, kertoo [Tlonin UKK](https://tlon.io/posts/faq). Isäntä hallitsee rooleja, kanavia ja
  pääsyä ryhmään. Ryhmä voi olla julkinen, yksityinen tai salainen, ja se voi
  [asettaa porttikiellon yksittäisille aluksille tai kokonaisille ID-luokille](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanavat ovat chatteja, muistikirjoja tai kuvien ja linkkien kokoelmia.
- **Isännöinti.** Tloniin rekisteröityvä uusi käyttäjä saa aluksen, jota Tlon ajaa ja jonka avaimet
  ovat Tlonin säilytyksessä. Käyttäjä voi viedä aluksen ja sen pääavaimen (master ticket) ulos ja
  ajaa alusta muualla: [Native Planet](https://www.nativeplanet.io/) -laitteella tai
  Vere-ajoympäristöllä Linuxissa, macOS:ssä tai Windowsissa. Alukset eivät vielä pysty tallentamaan
  suuria tiedostoja suoraan, joten Tlon Messenger tallentaa kuvat ja muun median S3-yhteensopivaan
  pilvitallennukseen.

## Missä ne eroavat

### Kenen on ajettava palvelinta

Urbitissa jokainen osallistuja on palvelin. Tlonin sovellukset ovat käyttöliittymiä käyttäjän
omalle alukselle, ja jopa ryhmän lukeminen kulkee sen kautta. Ne, jotka eivät aja alusta itse,
vuokraavat sellaisen, mikä tuo isännöintipalvelun tarjoajan takaisin kuvaan: Tlon pitää hallussaan
isännöityjen käyttäjien avaimia ja säilyttää rajoitetun pääsyn ylläpitoa varten, vaikka käyttäjät
voivat lähteä koko aluksensa kanssa.

Bitsocialissa vain yhteisöjen omistajat tarvitsevat aina päällä olevan solmun. Lukijat ja
julkaisijat voivat ajaa vertaisverkkosolmua selainvälilehdessä, ja heidän tilinsä on avainpari,
jota sovellus säilyttää. Katso [Selaimen peer-to-peer](/browser-p2p/). Kun joku kuitenkin käyttää
isännöityä solmua, Bitsocialin suunnittelun tavoitteena on antaa hänen delegoida solmun pitäminen
verkossa luovuttamatta identiteettiään toisen haltuun. Katso
[Identiteetti ja yhteisön omistajuus](/identity-and-ownership/).

### Yhteisön isäntä

Tässä ne ovat lähimpänä toisiaan. Tlon-ryhmä ja Bitsocial-yhteisö elävät kumpikin omistajansa
solmulla. Isäntä päättää, kuka saa julkaista, soveltaa moderointia ja jakaa tuloksen, eikä
kumpikaan protokolla aseta moderaattoria isännän yläpuolelle. Kummassakin isännän on oltava
verkossa. Tlonin UKK:n mukaan, jos isäntä putoaa verkosta, "ryhmä kaatuu sen mukana", eikä
Bitsocial-yhteisö voi ottaa vastaan uusia julkaisuja, kun sen solmu on poissa verkosta.

Ne tallentavat sisältöä eri tavoin. Jokaisen jäsenen alus säilyttää kopion ryhmän historiasta,
joten jäsenet voivat yhä lukea sen, minkä he ovat jo saaneet, vaikka isäntä on poissa verkosta.
Bitsocial-lukija hakee yhteisön uusimman tilan yhteisön solmulta tai vertaisilta, jotka jakavat
sitä, joten verkosta poissa oleva yhteisö pysyy luettavana niin kauan kuin se on vertaisilla, mutta
verkko säilyttää vain uusimman tilan.

Tlon-ryhmällä on myös jäsenlista, ja sen isäntä voi tehdä siitä kutsupohjaisen. Bitsocial-yhteisöllä
ei ole jäsenyyttä: kuka tahansa voi lukea sitä, ja kuka tahansa voi yrittää julkaista siihen sen
haasteen ehdoilla.

### Roskaposti ja identiteetti

Urbit torjuu roskapostia tekemällä identiteetistä niukan. Planeettojen määrä on kiinteä, ja
jokaisen niistä myöntää jokin tähti. Ilmaiset komeetat kiertävät tämän niukkuuden, joten ryhmät,
jotka haluavat niukkuuden pitävän, käännyttävät ne pois: Urbitin dokumentaatio mainitsee, että
jotkin ryhmät eivät päästä komeettoja sisään, ja Tlon-ryhmä voi asettaa porttikiellon koko
komeettaluokalle yhdellä asetuksella. Kun komeetat on suljettu ulos, porttikiellon saanut käyttäjä
tarvitsee palatakseen toisen planeetan joltakin tähden omistajalta. Maine voi myös seurata
hierarkiaa: Azimuthiin kuuluu Censures-sopimus, jonka avulla galaksit ja tähdet voivat merkitä
ID:itä. Koska niukkuus on rakennettu osoiteavaruuteen, se toimii samalla tavalla jokaisessa
ryhmässä, joka käännyttää komeetat pois.

Bitsocial-identiteetit ovat ilmaisia avainpareja. Jokainen yhteisö valitsee oman haasteensa ennen
kuin se hyväksyy julkaisun, esimerkiksi captchan, maksun, tokenisaldon tai sallittujen listan, ja
muut yhteisöt voivat valita toisin. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Lohkoketju ja hallinto

Urbitin identiteettikerros on riippuvainen Ethereumista. Azimuth-sopimukset kirjaavat
Layer 1 -omistajuuden ja verkkoyhteyksien avaimet, Layer 2 -transaktiot julkaistaan Ethereumiin
erinä, ja Galactic Senate voi päivittää sopimuksen, joka hallitsee Azimuthia. Samat 256 galaksia
hoitavat myös vertaisten löytämisen ja liikenteen välittämisen, joten kiinteä identiteettijoukko
kantaa sekä hallinnon että osan verkon reitityksestä.

Bitsocial-identiteetit ovat avainpareja, jotka eivät vaadi rekisteröintiä. `.bso`- ja `.eth`-nimet
ovat valinnaisia aliaksia, jotka ratkeavat näiksi avainpareiksi. Vertaisten löytäminen kulkee
HTTP-reitittimien kautta, jotka palauttavat vain tarjoajien osoitteet; kuka tahansa voi ajaa
sellaista, ja asiakkaat voivat vaihtaa reititintä muuttamalla asetuksiaan.

### Laajuus

Urbit on yleiskäyttöinen tietokone. Alus voi isännöidä Git-etärepositoriota, henkilökohtaista
tietämyskantaa tai tekoälyagentteja, ja Tlon Messenger on yksi ohjelma monien joukossa. Urbitille
rakentaminen tarkoittaa enimmäkseen Hoon-sovellusten kirjoittamista Arvolle. Bitsocial on julkisten
yhteisöjen protokolla, ja sillä on sovelluksia kuten [5chan](/apps/5chan/) ja
[Seedit](/apps/seedit/). Se toimii olemassa olevan pinon (libp2p, IPFS ja selain) päällä sen sijaan,
että korvaisi sen, ja sen asiakkaat rakennetaan tavallisilla verkkokehityksen työkaluilla. Katso
[Rakenna oma asiakas](/build-your-own-client/).

### Yksityisviestit

Tässä Urbit on vahvempi. Yksityisviestit kulkevat aluksesta suoraan toiseen, kaikki alusten
välinen liikenne on salattua, ja ryhmät voivat olla yksityisiä tai salaisia. Tlon huomauttaa, että
viestit salataan siirron ajaksi, mutta ne tallennetaan alukselle salaamattomina. Bitsocial keskittyy
julkisiin yhteisöihin, eikä siinä ole vielä natiiveja yksityisviestejä.

## Projektin tila

Urbit on käynyt läpi myllerryksen. Elokuussa 2024 Urbit Foundation, ydinkehitystä ohjaava voittoa
tavoittelematon järjestö, erotti toiminnanjohtajansa; perustaja Curtis Yarvin palasi johtamaan
strategiaa ilman virallista titteliä, useat ydinkehittäjät lähtivät, ja säätiön rahojen arvioitiin
riittävän enää kuukausiksi,
[kertoi CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin ehdotti Azimuthin siirtämistä olemassa olevaan Ethereumin layer 2 -verkkoon, jolloin
todennäköisin vaihtoehto oli Base, sekä vaihdettavien "viisumi"-tokenien liikkeeseen laskemista,
jotka voisi muuntaa planeetoiksi. Lokakuussa 2026 Urbitin
[ID-dokumentaatio](https://docs.urbit.org/urbit-id/what-is-urbit-id) kuvaa yhä Azimuthia
Ethereumissa naiiveine rollupeineen. Lokakuussa 2025 Galactic Senate vaihtoi säätiön hallituksen,
ja uusi hallitus nimitti uuden toiminnanjohtajan
([tiedote](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Kehitys jatkuu. Directed Messaging otettiin käyttöön 408k-julkaisussa 14. heinäkuuta 2026.
Kesäkuussa 2026 Tlon Messenger
[avasi julkiset rekisteröitymiset ilman jonotuslistaa](https://urbit.org/blog/this-month-in-urbit-june-2026),
ja Tlon esittelee itsensä nyt paikkana, jossa ihmiset ja tekoälyagentit työskentelevät yhdessä.

## Vertailu

| Kysymys               | Urbit                                                                                                                     | Bitsocial                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Kategoria             | Henkilökohtaisten palvelinten verkko ja käyttöjärjestelmä                                                                 | Vertaisverkkopohjainen yhteisöverkko                                                               |
| Identiteetti          | Urbit ID:t: noin 4 miljardia planeettaa Ethereumissa tai sen Layer 2 -rollupissa sekä ilmaiset komeetat                   | Ed25519-avainparit käyttäjille ja yhteisöille                                                      |
| Kuka ajaa palvelinta  | Jokainen käyttäjä, omalla tai isännöidyllä aluksella                                                                      | Yhteisöjen omistajat; lukijat ja julkaisijat voivat käyttää selainvälilehteä                       |
| Missä julkaisut ovat  | Ryhmän isännän aluksella sekä kopiona jokaisen jäsenen aluksella                                                          | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                        |
| Yhteisöt              | Luojansa aluksen isännöimät ryhmät, joilla on jäsenlistat                                                                 | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                |
| Roskapostin torjunta  | Tähtien myöntämät niukat ID:t; ryhmät asettavat porttikieltoja aluksille tai kokonaisille luokille                        | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                             |
| Moderointi            | Ryhmän isännän roolit ja porttikiellot                                                                                    | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät              |
| Vertaisten löytäminen | Galaksit pitävät kirjaa alaisistaan aluksista ja välittävät niiden liikennettä                                            | HTTP-reitittimet palauttavat tarjoajavertaiset eivätkä tallenna sisältöä                           |
| Hallinto              | 256 galaksin Galactic Senate äänestää Azimuthin päivityksistä                                                             | Ei protokollatason auktoriteettia identiteettien tai yhteisöjen yllä                               |
| Yksityisviestit       | Salatut yksityisviestit ja kutsupohjaiset ryhmät                                                                          | Julkiset yhteisöt; ei vielä natiiveja yksityisviestejä                                             |
| Tärkein kompromissi   | Kokonainen henkilökohtainen tietokone yksityisine ryhmineen, mutta jokainen käyttäjä tarvitsee aina päällä olevan aluksen | Ilmaiset identiteetit ja selainkäyttö, mutta ei yksityisviestintää, ja vain uusin tila säilytetään |
