---
title: Bitsocial og Farcaster
description: Hvordan Farcaster, med onchain-kontoer, lagringsleie og validatornettverket Snapchain, står seg mot Bitsocials peer-to-peer-fellesskap.
---

# Bitsocial og Farcaster

[Farcaster](https://docs.farcaster.xyz/) holder identiteten på en blokkjede og de sosiale dataene
utenfor. Kontoer, appnøkler og lagringsbetalinger ligger i kontrakter på OP Mainnet, et lag
2-nettverk for Ethereum. Innlegg, kalt casts, sammen med følginger og reaksjoner, er signerte
meldinger som lagres av [Snapchain](https://snapchain.farcaster.xyz/), et blokkjedelignende nettverk
som i 2025 erstattet Farcasters tidligere Hub-nettverk.

## Hvordan Farcaster fungerer

- **Kontoer.** En konto er en numerisk Farcaster-ID eid av en Ethereum-adresse, som også kan angi en
  gjenopprettingsadresse. Apper publiserer med delegerte appnøkler registrert onchain; en appnøkkel
  kan ikke ta over kontoen.
- **Lagringsleie.** Hver konto leier lagringsenheter, for tiden 0,20 dollar per enhet per år. En
  enhet leid siden juli 2025 rommer 100 casts; utover det slettes de eldste castene. Frekvensgrensene
  skalerer med leid lagring.
- **Snapchain.** Validatorer ordner meldinger i blokker med konsensus i Tendermint-stil, og hver
  fullnode beholder hele nettverkets data. Noder trenger rundt 16 GB RAM og 2 TB lagring, ifølge
  [nodeguiden](https://snapchain.farcaster.xyz/getting-started).
- **Navn.** Standard brukernavn, kalt fnames, er gratis og utstedes av Farcasters egen navneserver,
  som [kan trekke dem tilbake](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Brukere
  kan i stedet bruke et `.eth`-navn registrert på Ethereum.
- **Kanaler.** Temakanaler er en eksperimentell funksjon i Farcaster-klienten. Casts i en kanal er
  protokolldata, men kanalmetadata, følginger og moderering
  [lagres i klienten](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Lesing.** Apper leser via en Snapchain-node de kjører selv, eller via en administrert
  leverandør, vanligvis Neynar.

## Hvor de skiller seg

### Blokkjeder og validatorer

Farcaster er avhengig av OP Mainnet for kontoer og betalinger, og av Snapchain, et
blokkjedelignende nettverk, for å ordne alle sosiale data. Snapchains validatorsett er lukket
(permissioned). Whitepaperen sier at sensur blir vanskelig med rundt ti globalt distribuerte
validatorer; i oktober 2026 var [validatorlisten](https://snapchain.farcaster.xyz/validators)
kortere, og de fleste nøklene tilhørte Neynar, som
[kjøpte Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) i januar 2026. Bitsocial
har verken kjede, validatorer eller konsensus.

### Betale for å publisere

Hver Farcaster-konto betaler lagringsleie, og lagringen begrenser hvor mye av en kontos historikk
nettverket beholder. I Bitsocial koster det ingenting å publisere på protokollnivå; hvert fellesskap
bestemmer om det skal kreve en captcha, en betaling, et token eller noe annet. Se
[Tilpassede utfordringer mot spam](/custom-challenges/).

### Fellesskap

Farcaster-kanaler er en klientfunksjon: klienten lagrer metadataene deres og håndhever
kanalmoderering, så en cast som er blokkert i en kanal, kan forbli gyldig i nettverket og synlig i
andre apper. I Bitsocial er fellesskap protokollobjekter med eget nøkkelpar, og fellesskapets node
godtar eller avviser innlegg.

### Drift av infrastrukturen

En Farcaster-node rommer hele nettverket, så lagringsbehovet vokser med all aktivitet; Farcaster
anslår at veksten går mot de største diskene i skyen. En Bitsocial-fellesskapsnode rommer bare sine
egne fellesskap og kjører på forbrukermaskinvare.

### Nettleser

En Farcaster-app i nettleseren er en HTTP-klient for en node eller leverandør. En Bitsocial-webapp
kan kjøre en peer-to-peer-node i fanen. Se [Peer-to-peer i nettleseren](/browser-p2p/).

## Sammenligning

| Spørsmål                     | Farcaster                                                                  | Bitsocial                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Kategori                     | Onchain-identitet med sosiale data ordnet av validatorer                   | Peer-to-peer-nettverk av fellesskap                                                                                |
| Identitet                    | Farcaster-ID eid av en Ethereum-adresse, med delegerte appnøkler           | Ed25519-nøkkelpar for brukere og fellesskap                                                                        |
| Hvor innleggene ligger       | Snapchain, replikert på hver fullnode, innenfor betalte lagringsgrenser    | Noden til fellesskapets eier og peerne som leser og seeder det                                                     |
| Hvem holder det tilgjengelig | Snapchain-validatorer og nodeoperatører                                    | Noden til fellesskapets eier pluss seedere som hjelper til                                                         |
| Fellesskap                   | Eksperimentelle kanaler styrt av Farcaster-klienten                        | Førsteklasses objekter der noden godtar eller avviser innlegg                                                      |
| Spamkontroll                 | Lagringsleie og frekvensgrenser, pluss spammerking på appnivå              | Hvert fellesskaps utfordring før et innlegg godtas                                                                 |
| Moderering                   | Kanalverter i klienten, appfiltre, risiko for sensur på validatornivå      | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                                              |
| Navn                         | Gratis fnames som Farcaster kan trekke tilbake, eller `.eth`-navn          | `.bso`- og `.eth`-navn som peker til nøkler                                                                        |
| Nettleser                    | HTTP-klient for en node eller leverandør                                   | Peer-to-peer-node i en vanlig nettleserfane                                                                        |
| Viktigste avveining          | Ett konsistent globalt datasett, men leie, kjeder og et lite validatorsett | Ingen avgifter eller kjeder, men heller ikke noe globalt datasett, og gammelt innhold er ikke garantert for alltid |
