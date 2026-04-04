---
title: Mintpass
description: Autentizační systém založený na NFT, který pomáhá komunitám Bitsocial ověřit uživatele a snížit útoky sybil.
sidebar_position: 2
---

# Mintpass

Mintpass je ověřovací systém založený na NFT pro komunity Bitsocial. Uživatelé si po dokončení výzvy (jako je SMS OTP) vytisknou nepřenosné ověřovací NFT a komunity mohou zkontrolovat vlastnictví NFT, aby se chránily před útoky sybil, jako jsou falešné hlasy, zákaz úniků a spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licence**: MIT

## Jak to funguje

Ověřovací tok má čtyři kroky:

1. **Požadavek** -- Uživatel navštíví `mintpass.org/request`, aby zahájil proces.
2. **Výzva** -- Uživatel dokončí SMS jednorázové ověření hesla.
3. **Mint** – Po úspěšném ověření je do peněženky uživatele vyražena nepřenosná NFT.
4. **Ověřit** -- Komunity se dotazují na vlastnictví NFT, aby potvrdily, že uživatel byl ověřen.

Protože NFT je nepřenosný, zůstává vázán na peněženku, která dokončila ověření, což uživatelům brání v obchodování nebo prodeji jejich ověřeného stavu.

## Struktura projektu

Úložiště je organizováno do tří hlavních oblastí:

| Adresář      | Účel                                              |
| ------------ | ------------------------------------------------- |
| `contracts/` | Solidní chytré kontrakty pro ověření NFT.         |
| `challenge/` | Integrační vrstva pro systém Bitsocial challenge. |
| `web/`       | Next.js a rozhraní React pro tok ražby.           |

## Ochrana osobních údajů a zpracování dat

Mintpass využívá přístup s minimálními daty:

- **Provozní data** (kódy OTP, tokeny relace) jsou uloženy v Redis s krátkými TTL a automaticky vyprší.
- **Přidružení mincovny** (spojení mezi ověřenou identitou a peněženkou) je jediným trvalým záznamem.

Po zavření ověřovacího okna nejsou uchovávána žádná telefonní čísla ani osobní údaje.

## Volitelné bezpečnostní vrstvy

Operátoři komunity mohou povolit další ochranu v závislosti na jejich modelu hrozby:

- **Kontrola reputace IP** -- Skóre příchozích požadavků proti známým databázím zneužití.
- **Posouzení rizika telefonu** – Před zadáním výzvy označte jednorázová nebo VoIP čísla.
- **Geoblokování** – Omezte ověřování na konkrétní oblasti.
- **Odoly na IP** -- Omezte rychlost opakovaných pokusů o ověření ze stejné adresy.

## Zásobník technologií

| Vrstva   | Technologie                            |
| -------- | -------------------------------------- |
| Smlouvy  | Solidity, nasazená s Hardhat a Foundry |
| Frontend | Next.js + Reagovat                     |
| Síť      | Báze (Ethereum L2)                     |

Nasazení na základně udržuje nízké náklady na plyn a zároveň zdědí bezpečnostní záruky Ethereum.

## Cestovní mapa

Mezi plánovaná vylepšení patří:

- **Možnost Pay-to-mint** – Umožněte komunitám vyžadovat malý poplatek za ražbu, což přidává ekonomickou bariéru sybil.
- **Další ověřovací signály** – Rozšiřte kromě SMS na další signály identity.
- **Rozšířené nástroje pro správu** – Bohatší řídicí panely a ovládací prvky pro komunitní operátory.
