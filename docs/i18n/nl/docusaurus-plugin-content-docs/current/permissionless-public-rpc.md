---
title: Toestemmingsloze openbare RPC
description: Voorgesteld ontwerp voor een openbare Bitsocial RPC-service met geïsoleerde gebruikers, beperkte machtigingen en gemeenschapseigendom.
---

# Toestemmingsloze openbare RPC

Het oorspronkelijke openbare RPC-voorstel leefde als een GitHub-probleem, geschreven in oude plebbit-terminologie. Deze pagina herschrijft dat idee in Bitsocial-taal en kadert het als een voorstel op productniveau in plaats van een muur van implementatiedetails.

## Doel in duidelijke taal

Bitsocial Forge kan een openbare RPC-service uitvoeren waarmee veel gebruikers hun eigen Bitsocial-gemeenschappen op afstand kunnen beheren, zonder dat de operator een bewaarder van die gemeenschappen wordt.

De service moet mobiele en lichtgewicht clients praktisch maken met behoud van drie beperkingen:

1. Gebruikers blijven standaard van elkaar geïsoleerd.
2. Rechten blijven expliciet en gedetailleerd.
3. Compatibiliteit met de huidige RPC-aanvraag en -antwoordvorm kan tijdens de implementatie behouden blijven.

## Welk probleem het oplost

Tegenwoordig is het eenvoudigste RPC-model meestal alles-of-niets: één auth-sleutel, één autoriteitsdomein, volledig toegang. Dat werkt voor een enkele operator, maar niet voor een openbare service voor meerdere gebruikers.

Een toestemmingsloze openbare RPC heeft een sterker model nodig:

- één service kan veel gebruikers hosten
- elke gebruiker krijgt zijn eigen community's en limieten
- door de operator gedefinieerd beleid kan misbruik voorkomen
- de gebruiker kan nog steeds weggaan of zichzelf later hosten

## Kern model

### Gebruikers

Elke gebruiker krijgt een auth-referentie plus een machtigingsbundel.

### Gemeenschappen

Communities die via de service zijn gemaakt, worden toegewezen aan een eigenaarrecord. Eigendom wordt expliciet bijgehouden, zodat beheermethoden kunnen worden afgestemd op de juiste gebruiker.

### Machtigingen

Machtigingen zijn gebaseerd op mogelijkheden. In plaats van één booleaanse waarde voor 'kan de RPC gebruiken', kan de server bepalen:

- hoeveel community's een gebruiker kan maken
- welke beheermethoden beschikbaar zijn
- welke publicatiebewerkingen zijn toegestaan
- welke tarieflimieten van toepassing zijn
- welke beheerdersoppervlakken zichtbaar zijn

### Beheerdersoppervlak

De openbare RPC zelf moet gefocust blijven op gebruikersgerichte RPC gedrag. Administratieve taken zoals het aanmaken van gebruikers, eigendomsoverdracht en auditbeoordeling horen thuis in een aparte operator-API en dashboard.

## Compatibiliteitshouding

Gebruikersgerichte documentatie zou Bitsocial-termen moeten gebruiken zoals **community** en **profiel**.

Op draadniveau kan de eerste implementatie nog steeds de huidige JSON-RPC-transport- en payload-vorm behouden waar dat nuttig is voor compatibiliteit. Met andere woorden: de documenten hoeven niet langer te praten als oude plebbit-documenten, zelfs als de overgangsperiode enkele verouderde methodenamen behoudt of achter de schermen om vormen vraagt.

## Voorgestelde toestemmingsbundel

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

De exacte methodenamen zijn ter illustratie. Het belangrijkste onderdeel is de vorm van het beleid: individuele mogelijkheden worden onafhankelijk beheerd in plaats van gebundeld in één superuser-token.

## Verbindingsstroom

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Bewustzijn van rechten moet optioneel blijven. Een client die de melding negeert, kan zich nog steeds correct gedragen door standaard autorisatiefouten van de server af te handelen.

## Eigendomsafdwinging

Wanneer de service een community aanmaakt, moet deze automatisch het eigendom toewijzen aan de bellende gebruiker. Vanaf daar:

- acties voor het starten, stoppen, bewerken en verwijderen van de community zijn op de eigenaar afgestemd
- lijst- en abonnementsreacties worden standaard ingesteld op de eigen community's van de beller
- bredere zichtbaarheid is een expliciete beheerderstoestemming, geen standaard

Eén randgeval doet er veel toe: als een gebruiker zich abonneert op een community waarvan hij **niet** de eigenaar is, mag de server alleen de publieke status weergeven die elke externe waarnemer zou moeten zien. Configuratie die alleen voor de eigenaar is of interne runtimegegevens mogen nooit via een abonnements-API lekken.

## Voorgesteld operatoroppervlak

De beheerders-API kan saai en expliciet blijven:

- lijst gebruikers
- inspecteer één gebruiker
- maak of update gebruikers
- verwijder gebruikers
- draag gemeenschapseigendom over
- inspecteer audit logs

Authenticatie voor deze operator-API moet volledig gescheiden zijn van RPC-authenticatie voor eindgebruikers.

## Uitrolfasen

### Fase 1

- de openbare RPC-projectstructuur opzetten
- gebruikersrecords toevoegen en eigendom bijhouden
- de huidige RPC-server afsplitsen of uitbreiden

### Fase 2

- machtigingenbundels implementeren
- ze afdwingen op de RPC-methodelaag
- metagegevens van machtigingen retourneren connect

### Fase 3

- voeg de operator-API toe
- voeg auditregistratie toe
- voeg beheerdersauthenticatie toe

### Fase 4

- verzend het beheerdersdashboard
- test misbruikcontroles
- scherpte snelheidslimieten en opslagquota aan

## Open vragen

### Auth-inloggegevens spam

Als het aanmaken van auth-authenticatie goedkoop is, hebben publieke diensten mogelijk een uitdagingslaag nodig voordat zij inloggegevens kunnen uitgeven. Eén mogelijke route is het hergebruiken van het community-uitdagingsmodel zelf, zodat de uitgifte van referenties dezelfde anti-misbruikfilosofie overneemt als de rest van het netwerk.

### Oude naamgeving

Sommige vroege implementaties kunnen nog steeds verouderde methodenamen intern vrijgeven voor compatibiliteit. Dat moet worden behandeld als een migratiedetail, niet als het permanente openbare vocabulaire van Bitsocial-documenten.

## Samenvatting

Dit voorstel gaat eigenlijk over één ding: de openbare RPC-infrastructuur bruikbaar maken zonder deze in bewaring te nemen. Een goede openbare Bitsocial RPC zou moeten aanvoelen als optionele hulp voor het runnen van communities, niet als een nieuw centraal platform dat via de achterdeur het eigendom terugwint.
