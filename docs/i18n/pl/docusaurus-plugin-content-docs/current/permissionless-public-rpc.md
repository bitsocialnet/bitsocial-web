---
title: Bez zezwolenia publiczne RPC
description: Proponowany projekt publicznej usługi Bitsocial RPC z izolowanymi użytkownikami, uprawnieniami o określonym zakresie i własnością społeczności.
---

# Bez zezwolenia publiczne RPC

Oryginalna publiczna propozycja RPC istniała jako problem GitHuba napisany w starej terminologii plebbitskiej. Ta strona przepisuje ten pomysł na język Bitsocial i przedstawia go jako propozycję na poziomie produktu, a nie ścianę szczegółów wdrożenia.

## Cel prostym językiem

Bitsocial Forge może uruchomić publiczną usługę RPC, która pozwala wielu użytkownikom zdalnie zarządzać własnymi społecznościami Bitsocial, bez konieczności zamieniania operatora w opiekuna tych społeczności.

Usługa powinna sprawić, że klienci mobilni i lekcy będą praktyczni, przy jednoczesnym zachowaniu trzech ograniczeń:

1. Użytkownicy domyślnie pozostają odizolowani od siebie.
2. Uprawnienia pozostają wyraźne i szczegółowe.
3. Podczas wdrażania można zachować zgodność z bieżącym kształtem żądania i odpowiedzi RPC.

## Jaki problem rozwiązuje

Obecnie najprostszy model RPC to zazwyczaj wszystko albo nic: jeden klucz uwierzytelniający, jedna domena uprawnień, pełny dostęp. Działa to w przypadku pojedynczego operatora, ale nie w przypadku publicznej usługi dla wielu użytkowników.

Publiczny RPC bez uprawnień potrzebuje silniejszego modelu:

- jedna usługa może obsługiwać wielu użytkowników
- każdy użytkownik otrzymuje własne społeczności i ograniczenia
- Zasady zdefiniowane przez operatora mogą zapobiegać nadużyciom
- użytkownik może nadal się wyprowadzić lub zamieszkać później

## Podstawowy model

### Użytkownicy

Każdy użytkownik otrzymuje dane uwierzytelniające oraz pakiet uprawnień.

### Społeczności

Społeczności utworzone za pośrednictwem usługi są przypisywane do rekordu właściciela. Własność jest śledzona jawnie, dzięki czemu metody zarządzania można przypisać do odpowiedniego użytkownika.

### Uprawnienia

Uprawnienia są oparte na możliwościach. Zamiast jednej wartości logicznej „można używać RPC”, serwer może kontrolować:

- ile społeczności może utworzyć użytkownik
- jakie metody zarządzania są dostępne
- jakie operacje publikowania są dozwolone
- jakie limity stawek obowiązują
- jakie powierzchnie administracyjne są widoczne

### Powierzchnia administracyjna

Sam publiczny RPC powinien skupiać się na zachowaniu RPC skierowanym do użytkownika. Zadania administracyjne, takie jak tworzenie użytkowników, przenoszenie własności i przeglądanie audytu, znajdują się w oddzielnym interfejsie API operatora i panelu kontrolnym.

## Stanowisko dotyczące zgodności

W dokumentacji przeznaczonej dla użytkownika należy używać terminów Bitsocial, takich jak **społeczność** i **profil**.

Na poziomie sieciowym pierwsze wdrożenie może nadal zachować bieżący kształt transportu i ładunku JSON-RPC, jeśli jest to przydatne ze względu na kompatybilność. Innymi słowy: dokumentacja nie musi już mówić jak stara dokumentacja plebbitowa, nawet jeśli w okresie przejściowym za kulisami zachowane zostaną niektóre starsze nazwy metod lub kształty żądań.

## Proponowany pakiet uprawnień

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Dokładne nazwy metod mają charakter poglądowy. Ważną częścią jest kształt polityki: poszczególne możliwości są niezależnie kontrolowane, a nie łączone w jeden token superużytkownika.

## Przepływ połączenia

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Świadomość uprawnień powinna pozostać opcjonalna. Klient, który zignoruje powiadomienie, może nadal zachowywać się poprawnie, obsługując standardowe błędy autoryzacji z serwera.

## Egzekucja własności

When the service creates a community, it should automatically assign ownership to the calling user. Stamtąd:

- Akcje uruchamiania, zatrzymywania, edytowania i usuwania społeczności należą do zakresu właściciela
- odpowiedzi na listy i subskrypcje są domyślnie kierowane do społeczności dzwoniącego
- szersza widoczność to wyraźne zezwolenie administratora, a nie ustawienie domyślne

Jeden przypadek Edge ma ogromne znaczenie: jeśli użytkownik subskrybuje społeczność, której **nie** jest właścicielem, serwer może ujawnić jedynie stan publiczny, który powinien zobaczyć każdy zewnętrzny obserwator. Konfiguracja przeznaczona tylko dla właściciela lub wewnętrzne dane środowiska wykonawczego nigdy nie powinny wyciekać przez interfejs API subskrypcji.

## Sugerowana powierzchnia operatora

Interfejs API administratora może pozostać nudny i przejrzysty:

- lista użytkowników
- sprawdź jednego użytkownika
- tworzyć lub aktualizować użytkowników
- usuń użytkowników
- przenieść własność wspólnoty
- sprawdź dzienniki audytu

Uwierzytelnianie dla tego interfejsu API operatora powinno być całkowicie niezależne od uwierzytelniania RPC użytkownika końcowego.

## Fazy ​​wdrożenia

### Faza 1

- ustanowić publiczną strukturę projektu RPC
- dodaj rekordy użytkowników i śledzenie własności
- rozwidlaj lub rozszerzaj bieżący serwer RPC

### Faza 2

- zaimplementuj pakiety uprawnień
- wymuszaj je w warstwie metod RPC
- zwróć metadane uprawnień po podłączeniu

### Faza 3

- dodaj API operatora
- dodaj rejestrowanie audytu
- dodaj uwierzytelnianie administratora

### Faza 4

- wyślij panel administracyjny
- testuj kontrolę nadużyć
- zaostrzyć limity stawek i kwoty składowania

## Otwarte pytania

### Spam dotyczący danych uwierzytelniających

Jeśli tworzenie uwierzytelniania jest tanie, usługi publiczne mogą wymagać warstwy wyzwania przed wydaniem poświadczeń. Jedną z możliwych dróg jest ponowne wykorzystanie samego modelu wyzwań społeczności, tak aby wydawanie poświadczeń dziedziczyło tę samą filozofię przeciwdziałania nadużyciom, co reszta sieci.

### Nazewnictwo starsze

Niektóre wczesne implementacje mogą nadal udostępniać wewnętrznie starsze nazwy metod w celu zapewnienia zgodności. Należy to traktować jako szczegół migracji, a nie jako stały słownik publiczny dokumentów Bitsocial.

## Streszczenie

Ta propozycja tak naprawdę dotyczy jednej rzeczy: uczynienia publicznej infrastruktury RPC użyteczną, bez konieczności jej przechowywania. Dobry publiczny RPC Bitsocial powinien sprawiać wrażenie opcjonalnej pomocy dla prowadzących społeczności, a nie nowej centralnej platformy, która odzyskuje własność tylnymi drzwiami.
