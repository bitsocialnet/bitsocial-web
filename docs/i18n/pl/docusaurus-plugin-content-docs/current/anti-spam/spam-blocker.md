---
title: Spam Blocker
description: Scentralizowana usługa wykrywania spamu z punktacją ryzyka, wyzwaniami OAuth i konfigurowalnymi progami poziomów.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker to scentralizowana usługa wykrywania spamu, która ocenia napływające publikacje i przypisuje im punktację ryzyka. Składa się z dwóch pakietów:

- **`@bitsocial/spam-blocker-server`** -- serwer HTTP udostępniający API oceny i wyzwań.
- **`@bitsocial/spam-blocker-challenge`** -- lekki pakiet kliencki, który społeczności integrują u siebie, aby wysyłać publikacje do oceny.

**Kod źródłowy:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Jak działa punktacja ryzyka

Każda publikacja przesłana do endpointu `/evaluate` dostaje liczbową punktację ryzyka. Wynik jest ważoną kombinacją kilku sygnałów:

| Sygnał             | Opis                                                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Wiek konta         | Nowsze konta dostają wyższą punktację ryzyka.                                                                                             |
| Karma              | Zgromadzona karma w społeczności obniża ryzyko.                                                                                           |
| Reputacja autora   | Dane o reputacji zbierane przez działający w tle indekser sieci.                                                                          |
| Analiza treści     | Heurystyki na poziomie tekstu (gęstość linków, znane wzorce spamu itp.).                                                                  |
| Tempo publikowania | Szybkie serie wpisów od tego samego autora podnoszą ryzyko.                                                                               |
| Dane o adresach IP | Geolokalizacja na poziomie kraju i sprawdzanie w kanałach informacji o zagrożeniach. Surowe adresy IP nigdy nie trafiają do społeczności. |

## Progi poziomów

Punktacja ryzyka przekłada się na jeden z czterech konfigurowalnych poziomów, które decydują o dalszym przebiegu:

1. **Automatyczna akceptacja** -- wynik jest na tyle niski, że publikacja zostaje przyjęta bez żadnego wyzwania.
2. **Wystarczy OAuth** -- autor musi przejść weryfikację OAuth, aby kontynuować.
3. **OAuth i coś więcej** -- sam OAuth nie wystarcza; wymagana jest dodatkowa weryfikacja (np. CAPTCHA).
4. **Automatyczne odrzucenie** -- wynik jest zbyt wysoki; publikacja zostaje odrzucona od razu.

Wszystkie wartości progów można konfigurować osobno dla każdej społeczności.

## Przebieg wyzwania

Gdy publikacja trafia do poziomu wymagającego weryfikacji, zaczyna się przebieg wyzwania:

1. Autor zostaje najpierw poproszony o uwierzytelnienie przez **OAuth** (GitHub, Google, Twitter i inni obsługiwani dostawcy).
2. Jeśli sam OAuth nie wystarcza (poziom 3), pojawia się **awaryjna CAPTCHA** oparta na Cloudflare Turnstile.
3. Tożsamość z OAuth służy wyłącznie do weryfikacji -- **nigdy nie jest przekazywana** społeczności ani innym użytkownikom.

## Endpointy API

### `POST /evaluate`

Przesyła publikację do oceny ryzyka. Zwraca wyliczoną punktację ryzyka i wymagany poziom wyzwania.

### `POST /challenge/verify`

Przesyła do weryfikacji wynik ukończonego wyzwania (token OAuth, rozwiązanie CAPTCHA albo oba).

### `GET /iframe/:sessionId`

Zwraca osadzalną stronę HTML, która renderuje interfejs wyzwania właściwy dla danej sesji.

## Ograniczanie liczby żądań

Limity żądań są dobierane dynamicznie na podstawie wieku i reputacji autora. Nowsi autorzy oraz ci o niższej reputacji podlegają ostrzejszym limitom, a autorzy o ugruntowanej pozycji mają progi bardziej hojne. Dzięki temu system powstrzymuje zalewy spamu, nie karząc zaufanych uczestników.

## Działający w tle indekser sieci

Serwer uruchamia działający w tle indekser, który nieprzerwanie przeszukuje sieć, aby budować i utrzymywać dane o reputacji autorów. Dane te zasilają wprost proces oceny ryzyka, dzięki czemu system rozpoznaje uczestników działających w dobrej wierze w różnych społecznościach.

## Prywatność

Spam Blocker zaprojektowano z myślą o prywatności:

- Tożsamości OAuth służą wyłącznie do weryfikacji wyzwań i **nigdy nie są ujawniane** społecznościom.
- Operator usługi przechowuje surowe adresy IP w celu wykrywania nadużyć i wysyła je do klasyfikacji zewnętrznemu dostawcy danych o adresach IP.
- Społeczności otrzymują tylko kod kraju, ryzyko IP i szacowany typ połączenia, nigdy surowy adres IP.

## Baza danych

Serwer korzysta z **SQLite** (poprzez `better-sqlite3`) do lokalnego przechowywania danych o reputacji, stanu sesji i konfiguracji.
