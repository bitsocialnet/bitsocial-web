---
title: Onde os posts ficam e por quanto tempo permanecem
description: Por que os posts do Bitsocial são assinados e endereçados por conteúdo, mas não são armazenados para sempre por cada nó, quem os mantém online e como os arquivistas mantêm o conteúdo antigo legível.
---

# Onde os posts ficam e por quanto tempo permanecem

O Bitsocial não armazena todos os posts em uma blockchain nem em um banco de dados corporativo. O nó de
cada comunidade guarda seus posts, leitores e seeders ajudam a servi-los, e qualquer pessoa que queira
um registro permanente pode mantê-lo. Guardar posts para sempre é **opcional, não obrigatório**: o
protocolo não força cada participante a armazenar todo o histórico da rede.

Esta página explica o que isso significa na prática, porque "não armazenado para sempre" é fácil de
interpretar erroneamente como "desaparece" ou "confie em mim".

## Autenticidade e disponibilidade são questões diferentes

Há duas perguntas diferentes sobre um post:

1. **Ele é real?** Este autor o escreveu, e esta comunidade o aceitou?
2. **Ele ainda está online?** Alguém consegue buscá-lo hoje?

O Bitsocial responde à primeira pergunta com criptografia, não com confiança. Todo post é assinado pelo
par de chaves de seu autor e, quando uma comunidade o aceita, ele é armazenado sob um identificador de
conteúdo (CID): um hash de seus bytes exatos. Quem busca um post pode conferir a assinatura e o hash.
Um nó, roteador, gateway ou arquivo não pode alterar o texto de um post nem forjar um post de outra
pessoa sem que a verificação falhe.

A segunda pergunta diz respeito a quem mantém uma cópia, e essa é a única parte que não é garantida.

## Quem mantém os posts online

- **O nó da comunidade.** O nó do dono aceita os posts e os mantém em seu banco de dados enquanto a
  comunidade os retiver. Esta é a cópia que sempre existe enquanto a comunidade estiver funcionando.
  Veja [Protocolo peer-to-peer](/peer-to-peer-protocol/).
- **Leitores.** Aplicativos de desktop, como o app 5chan Electron, fazem seed das comunidades que
  carregam enquanto estão em execução, de modo que comunidades populares são servidas por muitos peers,
  como torrents populares. Uma aba do navegador pode armazenar conteúdo em cache e validá-lo enquanto
  estiver aberta, mas não é um host de longa duração.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permite que
  qualquer pessoa contribua com capacidade sempre ativa de um VPS ou de uma máquina reserva. Ele fixa
  as páginas mais recentes e as atualizações de posts das comunidades, o que também torna comunidades
  atrás de roteadores domésticos carregáveis em navegadores.
- **Arquivistas.** Qualquer pessoa pode rastrear comunidades e guardar tudo que vê. Arquivos são
  serviços comuns construídos sobre a rede, não um papel especial no protocolo.

## As comunidades escolhem sua própria retenção

Por quanto tempo uma comunidade guarda posts antigos é decisão de seu dono, não uma regra de protocolo.
Algumas comunidades querem anos de histórico. Outras foram feitas para esquecer: os boards do 5chan
funcionam como um imageboard, no qual as threads caem do board, vão para um arquivo e são removidas do
nó do board depois de um período definido (48 horas por padrão). Uma comunidade também pode dispensar o
arquivo por completo.

O mesmo protocolo oferece suporte a ambos porque a retenção é uma política definida por cada comunidade,
não um custo que cada nó precisa pagar.

## Por que não armazenar tudo para sempre?

Uma rede que exige que cada nó guarde cada post para sempre precisa pagar por isso de alguma forma:

- **Blockchains** fazem cada nó completo armazenar todo o histórico, de modo que os requisitos dos nós
  crescem com toda a atividade, e publicar normalmente custa uma taxa.
- **Armazenamento pago**, como o aluguel de armazenamento do Farcaster, faz os usuários pagarem para
  manter seu histórico e elimina os posts mais antigos além do que pagam. Veja
  [Bitsocial e Farcaster](/comparisons/farcaster/).
- **Servidores centrais** guardam tudo, mas apenas enquanto uma empresa quiser, sob as regras dessa
  empresa.

A mídia social não precisa de um livro-razão global. Não importa se o post A foi aceito um milissegundo
antes do post B, e a maioria dos posts antigos raramente é lida. O Bitsocial deixa cada nó de comunidade
manter apenas suas próprias comunidades, o que torna a hospedagem barata o suficiente para um laptop,
um Raspberry Pi ou um VPS pequeno. Veja [Por que não uma blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## A contrapartida

Se ninguém mantiver uma cópia de um post, ele pode ficar indisponível. O CID de um post nunca muda, mas
um CID é apenas um endereço: o conteúdo só pode ser buscado enquanto pelo menos um nó o estiver servindo.
Se o nó de uma comunidade ficar offline para sempre e nenhum leitor, seeder ou arquivo tiver mantido seus
posts, esses posts se perdem.

Esse é o custo honesto de não exigir um livro-razão global. É também o custo que toda grande plataforma
já tem: posts antigos desaparecem quando contas, servidores ou empresas desaparecem. A diferença é que,
no Bitsocial, guardar algo não exige a permissão de ninguém.

## Preserve o que importa

- **Rode você mesmo o nó da comunidade.** Um dono de comunidade que mantém o nó em execução preserva o
  histórico da comunidade enquanto as configurações dela o retiverem.
- **Faça seed.** Deixar um app de desktop aberto ou executar `bitsocial-seeder` mantém as comunidades
  disponíveis para outras pessoas.
- **Arquive.** Arquivos independentes mantêm threads antigas legíveis e pesquisáveis depois que uma
  comunidade as descarta. [5archive.org](https://5archive.org) arquiva boards do 5chan, e
  [seeditarchive.org](https://seeditarchive.org) arquiva comunidades Seedit. Ambos são de código aberto,
  então qualquer pessoa pode rodar um mirror ou um arquivo concorrente.

Como todo post arquivado ainda é assinado, um arquivo não pode reescrever silenciosamente o que alguém
disse: um leitor pode verificar a assinatura de um post arquivado da mesma forma que a de um post ao vivo.
