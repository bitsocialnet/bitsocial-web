---
title: Lippulaiva Bitsocial-sovellus
description: "Ehdotettu profiilipohjainen Bitsocial-asiakas: tuttu, kuten X/Twitter oletuksena, mutta jossa on vaihdettavat RPC:t, syötteet, algoritmit, mainokset ja yhteisöt."
---

# Lippulaiva Bitsocial-sovellus

Lippulaiva Bitsocial-sovellus on verkon ensimmäinen profiilipohjainen asiakas. Yksinkertaisin vertailu on: tuttu kuten X/Twitter oletuksena, mutta alustakerros on rikki.

Se lisäisi profiileja, seuraajia, vastauksia, syötteitä, yhteisöjä, ilmoituksia ja reaaliaikaista julkista keskustelua samalla, kun taustalla olevat palvelut säilyvät korvattavissa. 5chan todistaa, että nimettömät yhteisöt voivat toimia. Seedit siirtyy kohti jatkuvaa keskustelua. Lippulaivasovellus toisi nämä verkkovaikutukset yleiseen sosiaaliseen syötteeseen tekemättä yhdestä yrityksestä kaavion omistajaa.

Tällä sivulla kuvataan tuotteen suunta, ei lukitun julkaisun tiedot. Tarkka käyttöliittymä, oletussyöte, mainosmalli, tekoälyominaisuudet ja RPC-markkinapaikka voivat muuttua protokollan ja varhaisten sovellusten kypsyessä.

## Mitä sen pitäisi todistaa

Sovelluksen tulee todistaa, että profiilipohjainen sosiaalinen verkosto voi välttää muuttumasta vankeusalustaksi:

- käyttäjät voivat omistaa identiteettejä ja profiileja
- yhteisöt ja profiilisolmut voivat pysyä peer-to-peer
- yhteisöt voivat kuljettaa verkkovaikutuksia Bitsocial-asiakkaiden välillä
- RPC-palveluntarjoajat voivat tehdä sovelluksesta kätevän ilman huoltajuutta
- syötealgoritmit voivat olla valinnaisia ​​palveluita alustalain sijaan
- muut asiakkaat voivat silti kilpailla samasta verkosta

Tarkoitus ei ole tehdä ainoaa Bitsocial-asiakasta. Tarkoituksena on tehdä ensimmäinen laaja asiakas, joka näyttää kuinka pitkälle protokolla voi venyä.

## Oletuksena tuttu, korvattavissa suunnittelulla

Oletuskokemuksen tulisi olla kilpailukykyinen yleisten julkisten keskustelusovellusten kanssa: nopea kotisyöte, seurannat, vastaukset, uudelleenlähetystyylinen jakelu, yhteisöt, ilmoitukset, haku ja sinulle sijoitettu näkymä, joka toimii välittömästi.

Bitsocial Forge voi käyttää ensimmäistä oletusarvoista RPC- ja syötepalvelua. Tämä oletusarvo voi sisältää paremmuusjärjestyksen ja mainokset, jotta sovellus tuntuu täydelliseltä ensimmäisenä päivänä sen sijaan, että se pyytäisi yleisiä käyttäjiä kokoamaan koko pinon itse.

Erona on, että oletuksena ei pitäisi tulla vankilaksi. Käyttäjän pitäisi pystyä vaihtamaan RPC:itä, syötteitä, esiintymiä, sijoitusjärjestelmiä, mainoksia ja hakupalveluntarjoajia tai poistamaan sijoitus kokonaan. Sovellusta voidaan arvioida ensimmäisellä käynnistyskerralla samalla, kun kaikki tärkeät palvelut ovat vaihdettavissa.

Tämä tekee sovelluksesta muokattavamman kuin perinteinen alusta. Yksi käyttäjä saattaa säilyttää oletusarvoisen sijoitetun syötteen mainoksilla. Toinen saattaa käyttää kronologista syötettä ilman sijoitusta. Toinen voisi valita yksityisyyteen keskittyvän RPC:n, yhteisön ylläpitämän etsintäpalvelun, maksullisen mainoksettoman syötteen tai tietylle alakulttuurille rakennetun kapean algoritmin.

## Asiakkaiden väliset yhteisöt

Yhteisöjen pitäisi olla paljon tärkeämpiä kuin yksittäiset ryhmät yhden sovelluksen sisällä.

X/Twitterissä yhteisöt rajoittuvat X:n sisään. Ne voivat olla hyödyllisiä, mutta ne perivät yhden alustan, yhden tilijärjestelmän, yhden suosituspinon ja yhden tuotepinnan rajat.

Bitsocial-yhteisöä voidaan luoda, isännöidä, löytää ja käyttää eri asiakkaiden kautta. Tämä tarkoittaa, että lippulaivasovellus voi näyttää yhteisöjä ja viestejä laajemmasta Bitsocial-verkostosta, ei vain käyttäjiltä, ​​jotka aloittivat lippulaivasovelluksen sisällä. Yhteisöllä voi olla samanaikaisesti toimintaa kuvatauluasiakkaalta, Reddit-tyyliseltä keskusteluasiakkaalta, niche-foorumiasiakkaalta, mobiilisovellukselta ja lippulaivasovellukselta.

Tämä on ydinverkkovaikutusten etu: yksi asiakas voi tuntea olonsa tutulta valtavirran käyttäjille, mutta silti vetää arvoa monilta asiakkailta, yhteisön solmuilta, RPC-palveluntarjoajilta ja riippumattomilta palveluilta.

## Valinnaiset syöttöalgoritmit

Lippulaivasovelluksen ei pitäisi pakottaa yhtä globaalia luokitusjärjestelmää kaikille.

Syötealgoritmien tulee olla valinnaisia. Käyttäjä voi valita algoritmin markkinapaikalta, vaihtaa palveluntarjoajaa, käyttää yrityksen algoritmia, käyttää anonyymin operaattorin suorittamaa algoritmia, käyttää yhteisön rakentamaa algoritmia, käyttää henkilökohtaista algoritmia tai olla käyttämättä algoritmia ollenkaan.

Julkiset RPC-palveluntarjoajat ovat näille palveluille luonnollinen kilpailupaikka. He voivat indeksoida, luokitella ja suositella sisältöä, mutta he eivät saa omistaa käyttäjää tai profiilia.

Nämä palvelut voivat kilpailla myös itse sovelluksen muodosta. Yksi RPC voi tarjota sijoitetun syötteen mainoksilla. Toinen saattaa tarjota rankaisemattoman kronologisen syötteen. Toinen voi erikoistua yksityisyyteen, kääntämiseen, moderointiin, yhteisön löytämiseen tai kapeaan sosiaaliseen kaavioon.

Jos talous toimii, RPC:n tukemat syötepalvelut voisivat lisätä tekoälyominaisuuksia, jotka ovat samankaltaisia ​​kuin mitä valtavirran alustat yrittävät lisätä syötteihinsä: automaattisia käännöksiä, tiivistelmiä, bot-avusteisia vastauksia, hakuvastauksia, moderointiapua tai yhteisön muistiinpanotyylistä kontekstia.

Näiden ominaisuuksien tulisi olla palveluvalintoja, ei protokollavaatimuksia. Oletus-RPC voi kilpailla tarjoamalla monipuolisemman syötteen, mutta käyttäjien ja kilpailevien asiakkaiden pitäisi silti voida valita yksinkertaisempia, yksityisiä, kronologisia, mainoksia sisältämättömiä tai yhteisökohtaisia ​​vaihtoehtoja.

## Ei-vapaudenmukainen RPC

Jokaisen käyttäjän pitäisi voida osallistua täydellisenä vertaissolmuna RPC:n kautta antamatta RPC-palveluntarjoajalle identiteettinsä tai profiilinsa omistusta.

Isännöity polku on tärkeä, koska useimmat käyttäjät eivät aloita suorittamalla palvelinta. Poistumispolulla on aivan yhtä suuri merkitys: käyttäjän tulisi voida siirtyä omaan profiilisolmuunsa heikossa laitteistossa, mukaan lukien Raspberry Pi, milloin tahansa.

Tämä on ero mukavuuden ja huoltajuuden välillä.

## Miksi siitä voi tulla kaikenlainen sovellus

Jos Bitsocial Network antaa sovelluksille kestävän nimeämisen, maksut, juomarahat, palkinnot ja muut taloudelliset rajoitukset, lippulaivasovelluksesta voi tulla paljon enemmän kuin syöteasiakas.

Tärkeä rajoitus on, että sovelluksesta ei tule verkon uutta omistajaa. Se voi olla suuri asiakas, ehkä jopa suosituin asiakas, mutta jättää silti tilaa kilpaileville sovelluksille, kilpaileville RPC:ille, kilpaileville syötealgoritmeille ja itseisännöityille profiilisolmuille.
