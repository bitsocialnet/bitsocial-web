---
title: Bitsocial og sosiale nettverk på blokkjede
description: Hvordan Lens, DeSo og Steem legger sosiale data eller regler på en blokkjede, og hvorfor Bitsocial ikke bruker en.
---

# Bitsocial og sosiale nettverk på blokkjede

Lens, DeSo og Steem legger alle sosial aktivitet på en blokkjede. Kontoer, følginger, innlegg eller
reglene rundt dem blir transaksjoner som validatorer ordner og lagrer. Bitsocial bruker ingen
blokkjede: sosiale medier trenger ikke en global rekkefølge for hvert innlegg, så Bitsocial dropper
konsensus, gass og staking. Se [Peer-to-peer-protokoll](/peer-to-peer-protocol/) for begrunnelsen.

## Hva de har til felles

- **Noen betaler for hver skriving.** Lens krever gass, som apper kan sponse; DeSo krever et gebyr
  for hver handling; Steem rasjonerer handlinger etter stakede tokens.
- **Kjeden setter én spampolicy for alle.** Gebyrer, stake og kontokostnader gjelder i hele
  nettverket i stedet for å velges av hvert fellesskap.
- **Data på kjeden er permanente.** Apper kan skjule innhold, men de kan ikke fjerne det fra kjeden.
- **Nettlesere er API-klienter.** Webapper signerer transaksjoner og leser gjennom en node, en
  indekserer eller et API som noen andre driver.

## Lens

[Lens](https://lens.xyz/) kjører på Lens Chain, et lag 2-nettverk for Ethereum bygget med ZKsyncs ZK
Stack, som bruker Avail for datatilgjengelighet. Mask Network har
[forvaltet Lens siden januar 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **På kjeden:** kontoer er smarte kontrakter, brukernavn er NFT-er i navnerom, og grafer, grupper,
  feeder og reglene deres er også kontrakter.
- **Utenfor kjeden:** teksten og mediene i et innlegg ligger i en JSON-fil på en URI, vanligvis på
  Grove, Lens' lagringstjeneste foran IPFS. Reaksjoner og bokmerker holdes av Lens API, og apper
  leser gjennom det API-et.
- **Spam og porter:** transaksjoner krever gass i GHO, som apper kan sponse med frekvensgrenser.
  Regler for feeder og grupper kan kreve tokenbeholdning eller betalinger.
- **Drift av kjeden:** [L2BEAT](https://l2beat.com/scaling/projects/lens) vurderer Lens Chain som et
  Stage 0-validium med en sentralisert operatør som kan nekte å ta med transaksjoner.

## DeSo

[DeSo](https://docs.deso.org/) er en lag 1-blokkjede bygget for sosiale apper. Den gikk fra proof of
work til proof of stake i juli 2024.

- **På kjeden:** profiler, innlegg, likes, følginger og direktemeldinger er alle transaksjoner som
  lagres av hver fullnode. Bilder og video ligger utenfor kjeden; referansenoden bruker Google Cloud
  Storage og Cloudflare Stream.
- **Spam:** hver handling koster et gebyr i DESO. Nye brukere får vanligvis start-DESO fra en node
  etter telefonverifisering.
- **Moderering:** hver node bestemmer hva den viser ved svartelisting eller grålisting, men
  [innholdet blir liggende på kjeden](https://docs.deso.org/deso-blockchain/content-moderation).
- **Fellesskap:** dokumentasjonen beskriver ingen primitiv for fellesskap eller forum; et
  «fellesskap» er en feed som en app kuraterer.
- **Drift av en node:** validatorer trenger minst 32 GB RAM og 200 GB disk, ifølge
  [validatorguiden](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) er en sosial blokkjede som betaler forfattere og kuratorer i tokens, med
[Steemit](https://steemit.com/) som hovedapp for blogging. Hive skilte seg fra Steem i 2020; ifølge
[Hives whitepaper](https://hive.io/whitepaper.pdf) kom forken etter salget av Steemit Inc. til
Justin Sun.

- **På kjeden:** tekstinnlegg, kommentarer, stemmer og redigeringshistorikken deres, ordnet av 21
  valgte witnesses som produserer en blokk hvert tredje sekund. Bilder ligger utenfor kjeden.
- **Spam:** handlinger bruker Resource Credits, som vokser med stakede STEEM. Det koster STEEM å
  opprette en konto; Steemit betaler for brukere som verifiserer e-postadresse og telefonnummer.
- **Fellesskap:** de er
  [tilpassede operasjoner som tolkes av en indekserer](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  utenfor konsensus. Moderatorer kan dempe innlegg, noe som skjuler dem i apper, men lar dem bli
  liggende på kjeden.
- **Belønninger:** inflasjon finansierer belønningene, og stemmer vektet etter stake avgjør hvordan
  de fordeles, så store innehavere former hva som får oppmerksomhet.

## Sammenligning

| Spørsmål            | Lens                                                                               | DeSo                                                                         | Steem                                                        | Bitsocial                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Kjede               | Lag 2 for Ethereum (ZK Stack-validium)                                             | Eget lag 1, proof of stake                                                   | Egen kjede, delegated proof of stake                         | Ingen                                                                                                   |
| Innleggsinnhold     | JSON utenfor kjeden, vanligvis på Grove                                            | Tekst på kjeden; media utenfor                                               | Tekst på kjeden; bilder utenfor                              | På noden til fellesskapets eier og hos peerne som leser og seeder det                                   |
| Identitet           | Smartkontraktkonto; brukernavn som NFT-er                                          | Nøkkelpar med en profil på kjeden                                            | Navngitt kjedekonto med nøkler i flere nivåer                | Ed25519-nøkkelpar for brukere og fellesskap                                                             |
| Fellesskap          | Grupper og feeder som kontrakter med regler                                        | Ingen primitiv for fellesskap                                                | Fellesskap tolket av en indekserer utenfor konsensus         | Førsteklasses objekter der noden godtar eller avviser innlegg                                           |
| Spamkontroll        | Gass (ofte sponset), regler for tokens eller betaling                              | Gebyr for hver handling; startmidler etter telefonsjekk                      | Resource Credits fra stake; betalt kontoopprettelse          | Hvert fellesskaps utfordring før et innlegg godtas                                                      |
| Moderering          | Gruppeadministratorer, regler på kjeden, skjuling på API-nivå                      | Hver node filtrerer hva den viser                                            | Demping i fellesskap, stakevektede nedstemmer, appfiltre     | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                                   |
| Drift               | Kjedeoperatør pluss Lens API og Grove                                              | Validatorer med minst 32 GB RAM                                              | Valgte witnesses pluss API- og indekseringsnoder             | En fellesskapsnode på forbrukermaskinvare, pluss seedere som hjelper til                                |
| Viktigste avveining | Programmerbare regler på kjeden, men innhold og lesing avhenger av Lens' tjenester | Åpen datapool, men hver handling koster et gebyr og blir liggende for alltid | Innebygde belønninger, men stake former synlighet og styring | Ingen gebyrer eller stake, men ingen global rekkefølge, og gammelt innhold er ikke garantert for alltid |
