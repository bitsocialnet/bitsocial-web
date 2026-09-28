---
title: Peer-to-Peer sa Browser
description: Kung paano nagpapatakbo ang isang Bitsocial web app ng tunay na libp2p node sa loob ng browser tab, kung anong mga transport ang ginagamit nito, at ang upstream fix noong 2026 na nagpagana sa pag-publish mula sa isang tab.
---

# Peer-to-Peer sa Browser

Hindi kailangang maging kliyente ng server ng iba ang isang Bitsocial web app. Kaya nitong magpatakbo ng
[Helia](https://helia.io/) node sa loob mismo ng browser tab, sumali sa parehong peer-to-peer network na
kinabibilangan ng mga desktop at CLI node, kumuha ng content ng komunidad mula sa mga peer, at maglathala sa pubsub.

Ipinapaliwanag ng pahinang ito kung ano talaga ang kahulugan niyon, kung anong mga transport ang ginagamit nito, kung ano ang
hindi pa rin nito kaya, at kung bakit noong 2026 pa lamang nagsimulang gumana ang pag-publish mula sa isang tab.

Para sa mas malawak na disenyo ng network, tingnan ang [Protokol ng Peer-to-Peer](/peer-to-peer-protocol/).

## Ano ang tumatakbo sa tab

Kapag aktibo ang browser P2P, may hawak na tunay na libp2p node ang pahina:

- nagda-dial ito ng ibang mga peer sa pamamagitan ng secure WebSockets
- kinukuha at bini-verify nito ang content ng komunidad mula sa mga peer na iyon, hindi mula sa isang IPFS gateway
- lumalahok ito sa gossipsub, kaya hindi na kailangan ng naka-host na pubsub provider para makapaglathala ng post
- ginagamit nito ang parehong protocol client stack (`pkc-js`) tulad ng lahat ng ibang Bitsocial app

Ang praktikal na resulta ay wala nang operator ng gateway na nakaupo sa pagitan ng isang web reader at ng isang komunidad.
Walang iisang HTTPS endpoint na maaaring pilitin upang ibaba ang isang komunidad para sa lahat ng browser user
nang sabay-sabay.

## Paano kumokonekta ang mga browser node

Nagda-dial ang `pkc-js` ng mga peer sa pamamagitan ng **secure WebSockets**. Ang mga dial sa WebRTC at WebTransport ay tinatanggihan
bilang default sa pamamagitan ng isang connection gater, dahil sa browser ay nagdaragdag ang mga ito ng mahaba at madalas
nabibigong daan sa pagbuo ng koneksyon — negosasyon ng STUN/ICE, pag-ikot ng certhash — na nagpapabagal sa pag-load ng pahina,
samantalang nagbibigay ang WebSocket ng direkta at maaasahang transport. Ang mga caller na talagang gustong gumamit ng WebRTC o
WebTransport ay maaaring i-override ang gater sa pamamagitan ng
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Ang praktikal na resulta ay kumokonekta ang isang browser peer sa mga node na may nakalantad na WSS endpoint, na
nangangahulugang kailangan ng mga node na iyon ng domain at sertipikong nilagdaan ng CA. Ang mga peer na nasa likod ng consumer
connection na walang ganoon ay naaabot nang hindi tuwiran sa halip na i-dial mula sa tab.

## Bakit noong 2026 pa lamang gumana ang pag-publish mula sa browser

Hindi bagong ideya ang browser peer-to-peer. Ang nagbago noong 2026 ay ang mga _post_ ng isang browser node ay
nakakarating na ngayon sa iba pang bahagi ng network.

Hinihingi ng libp2p pubsub spec na ang `seqno` ng isang mensahe ay isang linear na tumataas na 64-bit big-endian
integer. Sa halip ay bumubuo ang `js-libp2p-gossipsub` ng 8 random na byte, habang parehong gumagamit ng counter ang
go-libp2p-pubsub at rust-libp2p. Pinapagana ng Kubo 0.40+ ang `BasicSeqnoValidator` bilang default, na tumatanggi
sa anumang mensahe na ang seqno ay hindi mas mataas kaysa sa pinakamataas na nakita na mula sa peer na iyon.

Ang naging epekto ay tahimik na itinatapon ng mga Kubo peer ang halos lahat ng mensaheng inilathala ng isang
JavaScript node — kabilang ang isang browser node. Sa isang reproducer, 2 hanggang 8 sa 30 mensahe ang dumarating.

Na-diagnose ito sa
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) at naayos sa
**`@libp2p/gossipsub` 15.0.21** noong Mayo 2026. Hanggang hindi iyon dumating, kayang kumonekta at magbasa ng isang
browser node, ngunit kadalasang naglalaho ang mga post nito sa daan papunta sa mga Go peer. Ang `pkc-js` ay may kasamang
`@libp2p/gossipsub` 16.0.4, lampas na sa fix na iyon.

## Ano ang hindi pa rin kayang gawin ng isang browser node

Ang browser node ay tunay na peer, hindi server. Iba ang mga limitasyon nito kumpara sa isang desktop o
palaging-nakabukas na node:

- kadalasan ay hindi ito makatatanggap ng basta-bastang papasok na koneksyon mula sa pampublikong internet
- gumagana lamang ito habang bukas ang tab, kaya hindi ito pangmatagalang host para sa data ng isang komunidad
- hindi ito makakasali sa isang libp2p DHT, kaya dumaraan sa mga HTTP router ang discovery
- hindi ito angkop para sa seeding sa malaking sukat

Ang buong pag-host ng komunidad ay mas mainam pa ring hawakan ng isang desktop app, ng `bitsocial-cli`, o ng ibang
palaging-nakabukas na node. Binabago ng browser P2P kung sino ang _makakabasa at makakapaglathala_ nang walang gateway; hindi
nito inaalis ang pangangailangan para sa mga peer na nananatiling online.

## Ang mga HTTP router ay hindi gateway

Nagtatanong pa rin ang mga browser client sa [mga HTTP router](/peer-to-peer-protocol/#public-key-based-addressing)
upang malaman kung aling mga peer ang kasalukuyang nagbibigay ng address ng isang komunidad. Ito ang matapat na asterisk sa
"purong peer-to-peer sa browser," at sulit itong linawin nang tumpak:

- ang isang router ay nag-iimbak lamang ng mga address ng peer para sa isang content address
- hindi nito iniimbak, inihahatid, o nalalaman man lang ang content ng komunidad
- sabay-sabay na nagtatanong ang mga client sa ilang router at pinagsasama ang mga resulta
- kahit sino ay makakapagpatakbo ng isa, at ang pagpapalit ng router ay pagbabago lamang sa config na walang migration ng data

Pagkatapos ng discovery, peer-to-peer na ang paglipat ng content at ng pubsub traffic. Ang isang router na mawala ay
nagkakahalaga sa iyo ng isang lookup path, hindi ng iyong data. Ang isang IPFS gateway naman ay nasa mismong daanan ng content.

## Saan ito tumatakbo ngayon

- Ang [5chan](/apps/5chan/) ay nagpapatakbo ng purong browser P2P bilang default sa web app sa
  [5chan.app](https://5chan.app).

## Fallback sa gateway

Umiiral pa rin ang access sa pamamagitan ng gateway bilang compatibility path para sa mga browser o network na hindi kayang
sumali nang direkta. Tingnan ang [Fallback sa gateway](/peer-to-peer-protocol/#gateway-fallback). Ang target na
arkitektura ay browser P2P muna, na may mga gateway bilang opsyonal na fallback sa halip na maging default na
bottleneck.
