---
title: BSO-tokenin historia
description: BSO-tokenin täydellinen sukupolvihistoria vuoden 2021 Avalanche-alkuperästä nykyiseen muuttumattomaan ja ylläpitäjättömään Ethereum-sopimukseen.
---

# BSO-tokenin historia

BSO on alkuperällään todennettava kolikko. Bitsocialin taustalla oleva protokolla on avoin, ja token
ja ketju ovat suunnitelmallisesti valinnaisia: kuka tahansa voi haarauttaa koodin, ajaa omaa
asiakassovellustaan tai rakentaa oman taloutensa sen päälle. Alkuperää ei kuitenkaan voi haarauttaa
pois. BSO on ollut virallinen Bitsocial-token ensimmäisestä päivästä lähtien, ja jokainen sen
jälkeinen siirtymä on todennettavissa ketjusta.

Tämä sivu luettelee tokenin jokaisen sukupolven järjestyksessä ja täydellisine sopimusosoitteineen,
jotta kuka tahansa voi tarkistaa tiedot itsenäisesti.

## 1. sukupolvi: alkuperä, Avalanche, 2021

- **Ketju**: Avalanche
- **Vuosi**: 2021
- **Osoite**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Lohkoketjuselain**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Tästä BSO sai alkunsa. Liikkeeseen laskettu määrä jaettiin kolmella airdropilla ja
likviditeettilouhinnan palkkioina, ilman ennakkomyyntiä ja ilman tiimille yhteisön edeltä lohkaistua
osuutta. Sopimus oli päivitettävä proxy, mikä oli tuolloin
vakiokäytäntö ja antoi tiimin julkaista korjauksia tokenin alkuvaiheessa.

## 2. sukupolvi: siirtymä Ethereumiin, 2024

- **Ketju**: Ethereum
- **Vuosi**: 2024
- **Osoite**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Lohkoketjuselain**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Toinen sukupolvi siirsi BSO:n Avalanchesta Ethereumiin, jonne muu Bitsocial Chainin tiekartta
rakentuu. Ensimmäisen sukupolven tapaan tämäkin sopimus oli yhä päivitettävä proxy, joka pidettiin
käytössä vielä yhden sukupolven ajan lopullista, pysyvää sopimusta valmisteltaessa.

## 3. sukupolvi: täysin muuttumaton, 2025

- **Ketju**: Ethereum
- **Vuosi**: 2025
- **Osoite**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Lohkoketjuselain**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Kolmas sukupolvi on nykyinen ja lopullinen BSO-sopimus. Se on täysin muuttumaton ja ylläpitäjätön:

- ei mint-funktiota, joten liikkeeseen laskettua määrää ei voi kasvattaa
- ei omistajaosoitetta, joten kukaan ei voi yksipuolisesti muuttaa sopimuksen toimintaa
- ei pause-funktiota, joten siirtoja ei voi jäädyttää
- ei proxy-rakennetta, joten itse logiikkaa ei voi myöhemmin vaihtaa

Tämä on se lopputila, jota kohti kaksi ensimmäistä sukupolvea rakennettiin: token, johon ei jää
yhtään ylläpitoavainta kenenkään käteen.

## Miten siirtymät toteutettiin

Molemmat siirtymät, ensimmäisestä sukupolvesta toiseen ja toisesta kolmanteen, olivat passiivisia
1:1-airdroppeja. Haltijoiden ei tarvinnut tehdä lunastuspyyntöä, allekirjoittaa viestiä eikä ryhtyä
mihinkään toimiin. Vanhan sopimuksen saldot luettiin suoraan ja peilattiin suhteessa 1:1 uuteen
sopimukseen, joten haltijan positio säilyi siirtymässä täsmälleen ennallaan.

Koska sekä vanhat että uudet sopimukset ovat edelleen julkisesti ketjussa, prosessin jokainen vaihe
on itsenäisesti todennettavissa. Kuka tahansa voi verrata ensimmäisen tai toisen sukupolven
historiallisia haltijatilannekuvia nykyisiin kolmannen sukupolven saldoihin ja varmistaa, että
siirtymä vastasi sitä, mitä siitä kerrottiin. Mikään osa tästä historiasta ei nojaa siihen, että
Bitsocialin sanaan pitäisi luottaa.

## Tarkista kaikki itse

Älä ota mitään tästä uskon varassa. Tarkista tiedot suoraan:

- 1. sukupolvi palvelussa [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- 2. sukupolvi palvelussa [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- 3. sukupolvi palvelussa [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- nykyinen ketjusivusto osoitteessa [chain.bitsocial.net](https://chain.bitsocial.net)

Jos osoite ei täsmää tässä lueteltuun, kyseessä ei ole virallinen BSO-token.
