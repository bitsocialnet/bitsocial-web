---
title: Bitsocial ja Farcaster
description: Miten Farcaster ketjuun tallennettuine tileineen, tallennustilan vuokrineen ja Snapchain-validaattoriverkkoineen vertautuu Bitsocialin vertaisverkkoyhteisöihin.
---

# Bitsocial ja Farcaster

[Farcaster](https://docs.farcaster.xyz/) pitää identiteetin lohkoketjussa ja sosiaalisen datan sen
ulkopuolella. Tilit, sovellusavaimet ja tallennusmaksut ovat sopimuksissa OP Mainnetissä, joka on
Ethereumin layer 2 -verkko. Julkaisut eli castit sekä seuraamiset ja reaktiot ovat allekirjoitettuja
viestejä, joita tallentaa [Snapchain](https://snapchain.farcaster.xyz/), lohkoketjun kaltainen
verkko, joka korvasi vuonna 2025 Farcasterin aiemman Hub-verkon.

## Miten Farcaster toimii

- **Tilit.** Tili on numeerinen Farcaster ID, jonka omistaa Ethereum-osoite; osoite voi myös asettaa
  palautusosoitteen. Sovellukset julkaisevat delegoiduilla sovellusavaimilla, jotka on rekisteröity
  ketjuun; sovellusavain ei voi kaapata tiliä.
- **Tallennustilan vuokra.** Jokainen tili vuokraa tallennusyksiköitä, tällä hetkellä hintaan 0,20
  dollaria yksiköltä vuodessa. Heinäkuusta 2025 lähtien vuokrattuun yksikköön mahtuu 100 castia; sen
  ylittyessä vanhimmat castit karsitaan. Nopeusrajoitukset skaalautuvat vuokratun tallennustilan
  mukaan.
- **Snapchain.** Validaattorit järjestävät viestit lohkoiksi Tendermint-tyylisellä konsensuksella,
  ja jokainen täysi solmu säilyttää koko verkon datan. Solmut tarvitsevat
  [solmuoppaan](https://snapchain.farcaster.xyz/getting-started) mukaan noin 16 Gt RAM-muistia ja 2
  Tt tallennustilaa.
- **Nimet.** Oletuskäyttäjänimet eli fnamet ovat ilmaisia, ja niitä myöntää Farcasterin oma
  nimipalvelin, joka [voi perua ne](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames).
  Käyttäjät voivat sen sijaan käyttää Ethereumiin rekisteröityä `.eth`-nimeä.
- **Kanavat.** Aihekanavat ovat Farcaster-asiakkaan kokeellinen ominaisuus. Kanavan castit ovat
  protokolladataa, mutta kanavien metatiedot, seuraamiset ja moderointi
  [tallennetaan asiakkaaseen](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lukeminen.** Sovellukset lukevat dataa itse ajamansa Snapchain-solmun tai hallinnoidun
  palveluntarjoajan, yleensä Neynarin, kautta.

## Missä ne eroavat

### Lohkoketjut ja validaattorit

Farcaster on riippuvainen OP Mainnetistä tilien ja maksujen osalta ja lohkoketjun kaltaisesta
Snapchainista kaiken sosiaalisen datan järjestämisessä. Snapchainin validaattorijoukko on
luvanvarainen. Snapchainin whitepaperin mukaan sensuroinnista tulee vaikeaa, kun validaattoreita on
noin kymmenen eri puolilla maailmaa; lokakuussa 2026 sen
[validaattorilista](https://snapchain.farcaster.xyz/validators) oli tätä pienempi, ja useimmat
avaimet kuuluivat Neynarille, joka
[osti Farcasterin](https://neynar.com/blog/neynar-is-acquiring-farcaster) tammikuussa 2026.
Bitsocialilla ei ole ketjua, validaattoreita eikä konsensusta.

### Maksaminen julkaisemisesta

Jokainen Farcaster-tili maksaa tallennustilan vuokraa, ja tallennustila rajaa sen, kuinka paljon
tilin historiasta verkko säilyttää. Bitsocialissa julkaiseminen ei maksa protokollatasolla mitään;
kukin yhteisö päättää, vaatiiko se captchan, maksun, tokenin vai jotain muuta. Katso
[Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Yhteisöt

Farcasterin kanavat ovat asiakasohjelman ominaisuus: asiakas tallentaa niiden metatiedot ja valvoo
kanavien moderointia, joten kanavassa estetty cast voi pysyä verkossa kelvollisena ja näkyä muissa
sovelluksissa. Bitsocialissa yhteisöt ovat protokollaobjekteja, joilla on oma avainparinsa, ja
yhteisön solmu hyväksyy tai hylkää julkaisut.

### Infrastruktuurin ylläpito

Farcaster-solmu säilyttää koko verkon, joten sen tallennustarve kasvaa kaiken toiminnan myötä;
Farcaster ennustaa kasvun lähestyvän suurimpia pilvilevyjä. Bitsocialin yhteisösolmu säilyttää vain
omat yhteisönsä ja toimii kuluttajalaitteistolla.

### Selain

Farcasterin selainsovellus on solmun tai palveluntarjoajan HTTP-asiakas. Bitsocialin verkkosovellus
voi ajaa vertaisverkkosolmua välilehden sisällä. Katso [Selaimen peer-to-peer](/browser-p2p/).

## Vertailu

| Kysymys                 | Farcaster                                                                                  | Bitsocial                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Kategoria               | Ketjuun tallennettu identiteetti ja validaattorien järjestämä sosiaalinen data             | Vertaisverkkopohjainen yhteisöverkko                                                                        |
| Identiteetti            | Ethereum-osoitteen omistama Farcaster ID ja delegoidut sovellusavaimet                     | Ed25519-avainparit käyttäjille ja yhteisöille                                                               |
| Missä julkaisut ovat    | Snapchainissa, replikoituna jokaiselle täydelle solmulle, maksetun tallennustilan rajoissa | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                                 |
| Kuka pitää sen verkossa | Snapchainin validaattorit ja solmujen ylläpitäjät                                          | Yhteisön omistajan solmu sekä avustavat jakajat                                                             |
| Yhteisöt                | Farcaster-asiakkaan hallinnoimat kokeelliset kanavat                                       | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                         |
| Roskapostin torjunta    | Tallennustilan vuokra ja nopeusrajoitukset sekä sovellustason roskapostimerkinnät          | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                      |
| Moderointi              | Kanavien isännät asiakkaassa, sovellusten suodattimet, sensuuririski validaattoritasolla   | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät                       |
| Nimet                   | Ilmaiset fnamet, jotka Farcaster voi perua, tai `.eth`-nimet                               | `.bso`- ja `.eth`-nimet, jotka ratkeavat avaimiksi                                                          |
| Selain                  | Solmun tai palveluntarjoajan HTTP-asiakas                                                  | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                                          |
| Tärkein kompromissi     | Yksi yhtenäinen globaali tietoaineisto, mutta vuokra, ketjut ja pieni validaattorijoukko   | Ei maksuja eikä ketjuja, mutta ei globaalia tietoaineistoa, eikä vanhan sisällön säilymistä taata ikuisesti |
