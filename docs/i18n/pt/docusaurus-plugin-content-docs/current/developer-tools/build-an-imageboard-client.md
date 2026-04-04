---
title: Crie um cliente de imageboard
description: Guia de contribuição da fase 1 para desenvolvedores que desejam oferecer novas experiências de imageboard no Bitsocial.
sidebar_position: 1
---

# Crie um cliente de imageboard

A Fase 1 não se trata de um aplicativo oficial cobrindo toda a categoria. O 5chan é a primeira prova, mas o objetivo real é um amplo ecossistema de imageboard: vários clientes Bitsocial com diferentes linguagens visuais, padrões de moderação, modelos de diretório e comunidades-alvo.

## O que a Fase 1 precisa

- Clientes familiares no estilo 4chan para integração convencional
- Clientes inspirados no Altchan com diferentes culturas e pacotes de conselhos
- Clientes móveis ou com baixa largura de banda
- Clientes de uma única comunidade ou de nicho com fortes inadimplências opinativas
- Melhores fluxos de moderação, mídia, integração ou descoberta do que o primeiro aplicativo fornecido

## Maneira mais rápida de ajudar

Se você deseja o caminho mais curto para o envio, primeiro contribua diretamente para o 5chan:

- Explore o aplicativo ao vivo em [5chan.app](https://5chan.app)
- Revise a fonte em [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Participe do chat do construtor em [t.me/fivechandev](https://t.me/fivechandev)

## Construa seu próprio cliente

Se o 5chan não corresponder à comunidade ou interface que você deseja, crie um cliente separado. Clientes Bitsocial compatíveis podem compartilhar a mesma rede sem compartilhar as mesmas decisões de produto.

1. Aprenda as ferramentas voltadas para protocolo:
   - [Ganchos Bitsocial React](../react-hooks/)
   - [CLI Bitsocial](../cli/)
2. Decida que tipo de imageboard você está realmente construindo.
Escolha primeiro a estrutura do conselho, as premissas de identidade, o modelo de moderação, o fluxo de descoberta e a linguagem visual.
3. Escolha o caminho de implementação adequado ao projeto.
Fork 5chan se você quiser se mover rapidamente com uma base de imageboard familiar. Comece do zero se a UI ou o modelo de interação precisar ser radicalmente diferente.
4. Envie uma primeira versão estreita.
Um cliente que atende bem a uma comunidade real é mais valioso do que um clone vago destinado a satisfazer a todos.
5. Publique o resultado e deixe as comunidades testá-lo.
O Bitsocial melhora quando construtores externos enviam clientes opinativos que competem na qualidade do produto, em vez de esperar que um aplicativo oficial faça tudo.

## Princípio de design

O Bitsocial não ganha por ter um cliente abençoado. Ele vence quando muitos clientes podem coexistir, bifurcar, especializar-se e atender necessidades que o primeiro aplicativo nunca fará.
