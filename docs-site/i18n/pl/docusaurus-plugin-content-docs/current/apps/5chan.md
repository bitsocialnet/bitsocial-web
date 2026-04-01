---
title: 5kan
description: Bezserwerowa, zdecentralizowana tablica graficzna zbudowana w oparciu o protokół Bitsocial, na której każdy może tworzyć i posiadać tablice.
sidebar_position: 1
---

:::warning[Legacy naming]
Baza kodowa tego projektu nadal korzysta ze starszego nazewnictwa „plebbit” sprzed rebrandingu Bitsocial. Nazwy pakietów, odniesienia do API i część terminologii wewnętrznej zostaną zaktualizowane w przyszłej wersji. Opisana tutaj funkcjonalność jest aktualna — jedynie nazewnictwo jest nieaktualne.
:::

# 5kan

5chan to bezserwerowa, pozbawiona administratora i w pełni zdecentralizowana tablica graficzna działająca na protokole Bitsocial. Jest zgodny ze znaną strukturą katalogów imageboard, wprowadzając jednocześnie zdecentralizowaną własność — każdy może utworzyć tablicę, a wiele tablic może konkurować o to samo miejsce w katalogu poprzez mechanizm głosowania.

## Pliki do pobrania

| Platforma | Link                                         |
| --------- | -------------------------------------------- |
| Sieć      | [5chan.aplikacja](https://5chan.app)         |
| Pulpit    | Dostępne dla komputerów Mac, Windows i Linux |
| Komórka   | Dostępne dla Androida                        |

## Jak działają tablice

5chan organizuje zawartość na tablicach przy użyciu klasycznego układu katalogów (np. `/b/`, `/g/`). W przeciwieństwie do tradycyjnych tablic graficznych, w których każdą tablicę kontroluje centralny administrator, 5chan umożliwia każdemu użytkownikowi utworzenie własnej tablicy i pełne jej posiadanie. Kiedy wiele zarządów celuje w to samo miejsce w katalogu, rywalizują o to miejsce w drodze głosowania.

### Tworzenie tablicy

Aby utworzyć nową tablicę, musisz uruchomić `bitsocial-cli` jako węzeł peer-to-peer. Dzięki temu Twoja tablica będzie hostowana w sposób zdecentralizowany, bez polegania na jakimkolwiek serwerze centralnym.

### Przydziały katalogów

Przypisaniami miejsc katalogowych (która płyta pojawia się w której ścieżce) zarządza się obecnie za pomocą żądań ściągnięcia GitHub do pliku `5chan-directories.json`. Jest to proces tymczasowy — przyszłe wersje będą obsługiwać tworzenie tablic w aplikacji i głosowanie w oparciu o pubsub w celu automatycznego przypisywania katalogów.

## Elementy wewnętrzne

Pod maską 5chan wykorzystuje warstwę API plebbit-js do interakcji protokołów. Jak zauważono w powyższym ostrzeżeniu, te wewnętrzne odniesienia nadal mają starsze nazwy, sprzed rebrandingu Bitsocial.

## Spinki do mankietów

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licencja**: tylko GPL-2.0
