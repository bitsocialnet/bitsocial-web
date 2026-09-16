---
title: Pubsub प्रदाता
description: Bitsocial ऑपरेटरसाठी फॉलबॅक pubsub रिले आणि डेलिगेटेड राउटिंग प्रदाता.
sidebar_position: 3
---

# Pubsub प्रदाता

Pubsub Provider ही ऑपरेटरसाठीची सेवा असून तिच्याद्वारे बंडल केलेल्या Kubo नोडसह Bitsocial-सुसंगत pubsub फॉलबॅक रिले चालवता येतो. 5chan आणि Seedit यांसारखे आधुनिक Bitsocial क्लायंट मूलभूतपणे ब्राउझरमध्येच शुद्ध पीअर-टू-पीअर नेटवर्किंग वापरतात, पण ब्राउझर P2P बंद करणाऱ्या वापरकर्त्यांसाठी पर्यायी फॉलबॅक मार्ग म्हणून, तसेच सार्वजनिक सुसंगतता एंडपॉइंट हवे असलेल्या ऑपरेटरसाठी ही सेवा उपयुक्त राहते.

- **GitHub**: [bitsocialnet/pubsub-provider](https://github.com/bitsocialnet/pubsub-provider)
- **Docker प्रतिमा**: [`ghcr.io/bitsocialnet/pubsub-provider`](https://github.com/bitsocialnet/pubsub-provider/pkgs/container/pubsub-provider)
- **परवाना**: GPL-3.0-or-later

## ते काय चालवते

- pubsub, गेटवे, name-provider आणि डेलिगेटेड राउटिंग मार्गांसाठी सार्वजनिक HTTP प्रॉक्सी
- pubsub सक्षम असलेला बंडल केलेला Kubo नोड
- `/routing/v1/providers` येथे डेलिगेटेड HTTP राउटिंग प्रदाता
- `/metrics` येथे Prometheus मेट्रिक्स
- संपूर्ण Kubo RPC API ला पर्यायी बेसिक-ऑथ प्रवेश

## पोर्ट

मूलभूत मूल्ये अशी निवडली आहेत की Pubsub Provider हा त्याच VPS वर [Bitsocial Seeder](https://bitsocial.net/projects/bitsocial-seeder/) च्या शेजारी swarm-पोर्टच्या टकरीशिवाय चालू शकेल.

| उद्देश                  | मूलभूत                            | टिपा                                                         |
| ----------------------- | --------------------------------- | ------------------------------------------------------------ |
| सार्वजनिक HTTP प्रॉक्सी | ॲपमध्ये `8000`, Docker होस्ट `80` | होस्ट पोर्ट बदलण्यासाठी `PUBSUB_PROVIDER_HTTP_PORT` सेट करा. |
| Kubo swarm              | `4002` TCP/UDP                    | seeder च्या मूलभूत Kubo swarm पोर्ट `4001` ला टाळते.         |
| Kubo API                | फक्त स्थानिक `5001`               | प्रॉक्सीकडून अंतर्गत वापरले जाते.                            |
| Kubo गेटवे              | फक्त स्थानिक `8080`               | प्रॉक्सीकडून अंतर्गत वापरले जाते.                            |

## Docker सेटअप

```bash
git clone https://github.com/bitsocialnet/pubsub-provider.git
cd pubsub-provider
docker compose pull
docker compose up -d
```

लॉग तपासा:

```bash
docker logs --follow pubsub-provider
```

प्रॉक्सीची चाचणी घ्या:

```bash
curl http://127.0.0.1/commit-hash
```

## अपग्रेड करणे

तुम्ही याआधी जुनी `latest` प्रतिमा चालवत असाल, तर पिन केलेल्या प्रकाशित प्रतिमेपासून कंटेनर पुन्हा तयार करण्यास Compose ला भाग पाडा:

```bash
git pull
docker compose down
docker compose pull
docker compose up -d --force-recreate
```

दुरुस्त केलेली प्रतिमा चालू आहे याची पडताळणी करा:

```bash
docker inspect pubsub-provider --format 'image={{.Image}} restarts={{.RestartCount}}'
docker exec pubsub-provider /app/bin/ipfs version
curl http://127.0.0.1/commit-hash
```

लॉगमध्ये `using Kubo binary at /app/bin/ipfs` दिसायला हवे आणि `downloading ipfs` दिसायला नको.

## Bitsocial Seeder सोबत चालवणे

त्याच होस्टवर `bitsocial-seeder` देखील चालत असेल, तर Pubsub Provider ला swarm पोर्ट `4002` वर किंवा `4001` नसलेल्या दुसऱ्या पोर्टवर ठेवा:

```bash
PUBSUB_PROVIDER_SWARM_PORT=4002 docker compose up -d
```

यामुळे दोन Kubo नोड्स एकाच वेळी TCP/UDP `4001` ला बांधण्याचा प्रयत्न करतात तेव्हा होणारी पोर्टची टक्कर टळते.

## कॉन्फिगरेशन

सामान्य एन्व्हायर्नमेंट ओव्हरराइड:

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

या प्रदात्याचा वापर फॉलबॅक रिले म्हणून करा, ब्राउझर P2P चा पर्याय म्हणून नाही. नेटवर्कला समर्पित पीअर-शोध क्षमतेची गरज असेल तेव्हा ट्रॅकर पायाभूत सुविधा स्वतंत्रपणे चालवत राहा.
