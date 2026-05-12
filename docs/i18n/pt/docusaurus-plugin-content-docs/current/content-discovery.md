---
title: Descoberta de conteúdo
description: Como o Bitsocial separa a descoberta por pares da curadoria em nível de aplicativo.
---

# Descoberta de conteúdo

O Bitsocial não coloca um feed global, índice de pesquisa ou algoritmo de classificação no protocolo. Ele separa a descoberta de conteúdo em duas camadas:

1. **Pesquisa de rede** encontra os pares que atendem atualmente uma comunidade conhecida.
2. **A curadoria de aplicativos** decide quais comunidades, fóruns, listas ou postagens um produto mostra primeiro.

Isso mantém o protocolo pequeno e deixa espaço para a competição de muitas experiências de descoberta.

## Pesquisa de rede

Cada comunidade possui um endereço estável derivado de sua chave pública. Quando um cliente já conhece esse endereço, ele consulta roteadores HTTP leves para encontrar pares que se anunciam como provedores dele.

Os roteadores retornam apenas endereços de pares de provedores. Eles não armazenam postagens, metadados, listas de usuários ou um diretório de comunidades legível por humanos. Depois que o cliente recebe endereços de pares, ele se conecta a esses pares e busca os metadados mais recentes da comunidade, além de ponteiros de conteúdo, e então busca os dados reais da postagem por hash.

Isto responde à pergunta do protocolo: "Onde posso obter o estado mais recente desta comunidade?"

## Curadoria de aplicativos

A pergunta separada do produto é: “Quais comunidades um usuário deve ver primeiro?”

O Bitsocial deixa isso para aplicativos, listas e usuários, em vez de inserir uma resposta na rede. Os exemplos incluem:

- um cliente mostrando comunidades que o usuário já segue
- uma lista padrão selecionada para um aplicativo estilo Reddit
- slots de diretório para um aplicativo estilo imageboard
- índices de pesquisa ou classificação mantidos por um aplicativo específico
- links diretos compartilhados pelos usuários

Os aplicativos podem indexar, classificar, filtrar ou destacar coisas diferentes sem transformar essas escolhas em lei de protocolo. Se a superfície de descoberta de um aplicativo não for útil, outro aplicativo poderá criar uma superfície diferente nas mesmas comunidades subjacentes.

## Aplicativos atuais

O 5chan atualmente usa caminhos de diretório familiares, como `/b/` ou `/g/`. As atribuições de diretório são gerenciadas por meio de uma lista pública hoje, e espera-se que versões futuras ofereçam suporte à criação de quadros no aplicativo e à votação em slots de diretório.

Seedit usa listas de comunidades padrão em sua primeira página. As comunidades ainda podem ser criadas e compartilhadas fora dessa lista padrão.

Em ambos os casos, a lista no nível do aplicativo ajuda os usuários a encontrar algo para abrir, e a pesquisa no nível do protocolo resolve a comunidade escolhida para os pares.

## Por que essa divisão é importante

Uma única rede descentralizada ainda precisa de uma boa descoberta, mas a camada de descoberta deve ser substituível. O protocolo principal do Bitsocial concentra-se em endereçamento, pesquisa de pares, publicação e anti-spam. A curadoria fica acima dessa camada, onde os aplicativos podem experimentar diretórios, listas padrão, feeds, pesquisas, votação e políticas de moderação sem exigir uma migração em toda a rede.
