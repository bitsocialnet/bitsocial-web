---
title: Mintpass
description: NFT-basert autentiseringssystem som hjelper Bitsocial-fellesskap med å verifisere brukere og redusere sybilangrep.
sidebar_position: 2
---

# Mintpass

Mintpass er et NFT-basert autentiseringssystem for Bitsocial-samfunn. Brukere lager en ikke-overførbar bekreftelses-NFT etter å ha fullført en utfordring (som SMS OTP), og lokalsamfunn kan sjekke NFT-eierskap for å beskytte seg mot sybilangrep som falske stemmer, unndragelse av forbud og spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Lisens**: MIT

## Hvordan det fungerer

Bekreftelsesflyten har fire trinn:

1. **Forespørsel** -- Brukeren besøker `mintpass.org/request` for å starte prosessen.
2. **Utfordring** -- Brukeren fullfører en SMS-engangspassordbekreftelse.
3. **Mint** -- Etter vellykket verifisering blir en ikke-overførbar NFT preget til brukerens lommebok.
4. **Bekreft** -- Fellesskap spør NFT-eierskap for å bekrefte at brukeren er bekreftet.

Fordi NFT ikke kan overføres, forblir det bundet til lommeboken som fullførte verifiseringen, og hindrer brukere i å handle eller selge sin bekreftede status.

## Prosjektstruktur

Depotet er organisert i tre hovedområder:

| Katalog      | Formål                                             |
| ------------ | -------------------------------------------------- |
| `contracts/` | Solidity smarte kontrakter for verifiseringen NFT. |
| `challenge/` | Integrasjonslag for Bitsocial utfordringssystemet. |
| `web/`       | Next.js og React-frontend for minting-flyten.      |

## Personvern og datahåndtering

Mintpass bruker en minimal datatilnærming:

- **Operasjonsdata** (OTP-koder, økttokens) lagres i Redis med korte TTL-er og utløper automatisk.
- **Mint association** (koblingen mellom en bekreftet identitet og en lommebok) er den eneste vedvarende posten.

Ingen telefonnumre eller personlige detaljer beholdes etter at bekreftelsesvinduet lukkes.

## Valgfrie sikkerhetslag

Fellesskapsoperatører kan aktivere ytterligere beskyttelse avhengig av trusselmodellen deres:

- **IP-omdømmesjekker** -- Score innkommende forespørsler mot kjente misbruksdatabaser.
- **Telefonrisikovurdering** -- Flagg engangs- eller VoIP-numre før du sender en utfordring.
- **Geoblokkering** – Begrens bekreftelse til bestemte regioner.
- **Per-IP nedkjøling** -- Rate-limit gjentatte bekreftelsesforsøk fra samme adresse.

## Teknologistabel

| Lag        | Teknologi                                     |
| ---------- | --------------------------------------------- |
| Kontrakter | Solidity, distribuert med Hardhat and Foundry |
| Frontend   | Next.js + Reager                              |
| Nettverk   | Base (Ethereum L2)                            |

Deployering on Base holder gasskostnadene lave samtidig som den arver Ethereums sikkerhetsgarantier.

## Veikart

Planlagte forbedringer inkluderer:

- **Betal-til-mynt-alternativ** – La lokalsamfunn kreve en liten avgift for mynting, og legger til en økonomisk sybil-barriere.
- **Ytterligere bekreftelsessignaler** -- Utvid utover SMS til andre identitetssignaler.
- **Utvidet administrasjonsverktøy** -- Rikere dashbord og kontroller for fellesskapsoperatører.
