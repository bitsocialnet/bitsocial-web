---
title: React Hooks
description: React hooks-bibliotheek voor het bouwen van gedecentraliseerde sociale applicaties op het Bitsocial-protocol.
sidebar_position: 1
---

# React Hooks

:::warning Legacy Naming
Dit pakket maakt momenteel gebruik van verouderde naamgevingsconventies die zijn overgenomen van de upstream-vork. Verwijzingen naar "plebbit" in code, API's en configuratie zullen in een toekomstige release worden gemigreerd naar "bitsocial". De functionaliteit blijft onaangetast.
:::

Het `bitsocial-react-hooks`-pakket biedt een vertrouwde React hooks-API voor interactie met het Bitsocial-protocol. Het zorgt voor het ophalen van feeds, opmerkingen en auteursprofielen, het beheren van accounts, het publiceren van inhoud en het abonneren op communities - allemaal zonder afhankelijk te zijn van een centrale server.

Deze bibliotheek is de primaire interface die wordt gebruikt door [5chan](/apps/5chan/) en andere Bitsocial-clienttoepassingen.

:::note
`bitsocial-react-hooks` is een tijdelijke afsplitsing van `plebbit/plebbit-react-hooks` die wordt onderhouden voor AI-ondersteunde ontwikkeling. Het wordt rechtstreeks vanuit GitHub gebruikt in plaats van gepubliceerd naar npm.
:::

## Installatie

Omdat het pakket nog niet op npm staat, installeert u het rechtstreeks vanuit GitHub, vastmakend aan een specifieke commit-hash:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Vervang `<commit-hash>` door de commit die u wilt targeten.

## API-overzicht

De hooks zijn georganiseerd in functionele categorieën. Hieronder vindt u een overzicht van de meest gebruikte haken per categorie. Voor volledige handtekeningen, parameters en retourtypen, zie de [volledige API-referentie op GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Accounts

Beheer lokale gebruikersaccounts, identiteit en instellingen.

- `useAccount(accountName?)` -- retourneert het actieve (of benoemde) accountobject
- `useAccounts()` -- retourneert alle lokaal opgeslagen accounts
- `useAccountComments(options?)` -- retourneert opmerkingen die zijn gepubliceerd door het actieve account

### Opmerkingen

Ophalen en communiceren met individuele opmerkingen en discussies.

- `useComment(commentCid?)` -- haalt één opmerking op via zijn CID
- `useComments(commentCids?)` -- haalt meerdere opmerkingen op in batch
- `useEditedComment(comment?)` -- retourneert de laatst bewerkte versie van een opmerking

### Communities

Haal metagegevens en instellingen van de community op.

- `useSubplebbit(subplebbitAddress?)` -- haalt een community op op adres
- `useSubplebbits(subplebbitAddresses?)` -- haalt meerdere op communities
- `useSubplebbitStats(subplebbitAddress?)` -- retourneert het aantal abonnees en berichten

### Auteurs

Zoek auteursprofielen en metagegevens op.

- `useAuthor(authorAddress?)` -- haalt een auteursprofiel op
- `useAuthorComments(options?)` -- retourneert opmerkingen van een specifieke auteur
- `useResolvedAuthorAddress(authorAddress?)` -- zet een door mensen leesbaar adres (bijvoorbeeld ENS) om naar het protocoladres

### Feeds

Abonneer je op inhoudsfeeds en pagineer deze.

- `useFeed(options?)` -- retourneert een gepagineerde feed met berichten van een of meer communities
- `useBufferedFeeds(feedOptions?)` -- buffert meerdere feeds vooraf voor snellere weergave
- `useAuthorFeed(authorAddress?)` -- retourneert een feed met berichten van een specifieke auteur

### Acties

Publiceer inhoud en voer schrijfbewerkingen uit.

- `usePublishComment(options?)` -- publiceer een nieuwe reactie of antwoord
- `usePublishVote(options?)` -- breng een positieve of negatieve stem uit
- `useSubscribe(options?)` -- schrijf je in of uit bij een community

### States en RPC

Bewaak de verbindingsstatus en communiceer met een externe Bitsocial-daemon.

- `useClientsStates(options?)` -- retourneert de verbindingsstatus van IPFS/pubsub-clients
- `usePlebbitRpcSettings()` -- retourneert de huidige RPC-daemonconfiguratie

## Ontwikkeling

Om lokaal aan de hooks-bibliotheek te werken:

**Vereisten:** Node.js, Corepack ingeschakeld, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Raadpleeg de README-repository voor testen en bouwen commando's.

## Links

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licentie:** Alleen GPL-2.0
