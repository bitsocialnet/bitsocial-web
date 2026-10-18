---
title: Hvor innlegg ligger og hvor lenge de varer
description: Hvorfor Bitsocial-innlegg er signert og innholdsadressert, men ikke lagres for alltid av hver node, hvem som holder dem på nett, og hvordan arkiver holder gammelt innhold lesbart.
---

# Hvor innlegg ligger og hvor lenge de varer

Bitsocial lagrer ikke hvert innlegg på en blokkjede eller i en bedriftsdatabase. Hvert fellesskaps egen
node beholder innleggene sine, lesere og seedere hjelper til med å servere dem, og den som vil ha et
permanent arkiv, kan holde ett selv. Å beholde innlegg for alltid er **valgfritt, ikke obligatorisk**:
protokollen tvinger ikke hver deltaker til å lagre hele nettverkets historikk.

Denne siden forklarer hva det betyr i praksis, fordi «ikke lagret for alltid» lett kan misforstås som
«forsvinner» eller «stol på meg».

## Ekthet og tilgjengelighet er ulike spørsmål

Det er to ulike spørsmål om et innlegg:

1. **Er det ekte?** Skrev denne forfatteren det, og ble det godtatt av dette fellesskapet?
2. **Er det fortsatt på nett?** Kan noen hente det i dag?

Bitsocial svarer på det første spørsmålet med kryptografi, ikke tillit. Hvert innlegg er signert med
forfatterens nøkkelpar, og når et fellesskap godtar det, lagres innlegget under en
innholdsidentifikator (CID): en hash av de nøyaktige bytene. Alle som henter et innlegg, kan selv
kontrollere signaturen og hashen. En node, ruter, gateway eller et arkiv kan ikke endre teksten i et
innlegg eller forfalske et innlegg fra noen andre uten at kontrollen feiler.

Det andre spørsmålet gjelder hvem som beholder en kopi, og det er den eneste delen som ikke garanteres.

## Hvem holder innlegg på nett

- **Fellesskapets node.** Eierens node godtar innlegg og beholder dem i databasen så lenge fellesskapet
  beholder dem. Dette er den ene kopien som alltid finnes mens fellesskapet kjører. Se
  [Peer-to-peer-protokoll](/peer-to-peer-protocol/).
- **Lesere.** Skrivebordsapper som 5chan Electron-appen seeder fellesskapene de laster mens de kjører,
  slik at populære fellesskap serveres av mange peers, på samme måte som populære torrenter. En
  nettleserfane kan mellomlagre og validere innhold mens den er åpen, men er ikke en langvarig vert.
- **Seedere.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) lar hvem som helst
  bidra med alltid-på-kapasitet fra en VPS eller en ekstramaskin. Den pinner fellesskapenes nyeste sider
  og innleggsoppdateringer, noe som også gjør fellesskap bak hjemmerutere lastbare i nettlesere.
- **Arkivarer.** Hvem som helst kan gjennomsøke fellesskap og beholde alt de ser. Arkiver er vanlige
  tjenester bygget oppå nettverket, ikke en spesiell rolle i protokollen.

## Fellesskap velger sin egen oppbevaringstid

Hvor lenge et fellesskap beholder gamle innlegg, bestemmes av eieren, ikke av protokollen. Noen
fellesskap ønsker mange års historikk. Andre er laget for å glemme: 5chan-brett fungerer som et
imageboard, der tråder faller av brettet, flyttes til et arkiv og slettes fra brettets node etter en
fastsatt tid (48 timer som standard). Et fellesskap kan også hoppe over arkivet helt.

Den samme protokollen støtter begge, fordi oppbevaring er en regel hvert fellesskap fastsetter, ikke en
kostnad hver node må betale.

## Hvorfor ikke lagre alt for alltid?

Et nettverk som krever at hver node beholder hvert innlegg for alltid, må betale for det på en eller
annen måte:

- **Blokkjeder** lar hver fullnode lagre hele historikken, slik at nodekravene vokser med all aktivitet,
  og publisering vanligvis koster et gebyr.
- **Betalt lagring**, som Farcasters lagringsleie, får brukerne til å betale for å beholde historikken
  sin og beskjærer de eldste innleggene utover det de betaler for. Se
  [Bitsocial og Farcaster](/comparisons/farcaster/).
- **Sentrale servere** beholder alt, men bare så lenge ett selskap vil det, under det selskapets regler.

Sosiale medier trenger ikke en global hovedbok. Det spiller ingen rolle om innlegg A ble godtatt ett
millisekund før innlegg B, og de fleste gamle innlegg leses sjelden. Bitsocial lar hver fellesskapsnode
bare holde sine egne fellesskap, noe som holder hosting billig nok for en bærbar PC, en Raspberry Pi
eller en liten VPS. Se [Hvorfor ikke en blokkjede?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Avveiningen

Hvis ingen beholder en kopi av et innlegg, kan det bli utilgjengelig. Et innleggs CID endres aldri, men
en CID er bare en adresse: innhold kan bare hentes så lenge minst én node serverer det. Hvis et
fellesskaps node går permanent offline og ingen leser, seeder eller arkiv beholdt innleggene, er de
innleggene borte.

Det er den ærlige kostnaden ved ikke å kreve en global hovedbok. Det er også kostnaden alle store
plattformer allerede har: gamle innlegg forsvinner når kontoer, servere eller selskaper forsvinner.
Forskjellen er at det ikke kreves noens tillatelse å beholde noe på Bitsocial.

## Behold det som betyr noe

- **Kjør fellesskapets node selv.** En fellesskapseier som holder noden i gang, beholder fellesskapets
  historikk så lenge fellesskapets innstillinger beholder den.
- **Seed.** Å la en skrivebordsapp stå åpen eller kjøre `bitsocial-seeder` holder fellesskap tilgjengelig
  for andre.
- **Arkiver.** Uavhengige arkiver holder gamle tråder lesbare og søkbare etter at et fellesskap fjerner
  dem. [5archive.org](https://5archive.org) arkiverer 5chan-brett, og
  [seeditarchive.org](https://seeditarchive.org) arkiverer Seedit-fellesskap. Begge er åpen kildekode,
  så hvem som helst kan kjøre et speil eller et konkurrerende arkiv.

Fordi hvert arkiverte innlegg fortsatt er signert, kan et arkiv ikke stille omskrive det noen sa: en
leser kan verifisere signaturen til et arkivert innlegg på samme måte som for et direktesendt innlegg.
