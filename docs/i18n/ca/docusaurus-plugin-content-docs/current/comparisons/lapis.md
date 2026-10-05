---
title: Bitsocial i Lapis Net
description: Com es compara Lapis Net, un protocol social peer-to-peer escrit en Kotlin amb puntuacions de confiança per a cada lector i visibilitat avalada per Bitcoin, amb Bitsocial.
---

# Bitsocial i Lapis Net

[Lapis Net](https://net.lapisproject.dev/) és un protocol de xarxa social peer-to-peer escrit en
Kotlin per a la JVM. Ha arribat pel seu compte a uns fonaments propers als de Bitsocial: identitats
basades en parells de claus, emmagatzematge de contingut a l'estil d'IPFS i gossipsub de libp2p.
Tots dos es diferencien en on situen el filtratge de l'spam i la curació del contingut. Lapis dona a
cada lector un graf de confiança personal i permet que els pagaments en Bitcoin i Lightning
augmentin la visibilitat; Bitsocial deixa que cada comunitat decideixi què s'hi pot publicar.

Lapis és un prototip funcional. L'octubre de 2026 encara no tenia cap xarxa pública, i connectar dos
nodes era un pas manual, segons el seu [repositori](https://github.com/lapisproject-dev/Lapis-Net).

## Com funciona Lapis

- **Identitats.** Cada identitat és un parell de claus secp256k1, compatible amb les claus de
  Bitcoin, amb una clau Ed25519 vinculada per a l'identificador d'igual de libp2p.
- **Emmagatzematge i propagació.** El contingut s'emmagatzema amb Nabu, una implementació d'IPFS
  sobre libp2p (DHT i Bitswap), i es difon amb gossipsub de libp2p.
- **Puntuacions.** Quatre puntuacions opcionals se situen sobre un nucli que es manté neutral
  respecte a la curació:
  - Veritas, una xarxa de confiança calculada a partir del graf de confiança de cada lector
  - Virtus, visibilitat avalada per proves de pagament a la cadena o per Lightning que perden valor
    amb el temps
  - Karma, m'agrada gratuïts ponderats per Veritas
  - Madli, una puntuació de reputació que els nodes mantenen sobre el comportament dels altres
- **Missatgeria.** El projecte inclou missatges directes xifrats d'extrem a extrem, trucades de veu
  entre dues persones i un sistema de missatges asíncrons semblant al correu electrònic.
- **Clients.** Cada usuari executa un node JVM. El client de referència és una interfície web que
  serveix aquest node local.

## On es diferencien

### Qui filtra l'spam

Lapis filtra a l'extrem del lector. El contingut es propaga, i després el graf de confiança de cada
lector i les normes de pagament de l'aplicació que fa servir decideixen què surt a la superfície.
Bitsocial filtra a la comunitat: una publicació ha de superar el repte de la comunitat abans que el
node de la comunitat l'accepti, de manera que l'spam rebutjat mai no arriba a formar part de la
comunitat. Consulta [Reptes antispam personalitzats](/custom-challenges/).

### Qui té el poder

A Lapis, cada lector decideix de qui es fia, i l'operador de cada aplicació decideix com hi funciona
la visibilitat de pagament. A Bitsocial, el propietari d'una comunitat fixa les normes d'aquella
comunitat i prou, i les aplicacions trien què mostren. Cap dels dos té un administrador a nivell de
protocol.

### Economia

Lapis integra proves de pagament en Bitcoin i Lightning en la seva puntuació de visibilitat.
Bitsocial no té cap capa de pagament al protocol; una comunitat pot exigir un pagament o un token a
través del seu repte.

### Navegador

Les aplicacions de Bitsocial poden executar un node peer-to-peer dins d'una pestanya normal del
navegador. Consulta [Peer-to-peer al navegador](/browser-p2p/). La interfície de navegador de Lapis
és una pàgina local que serveix el node JVM de l'usuari.

### Abast

Lapis inclou missatges directes, trucades de veu i correu. Bitsocial se centra en les comunitats
públiques i encara no té missatges directes nadius.

## Comparació

| Pregunta                  | Lapis Net                                                                                                         | Bitsocial                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Categoria                 | Protocol social peer-to-peer (prototip)                                                                           | Xarxa de comunitats peer-to-peer                                                                    |
| Identitat                 | Parell de claus secp256k1 amb un identificador d'igual Ed25519 vinculat                                           | Parells de claus Ed25519 per a usuaris i comunitats                                                 |
| On viuen les publicacions | Emmagatzematge Nabu (IPFS sobre libp2p) als nodes participants                                                    | El node del propietari de la comunitat i els iguals que la llegeixen i en fan de seeders            |
| Comunitats                | Cap objecte de comunitat; la curació es fa per lector i per aplicació                                             | Objectes de primera classe el node dels quals accepta o rebutja publicacions                        |
| Control de l'spam         | Graf de confiança del lector, visibilitat de pagament, dipòsits Lightning per als primers missatges               | El repte de cada comunitat abans d'acceptar una publicació                                          |
| Moderació                 | El graf de confiança de cada lector; els operadors de les aplicacions fixen les normes de visibilitat de pagament | Els propietaris de cada comunitat la moderen; les aplicacions trien què mostren                     |
| Economia                  | Proves de pagament en Bitcoin i Lightning a les puntuacions                                                       | Cap al protocol; un repte pot exigir un pagament o un token                                         |
| Navegador                 | Interfície web local servida per un node JVM                                                                      | Node peer-to-peer dins d'una pestanya normal del navegador                                          |
| Xarxa                     | Prototip sense xarxa pública                                                                                      | Xarxa activa amb aplicacions com [5chan](/apps/5chan/) i [Seedit](/apps/seedit/)                    |
| Contrapartida principal   | Reputació i missatgeria integrades i riques, però encara sense xarxa pública                                      | Un nucli més petit que funciona en navegadors, però sense reputació integrada ni missatges directes |

## Podrien funcionar junts?

Els reptes de Bitsocial poden ser qualsevol codi, de manera que una puntuació de confiança a l'estil
de Lapis en podria ser un. El repte integrat `whitelist` ja pot llegir llistes d'adreces permeses a
partir d'URL. Un servei que publiqués les adreces de Bitsocial en què confia un graf de Veritas
podria permetre que aquests autors se saltessin un CAPTCHA en una comunitat. Caldria una manera de
vincular una identitat de Lapis amb una adreça de Bitsocial, i avui no existeix res semblant.
