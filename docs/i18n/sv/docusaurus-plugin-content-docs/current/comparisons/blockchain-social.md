---
title: Bitsocial och blockkedjebaserade sociala nätverk
description: Hur Lens, DeSo och Steem lägger social data eller regler på en blockkedja, och varför Bitsocial inte använder någon.
---

# Bitsocial och blockkedjebaserade sociala nätverk

Lens, DeSo och Steem lägger alla social aktivitet på en blockkedja. Konton, följningar, inlägg eller
reglerna runt dem blir transaktioner som validatorer ordnar och lagrar. Bitsocial använder ingen
blockkedja: sociala medier behöver ingen global ordning för varje inlägg, så Bitsocial hoppar över
konsensus, gas och staking. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/) för det
resonemanget.

## Vad de har gemensamt

- **Någon betalar för varje skrivning.** Lens tar ut gas, som appar kan sponsra; DeSo tar ut en
  avgift för varje handling; Steem ransonerar handlingar efter stakade tokens.
- **Kedjan sätter en gemensam spampolicy för alla.** Avgifter, stake och kontokostnader gäller i
  hela nätverket i stället för att väljas av varje community.
- **Poster på kedjan är permanenta.** Appar kan dölja innehåll, men de kan inte ta bort det från
  kedjan.
- **Webbläsare är API-klienter.** Webbappar signerar transaktioner och läser via en nod, en
  indexerare eller ett API som någon annan driver.

## Lens

[Lens](https://lens.xyz/) körs på Lens Chain, ett lager 2 för Ethereum som byggts med ZKsyncs ZK
Stack och använder Avail för datatillgänglighet. Mask Network har
[förvaltat Lens sedan januari 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **På kedjan:** konton är smarta kontrakt, användarnamn är NFT:er inom namnrymder, och grafer,
  grupper, flöden och deras regler är också kontrakt.
- **Utanför kedjan:** ett inläggs text och media finns i en JSON-fil på en URI, oftast på Grove,
  Lens lagringstjänst framför IPFS. Reaktioner och bokmärken hålls av Lens API, och appar läser via
  det API:et.
- **Spam och spärrar:** transaktioner kräver gas i GHO, som appar kan sponsra med
  frekvensbegränsningar. Regler för flöden och grupper kan kräva tokeninnehav eller betalningar.
- **Kedjans drift:** [L2BEAT](https://l2beat.com/scaling/projects/lens) klassar Lens Chain som en
  validium i Stage 0 med en centraliserad operatör som kan vägra att ta med transaktioner.

## DeSo

[DeSo](https://docs.deso.org/) är en lager 1-blockkedja byggd för sociala appar. Den gick från proof
of work till proof of stake i juli 2024.

- **På kedjan:** profiler, inlägg, gillamarkeringar, följningar och direktmeddelanden är alla
  transaktioner som lagras av varje fullständig nod. Bilder och video lagras utanför kedjan;
  referensnoden använder Google Cloud Storage och Cloudflare Stream.
- **Spam:** varje handling kostar en avgift i DESO. Nya användare får oftast start-DESO från en nod
  efter telefonverifiering.
- **Moderering:** varje nod bestämmer vad den visar genom svartlistning eller grålistning, men
  [innehållet ligger kvar på kedjan](https://docs.deso.org/deso-blockchain/content-moderation).
- **Communityer:** dokumentationen beskriver ingen primitiv för communityer eller forum; en
  ”community” är ett flöde som en app kurerar.
- **Att driva en nod:** validatorer behöver minst 32 GB RAM och 200 GB disk, enligt
  [validatorguiden](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) är en social blockkedja som betalar författare och kuratorer i tokens,
med [Steemit](https://steemit.com/) som sin främsta bloggapp. Hive bröt sig ur Steem 2020; enligt
[Hives whitepaper](https://hive.io/whitepaper.pdf) följde forken på försäljningen av Steemit Inc.
till Justin Sun.

- **På kedjan:** textinlägg, kommentarer, röster och deras redigeringshistorik, ordnade av 21 valda
  witnesses som producerar ett block var tredje sekund. Bilder lagras utanför kedjan.
- **Spam:** handlingar förbrukar Resource Credits, som växer med stakade STEEM. Att skapa ett konto
  kostar STEEM; Steemit betalar det åt användare som verifierar en e-postadress och ett
  telefonnummer.
- **Communityer:** de är
  [anpassade operationer som tolkas av en indexerare](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  utanför konsensus. Moderatorer kan tysta inlägg, vilket döljer dem i appar men lämnar dem kvar på
  kedjan.
- **Belöningar:** inflation finansierar belöningarna, och röster viktade efter stake avgör hur de
  fördelas, så stora innehavare styr vad som får uppmärksamhet.

## Jämförelse

| Fråga                  | Lens                                                                             | DeSo                                                                          | Steem                                                          | Bitsocial                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Kedja                  | Lager 2 för Ethereum (validium med ZK Stack)                                     | Eget lager 1, proof of stake                                                  | Egen kedja, delegated proof of stake                           | Ingen                                                                                               |
| Inläggens innehåll     | JSON utanför kedjan, oftast på Grove                                             | Text på kedjan; media utanför                                                 | Text på kedjan; bilder utanför                                 | På communityägarens nod och hos de peers som läser och seedar den                                   |
| Identitet              | Konto som smart kontrakt; användarnamn som NFT:er                                | Nyckelpar med en profil på kedjan                                             | Namngivet kedjekonto med nycklar i flera nivåer                | Ed25519-nyckelpar för användare och communityer                                                     |
| Communityer            | Grupper och flöden som kontrakt med regler                                       | Ingen community-primitiv                                                      | Communityer som tolkas av en indexerare utanför konsensus      | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                                       |
| Spamskydd              | Gas (ofta sponsrad), regler för tokens eller betalning                           | Avgift för varje handling; startmedel efter telefonkontroll                   | Resource Credits från stake; betald kontoskapning              | Varje communitys utmaning innan ett inlägg accepteras                                               |
| Moderering             | Gruppadministratörer, regler på kedjan, döljning på API-nivå                     | Varje nod filtrerar vad den visar                                             | Tystning i communityer, stake-viktade nedröstningar, appfilter | Communityägare modererar sin community; appar väljer vad de visar                                   |
| Drift                  | Kedjeoperatör plus Lens API och Grove                                            | Validatorer med minst 32 GB RAM                                               | Valda witnesses plus API- och indexeringsnoder                 | En communitynod på vanlig konsumenthårdvara, plus hjälpande seeders                                 |
| Viktigaste avvägningen | Programmerbara regler på kedjan, men innehåll och läsning beror på Lens tjänster | Öppen datapool, men varje handling kostar en avgift och finns kvar för alltid | Inbyggda belöningar, men stake formar synlighet och styrning   | Inga avgifter eller stake, men ingen global ordning och gammalt innehåll garanteras inte för alltid |
