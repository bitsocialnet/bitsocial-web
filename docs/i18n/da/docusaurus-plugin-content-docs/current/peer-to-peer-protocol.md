---
title: Peer-to-Peer protokol
description: Hvordan Bitsocial bruger public-key-adressering og peer-to-peer pubsub til at levere serverløse sociale medier.
---

# Peer-to-Peer protokol

Bitsocial bruger ikke en blockchain, en føderationsserver eller en centraliseret backend. I stedet kombinerer det to ideer - **offentlig nøglebaseret adressering** og **peer-to-peer pubsub** - for at lade enhver være vært for et fællesskab fra forbrugerhardware, mens brugere læser og poster uden konti på nogen virksomhedskontrolleret tjeneste.

## De to problemer

Et decentraliseret socialt netværk skal besvare to spørgsmål:

1. **Data** — hvordan gemmer og serverer du verdens sociale indhold uden en central database?
2. **Spam** — hvordan forhindrer du misbrug, mens du holder netværket frit at bruge?

Bitsocial løser dataproblemet ved at springe blockchain helt over: sociale medier behøver ikke global transaktionsbestilling eller permanent tilgængelighed af alle gamle indlæg. Det løser spam-problemet ved at lade hvert fællesskab køre sin egen anti-spam-udfordring over peer-to-peer-netværket.

---

## Offentlig nøgle-baseret adressering

I BitTorrent bliver en fils hash dens adresse (_indholdsbaseret adressering_). Bitsocial bruger en lignende idé med offentlige nøgler: hashen af ​​et fællesskabs offentlige nøgle bliver dets netværksadresse.

```mermaid
graph LR
    K["🔑 Community keypair"] --> H["#️⃣ Hash of public key"]
    H --> A["📍 Network address"]
    A --> D["🌐 DHT lookup"]
    D --> C["📄 Latest community content"]
```

Enhver peer på netværket kan udføre en DHT-forespørgsel (distributed hash table) for den pågældende adresse og hente fællesskabets seneste tilstand. Hver gang indholdet opdateres, stiger dets versionsnummer. Netværket beholder kun den nyeste version - der er ingen grund til at bevare enhver historisk tilstand, hvilket er det, der gør denne tilgang let i forhold til en blockchain.

### Hvad bliver gemt på adressen

Fællesskabsadressen indeholder ikke direkte indhold af indlæg. I stedet gemmer den en liste over indholdsidentifikatorer - hashes, der peger på de faktiske data. Klienten henter derefter hvert stykke indhold gennem DHT- eller tracker-stil opslag.

```mermaid
graph TD
    A["📍 Community address"] --> M["📋 Metadata<br/>(title, description, rules,<br/>moderator list, challenge config)"]
    A --> P["🔗 Content pointers<br/>(hashes of latest posts)"]
    P --> P1["📝 Post 1 content"]
    P --> P2["📝 Post 2 content"]
    P --> P3["📝 Post 3 content"]
```

Mindst én peer har altid dataene: fællesskabsoperatørens node. Hvis fællesskabet er populært, vil mange andre jævnaldrende også have det, og belastningen fordeler sig selv, på samme måde som populære torrents er hurtigere at downloade.

---

## Peer-to-peer pubsub

Pubsub (publish-subscribe) er et meddelelsesmønster, hvor jævnaldrende abonnerer på et emne og modtager hver meddelelse, der er publiceret til det emne. Bitsocial bruger et peer-to-peer pubsub-netværk - alle kan publicere, alle kan abonnere, og der er ingen central meddelelsesmægler.

For at udgive et indlæg til et fællesskab, udgiver en bruger en besked, hvis emne svarer til fællesskabets offentlige nøgle. Community-operatørens node opfanger det, validerer det og - hvis det består anti-spam-udfordringen - inkluderer det i den næste indholdsopdatering.

---

## Anti-spam: udfordringer over pubsub

Et åbent pubsub-netværk er sårbart over for spam-oversvømmelser. Bitsocial løser dette ved at kræve, at udgivere gennemfører en **udfordring**, før deres indhold accepteres.

Udfordringssystemet er fleksibelt: hver fællesskabsoperatør konfigurerer deres egen politik. Valgmuligheder omfatter:

| Udfordringstype | Sådan fungerer det |
| ----------------- | ------------------------------------------------- |
| **Captcha** | Visuelt eller interaktivt puslespil præsenteret i appen |
| **Satsbegrænsende** | Begræns indlæg pr. tidsvindue pr. identitet |
| **Token gate** | Kræv bevis for balance for et specifikt token |
| **Betaling** | Kræv en lille betaling pr. post |
| **Tilladelsesliste** | Kun forhåndsgodkendte identiteter kan sende |
| **Brugerdefineret kode** | Enhver politik, der kan udtrykkes i kode |

Peers, der videresender for mange mislykkede udfordringsforsøg, bliver blokeret fra pubsub-emnet, hvilket forhindrer denial-of-service-angreb på netværkslaget.

---

## Livscyklus: læse et fællesskab

Dette er, hvad der sker, når en bruger åbner appen og ser et fællesskabs seneste indlæg.

```mermaid
sequenceDiagram
    participant User as 👤 User app
    participant DHT as 🌐 DHT network
    participant Node as 🖥️ Community node

    User->>DHT: Query community address
    Note over DHT: Distributed lookup<br/>across network peers
    DHT-->>User: Return latest content pointers + metadata

    User->>DHT: Fetch post content by hash
    DHT-->>User: Return post data
    Note over User: Render posts in<br/>familiar social UI

    Note over User,Node: Multiple community queries<br/>run concurrently
```

**Trin for trin:**

1. Brugeren åbner appen og ser en social grænseflade.
2. Klienten tilslutter sig peer-to-peer-netværket og laver en DHT-forespørgsel for hvert fællesskab brugeren
følger. Forespørgsler tager et par sekunder hver, men kører samtidigt.
3. Hver forespørgsel returnerer fællesskabets seneste indholdspointer og metadata (titel, beskrivelse,
moderatorliste, udfordringskonfiguration).
4. Klienten henter det faktiske indlægsindhold ved hjælp af disse pointere og gengiver derefter alt i en
velkendte sociale grænseflader.

---

## Livscyklus: udgivelse af et indlæg

Udgivelse involverer et udfordring-svar-håndtryk over pubsub, før stillingen accepteres.

```mermaid
sequenceDiagram
    participant User as 👤 User app
    participant Pubsub as 📡 Pubsub network
    participant Node as 🖥️ Community node

    Note over User: Generate keypair<br/>(if first post)

    User->>Pubsub: Join community topic
    User->>Pubsub: Request challenge
    Pubsub->>Node: Relay challenge request

    Node-->>Pubsub: Send challenge (e.g. captcha)
    Pubsub-->>User: Relay challenge to user

    Note over User: User completes challenge

    User->>Pubsub: Submit post + challenge answer
    Pubsub->>Node: Relay post + answer

    Note over Node: Validate answer

    Node-->>Pubsub: Broadcast result (accepted/rejected)
    Pubsub-->>User: Relay result

    Note over Node: Update community content<br/>at public-key address

    Note over User,Node: Other readers receive<br/>the update within minutes
```

**Trin for trin:**

1. Appen genererer et nøglepar til brugeren, hvis de ikke har et endnu.
2. Brugeren skriver et indlæg til et fællesskab.
3. Klienten tilslutter sig pubsub-emnet for det pågældende fællesskab (nøglet til fællesskabets offentlige nøgle).
4. Klienten anmoder om en udfordring over pubsub.
5. Community-operatørens node sender en udfordring tilbage (for eksempel en captcha).
6. Brugeren fuldfører udfordringen.
7. Klienten indsender indlægget sammen med udfordringsbesvarelsen over pubsub.
8. Community-operatørens node validerer svaret. Hvis det er korrekt, accepteres indlægget.
9. Noden udsender resultatet over pubsub, så netværkskammerater ved, at de skal fortsætte med at videresende
beskeder fra denne bruger.
10. Noden opdaterer fællesskabets indhold på dens offentlige nøgleadresse.
11. Inden for et par minutter modtager hver læser af fællesskabet opdateringen.

---

## Arkitektur oversigt

Det fulde system har tre lag, der arbejder sammen:

```mermaid
graph TB
    subgraph Apps ["App layer"]
        A1["🖥️ Desktop app"]
        A2["🌐 Web app"]
        A3["📱 Mobile app"]
    end

    subgraph Protocol ["Protocol layer"]
        PK["🔑 Public-key addressing"]
        PS["📡 Peer-to-peer pubsub"]
        CH["🛡️ Challenge system"]
    end

    subgraph Network ["Network layer"]
        DHT["🗂️ DHT<br/>(content discovery)"]
        GS["💬 Gossipsub<br/>(real-time messaging)"]
        TR["📦 Content transfer<br/>(data exchange)"]
    end

    A1 & A2 & A3 --> PK & PS & CH
    PK --> DHT
    PS --> GS
    CH --> GS
    PK --> TR
```

| Lag | Rolle |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **App** | Brugergrænseflade. Der kan eksistere flere apps, hver med sit eget design, som alle deler de samme fællesskaber og identiteter.                       |
| **Protokol** | Definerer, hvordan fællesskaber adresseres, hvordan indlæg publiceres, og hvordan spam forhindres.                                                |
| **Netværk** | Den underliggende peer-to-peer-infrastruktur: DHT til opdagelse, sladder til meddelelser i realtid og indholdsoverførsel til dataudveksling. |

---

## Fortrolighed: fjernelse af link mellem forfattere og IP-adresser

Når en bruger udgiver et indlæg, **krypteres indholdet med fællesskabsoperatørens offentlige nøgle**, før det kommer ind på pubsub-netværket. Dette betyder, at selvom netværksobservatører kan se, at en peer har offentliggjort _noget_, kan de ikke bestemme:

- hvad indholdet siger
- hvilken forfatteridentitet offentliggjort det

Dette svarer til, hvordan BitTorrent gør det muligt at finde ud af, hvilke IP'er der starter en torrent, men ikke hvem der oprindeligt oprettede den. Krypteringslaget tilføjer en ekstra privatlivsgaranti oven i den basislinje.

---

## Browserbrugere og gateways

Browsere kan ikke tilslutte sig peer-to-peer-netværk direkte. Bitsocial håndterer dette med **HTTP-gateways**, der videresender data mellem P2P-netværket og browserklienter. Disse gateways:

- kan drives af alle
- kræver ikke brugerkonti eller betalinger
- ikke opnå forældremyndighed over brugeridentiteter eller fællesskaber
- kan skiftes ud uden at miste data

Dette holder browseroplevelsen problemfri, samtidig med at den decentraliserede arkitektur nedenunder bevares.

---

## Hvorfor ikke en blockchain?

Blockchains løser problemet med dobbeltforbrug: de skal kende den nøjagtige rækkefølge af hver transaktion for at forhindre nogen i at bruge den samme mønt to gange.

Sociale medier har ikke et problem med dobbeltforbrug. Det er ligegyldigt, om indlæg A blev publiceret et millisekund før indlæg B, og gamle indlæg behøver ikke at være permanent tilgængelige på hver node.

Ved at springe blockchain over undgår Bitsocial:

- **gasgebyrer** — opslag er gratis
- **gennemstrømningsgrænser** — ingen blokstørrelse eller blokeringstidsflaskehals
- **storage bloat** — noder beholder kun det, de har brug for
- **konsensusoverhead** — ingen minearbejdere, validatorer eller indsats påkrævet

Afvejningen er, at Bitsocial ikke garanterer permanent tilgængelighed af gammelt indhold. Men for sociale medier er det en acceptabel afvejning: Community-operatørens node holder dataene, populært indhold spredes på tværs af mange jævnaldrende, og meget gamle indlæg falmer naturligt - på samme måde som de gør på alle sociale platforme.

## Hvorfor ikke forbund?

Fødererede netværk (som e-mail eller ActivityPub-baserede platforme) forbedrer centraliseringen, men har stadig strukturelle begrænsninger:

- **Serverafhængighed** – hvert fællesskab har brug for en server med et domæne, TLS og løbende
opretholdelse
- **Administratortillid** — serveradministratoren har fuld kontrol over brugerkonti og indhold
- **Fragmentering** — flytning mellem servere betyder ofte at miste følgere, historie eller identitet
- **Omkostninger** — nogen skal betale for hosting, hvilket skaber pres mod konsolidering

Bitsocials peer-to-peer tilgang fjerner serveren helt fra ligningen. En community node kan køre på en bærbar computer, en Raspberry Pi eller en billig VPS. Operatøren kontrollerer moderationspolitikken, men kan ikke beslaglægge brugeridentiteter, fordi identiteter er nøglepar-kontrollerede, ikke server-tildelte.

---

## Oversigt

Bitsocial er bygget på to primitiver: public-key-baseret adressering til indholdsopdagelse og peer-to-peer pubsub til realtidskommunikation. Sammen skaber de et socialt netværk, hvor:

- fællesskaber identificeres ved kryptografiske nøgler, ikke domænenavne
- indhold spredes på tværs af jævnaldrende som en torrent, ikke serveret fra en enkelt database
- spam-resistens er lokal for hvert fællesskab, ikke påtvunget af en platform
- brugere ejer deres identiteter gennem nøglepar, ikke gennem tilbagekaldelige konti
- hele systemet kører uden servere, blockchains eller platformsgebyrer
