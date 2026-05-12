---
title: Odkrywanie treści
description: Jak Bitsocial oddziela odkrywanie peerów od przeglądania na poziomie aplikacji.
---

# Odkrywanie treści

Bitsocial nie umieszcza w protokole jednego globalnego kanału, indeksu wyszukiwania ani algorytmu rankingowego. Dzieli odkrywanie treści na dwie warstwy:

1. **Wyszukiwanie sieci** pozwala znaleźć użytkowników aktualnie obsługujących znaną społeczność.
2. **Wybór aplikacji** decyduje, które społeczności, tablice, listy lub posty będą wyświetlane jako pierwsze.

Dzięki temu protokół jest niewielki, a jednocześnie pozostawia miejsce na rywalizację wielu doświadczeń związanych z odkrywaniem.

## Wyszukiwanie sieci

Każda społeczność ma stabilny adres wywodzący się z jej klucza publicznego. Gdy klient zna już ten adres, wysyła zapytania do lekkich routerów HTTP, aby znaleźć urządzenia równorzędne, które ogłosiły się jako dostawcy tego adresu.

Routery zwracają tylko adresy równorzędne dostawcy. Nie przechowują postów, metadanych, list użytkowników ani czytelnego dla człowieka katalogu społeczności. Gdy klient otrzyma adresy równorzędne, łączy się z tymi równorzędnymi i pobiera najnowsze metadane społeczności oraz wskaźniki zawartości, a następnie pobiera rzeczywiste dane pocztowe za pomocą skrótu.

To odpowiada na pytanie protokołu: „Gdzie mogę pobrać najnowszy stan dla tej społeczności?”

## Kuracja aplikacji

Osobne pytanie dotyczące usługi brzmi: „Które społeczności użytkownik powinien zobaczyć jako pierwsze?”

Bitsocial pozostawia to aplikacjom, listom i użytkownikom, zamiast umieszczać jedną odpowiedź w sieci. Przykłady obejmują:

- klient pokazujący społeczności, które użytkownik już obserwuje
- wyselekcjonowana domyślna lista aplikacji w stylu Reddita
- miejsca w katalogach dla aplikacji w stylu tablicy graficznej
- indeksy wyszukiwania lub rankingi prowadzone przez konkretną aplikację
- bezpośrednie linki udostępniane przez użytkowników

Aplikacje mogą indeksować, oceniać, filtrować i wyróżniać różne rzeczy bez przekształcania tych wyborów w prawo protokołu. Jeśli powierzchnia wykrywania jednej aplikacji nie jest przydatna, inna aplikacja może utworzyć inną w tych samych społecznościach.

## Aktualne aplikacje

5chan używa obecnie znanych ścieżek katalogów, takich jak `/b/` lub `/g/`. Przypisaniami katalogów zarządza się obecnie za pomocą publicznej listy, a przyszłe wersje mają obsługiwać tworzenie tablic w aplikacji i głosowanie na miejsca w katalogach.

Seedit używa domyślnych list społeczności na swojej stronie głównej. Społeczności można nadal tworzyć i udostępniać poza domyślną listą.

W obu przypadkach lista na poziomie aplikacji pomaga użytkownikom znaleźć coś do otwarcia, a wyszukiwanie na poziomie protokołu następnie rozpoznaje wybraną społeczność jako równorzędną.

## Dlaczego ten podział ma znaczenie

Pojedyncza zdecentralizowana sieć nadal wymaga dobrego wykrywania, ale warstwa wykrywania powinna być wymienna. Podstawowy protokół Bitsocial koncentruje się na adresowalności, wyszukiwaniu peerów, publikowaniu i ochronie przed spamem. Curation znajduje się ponad tą warstwą, gdzie aplikacje mogą eksperymentować z katalogami, listami domyślnymi, kanałami, zasadami wyszukiwania, głosowania i moderowania bez konieczności migracji w całej sieci.
