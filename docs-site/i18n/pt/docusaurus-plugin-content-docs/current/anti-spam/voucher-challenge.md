---
title: Desafio de voucher
description: Desafio anti-spam que bloqueia a publicação por meio de códigos de voucher exclusivos distribuídos pelos proprietários da comunidade.
sidebar_position: 3
---

# Desafio de voucher

Voucher Challenge é um mecanismo anti-spam que bloqueia a publicação de conteúdo por meio de códigos de voucher exclusivos. Em vez de depender da detecção automatizada, ele transfere a confiança para o proprietário da comunidade, que distribui manualmente os códigos às pessoas em quem confiam.

**Código fonte:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Como funciona

1. O proprietário de uma comunidade gera um ou mais códigos de voucher exclusivos.
2. O proprietário distribui esses códigos a autores confiáveis ​​por meio de um canal de sua escolha (mensagem direta, e-mail, pessoalmente, etc.).
3. Quando um autor tenta publicar, o sistema de desafio solicita um código de voucher.
4. O código é validado – se for genuíno e ainda não tiver sido utilizado, a publicação é aceita.

Cada código de voucher está vinculado a um autor específico depois de resgatado, evitando a reutilização por terceiros.

## Quando usar

O Voucher Challenge é mais adequado para:

- **Comunidades somente para convidados** onde a adesão é intencionalmente restrita.
- **Espaços selecionados** onde o proprietário avalia pessoalmente cada participante.
- **Ambientes de alta confiança** onde a pontuação automatizada de spam é desnecessária ou indesejável.

Como requer distribuição manual de código, não se adapta a grandes comunidades abertas. Para esses cenários, considere [Bloqueador de Spam](./spam-blocker.md) ou [Desafio de Chamada de Contrato EVM](./evm-contract-call.md).

## Integração

O Voucher Challenge se conecta à mesma interface de desafio usada por outros pacotes anti-spam no ecossistema Bitsocial. Os proprietários da comunidade habilitam-no através das configurações da comunidade, e o desafio é apresentado aos autores automaticamente quando eles tentam postar.
