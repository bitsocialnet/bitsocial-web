---
title: CLI
description: Interface de linha de comando para executar um nó Bitsocial, criar comunidades e gerenciar operações de protocolo.
sidebar_position: 2
---

# CLI

:::warning Nomenclatura herdada
Este pacote atualmente usa convenções de nomenclatura herdadas de sua dependência upstream. As referências a "plebbit" em comandos, saída e configuração serão migradas para "bitsocial" em uma versão futura. A funcionalidade não é afetada.
:::

O `bitsocial-cli` é uma ferramenta de linha de comando para interagir com o backend do protocolo Bitsocial. Ele permite executar um daemon P2P local, criar e configurar comunidades e publicar conteúdo – tudo a partir do terminal.

Ele é construído sobre `plebbit-js` e é usado por [5chan](/apps/5chan/) e [Seedit](/apps/seedit/) para criação de comunidades e gerenciamento de nós.

## Instalação

Binários pré-construídos estão disponíveis para Windows, macOS e Linux. Baixe a versão mais recente para sua plataforma no GitHub:

**[Baixar das versões do GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

Após o download, torne o binário executável (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## Executando o Daemon

O uso mais comum da CLI é executar um nó Bitsocial. O daemon inicia a camada de rede P2P e expõe uma API local à qual os clientes podem se conectar.

```bash
bitsocial-cli daemon
```

Na primeira inicialização, o daemon gera links para o **WebUI**, uma interface gráfica baseada em navegador para gerenciar seu nó, comunidades e configurações. Isso é útil se você preferir uma GUI em vez de comandos de terminal.

## Comandos principais

| Comando             | Descrição                                                         |
| ------------------- | ----------------------------------------------------------------- |
| `daemon`            | Inicie o nó Bitsocial P2P                                         |
| `create subplebbit` | Crie uma nova comunidade                                          |
| `subplebbit edit`   | Atualizar configurações da comunidade (título, descrição, regras) |
| `subplebbit list`   | Listar comunidades hospedadas neste nó                            |
| `subplebbit start`  | Comece a servir uma comunidade específica                         |
| `subplebbit stop`   | Pare de servir uma comunidade específica                          |

Execute qualquer comando com `--help` para ver as opções e sinalizadores disponíveis:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## Fluxo de trabalho típico

Um fluxo de configuração comum para hospedar uma nova comunidade:

```bash
# 1. Inicie o daemon
bitsocial-cli daemon

# 2. Em outro terminal, crie uma comunidade
bitsocial-cli create subplebbit

# 3. Configure a comunidade
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Comece a servir
bitsocial-cli subplebbit start <address>
```

A comunidade agora está ativa na rede Bitsocial e acessível a partir de qualquer cliente compatível.

## Ligações

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
