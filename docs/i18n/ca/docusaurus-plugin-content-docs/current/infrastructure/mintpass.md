---
title: Mintpass
description: Sistema d'autenticació basat en NFT que ajuda les comunitats Bitsocial a verificar els usuaris i reduir els atacs sybil.
sidebar_position: 2
---

# Mintpass

Mintpass és un sistema d'autenticació basat en NFT per a comunitats Bitsocial. Els usuaris elaboren una NFT de verificació no transferible després de completar un repte (com ara SMS OTP) i les comunitats poden comprovar la propietat de NFT per protegir-se dels atacs de sybil com ara vots falsos, prohibir l'evasió i correu brossa.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Llicència**: MIT

## Com funciona

El flux de verificació té quatre passos:

1. **Sol·licitud**: l'usuari visita `mintpass.org/request` per començar el procés.
2. **Repte**: l'usuari completa una verificació d'una contrasenya per SMS.
3. **Mint**: després de la verificació correcta, s'encunya un NFT no transferible a la cartera de l'usuari.
4. **Verifica**: les comunitats demanen la propietat de NFT per confirmar que l'usuari s'ha verificat.

Com que l'NFT és intransferible, es manté vinculat a la cartera que va completar la verificació, impedint que els usuaris comercialitzin o venguin el seu estat verificat.

## Estructura del projecte

El repositori s'organitza en tres àrees principals:

| Directori    | Finalitat                                                      |
| ------------ | -------------------------------------------------------------- |
| `contracts/` | Contractes intel·ligents de solidesa per a la verificació NFT. |
| `challenge/` | Capa d'integració per al sistema de desafiaments Bitsocial.    |
| `web/`       | Next.js i React per al flux d'encunyació.                      |

## Privadesa i tractament de dades

Mintpass adopta un enfocament de dades mínimes:

- **Les dades operatives** (codis OTP, testimonis de sessió) s'emmagatzemen a Redis amb TTL curts i caduquen automàticament.
- **Associació de menta** (l'enllaç entre una identitat verificada i una cartera) és l'únic registre persistent.

No es conserva cap número de telèfon ni dades personals després de tancar la finestra de verificació.

## Capes de seguretat opcionals

Els operadors de la comunitat poden habilitar proteccions addicionals en funció del seu model d'amenaça:

- **Comprovacions de la reputació de la IP**: puntua les sol·licituds entrants amb bases de dades d'abús conegudes.
- **Avaluació del risc del telèfon**: marca els números d'un sol ús o de VoIP abans d'emetre un desafiament.
- **Geoblocking**: restringeix la verificació a regions específiques.
- **Refrescaments per IP** -- Limita la velocitat dels intents de verificació repetits des de la mateixa adreça.

## Pila de tecnologia

| Capa       | Tecnologia                                |
| ---------- | ----------------------------------------- |
| Contractes | Solidity, desplegat amb Hardhat i Foundry |
| Frontend   | Next.js + Reaccionar                      |
| Xarxa      | Base (Ethereum L2)                        |

El desplegament a Base manté baixos els costos del gas mentre hereta les garanties de seguretat d'Ethereum.

## Full de ruta

Les millores previstes inclouen:

- **Opció de pagament per encunyar**: permet que les comunitats requereixin una petita tarifa per encunyar, afegint una barrera econòmica de sibil·la.
- **Signals de verificació addicionals** -- Amplieu-vos més enllà dels SMS a altres senyals d'identitat.
- **Eines d'administració ampliades**: taulers de control i controls més rics per als operadors de la comunitat.
