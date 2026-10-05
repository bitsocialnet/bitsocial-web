---
title: Bitsocial en sociale netwerken op de blockchain
description: Hoe Lens, DeSo en Steem sociale data of regels op een blockchain zetten, en waarom Bitsocial er geen gebruikt.
---

# Bitsocial en sociale netwerken op de blockchain

Lens, DeSo en Steem zetten elk sociale activiteit op een blockchain. Accounts, follows, posts of de
regels eromheen worden transacties die validators ordenen en opslaan. Bitsocial gebruikt geen
blockchain: sociale media hebben geen globale volgorde voor elke post nodig, dus Bitsocial slaat
consensus, gas en staking over. Zie [Peer-to-peer-protocol](/peer-to-peer-protocol/) voor die
redenering.

## Wat ze gemeen hebben

- **Iemand betaalt voor elke schrijfactie.** Lens rekent gas, dat apps kunnen sponsoren; DeSo rekent
  een vergoeding voor elke actie; Steem rantsoeneert acties op basis van gestakete tokens.
- **De chain legt één spambeleid op voor iedereen.** Vergoedingen, stake en accountkosten gelden voor
  het hele netwerk, in plaats van dat elke community ze zelf kiest.
- **On-chain records zijn permanent.** Apps kunnen inhoud verbergen, maar kunnen die niet van de
  chain verwijderen.
- **Browsers zijn API-clients.** Webapps ondertekenen transacties en lezen via een node, indexer of
  API die door iemand anders wordt beheerd.

## Lens

[Lens](https://lens.xyz/) draait op Lens Chain, een layer 2 van Ethereum, gebouwd met de ZK Stack van
ZKsync, die Avail gebruikt voor databeschikbaarheid. Mask Network
[beheert Lens sinds januari 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Op de chain:** accounts zijn smart contracts, gebruikersnamen zijn NFT's binnen namespaces, en
  graphs, groepen, feeds en hun regels zijn ook contracten.
- **Buiten de chain:** de tekst en media van een post staan in een JSON-bestand op een URI, meestal
  op Grove, de opslagdienst van Lens die vóór IPFS staat. Reacties en bladwijzers worden bijgehouden
  door de Lens API, en apps lezen via die API.
- **Spam en drempels:** transacties vereisen gas in GHO, dat apps met rate limits kunnen sponsoren.
  Regels voor feeds en groepen kunnen tokenbezit of betalingen vereisen.
- **Werking van de chain:** [L2BEAT](https://l2beat.com/scaling/projects/lens) beoordeelt Lens Chain
  als een Stage 0-validium met een gecentraliseerde operator die kan weigeren transacties op te
  nemen.

## DeSo

[DeSo](https://docs.deso.org/) is een layer-1-blockchain die voor sociale apps is gebouwd. In juli
2024 stapte het over van proof of work naar proof of stake.

- **Op de chain:** profielen, posts, likes, follows en privéberichten zijn allemaal transacties die
  door elke volledige node worden opgeslagen. Afbeeldingen en video worden buiten de chain gehost; de
  referentienode gebruikt Google Cloud Storage en Cloudflare Stream.
- **Spam:** voor elke actie wordt een vergoeding in DESO betaald. Nieuwe gebruikers krijgen meestal
  start-DESO van een node na verificatie van hun telefoonnummer.
- **Moderatie:** elke node bepaalt wat hij toont via blacklists of graylists, maar
  [inhoud blijft on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Communities:** de documentatie beschrijft geen primitief voor communities of forums; een
  "community" is een feed die een app samenstelt.
- **Een node draaien:** validators hebben minstens 32 GB RAM en 200 GB schijfruimte nodig, volgens de
  [validatorhandleiding](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) is een sociale blockchain die auteurs en curatoren in tokens betaalt, met
[Steemit](https://steemit.com/) als belangrijkste blogapp. Hive splitste zich in 2020 af van Steem;
volgens de [whitepaper van Hive](https://hive.io/whitepaper.pdf) volgde de fork op de verkoop van
Steemit Inc. aan Justin Sun.

- **Op de chain:** tekstposts, reacties, stemmen en hun bewerkingsgeschiedenis, geordend door 21
  gekozen witnesses die elke drie seconden een blok produceren. Afbeeldingen worden buiten de chain
  gehost.
- **Spam:** acties verbruiken Resource Credits, die meegroeien met gestakete STEEM. Een account
  aanmaken kost STEEM; Steemit betaalt dat voor gebruikers die een e-mailadres en telefoonnummer
  verifiëren.
- **Communities:** dit zijn
  [custom operations die door een indexer worden geïnterpreteerd](https://github.com/steemit/hivemind/blob/master/docs/communities.md),
  buiten de consensus. Moderators kunnen posts muten, waardoor ze in apps verborgen worden maar
  on-chain blijven.
- **Beloningen:** inflatie financiert de beloningen, en stemmen die naar stake worden gewogen bepalen
  hoe ze worden verdeeld, zodat grote houders sturen wat aandacht oplevert.

## Vergelijking

| Vraag                  | Lens                                                                                  | DeSo                                                                             | Steem                                                                 | Bitsocial                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Chain                  | Layer 2 van Ethereum (ZK Stack-validium)                                              | Eigen layer 1, proof of stake                                                    | Eigen chain, delegated proof of stake                                 | Geen                                                                                          |
| Postinhoud             | JSON buiten de chain, meestal op Grove                                                | Tekst on-chain; media buiten de chain                                            | Tekst on-chain; afbeeldingen buiten de chain                          | Op de node van de community-eigenaar en bij de peers die de community lezen en seeden         |
| Identiteit             | Smart-contract-account; gebruikersnamen als NFT                                       | Sleutelpaar met een on-chain profiel                                             | Chainaccount met een naam en gelaagde sleutels                        | Ed25519-sleutelparen voor gebruikers en communities                                           |
| Communities            | Groepen en feeds als contracten met regels                                            | Geen primitief voor communities                                                  | Communities die een indexer buiten de consensus interpreteert         | Volwaardige objecten waarvan de node posts accepteert of weigert                              |
| Spambestrijding        | Gas (vaak gesponsord), regels voor tokens of betalingen                               | Vergoeding voor elke actie; startgeld na telefooncontrole                        | Resource Credits uit stake; betaald account aanmaken                  | De challenge van elke community voordat een post wordt geaccepteerd                           |
| Moderatie              | Groepsbeheerders, on-chain regels, verbergen op API-niveau                            | Elke node filtert wat hij toont                                                  | Mutes in communities, naar stake gewogen downvotes, appfilters        | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                         |
| Infrastructuur         | Chainoperator plus de Lens API en Grove                                               | Validators met minstens 32 GB RAM                                                | Gekozen witnesses plus API- en indexernodes                           | Een communitynode op consumentenhardware, plus helpende seeders                               |
| Belangrijkste afweging | Programmeerbare on-chain regels, maar inhoud en lezen hangen af van diensten van Lens | Open datapool, maar elke actie kost een vergoeding en blijft voor altijd bestaan | Ingebouwde beloningen, maar stake bepaalt zichtbaarheid en governance | Geen kosten of stake, maar geen globale volgorde en oude inhoud is niet voor altijd verzekerd |
