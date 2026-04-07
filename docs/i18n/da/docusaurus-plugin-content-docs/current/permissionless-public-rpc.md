---
title: Tilladelsesløs offentlig RPC
description: Foreslået design til en offentlig Bitsocial RPC-tjeneste med isolerede brugere, scoped-tilladelser og fællesskabsejerskab.
---

# Tilladelsesløs offentlig RPC

Denne side rammer offentlig RPC som et Bitsocial-forslag på produktniveau i stedet for en mur med implementeringsdetaljer.

## Mål i almindeligt sprog

[Bitsocial Forge](https://bitsocialforge.com) kan køre en offentlig RPC-tjeneste, der lader mange brugere administrere deres egne Bitsocial-fællesskaber eksternt, uden at gøre operatøren til en administrator af disse fællesskaber.

Tjenesten skal gøre mobile og lette kunder praktiske og samtidig bevare tre begrænsninger:

1. Brugere forbliver som standard isoleret fra hinanden.
2. Tilladelser forbliver eksplicitte og detaljerede.
3. Kompatibilitet med den aktuelle RPC-anmodning og svarform kan bevares under udrulningen.

## Hvilket problem løser det

I dag er den enkleste RPC-model normalt alt-eller-intet: én godkendelsesnøgle, ét myndighedsdomæne, fuld adgang. Det fungerer for en enkelt operatør, men ikke for en offentlig flerbrugertjeneste.

En tilladelsesløs offentlig RPC har brug for en stærkere model:

- én tjeneste kan være vært for mange brugere
- hver bruger får deres egne fællesskaber og grænser
- operatørdefinerede politikker kan forhindre misbrug
- brugeren kan stadig flytte væk eller selv hoste senere

## Kernemodel

### Brugere

Hver bruger får en godkendelsesoplysninger plus en tilladelsespakke.

### Fællesskaber

Fællesskaber oprettet gennem tjenesten tildeles en ejerpost. Ejerskab spores eksplicit, så administrationsmetoder kan scopes til den rigtige bruger.

### Tilladelser

Tilladelser er kapacitetsbaserede. I stedet for en boolean for "kan bruge RPC'en", kan serveren styre:

- hvor mange fællesskaber en bruger kan oprette
- hvilke ledelsesmetoder der findes
- hvilke publiceringsoperationer er tilladt
- hvilke takstgrænser der gælder
- hvilke admin-flader der er synlige

### Admin overflade

Den offentlige RPC bør selv forblive fokuseret på brugervendt RPC-adfærd. Administrative opgaver såsom brugeroprettelse, ejerskabsoverførsel og revisionsgennemgang hører hjemme i et separat operatør-API og dashboard.

## Kompatibilitetsholdning

Brugervendt dokumentation bør bruge Bitsocial-udtryk som **fællesskab** og **profil**.

På ledningsniveau kan den første udrulning stadig bevare den nuværende JSON-RPC-transport- og nyttelastform, hvor det er nyttigt for kompatibilitet. Med andre ord: dokumenterne kan forblive Bitsocial-native, selvom overgangsperioden beholder nogle kompatibilitetsorienterede metodenavne eller anmodningsformer bag kulisserne.

## Foreslået tilladelsesbundt

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

De nøjagtige metodenavne er illustrative. Den vigtige del er formen på politikken: individuelle funktioner styres uafhængigt i stedet for at samles i ét superbruger-token.

## Tilslutningsflow

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Bevidsthed om tilladelser bør forblive valgfri. En klient, der ignorerer meddelelsen, kan stadig opføre sig korrekt ved at håndtere standardgodkendelsesfejl fra serveren.

## Håndhævelse af ejerskab

Når tjenesten opretter et fællesskab, bør den automatisk tildele ejerskab til den opkaldende bruger. Derfra:

- fællesskabets start-, stop-, redigerings- og slethandlinger er omfattet af ejeren
- Liste- og abonnementssvar er som standard den opkaldendes egne fællesskaber
- bredere synlighed er en eksplicit administratortilladelse, ikke en standard

En kant-case betyder meget: Hvis en bruger abonnerer på et fællesskab, de **ikke** ejer, må serveren kun afsløre den offentlige tilstand, som enhver ekstern observatør bør se. Konfiguration kun for ejer eller interne runtime-data bør aldrig lække gennem en abonnements-API.

## Foreslået operatøroverflade

Admin API kan forblive kedelig og eksplicit:

- liste brugere
- inspicere én bruger
- oprette eller opdatere brugere
- slette brugere
- overdrage fællesskabsejerskab
- inspicere revisionslogfiler

Godkendelse for denne operatør-API skal være fuldstændig adskilt fra slutbruger-RPC-godkendelse.

## Udrulningsfaser

### Fase 1

- etablere den offentlige RPC-projektstruktur
- tilføje brugerregistreringer og ejerskabssporing
- gaffel eller udvide den nuværende RPC-server

### Fase 2

- implementere tilladelsesbundter
- håndhæve dem ved RPC-metodelaget
- returner metadata om tilladelser ved forbindelse

### Fase 3

- tilføje operatør-API'en
- tilføje revisionslogning
- tilføje administratorgodkendelse

### Fase 4

- send admin-dashboardet
- teste misbrugskontrol
- stramme takstbegrænsning og lagerkvoter

## Åbne spørgsmål

### Godkend legitimationsoplysninger spam

Hvis oprettelse af godkendelse er billig, kan offentlige tjenester have brug for et udfordringslag, før de udsteder legitimationsoplysninger. En mulig vej er at genbruge selve samfundsudfordringsmodellen, så udstedelse af legitimationsoplysninger arver den samme anti-misbrugsfilosofi som resten af ​​netværket.

### Migrationsoplysninger

Nogle tidlige implementeringer kan stadig afsløre kompatibilitetsorienterede metodenavne internt. Det bør behandles som en migrationsdetalje, ikke som det permanente offentlige ordforråd for Bitsocial docs.

## Resumé

Dette forslag handler i virkeligheden om én ting: at gøre offentlig RPC-infrastruktur nyttig uden at gøre den frihedsberøvende. En god offentlig Bitsocial RPC burde føles som valgfri assistance til at drive fællesskaber, ikke som en ny central platform, der genvinder ejerskabet gennem bagdøren.
