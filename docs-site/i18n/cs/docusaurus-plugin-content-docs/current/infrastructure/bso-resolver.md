---
title: BSO Resolver
description: Přeložte názvy domén .bso na veřejné klíče pomocí záznamů ENS TXT, s vestavěným ukládáním do mezipaměti a podporou mezi platformami.
sidebar_position: 1
---

# BSO Resolver

BSO Resolver překládá názvy domén `.bso` na jejich odpovídající veřejné klíče čtením záznamů Bitsocial TXT uložených na ENS. Poskytuje sdíleného klienta viem, trvalé ukládání do mezipaměti a funguje v prostředí Node.js i prohlížeče.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licence**: pouze GPL-2.0

## Instalace

```bash
npm install @bitsocial/bso-resolver
```

## Vytvoření Resolveru

Vytvořte instanci resolveru předáním konfiguračního objektu konstruktoru:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametr   | Povinné | Popis                                                 |
| ---------- | ------- | ----------------------------------------------------- |
| `key`      | Ano     | Identifikátor instance překladače.                    |
| `provider` | Ano     | Transportní konfigurace (viz níže).                   |
| `dataPath` | Ne      | Adresář pro soubor mezipaměti SQLite (pouze Node.js). |

### Možnosti poskytovatele

Parametr `provider` přijímá tři formáty:

- **`"viem"`** -- Použije výchozí veřejnou dopravu, kterou poskytuje viem.
- **HTTP(S) URL** – Připojuje se prostřednictvím koncového bodu JSON-RPC (např. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** – Připojuje se prostřednictvím koncového bodu WebSocket RPC (např. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metody

### `resolve({ name, abortSignal? })`

Vyhledá název `.bso` a vrátí přidružený veřejný klíč. Pro zrušení dlouhotrvajících požadavků lze předat volitelný `AbortSignal`.

### `canResolve({ name })`

Vrátí boolean označující, zda je resolver schopen zpracovat dané jméno. Použijte toto ke kontrole podpory před pokusem o plné rozlišení.

### `destroy()`

Zničí resolver, uzavře databázová připojení a uvolní zdroje. Zavolejte, když překladač již není potřeba.

## Ukládání do mezipaměti

Vyřešená jména se automaticky ukládají do mezipaměti, aby se omezilo nadbytečné vyhledávání v síti. Backend pro ukládání do mezipaměti je vybrán na základě běhového prostředí:

| Životní prostředí | Backend        | Poznámky                                                       |
| ----------------- | -------------- | -------------------------------------------------------------- |
| Node.js           | SQLite         | Uloženo na `dataPath`. Pro souběžný přístup používá režim WAL. |
| Prohlížeč         | IndexovanáDB   | Používá nativní transakce IndexedDB.                           |
| Záložní           | V paměti `Map` | Používá se, když není k dispozici SQLite ani IndexedDB.        |

Všechny položky mezipaměti mají **jednohodinovou TTL** a po vypršení platnosti jsou automaticky vymazány.

## Integrace s pkc-js

Překladač lze zapojit přímo do pkc-js prostřednictvím možnosti `nameResolvers`, která umožňuje transparentní rozlišení názvů `.bso` během vyhledávání klíčů:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Souběžnost

Resolver je navržen tak, aby byl bezpečný při současném použití:

- Jediný sdílený klient viem zabraňuje redundantním připojením.
- SQLite pracuje v režimu WAL (Write-Ahead Logging), který umožňuje souběžné čtení bez blokování.
- Ukládání do mezipaměti prohlížeče se při izolaci spoléhá na nativní transakce IndexedDB.

## Vstupní body platformy

Balíček dodává samostatné vstupní body pro Node.js a sestavení prohlížeče. Bundleři, kteří podporují pole `exports` v `package.json`, automaticky vyberou ten správný.
