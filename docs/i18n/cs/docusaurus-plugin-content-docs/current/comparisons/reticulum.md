---
title: Bitsocial a Reticulum
description: Jak si Reticulum, kryptografický síťový stack pro LoRa a další linky s nízkou propustností, stojí ve srovnání s Bitsocialem a zda by nad ním Bitsocial mohl běžet.
---

# Bitsocial a Reticulum

[Reticulum](https://reticulum.network/) je síťový stack založený na kryptografii, který umožňuje
budovat sítě nad jakýmikoli dostupnými přenosovými médii: rádii LoRa, paketovým rádiem, sériovými
linkami, Wi-Fi, Ethernetem, TCP, UDP nebo I2P. Často se o něm mluví v souvislosti s Bitsocialem,
protože oba se zbavují firmy jako prostředníka. Dělají to ale na různých vrstvách, takže se spíš
doplňují, než aby si konkurovaly.

## Různé vrstvy

Reticulum nahrazuje síťovou vrstvu. Aplikacím poskytuje šifrované, směrovatelné koncové body bez
IP adres, DNS, certifikačních autorit a účtů a je navrženo tak, aby fungovalo i na linkách
s rychlostí pouhých 5 bitů za sekundu a s MTU 500 bajtů. Příspěvky, komunity ani moderování
nedefinuje; ty doplňují aplikace postavené nad ním.

Bitsocial je sociální protokol. Běží na stacku IPFS/libp2p přes běžná internetová připojení, a to
i ze záložky prohlížeče, a definuje komunity, publikace a antispamové výzvy jednotlivých komunit.
Viz [Protokol peer-to-peer](/peer-to-peer-protocol/) a
[Peer-to-Peer v prohlížeči](/browser-p2p/).

Ve stacku Bitsocialu by Reticulum stálo zhruba tam, kde dnes stojí libp2p, nikoli tam, kde stojí
protokol Bitsocial.

## Jak Reticulum funguje

- **Identity.** Identita v síti Reticulum je 512bitová sada klíčů: klíč X25519 pro šifrování
  a klíč Ed25519 pro podpisy.
- **Destinace.** Aplikace vytvářejí destinace, jejichž adresou je hash SHA-256 zkrácený na
  16 bajtů. Pakety nenesou žádnou zdrojovou adresu.
- **Oznámení.** Destinace se stane dosažitelnou tím, že odešle oznámení (announce). Transportní
  uzly ho přeposílají a pamatují si další skok zpět, takže žádný uzel nepotřebuje mapu celé sítě.
- **Šifrování.** Provoz je ve výchozím stavu šifrovaný, s efemérními klíči a dopřednou bezpečností.
- **LXMF.** Vrstva pro zasílání zpráv [LXMF](https://github.com/markqvist/LXMF) přidává podepsané
  zprávy, přímé doručení a pro příjemce, kteří jsou offline, také ukládání a přeposílání
  (store-and-forward) přes propagační uzly.

Mezi aplikace postavené tímto způsobem patří [Sideband](https://github.com/markqvist/Sideband) pro
zasílání zpráv a [Nomad Network](https://github.com/markqvist/NomadNet) pro zprávy a hostované
stránky. Příručka Reticulum vede [seznam programů](https://reticulum.network/manual/software.html).

## Srovnání

| Otázka              | Reticulum                                                                                                           | Bitsocial                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Co to je            | Síťový stack                                                                                                        | Peer-to-peer sociální protokol a aplikace                                                    |
| Určeno pro          | Jakékoli přenosové médium, až po pomalé rádiové linky                                                               | Internetová připojení včetně záložek prohlížeče                                              |
| Identita            | Sada klíčů X25519 a Ed25519                                                                                         | Páry klíčů Ed25519 pro uživatele a komunity                                                  |
| Adresy              | Hash identity a názvu aplikace                                                                                      | Hash veřejného klíče komunity                                                                |
| Nalezení peeru      | Oznámení šířená transportními uzly                                                                                  | HTTP routery vracejí poskytující peery                                                       |
| Sociální funkce     | Doplňují je aplikace jako Nomad Network                                                                             | Komunity, příspěvky, odpovědi a moderování přímo v protokolu                                 |
| Ochrana proti spamu | Limity frekvence oznámení pro každé rozhraní; razítka proof-of-work v LXMF, která může příjemce nebo uzel vyžadovat | Výzva dané komunity, než je příspěvek přijat                                                 |
| Doručení offline    | Propagační uzly LXMF ukládají a přeposílají zprávy                                                                  | Peeři dál poskytují nejnovější stav komunity; publikování vyžaduje, aby byl její uzel online |

## Mohl by Bitsocial běžet přes Reticulum?

Dnes ne. Bitsocial nemá žádný transport pro Reticulum a jeho datový model počítá s propustností
internetu: klient stahuje od peerů metadata komunit a obsah příspěvků a vyměňuje si zprávy pubsub,
což se špatně hodí na linky postavené kolem 500bajtových paketů s propustností měřenou v bitech
nebo kilobitech za sekundu.

Realistická cesta je užší: klient, který v odpojeném stavu funguje přes lokální mesh síť a se
širší sítí Bitsocial se synchronizuje, jakmile je dosažitelný peer nebo gateway s přístupem
k internetu. Šlo by o nového klienta a most, nikoli o změnu protokolu, a v současné roadmapě to
není.

## Pro vývojáře

Reticulum je zveřejněno pod [licencí Reticulum](https://reticulum.network/manual/license.html):
jde o podmínky ve stylu MIT plus dvě omezení. Software se nesmí používat v systémech navržených
k ubližování lidem ani při vytváření trénovacích datových sad pro AI nebo strojové učení. Než do
aplikace Bitsocial začleníte kód Reticulum, přečtěte si licenci.

Referenční implementace je [napsaná v Pythonu](https://github.com/markqvist/Reticulum). Správci
projektu Reticulum varují, že několik neoficiálních portů Reticulum a LXMF bylo vygenerováno
strojově a uvádí licenční nároky, které považují za neplatné, a proto dávejte přednost referenční
implementaci nebo programům uvedeným v příručce.
