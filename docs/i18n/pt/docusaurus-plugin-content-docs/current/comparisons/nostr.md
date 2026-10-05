---
title: Bitsocial e Nostr
description: Como o modelo baseado em relays do Nostr se compara às comunidades peer-to-peer do Bitsocial, do caminho dos dados e da identidade aos grupos, ao controle de spam e à moderação.
---

# Bitsocial e Nostr

O Nostr não se encaixa direito nem na caixa da federação nem na do blockchain. Os usuários não
recebem contas de instâncias, e não há cadeia, consenso, gás nem ordem global. O Nostr é mais bem
descrito como **mídia social baseada em relays**: os usuários têm pares de chaves, assinam eventos e
os publicam em relays, que são servidores comuns que os armazenam e servem
([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). O próprio
[README](https://github.com/nostr-protocol/nostr) do Nostr diz que ele não depende de técnicas
peer-to-peer.

Isso coloca o Nostr mais perto do Bitsocial do que os sistemas federados ou em blockchain em um ponto
importante: a identidade é criptográfica e portátil. As diferenças estão na camada de dados e em quem
controla a porta de entrada.

## Como o Nostr funciona

- **Eventos e relays.** Cada post, perfil ou reação é um evento JSON assinado. Os clientes publicam
  eventos em relays via WebSockets e se inscrevem com filtros; os relays armazenam os eventos e os
  servem de volta. Os relays não se comunicam entre si.
- **Replicação.** Os usuários costumam publicar em vários relays. Um estudo de 712 relays em 2023
  encontrou o post médio em 34,6 deles ([Wei e Tyson](https://arxiv.org/abs/2402.05709)).
- **Encontrar os posts de alguém.** Os usuários publicam uma lista dos relays em que escrevem e dos
  quais leem ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), e os clientes
  buscam os posts de um usuário nos relays de escrita dele.
- **Identidade.** Cada usuário é uma chave secp256k1 que assina com assinaturas Schnorr. As
  especificações não definem rotação nem recuperação de chaves, então perder a chave é perder a
  conta. Identificadores opcionais no formato `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) são verificados com base em um
  arquivo no servidor web desse domínio.
- **Grupos.** O mecanismo recomendado para comunidades são os grupos baseados em relays
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): um relay hospeda um grupo,
  aplica as regras de associação e de publicação antes de aceitar um post e assina os metadados do
  grupo. As comunidades mais antigas aprovadas por moderadores
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) agora estão marcadas como não
  recomendadas, em favor do NIP-29.
- **Controle de spam.** Cada relay escolhe sua barreira: prova de trabalho
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autenticação e listas de
  permissão ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pagamento ou
  limites de taxa. Os clientes acrescentam listas de silenciamento e pontuações de confiança.
- **Mídia.** Imagens e vídeos são enviados para servidores de arquivos HTTP separados.

## Onde eles diferem

### Quem armazena e serve os posts

No Nostr, os relays são a camada de armazenamento e entrega: um servidor precisa manter cada post
online. No Bitsocial, os roteadores HTTP só ajudam os clientes a encontrar peers. Eles não armazenam
posts, perfis, metadados de comunidades nem estado de moderação; os clientes buscam o conteúdo no nó
da comunidade e nos peers que fazem seed dela. Veja [Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Quem controla a porta de entrada

No Nostr, as barreiras de escrita pertencem aos operadores de relays. Fora dos grupos NIP-29, uma
chave rejeitada por um relay pode publicar o mesmo evento em qualquer relay que o aceite, e o que os
leitores veem depende dos relays que o cliente deles lê. Um grupo NIP-29 é mais parecido com uma
comunidade Bitsocial: seu relay anfitrião aceita ou rejeita posts. Ainda assim, é o relay que define o
que os papéis do grupo podem fazer, e o histórico do grupo continua preso a esse relay, a menos que
outro relay concorde em assumi-lo.

No Bitsocial, uma comunidade é um objeto criptográfico com seu próprio par de chaves. O nó da
comunidade executa o desafio que o dono escolher e publica o estado aceito na rede peer-to-peer. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Manter a infraestrutura

Um relay é um servidor com um domínio e um endpoint WebSocket, e os relays populares arcam com o
custo de armazenamento e de banda do que servem. O estudo de 2023 estimou que cerca de 95% dos relays
gratuitos não conseguiam cobrir seus custos com doações. Um nó de comunidade Bitsocial roda em
hardware doméstico, e os peers que leem uma comunidade podem ajudar a compartilhá-la.

### Navegador

Um cliente web do Nostr abre conexões WebSocket diretamente com os relays, então não é preciso um
servidor de aplicação. Um app web do Bitsocial roda um nó peer-to-peer na aba e busca o conteúdo nos
peers. Veja [Peer-to-Peer no navegador](/browser-p2p/).

### Conteúdo antigo

Os posts do Nostr são amplamente replicados entre relays, o que ajuda posts antigos a sobreviver. O
Bitsocial mantém o estado mais recente da comunidade e não garante o conteúdo antigo para sempre.

## Comparação

| Pergunta                | Nostr                                                                                                    | Bitsocial                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Categoria               | Protocolo baseado em relays                                                                              | Rede de comunidades peer-to-peer                                                  |
| Identidade              | Chave de usuário secp256k1, sem rotação nas especificações                                               | Pares de chaves Ed25519 para usuários e comunidades                               |
| Onde ficam os posts     | Relays escolhidos pelo autor, muitas vezes vários                                                        | O nó do dono da comunidade e os peers que a leem e fazem seed dela                |
| Quem mantém no ar       | Operadores de relays                                                                                     | Nó do dono da comunidade mais seeders auxiliares                                  |
| Comunidades             | Grupos hospedados em relays (NIP-29)                                                                     | Objetos de primeira classe cujo nó aceita ou rejeita posts                        |
| Controle de spam        | Política de cada relay: prova de trabalho, autenticação, pagamento, listas de permissão, limites de taxa | O desafio de cada comunidade antes de um post ser aceito                          |
| Moderação               | Políticas dos relays, listas de silenciamento nos clientes, rótulos e denúncias                          | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram |
| Nomes                   | Identificadores opcionais no formato `name@domain`, verificados via HTTPS                                | Nomes `.bso` e `.eth` que resolvem para chaves                                    |
| Navegador               | Cliente WebSocket de relays                                                                              | Nó peer-to-peer dentro de uma aba comum do navegador                              |
| Contrapartida principal | Identidade portátil e ampla replicação, mas disponibilidade e política dependentes dos relays            | Menos dependência de relays, mas o conteúdo antigo não é garantido para sempre    |
