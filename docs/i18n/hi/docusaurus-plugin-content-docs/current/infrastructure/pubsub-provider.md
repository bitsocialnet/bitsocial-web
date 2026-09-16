---
title: Pubsub Provider
description: Bitsocial ऑपरेटरों के लिए फ़ॉलबैक pubsub रिले और डेलिगेटेड रूटिंग प्रोवाइडर।
sidebar_position: 3
---

# Pubsub Provider

Pubsub Provider एक ऑपरेटर सेवा है, जिससे बंडल किए गए Kubo नोड के साथ Bitsocial-संगत pubsub फ़ॉलबैक रिले चलाया जा सकता है। 5chan और Seedit जैसे आधुनिक Bitsocial क्लाइंट ब्राउज़र में डिफ़ॉल्ट रूप से शुद्ध पीयर-टू-पीयर नेटवर्किंग का उपयोग करते हैं, फिर भी यह सेवा उन उपयोगकर्ताओं के लिए एक वैकल्पिक फ़ॉलबैक रास्ते के रूप में उपयोगी बनी रहती है जो ब्राउज़र P2P बंद कर देते हैं, और उन ऑपरेटरों के लिए भी जो सार्वजनिक संगतता एंडपॉइंट रखना चाहते हैं।

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker इमेज**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **लाइसेंस**: GPL-3.0-or-later

## यह क्या चलाता है

- pubsub, गेटवे, name-provider और डेलिगेटेड रूटिंग रूट्स के लिए एक सार्वजनिक HTTP प्रॉक्सी
- pubsub सक्षम किया हुआ एक बंडल किया गया Kubo नोड
- `/routing/v1/providers` पर एक डेलिगेटेड HTTP रूटिंग प्रोवाइडर
- `/metrics` पर Prometheus मेट्रिक्स
- पूरे Kubo RPC API तक वैकल्पिक बेसिक-ऑथ पहुँच

## पोर्ट

डिफ़ॉल्ट मान इस तरह चुने गए हैं कि Pubsub Provider उसी VPS पर [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) के साथ-साथ, स्वार्म-पोर्ट टकराव के बिना चल सके।

| उद्देश्य                | डिफ़ॉल्ट                            | टिप्पणियाँ                                                     |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------- |
| सार्वजनिक HTTP प्रॉक्सी | ऐप में `8000`, Docker होस्ट पर `80` | होस्ट पोर्ट बदलने के लिए `PUBSUB_PROVIDER_HTTP_PORT` सेट करें। |
| Kubo स्वार्म            | `4002` TCP/UDP                      | सीडर के डिफ़ॉल्ट Kubo स्वार्म पोर्ट `4001` से टकराव टालता है।  |
| Kubo API                | केवल स्थानीय `5001`                 | प्रॉक्सी इसे आंतरिक रूप से उपयोग करता है।                      |
| Kubo गेटवे              | केवल स्थानीय `8080`                 | प्रॉक्सी इसे आंतरिक रूप से उपयोग करता है।                      |

## Docker सेटअप

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

लॉग देखें:

```bash
docker logs --follow pubsub-provider
```

प्रॉक्सी की जाँच करें:

```bash
curl http://127.0.0.1/commit-hash
```

## अपग्रेड करना

यदि आप पहले पुरानी `latest` इमेज चला रहे थे, तो Compose को बाध्य करें कि वह पिन की गई प्रकाशित इमेज से कंटेनर दोबारा बनाए:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

सत्यापित करें कि सुधारी गई इमेज चल रही है:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

लॉग में `using Kubo binary at /app/bin/ipfs` दिखना चाहिए और `downloading ipfs` नहीं दिखना चाहिए।

## Bitsocial Seeder के साथ चलाना

यदि वही होस्ट `bitsocial-seeder` भी चलाता है, तो Pubsub Provider को स्वार्म पोर्ट `4002` पर या `4001` से भिन्न किसी अन्य पोर्ट पर रखें:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

इससे वह पोर्ट टकराव टल जाता है जो तब होता है जब दो Kubo नोड्स एक ही TCP/UDP `4001` पर बाइंड करने की कोशिश करते हैं।

## कॉन्फ़िगरेशन

आम एनवायरनमेंट ओवरराइड:

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

इस प्रोवाइडर को फ़ॉलबैक रिले के रूप में उपयोग करें, ब्राउज़र P2P के विकल्प के रूप में नहीं। जब नेटवर्क को समर्पित पीयर-डिस्कवरी क्षमता चाहिए हो, तब ट्रैकर इंफ़्रास्ट्रक्चर अलग से चलाते रहें।
