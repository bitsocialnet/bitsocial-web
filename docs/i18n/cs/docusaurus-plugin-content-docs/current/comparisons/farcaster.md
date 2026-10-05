---
title: Bitsocial a Farcaster
description: Jak si Farcaster s účty na blockchainu, nájmem úložiště a sítí validátorů Snapchain stojí ve srovnání s peer-to-peer komunitami Bitsocialu.
---

# Bitsocial a Farcaster

[Farcaster](https://docs.farcaster.xyz/) drží identitu na blockchainu a sociální data mimo něj.
Účty, aplikační klíče a platby za úložiště žijí v kontraktech na OP Mainnet, vrstvě 2 Etherea.
Příspěvky, kterým se říká casty, spolu se sledováními a reakcemi jsou podepsané zprávy, které ukládá
[Snapchain](https://snapchain.farcaster.xyz/), síť podobná blockchainu, jež v roce 2025 nahradila
dřívější síť Hubů Farcasteru.

## Jak Farcaster funguje

- **Účty.** Účet je číselné Farcaster ID, které vlastní adresa na Ethereu; ta může nastavit i adresu
  pro obnovu. Aplikace publikují pomocí delegovaných aplikačních klíčů registrovaných na
  blockchainu; aplikační klíč nemůže účet převzít.
- **Nájem úložiště.** Každý účet si pronajímá jednotky úložiště, v současnosti za 0,20 dolaru za
  jednotku a rok. Jednotka pronajatá od července 2025 pojme 100 castů; nad tento limit se nejstarší
  casty odmazávají. Limity frekvence rostou s pronajatým úložištěm.
- **Snapchain.** Validátoři řadí zprávy do bloků konsensem ve stylu Tendermintu a každý plný uzel
  uchovává data celé sítě. Uzly potřebují zhruba 16 GB RAM a 2 TB úložiště, podle
  [příručky k uzlu](https://snapchain.farcaster.xyz/getting-started).
- **Jména.** Výchozí uživatelská jména, kterým se říká fnames, jsou zdarma a vydává je vlastní
  jmenný server Farcasteru, který
  [je může odebrat](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Uživatelé mohou
  místo nich používat jméno `.eth` registrované na Ethereu.
- **Kanály.** Tematické kanály jsou experimentální funkcí klienta Farcaster. Casty v kanálu jsou
  data protokolu, ale metadata kanálu, jeho sledování a moderování jsou
  [uložena v klientovi](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Čtení.** Aplikace čtou přes uzel Snapchain, který provozují samy, nebo přes spravovaného
  poskytovatele, obvykle Neynar.

## V čem se liší

### Blockchainy a validátoři

Farcaster závisí na OP Mainnet kvůli účtům a platbám a na Snapchainu, síti podobné blockchainu,
kvůli řazení všech sociálních dat. Do sady validátorů Snapchainu se lze dostat jen se svolením. Jeho
whitepaper uvádí, že cenzura se stává obtížnou zhruba při deseti globálně rozmístěných validátorech;
v říjnu 2026 byl jeho [seznam validátorů](https://snapchain.farcaster.xyz/validators) menší a
většina klíčů patřila firmě Neynar, která
[Farcaster koupila](https://neynar.com/blog/neynar-is-acquiring-farcaster) v lednu 2026. Bitsocial
nemá žádný řetězec, validátory ani konsensus.

### Placení za publikování

Každý účet na Farcasteru platí nájem za úložiště a úložiště určuje, kolik z historie účtu síť
uchová. U Bitsocialu publikování na úrovni protokolu nic nestojí; každá komunita rozhoduje, zda
vyžaduje captchu, platbu, token nebo něco jiného. Viz
[Vlastní antispamové výzvy](/custom-challenges/).

### Komunity

Kanály na Farcasteru jsou funkcí klienta: klient ukládá jejich metadata a vynucuje moderování
kanálu, takže cast zablokovaný v kanálu může v síti zůstat platný a viditelný v jiných aplikacích. U
Bitsocialu jsou komunity objekty protokolu s vlastním párem klíčů a příspěvky přijímá, nebo odmítá
uzel komunity.

### Provoz infrastruktury

Uzel Farcasteru drží celou síť, takže jeho úložiště roste s veškerou aktivitou; Farcaster počítá s
růstem až k největším cloudovým diskům. Komunitní uzel Bitsocialu drží jen své vlastní komunity a
běží na běžném spotřebitelském hardwaru.

### Prohlížeč

Aplikace Farcasteru v prohlížeči je HTTP klientem uzlu nebo poskytovatele. Webová aplikace Bitsocial
může provozovat peer-to-peer uzel přímo v záložce. Viz [Peer-to-Peer v prohlížeči](/browser-p2p/).

## Srovnání

| Otázka                     | Farcaster                                                                          | Bitsocial                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Kategorie                  | Identita na blockchainu se sociálními daty řazenými validátory                     | Peer-to-peer síť komunit                                                                     |
| Identita                   | Farcaster ID vlastněné adresou na Ethereu, s delegovanými aplikačními klíči        | Páry klíčů Ed25519 pro uživatele a komunity                                                  |
| Kde jsou příspěvky uloženy | Snapchain, replikovaný na každém plném uzlu, v mezích zaplaceného úložiště         | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                                     |
| Kdo to drží online         | Validátoři Snapchainu a provozovatelé uzlů                                         | Uzel vlastníka komunity a pomocné seedery                                                    |
| Komunity                   | Experimentální kanály spravované klientem Farcaster                                | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                             |
| Ochrana proti spamu        | Nájem úložiště a limity frekvence, plus spamové štítky na úrovni aplikací          | Výzva dané komunity, než je příspěvek přijat                                                 |
| Moderování                 | Hostitelé kanálů v klientovi, filtry aplikací, riziko cenzury na úrovni validátorů | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí                       |
| Jména                      | Bezplatná fnames, která může Farcaster odebrat, nebo jména `.eth`                  | Jména `.bso` a `.eth`, která se překládají na klíče                                          |
| Prohlížeč                  | HTTP klient uzlu nebo poskytovatele                                                | Peer-to-peer uzel v běžné záložce prohlížeče                                                 |
| Hlavní kompromis           | Jedna konzistentní globální datová sada, ale nájem, řetězce a malá sada validátorů | Žádné poplatky ani řetězce, ale chybí globální datová sada a starý obsah není zaručen navždy |
