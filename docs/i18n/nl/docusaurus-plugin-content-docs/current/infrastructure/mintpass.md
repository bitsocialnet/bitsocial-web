---
title: Mintpass
description: NFT-gebaseerd authenticatiesysteem dat Bitsocial-gemeenschappen helpt gebruikers te verifiëren en sybil-aanvallen te verminderen.
sidebar_position: 2
---

# Mintpass

Mintpass is een op NFT gebaseerd authenticatiesysteem voor Bitsocial-gemeenschappen. Gebruikers kunnen een niet-overdraagbare verificatie-NFT aanmaken na het voltooien van een uitdaging (zoals SMS OTP), en communities kunnen het eigendom van NFT controleren om zich te beschermen tegen sybil-aanvallen zoals valse stemmen, verbodsontduiking en spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licentie**: MIT

## Hoe het werkt

De verificatiestroom heeft vier stappen:

1. **Verzoek** -- De gebruiker bezoekt `mintpass.org/request` om het proces te starten.
2. **Uitdaging** -- De gebruiker voltooit een sms-verificatie met een eenmalig wachtwoord.
3. **Mint** -- Na succesvolle verificatie wordt een niet-overdraagbare NFT in de portemonnee van de gebruiker geplaatst.
4. **Verifiëren** -- Community's vragen het NFT-eigendom om de gebruiker is geverifieerd.

Omdat de NFT niet overdraagbaar is, blijft deze gebonden aan de portemonnee die de verificatie heeft voltooid, waardoor gebruikers hun geverifieerde status niet kunnen verhandelen of verkopen.

## Projectstructuur

De repository is georganiseerd in drie hoofdgebieden:

| Telefoonboek | Doel                                                  |
| ------------ | ----------------------------------------------------- |
| `contracts/` | Soliditeit slimme contracten voor de verificatie NFT. |
| `challenge/` | Integratielaag voor het Bitsocial challenge-systeem.  |
| `web/`       | Next.js en React frontend voor de minting-stroom.     |

## Privacy en gegevensverwerking

Mintpass hanteert een benadering met minimale gegevens:

- **Operationele gegevens** (OTP-codes, sessietokens) worden opgeslagen in Redis met korte TTL's en verlopen automatisch.
- **Mint-associatie** (de link tussen een geverifieerde identiteit en een portemonnee) is het enige blijvende record.

Er worden geen telefoonnummers of persoonlijke gegevens bewaard nadat de verificatieperiode is gesloten.

## Optionele beveiligingslagen

Community-operators kunnen aanvullende beveiliging inschakelen, afhankelijk van hun bedreigingsmodel:

- **IP-reputatiecontroles** -- Scoor binnenkomende verzoeken tegen bekend misbruik databases.
- **Telefoonrisicobeoordeling** -- Markeer wegwerp- of VoIP-nummers voordat u een uitdaging uitgeeft.
- **Geoblocking** -- Beperk de verificatie tot specifieke regio's.
- **Afkoelingsperiodes per IP** -- Beperk herhaalde verificatiepogingen vanaf hetzelfde adres.

## Technologie stapel

| Laag       | Technologie                                |
| ---------- | ------------------------------------------ |
| Contracten | Soliditeit, ingezet met Hardhat en Foundry |
| Frontend   | Volgende.js + Reageren                     |
| Netwerk    | Base (Ethereum L2)                         |

Inzet op Base houdt de gaskosten laag terwijl je de veiligheidsgaranties van Ethereum overneemt.

## Routekaart

Geplande verbeteringen zijn onder meer:

- **Pay-to-mint-optie** -- Laat gemeenschappen een kleine vergoeding vragen voor het minten, waardoor een economische sybil-barrière wordt toegevoegd.
- **Extra verificatiesignalen** -- Breid verder dan sms naar andere identiteitssignalen.
- **Uitgebreide beheertools** -- Rijkere dashboards en controles voor community-operators.
