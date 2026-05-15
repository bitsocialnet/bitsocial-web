---
title: Vlajková loď Bitsocial App
description: "Navrhovaný klient Bitsocial založený na profilu: ve výchozím nastavení známý jako X/Twitter, ale s vyměnitelnými RPC, zdroji, algoritmy, reklamami a komunitami."
---

# Vlajková loď Bitsocial App

Vlajková loď Bitsocial aplikace je navrhovaným prvním klientem založeným na profilu pro síť. Nejjednodušší srovnání je: ve výchozím nastavení známé jako X/Twitter, ale s nefunkční vrstvou platformy.

Přidal by profily, sledování, odpovědi, kanály, komunity, oznámení a veřejnou konverzaci v reálném čase, přičemž by základní služby zůstaly nahraditelné. 5chan dokazuje, že anonymní komunity mohou fungovat. Seedit směřuje k trvalé diskusi. Vlajková loď aplikace by tyto síťové efekty přenesla do běžného sociálního kanálu, aniž by se jedna společnost stala vlastníkem grafu.

Tato stránka popisuje směr produktu, nikoli specifikaci uzamčeného uvolnění. Přesné rozhraní, výchozí zdroj, model reklamy, funkce AI a tržiště RPC se mohou měnit, jak protokol a rané aplikace dozrávají.

## Co by to mělo dokázat

Aplikace by měla prokázat, že sociální síť založená na profilu se může vyhnout tomu, aby se stala platformou pro správu:

- uživatelé mohou vlastnit identity a profily
- komunity a profilové uzly mohou zůstat peer-to-peer
- komunity mohou nést síťové efekty napříč klienty Bitsocial
- Poskytovatelé RPC mohou aplikaci usnadnit, aniž by ji museli přebírat
- Algoritmy zdroje mohou být volitelnými službami namísto zákona o platformě
- ostatní klienti mohou stále soutěžit o stejnou síť

Jde o to, aby nebyl jediný Bitsocial klient. Jde o to, vytvořit prvního širokého klienta, který ukáže, jak daleko se může protokol roztáhnout.

## Ve výchozím nastavení známé, vyměnitelné podle designu

Výchozí prostředí by mělo konkurovat běžným aplikacím pro veřejnou konverzaci: rychlý domovský kanál, sledování, odpovědi, distribuce ve stylu repostování, komunity, oznámení, vyhledávání a seřazené zobrazení Pro vás, které funguje okamžitě.

Bitsocial Forge může spustit první výchozí službu RPC a feed. Toto výchozí nastavení může zahrnovat hodnocený zdroj a reklamy, takže aplikace bude vypadat kompletní hned první den, místo aby požadovala od běžných uživatelů, aby si celou sestavu sestavili sami.

Rozdíl je v tom, že výchozí by se nemělo stát vězení. Uživatel by měl mít možnost přepínat RPC, zdroje, instance, systémy hodnocení, reklamy a poskytovatele vyhledávání nebo hodnocení úplně odstranit. Aplikace může být při prvním spuštění zaujatá, přičemž každá hlavní služba může být nahraditelná.

Díky tomu je aplikace přizpůsobitelnější než běžná platforma. Jeden uživatel si může ponechat výchozí hodnocený zdroj s reklamami. Jiný může použít chronologický zdroj bez hodnocení. Jiný by si mohl vybrat RPC zaměřené na soukromí, komunitní vyhledávací službu, placený zdroj bez reklam nebo specializovaný algoritmus vytvořený pro konkrétní subkulturu.

## Komunity napříč klienty

Komunity by měly být mnohem důležitější než izolované skupiny uvnitř jedné aplikace.

Na X/Twitteru jsou komunity omezeny uvnitř X. Mohou být užitečné, ale zdědí limity jedné platformy, jednoho systému účtů, jednoho balíčku doporučení a jednoho povrchu produktu.

Bitsocial komunitu lze vytvořit, hostovat, objevovat a používat prostřednictvím různých klientů. To znamená, že stěžejní aplikace může zobrazovat komunity a příspěvky ze širší sítě Bitsocial, nejen od uživatelů, kteří začali v stěžejní aplikaci. Komunita by mohla mít aktivitu z klienta imageboard, diskusního klienta ve stylu Reddit, klienta pro specializované fórum, mobilní aplikaci a vlajkovou loď současně.

To je hlavní výhoda síťového efektu: jeden klient se může běžným uživatelům cítit dobře známý a přitom stále získávat hodnotu od mnoha klientů, komunitních uzlů, poskytovatelů RPC a nezávislých služeb.

## Algoritmy volitelného podávání

Vlajková loď aplikace by neměla všem vnucovat jeden globální systém hodnocení.

Algoritmy zdroje by měly být přihlášeny. Uživatel si mohl vybrat algoritmus z tržiště, změnit poskytovatele, použít algoritmus od společnosti, použít algoritmus provozovaný anonymním operátorem, použít algoritmus vytvořený komunitou, spustit osobní nebo nepoužívat vůbec žádný algoritmus.

Veřejní poskytovatelé RPC jsou přirozeným místem pro soutěž těchto služeb. Mohou indexovat, hodnotit a doporučovat obsah, ale neměli by vlastnit uživatele ani profil.

Tyto služby mohou také soutěžit o tvar samotné aplikace. Jeden RPC může poskytnout hodnocený zdroj s reklamami. Jiný může poskytnout nezařazený chronologický zdroj. Další se může specializovat na soukromí, překlady, moderování, objevování komunity nebo speciální sociální graf.

Pokud bude ekonomika fungovat, mohly by služby zdrojů podporované RPC přidat funkce umělé inteligence podobné tomu, co se běžné platformy snaží vložit do svých zdrojů: automatické překlady, souhrny, odpovědi za pomoci robotů, odpovědi na vyhledávání, pomoc s moderováním nebo kontext ve stylu komunitních poznámek.

Tyto funkce by měly být volbou služby, nikoli požadavky na protokol. Výchozí RPC může konkurovat tím, že nabídne bohatší zdroj, ale uživatelé a konkurenční klienti by měli mít stále možnost vybrat si jednodušší, soukromé, chronologické alternativy, bez reklam nebo specifické pro komunitu.

## Nevazební RPC

Každý uživatel by měl mít možnost účastnit se jako úplný uzel typu peer-to-peer prostřednictvím RPC, aniž by poskytovatel RPC udělil vlastnictví své identity nebo profilu.

Na hostované cestě záleží, protože většina uživatelů nezačne spuštěním serveru. Na výstupní cestě záleží stejně: uživatel by měl mít možnost přesunout se do svého vlastního profilového uzlu na hardwaru s nízkou specifikací, včetně Raspberry Pi, kdykoli bude chtít.

To je rozdíl mezi pohodlím a úschovou.

## Proč se může stát aplikací na všechno

Pokud Bitsocial Network poskytuje aplikacím trvalé pojmenování, platby, spropitné, ocenění a další finanční prostředky, vlajková loď aplikace by se mohla stát mnohem více než jen klientským zdrojem.

Důležitým omezením je, že aplikace by se neměla stát novým vlastníkem sítě. Může to být velký klient, možná dokonce nejoblíbenější klient, přičemž stále ponechává prostor pro konkurenční aplikace, konkurenční RPC, konkurenční algoritmy feedu a vlastní uzly profilu.
