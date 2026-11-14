---
title: Bitsocial Chain
description: Fase 3 do plano diretor, cobrindo a proposta de camada econômica em appchain L2 da Ethereum para os aplicativos Bitsocial.
---

# Bitsocial Chain

A Bitsocial Chain é a camada econômica proposta para os aplicativos Bitsocial, na forma de uma
appchain L2 da Ethereum. O site específico da chain hoje é
[chain.bitsocial.net](https://chain.bitsocial.net).

A camada social peer-to-peer permite que comunidades, identidades e conteúdo circulem fora do banco
de dados de uma plataforma central. A Bitsocial Chain deve acrescentar os primitivos compartilhados
de nomes, monetização e pagamento que tornam esses aplicativos mais difíceis de sufocar
financeiramente.

## O que ela deve viabilizar

- domínios Bitsocial descentralizados, como `.bso`
- prêmios e gorjetas
- trilhos de monetização duráveis
- liquidez compartilhada entre aplicativos
- estruturas financeiras mais difíceis de serem estranguladas por bancos ou plataformas
- efeitos de rede que não dependem de uma única empresa ser dona de toda a pilha

O objetivo não é começar pela mecânica do token. O objetivo é tornar aplicativos sociais úteis mais
duráveis, mais financiáveis e menos dependentes de provedores centralizados de pagamento ou de
nomes.

## Prova de conceito atual

A primeira prova de conceito da Bitsocial Chain se concentra em nomes `.bso` nativos. Ela demonstra
que um registro de nomes pode ser derivado do histórico da L1 da Ethereum sem colocar conteúdo
social on-chain:

- os usuários enviam intenções de registro, atualização, transferência e revogação por meio de
  transações comuns na L1 da Ethereum
- qualquer pessoa pode rodar o nó de derivação e reconstruir o mesmo estado do registro `.bso`
- um resolver mapeia um nome `.bso` para a chave pública Bitsocial que os clientes já usam no
  protocolo peer-to-peer
- posts, votos, moderação, feeds e conteúdo de comunidade continuam off-chain e peer-to-peer

Essa prova de conceito não é um lançamento Stage 2 em produção. Ela ainda não tem sistema de provas,
jogo de contestação, código auditado, implantação ao vivo, precificação final nem governança final.
Sua postura de longo prazo é transparente por padrão e compatível com privacidade por design: a
chain principal é pública, enquanto as gorjetas, pagamentos, prêmios e liquidez do futuro devem
evitar impor vínculos permanentes entre identidade social e histórico de carteira.

## Por que isso importa

Descentralizar comunidades e identidades é necessário, mas não basta para descentralizar todas as
mídias sociais.

Se os aplicativos sociais ainda dependem de uns poucos trilhos econômicos centralizados, eles
continuam fáceis de pressionar, de excluir das plataformas ou de sufocar financeiramente. A
Bitsocial Chain é a resposta proposta para essa segunda camada de dependência.

## Relação com os aplicativos

A Bitsocial Chain deve ficar sob os aplicativos Bitsocial, não substituí-los.

O resultado voltado ao público deve ser:

- as comunidades continuam peer-to-peer
- os aplicativos continuam diferenciados
- os usuários ganham recursos práticos de nomes e monetização
- criadores e comunidades podem receber apoio em diferentes clientes
- o valor pode circular pelo ecossistema sem recriar um dono de plataforma centralizado

## Por que vem depois da alternativa ao Twitter/X

O plano diretor atual coloca a Bitsocial Chain depois da alternativa ao Twitter/X, porque esse app não precisa da chain. Os perfis rodam como nós de perfil por meio de RPC não custodial, e os nomes `.bso` podem começar em um registro provisório na mainnet do Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) e migrar para a chain depois.

A Bitsocial Chain não deve trocar descentralização por um lançamento mais cedo. Ela não deve acrescentar nenhuma suposição de confiança além do próprio Ethereum: nenhuma chave de upgrade, nenhum conselho de segurança e nenhum operador capaz de censurá-la ou pará-la. O principal design para isso, um rollup nativo, depende de um upgrade do Ethereum que ainda não tem data. Até que a chain consiga atingir esse padrão, a alternativa ao Twitter/X faz crescer a base de usuários que a chain vai atender.

## Princípios de design

Como a Bitsocial Chain ainda é uma infraestrutura proposta, e não um produto lançado, o plano deve
manter disciplina:

- Aplicativos e comunidades primeiro. A camada de rede deve fortalecer produtos sociais reais.
- Recursos práticos primeiro. Nomes, prêmios, gorjetas e pagamentos são mais fáceis de explicar do
  que uma arquitetura financeira abstrata.
- Contribuição real acima do hype. Os primitivos econômicos devem recompensar participação,
  construção e apoio da comunidade.
- Curadoria é permitida. Os aplicativos podem moldar rankings, padrões e descoberta para favorecer
  comunidades duradouras.
- Os mecanismos exatos continuam em aberto. Esta página explica o papel da Bitsocial Chain, não uma
  promessa fechada sobre a economia final.
