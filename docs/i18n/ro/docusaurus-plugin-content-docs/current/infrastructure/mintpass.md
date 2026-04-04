---
title: Mintpass
description: NFT care ajută comunitățile Bitsocial să verifice utilizatorii și să reducă atacurile sybil.
sidebar_position: 2
---

# Mintpass

Mintpass este un sistem de autentificare bazat pe NFT pentru comunitățile Bitsocial. Utilizatorii bate un NFT de verificare netransferabil după finalizarea unei provocări (cum ar fi SMS OTP), iar comunitățile pot verifica proprietatea NFT pentru a se proteja împotriva atacurilor sybil, cum ar fi voturi false, interzicerea evaziunii și spam-ul.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licență**: MIT

## Cum funcționează

Fluxul de verificare are patru etape:

1. **Solicitare** -- Utilizatorul vizitează `mintpass.org/request` pentru a începe procesul.
2. **Provocare** -- Utilizatorul completează o verificare unică prin SMS.
3. **Mint** -- După verificarea cu succes, un NFT netransferabil este bătut în portofelul utilizatorului.
4. **Verifică** -- Comunitățile solicită calitatea de proprietar NFT pentru a confirma că utilizatorul a fost verificat.

Deoarece NFT este netransferabil, rămâne legat de portofelul care a finalizat verificarea, împiedicând utilizatorii să tranzacționeze sau să-și vândă statutul verificat.

## Structura proiectului

Depozitul este organizat în trei zone principale:

| Director     | Scop                                                         |
| ------------ | ------------------------------------------------------------ |
| `contracts/` | Contracte inteligente de soliditate pentru verificarea NFT.  |
| `challenge/` | Stratul de integrare pentru sistemul de provocare Bitsocial. |
| `web/`       | Next.js și React frontend pentru fluxul de batere.           |

## Confidențialitate și manipulare a datelor

Mintpass adoptă o abordare cu date minime:

- **Datele operaționale** (coduri OTP, jetoane de sesiune) sunt stocate în Redis cu TTL-uri scurte și expiră automat.
- **Asociere cu mentă** (legătura dintre o identitate verificată și un portofel) este singura înregistrare persistentă.

Nu sunt reținute numere de telefon sau detalii personale după închiderea ferestrei de verificare.

## Straturi de securitate opționale

Operatorii comunitari pot activa protecții suplimentare în funcție de modelul lor de amenințare:

- **Verificări ale reputației IP** -- Evaluează cererile primite în baza bazelor de date cunoscute pentru abuzuri.
- **Evaluarea riscului la telefon** -- Semnalați numerele de unică folosință sau VoIP înainte de a lansa o provocare.
- **Geoblocare** -- Limitați verificarea la anumite regiuni.
- **Recoperi per-IP** -- Rate limitează încercările repetate de verificare de la aceeași adresă.

## Stiva de tehnologie

| Strat     | Tehnologie                                   |
| --------- | -------------------------------------------- |
| Contracte | Solidity, implementat cu Hardhat and Foundry |
| Frontend  | Next.js + React                              |
| Rețea     | Baza (Ethereum L2)                           |

Implementarea pe Base menține costurile cu gazul scăzute, moștenind în același timp garanțiile de securitate Ethereum.

## Foaia de parcurs

Îmbunătățirile planificate includ:

- **Opțiune Pay-to-Mint** -- Permiteți comunităților să solicite o taxă mică pentru batere, adăugând o barieră economică sibilă.
- **Semnale de verificare suplimentare** -- Extindeți dincolo de SMS-uri la alte semnale de identitate.
- **Unelte de administrare extinse** -- Tablouri de bord și comenzi mai bogate pentru operatorii comunității.
