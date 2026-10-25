---
title: Katalogi
description: Jak aplikacje Bitsocial pozwalają społecznościom rywalizować o nazwę tematu, zamiast zostawiać ją temu, kto zajął ją pierwszy.
---

# Katalogi

Na Reddicie nazwa taka jak `r/opensource` może należeć tylko do jednej społeczności i zatrzymuje ją ten, kto nią zarządza. Jeśli moderatorzy podejmują decyzje, które nie podobają się użytkownikom, jedyną alternatywą jest założenie `r/opensource2`. Nowa społeczność startuje z zerową liczbą subskrybentów, choć większości osób, które subskrybowały `r/opensource`, zależało na open source, a nie na tym konkretnym zespole moderatorów.

Aplikacje Bitsocial unikają tego dzięki **katalogom**. Katalog to nazwa tematu, na przykład `opensource`, o którą rywalizują społeczności. Krótka ścieżka dla tej nazwy otwiera tę społeczność, która aktualnie zajmuje pierwsze miejsce w rankingu, więc lepsza społeczność może przejąć nazwę bez niczyjej zgody.

## Jak to działa

1. **Kod katalogu to nazwa tematu.** Seedit używa ścieżek takich jak `/s/funny`. 5chan używa ścieżek znanych z imageboardów, takich jak `/g/`.
2. **Społeczności rywalizują jako kandydaci.** Każdy katalog ma listę społeczności kandydujących, a każda z nich ma własny dokładny adres, na przykład `funny-posting.bso`.
3. **Kandydat z najwyższą pozycją wygrywa ścieżkę.** Otwarcie `/s/funny` pokazuje aktualnego zwycięzcę.
4. **Przegrana niczego nie usuwa.** Społeczność, która nie wygrywa, zachowuje swój adres, posty i subskrybentów, a każdy nadal może otworzyć ją bezpośrednio.

## Nazwa to drzwi wejściowe, a nie tożsamość

Kod katalogu jest tylko ścieżką do odkrywania treści. Wszystko, co trwałe, wskazuje na konkretną społeczność:

- Subskrypcja z poziomu `/s/funny` dotyczy dokładnego adresu aktualnego zwycięzcy. Sam kod katalogu nigdy nie jest zapisywany jako subskrypcja.
- Linki do postów zawsze używają dokładnego adresu społeczności, więc stary link nie może zacząć wskazywać innej społeczności po zmianie zwycięzcy.
- Gdy zwycięzca się zmienia, Seedit nie rusza istniejących subskrypcji i pyta każdego subskrybenta, czy przejść do nowego zwycięzcy, zachować obie społeczności, czy zostać przy obecnej. Automatyczne przełączanie to ustawienie dla każdego katalogu, które trzeba samodzielnie włączyć, a automatyczne przełączenie wyświetla powiadomienie z opcją cofnięcia.

Konkurencyjna społeczność nie odbiera więc nikomu subskrypcji. Wygrywa nazwę: nowi odwiedzający trafiają do niej, a dotychczasowi subskrybenci dostają wybór jednym kliknięciem. Ci, którzy woleli starą społeczność, zachowują ją.

## Dlaczego nie nazwy według kolejności zgłoszeń

- **Bez zajmowania nazw na zapas.** Samo posiadanie dobrej nazwy nie wystarczy. Społeczność musi pozostać dla niej najlepszym kandydatem.
- **Żaden administrator nie przydziela nazw.** Przydział przez administratora odtworzyłby centralne weto, które Bitsocial ma usuwać.
- **Konkurenci zachowują drogę do odbiorców.** Rywalizująca społeczność celuje w tę samą nazwę, zamiast zaczynać od nowa pod gorszą.
- **Aplikacje klienckie zgadzają się co do zwycięzcy.** Seedit ustala ranking kandydatów deterministycznie, więc każdy klient odczytujący tę samą sfinalizowaną migawkę katalogu pokazuje tego samego zwycięzcę. Seedit nie podstawia innego kandydata tylko dlatego, że zwycięzca jest chwilowo nieosiągalny przez połączenie jednego użytkownika.

## Jak obecnie wybiera się zwycięzców

Kandydaci są publikowani jako pliki JSON w repozytorium [bitsocialnet/lists](https://github.com/bitsocialnet/lists), po jednym pliku na katalog, a społeczność dołącza do katalogu przez pull request do jego pliku. To przejściowy etap na start. Celem jest, by o zwycięzcach zamiast pull requestów decydowało głosowanie.

- **Seedit** ustala kolejność kandydatów w katalogu według wyniku, następnie według czasu dodania, a potem według adresu. Każdy plik katalogu ma numer rewizji, a każda zmiana kandydatów lub zwycięzcy publikuje nową rewizję.
- **5chan** prowadzi jedno głosowanie dla każdego katalogu za pomocą [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Aplikacje klienckie wymieniają podpisane karty do głosowania przez libp2p gossipsub i same obliczają wyniki, bez serwera liczącego głosy. Do głosowania potrzebny jest 5chan Pass, niezbywalny token, a każdy posiadacz ma jeden głos. Głos na board, którego jeszcze nie ma na liście, zgłasza go jako kandydata. Głosowania działają obecnie w sieci testowej Base Sepolia i dopóki jej nie opuszczą, wyniki są wyświetlane, ale nie zmieniają kolejności na liście.

## Protokół czy aplikacja?

Katalogi nie są częścią PKC, warstwy peer-to-peer, która przechowuje i przesyła społeczności. To konwencja stosowana przez aplikacje klienckie ponad tą warstwą, obok list domyślnych i wyszukiwania; zobacz [Odkrywanie treści](./content-discovery.md). Klient może odczytywać te same pliki katalogów, publikować własne albo całkowicie pominąć katalogi, a użytkownicy nadal mogą otworzyć dowolną społeczność po jej adresie.
