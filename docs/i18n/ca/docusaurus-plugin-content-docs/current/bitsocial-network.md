---
title: Bitsocial Chain
description: Fase 3 del pla director, que cobreix la capa econòmica proposada en forma d'appchain L2 d'Ethereum per a les aplicacions Bitsocial.
---

# Bitsocial Chain

Bitsocial Chain és la capa econòmica proposada per a les aplicacions Bitsocial, en forma d'appchain
L2 d'Ethereum. El lloc web dedicat actualment a la cadena és
[chain.bitsocial.net](https://chain.bitsocial.net).

La capa social peer-to-peer permet que les comunitats, les identitats i el contingut visquin fora de
la base de dades d'una plataforma central. Bitsocial Chain hi ha d'afegir les primitives compartides
de noms, monetització i pagaments que fan que aquestes aplicacions siguin més difícils d'ofegar
econòmicament.

## Què ha de fer possible

- dominis Bitsocial descentralitzats com ara `.bso`
- premis i propines
- vies de monetització duradores
- liquiditat compartida entre aplicacions
- estructures financeres més difícils d'escanyar per part de bancs o plataformes
- efectes de xarxa que no depenen que una sola empresa sigui propietària de tota la pila

L'objectiu no és començar per la mecànica dels tokens. L'objectiu és fer que les aplicacions socials
útils siguin més duradores, més fàcils de finançar i menys dependents de proveïdors centralitzats de
pagaments o de noms.

## Prova de concepte actual

La primera prova de concepte de Bitsocial Chain se centra en els noms natius `.bso`. Demostra que un
registre de noms es pot derivar de l'historial de l'L1 d'Ethereum sense posar contingut social a la
cadena:

- els usuaris envien intencions de registre, actualització, transferència i revocació mitjançant
  transaccions normals de l'L1 d'Ethereum
- qualsevol pot executar el node de derivació i reconstruir el mateix estat del registre `.bso`
- un resolutor associa un nom `.bso` a la clau pública de Bitsocial que els clients ja fan servir
  sobre el protocol peer-to-peer
- les publicacions, els vots, la moderació, els feeds i el contingut de les comunitats es mantenen
  fora de la cadena i peer-to-peer

Aquesta prova de concepte no és un llançament Stage 2 en producció. Encara no té sistema de proves,
joc de desafiaments, codi auditat, desplegament en actiu, preus definitius ni governança definitiva.
La seva posició a llarg termini és transparent per defecte i compatible amb la privadesa per
disseny: la cadena base és pública, mentre que les propines, els pagaments, els premis i la
liquiditat del futur han d'evitar forçar vincles permanents entre la identitat social i l'historial
de la cartera.

## Per què importa

Descentralitzar les comunitats i les identitats és necessari, però no n'hi ha prou per descentralitzar
totes les xarxes socials.

Si les aplicacions socials continuen depenent d'unes poques vies econòmiques centralitzades, segueixen
sent fàcils de pressionar, d'expulsar de les plataformes o d'ofegar econòmicament. Bitsocial Chain és
la resposta proposada a aquesta segona capa de dependència.

## Relació amb les aplicacions

Bitsocial Chain s'ha de situar sota les aplicacions Bitsocial, no substituir-les.

El resultat de cara al públic hauria de ser:

- les comunitats es mantenen peer-to-peer
- les aplicacions es mantenen diferenciades
- els usuaris obtenen funcions pràctiques de noms i de monetització
- els creadors i les comunitats poden rebre suport des de qualsevol client
- el valor es pot moure per l'ecosistema sense recrear el propietari d'una plataforma centralitzada

## Per què arriba després de l'alternativa a Twitter/X

El pla director actual situa Bitsocial Chain després de l'alternativa a Twitter/X, perquè aquesta aplicació no necessita la cadena. Els perfils funcionen com a nodes de perfil a través d'RPC no custodial, i els noms `.bso` poden començar en un registre provisional a la xarxa principal d'Ethereum ([BSIP-13](https://bsips.bitsocial.net/bsip-13)) i passar a la cadena més endavant.

Bitsocial Chain no hauria de sacrificar la descentralització per llançar-se abans. No hauria d'afegir cap supòsit de confiança més enllà del mateix Ethereum: cap clau d'actualització, cap consell de seguretat i cap operador que la pugui censurar o aturar. El disseny principal per aconseguir-ho, un rollup natiu, depèn d'una actualització d'Ethereum que encara no té data. Fins que la cadena pugui complir aquest llistó, l'alternativa a Twitter/X fa créixer la base d'usuaris a la qual servirà.

## Principis de disseny

Com que Bitsocial Chain continua sent infraestructura proposada i no un producte ja llançat, el pla
s'ha de mantenir disciplinat:

- Primer les aplicacions i les comunitats. La capa de xarxa ha de reforçar productes socials reals.
- Primer les funcions pràctiques. Els noms, els premis, les propines i els pagaments són més fàcils
  d'explicar que una arquitectura financera abstracta.
- La contribució real per damunt del soroll. Les primitives econòmiques han de premiar la
  participació, la construcció i el suport a la comunitat.
- La curació és legítima. Les aplicacions poden modelar rànquings, valors per defecte i descoberta
  per afavorir comunitats duradores.
- Els mecanismes exactes continuen oberts. Aquesta pàgina explica el paper de Bitsocial Chain, no una
  promesa tancada sobre l'economia definitiva.
