---
title: Bitsocial y Secure Scuttlebutt
description: Cómo se comparan con Bitsocial Secure Scuttlebutt (SSB) y su aplicación Manyverse, desde los feeds de solo adición y la replicación según el grafo de seguimiento hasta las comunidades, el control del spam y la sincronización sin conexión.
---

# Bitsocial y Secure Scuttlebutt

[Secure Scuttlebutt](https://scuttlebutt.nz/) (SSB) es un protocolo social peer-to-peer creado por
Dominic Tarr en 2014. [Manyverse](https://www.manyver.se/) es su aplicación más conocida, para
Android, iOS y escritorio; [Patchwork](https://github.com/ssbc/patchwork) fue el principal cliente
de escritorio hasta que se archivó. De los sistemas comparados en esta documentación, SSB es el más
cercano a Bitsocial en espíritu: sin servidores en la ruta de los datos, sin blockchain, sin orden
global y con claves Ed25519 como identidad. Ambos tomaron decisiones opuestas sobre qué almacena
cada par y dónde se detiene el spam.

## Cómo funciona Scuttlebutt

- **Feeds.** Cada identidad es un par de claves Ed25519, escrito como `@<public key>.ed25519`. Todo
  lo que publica un usuario va a su propio feed, un registro de solo adición en el que cada mensaje
  firmado lleva un número de secuencia y el hash del mensaje anterior. Una vez publicado, un mensaje
  no se puede modificar, según la
  [guía del protocolo](https://ssbc.github.io/scuttlebutt-protocol-guide/).
- **Replicación.** Los pares copian feeds completos, no publicaciones sueltas, y el grafo de
  seguimiento decide qué feeds conserva un par. Patchwork, por ejemplo, mostraba los feeds situados
  a hasta dos saltos de distancia y replicaba los situados a hasta tres. Con los árboles de difusión
  epidémica (EBT), los pares comparan el número de secuencia más reciente que tienen de cada feed y
  envían solo lo que falta.
- **Conexiones.** Los pares se autentican mediante secret handshake y cifran el tráfico con box
  stream. El handshake está vinculado a un identificador de red, de modo que los pares de una red
  SSB separada con un identificador distinto no pueden conectarse a la red principal.
- **Encontrar pares.** Los pares se anuncian en la red local mediante difusión UDP y se sincronizan
  por LAN; Manyverse también se sincroniza por Bluetooth. A través de internet, los usuarios
  recurren a los **pubs**, pares siempre en línea que te siguen de vuelta después de que canjeas un
  código de invitación y que luego almacenan y sirven tu feed, y a los **rooms**, que no almacenan
  feeds pero tunelizan las conexiones entre sus miembros.
- **Blobs y mensajes privados.** Las imágenes y otros archivos son blobs direccionados por contenido
  que se obtienen de los pares, con un límite de tamaño predeterminado de 5 MB en las
  implementaciones actuales. Los mensajes privados se cifran para hasta siete destinatarios y se
  publican como texto cifrado en el feed del autor.

## En qué se diferencian

### Qué almacena un par

Un par de SSB guarda una copia completa de cada feed dentro de su alcance de replicación, desde el
primer mensaje de cada feed, y sirve esos feeds a otros. Eso es lo que permite a SSB funcionar sin
conexión, pero el almacenamiento crece con cada mensaje dentro del alcance, y una instalación nueva
tiene que descargar esos feeds antes de mostrar gran cosa. Un cliente de Bitsocial obtiene el estado
más reciente de las comunidades que abre del nodo de la comunidad y de los pares que la siembran, y
la red conserva solo ese estado más reciente. Consulta
[Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Borrado y dispositivos

Como un feed es una cadena de hashes, SSB no tiene borrado a nivel de toda la red: un par puede
eliminar mensajes de su propia base de datos, pero no retirarlos de las copias de otros pares.
Publicar con la misma clave desde dos dispositivos, o desde una copia de seguridad restaurada,
bifurca el feed, así que la solución habitual es una identidad por dispositivo. PZP, el protocolo
sucesor del equipo de Manyverse, incluye el borrado, varios dispositivos por cuenta y feeds
tolerantes a bifurcaciones entre sus principales cambios respecto a SSB
([anuncio del lanzamiento](https://www.manyver.se/blog/2024-07-03/)). Un nodo de comunidad de
Bitsocial publica una nueva versión del estado de la comunidad en cada actualización, así que el
contenido que retiran sus moderadores desaparece del estado más reciente.

### A quién puedes oír

El alcance de replicación de SSB funciona también como filtro de spam. El feed de un desconocido
solo te llega si alguien dentro de tus saltos lo sigue, y bloquear un feed hace que tu nodo deje de
replicarlo. El spam queda fuera, pero también los recién llegados, hasta que alguien los sigue.
Bitsocial permite que cualquiera publique en una comunidad, y el nodo de la comunidad decide
mediante su desafío si se acepta una publicación. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Comunidades

SSB no tiene un objeto de comunidad. Los canales y los hashtags son etiquetas en publicaciones
individuales, las respuestas de un hilo viven en los feeds de quienes las escribieron, y cuánto ves
de un hilo depende de cuáles de esos feeds tenga tu nodo. Los rooms pueden tener moderadores y
listas de miembros, pero estos controlan quién puede conectarse a través del room, no lo que se
publica. Una comunidad de Bitsocial es un objeto de primera clase con su propio par de claves, sus
reglas, sus moderadores y su desafío.

### Infraestructura

Ambos mantienen los servidores fuera de la ruta de los datos, y ambos se apoyan en auxiliares. Los
pubs son lo más parecido que tiene SSB a un servicio alojado: almacenan y sirven los feeds de todos
aquellos a quienes siguen. Los rooms se parecen más a los enrutadores HTTP de Bitsocial porque
ninguno de los dos almacena contenido, pero un room retransmite la conexión entre sus miembros,
mientras que un enrutador solo devuelve direcciones de proveedores y no interviene en la
transferencia. Igual que un par de SSB, un nodo de comunidad de Bitsocial funciona en hardware de
consumo, y tiene que estar en línea para aceptar publicaciones nuevas.

### Sin conexión y redes locales

Aquí SSB es más fuerte. Dos pares de SSB en la misma red Wi-Fi, o por Bluetooth en Manyverse, pueden
sincronizarse sin conexión a internet, y todo lo ya replicado sigue siendo legible sin conexión. El
objetivo principal declarado de Manyverse es hacer que las redes sociales sean independientes de la
conectividad a internet. Bitsocial necesita una conexión a internet para encontrar pares y para
publicar.

### Navegador

Las principales aplicaciones de SSB incluyen un nodo SSB completo: Manyverse integra uno en sus
aplicaciones móviles y de escritorio. [ssb-browser-demo](https://github.com/arj03/ssb-browser-demo)
ejecutaba SSB dentro de un navegador con replicación parcial y conexiones a través de rooms, y se
archivó en 2022. Las aplicaciones de Bitsocial ejecutan un nodo peer-to-peer en una pestaña normal
del navegador. Consulta [Peer-to-peer en el navegador](/browser-p2p/).

### Mensajes privados

SSB incorpora mensajes privados cifrados. Bitsocial se centra en las comunidades públicas y todavía
no tiene mensajes directos nativos.

## Estado del proyecto

André Staltz, que creó Manyverse, se apartó de SSB, de Manyverse y de su sucesor previsto en abril
de 2024 ([su última actualización](https://www.manyver.se/blog/2024-04-05/)). En julio de 2024,
Jacob Karlsson lanzó ese sucesor como [PZP](https://pzp.wiki/) y escribió que no seguiría trabajando
en Manyverse y que no sabía de nadie más que tuviera previsto hacerlo. En octubre de 2026, los
repositorios de PZP en [Codeberg](https://codeberg.org/pzp) no tenían actualizaciones posteriores a
diciembre de 2024. El repositorio de Patchwork está archivado con v3.18.1 como última versión, y el
equipo detrás de Planetary, una aplicación de SSB para iOS, se pasó a Nostr con su aplicación Nos
en 2023. La red SSB sigue funcionando gracias a los pares y pubs que la gente mantiene en línea,
pero sus principales aplicaciones ya no se desarrollan.

## Comparación

| Pregunta                      | Secure Scuttlebutt                                                                                                            | Bitsocial                                                                                                           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Categoría                     | Protocolo de gossip peer-to-peer                                                                                              | Red de comunidades peer-to-peer                                                                                     |
| Identidad                     | Un par de claves Ed25519 por dispositivo                                                                                      | Pares de claves Ed25519 para usuarios y comunidades                                                                 |
| Dónde viven las publicaciones | El feed de solo adición del autor, copiado por cada par que lo replica                                                        | El nodo del propietario de la comunidad y los pares que la leen y la siembran                                       |
| Qué guarda un par             | El historial completo de cada feed dentro de su alcance de seguimiento                                                        | El estado más reciente de las comunidades que lee o siembra                                                         |
| Comunidades                   | Sin objeto de comunidad; los canales y hashtags etiquetan publicaciones                                                       | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                                                   |
| Control del spam              | Alcance de replicación según el grafo de seguimiento, y bloqueos                                                              | El desafío de cada comunidad antes de aceptar una publicación                                                       |
| Moderación                    | Los seguimientos y bloqueos de cada usuario                                                                                   | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                                         |
| Servidores auxiliares         | Los pubs almacenan y sirven feeds; los rooms tunelizan conexiones                                                             | Los enrutadores HTTP devuelven pares proveedores y no almacenan contenido                                           |
| Sin conexión                  | Sincronización por LAN y Bluetooth sin internet                                                                               | Necesita una conexión a internet                                                                                    |
| Navegador                     | Las aplicaciones incluyen un nodo SSB completo                                                                                | Nodo peer-to-peer dentro de una pestaña normal del navegador                                                        |
| Red                           | En funcionamiento, pero sus principales aplicaciones ya no se desarrollan                                                     | Red en funcionamiento con aplicaciones como [5chan](/apps/5chan/) y [Seedit](/apps/seedit/)                         |
| Contrapartida principal       | Funciona sin conexión y no necesita alojamiento, pero los feeds crecen sin límite y los desconocidos siguen siendo invisibles | Publicación abierta y compatibilidad con navegadores, pero necesita internet y conserva solo el estado más reciente |
