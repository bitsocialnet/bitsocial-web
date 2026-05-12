---
title: Descubrimiento de contenido
description: Cómo Bitsocial separa el descubrimiento entre pares de la curación a nivel de aplicación.
---

# Descubrimiento de contenido

Bitsocial no incluye un feed global, un índice de búsqueda o un algoritmo de clasificación en el protocolo. Separa el descubrimiento de contenido en dos capas:

1. **Búsqueda de red** encuentra los pares que actualmente prestan servicios en una comunidad conocida.
2. La **curación de aplicaciones** decide qué comunidades, tableros, listas o publicaciones muestra un producto primero.

Esto mantiene el protocolo pequeño y deja espacio para que compitan muchas experiencias de descubrimiento.

## búsqueda de red

Cada comunidad tiene una dirección estable derivada de su clave pública. Cuando un cliente ya conoce esa dirección, consulta enrutadores HTTP livianos para encontrar pares que se hayan anunciado como proveedores para ella.

Los enrutadores solo devuelven direcciones de pares del proveedor. No almacenan publicaciones, metadatos, listas de usuarios ni un directorio de comunidades legible por humanos. Después de que el cliente recibe las direcciones de los pares, se conecta con esos pares y obtiene los últimos metadatos de la comunidad más punteros de contenido, luego recupera los datos de publicación reales mediante hash.

Esto responde a la pregunta del protocolo: "¿Dónde puedo obtener el estado más reciente de esta comunidad?"

## Curación de aplicaciones

La pregunta separada sobre el producto es: "¿Qué comunidades debería ver primero un usuario?"

Bitsocial deja eso en manos de las aplicaciones, listas y usuarios en lugar de integrar una respuesta en la red. Los ejemplos incluyen:

- un cliente que muestra comunidades que el usuario ya sigue
- una lista predeterminada seleccionada para una aplicación estilo Reddit
- ranuras de directorio para una aplicación estilo tablero de imágenes
- índices de búsqueda o clasificación mantenidos por una aplicación específica
- enlaces directos compartidos por los usuarios

Apps can index, rank, filter, or highlight different things without turning those choices into protocol law. If one app's discovery surface is not useful, another app can build a different one on the same underlying communities.

## Aplicaciones actuales

5chan currently uses familiar directory paths such as `/b/` or `/g/`. Las asignaciones de directorios se administran actualmente a través de una lista pública, y se espera que las versiones futuras admitan la creación de tableros en la aplicación y la votación de espacios en el directorio.

Seedit uses default community lists for its front page. Communities can still be created and shared outside that default list.

In both cases, the app-level list helps users find something to open, and the protocol-level lookup then resolves the chosen community to peers.

## Por qué es importante esta división

A single decentralized network still needs good discovery, but the discovery layer should be replaceable. Bitsocial's core protocol focuses on addressability, peer lookup, publishing, and anti-spam. La curación se encuentra por encima de esa capa, donde las aplicaciones pueden experimentar con directorios, listas predeterminadas, feeds, políticas de búsqueda, votación y moderación sin necesidad de una migración en toda la red.
