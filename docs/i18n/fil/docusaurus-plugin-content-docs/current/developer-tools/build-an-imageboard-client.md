---
title: Bumuo ng isang imageboard client
description: Phase 1 na gabay sa kontribusyon para sa mga builder na gustong magpadala ng mga bagong karanasan sa imageboard sa Bitsocial.
sidebar_position: 1
---

# Bumuo ng isang imageboard client

Ang Phase 1 ay hindi tungkol sa isang opisyal na app na sumasaklaw sa buong kategorya. Ang 5chan ay ang unang punto ng patunay, ngunit ang aktwal na layunin ay isang malawak na imageboard ecosystem: maraming Bitsocial client na may iba't ibang visual na wika, mga default na moderation, mga modelo ng direktoryo, at mga target na komunidad.

## Ano ang kailangan ng Phase 1

- Mga pamilyar na 4chan-style na kliyente para sa mainstream onboarding
- Altchan-inspired na mga kliyente na may iba't ibang kultura at board bundle
- Mobile-first o low-bandwidth na mga kliyente
- Mga single-community o niche na kliyente na may malakas na opinyong mga default
- Mas mahusay na pag-moderate, media, onboarding, o mga daloy ng pagtuklas kaysa sa ipinadala ng unang app

## Pinakamabilis na paraan para tumulong

Kung gusto mo ang pinakamaikling landas sa pagpapadala, direktang mag-ambag sa 5chan:

- I-explore ang live na app sa [5chan.app](https://5chan.app)
- Suriin ang pinagmulan sa [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Sumali sa builder chat sa [t.me/fivechandev](https://t.me/fivechandev)

## Bumuo ng sarili mong kliyente

Kung hindi tumugma ang 5chan sa komunidad o interface na gusto mo, bumuo na lang ng hiwalay na kliyente. Ang mga katugmang Bitsocial na kliyente ay maaaring magbahagi ng parehong network nang hindi nagbabahagi ng parehong mga desisyon sa produkto.

1. Alamin ang mga tool na nakaharap sa protocol:
   - [Bitsocial React hooks](../react-hooks/)
   - [Bitsocial CLI](../cli/)
2. Magpasya kung anong uri ng imageboard ang aktwal mong itinatayo.
Piliin muna ang istraktura ng board, mga pagpapalagay ng pagkakakilanlan, modelo ng moderation, daloy ng pagtuklas, at visual na wika.
3. Piliin ang landas ng pagpapatupad na akma sa proyekto.
Fork 5chan kung gusto mong gumalaw ng mabilis gamit ang isang pamilyar na base ng imageboard. Magsimula nang bago kung ang UI o modelo ng pakikipag-ugnayan ay kailangang maging lubhang naiiba.
4. Magpadala ng makitid na unang bersyon.
Ang isang kliyente na mahusay na nagsisilbi sa isang tunay na komunidad ay mas mahalaga kaysa sa isang hindi malinaw na clone na nilalayong bigyang-kasiyahan ang lahat.
5. I-publish ang resulta at hayaan ang mga komunidad na subukan ito.
Nagpapabuti ang Bitsocial kapag ang mga tagabuo sa labas ay nagpapadala ng mga kliyenteng may opinyon na nakikipagkumpitensya sa kalidad ng produkto sa halip na maghintay para sa isang opisyal na app na gawin ang lahat.

## Prinsipyo ng disenyo

Hindi mananalo ang Bitsocial sa pagkakaroon ng isang pinagpalang kliyente. Panalo ito kapag maraming kliyente ang maaaring magsamang mabuhay, mag-fork, magpakadalubhasa, at maglingkod ay nangangailangan ng unang app na hindi kailanman gagawin.
