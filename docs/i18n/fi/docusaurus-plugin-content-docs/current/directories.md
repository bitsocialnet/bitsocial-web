---
title: Hakemistot
description: Miten Bitsocial-sovellukset antavat yhteisöjen kilpailla aihenimestä sen sijaan, että nimi jäisi sille, joka ehti varata sen ensimmäisenä.
---

# Hakemistot

Redditissä nimi kuten `r/opensource` voi kuulua vain yhdelle yhteisölle, ja se, joka nimeä hallitsee, myös pitää sen. Jos sen moderaattorit tekevät käyttäjien vastustamia valintoja, ainoa vaihtoehto on perustaa `r/opensource2`. Uusi yhteisö aloittaa ilman ainuttakaan tilaajaa, vaikka useimmat `r/opensource`-yhteisön tilaajat välittivät avoimesta lähdekoodista eivätkä juuri tuosta moderointitiimistä.

Bitsocial-sovellukset välttävät tämän **hakemistojen** avulla. Hakemisto on aihenimi, kuten `opensource`, josta yhteisöt kilpailevat. Nimen lyhyt reitti avaa sen yhteisön, joka on sillä hetkellä kärjessä, joten parempi yhteisö voi ottaa nimen haltuunsa kenenkään lupaa kysymättä.

## Miten se toimii

1. **Hakemistokoodi on aihenimi.** Seedit käyttää reittejä kuten `/s/funny`. 5chan käyttää kuvalautojen polkuja kuten `/g/`.
2. **Yhteisöt kilpailevat ehdokkaina.** Jokaisella hakemistolla on luettelo ehdokasyhteisöistä, joilla kullakin on oma tarkka osoitteensa, kuten `funny-posting.bso`.
3. **Korkeimmalle sijoittuva ehdokas voittaa reitin.** Kun avaat `/s/funny`-reitin, näet nykyisen voittajan.
4. **Häviäminen ei poista mitään.** Yhteisö, joka ei ole voittaja, säilyttää osoitteensa, viestinsä ja tilaajansa, ja kuka tahansa voi yhä avata sen suoraan.

## Nimi on etuovi, ei identiteetti

Hakemistokoodi on vain löytämisen reitti. Kaikki pysyvä viittaa tarkasti yksilöityyn yhteisöön:

- Kun tilaat `/s/funny`-reitin kautta, tilaus kohdistuu nykyisen voittajan tarkkaan osoitteeseen. Itse hakemistokoodia ei koskaan tallenneta tilaukseksi.
- Viestilinkit käyttävät aina yhteisön tarkkaa osoitetta, joten vanha linkki ei voi alkaa osoittaa eri yhteisöön voittajan vaihduttua.
- Kun voittaja vaihtuu, Seedit jättää olemassa olevat tilaukset ennalleen ja kysyy jokaiselta tilaajalta, vaihdetaanko uuteen voittajaan, pidetäänkö molemmat vai säilytetäänkö nykyinen yhteisö. Automaattinen vaihto on hakemistokohtainen asetus, joka on otettava erikseen käyttöön, ja automaattisen vaihdon yhteydessä näytetään ilmoitus, josta vaihdon voi perua.

Kilpaileva yhteisö ei siis vie keneltäkään tilauksia. Se voittaa nimen: uudet kävijät päätyvät sen luo, ja nykyiset tilaajat saavat valita yhdellä napsautuksella. Ne, jotka pitivät vanhasta yhteisöstä enemmän, voivat pitää sen.

## Miksi nimet eivät mene ensimmäiselle varaajalle

- **Ei nimien valtaamista.** Hyvän nimen hallussapito ei riitä. Yhteisön on pysyttävä nimen parhaana ehdokkaana.
- **Mikään ylläpitäjä ei jaa nimiä.** Ylläpitäjän tekemä jako loisi uudelleen sen keskitetyn veto-oikeuden, jonka poistamiseksi Bitsocial on rakennettu.
- **Kilpailijoilla säilyy reitti yleisön luo.** Kilpaileva yhteisö tavoittelee samaa nimeä sen sijaan, että aloittaisi alusta huonomman nimen alla.
- **Asiakasohjelmat ovat yksimielisiä voittajasta.** Seedit järjestää ehdokkaat deterministisesti, joten jokainen asiakasohjelma, joka lukee saman lopullisen hakemiston tilannevedoksen, näyttää saman voittajan. Seedit ei vaihda tilalle toista ehdokasta vain siksi, että voittaja on tilapäisesti tavoittamattomissa yhden käyttäjän yhteydellä.

## Miten voittajat valitaan nykyään

Ehdokkaat julkaistaan JSON-tiedostoina [bitsocialnet/lists](https://github.com/bitsocialnet/lists)-repositoriossa, yksi tiedosto hakemistoa kohden, ja yhteisö liittyy hakemistoon tekemällä pull requestin sen tiedostoon. Tämä on käynnistysvaihe. Tavoitteena on, että äänestys korvaa pull requestit tapana ratkaista voittajat.

- **Seedit** järjestää hakemiston ehdokkaat ensin pisteiden, sitten lisäysajankohdan ja lopuksi osoitteen mukaan. Jokaisessa hakemistotiedostossa on versionumero, ja mikä tahansa muutos sen ehdokkaisiin tai voittajaan julkaisee uuden version.
- **5chan** järjestää jokaiselle hakemistolle yhden äänestyskilpailun [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting)-kirjaston avulla. Asiakasohjelmat vaihtavat allekirjoitettuja äänestyslippuja libp2p gossipsub -protokollan kautta ja laskevat tuloksen itse, eikä mikään palvelin laske ääniä. Äänestäminen edellyttää 5chan Passia, joka on siirtokelvoton tokeni, ja jokainen haltija saa yhden äänen. Ääni laudalle, jota ei vielä ole luettelossa, asettaa sen ehdolle. Kilpailut käydään tällä hetkellä Base Sepolia -testiverkossa, ja niin kauan kuin ne ovat testiverkossa, tulokset näytetään, mutta ne eivät muuta luettelon järjestystä.

## Protokolla vai sovellus?

Hakemistot eivät ole osa PKC:tä, vertaisverkkokerrosta, joka tallentaa ja siirtää yhteisöjä. Ne ovat käytäntö, jota asiakasohjelmat soveltavat sen yläpuolella oletusluetteloiden ja haun rinnalla; katso [Sisällön löytäminen](./content-discovery.md). Asiakasohjelma voi lukea samoja hakemistotiedostoja, julkaista omiaan tai jättää hakemistot kokonaan käyttämättä, ja käyttäjät voivat silti avata minkä tahansa yhteisön sen osoitteella.
