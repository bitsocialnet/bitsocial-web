---
title: Bitsocial a Lapis Net
description: Jak si Lapis Net, peer-to-peer sociální protokol napsaný v Kotlinu se skóre důvěry pro každého čtenáře a viditelností krytou Bitcoinem, stojí ve srovnání s Bitsocialem.
---

# Bitsocial a Lapis Net

[Lapis Net](https://net.lapisproject.dev/) je protokol peer-to-peer sociální sítě napsaný v Kotlinu
pro JVM. Nezávisle dospěl k základům blízkým Bitsocialu: identitám založeným na párech klíčů,
ukládání obsahu ve stylu IPFS a gossipsubu z libp2p. Oba projekty se liší v tom, kam umisťují
filtrování spamu a kurátorství obsahu. Lapis dává každému čtenáři osobní graf důvěry a umožňuje, aby
platby v Bitcoinu a Lightningu zvyšovaly viditelnost; Bitsocial nechává na každé komunitě, co se v
ní smí publikovat.

Lapis je funkční prototyp. V říjnu 2026 ještě neměl veřejnou síť a propojení dvou uzlů byl ruční
krok, jak uvádí jeho [repozitář](https://github.com/lapisproject-dev/Lapis-Net).

## Jak Lapis funguje

- **Identity.** Každá identita je pár klíčů secp256k1 kompatibilní s klíči Bitcoinu, ke kterému je
  pro peer ID v libp2p navázán klíč Ed25519.
- **Ukládání a šíření.** Obsah se ukládá pomocí Nabu, implementace IPFS nad libp2p (DHT a Bitswap),
  a šíří se přes gossipsub z libp2p.
- **Skórování.** Nad jádrem, které zůstává vůči kurátorství obsahu neutrální, stojí čtyři volitelná
  skóre:
  - Veritas, síť důvěry počítaná z vlastního grafu důvěry každého čtenáře
  - Virtus, viditelnost krytá doklady o platbách na blockchainu nebo přes Lightning, jejichž účinek
    časem slábne
  - Karma, bezplatné lajky vážené podle Veritas
  - Madli, skóre reputace, které si uzly vedou o chování ostatních uzlů
- **Zprávy.** Součástí projektu jsou koncově šifrované přímé zprávy, hlasové hovory mezi dvěma lidmi
  a asynchronní systém zpráv podobný e-mailu.
- **Klienti.** Každý uživatel provozuje uzel JVM. Referenčním klientem je webové rozhraní, které
  poskytuje tento místní uzel.

## V čem se liší

### Kdo filtruje spam

Lapis filtruje u čtenáře. Obsah se šíří a teprve pak o tom, co se dostane na povrch, rozhoduje graf
důvěry každého čtenáře a platební pravidla aplikace, kterou používá. Bitsocial filtruje u komunity:
příspěvek musí projít výzvou komunity, než ho uzel komunity přijme, takže odmítnutý spam se nikdy
nestane součástí komunity. Viz [Vlastní antispamové výzvy](/custom-challenges/).

### Kdo má moc

V Lapisu každý čtenář rozhoduje, komu důvěřuje, a provozovatel každé aplikace rozhoduje, jak v ní
funguje placená viditelnost. V Bitsocialu vlastník komunity nastavuje pravidla jen pro tuto jednu
komunitu a aplikace si volí, co zobrazí. Ani jeden z nich nemá administrátora na úrovni protokolu.

### Ekonomika

Lapis zabudovává doklady o platbách v Bitcoinu a Lightningu do svého skóre viditelnosti. Bitsocial
nemá v protokolu žádnou platební vrstvu; komunita může prostřednictvím své výzvy vyžadovat platbu
nebo token.

### Prohlížeč

Aplikace Bitsocial mohou provozovat peer-to-peer uzel přímo v běžné záložce prohlížeče. Viz
[Peer-to-Peer v prohlížeči](/browser-p2p/). Rozhraní Lapisu v prohlížeči je místní stránka, kterou
poskytuje uživatelův uzel JVM.

### Rozsah

Lapis zahrnuje přímé zprávy, hlasové hovory a poštu. Bitsocial se soustředí na veřejné komunity a
nativní přímé zprávy zatím nemá.

## Srovnání

| Otázka                     | Lapis Net                                                                                   | Bitsocial                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Kategorie                  | Peer-to-peer sociální protokol (prototyp)                                                   | Peer-to-peer síť komunit                                                           |
| Identita                   | Pár klíčů secp256k1 s navázaným peer ID Ed25519                                             | Páry klíčů Ed25519 pro uživatele a komunity                                        |
| Kde jsou příspěvky uloženy | Úložiště Nabu (IPFS nad libp2p) na zúčastněných uzlech                                      | Uzel vlastníka komunity a peeři, kteří ji čtou a seedují                           |
| Komunity                   | Žádný objekt komunity; kurátorství probíhá pro každého čtenáře a v každé aplikaci zvlášť    | Plnohodnotné objekty, jejichž uzel přijímá nebo odmítá příspěvky                   |
| Ochrana proti spamu        | Graf důvěry čtenáře, placená viditelnost, zálohy v Lightningu za první zprávy               | Výzva dané komunity, než je příspěvek přijat                                       |
| Moderování                 | Graf důvěry každého čtenáře; provozovatelé aplikací nastavují pravidla placené viditelnosti | Vlastníci komunit moderují svou komunitu; aplikace si volí, co zobrazí             |
| Ekonomika                  | Doklady o platbách v Bitcoinu a Lightningu ve skórování                                     | V protokolu žádná; výzva může vyžadovat platbu nebo token                          |
| Prohlížeč                  | Místní webové rozhraní poskytované uzlem JVM                                                | Peer-to-peer uzel v běžné záložce prohlížeče                                       |
| Síť                        | Prototyp bez veřejné sítě                                                                   | Živá síť s aplikacemi jako [5chan](/apps/5chan/) a [Seedit](/apps/seedit/)         |
| Hlavní kompromis           | Bohatá vestavěná reputace a zprávy, ale zatím bez veřejné sítě                              | Menší jádro, které běží v prohlížečích, ale bez vestavěné reputace a přímých zpráv |

## Mohly by spolupracovat?

Výzvy Bitsocialu mohou být libovolný kód, takže jednou z nich by se mohlo stát i skóre důvěry ve
stylu Lapisu. Vestavěná výzva `whitelist` už umí načítat seznamy povolených adres z URL. Služba,
která by publikovala adresy Bitsocialu, jimž důvěřuje graf Veritas, by mohla těmto autorům umožnit
přeskočit CAPTCHA v některé komunitě. Bylo by k tomu potřeba propojit identitu v Lapisu s adresou v
Bitsocialu, a nic takového dnes neexistuje.
