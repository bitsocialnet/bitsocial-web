---
title: Mintpass
description: NFT-baseret autentificeringssystem, der hjælper Bitsocial-fællesskaber med at verificere brugere og reducere sybil-angreb.
sidebar_position: 2
---

# Mintpass

Mintpass er et NFT-baseret godkendelsessystem til Bitsocial-fællesskaber. Brugere laver en ikke-overførbar bekræftelses-NFT efter at have gennemført en udfordring (såsom SMS OTP), og fællesskaber kan kontrollere NFT-ejerskab for at beskytte sig mod sybilangreb som falske stemmer, forbudunddragelse og spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licens**: MIT

## Hvordan det virker

Verifikationsforløbet har fire trin:

1. **Anmodning** -- Brugeren besøger `mintpass.org/request` for at starte processen.
2. **Udfordring** -- Brugeren fuldfører en SMS engangs-adgangskodebekræftelse.
3. **Mint** -- Efter vellykket bekræftelse bliver en ikke-overførbar NFT præget til brugerens tegnebog.
4. **Bekræft** -- Fællesskaber forespørger om NFT-ejerskab for at bekræfte, at brugeren er blevet bekræftet.

Fordi NFT ikke kan overføres, forbliver det bundet til tegnebogen, der fuldførte verifikationen, hvilket forhindrer brugere i at handle eller sælge deres verificerede status.

## Projektets struktur

Depotet er organiseret i tre hovedområder:

| Katalog      | Formål                                             |
| ------------ | -------------------------------------------------- |
| `contracts/` | Solidity smarte kontrakter til verifikations-NFT.  |
| `challenge/` | Integrationslag til Bitsocial udfordringssystemet. |
| `web/`       | Next.js og React-frontend for prægningsflowet.     |

## Privatliv og datahåndtering

Mintpass har en minimal datatilgang:

- **Driftsdata** (OTP-koder, sessionstokens) gemmes i Redis med korte TTL'er og udløber automatisk.
- **Mint association** (linket mellem en verificeret identitet og en tegnebog) er den eneste vedvarende registrering.

Ingen telefonnumre eller personlige oplysninger opbevares, efter at bekræftelsesvinduet lukkes.

## Valgfri sikkerhedslag

Fællesskabsoperatører kan aktivere yderligere beskyttelse afhængigt af deres trusselsmodel:

- **IP-omdømmetjek** -- Score indgående anmodninger mod kendte misbrugsdatabaser.
- **Telefonrisikovurdering** -- Angiv engangs- eller VoIP-numre, før du sender en udfordring.
- **Geoblokering** -- Begræns bekræftelse til specifikke områder.
- **Per-IP-afkøling** -- Rate-limit gentagne bekræftelsesforsøg fra den samme adresse.

## Teknologi stak

| Lag        | Teknologi                                      |
| ---------- | ---------------------------------------------- |
| Kontrakter | Solidity, implementeret med Hardhat og Foundry |
| Frontend   | Next.js + Reager                               |
| Netværk    | Base (Ethereum L2)                             |

Deployering on Base holder gasomkostningerne lave, mens Ethereums sikkerhedsgarantier arves.

## Køreplan

Planlagte forbedringer omfatter:

- **Pay-to-mint-mulighed** – Tillad lokalsamfund at kræve et mindre gebyr for prægning, hvilket tilføjer en økonomisk sybil-barriere.
- **Yderligere bekræftelsessignaler** -- Udvid ud over SMS til andre identitetssignaler.
- **Udvidet administrationsværktøj** - Mere dashboards og kontrolelementer til fællesskabsoperatører.
