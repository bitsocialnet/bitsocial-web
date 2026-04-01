---
title: Bloqueador de Spam
description: Serviço centralizado de detecção de spam com pontuação de risco, desafios OAuth e limites de níveis configuráveis.
sidebar_position: 1
---

# Bloqueador de Spam

:::warning Legacy Naming
Este pacote foi publicado originalmente no escopo `@plebbit`. Ele foi renomeado para `@bitsocial/spam-blocker-server` e `@bitsocial/spam-blocker-challenge`. Referências aos nomes antigos ainda podem aparecer em documentações ou bases de código mais antigas.
:::

Spam Blocker é um serviço centralizado de detecção de spam que avalia as publicações recebidas e atribui pontuações de risco. É composto por dois pacotes:

- **`@bitsocial/spam-blocker-server`** -- o servidor HTTP que hospeda as APIs de avaliação e desafio.
- **`@bitsocial/spam-blocker-challenge`** – um pacote de cliente leve que as comunidades integram para enviar publicações para avaliação.

**Código fonte:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Como funciona a pontuação de risco

Cada publicação enviada ao endpoint `/evaluate` recebe uma pontuação de risco numérica. A pontuação é uma combinação ponderada de vários sinais:

| Sinal               | Descrição                                                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Idade da conta      | As contas mais recentes recebem pontuações de risco mais altas.                                                                                                                    |
| Carma               | O carma comunitário acumulado reduz o risco.                                                                                                                                       |
| Reputação do autor  | Dados de reputação coletados pelo indexador da rede em segundo plano.                                                                                                              |
| Análise de conteúdo | Heurísticas em nível de texto (densidade de links, padrões de spam conhecidos, etc.).                                                                                              |
| Velocidade          | Postagens sucessivas e rápidas do mesmo autor aumentam o risco.                                                                                                                    |
| Inteligência IP     | Geolocalização em nível de país e pesquisas de feed de ameaças. Apenas os códigos dos países são armazenados – os endereços IP brutos nunca são compartilhados com as comunidades. |

## Limites de nível

A pontuação de risco é mapeada para um dos quatro níveis configuráveis ​​que determinam o que acontece a seguir:

1. **Aceitar automaticamente** – a pontuação é baixa o suficiente para que a publicação seja aprovada sem qualquer contestação.
2. **OAuth-suficiente** – o autor deve concluir uma verificação OAuth para continuar.
3. **OAuth-plus-more** -- OAuth por si só não é suficiente; verificação adicional (por exemplo, CAPTCHA) é necessária.
4. **Rejeição automática** – a pontuação é muito alta; a publicação é rejeitada imediatamente.

Todos os valores limite são configuráveis ​​por comunidade.

## Fluxo do Desafio

Quando uma publicação cai em um nível que exige verificação, o fluxo de desafio começa:

1. Primeiro, o autor é solicitado a autenticar via **OAuth** (GitHub, Google, Twitter e outros provedores compatíveis).
2. Se o OAuth sozinho for insuficiente (nível 3), um **substituto CAPTCHA** desenvolvido pela Cloudflare Turnstile será apresentado.
3. A identidade OAuth é usada exclusivamente para verificação – ela **nunca é compartilhada** com a comunidade ou outros usuários.

## Terminais de API

### `POST /evaluate`

Envie uma publicação para avaliação de risco. Retorna a pontuação de risco calculada e o nível de desafio necessário.

### `POST /challenge/verify`

Envie o resultado de um desafio concluído (token OAuth, solução CAPTCHA ou ambos) para verificação.

### `GET /iframe/:sessionId`

Retorna uma página HTML incorporável que renderiza a UI de desafio apropriada para a sessão determinada.

## Limitação de taxa

Os limites de taxas são aplicados dinamicamente com base na idade e reputação do autor. Autores mais novos ou de menor reputação enfrentam limites mais rígidos, enquanto autores estabelecidos desfrutam de limites mais generosos. Isso evita inundações de spam sem penalizar os participantes confiáveis.

## Indexador de rede em segundo plano

O servidor executa um indexador em segundo plano que rastreia continuamente a rede para construir e manter dados de reputação do autor. Esses dados alimentam diretamente o pipeline de pontuação de risco, permitindo que o sistema reconheça participantes repetidos de boa-fé em todas as comunidades.

## Privacidade

O Spam Blocker foi projetado pensando na privacidade:

- As identidades OAuth são usadas apenas para verificação de desafio e **nunca são divulgadas** às comunidades.
- Os endereços IP são resolvidos para **somente códigos de país**; IPs brutos não são armazenados ou compartilhados.

## Banco de dados

O servidor usa **SQLite** (via `better-sqlite3`) para persistência local de dados de reputação, estado de sessão e configuração.
