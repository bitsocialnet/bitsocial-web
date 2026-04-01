---
title: Tillatelsesløs offentlig RPC
description: Foreslått design for en offentlig Bitsocial RPC-tjeneste med isolerte brukere, scoped-tillatelser og fellesskapseierskap.
---

# Tillatelsesløs offentlig RPC

Det opprinnelige offentlige RPC-forslaget levde som en GitHub-utgave skrevet i gammel plebbit-terminologi. Denne siden omskriver ideen på Bitsocial-språket og rammer den inn som et forslag på produktnivå i stedet for en vegg med implementeringsdetaljer.

## Klarspråksmål

Bitsocial Forge kan kjøre en offentlig RPC-tjeneste som lar mange brukere administrere sine egne Bitsocial-fellesskap eksternt, uten å gjøre operatøren om til en forvalter av disse fellesskapene.

Tjenesten skal gjøre mobile og lette klienter praktiske og samtidig bevare tre begrensninger:

1. Brukere holder seg isolert fra hverandre som standard.
2. Tillatelser forblir eksplisitte og detaljerte.
3. Kompatibilitet med gjeldende RPC-forespørsel og svarform kan bevares under utrulling.

## Hvilket problem det løser

I dag er den enkleste RPC-modellen vanligvis alt-eller-ingenting: én auth-nøkkel, ett autoritetsdomene, full tilgang. Det fungerer for en enkelt operatør, men ikke for en offentlig flerbrukertjeneste.

En tillatelsesløs offentlig RPC trenger en sterkere modell:

- én tjeneste kan være vert for mange brukere
- hver bruker får sine egne fellesskap og grenser
- operatørdefinerte retningslinjer kan forhindre misbruk
- brukeren kan fortsatt flytte eller være vert for seg selv senere

## Kjernemodell

### Brukere

Hver bruker får en autentiseringslegitimasjon pluss en tillatelsespakke.

### Fellesskap

Fellesskap opprettet gjennom tjenesten tilordnes en eierpost. Eierskap spores eksplisitt slik at administrasjonsmetoder kan dekkes til rett bruker.

### Tillatelser

Tillatelser er kapasitetsbaserte. I stedet for én boolsk for "kan bruke RPC", kan serveren kontrollere:

- hvor mange fellesskap en bruker kan opprette
- hvilke styringsmetoder som er tilgjengelige
- hvilke publiseringsoperasjoner som er tillatt
- hvilke takstgrenser som gjelder
- hvilke admin-flater som er synlige

### Admin overflate

Den offentlige RPC-en selv bør holde fokus på brukervendt RPC-atferd. Administrative oppgaver som brukeroppretting, eierskapsoverføring og revisjonsgjennomgang hører hjemme i et eget operatør-API og dashbord.

## Kompatibilitetsholdning

Brukervendt dokumentasjon bør bruke Bitsocial-termer som **fellesskap** og **profil**.

På ledningsnivå kan den første utrullingen fortsatt bevare den nåværende JSON-RPC-transport- og nyttelastformen der det er nyttig for kompatibilitet. Med andre ord: dokumentene trenger ikke lenger å snakke som gamle plebbit-dokumenter, selv om overgangsperioden beholder noen eldre metodenavn eller forespørselsformer bak kulissene.

## Foreslått tillatelsespakke

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

De nøyaktige metodenavnene er illustrative. Den viktige delen er formen på policyen: individuelle evner kontrolleres uavhengig i stedet for å samles i ett superbrukertoken.

## Tilkoblingsflyt

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Tillatelsesbevissthet bør forbli valgfritt. En klient som ignorerer varselet kan fortsatt oppføre seg korrekt ved å håndtere standard autorisasjonsfeil fra serveren.

## Eierskapshåndhevelse

Når tjenesten oppretter et fellesskap, skal den automatisk tildele eierskap til den som ringer. Derfra:

- fellesskapsstart-, -stopp-, redigerings- og slettingshandlinger har eieromfang
- Liste- og abonnementssvar er standard til innringerens egne fellesskap
- bredere synlighet er en eksplisitt administratortillatelse, ikke en standard

En kantsak betyr mye: hvis en bruker abonnerer på et fellesskap de **ikke** eier, må serveren bare avsløre den offentlige tilstanden som enhver ekstern observatør bør se. Kun eierkonfigurasjon eller interne kjøretidsdata skal aldri lekke gjennom et abonnements-API.

## Foreslått operatøroverflate

Admin API kan forbli kjedelig og eksplisitt:

- liste brukere
- inspisere én bruker
- opprette eller oppdatere brukere
- slette brukere
- overføre fellesskapets eierskap
- inspisere revisjonslogger

Autentisering for denne operatør-API-en bør være helt atskilt fra sluttbruker-RPC-autentisering.

## Utrullingsfaser

### Fase 1

- etablere den offentlige RPC-prosjektstrukturen
- legge til brukeroppføringer og eierskapssporing
- gaffel eller utvide gjeldende RPC-server

### Fase 2

- implementere tillatelsespakker
- håndheve dem på RPC-metodelaget
- returner tillatelser metadata ved tilkobling

### Fase 3

- legg til operatør-API
- legge til revisjonslogging
- legg til admin-autentisering

### Fase 4

- send admin-dashbordet
- teste overgrepskontroller
- stramme takstbegrensninger og lagringskvoter

## Åpne spørsmål

### Spam for godkjenning av legitimasjon

Hvis oppretting av autentisering er billig, kan offentlige tjenester trenge et utfordringslag før de utsteder legitimasjon. En mulig vei er å gjenbruke selve samfunnsutfordringsmodellen, slik at utstedelse av legitimasjon arver den samme anti-misbruksfilosofien som resten av nettverket.

### Eldre navngivning

Noen tidlige implementeringer kan fortsatt avsløre eldre metodenavn internt for kompatibilitet. Det bør behandles som en migrasjonsdetalj, ikke som det permanente offentlige vokabularet til Bitsocial-dokumenter.

## Sammendrag

Dette forslaget handler egentlig om én ting: å gjøre offentlig RPC-infrastruktur nyttig uten å gjøre den forvaringspliktig. En god offentlig Bitsocial RPC skal føles som valgfri assistanse for å drive fellesskap, ikke som en ny sentral plattform som tar tilbake eierskapet gjennom bakdøren.
