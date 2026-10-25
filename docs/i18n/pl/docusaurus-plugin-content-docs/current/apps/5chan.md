---
title: 5chan
description: Bezserwerowy, zdecentralizowany imageboard zbudowany na protokole Bitsocial, na którym każdy może tworzyć własne boardy i być ich właścicielem.
sidebar_position: 1
---

# 5chan

5chan to bezserwerowy, pozbawiony administratorów i w pełni zdecentralizowany imageboard działający na protokole Bitsocial. Zachowuje znajomą strukturę katalogów znaną z imageboardów, wprowadzając przy tym zdecentralizowaną własność — każdy może utworzyć board, a wiele boardów może rywalizować o to samo miejsce w katalogu w drodze głosowania.

## Pliki do pobrania

| Platforma    | Link                                |
| ------------ | ----------------------------------- |
| Przeglądarka | [5chan.app](https://5chan.app)      |
| Komputer     | Dostępny na Maca, Windows i Linuksa |
| Telefon      | Dostępny na Androida                |

## Jak działają boardy

5chan porządkuje treści w boardy z użyciem klasycznego układu katalogów (np. `/b/`, `/g/`). W odróżnieniu od tradycyjnych imageboardów, gdzie centralny administrator kontroluje każdy board, 5chan pozwala dowolnemu użytkownikowi utworzyć własny board i w pełni go posiadać. Kiedy wiele boardów celuje w to samo miejsce w katalogu, rywalizują o tę pozycję; zobacz [Katalogi](/directories/).

### Tworzenie boardu

Aby utworzyć nowy board, musisz uruchomić `bitsocial-cli` jako węzeł peer-to-peer. Dzięki temu twój board jest hostowany w sposób zdecentralizowany, bez polegania na jakimkolwiek centralnym serwerze.

### Przypisania miejsc w katalogu

Boardy kandydujące do każdego katalogu są wymienione w pliku `5chan-directories/5chan-<code>-directory.json` w repozytorium [bitsocialnet/lists](https://github.com/bitsocialnet/lists), a board dołącza do katalogu przez pull request do tego pliku. 5chan prowadzi też głosowanie dla każdego katalogu za pomocą [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): każdy posiadacz 5chan Pass ma jeden głos, a głos na board spoza listy zgłasza go jako kandydata. Głosowania działają obecnie w sieci testowej Base Sepolia, gdzie wyniki są wyświetlane, ale nie zmieniają kolejności na liście.

## Jak to działa od środka

Pod spodem 5chan korzysta ze wspólnej warstwy klienckiej protokołu Bitsocial do komunikacji sieciowej.
Aplikacja webowa pod adresem 5chan.app domyślnie uruchamia węzeł Helia w przeglądarce, więc zwykła
karta dołącza do sieci jako peer: wczytuje boardy od innych peerów i publikuje przez pubsub, bez
scentralizowanej bramy IPFS na ścieżce treści. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/),
aby dowiedzieć się, co się z tym wiąże i czego węzeł w przeglądarce nadal nie potrafi.

## Linki

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licencja**: GPL-2.0-only
