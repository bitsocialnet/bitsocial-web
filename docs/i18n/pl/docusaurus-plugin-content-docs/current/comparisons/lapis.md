---
title: Bitsocial i Lapis Net
description: Jak Lapis Net, napisany w Kotlinie społecznościowy protokół peer-to-peer z ocenami zaufania liczonymi dla każdego odbiorcy i widocznością opartą na Bitcoinie, wypada w porównaniu z Bitsocial.
---

# Bitsocial i Lapis Net

[Lapis Net](https://net.lapisproject.dev/) to protokół peer-to-peer dla sieci społecznościowych,
napisany w Kotlinie na JVM. Niezależnie doszedł do fundamentów zbliżonych do Bitsocial: tożsamości
opartych na parach kluczy, przechowywania treści w stylu IPFS i gossipsub z libp2p. Oba projekty
różnią się tym, gdzie umieszczają filtrowanie spamu i kurację treści. Lapis daje każdemu odbiorcy
osobisty graf zaufania i pozwala płatnościom w Bitcoinie i Lightning zwiększać widoczność; Bitsocial
pozwala każdej społeczności decydować, co można publikować.

Lapis to działający prototyp. W październiku 2026 roku nie miał jeszcze publicznej sieci, a
połączenie dwóch węzłów wymagało ręcznego kroku, według jego
[repozytorium](https://github.com/lapisproject-dev/Lapis-Net).

## Jak działa Lapis

- **Tożsamości.** Każda tożsamość to para kluczy secp256k1, zgodna z kluczami Bitcoina, z powiązanym
  kluczem Ed25519 dla identyfikatora peera w libp2p.
- **Przechowywanie i propagacja.** Treść jest przechowywana za pomocą Nabu, implementacji IPFS na
  libp2p (DHT i Bitswap), i rozsyłana przez gossipsub z libp2p.
- **Oceny.** Cztery opcjonalne oceny działają na rdzeniu, który pozostaje neutralny wobec kuracji
  treści:
  - Veritas, sieć zaufania (web of trust) obliczana z własnego grafu zaufania każdego odbiorcy
  - Virtus, widoczność zabezpieczona dowodami płatności onchain lub w Lightning, które z czasem tracą
    moc
  - Karma, darmowe polubienia ważone przez Veritas
  - Madli, ocena reputacji, którą węzły prowadzą na temat wzajemnego zachowania
- **Komunikacja.** Częścią projektu są szyfrowane end-to-end wiadomości prywatne, rozmowy głosowe
  jeden na jeden i asynchroniczny system wiadomości podobny do poczty e-mail.
- **Klienci.** Każdy użytkownik uruchamia węzeł JVM. Klient referencyjny to interfejs webowy
  serwowany przez ten lokalny węzeł.

## Czym się różnią

### Kto filtruje spam

Lapis filtruje po stronie odbiorcy. Treść się rozchodzi, a potem graf zaufania każdego odbiorcy i
reguły płatności aplikacji, z której korzysta, decydują, co wypływa na wierzch. Bitsocial filtruje na
poziomie społeczności: post musi przejść wyzwanie społeczności, zanim węzeł społeczności go przyjmie,
więc odrzucony spam nigdy nie staje się częścią społeczności. Zobacz
[Niestandardowe wyzwania antyspamowe](/custom-challenges/).

### Kto ma władzę

W Lapis każdy odbiorca decyduje, komu ufa, a operator każdej aplikacji decyduje, jak działa w niej
płatna widoczność. W Bitsocial właściciel społeczności ustala zasady dla tej jednej społeczności, a
aplikacje wybierają, co pokazują. Żaden z projektów nie ma administratora na poziomie protokołu.

### Ekonomia

Lapis wbudowuje dowody płatności w Bitcoinie i Lightning w swoją ocenę widoczności. Bitsocial nie ma
warstwy płatności w protokole; społeczność może wymagać płatności lub tokena przez swoje wyzwanie.

### Przeglądarka

Aplikacje Bitsocial mogą uruchamiać węzeł peer-to-peer w zwykłej karcie przeglądarki. Zobacz
[Peer-to-peer w przeglądarce](/browser-p2p/). Interfejs przeglądarkowy Lapis to lokalna strona
serwowana przez węzeł JVM użytkownika.

### Zakres

Lapis łączy wiadomości prywatne, rozmowy głosowe i pocztę. Bitsocial skupia się na publicznych
społecznościach i nie ma jeszcze natywnych wiadomości prywatnych.

## Porównanie

| Pytanie              | Lapis Net                                                                                | Bitsocial                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Kategoria            | Społecznościowy protokół peer-to-peer (prototyp)                                         | Sieć społeczności peer-to-peer                                                                   |
| Tożsamość            | Para kluczy secp256k1 z powiązanym identyfikatorem peera Ed25519                         | Pary kluczy Ed25519 dla użytkowników i społeczności                                              |
| Gdzie są posty       | Magazyn Nabu (IPFS na libp2p) na uczestniczących węzłach                                 | Węzeł właściciela społeczności oraz peery, które ją czytają i seedują                            |
| Społeczności         | Brak obiektu społeczności; kuracja odbywa się dla każdego odbiorcy i każdej aplikacji    | Pełnoprawne obiekty, których węzeł przyjmuje lub odrzuca posty                                   |
| Ochrona przed spamem | Graf zaufania odbiorcy, płatna widoczność, depozyty Lightning za pierwsze wiadomości     | Wyzwanie danej społeczności przed przyjęciem posta                                               |
| Moderacja            | Graf zaufania każdego odbiorcy; operatorzy aplikacji ustalają zasady płatnej widoczności | Właściciele społeczności moderują swoją społeczność; aplikacje wybierają, co pokazują            |
| Ekonomia             | Dowody płatności w Bitcoinie i Lightning w ocenach                                       | Brak w protokole; wyzwanie może wymagać płatności lub tokena                                     |
| Przeglądarka         | Lokalny interfejs webowy serwowany przez węzeł JVM                                       | Węzeł peer-to-peer w zwykłej karcie przeglądarki                                                 |
| Sieć                 | Prototyp bez publicznej sieci                                                            | Działająca sieć z aplikacjami takimi jak [5chan](/apps/5chan/) i [Seedit](/apps/seedit/)         |
| Główny kompromis     | Bogata wbudowana reputacja i komunikacja, ale jeszcze bez publicznej sieci               | Mniejszy rdzeń działający w przeglądarkach, ale bez wbudowanej reputacji i wiadomości prywatnych |

## Czy mogłyby działać razem?

Wyzwania Bitsocial to dowolny kod, więc ocena zaufania w stylu Lapis mogłaby stać się jednym z nich.
Wbudowane wyzwanie `whitelist` potrafi już odczytywać listy dozwolonych adresów z adresów URL. Usługa
publikująca adresy Bitsocial, którym ufa graf Veritas, mogłaby pozwolić tym autorom pominąć CAPTCHA
w danej społeczności. Wymagałoby to sposobu powiązania tożsamości Lapis z adresem Bitsocial, a nic
takiego dziś nie istnieje.
