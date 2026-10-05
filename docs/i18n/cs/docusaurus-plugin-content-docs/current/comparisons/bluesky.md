---
title: Bitsocial a Bluesky
description: Jak si Bluesky a AT Protocol se svými osobními datovými servery, relayemi a službami AppView stojí ve srovnání s peer-to-peer komunitami Bitsocialu.
---

# Bitsocial a Bluesky

[Bluesky](https://bsky.app/) je mikroblogovací aplikace postavená na protokolu
[AT Protocol](https://atproto.com/), který navrhla společnost Bluesky Social PBC. Protokol rozděluje
sociální síť na samostatné služby: osobní datové servery hostují účty, relaye je slučují do jednoho
proudu a služby AppView tento proud indexují do časových os a vláken, která lidé vidí. Jeho
dokumentace popisuje data účtů jako uložená na hostitelských serverech, „na rozdíl od modelu
peer-to-peer“ ([přehled](https://atproto.com/guides/overview)).

## Jak AT Protocol funguje

- **Repozitáře na serverech.** Každý příspěvek, lajk nebo sledování je záznam v podepsaném
  repozitáři autora, hostovaném na osobním datovém serveru (PDS). Výchozí servery provozuje Bluesky
  a kdokoli může hostovat vlastní.
- **Relaye.** Relaye odebírají data z každého PDS a znovu vysílají změny jako jeden proud, takzvaný
  firehose. Od aktualizace protokolu v roce 2025 už nearchivují každý repozitář, díky čemuž je
  jejich provoz mnohem levnější ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppView.** AppView indexuje celý firehose a poskytuje časové osy, úplná vlákna odpovědí, počty a
  vyhledávání. Je to část sítě nejnáročnější na zdroje.
- **Identita.** Účet je DID: obvykle `did:plc`, registrovaný v jednom globálním adresáři, nebo
  `did:web`, vázaný na doménu. Dokument DID uvádí handle účtu, podpisový klíč a aktuální server.
  Podpisový klíč drží PDS; `did:plc` navíc uživatelům umožňuje držet rotační klíče, aby se mohli
  přestěhovat bez pomoci původního hostitele
  ([průvodce identitou](https://atproto.com/guides/identity)).
- **Handly.** Handly jsou jména DNS, například `alice.bsky.social` nebo doména, kterou uživatel
  vlastní, a ověřují se vůči DID.
- **Moderování.** Hostování a dosah jsou oddělené vrstvy. Kdokoli může provozovat označovací službu
  (labeler) a uživatelé jich mohou kombinovat více
  ([průvodce moderováním](https://atproto.com/guides/moderation)), aplikace Bluesky ale vždy
  uplatňuje vlastní moderování Bluesky. Autoři mohou omezit, kdo smí na jejich příspěvky odpovídat,
  a skrývat odpovědi.

## V čem se liší

### Servery, nebo peeři

Data Bluesky žijí na serverech: PDS hostuje každý účet, relaye přenášejí firehose a služby AppView
poskytují to, co klienti zobrazují. Prohlížeč je HTTP klientem těchto služeb, nikdy peerem. U
Bitsocialu obsah poskytuje uzel komunity a peeři, kteří ji čtou, a webová aplikace může provozovat
vlastní peer-to-peer uzel. Viz [Peer-to-Peer v prohlížeči](/browser-p2p/).

### Globální pohled, nebo komunity

AT Protocol je navržen pro jeden globální pohled: AppView vidí každou odpověď, takže vlákna i
vyhledávání jsou úplné. Bitsocial nemá žádný globální index; každá komunita publikuje svůj vlastní
stav a aplikace nad tím stavějí objevování obsahu. Viz [Objevování obsahu](/content-discovery/).

Bluesky dnes pro veřejné příspěvky nemá žádný objekt komunity. V červnu 2026
[oznámilo nativní komunity](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k), v nichž je
na některých úrovních soukromí publikování podmíněno schválením; do října 2026 nebyly spuštěny. U
Bitsocialu jsou komunity základním objektem a příspěvky přijímá, nebo odmítá uzel komunity.

### Ochrana proti spamu

Bluesky řeší spam limity frekvence na svých serverech, omezeními nových hostitelů na úrovni relaye,
automatickou detekcí, lidskou kontrolou a štítky a autoři mohou omezit odpovědi. Neexistuje žádná
brána na úrovni komunity, která by rozhodovala, čím musí příspěvek projít, než je přijat. U
Bitsocialu si každá komunita volí vlastní výzvu. Viz
[Vlastní antispamové výzvy](/custom-challenges/).

### Kdo drží klíče

Účty na vlastních serverech Bluesky se přihlašují heslem a tyto servery drží jejich podpisové klíče
v úschově ([Kleppmann a kol.](https://arxiv.org/abs/2402.03239)). Podle jednoho z protokolových
inženýrů Bluesky
[většina účtů nemá žádné nezávisle kontrolované rotační klíče](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Identita v Bitsocialu je pár klíčů, který vygeneruje a drží aplikace uživatele.

### Provoz infrastruktury

Osobní server je levný: [referenční PDS](https://github.com/bluesky-social/pds) doporučuje 1 GB RAM
pro nejvýše 20 uživatelů. Nezávislý AppView pro celou síť je velký projekt; jeden postavený v roce
2025 [stál zhruba 200 dolarů měsíčně](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), většinou za 16
TB úložiště. Bitsocial nemá žádný globální index, který by bylo nutné replikovat, a komunitní uzel
běží na běžném spotřebitelském hardwaru.

## Srovnání

| Otázka                     | Bluesky (AT Protocol)                                                                | Bitsocial                                                              |
| -------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Kategorie                  | Federované servery s globálním indexem                                               | Peer-to-peer síť komunit                                               |
| Identita                   | DID, podpisové klíče obvykle drží server                                             | Páry klíčů Ed25519 pro uživatele a komunity                            |
| Kde jsou příspěvky uloženy | Repozitář autora na osobním datovém serveru                                          | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují               |
| Kdo to drží online         | Hostitelé PDS, relaye a služby AppView, ve výchozím stavu provozované Bluesky        | Uzel vlastníka komunity a pomocné seedery                              |
| Komunity                   | Pro veřejné příspěvky zatím žádné (oznámeny v roce 2026)                             | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky       |
| Ochrana proti spamu        | Limity frekvence na serverech, automatická detekce, štítky, kontrola odpovědí        | Výzva dané komunity, než je příspěvek přijat                           |
| Moderování                 | Kombinovatelné označovací služby; aplikace Bluesky vždy uplatňuje moderování Bluesky | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí |
| Jména                      | DNS handly ověřované vůči DID                                                        | Jména `.bso` a `.eth`, která se překládají na klíče                    |
| Prohlížeč                  | HTTP klient PDS a AppView                                                            | Peer-to-peer uzel v běžné záložce prohlížeče                           |
| Hlavní kompromis           | Úplná globální vlákna a vyhledávání, ale agregace vyžaduje výkonné servery           | Žádný těžký globální index, ale ani úplný pohled na celou síť          |
