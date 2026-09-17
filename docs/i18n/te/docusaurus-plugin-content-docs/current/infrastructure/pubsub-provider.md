---
title: Pubsub ప్రొవైడర్
description: Bitsocial ఆపరేటర్‌ల కోసం ఫాల్‌బ్యాక్ pubsub రిలే మరియు డెలిగేటెడ్ రూటింగ్ ప్రొవైడర్.
sidebar_position: 3
---

# Pubsub ప్రొవైడర్

Pubsub Provider అనేది బండిల్ చేసిన Kubo నోడ్‌తో పాటు Bitsocial-అనుకూల pubsub ఫాల్‌బ్యాక్ రిలేను నడపడానికి ఉద్దేశించిన ఆపరేటర్ సేవ. 5chan మరియు Seedit వంటి ఆధునిక Bitsocial క్లయింట్‌లు డిఫాల్ట్‌గా బ్రౌజర్‌లో స్వచ్ఛమైన పీర్-టు-పీర్ నెట్‌వర్కింగ్‌ను ఉపయోగిస్తాయి, అయినా బ్రౌజర్ P2Pని నిలిపివేసే వినియోగదారుల కోసం లేదా పబ్లిక్ అనుకూలత ఎండ్‌పాయింట్‌లు కావాలనుకునే ఆపరేటర్‌ల కోసం ఐచ్ఛిక ఫాల్‌బ్యాక్ మార్గంగా ఈ సేవ ఇప్పటికీ ఉపయోగపడుతుంది.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker ఇమేజ్**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **లైసెన్స్**: GPL-3.0-or-later

## ఇది ఏమి నడుపుతుంది

- pubsub, గేట్‌వే, name-provider మరియు డెలిగేటెడ్ రూటింగ్ మార్గాల కోసం ఒక పబ్లిక్ HTTP ప్రాక్సీ
- pubsub ప్రారంభించి ఉన్న, బండిల్ చేసిన Kubo నోడ్
- `/routing/v1/providers` వద్ద డెలిగేటెడ్ HTTP రూటింగ్ ప్రొవైడర్
- `/metrics` వద్ద Prometheus మెట్రిక్‌లు
- పూర్తి Kubo RPC APIకి ఐచ్ఛిక బేసిక్-ఆథ్ యాక్సెస్

## పోర్ట్‌లు

స్వార్మ్-పోర్ట్ వైరుధ్యం లేకుండా ఒకే VPSలో [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) పక్కనే Pubsub Provider నడవగలిగేలా డిఫాల్ట్‌లు ఎంచుకోబడ్డాయి.

| ప్రయోజనం              | డిఫాల్ట్                        | గమనికలు                                                               |
| --------------------- | ------------------------------- | --------------------------------------------------------------------- |
| పబ్లిక్ HTTP ప్రాక్సీ | `8000` యాప్, `80` Docker హోస్ట్ | హోస్ట్ పోర్ట్‌ను మార్చడానికి `PUBSUB_PROVIDER_HTTP_PORT` సెట్ చేయండి. |
| Kubo స్వార్మ్         | `4002` TCP/UDP                  | సీడర్ యొక్క డిఫాల్ట్ Kubo స్వార్మ్ పోర్ట్ `4001`ని తప్పిస్తుంది.      |
| Kubo API              | `5001` స్థానికం మాత్రమే         | ప్రాక్సీ అంతర్గతంగా దీన్ని ఉపయోగిస్తుంది.                             |
| Kubo గేట్‌వే          | `8080` స్థానికం మాత్రమే         | ప్రాక్సీ అంతర్గతంగా దీన్ని ఉపయోగిస్తుంది.                             |

## Docker సెటప్

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

లాగ్‌లను తనిఖీ చేయండి:

```bash
docker logs --follow pubsub-provider
```

ప్రాక్సీని పరీక్షించండి:

```bash
curl http://127.0.0.1/commit-hash
```

## అప్‌గ్రేడ్ చేయడం

మీరు గతంలో పాత `latest` ఇమేజ్‌ను నడిపి ఉంటే, పిన్ చేసిన ప్రచురిత ఇమేజ్ నుండి కంటైనర్‌ను తిరిగి సృష్టించమని Composeని బలవంతం చేయండి:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

సరిదిద్దిన ఇమేజ్ నడుస్తోందని ధృవీకరించండి:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

లాగ్‌లలో `using Kubo binary at /app/bin/ipfs` ఉండాలి, `downloading ipfs` ఉండకూడదు.

## Bitsocial Seederతో కలిపి నడపడం

అదే హోస్ట్‌లో `bitsocial-seeder` కూడా నడుస్తుంటే, Pubsub Providerను స్వార్మ్ పోర్ట్ `4002`లో లేదా `4001` కాని మరొక పోర్ట్‌లో ఉంచండి:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

రెండు Kubo నోడ్‌లూ TCP/UDP `4001`ని బైండ్ చేయడానికి ప్రయత్నించినప్పుడు వచ్చే పోర్ట్ వైరుధ్యాన్ని ఇది తప్పిస్తుంది.

## కాన్ఫిగరేషన్

సాధారణ ఎన్విరాన్‌మెంట్ ఓవర్‌రైడ్‌లు:

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

ప్రొవైడర్‌ను ఫాల్‌బ్యాక్ రిలేగా ఉపయోగించండి, బ్రౌజర్ P2Pకి ప్రత్యామ్నాయంగా కాదు. నెట్‌వర్క్‌కు అంకితమైన పీర్ డిస్కవరీ సామర్థ్యం అవసరమైనప్పుడు ట్రాకర్ మౌలిక సదుపాయాలను విడిగా నడుపుతూనే ఉండండి.
