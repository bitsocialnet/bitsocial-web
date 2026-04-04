---
title: BSO Resolver
description: A .bso tartománynevek feloldása nyilvános kulcsokká ENS TXT rekordok segítségével, beépített gyorsítótárral és többplatformos támogatással.
sidebar_position: 1
---

# BSO Resolver

A BSO Resolver a `.bso` tartományneveket a megfelelő nyilvános kulcsukra fordítja az ENS-en tárolt Bitsocial TXT rekordok beolvasásával. Megosztott viem klienst, állandó gyorsítótárat biztosít, és Node.js és böngészőkörnyezetben is működik.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licenc**: csak GPL-2.0

## Telepítés

```bash
npm install @bitsocial/bso-resolver
```

## Resolver létrehozása

Példányosítsa a feloldót úgy, hogy egy konfigurációs objektumot ad át a konstruktornak:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Paraméter  | Kötelező | Leírás                                              |
| ---------- | -------- | --------------------------------------------------- |
| `key`      | Igen     | A feloldó példány azonosítója.                      |
| `provider` | Igen     | Szállítási konfiguráció (lásd alább).               |
| `dataPath` | Nem      | Az SQLite gyorsítótárfájl könyvtára (csak Node.js). |

### Szolgáltatói lehetőségek

A `provider` paraméter három formátumot fogad el:

- **`"viem"`** – A viem által biztosított alapértelmezett tömegközlekedést használja.
- **HTTP(S) URL** – JSON-RPC végponton keresztül csatlakozik (pl. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** – WebSocket RPC-végponton keresztül csatlakozik (pl. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Módszerek

### `resolve({ name, abortSignal? })`

Megkeresi a `.bso` nevet, és visszaadja a kapcsolódó nyilvános kulcsot. Az opcionális `AbortSignal` átadható a régóta futó kérelmek törlésére.

### `canResolve({ name })`

Egy logikai értéket ad vissza, jelezve, hogy a feloldó képes-e kezelni a megadott nevet. Használja ezt a támogatás ellenőrzésére, mielőtt megpróbálná a teljes felbontást.

### `destroy()`

Lebontja a feloldót, bezárja az adatbázis-kapcsolatokat és felszabadítja az erőforrásokat. Hívja ezt, ha a feloldóra már nincs szükség.

## Gyorsítótárazás

A redundáns hálózati keresések csökkentése érdekében a megoldott nevek automatikusan gyorsítótárba kerülnek. The caching backend is chosen based on the runtime environment:

| Környezet | Háttérrendszer        | Megjegyzések                                                                          |
| --------- | --------------------- | ------------------------------------------------------------------------------------- |
| Node.js   | SQLite                | A következő helyen tárolva: `dataPath`. A párhuzamos hozzáféréshez WAL módot használ. |
| Böngésző  | IndexedDB             | Natív IndexedDB tranzakciókat használ.                                                |
| Tartalék  | Memóriában lévő `Map` | Akkor használatos, ha sem az SQLite, sem az IndexedDB nem érhető el.                  |

Minden gyorsítótár-bejegyzés **egy órás TTL-lel** rendelkezik, és a lejárat után automatikusan kilakoltatásra kerül.

## Integráció a pkc-js-szel

A feloldó közvetlenül csatlakoztatható a pkc-js-hez a `nameResolvers` opción keresztül, lehetővé téve az átlátszó `.bso` névfeloldást a kulcskeresés során:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Egyidejűség

A rezolver úgy lett kialakítva, hogy egyidejű használat mellett is biztonságos legyen:

- Egyetlen megosztott viem kliens elkerüli a redundáns kapcsolatokat.
- Az SQLite WAL (Write-Ahead Logging) módban működik, lehetővé téve az egyidejű olvasást blokkolás nélkül.
- A böngésző gyorsítótárazása a natív IndexedDB tranzakciókra támaszkodik az elkülönítés érdekében.

## Platform belépési pontok

A csomag külön belépési pontokat szállít a Node.js és a böngésző buildek számára. Azok a kötegelők, amelyek támogatják a `exports` mezőt a `package.json`-ban, automatikusan kiválasztják a megfelelőt.
