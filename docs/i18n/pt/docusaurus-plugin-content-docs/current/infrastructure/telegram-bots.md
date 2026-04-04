---
title: Telegram Bots
description: Alimente bots que monitoram as listas da comunidade Bitsocial e encaminhem postagens para canais do Telegram.
sidebar_position: 3
---

# Telegram Bots

Os bots do Bitsocial Telegram monitoram listas de comunidades de clientes na rede Bitsocial e encaminham automaticamente novas postagens para canais do Telegram. Cada mensagem encaminhada inclui botões embutidos que direcionam para a postagem original no 5chan e no Seedit.

- **GitHub**: [bitsocialnet/bitsocial-telegram-bots](https://github.com/bitsocialnet/bitsocial-telegram-bots)

## Bots disponíveis

| Robô                     | Estado    | Descrição                                                                          |
| ------------------------ | --------- | ---------------------------------------------------------------------------------- |
| **Alimentação do 5chan** | Ativo     | Monitora todos os diretórios do 5chan e encaminha novas postagens para o Telegram. |
| **Feed de edição**       | Planejado | Fornecerá a mesma funcionalidade para comunidades Seedit.                          |

## Configurar

### Pré-requisitos

- Node.js
- Fio
- Um token de bot do Telegram (crie um via [BotFather](https://t.me/BotFather))

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/bitsocialnet/bitsocial-telegram-bots.git
cd bitsocial-telegram-bots
yarn install
```

### Configuração

Crie um arquivo `.env` na raiz do projeto com seu token de bot:

```env
BOT_TOKEN=your_telegram_bot_token
```

### Correndo

Inicie o bot após configurar seu ambiente:

```bash
yarn start
```

## Formato de postagem

Quando o bot encaminha uma postagem para o Telegram, ele inclui dois botões embutidos:

- **Ver no 5chan** – Abre a postagem no cliente web 5chan.
- **Ver no Seedit** – Abre a postagem no cliente web do Seedit.

Isso permite que os assinantes do Telegram acessem diretamente o tópico de discussão completo sobre o cliente de sua preferência.
