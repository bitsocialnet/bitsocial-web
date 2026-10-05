---
title: Bitsocial e redes sociais em blockchain
description: Como Lens, DeSo e Steem colocam dados ou regras sociais em um blockchain, e por que o Bitsocial não usa um.
---

# Bitsocial e redes sociais em blockchain

Lens, DeSo e Steem colocam a atividade social em um blockchain. Contas, follows, posts ou as regras em
torno deles viram transações que validadores ordenam e armazenam. O Bitsocial não usa blockchain:
redes sociais não precisam de uma ordem global para cada post, então o Bitsocial dispensa consenso,
gás e staking. Veja [Protocolo peer-to-peer](/peer-to-peer-protocol/) para entender esse raciocínio.

## O que eles têm em comum

- **Alguém paga por cada escrita.** O Lens cobra gás, que os apps podem patrocinar; o DeSo cobra uma
  taxa por cada ação; o Steem raciona as ações conforme os tokens em stake.
- **A cadeia impõe uma única política antispam para todos.** Taxas, stake e custos de conta valem para
  toda a rede, em vez de serem escolhidos por cada comunidade.
- **Registros on-chain são permanentes.** Os apps podem ocultar conteúdo, mas não podem removê-lo da
  cadeia.
- **Navegadores são clientes de API.** Os apps web assinam transações e leem por meio de um nó,
  indexador ou API operado por outra pessoa.

## Lens

O [Lens](https://lens.xyz/) roda na Lens Chain, uma layer 2 do Ethereum construída com o ZK Stack da
ZKsync, que usa a Avail para disponibilidade de dados. A Mask Network
[é a responsável pelo Lens desde janeiro de 2026](https://lens.xyz/news/mask-network-to-steward-the-next-chapter-of-lens).

- **Na cadeia:** as contas são smart contracts, os nomes de usuário são NFTs dentro de namespaces, e
  grafos, grupos, feeds e suas regras também são contratos.
- **Fora da cadeia:** o texto e a mídia de um post ficam em um arquivo JSON em uma URI, geralmente no
  Grove, o serviço de armazenamento do Lens que fica na frente do IPFS. Reações e favoritos são
  mantidos pela Lens API, e os apps leem por meio dessa API.
- **Spam e barreiras:** as transações exigem gás em GHO, que os apps podem patrocinar com limites de
  taxa. As regras de feeds e grupos podem exigir a posse de tokens ou pagamentos.
- **Operação da cadeia:** a [L2BEAT](https://l2beat.com/scaling/projects/lens) classifica a Lens
  Chain como um validium Stage 0 com um operador centralizado que pode se recusar a incluir
  transações.

## DeSo

O [DeSo](https://docs.deso.org/) é um blockchain de layer 1 construído para apps sociais. Ele passou
de prova de trabalho para prova de participação em julho de 2024.

- **Na cadeia:** perfis, posts, curtidas, follows e mensagens diretas são todos transações armazenadas
  por cada nó completo. Imagens e vídeos ficam hospedados fora da cadeia; o nó de referência usa o
  Google Cloud Storage e o Cloudflare Stream.
- **Spam:** cada ação paga uma taxa em DESO. Novos usuários geralmente recebem DESO inicial de um nó
  após verificar o telefone.
- **Moderação:** cada nó decide o que mostra com listas negras ou cinzas, mas
  [o conteúdo permanece on-chain](https://docs.deso.org/deso-blockchain/content-moderation).
- **Comunidades:** a documentação não descreve nenhuma primitiva de comunidade ou fórum; uma
  "comunidade" é um feed com curadoria de um app.
- **Rodar um nó:** os validadores precisam de pelo menos 32 GB de RAM e 200 GB de disco, segundo o
  [guia do validador](https://docs.deso.org/deso-validators/run-a-validator).

## Steem

O [Steem](https://steem.com/) é um blockchain social que paga autores e curadores em tokens, tendo o
[Steemit](https://steemit.com/) como principal app de blog. O Hive se separou do Steem em 2020;
segundo o [whitepaper do Hive](https://hive.io/whitepaper.pdf), o fork veio após a venda da Steemit
Inc. para Justin Sun.

- **Na cadeia:** posts de texto, comentários, votos e seu histórico de edição, ordenados por 21
  witnesses eleitos que produzem um bloco a cada três segundos. As imagens ficam hospedadas fora da
  cadeia.
- **Spam:** as ações consomem Resource Credits, que crescem com o STEEM em stake. Criar uma conta
  custa STEEM; o Steemit paga por usuários que verificam um endereço de e-mail e um número de
  telefone.
- **Comunidades:** elas são
  [operações personalizadas interpretadas por um indexador](https://github.com/steemit/hivemind/blob/master/docs/communities.md)
  fora do consenso. Os moderadores podem silenciar posts, o que os oculta nos apps, mas os mantém
  on-chain.
- **Recompensas:** a inflação financia as recompensas, e votos ponderados por stake decidem como elas
  são divididas, então os grandes detentores moldam o que recebe atenção.

## Comparação

| Pergunta                | Lens                                                                               | DeSo                                                                  | Steem                                                                                | Bitsocial                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Cadeia                  | Layer 2 do Ethereum (validium com ZK Stack)                                        | Layer 1 própria, prova de participação                                | Cadeia própria, prova de participação delegada                                       | Nenhuma                                                                                    |
| Conteúdo dos posts      | JSON fora da cadeia, geralmente no Grove                                           | Texto on-chain; mídia fora da cadeia                                  | Texto on-chain; imagens fora da cadeia                                               | No nó do dono da comunidade e nos peers que a leem e fazem seed dela                       |
| Identidade              | Conta smart contract; NFTs de nome de usuário                                      | Par de chaves com um perfil on-chain                                  | Conta nomeada na cadeia com chaves em níveis                                         | Pares de chaves Ed25519 para usuários e comunidades                                        |
| Comunidades             | Grupos e feeds como contratos com regras                                           | Nenhuma primitiva de comunidade                                       | Comunidades interpretadas por um indexador fora do consenso                          | Objetos de primeira classe cujo nó aceita ou rejeita posts                                 |
| Controle de spam        | Gás (muitas vezes patrocinado), regras de token ou pagamento                       | Taxa em cada ação; fundos iniciais após verificação de telefone       | Resource Credits a partir de stake; criação de conta paga                            | O desafio de cada comunidade antes de um post ser aceito                                   |
| Moderação               | Administradores de grupos, regras on-chain, ocultação no nível da API              | Cada nó filtra o que mostra                                           | Silenciamentos em comunidades, votos negativos ponderados por stake, filtros de apps | Donos de comunidades moderam a própria comunidade; os apps escolhem o que mostram          |
| Operação                | Operador da cadeia mais a Lens API e o Grove                                       | Validadores com pelo menos 32 GB de RAM                               | Witnesses eleitos mais nós de API e de indexação                                     | Um nó de comunidade em hardware doméstico, mais seeders auxiliares                         |
| Contrapartida principal | Regras on-chain programáveis, mas conteúdo e leitura dependem dos serviços do Lens | Pool de dados aberto, mas cada ação custa uma taxa e fica para sempre | Recompensas embutidas, mas o stake molda a visibilidade e a governança               | Sem taxas nem stake, mas sem ordem global, e o conteúdo antigo não é garantido para sempre |
