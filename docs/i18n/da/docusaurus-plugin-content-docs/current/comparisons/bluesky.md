---
title: Bitsocial og Bluesky
description: Hvordan Bluesky og AT Protocol, med personlige dataservere, relæer og AppViews, adskiller sig fra Bitsocials peer-to-peer-fællesskaber.
---

# Bitsocial og Bluesky

[Bluesky](https://bsky.app/) er en mikroblogging-app bygget på [AT Protocol](https://atproto.com/),
som Bluesky Social PBC har designet. Protokollen deler et socialt netværk op i separate tjenester:
personlige dataservere hoster konti, relæer samler dem i én strøm, og AppViews indekserer den strøm
til de tidslinjer og tråde, folk ser. Dokumentationen beskriver kontodata som lagret på
værtsservere, "i modsætning til en peer-to-peer-model"
([oversigt](https://atproto.com/guides/overview)).

## Sådan fungerer AT Protocol

- **Repositories på servere.** Hvert indlæg, like eller follow er en registrering i forfatterens
  signerede repository, der hostes på en personlig dataserver (PDS). Bluesky driver
  standardserverne, og alle kan hoste deres egen.
- **Relæer.** Relæer abonnerer på hver PDS og genudsender ændringerne som én strøm, firehosen. Siden
  en protokolopdatering i 2025 arkiverer de ikke længere hvert repository, hvilket har gjort dem
  meget billigere at drive ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** En AppView indekserer hele firehosen og leverer tidslinjer, komplette svartråde,
  optællinger og søgning. Det er den mest ressourcekrævende del af netværket.
- **Identitet.** En konto er en DID: som regel `did:plc`, registreret i ét globalt register, eller
  `did:web`, knyttet til et domæne. DID-dokumentet angiver kontoens handle, signeringsnøgle og
  nuværende server. PDS'en har signeringsnøglen; `did:plc` lader også brugere have rotationsnøgler,
  så de kan flytte uden hjælp fra den gamle vært
  ([identitetsguide](https://atproto.com/guides/identity)).
- **Handles.** Handles er DNS-navne, som `alice.bsky.social` eller et domæne, brugeren ejer, og de
  verificeres mod DID'en.
- **Moderering.** Hosting og rækkevidde er separate lag. Alle kan køre en labeler, og brugere kan
  kombinere flere ([modereringsguide](https://atproto.com/guides/moderation)), men Bluesky-appen
  anvender altid Blueskys egen moderering. Forfattere kan begrænse, hvem der må svare på deres
  indlæg, og skjule svar.

## Hvor de adskiller sig

### Servere eller peers

Blueskys data ligger på servere: en PDS hoster hver konto, relæer bærer firehosen, og AppViews
leverer det, klienterne viser. En browser er en HTTP-klient til de tjenester, aldrig en peer. I
Bitsocial leveres indholdet af fællesskabets node og de peers, der læser det, og en webapp kan køre
sin egen peer-to-peer-node. Se [Peer-to-peer i browseren](/browser-p2p/).

### Et globalt overblik eller fællesskaber

AT Protocol er designet til ét globalt overblik: en AppView ser hvert svar, så tråde og søgning er
komplette. Bitsocial har intet globalt indeks; hvert fællesskab publicerer sin egen tilstand, og
apps bygger opdagelse oven på det. Se [Opdagelse af indhold](/content-discovery/).

Bluesky har i dag intet fællesskabsobjekt for offentlige indlæg. I juni 2026
[annoncerede det native fællesskaber](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k),
hvor det på nogle privatlivsniveauer kræver godkendelse at slå op; i oktober 2026 var de endnu ikke
lanceret. I Bitsocial er fællesskaber kerneobjektet, og et fællesskabs node accepterer eller afviser
indlæg.

### Spamkontrol

Bluesky håndterer spam med hastighedsgrænser på sine servere, begrænsninger for nye værter ved
relæet, automatisk detektion, menneskelig gennemgang og etiketter, og forfattere kan begrænse svar.
Der er ingen adgangskontrol på fællesskabsniveau, der afgør, hvad et indlæg skal igennem, før det
accepteres. I Bitsocial vælger hvert fællesskab sin egen udfordring. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Hvem har nøglerne

Konti på Blueskys egne servere logger ind med en adgangskode, og de servere opbevarer deres
signeringsnøgler på kontoens vegne ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Ifølge en
protokolingeniør hos Bluesky
[har de fleste konti ingen uafhængigt kontrollerede rotationsnøgler](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
En Bitsocial-identitet er et nøglepar, som brugerens app genererer og opbevarer.

### Drift af infrastrukturen

En personlig server er billig: [reference-PDS'en](https://github.com/bluesky-social/pds) anbefaler 1
GB RAM til op til 20 brugere. En uafhængig AppView for hele netværket er et stort projekt; én, der
blev bygget i 2025,
[kostede omkring 200 dollar om måneden](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), mest til 16 TB
lagerplads. Bitsocial har intet globalt indeks at replikere, og en fællesskabsnode kører på
almindelig forbrugerhardware.

## Sammenligning

| Spørgsmål            | Bluesky (AT Protocol)                                                          | Bitsocial                                                                         |
| -------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Kategori             | Fødererede servere med et globalt indeks                                       | Peer-to-peer-fællesskabsnetværk                                                   |
| Identitet            | DID, hvor signeringsnøglerne som regel ligger hos serveren                     | Ed25519-nøglepar til brugere og fællesskaber                                      |
| Hvor indlæg ligger   | Forfatterens repository på en personlig dataserver                             | Fællesskabsejerens node og de peers, der læser og seeder det                      |
| Hvem holder det oppe | PDS-værter, relæer og AppViews, som standard drevet af Bluesky                 | Fællesskabsejerens node plus hjælpeseedere                                        |
| Fællesskaber         | Endnu ingen for offentlige indlæg (annonceret i 2026)                          | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                 |
| Spamkontrol          | Hastighedsgrænser på servere, automatisk detektion, etiketter, svarkontrol     | Hvert fællesskabs udfordring, før et indlæg accepteres                            |
| Moderering           | Labelere, der kan kombineres; Bluesky-appen anvender altid Blueskys moderering | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser      |
| Navne                | DNS-handles verificeret mod DID'en                                             | `.bso`- og `.eth`-navne, der oversættes til nøgler                                |
| Browser              | HTTP-klient til en PDS og en AppView                                           | Peer-to-peer-node i en almindelig browserfane                                     |
| Vigtigste afvejning  | Komplette globale tråde og søgning, men aggregeringen kræver tunge servere     | Intet tungt globalt indeks, men heller intet komplet overblik over hele netværket |
