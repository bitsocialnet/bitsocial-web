---
title: Geschiedenis van de BSO-token
description: De volledige generatiegeschiedenis van de BSO-token, van de Avalanche-oorsprong in 2021 tot het huidige onveranderlijke Ethereum-contract zonder beheerder.
---

# Geschiedenis van de BSO-token

BSO is een herkomstmunt. Het protocol achter Bitsocial is open, en de token en de chain zijn
opzettelijk optioneel: iedereen kan de code forken, een eigen client draaien of er een eigen economie
op bouwen. Wat je niet weg kunt forken, is herkomst. BSO is vanaf dag één de officiële Bitsocial-token
geweest, en elke migratie sindsdien is on-chain verifieerbaar.

Deze pagina somt elke generatie van de token op, in volgorde, met volledige contractadressen zodat
iedereen het verhaal zelfstandig kan controleren.

## Gen 1: de oorsprong, Avalanche, 2021

- **Blockchain**: Avalanche
- **Jaar**: 2021
- **Adres**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Hier begon BSO. De voorraad werd verspreid via drie airdrops en beloningen voor liquidity mining,
zonder presale en zonder teamallocatie die vóór de community werd afgesplitst. Het contract was een upgradebare proxy, wat
destijds gangbaar was en het team in staat stelde om in de begintijd van de token fixes uit te
brengen.

## Gen 2: de overstap naar Ethereum, 2024

- **Blockchain**: Ethereum
- **Jaar**: 2024
- **Adres**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 verplaatste BSO van Avalanche naar Ethereum, waar de rest van de routekaart van Bitsocial Chain
wordt gebouwd. Net als Gen 1 was ook dit contract nog een upgradebare proxy, één generatie langer
aangehouden terwijl het definitieve, permanente contract werd voorbereid.

## Gen 3: volledig onveranderlijk, 2025

- **Blockchain**: Ethereum
- **Jaar**: 2025
- **Adres**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 is het huidige en definitieve BSO-contract. Het is volledig onveranderlijk en heeft geen
beheerder:

- geen mintfunctie, dus de voorraad kan niet worden opgeblazen
- geen eigenaarsadres, dus niemand kan eenzijdig het gedrag van het contract wijzigen
- geen pauzefunctie, dus overdrachten kunnen niet worden bevroren
- geen proxypatroon, dus de logica zelf kan later niet worden vervangen

Dit is de eindtoestand waar de eerste twee generaties naartoe werkten: een token waarvoor geen
beheerderssleutels meer bestaan.

## Hoe de migraties verliepen

Elke migratie, van Gen 1 naar Gen 2 en van Gen 2 naar Gen 3, was een passieve 1:1-airdrop. Houders
hoefden geen claim in te dienen, geen bericht te ondertekenen en verder helemaal niets te doen. De
saldi op het oude contract werden rechtstreeks uitgelezen en 1:1 gespiegeld naar het nieuwe contract,
zodat de positie van een houder exact behouden bleef over de migratie heen.

Omdat zowel de oude als de nieuwe contracten publiek en on-chain blijven, is elke stap in dit proces
onafhankelijk verifieerbaar. Iedereen kan historische momentopnames van houders uit Gen 1 of Gen 2
naast de huidige Gen 3-saldi leggen en bevestigen dat de migratie deed wat ze beweerde te doen. Geen
enkel onderdeel van deze geschiedenis vraagt erom Bitsocial op zijn woord te geloven.

## Controleer alles zelf

Neem hier niets van op goed vertrouwen aan. Bekijk de gegevens rechtstreeks:

- Gen 1 op [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 op [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 op [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- de huidige chain-website op [chain.bitsocial.net](https://chain.bitsocial.net)

Komt een adres niet overeen met wat hier staat, dan is het niet de officiële BSO-token.
