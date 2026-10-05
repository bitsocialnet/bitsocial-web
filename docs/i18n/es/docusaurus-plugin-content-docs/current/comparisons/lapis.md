---
title: Bitsocial y Lapis Net
description: Cómo se compara con Bitsocial Lapis Net, un protocolo social peer-to-peer escrito en Kotlin con puntuaciones de confianza por lector y visibilidad respaldada por Bitcoin.
---

# Bitsocial y Lapis Net

[Lapis Net](https://net.lapisproject.dev/) es un protocolo de red social peer-to-peer escrito en
Kotlin para la JVM. Llegó de forma independiente a unos cimientos parecidos a los de Bitsocial:
identidades basadas en pares de claves, almacenamiento de contenido al estilo de IPFS y gossipsub de
libp2p. Ambos se diferencian en dónde sitúan el filtrado del spam y la curación. Lapis da a cada
lector un grafo de confianza personal y permite que los pagos en Bitcoin y Lightning aumenten la
visibilidad; Bitsocial deja que cada comunidad decida qué se puede publicar.

Lapis es un prototipo funcional. En octubre de 2026 todavía no tenía una red pública, y conectar dos
nodos era un paso manual, según su [repositorio](https://github.com/lapisproject-dev/Lapis-Net).

## Cómo funciona Lapis

- **Identidades.** Cada identidad es un par de claves secp256k1, compatible con las claves de
  Bitcoin, al que se vincula una clave Ed25519 para el peer ID de libp2p.
- **Almacenamiento y propagación.** El contenido se almacena con Nabu, una implementación de IPFS
  sobre libp2p (DHT y Bitswap), y se difunde con gossipsub de libp2p.
- **Puntuación.** Cuatro puntuaciones opcionales se apoyan en un núcleo que se mantiene neutral
  respecto a la curación:
  - Veritas, una red de confianza (web of trust) calculada a partir del propio grafo de confianza de
    cada lector
  - Virtus, visibilidad respaldada por pruebas de pago on-chain o de Lightning que pierden valor con
    el tiempo
  - Karma, «me gusta» gratuitos ponderados por Veritas
  - Madli, una puntuación de reputación que los nodos llevan sobre el comportamiento de los demás
- **Mensajería.** Los mensajes directos cifrados de extremo a extremo, las llamadas de voz entre dos
  personas y un sistema de mensajería asíncrona similar al correo electrónico forman parte del
  proyecto.
- **Clientes.** Cada usuario ejecuta un nodo JVM. El cliente de referencia es una interfaz web que
  sirve ese nodo local.

## En qué se diferencian

### Quién filtra el spam

Lapis filtra en el lector. El contenido se propaga y después el grafo de confianza de cada lector y
las reglas de pago de la aplicación que usa deciden qué aflora. Bitsocial filtra en la comunidad:
una publicación tiene que superar el desafío de la comunidad antes de que el nodo de la comunidad la
acepte, así que el spam rechazado nunca llega a formar parte de la comunidad. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Quién tiene el poder

En Lapis, cada lector decide en quién confía, y el operador de cada aplicación decide cómo funciona
allí la visibilidad de pago. En Bitsocial, el propietario de una comunidad fija las reglas de esa
comunidad concreta, y las aplicaciones eligen qué muestran. Ninguno de los dos tiene un
administrador a nivel de protocolo.

### Economía

Lapis integra pruebas de pago de Bitcoin y Lightning en su puntuación de visibilidad. Bitsocial no
tiene una capa de pagos en el protocolo; una comunidad puede exigir un pago o un token mediante su
desafío.

### Navegador

Las aplicaciones de Bitsocial pueden ejecutar un nodo peer-to-peer dentro de una pestaña normal del
navegador. Consulta [Peer-to-peer en el navegador](/browser-p2p/). La interfaz de navegador de Lapis
es una página local que sirve el nodo JVM del usuario.

### Alcance

Lapis incluye mensajes directos, llamadas de voz y correo. Bitsocial se centra en las comunidades
públicas y todavía no tiene mensajes directos nativos.

## Comparación

| Pregunta                      | Lapis Net                                                                                                        | Bitsocial                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Categoría                     | Protocolo social peer-to-peer (prototipo)                                                                        | Red de comunidades peer-to-peer                                                                        |
| Identidad                     | Par de claves secp256k1 con un peer ID Ed25519 vinculado                                                         | Pares de claves Ed25519 para usuarios y comunidades                                                    |
| Dónde viven las publicaciones | Almacenamiento Nabu (IPFS sobre libp2p) en los nodos participantes                                               | El nodo del propietario de la comunidad y los pares que la leen y la siembran                          |
| Comunidades                   | Sin objeto de comunidad; la curación se hace por lector y por aplicación                                         | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                      |
| Control del spam              | Grafo de confianza del lector, visibilidad de pago, depósitos de Lightning para los primeros mensajes            | El desafío de cada comunidad antes de aceptar una publicación                                          |
| Moderación                    | El grafo de confianza de cada lector; los operadores de las aplicaciones fijan las reglas de visibilidad de pago | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                            |
| Economía                      | Pruebas de pago de Bitcoin y Lightning en la puntuación                                                          | Nada en el protocolo; un desafío puede exigir un pago o un token                                       |
| Navegador                     | Interfaz web local servida por un nodo JVM                                                                       | Nodo peer-to-peer dentro de una pestaña normal del navegador                                           |
| Red                           | Prototipo sin red pública                                                                                        | Red en funcionamiento con aplicaciones como [5chan](/apps/5chan/) y [Seedit](/apps/seedit/)            |
| Contrapartida principal       | Reputación y mensajería integradas y completas, pero todavía sin red pública                                     | Un núcleo más pequeño que funciona en navegadores, pero sin reputación ni mensajes directos integrados |

## ¿Podrían funcionar juntos?

Los desafíos de Bitsocial son código arbitrario, así que una puntuación de confianza al estilo de
Lapis podría convertirse en uno. El desafío integrado `whitelist` ya puede leer listas de
direcciones permitidas desde URL. Un servicio que publicara las direcciones de Bitsocial en las que
confía un grafo de Veritas podría permitir que esos autores se saltaran un CAPTCHA en una comunidad.
Para ello haría falta una forma de vincular una identidad de Lapis con una dirección de Bitsocial, y
hoy no existe nada parecido.
