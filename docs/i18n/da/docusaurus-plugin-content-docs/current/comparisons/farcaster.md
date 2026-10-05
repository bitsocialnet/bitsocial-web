---
title: Bitsocial og Farcaster
description: Hvordan Farcaster, med onchain-konti, lagerleje og Snapchains validatornetværk, adskiller sig fra Bitsocials peer-to-peer-fællesskaber.
---

# Bitsocial og Farcaster

[Farcaster](https://docs.farcaster.xyz/) holder identiteten på en blockchain og de sociale data uden
for den. Konti, appnøgler og betalinger for lagerplads ligger i kontrakter på OP Mainnet, et
Ethereum-layer 2. Indlæg, kaldet casts, samt follows og reaktioner er signerede beskeder, som lagres
af [Snapchain](https://snapchain.farcaster.xyz/), et blockchain-lignende netværk, der i 2025 afløste
Farcasters tidligere Hub-netværk.

## Sådan fungerer Farcaster

- **Konti.** En konto er et numerisk Farcaster-id, der ejes af en Ethereum-adresse, som også kan
  angive en gendannelsesadresse. Apps poster med delegerede appnøgler, der er registreret onchain;
  en appnøgle kan ikke overtage kontoen.
- **Lagerleje.** Hver konto lejer lagerenheder, i øjeblikket til 0,20 dollar pr. enhed om året. En
  enhed lejet siden juli 2025 rummer 100 casts; derudover beskæres de ældste casts.
  Hastighedsgrænserne skalerer med den lejede lagerplads.
- **Snapchain.** Validatorer ordner beskeder i blokke med konsensus i Tendermint-stil, og hver fuld
  node har hele netværkets data. Noder kræver omkring 16 GB RAM og 2 TB lagerplads ifølge
  [nodeguiden](https://snapchain.farcaster.xyz/getting-started).
- **Navne.** Standardbrugernavne, kaldet fnames, er gratis og udstedes af Farcasters egen
  navneserver, som
  [kan tilbagekalde dem](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Brugere kan
  i stedet bruge et `.eth`-navn registreret på Ethereum.
- **Kanaler.** Emnekanaler er en eksperimentel funktion i Farcaster-klienten. Casts i en kanal er
  protokoldata, men kanalens metadata, follows og moderering
  [gemmes i klienten](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Læsning.** Apps læser via en Snapchain-node, de selv driver, eller via en administreret udbyder,
  som regel Neynar.

## Hvor de adskiller sig

### Blockchains og validatorer

Farcaster er afhængig af OP Mainnet til konti og betalinger og af Snapchain, et blockchain-lignende
netværk, til at ordne alle sociale data. Snapchains validatorsæt er tilladelsesbaseret. Ifølge
whitepaperet bliver censur vanskelig med omkring ti globalt fordelte validatorer; i oktober 2026 var
[validatorlisten](https://snapchain.farcaster.xyz/validators) mindre, og de fleste nøgler tilhørte
Neynar, som [købte Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster) i januar 2026.
Bitsocial har hverken kæde, validatorer eller konsensus.

### At betale for at poste

Hver Farcaster-konto betaler lagerleje, og lagerpladsen begrænser, hvor meget af en kontos historik
netværket gemmer. I Bitsocial koster det intet at poste på protokolniveau; hvert fællesskab
beslutter, om det vil kræve en captcha, en betaling, en token eller noget andet. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Fællesskaber

Farcaster-kanaler er en klientfunktion: klienten gemmer deres metadata og håndhæver
kanalmodereringen, så en cast, der er blokeret i en kanal, kan forblive gyldig på netværket og
synlig i andre apps. I Bitsocial er fællesskaber protokolobjekter med deres eget nøglepar, og
fællesskabets node accepterer eller afviser indlæg.

### Drift af infrastrukturen

En Farcaster-node rummer hele netværket, så dens lagerbehov vokser med al aktivitet; Farcaster
forventer en vækst hen imod de største clouddiske. En Bitsocial-fællesskabsnode rummer kun sine egne
fællesskaber og kører på almindelig forbrugerhardware.

### Browser

En Farcaster-app i browseren er en HTTP-klient til en node eller en udbyder. En Bitsocial-webapp kan
køre en peer-to-peer-node i fanen. Se [Peer-to-peer i browseren](/browser-p2p/).

## Sammenligning

| Spørgsmål            | Farcaster                                                               | Bitsocial                                                                                             |
| -------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Kategori             | Onchain-identitet med sociale data ordnet af validatorer                | Peer-to-peer-fællesskabsnetværk                                                                       |
| Identitet            | Farcaster-id ejet af en Ethereum-adresse, med delegerede appnøgler      | Ed25519-nøglepar til brugere og fællesskaber                                                          |
| Hvor indlæg ligger   | Snapchain, replikeret på hver fuld node, inden for betalte lagergrænser | Fællesskabsejerens node og de peers, der læser og seeder det                                          |
| Hvem holder det oppe | Snapchain-validatorer og nodeoperatører                                 | Fællesskabsejerens node plus hjælpeseedere                                                            |
| Fællesskaber         | Eksperimentelle kanaler styret af Farcaster-klienten                    | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                                     |
| Spamkontrol          | Lagerleje og hastighedsgrænser plus spametiketter på appniveau          | Hvert fællesskabs udfordring, før et indlæg accepteres                                                |
| Moderering           | Kanalværter i klienten, appfiltre, censurrisiko på validatorniveau      | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                          |
| Navne                | Gratis fnames, som Farcaster kan tilbagekalde, eller `.eth`-navne       | `.bso`- og `.eth`-navne, der oversættes til nøgler                                                    |
| Browser              | HTTP-klient til en node eller udbyder                                   | Peer-to-peer-node i en almindelig browserfane                                                         |
| Vigtigste afvejning  | Ét konsistent globalt datasæt, men leje, kæder og et lille validatorsæt | Ingen gebyrer eller kæder, men intet globalt datasæt, og gammelt indhold er ikke garanteret for evigt |
