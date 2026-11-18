---
title: Spam Blocker
description: Serviço centralizado de detecção de spam com pontuação de risco, desafios OAuth e limiares de nível configuráveis.
sidebar_position: 1
---

# Spam Blocker

O Spam Blocker é um serviço centralizado de detecção de spam que avalia as publicações recebidas e atribui pontuações de risco. Ele é formado por dois pacotes:

- **`@bitsocial/spam-blocker-server`** -- o servidor HTTP que hospeda as APIs de avaliação e de desafio.
- **`@bitsocial/spam-blocker-challenge`** -- um pacote cliente leve que as comunidades integram para enviar publicações à avaliação.

**Código-fonte:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Como funciona a pontuação de risco

Toda publicação enviada ao endpoint `/evaluate` recebe uma pontuação de risco numérica. A pontuação é uma combinação ponderada de vários sinais:

| Sinal               | Descrição                                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Idade da conta      | Contas mais recentes recebem pontuações de risco mais altas.                                                                     |
| Karma               | O karma acumulado na comunidade reduz o risco.                                                                                   |
| Reputação do autor  | Dados de reputação coletados pelo indexador de rede em segundo plano.                                                            |
| Análise do conteúdo | Heurísticas no nível do texto (densidade de links, padrões conhecidos de spam etc.).                                             |
| Velocidade          | Publicações sucessivas e rápidas do mesmo autor aumentam o risco.                                                                |
| Inteligência de IP  | Geolocalização em nível de país e consultas a feeds de ameaças. Endereços IP brutos nunca são compartilhados com as comunidades. |

## Limiares de nível

A pontuação de risco corresponde a um de quatro níveis configuráveis, que determinam o que acontece em seguida:

1. **Aceitação automática** -- a pontuação é baixa o suficiente para que a publicação seja aprovada sem nenhum desafio.
2. **OAuth suficiente** -- o autor precisa concluir uma verificação OAuth para prosseguir.
3. **OAuth e mais** -- o OAuth sozinho não basta; é necessária uma verificação adicional (por exemplo, CAPTCHA).
4. **Rejeição automática** -- a pontuação é alta demais e a publicação é rejeitada de imediato.

Todos os valores de limiar são configuráveis por comunidade.

## Fluxo de desafio

Quando uma publicação cai em um nível que exige verificação, o fluxo de desafio começa:

1. Primeiro o autor é convidado a se autenticar via **OAuth** (GitHub, Google, Twitter e outros provedores suportados).
2. Se o OAuth sozinho for insuficiente (nível 3), é apresentado um **CAPTCHA de fallback** baseado no Cloudflare Turnstile.
3. A identidade OAuth é usada apenas para verificação -- ela **nunca é compartilhada** com a comunidade nem com outros usuários.

## Endpoints da API

### `POST /evaluate`

Envia uma publicação para avaliação de risco. Retorna a pontuação de risco calculada e o nível de desafio exigido.

### `POST /challenge/verify`

Envia o resultado de um desafio concluído (token OAuth, solução de CAPTCHA ou ambos) para verificação.

### `GET /iframe/:sessionId`

Retorna uma página HTML incorporável que renderiza a interface de desafio adequada para a sessão informada.

## Limitação de taxa

Os limites de taxa são aplicados dinamicamente conforme a idade e a reputação do autor. Autores mais novos ou de reputação mais baixa enfrentam limites mais rígidos, enquanto autores estabelecidos contam com limiares mais generosos. Isso evita enxurradas de spam sem penalizar participantes confiáveis.

## Indexador de rede em segundo plano

O servidor executa um indexador em segundo plano que rastreia a rede continuamente para construir e manter os dados de reputação dos autores. Esses dados alimentam diretamente o pipeline de pontuação de risco, o que permite ao sistema reconhecer participantes recorrentes de boa-fé em várias comunidades.

## Privacidade

O Spam Blocker foi projetado com a privacidade em mente:

- As identidades OAuth são usadas apenas para a verificação de desafios e **nunca são reveladas** às comunidades.
- O operador do serviço armazena endereços IP brutos para detectar abusos e os envia a um provedor terceirizado de inteligência de IP para classificação.
- As comunidades recebem apenas o código do país, o risco do IP e uma estimativa do tipo de conexão, nunca o IP bruto.

## Banco de dados

O servidor usa **SQLite** (via `better-sqlite3`) para a persistência local dos dados de reputação, do estado das sessões e da configuração.
