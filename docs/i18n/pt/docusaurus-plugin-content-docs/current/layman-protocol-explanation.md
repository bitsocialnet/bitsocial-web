---
title: Uma explicação completa para leigos do protocolo Bitsocial
description: Um passo a passo em inglês simples das comunidades Bitsocial, pesquisa de pares, publicação, desafios anti-spam, moderação e aplicativos.
---

# Uma explicação completa para leigos do protocolo Bitsocial

Esta página explica o Bitsocial sem presumir que você já entenda redes ponto a ponto, chaves criptográficas, IPFS ou pubsub.

Alguns detalhes são simplificados propositalmente. Para a versão mais técnica, leia a página [Protocolo ponto a ponto](./peer-to-peer-protocol.md).

## A versão curta

Bitsocial é um protocolo para aplicativos sociais onde as comunidades pertencem a chaves e não a um banco de dados da empresa.

Uma comunidade Bitsocial tem um endereço. Os aplicativos usam esse endereço para encontrar pares que atendem à comunidade, buscar as postagens mais recentes desses pares e publicar novas postagens por meio de um canal de mensagens ponto a ponto. Antes de uma postagem ser aceita, a comunidade pode exigir um desafio anti-spam, como captcha, código de convite, pagamento, verificação de token, verificação de moderação de IA, lista de permissões ou qualquer outra regra que possa ser codificada.

Essa é a ideia central:

1. Uma comunidade é controlada por uma chave privada.
2. A chave pública dá à comunidade um endereço estável.
3. Os pares ajudam os leitores a encontrar e buscar a comunidade.
4. Um nó da comunidade aceita ou rejeita novas postagens.
5. A política anti-spam pertence a cada comunidade, não a uma plataforma global.

## Por que os hashes são importantes

Um hash é uma impressão digital curta para dados.

Se duas pessoas fizerem hash exatamente do mesmo arquivo, elas obterão a mesma impressão digital. Se o arquivo for alterado, a impressão digital também será alterada. Isso torna os hashes úteis para localizar e verificar dados sem confiar que uma empresa lhe dirá qual é o arquivo.

Os sistemas peer-to-peer usam essa ideia constantemente. Em vez de solicitar a um site "o arquivo chamado photo.png", um peer pode solicitar à rede os dados com uma impressão digital específica. Se outro par retornar dados errados, a verificação de hash falhará.

O Bitsocial usa hashes e identificadores de conteúdo para postar dados e outras partes do estado da comunidade. O ponto importante é simples: os dados podem ser tratados pelo que são, e não apenas pelo local onde a empresa os hospedou.

## Por que as chaves públicas são importantes

Uma chave pública e uma chave privada são um par correspondente.

A chave privada é secreta. É o que dá controle. A chave pública é segura para ser compartilhada. Ele permite que todos verifiquem se uma mensagem, atualização ou ação de moderação realmente veio da chave privada correspondente.

É assim que o Bitsocial evita contas normais da plataforma. Uma empresa não precisa emitir a identidade. Uma linha do banco de dados não precisa definir o proprietário. O par de chaves é a autoridade.

Em termos simples:

- a chave privada é o identificador de controle do proprietário
- a chave pública é a identidade ou endereço público
- assinaturas provam que uma ação veio do proprietário

## O que é uma comunidade Bitsocial

Uma comunidade Bitsocial não é apenas uma página em um aplicativo.

Possui seu próprio par de chaves. A chave pública fornece à comunidade um endereço de rede estável. A chave privada controla as atualizações do estado da comunidade, como metadados, regras, lista de moderadores, configuração do desafio e ponteiros para o conteúdo aceito mais recente.

Isso significa que uma comunidade pode sobreviver a uma interface. Um aplicativo pode mostrá-lo como um quadro. Outro aplicativo pode mostrá-lo como um fórum. Um aplicativo futuro pode mostrá-lo em um feed baseado em perfil. O aplicativo pode mudar, mas o endereço da comunidade ainda aponta para a mesma comunidade de propriedade.

## Como funciona a leitura

Quando um usuário abre uma comunidade Bitsocial, o aplicativo não solicita a página a um banco de dados central.

O fluxo está mais próximo disso:

1. O aplicativo já conhece o endereço da comunidade ou o obtém de uma lista, link, superfície de pesquisa ou
   nome legível por humanos.
2. O aplicativo pergunta aos roteadores leves quais peers fornecem atualmente esse endereço de comunidade.
3. Os roteadores retornam apenas endereços de pares. Eles não retornam postagens, regras, perfis ou comunidade
   metadados.
4. O aplicativo se conecta a pares e busca o estado mais recente da comunidade.
5. Esse estado contém ponteiros para postar conteúdo.
6. O aplicativo busca o conteúdo da postagem de colegas e o renderiza em uma interface social normal.

O roteador é apenas um auxiliar de pesquisa. Está mais perto de perguntar "quem tem isso?" do que perguntar "por favor, forneça-me todo o site".

Para mais detalhes sobre esta divisão, leia [Descoberta de conteúdo](./content-discovery.md).

## Como funciona a postagem

Postar é diferente de ler porque redes peer-to-peer abertas podem receber spam.

O Bitsocial lida com a publicação por meio de um fluxo de resposta a desafios:

1. O usuário escreve uma postagem ou resposta.
2. O aplicativo se junta ao tópico de mensagens ponto a ponto da comunidade.
3. O aplicativo pede um desafio ao nó da comunidade.
4. O nó da comunidade envia de volta o desafio.
5. O usuário ou aplicativo conclui o desafio.
6. O aplicativo envia a postagem mais a resposta do desafio.
7. O nó da comunidade verifica a resposta e a postagem.
8. Se for aprovado, o nó da comunidade aceita a postagem na próxima atualização da comunidade.
9. Outros leitores buscam o estado atualizado da comunidade dos pares.

O desafio acontece antes que o posto se torne parte do estado comunitário aceito. Essa é a diferença importante em relação aos sistemas onde o spam é aceito primeiro e ocultado depois.

## Por que os desafios anti-spam são importantes

A maioria das plataformas sociais transforma o anti-spam em política de plataforma. Uma empresa decide o que conta como conta válida, postagem válida, alcance válido ou usuário válido.

Bitsocial separa essas coisas. O protocolo dá às comunidades uma forma de exigir um desafio antes de aceitar um posto, mas não obriga todas as comunidades a usar o mesmo desafio.

Uma comunidade pode usar um captcha. Outro pode usar códigos de convite. Outro pode exigir uma verificação por SMS, um pagamento, um NFT, um saldo de token, uma pontuação de moderação de IA, uma prova de reputação, uma lista de permissões específica da comunidade ou uma regra personalizada.

Essa flexibilidade é importante porque o spam muda. Uma regra de spam em nível de protocolo torna-se obsoleta. Um desafio a nível comunitário pode evoluir sem migrar toda a rede.

Para uma explicação detalhada, leia [Desafios antispam personalizados](./custom-challenges.md).

## Como funciona a moderação

Bitsocial não é isento de moderação. É moderação sem um superadministrador global.

Uma comunidade pode ter proprietários e moderadores. Os endereços dos moderadores fazem parte do estado da comunidade. Quando um moderador realiza uma ação, essa ação pode ser assinada. O nó da comunidade e os clientes podem verificar a assinatura na lista de moderadores.

Isso dá à moderação um escopo local:

- um proprietário de comunidade controla essa comunidade
- os moderadores agem por meio de chaves que a comunidade reconhece
- os aplicativos ainda podem escolher o que indexar, classificar, ocultar ou destacar
- nenhuma conta corporativa em nível de protocolo pode apagar todas as identidades ou confiscar todas as comunidades

Na prática, isto significa que uma comunidade pode remover spam ou impor regras dentro do seu próprio espaço sem transformar as suas regras em lei para toda a rede.

Para a visão política, leia [Moderação local, não proibições globais](./local-moderation.md).

## Quais aplicativos adicionam

O protocolo não decide a aparência de todo o produto.

Um aplicativo adiciona a experiência humana em torno do protocolo:

- listas de comunidades padrão
- pesquisa e descoberta
- feeds e classificação
- interface de layout e postagem
- manipulação de mídia
- ferramentas de moderação
- embalagem para celular, desktop ou navegador
- modelo de negócios e padrões

É por isso que o Bitsocial pode oferecer suporte a diferentes estilos de aplicativos. O 5chan pode parecer um quadro de imagens. Seedit pode parecer uma discussão no estilo de fórum. Outros clientes podem construir diferentes superfícies de descoberta, sistemas de classificação, visualizações de moderação ou padrões de comunidade enquanto ainda usam comunidades Bitsocial compatíveis.

O protocolo mantém a propriedade e a publicação portáteis. Os aplicativos competem na qualidade do produto.

## O que o RPC público adiciona

Executar diretamente um nó da comunidade ponto a ponto é poderoso, mas nem todo mundo deseja gerenciar uma máquina sempre ativa.

RPC público é a camada de serviço que pode tornar o Bitsocial mais conveniente. Um provedor público de RPC pode ajudar os usuários a gerenciar comunidades a partir de um telefone ou de um cliente leve, enquanto o modelo de propriedade de longo prazo ainda deve permitir que os usuários se mudem, se auto-hospedem ou escolham um provedor concorrente.

A distinção é importante:

- RPC pode ajudar com tempo de atividade e conveniência
- RPC não deve se tornar custódia permanente
- o relacionamento do proprietário deve permanecer vinculado às chaves, não ao banco de dados de um provedor

## O que o Bitsocial não é

Bitsocial não é uma rede social blockchain. A mídia social não precisa que cada postagem se torne uma transação em um livro-razão global.

Bitsocial não é uma federação no sentido do ActivityPub. Uma comunidade não precisa ser uma conta em um servidor com um domínio, um administrador e um banco de dados de servidor.

Bitsocial também não é um aplicativo. É uma camada de protocolo compartilhada para aplicativos, comunidades, nós, roteadores, provedores de RPC, serviços de descoberta, módulos anti-spam e ferramentas de moderação.

A questão não é que todo usuário precise entender tudo isso antes de postar. A questão é que o produto pode parecer normal, enquanto o modelo de propriedade subjacente é diferente.

## Para onde ir a seguir

- [Protocolo ponto a ponto](./peer-to-peer-protocol.md) explica o fluxo técnico.
- [Descoberta de conteúdo](./content-discovery.md) explica pesquisa de rede versus curadoria de aplicativos.
- [Desafios antispam personalizados](./custom-challenges.md) explica o sistema de desafios.
- [Identidade e propriedade comunitária](./identity-and-ownership.md) explica o uso controlado por chave
  propriedade.
- [Construa seu próprio cliente](/build-your-own-client/) explica como aplicativos independentes podem ser construídos
  a mesma rede.
