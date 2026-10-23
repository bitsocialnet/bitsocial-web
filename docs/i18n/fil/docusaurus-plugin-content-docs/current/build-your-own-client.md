---
title: Bumuo ng sarili mong Bitsocial client
description: Gabay para sa mga developer sa paglulunsad ng mga independiyenteng Bitsocial client, mula sa mga imageboard at forum hanggang sa mga niche na social app.
---

# Bumuo ng sarili mong Bitsocial client

Hindi nananalo ang Bitsocial sa pamamagitan ng pagkakaroon ng iisang opisyal na app para sa bawat
gamit. Nananalo ito kapag maraming client ang makakabahagi sa iisang protocol habang naglalaban sa
interface, kultura, pagtuklas, mga default, at modelo ng negosyo.

Ang 5chan at Seedit ay mga maagang patunay, hindi hangganan. Dapat kayang maglunsad ng isang
developer ng bagong imageboard, forum, profile client, mobile-first na social app, niche na
kasangkapan para sa komunidad, o sentralisadong client na gumagamit ng Bitsocial sa ilalim, nang
hindi humihingi ng pahintulot sa isang may-ari ng platform.

## Ano ang mababago ng mga developer

Maaaring makipagkumpitensya ang isang Bitsocial client sa mga desisyon tungkol sa produkto nang
hindi kailangang i-fork ang buong network:

- interface at biswal na wika
- daloy ng onboarding
- mga default ng komunidad
- mga bahagi para sa moderation
- modelo ng pagtuklas
- karanasan sa media
- mga limitasyon sa mobile, desktop, o mababang bandwidth
- monetisasyon at modelo ng negosyo

Ang protocol ang karaniwang layer. Bukas sa kumpetisyon ang layer ng produkto.

## Pinakamabilis na paraan para matuto

Magsimula sa mga app na umiiral na:

- Subukan ang [5chan](https://5chan.app) para sa mga anonymous na komunidad ng imageboard.
- Subukan ang [Seedit](https://seedit.app) para sa talakayang tulad ng sa Reddit.
- Basahin ang dokumentasyon ng [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) para sa integrasyon sa panig ng client.
- Basahin ang dokumentasyon ng [Bitsocial CLI](/developer-tools/cli/) para sa mga operasyon ng node at komunidad.

Kung gusto mong kumilos nang mabilis, mag-ambag muna sa isang umiiral na app. Kung hindi kasya ang
interface, kultura, o modelo ng komunidad na gusto mo, bumuo ng hiwalay na client.

## Pumili ng makitid na unang bersyon

Ang pinakamainam na unang bersyon ay hindi isang unibersal na social app. Ito ay isang client na may
isang malinaw na madla at isang matibay na dahilan para umiral.

Kabilang sa magagandang panimulang punto ang:

- isang mas malinis na imageboard client para sa isang partikular na kultura
- isang mobile-first na forum client
- isang app para sa iisang komunidad na may mahigpit na mga default
- isang client para sa komunidad ng mga creator
- isang read-only na client para sa pagtuklas
- isang console para sa moderation o para sa operator
- isang client na na-optimize para sa isang wika, rehiyon, o klase ng device

Kapaki-pakinabang ang maliliit na client dahil hinahayaan sila ng Bitsocial na lumago tungo sa
iisang network sa halip na ikulong ang kanilang mga user sa isang pribadong database.

## Mga landas ng implementasyon

May tatlong praktikal na landas:

1. I-fork ang isang umiiral na client kapag malapit ang iyong ideya sa 5chan o Seedit.
2. Bumuo ng bagong React client gamit ang [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Bumuo ng sarili mong integrasyon sa ibabaw ng mga node API at pampublikong imprastrakturang RPC.

Dapat gawing mas praktikal ng pampublikong RPC ang ikatlong landas. Maaaring magsimula ang isang
user sa pamamagitan ng isang naka-host at non-custodial na RPC provider, at lumipat sa self-hosting
o sa isang katunggaling provider sa bandang huli.

## Prinsipyo sa disenyo

Buuin ang client na nararapat umiral para sa iyong komunidad, at hayaang magkumpitensya nang
hayagan ang mga magkatugmang client.
