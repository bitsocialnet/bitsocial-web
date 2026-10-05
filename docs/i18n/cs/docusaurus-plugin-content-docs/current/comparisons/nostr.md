---
title: Bitsocial a Nostr
description: Jak si model Nostru založený na relayích stojí ve srovnání s peer-to-peer komunitami Bitsocialu, od cesty dat a identity po skupiny, ochranu proti spamu a moderování.
---

# Bitsocial a Nostr

Nostr nezapadá čistě ani mezi federované, ani mezi blockchainové systémy. Účty uživatelům nevydávají
instance a není tu žádný řetězec, konsensus, poplatky za plyn ani globální pořadí. Nostr se lépe
popisuje jako **sociální médium založené na relayích**: uživatelé drží páry klíčů, podepisují
události a publikují je na relaye, což jsou obyčejné servery, které je ukládají a poskytují
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). Samotné
[README](https://github.com/nostr-protocol/nostr) Nostru uvádí, že nespoléhá na peer-to-peer
techniky.

V jednom důležitém ohledu to Nostr přibližuje k Bitsocialu víc než federované nebo blockchainové
systémy: identita je kryptografická a přenositelná. Rozdíly jsou v datové vrstvě a v tom, kdo hlídá
vstup.

## Jak Nostr funguje

- **Události a relaye.** Každý příspěvek, profil nebo reakce je podepsaná JSON událost. Klienti
  publikují události na relaye přes WebSockets a přihlašují se k jejich odběru s filtry; relaye
  události ukládají a znovu je poskytují. Relaye spolu navzájem nekomunikují.
- **Replikace.** Uživatelé obvykle publikují na více relayí. Studie 712 relayí z roku 2023 zjistila,
  že průměrný příspěvek se nacházel na 34,6 z nich
  ([Wei a Tyson](https://arxiv.org/abs/2402.05709)).
- **Hledání příspěvků určitého uživatele.** Uživatelé publikují seznam relayí, na které zapisují a
  ze kterých čtou ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), a klienti
  stahují příspěvky daného uživatele z jeho zapisovacích relayí.
- **Identita.** Každý uživatel je klíč secp256k1, který podepisuje podpisy Schnorr. Specifikace
  nedefinují žádnou rotaci ani obnovu klíčů, takže ztracený klíč znamená ztracený účet. Volitelné
  identifikátory `name@domain` ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md))
  se ověřují podle souboru na webovém serveru dané domény.
- **Skupiny.** Doporučeným mechanismem pro komunity jsou skupiny založené na relayích
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): relay hostuje skupinu, před
  přijetím příspěvku vynucuje její pravidla členství a publikování a podepisuje její metadata.
  Starší komunity schvalované moderátory
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) jsou nyní označeny jako
  nedoporučené ve prospěch NIP-29.
- **Ochrana proti spamu.** Každá relay si volí vlastní vstupní bránu: proof-of-work
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autentizaci a seznamy
  povolených ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), platbu nebo
  limity frekvence. Klienti přidávají seznamy ztlumených účtů a skóre důvěryhodnosti.
- **Média.** Obrázky a videa se nahrávají na samostatné souborové servery HTTP.

## V čem se liší

### Kdo příspěvky ukládá a poskytuje

U Nostru jsou relaye vrstvou pro ukládání i doručování: každý příspěvek musí udržovat online nějaký
server. U Bitsocialu HTTP routery klientům jen pomáhají najít peery. Neukládají příspěvky, profily,
metadata komunit ani stav moderování; klienti stahují obsah od uzlu komunity a od peerů, kteří ji
seedují. Viz [Protokol peer-to-peer](/peer-to-peer-protocol/).

### Kdo hlídá vstup

U Nostru patří brány pro zápis provozovatelům relayí. Mimo skupiny NIP-29 může klíč odmítnutý jednou
relayí publikovat stejnou událost na kteroukoli relay, která ji přijme, a to, co čtenáři uvidí,
závisí na tom, ze kterých relayí čte jejich klient. Skupina NIP-29 má ke komunitě v Bitsocialu blíž:
příspěvky přijímá, nebo odmítá relay, která ji hostuje. Relay ale stále určuje, co mohou role ve
skupině dělat, a historie skupiny zůstává vázaná na tuto relay, pokud s jejím převzetím nesouhlasí
jiná relay.

U Bitsocialu je komunita kryptografický objekt s vlastním párem klíčů. Uzel komunity spouští
jakoukoli výzvu, kterou zvolí vlastník, a publikuje přijatý stav do peer-to-peer sítě. Viz
[Vlastní antispamové výzvy](/custom-challenges/).

### Provoz infrastruktury

Relay je server s doménou a WebSocket endpointem a populární relaye nesou náklady na úložiště a
přenosovou kapacitu za to, co poskytují. Studie z roku 2023 odhadla, že zhruba 95 % bezplatných
relayí nedokáže pokrýt své náklady z darů. Komunitní uzel Bitsocialu běží na běžném spotřebitelském
hardwaru a peeři, kteří komunitu čtou, mohou pomáhat s jejím šířením.

### Prohlížeč

Webový klient Nostru otevírá WebSocket spojení přímo s relayemi, takže není potřeba žádný aplikační
server. Webová aplikace Bitsocial provozuje peer-to-peer uzel přímo v záložce a stahuje obsah od
peerů. Viz [Peer-to-Peer v prohlížeči](/browser-p2p/).

### Starý obsah

Příspěvky na Nostru jsou široce replikované napříč relayemi, což pomáhá starým příspěvkům přežít.
Bitsocial uchovává nejnovější stav komunity a nezaručuje, že starý obsah zůstane navždy.

## Srovnání

| Otázka                     | Nostr                                                                                           | Bitsocial                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Kategorie                  | Protokol založený na relayích                                                                   | Peer-to-peer síť komunit                                               |
| Identita                   | Uživatelský klíč secp256k1, ve specifikacích bez rotace                                         | Páry klíčů Ed25519 pro uživatele a komunity                            |
| Kde jsou příspěvky uloženy | Relaye zvolené autorem, často mnoho                                                             | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují               |
| Kdo to drží online         | Provozovatelé relayí                                                                            | Uzel vlastníka komunity a pomocné seedery                              |
| Komunity                   | Skupiny hostované na relayích (NIP-29)                                                          | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky       |
| Ochrana proti spamu        | Pravidla každé relaye: proof-of-work, autentizace, platba, seznamy povolených, limity frekvence | Výzva dané komunity, než je příspěvek přijat                           |
| Moderování                 | Pravidla relayí, seznamy ztlumených účtů v klientech, štítky a nahlášení                        | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí |
| Jména                      | Volitelné identifikátory `name@domain` ověřované přes HTTPS                                     | Jména `.bso` a `.eth`, která se překládají na klíče                    |
| Prohlížeč                  | WebSocket klient relayí                                                                         | Peer-to-peer uzel v běžné záložce prohlížeče                           |
| Hlavní kompromis           | Přenositelná identita a široká replikace, ale dostupnost a pravidla závislé na relayích         | Menší závislost na relayích, ale starý obsah není zaručen navždy       |
