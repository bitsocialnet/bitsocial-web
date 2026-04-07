---
title: Toestemmingsloze openbare RPC
description: Voorgesteld ontwerp voor een openbare Bitsocial RPC-service met geïsoleerde gebruikers, beperkte machtigingen en gemeenschapseigendom.
---

# Toestemmingsloze openbare RPC

Op deze pagina wordt de openbare RPC geframed als een Bitsocial-voorstel op productniveau in plaats van als een muur van implementatiedetails.

## Doel in duidelijke taal

[Bitsocial Forge](https://bitsocialforge.com) kan een openbare RPC-service uitvoeren waarmee veel gebruikers hun eigen Bitsocial-gemeenschappen op afstand kunnen beheren, zonder dat de operator een beheerder van die gemeenschappen wordt.

De dienst moet mobiele en lichtgewicht clients praktisch maken, met behoud van drie beperkingen:

1. Gebruikers blijven standaard van elkaar geïsoleerd.
2. Machtigingen blijven expliciet en gedetailleerd.
3. Compatibiliteit met de huidige RPC-aanvraag en -antwoordvorm kan tijdens de implementatie behouden blijven.

## Welk probleem het oplost

Tegenwoordig is het eenvoudigste RPC-model meestal alles-of-niets: één auth-sleutel, één autoriteitsdomein, volledige toegang. Dat werkt voor één operator, maar niet voor een openbare dienst voor meerdere gebruikers.

Een toestemmingsloze openbare RPC heeft een sterker model nodig:

- één service kan veel gebruikers hosten
- elke gebruiker krijgt zijn eigen community's en limieten
- Door de operator gedefinieerd beleid kan misbruik voorkomen
- de gebruiker kan later nog steeds verhuizen of zelf hosten

## Kernmodel

### Gebruikers

Elke gebruiker krijgt een verificatiereferentie plus een machtigingsbundel.

### Gemeenschappen

Community's die via de service zijn gemaakt, worden toegewezen aan een eigenaarrecord. Het eigendom wordt expliciet bijgehouden, zodat de beheermethoden op de juiste gebruiker kunnen worden afgestemd.

### Machtigingen

Machtigingen zijn gebaseerd op mogelijkheden. In plaats van één booleaanse waarde voor ‘kan de RPC gebruiken’, kan de server het volgende beheren:

- hoeveel communities een gebruiker kan maken
- welke managementmethoden beschikbaar zijn
- welke publicatiebewerkingen zijn toegestaan
- welke tarieflimieten gelden
- welke beheerdersoppervlakken zichtbaar zijn

### Beheeroppervlak

De publieke RPC zelf moet gefocust blijven op het gebruikersgerichte RPC-gedrag. Administratieve taken zoals het aanmaken van gebruikers, eigendomsoverdracht en auditbeoordeling horen thuis in een aparte operator-API en dashboard.

## Compatibiliteitshouding

In gebruikersgerichte documentatie moeten Bitsocial-termen worden gebruikt, zoals **community** en **profiel**.

Op draadniveau kan bij de eerste uitrol nog steeds de huidige JSON-RPC-transport- en payload-vorm behouden blijven, waar dat nuttig is voor de compatibiliteit. Met andere woorden: de documenten kunnen Bitsocial-native blijven, zelfs als de overgangsperiode enkele compatibiliteitsgerichte methodenamen behoudt of achter de schermen om vormen vraagt.

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

De exacte namen van de methoden zijn illustratief. Het belangrijkste onderdeel is de vorm van het beleid: individuele mogelijkheden worden onafhankelijk beheerd in plaats van gebundeld in één superuser-token.

## Verbindingsstroom

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Toestemmingsbewustzijn moet optioneel blijven. Een client die de melding negeert, kan zich nog steeds correct gedragen door standaard autorisatiefouten van de server af te handelen.

## Handhaving van eigendom

Wanneer de service een community creëert, moet deze het eigendom automatisch toewijzen aan de bellende gebruiker. Vanaf daar:

- acties voor het starten, stoppen, bewerken en verwijderen van de community zijn eigendom van de eigenaar
- lijst- en abonnementsreacties zijn standaard ingesteld op de eigen community's van de beller
- bredere zichtbaarheid is een expliciete beheerderstoestemming, geen standaard

Eén randgeval doet er veel toe: als een gebruiker zich abonneert op een community waarvan hij **niet** de eigenaar is, mag de server alleen de publieke status weergeven die elke externe waarnemer zou moeten zien. Configuratie- of interne runtimegegevens die alleen voor de eigenaar gelden, mogen nooit via een abonnements-API lekken.

## Aanbevolen operatoroppervlak

De admin-API kan saai en expliciet blijven:

- lijst met gebruikers
- één gebruiker inspecteren
- gebruikers aanmaken of bijwerken
- gebruikers verwijderen
- gemeenschapseigendom overdragen
- auditlogboeken inspecteren

Authenticatie voor deze operator-API moet volledig gescheiden zijn van de RPC-authenticatie van de eindgebruiker.

## Uitrolfasen

### Fase 1

- het opzetten van de publieke RPC-projectstructuur
- voeg gebruikersrecords en eigendomsregistratie toe
- fork of breid de huidige RPC-server uit

### Fase 2

- machtigingsbundels implementeren
- dwing ze af op de RPC-methodelaag
- retourneer metagegevens van machtigingen bij verbinding

### Fase 3

- voeg de operator-API toe
- auditlogboek toevoegen
- beheerdersauthenticatie toevoegen

### Fase 4

- verzend het beheerdersdashboard
- misbruikcontroles testen
- verscherp de snelheidsbeperkingen en opslagquota

## Open vragen

### Spam met verificatiegegevens

Als het creëren van authenticatie goedkoop is, hebben publieke diensten mogelijk een uitdagingslaag nodig voordat ze inloggegevens uitgeven. Eén mogelijke route is het hergebruiken van het community challenge-model zelf, zodat de uitgifte van legitimatiebewijzen dezelfde anti-misbruikfilosofie overneemt als de rest van het netwerk.

### Migratiedetails

Sommige vroege implementaties kunnen intern nog steeds compatibiliteitsgerichte methodenamen bevatten. Dat moet worden behandeld als een migratiedetail, niet als het permanente openbare vocabulaire van Bitsocial-documenten.

## Samenvatting

Dit voorstel gaat eigenlijk maar over één ding: de openbare RPC-infrastructuur nuttig maken zonder deze in bewaring te nemen. Een goede openbare Bitsocial RPC zou moeten aanvoelen als optionele hulp voor het runnen van communities, niet als een nieuw centraal platform dat via de achterdeur het eigendom terugwint.
