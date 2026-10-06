---
title: Bitsocial a Secure Scuttlebutt
description: Jak si Secure Scuttlebutt (SSB) a jeho aplikace Manyverse stojí ve srovnání s Bitsocialem, od feedů typu append-only a replikace podle grafu sledování po komunity, ochranu proti spamu a synchronizaci offline.
---

# Bitsocial a Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) je peer-to-peer sociální protokol, který v roce
2014 vytvořil Dominic Tarr. [Manyverse](https://www.manyver.se/) je jeho nejznámější aplikace, a to
pro Android, iOS i desktop; [Patchwork](https://github.com/ssbc/patchwork) byl hlavním desktopovým
klientem, než byl archivován. Ze systémů srovnávaných v této dokumentaci má SSB k Bitsocialu svým
duchem nejblíže: žádné servery v cestě dat, žádný blockchain, žádné globální pořadí a klíče Ed25519
jako identita. Oba systémy se ale rozhodly opačně v tom, co ukládá každý peer a kde se zastavuje
spam.

## Jak Scuttlebutt funguje

- **Feedy.** Každá identita je pár klíčů Ed25519 zapisovaný jako `@<public key>.ed25519`. Vše, co
  uživatel publikuje, jde do jeho vlastního feedu, logu typu append-only, v němž každá podepsaná
  zpráva nese pořadové číslo a hash předchozí zprávy. Jakmile je zpráva publikována, nelze ji podle
  [průvodce protokolem](https://ssbc.github.io/scuttlebutt-protocol-guide/) změnit.
- **Replikace.** Peeři kopírují celé feedy, ne jednotlivé příspěvky, a o tom, které feedy si peer
  ponechá, rozhoduje graf sledování. Patchwork například zobrazoval feedy vzdálené až dva skoky a
  replikoval feedy vzdálené až tři skoky. Díky mechanismu epidemic broadcast trees (EBT) si peeři
  porovnávají nejvyšší pořadové číslo, které mají u každého feedu, a posílají jen to, co chybí.
- **Spojení.** Peeři se ověřují pomocí secret handshake a šifrují provoz pomocí box stream.
  Handshake je svázaný s identifikátorem sítě, takže peeři v samostatné síti SSB s jiným
  identifikátorem se nemohou připojit k hlavní síti.
- **Hledání peerů.** Peeři se v místní síti ohlašují přes UDP broadcast a synchronizují se přes LAN;
  Manyverse se synchronizuje i přes Bluetooth. Přes internet se uživatelé spoléhají na **pubs**,
  tedy stále dostupné peery, které vás po uplatnění zvacího kódu začnou sledovat nazpět a pak
  ukládají a poskytují váš feed, a na **rooms**, které feedy neukládají, ale tunelují spojení mezi
  svými členy.
- **Bloby a soukromé zprávy.** Obrázky a další soubory jsou bloby adresované obsahem, které se
  stahují od peerů; současné implementace je ve výchozím nastavení omezují na 5 MB. Soukromé zprávy
  se šifrují až pro sedm příjemců a publikují se jako šifrovaný text ve feedu autora.

## V čem se liší

### Co peer ukládá

Peer v SSB uchovává úplnou kopii každého feedu ve svém replikačním dosahu, od první zprávy každého
feedu, a tyto feedy poskytuje ostatním. Právě díky tomu SSB funguje offline, ale nároky na úložiště
rostou s každou zprávou v dosahu a nová instalace musí tyto feedy stáhnout, než začne zobrazovat
něco podstatného. Klient Bitsocialu stahuje nejnovější stav komunit, které otevře, od uzlu komunity
a od peerů, kteří ji seedují, a síť uchovává jen tento nejnovější stav. Viz
[Protokol peer-to-peer](/peer-to-peer-protocol/).

### Mazání a zařízení

Protože feed je řetězec hashů, SSB nemá mazání v rámci celé sítě: peer může zprávy odstranit z
vlastní databáze, ale nemůže je stáhnout z kopií ostatních peerů. Publikování se stejným klíčem ze
dvou zařízení nebo z obnovené zálohy feed rozvětví (fork), takže obvyklým řešením je jedna identita
na zařízení. PZP, nástupnický protokol od týmu Manyverse, uvádí mazání, více zařízení na účet a
feedy odolné vůči forkům mezi svými hlavními změnami oproti SSB
([oznámení o spuštění](https://www.manyver.se/blog/2024-07-03/)). Komunitní uzel Bitsocialu při
každé aktualizaci publikuje novou verzi stavu komunity, takže obsah, který odstraní její moderátoři,
z nejnovějšího stavu vypadne.

### Koho můžete slyšet

Replikační dosah SSB slouží zároveň jako spamový filtr. Feed cizího člověka se k vám dostane jen
tehdy, pokud ho sleduje někdo ve vašem dosahu skoků, a zablokováním feedu zastavíte jeho replikaci
vaším uzlem. Spam zůstane venku, ale stejně tak i nováčci, dokud je někdo nezačne sledovat.
Bitsocial umožňuje komukoli publikovat do komunity a uzel komunity pomocí své výzvy rozhoduje, zda
příspěvek přijme. Viz [Vlastní antispamové výzvy](/custom-challenges/).

### Komunity

SSB nemá objekt komunity. Kanály a hashtagy jsou štítky na jednotlivých příspěvcích, odpovědi ve
vlákně žijí ve feedech těch, kdo je napsali, a kolik z vlákna uvidíte, závisí na tom, které z těchto
feedů má váš uzel. Rooms mohou mít moderátory a seznamy členů, ti však řídí, kdo se může přes room
připojit, ne co se publikuje. Komunita v Bitsocialu je plnohodnotný objekt s vlastním párem klíčů,
pravidly, moderátory a výzvou.

### Infrastruktura

Oba systémy drží servery mimo cestu dat a oba se opírají o pomocníky. Pubs mají v SSB nejblíže k
hostované službě: ukládají a poskytují feedy všech, které sledují. Rooms mají blíž k HTTP routerům
Bitsocialu, protože ani jedny neukládají obsah, ale room přeposílá spojení mezi svými členy, zatímco
router jen vrací adresy poskytovatelů a na přenosu se nijak nepodílí. Stejně jako peer v SSB běží
komunitní uzel Bitsocialu na spotřebitelském hardwaru a musí být online, aby mohl přijímat nové
příspěvky.

### Offline a místní sítě

Tady je SSB silnější. Dva peeři SSB ve stejné síti Wi-Fi nebo, v případě Manyverse, přes Bluetooth
se mohou synchronizovat bez připojení k internetu a vše, co už bylo replikováno, zůstává čitelné
offline. Deklarovaným hlavním cílem Manyverse je učinit sociální sítě nezávislými na připojení k
internetu. Bitsocial potřebuje připojení k internetu, aby mohl najít peery a publikovat.

### Prohlížeč

Hlavní aplikace SSB obsahují úplný uzel SSB: Manyverse ho přibaluje do svých mobilních i
desktopových aplikací. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) provozovalo SSB
v prohlížeči s částečnou replikací a spojením přes rooms a v roce 2022 bylo archivováno. Aplikace
Bitsocialu provozují peer-to-peer uzel v běžné záložce prohlížeče. Viz
[Peer-to-Peer v prohlížeči](/browser-p2p/).

### Soukromé zprávy

SSB má vestavěné šifrované soukromé zprávy. Bitsocial se zaměřuje na veřejné komunity a zatím nemá
nativní přímé zprávy.

## Stav projektu

André Staltz, který vytvořil Manyverse, v dubnu 2024 od SSB, Manyverse i jejich plánovaného nástupce
odstoupil ([jeho poslední aktualizace](https://www.manyver.se/blog/2024-04-05/)). V červenci 2024
Jacob Karlsson tohoto nástupce spustil jako [PZP](https://pzp.wiki/) a napsal, že na Manyverse už
nebude dál pracovat a neví o nikom dalším, kdo by to plánoval. V říjnu 2026 neměly repozitáře PZP na
platformě [Codeberg](https://codeberg.org/pzp) po prosinci 2024 žádné aktualizace. Repozitář
Patchworku je archivován s verzí v3.18.1 jako posledním vydáním a tým stojící za Planetary, aplikací
SSB pro iOS, přešel v roce 2023 se svou aplikací Nos na Nostr. Síť SSB stále běží na peerech a pubs,
které lidé udržují online, ale její hlavní aplikace se už nevyvíjejí.

## Srovnání

| Otázka                     | Secure Scuttlebutt                                                                                    | Bitsocial                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Kategorie                  | Peer-to-peer gossip protokol                                                                          | Peer-to-peer síť komunit                                                                         |
| Identita                   | Jeden pár klíčů Ed25519 na zařízení                                                                   | Páry klíčů Ed25519 pro uživatele a komunity                                                      |
| Kde jsou příspěvky uloženy | Append-only feed autora, kopírovaný každým peerem, který ho replikuje                                 | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                                         |
| Co si peer uchovává        | Úplná historie každého feedu v jeho dosahu sledování                                                  | Nejnovější stav komunit, které čte nebo seeduje                                                  |
| Komunity                   | Žádný objekt komunity; kanály a hashtagy označují příspěvky                                           | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                                 |
| Ochrana proti spamu        | Replikační dosah podle grafu sledování a blokování                                                    | Výzva dané komunity, než je příspěvek přijat                                                     |
| Moderování                 | Sledování a blokování každého uživatele                                                               | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                           |
| Pomocné servery            | Pubs ukládají a poskytují feedy; rooms tunelují spojení                                               | HTTP routery vracejí poskytující peery a neukládají žádný obsah                                  |
| Offline                    | Synchronizace přes LAN a Bluetooth bez internetu                                                      | Potřebuje připojení k internetu                                                                  |
| Prohlížeč                  | Aplikace obsahují úplný uzel SSB                                                                      | Peer-to-peer uzel v běžné záložce prohlížeče                                                     |
| Síť                        | Běží, ale její hlavní aplikace se už nevyvíjejí                                                       | Živá síť s aplikacemi jako [5chan](/apps/5chan/) a [Seedit](/apps/seedit/)                       |
| Hlavní kompromis           | Funguje offline a nepotřebuje hosting, ale feedy rostou donekonečna a cizí lidé zůstávají neviditelní | Otevřené publikování a podpora prohlížečů, ale potřebuje internet a uchovává jen nejnovější stav |
