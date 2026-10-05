---
title: Bitsocial a ActivityPub
description: Jak si Fediverse, s Mastodonem pro mikroblogování a Lemmy pro komunity ve stylu Redditu, stojí ve srovnání s peer-to-peer komunitami Bitsocialu.
---

# Bitsocial a ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) je standard W3C, na kterém stojí Fediverse.
Uživatelé si vyberou server, kterému se říká instance a který hostuje jejich účet, a servery si
příspěvky vyměňují mezi sebou. [Mastodon](https://joinmastodon.org/) je jeho nejznámější
mikroblogovací software; [Lemmy](https://join-lemmy.org/) je agregátor odkazů a fórum ve stylu
Redditu složené z tematických komunit, což z něj ve Fediverse dělá nejbližší obdobu aplikací
Bitsocial, jako je [Seedit](/apps/seedit/).

## Jak ActivityPub funguje

- **Doručené a odeslané.** Každý účet má schránku doručených (inbox) a odeslaných (outbox). Servery
  doručují aktivity do schránek doručených na jiných serverech a každý přijímající server si ukládá
  vlastní kopii toho, co sledují jeho uživatelé.
- **Identita patřící serveru.** ID účtů a příspěvků jsou HTTPS adresy na doméně původního serveru.
  Handle na Mastodonu má tvar `@user@domain`, překládá se přes WebFinger a server za uživatele
  podepisuje federační zprávy.
- **Klienti.** Aplikace a prohlížeče komunikují jen s vlastním serverem uživatele, a to přes API
  tohoto serveru.
- **Komunity v Lemmy.** Komunita je skupinový aktér hostovaný na jedné instanci. Uživatelé posílají
  příspěvky komunitě, která je znovu rozešle svým sledujícím; podle sdíleného standardu pro fóra
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) může
  komunita příspěvky nejdřív ověřit, a to až po ruční schvalování moderátory.
- **Moderování.** Moderování je místní pro každý server. Administrátoři mohou pozastavovat účty,
  blokovat celé servery nebo federovat jen se seznamem povolených; Lemmy má navíc moderátory pro
  každou komunitu.
- **Ochrana proti spamu.** ActivityPub nedefinuje žádný antispamový mechanismus. Mastodon a Lemmy
  hlídají registrace schvalováním, pozvánkami, otázkami v žádosti, captchami a ověřováním e-mailu a
  pak spoléhají na limity frekvence, nahlášení a moderování.

## V čem se liší

### Identita patří doméně

Účet ve Fediverse patří doméně svého serveru. Mastodon umí přesměrovat sledující na nový účet, ale
[příspěvky se nepřesouvají](https://docs.joinmastodon.org/user/moving/), přesun musí začít na starém
serveru a platí 30denní ochranná lhůta. U Bitsocialu jsou profily a komunity páry klíčů, takže změna
hostitele nebo aplikace identitu nemění. Viz
[Identita a vlastnictví komunit](/identity-and-ownership/).

### Kde komunita žije

Komunita v Lemmy má strukturálně blízko ke komunitě v Bitsocialu: příspěvky jdou do komunity, která
je může před dalším rozesláním zkontrolovat. Rozdíl je v tom, kde žije. Komunitu v Lemmy lze založit
jen na domovské instanci jejího zakladatele, administrátor instance nad ní má
[úplnou kontrolu](https://join-lemmy.org/docs/users/05-censorship-resistance.html) a neexistuje
žádný zdokumentovaný způsob, jak ji přesunout na jinou instanci. Komunita v Bitsocialu je samostatný
pár klíčů: vlastník může provozovat její uzel kdekoli a nad ní nestojí žádný administrátor serveru.

### Ochrana proti spamu

Servery ve Fediverse zastavují spam hlavně při registraci a moderují až potom. Komunita v Bitsocialu
spouští výzvu u každého příspěvku, než ho přijme, a každá komunita si volí vlastní: captchu, seznam
povolených, platbu nebo jakýkoli jiný kód. Viz [Vlastní antispamové výzvy](/custom-challenges/).

### Provoz infrastruktury

Provozovat instanci znamená mít stále běžící server s doménou, TLS a e-mailem. Mastodon navíc
potřebuje PostgreSQL, Redis a procesy na pozadí; Lemmy je lehčí, podle vlastních údajů zhruba 150 MB
RAM. Každá instance ukládá kopie vzdáleného obsahu, který sledují její uživatelé. Komunitní uzel
Bitsocialu nepotřebuje doménu ani certifikát a běží z desktopové aplikace nebo z `bitsocial-cli`.

### Co servery nabízejí na oplátku

Servery ve Fediverse uchovávají úplnou historii a spolehlivě ji poskytují a Mastodon má vyzrálé
moderační nástroje vybudované během let. Bitsocial nezaručuje, že starý obsah zůstane navždy, a jeho
moderační nástroje jsou v jednotlivých aplikacích.

## Srovnání

| Otázka                     | ActivityPub (Mastodon, Lemmy)                                                   | Bitsocial                                                              |
| -------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Kategorie                  | Federované servery                                                              | Peer-to-peer síť komunit                                               |
| Identita                   | Účet na doméně serveru, podepisovaný serverem                                   | Páry klíčů Ed25519 pro uživatele a komunity                            |
| Kde jsou příspěvky uloženy | Původní server a kopie na každém serveru, který je sleduje                      | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují               |
| Kdo to drží online         | Administrátoři instancí                                                         | Uzel vlastníka komunity a pomocné seedery                              |
| Komunity                   | Komunity v Lemmy hostované na jedné instanci                                    | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky       |
| Ochrana proti spamu        | Hlídání registrací, limity frekvence, nahlášení a moderování                    | Výzva dané komunity, než je příspěvek přijat                           |
| Moderování                 | Administrátoři serverů a moderátoři komunit, místně na každém serveru           | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí |
| Jména                      | Handly `@user@domain` a `!community@domain`                                     | Jména `.bso` a `.eth`, která se překládají na klíče                    |
| Prohlížeč                  | Klient vlastního serveru uživatele                                              | Peer-to-peer uzel v běžné záložce prohlížeče                           |
| Hlavní kompromis           | Spolehlivá historie a vyzrálé moderování, ale identita a komunity patří serveru | Není potřeba server ani doména, ale starý obsah není zaručen navždy    |
