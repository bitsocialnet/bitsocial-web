---
title: Aplicación insignia de Bitsocial
description: "El cliente Bitsocial basado en perfiles propuesto: familiar como X/Twitter por defecto, pero con RPC, feeds, algoritmos, anuncios y comunidades reemplazables."
---

# Aplicación insignia de Bitsocial

La aplicación insignia Bitsocial es el primer cliente basado en perfiles propuesto para la red. La comparación más simple es: familiar como X/Twitter por defecto, pero con la capa de plataforma abierta.

Agregaría perfiles, seguimientos, respuestas, feeds, comunidades, notificaciones y conversaciones públicas en tiempo real, manteniendo al mismo tiempo reemplazables los servicios subyacentes. 5chan demuestra que las comunidades anónimas pueden funcionar. Seedit avanza hacia una discusión persistente. La aplicación insignia llevaría esos efectos de red a una red social convencional sin convertir a una empresa en propietaria del gráfico.

Esta página describe la dirección del producto, no una especificación de lanzamiento bloqueado. La interfaz exacta, el feed predeterminado, el modelo de anuncios, las funciones de IA y el mercado RPC pueden cambiar a medida que el protocolo y las primeras aplicaciones maduran.

## Lo que debería probar

La aplicación debería demostrar que una red social basada en perfiles puede evitar convertirse en una plataforma de custodia:

- los usuarios pueden poseer identidades y perfiles
- las comunidades y los nodos de perfil pueden permanecer peer-to-peer
- Las comunidades pueden transmitir efectos de red a través de los clientes de Bitsocial.
- Los proveedores de RPC pueden hacer que la aplicación sea conveniente sin tomar la custodia
- Los algoritmos de alimentación pueden ser servicios opcionales en lugar de la ley de plataforma.
- otros clientes aún pueden competir por la misma red

La cuestión no es convertirnos en el único cliente de Bitsocial. El punto es hacer el primer cliente amplio que muestre hasta dónde puede extenderse el protocolo.

## Familiar por defecto, reemplazable por diseño

La experiencia predeterminada debe ser competitiva con las principales aplicaciones de conversación pública: un feed de inicio rápido, seguimientos, respuestas, distribución estilo reenvío, comunidades, notificaciones, búsqueda y una vista clasificada para usted que funcione de inmediato.

Bitsocial Forge puede ejecutar el primer servicio de alimentación y RPC predeterminado. Ese valor predeterminado puede incluir un feed clasificado y anuncios para que la aplicación se sienta completa desde el primer día en lugar de pedir a los usuarios principales que reúnan toda la pila ellos mismos.

La diferencia es que el valor predeterminado no debería ser la prisión. Un usuario debería poder cambiar RPC, feeds, instancias, sistemas de clasificación, anuncios y proveedores de descubrimiento, o eliminar la clasificación por completo. La aplicación puede tener opiniones desde el primer lanzamiento y, al mismo tiempo, mantener reemplazables todos los servicios principales.

Eso hace que la aplicación sea más personalizable que una plataforma convencional. Un usuario puede mantener el feed clasificado predeterminado con anuncios. Otro podría utilizar un feed cronológico sin clasificación. Otro podría elegir un RPC centrado en la privacidad, un servicio de descubrimiento administrado por la comunidad, un feed pago sin publicidad o un algoritmo de nicho creado para una subcultura específica.

## Comunidades entre clientes

Las comunidades deberían ser mucho más importantes que los grupos aislados dentro de una aplicación.

En X/Twitter, las comunidades están confinadas dentro de X. Pueden ser útiles, pero heredan los límites de una plataforma, un sistema de cuentas, una pila de recomendaciones y una superficie de producto.

Una comunidad Bitsocial se puede crear, alojar, descubrir y utilizar a través de diferentes clientes. Eso significa que la aplicación principal puede mostrar comunidades y publicaciones de la red Bitsocial más amplia, no solo de los usuarios que comenzaron dentro de la aplicación principal. Una comunidad podría tener actividad desde un cliente de tablero de imágenes, un cliente de discusión estilo Reddit, un cliente de foro especializado, una aplicación móvil y la aplicación principal al mismo tiempo.

Esa es la principal ventaja del efecto de red: un cliente puede resultar familiar para los usuarios principales y al mismo tiempo obtener valor de muchos clientes, nodos comunitarios, proveedores de RPC y servicios independientes.

## Algoritmos de alimentación opcionales

La aplicación insignia no debería imponer a todos un sistema de clasificación global.

Los algoritmos de alimentación deben ser opcionales. Un usuario podría elegir un algoritmo de un mercado, cambiar de proveedor, usar un algoritmo de una empresa, usar uno ejecutado por un operador anónimo, usar uno creado por una comunidad, ejecutar uno personal o no usar ningún algoritmo.

Los proveedores públicos de RPC son un lugar natural para que compitan estos servicios. Pueden indexar, clasificar y recomendar contenido, pero no deben ser propietarios del usuario ni del perfil.

Esos servicios también pueden competir en la forma de la propia aplicación. Un RPC podría proporcionar un feed clasificado con anuncios. Otro podría proporcionar una información cronológica sin clasificar. Otro podría especializarse en privacidad, traducción, moderación, descubrimiento de comunidades o un gráfico social de nicho.

Si la economía funciona, los servicios de feeds respaldados por RPC podrían agregar características de IA similares a las que las principales plataformas están tratando de incluir en sus feeds: traducciones automáticas, resúmenes, respuestas asistidas por bots, respuestas de búsqueda, asistencia de moderación o contexto de estilo de nota comunitaria.

Esas características deberían ser opciones de servicio, no requisitos de protocolo. Un RPC predeterminado puede competir ofreciendo un feed más rico, pero los usuarios y los clientes de la competencia aún deberían poder elegir alternativas más simples, privadas, cronológicas, sin publicidad o específicas de la comunidad.

## RPC sin custodia

Cada usuario debería poder participar como un nodo completo de igual a igual a través de RPC sin darle al proveedor de RPC propiedad sobre su identidad o perfil.

La ruta alojada es importante porque la mayoría de los usuarios no comenzarán ejecutando un servidor. La ruta de salida es igualmente importante: un usuario debería poder moverse a su propio nodo de perfil en hardware de baja especificación, incluida una Raspberry Pi, cuando lo desee.

Ésa es la diferencia entre conveniencia y custodia.

## Por qué puede convertirse en una aplicación para todo

Si Bitsocial Network brinda a las aplicaciones nombres duraderos, pagos, propinas, premios y otras vías financieras, la aplicación insignia podría convertirse en mucho más que un cliente de feeds.

La restricción importante es que la aplicación no debe convertirse en el nuevo propietario de la red. Puede ser un cliente grande, tal vez incluso el cliente más popular, y al mismo tiempo dejar espacio para aplicaciones de la competencia, RPC de la competencia, algoritmos de alimentación de la competencia y nodos de perfil autohospedados.
