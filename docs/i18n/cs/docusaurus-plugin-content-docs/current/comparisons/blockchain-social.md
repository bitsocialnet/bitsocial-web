---
title: Bitsocial a blockchainové sociální sítě
description: Jak Lens, DeSo a Steem ukládají sociální data nebo jejich pravidla na blockchain a proč Bitsocial žádný blockchain nepoužívá.
---

# Bitsocial a blockchainové sociální sítě

Lens, DeSo i Steem ukládají sociální aktivitu na blockchain. Účty, sledování, příspěvky nebo
pravidla kolem nich se stávají transakcemi, které validátoři řadí a ukládají. Bitsocial žádný
blockchain nepoužívá: sociální média nepotřebují globální pořadí každého příspěvku, a tak se
Bitsocial obejde bez konsensu, poplatků za plyn i stakingu. Zdůvodnění najdete v části
[Protokol peer-to-peer](/peer-to-peer-protocol/).

## Co mají společného

- **Za každý zápis někdo platí.** Lens účtuje plyn, který mohou sponzorovat aplikace; DeSo účtuje
  poplatek za každou akci; Steem přiděluje akce podle stakovaných tokenů.
- **Řetězec stanoví jednu antispamovou politiku pro všechny.** Poplatky, stake a náklady na účty
  platí pro celou síť, místo aby si je volila každá komunita.
- **Záznamy na blockchainu jsou trvalé.** Aplikace mohou obsah skrýt, ale nemohou ho z řetězce
  odstranit.
- **Prohlížeče jsou klienty API.** Webové aplikace podepisují transakce a čtou přes uzel, indexer
  nebo API, které provozuje někdo jiný.

## Lens

[Lens](https://lens.xyz/) běží na Lens Chain, vrstvě 2 Etherea postavené na ZK Stacku od ZKsync,
která pro dostupnost dat používá Avail. Mask Network
[spravuje Lens od ledna 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Na řetězci:** účty jsou chytré kontrakty, uživatelská jména jsou NFT uvnitř jmenných prostorů a
  grafy, skupiny, feedy a jejich pravidla jsou rovněž kontrakty.
- **Mimo řetězec:** text a média příspěvku jsou v souboru JSON na nějakém URI, obvykle na Grove,
  úložné službě Lensu, která stojí před IPFS. Reakce a záložky drží Lens API a aplikace čtou přes
  toto API.
- **Spam a brány:** transakce potřebují plyn v GHO, který mohou aplikace sponzorovat s limity
  frekvence. Pravidla feedů a skupin mohou vyžadovat držení tokenů nebo platby.
- **Provoz řetězce:** [L2BEAT](https://l2beat.com/scaling/projects/lens) hodnotí Lens Chain jako
  validium ve fázi Stage 0 s centralizovaným operátorem, který může odmítnout zařadit transakce.

## DeSo

[DeSo](https://docs.deso.org/) je blockchain vrstvy 1 vytvořený pro sociální aplikace. V červenci
2024 přešel z proof-of-work na proof-of-stake.

- **Na řetězci:** profily, příspěvky, lajky, sledování i přímé zprávy jsou transakce, které ukládá
  každý plný uzel. Obrázky a videa jsou hostované mimo řetězec; referenční uzel používá Google Cloud
  Storage a Cloudflare Stream.
- **Spam:** každá akce stojí poplatek v DESO. Noví uživatelé obvykle dostanou od některého uzlu
  startovní DESO po ověření telefonu.
- **Moderování:** každý uzel rozhoduje, co zobrazí, pomocí černých nebo šedých listin, ale
  [obsah zůstává na řetězci](https://docs.deso.org/deso-blockchain/content-moderation).
- **Komunity:** dokumentace nepopisuje žádné primitivum pro komunity ani fóra; „komunita“ je feed,
  který kurátoruje některá aplikace.
- **Provoz uzlu:** validátoři potřebují nejméně 32 GB RAM a 200 GB disku, podle
  [příručky pro validátory](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

[Steem](https://steem.com/) je sociální blockchain, který odměňuje autory a kurátory tokeny, a jeho
hlavní blogovací aplikací je [Steemit](https://steemit.com/). Hive se od Steemu oddělil v roce 2020;
podle [whitepaperu Hive](https://hive.io/whitepaper.pdf) k forku došlo po prodeji společnosti
Steemit Inc. Justinu Sunovi.

- **Na řetězci:** textové příspěvky, komentáře, hlasy a historie jejich úprav, které řadí 21
  volených svědků (witnesses), již vytvářejí blok každé tři sekundy. Obrázky jsou hostované mimo
  řetězec.
- **Spam:** akce spotřebovávají Resource Credits, které rostou se stakovaným STEEM. Založení účtu
  stojí STEEM; Steemit ho platí za uživatele, kteří si ověří e-mailovou adresu a telefonní číslo.
- **Komunity:** jsou to
  [vlastní operace interpretované indexerem](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  mimo konsensus. Moderátoři mohou příspěvky ztlumit, což je v aplikacích skryje, ale na řetězci je
  ponechá.
- **Odměny:** odměny financuje inflace a o jejich rozdělení rozhodují hlasy vážené stakem, takže
  velcí držitelé určují, co získá pozornost.

## Srovnání

| Otázka              | Lens                                                                              | DeSo                                                              | Steem                                                               | Bitsocial                                                                             |
| ------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Řetězec             | Vrstva 2 Etherea (validium na ZK Stacku)                                          | Vlastní vrstva 1, proof-of-stake                                  | Vlastní řetězec, delegovaný proof-of-stake                          | Žádný                                                                                 |
| Obsah příspěvků     | JSON mimo řetězec, obvykle na Grove                                               | Text na řetězci; média mimo něj                                   | Text na řetězci; obrázky mimo něj                                   | Na uzlu vlastníka komunity a u peerů, kteří ji čtou a seedují                         |
| Identita            | Účet jako chytrý kontrakt; uživatelská jména jako NFT                             | Pár klíčů s profilem na řetězci                                   | Pojmenovaný účet na řetězci s odstupňovanými klíči                  | Páry klíčů Ed25519 pro uživatele a komunity                                           |
| Komunity            | Skupiny a feedy jako kontrakty s pravidly                                         | Žádné primitivum pro komunity                                     | Komunity interpretované indexerem mimo konsensus                    | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                      |
| Ochrana proti spamu | Plyn (často sponzorovaný), pravidla s tokeny nebo platbami                        | Poplatek za každou akci; startovní prostředky po ověření telefonu | Resource Credits ze stake; placené zakládání účtů                   | Výzva dané komunity, než je příspěvek přijat                                          |
| Moderování          | Administrátoři skupin, pravidla na řetězci, skrývání na úrovni API                | Každý uzel filtruje, co zobrazí                                   | Ztlumení v komunitách, záporné hlasy vážené stakem, filtry aplikací | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                |
| Provoz              | Operátor řetězce plus Lens API a Grove                                            | Validátoři s nejméně 32 GB RAM                                    | Volení svědci plus uzly API a indexeru                              | Komunitní uzel na spotřebitelském hardwaru a pomocné seedery                          |
| Hlavní kompromis    | Programovatelná pravidla na řetězci, ale obsah a čtení závisejí na službách Lensu | Otevřený fond dat, ale každá akce stojí poplatek a zůstane navždy | Vestavěné odměny, ale stake určuje viditelnost i správu             | Žádné poplatky ani stake, ale chybí globální pořadí a starý obsah není zaručen navždy |
