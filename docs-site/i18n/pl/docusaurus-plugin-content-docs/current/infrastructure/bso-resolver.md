---
title: Narzędzie do rozwiązywania problemów BSO
description: Konwertuj nazwy domen .bso na klucze publiczne przy użyciu rekordów ENS TXT, z wbudowanym buforowaniem i obsługą wielu platform.
sidebar_position: 1
---

# Narzędzie do rozwiązywania problemów BSO

BSO Resolver tłumaczy nazwy domen `.bso` na odpowiadające im klucze publiczne, odczytując rekordy Bitsocial TXT przechowywane na ENS. Zapewnia współdzielonego klienta viem, trwałe buforowanie i działa zarówno w środowiskach Node.js, jak i przeglądarki.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licencja**: tylko GPL-2.0

## Instalacja

```bash
npm install @bitsocial/bso-resolver
```

## Tworzenie mechanizmu rozwiązywania problemów

Utwórz instancję mechanizmu rozpoznawania nazw, przekazując obiekt konfiguracyjny do konstruktora:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parametr   | Wymagane | Opis                                                     |
| ---------- | -------- | -------------------------------------------------------- |
| `key`      | Tak      | Identyfikator instancji mechanizmu rozpoznawania nazw.   |
| `provider` | Tak      | Konfiguracja transportu (patrz poniżej).                 |
| `dataPath` | Nie      | Katalog pliku pamięci podręcznej SQLite (tylko Node.js). |

### Opcje dostawcy

Parametr `provider` akceptuje trzy formaty:

- **`"viem"`** — Używa domyślnego transportu publicznego udostępnianego przez viem.
- **URL HTTP(S)** — łączy się przez punkt końcowy JSON-RPC (np. `https://mainnet.infura.io/v3/YOUR_KEY`).
- **Adres URL protokołu WebSocket** — łączy się za pośrednictwem punktu końcowego RPC protokołu WebSocket (np. `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Metody

### `resolve({ name, abortSignal? })`

Wyszukuje nazwę `.bso` i zwraca powiązany klucz publiczny. Aby anulować długotrwałe żądania, można przekazać opcjonalny `AbortSignal`.

### `canResolve({ name })`

Zwraca wartość logiczną wskazującą, czy mechanizm rozpoznawania nazw jest w stanie obsłużyć podaną nazwę. Użyj tego, aby sprawdzić obsługę przed próbą uzyskania pełnej rozdzielczości.

### `destroy()`

Niszczy program rozpoznawania nazw, zamykając połączenia z bazą danych i zwalniając zasoby. Wywołaj tę opcję, gdy narzędzie rozpoznawania nazw nie jest już potrzebne.

## Buforowanie

Rozwiązane nazwy są automatycznie buforowane, aby ograniczyć zbędne wyszukiwania w sieci. Zaplecze buforujące jest wybierane na podstawie środowiska wykonawczego:

| Środowisko   | Zaplecze                | Notatki                                                               |
| ------------ | ----------------------- | --------------------------------------------------------------------- |
| Node.js      | SQLite                  | Przechowywane w `dataPath`. Używa trybu WAL do równoczesnego dostępu. |
| Przeglądarka | Indeksowana baza danych | Wykorzystuje natywne transakcje IndexedDB.                            |
| Powrót       | W pamięci `Map`         | Używane, gdy nie jest dostępny ani SQLite, ani IndexedDB.             |

Wszystkie wpisy w pamięci podręcznej mają **jednogodzinny czas TTL** i są automatycznie usuwane po wygaśnięciu.

## Integracja z pkc-js

Resolwer można podłączyć bezpośrednio do pkc-js poprzez opcję `nameResolvers`, umożliwiając przezroczyste rozpoznawanie nazw `.bso` podczas wyszukiwania kluczy:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Współbieżność

Rezolwer został zaprojektowany tak, aby był bezpieczny przy jednoczesnym użyciu:

- Pojedynczy współdzielony klient viem pozwala uniknąć zbędnych połączeń.
- SQLite działa w trybie WAL (Write-Ahead Logging), umożliwiając współbieżny odczyt bez blokowania.
- Buforowanie przeglądarki opiera się na natywnych transakcjach IndexedDB w celu izolacji.

## Punkty wejścia na platformę

Pakiet zawiera oddzielne punkty wejścia dla Node.js i kompilacji przeglądarek. Bundlery obsługujące pole `exports` w `package.json` automatycznie wybiorą właściwe.
