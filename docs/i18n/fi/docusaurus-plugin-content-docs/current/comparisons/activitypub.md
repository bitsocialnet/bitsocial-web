---
title: Bitsocial ja ActivityPub
description: Miten Fediverse, jossa Mastodon palvelee mikrobloggausta ja Lemmy Reddit-tyylisiä yhteisöjä, vertautuu Bitsocialin vertaisverkkoyhteisöihin.
---

# Bitsocial ja ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) on W3C:n standardi, jonka varassa Fediverse
toimii. Käyttäjät valitsevat palvelimen eli instanssin, joka isännöi heidän tiliään, ja palvelimet
vaihtavat julkaisuja keskenään. [Mastodon](https://joinmastodon.org/) on sen tunnetuin
mikroblogiohjelmisto; [Lemmy](https://join-lemmy.org/) on aihekohtaisista yhteisöistä koostuva
Reddit-tyylinen linkkiaggregaattori ja keskustelufoorumi, mikä tekee siitä Fediversen lähimmän
vastineen [Seeditin](/apps/seedit/) kaltaisille Bitsocial-sovelluksille.

## Miten ActivityPub toimii

- **Saapuneet ja lähtevät.** Jokaisella tilillä on saapuneiden laatikko (inbox) ja lähtevien
  laatikko (outbox). Palvelimet toimittavat aktiviteetteja muiden palvelinten saapuneiden
  laatikoihin, ja jokainen vastaanottava palvelin tallentaa oman kopionsa siitä, mitä sen käyttäjät
  seuraavat.
- **Palvelimen omistama identiteetti.** Tilien ja julkaisujen tunnisteet ovat HTTPS-osoitteita
  alkuperäpalvelimen verkkotunnuksessa. Mastodon-käyttäjätunnus on muotoa `@user@domain`, ja se
  selvitetään WebFingerillä; palvelin allekirjoittaa federaatioviestit käyttäjän puolesta.
- **Asiakkaat.** Sovellukset ja selaimet keskustelevat vain käyttäjän oman palvelimen kanssa tämän
  palvelimen API:n kautta.
- **Lemmyn yhteisöt.** Yhteisö on ryhmätoimija (group actor), jota isännöidään yhdellä instanssilla.
  Käyttäjät lähettävät julkaisuja yhteisölle, joka välittää ne edelleen seuraajilleen; yhteisen
  foorumistandardin
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) mukaan
  yhteisö voi ensin tarkistaa julkaisut, jopa niin, että moderaattorit hyväksyvät ne käsin.
- **Moderointi.** Moderointi on paikallista kullakin palvelimella. Ylläpitäjät voivat jäädyttää
  tilejä, estää kokonaisia palvelimia tai federoida vain sallittujen listalla olevien palvelinten
  kanssa; Lemmyssä on lisäksi moderaattorit jokaiselle yhteisölle.
- **Roskapostin torjunta.** ActivityPub ei määrittele mitään roskapostin torjuntamekanismia.
  Mastodon ja Lemmy rajaavat rekisteröitymistä hyväksynnöillä, kutsuilla, hakemuskysymyksillä,
  captchoilla ja sähköpostitarkistuksilla ja nojaavat sen jälkeen nopeusrajoituksiin, ilmoituksiin
  ja moderointiin.

## Missä ne eroavat

### Identiteetti kuuluu verkkotunnukselle

Fediverse-tili kuuluu palvelimensa verkkotunnukselle. Mastodon voi ohjata seuraajat uudelle tilille,
mutta [julkaisut eivät siirry](https://docs.joinmastodon.org/user/moving/), siirto on käynnistettävä
vanhalta palvelimelta, ja sen jälkeen on 30 päivän odotusaika. Bitsocialissa profiilit ja yhteisöt
ovat avainpareja, joten isännän tai sovelluksen vaihtaminen ei muuta identiteettiä. Katso
[Identiteetti ja yhteisön omistajuus](/identity-and-ownership/).

### Missä yhteisö asuu

Lemmy-yhteisö muistuttaa rakenteeltaan Bitsocial-yhteisöä: julkaisut menevät yhteisölle, joka voi
tarkistaa ne ennen kuin välittää ne edelleen. Ero on siinä, missä yhteisö asuu. Lemmy-yhteisön voi
luoda vain sen luojan kotiinstanssille, instanssin ylläpitäjällä on
[täysi määräysvalta](https://join-lemmy.org/docs/users/05-censorship-resistance.html) siihen, eikä
ole dokumentoitua tapaa siirtää sitä toiselle instanssille. Bitsocial-yhteisö on oma avainparinsa:
omistaja voi ajaa sen solmua missä tahansa, eikä mikään palvelimen ylläpitäjä ole sen yläpuolella.

### Roskapostin torjunta

Fediverse-palvelimet pysäyttävät roskapostin enimmäkseen rekisteröitymisvaiheessa ja moderoivat
jälkikäteen. Bitsocial-yhteisö ajaa haasteen jokaiselle julkaisulle ennen kuin hyväksyy sen, ja
jokainen yhteisö valitsee omansa: captcha, sallittujen lista, maksu tai mikä tahansa muu koodi.
Katso [Mukautetut roskapostin torjuntahaasteet](/custom-challenges/).

### Infrastruktuurin ylläpito

Instanssin ylläpito tarkoittaa jatkuvasti päällä olevaa palvelinta, jolla on verkkotunnus, TLS ja
sähköposti. Mastodon tarvitsee lisäksi PostgreSQL:n, Redisin ja taustaprosesseja; Lemmy on kevyempi
ja vie omien lukujensa mukaan noin 150 Mt RAM-muistia. Jokainen instanssi tallentaa kopiot
etäsisällöstä, jota sen käyttäjät seuraavat. Bitsocialin yhteisösolmu ei tarvitse verkkotunnusta
eikä varmennetta, ja se toimii työpöytäsovelluksesta tai `bitsocial-cli`-työkalulla.

### Mitä palvelimet antavat vastineeksi

Fediverse-palvelimet säilyttävät koko historian ja tarjoilevat sen luotettavasti, ja Mastodonilla on
vuosien mittaan kehittyneet kypsät moderointityökalut. Bitsocial ei takaa vanhan sisällön säilymistä
ikuisesti, ja sen moderointityökalut ovat kussakin sovelluksessa.

## Vertailu

| Kysymys                 | ActivityPub (Mastodon, Lemmy)                                                                 | Bitsocial                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Kategoria               | Federoidut palvelimet                                                                         | Vertaisverkkopohjainen yhteisöverkko                                                          |
| Identiteetti            | Tili palvelimen verkkotunnuksessa, palvelimen allekirjoittama                                 | Ed25519-avainparit käyttäjille ja yhteisöille                                                 |
| Missä julkaisut ovat    | Alkuperäpalvelimella sekä kopioina jokaisella palvelimella, jolla on seuraajia                | Yhteisön omistajan solmulla sekä vertaisilla, jotka lukevat ja jakavat sitä                   |
| Kuka pitää sen verkossa | Instanssien ylläpitäjät                                                                       | Yhteisön omistajan solmu sekä avustavat jakajat                                               |
| Yhteisöt                | Yhdellä instanssilla isännöidyt Lemmy-yhteisöt                                                | Ensiluokkaiset objektit, joiden solmu hyväksyy tai hylkää julkaisut                           |
| Roskapostin torjunta    | Rekisteröitymisen rajaus, nopeusrajoitukset, ilmoitukset ja moderointi                        | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                        |
| Moderointi              | Palvelinten ylläpitäjät ja yhteisöjen moderaattorit, paikallisesti kullakin palvelimella      | Yhteisöjen omistajat moderoivat yhteisöään; sovellukset valitsevat, mitä ne näyttävät         |
| Nimet                   | `@user@domain`- ja `!community@domain`-käyttäjätunnukset                                      | `.bso`- ja `.eth`-nimet, jotka ratkeavat avaimiksi                                            |
| Selain                  | Käyttäjän oman palvelimen asiakas                                                             | Vertaisverkkosolmu tavallisessa selainvälilehdessä                                            |
| Tärkein kompromissi     | Luotettava historia ja kypsä moderointi, mutta identiteetti ja yhteisöt kuuluvat palvelimelle | Palvelinta tai verkkotunnusta ei tarvita, mutta vanhan sisällön säilymistä ei taata ikuisesti |
