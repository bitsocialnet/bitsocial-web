---
title: Descentralitzar Twitter/X
description: "Fase 3 del pla mestre: una alternativa a Twitter/X enfocada i descentralitzada per a la conversa pública centrada en el text, amb infraestructura substituïble."
---

# Descentralitzar Twitter/X

La fase 3 planteja construir una alternativa a Twitter/X enfocada i descentralitzada. El seu centre és la conversa pública centrada en el text: publicacions curtes, respostes, republicacions, seguiments, debat en temps real i comunitats, amb la capa de plataforma oberta.

Twitter/X continua definit per les publicacions, el text i l'intercanvi d'idees. El client de la fase 3 hauria de competir en aquesta experiència essencial i fer que funcioni excepcionalment bé.

Aquesta pàgina descriu la direcció del producte, no una especificació de llançament tancada. La interfície exacta, el feed predeterminat, el model publicitari, les funcions AI i el mercat RPC poden canviar a mesura que madurin el protocol i les primeres aplicacions.

## Què hauria de demostrar

El client hauria de demostrar que una xarxa social basada en perfils pot evitar convertir-se en una plataforma de custòdia:

- els usuaris poden ser propietaris de les seves identitats i perfils
- les comunitats i els nodes de perfil poden continuar sent peer-to-peer
- les comunitats poden traslladar els efectes de xarxa entre clients Bitsocial
- els proveïdors RPC poden fer que el client sigui còmode sense assumir-ne la custòdia
- els algorismes dels feeds poden ser serveis opcionals en lloc de normes imposades per la plataforma
- altres clients poden continuar competint per la mateixa xarxa

L'objectiu és construir el client més potent possible per a la conversa pública i demostrar fins on pot arribar el protocol.

## Familiar en el propòsit, substituïble per disseny

L'experiència predeterminada hauria de competir amb el nucli de Twitter/X: un feed d'inici ràpid, publicacions de text, seguiments, respostes, distribució en forma de republicació, comunitats, notificacions, cerca i una vista ordenada For You que funcioni immediatament.

Bitsocial Forge pot gestionar el primer servei RPC i de feed predeterminat. Aquesta opció predeterminada pot incloure un feed ordenat i anuncis perquè el client sembli complet des del primer dia, en lloc de demanar als usuaris generalistes que muntin tota la pila pel seu compte.

La diferència és que l'opció predeterminada no s'ha de convertir en una presó. Un usuari hauria de poder canviar d'RPC, feeds, instàncies, sistemes d'ordenació, anuncis i proveïdors de descoberta, o bé eliminar completament l'ordenació. El client pot prendre decisions clares al primer inici i mantenir substituïbles tots els serveis principals.

Això fa que el client sigui més personalitzable que una plataforma convencional. Un usuari podria mantenir el feed ordenat predeterminat amb anuncis. Un altre podria fer servir un feed cronològic sense ordenació. Un altre podria triar un RPC centrat en la privadesa, un servei de descoberta gestionat per la comunitat, un feed de pagament sense anuncis o un algorisme de nínxol creat per a una subcultura concreta.

## Comunitats entre clients

Les comunitats haurien de ser molt més importants que els grups aïllats dins d'una sola aplicació.

A X/Twitter, les comunitats estan confinades dins d'X. Poden ser útils, però hereten els límits d'una plataforma, un sistema de comptes, una pila de recomanacions i una superfície de producte.

Una comunitat Bitsocial es pot crear, allotjar, descobrir i utilitzar des de clients diferents. Això vol dir que el client de la fase 3 pot mostrar comunitats i publicacions de la xarxa Bitsocial més àmplia, no només d'usuaris que hi hagin començat. Una comunitat podria tenir alhora activitat d'un client d'imageboard, un client de debat a l'estil de Reddit, un client de fòrum de nínxol, una aplicació mòbil i el client de la fase 3.

Aquest és l'avantatge essencial de l'efecte de xarxa: un client pot resultar familiar als usuaris generalistes i continuar obtenint valor de molts clients, nodes de comunitat, proveïdors RPC i serveis independents.

## Algorismes de feed opcionals

El client de la fase 3 no hauria d'imposar a tothom un únic sistema global d'ordenació.

Els algorismes dels feeds haurien de ser opcionals. Un usuari podria triar un algorisme en un mercat, canviar de proveïdor, utilitzar l'algorisme d'una empresa, un de gestionat per un operador anònim, un de creat per una comunitat, executar-ne un de propi o no utilitzar-ne cap.

Els proveïdors RPC públics són un lloc natural perquè aquests serveis competeixin. Poden indexar, ordenar i recomanar contingut, però no haurien de ser propietaris de l'usuari ni del perfil.

Aquests serveis també poden competir en la forma del client mateix. Un RPC podria oferir un feed ordenat amb anuncis. Un altre podria oferir un feed cronològic sense ordenar. Un altre podria especialitzar-se en privadesa, traducció, moderació, descoberta de comunitats o un graf social de nínxol.

Si el model econòmic funciona, els serveis de feed basats en RPC podrien afegir funcions AI semblants a les que les plataformes generalistes intenten introduir als seus feeds: traduccions automàtiques, resums, respostes assistides per bots, respostes de cerca, ajuda a la moderació o context a l'estil de les notes de la comunitat.

Aquestes funcions haurien de ser opcions de servei, no requisits del protocol. Un RPC predeterminat pot competir oferint un feed més ric, però els usuaris i els clients competidors haurien de poder continuar triant alternatives més simples, privades, cronològiques, sense anuncis o específiques d'una comunitat.

## RPC sense custòdia

Cada usuari hauria de poder participar com un node peer-to-peer complet mitjançant RPC sense donar al proveïdor RPC la propietat de la seva identitat o del seu perfil.

La via allotjada és important perquè la majoria d'usuaris no començaran executant un servidor. La via de sortida és igual d'important: un usuari hauria de poder passar al seu propi node de perfil en maquinari modest, inclòs un Raspberry Pi, sempre que vulgui.

Aquesta és la diferència entre comoditat i custòdia.

## Conversa pública, reforçada per Bitsocial Chain

Bitsocial Chain pot incorporar noms duradors, pagaments, propines, premis i altres vies financeres directament a la conversa pública.

El client de la fase 3 es manté centrat en les publicacions, el text, l'intercanvi d'idees i el debat en temps real, alhora que comparteix comunitats i efectes de xarxa amb altres clients Bitsocial.
