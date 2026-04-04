---
title: Zbuduj klienta imageboardu
description: Przewodnik po wkładzie w fazę 1 dla twórców, którzy chcą dostarczać nowe doświadczenia związane z tablicami graficznymi w Bitsocial.
sidebar_position: 1
---

# Zbuduj klienta imageboardu

Faza 1 nie obejmuje jednej oficjalnej aplikacji obejmującej całą kategorię. 5chan jest pierwszym dowodem, ale rzeczywistym celem jest szeroki ekosystem tablic graficznych: wielu klientów Bitsocial z różnymi językami wizualnymi, domyślnymi ustawieniami moderacji, modelami katalogów i społecznościami docelowymi.

## Czego potrzebuje faza 1

- Znani klienci w stylu 4chan do głównego nurtu wdrożenia
- Klienci inspirowani Altchan z różnymi kulturami i pakietami desek
- Klienci mobilni lub klienci o niskiej przepustowości
- Klienci należący do jednej społeczności lub niszowi, z mocnymi opiniami dotyczącymi niewypłacalności
- Lepsze przepływy moderacji, multimediów, wdrażania i odkrywania niż w przypadku pierwszej aplikacji

## Najszybszy sposób na pomoc

Jeśli chcesz najkrótszej drogi do wysyłki, najpierw przekaż darowiznę bezpośrednio na 5chan:

- Przeglądaj aplikację na żywo pod adresem [5chan.aplikacja](https://5chan.app)
- Przejrzyj źródło na [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Dołącz do czatu konstruktora na [t.me/fivechandev](https://t.me/fivechandev)

## Zbuduj własnego klienta

Jeśli 5chan nie pasuje do żądanej społeczności lub interfejsu, zamiast tego zbuduj osobnego klienta. Kompatybilni klienci Bitsocial mogą współużytkować tę samą sieć bez konieczności podejmowania tych samych decyzji dotyczących produktu.

1. Poznaj narzędzia związane z protokołami:
   - [Haki Bitsocial Reakcja](../react-hooks/)
   - [Bitsocialowy interfejs wiersza polecenia](../cli/)
2. Zdecyduj, jaki rodzaj tablicy graficznej faktycznie budujesz.
Najpierw wybierz strukturę tablicy, założenia dotyczące tożsamości, model moderacji, przepływ odkryć i język wizualny.
3. Wybierz ścieżkę wdrożenia pasującą do projektu.
Fork 5chan, jeśli chcesz szybko poruszać się dzięki znanej bazie obrazów. Zacznij od nowa, jeśli interfejs użytkownika lub model interakcji musi się radykalnie różnić.
4. Wyślij wąską pierwszą wersję.
Jeden klient, który dobrze służy jednej prawdziwej społeczności, jest cenniejszy niż niejasny klon, który ma zadowolić wszystkich.
5. Opublikuj wynik i pozwól społeczności go przetestować.
Bitsocial poprawia się, gdy zewnętrzni twórcy dostarczają upartych klientów, którzy konkurują z jakością produktu, zamiast czekać, aż jedna oficjalna aplikacja zrobi wszystko.

## Zasada projektowania

Bitsocial nie wygrywa mając jednego błogosławionego klienta. Wygrywa, gdy wielu klientów może współistnieć, rozdzielać się, specjalizować i zaspokajać potrzeby, których pierwsza aplikacja nigdy nie będzie w stanie osiągnąć.
