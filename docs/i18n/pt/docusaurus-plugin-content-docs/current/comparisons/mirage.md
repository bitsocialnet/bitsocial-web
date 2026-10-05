---
title: Bitsocial e Mirage
description: Como o Mirage, um fórum no estilo Reddit em seu próprio blockchain Cosmos SDK, se compara ao Bitsocial e ao seu app no estilo Reddit, o Seedit.
---

# Bitsocial e Mirage

O [Mirage](https://mirage.foundation/) é uma rede de discussão no estilo Reddit, com comunidades,
posts em threads e votos. Em vez de um banco de dados de empresa, ele roda em seu próprio blockchain,
uma cadeia Cosmos SDK com consenso CometBFT. O produto do Bitsocial mais próximo é o
[Seedit](/apps/seedit/), um app no estilo Reddit na rede Bitsocial, então a comparação trata
principalmente de como cada um hospeda, possui e modera comunidades.

## Como o Mirage funciona

- **Nós.** Um nó Mirage é um único contêiner Docker com um validador, um banco de dados PostgreSQL, um
  indexador, uma API HTTP e o frontend web. Todo nó também é um validador. Rodar um nó exige um
  servidor Ubuntu em amd64 e 10.000.000 de tokens MIRAGE na conta do operador, segundo o
  [guia de implantação](https://github.com/MirageFoundation/mirage-node/blob/dev/docs/guides/deploy.md).
- **Publicação.** O navegador assina cada ação com a chave secp256k1 do usuário, e os usuários
  gratuitos também calculam uma pequena prova de trabalho. O nó encapsula a ação em uma transação da
  cadeia e paga a taxa.
- **Leitura.** O indexador de cada nó copia os dados da cadeia para seu próprio banco de dados e serve
  feeds por uma API HTTP. Os nós guardam cerca de uma semana de blocos, então o histórico de posts de
  longo prazo fica no banco de dados de cada nó, e um nó novo começa sem o histórico anterior ao seu
  ponto de sincronização.
- **Contas.** Uma conta é uma chave derivada de uma frase-semente de 12 palavras, e a mesma semente
  funciona em qualquer nó. Os nomes de usuário são registrados na cadeia e são únicos em toda a rede.
- **Comunidades.** Todo nome válido já é uma comunidade, e ninguém é dono dela. Equipes pagas de
  curadores, com até dez usuários cada, mantêm cada uma uma visão moderada de uma comunidade; os
  leitores escolhem a visão de uma equipe, a visão padrão do nó ou uma visão sem censura. Veja o
  [FAQ do Mirage](https://mirage.talk/faq).
- **Token.** O token MIRAGE paga assinaturas, recompensa autores e nós e dá aos validadores peso na
  governança. Os assinantes pulam a prova de trabalho e têm limites maiores.

## Onde eles diferem

### Quem é dono de uma comunidade

No Seedit, quem cria uma comunidade detém o par de chaves dela, roda ou delega o nó dela e a modera.
No Mirage, ninguém é dono de uma comunidade: equipes de curadores concorrentes oferecem visões
moderadas do mesmo nome, e a visão padrão é a da equipe escolhida pelo maior número de assinantes
pagantes.

### Controle de spam

O Mirage aplica uma única regra à rede inteira: os usuários gratuitos pagam com prova de trabalho,
cuja dificuldade se ajusta ao volume recebido, e os assinantes a pulam. No Bitsocial, cada comunidade
escolhe o próprio desafio, de captchas a listas de permissão e pagamentos. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Infraestrutura

O Mirage precisa de um blockchain. Os validadores chegam a consenso sobre cada ação, e cada nó roda
uma pilha completa de servidor e precisa manter um grande stake em tokens. O Bitsocial não tem
cadeia: um nó de comunidade roda em hardware doméstico a partir do app desktop ou do `bitsocial-cli`,
e os leitores podem ajudar a compartilhar o conteúdo.

### Controle sobre toda a rede

O Mirage tem governança on-chain ponderada pelo stake dos validadores. Ela pode mudar a dificuldade,
os preços e a emissão de tokens, cunhar ou queimar tokens e nomear administradores cujas exclusões o
indexador de referência aplica a qualquer post. O código da cadeia também permite que a governança
[exclua contas](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2572-L2573)
e
[envie tokens de qualquer endereço](https://github.com/MirageFoundation/mirage-node/blob/142a2e4e2542b6a3c9cc6d71591c282e5e5a9503/blockchain/x/core/module/module.go#L2656).
Em outubro de 2026, quatro validadores produziam os blocos da cadeia, e os próprios runbooks do
projeto gerenciavam todos os quatro.

O Bitsocial não tem administrador no nível do protocolo. Os donos de comunidades moderam as próprias
comunidades, e os apps escolhem o que mostram. Veja
[Moderação local, não proibições globais](/local-moderation/).

### Navegador

O cliente web do Mirage é um cliente HTTP de um nó: o navegador assina as ações, mas não entra em uma
rede peer-to-peer. Os apps Bitsocial podem rodar um nó peer-to-peer dentro da aba do navegador. Veja
[Peer-to-Peer no navegador](/browser-p2p/).

## Comparação

| Pergunta                | Mirage                                                                                                                                | Bitsocial                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Categoria               | Fórum em seu próprio blockchain (Cosmos SDK)                                                                                          | Rede de comunidades peer-to-peer                                                                          |
| Identidade              | Chave secp256k1 de uma semente de 12 palavras, com nome de usuário on-chain                                                           | Pares de chaves Ed25519 para usuários e comunidades                                                       |
| Onde ficam os posts     | Transações na cadeia, depois o banco PostgreSQL de cada nó                                                                            | O nó do dono da comunidade e os peers que a leem e fazem seed dela                                        |
| Quem mantém no ar       | Nós validadores, cada um com 10.000.000 de MIRAGE                                                                                     | Nó do dono da comunidade mais seeders auxiliares                                                          |
| Comunidades             | Nomes sem dono com equipes de curadores pagas e concorrentes                                                                          | Pertencem a um par de chaves; o nó do dono aceita ou rejeita posts                                        |
| Controle de spam        | Prova de trabalho em toda a rede; assinantes a pulam                                                                                  | O desafio de cada comunidade antes de um post ser aceito                                                  |
| Moderação               | Visões de equipes de curadores, filtros pessoais, administradores nomeados pela governança                                            | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram                         |
| Economia                | Token MIRAGE para assinaturas, recompensas e stake de validadores                                                                     | Nenhuma no protocolo; um desafio pode exigir um pagamento ou token                                        |
| Navegador               | Cliente HTTP de um nó                                                                                                                 | Nó peer-to-peer dentro de uma aba comum do navegador                                                      |
| Contrapartida principal | Um estado compartilhado e ordenado e cadastro fácil, mas um conjunto pequeno de validadores e poderes de governança sobre toda a rede | Sem necessidade de cadeia ou stake, mas sem ordem global, e o conteúdo antigo não é garantido para sempre |
