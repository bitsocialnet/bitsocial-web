---
title: Bitsocial Chain
description: Fase 3 van het masterplan, over de voorgestelde economische laag als Ethereum L2-appchain voor Bitsocial-apps.
---

# Bitsocial Chain

Bitsocial Chain is de voorgestelde economische laag als Ethereum L2-appchain voor Bitsocial-apps. De
huidige site over de chain zelf is [chain.bitsocial.net](https://chain.bitsocial.net).

Dankzij de peer-to-peer sociale laag kunnen community's, identiteiten en content zich buiten een
centrale platformdatabase bewegen. Bitsocial Chain moet daar de gedeelde primitieven voor naamgeving,
monetisatie en betalingen aan toevoegen die deze apps financieel moeilijker uit te hongeren maken.

## Wat het moet aandrijven

- gedecentraliseerde Bitsocial-domeinen zoals `.bso`
- onderscheidingen en fooien
- duurzame rails voor monetisatie
- gedeelde liquiditeit tussen apps
- financiële structuren die banken of platforms lastiger kunnen dichtdraaien
- netwerkeffecten die niet afhangen van één bedrijf dat de hele stack bezit

Het doel is niet om met tokenmechanismen voorop te lopen. Het doel is om nuttige sociale apps
duurzamer en beter financierbaar te maken, en minder afhankelijk van gecentraliseerde aanbieders van
betalingen of naamgeving.

## Huidig proof of concept

Het eerste proof of concept van Bitsocial Chain richt zich op native `.bso`-namen. Het toont aan dat
een naamregister kan worden afgeleid uit de historie van Ethereum L1 zonder sociale content on-chain
te zetten:

- gebruikers dienen intents voor registreren, bijwerken, overdragen en intrekken in via gewone
  Ethereum L1-transacties
- iedereen kan de afleidingsnode draaien en dezelfde `.bso`-registerstatus reconstrueren
- een resolver koppelt een `.bso`-naam aan de publieke Bitsocial-sleutel die clients al gebruiken via
  het peer-to-peer protocol
- posts, stemmen, moderatie, feeds en communitycontent blijven off-chain en peer-to-peer

Dat proof of concept is geen Stage 2-lancering in productie. Er is nog geen proofsysteem, challenge
game, geauditeerde code, live deployment, definitieve prijsstelling of definitieve governance. De
langetermijnhouding is standaard transparant en privacycompatibel van opzet: de kernchain is publiek,
terwijl toekomstige fooien, betalingen, onderscheidingen en liquiditeit moeten voorkomen dat sociale
identiteit en walletgeschiedenis permanent aan elkaar vastzitten.

## Waarom het ertoe doet

Het decentraliseren van community's en identiteiten is noodzakelijk, maar het is niet genoeg om alle
social media te decentraliseren.

Zolang sociale apps nog afhangen van een handvol gecentraliseerde economische rails, blijven ze
makkelijk onder druk te zetten, te deplatformen of financieel uit te hongeren. Bitsocial Chain is het
voorgestelde antwoord op die tweede laag van afhankelijkheid.

## Relatie met apps

Bitsocial Chain hoort onder Bitsocial-apps te liggen, niet in de plaats daarvan te komen.

Het resultaat voor de buitenwereld zou moeten zijn:

- community's blijven peer-to-peer
- apps blijven zich van elkaar onderscheiden
- gebruikers krijgen praktische functies voor naamgeving en monetisatie
- makers en community's kunnen in alle clients steun ontvangen
- waarde kan zich door het ecosysteem bewegen zonder opnieuw een gecentraliseerde platformeigenaar te
  creëren

## Waarom dit na het Twitter/X-alternatief komt

Het huidige masterplan plaatst Bitsocial Chain na het Twitter/X-alternatief, omdat die app de chain niet nodig heeft. Profielen draaien als profielnodes via non-custodial RPC, en `.bso`-namen kunnen starten in een tijdelijk register op het Ethereum-mainnet ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) en later naar de chain verhuizen.

Bitsocial Chain zou decentralisatie niet moeten inruilen voor een eerdere lancering. Het zou geen vertrouwensaannames moeten toevoegen bovenop Ethereum zelf: geen upgradesleutels, geen security council en geen operator die het kan censureren of stilleggen. Het belangrijkste ontwerp daarvoor, een native rollup, hangt af van een Ethereum-upgrade die nog niet is ingepland. Totdat de chain aan die lat kan voldoen, laat het Twitter/X-alternatief de gebruikersbasis groeien die de chain zal bedienen.

## Ontwerpprincipes

Omdat Bitsocial Chain nog steeds voorgestelde infrastructuur is en geen gelanceerd product, moet het
plan gedisciplineerd blijven:

- Apps en community's eerst. De netwerklaag moet echte sociale producten sterker maken.
- Praktische functies eerst. Namen, onderscheidingen, fooien en betalingen zijn makkelijker uit te
  leggen dan abstracte financiële architectuur.
- Echte bijdrage boven hype. Economische primitieven moeten deelname, bouwen en steun aan de
  community belonen.
- Curatie is toegestaan. Apps kunnen rankings, standaardinstellingen en discovery vormgeven om
  duurzame community's te bevoordelen.
- De exacte mechanismen liggen nog open. Deze pagina legt de rol van Bitsocial Chain uit, niet een
  vastgelegde belofte over de definitieve economie.
