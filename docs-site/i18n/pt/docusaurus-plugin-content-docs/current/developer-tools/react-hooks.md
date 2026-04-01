---
title: Ganchos de reação
description: Biblioteca de ganchos React para construção de aplicativos sociais descentralizados no protocolo Bitsocial.
sidebar_position: 1
---

# Ganchos de reação

:::warning Legacy Naming
Este pacote atualmente usa convenções de nomenclatura herdadas de seu fork upstream. Referências a “plebbit” em código, APIs e configuração serão migradas para “bitsocial” em uma versão futura. A funcionalidade não é afetada.
:::

O pacote `bitsocial-react-hooks` fornece uma API familiar de ganchos React para interagir com o protocolo Bitsocial. Ele lida com a busca de feeds, comentários e perfis de autores, gerenciando contas, publicando conteúdo e assinando comunidades – tudo sem depender de um servidor central.

Esta biblioteca é a interface principal usada pelo [5chan](/apps/5chan/) e outros aplicativos clientes Bitsocial.

:::note
`bitsocial-react-hooks` é um fork temporário de `plebbit/plebbit-react-hooks` mantido para desenvolvimento auxiliado por IA. Ele é consumido diretamente do GitHub, em vez de publicado no npm.
:::

## Instalação

Como o pacote ainda não está no npm, instale-o diretamente do GitHub, fixando-o em um hash de commit específico:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Substitua `<commit-hash>` pelo commit que você deseja atingir.

## Visão geral da API

Os ganchos são organizados em categorias funcionais. Abaixo está um resumo dos ganchos mais comumente usados ​​em cada categoria. Para assinaturas completas, parâmetros e tipos de retorno, consulte a [referência completa da API no GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Contas

Gerencie contas, identidades e configurações de usuários locais.

- `useAccount(accountName?)` – retorna o objeto de conta ativo (ou nomeado)
- `useAccounts()` – retorna todas as contas armazenadas localmente
- `useAccountComments(options?)` – retorna comentários publicados pela conta ativa

### Comentários

Busque e interaja com comentários e tópicos individuais.

- `useComment(commentCid?)` – busca um único comentário por seu CID
- `useComments(commentCids?)` – busca vários comentários em lote
- `useEditedComment(comment?)` – retorna a última versão editada de um comentário

### Comunidades

Recuperar metadados e configurações da comunidade.

- `useSubplebbit(subplebbitAddress?)` – busca uma comunidade por endereço
- `useSubplebbits(subplebbitAddresses?)` – busca múltiplas comunidades
- `useSubplebbitStats(subplebbitAddress?)` – retorna contagens de assinantes e postagens

### Autores

Procure perfis de autores e metadados.

- `useAuthor(authorAddress?)` – busca um perfil de autor
- `useAuthorComments(options?)` – retorna comentários de um autor específico
- `useResolvedAuthorAddress(authorAddress?)` – resolve um endereço legível por humanos (por exemplo, ENS) para seu endereço de protocolo

### Feeds

Assine e paginar feeds de conteúdo.

- `useFeed(options?)` – retorna um feed paginado de postagens de uma ou mais comunidades
- `useBufferedFeeds(feedOptions?)` – pré-armazena vários feeds para renderização mais rápida
- `useAuthorFeed(authorAddress?)` – retorna um feed de postagens de um autor específico

### Ações

Publique conteúdo e execute operações de gravação.

- `usePublishComment(options?)` – publicar um novo comentário ou resposta
- `usePublishVote(options?)` – dá um voto positivo ou negativo
- `useSubscribe(options?)` – inscrever-se ou cancelar inscrição em uma comunidade

### Estados e RPC

Monitore o estado da conexão e interaja com um daemon Bitsocial remoto.

- `useClientsStates(options?)` – retorna o estado da conexão de clientes IPFS/pubsub
- `usePlebbitRpcSettings()` – retorna a configuração atual do daemon RPC

## Desenvolvimento

Para trabalhar na biblioteca de ganchos localmente:

**Pré-requisitos:** Node.js, Corepack habilitado, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Consulte o README do repositório para comandos de teste e construção.

## Ligações

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licença:** Somente GPL-2.0
