---
title: BSO-tokenets historia
description: Hela generationshistoriken för BSO-tokenet, från dess ursprung på Avalanche 2021 till dagens oföränderliga, adminlösa Ethereum-kontrakt.
---

# BSO-tokenets historia

BSO är ett proveniensmynt. Protokollet bakom Bitsocial är öppet, och tokenet och kedjan är valfria
enligt design: vem som helst kan forka koden, köra sin egen klient eller bygga sin egen ekonomi
ovanpå den. Det som inte går att forka bort är proveniens. BSO har varit Bitsocials officiella token
sedan dag ett, och varje migrering sedan dess går att verifiera on-chain.

Den här sidan listar varje generation av tokenet, i ordning, med fullständiga kontraktsadresser så
att vem som helst kan granska historiken på egen hand.

## Gen 1: ursprunget, Avalanche, 2021

- **Kedja**: Avalanche
- **År**: 2021
- **Adress**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Utforskare**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Det var här BSO började. Utbudet delades ut genom tre airdroppar och belöningar från likviditetsmining,
utan presale och utan någon teamallokering avsatt före communityn. Kontraktet var en uppgraderbar proxy, vilket var
standardpraxis vid den tiden och lät teamet leverera fixar under tokenets tidiga liv.

## Gen 2: flytten till Ethereum, 2024

- **Kedja**: Ethereum
- **År**: 2024
- **Adress**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Utforskare**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 flyttade BSO från Avalanche till Ethereum, där resten av färdplanen för Bitsocial Chain byggs.
Precis som Gen 1 var det här kontraktet fortfarande en uppgraderbar proxy, som behölls i ytterligare
en generation medan det slutgiltiga, permanenta kontraktet förbereddes.

## Gen 3: helt oföränderligt, 2025

- **Kedja**: Ethereum
- **År**: 2025
- **Adress**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Utforskare**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 är det nuvarande och slutgiltiga BSO-kontraktet. Det är helt oföränderligt och adminlöst:

- ingen mint-funktion, så utbudet kan inte inflateras
- ingen ägaradress, så ingen kan ensidigt ändra kontraktets beteende
- ingen pausfunktion, så överföringar kan inte frysas
- inget proxymönster, så själva logiken kan inte bytas ut i efterhand

Det här är sluttillståndet som de två första generationerna byggdes mot: ett token utan några
adminnycklar kvar att hålla i.

## Hur migreringarna gick till

Varje migrering, Gen 1 till Gen 2 och Gen 2 till Gen 3, var en passiv 1:1-airdrop. Innehavarna
behövde inte skicka in något anspråk, signera något meddelande eller göra någonting alls. Saldon i
det gamla kontraktet lästes direkt och speglades 1:1 till det nya kontraktet, så en innehavares
position bevarades exakt genom migreringen.

Eftersom både de gamla och de nya kontrakten förblir publika och on-chain går varje steg i processen
att verifiera oberoende. Vem som helst kan jämföra historiska ögonblicksbilder av innehavare från
Gen 1 eller Gen 2 mot nuvarande Gen 3-saldon och bekräfta att migreringen stämde med vad den utgav
sig för att göra. Ingen del av den här historiken bygger på att man tar Bitsocial på orden.

## Verifiera allt

Ta inget av det här på förtroende. Granska uppgifterna direkt:

- Gen 1 på [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 på [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 på [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- den aktuella kedjesajten på [chain.bitsocial.net](https://chain.bitsocial.net)

Om en adress inte stämmer med det som listas här är det inte det officiella BSO-tokenet.
