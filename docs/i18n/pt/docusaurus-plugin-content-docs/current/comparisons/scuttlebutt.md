---
title: Bitsocial e Secure Scuttlebutt
description: Como o Secure Scuttlebutt (SSB) e seu app Manyverse se comparam ao Bitsocial, de feeds append-only e replicação guiada pelo grafo de seguidores a comunidades, controle de spam e sincronização offline.
---

# Bitsocial e Secure Scuttlebutt

O [Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) é um protocolo social peer-to-peer criado por
Dominic Tarr em 2014. O [Manyverse](https://www.manyver.se/) é seu app mais conhecido, para Android,
iOS e desktop; o [Patchwork](https://github.com/ssbc/patchwork) foi o principal cliente desktop até
ser arquivado. Dos sistemas comparados nesta documentação, o SSB é o que está mais próximo do
Bitsocial em espírito: nenhum servidor no caminho dos dados, nenhuma blockchain, nenhuma ordem
global e chaves Ed25519 para identidade. Os dois fizeram escolhas opostas sobre o que cada peer
armazena e onde o spam é barrado.

## Como o Scuttlebutt funciona

- **Feeds.** Cada identidade é um par de chaves Ed25519, escrito como `@<public key>.ed25519`. Tudo
  o que um usuário publica vai para o seu próprio feed, um log append-only (que só aceita
  acréscimos) em que cada mensagem assinada traz um número de sequência e o hash da mensagem
  anterior. Depois de publicada, uma mensagem não pode ser modificada, segundo o
  [guia do protocolo](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replicação.** Os peers copiam feeds inteiros, não posts individuais, e o grafo de seguidores
  decide quais feeds um peer mantém. O Patchwork, por exemplo, exibia feeds a até dois saltos de
  distância e replicava feeds a até três saltos. Com as epidemic broadcast trees (EBT), os peers
  comparam o número de sequência mais recente que têm de cada feed e enviam só o que falta.
- **Conexões.** Os peers se autenticam com um secret handshake e criptografam o tráfego com box
  stream. O handshake é vinculado a um identificador de rede, então peers de uma rede SSB separada,
  com outro identificador, não conseguem se conectar à rede principal.
- **Encontrar peers.** Os peers se anunciam na rede local por broadcast UDP e sincronizam pela LAN;
  o Manyverse também sincroniza por Bluetooth. Pela internet, os usuários dependem dos **pubs**,
  peers sempre online que seguem você de volta depois que você resgata um código de convite e, a
  partir daí, armazenam e servem o seu feed, e dos **rooms**, que não armazenam feeds, mas criam
  túneis para as conexões entre seus membros.
- **Blobs e mensagens privadas.** Imagens e outros arquivos são blobs endereçados por conteúdo,
  buscados nos peers, com limite de tamanho padrão de 5 MB nas implementações atuais. As mensagens
  privadas são criptografadas para até sete destinatários e publicadas como texto cifrado no feed do
  autor.

## Onde eles diferem

### O que um peer armazena

Um peer SSB mantém uma cópia completa de cada feed dentro do seu alcance de replicação, desde a
primeira mensagem de cada feed, e serve esses feeds a outros. É isso que permite ao SSB funcionar
offline, mas o armazenamento cresce a cada mensagem dentro do alcance, e uma instalação nova precisa
baixar esses feeds antes de mostrar muita coisa. Um cliente Bitsocial busca o estado mais recente
das comunidades que abre no nó da comunidade e nos peers que fazem seed dela, e a rede guarda apenas
esse estado mais recente. Veja [Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Exclusão e dispositivos

Como um feed é uma cadeia de hashes, o SSB não tem exclusão em toda a rede: um peer pode descartar
mensagens do próprio banco de dados, mas não pode retirá-las das cópias de outros peers. Publicar
com a mesma chave a partir de dois dispositivos, ou de um backup restaurado, bifurca o feed (um
fork), então a solução habitual é uma identidade por dispositivo. O PZP, protocolo sucessor criado
pela equipe do Manyverse, lista a exclusão, vários dispositivos por conta e feeds tolerantes a forks
entre as principais mudanças em relação ao SSB
([post de lançamento](https://www.manyver.se/blog/2024-07-03/)). Um nó de comunidade Bitsocial
publica uma nova versão do estado da comunidade a cada atualização, então o conteúdo que os
moderadores removem sai do estado mais recente.

### Quem você pode ouvir

O alcance de replicação do SSB também funciona como filtro de spam. O feed de um desconhecido só
chega até você se alguém dentro dos seus saltos o seguir, e bloquear um feed faz o seu nó parar de
replicá-lo. O spam fica de fora, mas os recém-chegados também, até que alguém os siga. O Bitsocial
deixa qualquer pessoa publicar em uma comunidade, e o nó da comunidade decide, por meio do seu
desafio, se um post é aceito. Veja [Desafios antispam personalizados](/custom-challenges/).

### Comunidades

O SSB não tem objeto de comunidade. Canais e hashtags são rótulos em posts individuais, as respostas
de uma thread ficam nos feeds de quem as escreveu, e quanto de uma thread você vê depende de quais
desses feeds o seu nó tem. Os rooms podem ter moderadores e listas de membros, mas eles controlam
quem pode se conectar pelo room, não o que é publicado. Uma comunidade Bitsocial é um objeto de
primeira classe com seu próprio par de chaves, regras, moderadores e desafio.

### Infraestrutura

Ambos mantêm os servidores fora do caminho dos dados, e ambos se apoiam em auxiliares. Os pubs são o
que o SSB tem de mais próximo de um serviço hospedado: armazenam e servem os feeds de todos que
seguem. Os rooms se parecem mais com os roteadores HTTP do Bitsocial, porque nenhum dos dois
armazena conteúdo, mas um room retransmite a conexão entre seus membros, enquanto um roteador apenas
retorna endereços de provedores e não participa da transferência. Assim como um peer SSB, um nó de
comunidade Bitsocial roda em hardware doméstico, e ele precisa estar online para aceitar novos
posts.

### Offline e redes locais

É aqui que o SSB leva vantagem. Dois peers SSB na mesma rede Wi-Fi, ou via Bluetooth no Manyverse,
conseguem sincronizar sem conexão com a internet, e tudo o que já foi replicado continua legível
offline. O objetivo principal declarado do Manyverse é tornar as redes sociais independentes da
conectividade com a internet. O Bitsocial precisa de uma conexão com a internet para encontrar peers
e para publicar.

### Navegador

Os principais apps SSB trazem um nó SSB completo: o Manyverse inclui um nos seus apps para celular e
desktop. O [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo) rodava o SSB dentro de um
navegador com replicação parcial e conexões por meio de rooms, e foi arquivado em 2022. Os apps
Bitsocial rodam um nó peer-to-peer em uma aba comum do navegador. Veja
[Peer-to-Peer no navegador](/browser-p2p/).

### Mensagens privadas

O SSB tem mensagens privadas criptografadas embutidas. O Bitsocial se concentra em comunidades
públicas e ainda não tem mensagens diretas nativas.

## Situação do projeto

André Staltz, que criou o Manyverse, se afastou do SSB, do Manyverse e do sucessor planejado deles
em abril de 2024 ([sua última atualização](https://www.manyver.se/blog/2024-04-05/)). Em julho de
2024, Jacob Karlsson lançou esse sucessor como [PZP](https://pzp.wiki/) e escreveu que não
trabalharia mais no Manyverse e que não sabia de mais ninguém com planos de fazê-lo. Em outubro de
2026, os repositórios do PZP no [Codeberg](https://codeberg.org/pzp) não tinham atualizações desde
dezembro de 2024. O repositório do Patchwork está arquivado, com a v3.18.1 como última versão, e a
equipe por trás do Planetary, um app SSB para iOS, migrou para o Nostr com seu app Nos em 2023. A
rede SSB continua funcionando com os peers e pubs que as pessoas mantêm online, mas seus principais
apps não são mais desenvolvidos.

## Comparação

| Pergunta                | Secure Scuttlebutt                                                                                                  | Bitsocial                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Categoria               | Protocolo gossip peer-to-peer                                                                                       | Rede de comunidades peer-to-peer                                                                   |
| Identidade              | Um par de chaves Ed25519 por dispositivo                                                                            | Pares de chaves Ed25519 para usuários e comunidades                                                |
| Onde ficam os posts     | O feed append-only do autor, copiado por todo peer que o replica                                                    | O nó do dono da comunidade e os peers que a leem e fazem seed dela                                 |
| O que um peer guarda    | Histórico completo de cada feed ao seu alcance no grafo de seguidores                                               | O estado mais recente das comunidades que ele lê ou das quais faz seed                             |
| Comunidades             | Nenhum objeto de comunidade; canais e hashtags rotulam posts                                                        | Objetos de primeira classe cujo nó aceita ou rejeita posts                                         |
| Controle de spam        | Alcance de replicação definido pelo grafo de seguidores, e bloqueios                                                | O desafio de cada comunidade antes de um post ser aceito                                           |
| Moderação               | Quem cada usuário segue e bloqueia                                                                                  | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram                  |
| Servidores auxiliares   | Pubs armazenam e servem feeds; rooms criam túneis para conexões                                                     | Roteadores HTTP retornam peers provedores e não armazenam conteúdo                                 |
| Offline                 | Sincronização por LAN e Bluetooth sem internet                                                                      | Precisa de conexão com a internet                                                                  |
| Navegador               | Os apps trazem um nó SSB completo                                                                                   | Nó peer-to-peer dentro de uma aba comum do navegador                                               |
| Rede                    | Funcionando, mas seus principais apps não são mais desenvolvidos                                                    | Rede ativa com apps como [5chan](/apps/5chan/) e [Seedit](/apps/seedit/)                           |
| Contrapartida principal | Funciona offline e não precisa de hospedagem, mas os feeds crescem para sempre e desconhecidos continuam invisíveis | Publicação aberta e suporte a navegador, mas precisa de internet e guarda só o estado mais recente |
