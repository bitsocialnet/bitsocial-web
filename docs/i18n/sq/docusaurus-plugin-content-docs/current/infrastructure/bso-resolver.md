---
title: BSO Resolver
description: Zgjidhini emrat e domeneve .bso në çelësat publikë duke përdorur të dhënat ENS TXT, me memorie të integruar dhe mbështetje ndër-platformë.
sidebar_position: 1
---

# BSO Resolver

Zgjidhësi BSO përkthen emrat e domeneve `.bso` në çelësat e tyre publikë përkatës duke lexuar të dhënat Bitsocial TXT të ruajtura në ENS. Ai siguron një klient të përbashkët viem, memorie të vazhdueshme dhe funksionon si në mjediset Node.js ashtu edhe në shfletues.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licenca**: GPL-2.0-vetëm

## Instalimi

```bash
npm install @bitsocial/bso-resolver
```

## Krijimi i një zgjidhësi

Instantoni zgjidhësin duke i kaluar një objekt konfigurimi konstruktorit:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parameter  | Kërkohet | Përshkrimi                                                |
| ---------- | -------- | --------------------------------------------------------- |
| `key`      | Po       | Identifikuesi për shembullin e zgjidhësit.                |
| `provider` | Po       | Konfigurimi i transportit (shih më poshtë).               |
| `dataPath` | Jo       | Drejtoria për skedarin e memories SQLite (vetëm Node.js). |

### Opsionet e ofruesit

Parametri `provider` pranon tre formate:

- **`"viem"`** -- Përdor transportin publik të paracaktuar të ofruar nga viem.
- **URL HTTP(S)** -- Lidhet përmes një pike fundore JSON-RPC (p.sh., `https://mainnet.infura.io/v3/YOUR_KEY`).
- **URL i WebSocket** -- Lidhet përmes një pike fundore RPC të WebSocket (p.sh., `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metodat

### `resolve({ name, abortSignal? })`

Kërkon një emër `.bso` dhe kthen çelësin publik të lidhur. Një `AbortSignal` opsionale mund të kalohet për të anuluar kërkesat afatgjata.

### `canResolve({ name })`

Kthen një boolean që tregon nëse zgjidhësi është në gjendje të trajtojë emrin e dhënë. Përdoreni këtë për të kontrolluar mbështetjen përpara se të provoni një zgjidhje të plotë.

### `destroy()`

Prish zgjidhjen, mbyll lidhjet e bazës së të dhënave dhe lëshon burime. Thirrni këtë kur zgjidhësi nuk është më i nevojshëm.

## Caching

Emrat e zgjidhur ruhen automatikisht për të reduktuar kërkimet e tepërta të rrjetit. Backend-i i memorizimit zgjidhet bazuar në mjedisin e kohës së ekzekutimit:

| Environment | Backend          | Shënime                                                                |
| ----------- | ---------------- | ---------------------------------------------------------------------- |
| Nyja.js     | SQLite           | Ruajtur në `dataPath`. Përdor modalitetin WAL për qasje të njëkohshme. |
| Shfletuesi  | DB e Indeksuar   | Përdor transaksionet vendase të IndexedDB.                             |
| Rikthim     | `Map` në memorie | Përdoret kur as SQLite dhe as IndexedDB nuk janë të disponueshme.      |

Të gjitha hyrjet në cache kanë një **TTL një-orëshe** dhe nxirren automatikisht pas skadimit.

## Integrimi me pkc-js

Zgjidhësi mund të lidhet drejtpërdrejt në pkc-js përmes opsionit `nameResolvers`, duke mundësuar rezolucionin transparent të emrit `.bso` gjatë kërkimeve kryesore:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Konkurrenca

Zgjidhësi është projektuar për të qenë i sigurt në përdorim të njëkohshëm:

- Një klient i vetëm i përbashkët viem shmang lidhjet e tepërta.
- SQLite funksionon në modalitetin WAL (Regjistrimi përpara shkrimit), duke lejuar lexime të njëkohshme pa bllokim.
- Ruajtja në memorie e shfletuesit mbështetet në transaksionet vendase të IndexedDB për izolim.

## Pikat e hyrjes në platformë

Paketa dërgon pika të veçanta hyrjeje për Node.js dhe ndërtimet e shfletuesit. Paketuesit që mbështesin fushën `exports` në `package.json` do të zgjedhin automatikisht atë të saktë.
