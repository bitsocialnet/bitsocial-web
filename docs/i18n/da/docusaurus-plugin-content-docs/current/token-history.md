---
title: BSO-tokenets historie
description: Hele generationshistorikken for BSO-tokenet, fra oprindelsen på Avalanche i 2021 til dagens uforanderlige og administratorløse Ethereum-kontrakt.
---

# BSO-tokenets historie

BSO er et token, der er defineret af sin proveniens. Protokollen bag Bitsocial er åben, og både
token og kæde er valgfrie efter design: alle kan forgrene koden, køre deres egen klient eller bygge
deres egen økonomi oven på den. Det, der ikke kan forgrenes væk, er proveniensen. BSO har været det
officielle Bitsocial-token fra første dag, og hver eneste migrering siden kan efterprøves on-chain.

Denne side viser hver generation af tokenet i rækkefølge med fulde kontraktadresser, så alle kan
kontrollere historikken på egen hånd.

## Gen 1: oprindelsen, Avalanche, 2021

- **Kæde**: Avalanche
- **År**: 2021
- **Adresse**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Blokudforsker**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Det var her, BSO startede. Udbuddet blev givet væk gennem tre airdrops og belønninger fra likviditetsmining, uden presalg og uden en teamandel skåret fra på forhånd. Kontrakten var en opgraderbar proxy, hvilket var standardpraksis
dengang og gjorde det muligt for teamet at udsende rettelser i tokenets tidlige liv.

## Gen 2: flytningen til Ethereum, 2024

- **Kæde**: Ethereum
- **År**: 2024
- **Adresse**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Blokudforsker**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 flyttede BSO fra Avalanche til Ethereum, hvor resten af køreplanen for Bitsocial Chain
bygges. Ligesom Gen 1 var denne kontrakt fortsat en opgraderbar proxy, som blev beholdt én
generation mere, mens den endelige og permanente kontrakt blev forberedt.

## Gen 3: fuldt uforanderlig, 2025

- **Kæde**: Ethereum
- **År**: 2025
- **Adresse**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Blokudforsker**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 er den nuværende og endelige BSO-kontrakt. Den er fuldt uforanderlig og uden administrator:

- ingen mint-funktion, så udbuddet kan ikke inflateres
- ingen ejeradresse, så ingen kan ensidigt ændre kontraktens adfærd
- ingen pausefunktion, så overførsler kan ikke fryses
- intet proxy-mønster, så selve logikken kan ikke skiftes ud senere

Det er den sluttilstand, de to første generationer blev bygget hen imod: et token, hvor der ikke er
nogen administratornøgler tilbage at holde på.

## Sådan foregik migreringerne

Hver migrering, både Gen 1 til Gen 2 og Gen 2 til Gen 3, var et passivt 1:1-airdrop. Indehavere
skulle hverken indsende et krav, signere en besked eller foretage sig noget som helst. Saldi på den
gamle kontrakt blev læst direkte og spejlet 1:1 over på den nye kontrakt, så en indehavers position
blev bevaret præcist på tværs af migreringen.

Fordi både de gamle og de nye kontrakter fortsat er offentlige og on-chain, kan hvert eneste trin i
processen efterprøves uafhængigt. Enhver kan sammenligne historiske øjebliksbilleder af indehavere
fra Gen 1 eller Gen 2 med de nuværende Gen 3-saldi og bekræfte, at migreringen svarede til det, den
lovede. Ingen del af denne historik afhænger af, at man tager Bitsocial på ordet.

## Efterprøv det hele

Tag ikke noget af dette på tro. Kontrollér historikken direkte:

- Gen 1 på [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 på [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 på [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- det aktuelle kædewebsted på [chain.bitsocial.net](https://chain.bitsocial.net)

Hvis en adresse ikke stemmer overens med det, der står her, er det ikke det officielle BSO-token.
