---
title: Bitsocial ja Mirage
description: Miten Mirage, Reddit-tyylinen foorumi omassa Cosmos SDK -lohkoketjussaan, vertautuu Bitsocialiin ja sen Reddit-tyyliseen Seedit-sovellukseen.
---

# Bitsocial ja Mirage

[Mirage](https://mirage.foundation/) on Reddit-tyylinen keskusteluverkko, jossa on yhteisöjä,
ketjutettuja julkaisuja ja äänestyksiä. Yrityksen tietokannan sijaan se toimii omassa
lohkoketjussaan, Cosmos SDK -ketjussa, jossa on CometBFT-konsensus. Bitsocialin lähin tuote on
[Seedit](/apps/seedit/), Reddit-tyylinen sovellus Bitsocial-verkossa, joten vertailu koskee lähinnä
sitä, miten kumpikin isännöi, omistaa ja moderoi yhteisöjä.

## Miten Mirage toimii

- **Solmut.** Mirage-solmu on yksi Docker-kontti, joka sisältää validaattorin,
  PostgreSQL-tietokannan, indeksoijan, HTTP-API:n ja web-käyttöliittymän. Jokainen solmu on myös
  validaattori. Solmun ajaminen vaatii
  [käyttöönotto-oppaan](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md)
  mukaan amd64-pohjaisen Ubuntu-palvelimen ja 10 000 000 MIRAGE-tokenia operaattorin tilillä.
- **Julkaiseminen.** Selain allekirjoittaa jokaisen toiminnon käyttäjän secp256k1-avaimella, ja
  ilmaiskäyttäjät laskevat lisäksi pienen proof-of-workin. Solmu käärii toiminnon ketjutransaktioon
  ja maksaa maksun.
- **Lukeminen.** Kunkin solmun indeksoija kopioi ketjun datan omaan tietokantaansa ja tarjoilee
  syötteitä HTTP-API:n kautta. Solmut säilyttävät noin viikon lohkot, joten pitkän aikavälin
  julkaisuhistoria on kunkin solmun tietokannassa, ja uusi solmu aloittaa ilman
  synkronointipistettään edeltävää historiaa.
- **Tilit.** Tili on avain, joka johdetaan 12 sanan siemenlauseesta, ja sama siemenlause toimii
  millä tahansa solmulla. Käyttäjänimet kirjataan ketjuun, ja ne ovat yksilöllisiä koko verkossa.
- **Yhteisöt.** Jokainen kelvollinen nimi on jo yhteisö, eikä kukaan omista sitä. Maksulliset,
  enintään kymmenen käyttäjän kuraattoritiimit ylläpitävät kukin omaa moderoitua näkymäänsä
  yhteisöön; lukijat valitsevat tiimin näkymän, solmun oletusnäkymän tai sensuroimattoman näkymän.
  Katso [Miragen usein kysytyt kysymykset](https://mirage.talk/faq).
- **Token.** MIRAGE-tokenilla maksetaan tilaukset ja palkitaan kirjoittajia ja solmuja, ja se antaa
  validaattoreille äänivaltaa hallinnossa. Tilaajat ohittavat proof-of-workin ja saavat korkeammat
  rajat.

## Missä ne eroavat

### Kuka omistaa yhteisön

Seeditissä yhteisön luoja pitää hallussaan sen avainparia, ajaa sen solmua tai delegoi sen ja
moderoi yhteisöä. Miragessa kukaan ei omista yhteisöä: kilpailevat kuraattoritiimit tarjoavat
moderoituja näkymiä samaan nimeen, ja oletusnäkymä on sen tiimin, jonka useimmat maksavat tilaajat
ovat valinneet.

### Roskapostin torjunta

Mirage soveltaa koko verkkoon yhtä sääntöä: ilmaiskäyttäjät maksavat proof-of-workilla, jonka
vaikeus mukautuu saapuvaan määrään, ja tilaajat ohittavat sen. Bitsocialissa jokainen yhteisö
valitsee oman haasteensa captchoista sallittujen listoihin ja maksuihin. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Infrastruktuuri

Mirage tarvitsee lohkoketjun. Validaattorit saavuttavat konsensuksen jokaisesta toiminnosta, ja
jokainen solmu ajaa täyttä palvelinpinoa, ja sen on pidettävä hallussaan suurta tokenipanosta.
Bitsocialissa ei ole ketjua: yhteisösolmu toimii kuluttajalaitteistolla työpöytäsovelluksesta tai
`bitsocial-cli`-työkalulla, ja lukijat voivat auttaa sisällön jakamisessa.

### Koko verkon hallinta

Miragessa on ketjussa toimiva hallinto, jota painotetaan validaattorien panoksella. Se voi muuttaa
vaikeutta, hintoja ja tokenien liikkeeseenlaskua, lyödä tai polttaa tokeneita ja nimittää
ylläpitäjiä, joiden poistot viiteindeksoija soveltaa mihin tahansa julkaisuun. Ketjun koodi antaa
hallinnolle myös mahdollisuuden
[poistaa tilejä](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
ja
[lähettää tokeneita mistä tahansa osoitteesta](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Lokakuussa 2026 ketjun lohkot tuotti neljä validaattoria, ja projektin omat runbookit hallinnoivat
kaikkia neljää.

Bitsocialissa ei ole protokollatason ylläpitäjää. Yhteisöjen omistajat moderoivat omia yhteisöjään,
ja sovellukset valitsevat, mitä ne näyttävät. Katso
[Paikallinen moderointi, ei globaaleja estoja](/local-moderation/).

### Selain

Miragen verkkoasiakas on solmun HTTP-asiakas: selain allekirjoittaa toimintoja mutta ei liity
vertaisverkkoon. Bitsocial-sovellukset voivat ajaa vertaisverkkosolmua selainvälilehden sisällä.
Katso [Selaimen peer-to-peer](/browser-p2p/).

## Vertailu

| Kysymys                 | Mirage                                                                                                                               | Bitsocial                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Kategoria               | Foorumi omassa lohkoketjussaan (Cosmos SDK)                                                                                          | Vertaisverkkopohjainen yhteisöverkko                                                                           |
| Identiteetti            | 12 sanan siemenlauseesta johdettu secp256k1-avain ja ketjuun tallennettu käyttäjänimi                                                | Ed25519-avainparit käyttäjille ja yhteisöille                                                                  |
| Missä julkaisut ovat    | Ketjutransaktioissa ja sen jälkeen kunkin solmun PostgreSQL-tietokannassa                                                            | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                                    |
| Kuka pitää sen verkossa | Validaattorisolmut, joilla kullakin on 10 000 000 MIRAGE-tokenia                                                                     | Yhteisön omistajan solmu sekä avustavat jakajat                                                                |
| Yhteisöt                | Omistajattomia nimiä, joista kilpailevat maksulliset kuraattoritiimit                                                                | Avainparin omistamia; omistajan solmu hyväksyy tai hylkää julkaisut                                            |
| Roskapostin torjunta    | Koko verkon proof-of-work; tilaajat ohittavat sen                                                                                    | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                         |
| Moderointi              | Kuraattoritiimien näkymät, henkilökohtaiset suodattimet, hallinnon nimittämät ylläpitäjät                                            | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät                          |
| Talous                  | MIRAGE-token tilauksiin, palkkioihin ja validaattoripanokseen                                                                        | Ei protokollassa; haaste voi vaatia maksun tai tokenin                                                         |
| Selain                  | Solmun HTTP-asiakas                                                                                                                  | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                                             |
| Tärkein kompromissi     | Yksi jaettu, järjestetty tila ja helppo rekisteröityminen, mutta pieni validaattorijoukko ja koko verkkoa koskevat hallintovaltuudet | Ketjua tai panosta ei tarvita, mutta ei globaalia järjestystä, eikä vanhan sisällön säilymistä taata ikuisesti |
