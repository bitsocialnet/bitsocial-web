---
title: Peer-to-peer en el navegador
description: Cómo una aplicación web de Bitsocial ejecuta un nodo libp2p real dentro de la pestaña del navegador, qué transportes utiliza y la corrección upstream de 2026 que hizo posible publicar desde una pestaña.
---

# Peer-to-peer en el navegador

Una aplicación web de Bitsocial no tiene por qué ser el cliente del servidor de otra persona. Puede
ejecutar un nodo [Helia](https://helia.io/) dentro de la pestaña del navegador, unirse a la misma red
peer-to-peer que los nodos de escritorio y de CLI, obtener contenido de las comunidades desde otros
pares y publicar mediante pubsub.

Esta página explica qué significa eso en la práctica, qué transportes utiliza, qué sigue sin poder
hacer y por qué publicar desde una pestaña no empezó a funcionar hasta 2026.

Para conocer el diseño de red en su conjunto, consulta [Protocolo peer-to-peer](/peer-to-peer-protocol/).

## Qué se ejecuta en la pestaña

Cuando el P2P en el navegador está activo, la página aloja un nodo libp2p real:

- abre conexiones con otros pares mediante WebSockets seguros
- obtiene y verifica el contenido de las comunidades desde esos pares, no desde una pasarela IPFS
- participa en gossipsub, así que publicar una entrada no necesita un proveedor de pubsub alojado
- usa la misma pila de cliente de protocolo (`pkc-js`) que el resto de aplicaciones de Bitsocial

La consecuencia práctica es que ningún operador de pasarela se interpone entre un lector web y una
comunidad. No hay un único extremo HTTPS al que se pueda presionar para que deje de servir una
comunidad a todos los usuarios de navegador a la vez.

## Cómo se conectan los nodos de navegador

`pkc-js` se conecta a los pares mediante **WebSockets seguros**. Las conexiones por WebRTC y
WebTransport se deniegan de forma predeterminada mediante un connection gater, porque en el navegador
añaden rutas de establecimiento de conexión largas y que fallan a menudo (negociación STUN/ICE,
rotación de certhash) que ralentizan la carga de la página, mientras que WebSocket ofrece un
transporte directo y fiable. Quien necesite específicamente WebRTC o WebTransport puede anular el
gater a través de
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

La consecuencia práctica es que un par de navegador se conecta a nodos que exponen un extremo WSS, lo
que significa que esos nodos necesitan un dominio y un certificado firmado por una CA. A los pares
que están detrás de conexiones domésticas sin certificado se llega de forma indirecta, en lugar de
conectarse a ellos desde la pestaña.

## Por qué publicar desde el navegador no empezó a funcionar hasta 2026

El peer-to-peer en el navegador no es una idea nueva. Lo que cambió en 2026 es que las _entradas_ de
un nodo de navegador llegan ya al resto de la red.

La especificación de pubsub de libp2p exige que el `seqno` de un mensaje sea un entero de 64 bits
big-endian que crezca de forma lineal. `js-libp2p-gossipsub` generaba en su lugar 8 bytes aleatorios,
mientras que go-libp2p-pubsub y rust-libp2p usaban ambos un contador. Kubo 0.40+ activa
`BasicSeqnoValidator` de forma predeterminada, lo que rechaza cualquier mensaje cuyo seqno no sea
mayor que el más alto ya visto de ese par.

El efecto era que los pares Kubo descartaban en silencio la mayoría de los mensajes publicados por un
nodo JavaScript, incluido un nodo de navegador. Una prueba de reproducción midió que solo llegaban
entre 2 y 8 de cada 30 mensajes.

Esto se diagnosticó en
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) y se corrigió
en **`@libp2p/gossipsub` 15.0.21** en mayo de 2026. Hasta que eso llegó, un nodo de navegador podía
conectarse y leer, pero sus entradas se perdían casi siempre de camino a los pares de Go. `pkc-js`
incluye `@libp2p/gossipsub` 16.0.4, posterior a esa corrección.

## Qué sigue sin poder hacer un nodo de navegador

Un nodo de navegador es un par real, no un servidor. Sus límites son distintos de los de un nodo de
escritorio o siempre activo:

- normalmente no puede aceptar conexiones entrantes arbitrarias desde la internet pública
- solo funciona mientras la pestaña está abierta, así que no sirve de alojamiento duradero para los datos de una comunidad
- no puede unirse a una DHT de libp2p, y por eso el descubrimiento pasa por routers HTTP
- encaja mal para sembrar contenido a gran escala

El alojamiento completo de una comunidad se resuelve mejor con una aplicación de escritorio, con
`bitsocial-cli` o con otro nodo siempre activo. El P2P en el navegador cambia quién puede _leer y
publicar_ sin una pasarela; no elimina la necesidad de pares que permanezcan en línea.

## Los routers HTTP no son pasarelas

Los clientes de navegador siguen consultando [routers HTTP](/peer-to-peer-protocol/#public-key-based-addressing)
para averiguar qué pares proporcionan en ese momento la dirección de una comunidad. Este es el
asterisco honesto del "peer-to-peer puro en el navegador", y merece la pena ser preciso al respecto:

- un router almacena únicamente direcciones de pares para una dirección de contenido
- no almacena, ni sirve, ni siquiera conoce el contenido de la comunidad
- los clientes consultan varios routers en paralelo y combinan los resultados
- cualquiera puede ejecutar uno, y cambiar de router es un cambio de configuración sin migración de datos

Tras el descubrimiento, la transferencia de contenido y el tráfico de pubsub circulan peer-to-peer.
Un router que desaparece te cuesta una vía de búsqueda, no tus datos. Una pasarela IPFS, en cambio,
está dentro de la ruta del contenido.

## Dónde se ejecuta hoy

- [5chan](/apps/5chan/) funciona con P2P puro en el navegador de forma predeterminada en la
  aplicación web de [5chan.app](https://5chan.app).

## Respaldo mediante pasarela

El acceso a través de pasarela sigue existiendo como vía de compatibilidad para navegadores o redes
que no pueden unirse directamente. Consulta [Respaldo mediante pasarela](/peer-to-peer-protocol/#gateway-fallback).
La arquitectura objetivo es P2P de navegador primero, con las pasarelas como respaldo opcional en
lugar de como cuello de botella predeterminado.
