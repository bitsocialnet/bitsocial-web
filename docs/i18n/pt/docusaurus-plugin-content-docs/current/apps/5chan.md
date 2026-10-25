---
title: 5chan
description: Um imageboard descentralizado e sem servidor, construído sobre o protocolo Bitsocial, em que qualquer pessoa pode criar e ser dona de boards.
sidebar_position: 1
---

# 5chan

O 5chan é um imageboard sem servidor, sem administrador e totalmente descentralizado, que roda sobre o protocolo Bitsocial. Ele mantém a estrutura de diretórios familiar dos imageboards, mas introduz a posse descentralizada — qualquer pessoa pode criar um board, e vários boards podem disputar o mesmo espaço de diretório por meio de um mecanismo de votação.

## Downloads

| Plataforma | Link                                 |
| ---------- | ------------------------------------ |
| Web        | [5chan.app](https://5chan.app)       |
| Desktop    | Disponível para Mac, Windows e Linux |
| Celular    | Disponível para Android              |

## Como funcionam os boards

O 5chan organiza o conteúdo em boards usando o layout clássico de diretórios (por exemplo, `/b/`, `/g/`). Ao contrário dos imageboards tradicionais, em que um administrador central controla todos os boards, o 5chan permite que qualquer usuário crie e seja plenamente dono do próprio board. Quando vários boards apontam para o mesmo espaço de diretório, eles disputam essa posição; veja [Diretórios](/directories/).

### Como criar um board

Para criar um novo board, você precisa executar o `bitsocial-cli` como um nó peer-to-peer. Isso garante que seu board seja hospedado de forma descentralizada, sem depender de nenhum servidor central.

### Atribuições de diretório

Os boards candidatos de cada diretório ficam listados em um arquivo `5chan-directories/5chan-<code>-directory.json` no repositório [bitsocialnet/lists](https://github.com/bitsocialnet/lists), e um board entra em um diretório por meio de um pull request para esse arquivo. O 5chan também realiza uma votação para cada diretório com [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): cada titular de um 5chan Pass tem direito a um voto, e votar em um board que não está na lista o indica como candidato. As votações rodam atualmente na testnet Base Sepolia, onde as apurações são exibidas, mas não reordenam a lista.

## Detalhes internos

Por baixo dos panos, o 5chan usa a camada de cliente compartilhada do protocolo Bitsocial para suas
interações de rede. O aplicativo web em 5chan.app roda um nó Helia no navegador por padrão, então
uma aba comum entra na rede como peer: ela carrega boards de outros peers e publica via pubsub, sem
nenhum gateway IPFS centralizado no caminho do conteúdo. Veja [Peer-to-peer no navegador](/browser-p2p/) para saber o que isso
envolve e o que um nó de navegador ainda não consegue fazer.

## Links

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licença**: GPL-2.0-only
