---
title: Rakenna imageboard-asiakasohjelma
description: Vaiheen 1 osallistumisopas rakentajille, jotka haluavat toimittaa uusia kuvataulukokemuksia Bitsocialissa.
sidebar_position: 1
---

# Rakenna imageboard-asiakasohjelma

Vaiheessa 1 ei ole kyse yhdestä virallisesta sovelluksesta, joka kattaisi koko luokan. 5chan on ensimmäinen todiste, mutta varsinainen tavoite on laaja kuvatauluekosysteemi: useita Bitsocial-asiakkaita eri visuaalisilla kielillä, moderoinnin oletusasetukset, hakemistomallit ja kohdeyhteisöt.

## Mitä vaihe 1 tarvitsee

- Tutut 4chan-tyyliset asiakkaat valtavirran perehdyttämiseen
- Altchanin inspiroimia asiakkaita, joilla on erilaisia ​​kulttuureja ja levypaketteja
- Mobiiliasiakkaat tai matalan kaistanleveyden asiakkaat
- Yhden yhteisön tai markkinaraon asiakkaat, joilla on vahvat mielipide-oletukset
- Paremmat moderointi-, media-, perehdytys- tai etsintävirrat kuin ensimmäisessä sovelluksessa

## Nopein tapa auttaa

Jos haluat lyhimmän reitin toimitukseen, osallistu suoraan 5chaniin ensin:

- Tutustu live-sovellukseen osoitteessa [5chan.app](https://5chan.app)
- Tarkista lähde osoitteessa [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Liity rakentajan chattiin osoitteessa [t.me/fivechandev](https://t.me/fivechandev)

## Rakenna oma asiakas

Jos 5chan ei vastaa haluamaasi yhteisöä tai käyttöliittymää, luo sen sijaan erillinen asiakas. Yhteensopivat Bitsocial-asiakkaat voivat jakaa saman verkon ilman samoja tuotepäätöksiä.

1. Opi protokollakohtaiset työkalut:
   - [Bitsocial React -koukut](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Päätä, millaista kuvataulua todella rakennat.
Valitse ensin taulun rakenne, identiteettioletukset, moderointimalli, etsintäkulku ja visuaalinen kieli.
3. Valitse projektiin sopiva toteutuspolku.
Fork 5chan, jos haluat liikkua nopeasti tutulla kuvataulupohjalla. Aloita alusta, jos käyttöliittymän tai vuorovaikutusmallin on oltava radikaalisti erilainen.
4. Lähetä kapea ensimmäinen versio.
Yksi asiakas, joka palvelee yhtä todellista yhteisöä hyvin, on arvokkaampi kuin epämääräinen klooni, jonka tarkoitus on tyydyttää kaikkia.
5. Julkaise tulos ja anna yhteisöjen testata sitä.
Bitsocial paranee, kun ulkopuoliset rakentajat lähettävät mielipiteitä sisältäviä asiakkaita, jotka kilpailevat tuotteiden laadusta sen sijaan, että odottaissivat yhden virallisen sovelluksen tekevän kaiken.

## Suunnitteluperiaate

Bitsocial ei voita, kun hänellä on yksi siunattu asiakas. Se voittaa, kun monet asiakkaat voivat elää rinnakkain, haarautua, erikoistua ja palvella ensimmäisen sovelluksen tarpeita.
