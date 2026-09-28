---
title: Pubsub Provider
description: Pubsubin varavälitin ja delegoidun reitityksen tarjoaja Bitsocial-operaattoreille.
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider on operaattoripalvelu, jolla ajetaan Bitsocial-yhteensopivaa pubsubin varavälitintä mukana tulevan Kubo-solmun kanssa. Nykyiset Bitsocial-asiakkaat, kuten 5chan ja Seedit, käyttävät selaimessa oletuksena puhdasta peer-to-peer-verkkoa, mutta tämä palvelu on edelleen hyödyllinen valinnaisena varapolkuna käyttäjille, jotka ottavat selaimen P2P:n pois käytöstä, sekä operaattoreille, jotka haluavat julkisia yhteensopivuuspäätepisteitä.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker-vedos**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **Lisenssi**: GPL-3.0-or-later

## Mitä se ajaa

- julkinen HTTP-välityspalvelin pubsub-, yhdyskäytävä-, nimipalvelu- ja delegoidun reitityksen reiteille
- mukana tuleva Kubo-solmu, jossa pubsub on käytössä
- delegoidun HTTP-reitityksen tarjoaja polussa `/routing/v1/providers`
- Prometheus-mittarit polussa `/metrics`
- valinnainen basic-auth-pääsy koko Kubo RPC -rajapintaan

## Portit

Oletusarvot on valittu niin, että Pubsub Provider voi toimia samalla VPS:llä [Bitsocial Seederin](https://bitsocial.net/projects/bitsocial-seeder/) rinnalla ilman swarm-porttien törmäystä.

| Käyttötarkoitus               | Oletus                              | Huomiot                                                      |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| Julkinen HTTP-välityspalvelin | `8000` sovellus, `80` Docker-isäntä | Muuta isäntäporttia asetuksella `PUBSUB_PROVIDER_HTTP_PORT`. |
| Kubo swarm                    | `4002` TCP/UDP                      | Väistää seederin oletusarvoisen Kubo-swarm-portin `4001`.    |
| Kubo API                      | `5001` vain paikallisesti           | Välityspalvelimen sisäisessä käytössä.                       |
| Kubo-yhdyskäytävä             | `8080` vain paikallisesti           | Välityspalvelimen sisäisessä käytössä.                       |

## Asennus Dockerilla

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

Tarkista lokit:

```bash
docker logs --follow pubsub-provider
```

Testaa välityspalvelin:

```bash
curl http://127.0.0.1/commit-hash
```

## Päivittäminen

Jos ajoit aiemmin vanhaa `latest`-vedosta, pakota Compose luomaan kontti uudelleen kiinnitetystä julkaistusta vedoksesta:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

Varmista, että korjattu vedos on käynnissä:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

Lokeissa pitäisi näkyä `using Kubo binary at /app/bin/ipfs`, eikä niissä pitäisi näkyä `downloading ipfs`.

## Ajaminen Bitsocial Seederin rinnalla

Jos samalla isännällä ajetaan myös `bitsocial-seeder`, pidä Pubsub Provider swarm-portissa `4002` tai muussa kuin `4001`-portissa:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

Näin vältetään törmäys, joka syntyy, kun kaksi Kubo-solmua yrittää molemmat varata TCP/UDP-portin `4001`.

## Määritykset

Yleisimmät ympäristömuuttujien ohitukset:

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

Käytä palvelua varavälittimenä, älä selaimen P2P:n korvaajana. Aja tracker-infrastruktuuria edelleen erikseen, kun verkko tarvitsee omistettua kapasiteettia vertaisten löytämiseen.
