---
title: Bitsocial a Quorum
description: Jak si Quorum, koncově šifrovaný skupinový messenger od Quilibrium se Spaces ve stylu Discordu, stojí ve srovnání s veřejnými peer-to-peer komunitami Bitsocialu.
---

# Bitsocial a Quorum

[Quorum](https://www.quorummessenger.com/) je skupinový messenger, který vytvořila společnost
Quilibrium Inc. na své síti [Quilibrium](https://quilibrium.com/). Je uspořádaný jako Discord, se
Spaces, kanály, rolemi a přímými zprávami, a jeho zprávy jsou koncově šifrované. Zmiňuje se vedle
Bitsocialu, protože se oba popisují jako peer-to-peer a odolné vůči cenzuře, se skupinami, které si
určují vlastní pravidla. Míří přitom na různé věci: Quorum na soukromý skupinový chat, Bitsocial na
veřejné komunity, které může číst kdokoli.

Quilibrium se popisuje jako decentralizovaná alternativa ke cloudovým platformám: síť uzlů, které
uchovávají data v šifrovaném hypergrafu a na jeho stavu se shodují prostřednictvím konsenzu, který
nazývá Proof of Meaningful Work. Uzly vydělávají QUIL, token sítě, kterým se platí poplatky za
používání. Quorum začínal v roce 2018 jako Howler, nápad na soukromou alternativu k Discordu, a stal
se první aplikací spuštěnou v síti Quilibrium, podle
[příběhu projektu Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). Společnost
Quilibrium Inc., kterou založila Cassie Heart, vyvíjí protokol a nabízí Quorum jako jednu ze svých
spravovaných služeb ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Jak Quorum funguje

Následující podrobnosti pocházejí ze zdrojového kódu klientů Quorum, z
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) pro webovou a desktopovou
aplikaci a z [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), a platí k
říjnu 2026.

- **Identity.** Hlavní identita uživatele je sada klíčů Ed448 a každé zařízení dostane vlastní klíče
  X448 a Ed448. V prohlížeči jsou klíče chráněny přístupovým klíčem (passkey). Adresy jsou hashe
  začínající na `Qm` a uživatelé mohou zobrazovat uživatelské jméno ze jmenné služby Quilibrium.
- **Šifrování.** Přímé zprávy používají mezi zařízeními Double Ratchet. Space sdílí mezi svými členy
  jedinou relaci Triple Ratchet a členové podepisují své zprávy klíči specifickými pro daný Space.
  Každý Space je šifrovaný a Quorum uvádí, že jeho zprostředkování zpráv brání službě, která zprávy
  přeposílá, v propojování odesílatelů s příjemci.
- **Vstup.** Do Spaces se vstupuje pomocí pozvánkových odkazů. Jednorázový odkaz nese klíče potřebné
  ke vstupu přímo v URL; veřejný odkaz je získá ze služby Quorum a veřejné Spaces mohou být uvedeny
  ve vyhledávatelném adresáři.
- **Přenos.** Webový, desktopový i mobilní klient se všechny připojují přes HTTPS a WebSocket k
  jediné službě,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Ta přeposílá šifrované zprávy do schránky každého člena a ukládá registrace uživatelů, šifrovaný
  manifest každého Space (kanály, role, emoji), materiály pro pozvánky, veřejný adresář a volitelnou
  šifrovanou synchronizaci nastavení. Uzlový software Quilibrium má službu inboxu a hubu se stejnou
  strukturou, ale ani klienti, ani dokumentace Quilibrium neuvádějí, jak se tato služba mapuje na
  síť.
- **Historie.** Klient každého člena uchovává vlastní kopii Space v místním úložišti. Webový a
  desktopový klient doplňuje starší historii tak, že požádá některého člena, který je online, o
  synchronizaci; mobilní klient přehrává log, který služba vede pro každý Space, takže může dohnat
  zameškané, když není online žádný jiný člen.
- **Moderování.** Role udělují právo mazat, připínat, ztlumovat a používat zmínky `@everyone`.
  Klient každého člena ověřuje podpis u každé moderátorské akce a použije ji jen tehdy, když má
  podepisující správnou roli. Vlastník může člena vyhodit, čímž se klíče Space vymění, takže
  vyhozený člen nemůže číst nové zprávy. Space může vyžadovat podepsané zprávy, nebo členům dovolit
  posílat nepodepsané zprávy, které lze popřít.
- **Kód.** Webový a desktopový klient je licencován pod AGPL-3.0 a mobilní klient pod GPL-3.0.
  Mobilní klient má navíc kryptopeněženku, integraci s Farcasterem a Apex, placené předplatné
  popsané níže.

## V čem se liší

### Soukromé skupiny a veřejné komunity

Space v Quorum je skupina členů: číst ho mohou jen lidé, kteří mají jeho klíče, a ke vstupu je
potřeba pozvánkový odkaz. Veřejný odkaz pustí dovnitř kohokoli, ale až po vstupu. Komunita v
Bitsocialu žádné členství nemá. Číst ji může kdokoli, z jakékoli aplikace, bez vstupu, a kdokoli se
může pokusit přispět, pokud projde výzvou dané komunity.

### Co udržuje skupinu online

Space v Quorum nemá žádný hostitelský uzel. Členové posílají zprávy přes službu Quorum, klient
každého člena si uchovává kopii a vlastník nemusí být online, aby spolu ostatní mohli mluvit.
Komunita v Bitsocialu žije na uzlu svého vlastníka; tento uzel přijímá nebo odmítá každý příspěvek a
publikuje nejnovější stav komunity. Komunita zůstává čitelná, dokud ji peeři seedují, ale nemůže
přijímat nové příspěvky, dokud je její uzel offline. Viz
[Protokol peer-to-peer](/peer-to-peer-protocol/).

### Kdo prosazuje pravidla

V Quorum se pravidla prosazují na okraji sítě. Klient každého člena podle role podepisujícího
rozhoduje, zda použije smazání, připnutí nebo ztlumení, a vyhození funguje tak, že se všichni
ostatní přesunou na nové klíče. V Bitsocialu se pravidla prosazují na uzlu komunity: příspěvek,
který neprojde výzvou nebo pravidly komunity, se nikdy nestane součástí komunity. Viz
[Místní moderování, nikoli globální zákazy](/local-moderation/).

### Ochrana proti spamu

Quorum drží spam venku hlavně pomocí pozvánek. Jednorázový odkaz vpustí jednu osobu, veřejný odkaz
kohokoli, kdo ho má, a vlastník může následně členy vyhazovat a měnit klíče; klient navíc omezuje
rychlost vlastního odesílání. Identity v Bitsocialu jsou bezplatné páry klíčů, takže každá komunita
si volí výzvu, kterou spustí, než přijme příspěvek, například captchu, platbu, zůstatek tokenů nebo
seznam povolených. Viz [Vlastní antispamové výzvy](/custom-challenges/).

### Klient a síť

Aplikace Quorum je klientem služby Quorum, kterou provozuje Quilibrium Inc. Aplikace se samy
nepřipojují k žádné peer-to-peer síti, takže přístup ke Space závisí na tomto jediném koncovém bodu.
Za ním je Quilibrium samostatnou sítí: v říjnu 2026 jeho
[explorer](https://dashboard.quilibrium.com/) ukazoval 114 dosažitelných peerů a 181 proverů v 99
shardech.

Webová aplikace Bitsocialu může v záložce provozovat uzel libp2p, stahovat obsah komunit od peerů a
publikovat přes gossipsub. Vyhledávání peerů probíhá přes HTTP routery, které vracejí jen adresy
poskytovatelů; provozovat router může kdokoli a klienti mohou router vyměnit změnou své konfigurace.
Viz [Peer-to-Peer v prohlížeči](/browser-p2p/).

### Ekonomika

V jádru sítě Quilibrium je token. Uzly těží QUIL, kterým se platí síťové poplatky, a jeho zabalená
verze (wrapped), wQUIL, obíhá na Ethereu. Quorum samotný je zdarma a nevyžaduje žádnou platbu ani
telefonní číslo. Jeho volitelné předplatné Apex stojí
[5 dolarů měsíčně](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
platí se ve wQUIL, SNAP nebo USDC na Ethereu a dělí se mezi Quilibrium Inc. a čtyři Spaces, které si
předplatitel vybere. Bitsocial nemá v protokolu žádnou platební vrstvu; komunita může
prostřednictvím své výzvy vyžadovat platbu nebo token.

### Soukromé zprávy

Tady je silnější Quorum. Přímé zprávy i zprávy ve Spaces jsou koncově šifrované s dopřednou
bezpečností a obsah zpráv se ke službě Quorum dostává jen jako šifrovaný text. Bitsocial se zaměřuje
na veřejné komunity a zatím nemá nativní přímé zprávy. Příspěvek v Bitsocialu je během přenosu přes
pubsub zašifrovaný klíčem uzlu komunity, ale jakmile je přijat, je veřejný.

## Stav projektu

V říjnu 2026 repozitář Quorum označoval webovou aplikaci jako betu a web Quorum stále uváděl
aplikace pro Google Play a App Store jako „již brzy“. Oba klienti se navíc rozcházejí: mobilní
aplikace má funkce pro peněženku, Farcaster a Apex, zatímco webový a desktopový klient zobrazuje své
stránky Wallet a Farcaster jako „již brzy“ a každý z nich dohání historii Spaces jinak.

Mainnet sítě Quilibrium dosáhl 30. září 2025 verze 2.1, kdy se síť po zastavení znovu rozběhla
([oznámení](https://x.com/QuilibriumInc/status/1973082817236984270)). V roce 2026 byl uzel přepsán
do Rustu, s postkvantovými podpisy pro konsenzus a síťovým protokolem, kterým starší uzly neumějí
komunikovat. Části dokumentace popisují návrh, a ne běžící kód: popisují
[mixnetové směrování](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), ale v
uzlu 2.1.0.25 je služba mixnetu
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
který zprávy přijímá, aniž by je míchal.

## Srovnání

| Otázka                      | Quorum                                                                              | Bitsocial                                                                                              |
| --------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Kategorie                   | Koncově šifrovaný skupinový messenger v síti Quilibrium                             | Peer-to-peer síť komunit                                                                               |
| Identita                    | Hlavní sada klíčů Ed448 plus klíče pro každé zařízení, chráněné přístupovým klíčem  | Páry klíčů Ed25519 pro uživatele a komunity                                                            |
| Kdo může číst               | Členové, kteří mají klíče daného Space                                              | Kdokoli, z jakékoli aplikace                                                                           |
| Kde jsou zprávy uloženy     | Zařízení každého člena; mobilní klient navíc přehrává log, který vede služba Quorum | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                                               |
| K čemu se klienti připojují | Ke službě Quorum na `api.quorummessenger.com`                                       | K peerům přes libp2p, i ze záložky prohlížeče                                                          |
| Komunity                    | Spaces s kanály, rolemi a pozvánkovými odkazy                                       | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                                       |
| Ochrana proti spamu         | Pozvánkové odkazy, vyhazování s výměnou klíčů, omezení rychlosti na straně klienta  | Výzva dané komunity, než je příspěvek přijat                                                           |
| Moderování                  | Role prosazované klientem každého člena; vyhazuje vlastník                          | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                                 |
| Soukromé zprávy             | Koncově šifrované přímé zprávy                                                      | Veřejné komunity; zatím žádné nativní přímé zprávy                                                     |
| Ekonomika                   | Síťový token QUIL; volitelné předplatné Apex za 5 dolarů měsíčně                    | V protokolu žádná; výzva může vyžadovat platbu nebo token                                              |
| Hlavní kompromis            | Soukromé, šifrované skupiny, ale každý klient závisí na jediné službě               | Bezplatné identity a přístup z prohlížeče, ale žádné soukromé zprávy a uchovává se jen nejnovější stav |
