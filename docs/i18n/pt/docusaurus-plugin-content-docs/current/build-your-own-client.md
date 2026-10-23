---
title: Crie seu próprio cliente Bitsocial
description: Guia para quem quer lançar clientes Bitsocial independentes, de imageboards e fóruns a aplicativos sociais de nicho.
---

# Crie seu próprio cliente Bitsocial

O Bitsocial não vence por ter um aplicativo oficial para cada caso de uso. Ele vence quando muitos
clientes conseguem compartilhar o mesmo protocolo enquanto competem em interface, cultura,
descoberta, padrões e modelo de negócio.

5chan e Seedit são as primeiras provas de conceito, não um teto. Quem desenvolve deve conseguir
lançar um novo imageboard, um fórum, um cliente de perfis, um aplicativo social pensado primeiro
para o celular, uma ferramenta para comunidades de nicho ou um cliente centralizado que usa o
Bitsocial por baixo, sem pedir permissão ao dono de nenhuma plataforma.

## O que os desenvolvedores podem mudar

Um cliente Bitsocial pode competir em decisões de produto sem bifurcar a rede inteira:

- interface e linguagem visual
- fluxo de entrada de novos usuários
- padrões da comunidade
- superfícies de moderação
- modelo de descoberta
- experiência de mídia
- restrições de celular, desktop ou baixa largura de banda
- monetização e modelo de negócio

A camada comum é o protocolo. A camada de produto está aberta à concorrência.

## O jeito mais rápido de aprender

Comece pelos aplicativos que já existem:

- Experimente o [5chan](https://5chan.app) para comunidades de imageboard anônimas.
- Experimente o [Seedit](https://seedit.app) para discussões no estilo do Reddit.
- Leia a documentação dos [hooks React do Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) para integração
  no lado do cliente.
- Leia a documentação da [CLI do Bitsocial](/developer-tools/cli/) para operações de nó e de
  comunidade.

Se quiser avançar rápido, contribua primeiro com um aplicativo existente. Se a interface, a cultura
ou o modelo de comunidade que você quer não couberem ali, construa um cliente separado.

## Escolha uma primeira versão bem restrita

A melhor primeira versão não é um aplicativo social universal. É um cliente com um público claro e
um motivo forte para existir.

Bons pontos de partida incluem:

- um cliente de imageboard mais limpo para uma cultura específica
- um cliente de fórum pensado primeiro para o celular
- um aplicativo de comunidade única com padrões rígidos
- um cliente para comunidades de criadores
- um cliente de descoberta somente leitura
- um console de moderação ou de operação
- um cliente otimizado para um idioma, uma região ou uma classe de dispositivos

Clientes pequenos são úteis porque o Bitsocial permite que eles cresçam dentro da mesma rede em vez
de prender seus usuários em um banco de dados privado.

## Caminhos de implementação

Existem três caminhos práticos:

1. Bifurcar um cliente existente quando sua ideia for próxima do 5chan ou do Seedit.
2. Construir um novo cliente React com os [hooks React do Bitsocial](https://hooks.bitsocial.net/).
3. Construir sua própria integração sobre as APIs de nó e a infraestrutura pública de RPC.

O RPC público deve tornar o terceiro caminho bem mais viável. Um usuário pode começar por um
provedor de RPC hospedado e não custodial e depois migrar para auto-hospedagem ou para um provedor
concorrente.

## Princípio de design

Construa o cliente que deveria existir para a sua comunidade e deixe que os clientes compatíveis
compitam em público.
