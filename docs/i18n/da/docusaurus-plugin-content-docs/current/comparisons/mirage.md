---
title: Bitsocial og Mirage
description: Hvordan Mirage, et forum i Reddit-stil på sin egen Cosmos SDK-blockchain, adskiller sig fra Bitsocial og dets Reddit-agtige app Seedit.
---

# Bitsocial og Mirage

[Mirage](https://mirage.foundation/) er et diskussionsnetværk i Reddit-stil med fællesskaber,
trådede indlæg og stemmer. I stedet for en virksomheds database kører det på sin egen blockchain, en
Cosmos SDK-kæde med CometBFT-konsensus. Bitsocials nærmeste produkt er [Seedit](/apps/seedit/), en
app i Reddit-stil på Bitsocial-netværket, så sammenligningen handler mest om, hvordan de hver især
hoster, ejer og modererer fællesskaber.

## Sådan fungerer Mirage

- **Noder.** En Mirage-node er én Docker-container med en validator, en PostgreSQL-database, en
  indekser, en HTTP-API og webfrontenden. Hver node er også en validator. Det kræver en
  Ubuntu-server på amd64 og 10.000.000 MIRAGE-tokens på operatørens konto at køre en, ifølge
  [udrulningsguiden](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Opslag.** Browseren signerer hver handling med brugerens secp256k1-nøgle, og gratisbrugere
  beregner desuden et lille proof-of-work. Noden pakker handlingen ind i en kædetransaktion og
  betaler gebyret.
- **Læsning.** Hver nodes indekser kopierer kædedata til sin egen database og leverer feeds via en
  HTTP-API. Noder beholder omkring en uges blokke, så den langsigtede indlægshistorik ligger i hver
  nodes database, og en ny node starter uden historikken fra før sit synkroniseringspunkt.
- **Konti.** En konto er en nøgle afledt af en seed-sætning på 12 ord, og den samme seed virker på
  enhver node. Brugernavne registreres på kæden og er unikke på tværs af netværket.
- **Fællesskaber.** Ethvert gyldigt navn er allerede et fællesskab, og ingen ejer det. Betalte
  kuratorhold på op til ti brugere vedligeholder hver især en modereret visning af et fællesskab;
  læserne vælger et holds visning, nodens standardvisning eller en ucensureret visning. Se
  [Mirages FAQ](https://mirage.talk/faq).
- **Token.** MIRAGE-tokenet betaler for abonnementer, belønner forfattere og noder og giver
  validatorer vægt i styringen. Abonnenter springer proof-of-work over og får højere grænser.

## Hvor de adskiller sig

### Hvem ejer et fællesskab

I Seedit har den, der opretter et fællesskab, dets nøglepar, kører dets node eller uddelegerer
driften og modererer det. I Mirage ejer ingen et fællesskab: konkurrerende kuratorhold tilbyder
modererede visninger af det samme navn, og standardvisningen er det hold, som flest betalende
abonnenter har valgt.

### Spamkontrol

Mirage anvender én regel på hele netværket: gratisbrugere betaler med proof-of-work, hvis
sværhedsgrad tilpasses den indgående mængde, og abonnenter springer det over. I Bitsocial vælger
hvert fællesskab sin egen udfordring, fra captchaer over tilladelseslister til betalinger. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Infrastruktur

Mirage kræver en blockchain. Validatorer opnår konsensus om hver handling, og hver node kører en
komplet serverstak og skal have en stor token-stake. Bitsocial har ingen kæde: en fællesskabsnode
kører på forbrugerhardware fra desktopappen eller `bitsocial-cli`, og læsere kan hjælpe med at dele
indhold.

### Kontrol over hele netværket

Mirage har onchain-styring vægtet efter validatorernes stake. Den kan ændre sværhedsgrad, priser og
tokenudstedelse, præge eller brænde tokens og udpege administratorer, hvis sletninger
referenceindekseren anvender på ethvert indlæg. Kædens kode giver også styringen mulighed for at
[slette konti](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
og
[sende tokens fra enhver adresse](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
I oktober 2026 producerede fire validatorer kædens blokke, og projektets egne runbooks styrede alle
fire.

Bitsocial har ingen administrator på protokolniveau. Fællesskabsejere modererer deres egne
fællesskaber, og apps vælger, hvad de viser. Se
[Lokal moderering, ikke globale forbud](/local-moderation/).

### Browser

Mirages webklient er en HTTP-klient til en node: browseren signerer handlinger, men tilslutter sig
ikke noget peer-to-peer-netværk. Bitsocial-apps kan køre en peer-to-peer-node i browserfanen. Se
[Peer-to-peer i browseren](/browser-p2p/).

## Sammenligning

| Spørgsmål            | Mirage                                                                                                            | Bitsocial                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Kategori             | Forum på sin egen blockchain (Cosmos SDK)                                                                         | Peer-to-peer-fællesskabsnetværk                                                                                |
| Identitet            | secp256k1-nøgle fra en seed på 12 ord, med et onchain-brugernavn                                                  | Ed25519-nøglepar til brugere og fællesskaber                                                                   |
| Hvor indlæg ligger   | Kædetransaktioner og derefter hver nodes PostgreSQL-database                                                      | Fællesskabsejerens node og de peers, der læser og seeder det                                                   |
| Hvem holder det oppe | Validatornoder, der hver har 10.000.000 MIRAGE                                                                    | Fællesskabsejerens node plus hjælpeseedere                                                                     |
| Fællesskaber         | Ejerløse navne med konkurrerende betalte kuratorhold                                                              | Ejet af et nøglepar; ejerens node accepterer eller afviser indlæg                                              |
| Spamkontrol          | Netværksdækkende proof-of-work; abonnenter springer det over                                                      | Hvert fællesskabs udfordring, før et indlæg accepteres                                                         |
| Moderering           | Kuratorholdenes visninger, personlige filtre, administratorer udpeget af styringen                                | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                                   |
| Økonomi              | MIRAGE-token til abonnementer, belønninger og validator-stake                                                     | Ingen i protokollen; en udfordring kan kræve en betaling eller en token                                        |
| Browser              | HTTP-klient til en node                                                                                           | Peer-to-peer-node i en almindelig browserfane                                                                  |
| Vigtigste afvejning  | Én fælles, ordnet tilstand og nem tilmelding, men et lille validatorsæt og styringsbeføjelser over hele netværket | Ingen kæde eller stake nødvendig, men ingen global rækkefølge, og gammelt indhold er ikke garanteret for evigt |
