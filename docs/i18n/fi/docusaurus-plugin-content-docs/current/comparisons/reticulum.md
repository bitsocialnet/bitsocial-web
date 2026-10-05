---
title: Bitsocial ja Reticulum
description: Miten Reticulum, LoRa-yhteyksille ja muille kapeakaistaisille linkeille tarkoitettu kryptografinen verkkopino, vertautuu Bitsocialiin ja voisiko Bitsocial toimia sen päällä.
---

# Bitsocial ja Reticulum

[Reticulum](https://reticulum.network/) on kryptografiaan perustuva verkkopino, jolla rakennetaan
verkkoja minkä tahansa käytettävissä olevan siirtotien yli: LoRa-radioiden, pakettiradion,
sarjayhteyksien, Wi-Fin, Ethernetin, TCP:n, UDP:n tai I2P:n. Se mainitaan usein Bitsocialin
rinnalla, koska kumpikin poistaa välistä yrityksen. Ne tekevät sen eri kerroksilla, joten ne
täydentävät toisiaan eivätkä kilpaile keskenään.

## Eri kerrokset

Reticulum korvaa verkkokerroksen. Se antaa sovelluksille salattuja, reititettäviä päätepisteitä
ilman IP-osoitteita, DNS:ää, varmentajia tai tilejä, ja se on suunniteltu toimimaan jopa linkeillä,
joiden nopeus on vain 5 bittiä sekunnissa ja MTU 500 tavua. Se ei määrittele julkaisuja, yhteisöjä
tai moderointia; sen päälle rakennetut sovellukset lisäävät ne.

Bitsocial on sosiaalinen protokolla. Se toimii IPFS/libp2p-pinon päällä tavallisten
internetyhteyksien yli, myös selainvälilehdeltä, ja määrittelee yhteisöt, julkaisut ja
yhteisökohtaiset roskapostin torjuntahaasteet. Katso
[Vertaisverkkoprotokolla](/peer-to-peer-protocol/) ja [Selaimen peer-to-peer](/browser-p2p/).

Bitsocialin pinossa Reticulum asettuisi suunnilleen libp2p:n paikalle, ei Bitsocial-protokollan
paikalle.

## Miten Reticulum toimii

- **Identiteetit.** Reticulum-identiteetti on 512-bittinen avainjoukko: X25519-avain salaukseen ja
  Ed25519-avain allekirjoituksiin.
- **Kohteet.** Sovellukset luovat kohteita, joiden osoite on 16 tavuun katkaistu SHA-256-tiiviste.
  Paketit eivät sisällä lähdeosoitetta.
- **Ilmoitukset.** Kohde tulee tavoitettavaksi, kun se lähettää ilmoituksen. Siirtosolmut välittävät
  ilmoituksen eteenpäin ja muistavat seuraavan hypyn takaisin, joten yhdenkään solmun ei tarvitse
  tuntea koko verkon karttaa.
- **Salaus.** Liikenne on oletuksena salattua; se käyttää lyhytikäisiä avaimia ja tarjoaa eteenpäin
  salaisuuden (forward secrecy).
- **LXMF.** [LXMF](https://github.com/markqvist/LXMF)-viestikerros lisää allekirjoitetut viestit,
  suoran toimituksen sekä tallenna ja välitä -toimituksen levityssolmujen kautta vastaanottajille,
  jotka eivät ole verkossa.

Näin rakennettuja sovelluksia ovat esimerkiksi viestintään tarkoitettu
[Sideband](https://github.com/markqvist/Sideband) sekä viestintään ja isännöityihin sivuihin
tarkoitettu [Nomad Network](https://github.com/markqvist/NomadNet). Reticulumin käsikirjassa on
[luettelo ohjelmista](https://reticulum.network/manual/software.html).

## Vertailu

| Kysymys                  | Reticulum                                                                                                              | Bitsocial                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Mikä se on               | Verkkopino                                                                                                             | Vertaisverkkopohjainen sosiaalinen protokolla ja sovellukset                                                     |
| Suunniteltu              | Mille tahansa siirtotielle, hitaisiin radiolinkkeihin asti                                                             | Internetyhteyksille, myös selainvälilehdille                                                                     |
| Identiteetti             | X25519- ja Ed25519-avainjoukko                                                                                         | Ed25519-avainparit käyttäjille ja yhteisöille                                                                    |
| Osoitteet                | Identiteetin ja sovelluksen nimen tiiviste                                                                             | Yhteisön julkisen avaimen tiiviste                                                                               |
| Vertaisen löytäminen     | Siirtosolmujen levittämät ilmoitukset                                                                                  | HTTP-reitittimet palauttavat tarjoajavertaiset                                                                   |
| Sosiaaliset ominaisuudet | Lisätään sovelluksissa, kuten Nomad Networkissa                                                                        | Yhteisöt, julkaisut, vastaukset ja moderointi protokollassa                                                      |
| Roskapostin torjunta     | Liitäntäkohtaiset ilmoitusten nopeusrajoitukset; LXMF:n proof-of-work-leimat, joita vastaanottaja tai solmu voi vaatia | Kunkin yhteisön haaste ennen kuin julkaisu hyväksytään                                                           |
| Offline-toimitus         | LXMF-levityssolmut tallentavat ja välittävät viestejä                                                                  | Vertaiset tarjoilevat edelleen yhteisön uusinta tilaa; julkaiseminen edellyttää, että yhteisön solmu on verkossa |

## Voisiko Bitsocial toimia Reticulumin päällä?

Ei tällä hetkellä. Bitsocialilla ei ole Reticulum-siirtotapaa, ja sen tietomalli olettaa internetin
kaistanleveyden: asiakas hakee yhteisön metatiedot ja julkaisujen sisällön vertaisilta ja vaihtaa
pubsub-viestejä, mikä sopii huonosti linkeille, jotka on rakennettu 500-tavuisten pakettien varaan
ja joiden läpäisy mitataan bitteinä tai kilobitteinä sekunnissa.

Realistinen polku on kapeampi: asiakas, joka toimii paikallisen mesh-verkon yli ilman
internetyhteyttä ja synkronoituu laajempaan Bitsocial-verkkoon, kun jokin internetyhteydellinen
vertainen tai yhdyskäytävä on tavoitettavissa. Se olisi uusi asiakas ja silta eikä muutos
protokollaan, eikä se ole nykyisellä tiekartalla.

## Rakentajille

Reticulum on julkaistu [Reticulum-lisenssillä](https://reticulum.network/manual/license.html):
MIT-tyyppiset ehdot sekä kaksi rajoitusta. Ohjelmistoa ei saa käyttää järjestelmissä, jotka on
suunniteltu vahingoittamaan ihmisiä, eikä tekoälyn tai koneoppimisen koulutusaineistojen luomiseen.
Lue lisenssi ennen kuin paketoit Reticulum-koodia Bitsocial-sovellukseen.

Viitetoteutus on [kirjoitettu Pythonilla](https://github.com/markqvist/Reticulum). Reticulumin
ylläpitäjät varoittavat, että useat epäviralliset Reticulum- ja LXMF-porttaukset ovat koneellisesti
tuotettuja ja sisältävät lisenssiväitteitä, joita he pitävät pätemättöminä, joten suosi
viitetoteutusta tai käsikirjassa lueteltuja ohjelmia.
