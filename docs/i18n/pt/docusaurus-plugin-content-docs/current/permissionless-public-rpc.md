---
title: RPC público sem permissão
description: Projeto proposto para um serviço Bitsocial RPC público com usuários isolados, permissões com escopo definido e propriedade da comunidade.
---

# RPC público sem permissão

A proposta pública original de RPC sobreviveu como um problema do GitHub escrito na antiga terminologia plebbit. Esta página reescreve essa ideia na linguagem Bitsocial e a enquadra como uma proposta em nível de produto, em vez de uma parede de detalhes de implementação.

## Objetivo de linguagem simples

O Bitsocial Forge pode executar um serviço RPC público que permite que muitos usuários gerenciem suas próprias comunidades Bitsocial remotamente, sem transformar a operadora em um guardião dessas comunidades.

O serviço deve tornar práticos os clientes móveis e leves, preservando três restrições:

1. Os usuários ficam isolados uns dos outros por padrão.
2. As permissões permanecem explícitas e granulares.
3. A compatibilidade com a solicitação RPC atual e o formato de resposta podem ser preservados durante a implementação.

## Que problema isso resolve

Hoje, o modelo RPC mais simples geralmente é tudo ou nada: uma chave de autenticação, um domínio de autoridade, acesso total. Isso funciona para uma única operadora, mas não para um serviço público multiusuário.

Uma RPC pública sem permissão precisa de um modelo mais forte:

- um serviço pode hospedar muitos usuários
- cada usuário obtém suas próprias comunidades e limites
- políticas definidas pelo operador podem evitar abusos
- o usuário ainda pode se mudar ou se auto-hospedar mais tarde

## Modelo principal

### Usuários

Cada usuário recebe uma credencial de autenticação mais um pacote de permissões.

### Comunidades

As comunidades criadas por meio do serviço são atribuídas a um registro de proprietário. A propriedade é rastreada explicitamente para que os métodos de gerenciamento possam ter o escopo definido para o usuário certo.

### Permissões

As permissões são baseadas em capacidade. Em vez de um booleano para “pode usar o RPC”, o servidor pode controlar:

- quantas comunidades um usuário pode criar
- quais métodos de gerenciamento estão disponíveis
- quais operações de publicação são permitidas
- quais limites de taxa se aplicam
- quais superfícies administrativas estão visíveis

### Superfície de administração

O próprio RPC público deve permanecer focado no comportamento do RPC voltado para o usuário. Tarefas administrativas, como criação de usuários, transferência de propriedade e revisão de auditoria, pertencem a uma API e painel de operador separados.

## Postura de compatibilidade

A documentação voltada ao usuário deve usar termos Bitsocial como **comunidade** e **perfil**.

No nível da conexão, a primeira implementação ainda pode preservar o transporte JSON-RPC atual e o formato da carga útil, onde isso for útil para compatibilidade. Em outras palavras: os documentos não precisam mais falar como os antigos documentos plebbit, mesmo que o período de transição mantenha alguns nomes de métodos legados ou formas de solicitação nos bastidores.

## Pacote de permissão proposto

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Os nomes exatos dos métodos são ilustrativos. A parte importante é a forma da política: as capacidades individuais são controladas de forma independente, em vez de agrupadas em um token de superusuário.

## Fluxo de conexão

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

O reconhecimento da permissão deve permanecer opcional. Um cliente que ignora a notificação ainda pode se comportar corretamente ao lidar com falhas de autorização padrão do servidor.

## Aplicação de propriedade

Quando o serviço cria uma comunidade, ele deve atribuir automaticamente a propriedade ao usuário chamador. De lá:

- As ações de iniciar, parar, editar e excluir da comunidade são do escopo do proprietário
- a lista e as respostas de assinatura são padronizadas para as próprias comunidades do chamador
- visibilidade mais ampla é uma permissão explícita do administrador, não um padrão

Um caso extremo é muito importante: se um usuário se inscreve em uma comunidade que **não** possui, o servidor deve expor apenas o estado público que qualquer observador externo deve ver. A configuração somente do proprietário ou os dados de tempo de execução interno nunca devem vazar por meio de uma API de assinatura.

## Superfície de operador sugerida

A API admin pode permanecer enfadonha e explícita:

- listar usuários
- inspecionar um usuário
- criar ou atualizar usuários
- excluir usuários
- transferir propriedade da comunidade
- inspecionar registros de auditoria

A autenticação para esta API do operador deve ser completamente separada da autenticação RPC do usuário final.

## Fases de implementação

### Fase 1

- estabelecer a estrutura pública do projeto RPC
- adicione registros de usuários e rastreamento de propriedade
- bifurcar ou estender o servidor RPC atual

### Fase 2

- implementar pacotes de permissão
- aplicá-los na camada de método RPC
- retornar metadados de permissões na conexão

### Fase 3

- adicione a API do operador
- adicionar registro de auditoria
- adicionar autenticação de administrador

### Fase 4

- enviar o painel de administração
- testar controles de abuso
- restringir a limitação de taxas e as cotas de armazenamento

## Perguntas abertas

### Spam de credenciais de autenticação

Se a criação de autenticação for barata, os serviços públicos poderão precisar de uma camada de desafio antes de emitir credenciais. Um caminho possível é reutilizar o próprio modelo de desafio da comunidade para que a emissão de credenciais herde a mesma filosofia antiabuso que o resto da rede.

### Nomenclatura herdada

Algumas implementações iniciais ainda podem expor nomes de métodos legados internamente para compatibilidade. Isso deve ser tratado como um detalhe de migração, não como o vocabulário público permanente dos documentos do Bitsocial.

## Resumo

Esta proposta trata realmente de uma coisa: tornar a infraestrutura pública de RPC útil sem torná-la custodiante. Um bom RPC Bitsocial público deve parecer uma assistência opcional para administrar comunidades, não como uma nova plataforma central que recupera a propriedade pela porta dos fundos.
