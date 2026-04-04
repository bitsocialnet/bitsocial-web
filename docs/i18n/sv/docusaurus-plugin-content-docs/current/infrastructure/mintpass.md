---
title: Mintpass
description: NFT-baserat autentiseringssystem som hjälper Bitsocial-gemenskaper att verifiera användare och minska sybil-attacker.
sidebar_position: 2
---

# Mintpass

Mintpass är ett NFT-baserat autentiseringssystem för Bitsocial-gemenskaper. Användare skapar en icke-överförbar verifierings-NFT efter att ha slutfört en utmaning (som SMS OTP), och gemenskaper kan kontrollera NFT-ägande för att skydda sig mot sybilattacker som falska röster, förbudsflykt och spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licens**: MIT

## Hur det fungerar

Verifieringsflödet har fyra steg:

1. **Begäran** -- Användaren besöker `mintpass.org/request` för att påbörja processen.
2. **Utmaning** -- Användaren slutför en SMS engångslösenordsverifiering.
3. **Mint** -- Efter lyckad verifiering präglas en icke-överförbar NFT till användarens plånbok.
4. **Verifiera** -- Gemenskaper frågar efter NFT-ägarskap för att bekräfta att användaren har verifierats.

Eftersom NFT inte kan överföras, förblir den bunden till plånboken som slutförde verifieringen, vilket hindrar användare från att handla eller sälja sin verifierade status.

## Projektets struktur

Förvaret är organiserat i tre huvudområden:

| Katalog      | Syfte                                              |
| ------------ | -------------------------------------------------- |
| `contracts/` | Solidity smarta kontrakt för verifiering av NFT.   |
| `challenge/` | Integrationslager för Bitsocial utmaningssystemet. |
| `web/`       | Next.js och React frontend för myntflödet.         |

## Integritet och datahantering

Mintpass har en minimal data-strategi:

- **Operationsdata** (OTP-koder, sessionstokens) lagras i Redis med korta TTL:er och förfaller automatiskt.
- **Mint association** (länken mellan en verifierad identitet och en plånbok) är den enda bestående posten.

Inga telefonnummer eller personliga uppgifter sparas efter att verifieringsfönstret stängs.

## Valfria säkerhetslager

Gemenskapsoperatörer kan aktivera ytterligare skydd beroende på deras hotmodell:

- **Kontroller av IP-rykte** -- Betyg inkommande förfrågningar mot databaser med kända missbruk.
- **Telefonriskbedömning** -- Flagga engångs- eller VoIP-nummer innan du utfärdar en utmaning.
- **Geoblockering** -- Begränsa verifieringen till specifika regioner.
- **Per-IP nedkylningar** -- Begränsa upprepade verifieringsförsök från samma adress.

## Teknikstapel

| Lager    | Teknik                                       |
| -------- | -------------------------------------------- |
| Kontrakt | Solidity, utplacerad med Hardhat and Foundry |
| Frontend | Next.js + Reagera                            |
| Nätverk  | Bas (Ethereum L2)                            |

Utplacering på Base håller gaskostnaderna låga samtidigt som Ethereums säkerhetsgarantier ärveras.

## Färdkarta

Planerade förbättringar inkluderar:

- **Pay-to-mint-alternativ** -- Tillåt samhällen att kräva en liten avgift för myntning, vilket lägger till en ekonomisk sybilbarriär.
- **Ytterligare verifieringssignaler** -- Expandera bortom SMS till andra identitetssignaler.
- **Utökad administratörsverktyg** – Riktigare instrumentpaneler och kontroller för community-operatörer.
