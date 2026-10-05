---
title: Bitsocial och ActivityPub
description: Hur Fediverse, med Mastodon för mikrobloggning och Lemmy för communityer i Reddit-stil, står sig mot Bitsocials peer-to-peer-communityer.
---

# Bitsocial och ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) är W3C-standarden bakom Fediverse. Användare
väljer en server, en så kallad instans, som är värd för deras konto, och servrarna utbyter inlägg
med varandra. [Mastodon](https://joinmastodon.org/) är dess mest kända mjukvara för mikrobloggning;
[Lemmy](https://join-lemmy.org/) är en länkaggregator och ett forum i Reddit-stil som byggs upp av
ämnescommunityer, vilket gör det till Fediverses närmaste motsvarighet till Bitsocial-appar som
[Seedit](/apps/seedit/).

## Hur ActivityPub fungerar

- **Inkorgar och utkorgar.** Varje konto har en inkorg och en utkorg. Servrar levererar aktiviteter
  till inkorgar på andra servrar, och varje mottagande server lagrar sin egen kopia av det som dess
  användare följer.
- **Serverägd identitet.** Konto- och inläggs-ID:n är HTTPS-adresser på ursprungsserverns domän. Ett
  Mastodon-handle är `@user@domain`, som slås upp med WebFinger, och servern signerar
  federationsmeddelanden för användarens räkning.
- **Klienter.** Appar och webbläsare pratar bara med användarens egen server, via den serverns API.
- **Lemmy-communityer.** En community är en gruppaktör som ligger på en enda instans. Användare
  skickar inlägg till communityn, som sänder vidare dem till sina följare; enligt den gemensamma
  forumstandarden
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) kan en
  community först validera inläggen, ända upp till manuellt godkännande av moderatorer.
- **Moderering.** Modereringen är lokal för varje server. Administratörer kan stänga av konton,
  blockera hela servrar eller bara federera med servrar på en tillåtelselista; Lemmy har också
  moderatorer för varje community.
- **Spamskydd.** ActivityPub definierar ingen anti-spam-mekanism. Mastodon och Lemmy begränsar
  registreringen med godkännande, inbjudningar, ansökningsfrågor, captchor och e-postkontroller, och
  förlitar sig sedan på frekvensbegränsningar, rapporter och moderering.

## Där de skiljer sig åt

### Identiteten tillhör en domän

Ett Fediverse-konto tillhör serverns domän. Mastodon kan omdirigera följare till ett nytt konto, men
[inläggen flyttar inte med](https://docs.joinmastodon.org/user/moving/), flytten måste startas från
den gamla servern och det finns en spärrperiod på 30 dagar. I Bitsocial är profiler och communityer
nyckelpar, så att byta värd eller app ändrar inte identiteten. Se
[Identitet och gemenskapsägande](/identity-and-ownership/).

### Var en community finns

En Lemmy-community liknar strukturellt en Bitsocial-community: inläggen skickas till communityn, som
kan kontrollera dem innan den sänder vidare dem. Skillnaden är var den finns. En Lemmy-community kan
bara skapas på skaparens hemmainstans, instansens administratör har
[full kontroll](https://join-lemmy.org/docs/users/05-censorship-resistance.html) över den, och det
finns inget dokumenterat sätt att flytta den till en annan instans. En Bitsocial-community är sitt
eget nyckelpar: ägaren kan köra dess nod var som helst, och ingen serveradministratör står över den.

### Spamskydd

Fediverse-servrar stoppar mest spam vid registreringen och modererar i efterhand. En
Bitsocial-community kör en utmaning på varje inlägg innan det accepteras, och varje community väljer
sin egen: captcha, tillåtelselista, betalning eller vilken annan kod som helst. Se
[Anpassade anti-spam-utmaningar](/custom-challenges/).

### Att driva infrastrukturen

Att driva en instans innebär en server som alltid är igång, med domän, TLS och e-post. Mastodon
behöver dessutom PostgreSQL, Redis och bakgrundsprocesser; Lemmy är lättare, omkring 150 MB RAM
enligt projektets egen uppgift. Varje instans lagrar kopior av det fjärrinnehåll som dess användare
följer. En Bitsocial-communitynod behöver varken domän eller certifikat och körs från
skrivbordsappen eller `bitsocial-cli`.

### Vad servrarna ger i gengäld

Fediverse-servrar behåller hela historiken och levererar den tillförlitligt, och Mastodon har mogna
modereringsverktyg som byggts upp under flera år. Bitsocial garanterar inte gammalt innehåll för
alltid, och dess modereringsverktyg finns i varje app.

## Jämförelse

| Fråga                  | ActivityPub (Mastodon, Lemmy)                                                                | Bitsocial                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Kategori               | Federerade servrar                                                                           | Peer-to-peer-nätverk av communityer                                              |
| Identitet              | Konto på en servers domän, signerat av servern                                               | Ed25519-nyckelpar för användare och communityer                                  |
| Var inläggen finns     | Ursprungsservern, plus kopior på varje server som följer                                     | Communityägarens nod och de peers som läser och seedar den                       |
| Vem håller det uppe    | Instansadministratörer                                                                       | Communityns ägarnod plus hjälpande seeders                                       |
| Communityer            | Lemmy-communityer som ligger på en enda instans                                              | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                    |
| Spamskydd              | Spärrar vid registrering, frekvensbegränsningar, rapporter och moderering                    | Varje communitys utmaning innan ett inlägg accepteras                            |
| Moderering             | Serveradministratörer och community-moderatorer, lokalt på varje server                      | Communityägare modererar sin community; appar väljer vad de visar                |
| Namn                   | Handles av typen `@user@domain` och `!community@domain`                                      | `.bso`- och `.eth`-namn som löses upp till nycklar                               |
| Webbläsare             | Klient till användarens egen server                                                          | Peer-to-peer-nod i en vanlig webbläsarflik                                       |
| Viktigaste avvägningen | Tillförlitlig historik och mogen moderering, men identitet och communityer tillhör en server | Ingen server eller domän behövs, men gammalt innehåll garanteras inte för alltid |
