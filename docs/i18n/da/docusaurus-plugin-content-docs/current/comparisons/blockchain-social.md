---
title: Bitsocial og blockchain-baserede sociale netværk
description: Hvordan Lens, DeSo og Steem lægger sociale data eller reglerne for dem på en blockchain, og hvorfor Bitsocial ikke bruger en.
---

# Bitsocial og blockchain-baserede sociale netværk

Lens, DeSo og Steem lægger hver især social aktivitet på en blockchain. Konti, follows, indlæg eller
reglerne omkring dem bliver til transaktioner, som validatorer ordner og gemmer. Bitsocial bruger
ingen blockchain: sociale medier har ikke brug for en global rækkefølge for hvert indlæg, så
Bitsocial springer konsensus, gas og staking over. Se
[Peer-to-peer-protokol](/peer-to-peer-protocol/) for begrundelsen.

## Hvad de har til fælles

- **Nogen betaler for hver skrivning.** Lens opkræver gas, som apps kan sponsorere; DeSo opkræver et
  gebyr for hver handling; Steem rationerer handlinger efter stakede tokens.
- **Kæden fastsætter én spampolitik for alle.** Gebyrer, stake og kontoomkostninger gælder på tværs
  af netværket i stedet for at blive valgt af hvert fællesskab.
- **Onchain-registreringer er permanente.** Apps kan skjule indhold, men de kan ikke fjerne det fra
  kæden.
- **Browsere er API-klienter.** Webapps signerer transaktioner og læser via en node, en indekser
  eller en API, som en anden driver.

## Lens

[Lens](https://lens.xyz/) kører på Lens Chain, et Ethereum-layer 2 bygget med ZKsyncs ZK Stack, der
bruger Avail til datatilgængelighed. Mask Network har
[forvaltet Lens siden januar 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **På kæden:** konti er smart contracts, brugernavne er NFT'er inden for navnerum, og grafer,
  grupper, feeds og deres regler er også kontrakter.
- **Uden for kæden:** et indlægs tekst og medier ligger i en JSON-fil på en URI, som regel på Grove,
  Lens' lagertjeneste foran IPFS. Reaktioner og bogmærker opbevares af Lens API, og apps læser via
  det API.
- **Spam og adgangskontrol:** transaktioner kræver gas i GHO, som apps kan sponsorere med
  hastighedsgrænser. Regler for feeds og grupper kan kræve, at man ejer tokens eller betaler.
- **Drift af kæden:** [L2BEAT](https://l2beat.com/scaling/projects/lens) vurderer Lens Chain som et
  Stage 0-validium med en centraliseret operatør, der kan nægte at medtage transaktioner.

## DeSo

[DeSo](https://docs.deso.org/) er en layer 1-blockchain bygget til sociale apps. Den skiftede fra
proof-of-work til proof-of-stake i juli 2024.

- **På kæden:** profiler, indlæg, likes, follows og direkte beskeder er alle transaktioner, som hver
  fuld node gemmer. Billeder og video hostes offchain; referencenoden bruger Google Cloud Storage og
  Cloudflare Stream.
- **Spam:** hver handling betaler et gebyr i DESO. Nye brugere får som regel start-DESO fra en node
  efter telefonbekræftelse.
- **Moderering:** hver node bestemmer, hvad den viser, ved at blackliste eller greyliste, men
  [indholdet bliver på kæden](https://docs.deso.org/deso-blockchain/content-moderation).
- **Fællesskaber:** dokumentationen beskriver ingen fællesskabs- eller forumprimitiv; et
  "fællesskab" er et feed, som en app kuraterer.
- **Drift af en node:** validatorer kræver mindst 32 GB RAM og 200 GB disk ifølge
  [validatorguiden](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) er en social blockchain, der belønner forfattere og kuratorer med
tokens, og [Steemit](https://steemit.com/) er dens vigtigste blogging-app. Hive brød ud af Steem i
2020; ifølge [Hives whitepaper](https://hive.io/whitepaper.pdf) kom forken efter salget af Steemit
Inc. til Justin Sun.

- **På kæden:** tekstindlæg, kommentarer, stemmer og deres redigeringshistorik, ordnet af 21 valgte
  witnesses, der producerer en blok hvert tredje sekund. Billeder hostes offchain.
- **Spam:** handlinger forbruger Resource Credits, som vokser med staket STEEM. Det koster STEEM at
  oprette en konto; Steemit betaler for brugere, der bekræfter en e-mailadresse og et telefonnummer.
- **Fællesskaber:** de er
  [brugerdefinerede operationer, som en indekser fortolker](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  uden for konsensus. Moderatorer kan mute indlæg, hvilket skjuler dem i apps, men lader dem blive
  på kæden.
- **Belønninger:** inflation finansierer belønningerne, og stake-vægtede stemmer afgør, hvordan de
  fordeles, så store indehavere former, hvad der får opmærksomhed.

## Sammenligning

| Spørgsmål           | Lens                                                                              | DeSo                                                                           | Steem                                                         | Bitsocial                                                                                               |
| ------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Kæde                | Ethereum-layer 2 (ZK Stack-validium)                                              | Egen layer 1, proof-of-stake                                                   | Egen kæde, delegeret proof-of-stake                           | Ingen                                                                                                   |
| Indlæggets indhold  | Offchain-JSON, som regel på Grove                                                 | Onchain-tekst; medier offchain                                                 | Onchain-tekst; billeder offchain                              | På fællesskabsejerens node og hos de peers, der læser og seeder det                                     |
| Identitet           | Smart contract-konto; brugernavne som NFT'er                                      | Nøglepar med en onchain-profil                                                 | Navngiven kædekonto med nøgler i flere niveauer               | Ed25519-nøglepar til brugere og fællesskaber                                                            |
| Fællesskaber        | Grupper og feeds som kontrakter med regler                                        | Ingen fællesskabsprimitiv                                                      | Fællesskaber fortolket af en indekser uden for konsensus      | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                                       |
| Spamkontrol         | Gas (ofte sponsoreret), token- eller betalingsregler                              | Gebyr for hver handling; startmidler efter telefontjek                         | Resource Credits fra stake; betalt kontooprettelse            | Hvert fællesskabs udfordring, før et indlæg accepteres                                                  |
| Moderering          | Gruppeadministratorer, onchain-regler, skjulning på API-niveau                    | Hver node filtrerer, hvad den viser                                            | Mutes i fællesskaber, stake-vægtede nedstemmer, appfiltre     | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                            |
| Drift               | Kædeoperatør plus Lens API og Grove                                               | Validatorer med mindst 32 GB RAM                                               | Valgte witnesses plus API- og indekseringsnoder               | En fællesskabsnode på forbrugerhardware plus hjælpeseedere                                              |
| Vigtigste afvejning | Programmerbare onchain-regler, men indhold og læsning afhænger af Lens' tjenester | Åben datapulje, men hver handling koster et gebyr og bliver liggende for evigt | Indbyggede belønninger, men stake former synlighed og styring | Ingen gebyrer eller stake, men ingen global rækkefølge, og gammelt indhold er ikke garanteret for evigt |
