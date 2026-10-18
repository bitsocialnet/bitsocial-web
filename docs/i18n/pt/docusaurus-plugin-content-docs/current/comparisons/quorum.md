---
title: Bitsocial e Quorum
description: Como o Quorum, o mensageiro de grupo com criptografia de ponta a ponta do Quilibrium com Spaces no estilo do Discord, se compara às comunidades peer-to-peer públicas do Bitsocial.
---

# Bitsocial e Quorum

O [Quorum](https://www.quorummessenger.com/) é um mensageiro de grupo criado pela Quilibrium Inc.
sobre a rede [Quilibrium](https://quilibrium.com/), da própria empresa. Ele é organizado como o
Discord, com Spaces, canais, papéis e mensagens diretas, e suas mensagens têm criptografia de ponta
a ponta. Ele aparece ao lado do Bitsocial porque ambos se descrevem como peer-to-peer e resistentes
à censura, com grupos que definem as próprias regras. Os dois miram coisas diferentes: o Quorum, o
chat privado em grupo; o Bitsocial, comunidades públicas que qualquer pessoa pode ler.

O Quilibrium se descreve como uma alternativa descentralizada às plataformas de nuvem: uma rede de
nós que guardam dados em um hipergrafo criptografado e chegam a um acordo sobre o estado dele por
meio de um consenso que chama de Proof of Meaningful Work. Os nós ganham QUIL, o token da rede, que
paga as taxas de uso. O Quorum começou em 2018 como Howler, a ideia de uma alternativa privada ao
Discord, e se tornou o primeiro app a entrar no ar no Quilibrium, segundo a
[história do Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/). A Quilibrium Inc.,
fundada por Cassie Heart, desenvolve o protocolo e oferece o Quorum como um de seus serviços
gerenciados ([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Como o Quorum funciona

Os detalhes abaixo vêm do código-fonte dos clientes do Quorum,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) para os apps web e desktop e
[quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), em outubro de 2026.

- **Identidades.** A identidade mestra de um usuário é um conjunto de chaves Ed448, e cada
  dispositivo recebe as próprias chaves X448 e Ed448. No navegador, as chaves são protegidas por uma
  chave de acesso (passkey). Os endereços são hashes que começam com `Qm`, e os usuários podem
  exibir um nome de usuário do serviço de nomes do Quilibrium.
- **Criptografia.** As mensagens diretas usam o Double Ratchet entre dispositivos. Um Space
  compartilha uma única sessão Triple Ratchet entre seus membros, que assinam as próprias mensagens
  com chaves específicas do Space. Todo Space é criptografado, e o Quorum diz que sua intermediação
  de mensagens impede que o serviço que retransmite as mensagens associe remetentes a destinatários.
- **Entrada.** Entra-se nos Spaces por links de convite. Um link de uso único carrega na URL as
  chaves para entrar; um link público as busca no serviço do Quorum, e os Spaces públicos podem ser
  listados em um diretório pesquisável.
- **Transporte.** Os clientes web, desktop e móvel se conectam todos, por HTTPS e um WebSocket, a um
  único serviço,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Ele retransmite mensagens criptografadas para a caixa de entrada de cada membro e armazena os
  cadastros de usuários, o manifesto criptografado de cada Space (canais, papéis, emoji), material
  de convite, o diretório público e uma sincronização opcional e criptografada de configurações. O
  software de nó do Quilibrium tem um serviço de caixa de entrada e hub com o mesmo formato, mas nem
  os clientes nem a documentação do Quilibrium dizem como esse serviço se relaciona com a rede.
- **Histórico.** O cliente de cada membro mantém a própria cópia do Space no armazenamento local. O
  cliente web e desktop preenche o histórico pedindo a um membro online que sincronize; o cliente
  móvel reproduz um log que o serviço mantém para cada Space, então consegue se atualizar mesmo
  quando nenhum outro membro está online.
- **Moderação.** Os papéis concedem permissão para apagar, fixar, silenciar e fazer menções
  `@everyone`. O cliente de cada membro verifica a assinatura de cada ação de moderação e só a
  aplica se quem assinou tiver o papel adequado. O dono pode expulsar um membro, o que faz a rotação
  das chaves do Space para que o membro expulso não consiga ler novas mensagens. Um Space pode
  exigir mensagens assinadas ou deixar os membros publicarem mensagens não assinadas e negáveis.
- **Código.** O cliente web e desktop é licenciado sob a AGPL-3.0, e o cliente móvel, sob a GPL-3.0.
  O cliente móvel também tem uma carteira de criptomoedas, integração com o Farcaster e o Apex, uma
  assinatura paga descrita abaixo.

## Onde eles diferem

### Grupos privados e comunidades públicas

Um Space do Quorum é um grupo de membros: só quem tem as chaves dele pode lê-lo, e entrar exige um
link de convite. Um link público deixa qualquer pessoa entrar, mas só mediante o ingresso. Uma
comunidade Bitsocial não tem o conceito de membro. Qualquer pessoa pode lê-la, de qualquer app, sem
ingressar, e qualquer pessoa pode tentar publicar, desde que passe pelo desafio da comunidade.

### O que mantém um grupo online

Um Space do Quorum não tem nó host. Os membros enviam mensagens pelo serviço do Quorum, o cliente de
cada membro guarda uma cópia, e o dono não precisa estar online para que os outros conversem. Uma
comunidade Bitsocial fica no nó de seu dono, que aceita ou rejeita cada post e publica o estado mais
recente da comunidade. A comunidade continua legível enquanto houver peers fazendo seed dela, mas
não consegue aceitar novos posts enquanto seu nó estiver offline. Veja
[Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Quem aplica as regras

No Quorum, as regras são aplicadas na borda. O cliente de cada membro decide, com base no papel de
quem assinou, se aplica uma exclusão, uma fixação ou um silenciamento, e uma expulsão funciona
movendo todos os demais para chaves novas. No Bitsocial, as regras são aplicadas no nó da
comunidade: um post que não passa pelo desafio ou pelas regras da comunidade nunca chega a fazer
parte dela. Veja [Moderação local, não proibições globais](/local-moderation/).

### Controle de spam

O Quorum mantém o spam do lado de fora principalmente por meio de convites. Um link de uso único
admite uma pessoa, um link público admite qualquer pessoa que o tenha, e o dono pode expulsar
membros e trocar as chaves depois; o cliente também limita a taxa dos próprios envios. As
identidades do Bitsocial são pares de chaves gratuitos, então cada comunidade escolhe um desafio a
ser executado antes de aceitar um post, como um captcha, um pagamento, um saldo de tokens ou uma
lista de permissão. Veja [Desafios antispam personalizados](/custom-challenges/).

### O cliente e a rede

Um app do Quorum é um cliente do serviço do Quorum, que a Quilibrium Inc. opera. Os apps não entram
por conta própria em uma rede peer-to-peer, então chegar a um Space depende desse único endpoint.
Por trás dele, o Quilibrium é uma rede à parte: em outubro de 2026, seu
[explorador](https://dashboard.quilibrium.com/) mostrava 114 peers alcançáveis e 181 provers
distribuídos por 99 shards.

Um app web do Bitsocial pode rodar um nó libp2p na aba, buscar conteúdo de comunidades em peers e
publicar via gossipsub. A descoberta de peers passa por roteadores HTTP que só retornam endereços de
provedores; qualquer pessoa pode rodar um, e os clientes podem trocar de roteador mudando sua
configuração. Veja [Peer-to-peer no navegador](/browser-p2p/).

### Economia

O Quilibrium tem um token no centro. O QUIL é minerado pelos nós e paga as taxas da rede, e uma
versão encapsulada (wrapped), o wQUIL, circula no Ethereum. O Quorum em si é gratuito e não exige
pagamento nem número de telefone. Sua assinatura opcional Apex custa
[$5 por mês](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
é paga em wQUIL, SNAP ou USDC no Ethereum e é dividida entre a Quilibrium Inc. e quatro Spaces
escolhidos pelo assinante. O Bitsocial não tem camada de pagamento no protocolo; uma comunidade pode
exigir um pagamento ou um token por meio do seu desafio.

### Mensagens privadas

É aqui que o Quorum leva vantagem. As mensagens diretas e as mensagens dos Spaces têm criptografia
de ponta a ponta com sigilo encaminhado (forward secrecy), e o conteúdo das mensagens só chega ao
serviço do Quorum como texto cifrado. O Bitsocial se concentra em comunidades públicas e ainda não
tem mensagens diretas nativas. Um post do Bitsocial é criptografado para a chave do nó da comunidade
enquanto trafega pelo pubsub, mas, uma vez aceito, é público.

## Situação do projeto

Em outubro de 2026, o repositório do Quorum chamava o app web de beta, e o site do Quorum ainda
listava os apps para Google Play e App Store como em breve. Os dois clientes também divergem: o app
móvel tem os recursos de carteira, Farcaster e Apex, enquanto o cliente web e desktop mostra suas
páginas Wallet e Farcaster como em breve, e os dois recuperam o histórico dos Spaces de formas
diferentes.

A mainnet do Quilibrium chegou à versão 2.1 em 30 de setembro de 2025, quando a rede voltou a
funcionar após uma paralisação ([anúncio](https://x.com/QuilibriumInc/status/1973082817236984270)).
Em 2026, o nó foi reescrito em Rust, com assinaturas pós-quânticas para o consenso e um protocolo de
comunicação que os nós mais antigos não falam. Partes da documentação descrevem o projeto, e não o
código em execução: elas descrevem o
[roteamento por mixnet](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/), mas
no nó 2.1.0.25 o serviço de mixnet é um
[stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31)
que aceita mensagens sem misturá-las.

## Comparação

| Pergunta                      | Quorum                                                                                              | Bitsocial                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Categoria                     | Mensageiro de grupo com criptografia de ponta a ponta na rede Quilibrium                            | Rede de comunidades peer-to-peer                                                                                |
| Identidade                    | Conjunto de chaves mestre Ed448 mais chaves por dispositivo, protegidas por uma chave de acesso     | Pares de chaves Ed25519 para usuários e comunidades                                                             |
| Quem pode ler                 | Membros que têm as chaves de um Space                                                               | Qualquer pessoa, de qualquer app                                                                                |
| Onde ficam as mensagens       | O dispositivo de cada membro; o cliente móvel também reproduz um log mantido pelo serviço do Quorum | O nó do dono da comunidade e os peers que a leem e fazem seed dela                                              |
| A que os clientes se conectam | O serviço do Quorum em `api.quorummessenger.com`                                                    | Peers via libp2p, inclusive a partir de uma aba do navegador                                                    |
| Comunidades                   | Spaces com canais, papéis e links de convite                                                        | Objetos de primeira classe cujo nó aceita ou rejeita posts                                                      |
| Controle de spam              | Links de convite, expulsões com troca de chaves, limites de taxa no cliente                         | O desafio de cada comunidade antes de um post ser aceito                                                        |
| Moderação                     | Papéis aplicados pelo cliente de cada membro; o dono expulsa                                        | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram                               |
| Mensagens privadas            | Mensagens diretas com criptografia de ponta a ponta                                                 | Comunidades públicas; ainda sem mensagens diretas nativas                                                       |
| Economia                      | Token de rede QUIL; assinatura opcional Apex de $5 por mês                                          | Nenhuma no protocolo; um desafio pode exigir um pagamento ou token                                              |
| Contrapartida principal       | Grupos privados e criptografados, mas todo cliente depende de um único serviço                      | Identidades gratuitas e acesso pelo navegador, mas sem mensagens privadas e só o estado mais recente é guardado |
