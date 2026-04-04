---
title: React Hooks
description: Biblioteka React hooks do tworzenia zdecentralizowanych aplikacji społecznościowych w oparciu o protokół Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Starsze nazewnictwo
Ten pakiet używa obecnie starszych konwencji nazewnictwa odziedziczonych z jego rozwidlenia nadrzędnego. Odniesienia do „plebbit” w kodzie, interfejsach API i konfiguracji zostaną przeniesione do „bitsocial” w przyszłej wersji. Funkcjonalność pozostaje nienaruszona.
:::

Pakiet `bitsocial-react-hooks` zapewnia znane API React hooks do interakcji z protokołem Bitsocial. Obsługuje pobieranie kanałów, komentarzy i profili autorów, zarządzanie kontami, publikowanie treści i subskrybowanie społeczności – a wszystko to bez polegania na centralnym serwerze.

Ta biblioteka jest głównym interfejsem używanym przez [5chan](/apps/5chan/) i inne aplikacje klienckie Bitsocial.

:::note
`bitsocial-react-hooks` to tymczasowe rozwidlenie `plebbit/plebbit-react-hooks` utrzymywane w celu rozwoju wspomaganego sztuczną inteligencją. Jest używany bezpośrednio z GitHub, a nie publikowany w npm.
:::

## Instalacja

Ponieważ pakietu nie ma jeszcze na npm, zainstaluj go bezpośrednio z GitHuba, przypinając do określonego skrótu zatwierdzenia:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Zastąp `<commit-hash>` zatwierdzeniem, na które chcesz skierować.

## Przegląd API

Haczyki są podzielone na kategorie funkcjonalne. Poniżej znajduje się podsumowanie najczęściej używanych haków w każdej kategorii. Aby zapoznać się z pełnymi podpisami, parametrami i typami zwrotów, zobacz [pełna dokumentacja API w GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Konta

Zarządzaj lokalnymi kontami użytkowników, tożsamością i ustawieniami.

- `useAccount(accountName?)` -- zwraca aktywny (lub nazwany) obiekt konta
- `useAccounts()` – zwraca wszystkie konta przechowywane lokalnie
- `useAccountComments(options?)` -- zwraca komentarze opublikowane przez aktywne konto

### Uwagi

Pobieraj i wchodź w interakcję z indywidualnymi komentarzami i wątkami.

- `useComment(commentCid?)` — pobiera pojedynczy komentarz według jego CID
- `useComments(commentCids?)` — pobiera wiele komentarzy wsadowo
- `useEditedComment(comment?)` – zwraca ostatnią edytowaną wersję komentarza

### Społeczności

Pobierz metadane i ustawienia społeczności.

- `useSubplebbit(subplebbitAddress?)` – pobiera społeczność według adresu
- `useSubplebbits(subplebbitAddresses?)` – pobiera wiele społeczności
- `useSubplebbitStats(subplebbitAddress?)` – zwraca liczbę subskrybentów i postów

### Autorski

Wyszukaj profile autorów i metadane.

- `useAuthor(authorAddress?)` – pobiera profil autora
- `useAuthorComments(options?)` – zwraca komentarze określonego autora
- `useResolvedAuthorAddress(authorAddress?)` — przekształca adres czytelny dla człowieka (np. ENS) na adres protokołu

### Kanały

Subskrybuj kanały treści i stronicuj je.

- `useFeed(options?)` — zwraca podzielony na strony kanał zawierający posty z jednej lub większej liczby społeczności
- `useBufferedFeeds(feedOptions?)` — wstępnie buforuje wiele kanałów w celu szybszego renderowania
- `useAuthorFeed(authorAddress?)` – zwraca kanał z postami określonego autora

### Działania

Publikuj treść i wykonuj operacje zapisu.

- `usePublishComment(options?)` - opublikuj nowy komentarz lub odpowiedź
- `usePublishVote(options?)` – oddaj głos za lub przeciw
- `useSubscribe(options?)` — zasubskrybuj lub wypisz się ze społeczności

### Stany i RPC

Monitoruj stan połączenia i wchodź w interakcję ze zdalnym demonem Bitsocial.

- `useClientsStates(options?)` - zwraca stan połączenia klientów IPFS/pubsub
- `usePlebbitRpcSettings()` – zwraca bieżącą konfigurację demona RPC

## Rozwój

Aby pracować lokalnie nad biblioteką hooków:

**Wymagania wstępne:** Node.js, obsługa pakietu Corepack, przędza 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Polecenia testowania i kompilacji znajdują się w repozytorium README.

## Spinki do mankietów

- **GitHub:** [pełna dokumentacja API w GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licencja:** tylko GPL-2.0
