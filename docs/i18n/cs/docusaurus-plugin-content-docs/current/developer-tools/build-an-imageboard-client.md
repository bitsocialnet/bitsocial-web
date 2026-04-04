---
title: Sestavte klienta imageboard
description: Průvodce příspěvkem fáze 1 pro stavitele, kteří chtějí na Bitsocial dodávat nové zkušenosti s imageboardy.
sidebar_position: 1
---

# Sestavte klienta imageboard

Fáze 1 není o jedné oficiální aplikaci pokrývající celou kategorii. 5chan je prvním důkazem, ale skutečným cílem je široký ekosystém imageboard: více klientů Bitsocial s různými vizuálními jazyky, výchozími nastaveními moderování, modely adresářů a cílovými komunitami.

## Co potřebuje 1. fáze

- Známí klienti ve stylu 4chan pro mainstreamový onboarding
- Klienti inspirovaní Altchanem s různými kulturami a balíčky desek
- Mobilní klienti nebo klienti s nízkou šířkou pásma
- Klienti s jedinou komunitou nebo specializovaní klienti se silnými nesplácenými úvěry
- Lepší toky moderování, médií, registrace nebo objevování než první aplikace

## Nejrychlejší způsob pomoci

Pokud chcete co nejkratší cestu k odeslání, přispějte nejprve přímo na 5chan:

- Prozkoumejte živou aplikaci na [5chan.app](https://5chan.app)
- Zkontrolujte zdroj na [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Připojte se k chatu pro stavitele na [t.me/fivechandev](https://t.me/fivechandev)

## Sestavte si vlastního klienta

Pokud 5chan neodpovídá požadované komunitě nebo rozhraní, vytvořte místo toho samostatného klienta. Kompatibilní klienti Bitsocial mohou sdílet stejnou síť, aniž by sdíleli stejná rozhodnutí o produktu.

1. Naučte se nástroje pro práci s protokoly:
   - [Bitsocial React háčky](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Rozhodněte se, jaký druh imageboardu vlastně stavíte.
Nejprve vyberte strukturu desky, předpoklady identity, model moderování, tok objevů a vizuální jazyk.
3. Vyberte cestu implementace, která odpovídá projektu.
Fork 5chan, pokud se chcete rychle pohybovat se známou imageboardovou základnou. Začněte znovu, pokud se má uživatelské rozhraní nebo model interakce radikálně lišit.
4. Odešlete úzkou první verzi.
Jeden klient, který dobře slouží jedné skutečné komunitě, je cennější než vágní klon, který má uspokojit všechny.
5. Zveřejněte výsledek a nechte komunity otestovat.
Bitsocial se zlepšuje, když externí stavitelé posílají své klienty, kteří soutěží o kvalitu produktů, místo aby čekali, až jedna oficiální aplikace udělá vše.

## Princip designu

Bitsocial nevyhraje tím, že bude mít jednoho požehnaného klienta. Zvítězí, když mnoho klientů může koexistovat, rozdělit se, specializovat se a obsluhovat potřeby, které první aplikace nikdy nebude.
