---
title: Veřejné RPC bez povolení
description: Navrhovaný design pro veřejnou službu Bitsocial RPC s izolovanými uživateli, omezenými oprávněními a vlastnictvím komunity.
---

# Veřejné RPC bez povolení

Tato stránka rámuje veřejné RPC jako návrh Bitsocial na úrovni produktu namísto stěny detailů implementace.

## Cíl v prostém jazyce

[Bitsocial Forge](https://bitsocialforge.com) může provozovat veřejnou službu RPC, která umožňuje mnoha uživatelům vzdáleně spravovat své vlastní komunity Bitsocial, aniž by se provozovatel stal správcem těchto komunit.

Služba by měla učinit mobilní a nenáročné klienty praktickými při zachování tří omezení:

1. Uživatelé zůstávají ve výchozím nastavení vzájemně izolovaní.
2. Oprávnění zůstávají explicitní a podrobná.
3. Během zavádění lze zachovat kompatibilitu s aktuálním požadavkem RPC a tvarem odpovědi.

## Jaký problém to řeší

Dnes je nejjednodušším modelem RPC obvykle vše nebo nic: jeden auth klíč, jedna autoritní doména, plný přístup. To funguje pro jednoho operátora, ale ne pro veřejnou službu pro více uživatelů.

Veřejné RPC bez oprávnění potřebuje silnější model:

- jedna služba může hostit mnoho uživatelů
- každý uživatel má své vlastní komunity a limity
- operátorem definované zásady mohou zabránit zneužití
- uživatel se může později odstěhovat nebo se sám hostit

## Základní model

### Uživatelé

Každý uživatel získá ověřovací pověření a balíček oprávnění.

### společenství

Komunity vytvořené prostřednictvím služby jsou přiřazeny k záznamu vlastníka. Vlastnictví je sledováno explicitně, takže metody správy mohou být určeny správnému uživateli.

### Oprávnění

Oprávnění závisí na schopnostech. Namísto jedné booleovské hodnoty pro „může používat RPC“ může server řídit:

- kolik komunit může uživatel vytvořit
- jaké metody řízení jsou k dispozici
- jaké operace publikování jsou povoleny
- jaké sazby platí
- jaké administrátorské plochy jsou viditelné

### Admin povrch

Samotné veřejné RPC by mělo zůstat zaměřeno na chování RPC vůči uživateli. Administrativní úlohy, jako je vytvoření uživatele, převod vlastnictví a kontrola auditu, patří do samostatného rozhraní API a řídicího panelu operátora.

## Postoj ke kompatibilitě

Dokumentace pro uživatele by měla používat výrazy Bitsocial, jako jsou **komunita** a **profil**.

Na úrovni drátu může první zavedení stále zachovat aktuální tvar přenosu a užitečného zatížení JSON-RPC, pokud je to užitečné pro kompatibilitu. Jinými slovy: dokumenty mohou zůstat bitsociální, i když přechodné období zachovává některé názvy metod orientované na kompatibilitu nebo tvary požadavků v zákulisí.

## Navrhovaný balíček oprávnění

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

Přesné názvy metod jsou ilustrativní. Důležitou součástí je tvar politiky: jednotlivé schopnosti jsou nezávisle řízeny místo toho, aby byly spojeny do jednoho tokenu superuživatele.

## Tok připojení

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Povědomí o povolení by mělo zůstat nepovinné. Klient, který ignoruje upozornění, se může stále chovat správně tím, že ze serveru zpracuje standardní selhání autorizace.

## Vymáhání vlastnictví

Když služba vytvoří komunitu, měla by automaticky přiřadit vlastnictví volajícímu uživateli. Odtud:

- Akce spuštění, zastavení, úpravy a odstranění komunity jsou v rozsahu vlastníka
- odpovědi na seznam a předplatné jsou výchozí pro vlastní komunity volajícího
- širší viditelnost je výslovné oprávnění správce, nikoli výchozí

Jeden okrajový případ je hodně důležitý: pokud se uživatel přihlásí ke komunitě, kterou **ne** nevlastní, server musí odhalit pouze veřejný stav, který by měl vidět každý vnější pozorovatel. Konfigurace pouze pro vlastníka nebo interní data runtime by nikdy neměla unikat prostřednictvím rozhraní API předplatného.

## Doporučený povrch operátora

Admin API může zůstat nudné a explicitní:

- seznam uživatelů
- zkontrolovat jednoho uživatele
- vytvářet nebo aktualizovat uživatele
- odstranit uživatele
- převést vlastnictví společenství
- kontrolovat protokoly auditu

Ověřování pro toto rozhraní API operátora by mělo být zcela oddělené od autentizace RPC koncového uživatele.

## Fáze zavádění

### Fáze 1

- vytvořit veřejnou strukturu projektu RPC
- přidat uživatelské záznamy a sledování vlastnictví
- rozvětvete nebo rozšiřte aktuální server RPC

### Fáze 2

- implementovat balíčky oprávnění
- vynutit je na vrstvě metody RPC
- vrátit metadata oprávnění při připojení

### Fáze 3

- přidat rozhraní API operátora
- přidat protokolování auditu
- přidat ověření správce

### Fáze 4

- odeslat administrační panel
- testovat kontroly zneužití
- zpřísnit omezení rychlosti a kvóty úložiště

## Otevřené otázky

### Ověření nevyžádané pošty

Pokud je vytvoření ověření levné, mohou veřejné služby vyžadovat před vydáním pověření vrstvu výzvy. Jednou z možných cest je opětovné použití samotného modelu komunitní výzvy, takže vydávání pověření zdědí stejnou filozofii proti zneužívání jako zbytek sítě.

### Detaily migrace

Některé rané implementace mohou stále odhalovat názvy metod orientovaných na kompatibilitu interně. S tím by se mělo zacházet jako s detailem migrace, nikoli jako s trvalým veřejným slovníkem dokumentů Bitsocial.

## Shrnutí

This proposal is really about one thing: making public RPC infrastructure useful without making it custodial. Dobrý veřejný Bitsocial RPC by se měl cítit jako volitelná pomoc pro provozující komunity, ne jako nová centrální platforma, která zpětně získává vlastnictví zadními vrátky.
