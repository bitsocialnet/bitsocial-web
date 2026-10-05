---
title: Bitsocial e Reticulum
description: Como o Reticulum, a pilha de rede criptográfica para LoRa e outros enlaces de baixa largura de banda, se compara ao Bitsocial, e se o Bitsocial poderia rodar sobre ele.
---

# Bitsocial e Reticulum

O [Reticulum](https://reticulum.network/) é uma pilha de rede baseada em criptografia para construir
redes sobre qualquer meio de transmissão disponível: rádios LoRa, packet radio, conexões seriais,
Wi-Fi, Ethernet, TCP, UDP ou I2P. Ele costuma aparecer ao lado do Bitsocial porque ambos eliminam a
empresa intermediária. Eles fazem isso em camadas diferentes, então se complementam em vez de
competir.

## Camadas diferentes

O Reticulum substitui a camada de rede. Ele oferece às aplicações endpoints criptografados e
roteáveis sem endereços IP, DNS, autoridades certificadoras ou contas, e foi projetado para continuar
funcionando em enlaces tão lentos quanto 5 bits por segundo, com MTU de 500 bytes. Ele não define
posts, comunidades nem moderação; as aplicações construídas sobre ele é que acrescentam isso.

O Bitsocial é um protocolo social. Ele roda sobre a pilha IPFS/libp2p em conexões comuns de
internet, inclusive a partir de uma aba do navegador, e define comunidades, publicações e desafios
antispam por comunidade. Veja [Protocolo peer-to-peer](/peer-to-peer-protocol/) e
[Peer-to-Peer no navegador](/browser-p2p/).

Na pilha do Bitsocial, o Reticulum ficaria mais ou menos onde está o libp2p, e não onde está o
protocolo Bitsocial.

## Como o Reticulum funciona

- **Identidades.** Uma identidade Reticulum é um conjunto de chaves de 512 bits: uma chave X25519
  para criptografia e uma chave Ed25519 para assinaturas.
- **Destinos.** As aplicações criam destinos, endereçados por um hash SHA-256 truncado em 16 bytes.
  Os pacotes não carregam endereço de origem.
- **Anúncios.** Um destino se torna alcançável ao enviar um anúncio (announce). Os nós de transporte
  o repassam e memorizam o próximo salto de volta, de modo que nenhum nó precisa de um mapa da rede
  inteira.
- **Criptografia.** O tráfego é criptografado por padrão, com chaves efêmeras e sigilo
  encaminhado (forward secrecy).
- **LXMF.** A camada de mensagens [LXMF](https://github.com/markqvist/LXMF) adiciona mensagens
  assinadas, entrega direta e armazenamento e encaminhamento (store-and-forward) por meio de nós de
  propagação para destinatários que estão offline.

Entre as aplicações construídas assim estão o [Sideband](https://github.com/markqvist/Sideband), para
mensagens, e o [Nomad Network](https://github.com/markqvist/NomadNet), para mensagens e páginas
hospedadas. O manual do Reticulum mantém uma
[lista de programas](https://reticulum.network/manual/software.html).

## Comparação

| Pergunta          | Reticulum                                                                                                          | Bitsocial                                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| O que é           | Pilha de rede                                                                                                      | Protocolo social peer-to-peer e apps                                                                         |
| Projetado para    | Qualquer meio, até enlaces de rádio lentos                                                                         | Conexões de internet, inclusive abas do navegador                                                            |
| Identidade        | Conjunto de chaves X25519 e Ed25519                                                                                | Pares de chaves Ed25519 para usuários e comunidades                                                          |
| Endereços         | Hash de uma identidade e do nome de uma aplicação                                                                  | Hash da chave pública de uma comunidade                                                                      |
| Encontrar um peer | Anúncios espalhados pelos nós de transporte                                                                        | Roteadores HTTP retornam peers provedores                                                                    |
| Recursos sociais  | Adicionados por aplicações como o Nomad Network                                                                    | Comunidades, posts, respostas e moderação no protocolo                                                       |
| Controle de spam  | Limites de taxa de anúncios por interface; carimbos de proof-of-work do LXMF que um destinatário ou nó pode exigir | O desafio de cada comunidade antes de um post ser aceito                                                     |
| Entrega offline   | Nós de propagação LXMF armazenam e encaminham mensagens                                                            | Peers continuam servindo o estado mais recente de uma comunidade; publicar exige que o nó dela esteja online |

## O Bitsocial poderia rodar sobre o Reticulum?

Hoje, não. O Bitsocial não tem um transporte Reticulum, e seu modelo de dados pressupõe largura de
banda de internet: um cliente busca metadados da comunidade e conteúdo de posts junto aos peers e
troca mensagens pubsub, o que se encaixa mal em enlaces construídos em torno de pacotes de 500 bytes
e de uma vazão medida em bits ou kilobits por segundo.

O caminho realista é mais estreito: um cliente que funcione sobre uma rede mesh local enquanto
estiver desconectado e depois sincronize com a rede Bitsocial mais ampla quando um peer ou gateway
com acesso à internet estiver ao alcance. Isso seria um novo cliente com uma ponte, e não uma
mudança no protocolo, e não está no roadmap atual.

## Para desenvolvedores

O Reticulum é publicado sob a
[Reticulum License](https://reticulum.network/manual/license.html): termos no estilo MIT mais duas
restrições. O software não pode ser usado em sistemas projetados para causar danos a pessoas, nem na
criação de conjuntos de dados de treinamento de IA ou aprendizado de máquina. Leia a licença antes
de empacotar código do Reticulum em um app Bitsocial.

A implementação de referência é [escrita em Python](https://github.com/markqvist/Reticulum). Os
mantenedores do Reticulum alertam que vários ports não oficiais do Reticulum e do LXMF foram gerados
por máquina e trazem declarações de licença que eles consideram nulas, então prefira a implementação
de referência ou os programas listados no manual.
