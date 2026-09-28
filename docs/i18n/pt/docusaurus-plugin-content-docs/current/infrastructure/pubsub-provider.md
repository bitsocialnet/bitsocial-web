---
title: Provedor de Pubsub
description: Relay de pubsub de fallback e provedor de roteamento delegado para operadores Bitsocial.
sidebar_position: 3
---

# Provedor de Pubsub

O Provedor de Pubsub é um serviço para operadores que querem rodar um relay de fallback de pubsub compatível com Bitsocial, com um nó Kubo embutido. Clientes Bitsocial modernos, como 5chan e Seedit, usam rede peer-to-peer pura no navegador por padrão, mas este serviço continua útil como caminho de fallback opcional para usuários que desativam o P2P no navegador ou para operadores que querem oferecer endpoints públicos de compatibilidade.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Imagem Docker**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Licença**: GPL-3.0-or-later

## O que ele executa

- um proxy HTTP público para as rotas de pubsub, gateway, name-provider e roteamento delegado
- um nó Kubo embutido com pubsub habilitado
- um provedor de roteamento HTTP delegado em `/routing/v1/providers`
- métricas Prometheus em `/metrics`
- acesso opcional por basic auth à API RPC completa do Kubo

## Portas

Os padrões foram escolhidos para que o Provedor de Pubsub possa rodar ao lado do [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) no mesmo VPS sem conflito na porta de swarm.

| Finalidade         | Padrão                             | Notas                                                          |
| ------------------ | ---------------------------------- | -------------------------------------------------------------- |
| Proxy HTTP público | `8000` no app, `80` no host Docker | Defina `PUBSUB_PROVIDER_HTTP_PORT` para mudar a porta do host. |
| Swarm do Kubo      | `4002` TCP/UDP                     | Evita a porta swarm Kubo padrão `4001` do seeder.              |
| API do Kubo        | `5001` apenas local                | Usada internamente pelo proxy.                                 |
| Gateway do Kubo    | `8080` apenas local                | Usado internamente pelo proxy.                                 |

## Configuração com Docker

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Veja os logs:

```bash
docker logs --follow pubsub-provider
```

Teste o proxy:

```bash
curl http://127.0.0.1/commit-hash
```

## Atualização

Se você rodava antes a antiga imagem `latest`, force o Compose a recriar o contêiner a partir da imagem publicada e fixada:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Confirme que a imagem corrigida está em execução:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Os logs devem conter `using Kubo binary at /app/bin/ipfs` e não devem conter `downloading ipfs`.

## Rodando junto com o Bitsocial Seeder

Se o mesmo host também roda o `bitsocial-seeder`, mantenha o Provedor de Pubsub na porta de swarm `4002` ou em outra porta diferente de `4001`:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Isso evita o conflito de porta que acontece quando dois nós Kubo tentam ocupar TCP/UDP `4001` ao mesmo tempo.

## Configuração

Sobrescritas de ambiente mais comuns:

```env
PUBSUB_PROVIDER_HTTP_PORT=80
PUBSUB_PROVIDER_SWARM_PORT=4002
PUBSUB_PROVIDER_PORTS=8000
KUBO_RPC_URL=http://127.0.0.1:5001/api/v0
IPFS_GATEWAY_URL=http://127.0.0.1:8080
HTTP_ROUTER_URLS=https://example-router.invalid
PUBSUB_PROVIDER_ROUTING_STORE_PATH=
BASIC_AUTH_USERNAME=
BASIC_AUTH_PASSWORD=
IPFS_GATEWAY_USE_SUBDOMAINS=false
SHUTDOWN_KEY=
ETH_PROVIDER_URL=
ETH_PROVIDER_URL_WS=
SOL_PROVIDER_URL=
```

Use o provedor como relay de fallback, não como substituto do P2P no navegador. Continue mantendo a infraestrutura de tracker em separado quando a rede precisar de capacidade dedicada de descoberta de peers.
