---
title: Istoricul tokenului BSO
description: Istoricul complet al generațiilor tokenului BSO, de la originea sa pe Avalanche în 2021 până la contractul Ethereum de astăzi, imuabil și fără administrator.
---

# Istoricul tokenului BSO

BSO este o monedă a provenienței. Protocolul din spatele Bitsocial este deschis, iar tokenul și
lanțul sunt opționale prin proiectare: oricine poate bifurca codul, poate rula propriul client sau
își poate construi propria economie peste el. Ce nu poate fi înlăturat printr-o bifurcare este
proveniența. BSO este tokenul oficial Bitsocial încă din prima zi, iar fiecare migrare de atunci
încoace poate fi verificată on-chain.

Această pagină listează fiecare generație a tokenului, în ordine, cu adresele complete ale
contractelor, astfel încât oricine să poată verifica istoricul în mod independent.

## Gen 1: originea, Avalanche, 2021

- **Lanț**: Avalanche
- **An**: 2021
- **Adresă**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorator**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Aici a început BSO. Oferta a fost distribuită prin trei airdrop-uri și recompense din liquidity mining,
fără prevânzare și fără o alocare pentru echipă pusă deoparte înaintea comunității. Contractul era un proxy actualizabil,
practica standard la acel moment, care permitea echipei să livreze remedieri în perioada de început
a tokenului.

## Gen 2: mutarea pe Ethereum, 2024

- **Lanț**: Ethereum
- **An**: 2024
- **Adresă**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorator**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Gen 2 a mutat BSO de pe Avalanche pe Ethereum, unde este construit restul foii de parcurs Bitsocial
Chain. La fel ca Gen 1, acest contract era încă un proxy actualizabil, păstrat pentru încă o
generație cât timp se pregătea contractul final și permanent.

## Gen 3: complet imuabil, 2025

- **Lanț**: Ethereum
- **An**: 2025
- **Adresă**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorator**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Gen 3 este contractul BSO actual și final. Este complet imuabil și fără administrator:

- nicio funcție de emitere, deci oferta nu poate fi inflatată
- nicio adresă de proprietar, deci nimeni nu poate schimba unilateral comportamentul contractului
- nicio funcție de suspendare, deci transferurile nu pot fi înghețate
- niciun tipar de proxy, deci logica în sine nu poate fi înlocuită ulterior

Aceasta este starea finală spre care au fost construite primele două generații: un token fără chei
de administrare rămase în mâna cuiva.

## Cum au funcționat migrările

Fiecare migrare, de la Gen 1 la Gen 2 și de la Gen 2 la Gen 3, a fost un airdrop pasiv 1:1.
Deținătorii nu au avut nevoie să depună o cerere, să semneze un mesaj sau să facă absolut nimic.
Soldurile din contractul vechi au fost citite direct și oglindite 1:1 în contractul nou, astfel
încât poziția fiecărui deținător a fost păstrată exact la trecerea dintre contracte.

Pentru că atât contractele vechi, cât și cele noi rămân publice și on-chain, fiecare pas al acestui
proces poate fi verificat independent. Oricine poate compara instantanee istorice ale deținătorilor
din Gen 1 sau Gen 2 cu soldurile actuale din Gen 3 și poate confirma că migrarea a corespuns cu
ceea ce a pretins că face. Nicio parte din acest istoric nu depinde de a-l crede pe Bitsocial pe
cuvânt.

## Verifică totul

Nu lua nimic din toate acestea de bun. Verifică direct înregistrarea publică:

- Gen 1 pe [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 pe [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 pe [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- site-ul actual al lanțului, la [chain.bitsocial.net](https://chain.bitsocial.net)

Dacă o adresă nu corespunde cu ce este listat aici, nu este tokenul BSO oficial.
