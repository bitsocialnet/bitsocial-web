---
title: Kompletní laické vysvětlení protokolu Bitsocial
description: Srozumitelný anglický průvodce komunitami Bitsocial, vyhledáváním kolegů, publikováním, výzvami proti spamu, moderováním a aplikacemi.
---

# Kompletní laické vysvětlení protokolu Bitsocial

Tato stránka vysvětluje Bitsocial, aniž byste předpokládali, že již rozumíte sítím peer-to-peer, kryptografickým klíčům, IPFS nebo pubsub.

Některé detaily jsou záměrně zjednodušeny. Technickou verzi najdete na stránce [Protokol Peer-to-Peer](./peer-to-peer-protocol.md).

## Krátká verze

Bitsocial je protokol pro sociální aplikace, kde jsou komunity vlastněny klíči namísto firemní databáze.

Bitsocial komunita má adresu. Aplikace používají tuto adresu k vyhledání kolegů, kteří slouží komunitě, k načtení nejnovějších příspěvků od těchto kolegů a k publikování nových příspěvků prostřednictvím kanálu zpráv typu peer-to-peer. Před přijetím příspěvku může komunita vyžadovat antispamovou výzvu, jako je captcha, zvací kód, platba, kontrola tokenu, kontrola moderování AI, seznam povolených nebo jakékoli jiné pravidlo, které lze kódovat.

To je hlavní myšlenka:

1. Komunita je řízena soukromým klíčem.
2. Veřejný klíč poskytuje komunitě stabilní adresu.
3. Kolegové pomáhají čtenářům najít a načíst komunitu.
4. Komunitní uzel přijímá nebo odmítá nové příspěvky.
5. Antispamová politika náleží každé komunitě, nikoli jedné globální platformě.

## Proč na hashe záleží

Hash je krátký otisk pro data.

Pokud dva lidé hashují přesně stejný soubor, získají stejný otisk prstu. Pokud se soubor změní, změní se otisk prstu. Díky tomu jsou hash užitečné pro vyhledávání a kontrolu dat, aniž byste důvěřovali nějaké společnosti, že vám řekne, o jaký soubor jde.

Systémy peer-to-peer tuto myšlenku neustále využívají. Místo toho, aby jeden web požádal o „soubor s názvem photo.png“, může peer požádat síť o data se specifickým otiskem prstu. Pokud jiný peer vrátí nesprávná data, kontrola hash se nezdaří.

Bitsocial používá hash a identifikátory obsahu pro data příspěvků a další části stavu komunity. Důležitý bod je jednoduchý: data lze řešit tím, čím jsou, nejen tím, kde je společnost hostuje.

## Proč na veřejných klíčích záleží

Veřejný klíč a soukromý klíč jsou shodný pár.

Soukromý klíč je tajný. Je to věc, která dává kontrolu. Sdílení veřejného klíče je bezpečné. Umožňuje všem ostatním zkontrolovat, zda zpráva, aktualizace nebo akce moderování skutečně pocházejí z odpovídajícího soukromého klíče.

Takto se Bitsocial vyhýbá běžným platformovým účtům. Společnost nemusí vydávat identitu. Řádek databáze nemusí definovat vlastníka. Klíčový pár je autorita.

Jednoduše řečeno:

- soukromý klíč je ovládacím prvkem vlastníka
- veřejný klíč je veřejná identita nebo adresa
- podpisy prokazují, že žaloba přišla od vlastníka

## Co je to Bitsocial komunita

Bitsocial komunita není jen stránka v jedné aplikaci.

Má svůj vlastní klíčový pár. Veřejný klíč poskytuje komunitě stabilní síťovou adresu. Soukromý klíč řídí aktualizace stavu komunity, jako jsou metadata, pravidla, seznam moderátorů, konfigurace výzev a ukazatele na nejnovější přijatý obsah.

To znamená, že komunita může přežít jedno rozhraní. Jedna aplikace to může zobrazit jako nástěnku. Jiná aplikace jej může zobrazit jako fórum. Budoucí aplikace jej může zobrazit ve zdroji založeném na profilu. Aplikace se může změnit, ale adresa komunity stále odkazuje na stejnou vlastněnou komunitu.

## Jak funguje čtení

Když uživatel otevře komunitu Bitsocial, aplikace nepožádá jednu centrální databázi o stránku.

Tok se blíží tomuto:

1. Aplikace již zná adresu komunity nebo ji získá ze seznamu, odkazu, vyhledávací plochy nebo
   člověku čitelné jméno.
2. Aplikace se ptá lehkých směrovačů, kteří kolegové aktuálně poskytují adresu komunity.
3. Směrovače vracejí pouze partnerské adresy. Nevrací příspěvky, pravidla, profily ani komunitu
   metadata.
4. Aplikace se spojí s vrstevníky a načte nejnovější stav komunity.
5. Tento stav obsahuje ukazatele na zveřejnění obsahu.
6. Aplikace načítá obsah příspěvku od kolegů a vykresluje jej v běžném sociálním rozhraní.

Router je pouze pomocník pro vyhledávání. Je to blíže k otázce "kdo to má?" než se ptát "prosím, poslužte mi celý web."

Další podrobnosti o tomto rozdělení naleznete v [Objevování obsahu](./content-discovery.md).

## Jak funguje odesílání příspěvků

Odesílání příspěvků se liší od čtení, protože otevřené sítě peer-to-peer mohou být spamovány.

Bitsocial zpracovává publikování prostřednictvím toku výzvy-reakce:

1. Uživatel napíše příspěvek nebo odpověď.
2. Aplikace se připojí k tématu zprávy peer-to-peer komunity.
3. Aplikace požádá komunitní uzel o výzvu.
4. Komunitní uzel odešle výzvu zpět.
5. Uživatel nebo aplikace dokončí výzvu.
6. Aplikace odešle příspěvek plus odpověď na výzvu.
7. Komunitní uzel zkontroluje odpověď a příspěvek.
8. Pokud projde, uzel komunity přijme příspěvek do příští aktualizace komunity.
9. Ostatní čtenáři získávají aktualizovaný stav komunity od kolegů.

Výzva nastane předtím, než se příspěvek stane součástí přijatého stavu komunity. To je důležitý rozdíl od systémů, kde je spam nejprve přijímán a později skryt.

## Proč jsou důležité antispamové výzvy

Většina sociálních platforem přeměňuje antispam na politiku platforem. Jedna společnost rozhodne, co se počítá jako platný účet, platný příspěvek, platný dosah nebo platný uživatel.

Bitsocial tyto věci odděluje. Protokol poskytuje komunitám způsob, jak vyžadovat výzvu před přijetím příspěvku, ale nenutí každou komunitu použít stejnou výzvu.

Jedna komunita může používat captcha. Jiný může použít zvací kódy. Další může vyžadovat SMS šek, platbu, NFT, zůstatek tokenů, skóre moderování AI, doklad o reputaci, seznam povolených specifických pro komunitu nebo vlastní pravidlo.

Tato flexibilita je důležitá, protože spam se mění. Pravidlo pro spam na úrovni protokolu se stane zastaralým. Výzva na úrovni komunity se může vyvíjet bez migrace celé sítě.

Pro cílené vysvětlení si přečtěte [Vlastní antispamové výzvy](./custom-challenges.md).

## Jak funguje moderování

Bitsocial není bez moderování. Je to moderování bez jednoho globálního superadmina.

Komunita může mít vlastníky a moderátory. Adresy moderátorů jsou součástí stavu komunity. Když moderátor provede akci, může být tato akce podepsána. Komunitní uzel a klienti mohou zkontrolovat podpis podle seznamu moderátorů.

To dává moderování místní rozsah:

- vlastník komunity řídí tuto komunitu
- moderátoři jednají pomocí klíčů, které komunita rozpozná
- aplikace si stále mohou vybrat, co budou indexovat, hodnotit, skrývat nebo zvýraznit
- žádný firemní účet na úrovni protokolu nemůže vymazat každou identitu nebo zabavit každou komunitu

V praxi to znamená, že komunita může odstraňovat spam nebo prosazovat pravidla ve svém vlastním prostoru, aniž by svá pravidla proměnila v zákon pro celou síť.

Pro zobrazení zásad si přečtěte [Místní moderování, nikoli globální zákazy](./local-moderation.md).

## Jaké aplikace přidávají

Protokol nerozhoduje o tom, jak má celý produkt vypadat.

Aplikace přidává lidskou zkušenost kolem protokolu:

- výchozí seznamy komunit
- hledání a objevování
- zdroje a hodnocení
- rozhraní pro rozložení a odesílání
- manipulace s médii
- nástroje moderování
- balení pro mobily, počítače nebo prohlížeče
- obchodní model a výchozí hodnoty

To je důvod, proč Bitsocial může podporovat různé styly aplikací. 5chan může vypadat jako imageboard. Seedit může působit jako diskuze ve stylu fóra. Jiní klienti mohou vytvářet různé vyhledávací povrchy, systémy hodnocení, zobrazení moderování nebo výchozí nastavení komunity a přitom stále používat kompatibilní komunity Bitsocial pod nimi.

Protokol udržuje vlastnictví a publikování přenosné. Aplikace soutěží o kvalitu produktu.

## Co veřejné RPC přidává

Přímé provozování komunitního uzlu peer-to-peer je výkonné, ale ne každý chce spravovat stále zapnutý počítač.

Veřejné RPC je vrstva služeb, díky které je Bitsocial pohodlnější. Veřejný poskytovatel RPC může uživatelům pomoci spravovat komunity z telefonu nebo odlehčeného klienta, zatímco model dlouhodobého vlastnictví by měl uživatelům stále umožnit odejít, hostit sami nebo si vybrat konkurenčního poskytovatele.

Na rozlišení záleží:

- RPC může pomoci s dostupností a pohodlím
- RPC by se nemělo stát trvalou vazbou
- vztah vlastníka by měl zůstat vázán na klíče, nikoli na databázi jednoho poskytovatele

## Co Bitsocial není

Bitsocial není blockchainová sociální síť. Sociální média nepotřebují, aby se každý příspěvek stal transakcí v jedné globální účetní knize.

Bitsocial není federace ve smyslu ActivityPub. Komunita nemusí být účet na jednom serveru s jednou doménou, jedním administrátorem a jednou serverovou databází.

Bitsocial také není jedna aplikace. Jedná se o vrstvu sdíleného protokolu pro aplikace, komunity, uzly, směrovače, poskytovatele RPC, vyhledávací služby, moduly proti spamu a nástroje pro moderování.

Nejde o to, že každý uživatel musí tomu všemu před odesláním porozumět. Jde o to, že produkt se může cítit normálně, zatímco model vlastnictví pod ním je jiný.

## Kam dál

- [Protokol Peer-to-Peer](./peer-to-peer-protocol.md) vysvětluje technický postup.
- [Objevování obsahu](./content-discovery.md) vysvětluje vyhledávání v síti versus spravování aplikací.
- [Vlastní antispamové výzvy](./custom-challenges.md) vysvětluje systém výzev.
- [Identita a komunitní vlastnictví](./identity-and-ownership.md) vysvětluje ovládání klíčem
  vlastnictví.
- [Sestavte si vlastního klienta](/build-your-own-client/) explains how independent apps can build on
  stejnou síť.
