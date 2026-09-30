---
title: Historial del token BSO
description: La història completa de les generacions del token BSO, des del seu origen a Avalanche el 2021 fins a l'actual contracte d'Ethereum immutable i sense administrador.
---

# Historial del token BSO

BSO és una moneda de procedència. El protocol que hi ha darrere de Bitsocial és obert, i el token i
la cadena són opcionals per disseny: qualsevol pot bifurcar el codi, executar el seu propi client o
construir-hi al damunt la seva pròpia economia. El que no es pot bifurcar és la procedència. BSO ha
estat el token oficial de Bitsocial des del primer dia, i totes les migracions posteriors es poden
verificar a la cadena.

Aquesta pàgina llista totes les generacions del token, en ordre, amb les adreces de contracte
completes perquè qualsevol pugui comprovar-ne el registre pel seu compte.

## Gen 1: l'origen, Avalanche, 2021

- **Cadena**: Avalanche
- **Any**: 2021
- **Adreça**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorador**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Aquí és on va començar BSO. El subministrament es va regalar mitjançant tres airdrops i recompenses de mineria de liquiditat, sense preventa ni cap assignació per a l'equip reservada per davant de la comunitat. El contracte era un proxy
actualitzable, cosa que llavors era pràctica habitual i que va permetre a l'equip publicar
correccions durant els primers temps del token.

## Gen 2: el salt a Ethereum, 2024

- **Cadena**: Ethereum
- **Any**: 2024
- **Adreça**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

La Gen 2 va traslladar BSO d'Avalanche a Ethereum, on es construeix la resta del full de ruta de
Bitsocial Chain. Com la Gen 1, aquest contracte encara era un proxy actualitzable, mantingut una
generació més mentre es preparava el contracte definitiu i permanent.

## Gen 3: totalment immutable, 2025

- **Cadena**: Ethereum
- **Any**: 2025
- **Adreça**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

La Gen 3 és el contracte de BSO actual i definitiu. És totalment immutable i sense administrador:

- cap funció d'encunyació, de manera que el subministrament no es pot inflar
- cap adreça de propietari, de manera que ningú no pot canviar unilateralment el comportament del contracte
- cap funció de pausa, de manera que les transferències no es poden congelar
- cap patró de proxy, de manera que la lògica no es pot substituir més endavant

Aquest és l'estat final cap al qual apuntaven les dues primeres generacions: un token sense cap clau
d'administració que algú pugui guardar.

## Com van funcionar les migracions

Cada migració, de la Gen 1 a la Gen 2 i de la Gen 2 a la Gen 3, va ser un airdrop passiu 1:1. Els
titulars no van haver de presentar cap reclamació, signar cap missatge ni fer cap acció. Els saldos
del contracte antic es van llegir directament i es van replicar 1:1 al contracte nou, de manera que
la posició de cada titular es va conservar exactament al llarg de la migració.

Com que tant els contractes antics com els nous continuen sent públics i a la cadena, cada pas
d'aquest procés es pot verificar de manera independent. Qualsevol pot comparar instantànies
històriques de titulars de la Gen 1 o de la Gen 2 amb els saldos actuals de la Gen 3 i confirmar que
la migració va fer el que deia que faria. Cap part d'aquesta història depèn de creure's la paraula
de Bitsocial.

## Verifiqueu-ho tot

No us ho creieu per fe. Comproveu el registre directament:

- Gen 1 a [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 a [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 a [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- el lloc actual de la cadena a [chain.bitsocial.net](https://chain.bitsocial.net)

Si una adreça no coincideix amb el que hi ha llistat aquí, no és el token BSO oficial.
