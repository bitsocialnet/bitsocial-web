---
title: Bitsocial e Farcaster
description: Como o Farcaster, com contas onchain, aluguel de armazenamento e a rede de validadores Snapchain, se compara às comunidades peer-to-peer do Bitsocial.
---

# Bitsocial e Farcaster

O [Farcaster](https://docs.farcaster.xyz/) mantém a identidade em um blockchain e os dados sociais
fora dele. Contas, chaves de app e pagamentos de armazenamento ficam em contratos na OP Mainnet, uma
layer 2 do Ethereum. Os posts, chamados de casts, junto com follows e reações, são mensagens
assinadas armazenadas pela [Snapchain](https://snapchain.farcaster.xyz/), uma rede parecida com um
blockchain que substituiu a antiga rede de Hubs do Farcaster em 2025.

## Como o Farcaster funciona

- **Contas.** Uma conta é um Farcaster ID numérico controlado por um endereço Ethereum, que também
  pode definir um endereço de recuperação. Os apps publicam com chaves de app delegadas registradas
  onchain; uma chave de app não consegue tomar a conta.
- **Aluguel de armazenamento.** Toda conta aluga unidades de armazenamento, atualmente a US$ 0,20 por
  unidade por ano. Uma unidade alugada desde julho de 2025 comporta 100 casts; além disso, os casts
  mais antigos são removidos. Os limites de taxa aumentam conforme o armazenamento alugado.
- **Snapchain.** Validadores ordenam as mensagens em blocos com consenso no estilo Tendermint, e cada
  nó completo guarda os dados da rede inteira. Os nós precisam de cerca de 16 GB de RAM e 2 TB de
  armazenamento, segundo o [guia do nó](https://snapchain.farcaster.xyz/getting-started).
- **Nomes.** Os nomes de usuário padrão, chamados fnames, são gratuitos e emitidos pelo próprio
  servidor de nomes do Farcaster, que
  [pode revogá-los](https://docs.farcaster.xyz/learn/what-is-farcaster/usernames). Os usuários podem,
  em vez disso, usar um nome `.eth` registrado no Ethereum.
- **Canais.** Canais temáticos são um recurso experimental do cliente Farcaster. Os casts em um canal
  são dados do protocolo, mas os metadados do canal, os follows e a moderação
  [ficam armazenados no cliente](https://docs.farcaster.xyz/learn/what-is-farcaster/channels).
- **Leitura.** Os apps leem por meio de um nó Snapchain que eles mesmos rodam ou de um provedor
  gerenciado, geralmente a Neynar.

## Onde eles diferem

### Blockchains e validadores

O Farcaster depende da OP Mainnet para contas e pagamentos, e da Snapchain, uma rede parecida com um
blockchain, para ordenar todos os dados sociais. O conjunto de validadores da Snapchain é
permissionado. Seu whitepaper diz que a censura fica difícil com cerca de dez validadores
distribuídos globalmente; em outubro de 2026, a
[lista de validadores](https://snapchain.farcaster.xyz/validators) era menor, e a maioria das chaves
pertencia à Neynar, que [adquiriu o Farcaster](https://neynar.com/blog/neynar-is-acquiring-farcaster)
em janeiro de 2026. O Bitsocial não tem cadeia, validadores nem consenso.

### Pagar para publicar

Toda conta do Farcaster paga aluguel de armazenamento, e o armazenamento limita quanto do histórico de
uma conta a rede mantém. No Bitsocial, publicar não custa nada no nível do protocolo; cada comunidade
decide se vai exigir um captcha, um pagamento, um token ou outra coisa. Veja
[Desafios antispam personalizados](/custom-challenges/).

### Comunidades

Os canais do Farcaster são um recurso do cliente: o cliente armazena seus metadados e aplica a
moderação dos canais, então um cast bloqueado em um canal pode continuar válido na rede e visível em
outros apps. No Bitsocial, as comunidades são objetos do protocolo com seu próprio par de chaves, e o
nó da comunidade aceita ou rejeita posts.

### Manter a infraestrutura

Um nó do Farcaster guarda a rede inteira, então seu armazenamento cresce com toda a atividade; o
Farcaster projeta um crescimento rumo aos maiores discos da nuvem. Um nó de comunidade Bitsocial
guarda apenas as próprias comunidades e roda em hardware doméstico.

### Navegador

Um app de navegador do Farcaster é um cliente HTTP de um nó ou provedor. Um app web do Bitsocial pode
rodar um nó peer-to-peer dentro da aba. Veja [Peer-to-Peer no navegador](/browser-p2p/).

## Comparação

| Pergunta                | Farcaster                                                                                                      | Bitsocial                                                                                                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Categoria               | Identidade onchain com dados sociais ordenados por validadores                                                 | Rede de comunidades peer-to-peer                                                                             |
| Identidade              | Farcaster ID controlado por um endereço Ethereum, com chaves de app delegadas                                  | Pares de chaves Ed25519 para usuários e comunidades                                                          |
| Onde ficam os posts     | Snapchain, replicada em cada nó completo, dentro dos limites de armazenamento pagos                            | O nó do dono da comunidade e os peers que a leem e fazem seed dela                                           |
| Quem mantém no ar       | Validadores da Snapchain e operadores de nós                                                                   | Nó do dono da comunidade mais seeders auxiliares                                                             |
| Comunidades             | Canais experimentais gerenciados pelo cliente Farcaster                                                        | Objetos de primeira classe cujo nó aceita ou rejeita posts                                                   |
| Controle de spam        | Aluguel de armazenamento e limites de taxa, mais rótulos de spam no nível do app                               | O desafio de cada comunidade antes de um post ser aceito                                                     |
| Moderação               | Anfitriões de canais no cliente, filtros de apps, risco de censura no nível dos validadores                    | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram                            |
| Nomes                   | Fnames gratuitos que o Farcaster pode revogar, ou nomes `.eth`                                                 | Nomes `.bso` e `.eth` que resolvem para chaves                                                               |
| Navegador               | Cliente HTTP de um nó ou provedor                                                                              | Nó peer-to-peer dentro de uma aba comum do navegador                                                         |
| Contrapartida principal | Um único conjunto de dados global e consistente, mas aluguel, blockchains e um conjunto pequeno de validadores | Sem taxas nem blockchains, mas sem conjunto de dados global, e o conteúdo antigo não é garantido para sempre |
