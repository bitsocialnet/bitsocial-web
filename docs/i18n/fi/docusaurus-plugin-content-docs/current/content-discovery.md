---
title: Sisällön löytäminen
description: Kuinka Bitsocial erottaa vertaislöydön sovellustason kuratoinnista.
---

# Sisällön löytäminen

Bitsocial ei lisää yhtä globaalia syötettä, hakuindeksiä tai ranking-algoritmia protokollaan. Se jakaa sisällönhaun kahteen kerrokseen:

1. **Verkkohaku** löytää vertaiset, jotka tällä hetkellä palvelevat tunnettua yhteisöä.
2. **Sovelluksen kuratointi** päättää, mitkä yhteisöt, taulut, luettelot tai julkaisut tuote näytetään ensimmäisenä.

Tämä pitää protokollan pienenä jättäen samalla tilaa monille löytökokemuksille kilpailla.

## Verkkohaku

Jokaisella yhteisöllä on vakaa osoite, joka on johdettu sen julkisesta avaimesta. Kun asiakas jo tietää kyseisen osoitteen, se kyselee kevyitä HTTP-reitittimiä löytääkseen vertaisia, jotka ovat ilmoittaneet olevansa sen palveluntarjoajia.

Reitittimet palauttavat vain palveluntarjoajan vertaisosoitteet. Ne eivät tallenna viestejä, metatietoja, käyttäjäluetteloita tai ihmisten luettavissa olevaa hakemistoa yhteisöistä. Kun asiakas vastaanottaa vertaisosoitteet, se muodostaa yhteyden niihin ja hakee uusimmat yhteisön metatiedot sekä sisältöosoittimet ja hakee sitten todelliset viestitiedot hajautusmenetelmällä.

Tämä vastaa protokollakysymykseen: "Mistä voin hakea tämän yhteisön uusimman tilan?"

## Sovelluksen kuratointi

Erillinen tuotekysymys on: "Mitkä yhteisöt käyttäjän tulisi nähdä ensin?"

Bitsocial jättää sen sovelluksille, listoille ja käyttäjille sen sijaan, että se leipoisi yhden vastauksen verkkoon. Esimerkkejä:

- asiakas, joka näyttää yhteisöt, joita käyttäjä jo seuraa
- kuratoitu oletusluettelo Reddit-tyyliselle sovellukselle
- hakemistot, joissa yhteisöt kilpailevat aihenimestä, kuten `/g/` tai `/s/funny`
- tietyn sovelluksen ylläpitämät haku- tai sijoitusindeksit
- käyttäjien jakamat suorat linkit

Sovellukset voivat indeksoida, luokitella, suodattaa tai korostaa erilaisia asioita muuttamatta niitä protokollalaiksi. Jos yhden sovelluksen etsintäpinta ei ole hyödyllinen, toinen sovellus voi rakentaa toisen samoihin taustayhteisöihin.

## Nykyiset sovellukset

5chan ja Seedit käyttävät molemmat [hakemistoja](./directories.md): lyhyitä reittejä, kuten `/g/` tai `/s/funny`, joista yhteisöt kilpailevat. Ehdokkaat luetellaan nykyään julkisessa repositoriossa, ja 5chan testaa äänestyskilpailuja voittajien ratkaisemiseksi.

Lisäksi Seedit tilaa uusille tileille oletusluettelon yhteisöjä niiden tarkoilla osoitteilla. Yhteisöjä voidaan edelleen luoda ja jakaa näiden luetteloiden ulkopuolella.

Molemmissa tapauksissa sovellustason luettelo auttaa käyttäjiä löytämään jotain avattavaa, ja protokollatason haku ratkaisee valitun yhteisön vertaisille.

## Miksi tällä erottelulla on merkitystä

Yksittäinen hajautettu verkko tarvitsee edelleen hyvän löydön, mutta etsintäkerroksen tulisi olla vaihdettavissa. Bitsocialin ydinprotokolla keskittyy osoittettavuuteen, vertaishakuun, julkaisuun ja roskapostin torjuntaan. Kurointi toimii tämän kerroksen yläpuolella, jossa sovellukset voivat kokeilla hakemistoja, oletusluetteloita, syötteitä, haku-, äänestys- ja valvontakäytäntöjä ilman verkon laajuista siirtoa.
