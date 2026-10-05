---
title: Bitsocial og ActivityPub
description: Hvordan Fediverse, med Mastodon for mikroblogging og Lemmy for fellesskap i Reddit-stil, står seg mot Bitsocials peer-to-peer-fellesskap.
---

# Bitsocial og ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) er W3C-standarden bak Fediverse. Brukere velger en
server, kalt en instans, som er vert for kontoen deres, og serverne utveksler innlegg med hverandre.
[Mastodon](https://joinmastodon.org/) er den mest kjente mikrobloggprogramvaren;
[Lemmy](https://join-lemmy.org/) er en lenkeaggregator og et forum i Reddit-stil bygget opp av
tematiske fellesskap, noe som gjør den til det nærmeste Fediverse har til Bitsocial-apper som
[Seedit](/apps/seedit/).

## Hvordan ActivityPub fungerer

- **Innbokser og utbokser.** Hver konto har en innboks og en utboks. Servere leverer aktiviteter til
  innbokser på andre servere, og hver mottakende server lagrer sin egen kopi av det brukerne dens
  følger.
- **Identitet eid av serveren.** Konto- og innleggs-ID-er er HTTPS-adresser på
  opprinnelsesserverens domene. En Mastodon-handle er `@user@domain`, slått opp med WebFinger, og
  serveren signerer føderasjonsmeldinger på brukerens vegne.
- **Klienter.** Apper og nettlesere snakker bare med brukerens egen server, via serverens API.
- **Lemmy-fellesskap.** Et fellesskap er en gruppeaktør som ligger på én instans. Brukere sender
  innlegg til fellesskapet, som kringkaster dem videre til følgerne sine; under den felles
  forumstandarden
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) kan et
  fellesskap validere innlegg først, helt opp til manuell godkjenning fra moderatorer.
- **Moderering.** Moderering er lokal for hver server. Administratorer kan suspendere kontoer,
  blokkere hele servere eller bare føderere med en tillatelsesliste; Lemmy har i tillegg moderatorer
  for hvert fellesskap.
- **Spamkontroll.** ActivityPub definerer ingen mekanisme mot spam. Mastodon og Lemmy begrenser
  registrering med godkjenning, invitasjoner, søknadsspørsmål, captchaer og e-postkontroller, og
  støtter seg deretter på frekvensgrenser, rapporteringer og moderering.

## Hvor de skiller seg

### Identiteten tilhører et domene

En Fediverse-konto tilhører serverens domene. Mastodon kan videresende følgere til en ny konto, men
[innleggene flytter ikke med](https://docs.joinmastodon.org/user/moving/), flyttingen må startes fra
den gamle serveren, og det er en karenstid på 30 dager. I Bitsocial er profiler og fellesskap
nøkkelpar, så det å bytte vert eller app endrer ikke identiteten. Se
[Identitet og fellesskapseierskap](/identity-and-ownership/).

### Hvor et fellesskap hører hjemme

Et Lemmy-fellesskap ligner strukturelt på et Bitsocial-fellesskap: innlegg går til fellesskapet, som
kan sjekke dem før det kringkaster dem videre. Forskjellen er hvor det hører hjemme. Et
Lemmy-fellesskap kan bare opprettes på skaperens hjemmeinstans, instansadministratoren har
[full kontroll](https://join-lemmy.org/docs/users/05-censorship-resistance.html) over det, og det
finnes ingen dokumentert måte å flytte det til en annen instans på. Et Bitsocial-fellesskap er sitt
eget nøkkelpar: eieren kan kjøre noden hvor som helst, og ingen serveradministrator står over det.

### Spamkontroll

Fediverse-servere stopper stort sett spam ved registrering og modererer i etterkant. Et
Bitsocial-fellesskap kjører en utfordring på hvert innlegg før det godtar det, og hvert fellesskap
velger sin egen: captcha, tillatelsesliste, betaling eller hvilken som helst annen kode. Se
[Tilpassede utfordringer mot spam](/custom-challenges/).

### Drift av infrastrukturen

Å drifte en instans betyr en server som alltid er på, med domene, TLS og e-post. Mastodon trenger i
tillegg PostgreSQL, Redis og bakgrunnsprosesser; Lemmy er lettere, med rundt 150 MB RAM etter egne
tall. Hver instans lagrer kopier av det eksterne innholdet brukerne følger. En
Bitsocial-fellesskapsnode trenger verken domene eller sertifikat og kjører fra skrivebordsappen eller
`bitsocial-cli`.

### Hva serverne gir tilbake

Fediverse-servere beholder hele historikken og serverer den pålitelig, og Mastodon har modne
modereringsverktøy bygget opp over flere år. Bitsocial garanterer ikke gammelt innhold for alltid, og
modereringsverktøyene ligger i hver enkelt app.

## Sammenligning

| Spørsmål                     | ActivityPub (Mastodon, Lemmy)                                                           | Bitsocial                                                                             |
| ---------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Kategori                     | Fødererte servere                                                                       | Peer-to-peer-nettverk av fellesskap                                                   |
| Identitet                    | Konto på en servers domene, signert av serveren                                         | Ed25519-nøkkelpar for brukere og fellesskap                                           |
| Hvor innleggene ligger       | Opprinnelsesserveren, pluss kopier på hver server som følger                            | Noden til fellesskapets eier og peerne som leser og seeder det                        |
| Hvem holder det tilgjengelig | Instansadministratorer                                                                  | Noden til fellesskapets eier pluss seedere som hjelper til                            |
| Fellesskap                   | Lemmy-fellesskap som ligger på én instans                                               | Førsteklasses objekter der noden godtar eller avviser innlegg                         |
| Spamkontroll                 | Terskler ved registrering, frekvensgrenser, rapporteringer og moderering                | Hvert fellesskaps utfordring før et innlegg godtas                                    |
| Moderering                   | Serveradministratorer og fellesskapsmoderatorer, lokalt for hver server                 | Fellesskapseiere modererer sitt fellesskap; apper velger hva de viser                 |
| Navn                         | Handles på formen `@user@domain` og `!community@domain`                                 | `.bso`- og `.eth`-navn som peker til nøkler                                           |
| Nettleser                    | Klient for brukerens egen server                                                        | Peer-to-peer-node i en vanlig nettleserfane                                           |
| Viktigste avveining          | Pålitelig historikk og moden moderering, men identitet og fellesskap tilhører en server | Ingen server eller domene nødvendig, men gammelt innhold er ikke garantert for alltid |
