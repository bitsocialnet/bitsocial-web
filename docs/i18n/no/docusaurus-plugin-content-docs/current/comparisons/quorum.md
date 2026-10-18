---
title: Bitsocial og Quorum
description: Hvordan Quorum, Quilibriums ende-til-ende-krypterte gruppemessenger med Spaces i Discord-stil, står seg mot Bitsocials offentlige peer-to-peer-fellesskap.
---

# Bitsocial og Quorum

[Quorum](https://www.quorummessenger.com/) er en gruppemessenger laget av Quilibrium Inc. på
selskapets eget nettverk, [Quilibrium](https://quilibrium.com/). Den er organisert som Discord, med
Spaces, kanaler, roller og direktemeldinger, og meldingene er ende-til-ende-kryptert. Den nevnes ved
siden av Bitsocial fordi begge beskriver seg selv som peer-to-peer og sensurresistente, med grupper
som setter sine egne regler. De sikter mot forskjellige ting: Quorum mot privat gruppechat,
Bitsocial mot offentlige fellesskap som alle kan lese.

Quilibrium beskriver seg selv som et desentralisert alternativ til skyplattformer: et nettverk av
noder som lagrer data i en kryptert hypergraf og blir enige om tilstanden gjennom en konsensus som
Quilibrium kaller Proof of Meaningful Work. Noder tjener QUIL, nettverkets token, som betaler
bruksgebyrer. Quorum begynte i 2018 som Howler, en idé om et privat alternativ til Discord, og ble
den første appen som gikk live på Quilibrium, ifølge
[Quilibrium-historien](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc.,
grunnlagt av Cassie Heart, utvikler protokollen og tilbyr Quorum som en av sine administrerte
tjenester ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Hvordan Quorum fungerer

Detaljene nedenfor kommer fra kildekoden til Quorums klienter,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) for nett- og skrivebordsappene
og [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), slik den så ut i
oktober 2026.

- **Identiteter.** En brukers hovedidentitet er et Ed448-nøkkelsett, og hver enhet får sine egne
  X448- og Ed448-nøkler. I nettleseren beskyttes nøklene av en passnøkkel. Adresser er hasher som
  begynner med `Qm`, og brukere kan vise et brukernavn fra Quilibriums navnetjeneste.
- **Kryptering.** Direktemeldinger bruker Double Ratchet mellom enheter. En Space deler én Triple
  Ratchet-økt mellom medlemmene, som signerer meldingene sine med Space-spesifikke nøkler. Hver
  Space er kryptert, og Quorum sier at meldingsformidlingen hindrer tjenesten som videresender
  meldinger, i å koble avsendere og mottakere sammen.
- **Å bli med.** Man går inn i Spaces via invitasjonslenker. En engangslenke har nøklene som trengs
  for å bli med, i selve URL-en; en offentlig lenke henter dem fra Quorum-tjenesten, og offentlige
  Spaces kan føres opp i en søkbar katalog.
- **Transport.** Nett-, skrivebords- og mobilklientene kobler seg alle til én tjeneste over HTTPS og
  en WebSocket,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Den videresender krypterte meldinger til hvert medlems innboks, og lagrer brukerregistreringer,
  det krypterte manifestet til hver Space (kanaler, roller, emoji), invitasjonsmateriale, den
  offentlige katalogen og valgfri kryptert synkronisering av innstillinger. Quilibriums
  nodeprogramvare har en innboks- og hubtjeneste med samme form, men verken klientene eller
  Quilibriums dokumentasjon sier hvordan denne tjenesten forholder seg til nettverket.
- **Historikk.** Hvert medlems klient beholder sin egen kopi av Spacen i lokal lagring. Nett- og
  skrivebordsklienten fyller inn eldre historikk ved å be et medlem som er på nett, om å
  synkronisere; mobilklienten spiller av en logg som tjenesten fører for hver Space, så den kan ta
  igjen det den har gått glipp av når ingen andre medlemmer er på nett.
- **Moderering.** Roller gir rett til sletting, festing, demping og `@everyone`-omtaler. Hvert
  medlems klient kontrollerer signaturen på hver modereringshandling og utfører den bare hvis den
  som har signert, har riktig rolle. Eieren kan kaste ut et medlem, noe som roterer nøklene til
  Spacen slik at det utkastede medlemmet ikke kan lese nye meldinger. En Space kan kreve signerte
  meldinger eller la medlemmene poste usignerte, benektbare meldinger.
- **Kode.** Nett- og skrivebordsklienten er lisensiert under AGPL-3.0 og mobilklienten under
  GPL-3.0. Mobilklienten har også en kryptolommebok, Farcaster-integrasjon og Apex, et betalt
  abonnement som beskrives nedenfor.

## Hvor de skiller seg

### Private grupper og offentlige fellesskap

En Quorum-Space er en gruppe medlemmer: bare de som har nøklene, kan lese den, og det kreves en
invitasjonslenke for å bli med. En offentlig lenke slipper hvem som helst inn, men først etter at de
har blitt med. Et Bitsocial-fellesskap har ikke noe medlemskap. Alle kan lese det, fra hvilken som
helst app, uten å bli med, og alle kan prøve å poste, men må da bestå fellesskapets utfordring.

### Hva som holder en gruppe på nett

En Quorum-Space har ingen vertsnode. Medlemmene sender meldinger gjennom Quorum-tjenesten, hvert
medlems klient beholder en kopi, og eieren trenger ikke være på nett for at andre skal kunne snakke
sammen. Et Bitsocial-fellesskap ligger på eierens node, som godtar eller avviser hvert innlegg og
publiserer fellesskapets nyeste tilstand. Fellesskapet forblir lesbart så lenge peers seeder det,
men kan ikke godta nye innlegg mens noden er av nett. Se
[Peer-to-peer-protokoll](/peer-to-peer-protocol/).

### Hvem som håndhever reglene

I Quorum skjer håndhevingen i kanten. Hvert medlems klient avgjør om en sletting, en festing eller
en demping skal utføres, basert på rollen til den som har signert, og en utkastelse fungerer ved at
alle andre flyttes over til nye nøkler. I Bitsocial skjer håndhevingen i fellesskapets node: et
innlegg som ikke består fellesskapets utfordring eller regler, blir aldri en del av fellesskapet. Se
[Lokal moderering, ikke globale forbud](/local-moderation/).

### Spamkontroll

Quorum holder spam ute hovedsakelig gjennom invitasjoner. En engangslenke slipper inn én person, en
offentlig lenke slipper inn alle som har den, og eieren kan kaste ut medlemmer og bytte nøkler i
etterkant; klienten begrenser også hvor raskt den selv sender. Bitsocial-identiteter er gratis
nøkkelpar, så hvert fellesskap velger en utfordring som skal kjøres før et innlegg godtas, for
eksempel en captcha, en betaling, en tokensaldo eller en tillatelsesliste. Se
[Tilpassede utfordringer mot spam](/custom-challenges/).

### Klienten og nettverket

En Quorum-app er en klient for Quorum-tjenesten, som Quilibrium Inc. drifter. Appene blir ikke selv
med i noe peer-to-peer-nettverk, så det å nå en Space avhenger av det ene endepunktet. Bak det er
Quilibrium et eget nettverk: i oktober 2026 viste [utforskeren](https://dashboard.quilibrium.com/)
114 nåbare peers og 181 provers fordelt på 99 shards.

En Bitsocial-webapp kan kjøre en libp2p-node i fanen, hente fellesskapsinnhold fra peers og
publisere over gossipsub. Oppdagelse av peers går gjennom HTTP-rutere som bare returnerer adresser
til tilbydere; hvem som helst kan drive en slik ruter, og klienter kan bytte ruter ved å endre
konfigurasjonen sin. Se [Peer-to-peer i nettleseren](/browser-p2p/).

### Økonomi

Quilibrium har et token i kjernen. QUIL utvinnes av noder og betaler nettverksgebyrer, og en
innpakket versjon, wQUIL, sirkulerer på Ethereum. Quorum selv er gratis og krever verken betaling
eller telefonnummer. Det valgfrie Apex-abonnementet koster
[$5 i måneden](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
betales i wQUIL, SNAP eller USDC på Ethereum og fordeles mellom Quilibrium Inc. og fire Spaces som
abonnenten velger. Bitsocial har ikke noe betalingslag i protokollen; et fellesskap kan kreve en
betaling eller et token gjennom utfordringen sin.

### Private meldinger

Her er Quorum sterkere. Direktemeldinger og meldinger i Spaces er ende-til-ende-kryptert med forward
secrecy, og meldingsinnholdet når Quorum-tjenesten bare som chiffertekst. Bitsocial fokuserer på
offentlige fellesskap og har ennå ingen innebygde direktemeldinger. Et Bitsocial-innlegg er kryptert
med nøkkelen til fellesskapets node mens det sendes over pubsub, men når det først er godtatt, er
det offentlig.

## Prosjektstatus

I oktober 2026 kalte Quorum-repositoriet nettappen en beta, og Quorum-nettstedet oppførte fortsatt
appene for Google Play og App Store som kommer snart. De to klientene spriker også: mobilappen har
lommebok-, Farcaster- og Apex-funksjonene, mens nett- og skrivebordsklienten viser Wallet- og
Farcaster-sidene sine som kommer snart, og de to tar igjen historikken i en Space på ulike måter.

Quilibriums mainnet nådde versjon 2.1 den 30. september 2025, da nettverket kom i gang igjen etter
en stans ([kunngjøring](https://x.com/QuilibriumInc/status/1973082817236984270)). I 2026 ble noden
skrevet om i Rust, med postkvantesignaturer for konsensus og en kommunikasjonsprotokoll som eldre
noder ikke kan snakke. Deler av dokumentasjonen beskriver designet snarere enn koden som faktisk
kjører: den beskriver
[mixnet-ruting](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), men i node
2.1.0.25 er mixnet-tjenesten en
[stubb](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
som tar imot meldinger uten å mikse dem.

## Sammenligning

| Spørsmål                     | Quorum                                                                                | Bitsocial                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Kategori                     | Ende-til-ende-kryptert gruppemessenger på Quilibrium-nettverket                       | Peer-to-peer-nettverk av fellesskap                                                                                |
| Identitet                    | Ed448-hovednøkkelsett pluss nøkler per enhet, beskyttet av en passnøkkel              | Ed25519-nøkkelpar for brukere og fellesskap                                                                        |
| Hvem kan lese                | Medlemmer som har nøklene til en Space                                                | Alle, fra hvilken som helst app                                                                                    |
| Hvor meldingene ligger       | Hvert medlems enhet; mobilklienten spiller også av en logg som Quorum-tjenesten fører | Noden til fellesskapets eier og peerne som leser og seeder det                                                     |
| Hva klientene kobler seg til | Quorum-tjenesten på `api.quorummessenger.com`                                         | Peers over libp2p, også fra en nettleserfane                                                                       |
| Fellesskap                   | Spaces med kanaler, roller og invitasjonslenker                                       | Førsteklasses objekter der noden godtar eller avviser innlegg                                                      |
| Spamkontroll                 | Invitasjonslenker, utkastelser med nøkkelbytte, hastighetsbegrensning i klienten      | Hvert fellesskaps utfordring før et innlegg godtas                                                                 |
| Moderering                   | Roller som håndheves av hvert medlems klient; eieren kaster ut                        | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                                              |
| Private meldinger            | Ende-til-ende-krypterte direktemeldinger                                              | Offentlige fellesskap; ennå ingen innebygde direktemeldinger                                                       |
| Økonomi                      | QUIL-nettverkstoken; valgfritt Apex-abonnement til $5 i måneden                       | Ingenting i protokollen; en utfordring kan kreve en betaling eller et token                                        |
| Viktigste avveining          | Private, krypterte grupper, men hver klient er avhengig av én tjeneste                | Gratis identiteter og tilgang fra nettleseren, men ingen private meldinger, og bare den nyeste tilstanden beholdes |
