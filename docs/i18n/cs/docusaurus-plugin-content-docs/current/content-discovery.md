---
title: Objevování obsahu
description: Jak Bitsocial odděluje zjišťování vrstevníky od kurátorství na úrovni aplikace.
---

# Objevování obsahu

Bitsocial do protokolu nevkládá jeden globální zdroj, vyhledávací index nebo hodnotící algoritmus. Rozděluje zjišťování obsahu do dvou vrstev:

1. **Vyhledávání v síti** najde partnery, kteří aktuálně slouží známé komunitě.
2. **Správa aplikací** rozhoduje, které komunity, nástěnky, seznamy nebo příspěvky se produkt zobrazí jako první.

Díky tomu je protokol malý a zároveň ponechává prostor pro konkurenci mnoha objevovacích zážitků.

## Vyhledávání v síti

Každá komunita má stabilní adresu odvozenou z jejího veřejného klíče. Když klient již zná tuto adresu, dotazuje se lehkých směrovačů HTTP, aby našel partnery, kteří se pro ni oznámili jako poskytovatelé.

Směrovače vracejí pouze partnerské adresy poskytovatelů. Neukládají příspěvky, metadata, seznamy uživatelů ani lidsky čitelný adresář komunit. Poté, co klient obdrží partnerské adresy, připojí se k těmto kolegům a načte nejnovější metadata komunity plus ukazatele obsahu, poté načte aktuální data příspěvků pomocí hash.

To odpovídá na otázku protokolu: "Kde mohu získat nejnovější stav pro tuto komunitu?"

## Správa aplikací

Samostatná otázka produktu zní: "Které komunity by měl uživatel vidět jako první?"

Bitsocial to nechává na aplikacích, seznamech a uživatelích, místo aby jednu odpověď zapékal do sítě. Příklady:

- klient zobrazující komunity, které uživatel již sleduje
- kurátorský výchozí seznam pro aplikaci ve stylu Reddit
- adresářové sloty pro aplikaci ve stylu imageboardu
- vyhledávací nebo hodnotící indexy spravované konkrétní aplikací
- přímé odkazy sdílené uživateli

Aplikace mohou indexovat, hodnotit, filtrovat nebo zvýrazňovat různé věci, aniž by tyto volby proměnily v protokolový zákon. Pokud povrch zjišťování jedné aplikace není užitečný, jiná aplikace může vytvořit jinou na stejných základních komunitách.

## Aktuální aplikace

5chan aktuálně používá známé cesty k adresářům, jako je `/b/` nebo `/g/`. Přiřazení adresářů jsou dnes spravována prostřednictvím veřejného seznamu, přičemž se očekává, že budoucí verze budou podporovat vytváření nástěnek v aplikaci a hlasování pro adresářové sloty.

Seedit používá pro svou titulní stránku výchozí seznamy komunit. Komunity lze i nadále vytvářet a sdílet mimo tento výchozí seznam.

V obou případech seznam na úrovni aplikace pomáhá uživatelům najít něco, co mohou otevřít, a vyhledávání na úrovni protokolu pak převede vybranou komunitu na partnery.

## Proč na tomto rozdělení záleží

Jediná decentralizovaná síť stále potřebuje dobré zjišťování, ale zjišťovací vrstva by měla být vyměnitelná. Základní protokol Bitsocial se zaměřuje na adresovatelnost, vzájemné vyhledávání, publikování a antispam. Curation žije nad touto vrstvou, kde mohou aplikace experimentovat s adresáři, výchozími seznamy, kanály, vyhledáváním, hlasováním a zásadami moderování, aniž by vyžadovaly migraci v rámci celé sítě.
