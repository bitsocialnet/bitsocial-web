---
title: Bitsocial i ActivityPub
description: Jak Fediverse, z Mastodonem do mikroblogowania i Lemmy do społeczności w stylu Reddita, wypada w porównaniu ze społecznościami peer-to-peer Bitsocial.
---

# Bitsocial i ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) to standard W3C, na którym opiera się Fediverse.
Użytkownicy wybierają serwer, nazywany instancją, który hostuje ich konto, a serwery wymieniają się
postami. [Mastodon](https://joinmastodon.org/) to jego najbardziej znane oprogramowanie do
mikroblogowania; [Lemmy](https://join-lemmy.org/) to agregator linków i forum w stylu Reddita,
zbudowane z tematycznych społeczności, co czyni je najbliższym odpowiednikiem w Fediverse dla
aplikacji Bitsocial, takich jak [Seedit](/apps/seedit/).

## Jak działa ActivityPub

- **Skrzynki odbiorcze i nadawcze.** Każde konto ma skrzynkę odbiorczą (inbox) i nadawczą (outbox).
  Serwery dostarczają aktywności do skrzynek odbiorczych na innych serwerach, a każdy serwer
  odbierający przechowuje własną kopię tego, co obserwują jego użytkownicy.
- **Tożsamość należąca do serwera.** Identyfikatory kont i postów to adresy HTTPS w domenie serwera
  źródłowego. Handle w Mastodonie ma postać `@user@domain` i jest rozwiązywany przez WebFinger, a
  serwer podpisuje wiadomości federacyjne w imieniu użytkownika.
- **Klienci.** Aplikacje i przeglądarki komunikują się wyłącznie z serwerem użytkownika, przez API
  tego serwera.
- **Społeczności Lemmy.** Społeczność to aktor grupowy hostowany na jednej instancji. Użytkownicy
  wysyłają posty do społeczności, która rozsyła je dalej do swoich obserwujących; zgodnie ze wspólnym
  standardem forów
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) społeczność
  może najpierw weryfikować posty, aż po ręczne zatwierdzanie przez moderatorów.
- **Moderacja.** Moderacja jest lokalna dla każdego serwera. Administratorzy mogą zawieszać konta,
  blokować całe serwery albo federować się tylko z serwerami z listy dozwolonych; Lemmy ma też
  moderatorów poszczególnych społeczności.
- **Ochrona przed spamem.** ActivityPub nie definiuje żadnego mechanizmu antyspamowego. Mastodon i
  Lemmy ograniczają rejestrację przez zatwierdzanie, zaproszenia, pytania w formularzu, captche i
  weryfikację e-mail, a potem polegają na limitach częstotliwości, zgłoszeniach i moderacji.

## Czym się różnią

### Tożsamość należy do domeny

Konto w Fediverse należy do domeny swojego serwera. Mastodon potrafi przekierować obserwujących na
nowe konto, ale [posty się nie przenoszą](https://docs.joinmastodon.org/user/moving/), przeprowadzkę
trzeba rozpocząć na starym serwerze i obowiązuje 30-dniowy okres karencji. W Bitsocial profile i
społeczności to pary kluczy, więc zmiana hosta lub aplikacji nie zmienia tożsamości. Zobacz
[Tożsamość i własność społeczności](/identity-and-ownership/).

### Gdzie znajduje się społeczność

Społeczność Lemmy jest strukturalnie bliska społeczności Bitsocial: posty trafiają do społeczności,
która może je sprawdzić przed rozesłaniem. Różnica polega na tym, gdzie się znajduje. Społeczność
Lemmy można utworzyć tylko na macierzystej instancji jej twórcy, administrator instancji ma nad nią
[pełną kontrolę](https://join-lemmy.org/docs/users/05-censorship-resistance.html) i nie ma
udokumentowanego sposobu przeniesienia jej na inną instancję. Społeczność Bitsocial jest własną parą
kluczy: właściciel może uruchomić jej węzeł w dowolnym miejscu i żaden administrator serwera nie
stoi nad nią.

### Ochrona przed spamem

Serwery Fediverse zatrzymują spam głównie przy rejestracji, a potem moderują. Społeczność Bitsocial
uruchamia wyzwanie przy każdym poście, zanim go przyjmie, a każda społeczność wybiera własne:
captchę, listę dozwolonych, płatność lub dowolny inny kod. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Utrzymanie infrastruktury

Prowadzenie instancji oznacza stale włączony serwer z domeną, TLS i pocztą e-mail. Mastodon
potrzebuje dodatkowo bazy PostgreSQL, serwera Redis i procesów roboczych działających w tle; Lemmy
jest lżejsze i według własnych danych zużywa około 150 MB RAM. Każda instancja przechowuje kopie
zdalnych treści obserwowanych przez jej użytkowników. Węzeł społeczności Bitsocial nie potrzebuje
domeny ani certyfikatu i działa z aplikacji desktopowej lub `bitsocial-cli`.

### Co serwery dają w zamian

Serwery Fediverse przechowują pełną historię i niezawodnie ją udostępniają, a Mastodon ma dojrzałe
narzędzia moderacyjne rozwijane latami. Bitsocial nie gwarantuje starych treści na zawsze, a jego
narzędzia moderacyjne znajdują się w poszczególnych aplikacjach.

## Porównanie

| Pytanie                  | ActivityPub (Mastodon, Lemmy)                                                            | Bitsocial                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Kategoria                | Serwery federacyjne                                                                      | Sieć społeczności peer-to-peer                                                        |
| Tożsamość                | Konto w domenie serwera, podpisywane przez serwer                                        | Pary kluczy Ed25519 dla użytkowników i społeczności                                   |
| Gdzie są posty           | Serwer źródłowy oraz kopie na każdym obserwującym serwerze                               | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                 |
| Kto utrzymuje dostępność | Administratorzy instancji                                                                | Węzeł właściciela społeczności plus pomocnicze węzły seedujące                        |
| Społeczności             | Społeczności Lemmy hostowane na jednej instancji                                         | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                        |
| Ochrona przed spamem     | Bariery przy rejestracji, limity częstotliwości, zgłoszenia i moderacja                  | Wyzwanie danej społeczności przed przyjęciem posta                                    |
| Moderacja                | Administratorzy serwerów i moderatorzy społeczności, lokalnie na każdym serwerze         | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują |
| Nazwy                    | Handle `@user@domain` i `!community@domain`                                              | Nazwy `.bso` i `.eth` wskazujące na klucze                                            |
| Przeglądarka             | Klient serwera użytkownika                                                               | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                      |
| Główny kompromis         | Niezawodna historia i dojrzała moderacja, ale tożsamość i społeczności należą do serwera | Nie trzeba serwera ani domeny, ale stare treści nie są gwarantowane na zawsze         |
