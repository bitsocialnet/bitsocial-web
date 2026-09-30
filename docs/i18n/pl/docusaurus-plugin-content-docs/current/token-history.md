---
title: Historia tokena BSO
description: Pełna historia kolejnych generacji tokena BSO – od początków na Avalanche w 2021 roku po dzisiejszy niezmienny kontrakt na Ethereum pozbawiony administratora.
---

# Historia tokena BSO

BSO to token, którego wyróżnikiem jest udokumentowane pochodzenie. Protokół stojący za Bitsocial
jest otwarty, a token i blockchain są z założenia opcjonalne: każdy może sforkować kod, uruchomić
własnego klienta albo zbudować na nim własną gospodarkę. Czego nie da się sforkować, to pochodzenie.
BSO jest oficjalnym tokenem Bitsocial od pierwszego dnia, a każda kolejna migracja daje się
zweryfikować on-chain.

Ta strona wymienia po kolei wszystkie generacje tokena wraz z pełnymi adresami kontraktów, żeby
każdy mógł niezależnie sprawdzić ten zapis.

## Gen 1: początek, Avalanche, 2021

- **Blockchain**: Avalanche
- **Rok**: 2021
- **Adres**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Eksplorator**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Tutaj zaczął się BSO. Podaż została rozdana w trzech airdropach i w nagrodach za liquidity mining,
bez presale i bez puli dla zespołu wydzielonej przed społecznością. Kontrakt był aktualizowalnym proxy, co było wtedy standardową
praktyką i pozwalało zespołowi wydawać poprawki we wczesnym okresie życia tokena.

## Gen 2: przejście na Ethereum, 2024

- **Blockchain**: Ethereum
- **Rok**: 2024
- **Adres**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Eksplorator**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 przeniósł BSO z Avalanche na Ethereum, gdzie powstaje reszta mapy drogowej Bitsocial Chain.
Podobnie jak Gen 1, ten kontrakt wciąż był aktualizowalnym proxy — utrzymanym przez jeszcze jedną
generację, w czasie gdy przygotowywano ostateczny, docelowy kontrakt.

## Gen 3: pełna niezmienność, 2025

- **Blockchain**: Ethereum
- **Rok**: 2025
- **Adres**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Eksplorator**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 to obecny i ostateczny kontrakt BSO. Jest w pełni niezmienny i pozbawiony administratora:

- brak funkcji mint, więc podaży nie da się zwiększyć
- brak adresu właściciela, więc nikt nie może jednostronnie zmienić działania kontraktu
- brak funkcji pauzy, więc transferów nie da się zamrozić
- brak wzorca proxy, więc samej logiki nie da się później podmienić

To stan docelowy, do którego prowadziły dwie pierwsze generacje: token, przy którym nie został już
żaden klucz administracyjny.

## Jak przebiegały migracje

Każda migracja — z Gen 1 do Gen 2 oraz z Gen 2 do Gen 3 — była pasywnym airdropem 1:1. Posiadacze
nie musieli składać wniosku, podpisywać wiadomości ani robić czegokolwiek innego. Salda ze starego
kontraktu zostały odczytane bezpośrednio i odwzorowane 1:1 na nowym kontrakcie, więc pozycja
posiadacza została zachowana w niezmienionej postaci.

Ponieważ zarówno stare, jak i nowe kontrakty pozostają publiczne i on-chain, każdy krok tego procesu
można niezależnie zweryfikować. Każdy może porównać historyczne migawki posiadaczy z Gen 1 lub Gen 2
z obecnymi saldami Gen 3 i potwierdzić, że migracja przebiegła dokładnie tak, jak deklarowano. Żadna
część tej historii nie opiera się na wierze w słowo Bitsocial.

## Sprawdź wszystko sam

Nie przyjmuj niczego z tego na wiarę. Sprawdź zapis bezpośrednio:

- Gen 1 na [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 na [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 na [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- aktualna strona blockchaina pod adresem [chain.bitsocial.net](https://chain.bitsocial.net)

Jeśli adres nie zgadza się z tym, co jest tutaj wymienione, to nie jest oficjalny token BSO.
