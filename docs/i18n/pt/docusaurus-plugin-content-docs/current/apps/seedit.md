---
title: Seedit
description: Um fórum descentralizado e sem servidor no estilo Reddit, construído no protocolo Bitsocial, onde qualquer pessoa pode criar e possuir comunidades.
sidebar_position: 2
---

# Seedit

Seedit é uma alternativa sem servidor, sem administração e totalmente descentralizada ao antigo Reddit, construído no protocolo Bitsocial. Ele dá aos usuários propriedade total sobre suas comunidades – qualquer um pode criar uma, e várias comunidades podem competir pela mesma rota curta, como `/s/funny`.

## Transferências

| Plataforma       | Ligação                                            |
| ---------------- | -------------------------------------------------- |
| Rede             | [seedit.app](https://seedit.app)                   |
| Rede (ENS)       | `seedit.eth` via navegador Brave ou IPFS Companion |
| Área de Trabalho | Disponível para Mac, Windows e Linux               |
| Móvel            | Disponível para Android                            |

## Como funcionam as comunidades

Seedit organiza o conteúdo em comunidades semelhantes aos subreddits. Cada comunidade pertence ao seu criador e opera sem administração centralizada. Várias comunidades podem competir pela mesma rota de [diretório](/directories/), como `/s/funny`, que abre a vencedora atual. Inscrições e links de publicações sempre apontam para a comunidade exata.

### Criando uma comunidade

Existem duas maneiras de criar uma nova comunidade:

1. **Cliente de desktop** — Use a GUI integrada no aplicativo de desktop para instalar e configurar sua comunidade.
2. **bitsocial-cli** — Execute a ferramenta CLI para criar e gerenciar comunidades a partir da linha de comando.

### Lista de comunidades padrão

Novas contas são inscritas em uma lista padrão de comunidades específicas definida em `seedit-default-subscriptions.json` no repositório [bitsocialnet/lists](https://github.com/bitsocialnet/lists). As candidatas dos diretórios ficam listadas em arquivos `seedit-directories/seedit-<code>-directory.json` no mesmo repositório. Para adicionar sua comunidade a qualquer uma das listas, envie uma solicitação pull com os detalhes da sua comunidade.

## Ligações

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegrama**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licença**: somente GPL-2.0
