---
title: Kasaysayan ng BSO Token
description: Ang buong kasaysayan ng bawat henerasyon ng BSO token, mula sa pinagmulan nito sa Avalanche noong 2021 hanggang sa hindi na mababago at walang admin na contract sa Ethereum ngayon.
---

# Kasaysayan ng BSO Token

Ang BSO ay isang provenance coin. Bukas ang protocol sa likod ng Bitsocial, at sinadyang gawing
opsyonal ang token at ang chain: kahit sino ay maaaring mag-fork ng code, magpatakbo ng sarili
niyang client, o bumuo ng sarili niyang ekonomiya sa ibabaw nito. Ang hindi maaaring i-fork palayo
ay ang pinagmulan. Ang BSO ang naging opisyal na token ng Bitsocial mula pa sa unang araw, at ang
bawat migrasyon mula noon ay mabe-verify on-chain.

Inililista ng pahinang ito ang bawat henerasyon ng token, ayon sa pagkakasunod-sunod, kasama ang
buong contract address upang masuri ng sinuman ang tala nang nakapag-iisa.

## Gen 1: ang pinagmulan, Avalanche, 2021

- **Chain**: Avalanche
- **Taon**: 2021
- **Address**: `0x625fc9bb971bb305a2ad63252665dcfe9098bee9`
- **Explorer**: [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)

Dito nagsimula ang BSO. Ipinamigay ang supply sa pamamagitan ng tatlong airdrop at mga reward mula
sa liquidity mining, nang walang presale at walang alokasyon para sa team na inuna kaysa sa
komunidad. Ang contract ay isang upgradeable proxy, na karaniwang gawi
noong panahong iyon at nagpahintulot sa team na maglabas ng mga pag-aayos sa maagang yugto ng
token.

## Gen 2: ang paglipat sa Ethereum, 2024

- **Chain**: Ethereum
- **Taon**: 2024
- **Address**: `0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)

Inilipat ng Gen 2 ang BSO mula Avalanche patungong Ethereum, kung saan itinatayo ang natitirang
bahagi ng roadmap ng Bitsocial Chain. Tulad ng Gen 1, isa pa ring upgradeable proxy ang contract na
ito, na pinanatili sa isa pang henerasyon habang inihahanda ang pinal at permanenteng contract.

## Gen 3: ganap na hindi mababago, 2025

- **Chain**: Ethereum
- **Taon**: 2025
- **Address**: `0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A`
- **Explorer**: [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)

Ang Gen 3 ang kasalukuyan at pinal na BSO contract. Ganap itong hindi mababago at walang admin:

- walang mint function, kaya hindi mapapalobo ang supply
- walang owner address, kaya walang sinumang makakapagbago ng kilos ng contract nang mag-isa
- walang pause function, kaya hindi maaaring i-freeze ang mga transfer
- walang proxy pattern, kaya hindi mapapalitan ang mismong lohika sa hinaharap

Ito ang huling kalagayang pinatutunguhan ng unang dalawang henerasyon: isang token na wala nang
natitirang admin key na maaaring hawakan.

## Paano gumana ang mga migrasyon

Ang bawat migrasyon, Gen 1 patungong Gen 2 at Gen 2 patungong Gen 3, ay isang passive na 1:1
airdrop. Hindi kinailangan ng mga holder na magsumite ng claim, pumirma ng mensahe, o gumawa ng
anumang aksyon. Direktang binasa ang mga balanse sa lumang contract at sinalamin nang 1:1 sa bagong
contract, kaya eksaktong napanatili ang posisyon ng bawat holder sa kabuuan ng migrasyon.

Dahil nananatiling pampubliko at on-chain ang luma at bagong contract, mabe-verify nang
nakapag-iisa ang bawat hakbang ng prosesong ito. Maaaring ihambing ng sinuman ang mga makasaysayang
snapshot ng holder mula sa Gen 1 o Gen 2 laban sa kasalukuyang mga balanse sa Gen 3 at kumpirmahin
na tumugma ang migrasyon sa inaangkin nito. Walang bahagi ng kasaysayang ito ang nakasalalay sa
basta pagtitiwala sa sinasabi ng Bitsocial.

## I-verify ang lahat

Huwag basta paniwalaan ang alinman dito. Suriin nang direkta ang tala:

- Gen 1 sa [Snowscan](https://snowscan.xyz/address/0x625fc9bb971bb305a2ad63252665dcfe9098bee9)
- Gen 2 sa [Etherscan](https://etherscan.io/token/0xEA81DaB2e0EcBc6B5c4172DE4c22B6Ef6E55Bd8f)
- Gen 3 sa [Etherscan](https://etherscan.io/token/0xB50cea4c109dc223A10d44c14f521CaeD91DaB5A)
- ang kasalukuyang site ng chain sa [chain.bitsocial.net](https://chain.bitsocial.net)

Kung hindi tumugma ang isang address sa nakalista rito, hindi iyon ang opisyal na BSO token.
