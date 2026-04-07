---
title: RPC publike pa leje
description: Dizajni i propozuar për një shërbim publik RPC Bitsocial me përdorues të izoluar, leje me shtrirje dhe pronësi të komunitetit.
---

# RPC publike pa leje

Propozimi origjinal publik RPC jetoi si një çështje e GitHub e shkruar në terminologjinë e vjetër plebbit. Kjo faqe e rishkruan atë ide në gjuhën Bitsocial dhe e kornizon atë si një propozim të nivelit të produktit në vend të një muri detajesh zbatimi.

## Qëllimi në gjuhë të thjeshtë

[Bitsocial Forge](https://bitsocialforge.com) mund të ekzekutojë një shërbim publik RPC që lejon shumë përdorues të menaxhojnë komunitetet e tyre Bitsocial nga distanca, pa e kthyer operatorin në një kujdestar të atyre komuniteteve.

Shërbimi duhet t'i bëjë klientët e lëvizshëm dhe me peshë të lehtë praktike duke ruajtur tre kufizime:

1. Përdoruesit qëndrojnë të izoluar nga njëri-tjetri si parazgjedhje.
2. Lejet qëndrojnë të qarta dhe të qarta.
3. Përputhshmëria me kërkesën aktuale RPC dhe formën e përgjigjes mund të ruhet gjatë prezantimit.

## Çfarë problemi zgjidh

Sot, modeli më i thjeshtë RPC është zakonisht gjithçka ose asgjë: një çelës auth, një domen autoriteti, akses i plotë. Kjo funksionon për një operator të vetëm, por jo për një shërbim publik me shumë përdorues.

Një RPC publike pa leje ka nevojë për një model më të fortë:

- një shërbim mund të presë shumë përdorues
- çdo përdorues merr komunitetet dhe kufijtë e tij
- politikat e përcaktuara nga operatori mund të parandalojnë abuzimin
- përdoruesi ende mund të largohet ose të vetë-strehojë më vonë

## Modeli kryesor

### Përdoruesit

Çdo përdorues merr një kredenciale të vërtetimit plus një paketë leje.

### Komunitetet

Komunitetet e krijuara përmes shërbimit caktohen në një regjistrim pronari. Pronësia gjurmohet në mënyrë eksplicite në mënyrë që metodat e menaxhimit të mund të shtrihen tek përdoruesi i duhur.

### Lejet

Lejet janë të bazuara në aftësi. Në vend të një boolean për "mund të përdorë RPC", serveri mund të kontrollojë:

- sa komunitete mund të krijojë një përdorues
- cilat metoda menaxhimi janë në dispozicion
- çfarë operacionesh publikimi lejohen
- çfarë kufijsh normash zbatohen
- cilat sipërfaqe admin janë të dukshme

### Sipërfaqja admin

Vetë RPC-ja publike duhet të qëndrojë e fokusuar në sjelljen e RPC-së që përballet me përdoruesit. Detyrat administrative si krijimi i përdoruesit, transferimi i pronësisë dhe rishikimi i auditimit i përkasin një API të veçantë operatori dhe paneli kontrollues.

## Qëndrimi i përputhshmërisë

Dokumentacioni i përdoruesit duhet të përdorë terma Bitsocial si **komuniteti** dhe **profili**.

Në nivelin e telit, prezantimi i parë mund të ruajë ende formën aktuale të transportit dhe ngarkesës JSON-RPC, ku kjo është e dobishme për pajtueshmërinë. Me fjalë të tjera: dokumentet nuk kanë më nevojë të flasin si dokumente të vjetra plebbit, edhe nëse periudha e tranzicionit ruan disa emra metodash të trashëguara ose forma të kërkesave në prapaskenë.

## Paketa e propozuar e lejeve

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

Emrat e saktë të metodave janë ilustruese. Pjesa e rëndësishme është forma e politikës: aftësitë individuale kontrollohen në mënyrë të pavarur në vend që të bashkohen në një shenjë superpërdoruesi.

## Rrjedha e lidhjes

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Ndërgjegjësimi për lejet duhet të mbetet opsional. Një klient që injoron njoftimin mund të sillet ende saktë duke trajtuar dështimet standarde të autorizimit nga serveri.

## Zbatimi i pronësisë

Kur shërbimi krijon një komunitet, ai duhet t'i caktojë automatikisht pronësinë përdoruesit që telefonon. Nga atje:

- Veprimet e fillimit, ndalimit, modifikimit dhe fshirjes së komunitetit janë të shtrira nga zotëruesi
- lista dhe përgjigjet e abonimit janë të paracaktuara në komunitetet e vetë telefonuesit
- dukshmëria më e gjerë është një leje e qartë e administratorit, jo një parazgjedhje

Një rast ka shumë rëndësi: nëse një përdorues pajtohet në një komunitet që **nuk e zotëron**, serveri duhet të ekspozojë vetëm gjendjen publike që çdo vëzhgues i jashtëm duhet ta shohë. Konfigurimi vetëm për pronarët ose të dhënat e brendshme të kohës së ekzekutimit nuk duhet të rrjedhin kurrë përmes një API të abonimit.

## Sipërfaqja e sugjeruar e operatorit

API-ja e administratorit mund të mbetet e mërzitshme dhe e qartë:

- listën e përdoruesve
- inspektoni një përdorues
- krijoni ose përditësoni përdoruesit
- fshini përdoruesit
- transferimi i pronësisë së komunitetit
- inspektoni regjistrat e auditimit

Autentifikimi për këtë API të operatorit duhet të jetë plotësisht i ndarë nga vërtetimi RPC i përdoruesit fundor.

## Fazat e paraqitjes

### Faza 1

- krijimin e strukturës publike të projektit RPC
- shtoni të dhënat e përdoruesve dhe ndjekjen e pronësisë
- fork ose zgjeroni serverin aktual RPC

### Faza 2

- implementoni paketat e lejeve
- zbatojini ato në shtresën e metodës RPC
- ktheni të dhënat meta të lejeve në lidhje

### Faza 3

- shtoni API-në e operatorit
- shtoni regjistrimin e auditimit
- shtoni vërtetimin e administratorit

### Faza 4

- dërgoni pultin e administratorit
- testoni kontrollet e abuzimit
- shtrëngimi i kuotave të kufizimit dhe ruajtjes së tarifave

## Pyetje të hapura

### Vërtetoni kredencialet e bezdisshme

Nëse krijimi i autoritetit është i lirë, shërbimet publike mund të kenë nevojë për një shtresë sfiduese përpara se të lëshojnë kredencialet. Një rrugë e mundshme është ripërdorimi i vetë modelit të sfidës së komunitetit, kështu që lëshimi i kredencialeve të trashëgojë të njëjtën filozofi kundër abuzimit si pjesa tjetër e rrjetit.

### Emërtimi i trashëgimisë

Disa implementime të hershme mund t'i ekspozojnë ende emrat e metodave të vjetra nga brenda për pajtueshmëri. Ky duhet të trajtohet si një detaj migrimi, jo si fjalor i përhershëm publik i dokumenteve Bitsocial.

## Përmbledhje

Ky propozim ka të bëjë me një gjë: bërjen e infrastrukturës publike RPC të dobishme pa e bërë atë të kujdesshme. Një RPC e mirë publike Bitsocial duhet të ndihet si ndihmë opsionale për drejtimin e komuniteteve, jo si një platformë e re qendrore që rimerr pronësinë nga dera e pasme.
