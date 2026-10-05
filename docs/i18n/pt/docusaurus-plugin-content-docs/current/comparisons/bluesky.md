---
title: Bitsocial e Bluesky
description: Como o Bluesky e o AT Protocol, com servidores de dados pessoais, relays e AppViews, se comparam às comunidades peer-to-peer do Bitsocial.
---

# Bitsocial e Bluesky

O [Bluesky](https://bsky.app/) é um app de microblog construído sobre o
[AT Protocol](https://atproto.com/), projetado pela Bluesky Social PBC. O protocolo divide uma rede
social em serviços separados: servidores de dados pessoais hospedam contas, relays agregam essas
contas em um único fluxo e AppViews indexam esse fluxo nas linhas do tempo e nas threads que as
pessoas veem. A documentação descreve os dados das contas como armazenados em servidores de
hospedagem, "em oposição a um modelo peer-to-peer"
([visão geral](https://atproto.com/guides/overview)).

## Como o AT Protocol funciona

- **Repositórios em servidores.** Cada post, curtida ou follow é um registro no repositório assinado
  do autor, hospedado em um servidor de dados pessoais (PDS). O Bluesky roda os servidores padrão, e
  qualquer pessoa pode hospedar o seu.
- **Relays.** Os relays assinam cada PDS e retransmitem as mudanças como um único fluxo, o firehose.
  Desde uma atualização do protocolo em 2025, eles não arquivam mais todos os repositórios, o que os
  tornou muito mais baratos de rodar ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Um AppView indexa todo o firehose e serve linhas do tempo, threads de respostas
  completas, contagens e busca. É a parte da rede que mais consome recursos.
- **Identidade.** Uma conta é um DID: geralmente `did:plc`, registrado em um único diretório global,
  ou `did:web`, vinculado a um domínio. O documento DID lista o handle da conta, a chave de assinatura
  e o servidor atual. O PDS guarda a chave de assinatura; o `did:plc` também permite que os usuários
  tenham chaves de rotação próprias, para que possam se mudar sem a ajuda do host antigo
  ([guia de identidade](https://atproto.com/guides/identity)).
- **Handles.** Handles são nomes DNS, como `alice.bsky.social` ou um domínio do próprio usuário,
  verificados em relação ao DID.
- **Moderação.** Hospedagem e alcance são camadas separadas. Qualquer pessoa pode rodar um rotulador
  (labeler), e os usuários podem empilhar vários
  ([guia de moderação](https://atproto.com/guides/moderation)), mas o app Bluesky sempre aplica a
  moderação do próprio Bluesky. Os autores podem limitar quem pode responder aos seus posts e ocultar
  respostas.

## Onde eles diferem

### Servidores ou peers

Os dados do Bluesky ficam em servidores: um PDS hospeda cada conta, os relays transportam o firehose e
os AppViews servem o que os clientes exibem. Um navegador é um cliente HTTP desses serviços, nunca um
peer. No Bitsocial, o nó da comunidade e os peers que a leem servem o conteúdo, e um app web pode
rodar seu próprio nó peer-to-peer. Veja [Peer-to-Peer no navegador](/browser-p2p/).

### Uma visão global ou comunidades

O AT Protocol foi projetado para uma visão global única: um AppView vê todas as respostas, então
threads e busca são completas. O Bitsocial não tem índice global; cada comunidade publica o próprio
estado, e os apps constroem a descoberta por cima disso. Veja
[Descoberta de conteúdo](/content-discovery/).

O Bluesky não tem hoje um objeto de comunidade para posts públicos. Em junho de 2026, ele
[anunciou comunidades nativas](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) com
publicação sujeita a aprovação em alguns níveis de privacidade; até outubro de 2026, elas não tinham
sido lançadas. No Bitsocial, as comunidades são o objeto central, e o nó de uma comunidade aceita ou
rejeita posts.

### Controle de spam

O Bluesky lida com spam usando limites de taxa em seus servidores, limites para novos hosts no relay,
detecção automatizada, revisão humana e rótulos, e os autores podem restringir respostas. Nenhuma
barreira no nível da comunidade decide pelo que um post precisa passar antes de ser aceito. No
Bitsocial, cada comunidade escolhe o próprio desafio. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Quem guarda as chaves

As contas nos servidores do próprio Bluesky fazem login com senha, e esses servidores guardam suas
chaves de assinatura em regime de custódia ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Segundo um engenheiro de protocolo do Bluesky,
[a maioria das contas não tem chaves de rotação controladas de forma independente](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Uma identidade Bitsocial é um par de chaves gerado e guardado pelo app do usuário.

### Manter a infraestrutura

Um servidor pessoal é barato: o [PDS de referência](https://github.com/bluesky-social/pds) recomenda
1 GB de RAM para até 20 usuários. Um AppView independente da rede inteira é um projeto grande; um
construído em 2025 [custava cerca de US$ 200 por mês](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w),
principalmente por 16 TB de armazenamento. O Bitsocial não tem índice global para replicar, e um nó
de comunidade roda em hardware doméstico.

## Comparação

| Pergunta                | Bluesky (AT Protocol)                                                                 | Bitsocial                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Categoria               | Servidores federados com um índice global                                             | Rede de comunidades peer-to-peer                                                  |
| Identidade              | DID, com chaves de assinatura geralmente guardadas pelo servidor                      | Pares de chaves Ed25519 para usuários e comunidades                               |
| Onde ficam os posts     | O repositório do autor em um servidor de dados pessoais                               | O nó do dono da comunidade e os peers que a leem e fazem seed dela                |
| Quem mantém no ar       | Hosts de PDS, relays e AppViews, por padrão operados pelo Bluesky                     | Nó do dono da comunidade mais seeders auxiliares                                  |
| Comunidades             | Nenhuma para posts públicos ainda (anunciadas em 2026)                                | Objetos de primeira classe cujo nó aceita ou rejeita posts                        |
| Controle de spam        | Limites de taxa nos servidores, detecção automatizada, rótulos, controle de respostas | O desafio de cada comunidade antes de um post ser aceito                          |
| Moderação               | Rotuladores empilháveis; o app Bluesky sempre aplica a moderação do Bluesky           | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram |
| Nomes                   | Handles DNS verificados em relação ao DID                                             | Nomes `.bso` e `.eth` que resolvem para chaves                                    |
| Navegador               | Cliente HTTP de um PDS e de um AppView                                                | Nó peer-to-peer dentro de uma aba comum do navegador                              |
| Contrapartida principal | Threads e busca globais completas, mas a agregação exige servidores pesados           | Sem índice global pesado, mas também sem uma visão completa de toda a rede        |
