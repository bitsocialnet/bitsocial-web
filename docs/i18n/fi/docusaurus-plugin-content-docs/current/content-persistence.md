---
title: Missä julkaisut ovat ja kuinka kauan ne säilyvät
description: Miksi Bitsocial-julkaisut ovat allekirjoitettuja ja sisältöosoitettuja, mutta jokainen solmu ei tallenna niitä ikuisesti, kuka pitää ne verkossa ja miten arkistoijat pitävät vanhan sisällön luettavana.
---

# Missä julkaisut ovat ja kuinka kauan ne säilyvät

Bitsocial ei tallenna jokaista julkaisua lohkoketjuun tai yrityksen tietokantaan. Kunkin yhteisön oma
solmu säilyttää sen julkaisut, lukijat ja jakajat auttavat tarjoilemaan niitä, ja pysyvän tallenteen
haluava voi säilyttää sellaisen. Julkaisujen ikuisesti säilyttäminen on **valinnaista, ei pakollista**:
protokolla ei pakota jokaista osallistujaa tallentamaan koko verkon historiaa.

Tällä sivulla selitetään, mitä tämä käytännössä tarkoittaa, sillä ”ei tallenneta ikuisesti” on helppo
ymmärtää väärin joko ”katoaa” tai ”luota minuun” -muotoon.

## Aitous ja saatavuus ovat eri kysymyksiä

Julkaisusta on kaksi eri kysymystä:

1. **Onko se aito?** Kirjoittiko tämä tekijä sen, ja hyväksyikö tämä yhteisö sen?
2. **Onko se yhä verkossa?** Voiko joku hakea sen tänään?

Bitsocial vastaa ensimmäiseen kryptografialla, ei luottamuksella. Jokainen julkaisu on tekijänsä
avainparilla allekirjoitettu, ja kun yhteisö hyväksyy sen, se tallennetaan sisältötunnisteella (CID):
tarkkojen tavujen tiivisteellä. Julkaisun hakeva voi itse tarkistaa allekirjoituksen ja tiivisteen.
Solmu, reititin, yhdyskäytävä tai arkisto ei voi muuttaa tekstiä tai väärentää toisen julkaisua ilman,
että tarkistus epäonnistuu.

Toinen kysymys koskee sitä, kuka säilyttää kopion, ja vain sitä ei taata.

## Kuka pitää julkaisut verkossa

- **Yhteisön solmu.** Omistajan solmu hyväksyy julkaisut ja säilyttää ne tietokannassaan niin kauan
  kuin yhteisö niitä säilyttää. Se on kopio, joka on aina olemassa yhteisön käydessä. Katso
  [Vertaisverkkoprotokolla](/peer-to-peer-protocol/).
- **Lukijat.** Työpöytäsovellukset, kuten 5chan Electron -sovellus, jakavat lataamiaan yhteisöjä
  ollessaan käynnissä, joten suosittuja yhteisöjä tarjoilee moni vertainen kuten suosittuja torrentteja.
  Selainvälilehti voi välimuistittaa ja validoida sisältöä auki ollessaan, mutta se ei ole pitkäikäinen host.
- **Jakajat.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) antaa kenelle
  tahansa mahdollisuuden lisätä jatkuvaa kapasiteettia VPS:ltä tai ylimääräiseltä koneelta. Se kiinnittää
  yhteisöjen uusimmat sivut ja julkaisupäivitykset sekä tekee kotireitittimien takana olevat yhteisöt
  selaimilla ladattaviksi.
- **Arkistoijat.** Kuka tahansa voi indeksoida yhteisöjä ja säilyttää kaiken näkemänsä. Arkistot ovat
  verkon päälle rakennettuja tavallisia palveluja, eivät protokollan erityisrooli.

## Yhteisöt valitsevat oman säilytysaikansa

Yhteisön omistaja päättää, kuinka pitkään vanhoja julkaisuja säilytetään; se ei ole protokollasääntö.
Jotkut yhteisöt haluavat vuosien historian. Toiset on tehty unohtamaan: 5chan-laudat toimivat
kuvalaudan tavoin, jossa ketjut putoavat laudalta, siirtyvät arkistoon ja poistetaan laudan solmulta
määräajan jälkeen (oletuksena 48 tuntia). Yhteisö voi myös jättää arkiston kokonaan pois.

Sama protokolla tukee molempia, koska säilytys on kunkin yhteisön määrittämä käytäntö, ei kustannus,
joka jokaisen solmun täytyy maksaa.

## Miksi kaikkea ei tallenneta ikuisesti?

Verkon, joka edellyttää jokaisen solmun säilyttävän jokaisen julkaisun ikuisesti, on maksettava siitä:

- **Lohkoketjuissa** jokainen täysi solmu säilyttää koko historian, joten solmuvaatimukset kasvavat
  kaiken toiminnan mukana ja julkaiseminen maksaa yleensä maksun.
- **Maksullinen tallennus**, kuten Farcasterin tallennusvuokra, pakottaa käyttäjät maksamaan historiansa
  säilyttämisestä ja karsii vanhimmat julkaisut maksetun määrän yli. Katso
  [Bitsocial ja Farcaster](/comparisons/farcaster/).
- **Keskitetyt palvelimet** säilyttävät kaiken, mutta vain niin kauan kuin yksi yritys haluaa ja sen
  sääntöjen mukaan.

Sosiaalinen media ei tarvitse maailmanlaajuista pääkirjaa. Ei ole väliä, hyväksyttiinkö julkaisu A
millisekunnin ennen julkaisua B, ja useimpia vanhoja julkaisuja luetaan harvoin. Bitsocial antaa
jokaisen yhteisösolmun pitää vain omat yhteisönsä, mikä tekee hostauksesta tarpeeksi halpaa kannettavalle,
Raspberry Pi:lle tai pienelle VPS:lle. Katso [Miksi ei lohkoketjua?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Kompromissi

Jos kukaan ei säilytä kopioa julkaisusta, se voi muuttua saavuttamattomaksi. Julkaisun CID ei koskaan
muutu, mutta CID on vain osoite: sisältö on haettavissa vain, kun vähintään yksi solmu tarjoilee sitä.
Jos yhteisön solmu poistuu pysyvästi verkosta eikä lukija, jakaja tai arkisto säilyttänyt julkaisuja,
ne ovat poissa.

Se on rehellinen hinta siitä, ettei maailmanlaajuista pääkirjaa vaadita. Se on myös hinta, joka kaikilla
suurilla alustoilla jo on: vanhat julkaisut katoavat, kun tilit, palvelimet tai yritykset katoavat. Erona
on, että Bitsocialissa jonkin säilyttäminen ei vaadi kenenkään lupaa.

## Säilytä tärkeä

- **Aja yhteisösolmua itse.** Omistaja, joka pitää solmun käynnissä, säilyttää yhteisön historian niin
  pitkään kuin yhteisön asetukset sitä säilyttävät.
- **Jaa.** Työpöytäsovelluksen auki pitäminen tai `bitsocial-seeder`in ajaminen pitää yhteisöt muiden
  saatavilla.
- **Arkistoi.** Itsenäiset arkistot pitävät vanhat ketjut luettavina ja haettavina, kun yhteisö pudottaa
  ne. [5archive.org](https://5archive.org) arkistoi 5chan-lautoja ja
  [seeditarchive.org](https://seeditarchive.org) Seedit-yhteisöjä. Molemmat ovat avointa lähdekoodia,
  joten kuka tahansa voi ajaa peiliä tai kilpailevaa arkistoa.

Koska jokainen arkistoitu julkaisu on yhä allekirjoitettu, arkisto ei voi huomaamatta kirjoittaa uudelleen
jonkun sanoja: lukija voi varmentaa arkistoidun julkaisun allekirjoituksen kuten elävänkin.
