---
title: Bitsocial ja Bluesky
description: Miten Bluesky ja AT Protocol henkilökohtaisine datapalvelimineen, välityspalvelimineen ja AppView-palveluineen vertautuvat Bitsocialin vertaisverkkoyhteisöihin.
---

# Bitsocial ja Bluesky

[Bluesky](https://bsky.app/) on mikroblogisovellus, joka on rakennettu Bluesky Social PBC:n
suunnitteleman [AT Protocol](https://atproto.com/) -protokollan päälle. Protokolla jakaa sosiaalisen
verkon erillisiin palveluihin: henkilökohtaiset datapalvelimet isännöivät tilejä, välityspalvelimet
kokoavat ne yhdeksi virraksi, ja AppView't indeksoivat virran aikajanoiksi ja keskusteluketjuiksi,
joita ihmiset näkevät. Sen dokumentaatio kuvaa tilien datan tallennetuksi isäntäpalvelimille ”toisin
kuin vertaisverkkomallissa” ([yleiskatsaus](https://atproto.com/guides/overview)).

## Miten AT Protocol toimii

- **Repositoriot palvelimilla.** Jokainen julkaisu, tykkäys tai seuraaminen on tietue kirjoittajan
  allekirjoitetussa repositoriossa, jota isännöidään henkilökohtaisella datapalvelimella (PDS).
  Bluesky ylläpitää oletuspalvelimia, ja kuka tahansa voi isännöidä omaansa.
- **Välityspalvelimet.** Välityspalvelimet tilaavat jokaisen PDS:n ja lähettävät muutokset edelleen
  yhtenä virtana, firehosena. Vuoden 2025 protokollapäivityksen jälkeen ne eivät enää arkistoi
  jokaista repositoriota, mikä teki niiden ylläpidosta paljon halvempaa
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView't.** AppView indeksoi koko firehosen ja tarjoilee aikajanat, täydelliset vastausketjut,
  lukumäärät ja haun. Se on verkon resursseja vaativin osa.
- **Identiteetti.** Tili on DID: yleensä `did:plc`, joka on rekisteröity yhteen globaaliin
  hakemistoon, tai `did:web`, joka on sidottu verkkotunnukseen. DID-dokumentti kertoo tilin
  käyttäjätunnuksen (handle), allekirjoitusavaimen ja nykyisen palvelimen. PDS säilyttää
  allekirjoitusavainta; `did:plc` antaa käyttäjille myös mahdollisuuden pitää hallussaan
  vaihtoavaimia, jotta he voivat siirtyä ilman vanhan isännän apua
  ([identiteettiopas](https://atproto.com/guides/identity)).
- **Käyttäjätunnukset.** Käyttäjätunnukset ovat DNS-nimiä, kuten `alice.bsky.social` tai käyttäjän
  omistama verkkotunnus, ja ne varmennetaan DID:tä vasten.
- **Moderointi.** Isännöinti ja näkyvyys ovat erillisiä kerroksia. Kuka tahansa voi ylläpitää
  merkintäpalvelua (labeler), ja käyttäjät voivat yhdistellä niitä
  ([moderointiopas](https://atproto.com/guides/moderation)), mutta Bluesky-sovellus soveltaa aina
  Blueskyn omaa moderointia. Kirjoittajat voivat rajata, ketkä saavat vastata heidän julkaisuihinsa,
  ja piilottaa vastauksia.

## Missä ne eroavat

### Palvelimet vai vertaiset

Blueskyn data on palvelimilla: PDS isännöi jokaista tiliä, välityspalvelimet kuljettavat firehosea
ja AppView't tarjoilevat sen, mitä asiakkaat näyttävät. Selain on näiden palvelujen HTTP-asiakas, ei
koskaan vertainen. Bitsocialissa sisällön tarjoilevat yhteisön solmu ja vertaiset, jotka lukevat
sitä, ja verkkosovellus voi ajaa omaa vertaisverkkosolmuaan. Katso
[Selaimen peer-to-peer](/browser-p2p/).

### Globaali näkymä vai yhteisöt

AT Protocol on suunniteltu yhtä globaalia näkymää varten: AppView näkee jokaisen vastauksen, joten
keskusteluketjut ja haku ovat täydellisiä. Bitsocialilla ei ole globaalia indeksiä; jokainen yhteisö
julkaisee oman tilansa, ja sovellukset rakentavat sisällön löytämisen sen päälle. Katso
[Sisällön löytäminen](/content-discovery/).

Blueskylla ei tällä hetkellä ole yhteisöobjektia julkisille julkaisuille. Kesäkuussa 2026 se
[julkisti natiivit yhteisöt](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), joissa
julkaiseminen vaatii joillakin yksityisyystasoilla hyväksynnän; lokakuuhun 2026 mennessä niitä ei
ollut vielä otettu käyttöön. Bitsocialissa yhteisöt ovat keskeinen objekti, ja yhteisön solmu
hyväksyy tai hylkää julkaisut.

### Roskapostin torjunta

Bluesky torjuu roskapostia palvelimiensa nopeusrajoituksilla, välityspalvelimen rajoituksilla
uusille isännille, automaattisella tunnistuksella, ihmisten tekemällä tarkistuksella ja
merkinnöillä, ja kirjoittajat voivat rajoittaa vastauksia. Mikään yhteisötason portti ei määrää,
mitä julkaisun on läpäistävä ennen kuin se hyväksytään. Bitsocialissa jokainen yhteisö valitsee oman
haasteensa. Katso [Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Kuka pitää avaimia hallussaan

Blueskyn omilla palvelimilla olevat tilit kirjautuvat salasanalla, ja nuo palvelimet säilyttävät
tilien allekirjoitusavaimia käyttäjien puolesta
([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Erään Blueskyn protokollainsinöörin mukaan
[useimmilla tileillä ei ole itsenäisesti hallittuja vaihtoavaimia](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Bitsocial-identiteetti on avainpari, jonka käyttäjän sovellus luo ja jota se säilyttää.

### Infrastruktuurin ylläpito

Henkilökohtainen palvelin on halpa: [viite-PDS](https://github.com/bluesky-social/pds) suosittelee 1
Gt RAM-muistia enintään 20 käyttäjälle. Riippumaton koko verkon AppView on iso hanke; eräs vuonna
2025 rakennettu [maksoi noin 200 dollaria kuukaudessa](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w),
lähinnä 16 Tt:n tallennustilan vuoksi. Bitsocialilla ei ole globaalia indeksiä, jota pitäisi
replikoida, ja yhteisösolmu toimii kuluttajalaitteistolla.

## Vertailu

| Kysymys                 | Bluesky (AT Protocol)                                                                       | Bitsocial                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Kategoria               | Federoidut palvelimet ja globaali indeksi                                                   | Vertaisverkkopohjainen yhteisöverkko                                                  |
| Identiteetti            | DID; allekirjoitusavaimet yleensä palvelimen hallussa                                       | Ed25519-avainparit käyttäjille ja yhteisöille                                         |
| Missä julkaisut ovat    | Kirjoittajan repositoriossa henkilökohtaisella datapalvelimella                             | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä           |
| Kuka pitää sen verkossa | PDS-isännät, välityspalvelimet ja AppView't, oletuksena Blueskyn ylläpitäminä               | Yhteisön omistajan solmu sekä avustavat jakajat                                       |
| Yhteisöt                | Julkisille julkaisuille ei vielä yhtään (julkistettu 2026)                                  | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                   |
| Roskapostin torjunta    | Palvelinten nopeusrajoitukset, automaattinen tunnistus, merkinnät, vastausten rajaus        | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                |
| Moderointi              | Yhdisteltävät merkintäpalvelut; Bluesky-sovellus soveltaa aina Blueskyn moderointia         | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät |
| Nimet                   | DNS-käyttäjätunnukset, jotka varmennetaan DID:tä vasten                                     | `.bso`- ja `.eth`-nimet, jotka ratkeavat avaimiksi                                    |
| Selain                  | PDS:n ja AppView'n HTTP-asiakas                                                             | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                    |
| Tärkein kompromissi     | Täydelliset globaalit keskusteluketjut ja haku, mutta kokoaminen vaatii raskaita palvelimia | Ei raskasta globaalia indeksiä, mutta ei myöskään täydellistä koko verkon näkymää     |
