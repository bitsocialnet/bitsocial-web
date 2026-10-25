---
title: Diretórios
description: Como os aplicativos Bitsocial permitem que comunidades disputem um nome de tema em vez de deixá-lo com quem o reivindicou primeiro.
---

# Diretórios

No Reddit, um nome como `r/opensource` só pode pertencer a uma comunidade, e quem o controla fica com ele. Se os moderadores tomarem decisões de que os usuários não gostam, a única alternativa é criar `r/opensource2`. A nova comunidade começa com zero inscritos, embora a maioria das pessoas inscritas em `r/opensource` se importasse com código aberto, e não com aquela equipe de moderação específica.

Os aplicativos Bitsocial evitam isso com **diretórios**. Um diretório é um nome de tema, como `opensource`, que as comunidades disputam. A rota curta desse nome abre a comunidade que estiver em primeiro lugar no momento, de modo que uma comunidade melhor pode assumir o nome sem pedir permissão a ninguém.

## Como funciona

1. **Um código de diretório é um nome de tema.** O Seedit usa rotas como `/s/funny`. O 5chan usa caminhos de imageboard como `/g/`.
2. **As comunidades competem como candidatas.** Cada diretório tem uma lista de comunidades candidatas, cada uma com seu próprio endereço exato, como `funny-posting.bso`.
3. **A candidata mais bem classificada fica com a rota.** Abrir `/s/funny` mostra a vencedora atual.
4. **Perder não apaga nada.** Uma comunidade que não é a vencedora mantém seu endereço, suas publicações e seus inscritos, e qualquer pessoa ainda pode abri-la diretamente.

## O nome é uma porta de entrada, não uma identidade

Um código de diretório é apenas uma rota de descoberta. Tudo o que é duradouro aponta para o endereço exato de uma comunidade:

- Inscrever-se a partir de `/s/funny` inscreve você no endereço exato da vencedora atual. O código de diretório em si nunca é armazenado como inscrição.
- Links de publicações sempre usam o endereço exato da comunidade, então um link antigo não pode passar a apontar para outra comunidade depois que a vencedora muda.
- Quando a vencedora muda, o Seedit não mexe nas inscrições existentes e pergunta a cada inscrito se quer mudar para a nova vencedora, manter as duas ou manter a comunidade atual. A troca automática é uma configuração por diretório que precisa ser ativada manualmente, e uma troca automática exibe um aviso com opção de desfazer.

Portanto, uma comunidade concorrente não toma as inscrições de ninguém. Ela conquista o nome: novos visitantes chegam a ela, e os inscritos existentes recebem uma escolha com um clique. Quem preferia a comunidade antiga continua com ela.

## Por que não nomes por ordem de chegada

- **Sem ocupação especulativa de nomes.** Ter um bom nome não basta. Uma comunidade precisa continuar sendo a melhor candidata para ele.
- **Nenhum administrador atribui nomes.** A atribuição por um administrador recriaria o veto central que o Bitsocial foi feito para eliminar.
- **Os concorrentes mantêm um caminho até o público.** Uma comunidade rival mira o mesmo nome em vez de recomeçar com um nome pior.
- **Os clientes concordam sobre a vencedora.** O Seedit classifica as candidatas de forma determinística, então todo cliente que lê o mesmo snapshot finalizado do diretório mostra a mesma vencedora. O Seedit não coloca outra candidata no lugar só porque a vencedora está temporariamente inacessível na conexão de um usuário.

## Como as vencedoras são escolhidas hoje

As candidatas são publicadas como arquivos JSON no repositório [bitsocialnet/lists](https://github.com/bitsocialnet/lists), um arquivo por diretório, e uma comunidade entra em um diretório por meio de um pull request para o arquivo dele. Esta é uma etapa inicial provisória. O objetivo é que a votação substitua os pull requests como forma de decidir as vencedoras.

- O **Seedit** classifica as candidatas de um diretório por pontuação, depois pelo momento em que foram adicionadas e depois pelo endereço. Cada arquivo de diretório tem um número de revisão, e qualquer mudança nas candidatas ou na vencedora publica uma nova revisão.
- O **5chan** realiza uma votação por diretório com [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Os clientes trocam cédulas assinadas via libp2p gossipsub e calculam a apuração por conta própria, sem nenhum servidor contando votos. Para votar é preciso ter um 5chan Pass, um token intransferível, e cada titular tem direito a um voto. Votar em um board que ainda não está na lista o indica como candidato. As votações rodam atualmente na testnet Base Sepolia e, até saírem da testnet, as apurações são exibidas, mas não reordenam a lista.

## Protocolo ou aplicativo?

Os diretórios não fazem parte do PKC, a camada peer-to-peer que armazena e transporta comunidades. Eles são uma convenção que os clientes aplicam acima dela, ao lado das listas padrão e da pesquisa; veja [Descoberta de conteúdo](./content-discovery.md). Um cliente pode ler os mesmos arquivos de diretório, publicar os seus próprios ou ignorar os diretórios por completo, e os usuários continuam podendo abrir qualquer comunidade pelo endereço.
