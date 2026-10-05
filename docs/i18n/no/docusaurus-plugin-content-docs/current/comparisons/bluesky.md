---
title: Bitsocial og Bluesky
description: Hvordan Bluesky og AT Protocol, med personlige dataservere, reléer og AppViews, står seg mot Bitsocials peer-to-peer-fellesskap.
---

# Bitsocial og Bluesky

[Bluesky](https://bsky.app/) er en mikrobloggapp bygget på [AT Protocol](https://atproto.com/), som
Bluesky Social PBC har utformet. Protokollen deler et sosialt nettverk opp i separate tjenester:
personlige dataservere er vert for kontoer, reléer samler dem i én strøm, og AppViews indekserer
strømmen til tidslinjene og trådene folk ser. Dokumentasjonen beskriver kontodata som lagret på
vertsservere, «i motsetning til en peer-to-peer-modell»
([oversikt](https://atproto.com/guides/overview)).

## Hvordan AT Protocol fungerer

- **Repositorier på servere.** Hvert innlegg, hver like og hver følging er en oppføring i
  forfatterens signerte repositorium, som ligger på en personlig dataserver (PDS). Bluesky drifter
  standardserverne, og hvem som helst kan drifte sin egen.
- **Reléer.** Reléer abonnerer på hver PDS og kringkaster endringene videre som én strøm, firehosen.
  Siden en protokolloppdatering i 2025 arkiverer de ikke lenger hvert repositorium, noe som gjorde dem
  mye billigere å drifte ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** En AppView indekserer hele firehosen og serverer tidslinjer, komplette svartråder,
  tellere og søk. Det er den mest ressurskrevende delen av nettverket.
- **Identitet.** En konto er en DID: vanligvis `did:plc`, registrert i én global katalog, eller
  `did:web`, knyttet til et domene. DID-dokumentet oppgir kontoens handle, signeringsnøkkel og
  nåværende server. PDS-en har signeringsnøkkelen; `did:plc` lar også brukere ha egne
  rotasjonsnøkler, slik at de kan flytte uten hjelp fra den gamle verten
  ([identitetsguide](https://atproto.com/guides/identity)).
- **Handles.** Handles er DNS-navn, som `alice.bsky.social` eller et domene brukeren eier, verifisert
  mot DID-en.
- **Moderering.** Hosting og rekkevidde er separate lag. Hvem som helst kan drifte en labeler, og
  brukere kan stable flere ([modereringsguide](https://atproto.com/guides/moderation)), men
  Bluesky-appen bruker alltid Blueskys egen moderering. Forfattere kan begrense hvem som kan svare på
  innleggene deres, og skjule svar.

## Hvor de skiller seg

### Servere eller peers

Blueskys data ligger på servere: en PDS er vert for hver konto, reléer bærer firehosen, og AppViews
serverer det klientene viser. En nettleser er en HTTP-klient for disse tjenestene, aldri en peer. I
Bitsocial serverer fellesskapets node og peerne som leser det, innholdet, og en webapp kan kjøre sin
egen peer-to-peer-node. Se [Peer-to-peer i nettleseren](/browser-p2p/).

### En global visning eller fellesskap

AT Protocol er laget for én global visning: en AppView ser hvert svar, så tråder og søk er komplette.
Bitsocial har ingen global indeks; hvert fellesskap publiserer sin egen tilstand, og apper bygger
oppdagelse oppå det. Se [Oppdagelse av innhold](/content-discovery/).

Bluesky har i dag ikke noe fellesskapsobjekt for offentlige innlegg. I juni 2026
[kunngjorde det innebygde fellesskap](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k)
der publisering krever godkjenning på enkelte personvernnivåer; per oktober 2026 var de ikke lansert.
I Bitsocial er fellesskap kjerneobjektet, og et fellesskaps node godtar eller avviser innlegg.

### Spamkontroll

Bluesky håndterer spam med frekvensgrenser på serverne sine, begrensninger for nye verter hos
reléet, automatisk deteksjon, manuell gjennomgang og merkelapper, og forfattere kan begrense svar.
Ingen port på fellesskapsnivå avgjør hva et innlegg må passere før det godtas. I Bitsocial velger
hvert fellesskap sin egen utfordring. Se [Tilpassede utfordringer mot spam](/custom-challenges/).

### Hvem som har nøklene

Kontoer på Blueskys egne servere logger inn med passord, og disse serverne oppbevarer
signeringsnøklene deres på vegne av brukerne ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Ifølge en protokollingeniør i Bluesky
[har de fleste kontoer ingen rotasjonsnøkler de kontrollerer selv](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
En Bitsocial-identitet er et nøkkelpar som genereres og oppbevares av brukerens app.

### Drift av infrastrukturen

En personlig server er billig: [referanse-PDS-en](https://github.com/bluesky-social/pds) anbefaler 1
GB RAM for opptil 20 brukere. En uavhengig AppView for hele nettverket er et stort prosjekt; en som
ble bygget i 2025, [kostet rundt 200 dollar i måneden](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w),
mest for 16 TB lagring. Bitsocial har ingen global indeks å replikere, og en fellesskapsnode kjører
på forbrukermaskinvare.

## Sammenligning

| Spørsmål                     | Bluesky (AT Protocol)                                                       | Bitsocial                                                                         |
| ---------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Kategori                     | Fødererte servere med en global indeks                                      | Peer-to-peer-nettverk av fellesskap                                               |
| Identitet                    | DID, der signeringsnøklene vanligvis ligger hos serveren                    | Ed25519-nøkkelpar for brukere og fellesskap                                       |
| Hvor innleggene ligger       | Forfatterens repositorium på en personlig dataserver                        | Noden til fellesskapets eier og peerne som leser og seeder det                    |
| Hvem holder det tilgjengelig | PDS-verter, reléer og AppViews, som standard driftet av Bluesky             | Noden til fellesskapets eier pluss seedere som hjelper til                        |
| Fellesskap                   | Ingen for offentlige innlegg ennå (kunngjort i 2026)                        | Førsteklasses objekter der noden godtar eller avviser innlegg                     |
| Spamkontroll                 | Frekvensgrenser på servere, automatisk deteksjon, merkelapper, svarkontroll | Hvert fellesskaps utfordring før et innlegg godtas                                |
| Moderering                   | Stablebare labelere; Bluesky-appen bruker alltid Blueskys moderering        | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser             |
| Navn                         | DNS-handles verifisert mot DID-en                                           | `.bso`- og `.eth`-navn som peker til nøkler                                       |
| Nettleser                    | HTTP-klient for en PDS og en AppView                                        | Peer-to-peer-node i en vanlig nettleserfane                                       |
| Viktigste avveining          | Komplette globale tråder og søk, men aggregeringen krever tunge servere     | Ingen tung global indeks, men heller ingen komplett oversikt over hele nettverket |
