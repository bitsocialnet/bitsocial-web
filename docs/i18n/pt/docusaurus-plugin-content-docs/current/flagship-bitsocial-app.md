---
title: Descentralizar o Twitter/X
description: "Fase 3 do plano mestre: uma alternativa descentralizada e focada ao Twitter/X para conversas públicas centradas em texto, com infraestrutura substituível."
---

# Descentralizar o Twitter/X

A Fase 3 é um plano para criar uma alternativa descentralizada e focada ao Twitter/X. O centro é a conversa pública baseada primeiro em texto: posts curtos, respostas, republicações, perfis seguidos, discussões em tempo real e comunidades, com a camada da plataforma aberta.

O Twitter/X continua definido por posts, texto e compartilhamento de ideias. O cliente da Fase 3 deve competir nessa experiência central e fazê-la funcionar excepcionalmente bem.

Esta página descreve a direção do produto, não uma especificação de lançamento fechada. A interface exata, o feed padrão, o modelo de anúncios, os recursos de AI e o mercado de RPC podem mudar à medida que o protocolo e os primeiros aplicativos amadurecem.

## O que deveria provar

O cliente deve provar que uma rede social baseada em perfis pode evitar se tornar uma plataforma custodial:

- os usuários podem possuir identidades e perfis
- comunidades e nós de perfil podem permanecer ponto a ponto
- comunidades podem transmitir efeitos de rede entre clientes Bitsocial
- Os provedores de RPC podem tornar o aplicativo conveniente sem assumir a custódia
- algoritmos de feed podem ser serviços opcionais em vez de lei de plataforma
- outros clientes ainda podem competir pela mesma rede

O objetivo é construir o melhor cliente possível para conversas públicas e mostrar até onde o protocolo pode chegar.

## Familiar no propósito, substituível por design

A experiência padrão deve competir com o núcleo do Twitter/X: um feed inicial rápido, posts de texto, perfis seguidos, respostas, distribuição por republicações, comunidades, notificações, busca e uma visualização For You ranqueada que funcione de imediato.

Bitsocial Forge pode executar o primeiro RPC padrão e serviço de feed. Esse padrão pode incluir um feed classificado e anúncios para que o aplicativo pareça completo no primeiro dia, em vez de pedir aos usuários comuns que montem toda a pilha sozinhos.

A diferença é que o padrão não deve se tornar uma prisão. O usuário deve poder trocar RPCs, feeds, instâncias, sistemas de ranqueamento, anúncios e provedores de descoberta, ou remover totalmente o ranqueamento. O cliente pode ter escolhas claras no primeiro uso e ainda manter todos os serviços importantes substituíveis.

Isso torna o cliente mais personalizável do que uma plataforma convencional. Um usuário pode manter o feed ranqueado padrão com anúncios. Outro pode usar um feed cronológico sem ranqueamento. Outro pode escolher um RPC voltado à privacidade, um serviço de descoberta administrado pela comunidade, um feed pago sem anúncios ou um algoritmo de nicho criado para uma subcultura específica.

## Comunidades entre clientes

As comunidades deveriam ser muito mais importantes do que grupos isolados dentro de um aplicativo.

No X/Twitter, as comunidades estão confinadas dentro do X. Elas podem ser úteis, mas herdam os limites de uma plataforma, um sistema de conta, uma pilha de recomendações e uma superfície de produto.

Uma comunidade Bitsocial pode ser criada, hospedada, descoberta e usada por diferentes clientes. Isso significa que o cliente da Fase 3 pode mostrar comunidades e posts da rede Bitsocial mais ampla, não apenas de usuários que começaram dentro dele. Uma comunidade pode reunir ao mesmo tempo atividades de um cliente de imageboard, um cliente de discussão ao estilo Reddit, um cliente de fórum de nicho, um aplicativo móvel e o cliente da Fase 3.

Essa é a principal vantagem do efeito de rede: um cliente pode se sentir familiarizado com os usuários convencionais e, ao mesmo tempo, extrair valor de muitos clientes, nós da comunidade, provedores de RPC e serviços independentes.

## Algoritmos de feed opcionais

O cliente da Fase 3 não deve impor um único sistema global de ranqueamento a todos.

Os algoritmos de feed devem ser opcionais. Um usuário pode escolher um algoritmo de um mercado, trocar de provedor, usar um algoritmo de uma empresa, usar um executado por um operador anônimo, usar um criado por uma comunidade, executar um algoritmo pessoal ou não usar nenhum algoritmo.

Os provedores públicos de RPC são um lugar natural para a concorrência desses serviços. Eles podem indexar, classificar e recomendar conteúdo, mas não devem ser proprietários do usuário ou do perfil.

Esses serviços também podem competir no formato do próprio aplicativo. Um RPC pode fornecer um feed classificado com anúncios. Outro pode fornecer um feed cronológico não classificado. Outro pode se especializar em privacidade, tradução, moderação, descoberta de comunidade ou gráfico social de nicho.

Se a economia funcionar, os serviços de feed apoiados por RPC poderiam adicionar recursos de IA semelhantes aos que as principais plataformas estão tentando colocar em seus feeds: traduções automáticas, resumos, respostas assistidas por bot, respostas de pesquisa, assistência de moderação ou contexto de estilo de nota da comunidade.

Esses recursos devem ser escolhas de serviço e não requisitos de protocolo. Um RPC padrão pode competir oferecendo um feed mais rico, mas os usuários e clientes concorrentes ainda devem poder escolher alternativas mais simples, privadas, cronológicas, sem anúncios ou específicas da comunidade.

## RPC sem custódia

Cada usuário deve poder participar como um nó ponto a ponto completo por meio de RPC sem conceder ao provedor de RPC a propriedade sobre sua identidade ou perfil.

O caminho hospedado é importante porque a maioria dos usuários não começará executando um servidor. O caminho de saída é igualmente importante: um usuário deve ser capaz de migrar para seu próprio nó de perfil em hardware de baixa especificação, incluindo um Raspberry Pi, sempre que desejar.

Essa é a diferença entre conveniência e custódia.

## Conversa pública fortalecida pela Bitsocial Chain

A Bitsocial Chain pode levar nomes duráveis, pagamentos, gorjetas, prêmios e outros recursos financeiros diretamente para a conversa pública.

O cliente da Fase 3 permanece centrado em posts, texto, compartilhamento de ideias e discussões em tempo real, enquanto compartilha comunidades e efeitos de rede com outros clientes Bitsocial.
