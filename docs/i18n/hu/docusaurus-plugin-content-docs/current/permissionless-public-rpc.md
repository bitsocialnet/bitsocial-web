---
title: Engedély nélküli nyilvános RPC
description: Javasolt terv egy nyilvános Bitsocial RPC szolgáltatáshoz elszigetelt felhasználókkal, hatókörű engedélyekkel és közösségi tulajdonnal.
---

# Engedély nélküli nyilvános RPC

Az eredeti nyilvános RPC-javaslat egy GitHub-kiadásként élt, régi plebbit terminológiával írva. Ez az oldal átírja az ötletet Bitsocial nyelven, és termékszintű javaslatként keretezi, nem pedig a megvalósítási részletek falaként.

## Egyszerű nyelvű cél

A Bitsocial Forge egy nyilvános RPC szolgáltatást futtathat, amely lehetővé teszi sok felhasználó számára, hogy távolról kezelje saját Bitsocial közösségeit anélkül, hogy az üzemeltetőt e közösségek letéteményesévé tenné.

A szolgáltatásnak praktikussá kell tennie a mobil és könnyű ügyfeleket, miközben meg kell őriznie három korlátot:

1. A felhasználók alapértelmezés szerint elszigeteltek maradnak egymástól.
2. Az engedélyek egyértelműek és részletesek maradnak.
3. Az aktuális RPC-kéréssel és válaszformával való kompatibilitás a közzététel során megőrizhető.

## Milyen problémát old meg

Ma a legegyszerűbb RPC-modell általában mindent vagy semmit: egy hitelesítési kulcs, egy jogosultsági tartomány, teljes hozzáférés. Ez működik egyetlen szolgáltatónál, de nem egy nyilvános többfelhasználós szolgáltatásnál.

Az engedély nélküli nyilvános RPC-nek erősebb modellre van szüksége:

- egy szolgáltatás sok felhasználót fogadhat
- minden felhasználó saját közösségeket és korlátokat kap
- az üzemeltető által meghatározott házirendek megakadályozhatják a visszaéléseket
- a felhasználó később is elköltözhet, vagy önállóan gazdálkodhat

## Alapmodell

### Felhasználók

Minden felhasználó kap egy hitelesítési adatot és egy engedélycsomagot.

### közösségek

A szolgáltatáson keresztül létrehozott közösségek tulajdonosi rekordhoz vannak rendelve. A tulajdonjogot kifejezetten nyomon követi, így a kezelési módszereket a megfelelő felhasználóra lehet besorolni.

### Engedélyek

Az engedélyek képesség alapúak. Egy logikai érték helyett a „használhatja az RPC-t” helyett a szerver a következőket szabályozhatja:

- hogy egy felhasználó hány közösséget hozhat létre
- mely kezelési módszerek állnak rendelkezésre
- milyen közzétételi műveletek engedélyezettek
- milyen díjkorlátok vonatkoznak
- milyen admin felületek láthatók

### Admin felület

Magának a nyilvános RPC-nek a felhasználó felé irányuló RPC-viselkedésre kell összpontosítania. Az adminisztratív feladatok, mint például a felhasználók létrehozása, a tulajdonjog átruházása és az ellenőrzési ellenőrzés, külön kezelői API-hoz és irányítópulthoz tartoznak.

## Kompatibilitási álláspont

A felhasználói dokumentációnak olyan Bitsocial kifejezéseket kell használnia, mint a **közösség** és **profil**.

A vezetékek szintjén az első bevezetés továbbra is megőrzi a jelenlegi JSON-RPC szállítási és hasznos teher alakját, ahol ez hasznos a kompatibilitás szempontjából. Más szóval: a dokumentumoknak többé nem kell úgy beszélniük, mint a régi plebbit dokumentumoknak, még akkor sem, ha az átmeneti időszak néhány örökölt metódusnevet vagy kérési formát a színfalak mögött tart.

## Javasolt engedélycsomag

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

A metódusok pontos elnevezése tájékoztató jellegű. A fontos része a házirend formája: az egyéni képességek önállóan vezérelhetők, ahelyett, hogy egyetlen szuperfelhasználói tokenbe kötnék őket.

## Csatlakozási folyamat

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Az engedélyekkel kapcsolatos tudatosságnak fakultatívnak kell maradnia. Az értesítést figyelmen kívül hagyó ügyfél továbbra is megfelelően viselkedhet, ha kezeli a szabványos engedélyezési hibákat a kiszolgálóról.

## Tulajdonjog érvényesítése

Amikor a szolgáltatás közösséget hoz létre, automatikusan hozzá kell rendelnie a tulajdonjogot a hívó felhasználóhoz. Onnan:

- A közösségi indítási, leállítási, szerkesztési és törlési műveletek a tulajdonosok hatáskörébe tartoznak
- lista és előfizetés válaszai alapértelmezés szerint a hívó saját közösségeihez tartoznak
- A szélesebb láthatóság kifejezett rendszergazdai jogosultság, nem alapértelmezett

Az egyik szélső eset sokat számít: ha egy felhasználó feliratkozik egy olyan közösségre, amelynek **nem** a tulajdona, a szervernek csak azt a nyilvános állapotot kell feltárnia, amelyet minden külső megfigyelőnek látnia kell. Csak a tulajdonos konfigurációja vagy a belső futásidejű adatok soha nem szivároghatnak ki az előfizetéses API-n keresztül.

## Javasolt kezelőfelület

Az adminisztrációs API unalmas és egyértelmű maradhat:

- listázza a felhasználókat
- vizsgáljon meg egy felhasználót
- felhasználókat hozhat létre vagy frissíthet
- törölje a felhasználókat
- átadja a közösségi tulajdonjogot
- ellenőrizze az ellenőrzési naplókat

Az operátor API hitelesítésének teljesen el kell különülnie a végfelhasználói RPC hitelesítéstől.

## Kiterjesztés fázisai

### 1. fázis

- létrehozza a nyilvános RPC projektstruktúrát
- felhasználói rekordok és tulajdonosi nyomon követés hozzáadása
- elágazás vagy kiterjesztése az aktuális RPC-kiszolgálónak

### 2. fázis

- engedélycsomagokat valósítson meg
- kényszerítse ki őket az RPC metódusrétegen
- visszaküldi az engedélyek metaadatait a csatlakozáskor

### 3. fázis

- adja hozzá az operátor API-t
- auditnaplózás hozzáadása
- Adminisztrátori hitelesítés hozzáadása

### 4. fázis

- küldje el az adminisztrációs irányítópultot
- tesztelje a visszaélések ellenőrzését
- szigorítsák a tarifakorlátozást és a tárolási kvótákat

## Nyitott kérdések

### Hitelesítési spam hitelesítés

Ha a hitelesítés létrehozása olcsó, előfordulhat, hogy a közszolgáltatásoknak kihívási rétegre van szükségük a hitelesítési adatok kiadása előtt. Az egyik lehetséges út magának a közösségi kihívási modellnek az újrafelhasználása, így a hitelesítő adatok kiadása ugyanazt a visszaélés-ellenes filozófiát örökli, mint a hálózat többi része.

### Örökségi névadás

Egyes korai megvalósítások a kompatibilitás érdekében belsőleg is felfedhetik a régi metódusneveket. Ezt migrációs részletként kell kezelni, nem pedig a Bitsocial dokumentumok állandó nyilvános szókészleteként.

## Összegzés

This proposal is really about one thing: making public RPC infrastructure useful without making it custodial. Egy jó nyilvános Bitsocial RPC-nek opcionális segítségnek kell lennie a közösségek működtetésében, nem pedig egy új központi platformnak, amely a hátsó ajtón keresztül visszaszerzi a tulajdonjogot.
