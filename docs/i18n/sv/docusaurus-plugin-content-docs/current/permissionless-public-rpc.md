---
title: Tillståndslös offentlig RPC
description: Föreslagen design för en offentlig Bitsocial RPC-tjänst med isolerade användare, omfångade behörigheter och gemenskapsägande.
---

# Tillståndslös offentlig RPC

Det ursprungliga offentliga RPC-förslaget levde som ett GitHub-nummer skrivet med gammal plebbit-terminologi. Den här sidan skriver om den idén på Bitsocial-språket och ramar in den som ett förslag på produktnivå istället för en vägg med implementeringsdetaljer.

## Klarspråksmål

[Bitsocial Forge](https://bitsocialforge.com) kan köra en offentlig RPC-tjänst som låter många användare hantera sina egna Bitsocial-gemenskaper på distans, utan att göra operatören till en väktare av dessa gemenskaper.

Tjänsten ska göra mobila och lätta kunder praktiska samtidigt som tre begränsningar bevaras:

1. Användare förblir isolerade från varandra som standard.
2. Behörigheterna förblir explicita och detaljerade.
3. Kompatibilitet med den aktuella RPC-begäran och svarsformen kan bevaras under utrullningen.

## Vilket problem det löser

Idag är den enklaste RPC-modellen vanligtvis allt-eller-inget: en auth-nyckel, en auktoritetsdomän, full åtkomst. Det fungerar för en enda operatör men inte för en offentlig fleranvändartjänst.

En tillståndslös offentlig RPC behöver en starkare modell:

- en tjänst kan vara värd för många användare
- varje användare får sina egna gemenskaper och gränser
- operatörsdefinierade policyer kan förhindra missbruk
- användaren kan fortfarande flytta eller själv vara värd senare

## Kärnmodell

### Användare

Varje användare får en autentiseringsinformation plus ett behörighetspaket.

### gemenskaper

Gemenskaper som skapas genom tjänsten tilldelas en ägarpost. Ägarskap spåras explicit så att hanteringsmetoder kan omfångas till rätt användare.

### Behörigheter

Behörigheterna är kapacitetsbaserade. Istället för en boolean för "kan använda RPC" kan servern kontrollera:

- hur många gemenskaper en användare kan skapa
- vilka hanteringsmetoder som finns
- vilka publiceringsåtgärder som är tillåtna
- vilka taxegränser som gäller
- vilka administratörsytor som är synliga

### Admin yta

Själva den offentliga RPC:n bör vara fokuserad på användarinriktat RPC-beteende. Administrativa uppgifter såsom skapande av användare, överföring av ägande och granskning hör hemma i ett separat operatörs-API och instrumentpanel.

## Kompatibilitetshållning

Användarvänd dokumentation bör använda Bitsocial-termer som **community** och **profil**.

På trådnivå kan den första utrullningen fortfarande bevara den nuvarande JSON-RPC-transport- och nyttolastformen där det är användbart för kompatibilitet. Med andra ord: docs behöver inte längre prata som gamla plebbit docs, även om övergångsperioden behåller några äldre metodnamn eller begär former bakom kulisserna.

## Föreslagen tillståndspaket

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

De exakta metodnamnen är illustrativa. Den viktiga delen är formen på policyn: individuella funktioner styrs oberoende av varandra istället för att samlas i en superanvändartoken.

## Anslutningsflöde

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Medvetenhet om tillstånd bör vara valfritt. En klient som ignorerar meddelandet kan fortfarande agera korrekt genom att hantera standardauktoriseringsfel från servern.

## Genomförande av äganderätt

När tjänsten skapar en gemenskap bör den automatiskt tilldela äganderätten till den uppringande användaren. Därifrån:

- Åtgärder för att starta, stoppa, redigera och ta bort communityn är ägande
- list- och prenumerationssvar som standard till uppringarens egna gemenskaper
- bredare synlighet är en explicit administratörsbehörighet, inte en standard

Ett kantfall spelar stor roll: om en användare prenumererar på en gemenskap som de **inte** äger, måste servern bara avslöja den offentliga tillstånd som alla utomstående observatörer borde se. Konfiguration av enbart ägare eller interna körtidsdata bör aldrig läcka genom ett prenumerations-API.

## Föreslagen operatörsyta

Admin API kan förbli tråkigt och tydligt:

- lista användare
- inspektera en användare
- skapa eller uppdatera användare
- ta bort användare
- överföra äganderätten till samhället
- inspektera revisionsloggar

Autentisering för detta operatörs-API bör vara helt skild från slutanvändarens RPC-autentisering.

## Utbyggnadsfaser

### Fas 1

- upprätta den offentliga RPC-projektstrukturen
- lägga till användaruppgifter och spårning av ägande
- dela eller utöka den nuvarande RPC-servern

### Fas 2

- implementera tillståndspaket
- upprätthålla dem i RPC-metodlagret
- returnera behörighetsmetadata vid anslutning

### Fas 3

- lägg till operatörens API
- lägg till revisionsloggning
- lägg till administratörsautentisering

### Fas 4

- skicka admin-instrumentpanelen
- testa missbrukskontroller
- skärpa hastighetsbegränsningar och lagringskvoter

## Öppna frågor

### Autentiseringsuppgifter spam

Om det är billigt att skapa autentiseringar kan offentliga tjänster behöva ett utmaningslager innan de utfärdar autentiseringsuppgifter. En möjlig väg är att återanvända själva community-utmaningsmodellen så att legitimationsutfärdande ärver samma antimissbruksfilosofi som resten av nätverket.

### Äldre namngivning

Vissa tidiga implementeringar kan fortfarande exponera äldre metodnamn internt för kompatibilitet. Det bör behandlas som en migrationsdetalj, inte som den permanenta offentliga vokabulären för Bitsocial docs.

## Sammanfattning

Detta förslag handlar egentligen om en sak: att göra den offentliga RPC-infrastrukturen användbar utan att göra den vårdande. En bra offentlig Bitsocial RPC borde kännas som valfri hjälp för att driva gemenskaper, inte som en ny central plattform som återtar ägandet genom bakdörren.
