---
title: Bitsocial Chain
description: Yleissuunnitelman vaihe 3, joka käsittelee Bitsocial-sovelluksille ehdotettua Ethereum L2 -appchainiin perustuvaa talouskerrosta.
---

# Bitsocial Chain

Bitsocial Chain on Bitsocial-sovelluksille ehdotettu, Ethereum L2 -appchainiin perustuva
talouskerros. Ketjun oma sivusto on tällä hetkellä [chain.bitsocial.net](https://chain.bitsocial.net).

Vertaisverkkoon perustuva sosiaalinen kerros antaa yhteisöjen, identiteettien ja sisällön siirtyä
keskitetyn alustatietokannan ulkopuolelle. Bitsocial Chainin on määrä tuoda mukaan ne yhteiset
nimeämisen, ansainnan ja maksamisen perusrakenteet, joiden ansiosta näiden sovellusten rahavirtoja
on vaikeampi kuivattaa.

## Mitä sen on tarkoitus mahdollistaa

- hajautetut Bitsocial-verkkotunnukset, kuten `.bso`
- palkinnot ja tippaus
- kestävät ansaintakanavat
- sovellusten yhteinen likviditeetti
- rahoitusrakenteet, joita pankkien tai alustojen on vaikeampi kuristaa
- verkostovaikutukset, jotka eivät nojaa siihen, että yksi yritys omistaa koko pinon

Tarkoitus ei ole nostaa tokenin mekaniikkaa etusijalle. Tarkoitus on tehdä hyödyllisistä
sosiaalisista sovelluksista kestävämpiä ja helpommin rahoitettavia sekä vähentää niiden riippuvuutta
keskitetyistä maksu- ja nimipalveluista.

## Nykyinen konseptitodistus

Bitsocial Chainin ensimmäinen konseptitodistus keskittyy natiiveihin `.bso`-nimiin. Se osoittaa,
että nimirekisteri voidaan johtaa Ethereumin L1-historiasta ilman, että sosiaalista sisältöä
viedään ketjuun:

- käyttäjät lähettävät rekisteröinti-, päivitys-, siirto- ja peruutusaikomuksensa tavallisina
  Ethereum L1 -transaktioina
- kuka tahansa voi ajaa johtamissolmua ja koota saman `.bso`-rekisterin tilan uudelleen
- nimenselvitin yhdistää `.bso`-nimen siihen Bitsocialin julkiseen avaimeen, jota asiakassovellukset
  jo käyttävät vertaisverkkoprotokollassa
- julkaisut, äänet, moderointi, syötteet ja yhteisösisältö pysyvät ketjun ulkopuolella ja
  vertaisverkossa

Tämä konseptitodistus ei ole tuotantovalmis Stage 2 -julkaisu. Siinä ei vielä ole
todistusjärjestelmää, haastepeliä, auditoitua koodia, tuotantokäyttöönottoa, lopullista hinnoittelua
eikä lopullista hallintomallia. Pitkän aikavälin linja on oletusarvoisesti läpinäkyvä ja
lähtökohtaisesti yksityisyyden kanssa yhteensopiva: ydinketju on julkinen, mutta tulevan tippauksen,
maksujen, palkintojen ja likviditeetin ei pidä pakottaa pysyvää kytköstä sosiaalisen identiteetin ja
lompakkohistorian välille.

## Miksi tällä on merkitystä

Yhteisöjen ja identiteettien hajauttaminen on välttämätöntä, mutta se ei yksin riitä koko
sosiaalisen median hajauttamiseen.

Jos sosiaaliset sovellukset nojaavat edelleen muutamaan keskitettyyn talousinfraan, niitä on yhä
helppo painostaa, sulkea palveluiden ulkopuolelle tai kuivattaa rahoituksellisesti. Bitsocial Chain
on ehdotettu vastaus tähän toiseen riippuvuuskerrokseen.

## Suhde sovelluksiin

Bitsocial Chainin pitäisi asettua Bitsocial-sovellusten alle, ei korvata niitä.

Käyttäjille näkyvän lopputuloksen pitäisi olla tämä:

- yhteisöt pysyvät vertaisverkossa
- sovellukset pysyvät toisistaan erottuvina
- käyttäjät saavat käytännöllisiä nimeämis- ja ansaintaominaisuuksia
- sisällöntekijät ja yhteisöt voivat ottaa vastaan tukea eri asiakassovellusten kautta
- arvo voi liikkua ekosysteemissä ilman, että keskitetty alustan omistaja syntyy uudelleen

## Miksi tämä tulee Twitter/X-vaihtoehdon jälkeen

Nykyinen yleissuunnitelma sijoittaa Bitsocial Chainin Twitter/X-vaihtoehdon jälkeen, koska se sovellus ei tarvitse ketjua. Profiilit toimivat profiilisolmuina ei-säilyttävän RPC:n kautta, ja `.bso`-nimet voivat aloittaa väliaikaisessa rekisterissä Ethereumin pääverkossa ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) ja siirtyä ketjuun myöhemmin.

Bitsocial Chainin ei pitäisi vaihtaa hajautusta aikaisempaan julkaisuun. Sen ei pitäisi lisätä luottamusoletuksia Ethereumin itsensä lisäksi: ei päivitysavaimia, ei turvallisuusneuvostoa eikä operaattoria, joka voisi sensuroida tai pysäyttää sen. Johtava rakenne tähän, natiivi rollup, riippuu Ethereumin päivityksestä, jota ei ole vielä aikataulutettu. Kunnes ketju pystyy täyttämään tämän vaatimuksen, Twitter/X-vaihtoehto kasvattaa käyttäjäkuntaa, jota ketju tulee palvelemaan.

## Suunnitteluperiaatteet

Koska Bitsocial Chain on yhä ehdotettua infrastruktuuria eikä julkaistu tuote, suunnitelman pitää
pysyä kurinalaisena:

- Sovellukset ja yhteisöt ensin. Verkkokerroksen pitää vahvistaa todellisia sosiaalisia tuotteita.
- Käytännön ominaisuudet ensin. Nimet, palkinnot, tippaus ja maksut on helpompi selittää kuin
  abstrakti rahoitusarkkitehtuuri.
- Todellinen panos hypen sijaan. Talouden perusrakenteiden pitää palkita osallistumisesta,
  rakentamisesta ja yhteisön tukemisesta.
- Kuratointi on sallittua. Sovellukset saavat muokata järjestyksiä, oletuksia ja löydettävyyttä
  kestäviä yhteisöjä suosivaan suuntaan.
- Tarkka mekaniikka on yhä auki. Tämä sivu kuvaa Bitsocial Chainin roolin, ei lukittua lupausta
  lopullisesta taloudesta.
