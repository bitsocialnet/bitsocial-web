---
title: Bitsocial e Lapis Net
description: Como o Lapis Net, um protocolo social peer-to-peer em Kotlin com pontuações de confiança por leitor e visibilidade lastreada em Bitcoin, se compara ao Bitsocial.
---

# Bitsocial e Lapis Net

O [Lapis Net](https://net.lapisproject.dev/) é um protocolo de rede social peer-to-peer escrito em
Kotlin para a JVM. Ele chegou de forma independente a bases próximas às do Bitsocial: identidades
baseadas em pares de chaves, armazenamento de conteúdo no estilo IPFS e gossipsub do libp2p. Os dois
diferem em onde colocam a filtragem de spam e a curadoria. O Lapis dá a cada leitor um grafo de
confiança pessoal e deixa pagamentos em Bitcoin e Lightning aumentarem a visibilidade; o Bitsocial
deixa cada comunidade decidir o que pode ser publicado.

O Lapis é um protótipo funcional. Em outubro de 2026, ele ainda não tinha rede pública, e conectar
dois nós era um passo manual, segundo seu
[repositório](https://github.com/lapisproject-dev/Lapis-Net).

## Como o Lapis funciona

- **Identidades.** Cada identidade é um par de chaves secp256k1, compatível com chaves Bitcoin, com
  uma chave Ed25519 vinculada a ele para o peer ID do libp2p.
- **Armazenamento e propagação.** O conteúdo é armazenado com o Nabu, uma implementação de IPFS sobre
  libp2p (DHT e Bitswap), e propagado com o gossipsub do libp2p.
- **Pontuações.** Quatro pontuações opcionais ficam sobre um núcleo que permanece neutro quanto à
  curadoria:
  - Veritas, uma rede de confiança (web of trust) calculada a partir do grafo de confiança de cada
    leitor
  - Virtus, visibilidade lastreada em provas de pagamento on-chain ou via Lightning que perdem força
    com o tempo
  - Karma, curtidas gratuitas ponderadas pelo Veritas
  - Madli, uma pontuação de reputação que os nós mantêm sobre o comportamento uns dos outros
- **Mensagens.** Mensagens diretas com criptografia de ponta a ponta, chamadas de voz individuais e um
  sistema de mensagens assíncronas semelhante ao e-mail fazem parte do projeto.
- **Clientes.** Cada usuário roda um nó JVM. O cliente de referência é uma interface web servida por
  esse nó local.

## Onde eles diferem

### Quem filtra o spam

O Lapis filtra no leitor. O conteúdo se propaga e, depois, o grafo de confiança de cada leitor e as
regras de pagamento do app que ele usa decidem o que aparece. O Bitsocial filtra na comunidade: um
post precisa passar no desafio da comunidade antes que o nó da comunidade o aceite, então o spam
rejeitado nunca passa a fazer parte da comunidade. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Quem detém o poder

No Lapis, cada leitor decide em quem confia, e o operador de cada app decide como a visibilidade paga
funciona ali. No Bitsocial, o dono de uma comunidade define as regras daquela comunidade, e os apps
escolhem o que mostram. Nenhum dos dois tem um administrador no nível do protocolo.

### Economia

O Lapis incorpora provas de pagamento em Bitcoin e Lightning à sua pontuação de visibilidade. O
Bitsocial não tem camada de pagamento no protocolo; uma comunidade pode exigir um pagamento ou um
token por meio do seu desafio.

### Navegador

Os apps Bitsocial podem rodar um nó peer-to-peer dentro de uma aba comum do navegador. Veja
[Peer-to-Peer no navegador](/browser-p2p/). A interface de navegador do Lapis é uma página local
servida pelo nó JVM do usuário.

### Escopo

O Lapis reúne mensagens diretas, chamadas de voz e e-mail. O Bitsocial se concentra em comunidades
públicas e ainda não tem mensagens diretas nativas.

## Comparação

| Pergunta                | Lapis Net                                                                                      | Bitsocial                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Categoria               | Protocolo social peer-to-peer (protótipo)                                                      | Rede de comunidades peer-to-peer                                                        |
| Identidade              | Par de chaves secp256k1 com um peer ID Ed25519 vinculado                                       | Pares de chaves Ed25519 para usuários e comunidades                                     |
| Onde ficam os posts     | Armazenamento Nabu (IPFS sobre libp2p) nos nós participantes                                   | O nó do dono da comunidade e os peers que a leem e fazem seed dela                      |
| Comunidades             | Nenhum objeto de comunidade; a curadoria acontece por leitor e por app                         | Objetos de primeira classe cujo nó aceita ou rejeita posts                              |
| Controle de spam        | Grafo de confiança do leitor, visibilidade paga, depósitos Lightning para primeiras mensagens  | O desafio de cada comunidade antes de um post ser aceito                                |
| Moderação               | O grafo de confiança de cada leitor; operadores de apps definem as regras de visibilidade paga | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram       |
| Economia                | Provas de pagamento em Bitcoin e Lightning nas pontuações                                      | Nenhuma no protocolo; um desafio pode exigir um pagamento ou token                      |
| Navegador               | Interface web local servida por um nó JVM                                                      | Nó peer-to-peer dentro de uma aba comum do navegador                                    |
| Rede                    | Protótipo sem rede pública                                                                     | Rede ativa com apps como [5chan](/apps/5chan/) e [Seedit](/apps/seedit/)                |
| Contrapartida principal | Reputação e mensagens embutidas e completas, mas ainda sem rede pública                        | Núcleo menor que roda em navegadores, mas sem reputação nem mensagens diretas embutidas |

## Eles poderiam funcionar juntos?

Os desafios do Bitsocial são código arbitrário, então uma pontuação de confiança no estilo do Lapis
poderia virar um deles. O desafio embutido `whitelist` já consegue ler listas de endereços
permitidos a partir de URLs. Um serviço que publicasse os endereços Bitsocial em que um grafo Veritas
confia poderia deixar esses autores pularem um CAPTCHA em uma comunidade. Isso exigiria uma forma de
vincular uma identidade Lapis a um endereço Bitsocial, e nada parecido existe hoje.
