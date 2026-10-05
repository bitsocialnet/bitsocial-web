---
title: Bitsocial y Reticulum
description: Cómo se compara Reticulum, la pila de red criptográfica para LoRa y otros enlaces de bajo ancho de banda, con Bitsocial, y si Bitsocial podría funcionar sobre ella.
---

# Bitsocial y Reticulum

[Reticulum](https://reticulum.network/) es una pila de red basada en criptografía para construir
redes sobre cualquier medio disponible: radios LoRa, radio por paquetes, enlaces serie, Wi-Fi,
Ethernet, TCP, UDP o I2P. Suele mencionarse junto a Bitsocial porque ambos eliminan a la empresa que
hace de intermediaria. Lo hacen en capas distintas, así que se complementan en lugar de competir.

## Capas distintas

Reticulum sustituye la capa de red. Ofrece a las aplicaciones extremos cifrados y enrutables sin
direcciones IP, DNS, autoridades de certificación ni cuentas, y está diseñado para seguir
funcionando en enlaces tan lentos como 5 bits por segundo con una MTU de 500 bytes. No define
publicaciones, comunidades ni moderación; eso lo añaden las aplicaciones construidas encima.

Bitsocial es un protocolo social. Funciona sobre la pila IPFS/libp2p a través de conexiones a
internet normales, incluso desde una pestaña del navegador, y define comunidades, publicaciones y
desafíos antispam propios de cada comunidad. Consulta
[Protocolo peer-to-peer](/peer-to-peer-protocol/) y
[Peer-to-peer en el navegador](/browser-p2p/).

En la pila de Bitsocial, Reticulum ocuparía aproximadamente el lugar de libp2p, no el del protocolo
Bitsocial.

## Cómo funciona Reticulum

- **Identidades.** Una identidad de Reticulum es un conjunto de claves de 512 bits: una clave X25519
  para cifrar y una clave Ed25519 para firmar.
- **Destinos.** Las aplicaciones crean destinos, direccionados por un hash SHA-256 truncado a 16
  bytes. Los paquetes no llevan dirección de origen.
- **Anuncios.** Un destino se vuelve alcanzable enviando un anuncio. Los nodos de transporte lo
  reenvían y recuerdan el siguiente salto de vuelta, de modo que ningún nodo necesita un mapa de toda
  la red.
- **Cifrado.** El tráfico va cifrado por defecto, con claves efímeras y secreto hacia adelante.
- **LXMF.** La capa de mensajería [LXMF](https://github.com/markqvist/LXMF) añade mensajes firmados,
  entrega directa y almacenamiento y reenvío mediante nodos de propagación para destinatarios que
  están desconectados.

Entre las aplicaciones construidas así están [Sideband](https://github.com/markqvist/Sideband), para
mensajería, y [Nomad Network](https://github.com/markqvist/NomadNet), para mensajería y páginas
alojadas. El manual de Reticulum mantiene una
[lista de programas](https://reticulum.network/manual/software.html).

## Comparación

| Pregunta             | Reticulum                                                                                                                   | Bitsocial                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Qué es               | Pila de red                                                                                                                 | Protocolo social peer-to-peer y aplicaciones                                                                   |
| Pensado para         | Cualquier medio, hasta enlaces de radio lentos                                                                              | Conexiones a internet, incluidas pestañas del navegador                                                        |
| Identidad            | Conjunto de claves X25519 y Ed25519                                                                                         | Pares de claves Ed25519 para usuarios y comunidades                                                            |
| Direcciones          | Hash de una identidad y un nombre de aplicación                                                                             | Hash de la clave pública de una comunidad                                                                      |
| Encontrar un par     | Anuncios difundidos por nodos de transporte                                                                                 | Los enrutadores HTTP devuelven pares proveedores                                                               |
| Funciones sociales   | Las añaden aplicaciones como Nomad Network                                                                                  | Comunidades, publicaciones, respuestas y moderación en el protocolo                                            |
| Control del spam     | Límites de frecuencia de anuncios por interfaz; sellos de prueba de trabajo de LXMF que un destinatario o nodo puede exigir | El desafío de cada comunidad antes de aceptar una publicación                                                  |
| Entrega sin conexión | Los nodos de propagación de LXMF almacenan y reenvían mensajes                                                              | Los pares siguen sirviendo el estado más reciente de una comunidad; para publicar, su nodo debe estar en línea |

## ¿Podría Bitsocial funcionar sobre Reticulum?

Hoy no. Bitsocial no tiene un transporte para Reticulum, y su modelo de datos presupone el ancho de
banda de internet: un cliente obtiene de los pares los metadatos de la comunidad y el contenido de
las publicaciones e intercambia mensajes de pubsub, algo que encaja mal en enlaces pensados para
paquetes de 500 bytes y con un rendimiento que se mide en bits o kilobits por segundo.

El camino realista es más limitado: un cliente que funcione sobre una malla local mientras está
desconectado y que luego se sincronice con el resto de la red Bitsocial cuando haya a su alcance un
par o una pasarela con acceso a internet. Eso sería un cliente y un puente nuevos, no un cambio en
el protocolo, y no está en la hoja de ruta actual.

## Para desarrolladores

Reticulum se publica bajo la
[Licencia de Reticulum](https://reticulum.network/manual/license.html): condiciones de estilo MIT
más dos restricciones. El software no puede usarse en sistemas diseñados para dañar a personas ni
para crear conjuntos de datos de entrenamiento de IA o aprendizaje automático. Léela antes de
incluir código de Reticulum en una aplicación de Bitsocial.

La implementación de referencia está [escrita en Python](https://github.com/markqvist/Reticulum).
Los mantenedores de Reticulum advierten que varios ports no oficiales de Reticulum y LXMF están
generados por máquina y contienen afirmaciones de licencia que consideran nulas, así que es
preferible usar la implementación de referencia o los programas que figuran en el manual.
