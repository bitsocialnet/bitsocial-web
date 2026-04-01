---
title: Desafio de Chamada de Contrato EVM
description: Desafio anti-spam que verifica as condições da cadeia chamando um contrato inteligente EVM.
sidebar_position: 4
---

# Desafio de Chamada de Contrato EVM

:::warning Legacy Naming
Este pacote foi publicado originalmente no escopo `@plebbit`. Ele foi renomeado para `@bitsocial/evm-contract-challenge`. Referências ao nome antigo ainda podem aparecer em documentação ou bases de código mais antigas.
:::

EVM Contract Call Challenge é um mecanismo anti-spam que verifica as condições da rede antes de permitir uma publicação. Originalmente extraído de `plebbit-js` como um pacote independente, ele permite que os proprietários da comunidade exijam que os autores atendam aos critérios definidos pelo contrato inteligente - por exemplo, manter um saldo mínimo de tokens - para postar.

**Código fonte:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Requisitos

- **Node.js** >= 22
- **Somente ESM** – este pacote não envia compilações CommonJS.
- **Dependência de peer em tempo de execução:** `@plebbit/plebbit-js` (migrando para `@pkc/pkc-js`)

## Instalação

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opções de configuração

| Opção         | Tipo     | Descrição                                                                                                |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | A cadeia a ser consultada (por exemplo, `eth`, `matic`, `avax`).                                         |
| `address`     | `string` | O endereço do contrato inteligente para ligar.                                                           |
| `abi`         | `string` | O fragmento ABI da função que está sendo chamada.                                                        |
| `condition`   | `string` | Uma expressão de comparação avaliada em relação ao valor de retorno do contrato (por exemplo, `> 1000`). |
| `error`       | `string` | A mensagem de erro mostrada aos autores que não atendem à condição.                                      |

## Exemplo

O proprietário de uma comunidade que deseja restringir a postagem a autores que possuem mais de 1.000 tokens ERC-20 específicos configuraria o desafio com:

- `chainTicker`: `"eth"`
- `address`: o endereço do contrato de token
- `abi`: a ABI para `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Quando um autor tenta publicar, o desafio chama `balanceOf` com o endereço do autor e verifica se o valor retornado satisfaz a condição. Se isso acontecer, a publicação prossegue; caso contrário, a mensagem de erro configurada será retornada.

## Quando usar

O Desafio de Chamada de Contrato EVM é ideal para:

- **Comunidades controladas por tokens** que restringem a publicação a detentores de tokens.
- **Acesso controlado por NFT** onde é necessária a propriedade de um NFT específico.
- **Espaços de governança DAO** onde a participação é limitada aos detentores de tokens de governança.

Para comunidades que não dependem de identidade na rede, considere [Bloqueador de Spam](./spam-blocker.md) ou [Desafio de voucher](./voucher-challenge.md).
