---
title: 5chan
description: Um imageboard descentralizado e sem servidor construído no protocolo Bitsocial onde qualquer pessoa pode criar e possuir painéis.
sidebar_position: 1
---

:::warning[Nomenclatura herdada]
A base de código deste projeto ainda usa a nomenclatura herdada "plebbit" de antes da reformulação da marca Bitsocial. Nomes de pacotes, referências de API e alguma terminologia interna serão atualizados em uma versão futura. A funcionalidade descrita aqui é atual — apenas a nomenclatura está desatualizada.
:::

# 5chan

5chan é um imageboard sem servidor, sem administração e totalmente descentralizado que roda no protocolo Bitsocial. Ele segue a estrutura familiar de diretórios do imageboard, ao mesmo tempo em que introduz propriedade descentralizada – qualquer um pode criar um conselho, e vários conselhos podem competir pelo mesmo slot de diretório por meio de um mecanismo de votação.

## Transferências

| Plataforma       | Ligação                              |
| ---------------- | ------------------------------------ |
| Rede             | [5chan.app](https://5chan.app)       |
| Área de trabalho | Disponível para Mac, Windows e Linux |
| Móvel            | Disponível para Android              |

## Como funcionam as placas

O 5chan organiza o conteúdo em painéis usando um layout de diretório clássico (por exemplo, `/b/`, `/g/`). Ao contrário dos imageboards tradicionais, onde um administrador central controla cada quadro, o 5chan permite que qualquer usuário crie e possua totalmente seu próprio quadro. Quando vários conselhos têm como alvo o mesmo espaço no diretório, eles competem por essa posição por meio de votação.

### Criando um quadro

Para criar uma nova placa, você precisa executar `bitsocial-cli` como um nó ponto a ponto. Isso garante que seu quadro seja hospedado de maneira descentralizada, sem depender de nenhum servidor central.

### Atribuições de diretório

As atribuições de slot de diretório (qual placa aparece em qual caminho) são atualmente gerenciadas por meio de solicitações pull do GitHub para o arquivo `5chan-directories.json`. Este é um processo temporário – versões futuras suportarão a criação de quadros no aplicativo e votação baseada em pubsub para lidar com atribuições de diretório automaticamente.

## Internos

Nos bastidores, o 5chan usa a camada de cliente do protocolo Bitsocial compartilhado para suas interações de rede. O aplicativo da web em 5chan.app também pode executar um nó Helia no navegador quando o navegador P2P está habilitado nas configurações avançadas, para que os leitores possam carregar de pares sem um gateway IPFS centralizado. Consulte a seção P2P do navegador nas notas do protocolo ponto a ponto.

## Ligações

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegrama**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licença**: somente GPL-2.0
