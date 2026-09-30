---
title: Histórico do token BSO
description: O histórico completo de gerações do token BSO, da origem na Avalanche em 2021 até o atual contrato Ethereum imutável e sem administrador.
---

# Histórico do token BSO

O BSO é uma moeda de procedência. O protocolo por trás do Bitsocial é aberto, e o token e a chain
são opcionais por design: qualquer pessoa pode bifurcar o código, rodar o próprio cliente ou
construir a própria economia sobre ele. O que não dá para bifurcar é a procedência. O BSO é o token
oficial do Bitsocial desde o primeiro dia, e cada migração feita desde então é verificável on-chain.

Esta página lista todas as gerações do token, em ordem, com os endereços de contrato completos, para
que qualquer pessoa possa conferir o registro de forma independente.

## Geração 1: a origem, Avalanche, 2021

- **Rede**: Avalanche
- **Ano**: 2021
- **Endereço**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorador**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Foi aqui que o BSO começou. O fornecimento foi distribuído por meio de três airdrops e recompensas de
mineração de liquidez, sem pré-venda e sem alocação reservada para a equipe antes da comunidade. O contrato era um proxy atualizável, prática
padrão na época, que permitia à equipe publicar correções durante a fase inicial do token.

## Geração 2: a mudança para o Ethereum, 2024

- **Rede**: Ethereum
- **Ano**: 2024
- **Endereço**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

A geração 2 levou o BSO da Avalanche para o Ethereum, onde é construído o restante do roteiro da
Bitsocial Chain. Assim como na geração 1, esse contrato ainda era um proxy atualizável, mantido por
mais uma geração enquanto o contrato final e permanente era preparado.

## Geração 3: totalmente imutável, 2025

- **Rede**: Ethereum
- **Ano**: 2025
- **Endereço**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorador**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

A geração 3 é o contrato BSO atual e definitivo. Ele é totalmente imutável e não tem administrador:

- não há função de emissão, então o fornecimento não pode ser inflacionado
- não há endereço de proprietário, então ninguém pode alterar o comportamento do contrato de forma
  unilateral
- não há função de pausa, então as transferências não podem ser congeladas
- não há padrão de proxy, então a própria lógica não pode ser trocada depois

Esse é o estado final para o qual as duas primeiras gerações foram construídas: um token sem nenhuma
chave de administração para alguém guardar.

## Como funcionaram as migrações

Cada migração, da geração 1 para a 2 e da geração 2 para a 3, foi um airdrop passivo de 1:1. Os
detentores não precisaram registrar nenhum pedido, assinar nenhuma mensagem nem tomar qualquer
atitude. Os saldos do contrato antigo foram lidos diretamente e espelhados 1:1 no contrato novo, de
modo que a posição de cada detentor foi preservada exatamente na migração.

Como tanto os contratos antigos quanto os novos continuam públicos e on-chain, cada etapa desse
processo é verificável de forma independente. Qualquer pessoa pode comparar snapshots históricos de
detentores da geração 1 ou da geração 2 com os saldos atuais da geração 3 e confirmar que a migração
fez exatamente o que dizia fazer. Nenhuma parte desta história depende de acreditar na palavra do
Bitsocial.

## Verifique tudo

Não aceite nada disso por fé. Confira o registro diretamente:

- Geração 1 na [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Geração 2 no [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Geração 3 no [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- o site atual da chain em [chain.bitsocial.net](https://chain.bitsocial.net)

Se um endereço não corresponder ao que está listado aqui, não é o token BSO oficial.
