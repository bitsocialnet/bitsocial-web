---
title: Bitsocial en ActivityPub
description: Hoe de Fediverse, met Mastodon voor microblogging en Lemmy voor communities in Reddit-stijl, zich verhoudt tot de peer-to-peer-communities van Bitsocial.
---

# Bitsocial en ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) is de W3C-standaard achter de Fediverse.
Gebruikers kiezen een server, een instance genoemd, die hun account host, en servers wisselen posts
met elkaar uit. [Mastodon](https://joinmastodon.org/) is de bekendste microblogsoftware ervan;
[Lemmy](https://join-lemmy.org/) is een linkaggregator en forum in Reddit-stijl, opgebouwd uit
communities rond onderwerpen, waarmee het binnen de Fediverse het dichtst in de buurt komt van
Bitsocial-apps zoals [Seedit](/apps/seedit/).

## Hoe ActivityPub werkt

- **Inboxen en outboxen.** Elk account heeft een inbox en een outbox. Servers bezorgen activiteiten
  in inboxen op andere servers, en elke ontvangende server bewaart een eigen kopie van wat zijn
  gebruikers volgen.
- **Identiteit in handen van de server.** Account- en post-ID's zijn HTTPS-adressen op het domein van
  de oorspronkelijke server. Een Mastodon-handle is `@user@domain`, opgezocht met WebFinger, en de
  server ondertekent federatieberichten namens de gebruiker.
- **Clients.** Apps en browsers praten alleen met de eigen server van de gebruiker, via de API van die
  server.
- **Lemmy-communities.** Een community is een groepsactor die op één instance wordt gehost.
  Gebruikers sturen posts naar de community, die ze opnieuw uitzendt naar haar volgers; volgens de
  gedeelde forumstandaard
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) mag een
  community posts eerst valideren, tot en met handmatige goedkeuring door moderators.
- **Moderatie.** Moderatie is lokaal per server. Beheerders kunnen accounts schorsen, hele servers
  blokkeren of alleen federeren met een allowlist; Lemmy heeft daarnaast moderators per community.
- **Spambestrijding.** ActivityPub definieert geen antispammechanisme. Mastodon en Lemmy beperken
  aanmeldingen met goedkeuring, uitnodigingen, aanmeldvragen, captcha's en e-mailcontroles, en
  vertrouwen daarna op rate limits, meldingen en moderatie.

## Waar ze verschillen

### Identiteit hoort bij een domein

Een Fediverse-account hoort bij het domein van zijn server. Mastodon kan volgers doorsturen naar een
nieuw account, maar [posts verhuizen niet mee](https://docs.joinmastodon.org/user/moving/), de
verhuizing moet vanaf de oude server beginnen, en er geldt een wachttijd van 30 dagen. Bij Bitsocial
zijn profielen en communities sleutelparen, dus een andere host of app verandert de identiteit niet.
Zie [Identiteit en gemeenschapseigendom](/identity-and-ownership/).

### Waar een community zich bevindt

Een Lemmy-community lijkt structureel op een Bitsocial-community: posts gaan naar de community, die
ze kan controleren voordat ze ze opnieuw uitzendt. Het verschil is waar ze zich bevindt. Een
Lemmy-community kan alleen worden aangemaakt op de thuisinstance van de maker, de beheerder van die
instance heeft er
[volledige controle](https://join-lemmy.org/docs/users/05-censorship-resistance.html) over, en er is
geen gedocumenteerde manier om haar naar een andere instance te verhuizen. Een Bitsocial-community is
een eigen sleutelpaar: de eigenaar kan haar node overal draaien, en er staat geen serverbeheerder
boven haar.

### Spambestrijding

Fediverse-servers houden spam vooral tegen bij de aanmelding en modereren achteraf. Een
Bitsocial-community voert bij elke post een challenge uit voordat ze die accepteert, en elke
community kiest haar eigen challenge: captcha, allowlist, betaling of welke andere code dan ook. Zie
[Aangepaste antispamuitdagingen](/custom-challenges/).

### De infrastructuur draaien

Een instance draaien betekent een server die altijd aan staat, met een domein, TLS en e-mail.
Mastodon heeft daarnaast PostgreSQL, Redis en achtergrondworkers nodig; Lemmy is lichter, met
ongeveer 150 MB RAM volgens eigen opgave. Elke instance bewaart kopieën van de externe inhoud die
haar gebruikers volgen. Een Bitsocial-communitynode heeft geen domein of certificaat nodig en draait
vanuit de desktopapp of `bitsocial-cli`.

### Wat servers ervoor teruggeven

Fediverse-servers bewaren de volledige geschiedenis en leveren die betrouwbaar uit, en Mastodon heeft
volwassen moderatietools die in de loop van jaren zijn opgebouwd. Bitsocial garandeert oude inhoud
niet voor altijd, en de moderatietools zitten in elke afzonderlijke app.

## Vergelijking

| Vraag                  | ActivityPub (Mastodon, Lemmy)                                                                        | Bitsocial                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Categorie              | Gefedereerde servers                                                                                 | Peer-to-peer-netwerk van communities                                           |
| Identiteit             | Account op het domein van een server, ondertekend door de server                                     | Ed25519-sleutelparen voor gebruikers en communities                            |
| Waar posts staan       | De oorspronkelijke server, plus kopieën op elke server die volgt                                     | De node van de community-eigenaar en de peers die de community lezen en seeden |
| Wie houdt het online   | Instancebeheerders                                                                                   | Node van de community-eigenaar plus helpende seeders                           |
| Communities            | Lemmy-communities die op één instance worden gehost                                                  | Volwaardige objecten waarvan de node posts accepteert of weigert               |
| Spambestrijding        | Drempels bij aanmelding, rate limits, meldingen en moderatie                                         | De challenge van elke community voordat een post wordt geaccepteerd            |
| Moderatie              | Serverbeheerders en communitymoderators, lokaal per server                                           | Community-eigenaren modereren hun community; apps kiezen wat ze tonen          |
| Namen                  | Handles in de vorm `@user@domain` en `!community@domain`                                             | `.bso`- en `.eth`-namen die naar sleutels verwijzen                            |
| Browser                | Client van de eigen server van de gebruiker                                                          | Peer-to-peer-node in een gewoon browsertabblad                                 |
| Belangrijkste afweging | Betrouwbare geschiedenis en volwassen moderatie, maar identiteit en communities horen bij een server | Geen server of domein nodig, maar oude inhoud is niet voor altijd verzekerd    |
