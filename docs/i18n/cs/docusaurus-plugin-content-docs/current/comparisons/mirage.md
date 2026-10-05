---
title: Bitsocial a Mirage
description: Jak si Mirage, fórum ve stylu Redditu na vlastním blockchainu postaveném na Cosmos SDK, stojí ve srovnání s Bitsocialem a jeho aplikací ve stylu Redditu Seedit.
---

# Bitsocial a Mirage

[Mirage](https://mirage.foundation/) je diskusní síť ve stylu Redditu s komunitami, vlákny příspěvků
a hlasováním. Místo databáze nějaké firmy běží na vlastním blockchainu, řetězci postaveném na Cosmos
SDK s konsensem CometBFT. Nejbližším produktem Bitsocialu je [Seedit](/apps/seedit/), aplikace ve
stylu Redditu v síti Bitsocial, takže srovnání se týká hlavně toho, jak jednotlivé projekty komunity
hostují, vlastní a moderují.

## Jak Mirage funguje

- **Uzly.** Uzel Mirage je jediný kontejner Dockeru, který obsahuje validátor, databázi PostgreSQL,
  indexer, HTTP API a webový frontend. Každý uzel je zároveň validátorem. Jeho provoz vyžaduje
  server s Ubuntu na amd64 a 10 000 000 tokenů MIRAGE na účtu provozovatele, podle
  [příručky k nasazení](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publikování.** Prohlížeč podepíše každou akci klíčem secp256k1 uživatele a neplatící uživatelé
  navíc spočítají malý proof-of-work. Uzel akci zabalí do transakce na řetězci a zaplatí poplatek.
- **Čtení.** Indexer každého uzlu kopíruje data z řetězce do vlastní databáze a poskytuje feedy přes
  HTTP API. Uzly uchovávají zhruba týden bloků, takže dlouhodobá historie příspěvků žije v databázi
  každého uzlu a nový uzel začíná bez historie starší, než je jeho bod synchronizace.
- **Účty.** Účet je klíč odvozený z dvanáctislovné seed fráze a stejná seed fráze funguje na
  kterémkoli uzlu. Uživatelská jména se zapisují na řetězec a jsou jedinečná v celé síti.
- **Komunity.** Každé platné jméno už je komunitou a nikdo ho nevlastní. Placené kurátorské týmy o
  nejvýše deseti uživatelích udržují každý svůj moderovaný pohled na komunitu; čtenáři si vybírají
  pohled některého týmu, výchozí pohled uzlu nebo necenzurovaný pohled. Viz
  [FAQ Mirage](https://mirage.talk/faq).
- **Token.** Token MIRAGE slouží k placení předplatného, odměňuje autory a uzly a dává validátorům
  váhu ve správě. Předplatitelé proof-of-work přeskakují a mají vyšší limity.

## V čem se liší

### Kdo komunitu vlastní

V Seeditu drží zakladatel komunity její pár klíčů, provozuje její uzel nebo jeho provoz deleguje a
komunitu moderuje. V Mirage komunitu nevlastní nikdo: konkurenční kurátorské týmy nabízejí
moderované pohledy na stejné jméno a výchozím pohledem je tým, který zvolil největší počet platících
předplatitelů.

### Ochrana proti spamu

Mirage uplatňuje jedno pravidlo na celou síť: neplatící uživatelé platí proof-of-workem, jehož
obtížnost se přizpůsobuje objemu příchozího provozu, a předplatitelé ho přeskakují. U Bitsocialu si
každá komunita volí vlastní výzvu, od captchy přes seznamy povolených po platby. Viz
[Vlastní antispamové výzvy](/custom-challenges/).

### Infrastruktura

Mirage potřebuje blockchain. Validátoři dosahují konsensu o každé akci a každý uzel provozuje
kompletní serverový stack a musí držet velký stake tokenů. Bitsocial nemá žádný řetězec: komunitní
uzel běží na spotřebitelském hardwaru z desktopové aplikace nebo z `bitsocial-cli` a čtenáři mohou
pomáhat se sdílením obsahu.

### Kontrola nad celou sítí

Mirage má správu na řetězci váženou stakem validátorů. Ta může měnit obtížnost, ceny a emise tokenů,
razit nebo pálit tokeny a jmenovat administrátory, jejichž mazání referenční indexer uplatňuje na
jakýkoli příspěvek. Kód řetězce navíc správě umožňuje
[mazat účty](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
a
[posílat tokeny z jakékoli adresy](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
V říjnu 2026 vytvářeli bloky řetězce čtyři validátoři a všechny čtyři spravovaly provozní příručky
samotného projektu.

Bitsocial nemá žádného administrátora na úrovni protokolu. Vlastníci komunit moderují své komunity a
aplikace si volí, co zobrazí. Viz [Místní moderování, nikoli globální zákazy](/local-moderation/).

### Prohlížeč

Webový klient Mirage je HTTP klientem uzlu: prohlížeč podepisuje akce, ale nepřipojuje se k žádné
peer-to-peer síti. Aplikace Bitsocial mohou provozovat peer-to-peer uzel přímo v záložce prohlížeče.
Viz [Peer-to-Peer v prohlížeči](/browser-p2p/).

## Srovnání

| Otázka                     | Mirage                                                                                                         | Bitsocial                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Kategorie                  | Fórum na vlastním blockchainu (Cosmos SDK)                                                                     | Peer-to-peer síť komunit                                                                    |
| Identita                   | Klíč secp256k1 z dvanáctislovné seed fráze, s uživatelským jménem na řetězci                                   | Páry klíčů Ed25519 pro uživatele a komunity                                                 |
| Kde jsou příspěvky uloženy | Transakce na řetězci, poté databáze PostgreSQL každého uzlu                                                    | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                                    |
| Kdo to drží online         | Validátorské uzly, každý s 10 000 000 MIRAGE                                                                   | Uzel vlastníka komunity a pomocné seedery                                                   |
| Komunity                   | Jména bez vlastníka s konkurenčními placenými kurátorskými týmy                                                | Vlastněné párem klíčů; uzel vlastníka přijímá nebo odmítá příspěvky                         |
| Ochrana proti spamu        | Proof-of-work pro celou síť; předplatitelé ho přeskakují                                                       | Výzva dané komunity, než je příspěvek přijat                                                |
| Moderování                 | Pohledy kurátorských týmů, osobní filtry, administrátoři jmenovaní správou                                     | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                      |
| Ekonomika                  | Token MIRAGE pro předplatné, odměny a stake validátorů                                                         | V protokolu žádná; výzva může vyžadovat platbu nebo token                                   |
| Prohlížeč                  | HTTP klient uzlu                                                                                               | Peer-to-peer uzel v běžné záložce prohlížeče                                                |
| Hlavní kompromis           | Jeden sdílený, uspořádaný stav a snadná registrace, ale malá sada validátorů a pravomoci správy nad celou sítí | Není potřeba řetězec ani stake, ale chybí globální pořadí a starý obsah není zaručen navždy |
