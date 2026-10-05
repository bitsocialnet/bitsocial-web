---
title: Bitsocial i Reticulum
description: Com es compara Reticulum, la pila de xarxa criptogràfica per a LoRa i altres enllaços de poca amplada de banda, amb Bitsocial, i si Bitsocial hi podria funcionar al damunt.
---

# Bitsocial i Reticulum

[Reticulum](https://reticulum.network/) és una pila de xarxa basada en criptografia per construir
xarxes sobre qualsevol suport que hi hagi disponible: ràdios LoRa, ràdio per paquets, enllaços
sèrie, Wi-Fi, Ethernet, TCP, UDP o I2P. Sovint surt al costat de Bitsocial perquè tots dos eliminen
l'empresa que fa d'intermediària. Ho fan en capes diferents, de manera que són complementaris i no
competidors.

## Capes diferents

Reticulum substitueix la capa de xarxa. Proporciona a les aplicacions punts finals xifrats i
encaminables sense adreces IP, DNS, autoritats de certificació ni comptes, i està dissenyat per
continuar funcionant en enllaços tan lents com 5 bits per segon amb una MTU de 500 bytes. No defineix
publicacions, comunitats ni moderació; això ho afegeixen les aplicacions que s'hi construeixen al
damunt.

Bitsocial és un protocol social. Funciona sobre la pila IPFS/libp2p a través de connexions a
internet normals, fins i tot des d'una pestanya del navegador, i defineix comunitats, publicacions i
reptes antispam propis de cada comunitat. Consulta
[Protocol peer-to-peer](/peer-to-peer-protocol/) i [Peer-to-peer al navegador](/browser-p2p/).

A la pila de Bitsocial, Reticulum ocuparia aproximadament el lloc de libp2p, no el del protocol
Bitsocial.

## Com funciona Reticulum

- **Identitats.** Una identitat de Reticulum és un joc de claus de 512 bits: una clau X25519 per
  xifrar i una clau Ed25519 per signar.
- **Destinacions.** Les aplicacions creen destinacions, adreçades per un hash SHA-256 truncat a 16
  bytes. Els paquets no porten adreça d'origen.
- **Anuncis.** Una destinació esdevé accessible quan envia un anunci. Els nodes de transport el
  reenvien i recorden el salt següent de tornada, de manera que cap node no necessita un mapa de tota
  la xarxa.
- **Xifratge.** El trànsit va xifrat per defecte, amb claus efímeres i secret cap endavant.
- **LXMF.** La capa de missatgeria [LXMF](https://github.com/markqvist/LXMF) hi afegeix missatges
  signats, lliurament directe i emmagatzematge i reenviament mitjançant nodes de propagació per als
  destinataris que no estan connectats.

Entre les aplicacions construïdes d'aquesta manera hi ha
[Sideband](https://github.com/markqvist/Sideband), per a missatgeria, i
[Nomad Network](https://github.com/markqvist/NomadNet), per a missatgeria i pàgines allotjades. El
manual de Reticulum manté una [llista de programes](https://reticulum.network/manual/software.html).

## Comparació

| Pregunta                  | Reticulum                                                                                                                  | Bitsocial                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Què és                    | Pila de xarxa                                                                                                              | Protocol social peer-to-peer i aplicacions                                                                     |
| Pensat per a              | Qualsevol suport, fins i tot enllaços de ràdio lents                                                                       | Connexions a internet, incloses les pestanyes del navegador                                                    |
| Identitat                 | Joc de claus X25519 i Ed25519                                                                                              | Parells de claus Ed25519 per a usuaris i comunitats                                                            |
| Adreces                   | Hash d'una identitat i un nom d'aplicació                                                                                  | Hash de la clau pública d'una comunitat                                                                        |
| Trobar un igual           | Anuncis difosos pels nodes de transport                                                                                    | Els encaminadors HTTP retornen iguals proveïdors                                                               |
| Funcions socials          | Les afegeixen aplicacions com Nomad Network                                                                                | Comunitats, publicacions, respostes i moderació dins del protocol                                              |
| Control de l'spam         | Límits de freqüència d'anuncis per interfície; segells de prova de treball de LXMF que un destinatari o un node pot exigir | El repte de cada comunitat abans d'acceptar una publicació                                                     |
| Lliurament sense connexió | Els nodes de propagació de LXMF emmagatzemen i reenvien els missatges                                                      | Els iguals continuen servint l'estat més recent d'una comunitat; per publicar, el seu node ha d'estar en línia |

## Bitsocial podria funcionar sobre Reticulum?

Avui no. Bitsocial no té cap transport per a Reticulum, i el seu model de dades pressuposa l'amplada
de banda d'internet: un client obté dels iguals les metadades de la comunitat i el contingut de les
publicacions i intercanvia missatges de pubsub, cosa que encaixa malament en enllaços pensats per a
paquets de 500 bytes i amb un rendiment que es mesura en bits o kilobits per segon.

El camí realista és més estret: un client que funcioni sobre una xarxa en malla local mentre està
desconnectat i que després se sincronitzi amb la resta de la xarxa Bitsocial quan tingui a l'abast
un igual o una passarel·la amb accés a internet. Això seria un client i un pont nous, no un canvi al
protocol, i no és al full de ruta actual.

## Per a desenvolupadors

Reticulum es publica sota la
[Llicència de Reticulum](https://reticulum.network/manual/license.html): condicions d'estil MIT més
dues restriccions. El programari no es pot fer servir en sistemes dissenyats per fer mal a les
persones ni per crear conjunts de dades d'entrenament d'IA o d'aprenentatge automàtic. Llegeix-la
abans d'incloure codi de Reticulum en una aplicació de Bitsocial.

La implementació de referència està [escrita en Python](https://github.com/markqvist/Reticulum). Els
mantenidors de Reticulum adverteixen que diversos ports no oficials de Reticulum i LXMF han estat
generats per màquina i contenen declaracions de llicència que consideren nul·les, de manera que és
preferible fer servir la implementació de referència o els programes que figuren al manual.
