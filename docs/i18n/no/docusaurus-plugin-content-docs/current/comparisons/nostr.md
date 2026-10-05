---
title: Bitsocial og Nostr
description: Hvordan Nostrs relébaserte modell står seg mot Bitsocials peer-to-peer-fellesskap, fra datavei og identitet til grupper, spamkontroll og moderering.
---

# Bitsocial og Nostr

Nostr passer ikke rent inn i kategoriene føderert eller blokkjede. Brukere får ikke kontoer tildelt
av instanser, og det finnes verken kjede, konsensus, gass eller global rekkefølge. Nostr beskrives
bedre som **relébaserte sosiale medier**: brukerne har nøkkelpar, signerer hendelser og publiserer
dem til reléer, som er vanlige servere som lagrer og serverer dem
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostrs egen
[README](https://github.com/nostr-protocol/nostr) sier at det ikke bygger på peer-to-peer-teknikker.

Det plasserer Nostr nærmere Bitsocial enn fødererte systemer og blokkjedesystemer på ett viktig
punkt: identiteten er kryptografisk og flyttbar. Forskjellene ligger i datalaget og i hvem som
vokter porten.

## Hvordan Nostr fungerer

- **Hendelser og reléer.** Hvert innlegg, hver profil og hver reaksjon er en signert JSON-hendelse.
  Klienter publiserer hendelser til reléer over WebSockets og abonnerer med filtre; reléene lagrer
  hendelsene og serverer dem tilbake. Reléer snakker ikke med hverandre.
- **Replikering.** Brukere publiserer vanligvis til flere reléer. En studie av 712 reléer i 2023 fant
  det gjennomsnittlige innlegget på 34,6 av dem ([Wei og Tyson](https://arxiv.org/abs/2402.05709)).
- **Finne noens innlegg.** Brukere publiserer en liste over reléene de skriver til og leser fra
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), og klienter henter en brukers
  innlegg fra brukerens skrivereléer.
- **Identitet.** Hver bruker er en secp256k1-nøkkel som signerer med Schnorr-signaturer.
  Spesifikasjonene definerer ingen rotasjon eller gjenoppretting av nøkler, så en tapt nøkkel er en
  tapt konto. Valgfrie identifikatorer på formen `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) kontrolleres mot en fil på
  webserveren til domenet.
- **Grupper.** Den anbefalte mekanismen for fellesskap er relébaserte grupper
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): et relé er vert for en
  gruppe, håndhever reglene for medlemskap og publisering før det godtar et innlegg, og signerer
  gruppens metadata. De eldre fellesskapene med moderatorgodkjenning
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) er nå merket som ikke
  anbefalt, til fordel for NIP-29.
- **Spamkontroll.** Hvert relé velger sin egen port: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentisering og
  tillatelseslister ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), betaling
  eller frekvensgrenser. Klienter legger til lister over dempede kontoer og tillitspoeng.
- **Media.** Bilder og video lastes opp til separate HTTP-filservere.

## Hvor de skiller seg

### Hvem som lagrer og serverer innlegg

I Nostr er reléene lagrings- og leveringslaget: en server må holde hvert innlegg tilgjengelig. I
Bitsocial hjelper HTTP-rutere bare klientene med å finne peers. De lagrer verken innlegg, profiler,
fellesskapsmetadata eller modereringstilstand; klientene henter innhold fra fellesskapets node og fra
peerne som seeder det. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Hvem som vokter porten

I Nostr tilhører skriveportene reléoperatørene. Utenfor NIP-29-grupper kan en nøkkel som avvises av
ett relé, publisere den samme hendelsen til et hvilket som helst relé som godtar den, og hva leserne
ser, avhenger av hvilke reléer klienten deres leser. En NIP-29-gruppe ligner mer på et
Bitsocial-fellesskap: vertsreléet godtar eller avviser innlegg. Reléet bestemmer likevel hva
grupperollene kan gjøre, og gruppens historikk forblir knyttet til det reléet med mindre et annet
relé går med på å overta den.

I Bitsocial er et fellesskap et kryptografisk objekt med sitt eget nøkkelpar. Fellesskapets node
kjører den utfordringen eieren velger, og publiserer den godtatte tilstanden ut i
peer-to-peer-nettverket. Se [Tilpassede utfordringer mot spam](/custom-challenges/).

### Drift av infrastrukturen

Et relé er en server med et domene og et WebSocket-endepunkt, og populære reléer bærer lagrings- og
båndbreddekostnadene for det de serverer. Studien fra 2023 anslo at rundt 95 prosent av de gratis
reléene ikke kunne dekke kostnadene sine med donasjoner. En Bitsocial-fellesskapsnode kjører på
forbrukermaskinvare, og peers som leser et fellesskap, kan hjelpe til med å dele det.

### Nettleser

En Nostr-webklient åpner WebSocket-forbindelser direkte til reléer, så det trengs ingen appserver.
En Bitsocial-webapp kjører en peer-to-peer-node i fanen og henter innhold fra peers. Se
[Peer-to-peer i nettleseren](/browser-p2p/).

### Gammelt innhold

Nostr-innlegg replikeres bredt på tvers av reléer, noe som hjelper gamle innlegg å overleve.
Bitsocial beholder fellesskapets nyeste tilstand og garanterer ikke gammelt innhold for alltid.

## Sammenligning

| Spørsmål                     | Nostr                                                                                          | Bitsocial                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Kategori                     | Relébasert protokoll                                                                           | Peer-to-peer-nettverk av fellesskap                                            |
| Identitet                    | secp256k1-brukernøkkel, uten rotasjon i spesifikasjonene                                       | Ed25519-nøkkelpar for brukere og fellesskap                                    |
| Hvor innleggene ligger       | Reléer valgt av forfatteren, ofte mange                                                        | Noden til fellesskapets eier og peerne som leser og seeder det                 |
| Hvem holder det tilgjengelig | Reléoperatører                                                                                 | Noden til fellesskapets eier pluss seedere som hjelper til                     |
| Fellesskap                   | Relébaserte grupper (NIP-29)                                                                   | Førsteklasses objekter der noden godtar eller avviser innlegg                  |
| Spamkontroll                 | Hvert relés policy: proof-of-work, autentisering, betaling, tillatelseslister, frekvensgrenser | Hvert fellesskaps utfordring før et innlegg godtas                             |
| Moderering                   | Relépolicyer, lister over dempede kontoer i klienter, merkelapper og rapporteringer            | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser          |
| Navn                         | Valgfrie identifikatorer på formen `name@domain`, kontrollert over HTTPS                       | `.bso`- og `.eth`-navn som peker til nøkler                                    |
| Nettleser                    | WebSocket-klient for reléer                                                                    | Peer-to-peer-node i en vanlig nettleserfane                                    |
| Viktigste avveining          | Flyttbar identitet og bred replikering, men tilgjengelighet og regler avhenger av reléene      | Mindre avhengighet av reléer, men gammelt innhold er ikke garantert for alltid |
