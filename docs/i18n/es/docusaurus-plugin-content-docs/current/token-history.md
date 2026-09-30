---
title: Historial del token BSO
description: El historial completo de las generaciones del token BSO, desde su origen en Avalanche en 2021 hasta el actual contrato de Ethereum inmutable y sin administrador.
---

# Historial del token BSO

BSO es una moneda de procedencia. El protocolo que hay detrás de Bitsocial es abierto, y tanto el
token como la cadena son opcionales por diseño: cualquiera puede bifurcar el código, ejecutar su
propio cliente o construir su propia economía encima. Lo que no se puede bifurcar es la procedencia.
BSO ha sido el token oficial de Bitsocial desde el primer día, y todas las migraciones posteriores
se pueden verificar en la cadena.

Esta página enumera cada generación del token, en orden, con las direcciones completas de los
contratos para que cualquiera pueda comprobar el registro por su cuenta.

## Gen 1: el origen, Avalanche, 2021

- **Cadena**: Avalanche
- **Año**: 2021
- **Dirección**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorador**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Aquí es donde empezó BSO. El suministro se regaló mediante tres airdrops y recompensas de minería de liquidez, sin preventa y sin ninguna asignación al equipo apartada por delante de la comunidad. El contrato era un proxy actualizable, la
práctica habitual en aquel momento, que permitió al equipo publicar correcciones durante los primeros
tiempos del token.

## Gen 2: el salto a Ethereum, 2024

- **Cadena**: Ethereum
- **Año**: 2024
- **Dirección**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

La Gen 2 llevó BSO de Avalanche a Ethereum, donde se construye el resto de la hoja de ruta de
Bitsocial Chain. Igual que la Gen 1, este contrato seguía siendo un proxy actualizable: se mantuvo
una generación más mientras se preparaba el contrato definitivo y permanente.

## Gen 3: totalmente inmutable, 2025

- **Cadena**: Ethereum
- **Año**: 2025
- **Dirección**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

La Gen 3 es el contrato actual y definitivo de BSO. Es totalmente inmutable y no tiene administrador:

- sin función de emisión, así que el suministro no se puede inflar
- sin dirección de propietario, así que nadie puede cambiar por su cuenta el comportamiento del contrato
- sin función de pausa, así que las transferencias no se pueden congelar
- sin patrón de proxy, así que la lógica en sí no se puede sustituir más adelante

Este es el destino hacia el que se construyeron las dos primeras generaciones: un token sin ninguna
clave de administración que alguien pueda conservar.

## Cómo funcionaron las migraciones

Cada migración, de la Gen 1 a la Gen 2 y de la Gen 2 a la Gen 3, fue un airdrop pasivo 1:1. Quienes
tenían tokens no tuvieron que presentar una reclamación, firmar un mensaje ni hacer absolutamente
nada. Los saldos del contrato antiguo se leyeron directamente y se replicaron 1:1 en el contrato
nuevo, de modo que la posición de cada titular se conservó exactamente igual tras la migración.

Como tanto el contrato antiguo como el nuevo siguen siendo públicos y están en la cadena, cada paso
de este proceso se puede verificar de forma independiente. Cualquiera puede comparar instantáneas
históricas de titulares de la Gen 1 o de la Gen 2 con los saldos actuales de la Gen 3 y confirmar que
la migración hizo lo que decía hacer. Ninguna parte de este historial depende de creer a Bitsocial
bajo palabra.

## Verifícalo todo

No des nada de esto por sentado. Consulta el registro directamente:

- la Gen 1 en [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- la Gen 2 en [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- la Gen 3 en [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- el sitio actual de la cadena en [chain.bitsocial.net](https://chain.bitsocial.net)

Si una dirección no coincide con las que figuran aquí, no es el token oficial BSO.
