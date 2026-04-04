---
title: Voucher Challenge
description: Sfida anti-spam që boton pas kodeve unike të kuponëve të shpërndarë nga pronarët e komunitetit.
sidebar_position: 3
---

# Voucher Challenge

Sfida e kuponit është një mekanizëm anti-spam që mbulon publikimin e përmbajtjes pas kodeve unike të kuponëve. Në vend që të mbështetet në zbulimin e automatizuar, ai e zhvendos besimin te pronari i komunitetit, i cili shpërndan manualisht kodet te njerëzit që u besojnë.

**Kodi burimor:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Si funksionon

1. Një pronar i komunitetit gjeneron një ose më shumë kode unike kupon.
2. Pronari ua shpërndan ato kode autorëve të besuar përmes një kanali të zgjedhur prej tyre (mesazh direkt, email, personalisht, etj.).
3. Kur një autor përpiqet të publikojë, sistemi sfidues i kërkon një kod kupon.
4. Kodi është vërtetuar -- nëse është i vërtetë dhe nuk është përdorur tashmë, publikimi pranohet.

Çdo kod kupon është i lidhur me një autor specifik pasi të jetë shlyer, duke parandaluar ripërdorimin nga të tjerët.

## Kur ta përdorni

Sfida e kuponit është më e përshtatshme për:

- **Komunitetet vetëm me ftesa** ku anëtarësimi është i kufizuar qëllimisht.
- **Hapësira të kuruara** ku pronari kontrollon personalisht çdo pjesëmarrës.
- **Mjedise me besim të lartë ** ku vlerësimi i automatizuar i postës së padëshiruar është i panevojshëm ose i padëshirueshëm.

Për shkak se kërkon shpërndarje manuale të kodit, ai nuk shtrihet në komunitete të mëdha të hapura. Për ata skenarë, merrni parasysh [Spam Blocker](./spam-blocker.md) ose [EVM Contract Call Challenge](./evm-contract-call.md).

## Integrimi

Sfida e kuponit futet në të njëjtën ndërfaqe sfiduese të përdorur nga paketa të tjera anti-spam në ekosistemin Bitsocial. Pronarët e komunitetit e mundësojnë atë përmes cilësimeve të komunitetit të tyre dhe sfida u paraqitet autorëve automatikisht kur ata përpiqen të postojnë.
