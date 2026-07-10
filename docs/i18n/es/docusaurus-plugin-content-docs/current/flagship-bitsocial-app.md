---
title: Descentralizar Twitter/X
description: "Fase 3 del plan maestro: una alternativa a Twitter/X enfocada y descentralizada para la conversación pública centrada en el texto, con infraestructura reemplazable."
---

# Descentralizar Twitter/X

La fase 3 plantea construir una alternativa a Twitter/X enfocada y descentralizada. Su centro es la conversación pública centrada en el texto: publicaciones breves, respuestas, reposts, seguimientos, debate en tiempo real y comunidades, con la capa de plataforma abierta.

Twitter/X sigue estando definido por las publicaciones, el texto y el intercambio de ideas. El cliente de la fase 3 debería competir en esa experiencia esencial y hacer que funcione excepcionalmente bien.

Esta página describe la dirección del producto, no una especificación de lanzamiento cerrada. La interfaz exacta, el feed predeterminado, el modelo publicitario, las funciones de AI y el mercado de RPC pueden cambiar a medida que maduren el protocolo y las primeras aplicaciones.

## Qué debería demostrar

El cliente debería demostrar que una red social basada en perfiles puede evitar convertirse en una plataforma de custodia:

- los usuarios pueden ser dueños de sus identidades y perfiles
- las comunidades y los nodos de perfil pueden seguir siendo peer-to-peer
- las comunidades pueden trasladar los efectos de red entre los clientes de Bitsocial
- los proveedores de RPC pueden hacer que el cliente sea cómodo sin asumir la custodia
- los algoritmos del feed pueden ser servicios opcionales en lugar de reglas impuestas por la plataforma
- otros clientes pueden seguir compitiendo por la misma red

El objetivo es construir el cliente más sólido posible para la conversación pública y demostrar hasta dónde puede llegar el protocolo.

## Familiar en su propósito, reemplazable por diseño

La experiencia predeterminada debería competir con el núcleo de Twitter/X: un feed de inicio rápido, publicaciones de texto, seguimientos, respuestas, distribución mediante reposts, comunidades, notificaciones, búsqueda y una vista clasificada For You que funcione de inmediato.

Bitsocial Forge puede operar el primer servicio predeterminado de RPC y feed. Este servicio puede incluir un feed clasificado y anuncios para que el cliente se sienta completo desde el primer día, en lugar de pedir a los usuarios generales que monten toda la pila por su cuenta.

La diferencia es que la opción predeterminada no debe convertirse en una prisión. Un usuario debería poder cambiar de RPC, feeds, instancias, sistemas de clasificación, anuncios y proveedores de descubrimiento, o eliminar por completo la clasificación. El cliente puede tomar decisiones claras en el primer inicio y mantener reemplazables todos los servicios principales.

Eso hace que el cliente sea más personalizable que una plataforma convencional. Un usuario podría conservar el feed clasificado predeterminado con anuncios. Otro podría usar un feed cronológico sin clasificación. Otro podría elegir un RPC centrado en la privacidad, un servicio de descubrimiento gestionado por la comunidad, un feed de pago sin anuncios o un algoritmo de nicho creado para una subcultura concreta.

## Comunidades entre clientes

Las comunidades deberían ser mucho más importantes que los grupos aislados dentro de una sola aplicación.

En X/Twitter, las comunidades están confinadas dentro de X. Pueden ser útiles, pero heredan los límites de una sola plataforma, un solo sistema de cuentas, una sola pila de recomendaciones y una sola superficie de producto.

Una comunidad de Bitsocial puede crearse, alojarse, descubrirse y utilizarse mediante clientes distintos. Eso significa que el cliente de la fase 3 puede mostrar comunidades y publicaciones de la red Bitsocial más amplia, no solo de los usuarios que empezaron dentro de él. Una comunidad podría recibir al mismo tiempo actividad de un cliente de imageboard, un cliente de debate al estilo de Reddit, un cliente de foro especializado, una aplicación móvil y el cliente de la fase 3.

Esa es la principal ventaja del efecto de red: un cliente puede resultar familiar para los usuarios generales y seguir obteniendo valor de muchos clientes, nodos de comunidad, proveedores de RPC y servicios independientes.

## Algoritmos de feed opcionales

El cliente de la fase 3 no debería imponer a todos un único sistema global de clasificación.

Los algoritmos de los feeds deberían ser opcionales. Un usuario podría elegir un algoritmo en un mercado, cambiar de proveedor, usar el algoritmo de una empresa, uno operado por una persona anónima, uno creado por una comunidad, ejecutar uno propio o no utilizar ningún algoritmo.

Los proveedores de RPC públicos son un lugar natural para que estos servicios compitan. Pueden indexar, clasificar y recomendar contenido, pero no deberían ser dueños del usuario ni del perfil.

Estos servicios también pueden competir en la forma del propio cliente. Un RPC podría ofrecer un feed clasificado con anuncios. Otro podría ofrecer un feed cronológico sin clasificar. Otro podría especializarse en privacidad, traducción, moderación, descubrimiento de comunidades o un grafo social de nicho.

Si el modelo económico funciona, los servicios de feed respaldados por RPC podrían añadir funciones de AI similares a las que las plataformas generalistas intentan incorporar a sus feeds: traducciones automáticas, resúmenes, respuestas asistidas por bots, respuestas a búsquedas, ayuda con la moderación o contexto al estilo de las notas de la comunidad.

Estas funciones deberían ser elecciones de servicio, no requisitos del protocolo. Un RPC predeterminado puede competir ofreciendo un feed más completo, pero los usuarios y los clientes competidores deberían poder seguir eligiendo alternativas más sencillas, privadas, cronológicas, sin anuncios o específicas de una comunidad.

## RPC sin custodia

Cada usuario debería poder participar como un nodo peer-to-peer completo mediante RPC sin entregar al proveedor de RPC la propiedad de su identidad o perfil.

La vía alojada es importante porque la mayoría de los usuarios no empezará ejecutando un servidor. La vía de salida es igual de importante: un usuario debería poder trasladarse a su propio nodo de perfil en hardware modesto, incluido un Raspberry Pi, cuando quiera.

Esa es la diferencia entre comodidad y custodia.

## Conversación pública, reforzada por Bitsocial Chain

Bitsocial Chain puede incorporar nombres duraderos, pagos, propinas, premios y otras vías financieras directamente en la conversación pública.

El cliente de la fase 3 se mantiene centrado en las publicaciones, el texto, el intercambio de ideas y el debate en tiempo real, mientras comparte comunidades y efectos de red con otros clientes de Bitsocial.
