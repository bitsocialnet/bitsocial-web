---
title: EVM Contract Call Challenge
description: Desafío antispam que verifica las condiciones en cadena llamando a un contrato inteligente EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Nomenclatura heredada
Este paquete se publicó originalmente bajo el alcance `@plebbit`. Se le ha cambiado el nombre a `@bitsocial/evm-contract-challenge`. Es posible que aún aparezcan referencias al nombre anterior en documentación o bases de código más antiguas.
:::

EVM Contract Call Challenge es un mecanismo antispam que verifica las condiciones en la cadena antes de permitir una publicación. Originalmente extraído de `plebbit-js` como un paquete independiente, permite a los propietarios de comunidades exigir a los autores que cumplan con criterios definidos por contratos inteligentes (por ejemplo, mantener un saldo mínimo de tokens) para poder publicar.

**Código fuente:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Requisitos

- **Nodo.js** >= 22
- **Solo ESM**: este paquete no incluye compilaciones de CommonJS.
- **Dependencia del par en tiempo de ejecución:** `@plebbit/plebbit-js` (migrando a `@pkc/pkc-js`)

## Instalación

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opciones de configuración

| Opción        | Tipo     | Descripción                                                                                                  |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `chainTicker` | `string` | La cadena a consultar (por ejemplo, `eth`, `matic`, `avax`).                                                 |
| `address`     | `string` | La dirección del contrato inteligente para llamar.                                                           |
| `abi`         | `string` | El fragmento ABI de la función que se llama.                                                                 |
| `condition`   | `string` | Una expresión de comparación evaluada con respecto al valor de retorno del contrato (por ejemplo, `> 1000`). |
| `error`       | `string` | El mensaje de error se muestra a los autores que no cumplen la condición.                                    |

## Ejemplo

Un propietario de comunidad que quiera restringir la publicación a autores que posean más de 1000 tokens ERC-20 en particular configuraría el desafío con:

- `chainTicker`: `"eth"`
- `address`: la dirección del contrato del token
- `abi`: el ABI para `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Cuando un autor intenta publicar, el desafío llama a `balanceOf` con la dirección del autor y verifica si el valor devuelto cumple la condición. Si es así, procede la publicación; de lo contrario, se devuelve el mensaje de error configurado.

## Cuando usarlo

El desafío de llamada de contrato EVM es ideal para:

- **Comunidades controladas por tokens** que restringen la publicación a los poseedores de tokens.
- **Acceso controlado por NFT** donde se requiere la propiedad de un NFT específico.
- **Espacios de gobernanza DAO** donde la participación se limita a los poseedores de tokens de gobernanza.

Para las comunidades que no dependen de la identidad en cadena, considere [Spam Blocker](./spam-blocker.md) o [Voucher Challenge](./voucher-challenge.md) en su lugar.
