---
title: Rakenna oma Bitsocial-asiakassovellus
description: Kehittäjäopas itsenäisten Bitsocial-asiakassovellusten julkaisuun, kuvalaudoista ja foorumeista kapean kohdeyleisön sosiaalisiin sovelluksiin.
---

# Rakenna oma Bitsocial-asiakassovellus

Bitsocial ei menesty siksi, että jokaiseen käyttötarkoitukseen olisi yksi virallinen sovellus. Se
menestyy silloin, kun monet asiakassovellukset voivat nojata samaan protokollaan ja kilpailla
keskenään käyttöliittymällä, kulttuurilla, löydettävyydellä, oletusasetuksilla ja
liiketoimintamallilla.

5chan ja Seedit ovat varhaisia todisteita toimivuudesta, eivät katto. Kenen tahansa rakentajan
pitäisi voida julkaista uusi kuvalauta, foorumi, profiilisovellus, ensisijaisesti mobiililaitteille
suunniteltu sosiaalinen sovellus, kapean yhteisön työkalu tai keskitetty asiakassovellus, joka
käyttää taustallaan Bitsocialia, ilman että alustan omistajalta tarvitsee kysyä lupaa.

## Mitä rakentajat voivat muuttaa

Bitsocial-asiakassovellus voi kilpailla tuotepäätöksillä ilman, että koko verkosta pitää haarauttaa
oma versio:

- käyttöliittymä ja visuaalinen ilme
- käyttöönoton kulku
- yhteisöjen oletusasetukset
- moderoinnin näkymät
- löydettävyysmalli
- mediakokemus
- mobiilin, työpöydän tai kapean kaistan reunaehdot
- ansainta ja liiketoimintamalli

Yhteinen kerros on protokolla. Tuotekerros on avoin kilpailulle.

## Nopein tapa oppia

Aloita sovelluksista, jotka ovat jo olemassa:

- Kokeile [5chania](https://5chan.app) anonyymeihin kuvalautayhteisöihin.
- Kokeile [Seeditiä](https://seedit.app) Redditin tyyliseen keskusteluun.
- Lue [Bitsocialin React-hookien](https://hooks.bitsocial.net/docs/quickstart/) dokumentaatio asiakaspuolen
  integraatiota varten.
- Lue [Bitsocial CLI:n](/developer-tools/cli/) dokumentaatio solmujen ja yhteisöjen ylläpidosta.

Jos haluat edetä nopeasti, osallistu ensin jonkin olemassa olevan sovelluksen kehitykseen. Jos
haluamasi käyttöliittymä, kulttuuri tai yhteisömalli ei sovi siihen, rakenna erillinen
asiakassovellus.

## Valitse kapea ensimmäinen versio

Paras ensimmäinen versio ei ole yleiskäyttöinen sosiaalinen sovellus. Se on asiakassovellus, jolla
on yksi selkeä kohdeyleisö ja yksi vahva syy olla olemassa.

Hyviä lähtökohtia ovat esimerkiksi:

- selkeämpi kuvalautasovellus yhdelle tietylle kulttuurille
- ensisijaisesti mobiililaitteille suunniteltu foorumisovellus
- yhden yhteisön sovellus tiukoilla oletusasetuksilla
- sisällöntekijäyhteisön sovellus
- pelkkään lukemiseen tarkoitettu löytämissovellus
- moderointi- tai ylläpitokonsoli
- tietylle kielelle, alueelle tai laiteluokalle optimoitu asiakassovellus

Pienet asiakassovellukset ovat hyödyllisiä, koska Bitsocial antaa niiden kasvaa osaksi samaa verkkoa
sen sijaan, että ne lukitsisivat käyttäjänsä yksityiseen tietokantaan.

## Toteutuspolut

Käytännön polkuja on kolme:

1. Haarauta olemassa oleva asiakassovellus, kun ideasi on lähellä 5chania tai Seeditiä.
2. Rakenna uusi React-asiakassovellus [Bitsocialin React-hookeilla](https://hooks.bitsocial.net/).
3. Rakenna oma integraatio solmurajapintojen ja julkisen RPC-infrastruktuurin päälle.

Julkisen RPC:n pitäisi tehdä kolmannesta polusta huomattavasti käytännöllisemmän. Käyttäjä voi
aloittaa ylläpidetyn, ei-säilyttävän RPC-palveluntarjoajan kautta ja siirtyä myöhemmin omaan
ylläpitoon tai kilpailevalle palveluntarjoajalle.

## Suunnitteluperiaate

Rakenna se asiakassovellus, jonka pitäisi olla olemassa omaa yhteisöäsi varten, ja anna
yhteensopivien asiakassovellusten kilpailla keskenään julkisesti.
