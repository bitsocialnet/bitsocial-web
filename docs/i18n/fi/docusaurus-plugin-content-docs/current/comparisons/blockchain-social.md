---
title: Bitsocial ja lohkoketjupohjaiset sosiaaliset verkostot
description: Miten Lens, DeSo ja Steem vievät sosiaalista dataa tai sääntöjä lohkoketjuun ja miksi Bitsocial ei käytä lohkoketjua.
---

# Bitsocial ja lohkoketjupohjaiset sosiaaliset verkostot

Lens, DeSo ja Steem vievät kukin sosiaalisen toiminnan lohkoketjuun. Tileistä, seuraamisista,
julkaisuista tai niitä koskevista säännöistä tulee transaktioita, jotka validaattorit järjestävät ja
tallentavat. Bitsocial ei käytä lohkoketjua: sosiaalinen media ei tarvitse jokaiselle julkaisulle
globaalia järjestystä, joten Bitsocial jättää pois konsensuksen, gasin ja stakingin. Perustelut ovat
sivulla [Vertaisverkkoprotokolla](/peer-to-peer-protocol/).

## Mitä niillä on yhteistä

- **Joku maksaa jokaisesta kirjoituksesta.** Lens perii gasia, jonka sovellukset voivat sponsoroida;
  DeSo perii maksun jokaisesta toiminnosta; Steem säännöstelee toimintoja panostettujen tokenien
  perusteella.
- **Ketju asettaa yhden roskapostikäytännön kaikille.** Maksut, panos ja tilien kustannukset
  koskevat koko verkkoa sen sijaan, että kukin yhteisö valitsisi ne itse.
- **Ketjuun tallennetut tiedot ovat pysyviä.** Sovellukset voivat piilottaa sisältöä, mutta ne eivät
  voi poistaa sitä ketjusta.
- **Selaimet ovat API-asiakkaita.** Verkkosovellukset allekirjoittavat transaktioita ja lukevat
  dataa jonkun muun ylläpitämän solmun, indeksoijan tai API:n kautta.

## Lens

[Lens](https://lens.xyz/) toimii Lens Chainissa, ZKsyncin ZK Stackilla rakennetussa Ethereumin layer
2 -verkossa, joka käyttää Availia datan saatavuuteen. Mask Network on
[vastannut Lensistä tammikuusta 2026 lähtien](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Ketjussa:** tilit ovat älysopimuksia, käyttäjänimet ovat NFT:itä nimiavaruuksien sisällä, ja
  graafit, ryhmät, syötteet ja niiden säännöt ovat nekin sopimuksia.
- **Ketjun ulkopuolella:** julkaisun teksti ja media ovat JSON-tiedostossa URI:n takana, yleensä
  Grovessa, joka on Lensin IPFS:n edessä toimiva tallennuspalvelu. Reaktiot ja kirjanmerkit
  säilyttää Lens API, ja sovellukset lukevat dataa sen kautta.
- **Roskaposti ja portit:** transaktiot tarvitsevat gasia GHO:na, jonka sovellukset voivat
  sponsoroida nopeusrajoitusten kera. Syötteiden ja ryhmien säännöt voivat vaatia tokenien omistusta
  tai maksuja.
- **Ketjun ylläpito:** [L2BEAT](https://l2beat.com/scaling/projects/lens) luokittelee Lens Chainin
  Stage 0 -validiumiksi, jolla on keskitetty operaattori, joka voi kieltäytyä sisällyttämästä
  transaktioita.

## DeSo

[DeSo](https://docs.deso.org/) on sosiaalisia sovelluksia varten rakennettu layer 1 -lohkoketju. Se
siirtyi proof-of-workista proof-of-stakeen heinäkuussa 2024.

- **Ketjussa:** profiilit, julkaisut, tykkäykset, seuraamiset ja yksityisviestit ovat kaikki
  transaktioita, jotka jokainen täysi solmu tallentaa. Kuvia ja videoita isännöidään ketjun
  ulkopuolella; viitesolmu käyttää Google Cloud Storagea ja Cloudflare Streamia.
- **Roskaposti:** jokaisesta toiminnosta maksetaan maksu DESO-tokeneina. Uudet käyttäjät saavat
  yleensä solmulta aloitus-DESOa puhelinnumeron vahvistamisen jälkeen.
- **Moderointi:** kukin solmu päättää esto- tai harmailla listoilla, mitä se näyttää, mutta
  [sisältö pysyy ketjussa](https://docs.deso.org/deso-blockchain/content-moderation).
- **Yhteisöt:** dokumentaatio ei kuvaa yhteisö- tai foorumiprimitiiviä; ”yhteisö” on syöte, jota
  jokin sovellus kuratoi.
- **Solmun ylläpito:** validaattorit tarvitsevat
  [validaattorioppaan](https://docs.deso.org/deso-validators/run-a-validator) mukaan vähintään 32 Gt
  RAM-muistia ja 200 Gt levytilaa.

## Steem

[Steem](https://steem.com/) on sosiaalinen lohkoketju, joka maksaa kirjoittajille ja kuraattoreille
tokeneina, ja sen tärkein blogisovellus on [Steemit](https://steemit.com/). Hive erkani Steemistä
vuonna 2020; [Hiven whitepaperin](https://hive.io/whitepaper.pdf) mukaan haarautuminen seurasi
Steemit Inc:n myyntiä Justin Sunille.

- **Ketjussa:** tekstijulkaisut, kommentit, äänet ja niiden muokkaushistoria, joita järjestää 21
  valittua witnessiä, jotka tuottavat lohkon kolmen sekunnin välein. Kuvia isännöidään ketjun
  ulkopuolella.
- **Roskaposti:** toiminnot kuluttavat Resource Credits -resursseja, jotka kasvavat panostetun
  STEEMin myötä. Tilin luominen maksaa STEEMiä; Steemit maksaa sen niiden käyttäjien puolesta, jotka
  vahvistavat sähköpostiosoitteen ja puhelinnumeron.
- **Yhteisöt:** ne ovat
  [indeksoijan tulkitsemia mukautettuja operaatioita](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  konsensuksen ulkopuolella. Moderaattorit voivat mykistää julkaisuja, mikä piilottaa ne
  sovelluksissa mutta jättää ne ketjuun.
- **Palkkiot:** inflaatio rahoittaa palkkiot, ja panoksella painotetut äänet ratkaisevat, miten ne
  jaetaan, joten suuret haltijat muokkaavat sitä, mikä saa huomiota.

## Vertailu

| Kysymys              | Lens                                                                                | DeSo                                                                   | Steem                                                                           | Bitsocial                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Ketju                | Ethereumin layer 2 (ZK Stack -validium)                                             | Oma layer 1, proof-of-stake                                            | Oma ketju, delegoitu proof-of-stake                                             | Ei mitään                                                                                                 |
| Julkaisujen sisältö  | JSON ketjun ulkopuolella, yleensä Grovessa                                          | Teksti ketjussa; media ketjun ulkopuolella                             | Teksti ketjussa; kuvat ketjun ulkopuolella                                      | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                               |
| Identiteetti         | Älysopimustili; käyttäjänimet NFT:inä                                               | Avainpari ja ketjuun tallennettu profiili                              | Nimetty ketjutili porrastetuilla avaimilla                                      | Ed25519-avainparit käyttäjille ja yhteisöille                                                             |
| Yhteisöt             | Ryhmät ja syötteet sääntöjä sisältävinä sopimuksina                                 | Ei yhteisöprimitiiviä                                                  | Indeksoijan tulkitsemat yhteisöt konsensuksen ulkopuolella                      | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                                       |
| Roskapostin torjunta | Gas (usein sponsoroitu), token- tai maksusäännöt                                    | Maksu jokaisesta toiminnosta; aloitusvarat puhelinvahvistuksen jälkeen | Panokseen perustuvat Resource Credits; maksullinen tilin luonti                 | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                    |
| Moderointi           | Ryhmien ylläpitäjät, ketjuun tallennetut säännöt, piilotus API-tasolla              | Kukin solmu suodattaa, mitä se näyttää                                 | Yhteisöjen mykistykset, panoksella painotetut alaäänet, sovellusten suodattimet | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät                     |
| Ylläpito             | Ketjun operaattori sekä Lens API ja Grove                                           | Validaattorit, joilla on vähintään 32 Gt RAM-muistia                   | Valitut witnessit sekä API- ja indeksoijasolmut                                 | Yhteisösolmu kuluttajalaitteistolla sekä avustavat jakajat                                                |
| Tärkein kompromissi  | Ohjelmoitavat ketjusäännöt, mutta sisältö ja lukeminen riippuvat Lensin palveluista | Avoin datavaranto, mutta jokainen toiminto maksaa ja säilyy ikuisesti  | Sisäänrakennetut palkkiot, mutta panos muokkaa näkyvyyttä ja hallintoa          | Ei maksuja eikä panoksia, mutta ei globaalia järjestystä, eikä vanhan sisällön säilymistä taata ikuisesti |
