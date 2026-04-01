---
title: Reagovat Hooks
description: Knihovna háčků React pro vytváření decentralizovaných sociálních aplikací na protokolu Bitsocial.
sidebar_position: 1
---

# Reagovat Hooks

:::warning Legacy Naming
Tento balíček v současné době používá starší konvence pojmenování zděděné z jeho upstream rozvětvení. Odkazy na „plebbit“ v kódu, rozhraní API a konfiguraci budou v budoucí verzi migrovány na „bitsocial“. Funkčnost není ovlivněna.
:::

Balíček `bitsocial-react-hooks` poskytuje známé rozhraní React hooks API pro interakci s protokolem Bitsocial. Zvládá načítání zdrojů, komentářů a profilů autorů, správu účtů, publikování obsahu a přihlašování do komunit – to vše bez spoléhání na centrální server.

Tato knihovna je primárním rozhraním používaným [5kanál](/apps/5chan/) a dalšími klientskými aplikacemi Bitsocial.

:::note
`bitsocial-react-hooks` je dočasný fork `plebbit/plebbit-react-hooks` udržovaný pro vývoj podporovaný AI. Spotřebovává se přímo z GitHubu a nepublikuje se do npm.
:::

## Instalace

Protože balíček ještě není na npm, nainstalujte jej přímo z GitHubu a připněte ke konkrétnímu hash odevzdání:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Nahraďte `<commit-hash>` odevzdáním, na které chcete cílit.

## Přehled API

Háčky jsou uspořádány do funkčních kategorií. Níže je uveden souhrn nejčastěji používaných háčků v každé kategorii. Úplné podpisy, parametry a návratové typy naleznete v [úplná referenční API na GitHubu](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Účty

Spravujte místní uživatelské účty, identitu a nastavení.

- `useAccount(accountName?)` -- vrátí aktivní (nebo pojmenovaný) objekt účtu
- `useAccounts()` -- vrátí všechny lokálně uložené účty
- `useAccountComments(options?)` -- vrátí komentáře publikované aktivním účtem

### Komentáře

Stahujte jednotlivé komentáře a vlákna a pracujte s nimi.

- `useComment(commentCid?)` -- načte jeden komentář podle svého CID
- `useComments(commentCids?)` -- načte více komentářů v dávce
- `useEditedComment(comment?)` -- vrátí poslední upravenou verzi komentáře

### společenství

Načtěte metadata a nastavení komunity.

- `useSubplebbit(subplebbitAddress?)` -- načte komunitu podle adresy
- `useSubplebbits(subplebbitAddresses?)` -- načte více komunit
- `useSubplebbitStats(subplebbitAddress?)` -- vrátí počet odběratelů a příspěvků

### Autoři

Vyhledejte profily a metadata autorů.

- `useAuthor(authorAddress?)` -- načte profil autora
- `useAuthorComments(options?)` -- vrátí komentáře konkrétního autora
- `useResolvedAuthorAddress(authorAddress?)` – převádí lidsky čitelnou adresu (např. ENS) na adresu protokolu

### Zdroje

Subscribe to and paginate content feeds.

- `useFeed(options?)` – vrátí stránkovaný zdroj příspěvků z jedné nebo více komunit
- `useBufferedFeeds(feedOptions?)` -- přednakládá do vyrovnávací paměti více kanálů pro rychlejší vykreslování
- `useAuthorFeed(authorAddress?)` -- vrátí zdroj příspěvků od konkrétního autora

### Akce

Publikujte obsah a provádějte operace zápisu.

- `usePublishComment(options?)` -- publikovat nový komentář nebo odpověď
- `usePublishVote(options?)` -- hlasujte pro nebo proti
- `useSubscribe(options?)` -- přihlášení nebo odhlášení z komunity

### státy a RPC

Monitorujte stav připojení a komunikujte se vzdáleným Bitsocial démonem.

- `useClientsStates(options?)` -- vrací stav připojení klientů IPFS/pubsub
- `usePlebbitRpcSettings()` -- vrátí aktuální konfiguraci démona RPC

## Vývoj

Chcete-li lokálně pracovat na knihovně háčků:

**Předpoklady:** Node.js, povoleno Corepack, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Příkazy pro testování a sestavení najdete v úložišti README.

## Odkazy

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licence:** Pouze GPL-2.0
