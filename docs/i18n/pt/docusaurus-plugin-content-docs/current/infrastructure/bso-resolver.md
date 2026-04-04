---
title: BSO Resolver
description: Resolva nomes de domínio .bso para chaves públicas usando registros ENS TXT, com cache integrado e suporte multiplataforma.
sidebar_position: 1
---

# BSO Resolver

O BSO Resolver traduz nomes de domínio `.bso` em suas chaves públicas correspondentes lendo registros Bitsocial TXT armazenados no ENS. Ele fornece um cliente viem compartilhado, cache persistente e funciona em ambientes Node.js e de navegador.

- **GitHub**: [bitsocialnet/bso-resolver](https://github.com/bitsocialnet/bso-resolver)
- **Licença**: somente GPL-2.0

## Instalação

```bash
npm install @bitsocial/bso-resolver
```

## Criando um resolvedor

Instancie o resolvedor passando um objeto de configuração para o construtor:

```js
const resolver = new BsoResolver({ key, provider, dataPath });
```

| Parâmetro  | Obrigatório | Descrição                                                   |
| ---------- | ----------- | ----------------------------------------------------------- |
| `key`      | Sim         | Identificador da instância do resolvedor.                   |
| `provider` | Sim         | Configuração de transporte (veja abaixo).                   |
| `dataPath` | Não         | Diretório para o arquivo de cache SQLite (somente Node.js). |

### Opções de provedor

O parâmetro `provider` aceita três formatos:

- **`"viem"`** -- Usa o transporte público padrão fornecido pelo viem.
- **HTTP(S) URL** – Conecta-se por meio de um endpoint JSON-RPC (por exemplo, `https://mainnet.infura.io/v3/YOUR_KEY`).
- **WebSocket URL** – Conecta-se por meio de um endpoint WebSocket RPC (por exemplo, `wss://mainnet.infura.io/ws/v3/YOUR_KEY`).

## Métodos

### `resolve({ name, abortSignal? })`

Procura um nome `.bso` e retorna a chave pública associada. Um `AbortSignal` opcional pode ser passado para cancelar solicitações de longa duração.

### `canResolve({ name })`

Retorna um booleano que indica se o resolvedor é capaz de lidar com o nome fornecido. Use isto para verificar o suporte antes de tentar uma resolução completa.

### `destroy()`

Desmonta o resolvedor, fechando conexões com o banco de dados e liberando recursos. Chame isso quando o resolvedor não for mais necessário.

## Cache

Os nomes resolvidos são armazenados em cache automaticamente para reduzir pesquisas redundantes na rede. O back-end de cache é escolhido com base no ambiente de tempo de execução:

| Meio Ambiente | Back-end         | Notas                                                            |
| ------------- | ---------------- | ---------------------------------------------------------------- |
| Node.js       | SQLite           | Armazenado em `dataPath`. Usa o modo WAL para acesso simultâneo. |
| Navegador     | IndexadoDB       | Usa transações IndexedDB nativas.                                |
| Reserva       | `Map` na memória | Usado quando nem SQLite nem IndexedDB estão disponíveis.         |

Todas as entradas de cache têm um **TTL de uma hora** e são automaticamente removidas após a expiração.

## Integração com pkc-js

O resolvedor pode ser conectado diretamente ao pkc-js por meio da opção `nameResolvers`, permitindo a resolução transparente de nomes `.bso` durante pesquisas de chave:

```js
const pkc = new Pkc({
  nameResolvers: [resolver],
  // ...other options
});
```

## Simultaneidade

O resolvedor foi projetado para ser seguro sob uso simultâneo:

- Um único cliente viem compartilhado evita conexões redundantes.
- SQLite opera no modo WAL (Write-Ahead Logging), permitindo leituras simultâneas sem bloqueio.
- O cache do navegador depende de transações nativas do IndexedDB para isolamento.

## Pontos de entrada da plataforma

O pacote fornece pontos de entrada separados para Node.js e compilações de navegador. Os empacotadores que suportam o campo `exports` em `package.json` selecionarão automaticamente o campo correto.
