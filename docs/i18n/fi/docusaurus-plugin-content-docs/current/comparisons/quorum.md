---
title: Bitsocial ja Quorum
description: Miten Quorum, Quilibriumin päästä päähän salattu ryhmäviestisovellus, jossa on Discordin tyyliset Spacet, vertautuu Bitsocialin julkisiin vertaisverkkoyhteisöihin.
---

# Bitsocial ja Quorum

[Quorum](https://www.quorummessenger.com/) on ryhmäviestisovellus, jonka Quilibrium Inc. on rakentanut
omalle [Quilibrium](https://quilibrium.com/)-verkolleen. Se on järjestetty Discordin tapaan: siinä
on Spacet, kanavat, roolit ja yksityisviestit, ja sen viestit on salattu päästä päähän. Se nousee
esiin Bitsocialin rinnalla, koska kumpikin kuvaa itseään vertaisverkkopohjaiseksi ja
sensuurinkestäväksi, ja kummassakin ryhmät asettavat omat sääntönsä. Niillä on kuitenkin eri
tavoitteet: Quorum tähtää yksityisiin ryhmäkeskusteluihin, Bitsocial julkisiin yhteisöihin, joita
kuka tahansa voi lukea.

Quilibrium kuvaa itseään hajautetuksi vaihtoehdoksi pilvialustoille: se on solmujen verkko, jonka
solmut säilyttävät dataa salatussa hypergraafissa ja sopivat sen tilasta konsensuksella, jota
Quilibrium kutsuu nimellä Proof of Meaningful Work. Solmut ansaitsevat QUILia, verkon tokenia, jolla
maksetaan käyttömaksut. Quorum sai alkunsa vuonna 2018 Howlerina, ideana yksityisestä
Discord-vaihtoehdosta, ja siitä tuli ensimmäinen Quilibriumissa käyttöön otettu sovellus, kertoo
[Quilibriumin tarina](https://docs.quilibrium.com/docs/discover/q-story/). Cassie Heartin perustama
Quilibrium Inc. kehittää protokollaa ja tarjoaa Quorumia yhtenä hallinnoiduista palveluistaan
([UKK](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Miten Quorum toimii

Alla olevat tiedot ovat peräisin Quorumin asiakasohjelmien lähdekoodista lokakuun 2026 tilanteen
mukaan: verkko- ja työpöytäsovellusten
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop)-repositoriosta sekä
[quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile)-repositoriosta.

- **Identiteetit.** Käyttäjän pääidentiteetti on Ed448-avainjoukko, ja jokainen laite saa omat X448-
  ja Ed448-avaimensa. Selaimessa avaimia suojaa pääsyavain (passkey). Osoitteet ovat tiivisteitä,
  jotka alkavat merkkijonolla `Qm`, ja käyttäjät voivat näyttää käyttäjänimen Quilibriumin
  nimipalvelusta.
- **Salaus.** Yksityisviestit käyttävät laitteiden välillä Double Ratchet -protokollaa. Space jakaa
  jäsentensä kesken yhden Triple Ratchet -istunnon, ja jäsenet allekirjoittavat viestinsä
  Space-kohtaisilla avaimilla. Jokainen Space on salattu, ja Quorumin mukaan sen viestinvälitys
  (message brokering) estää viestejä välittävää palvelua yhdistämästä lähettäjiä ja vastaanottajia
  toisiinsa.
- **Liittyminen.** Spaceihin liitytään kutsulinkeillä. Kertakäyttöinen linkki sisältää liittymiseen
  tarvittavat avaimet URL-osoitteessa; julkinen linkki hakee ne Quorum-palvelusta, ja julkiset Spacet
  voidaan listata haettavaan hakemistoon.
- **Tiedonsiirto.** Verkko-, työpöytä- ja mobiiliasiakkaat muodostavat kaikki HTTPS- ja
  WebSocket-yhteyden yhteen palveluun,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Se välittää salatut viestit kunkin jäsenen postilaatikkoon ja tallentaa käyttäjien rekisteröinnit,
  kunkin Spacen salatun manifestin (kanavat, roolit, emojit), kutsuihin liittyvän aineiston, julkisen
  hakemiston sekä valinnaisen salatun asetusten synkronoinnin. Quilibriumin solmuohjelmistossa on
  samanmuotoinen postilaatikko- ja hub-palvelu, mutta asiakasohjelmat eivätkä Quilibriumin
  dokumentaatio kerro, miten tämä palvelu kytkeytyy verkkoon.
- **Historia.** Jokaisen jäsenen asiakasohjelma säilyttää omaa kopiotaan Spacesta paikallisessa
  tallennustilassa. Verkko- ja työpöytäasiakas täydentää historiaa pyytämällä verkossa olevaa jäsentä
  synkronoimaan; mobiiliasiakas toistaa lokia, jota palvelu ylläpitää jokaisesta Spacesta, joten se
  pystyy kuromaan eron kiinni silloinkin, kun yksikään muu jäsen ei ole verkossa.
- **Moderointi.** Roolit antavat oikeuden poistaa, kiinnittää, mykistää ja käyttää
  `@everyone`-mainintoja. Jokaisen jäsenen asiakasohjelma tarkistaa jokaisen moderointitoimen
  allekirjoituksen ja soveltaa toimea vain, jos allekirjoittajalla on oikea rooli. Omistaja voi
  potkaista jäsenen, jolloin Spacen avaimet vaihdetaan niin, ettei potkaistu jäsen pysty lukemaan
  uusia viestejä. Space voi vaatia allekirjoitetut viestit tai antaa jäsenten julkaista
  allekirjoittamattomia, kiistettävissä olevia viestejä.
- **Koodi.** Verkko- ja työpöytäasiakkaan lisenssi on AGPL-3.0 ja mobiiliasiakkaan GPL-3.0.
  Mobiiliasiakkaassa on lisäksi kryptolompakko, Farcaster-integraatio ja Apex, maksullinen tilaus,
  jota kuvataan jäljempänä.

## Missä ne eroavat

### Yksityiset ryhmät ja julkiset yhteisöt

Quorumin Space on jäsenten ryhmä: vain sen avaimia hallussaan pitävät voivat lukea sitä, ja
liittyminen vaatii kutsulinkin. Julkisella linkillä kuka tahansa pääsee sisään, mutta vain
liittymällä. Bitsocial-yhteisöllä ei ole jäsenyyttä. Kuka tahansa voi lukea sitä millä tahansa
sovelluksella liittymättä, ja kuka tahansa voi yrittää julkaista siihen yhteisön haasteen ehdoilla.

### Mikä pitää ryhmän verkossa

Quorumin Spacella ei ole isäntäsolmua. Jäsenet lähettävät viestit Quorum-palvelun kautta, jokaisen
jäsenen asiakasohjelma säilyttää kopion, eikä omistajan tarvitse olla verkossa, jotta muut voivat
keskustella. Bitsocial-yhteisö elää omistajansa solmulla, joka hyväksyy tai hylkää jokaisen
julkaisun ja julkaisee yhteisön uusimman tilan. Yhteisö pysyy luettavana niin kauan kuin vertaiset
jakavat sitä, mutta se ei voi ottaa vastaan uusia julkaisuja, kun sen solmu on poissa verkosta.
Katso [Vertaisverkkoprotokolla](/peer-to-peer-protocol/).

### Kuka valvoo sääntöjä

Quorumissa säännöt pannaan täytäntöön reunalla. Jokaisen jäsenen asiakasohjelma päättää
allekirjoittajan roolin perusteella, soveltaako se poistoa, kiinnitystä tai mykistystä, ja
potkaiseminen toimii siirtämällä kaikki muut uusiin avaimiin. Bitsocialissa säännöt pannaan
täytäntöön yhteisön solmulla: julkaisusta, joka ei läpäise yhteisön haastetta tai sääntöjä, ei
koskaan tule osaa yhteisöä. Katso
[Paikallinen moderointi, ei globaaleja estoja](/local-moderation/).

### Roskapostin torjunta

Quorum pitää roskapostin poissa pääasiassa kutsujen avulla. Kertakäyttöinen linkki päästää sisään
yhden henkilön, julkinen linkki kenet tahansa, jolla linkki on, ja omistaja voi jälkikäteen
potkaista jäseniä ja vaihtaa avaimet; asiakasohjelma myös rajoittaa omaa lähetystahtiaan.
Bitsocial-identiteetit ovat ilmaisia avainpareja, joten jokainen yhteisö valitsee haasteen, joka
ajetaan ennen julkaisun hyväksymistä, esimerkiksi captchan, maksun, tokenisaldon tai sallittujen
listan. Katso [Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Asiakasohjelma ja verkko

Quorum-sovellus on Quorum-palvelun asiakas, ja palvelua ylläpitää Quilibrium Inc. Sovellukset eivät
itse liity vertaisverkkoon, joten Spaceen pääsy riippuu tästä yhdestä päätepisteestä. Sen takana
Quilibrium on oma verkkonsa: lokakuussa 2026 sen
[explorer-näkymä](https://dashboard.quilibrium.com/) näytti 114 tavoitettavaa vertaista ja 181
todistajaa (prover) 99 shardissa.

Bitsocial-verkkosovellus voi ajaa libp2p-solmua selainvälilehdessä, hakea yhteisöjen sisältöä
vertaisilta ja julkaista gossipsubin kautta. Vertaisten löytäminen kulkee HTTP-reitittimien kautta,
jotka palauttavat vain tarjoajien osoitteet; kuka tahansa voi ajaa sellaista, ja asiakkaat voivat
vaihtaa reititintä muuttamalla asetuksiaan. Katso [Selaimen peer-to-peer](/browser-p2p/).

### Talous

Quilibriumin ytimessä on token. Solmut louhivat QUILia, jolla maksetaan verkkomaksut, ja sen
kääritty versio, wQUIL, kiertää Ethereumissa. Quorum itsessään on ilmainen, eikä se vaadi maksua tai
puhelinnumeroa. Sen valinnainen Apex-tilaus maksaa
[5 dollaria kuukaudessa](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
ja se maksetaan wQUILina, SNAPina tai USDC:nä Ethereumissa ja jaetaan Quilibrium Inc:n ja neljän
tilaajan valitseman Spacen kesken. Bitsocialin protokollassa ei ole maksukerrosta; yhteisö voi
vaatia maksua tai tokenia haasteensa kautta.

### Yksityisviestit

Tässä Quorum on vahvempi. Yksityisviestit ja Spacejen viestit on salattu päästä päähän, ja salaus
tarjoaa eteenpäin salaisuuden (forward secrecy); viestien sisältö päätyy Quorum-palveluun vain
salatekstinä. Bitsocial keskittyy julkisiin yhteisöihin, eikä siinä ole vielä natiiveja
yksityisviestejä. Bitsocial-julkaisu salataan yhteisön solmun avaimelle sen kulkiessa pubsubin
kautta, mutta kun julkaisu on hyväksytty, se on julkinen.

## Projektin tila

Lokakuussa 2026 Quorumin repositorio kutsui verkkosovellusta betaversioksi, ja Quorumin
verkkosivusto ilmoitti Google Playn ja App Storen sovellusten olevan yhä tulossa pian. Myös kaksi
asiakasohjelmaa eroavat toisistaan: mobiilisovelluksessa on lompakko-, Farcaster- ja
Apex-ominaisuudet, kun taas verkko- ja työpöytäasiakas näyttää Wallet- ja Farcaster-sivunsa tulossa
pian -tilassa, ja asiakkaat kurovat Spacen historian kiinni eri tavoin.

Quilibriumin pääverkko (mainnet) saavutti version 2.1 30. syyskuuta 2025, kun verkko jatkoi
toimintaansa pysähdyksen jälkeen
([tiedote](https://x.com/QuilibriumInc/status/1973082817236984270)). Vuonna 2026 solmu kirjoitettiin
uudelleen Rustilla, ja siihen tuli kvanttiturvalliset allekirjoitukset konsensukseen sekä
siirtoprotokolla, jota vanhemmat solmut eivät osaa puhua. Osa dokumentaatiosta kuvaa suunnitelmaa
eikä käynnissä olevaa koodia: dokumentaatio kuvaa
[mixnet-reitityksen](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), mutta
solmun versiossa 2.1.0.25 mixnet-palvelu on
[tynkä](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
joka hyväksyy viestit sekoittamatta niitä.

## Vertailu

| Kysymys                    | Quorum                                                                                        | Bitsocial                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Kategoria                  | Päästä päähän salattu ryhmäviestisovellus Quilibrium-verkossa                                 | Vertaisverkkopohjainen yhteisöverkko                                                               |
| Identiteetti               | Ed448-pääavainjoukko sekä laitekohtaiset avaimet, joita suojaa pääsyavain                     | Ed25519-avainparit käyttäjille ja yhteisöille                                                      |
| Kuka voi lukea             | Jäsenet, joilla on Spacen avaimet                                                             | Kuka tahansa, millä tahansa sovelluksella                                                          |
| Missä viestit sijaitsevat  | Jokaisen jäsenen laitteella; mobiiliasiakas toistaa lisäksi Quorum-palvelun ylläpitämää lokia | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                        |
| Mihin asiakkaat yhdistävät | Quorum-palveluun osoitteessa `api.quorummessenger.com`                                        | Vertaisiin libp2p:n kautta, myös selainvälilehdestä                                                |
| Yhteisöt                   | Spacet, joissa on kanavia, rooleja ja kutsulinkkejä                                           | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                |
| Roskapostin torjunta       | Kutsulinkit, potkut avainten vaihdolla, asiakaspuolen lähetysrajoitukset                      | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                             |
| Moderointi                 | Jokaisen jäsenen asiakasohjelman valvomat roolit; omistaja potkii jäseniä                     | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät              |
| Yksityisviestit            | Päästä päähän salatut yksityisviestit                                                         | Julkiset yhteisöt; ei vielä natiiveja yksityisviestejä                                             |
| Talous                     | QUIL-verkkotoken; valinnainen 5 dollarin kuukausittainen Apex-tilaus                          | Ei protokollassa; haaste voi vaatia maksua tai tokenia                                             |
| Tärkein kompromissi        | Yksityiset, salatut ryhmät, mutta jokainen asiakas on riippuvainen yhdestä palvelusta         | Ilmaiset identiteetit ja selainkäyttö, mutta ei yksityisviestintää, ja vain uusin tila säilytetään |
