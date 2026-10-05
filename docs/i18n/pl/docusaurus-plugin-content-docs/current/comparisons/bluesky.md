---
title: Bitsocial i Bluesky
description: Jak Bluesky i AT Protocol, z osobistymi serwerami danych, przekaźnikami i AppView, wypadają w porównaniu ze społecznościami peer-to-peer Bitsocial.
---

# Bitsocial i Bluesky

[Bluesky](https://bsky.app/) to aplikacja do mikroblogowania zbudowana na
[AT Protocol](https://atproto.com/), zaprojektowanym przez Bluesky Social PBC. Protokół dzieli sieć
społecznościową na osobne usługi: osobiste serwery danych hostują konta, przekaźniki agregują je w
jeden strumień, a AppView indeksują ten strumień, tworząc osie czasu i wątki, które widzą ludzie.
Dokumentacja opisuje dane kont jako przechowywane na serwerach hostujących, „w przeciwieństwie do
modelu peer-to-peer” ([przegląd](https://atproto.com/guides/overview)).

## Jak działa AT Protocol

- **Repozytoria na serwerach.** Każdy post, polubienie czy obserwacja to rekord w podpisanym
  repozytorium autora, hostowanym na osobistym serwerze danych (PDS). Bluesky prowadzi domyślne
  serwery, a każdy może hostować własny.
- **Przekaźniki.** Przekaźniki subskrybują każdy PDS i retransmitują zmiany jako jeden strumień, tzw.
  firehose. Od aktualizacji protokołu w 2025 roku nie archiwizują już każdego repozytorium, co
  znacznie obniżyło koszty ich utrzymania
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView.** AppView indeksuje cały firehose i udostępnia osie czasu, kompletne wątki odpowiedzi,
  liczniki i wyszukiwanie. To najbardziej zasobożerna część sieci.
- **Tożsamość.** Konto to DID: zwykle `did:plc`, zarejestrowany w jednym globalnym katalogu, albo
  `did:web`, powiązany z domeną. Dokument DID podaje handle konta, klucz podpisujący i bieżący
  serwer. Klucz podpisujący trzyma PDS; `did:plc` pozwala też użytkownikom mieć własne klucze
  rotacyjne, dzięki którym mogą się przenieść bez pomocy starego hosta
  ([przewodnik po tożsamości](https://atproto.com/guides/identity)).
- **Handle.** Handle to nazwy DNS, np. `alice.bsky.social` lub domena należąca do użytkownika,
  weryfikowane względem DID.
- **Moderacja.** Hosting i zasięg to osobne warstwy. Każdy może prowadzić labeler, a użytkownicy mogą
  łączyć kilka naraz ([przewodnik po moderacji](https://atproto.com/guides/moderation)), ale
  aplikacja Bluesky zawsze stosuje własną moderację Bluesky. Autorzy mogą ograniczać, kto może
  odpowiadać na ich posty, i ukrywać odpowiedzi.

## Czym się różnią

### Serwery czy peery

Dane Bluesky są na serwerach: PDS hostuje każde konto, przekaźniki przenoszą firehose, a AppView
udostępniają to, co wyświetlają klienci. Przeglądarka jest klientem HTTP tych usług, nigdy peerem. W
Bitsocial treść udostępniają węzeł społeczności i peery, które ją czytają, a aplikacja webowa może
uruchomić własny węzeł peer-to-peer. Zobacz [Peer-to-peer w przeglądarce](/browser-p2p/).

### Globalny widok czy społeczności

AT Protocol zaprojektowano z myślą o jednym globalnym widoku: AppView widzi każdą odpowiedź, więc
wątki i wyszukiwanie są kompletne. Bitsocial nie ma globalnego indeksu; każda społeczność publikuje
własny stan, a aplikacje budują na nim odkrywanie treści. Zobacz [Odkrywanie treści](/content-discovery/).

Bluesky nie ma dziś obiektu społeczności dla publicznych postów. W czerwcu 2026 roku Bluesky
[zapowiedział natywne społeczności](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), w
których na niektórych poziomach prywatności publikowanie wymaga zatwierdzenia; do października 2026
roku nie zostały uruchomione. W Bitsocial społeczności są podstawowym obiektem, a węzeł społeczności
przyjmuje lub odrzuca posty.

### Ochrona przed spamem

Bluesky walczy ze spamem za pomocą limitów częstotliwości na swoich serwerach, ograniczeń dla nowych
hostów na poziomie przekaźnika, automatycznego wykrywania, weryfikacji przez ludzi i etykiet, a
autorzy mogą ograniczać odpowiedzi. Nie ma bramy na poziomie społeczności, która decydowałaby, przez
co post musi przejść, zanim zostanie przyjęty. W Bitsocial każda społeczność wybiera własne
wyzwanie. Zobacz [Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Kto trzyma klucze

Konta na serwerach Bluesky logują się hasłem, a te serwery przechowują ich klucze podpisujące w
modelu powierniczym ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)). Według inżyniera
protokołu Bluesky
[większość kont nie ma niezależnie kontrolowanych kluczy rotacyjnych](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Tożsamość w Bitsocial to para kluczy wygenerowana i przechowywana przez aplikację użytkownika.

### Utrzymanie infrastruktury

Osobisty serwer jest tani: [referencyjny PDS](https://github.com/bluesky-social/pds) zaleca 1 GB RAM
dla maksymalnie 20 użytkowników. Niezależny AppView obejmujący całą sieć to duży projekt; jeden
zbudowany w 2025 roku
[kosztował około 200 dolarów miesięcznie](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), głównie za
16 TB przestrzeni dyskowej. Bitsocial nie ma globalnego indeksu do replikowania, a węzeł społeczności
działa na sprzęcie konsumenckim.

## Porównanie

| Pytanie                  | Bluesky (AT Protocol)                                                                      | Bitsocial                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Kategoria                | Serwery federacyjne z globalnym indeksem                                                   | Sieć społeczności peer-to-peer                                                        |
| Tożsamość                | DID, z kluczami podpisującymi zwykle trzymanymi przez serwer                               | Pary kluczy Ed25519 dla użytkowników i społeczności                                   |
| Gdzie są posty           | Repozytorium autora na osobistym serwerze danych                                           | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                 |
| Kto utrzymuje dostępność | Hosty PDS, przekaźniki i AppView, domyślnie prowadzone przez Bluesky                       | Węzeł właściciela społeczności plus pomocnicze węzły seedujące                        |
| Społeczności             | Na razie brak dla publicznych postów (zapowiedziane w 2026 roku)                           | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                        |
| Ochrona przed spamem     | Limity częstotliwości na serwerach, automatyczne wykrywanie, etykiety, kontrola odpowiedzi | Wyzwanie danej społeczności przed przyjęciem posta                                    |
| Moderacja                | Łączone labelery; aplikacja Bluesky zawsze stosuje moderację Bluesky                       | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują |
| Nazwy                    | Handle DNS weryfikowane względem DID                                                       | Nazwy `.bso` i `.eth` wskazujące na klucze                                            |
| Przeglądarka             | Klient HTTP serwera PDS i AppView                                                          | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                      |
| Główny kompromis         | Kompletne globalne wątki i wyszukiwanie, ale agregacja wymaga ciężkich serwerów            | Brak ciężkiego globalnego indeksu, ale też brak pełnego widoku całej sieci            |
