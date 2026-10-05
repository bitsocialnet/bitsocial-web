---
title: Bitsocial og ActivityPub
description: Hvordan Fediverse, med Mastodon til mikroblogging og Lemmy til fællesskaber i Reddit-stil, adskiller sig fra Bitsocials peer-to-peer-fællesskaber.
---

# Bitsocial og ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) er W3C-standarden bag Fediverse. Brugerne vælger
en server, kaldet en instans, som hoster deres konto, og serverne udveksler indlæg med hinanden.
[Mastodon](https://joinmastodon.org/) er den bedst kendte mikroblogging-software;
[Lemmy](https://join-lemmy.org/) er en linkaggregator og et forum i Reddit-stil bygget op af
emnefællesskaber, hvilket gør den til det nærmeste modstykke i Fediverse til Bitsocial-apps som
[Seedit](/apps/seedit/).

## Sådan fungerer ActivityPub

- **Indbakker og udbakker.** Hver konto har en indbakke og en udbakke. Servere leverer aktiviteter
  til indbakker på andre servere, og hver modtagende server gemmer sin egen kopi af det, dens
  brugere følger.
- **Serverejet identitet.** Konto- og indlægs-id'er er HTTPS-adresser på oprindelsesserverens
  domæne. Et Mastodon-handle er `@user@domain`, slås op med WebFinger, og serveren signerer
  fødereringsbeskeder på brugerens vegne.
- **Klienter.** Apps og browsere taler kun med brugerens egen server, via den servers API.
- **Lemmy-fællesskaber.** Et fællesskab er en gruppeaktør, der hostes på én instans. Brugere sender
  indlæg til fællesskabet, som genudsender dem til sine følgere; under den fælles forumstandard
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) kan et
  fællesskab validere indlæg først, helt op til manuel godkendelse fra moderatorer.
- **Moderering.** Moderering er lokal for hver server. Administratorer kan suspendere konti, blokere
  hele servere eller kun føderere med en tilladelsesliste; Lemmy har desuden moderatorer for hvert
  fællesskab.
- **Spamkontrol.** ActivityPub definerer ingen anti-spam-mekanisme. Mastodon og Lemmy begrænser
  tilmeldinger med godkendelse, invitationer, ansøgningsspørgsmål, captchaer og e-mailbekræftelse og
  læner sig derefter op ad hastighedsgrænser, anmeldelser og moderering.

## Hvor de adskiller sig

### Identiteten tilhører et domæne

En Fediverse-konto tilhører sin servers domæne. Mastodon kan omdirigere følgere til en ny konto, men
[indlæg flytter ikke med](https://docs.joinmastodon.org/user/moving/), flytningen skal startes fra
den gamle server, og der er en karensperiode på 30 dage. I Bitsocial er profiler og fællesskaber
nøglepar, så skift af vært eller app ændrer ikke identiteten. Se
[Identitet og fællesskabsejerskab](/identity-and-ownership/).

### Hvor et fællesskab lever

Et Lemmy-fællesskab ligner strukturelt et Bitsocial-fællesskab: indlæg sendes til fællesskabet, som
kan tjekke dem, før det genudsender dem. Forskellen er, hvor det lever. Et Lemmy-fællesskab kan kun
oprettes på opretterens hjeminstans, instansens administrator har
[fuld kontrol](https://join-lemmy.org/docs/users/05-censorship-resistance.html) over det, og der
findes ingen dokumenteret måde at flytte det til en anden instans. Et Bitsocial-fællesskab er sit
eget nøglepar: ejeren kan køre dets node hvor som helst, og ingen serveradministrator står over det.

### Spamkontrol

Fediverse-servere stopper primært spam ved tilmeldingen og modererer bagefter. Et
Bitsocial-fællesskab kører en udfordring på hvert indlæg, før det accepteres, og hvert fællesskab
vælger sin egen: captcha, tilladelsesliste, betaling eller hvilken som helst anden kode. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Drift af infrastrukturen

At drive en instans betyder en server, der altid kører, med domæne, TLS og e-mail. Mastodon kræver
desuden PostgreSQL, Redis og baggrundsprocesser; Lemmy er lettere, omkring 150 MB RAM efter
projektets egne tal. Hver instans gemmer kopier af det eksterne indhold, dens brugere følger. En
Bitsocial-fællesskabsnode kræver hverken domæne eller certifikat og kører fra desktopappen eller
`bitsocial-cli`.

### Hvad serverne giver til gengæld

Fediverse-servere bevarer den fulde historik og leverer den pålideligt, og Mastodon har modne
modereringsværktøjer, der er opbygget over flere år. Bitsocial garanterer ikke gammelt indhold for
evigt, og dets modereringsværktøjer ligger i de enkelte apps.

## Sammenligning

| Spørgsmål            | ActivityPub (Mastodon, Lemmy)                                                            | Bitsocial                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Kategori             | Fødererede servere                                                                       | Peer-to-peer-fællesskabsnetværk                                                       |
| Identitet            | Konto på en servers domæne, signeret af serveren                                         | Ed25519-nøglepar til brugere og fællesskaber                                          |
| Hvor indlæg ligger   | Oprindelsesserveren plus kopier på hver server, der følger med                           | Fællesskabsejerens node og de peers, der læser og seeder det                          |
| Hvem holder det oppe | Instansadministratorer                                                                   | Fællesskabsejerens node plus hjælpeseedere                                            |
| Fællesskaber         | Lemmy-fællesskaber hostet på én instans                                                  | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                     |
| Spamkontrol          | Begrænsning af tilmeldinger, hastighedsgrænser, anmeldelser og moderering                | Hvert fællesskabs udfordring, før et indlæg accepteres                                |
| Moderering           | Serveradministratorer og fællesskabsmoderatorer, lokalt på hver server                   | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser          |
| Navne                | `@user@domain`- og `!community@domain`-handles                                           | `.bso`- og `.eth`-navne, der oversættes til nøgler                                    |
| Browser              | Klient til brugerens egen server                                                         | Peer-to-peer-node i en almindelig browserfane                                         |
| Vigtigste afvejning  | Pålidelig historik og moden moderering, men identitet og fællesskaber tilhører en server | Ingen server eller domæne nødvendig, men gammelt indhold er ikke garanteret for evigt |
