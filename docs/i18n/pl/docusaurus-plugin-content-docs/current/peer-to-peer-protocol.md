---
title: Protokół peer-to-peer
description: Jak Bitsocial wykorzystuje IPFS/libp2p, adresowanie oparte na kluczu publicznym, pubsub peer-to-peer i węzły P2P w przeglądarce, aby dostarczać media społecznościowe bez serwerów.
---

# Protokół peer-to-peer

Bitsocial nie korzysta z blockchaina, serwera federacyjnego ani scentralizowanego backendu. Zamiast
tego wykorzystuje stos IPFS/libp2p, aby połączyć dwa pomysły: **adresowanie oparte na kluczu
publicznym** i **pubsub peer-to-peer**. Razem pozwalają one każdemu hostować społeczność na zwykłym
sprzęcie domowym, podczas gdy użytkownicy czytają i publikują bez zakładania kont w jakiejkolwiek
usłudze kontrolowanej przez firmę.

Mniej techniczne omówienie znajdziesz w tekście
[Kompletne wyjaśnienie protokołu Bitsocial dla laika](./layman-protocol-explanation.md).

## Czy Bitsocial używa IPFS?

Tak. Węzły Bitsocial wykorzystują w warstwie peer-to-peer prymitywy IPFS/libp2p: rekordy
społeczności adresowane kluczem publicznym, przesyłanie treści między peerami oraz pubsub gossipsub
do wiadomości w czasie rzeczywistym. Kiedy ta dokumentacja mówi „pubsub”, chodzi o pubsub
IPFS/libp2p, a nie o osobnego, scentralizowanego brokera wiadomości.

Protokół opisuje obecnie odkrywanie przez routery HTTP, ponieważ klienci Bitsocial pytają o adresy
peerów-dostawców końcówki routerów, zamiast przy każdym wyszukiwaniu polegać na nieprzyjaznym
przeglądarkom DHT. Routery zwracają wyłącznie peery; transfer treści i ruch pubsub nadal
przechodzą przez sieć peer-to-peer.

## Dwa problemy

Zdecentralizowana sieć społecznościowa musi odpowiedzieć na dwa pytania:

1. **Dane** — jak przechowywać i udostępniać treści społecznościowe całego świata bez centralnej bazy danych?
2. **Spam** — jak zapobiegać nadużyciom, zachowując bezpłatny dostęp do sieci?

Bitsocial rozwiązuje problem danych, całkowicie pomijając blockchain: media społecznościowe nie
potrzebują globalnego porządkowania transakcji ani trwałej dostępności każdego starego posta.
Problem spamu rozwiązuje, pozwalając każdej społeczności prowadzić własne wyzwanie antyspamowe w
sieci peer-to-peer.

Model odkrywania treści ponad tą warstwą sieciową opisuje [Odkrywanie treści](./content-discovery.md).

---

## Adresowanie oparte na kluczu publicznym {#public-key-based-addressing}

W BitTorrencie adresem pliku staje się jego hash (_adresowanie oparte na treści_). Bitsocial stosuje
podobny pomysł do kluczy publicznych: adresem sieciowym społeczności staje się hash jej klucza
publicznego.

```mermaid
graph LR
    K["🔑 Community keypair"] --> H["#️⃣ Hash of public key"]
    H --> D["🌐 HTTP router(s) lookup of hash"]
    D --> P["🔌 Provider peer addresses"]
    P --> C["📄 Latest community content from peers"]
```

Każdy peer w sieci może zapytać o ten adres **router HTTP**: router odpowiada listą adresów
sieciowych peerów, które aktualnie udostępniają hash danej społeczności, a klient łączy się z nimi
bezpośrednio, aby pobrać jej najnowszy stan. Przy każdej aktualizacji treści rośnie numer jej
wersji. Sieć przechowuje wyłącznie najnowszą wersję — nie trzeba zachowywać każdego stanu
historycznego i właśnie to czyni to podejście lekkim w porównaniu z blockchainem.

> **Co naprawdę przechowuje router HTTP.** Router HTTP to cienki indeks. Dla każdego znanego mu
> adresu treści przechowuje jedynie adresy sieciowe peerów, które zgłosiły się jako dostawcy (pary
> IP/port, multiadresy libp2p i tym podobne). **Nie** przechowuje treści społeczności, jej
> metadanych, tekstu postów, listy członków ani nawet czytelnej dla człowieka nazwy tego, co znajduje
> się pod danym adresem; odpowiada tylko na pytanie „które peery twierdzą, że mają ten hash?”. Dzięki
> temu routery są tanie w utrzymaniu, łatwe do podmiany i nie odpowiadają za to, co publikują
> użytkownicy — podobnie jak tracker BitTorrent, ale bez metadanych torrenta: tracker mapuje
> infohashe na peery, a router HTTP mapuje wyłącznie adres treści na adresy peerów-dostawców.
>
> Dla redundancji klient odpytuje **kilka routerów HTTP równolegle** i scala otrzymane listy
> dostawców. Router może uruchomić każdy, a wymiana lub dodanie routerów to zmiana konfiguracji, bez
> migracji danych.
>
> Bitsocial używa routerów HTTP zamiast DHT, ponieważ utrzymanie DHT w skali potrzebnej do
> odkrywania treści jest kosztowne, zwłaszcza na urządzeniach mobilnych. DHT nie działa też w
> przeglądarce, bo przeglądarki nie mogą bezpośrednio dołączyć do DHT libp2p. Router HTTP działa
> tanio na standardowej infrastrukturze HTTP i sprawdza się równie dobrze na telefonie, jak i w
> przeglądarce.

### Co jest przechowywane pod adresem

Adres społeczności nie zawiera bezpośrednio pełnej treści postów. Zamiast tego przechowuje listę
identyfikatorów treści — hashy wskazujących właściwe dane. Klient pobiera następnie każdy fragment
treści bezpośrednio od peerów zwróconych przez routery HTTP. Same routery nigdy nie widzą treści ani
jej nie przechowują.

```mermaid
graph TD
    A["📍 Community address"] --> M["📋 Metadata<br/>(title, description, rules,<br/>moderator list, challenge config)"]
    A --> P["🔗 Content pointers<br/>(hashes of latest posts)"]
    P --> P1["📝 Post 1 content"]
    P --> P2["📝 Post 2 content"]
    P --> P3["📝 Post 3 content"]
```

Co najmniej jeden peer zawsze ma dane: węzeł operatora społeczności. Jeśli społeczność jest
popularna, będzie je miało także wiele innych peerów, a obciążenie rozłoży się samo — tak samo jak
popularne torrenty pobierają się szybciej.

---

## Pubsub peer-to-peer

Pubsub (publish-subscribe) to wzorzec komunikacji, w którym peery subskrybują temat i otrzymują
każdą wiadomość opublikowaną w tym temacie. Bitsocial korzysta z sieci pubsub peer-to-peer — każdy
może publikować, każdy może subskrybować i nie ma centralnego brokera wiadomości.

Aby opublikować post w społeczności, użytkownik wysyła wiadomość, której temat odpowiada kluczowi
publicznemu tej społeczności. Węzeł operatora społeczności ją odbiera, weryfikuje i — jeśli przejdzie
wyzwanie antyspamowe — dołącza ją do kolejnej aktualizacji treści.

---

## Ochrona przed spamem: wyzwania przez pubsub

Otwarta sieć pubsub jest podatna na zalew spamu. Bitsocial rozwiązuje to, wymagając od publikujących
ukończenia **wyzwania**, zanim ich treść zostanie przyjęta.

System wyzwań jest elastyczny: każdy operator społeczności konfiguruje własną politykę. Do wyboru
są między innymi:

| Rodzaj wyzwania       | Jak działa                                                  |
| --------------------- | ----------------------------------------------------------- |
| **Captcha**           | Wizualna lub interaktywna łamigłówka pokazywana w aplikacji |
| **Limit tempa**       | Ograniczenie liczby postów na tożsamość w oknie czasowym    |
| **Bramka tokenowa**   | Wymóg udowodnienia salda określonego tokena                 |
| **Płatność**          | Wymóg niewielkiej opłaty za post                            |
| **Lista dozwolonych** | Publikować mogą tylko wcześniej zatwierdzone tożsamości     |
| **Własny kod**        | Dowolna polityka dająca się wyrazić w kodzie                |

Peery, które przekazują zbyt wiele nieudanych prób wyzwania, są blokowane w temacie pubsub, co
zapobiega atakom typu odmowa usługi na warstwę sieciową.

---

## Cykl życia: czytanie społeczności

Oto co dzieje się, gdy użytkownik otwiera aplikację i przegląda najnowsze posty społeczności.

```mermaid
sequenceDiagram
    participant User as 👤 User app
    participant Routers as 🌐 HTTP routers
    participant Node as 🖥️ Community node

    User->>Routers: Query community address (in parallel)
    Note over Routers: Each router returns<br/>peer addresses only, never content
    Routers-->>User: Return provider peer addresses

    User->>Node: Connect to peer, fetch latest pointers + metadata
    Node-->>User: Return latest content pointers + metadata

    User->>Node: Fetch post content by hash
    Node-->>User: Return post data
    Note over User: Render posts in<br/>familiar social UI

    Note over User,Node: Multiple community queries<br/>run concurrently
```

**Krok po kroku:**

1. Użytkownik otwiera aplikację i widzi interfejs społecznościowy.
2. Klient odpytuje równolegle kilka routerów HTTP dla każdej społeczności obserwowanej przez
   użytkownika; każdy router zwraca wyłącznie adresy peerów, nigdy treść. Czas odpowiedzi zależy od
   warunków sieciowych i obciążenia routerów; w typowych warunkach niskich opóźnień zapytania zwykle
   wracają w około sekundę i wykonują się równolegle.
3. Gdy klient ma już adresy peerów, łączy się z nimi i pobiera najnowsze wskaźniki treści oraz
   metadane społeczności (tytuł, opis, listę moderatorów, konfigurację wyzwania).
4. Na podstawie tych wskaźników klient pobiera właściwą treść postów, a następnie renderuje wszystko
   w znajomym interfejsie społecznościowym.

---

## Cykl życia: publikowanie posta

Publikowanie wymaga wymiany wyzwanie-odpowiedź przez pubsub, zanim post zostanie przyjęty.

```mermaid
sequenceDiagram
    participant User as 👤 User app
    participant Pubsub as 📡 Pubsub network
    participant Node as 🖥️ Community node

    Note over User: Generate keypair<br/>(if first post)

    User->>Pubsub: Join community topic
    User->>Pubsub: Request challenge
    Pubsub->>Node: Relay challenge request

    Node-->>Pubsub: Send challenge (e.g. captcha)
    Pubsub-->>User: Relay challenge to user

    Note over User: User completes challenge

    User->>Pubsub: Submit post + challenge answer
    Pubsub->>Node: Relay post + answer

    Note over Node: Validate answer

    Node-->>Pubsub: Broadcast result (accepted/rejected)
    Pubsub-->>User: Relay result

    Note over Node: Update community content<br/>at public-key address

    Note over User,Node: Other readers receive<br/>the update within minutes
```

**Krok po kroku:**

1. Aplikacja generuje dla użytkownika parę kluczy, jeśli jeszcze jej nie ma.
2. Użytkownik pisze post dla społeczności.
3. Klient dołącza do tematu pubsub tej społeczności (powiązanego z jej kluczem publicznym).
4. Klient prosi przez pubsub o wyzwanie.
5. Węzeł operatora społeczności odsyła wyzwanie (na przykład captcha).
6. Użytkownik rozwiązuje wyzwanie.
7. Klient przesyła przez pubsub post razem z odpowiedzią na wyzwanie.
8. Węzeł operatora społeczności weryfikuje odpowiedź. Jeśli jest poprawna, post zostaje przyjęty.
9. Węzeł rozgłasza wynik przez pubsub, aby peery w sieci wiedziały, że mają dalej przekazywać
   wiadomości od tego użytkownika.
10. Węzeł aktualizuje treść społeczności pod jej adresem opartym na kluczu publicznym.
11. W ciągu kilku minut aktualizację otrzymuje każdy czytelnik społeczności.

---

## Przegląd architektury

Cały system składa się z trzech współpracujących warstw:

```mermaid
graph TB
    subgraph Apps ["App layer"]
        A1["🖥️ Desktop app"]
        A2["🌐 Web app"]
        A3["📱 Mobile app"]
    end

    subgraph Protocol ["Protocol layer"]
        PK["🔑 Public-key addressing"]
        PS["📡 Peer-to-peer pubsub"]
        CH["🛡️ Challenge system"]
    end

    subgraph Network ["Network layer"]
        Router["🛰️ HTTP router<br/>(content discovery)"]
        GS["💬 Gossipsub<br/>(real-time messaging)"]
        TR["📦 Content transfer<br/>(data exchange)"]
    end

    A1 & A2 & A3 --> PK & PS & CH
    PK --> Router
    PS --> GS
    CH --> GS
    PK --> TR
```

| Warstwa       | Rola                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Aplikacja** | Interfejs użytkownika. Aplikacji może być wiele, każda z własnym wyglądem, a wszystkie korzystają z tych samych społeczności i tożsamości.                   |
| **Protokół**  | Określa, jak adresowane są społeczności, jak publikuje się posty i jak zapobiega się spamowi.                                                                |
| **Sieć**      | Leżąca u podstaw infrastruktura peer-to-peer: routery HTTP do odkrywania, gossipsub do wiadomości w czasie rzeczywistym i transfer treści do wymiany danych. |

---

## Prywatność: rozdzielenie autorów i adresów IP

Gdy użytkownik publikuje post, jego treść jest **szyfrowana kluczem publicznym operatora
społeczności**, zanim trafi do sieci pubsub. Oznacza to, że obserwatorzy sieci widzą wprawdzie, że
dany peer coś opublikował, ale nie są w stanie ustalić:

- co zawiera ta treść
- która tożsamość autora ją opublikowała

Przypomina to sposób, w jaki BitTorrent pozwala ustalić, które adresy IP seedują torrent, ale nie
kto go pierwotnie stworzył. Warstwa szyfrowania dokłada do tego poziomu bazowego dodatkową gwarancję
prywatności.

---

## Peer-to-peer w przeglądarce

P2P w przeglądarce jest już możliwe w klientach Bitsocial. Aplikacja przeglądarkowa może uruchomić
węzeł [Helia](https://helia.io/), używać tego samego stosu klienckiego protokołu Bitsocial co
pozostałe aplikacje i pobierać treści od peerów, zamiast prosić o ich udostępnienie scentralizowaną
bramę IPFS. Przeglądarka może też bezpośrednio uczestniczyć w pubsubie, więc w podstawowym
scenariuszu publikowanie nie wymaga dostawcy pubsuba należącego do platformy.

To ważny kamień milowy dla dystrybucji przez WWW: zwykła witryna HTTPS może otworzyć się jako
działający klient społecznościowy P2P. Użytkownicy nie muszą instalować aplikacji desktopowej, żeby
czytać z sieci, a operator aplikacji nie musi utrzymywać centralnej bramy, która dla każdego
użytkownika przeglądarki staje się wąskim gardłem cenzury lub moderacji.

Ścieżka przeglądarkowa ma inne ograniczenia niż węzeł desktopowy czy serwerowy:

- węzeł w przeglądarce zwykle nie może przyjmować dowolnych połączeń przychodzących z publicznego internetu
- może wczytywać, weryfikować, buforować i publikować dane, dopóki aplikacja jest otwarta
- nie należy traktować go jako długowiecznego hosta danych społeczności
- pełny hosting społeczności nadal najlepiej realizuje aplikacja desktopowa, `bitsocial-cli` lub inny
  stale działający węzeł

Routery HTTP wciąż mają znaczenie dla odkrywania treści: zwracają adresy dostawców dla hasha
społeczności. Nie są bramami IPFS, ponieważ same nie serwują treści. Po odkryciu klient w
przeglądarce łączy się z peerami i pobiera dane przez stos P2P.

P2P w przeglądarce jest teraz domyślną ścieżką webową, a nie eksperymentem ukrytym za przełącznikiem.
5chan domyślnie działa w czystym trybie P2P w przeglądarce pod adresem 5chan.app, a blog Bitsocial na
bitsocial.net robi to samo. Peery w przeglądarce łączą się przez bezpieczne WebSockets; `pkc-js`
domyślnie odrzuca połączenia WebRTC i WebTransport, ponieważ ich ścieżki nawiązywania połączenia są w
przeglądarce wolne i zawodne. Zmianą po stronie upstreamu, dzięki której publikowanie z przeglądarki
stało się w 2026 roku praktyczne, była poprawka numerów sekwencyjnych gossipsub w
`@libp2p/gossipsub` 15.0.21 — sprawiła ona, że peery Kubo przestały odrzucać wiadomości publikowane
przez węzły JavaScript.

Pełny obraz, w tym to, czego węzeł w przeglądarce nadal nie potrafi, znajdziesz w tekście
[Peer-to-peer w przeglądarce](/browser-p2p/).

## Awaryjne wykorzystanie bramy {#gateway-fallback}

Dostęp z przeglądarki oparty na bramie jest nadal przydatny jako rozwiązanie zgodnościowe i awaryjne
na czas wdrażania. Brama może przekazywać dane między siecią P2P a klientem w przeglądarce, gdy
przeglądarka nie może dołączyć do sieci bezpośrednio albo gdy aplikacja świadomie wybiera starszą
ścieżkę. Takie bramy:

- może uruchomić każdy
- nie wymagają kont użytkowników ani płatności
- nie przejmują kontroli nad tożsamościami użytkowników ani społecznościami
- można wymienić bez utraty danych

Docelowa architektura stawia w pierwszej kolejności na P2P w przeglądarce, a bramy traktuje jako
opcjonalne rozwiązanie awaryjne, a nie domyślne wąskie gardło.

---

## Dlaczego nie blockchain?

Blockchainy rozwiązują problem podwójnego wydatkowania: muszą znać dokładną kolejność każdej
transakcji, żeby nikt nie wydał tej samej monety dwa razy.

W mediach społecznościowych problem podwójnego wydatkowania nie istnieje. Nie ma znaczenia, czy post
A został opublikowany milisekundę przed postem B, a stare posty nie muszą być trwale dostępne na
każdym węźle.

Pomijając blockchain, Bitsocial unika:

- **opłat za gaz** — publikowanie jest darmowe
- **limitów przepustowości** — brak wąskiego gardła w postaci rozmiaru bloku czy czasu bloku
- **rozrostu danych** — węzły trzymają tylko to, czego potrzebują
- **narzutu konsensusu** — nie są potrzebni górnicy, walidatorzy ani staking

Kompromisem jest to, że Bitsocial nie gwarantuje trwałej dostępności starych treści. Dla mediów
społecznościowych to jednak akceptowalny kompromis: dane trzyma węzeł operatora społeczności,
popularne treści rozchodzą się po wielu peerach, a bardzo stare posty naturalnie zanikają — tak samo
jak na każdej platformie społecznościowej.

## Dlaczego nie federacja?

Sieci federacyjne (jak poczta e-mail czy platformy oparte na ActivityPub) są krokiem naprzód wobec
centralizacji, ale wciąż mają ograniczenia strukturalne:

- **Zależność od serwera** — każda społeczność potrzebuje serwera z domeną, TLS-em i bieżącym
  utrzymaniem
- **Zaufanie do administratora** — administrator serwera ma pełną kontrolę nad kontami i treściami użytkowników
- **Fragmentacja** — przenosiny między serwerami często oznaczają utratę obserwujących, historii lub tożsamości
- **Koszt** — ktoś musi płacić za hosting, co wywołuje presję na konsolidację

Podejście peer-to-peer Bitsocial całkowicie usuwa serwer z równania. Węzeł społeczności może działać
na laptopie, Raspberry Pi albo tanim VPS. Operator kontroluje politykę moderacji, ale nie może
przejąć tożsamości użytkowników, bo są one kontrolowane parą kluczy, a nie przyznawane przez serwer.

## A co z Nostr?

Nostr to media społecznościowe oparte na przekaźnikach: użytkownicy mają pary kluczy i publikują
podpisane zdarzenia do przekaźników, które je przechowują i udostępniają. W Bitsocial routery HTTP
jedynie pomagają klientom znaleźć peery, a społeczności są pełnoprawnymi obiektami, których własny
węzeł przyjmuje lub odrzuca posty. Pełne porównanie znajdziesz w artykule
[Bitsocial i Nostr](/comparisons/nostr/).

---

## Podsumowanie

Bitsocial opiera się na dwóch prymitywach: adresowaniu opartym na kluczu publicznym do odkrywania
treści i pubsubie peer-to-peer do komunikacji w czasie rzeczywistym. Razem tworzą sieć
społecznościową, w której:

- społeczności są identyfikowane kluczami kryptograficznymi, a nie nazwami domen
- treści rozchodzą się po peerach jak torrent, zamiast być serwowane z jednej bazy danych
- odporność na spam jest lokalna dla każdej społeczności, a nie narzucona przez platformę
- użytkownicy posiadają swoje tożsamości dzięki parom kluczy, a nie dzięki odwoływalnym kontom
- cały system działa bez serwerów, blockchainów i opłat platformowych
