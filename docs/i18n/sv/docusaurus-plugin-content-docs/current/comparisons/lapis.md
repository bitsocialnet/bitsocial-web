---
title: Bitsocial och Lapis Net
description: Hur Lapis Net, ett socialt peer-to-peer-protokoll i Kotlin med förtroendepoäng per läsare och synlighet som backas av Bitcoin, står sig mot Bitsocial.
---

# Bitsocial och Lapis Net

[Lapis Net](https://net.lapisproject.dev/) är ett protokoll för sociala peer-to-peer-nätverk,
skrivet i Kotlin för JVM. Det har på egen hand kommit fram till grunder som liknar Bitsocials:
identiteter baserade på nyckelpar, innehållslagring i IPFS-stil och libp2p gossipsub. De två skiljer
sig i var de placerar spamfiltrering och kurering. Lapis ger varje läsare en personlig
förtroendegraf och låter betalningar med Bitcoin och Lightning öka synligheten; Bitsocial låter
varje community bestämma vad som får publiceras.

Lapis är en fungerande prototyp. I oktober 2026 hade det ännu inget publikt nätverk, och att ansluta
två noder var ett manuellt steg, enligt dess
[kodförråd](https://github.com/lapisproject-dev/Lapis-Net).

## Hur Lapis fungerar

- **Identiteter.** Varje identitet är ett secp256k1-nyckelpar, kompatibelt med Bitcoin-nycklar, med
  en Ed25519-nyckel knuten till sig för libp2p-peer-ID:t.
- **Lagring och spridning.** Innehåll lagras med Nabu, en IPFS-implementation på libp2p (DHT och
  Bitswap), och sprids med libp2p gossipsub.
- **Poängsättning.** Fyra valfria poäng ligger ovanpå en kärna som förblir neutral när det gäller
  kurering:
  - Veritas, ett förtroendenätverk som beräknas utifrån varje läsares egen förtroendegraf
  - Virtus, synlighet som backas av betalningsbevis på kedjan eller via Lightning och som avtar med
    tiden
  - Karma, gratis gillamarkeringar viktade med Veritas
  - Madli, ett ryktespoäng som noder för över varandras beteende
- **Meddelanden.** Totalsträckskrypterade direktmeddelanden, röstsamtal mellan två personer och ett
  e-postliknande asynkront meddelandesystem ingår i projektet.
- **Klienter.** Varje användare kör en JVM-nod. Referensklienten är ett webbgränssnitt som levereras
  av den lokala noden.

## Där de skiljer sig åt

### Vem som filtrerar spam

Lapis filtrerar hos läsaren. Innehållet sprids, och sedan avgör varje läsares förtroendegraf och
betalningsreglerna i den app läsaren använder vad som syns. Bitsocial filtrerar i communityn: ett
inlägg måste klara communityns utmaning innan communityns nod accepterar det, så avvisat spam blir
aldrig en del av communityn. Se [Anpassade anti-spam-utmaningar](/custom-challenges/).

### Vem som har makten

I Lapis bestämmer varje läsare vem den litar på, och operatören av varje app bestämmer hur betald
synlighet fungerar där. I Bitsocial sätter en communityägare reglerna för just den communityn, och
appar väljer vad de visar. Ingen av dem har en administratör på protokollnivå.

### Ekonomi

Lapis bygger in betalningsbevis från Bitcoin och Lightning i sitt synlighetspoäng. Bitsocial har
inget betalningslager i protokollet; en community kan kräva en betalning eller en token genom sin
utmaning.

### Webbläsare

Bitsocial-appar kan köra en peer-to-peer-nod i en vanlig webbläsarflik. Se
[Peer-to-peer i webbläsaren](/browser-p2p/). Lapis webbläsargränssnitt är en lokal sida som
levereras av användarens JVM-nod.

### Omfattning

Lapis paketerar direktmeddelanden, röstsamtal och e-post. Bitsocial fokuserar på offentliga
communityer och har ännu inga inbyggda direktmeddelanden.

## Jämförelse

| Fråga                  | Lapis Net                                                                                | Bitsocial                                                                           |
| ---------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Kategori               | Socialt peer-to-peer-protokoll (prototyp)                                                | Peer-to-peer-nätverk av communityer                                                 |
| Identitet              | secp256k1-nyckelpar med ett knutet Ed25519-peer-ID                                       | Ed25519-nyckelpar för användare och communityer                                     |
| Var inläggen finns     | Nabu-lagring (IPFS på libp2p) på deltagande noder                                        | Communityägarens nod och de peers som läser och seedar den                          |
| Communityer            | Inget community-objekt; kurering sker per läsare och per app                             | Förstklassiga objekt vars nod accepterar eller avvisar inlägg                       |
| Spamskydd              | Läsarens förtroendegraf, betald synlighet, Lightning-insättningar för första meddelanden | Varje communitys utmaning innan ett inlägg accepteras                               |
| Moderering             | Varje läsares förtroendegraf; appoperatörer sätter reglerna för betald synlighet         | Communityägare modererar sin community; appar väljer vad de visar                   |
| Ekonomi                | Betalningsbevis från Bitcoin och Lightning i poängsättningen                             | Ingen i protokollet; en utmaning kan kräva en betalning eller token                 |
| Webbläsare             | Lokalt webbgränssnitt som levereras av en JVM-nod                                        | Peer-to-peer-nod i en vanlig webbläsarflik                                          |
| Nätverk                | Prototyp utan publikt nätverk                                                            | Live-nätverk med appar som [5chan](/apps/5chan/) och [Seedit](/apps/seedit/)        |
| Viktigaste avvägningen | Rikt inbyggt rykte och meddelanden, men inget publikt nätverk ännu                       | Mindre kärna som körs i webbläsare, men inget inbyggt rykte eller direktmeddelanden |

## Skulle de kunna fungera tillsammans?

Bitsocial-utmaningar är godtycklig kod, så ett förtroendepoäng i Lapis-stil skulle kunna bli en
sådan. Den inbyggda utmaningen `whitelist` kan redan läsa listor över tillåtna adresser från URL:er.
En tjänst som publicerade de Bitsocial-adresser som en Veritas-graf litar på skulle kunna låta de
författarna slippa en CAPTCHA i en community. Det skulle kräva ett sätt att koppla en
Lapis-identitet till en Bitsocial-adress, och inget sådant finns i dag.
