---
title: Täydellinen maallikon selitys Bitsocial-protokollasta
description: Yksinkertainen englanninkielinen esittely Bitsocial-yhteisöistä, vertaishakuista, julkaisuista, roskapostin torjuntahaasteista, moderointista ja sovelluksista.
---

# Täydellinen maallikon selitys Bitsocial-protokollasta

Tämä sivu selittää Bitsocialin olettamatta, että ymmärrät jo vertaisverkon, salausavaimet, IPFS:n tai pubsub-sovelluksen.

Jotkut yksityiskohdat on yksinkertaistettu tarkoituksella. Teknisempi versio on [Peer-to-Peer-protokolla](./peer-to-peer-protocol.md) -sivulla.

## Lyhyt versio

Bitsocial on sosiaalisten sovellusten protokolla, jossa yhteisöt omistavat avaimet yrityksen tietokannan sijaan.

Bitsocial-yhteisöllä on osoite. Sovellukset käyttävät tätä osoitetta löytääkseen vertaisia, jotka palvelevat yhteisöä, hakemaan uusimmat viestit kyseisiltä vertaisilta ja julkaisemaan uusia viestejä vertaisviestikanavan kautta. Ennen kuin viesti hyväksytään, yhteisö voi vaatia roskapostin estohaasteen, kuten captcha-, kutsukoodin, maksun, tunnuksen tarkistuksen, tekoälyn valvontatarkistuksen, sallittujen luettelon tai minkä tahansa muun koodattavan säännön.

Se on ydinidea:

1. Yhteisöä ohjataan yksityisellä avaimella.
2. Julkinen avain antaa yhteisölle vakaan osoitteen.
3. Vertaiset auttavat lukijoita löytämään ja hakemaan yhteisön.
4. Yhteisösolmu hyväksyy tai hylkää uudet viestit.
5. Roskapostin vastainen käytäntö kuuluu jokaiselle yhteisölle, ei yhdelle maailmanlaajuiselle alustalle.

## Miksi tiivisteillä on väliä

Hash on lyhyt sormenjälki datalle.

Jos kaksi ihmistä hajauttaa täsmälleen saman tiedoston, he saavat saman sormenjäljen. Jos tiedosto muuttuu, sormenjälki muuttuu. Tämä tekee hajautusarvoista hyödyllisiä tietojen etsimisessä ja tarkistamisessa ilman, että yritys kertoo, mikä tiedosto on.

Peer-to-peer-järjestelmät käyttävät tätä ideaa jatkuvasti. Sen sijaan, että vertaiskumppani pyytäisi yhdeltä verkkosivustolta "tiedostoa nimeltä photo.png", hän voi pyytää verkosta tietoja tietyllä sormenjäljellä. Jos toinen kumppani palauttaa väärät tiedot, hash-tarkistus epäonnistuu.

Bitsocial käyttää tiivisteitä ja sisältötunnisteita viestitiedoille ja muille yhteisön tilan osille. Tärkeä asia on yksinkertainen: tietoja voidaan käsitellä sen perusteella, mitä ne ovat, ei vain sen mukaan, missä yritys niitä isännöi.

## Miksi julkisilla avaimilla on väliä

Julkinen avain ja yksityinen avain ovat yhteensopiva pari.

Yksityinen avain on salainen. Se on asia, joka antaa hallinnan. Julkinen avain on turvallista jakaa. Sen avulla kaikki muut voivat tarkistaa, että viesti, päivitys tai valvontatoiminto todella tuli vastaavasta yksityisestä avaimesta.

Näin Bitsocial välttää normaaleja alustatilejä. Yrityksen ei tarvitse antaa henkilöllisyyttä. Tietokantarivin ei tarvitse määrittää omistajaa. Avainpari on auktoriteetti.

Yksinkertaisesti sanottuna:

- yksityinen avain on omistajan ohjauskahva
- julkinen avain on julkinen henkilöllisyys tai osoite
- Allekirjoitukset todistavat, että omistajalta tuli jokin toimenpide

## Mikä on Bitsocial-yhteisö

Bitsocial-yhteisö ei ole vain sivu yhdessä sovelluksessa.

Siinä on oma avainparinsa. Julkinen avain antaa yhteisölle vakaan verkko-osoitteen. Yksityinen avain ohjaa yhteisön tilan päivityksiä, kuten metatietoja, sääntöjä, valvojaluetteloa, haastemäärityksiä ja viittauksia viimeisimpään hyväksyttyyn sisältöön.

Tämä tarkoittaa, että yhteisö voi elää kauemmin kuin yksi käyttöliittymä. Yksi sovellus voi näyttää sen tauluna. Toinen sovellus voi näyttää sen foorumina. Tuleva sovellus voi näyttää sen profiilipohjaisessa syötteessä. Sovellus voi muuttua, mutta yhteisön osoite viittaa silti samaan omistettuun yhteisöön.

## Kuinka lukeminen toimii

Kun käyttäjä avaa Bitsocial-yhteisön, sovellus ei kysy yhtä keskustietokantaa sivulle.

Virtaus on lähempänä tätä:

1. Sovellus tietää jo yhteisön osoitteen tai hakee sen luettelosta, linkistä, hakupinnasta tai
   ihmisen luettava nimi.
2. Sovellus kysyy kevyiltä reitittimiltä, mitkä kumppanit tarjoavat tällä hetkellä kyseisen yhteisön osoitteen.
3. Reitittimet palauttavat vain vertaisosoitteet. He eivät palauta viestejä, sääntöjä, profiileja tai yhteisöjä
   metatiedot.
4. Sovellus muodostaa yhteyden vertaisiin ja hakee uusimman yhteisön tilan.
5. Tämä tila sisältää viitteitä julkaista sisältöä.
6. Sovellus hakee viestin sisällön vertaisilta ja hahmontaa sen tavallisessa sosiaalisessa käyttöliittymässä.

Reititin on vain hakuapu. Se on lähempänä kysymystä "kenellä tämä on?" kuin kysyä "palvelkaa minulle koko verkkosivusto."

Lisätietoja tästä jaosta on artikkelissa [Sisällön löytäminen](./content-discovery.md).

## Miten lähettäminen toimii

Lähettäminen eroaa lukemisesta, koska avoimet vertaisverkot voivat lähettää roskapostia.

Bitsocial hoitaa julkaisun haaste-vastauskulkujen kautta:

1. Käyttäjä kirjoittaa viestin tai vastauksen.
2. Sovellus liittyy yhteisön peer-to-peer-viestien aiheeseen.
3. Sovellus pyytää yhteisösolmulta haastetta.
4. Yhteisösolmu lähettää haasteen takaisin.
5. Käyttäjä tai sovellus suorittaa haasteen.
6. Sovellus lähettää viestin ja haastevastauksen.
7. Yhteisösolmu tarkistaa vastauksen ja viestin.
8. Jos se hyväksytään, yhteisön solmu hyväksyy viestin yhteisön seuraavaan päivitykseen.
9. Muut lukijat hakevat päivitetyn yhteisön tilan vertaisilta.

Haaste tapahtuu ennen kuin viestistä tulee osa hyväksyttyä yhteisön tilaa. Tämä on tärkeä ero järjestelmiin, joissa roskaposti hyväksytään ensin ja piilotetaan myöhemmin.

## Miksi roskapostin torjuntahaasteet ovat tärkeitä

Useimmat sosiaaliset alustat muuttavat roskapostin eston alustakäytännöksi. Yksi yritys päättää, mikä lasketaan kelvolliseksi tiliksi, kelvolliseksi viestiksi, kelvolliseksi tavoittavuudeksi tai kelvolliseksi käyttäjäksi.

Bitsocial erottaa nämä asiat. Protokolla antaa yhteisöille tavan vaatia haastetta ennen julkaisun hyväksymistä, mutta se ei pakota jokaista yhteisöä käyttämään samaa haastetta.

Yksi yhteisö saattaa käyttää captchaa. Toinen saattaa käyttää kutsukoodeja. Toinen saattaa vaatia tekstiviestisekin, maksun, NFT:n, token-saldon, tekoälyn valvontapisteet, mainetodistuksen, yhteisökohtaisen sallittujen luettelon tai mukautetun säännön.

Tällä joustavuudella on merkitystä, koska roskaposti muuttuu. Protokollatason roskapostisääntö vanhenee. Yhteisötason haaste voi kehittyä siirtämättä koko verkkoa.

Tarkennetun selityksen saamiseksi lue [Mukautetut roskapostin torjuntahaasteet](./custom-challenges.md).

## Miten maltillisuus toimii

Bitsocial ei ole maltillinen. Se on moderointia ilman yhtä globaalia superjärjestelmänvalvojaa.

Yhteisöllä voi olla omistajia ja valvojia. Valvojan osoitteet ovat osa yhteisön tilaa. Kun moderaattori tekee toimenpiteen, se voidaan allekirjoittaa. Yhteisösolmu ja asiakkaat voivat tarkistaa allekirjoituksen moderaattoriluettelosta.

Tämä antaa maltillisuudelle paikallisen ulottuvuuden:

- yhteisön omistaja hallitsee yhteisöä
- moderaattorit toimivat yhteisön tunnistamien avainten kautta
- sovellukset voivat silti valita, mitä ne indeksoivat, arvostavat, piilottavat tai korostavat
- mikään protokollatason yritystili ei voi poistaa jokaista identiteettiä tai kaapata jokaista yhteisöä

Käytännössä tämä tarkoittaa, että yhteisö voi poistaa roskapostia tai valvoa sääntöjen noudattamista omassa tilassaan muuttamatta sääntöjään laiksi koko verkossa.

Käytäntönäkymää varten lue [Paikallinen maltillisuus, ei muotoet kiellot](./local-moderation.md).

## Mitä sovelluksia lisää

Protokolla ei päätä, miltä koko tuotteen tulee näyttää.

Sovellus lisää ihmiskokemuksen protokollan ympärille:

- oletusyhteisöluettelot
- etsiminen ja löytö
- syötteet ja sijoitus
- ulkoasu ja lähetyskäyttöliittymä
- median käsittely
- moderointityökalut
- mobiili-, työpöytä- tai selainpakkaus
- liiketoimintamalli ja oletukset

Siksi Bitsocial voi tukea erilaisia sovellustyylejä. 5chan voi tuntua kuvataululta. Seedit voi tuntua foorumityyliseltä keskustelulta. Muut asiakkaat voivat rakentaa erilaisia ​​etsintäpintoja, sijoitusjärjestelmiä, valvontanäkymiä tai yhteisön oletusasetuksia käyttäessään silti yhteensopivia Bitsocial-yhteisöjä alla.

Protokolla pitää omistajuuden ja julkaisun kannettavana. Sovellukset kilpailevat tuotteiden laadusta.

## Mitä julkinen RPC lisää

Vertaisverkkosolmun käyttäminen suoraan on tehokasta, mutta kaikki eivät halua hallita aina päällä olevaa konetta.

Julkinen RPC on palvelukerros, joka voi tehdä Bitsocialista kätevämmän. Julkinen RPC-palveluntarjoaja voi auttaa käyttäjiä hallitsemaan yhteisöjä puhelimella tai kevyellä asiakkaalla, kun taas pitkän aikavälin omistusmallin pitäisi silti antaa käyttäjien muuttaa pois, isännöidä itse tai valita kilpaileva palveluntarjoaja.

Erotuksella on merkitystä:

- RPC voi auttaa lisäämään käytettävyyttä ja mukavuutta
- RPC:stä ei pitäisi tulla pysyvää huoltajuutta
- omistajasuhteen tulee pysyä sidottuina avaimiin, ei yhden palveluntarjoajan tietokantaan

## Mitä Bitsocial ei ole

Bitsocial ei ole blockchain-sosiaalinen verkosto. Sosiaalinen media ei tarvitse jokaista viestiä tullakseen tapahtumaksi yhdessä globaalissa kirjanpidossa.

Bitsocial ei ole liittoutuminen ActivityPubin merkityksessä. Yhteisön ei tarvitse olla tili yhdellä palvelimella, jossa on yksi toimialue, yksi järjestelmänvalvoja ja yksi palvelintietokanta.

Bitsocial ei myöskään ole yksi sovellus. Se on jaettu protokollakerros sovelluksille, yhteisöille, solmuille, reitittimille, RPC-palveluntarjoajille, etsintäpalveluille, roskapostin torjuntamoduuleille ja valvontatyökaluille.

Tarkoitus ei ole se, että jokaisen käyttäjän on ymmärrettävä tämä kaikki ennen lähettämistä. Asia on siinä, että tuote voi tuntua normaalilta, kun alla oleva omistusmalli on erilainen.

## Minne seuraavaksi

- [Peer-to-Peer-protokolla](./peer-to-peer-protocol.md) selittää teknisen kulun.
- [Sisällön löytäminen](./content-discovery.md) selittää verkkohaun ja sovellusten kuroinnin.
- [Mukautetut roskapostin torjuntahaasteet](./custom-challenges.md) selittää haastejärjestelmän.
- [Identiteetti ja yhteisön omistajuus](./identity-and-ownership.md) selittää avaimella ohjatun
  omistus.
- [Rakenna oma asiakas](/build-your-own-client/) selittää, kuinka itsenäiset sovellukset voivat rakentaa
  sama verkko.
