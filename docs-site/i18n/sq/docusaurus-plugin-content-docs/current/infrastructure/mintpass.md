---
title: Mintpass
description: Sistemi i vërtetimit i bazuar në NFT që ndihmon komunitetet Bitsocial të verifikojnë përdoruesit dhe të reduktojnë sulmet e sybilit.
sidebar_position: 2
---

# Mintpass

Mintpass është një sistem vërtetimi i bazuar në NFT për komunitetet Bitsocial. Përdoruesit krijojnë një NFT verifikimi të patransferueshëm pas përfundimit të një sfide (siç është SMS OTP) dhe komunitetet mund të kontrollojnë pronësinë e NFT-së për t'u mbrojtur nga sulmet e sybileve si votat e rreme, ndalimi i evazionit dhe posta e padëshiruar.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licenca**: MIT

## Si funksionon

Rrjedha e verifikimit ka katër hapa:

1. **Kërkesë** -- Përdoruesi viziton `mintpass.org/request` për të filluar procesin.
2. **Sfida** -- Përdoruesi plotëson një verifikim SMS me një fjalëkalim një herë.
3. **Mint** -- Pas verifikimit të suksesshëm, një NFT e patransferueshme futet në portofolin e përdoruesit.
4. **Verifiko** -- Komunitetet kërkojnë pronësinë e NFT-së për të konfirmuar se përdoruesi është verifikuar.

Për shkak se NFT është e patransferueshme, ajo qëndron e lidhur me portofolin që ka përfunduar verifikimin, duke i penguar përdoruesit të tregtojnë ose shesin statusin e tyre të verifikuar.

## Struktura e projektit

Depoja është e organizuar në tre fusha kryesore:

| Drejtori     | Qëllimi                                                    |
| ------------ | ---------------------------------------------------------- |
| `contracts/` | Kontratat inteligjente të soliditetit për verifikimin NFT. |
| `challenge/` | Shtresa e integrimit për sistemin e sfidave Bitsocial.     |
| `web/`       | Next.js dhe React frontend për rrjedhën e prerjes.         |

## Privatësia dhe Trajtimi i të Dhënave

Mintpass merr një qasje me të dhëna minimale:

- **Të dhënat operative** (kodet OTP, shenjat e sesionit) ruhen në Redis me TTL të shkurtra dhe skadojnë automatikisht.
- **Asociacioni Mint** (lidhja midis një identiteti të verifikuar dhe një portofol) është i vetmi regjistrim i vazhdueshëm.

Asnjë numër telefoni ose detaje personale nuk ruhen pas mbylljes së dritares së verifikimit.

## Shtresat opsionale të sigurisë

Operatorët e komunitetit mund të mundësojnë mbrojtje shtesë në varësi të modelit të tyre të kërcënimit:

- **Kontrollet e reputacionit të IP-së** -- Shënoni kërkesat hyrëse kundrejt bazave të të dhënave të abuzimit të njohur.
- **Vlerësimi i rrezikut të telefonit** -- Shënoni numrat e disponueshëm ose VoIP përpara se të lëshoni një sfidë.
- **Geoblocking** -- Kufizoni verifikimin në rajone specifike.
- **Folje për IP** -- Përpjekjet e verifikimit të përsëritura të normës së kufirit nga e njëjta adresë.

## Stack i teknologjisë

| Shtresa   | Teknologji                                  |
| --------- | ------------------------------------------- |
| Kontratat | Solidity, i vendosur me Hardhat dhe Foundry |
| Frontend  | Next.js + Reagoj                            |
| Rrjeti    | Baza (Ethereum L2)                          |

Vendosja në bazë i mban kostot e gazit të ulëta ndërsa trashëgon garancitë e sigurisë së Ethereum.

## Udhërrëfyes

Përmirësimet e planifikuara përfshijnë:

- **Opsioni "Pay-to-mint"** -- Lejo komunitetet të kërkojnë një tarifë të vogël për prerjen, duke shtuar një pengesë ekonomike.
- **Sinjale verifikimi shtesë** -- Zgjerojeni përtej SMS-ve tek sinjalet e tjera të identitetit.
- **Vegla e zgjeruar e administratorit** -- Paneli dhe kontrolle më të pasura për operatorët e komunitetit.
