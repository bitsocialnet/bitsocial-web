---
title: Bitsocial en Bluesky
description: Hoe Bluesky en het AT Protocol, met personal data servers, relays en AppViews, zich verhouden tot de peer-to-peer-communities van Bitsocial.
---

# Bitsocial en Bluesky

[Bluesky](https://bsky.app/) is een microblogapp gebouwd op het [AT Protocol](https://atproto.com/),
dat Bluesky Social PBC heeft ontworpen. Het protocol splitst een sociaal netwerk op in afzonderlijke
diensten: personal data servers hosten accounts, relays bundelen die tot één stroom, en AppViews
indexeren die stroom tot de tijdlijnen en threads die mensen zien. De documentatie beschrijft
accountgegevens als opgeslagen op hostservers, "in tegenstelling tot een peer-to-peer-model"
([overzicht](https://atproto.com/guides/overview)).

## Hoe het AT Protocol werkt

- **Repositories op servers.** Elke post, like of follow is een record in de ondertekende repository
  van de auteur, gehost op een personal data server (PDS). Bluesky draait de standaardservers, en
  iedereen kan een eigen server hosten.
- **Relays.** Relays abonneren zich op elke PDS en zenden wijzigingen opnieuw uit als één stroom, de
  firehose. Sinds een protocolupdate in 2025 archiveren ze niet meer elke repository, waardoor ze veel
  goedkoper te draaien zijn geworden ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Een AppView indexeert de hele firehose en levert tijdlijnen, volledige
  reactiethreads, tellingen en zoekfuncties. Het is het onderdeel van het netwerk dat de meeste
  middelen vraagt.
- **Identiteit.** Een account is een DID: meestal `did:plc`, geregistreerd in één wereldwijde
  directory, of `did:web`, gekoppeld aan een domein. Het DID-document vermeldt de handle, de
  ondertekeningssleutel en de huidige server van het account. De PDS bewaart de
  ondertekeningssleutel; met `did:plc` kunnen gebruikers ook zelf rotatiesleutels bewaren, zodat ze
  kunnen verhuizen zonder hulp van de oude host
  ([identiteitsgids](https://atproto.com/guides/identity)).
- **Handles.** Handles zijn DNS-namen, zoals `alice.bsky.social` of een domein van de gebruiker zelf,
  die tegen de DID worden geverifieerd.
- **Moderatie.** Hosting en bereik zijn aparte lagen. Iedereen kan een labeler draaien en gebruikers
  kunnen er meerdere stapelen ([moderatiegids](https://atproto.com/guides/moderation)), maar de
  Bluesky-app past altijd de eigen moderatie van Bluesky toe. Auteurs kunnen beperken wie op hun posts
  mag reageren en reacties verbergen.

## Waar ze verschillen

### Servers of peers

De data van Bluesky staat op servers: een PDS host elk account, relays dragen de firehose, en
AppViews leveren wat clients tonen. Een browser is een HTTP-client van die diensten, nooit een peer.
Bij Bitsocial leveren de node van de community en de peers die de community lezen de inhoud, en een
webapp kan een eigen peer-to-peer-node draaien. Zie [Peer-to-peer in de browser](/browser-p2p/).

### Een globaal overzicht of communities

Het AT Protocol is ontworpen voor één globaal overzicht: een AppView ziet elke reactie, dus threads en
zoekresultaten zijn volledig. Bitsocial heeft geen globale index; elke community publiceert haar
eigen staat, en apps bouwen daar ontdekking bovenop. Zie [Inhoud ontdekken](/content-discovery/).

Bluesky heeft vandaag geen communityobject voor openbare posts. In juni 2026
[kondigde het native communities aan](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k),
waarbij posten op sommige privacyniveaus goedkeuring vereist; in oktober 2026 waren die nog niet
gelanceerd. Bij Bitsocial zijn communities het kernobject, en de node van een community accepteert of
weigert posts.

### Spambestrijding

Bluesky bestrijdt spam met rate limits op zijn servers, limieten voor nieuwe hosts bij de relay,
automatische detectie, menselijke beoordeling en labels, en auteurs kunnen reacties beperken. Er is
geen poort op communityniveau die bepaalt waar een post doorheen moet voordat hij wordt geaccepteerd.
Bij Bitsocial kiest elke community haar eigen challenge. Zie
[Aangepaste antispamuitdagingen](/custom-challenges/).

### Wie de sleutels heeft

Accounts op de eigen servers van Bluesky loggen in met een wachtwoord, en die servers bewaren hun
ondertekeningssleutels namens hen (custodial) ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Volgens een protocolengineer van Bluesky
[hebben de meeste accounts geen rotatiesleutels die ze zelfstandig beheren](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Een Bitsocial-identiteit is een sleutelpaar dat door de app van de gebruiker wordt gegenereerd en
bewaard.

### De infrastructuur draaien

Een persoonlijke server is goedkoop: de [referentie-PDS](https://github.com/bluesky-social/pds) raadt
1 GB RAM aan voor maximaal 20 gebruikers. Een onafhankelijke AppView voor het hele netwerk is een
groot project; een AppView die in 2025 werd gebouwd,
[kostte ongeveer $ 200 per maand](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), vooral voor 16 TB
opslag. Bitsocial heeft geen globale index om te repliceren, en een communitynode draait op
consumentenhardware.

## Vergelijking

| Vraag                  | Bluesky (AT Protocol)                                                           | Bitsocial                                                                       |
| ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Categorie              | Gefedereerde servers met een globale index                                      | Peer-to-peer-netwerk van communities                                            |
| Identiteit             | DID, waarbij de server meestal de ondertekeningssleutels bewaart                | Ed25519-sleutelparen voor gebruikers en communities                             |
| Waar posts staan       | De repository van de auteur op een personal data server                         | De node van de community-eigenaar en de peers die de community lezen en seeden  |
| Wie houdt het online   | PDS-hosts, relays en AppViews, standaard gedraaid door Bluesky                  | Node van de community-eigenaar plus helpende seeders                            |
| Communities            | Nog geen voor openbare posts (aangekondigd in 2026)                             | Volwaardige objecten waarvan de node posts accepteert of weigert                |
| Spambestrijding        | Rate limits op servers, automatische detectie, labels, controle over reacties   | De challenge van elke community voordat een post wordt geaccepteerd             |
| Moderatie              | Stapelbare labelers; de Bluesky-app past altijd de moderatie van Bluesky toe    | Community-eigenaren modereren hun community; apps kiezen wat ze tonen           |
| Namen                  | DNS-handles die tegen de DID worden geverifieerd                                | `.bso`- en `.eth`-namen die naar sleutels verwijzen                             |
| Browser                | HTTP-client van een PDS en een AppView                                          | Peer-to-peer-node in een gewoon browsertabblad                                  |
| Belangrijkste afweging | Volledige globale threads en zoekfunctie, maar aggregatie vereist zware servers | Geen zware globale index, maar ook geen volledig overzicht van het hele netwerk |
