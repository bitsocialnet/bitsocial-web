---
title: Zbuduj własnego klienta Bitsocial
description: Przewodnik dla twórców, którzy chcą wydawać niezależnych klientów Bitsocial – od imageboardów i forów po niszowe aplikacje społecznościowe.
---

# Zbuduj własnego klienta Bitsocial

Bitsocial nie wygrywa dzięki jednej oficjalnej aplikacji do każdego zastosowania. Wygrywa wtedy, gdy
wielu klientów może korzystać z tego samego protokołu, konkurując jednocześnie interfejsem, kulturą,
odkrywaniem treści, ustawieniami domyślnymi i modelem biznesowym.

5chan i Seedit to pierwsze dowody słuszności tego podejścia, a nie sufit. Twórca powinien móc wydać
nowy imageboard, forum, klienta profilowego, aplikację społecznościową projektowaną najpierw pod
telefon, narzędzie dla niszowej społeczności albo scentralizowanego klienta, który pod spodem
korzysta z Bitsocial — bez proszenia o zgodę właściciela platformy.

## Co twórcy mogą zmieniać

Klient Bitsocial może konkurować decyzjami produktowymi bez forkowania całej sieci:

- interfejs i język wizualny
- proces wdrożenia nowego użytkownika
- domyślne ustawienia społeczności
- powierzchnie moderacyjne
- model odkrywania treści
- sposób obsługi mediów
- ograniczenia urządzeń mobilnych, komputerów albo łączy o niskiej przepustowości
- monetyzacja i model biznesowy

Wspólną warstwą jest protokół. Warstwa produktu pozostaje otwarta na konkurencję.

## Najszybszy sposób nauki

Zacznij od aplikacji, które już istnieją:

- Wypróbuj [5chan](https://5chan.app) w anonimowych społecznościach imageboardowych.
- Wypróbuj [Seedit](https://seedit.app) do dyskusji w stylu Reddita.
- Przeczytaj dokumentację [hooków React dla Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) opisującą integrację po stronie klienta.
- Przeczytaj dokumentację [Bitsocial CLI](/developer-tools/cli/) opisującą operacje na węzłach i społecznościach.

Jeśli chcesz działać szybko, najpierw dołóż się do istniejącej aplikacji. Jeśli interfejs, kultura
albo model społeczności, na których ci zależy, do niej nie pasują, zbuduj osobnego klienta.

## Wybierz wąską pierwszą wersję

Najlepsza pierwsza wersja to nie uniwersalna aplikacja społecznościowa. To klient z jedną wyraźną
grupą odbiorców i jednym mocnym powodem istnienia.

Dobre punkty wyjścia to między innymi:

- czystszy klient imageboardu dla jednej konkretnej kultury
- klient forum projektowany najpierw pod telefon
- aplikacja dla pojedynczej społeczności z surowymi ustawieniami domyślnymi
- klient dla społeczności twórców
- klient do odkrywania treści działający tylko do odczytu
- konsola moderacyjna lub operatorska
- klient zoptymalizowany pod język, region albo klasę urządzeń

Małe klienty mają sens, bo Bitsocial pozwala im wrosnąć w tę samą sieć, zamiast zamykać ich
użytkowników w prywatnej bazie danych.

## Ścieżki wdrożenia

Praktyczne ścieżki są trzy:

1. Sforkuj istniejącego klienta, jeśli twój pomysł jest bliski 5chan lub Seedit.
2. Zbuduj nowego klienta React z użyciem [hooków React dla Bitsocial](https://hooks.bitsocial.net/).
3. Zbuduj własną integrację opartą na API węzła i publicznej infrastrukturze RPC.

Publiczny RPC powinien uczynić trzecią ścieżkę znacznie bardziej praktyczną. Użytkownik może zacząć
od hostowanego, niepowierniczego dostawcy RPC, a później przejść na własny hosting albo do
konkurencyjnego dostawcy.

## Zasada projektowa

Zbuduj klienta, który powinien istnieć dla twojej społeczności, a potem pozwól kompatybilnym
klientom konkurować publicznie.
