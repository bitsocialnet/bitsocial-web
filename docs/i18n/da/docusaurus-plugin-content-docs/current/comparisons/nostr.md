---
title: Bitsocial og Nostr
description: Hvordan Nostrs relæbaserede model adskiller sig fra Bitsocials peer-to-peer-fællesskaber, fra datavej og identitet til grupper, spamkontrol og moderering.
---

# Bitsocial og Nostr

Nostr passer ikke rent ind i hverken de fødererede eller de blockchain-baserede kasser. Brugerne får
ikke tildelt konti af instanser, og der findes hverken kæde, konsensus, gas eller global rækkefølge.
Nostr beskrives bedre som **relæbaserede sociale medier**: brugerne har nøglepar, signerer
begivenheder og publicerer dem til relæer, som er almindelige servere, der gemmer og leverer dem
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Nostrs egen
[README](https://github.com/nostr-protocol/nostr) siger, at protokollen ikke bygger på
peer-to-peer-teknikker.

Det placerer Nostr tættere på Bitsocial end fødererede systemer og blockchain-systemer på ét vigtigt
punkt: identiteten er kryptografisk og flytbar. Forskellene ligger i datalaget og i, hvem der vogter
porten.

## Sådan fungerer Nostr

- **Begivenheder og relæer.** Hvert indlæg, hver profil og hver reaktion er en signeret
  JSON-begivenhed. Klienter publicerer begivenheder til relæer over WebSockets og abonnerer med
  filtre; relæerne gemmer begivenhederne og leverer dem igen. Relæer taler ikke med hinanden.
- **Replikering.** Brugere publicerer som regel til flere relæer. En undersøgelse af 712 relæer i
  2023 fandt, at det gennemsnitlige indlæg lå på 34,6 af dem
  ([Wei og Tyson](https://arxiv.org/abs/2402.05709)).
- **At finde en persons indlæg.** Brugere publicerer en liste over de relæer, de skriver til og
  læser fra ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), og klienter henter
  en brugers indlæg fra brugerens skriverelæer.
- **Identitet.** Hver bruger er en secp256k1-nøgle, der signerer med Schnorr-signaturer.
  Specifikationerne definerer hverken nøglerotation eller gendannelse, så en mistet nøgle er en
  mistet konto. Valgfrie `name@domain`-identifikatorer
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) kontrolleres mod en fil på
  det pågældende domænes webserver.
- **Grupper.** Den anbefalede fællesskabsmekanisme er relæbaserede grupper
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): et relæ hoster en gruppe,
  håndhæver dens regler for medlemskab og opslag, før det accepterer et indlæg, og signerer dens
  metadata. De ældre moderatorgodkendte fællesskaber
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) er nu markeret som ikke
  anbefalede til fordel for NIP-29.
- **Spamkontrol.** Hvert relæ vælger sin egen adgangskontrol: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentificering og
  tilladelseslister ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), betaling
  eller hastighedsgrænser. Klienter tilføjer mute-lister og tillidsscorer.
- **Medier.** Billeder og video uploades til separate HTTP-filservere.

## Hvor de adskiller sig

### Hvem gemmer og leverer indlæg

I Nostr er relæerne laget til lagring og levering: en server skal holde hvert indlæg online. I
Bitsocial hjælper HTTP-routere kun klienter med at finde peers. De gemmer hverken indlæg, profiler,
fællesskabsmetadata eller modereringstilstand; klienter henter indholdet fra fællesskabets node og
de peers, der seeder det. Se [Peer-to-peer-protokol](/peer-to-peer-protocol/).

### Hvem vogter porten

I Nostr er det relæoperatørerne, der styrer, hvem der må skrive. Uden for NIP-29-grupper kan en
nøgle, som ét relæ afviser, publicere den samme begivenhed til ethvert relæ, der accepterer den, og
hvad læserne ser, afhænger af, hvilke relæer deres klient læser fra. En NIP-29-gruppe minder mere om
et Bitsocial-fællesskab: dens værtsrelæ accepterer eller afviser indlæg. Relæet bestemmer dog
stadig, hvad gruppens roller må, og gruppens historik forbliver bundet til det relæ, medmindre et
andet relæ indvilliger i at overtage den.

I Bitsocial er et fællesskab et kryptografisk objekt med sit eget nøglepar. Fællesskabets node kører
den udfordring, ejeren vælger, og publicerer den accepterede tilstand ud i peer-to-peer-netværket.
Se [Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Drift af infrastrukturen

Et relæ er en server med et domæne og et WebSocket-endpoint, og populære relæer bærer omkostningerne
til lagring og båndbredde for det, de leverer. Undersøgelsen fra 2023 anslog, at omkring 95 % af de
gratis relæer ikke kunne dække deres omkostninger med donationer. En Bitsocial-fællesskabsnode kører
på almindelig forbrugerhardware, og peers, der læser et fællesskab, kan hjælpe med at dele det.

### Browser

En Nostr-webklient åbner WebSocket-forbindelser direkte til relæer, så der er ikke brug for nogen
appserver. En Bitsocial-webapp kører en peer-to-peer-node i fanen og henter indhold fra peers. Se
[Peer-to-peer i browseren](/browser-p2p/).

### Gammelt indhold

Nostr-indlæg er bredt replikeret på tværs af relæer, hvilket hjælper gamle indlæg med at overleve.
Bitsocial bevarer fællesskabets seneste tilstand og garanterer ikke gammelt indhold for evigt.

## Sammenligning

| Spørgsmål            | Nostr                                                                                               | Bitsocial                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Kategori             | Relæbaseret protokol                                                                                | Peer-to-peer-fællesskabsnetværk                                              |
| Identitet            | secp256k1-brugernøgle, uden rotation i specifikationerne                                            | Ed25519-nøglepar til brugere og fællesskaber                                 |
| Hvor indlæg ligger   | Relæer valgt af forfatteren, ofte mange                                                             | Fællesskabsejerens node og de peers, der læser og seeder det                 |
| Hvem holder det oppe | Relæoperatører                                                                                      | Fællesskabsejerens node plus hjælpeseedere                                   |
| Fællesskaber         | Relæhostede grupper (NIP-29)                                                                        | Førsteklasses objekter, hvis node accepterer eller afviser indlæg            |
| Spamkontrol          | Hvert relæs politik: proof-of-work, autentificering, betaling, tilladelseslister, hastighedsgrænser | Hvert fællesskabs udfordring, før et indlæg accepteres                       |
| Moderering           | Relæpolitikker, mute-lister i klienter, etiketter og anmeldelser                                    | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser |
| Navne                | Valgfrie `name@domain`-identifikatorer kontrolleret over HTTPS                                      | `.bso`- og `.eth`-navne, der oversættes til nøgler                           |
| Browser              | WebSocket-klient til relæer                                                                         | Peer-to-peer-node i en almindelig browserfane                                |
| Vigtigste afvejning  | Flytbar identitet og bred replikering, men relæafhængig tilgængelighed og politik                   | Mindre relæafhængighed, men gammelt indhold er ikke garanteret for evigt     |
