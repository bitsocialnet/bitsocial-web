---
title: Aplicació emblemàtica Bitsocial
description: "El client Bitsocial proposat basat en el perfil: familiar com X/Twitter per defecte, però amb RPC, fonts, algorismes, anuncis i comunitats substituïbles."
---

# Aplicació emblemàtica Bitsocial

L'aplicació insígnia Bitsocial és el primer client basat en perfils proposat per a la xarxa. La comparació més senzilla és: familiar com X/Twitter per defecte, però amb la capa de plataforma oberta.

Afegiria perfils, seguiments, respostes, fonts, comunitats, notificacions i converses públiques en temps real, mantenint els serveis subjacents substituïbles. 5chan demostra que les comunitats anònimes poden funcionar. Seedit avança cap a una discussió persistent. L'aplicació insígnia portaria aquests efectes de xarxa a un canal social principal sense convertir una empresa en propietari del gràfic.

Aquesta pàgina descriu la direcció del producte, no una especificació de llançament bloquejada. La interfície exacta, el feed predeterminat, el model d'anunci, les funcions d'IA i el mercat RPC poden canviar a mesura que el protocol i les primeres aplicacions maduren.

## El que hauria de demostrar

L'aplicació hauria de demostrar que una xarxa social basada en perfils pot evitar convertir-se en una plataforma de custòdia:

- els usuaris poden posseir identitats i perfils
- les comunitats i els nodes de perfil poden mantenir-se peer-to-peer
- les comunitats poden tenir efectes de xarxa entre els clients de Bitsocial
- Els proveïdors de RPC poden fer que l'aplicació sigui convenient sense tenir-ne la custòdia
- els algorismes d'alimentació poden ser serveis opcionals en lloc de la llei de la plataforma
- altres clients encara poden competir per la mateixa xarxa

La qüestió no és fer l'únic client de Bitsocial. La qüestió és fer el primer client ampli que mostri fins a quin punt es pot estendre el protocol.

## Conegut per defecte, reemplaçable pel disseny

L'experiència predeterminada hauria de ser competitiva amb les aplicacions de converses públiques principals: una alimentació ràpida a casa, seguiments, respostes, distribució a l'estil de republicació, comunitats, notificacions, cerca i una visualització classificada per a tu que funciona immediatament.

Bitsocial Forge pot executar el primer servei de feed i RPC predeterminat. Aquesta predeterminada pot incloure un feed i anuncis classificats perquè l'aplicació se senti completa el primer dia en lloc de demanar als usuaris principals que muntin ells mateixos tota la pila.

La diferència és que el predeterminat no s'ha de convertir en la presó. Un usuari hauria de poder canviar els RPC, els feeds, les instàncies, els sistemes de classificació, els anuncis i els proveïdors de descobriment, o eliminar la classificació completament. L'aplicació es pot opinar en el primer llançament, alhora que es pot substituir tots els serveis principals.

Això fa que l'aplicació sigui més personalitzable que una plataforma convencional. Un usuari pot mantenir el feed classificat predeterminat amb anuncis. Un altre podria utilitzar un canal cronològic sense classificació. Un altre podria triar un RPC centrat en la privadesa, un servei de descobriment gestionat per la comunitat, un feed sense anuncis de pagament o un algorisme de nínxol creat per a una subcultura específica.

## Comunitats interclient

Les comunitats haurien de ser molt més importants que els grups aïllats dins d'una aplicació.

A X/Twitter, les comunitats es limiten a X. Poden ser útils, però hereten els límits d'una plataforma, un sistema de comptes, una pila de recomanacions i una superfície de producte.

Es pot crear, allotjar, descobrir i utilitzar una comunitat Bitsocial a través de diferents clients. Això vol dir que l'aplicació insígnia pot mostrar comunitats i publicacions de la xarxa més àmplia Bitsocial, no només dels usuaris que van començar dins de l'aplicació insígnia. Una comunitat podria tenir activitat d'un client de tauler d'imatges, un client de discussió a l'estil Reddit, un client de fòrums de nínxol, una aplicació mòbil i l'aplicació emblemàtica alhora.

Aquest és l'avantatge bàsic de l'efecte de la xarxa: un client pot sentir-se familiar per als usuaris generals tot i que encara treu valor de molts clients, nodes de la comunitat, proveïdors de RPC i serveis independents.

## Algoritmes d'alimentació opcionals

L'aplicació insígnia no hauria d'obligar un sistema de classificació global a tothom.

Els algorismes de canals haurien d'estar activats. Un usuari podria triar un algorisme d'un mercat, canviar de proveïdor, utilitzar un algorisme d'una empresa, utilitzar un algorisme gestionat per un operador anònim, utilitzar un algorisme creat per una comunitat, executar-ne un de personal o no utilitzar cap algorisme.

Els proveïdors públics de RPC són un lloc natural per competir aquests serveis. Poden indexar, classificar i recomanar contingut, però no haurien de ser propietaris de l'usuari ni del perfil.

Aquests serveis també poden competir amb la forma de l'aplicació. Un RPC pot proporcionar un feed classificat amb anuncis. Un altre podria proporcionar un feed cronològic sense classificar. Un altre podria especialitzar-se en privadesa, traducció, moderació, descobriment de comunitats o un gràfic social de nínxol.

Si l'economia funciona, els serveis de feeds recolzats per RPC podrien afegir funcions d'IA similars a les que les plataformes convencionals intenten incloure als seus feeds: traduccions automàtiques, resums, respostes assistides per bot, respostes de cerca, assistència a la moderació o context d'estil de notes de la comunitat.

Aquestes característiques haurien de ser opcions de servei, no requisits de protocol. Un RPC predeterminat pot competir oferint un feed més ric, però els usuaris i els clients competidors encara haurien de poder triar alternatives més senzilles, privades, cronològiques, sense anuncis o específiques de la comunitat.

## RPC no custodial

Cada usuari hauria de poder participar com un node peer-to-peer complet mitjançant RPC sense donar al proveïdor RPC la propietat de la seva identitat o perfil.

El camí allotjat és important perquè la majoria dels usuaris no començaran executant un servidor. El camí de sortida és igual de important: un usuari hauria de poder moure's al seu propi node de perfil amb un maquinari de baixes especificacions, inclòs un Raspberry Pi, sempre que vulgui.

Aquesta és la diferència entre la comoditat i la custòdia.

## Per què es pot convertir en una aplicació de tot

Si Bitsocial Network ofereix a les aplicacions noms duradors, pagaments, propina, premis i altres vies financeres, l'aplicació insígnia podria convertir-se en molt més que un client d'alimentació.

La limitació important és que l'aplicació no s'ha de convertir en el nou propietari de la xarxa. Pot ser un client gran, potser fins i tot el client més popular, tot deixant espai per a aplicacions competidores, RPC competidors, algorismes de feeds competidors i nodes de perfil autoallotjats.
