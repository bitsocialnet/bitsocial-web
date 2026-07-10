---
title: Decentralizovat Twitter/X
description: "Třetí fáze hlavního plánu: cílená, decentralizovaná alternativa k Twitter/X pro veřejnou konverzaci zaměřenou na text, s vyměnitelnou infrastrukturou."
---

# Decentralizovat Twitter/X

Třetí fáze je plán vybudovat cílenou, decentralizovanou alternativu k Twitter/X. Jejím středobodem je veřejná konverzace zaměřená na text: krátké příspěvky, odpovědi, reposty, sledování, diskuse v reálném čase a komunity, přičemž platformní vrstva zůstane otevřená.

Twitter/X je stále založený na příspěvcích, textu a sdílení myšlenek. Klient třetí fáze by měl soupeřit právě v tomto základním zážitku a zajistit, aby fungoval mimořádně dobře.

Tato stránka popisuje směr produktu, nikoli pevně danou specifikaci vydání. Přesné rozhraní, výchozí kanál, reklamní model, funkce AI a tržiště RPC se mohou měnit s tím, jak protokol a první aplikace dozrávají.

## Co by měl klient prokázat

Klient by měl prokázat, že sociální síť založená na profilech nemusí skončit jako platforma, která drží identity uživatelů ve své úschově:

- uživatelé mohou vlastnit své identity a profily
- komunity a profilové uzly mohou zůstat peer-to-peer
- komunity mohou přenášet síťové efekty mezi klienty Bitsocial
- poskytovatelé RPC mohou zajistit pohodlné používání bez převzetí úschovy
- algoritmy kanálu mohou být volitelné služby místo pravidel vnucených platformou
- o stejnou síť mohou dál soutěžit i další klienti

Cílem je vybudovat co nejsilnějšího klienta pro veřejnou konverzaci a ukázat, kam až může protokol dosáhnout.

## Známý účel, vyměnitelné provedení

Výchozí prostředí by mělo soupeřit s jádrem Twitter/X: rychlý domovský kanál, textové příspěvky, sledování, odpovědi, šíření pomocí repostů, komunity, oznámení, vyhledávání a okamžitě funkční seřazené zobrazení For You.

Bitsocial Forge může provozovat první výchozí službu RPC a kanálu. Tato výchozí služba může zahrnovat seřazený kanál a reklamy, aby klient působil hotově od prvního dne a nevyžadoval po běžných uživatelích, aby si celý systém sestavili sami.

Rozdíl je v tom, že výchozí nastavení se nesmí stát vězením. Uživatel by měl moci změnit RPC, kanály, instance, systémy řazení, reklamy a poskytovatele objevování nebo řazení úplně vypnout. Klient může při prvním spuštění nabídnout jasné výchozí volby a přitom ponechat všechny hlavní služby vyměnitelné.

Díky tomu lze klienta přizpůsobit více než běžnou platformu. Jeden uživatel si může ponechat výchozí seřazený kanál s reklamami. Jiný může používat chronologický kanál bez řazení. Další si může zvolit RPC zaměřené na soukromí, komunitou provozovanou službu objevování, placený kanál bez reklam nebo specializovaný algoritmus pro konkrétní subkulturu.

## Komunity napříč klienty

Komunity by měly být mnohem důležitější než izolované skupiny uvnitř jediné aplikace.

Na X/Twitter jsou komunity uzavřené uvnitř X. Mohou být užitečné, ale dědí omezení jedné platformy, jednoho systému účtů, jednoho systému doporučení a jediného produktového rozhraní.

Komunitu Bitsocial lze vytvořit, hostovat, objevovat a používat prostřednictvím různých klientů. Klient třetí fáze tak může zobrazovat komunity a příspěvky z širší sítě Bitsocial, nejen od uživatelů, kteří začali přímo v něm. V jedné komunitě by se mohla současně objevovat aktivita z klienta imageboardu, diskusního klienta ve stylu Redditu, specializovaného diskusního fóra, mobilní aplikace a klienta třetí fáze.

To je zásadní výhoda síťového efektu: jeden klient může běžným uživatelům připadat známý a přitom čerpat hodnotu z mnoha klientů, komunitních uzlů, poskytovatelů RPC a nezávislých služeb.

## Volitelné algoritmy kanálu

Klient třetí fáze by neměl všem vnucovat jeden globální systém řazení.

Algoritmy kanálu by měly být volitelné. Uživatel si může vybrat algoritmus na tržišti, změnit poskytovatele, použít algoritmus firmy, anonymního provozovatele nebo komunity, spustit vlastní algoritmus nebo nepoužívat žádný.

Veřejní poskytovatelé RPC jsou přirozeným místem, kde si tyto služby mohou konkurovat. Mohou obsah indexovat, řadit a doporučovat, ale neměli by vlastnit uživatele ani jeho profil.

Tyto služby mohou soutěžit také o podobu samotného klienta. Jedno RPC může poskytovat seřazený kanál s reklamami. Jiné může nabídnout neseřazený chronologický kanál. Další se může specializovat na soukromí, překlady, moderování, objevování komunit nebo sociální graf pro úzce zaměřenou skupinu.

Pokud bude ekonomický model fungovat, služby kanálu založené na RPC by mohly přidat funkce AI podobné těm, které se běžné platformy snaží vkládat do svých kanálů: automatické překlady, souhrny, odpovědi s pomocí botů, odpovědi na hledání, pomoc s moderováním nebo kontext ve stylu komunitních poznámek.

Tyto funkce by měly být volbou služby, ne požadavkem protokolu. Výchozí RPC může soutěžit bohatším kanálem, ale uživatelé a konkurenční klienti by si stále měli moci vybrat jednodušší, soukromé, chronologické, bezreklamní nebo komunitně zaměřené alternativy.

## RPC bez úschovy

Každý uživatel by se měl moci prostřednictvím RPC účastnit jako plnohodnotný peer-to-peer uzel, aniž by poskytovateli RPC předal vlastnictví své identity nebo profilu.

Hostovaná cesta je důležitá, protože většina uživatelů nezačne provozem vlastního serveru. Stejně důležitá je možnost odejít: uživatel by měl kdykoli moci přejít na vlastní profilový uzel na nenáročném hardwaru, včetně Raspberry Pi.

To je rozdíl mezi pohodlím a úschovou.

## Veřejná konverzace posílená Bitsocial Chain

Bitsocial Chain může přinést trvalé názvy, platby, spropitné, ocenění a další finanční nástroje přímo do veřejné konverzace.

Klient třetí fáze zůstává zaměřený na příspěvky, text, sdílení myšlenek a diskusi v reálném čase a zároveň sdílí komunity a síťové efekty s dalšími klienty Bitsocial.
