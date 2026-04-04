---
title: Spam Blocker
description: Scentralizowana usługa wykrywania spamu z oceną ryzyka, wyzwaniami OAuth i konfigurowalnymi progami poziomów.
sidebar_position: 1
---

# Spam Blocker

:::warning Starsze nazewnictwo
Ten pakiet został pierwotnie opublikowany w zakresie `@plebbit`. Zmieniono jego nazwę na `@bitsocial/spam-blocker-server` i `@bitsocial/spam-blocker-challenge`. Odniesienia do starych nazw mogą nadal pojawiać się w starszej dokumentacji lub bazach kodów.
:::

Spam Blocker to scentralizowana usługa wykrywania spamu, która ocenia przychodzące publikacje i przypisuje oceny ryzyka. Składa się z dwóch pakietów:

- **`@bitsocial/spam-blocker-server`** — serwer HTTP obsługujący interfejsy API oceny i sprawdzania.
- **`@bitsocial/spam-blocker-challenge`** — lekki pakiet klienta, który społeczności integrują w celu wysyłania publikacji do oceny.

**Kod źródłowy:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Jak działa punktacja ryzyka

Każda publikacja przesłana do punktu końcowego `/evaluate` otrzymuje liczbową ocenę ryzyka. Wynik jest ważoną kombinacją kilku sygnałów:

| Sygnał           | Opis                                                                                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wiek konta       | Nowsze konta otrzymują wyższe oceny ryzyka.                                                                                                                               |
| Karma            | Skumulowana karma społeczności zmniejsza ryzyko.                                                                                                                          |
| Reputacja autora | Dane dotyczące reputacji zebrane przez indeksator sieci w tle.                                                                                                            |
| Analiza treści   | Heurystyka na poziomie tekstu (gęstość łączy, znane wzorce spamu itp.).                                                                                                   |
| Prędkość         | Szybkie kolejne posty tego samego autora zwiększają ryzyko.                                                                                                               |
| Inteligencja IP  | Geolokalizacja na poziomie kraju i wyszukiwanie źródeł zagrożeń. Przechowywane są tylko kody krajów – nieprzetworzone adresy IP nigdy nie są udostępniane społecznościom. |

## Progi poziomów

Ocena ryzyka jest przypisana do jednego z czterech konfigurowalnych poziomów, które określają, co stanie się dalej:

1. **Automatyczna akceptacja** – wynik jest na tyle niski, że publikacja została zatwierdzona bez żadnych zastrzeżeń.
2. **Wystarczający OAuth** – aby kontynuować, autor musi przejść weryfikację OAuth.
3. **OAuth-plus-więcej** — sam protokół OAuth nie wystarczy; wymagana jest dodatkowa weryfikacja (np. CAPTCHA).
4. **Automatyczne odrzucenie** – wynik jest zbyt wysoki; publikacja zostaje natychmiast odrzucona.

Wszystkie wartości progowe można konfigurować dla każdej społeczności.

## Przepływ wyzwań

Kiedy publikacja zalicza się do poziomu wymagającego weryfikacji, rozpoczyna się proces sprawdzania:

1. Autor jest najpierw proszony o uwierzytelnienie za pomocą **OAuth** (GitHub, Google, Twitter i inni obsługiwani dostawcy).
2. Jeśli sam OAuth jest niewystarczający (poziom 3), prezentowana jest **awaria CAPTCHA** obsługiwana przez Cloudflare Turnstile.
3. Tożsamość OAuth służy wyłącznie do weryfikacji – **nigdy nie jest udostępniana** społeczności ani innym użytkownikom.

## Punkty końcowe interfejsu API

### `POST /evaluate`

Prześlij publikację do oceny ryzyka. Zwraca obliczoną ocenę ryzyka i wymaganą warstwę wyzwania.

### `POST /challenge/verify`

Prześlij wynik ukończonego wyzwania (token OAuth, rozwiązanie CAPTCHA lub jedno i drugie) do weryfikacji.

### `GET /iframe/:sessionId`

Zwraca osadzaną stronę HTML, która renderuje odpowiedni interfejs użytkownika wyzwania dla danej sesji.

## Ograniczanie szybkości

Limity stawek są stosowane dynamicznie w oparciu o wiek i reputację autora. Autorzy nowsi lub autorzy o niższej reputacji podlegają bardziej rygorystycznym ograniczeniom, podczas gdy autorzy uznani mogą korzystać z bardziej hojnych progów. Zapobiega to zalewom spamu bez karania zaufanych uczestników.

## Indeksator sieci w tle

Na serwerze działa indeksator działający w tle, który w sposób ciągły przeszukuje sieć w celu tworzenia i utrzymywania danych dotyczących reputacji autora. Dane te są przekazywane bezpośrednio do systemu oceny ryzyka, umożliwiając systemowi rozpoznawanie powtarzających się uczestników działających w dobrej wierze w różnych społecznościach.

## Prywatność

Blokowanie spamu zostało zaprojektowane z myślą o prywatności:

- Tożsamości OAuth są używane wyłącznie do weryfikacji typu „challenge” i **nigdy nie są ujawniane** społecznościom.
- Adresy IP są rozpoznawane na **tylko kody krajów**; Surowe adresy IP nie są przechowywane ani udostępniane.

## Baza danych

Serwer używa **SQLite** (poprzez `better-sqlite3`) do lokalnego utrwalania danych dotyczących reputacji, stanu sesji i konfiguracji.
