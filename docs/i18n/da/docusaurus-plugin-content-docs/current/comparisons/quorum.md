---
title: Bitsocial og Quorum
description: Hvordan Quorum, Quilibriums end-to-end-krypterede gruppemessenger med Spaces i Discord-stil, adskiller sig fra Bitsocials offentlige peer-to-peer-fællesskaber.
---

# Bitsocial og Quorum

[Quorum](https://www.quorummessenger.com/) er en gruppemessenger, som Quilibrium Inc. har bygget på
sit netværk [Quilibrium](https://quilibrium.com/). Den er organiseret som Discord, med Spaces,
kanaler, roller og direkte beskeder, og dens beskeder er end-to-end-krypterede. Den nævnes sammen
med Bitsocial, fordi begge beskriver sig selv som peer-to-peer og censurresistente, med grupper, der
fastsætter deres egne regler. De sigter mod forskellige ting: Quorum mod privat gruppechat,
Bitsocial mod offentlige fællesskaber, som alle kan læse.

Quilibrium beskriver sig selv som et decentraliseret alternativ til cloudplatforme: et netværk af
noder, der opbevarer data i en krypteret hypergraf og bliver enige om dens tilstand gennem en
konsensus, som det kalder Proof of Meaningful Work. Noderne tjener QUIL, netværkets token, som
betaler brugsgebyrer. Quorum begyndte i 2018 som Howler, en idé til et privat alternativ til
Discord, og blev den første app, der gik live på Quilibrium, ifølge
[Quilibriums historie](https://docs.quilibrium.com/docs/discover/q-story/). Quilibrium Inc.,
grundlagt af Cassie Heart, udvikler protokollen og tilbyder Quorum som en af sine administrerede
tjenester ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Sådan fungerer Quorum

Oplysningerne nedenfor stammer fra kildekoden til Quorums klienter,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) til web- og desktopappene og
[quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), pr. oktober 2026.

- **Identiteter.** En brugers masteridentitet er et Ed448-nøglesæt, og hver enhed får sine egne
  X448- og Ed448-nøgler. I browseren er nøglerne beskyttet af en adgangsnøgle (passkey). Adresser er
  hashes, der starter med `Qm`, og brugere kan vise et brugernavn fra Quilibriums navnetjeneste.
- **Kryptering.** Direkte beskeder bruger Double Ratchet mellem enheder. Et Space deler én Triple
  Ratchet-session mellem sine medlemmer, som signerer deres beskeder med Space-specifikke nøgler.
  Alle Spaces er krypterede, og Quorum siger, at dets beskedformidling forhindrer den tjeneste, der
  videresender beskeder, i at forbinde afsendere og modtagere.
- **Indmeldelse.** Man kommer ind i Spaces via invitationslinks. Et engangslink bærer nøglerne til
  at blive medlem i selve URL'en; et offentligt link henter dem fra Quorum-tjenesten, og offentlige
  Spaces kan opføres i et søgbart katalog.
- **Transport.** Web-, desktop- og mobilklienterne forbinder sig alle over HTTPS og en WebSocket til
  én tjeneste,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Den videresender krypterede beskeder til hvert medlems indbakke og gemmer brugerregistreringer,
  hvert Spaces krypterede manifest (kanaler, roller, emoji), invitationsmateriale, det offentlige
  katalog og valgfri krypteret synkronisering af indstillinger. Quilibriums nodesoftware har en
  inbox- og hub-tjeneste med samme form, men hverken klienterne eller Quilibriums dokumentation
  siger, hvordan denne tjeneste passer ind i netværket.
- **Historik.** Hvert medlems klient gemmer sin egen kopi af Spacet i lokal lagring. Web- og
  desktopklienten henter ældre historik ved at bede et medlem, der er online, om at synkronisere;
  mobilklienten afspiller en log, som tjenesten fører for hvert Space, så den kan indhente det
  forsømte, når intet andet medlem er online.
- **Moderering.** Roller giver ret til at slette, fastgøre, gøre tavs og bruge `@everyone`-omtaler.
  Hvert medlems klient kontrollerer signaturen på hver modereringshandling og udfører den kun, hvis
  underskriveren har den rette rolle. Ejeren kan smide et medlem ud, hvilket roterer Spacets nøgler,
  så det udsmidte medlem ikke kan læse nye beskeder. Et Space kan kræve signerede beskeder eller
  lade medlemmer poste usignerede beskeder, som kan benægtes.
- **Kode.** Web- og desktopklienten er licenseret under AGPL-3.0 og mobilklienten under GPL-3.0.
  Mobilklienten har desuden en kryptowallet, Farcaster-integration og Apex, et betalt abonnement,
  der beskrives nedenfor.

## Hvor de adskiller sig

### Private grupper og offentlige fællesskaber

Et Quorum-Space er en gruppe af medlemmer: kun folk, der har dets nøgler, kan læse det, og det
kræver et invitationslink at blive medlem. Et offentligt link lukker alle ind, men først når de er
blevet medlemmer. Et Bitsocial-fællesskab har intet medlemskab. Alle kan læse det, fra enhver app,
uden at blive medlem, og alle kan forsøge at poste, med forbehold for fællesskabets udfordring.

### Hvad der holder en gruppe online

Et Quorum-Space har ingen værtsnode. Medlemmer sender beskeder gennem Quorum-tjenesten, hvert
medlems klient beholder en kopi, og ejeren behøver ikke være online, for at de andre kan tale
sammen. Et Bitsocial-fællesskab lever på ejerens node, som accepterer eller afviser hvert indlæg og
publicerer fællesskabets seneste tilstand. Fællesskabet forbliver læsbart, så længe peers seeder
det, men kan ikke modtage nye indlæg, mens dets node er offline. Se
[Peer-to-peer-protokol](/peer-to-peer-protocol/).

### Hvem der håndhæver reglerne

I Quorum sker håndhævelsen i kanten. Hvert medlems klient afgør ud fra underskriverens rolle, om en
sletning, en fastgørelse eller en tavsgørelse skal udføres, og en udsmidning fungerer ved at flytte
alle andre over på nye nøgler. I Bitsocial sker håndhævelsen på fællesskabets node: et indlæg, der
ikke består fællesskabets udfordring eller regler, bliver aldrig en del af fællesskabet. Se
[Lokal moderation, ikke globale forbud](/local-moderation/).

### Spamkontrol

Quorum holder primært spam ude gennem invitationer. Et engangslink giver adgang til én person, et
offentligt link giver adgang til alle, der har det, og ejeren kan bagefter smide ud og skifte
nøgler; klienten begrænser også hastigheden på sine egne afsendelser. Bitsocial-identiteter er
gratis nøglepar, så hvert fællesskab vælger en udfordring, der skal køres, før et indlæg accepteres,
for eksempel en captcha, en betaling, en tokenbeholdning eller en tilladelsesliste. Se
[Brugerdefinerede anti-spam-udfordringer](/custom-challenges/).

### Klienten og netværket

En Quorum-app er en klient til Quorum-tjenesten, som Quilibrium Inc. driver. Appene tilslutter sig
ikke selv et peer-to-peer-netværk, så adgangen til et Space afhænger af det ene slutpunkt. Bag det
er Quilibrium et netværk for sig: i oktober 2026 viste dets
[explorer](https://dashboard.quilibrium.com/) 114 tilgængelige peers og 181 provers fordelt på 99
shards.

En Bitsocial-webapp kan køre en libp2p-node i fanen, hente fællesskabsindhold fra peers og publicere
over gossipsub. Peer-opdagelse går gennem HTTP-routere, som kun returnerer udbyderadresser; alle kan
køre en, og klienter kan skifte router ved at ændre deres konfiguration. Se
[Peer-to-peer i browseren](/browser-p2p/).

### Økonomi

Quilibrium har en token i sin kerne. QUIL mines af noder og betaler netværksgebyrer, og en wrapped
version, wQUIL, cirkulerer på Ethereum. Quorum selv er gratis og kræver hverken betaling eller
telefonnummer. Dets valgfrie Apex-abonnement koster
[5 dollars om måneden](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
betales i wQUIL, SNAP eller USDC på Ethereum og fordeles mellem Quilibrium Inc. og fire Spaces, som
abonnenten vælger. Bitsocial har intet betalingslag i protokollen; et fællesskab kan kræve en
betaling eller en token gennem sin udfordring.

### Private beskeder

Her er Quorum stærkere. Direkte beskeder og Space-beskeder er end-to-end-krypterede med forward
secrecy, og beskedindhold når kun Quorum-tjenesten som krypteret tekst. Bitsocial fokuserer på
offentlige fællesskaber og har endnu ingen indbyggede direkte beskeder. Et Bitsocial-indlæg er
krypteret til fællesskabsnodens nøgle, mens det sendes over pubsub, men når det først er accepteret,
er det offentligt.

## Projektstatus

I oktober 2026 kaldte Quorum-repositoriet webappen en beta, og Quorums websted angav stadig apps til
Google Play og App Store som "kommer snart". De to klienter går også hver sin vej: mobilappen har
funktionerne wallet, Farcaster og Apex, mens web- og desktopklienten viser sine Wallet- og
Farcaster-sider som "kommer snart", og de to indhenter Space-historik på forskellig vis.

Quilibriums mainnet nåede version 2.1 den 30. september 2025, da netværket kom i gang igen efter et
stop ([meddelelse](https://x.com/QuilibriumInc/status/1973082817236984270)). I 2026 blev noden
omskrevet i Rust med post-kvante-signaturer til konsensus og en wire-protokol, som ældre noder ikke
kan tale. Dele af dokumentationen beskriver designet snarere end den kørende kode: de beskriver
[mixnet-routing](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), men i node
2.1.0.25 er mixnet-tjenesten en
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
der accepterer beskeder uden at mikse dem.

## Sammenligning

| Spørgsmål                   | Quorum                                                                               | Bitsocial                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Kategori                    | End-to-end-krypteret gruppemessenger på Quilibrium-netværket                         | Peer-to-peer-fællesskabsnetværk                                                                             |
| Identitet                   | Ed448-masternøglesæt plus nøgler pr. enhed, beskyttet af en adgangsnøgle             | Ed25519-nøglepar til brugere og fællesskaber                                                                |
| Hvem kan læse               | Medlemmer, der har et Spaces nøgler                                                  | Alle, fra enhver app                                                                                        |
| Hvor beskeder ligger        | Hvert medlems enhed; mobilklienten afspiller også en log, som Quorum-tjenesten fører | Fællesskabsejerens node og de peers, der læser og seeder det                                                |
| Hvad klienter forbinder til | Quorum-tjenesten på `api.quorummessenger.com`                                        | Peers over libp2p, også fra en browserfane                                                                  |
| Fællesskaber                | Spaces med kanaler, roller og invitationslinks                                       | Førsteklasses objekter, hvis node accepterer eller afviser indlæg                                           |
| Spamkontrol                 | Invitationslinks, udsmidning med nøgleskift, hastighedsbegrænsning i klienten        | Hvert fællesskabs udfordring, før et indlæg accepteres                                                      |
| Moderering                  | Roller, som hvert medlems klient håndhæver; ejeren smider ud                         | Fællesskabsejere modererer deres eget fællesskab; apps vælger, hvad de viser                                |
| Private beskeder            | End-to-end-krypterede direkte beskeder                                               | Offentlige fællesskaber; endnu ingen indbyggede direkte beskeder                                            |
| Økonomi                     | QUIL-netværkstoken; valgfrit Apex-abonnement til 5 dollars om måneden                | Ingen i protokollen; en udfordring kan kræve en betaling eller en token                                     |
| Vigtigste afvejning         | Private, krypterede grupper, men hver klient afhænger af én tjeneste                 | Gratis identiteter og adgang via browseren, men ingen private beskeder, og kun den seneste tilstand bevares |
