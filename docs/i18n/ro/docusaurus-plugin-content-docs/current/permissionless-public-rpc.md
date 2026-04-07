---
title: RPC public fără permisiune
description: Proiectare propusă pentru un serviciu public Bitsocial RPC cu utilizatori izolați, permisiuni definite și proprietatea comunității.
---

# RPC public fără permisiune

Propunerea publică inițială RPC a trăit ca o problemă GitHub scrisă în terminologia veche de plebbit. Această pagină rescrie ideea în limbajul Bitsocial și o încadrează ca o propunere la nivel de produs în loc de un zid de detalii de implementare.

## Obiectiv în limbaj simplu

[Bitsocial Forge](https://bitsocialforge.com) poate rula un serviciu public RPC care permite multor utilizatori să-și gestioneze propriile comunități Bitsocial de la distanță, fără a transforma operatorul într-un custode al acelor comunități.

Serviciul ar trebui să facă clienții mobili și ușori practici, păstrând în același timp trei constrângeri:

1. Utilizatorii rămân izolați unul de celălalt în mod implicit.
2. Permisiunile rămân explicite și granulare.
3. Compatibilitatea cu cererea RPC curentă și forma răspunsului poate fi păstrată în timpul lansării.

## Ce problema rezolva

Astăzi, cel mai simplu model RPC este de obicei totul sau nimic: o cheie de autentificare, un domeniu de autoritate, acces complet. Asta funcționează pentru un singur operator, dar nu pentru un serviciu public multi-utilizator.

Un RPC public fără permisiune are nevoie de un model mai puternic:

- un serviciu poate găzdui mulți utilizatori
- fiecare utilizator are propriile comunități și limite
- politicile definite de operator pot preveni abuzurile
- utilizatorul poate să se îndepărteze sau să se autogăzduiască mai târziu

## Model de bază

### Utilizatori

Fiecare utilizator primește o autentificare plus un pachet de permisiuni.

### Comunități

Comunitățile create prin intermediul serviciului sunt atribuite unei înregistrări de proprietar. Proprietatea este urmărită în mod explicit, astfel încât metodele de gestionare să poată fi aplicate utilizatorului potrivit.

### Permisiuni

Permisiunile sunt bazate pe capabilități. În loc de un boolean pentru „poate folosi RPC”, serverul poate controla:

- câte comunități poate crea un utilizator
- ce metode de management sunt disponibile
- ce operațiuni de publicare sunt permise
- ce limite de rată se aplică
- ce suprafețe de administrare sunt vizibile

### Suprafata admin

RPC-ul public în sine ar trebui să rămână concentrat pe comportamentul RPC cu care se confruntă utilizatorii. Sarcinile administrative, cum ar fi crearea utilizatorilor, transferul proprietății și revizuirea auditului, aparțin unui API și tablou de bord separat al operatorului.

## Poziția de compatibilitate

Documentația adresată utilizatorilor ar trebui să utilizeze termeni Bitsocial, cum ar fi **comunitate** și **profil**.

La nivel de fir, prima lansare poate păstra în continuare transportul JSON-RPC și forma încărcăturii utile, acolo unde este util pentru compatibilitate. Cu alte cuvinte: documentele nu mai trebuie să vorbească ca vechii documente plebbit, chiar dacă perioada de tranziție păstrează în culise unele nume de metode moștenite sau forme de solicitare.

## Pachetul de permisiuni propus

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

Numele exacte ale metodelor sunt ilustrative. Partea importantă este forma politicii: capabilitățile individuale sunt controlate independent în loc să fie grupate într-un singur token de superutilizator.

## Fluxul conexiunii

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Conștientizarea permisiunii ar trebui să rămână opțională. Un client care ignoră notificarea se poate comporta în continuare corect prin gestionarea eșecurilor de autorizare standard de la server.

## Executarea dreptului de proprietate

Când serviciul creează o comunitate, ar trebui să atribuie automat dreptul de proprietate utilizatorului care apelează. De acolo:

- acțiunile de pornire, oprire, editare și ștergere ale comunității sunt deținute de proprietar
- Răspunsurile la listă și la abonament sunt implicite pentru propriile comunități ale apelantului
- o vizibilitate mai largă este o permisiune explicită de administrator, nu o permisiune implicită

Un caz limită contează foarte mult: dacă un utilizator se abona la o comunitate pe care **nu** o deține, serverul trebuie să expună doar starea publică pe care ar trebui să o vadă orice observator extern. Configurația exclusivă a proprietarului sau datele interne de rulare nu ar trebui să se scurgă niciodată printr-un API de abonament.

## Suprafata recomandata pentru operator

API-ul de administrare poate rămâne plictisitor și explicit:

- lista utilizatorilor
- inspectați un utilizator
- creați sau actualizați utilizatori
- ștergeți utilizatori
- transferă proprietatea comunității
- inspectați jurnalele de audit

Autentificarea pentru acest operator API ar trebui să fie complet separată de autentificarea RPC a utilizatorului final.

## Fazele de lansare

### Faza 1

- stabilirea structurii publice a proiectului RPC
- adăugați înregistrări ale utilizatorilor și urmărirea proprietății
- bifurcați sau extindeți serverul RPC actual

### Faza 2

- implementați pachete de permisiuni
- aplicați-le la nivelul metodei RPC
- returnează metadatele permisiunilor la conectare

### Faza 3

- adăugați operatorul API
- adăugați jurnalul de audit
- adăugați autentificare de administrator

### Faza 4

- trimiteți tabloul de bord administrativ
- testarea controalelor abuzului
- înăspriți limitarea ratei și cotele de stocare

## Întrebări deschise

### Autentificare spam cu acreditări

Dacă crearea de autentificare este ieftină, serviciile publice pot avea nevoie de un nivel de provocare înainte de a emite acreditări. O cale posibilă este reutilizarea modelului de provocare a comunității în sine, astfel încât emiterea acreditărilor să moștenească aceeași filozofie anti-abuz ca și restul rețelei.

### Denumire moștenită

Unele implementări timpurii pot expune în continuare nume de metode vechi în interior pentru compatibilitate. Acesta ar trebui tratat ca un detaliu de migrare, nu ca un vocabular public permanent al documentelor Bitsocial.

## Rezumat

Această propunere este într-adevăr despre un singur lucru: a face infrastructura publică RPC utilă fără a o face custodie. Un bun Bitsocial RPC public ar trebui să se simtă ca o asistență opțională pentru gestionarea comunităților, nu ca o nouă platformă centrală care își revendică proprietatea prin ușa din spate.
