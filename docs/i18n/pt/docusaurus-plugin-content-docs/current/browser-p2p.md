---
title: Peer-to-Peer no navegador
description: Como um aplicativo web Bitsocial executa um nó libp2p de verdade na aba do navegador, quais transportes ele usa e a correção upstream de 2026 que fez a publicação a partir de uma aba funcionar.
---

# Peer-to-Peer no navegador

Um aplicativo web Bitsocial não precisa ser cliente do servidor de ninguém. Ele pode executar um nó
[Helia](https://helia.io/) dentro da aba do navegador, entrar na mesma rede peer-to-peer dos nós de
desktop e de CLI, buscar conteúdo de comunidades junto aos peers e publicar via pubsub.

Esta página explica o que isso significa na prática, quais transportes são usados, o que ainda não é
possível fazer e por que publicar a partir de uma aba só passou a funcionar em 2026.

Para o desenho mais amplo da rede, consulte [Protocolo Peer-to-Peer](/peer-to-peer-protocol/).

## O que roda na aba

Quando o P2P no navegador está ativo, a página mantém um nó libp2p de verdade:

- ele se conecta a outros peers por WebSockets seguros
- ele busca e verifica o conteúdo das comunidades nesses peers, e não em um gateway IPFS
- ele participa do gossipsub, então publicar uma postagem não exige um provedor de pubsub hospedado
- ele usa a mesma pilha de cliente de protocolo (`pkc-js`) de todos os outros aplicativos Bitsocial

A consequência prática é que nenhum operador de gateway fica entre um leitor web e uma comunidade.
Não existe um único endpoint HTTPS que possa ser pressionado a deixar de servir uma comunidade para
todos os usuários de navegador de uma só vez.

## Como os nós de navegador se conectam

O `pkc-js` se conecta aos peers por **WebSockets seguros**. Conexões WebRTC e WebTransport são
negadas por padrão por um connection gater, porque no navegador elas acrescentam caminhos de
estabelecimento de conexão longos e que falham com frequência — negociação STUN/ICE, rotação de
certhash — que deixam o carregamento das páginas mais lento, enquanto o WebSocket oferece um
transporte direto e confiável. Quem quiser especificamente WebRTC ou WebTransport pode sobrescrever
o gater por meio de `libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

A consequência prática é que um peer de navegador se conecta a nós que expõem um endpoint WSS, o que
significa que esses nós precisam de um domínio e de um certificado assinado por uma CA. Peers atrás
de conexões domésticas sem isso são alcançados de forma indireta, em vez de contatados diretamente
pela aba.

## Por que publicar a partir do navegador só passou a funcionar em 2026

Peer-to-peer no navegador não é uma ideia nova. O que mudou em 2026 é que as _postagens_ de um nó de
navegador agora chegam ao resto da rede.

A especificação de pubsub do libp2p exige que o `seqno` de uma mensagem seja um inteiro de 64 bits
big-endian que cresce linearmente. Em vez disso, o `js-libp2p-gossipsub` gerava 8 bytes aleatórios,
enquanto go-libp2p-pubsub e rust-libp2p usavam um contador. O Kubo 0.40+ ativa o
`BasicSeqnoValidator` por padrão, que rejeita qualquer mensagem cujo seqno não seja maior que o mais
alto já visto daquele peer.

O efeito era que a maioria das mensagens publicadas por um nó JavaScript — inclusive um nó de
navegador — era descartada silenciosamente pelos peers Kubo. Um caso de reprodução mediu de 2 a 8
mensagens chegando, de 30.

Isso foi diagnosticado em
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) e corrigido no
**`@libp2p/gossipsub` 15.0.21** em maio de 2026. Até essa correção chegar, um nó de navegador
conseguia se conectar e ler, mas suas postagens quase sempre se perdiam no caminho até os peers Go.
O `pkc-js` distribui o `@libp2p/gossipsub` 16.0.4, posterior a essa correção.

## O que um nó de navegador ainda não consegue fazer

Um nó de navegador é um peer de verdade, não um servidor. Seus limites são diferentes dos de um nó de
desktop ou sempre ligado:

- em geral não consegue aceitar conexões de entrada arbitrárias vindas da internet pública
- só funciona enquanto a aba estiver aberta, então não serve como host duradouro dos dados de uma comunidade
- não consegue entrar em uma DHT libp2p, e é por isso que a descoberta passa por roteadores HTTP
- é uma escolha ruim para semear conteúdo em escala

Hospedar uma comunidade por completo continua sendo tarefa de um aplicativo de desktop, do
`bitsocial-cli` ou de outro nó sempre ligado. O P2P no navegador muda quem pode _ler e postar_ sem um
gateway; ele não elimina a necessidade de peers que fiquem online.

## Roteadores HTTP não são gateways

Os clientes de navegador ainda consultam
[roteadores HTTP](/peer-to-peer-protocol/#public-key-based-addressing) para descobrir quais peers
fornecem no momento o endereço de uma comunidade. Esse é o asterisco honesto do "peer-to-peer puro no
navegador", e vale ser preciso a respeito:

- um roteador guarda apenas endereços de peers para um endereço de conteúdo
- ele não armazena, não serve e nem sequer conhece o conteúdo da comunidade
- os clientes consultam vários roteadores em paralelo e combinam os resultados
- qualquer pessoa pode operar um, e trocar de roteador é uma mudança de configuração sem migração de dados

Depois da descoberta, a transferência de conteúdo e o tráfego de pubsub acontecem peer-to-peer. Um
roteador que desaparece custa um caminho de busca, não os seus dados. Um gateway IPFS, ao contrário,
está no caminho do conteúdo.

## Onde isso já roda hoje

- O [5chan](/apps/5chan/) roda P2P puro no navegador por padrão no aplicativo web em
  [5chan.app](https://5chan.app).

## Fallback de gateway

O acesso via gateway continua existindo como caminho de compatibilidade para navegadores ou redes que
não conseguem entrar diretamente. Consulte [Fallback de gateway](/peer-to-peer-protocol/#gateway-fallback).
A arquitetura desejada é P2P no navegador em primeiro lugar, com gateways como fallback opcional em
vez de gargalo padrão.
