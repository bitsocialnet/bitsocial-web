---
title: BSO Resolver
description: Rezolvați numele de domenii .bso în chei publice utilizând înregistrări ENS TXT, cu cache încorporată și suport pentru mai multe platforme.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver traduce numele de domenii `.bso` în cheile publice corespunzătoare, citind înregistrările Bitsocial TXT stocate pe ENS. Oferă un client Viem partajat, stocare în cache persistentă și funcționează atât în ​​mediile Node.js, cât și în browser.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licență**: numai GPL-2.0

## Instalare

```bash
npm install @bitsocial/bso-resolver
```

## Crearea unui Resolver

Instanțiați rezolutorul pasând un obiect de configurare către constructor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametru  | Necesar | Descriere                                              |
| ---------- | ------- | ------------------------------------------------------ |
| `key`      | Da      | Identificator pentru instanța de rezolvare.            |
| `provider` | Da      | Configurarea transportului (vezi mai jos).             |
| `dataPath` | Nu      | Director pentru fișierul cache SQLite (numai Node.js). |

### Opțiuni pentru furnizor

Parametrul `provider` acceptă trei formate:

- **`"viem"`** -- Utilizează transportul public prestabilit oferit de viem.
- **HTTP(S) URL** -- Se conectează printr-un punct final JSON-RPC (de exemplu, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** -- Se conectează printr-un punct final WebSocket RPC (de ex., `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metode

### `resolve({ name, abortSignal? })`

Caută un nume `.bso` și returnează cheia publică asociată. Un `AbortSignal` opțional poate fi transmis pentru a anula solicitările de lungă durată.

### `canResolve({ name })`

Returnează un boolean care indică dacă rezolutorul este capabil să gestioneze numele dat. Utilizați aceasta pentru a verifica asistența înainte de a încerca o rezoluție completă.

### `destroy()`

Demolează soluția, închide conexiunile la baza de date și eliberează resurse. Apelați asta atunci când rezolutorul nu mai este necesar.

## Memorarea în cache

Numele rezolvate sunt memorate în cache automat pentru a reduce căutările redundante în rețea. Backend-ul de cache este ales pe baza mediului de rulare:

| Mediu    | Backend          | Note                                                                 |
| -------- | ---------------- | -------------------------------------------------------------------- |
| Node.js  | SQLite           | Stocat la `dataPath`. Utilizează modul WAL pentru acces simultan.    |
| Browser  | IndexedDB        | Utilizează tranzacții native IndexedDB.                              |
| Fallback | În memorie `Map` | Folosit atunci când nici SQLite, nici IndexedDB nu sunt disponibile. |

Toate intrările din cache au un **TTL de o oră** și sunt eliminate automat după expirare.

## Integrare cu pkc-js

Resolvetorul poate fi conectat direct la pkc-js prin opțiunea `nameResolvers`, permițând rezoluția transparentă a numelui `.bso` în timpul căutărilor cheilor:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Concurență

Resolverul este conceput pentru a fi sigur în cazul utilizării concomitente:

- Un singur client Viem partajat evită conexiunile redundante.
- SQLite funcționează în modul WAL (Write-Ahead Logging), permițând citiri simultane fără blocare.
- Memorarea în cache a browserului se bazează pe tranzacțiile native IndexedDB pentru izolare.

## Puncte de intrare în platformă

Pachetul oferă puncte de intrare separate pentru Node.js și versiuni de browser. Bundler-urile care acceptă câmpul `exports` din `package.json` îl vor selecta automat pe cel corect.
