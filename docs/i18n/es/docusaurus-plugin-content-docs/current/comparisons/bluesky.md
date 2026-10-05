---
title: Bitsocial y Bluesky
description: Cómo se comparan Bluesky y el AT Protocol, con servidores de datos personales, relés y AppViews, con las comunidades peer-to-peer de Bitsocial.
---

# Bitsocial y Bluesky

[Bluesky](https://bsky.app/) es una aplicación de microblogging construida sobre el
[AT Protocol](https://atproto.com/), que diseñó Bluesky Social PBC. El protocolo divide una red
social en servicios separados: los servidores de datos personales alojan las cuentas, los relés las
agregan en un único flujo y los AppViews indexan ese flujo para generar las cronologías y los hilos
que ve la gente. Su documentación describe los datos de las cuentas como almacenados en servidores
anfitriones, «a diferencia de un modelo peer-to-peer»
([descripción general](https://atproto.com/guides/overview)).

## Cómo funciona el AT Protocol

- **Repositorios en servidores.** Cada publicación, «me gusta» o seguimiento es un registro en el
  repositorio firmado del autor, alojado en un servidor de datos personales (PDS). Bluesky gestiona
  los servidores predeterminados, y cualquiera puede alojar el suyo.
- **Relés.** Los relés se suscriben a todos los PDS y retransmiten los cambios como un único flujo,
  el firehose. Desde una actualización del protocolo en 2025 ya no archivan todos los repositorios,
  lo que los ha hecho mucho más baratos de operar
  ([Sync v1.1](https://atproto.com/blog/relay-updates-sync-v1-1)).
- **AppViews.** Un AppView indexa todo el firehose y sirve cronologías, hilos de respuestas
  completos, recuentos y búsqueda. Es la parte de la red que más recursos consume.
- **Identidad.** Una cuenta es un DID: normalmente `did:plc`, registrado en un único directorio
  global, o `did:web`, ligado a un dominio. El documento DID indica el handle de la cuenta, su clave
  de firma y su servidor actual. El PDS guarda la clave de firma; `did:plc` también permite a los
  usuarios tener claves de rotación para poder mudarse sin ayuda del antiguo anfitrión
  ([guía de identidad](https://atproto.com/guides/identity)).
- **Handles.** Los handles son nombres DNS, como `alice.bsky.social` o un dominio propiedad del
  usuario, verificados con el DID.
- **Moderación.** El alojamiento y el alcance son capas separadas. Cualquiera puede operar un
  etiquetador (labeler) y los usuarios pueden combinar varios
  ([guía de moderación](https://atproto.com/guides/moderation)), pero la aplicación de Bluesky
  siempre aplica la moderación propia de Bluesky. Los autores pueden limitar quién responde a sus
  publicaciones y ocultar respuestas.

## En qué se diferencian

### Servidores o pares

Los datos de Bluesky viven en servidores: un PDS aloja cada cuenta, los relés transportan el
firehose y los AppViews sirven lo que muestran los clientes. Un navegador es un cliente HTTP de esos
servicios, nunca un par. En Bitsocial, el contenido lo sirven el nodo de la comunidad y los pares
que la leen, y una aplicación web puede ejecutar su propio nodo peer-to-peer. Consulta
[Peer-to-peer en el navegador](/browser-p2p/).

### Una vista global o comunidades

El AT Protocol está diseñado para una única vista global: un AppView ve todas las respuestas, así
que los hilos y la búsqueda están completos. Bitsocial no tiene un índice global; cada comunidad
publica su propio estado, y las aplicaciones construyen el descubrimiento encima. Consulta
[Descubrimiento de contenido](/content-discovery/).

Bluesky no tiene hoy un objeto de comunidad para publicaciones públicas. En junio de 2026
[anunció comunidades nativas](https://bsky.app/profile/alexbenzer.com/post/3mnxh6mmlxk2k) con
publicación sujeta a aprobación en algunos niveles de privacidad; en octubre de 2026 aún no se
habían lanzado. En Bitsocial, las comunidades son el objeto central, y el nodo de una comunidad
acepta o rechaza las publicaciones.

### Control del spam

Bluesky combate el spam con límites de frecuencia en sus servidores, límites a los nuevos
anfitriones en el relé, detección automática, revisión humana y etiquetas, y los autores pueden
restringir las respuestas. No hay ninguna barrera a nivel de comunidad que decida qué debe superar
una publicación antes de ser aceptada. En Bitsocial, cada comunidad elige su propio desafío.
Consulta [Desafíos antispam personalizados](/custom-challenges/).

### Quién guarda las claves

Las cuentas en los servidores propios de Bluesky inician sesión con una contraseña, y esos
servidores custodian sus claves de firma ([Kleppmann et al.](https://arxiv.org/abs/2402.03239)).
Según un ingeniero de protocolo de Bluesky,
[la mayoría de las cuentas no tienen claves de rotación controladas de forma independiente](https://whtwnd.com/bnewbold.net/3lbvbtqrg5t2t).
Una identidad de Bitsocial es un par de claves que genera y guarda la aplicación del usuario.

### Operar la infraestructura

Un servidor personal es barato: el [PDS de referencia](https://github.com/bluesky-social/pds)
recomienda 1 GB de RAM para hasta 20 usuarios. Un AppView independiente para toda la red es un
proyecto grande; uno construido en 2025
[costaba unos 200 dólares al mes](https://whtwnd.com/futur.blue/3ls7sbvpsqc2w), sobre todo por 16 TB
de almacenamiento. Bitsocial no tiene un índice global que replicar, y un nodo de comunidad funciona
en hardware de consumo.

## Comparación

| Pregunta                      | Bluesky (AT Protocol)                                                                           | Bitsocial                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Categoría                     | Servidores federados con un índice global                                                       | Red de comunidades peer-to-peer                                               |
| Identidad                     | DID, con las claves de firma normalmente en manos del servidor                                  | Pares de claves Ed25519 para usuarios y comunidades                           |
| Dónde viven las publicaciones | El repositorio del autor en un servidor de datos personales                                     | El nodo del propietario de la comunidad y los pares que la leen y la siembran |
| Quién lo mantiene disponible  | Anfitriones de PDS, relés y AppViews, gestionados por Bluesky de forma predeterminada           | El nodo del propietario de la comunidad más seeders auxiliares                |
| Comunidades                   | Ninguna para publicaciones públicas todavía (anunciadas en 2026)                                | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones             |
| Control del spam              | Límites de frecuencia en los servidores, detección automática, etiquetas, control de respuestas | El desafío de cada comunidad antes de aceptar una publicación                 |
| Moderación                    | Etiquetadores combinables; la aplicación de Bluesky siempre aplica la moderación de Bluesky     | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran   |
| Nombres                       | Handles DNS verificados con el DID                                                              | Nombres `.bso` y `.eth` que se resuelven en claves                            |
| Navegador                     | Cliente HTTP de un PDS y un AppView                                                             | Nodo peer-to-peer dentro de una pestaña normal del navegador                  |
| Contrapartida principal       | Hilos y búsqueda globales completos, pero la agregación exige servidores pesados                | Sin un índice global pesado, pero sin una vista completa de toda la red       |
