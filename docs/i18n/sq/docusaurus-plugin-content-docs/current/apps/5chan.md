---
title: 5chan
description: Një tabelë imazhi pa server dhe e decentralizuar e ndërtuar në protokollin Bitsocial ku çdokush mund të krijojë dhe të zotërojë tabela.
sidebar_position: 1
---

:::warning[Emërtimi i trashëguar]
Baza e kodeve të këtij projekti ende përdor emërtimin e trashëguar "plebbit" përpara riemërtimit Bitsocial. Emrat e paketave, referencat e API-së dhe disa terminologji të brendshme do të përditësohen në një version të ardhshëm. Funksionaliteti i përshkruar këtu është aktual - vetëm emërtimi është i vjetëruar.
:::

# 5chan

5chan është një tabelë imazhi pa server, pa administrim dhe plotësisht e decentralizuar që funksionon në protokollin Bitsocial. Ai ndjek strukturën e njohur të drejtorisë së imazhit ndërsa prezanton pronësinë e decentralizuar – çdokush mund të krijojë një tabelë dhe borde të shumta mund të konkurrojnë për të njëjtin vend të drejtorisë përmes një mekanizmi votimi.

## Shkarkimet

| Platforma | Lidhje                                    |
| --------- | ----------------------------------------- |
| Web       | [5chan.app](https://5chan.app)            |
| Desktop   | Në dispozicion për Mac, Windows dhe Linux |
| Celular   | Në dispozicion për Android                |

## Si funksionojnë bordet

5chan organizon përmbajtjen në tabela duke përdorur një paraqitje klasike të drejtorive (p.sh., `/b/`, `/g/`). Ndryshe nga tabelat tradicionale të imazheve ku një administrator qendror kontrollon çdo tabelë, 5chan lejon çdo përdorues të krijojë dhe të zotërojë plotësisht bordin e tij. Kur bordet e shumta synojnë të njëjtin vend të drejtorisë, ata konkurrojnë për atë pozicion përmes votimit.

### Krijimi i një bordi

Për të krijuar një tabelë të re, duhet të ekzekutoni `bitsocial-cli` si një nyje peer-to-peer. Kjo siguron që bordi juaj të organizohet në një mënyrë të decentralizuar pa u mbështetur në ndonjë server qendror.

### Detyrat e drejtorisë

Caktimet e sloteve të drejtorisë (cila tabelë shfaqet në cilën shteg) menaxhohen aktualisht përmes kërkesave për tërheqje të GitHub në skedarin `5chan-directories.json`. Ky është një proces i përkohshëm - publikimet e ardhshme do të mbështesin krijimin e bordit brenda aplikacionit dhe votimin e bazuar në pub-e për të trajtuar automatikisht detyrat e drejtorive.

## Të brendshmet

Nën kapuçin, 5chan përdor shtresën e përbashkët të klientit të protokollit Bitsocial për ndërveprimet e tij në rrjet. Aplikacioni ueb në 5chan.app mund të ekzekutojë gjithashtu një nyje Helia në shfletues kur shfletuesi P2P aktivizohet nga Cilësimet e Avancuara, kështu që lexuesit mund të ngarkojnë nga kolegët pa një portë të centralizuar IPFS. Shihni seksionin P2P të shfletuesit në shënimet e protokollit peer-to-peer.

## Lidhjet

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licenca**: GPL-2.0-vetëm
