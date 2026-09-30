---
title: BSO-tokenhistorikk
description: Hele generasjonshistorikken til BSO-tokenet, fra opprinnelsen på Avalanche i 2021 til dagens uforanderlige Ethereum-kontrakt uten administrator.
---

# BSO-tokenhistorikk

BSO er en proveniensmynt. Protokollen bak Bitsocial er åpen, og tokenet og kjeden er valgfrie av
design: hvem som helst kan forke koden, kjøre sin egen klient eller bygge sin egen økonomi oppå den.
Det som ikke kan forkes bort, er proveniens. BSO har vært det offisielle Bitsocial-tokenet fra
første dag, og hver migrering siden da kan verifiseres på kjeden.

Denne siden lister opp hver generasjon av tokenet, i rekkefølge, med fullstendige kontraktadresser
slik at hvem som helst kan kontrollere historikken på egen hånd.

## Gen 1: opprinnelsen, Avalanche, 2021

- **Kjede**: Avalanche
- **År**: 2021
- **Adresse**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Blokkutforsker**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Her startet BSO. Beholdningen ble delt ut gjennom tre airdrops og belønninger fra likviditetsmining,
uten forhåndssalg og uten en andel til teamet satt av foran fellesskapet. Kontrakten var en oppgraderbar proxy, som var vanlig praksis den
gangen og lot teamet levere rettelser i tokenets tidlige levetid.

## Gen 2: overgangen til Ethereum, 2024

- **Kjede**: Ethereum
- **År**: 2024
- **Adresse**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Blokkutforsker**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 flyttet BSO fra Avalanche til Ethereum, der resten av veikartet for Bitsocial Chain bygges.
Som Gen 1 var også denne kontrakten en oppgraderbar proxy, beholdt i én generasjon til mens den
endelige, permanente kontrakten ble forberedt.

## Gen 3: fullstendig uforanderlig, 2025

- **Kjede**: Ethereum
- **År**: 2025
- **Adresse**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Blokkutforsker**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 er den nåværende og endelige BSO-kontrakten. Den er fullstendig uforanderlig og uten
administrator:

- ingen mint-funksjon, så beholdningen kan ikke inflateres
- ingen eieradresse, så ingen kan ensidig endre hvordan kontrakten oppfører seg
- ingen pausefunksjon, så overføringer kan ikke fryses
- ingen proxy-struktur, så selve logikken kan ikke byttes ut senere

Dette er sluttilstanden de to første generasjonene ble bygget mot: et token uten administratornøkler
igjen å holde.

## Slik fungerte migreringene

Hver migrering, fra Gen 1 til Gen 2 og fra Gen 2 til Gen 3, var en passiv 1:1-airdrop. Eierne
trengte ikke å sende inn et krav, signere en melding eller gjøre noe som helst. Saldoene på den
gamle kontrakten ble lest direkte og speilet 1:1 over på den nye kontrakten, slik at eierens
posisjon ble bevart nøyaktig gjennom migreringen.

Fordi både den gamle og den nye kontrakten fortsatt er offentlige og ligger på kjeden, kan hvert
steg i prosessen verifiseres uavhengig. Hvem som helst kan sammenligne historiske øyeblikksbilder av
eiere fra Gen 1 eller Gen 2 mot dagens Gen 3-saldoer og bekrefte at migreringen stemte med det den
sa den skulle gjøre. Ingen del av denne historikken avhenger av å ta Bitsocial på ordet.

## Verifiser alt

Ikke ta noe av dette på tro. Kontroller historikken direkte:

- Gen 1 på [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 på [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 på [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- det gjeldende kjedenettstedet på [chain.bitsocial.net](https://chain.bitsocial.net)

Hvis en adresse ikke stemmer med det som står her, er det ikke det offisielle BSO-tokenet.
