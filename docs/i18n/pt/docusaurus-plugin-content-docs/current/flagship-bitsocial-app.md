---
title: Aplicativo Bitsocial carro-chefe
description: "O cliente Bitsocial proposto baseado em perfil: familiar como o X/Twitter por padrão, mas com RPCs, feeds, algoritmos, anúncios e comunidades substituíveis."
---

# Aplicativo Bitsocial carro-chefe

O principal aplicativo Bitsocial é o primeiro cliente baseado em perfil proposto para a rede. A comparação mais simples é: familiar como o X/Twitter por padrão, mas com a camada da plataforma aberta.

Ele adicionaria perfis, seguidores, respostas, feeds, comunidades, notificações e conversas públicas em tempo real, mantendo os serviços subjacentes substituíveis. O 5chan prova que comunidades anônimas podem funcionar. Seedit avança em direção a uma discussão persistente. O aplicativo principal traria esses efeitos de rede para um feed social convencional sem tornar uma empresa a proprietária do gráfico.

Esta página descreve a direção do produto, não uma especificação de lançamento bloqueada. A interface exata, o feed padrão, o modelo de anúncio, os recursos de IA e o mercado RPC podem mudar à medida que o protocolo e os primeiros aplicativos amadurecem.

## O que deveria provar

O aplicativo deve provar que uma rede social baseada em perfis pode evitar se tornar uma plataforma de custódia:

- os usuários podem possuir identidades e perfis
- comunidades e nós de perfil podem permanecer ponto a ponto
- comunidades podem transmitir efeitos de rede entre clientes Bitsocial
- Os provedores de RPC podem tornar o aplicativo conveniente sem assumir a custódia
- algoritmos de feed podem ser serviços opcionais em vez de lei de plataforma
- outros clientes ainda podem competir pela mesma rede

A questão não é fazer o único cliente Bitsocial. O objetivo é criar o primeiro cliente amplo que mostre até onde o protocolo pode se estender.

## Familiar por padrão, substituível por design

A experiência padrão deve ser competitiva com os principais aplicativos de conversação pública: um feed inicial rápido, seguidores, respostas, distribuição no estilo repost, comunidades, notificações, pesquisa e uma visualização classificada para você que funciona imediatamente.

Bitsocial Forge pode executar o primeiro RPC padrão e serviço de feed. Esse padrão pode incluir um feed classificado e anúncios para que o aplicativo pareça completo no primeiro dia, em vez de pedir aos usuários comuns que montem toda a pilha sozinhos.

A diferença é que a inadimplência não deve virar prisão. Um usuário deve ser capaz de trocar RPCs, feeds, instâncias, sistemas de classificação, anúncios e provedores de descoberta ou remover totalmente a classificação. O aplicativo pode ser opinativo no primeiro lançamento, mantendo todos os serviços principais substituíveis.

Isso torna o aplicativo mais personalizável do que uma plataforma convencional. Um usuário pode manter o feed classificado padrão com anúncios. Outro pode usar um feed cronológico sem classificação. Outro pode escolher um RPC focado na privacidade, um serviço de descoberta administrado pela comunidade, um feed pago sem anúncios ou um algoritmo de nicho criado para uma subcultura específica.

## Comunidades entre clientes

As comunidades deveriam ser muito mais importantes do que grupos isolados dentro de um aplicativo.

No X/Twitter, as comunidades estão confinadas dentro do X. Elas podem ser úteis, mas herdam os limites de uma plataforma, um sistema de conta, uma pilha de recomendações e uma superfície de produto.

Uma comunidade Bitsocial pode ser criada, hospedada, descoberta e usada por diferentes clientes. Isso significa que o aplicativo principal pode mostrar comunidades e postagens da rede Bitsocial mais ampla, não apenas de usuários que começaram dentro do aplicativo principal. Uma comunidade poderia ter atividades de um cliente de imageboard, um cliente de discussão estilo Reddit, um cliente de fórum de nicho, um aplicativo móvel e o aplicativo principal ao mesmo tempo.

Essa é a principal vantagem do efeito de rede: um cliente pode se sentir familiarizado com os usuários convencionais e, ao mesmo tempo, extrair valor de muitos clientes, nós da comunidade, provedores de RPC e serviços independentes.

## Algoritmos de feed opcionais

O aplicativo principal não deve impor um sistema de classificação global a todos.

Os algoritmos de feed devem ser opcionais. Um usuário pode escolher um algoritmo de um mercado, trocar de provedor, usar um algoritmo de uma empresa, usar um executado por um operador anônimo, usar um criado por uma comunidade, executar um algoritmo pessoal ou não usar nenhum algoritmo.

Os provedores públicos de RPC são um lugar natural para a concorrência desses serviços. Eles podem indexar, classificar e recomendar conteúdo, mas não devem ser proprietários do usuário ou do perfil.

Esses serviços também podem competir no formato do próprio aplicativo. Um RPC pode fornecer um feed classificado com anúncios. Outro pode fornecer um feed cronológico não classificado. Outro pode se especializar em privacidade, tradução, moderação, descoberta de comunidade ou gráfico social de nicho.

Se a economia funcionar, os serviços de feed apoiados por RPC poderiam adicionar recursos de IA semelhantes aos que as principais plataformas estão tentando colocar em seus feeds: traduções automáticas, resumos, respostas assistidas por bot, respostas de pesquisa, assistência de moderação ou contexto de estilo de nota da comunidade.

Esses recursos devem ser escolhas de serviço e não requisitos de protocolo. Um RPC padrão pode competir oferecendo um feed mais rico, mas os usuários e clientes concorrentes ainda devem poder escolher alternativas mais simples, privadas, cronológicas, sem anúncios ou específicas da comunidade.

## RPC sem custódia

Cada usuário deve poder participar como um nó ponto a ponto completo por meio de RPC sem conceder ao provedor de RPC a propriedade sobre sua identidade ou perfil.

O caminho hospedado é importante porque a maioria dos usuários não começará executando um servidor. O caminho de saída é igualmente importante: um usuário deve ser capaz de migrar para seu próprio nó de perfil em hardware de baixa especificação, incluindo um Raspberry Pi, sempre que desejar.

Essa é a diferença entre conveniência e custódia.

## Por que pode se tornar um aplicativo para tudo

Se a Bitsocial Network fornecer aos aplicativos nomes, pagamentos, gorjetas, prêmios e outros recursos financeiros duráveis, o aplicativo principal poderá se tornar muito mais do que um cliente de feed.

A restrição importante é que o aplicativo não se torne o novo proprietário da rede. Pode ser um cliente grande, talvez até o cliente mais popular, mas ainda deixa espaço para aplicativos concorrentes, RPCs concorrentes, algoritmos de feed concorrentes e nós de perfil auto-hospedados.
