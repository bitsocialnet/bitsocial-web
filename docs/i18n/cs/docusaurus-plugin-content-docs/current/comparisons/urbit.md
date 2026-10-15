---
title: Bitsocial a Urbit
description: Jak si Urbit, síť osobních serverů s Urbit ID založenými na Ethereu a skupinami provozovanými hostitelem v Tlon Messengeru, stojí ve srovnání s peer-to-peer komunitami Bitsocialu.
---

# Bitsocial a Urbit

[Urbit](https://urbit.org/) je síť osobních serverů. Každý uživatel má neustále běžící počítač,
kterému se říká loď (ship), na němž běží vlastní operační systém Urbitu (Arvo) napsaný ve vlastních
jazycích (Nock a Hoon) a který je identifikován pomocí Urbit ID. Hlavní sociální aplikací Urbitu je
[Tlon Messenger](https://tlon.io/), kterou vytvořila společnost Tlon, založená v roce 2013 za účelem
vývoje Urbitu.

Urbit se snaží nahradit celý výpočetní stack, takže jde o mnohem širší projekt než Bitsocial. Jeho
sociální vrstva však používá model blízký Bitsocialu: komunita žije na uzlu svého vlastníka a tento
uzel rozhoduje, co se do ní dostane. Oba systémy se liší v tom, kdo musí provozovat server a jak se
drží venku spam.

## Jak Urbit funguje

- **Urbit ID.** Každá loď má Urbit ID: číslo zobrazované jako vyslovitelné jméno, například
  `~sampel-palnet`. ID na vrstvě 1 (Layer 1) jsou NFT, jejichž vlastnictví a veřejné síťové klíče
  jsou zapsány v kontraktech Azimuth na Ethereu. ID na vrstvě 2 (Layer 2), přidaná v roce 2021 kvůli
  snížení poplatků, používají „naive rollup“: jejich transakce se na Ethereum publikují v dávkách,
  ale jejich vlastnictví se v kontraktu Azimuth neukládá a každá loď si ho počítá lokálně. Tlon
  provozuje roller, který může veřejnost používat zdarma, podle
  [dokumentace k Urbit ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) a stránky
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Pevná hierarchie.** Adresní prostor obsahuje 256 galaxií, 65 536 hvězd a zhruba 4 miliardy
  planet pro běžné použití. Galaxie vydávají hvězdy, hvězdy vydávají planety a každá planeta může
  vydávat měsíce pro svá vlastní zařízení. Komety jsou bezplatná ID, která si loď vygeneruje sama
  pro sebe a která se nikdy nedotknou blockchainu. Vlastníci galaxií tvoří Galactic Senate, který
  hlasuje o upgradech kontraktů Azimuth a volí správní radu Urbit Foundation.
- **Síť.** Lodě si vyměňují šifrované pakety peer-to-peer. Od července 2026 je síťovým protokolem
  [Directed Messaging](https://urbit.org/blog/directed-messaging), přepis staršího protokolu Ames
  zaměřený na obsah. Vyhledávání peerů mají na starosti galaxie: každá sleduje, kde se nacházejí
  lodě pod ní, a přeposílá jim pakety, dokud se obě lodě nemohou spojit přímo, nebo tak dlouho,
  dokud tomu brání firewall, podle
  [článku o Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Skupiny.** V Tlon Messengeru skupinu hostuje loď jejího zakladatele. Členové posílají zprávy
  hostiteli, který je distribuuje na lodě všech členů, a loď každého člena si uchovává vlastní
  kopii, podle [FAQ Tlonu](https://tlon.io/posts/faq). Hostitel řídí role, kanály a přijímání členů.
  Skupina může být veřejná, soukromá nebo tajná a může
  [zablokovat jednotlivé lodě nebo celé úrovně ID](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanály jsou chaty, poznámkové bloky nebo sbírky obrázků a odkazů.
- **Hosting.** Nový uživatel, který se zaregistruje u Tlonu, dostane loď provozovanou Tlonem, jejíž
  klíče má Tlon v úschově. Uživatel může loď i s jejím master ticketem exportovat a provozovat
  jinde: na zařízení od [Native Planet](https://www.nativeplanet.io/) nebo s běhovým prostředím Vere
  na Linuxu, macOS či Windows. Lodě zatím nedokážou přímo ukládat velké soubory, takže Tlon
  Messenger ukládá obrázky a další média do cloudového úložiště kompatibilního s S3.

## V čem se liší

### Kdo musí provozovat server

Na Urbitu je serverem každý účastník. Aplikace Tlonu jsou frontendy pro vlastní loď uživatele a přes
ni prochází i samotné čtení skupiny. Kdo sám loď neprovozuje, pronajme si nějakou, čímž se do hry
vrací poskytovatel hostingu: Tlon drží klíče hostovaných uživatelů a ponechává si omezený přístup
kvůli údržbě, i když uživatelé mohou odejít i s celou svou lodí.

V Bitsocialu potřebují neustále běžící uzel jen vlastníci komunit. Čtenáři a přispěvatelé mohou
provozovat peer-to-peer uzel v záložce prohlížeče a jejich účet je pár klíčů, který uchovává
aplikace. Viz [Peer-to-Peer v prohlížeči](/browser-p2p/). Když někdo přece jen používá hostovaný
uzel, návrh Bitsocialu se snaží umožnit mu delegovat dostupnost, aniž by svou identitu svěřil do
cizí úschovy. Viz [Identita a vlastnictví komunit](/identity-and-ownership/).

### Hostitel komunity

Tady mají oba systémy k sobě nejblíž. Skupina v Tlonu i komunita v Bitsocialu žijí na uzlu svého
vlastníka. Hostitel rozhoduje, kdo smí přispívat, uplatňuje moderování a distribuuje výsledek, a ani
jeden z protokolů nestaví nad hostitele žádného moderátora. V obou případech musí být hostitel
online. FAQ Tlonu uvádí, že když se hostitel odpojí, „skupina padá s ním“, a komunita v Bitsocialu
nemůže přijímat nové příspěvky, dokud je její uzel offline.

Obsah ukládají odlišně. Loď každého člena uchovává kopii historie skupiny, takže členové mohou i
během výpadku hostitele číst to, co už obdrželi. Čtenář v Bitsocialu stahuje nejnovější stav
komunity od jejího uzlu nebo od peerů, kteří ji seedují, takže komunita, jejíž uzel je offline,
zůstává čitelná, dokud ji peeři mají, ale síť uchovává jen nejnovější stav.

Skupina v Tlonu má navíc seznam členů a její hostitel ji může omezit jen na pozvané. Komunita v
Bitsocialu žádné členství nemá: číst ji může kdokoli a kdokoli se může pokusit přispět, pokud projde
její výzvou.

### Spam a identita

Urbit bojuje proti spamu tím, že identitu činí vzácnou. Počet planet je pevně daný a každou z nich
vydává nějaká hvězda. Bezplatné komety tuto vzácnost obcházejí, takže skupiny, které chtějí, aby
platila, je odmítají: dokumentace Urbitu uvádí, že některé skupiny komety nepřijímají, a skupina v
Tlonu může jediným nastavením zablokovat celou úroveň komet. Jakmile jsou komety vyloučeny,
potřebuje zablokovaný uživatel k návratu jinou planetu od vlastníka některé hvězdy. Hierarchii může
sledovat i reputace: Azimuth obsahuje kontrakt Censures, který galaxiím a hvězdám umožňuje označovat
ID. Protože je vzácnost zabudovaná do adresního prostoru, funguje stejně v každé skupině, která
komety odmítá.

Identity v Bitsocialu jsou bezplatné páry klíčů. Každá komunita si volí vlastní výzvu, než přijme
příspěvek, například captchu, platbu, zůstatek tokenů nebo seznam povolených, a jiné komunity se
mohou rozhodnout jinak. Viz [Vlastní antispamové výzvy](/custom-challenges/).

### Blockchain a správa

Identitní vrstva Urbitu závisí na Ethereu. Kontrakty Azimuth zaznamenávají vlastnictví a síťové
klíče na vrstvě 1, transakce vrstvy 2 se publikují na Ethereum v dávkách a Galactic Senate může
upgradovat kontrakt, který Azimuth řídí. Stejných 256 galaxií se navíc stará o vyhledávání peerů a
přeposílání, takže pevná sada identit nese jak správu, tak část směrování v síti.

Identity v Bitsocialu jsou páry klíčů, které nepotřebují žádnou registraci. Jména `.bso` a `.eth`
jsou volitelné aliasy, které se na ně překládají. Vyhledávání peerů probíhá přes HTTP routery, které
vracejí jen adresy poskytovatelů; provozovat router může kdokoli a klienti mohou router vyměnit
změnou své konfigurace.

### Rozsah

Urbit je univerzální počítač. Loď může hostovat vzdálený repozitář Gitu, osobní znalostní bázi nebo
AI agenty a Tlon Messenger je jen jeden program z mnoha. Vývoj pro Urbit většinou znamená psaní
aplikací v Hoonu pro Arvo. Bitsocial je protokol pro veřejné komunity s aplikacemi jako
[5chan](/apps/5chan/) a [Seedit](/apps/seedit/). Běží na existujícím stacku (libp2p, IPFS a
prohlížeč), místo aby ho nahrazoval, a jeho klienti se vytvářejí běžnými webovými nástroji. Viz
[Sestavte si vlastního klienta](/build-your-own-client/).

### Soukromé zprávy

Tady je silnější Urbit. Přímé zprávy putují z jedné lodi rovnou do druhé, veškerý provoz mezi loděmi
je šifrovaný a skupiny mohou být soukromé nebo tajné. Tlon upozorňuje, že zprávy jsou šifrované při
přenosu, ale na lodi se ukládají nešifrované. Bitsocial se zaměřuje na veřejné komunity a zatím nemá
nativní přímé zprávy.

## Stav projektu

Urbit prošel otřesy. V srpnu 2024 Urbit Foundation, nezisková organizace, která řídí vývoj jádra,
propustila svého výkonného ředitele; zakladatel Curtis Yarvin se vrátil, aby bez formální funkce
vedl strategii, několik klíčových vývojářů odešlo a finanční rezervy Foundation se počítaly na
měsíce,
[informoval CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin navrhl přesunout Azimuth na existující vrstvu 2 Etherea, nejspíš Base, a vydat zastupitelné
„vízové“ tokeny, které se dají převést na planety. K říjnu 2026
[dokumentace k ID](https://docs.urbit.org/urbit-id/what-is-urbit-id) Urbitu stále popisuje Azimuth
na Ethereu s jeho naive rollupem. V říjnu 2025 Galactic Senate vyměnil správní radu Foundation a
nová rada jmenovala nového výkonného ředitele
([oznámení](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Vývoj pokračuje. Directed Messaging bylo spuštěno s vydáním 408k 14. července 2026. V červnu 2026
Tlon Messenger
[otevřel veřejnou registraci bez čekací listiny](https://urbit.org/blog/this-month-in-urbit-june-2026)
a Tlon se nyní prezentuje jako místo, kde spolupracují lidé a AI agenti.

## Srovnání

| Otázka                     | Urbit                                                                                              | Bitsocial                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Kategorie                  | Síť osobních serverů a operační systém                                                             | Peer-to-peer síť komunit                                                                               |
| Identita                   | Urbit ID: zhruba 4 miliardy planet na Ethereu nebo jeho rollupu na vrstvě 2, plus bezplatné komety | Páry klíčů Ed25519 pro uživatele a komunity                                                            |
| Kdo provozuje server       | Každý uživatel, na vlastní lodi nebo na hostované                                                  | Vlastníci komunit; čtenářům a přispěvatelům stačí záložka prohlížeče                                   |
| Kde jsou příspěvky uloženy | Loď hostitele skupiny a kopie na lodi každého člena                                                | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                                               |
| Komunity                   | Skupiny hostované lodí svého zakladatele, se seznamy členů                                         | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                                       |
| Ochrana proti spamu        | Vzácná ID vydávaná hvězdami; skupiny blokují lodě nebo celé úrovně                                 | Výzva dané komunity, než je příspěvek přijat                                                           |
| Moderování                 | Role a blokování nastavené hostitelem skupiny                                                      | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                                 |
| Vyhledávání peerů          | Galaxie sledují lodě pod sebou a přeposílají pro ně provoz                                         | HTTP routery vracejí poskytující peery a neukládají žádný obsah                                        |
| Správa                     | Galactic Senate z 256 galaxií hlasuje o upgradech Azimuthu                                         | Žádná autorita na úrovni protokolu nad identitami ani komunitami                                       |
| Soukromé zprávy            | Šifrované přímé zprávy a skupiny jen pro pozvané                                                   | Veřejné komunity; zatím žádné nativní přímé zprávy                                                     |
| Hlavní kompromis           | Celý osobní počítač se soukromými skupinami, ale každý uživatel potřebuje neustále běžící loď      | Bezplatné identity a přístup z prohlížeče, ale žádné soukromé zprávy a uchovává se jen nejnovější stav |
