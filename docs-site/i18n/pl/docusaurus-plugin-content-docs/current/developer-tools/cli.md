---
title: interfejs wiersza polecenia
description: Interfejs wiersza poleceń do uruchamiania węzła Bitsocial, tworzenia społeczności i zarządzania operacjami na protokołach.
sidebar_position: 2
---

# interfejs wiersza polecenia

:::warning Legacy Naming
Ten pakiet używa obecnie starszych konwencji nazewnictwa odziedziczonych z jego zależności od źródła. Odniesienia do „plebbit” w poleceniach, wynikach i konfiguracji zostaną przeniesione do „bitsocial” w przyszłej wersji. Funkcjonalność pozostaje nienaruszona.
:::

`bitsocial-cli` to narzędzie wiersza poleceń umożliwiające interakcję z backendem protokołu Bitsocial. Umożliwia uruchomienie lokalnego demona P2P, tworzenie i konfigurowanie społeczności oraz publikowanie treści – a wszystko to z poziomu terminala.

Jest zbudowany na bazie `plebbit-js` i jest używany przez [5kan](/apps/5chan/) i [Edycja](/apps/seedit/) do tworzenia społeczności i zarządzania węzłami.

## Instalacja

Gotowe pliki binarne są dostępne dla systemów Windows, macOS i Linux. Pobierz najnowszą wersję dla swojej platformy z GitHub:

**[Pobierz z wydaniami GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Po pobraniu utwórz plik wykonywalny binarny (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Uruchamianie demona

Najczęstszym zastosowaniem interfejsu CLI jest uruchomienie węzła Bitsocial. Demon uruchamia warstwę sieciową P2P i udostępnia lokalny interfejs API, z którym mogą się łączyć klienci.

```bash
bitsocial-cli daemon
```

Przy pierwszym uruchomieniu demon wyświetla łącza do **WebUI**, opartego na przeglądarce interfejsu graficznego służącego do zarządzania węzłem, społecznościami i ustawieniami. Jest to przydatne, jeśli wolisz interfejs GUI od poleceń terminala.

## Kluczowe polecenia

| Polecenie           | Opis                                                      |
| ------------------- | --------------------------------------------------------- |
| `daemon`            | Uruchom węzeł Bitsocial P2P                               |
| `create subplebbit` | Utwórz nową społeczność                                   |
| `subplebbit edit`   | Zaktualizuj ustawienia społeczności (tytuł, opis, zasady) |
| `subplebbit list`   | Lista społeczności hostowanych w tym węźle                |
| `subplebbit start`  | Zacznij służyć określonej społeczności                    |
| `subplebbit stop`   | Przestań służyć określonej społeczności                   |

Uruchom dowolne polecenie z `--help`, aby zobaczyć dostępne opcje i flagi:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Typowy przepływ pracy

Typowy proces konfiguracji hostingu nowej społeczności:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

Społeczność jest teraz dostępna w sieci Bitsocial i jest dostępna z dowolnego kompatybilnego klienta.

## Spinki do mankietów

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
