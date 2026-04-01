---
title: Desafio de tela Captcha
description: Gerador de captcha independente baseado em imagem com caracteres, dimensões e cores configuráveis.
sidebar_position: 2
---

# Desafio de tela Captcha

:::warning Legacy Naming
Este pacote foi publicado originalmente no escopo `@plebbit`. Ele foi renomeado para `@bitsocial/captcha-canvas-challenge`. Referências ao nome antigo ainda podem aparecer em documentação ou bases de código mais antigas.
:::

Captcha Canvas Challenge é um gerador de imagem captcha independente originalmente extraído de `plebbit-js`. Ele renderiza texto aleatório em uma tela HTML e retorna a imagem resultante, que as comunidades podem apresentar aos autores como um desafio de spam.

**Código fonte:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Requisitos

- **Node.js** >= 22
- **Somente ESM** – este pacote não envia compilações CommonJS.
- **Dependência de peer em tempo de execução:** `@plebbit/plebbit-js` (migrando para `@pkc/pkc-js`)

## Instalação

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opções de configuração

| Opção        | Tipo     | Padrão    | Descrição                                                       |
| ------------ | -------- | --------- | --------------------------------------------------------------- |
| `characters` | `number` | `6`       | Número de caracteres aleatórios renderizados na imagem captcha. |
| `height`     | `number` | `100`     | Altura da imagem gerada em pixels.                              |
| `width`      | `number` | `300`     | Largura da imagem gerada em pixels.                             |
| `colors`     | `string` | `#32cf7e` | Cor primária usada para o texto captcha.                        |

## Como funciona

1. O gerador escolhe uma string aleatória com o comprimento configurado.
2. A string é renderizada em uma tela com ruído visual para resistir ao OCR.
3. A imagem resultante (e a resposta esperada) são retornadas para que a aplicação chamadora possa apresentar o desafio e posteriormente verificar a resposta.

Como o pacote é um gerador de imagens puro, ele não cuida da rede ou do gerenciamento de sessões por conta própria. Pretende-se que seja integrado a um fluxo de desafio maior - por exemplo, como um dos tipos de desafio suportados pelo [Bloqueador de Spam](./spam-blocker.md).
