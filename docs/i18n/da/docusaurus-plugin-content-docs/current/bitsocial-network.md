---
title: Bitsocial Chain
description: Fase 3 af masterplanen, der dækker det foreslåede økonomiske lag som Ethereum L2-appchain til Bitsocial-apps.
---

# Bitsocial Chain

Bitsocial Chain er det foreslåede økonomiske lag til Bitsocial-apps, bygget som en Ethereum
L2-appchain. Webstedet for selve kæden findes i dag på
[chain.bitsocial.net](https://chain.bitsocial.net).

Det peer-to-peer-baserede sociale lag gør det muligt for fællesskaber, identiteter og indhold at
bevæge sig uden for en central platformsdatabase. Bitsocial Chain skal tilføje de fælles primitiver
til navngivning, monetisering og betaling, som gør de apps sværere at udsulte økonomisk.

## Hvad det skal drive

- decentraliserede Bitsocial-domæner såsom `.bso`
- belønninger og tips
- holdbar infrastruktur til monetisering
- delt likviditet på tværs af apps
- finansielle strukturer, som banker eller platforme har sværere ved at kvæle
- netværkseffekter, der ikke afhænger af, at én virksomhed ejer hele stakken

Målet er ikke at sætte tokenmekanik forrest. Målet er at gøre nyttige sociale apps mere holdbare,
lettere at finansiere og mindre afhængige af centraliserede udbydere af betaling og navngivning.

## Nuværende proof of concept

Det første proof of concept for Bitsocial Chain fokuserer på indbyggede `.bso`-navne. Det viser, at
et navneregister kan udledes af Ethereum L1-historikken, uden at socialt indhold lægges on-chain:

- brugere indsender hensigter om at registrere, opdatere, overføre og tilbagekalde gennem
  almindelige Ethereum L1-transaktioner
- alle kan køre udledningsnoden og rekonstruere den samme `.bso`-registertilstand
- en resolver oversætter et `.bso`-navn til den offentlige Bitsocial-nøgle, som klienterne allerede
  bruger over peer-to-peer-protokollen
- opslag, stemmer, moderation, feeds og fællesskabsindhold forbliver off-chain og peer-to-peer

Dette proof of concept er ikke en Stage 2-lancering i produktion. Der findes endnu hverken
bevissystem, udfordringsmekanisme, auditeret kode, live-udrulning, endelig prissætning eller endelig
styringsmodel. Den langsigtede holdning er gennemsigtighed som udgangspunkt og et design, der er
foreneligt med privatliv: selve kæden er offentlig, mens fremtidige tips, betalinger, belønninger og
likviditet bør undgå at fremtvinge permanente forbindelser mellem social identitet og
wallet-historik.

## Hvorfor det betyder noget

Det er nødvendigt at decentralisere fællesskaber og identiteter, men det er ikke nok til at
decentralisere alle sociale medier.

Hvis sociale apps stadig afhænger af nogle få centraliserede økonomiske infrastrukturer, er de
fortsat lette at presse, deplatforme eller udsulte økonomisk. Bitsocial Chain er det foreslåede svar
på det andet lag af afhængighed.

## Forholdet til apps

Bitsocial Chain skal ligge under Bitsocial-apps, ikke erstatte dem.

Resultatet udadtil bør være:

- fællesskaber forbliver peer-to-peer
- apps forbliver differentierede
- brugerne får praktiske funktioner til navngivning og monetisering
- skabere og fællesskaber kan modtage støtte på tværs af klienter
- værdi kan bevæge sig på tværs af økosystemet uden at genskabe en centraliseret platformsejer

## Hvorfor det kommer efter Twitter/X-alternativet

Den nuværende masterplan placerer Bitsocial Chain efter Twitter/X-alternativet, fordi den app ikke har brug for kæden. Profiler kører som profilnoder gennem ikke-custodial RPC, og `.bso`-navne kan starte i et midlertidigt register på Ethereum mainnet ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) og flytte over på kæden senere.

Bitsocial Chain bør ikke bytte decentralisering for en tidligere lancering. Den bør ikke tilføje nogen tillidsantagelser ud over Ethereum selv: ingen opgraderingsnøgler, intet sikkerhedsråd og ingen operatør, der kan censurere eller standse den. Det førende design til det, en native rollup, afhænger af en Ethereum-opgradering, der endnu ikke er planlagt. Indtil kæden kan leve op til det krav, opbygger Twitter/X-alternativet den brugerbase, kæden skal betjene.

## Designprincipper

Fordi Bitsocial Chain stadig er foreslået infrastruktur og ikke et lanceret produkt, bør planen
forblive disciplineret:

- Apps og fællesskaber først. Netværkslaget skal gøre rigtige sociale produkter stærkere.
- Praktiske funktioner først. Navne, belønninger, tips og betalinger er lettere at forklare end
  abstrakt finansiel arkitektur.
- Reelt bidrag frem for hype. Økonomiske primitiver skal belønne deltagelse, opbygning og støtte til
  fællesskabet.
- Kuratering er tilladt. Apps kan forme rangeringer, standardindstillinger og opdagelse, så
  holdbare fællesskaber begunstiges.
- De præcise mekanikker er stadig åbne. Denne side forklarer Bitsocial Chains rolle og er ikke et
  fast løfte om den endelige økonomi.
