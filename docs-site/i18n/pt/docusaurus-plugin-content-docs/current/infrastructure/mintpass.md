---
title: Mintpass
description: Sistema de autenticação baseado em NFT que ajuda as comunidades Bitsocial a verificar usuários e reduzir ataques de sybil.
sidebar_position: 2
---

# Mintpass

Mintpass é um sistema de autenticação baseado em NFT para comunidades Bitsocial. Os usuários criam um NFT de verificação intransferível após completar um desafio (como SMS OTP), e as comunidades podem verificar a propriedade do NFT para se proteger contra ataques de sybil, como votos falsos, evasão de banimento e spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licença**: MIT

## Como funciona

O fluxo de verificação tem quatro etapas:

1. **Solicitação** – O usuário visita `mintpass.org/request` para iniciar o processo.
2. **Desafio** – O usuário conclui uma verificação de senha única por SMS.
3. **Mint** – Após a verificação bem-sucedida, um NFT intransferível é cunhado na carteira do usuário.
4. **Verificar** – As comunidades consultam a propriedade do NFT para confirmar se o usuário foi verificado.

Como o NFT é intransferível, ele permanece vinculado à carteira que concluiu a verificação, evitando que os usuários negociem ou vendam seu status verificado.

## Estrutura do Projeto

O repositório está organizado em três áreas principais:

| Diretório    | Finalidade                                                |
| ------------ | --------------------------------------------------------- |
| `contracts/` | Contratos inteligentes Solidity para verificação NFT.     |
| `challenge/` | Camada de integração para o sistema de desafio Bitsocial. |
| `web/`       | Frontend Next.js e React para o fluxo de cunhagem.        |

## Privacidade e tratamento de dados

Mintpass adota uma abordagem de dados mínimos:

- **Dados operacionais** (códigos OTP, tokens de sessão) são armazenados no Redis com TTLs curtos e expiram automaticamente.
- **Associação Mint** (o link entre uma identidade verificada e uma carteira) é o único registro persistente.

Nenhum número de telefone ou dados pessoais são retidos após o fechamento da janela de verificação.

## Camadas de segurança opcionais

Os operadores comunitários podem ativar proteções adicionais dependendo do seu modelo de ameaça:

- **Verificações de reputação de IP** – Pontue as solicitações recebidas em bancos de dados de abusos conhecidos.
- **Avaliação de risco telefônico** – Sinalize números descartáveis ​​ou VoIP antes de emitir um desafio.
- **Bloqueio geográfico** – Restringe a verificação a regiões específicas.
- **Resfriamentos por IP** – Limite a taxa de tentativas repetidas de verificação do mesmo endereço.

## Pilha de tecnologia

| Camada    | Tecnologia                                 |
| --------- | ------------------------------------------ |
| Contratos | Solidity, implantado com Hardhat e Foundry |
| Interface | Next.js + Reagir                           |
| Rede      | Base (Etéreo L2)                           |

A implantação no Base mantém os custos do gás baixos, ao mesmo tempo que herda as garantias de segurança do Ethereum.

## Roteiro

As melhorias planejadas incluem:

- **Opção de pagamento para cunhar** – Permite que as comunidades exijam uma pequena taxa pela cunhagem, adicionando uma barreira econômica contra sibilas.
- **Sinais de verificação adicionais** – Vá além do SMS para outros sinais de identidade.
- **Ferramentas de administração expandidas** – Painéis e controles mais avançados para operadores da comunidade.
