---
title: Mintpass
description: System uwierzytelniania oparty na NFT, który pomaga społecznościom Bitsocial weryfikować użytkowników i ograniczać ataki sybil.
sidebar_position: 2
---

# Mintpass

Mintpass to system uwierzytelniania oparty na NFT dla społeczności Bitsocial. Użytkownicy tworzą niezbywalny weryfikacyjny NFT po ukończeniu wyzwania (takiego jak SMS OTP), a społeczności mogą sprawdzić własność NFT, aby zabezpieczyć się przed atakami sybil, takimi jak fałszywe głosy, unikanie banów i spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licencja**: MIT

## Jak to działa

Proces weryfikacji składa się z czterech etapów:

1. **Żądanie** — użytkownik odwiedza `mintpass.org/request`, aby rozpocząć proces.
2. **Wyzwanie** — użytkownik przechodzi weryfikację jednorazowego hasła za pomocą wiadomości SMS.
3. **Mint** — Po pomyślnej weryfikacji w portfelu użytkownika zostaje wybity niezbywalny banknot NFT.
4. **Zweryfikuj** — społeczności pytają o własność NFT, aby potwierdzić, że użytkownik został zweryfikowany.

Ponieważ NFT nie podlega przeniesieniu, pozostaje powiązany z portfelem, który zakończył weryfikację, uniemożliwiając użytkownikom handel lub sprzedaż ich zweryfikowanego statusu.

## Struktura projektu

Repozytorium podzielone jest na trzy główne obszary:

| Katalog      | Cel                                                      |
| ------------ | -------------------------------------------------------- |
| `contracts/` | Inteligentne kontrakty Solidity do weryfikacji NFT.      |
| `challenge/` | Warstwa integracyjna dla systemu wyzwań Bitsocial.       |
| `web/`       | Nakładka Next.js i React na potrzeby procesu menniczego. |

## Prywatność i przetwarzanie danych

Mintpass stosuje podejście oparte na minimalnej ilości danych:

- **Dane operacyjne** (kody OTP, tokeny sesji) są przechowywane w Redis z krótkimi TTL i automatycznie wygasają.
- **Skojarzenie mennicy** (połączenie zweryfikowanej tożsamości z portfelem) to jedyny trwały zapis.

Po zamknięciu okna weryfikacji żadne numery telefonów ani dane osobowe nie są zachowywane.

## Opcjonalne warstwy zabezpieczeń

Operatorzy społeczności mogą włączyć dodatkowe zabezpieczenia w zależności od modelu zagrożenia:

- **Sprawdzanie reputacji adresu IP** — Oceniaj przychodzące żądania w oparciu o znane bazy danych o nadużyciach.
- **Ocena ryzyka telefonu** – Oznacz numery jednorazowe lub numery VoIP przed wyzwaniem.
- **Geoblokowanie** – Ogranicz weryfikację do określonych regionów.
- **Okresy oczekiwania na adres IP** — Powtarzające się próby weryfikacji z limitem szybkości z tego samego adresu.

## Stos technologii

| Warstwa   | Technologia                            |
| --------- | -------------------------------------- |
| Umowy     | Solidność wdrożona z Hardhat i Foundry |
| Interfejs | Następny.js + Reaguj                   |
| Sieć      | Baza (Ethereum L2)                     |

Wdrożenie w wersji Base pozwala utrzymać niskie koszty gazu, jednocześnie dziedzicząc gwarancje bezpieczeństwa Ethereum.

## Plan działania

Planowane ulepszenia obejmują:

- **Opcja Pay-to-mint** — Pozwól społecznościom wymagać niewielkiej opłaty za bicie monet, co stanowi ekonomiczną barierę sybilną.
- **Dodatkowe sygnały weryfikacyjne** — wykraczają poza SMS-y i obejmują inne sygnały tożsamości.
- **Rozszerzone narzędzia administracyjne** — Bogatsze pulpity nawigacyjne i elementy sterujące dla operatorów społeczności.
