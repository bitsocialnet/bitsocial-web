---
title: Twitter/X:n hajauttaminen
description: "Yleissuunnitelman vaihe 3: tarkasti rajattu, hajautettu vaihtoehto Twitter/X:lle tekstipainotteiseen julkiseen keskusteluun, vaihdettavalla infrastruktuurilla."
---

# Twitter/X:n hajauttaminen

Vaiheessa 3 on tarkoitus rakentaa tarkasti rajattu, hajautettu vaihtoehto Twitter/X:lle. Sen ytimessä on tekstipainotteinen julkinen keskustelu: lyhyet julkaisut, vastaukset, uudelleenjulkaisut, seuraamiset, reaaliaikainen keskustelu ja yhteisöt, ja samalla alustakerros avataan.

Twitter/X määrittyy edelleen julkaisujen, tekstin ja ajatusten jakamisen kautta. Vaiheen 3 asiakasohjelman pitäisi kilpailla tällä ydinkokemuksella ja tehdä siitä poikkeuksellisen toimiva.

Tämä sivu kuvaa tuotteen suuntaa, ei lukittua julkaisuvaatimusta. Tarkka käyttöliittymä, oletussyöte, mainosmalli, AI-ominaisuudet ja RPC-markkinapaikka voivat muuttua protokollan ja ensimmäisten sovellusten kypsyessä.

## Mitä sen pitäisi osoittaa

Asiakasohjelman pitäisi osoittaa, että profiileihin perustuva sosiaalinen verkosto voi välttää muuttumisen käyttäjien identiteettejä hallinnoivaksi säilytysalustaksi:

- käyttäjät voivat omistaa identiteettinsä ja profiilinsa
- yhteisöt ja profiilisolmut voivat pysyä peer-to-peer-muodossa
- yhteisöt voivat välittää verkostovaikutuksia Bitsocial-asiakasohjelmien välillä
- RPC-palveluntarjoajat voivat tehdä asiakasohjelmasta helppokäyttöisen ottamatta tietoja säilytykseensä
- syötealgoritmit voivat olla valinnaisia palveluita alustan sanelemien sääntöjen sijaan
- muut asiakasohjelmat voivat edelleen kilpailla samasta verkostosta

Tarkoitus on rakentaa mahdollisimman vahva asiakasohjelma julkiseen keskusteluun ja osoittaa, kuinka pitkälle protokolla voi ulottua.

## Tarkoitukseltaan tuttu, rakenteeltaan vaihdettava

Oletuskokemuksen pitäisi kilpailla Twitter/X:n ytimen kanssa: nopea etusivun syöte, tekstijulkaisut, seuraamiset, vastaukset, uudelleenjulkaisujen kaltainen jakelu, yhteisöt, ilmoitukset, haku ja heti toimiva, järjestetty For You -näkymä.

Bitsocial Forge voi ylläpitää ensimmäistä oletusarvoista RPC- ja syötepalvelua. Oletukseen voi kuulua järjestetty syöte ja mainoksia, jotta asiakasohjelma tuntuu valmiilta ensimmäisestä päivästä lähtien eikä tavallisia käyttäjiä pyydetä kokoamaan koko pinoa itse.

Erona on, ettei oletuksesta saa tulla vankilaa. Käyttäjän pitäisi voida vaihtaa RPC:tä, syötettä, instanssia, järjestysjärjestelmää, mainoksia ja löytämispalvelun tarjoajaa tai poistaa järjestäminen kokonaan. Asiakasohjelma voi tehdä ensikäynnistyksessä selkeitä oletusvalintoja ja pitää silti kaikki keskeiset palvelut vaihdettavina.

Tämä tekee asiakasohjelmasta perinteistä alustaa muokattavamman. Yksi käyttäjä voi pitää oletusarvoisen järjestetyn syötteen mainoksineen. Toinen voi käyttää kronologista syötettä ilman järjestämistä. Kolmas voi valita yksityisyyteen keskittyvän RPC:n, yhteisön ylläpitämän löytämispalvelun, maksullisen mainoksettoman syötteen tai tietylle alakulttuurille rakennetun erikoisalgoritmin.

## Asiakasohjelmien väliset yhteisöt

Yhteisöjen pitäisi olla paljon tärkeämpiä kuin yhden sovelluksen sisäiset erilliset ryhmät.

X/Twitterissä yhteisöt on rajattu X:n sisään. Ne voivat olla hyödyllisiä, mutta niihin periytyvät yhden alustan, yhden tilijärjestelmän, yhden suosituspinon ja yhden tuotenäkymän rajoitukset.

Bitsocial-yhteisö voidaan luoda, ylläpitää, löytää ja ottaa käyttöön eri asiakasohjelmissa. Siksi vaiheen 3 asiakasohjelma voi näyttää yhteisöjä ja julkaisuja laajemmasta Bitsocial-verkostosta eikä vain käyttäjiltä, jotka aloittivat sen sisällä. Samassa yhteisössä voisi olla samanaikaisesti toimintaa imageboard-asiakasohjelmasta, Reddit-tyylisestä keskusteluohjelmasta, erikoistuneesta foorumiohjelmasta, mobiilisovelluksesta ja vaiheen 3 asiakasohjelmasta.

Tämä on verkostovaikutuksen keskeinen etu: yksi asiakasohjelma voi tuntua tavallisille käyttäjille tutulta ja saada samalla arvoa monista asiakasohjelmista, yhteisösolmuista, RPC-palveluntarjoajista ja riippumattomista palveluista.

## Valinnaiset syötealgoritmit

Vaiheen 3 asiakasohjelman ei pitäisi pakottaa yhtä maailmanlaajuista järjestysjärjestelmää kaikille.

Syötealgoritmien pitäisi olla valinnaisia. Käyttäjä voisi valita algoritmin markkinapaikalta, vaihtaa palveluntarjoajaa, käyttää yrityksen, nimettömän ylläpitäjän tai yhteisön algoritmia, ajaa omaa algoritmiaan tai olla käyttämättä algoritmia lainkaan.

Julkiset RPC-palveluntarjoajat ovat luonteva paikka näiden palveluiden kilpailulle. Ne voivat indeksoida, järjestää ja suositella sisältöä, mutta niiden ei pitäisi omistaa käyttäjää tai profiilia.

Palvelut voivat kilpailla myös itse asiakasohjelman muodosta. Yksi RPC voi tarjota järjestetyn syötteen mainoksineen. Toinen voi tarjota järjestämättömän kronologisen syötteen. Kolmas voi erikoistua yksityisyyteen, käännöksiin, moderointiin, yhteisöjen löytämiseen tai rajatun alan sosiaaliseen graafiin.

Jos taloudellinen malli toimii, RPC-pohjaiset syötepalvelut voisivat lisätä AI-ominaisuuksia, jotka muistuttavat valtavirran alustojen syötteisiinsä tuomia toimintoja: automaattisia käännöksiä, yhteenvetoja, bottiavusteisia vastauksia, hakuvastauksia, moderointiapua tai yhteisömuistiinpanojen kaltaista kontekstia.

Näiden ominaisuuksien pitäisi olla palveluvalintoja, ei protokollavaatimuksia. Oletusarvoinen RPC voi kilpailla tarjoamalla monipuolisemman syötteen, mutta käyttäjien ja kilpailevien asiakasohjelmien pitäisi voida valita myös yksinkertaisempia, yksityisiä, kronologisia, mainoksettomia tai yhteisökohtaisia vaihtoehtoja.

## RPC ilman säilytysoikeutta

Jokaisen käyttäjän pitäisi voida osallistua täydellisenä peer-to-peer-solmuna RPC:n kautta luovuttamatta RPC-palveluntarjoajalle identiteettinsä tai profiilinsa omistajuutta.

Palveluntarjoajan ylläpitämä reitti on tärkeä, koska useimmat käyttäjät eivät aloita oman palvelimen ajamisesta. Poistumisreitti on yhtä tärkeä: käyttäjän pitäisi voida siirtyä omaan profiilisolmuunsa vaatimattomalla laitteistolla, myös Raspberry Pi:llä, milloin tahansa.

Tämä on helppokäyttöisyyden ja säilytysvallan ero.

## Bitsocial Chainin vahvistama julkinen keskustelu

Bitsocial Chain voi tuoda pysyvät nimet, maksut, tipit, palkinnot ja muita taloudellisia väyliä suoraan julkiseen keskusteluun.

Vaiheen 3 asiakasohjelma pysyy keskittyneenä julkaisuihin, tekstiin, ajatusten jakamiseen ja reaaliaikaiseen keskusteluun sekä jakaa yhteisöjä ja verkostovaikutuksia muiden Bitsocial-asiakasohjelmien kanssa.
