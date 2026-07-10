---
title: Una explicación completa y sencilla del protocolo Bitsocial.
description: Un recorrido en inglés sencillo sobre las comunidades de Bitsocial, búsqueda de pares, publicación, desafíos antispam, moderación y aplicaciones.
---

# Una explicación completa y sencilla del protocolo Bitsocial.

Esta página explica Bitsocial sin asumir que ya comprende las redes de igual a igual, las claves criptográficas, IPFS o pubsub.

Algunos detalles están simplificados intencionadamente. Para la versión más técnica, lea la página [Protocolo de igual a igual](./peer-to-peer-protocol.md).

## La versión corta

Bitsocial es un protocolo para aplicaciones sociales donde las comunidades pertenecen a claves en lugar de a una base de datos de la empresa.

Una comunidad Bitsocial tiene una dirección. Las aplicaciones usan esa dirección para encontrar pares que prestan servicios a la comunidad, obtener las publicaciones más recientes de esos pares y publicar nuevas publicaciones a través de un canal de mensajes de igual a igual. Antes de aceptar una publicación, la comunidad puede exigir un desafío antispam, como un captcha, un código de invitación, un pago, una verificación de token, una verificación de moderación de IA, una lista de permitidos o cualquier otra regla que pueda codificarse.

Esa es la idea central:

1. Una comunidad está controlada por una clave privada.
2. La clave pública le da a la comunidad una dirección estable.
3. Los compañeros ayudan a los lectores a encontrar y buscar la comunidad.
4. Un nodo comunitario acepta o rechaza nuevas publicaciones.
5. La política antispam pertenece a cada comunidad, no a una plataforma global.

## Por qué son importantes los hashes

Un hash es una huella digital corta de datos.

Si dos personas analizan exactamente el mismo archivo, obtienen la misma huella digital. Si el archivo cambia, la huella digital cambia. Eso hace que los hashes sean útiles para buscar y verificar datos sin confiar en que una empresa le diga cuál es el archivo.

Los sistemas peer-to-peer utilizan esta idea constantemente. En lugar de solicitar a un sitio web "el archivo llamado photo.png", un interlocutor puede solicitar a la red los datos con una huella digital específica. Si otro par devuelve datos incorrectos, la verificación de hash falla.

Bitsocial utiliza hashes e identificadores de contenido para datos de publicaciones y otras partes del estado de la comunidad. El punto importante es simple: los datos pueden abordarse por lo que son, no sólo por el lugar donde los alojó la empresa.

## Por qué son importantes las claves públicas

Una clave pública y una clave privada son un par coincidente.

La clave privada es secreta. Es lo que da el control. La clave pública es segura para compartir. Permite que todos los demás verifiquen que un mensaje, actualización o acción de moderación realmente proviene de la clave privada correspondiente.

Así es como Bitsocial evita las cuentas normales de la plataforma. Una empresa no necesita emitir la identidad. No es necesario que una fila de la base de datos defina el propietario. El par de claves es la autoridad.

En términos sencillos:

- la clave privada es el identificador de control del propietario
- la clave pública es la identidad pública o dirección
- las firmas prueban que una acción provino del propietario

## Qué es una comunidad Bitsocial

Una comunidad Bitsocial no es solo una página en una aplicación.

Tiene su propio par de claves. La clave pública le da a la comunidad una dirección de red estable. La clave privada controla las actualizaciones del estado de la comunidad, como metadatos, reglas, lista de moderadores, configuración del desafío y punteros al último contenido aceptado.

Eso significa que una comunidad puede sobrevivir a una interfaz. Una aplicación puede mostrarlo como un tablero. Otra aplicación puede mostrarlo como un foro. Una aplicación futura puede mostrarlo en un feed basado en perfil. La aplicación puede cambiar, pero la dirección de la comunidad aún apunta a la misma comunidad de propiedad.

## como funciona la lectura

Cuando un usuario abre una comunidad Bitsocial, la aplicación no solicita la página a una base de datos central.

El flujo está más cerca de esto:

1. La aplicación ya conoce la dirección de la comunidad o la obtiene de una lista, enlace, superficie de búsqueda o
   nombre legible por humanos.
2. La aplicación pregunta a los enrutadores ligeros qué pares proporcionan actualmente esa dirección de comunidad.
3. Los enrutadores devuelven únicamente direcciones de pares. No devuelven publicaciones, reglas, perfiles o comunidad.
   metadatos.
4. La aplicación se conecta con sus pares y obtiene el último estado de la comunidad.
5. Ese estado contiene sugerencias para publicar contenido.
6. La aplicación obtiene el contenido de la publicación de sus pares y lo presenta en una interfaz social normal.

El enrutador es sólo una ayuda de búsqueda. Es más parecido a preguntar "¿quién tiene esto?" en lugar de preguntar "por favor, sírvanme todo el sitio web".

Para más detalles sobre esta división, lea [Descubrimiento de contenido](./content-discovery.md).

## Cómo funciona la publicación

Publicar es diferente de leer porque las redes abiertas de igual a igual pueden recibir spam.

Bitsocial maneja la publicación a través de un flujo de desafío-respuesta:

1. El usuario escribe una publicación o responde.
2. La aplicación se une al tema de mensajes entre pares de la comunidad.
3. La aplicación solicita un desafío al nodo de la comunidad.
4. El nodo comunitario devuelve el desafío.
5. El usuario o la aplicación completa el desafío.
6. La aplicación envía la publicación más la respuesta al desafío.
7. El nodo comunitario verifica la respuesta y la publicación.
8. Si se aprueba, el nodo de la comunidad acepta la publicación en la próxima actualización de la comunidad.
9. Otros lectores obtienen el estado de la comunidad actualizado de sus pares.

El desafío ocurre antes de que el puesto se convierta en parte del estado comunitario aceptado. Ésa es la diferencia importante con los sistemas en los que el spam se acepta primero y se oculta después.

## Por qué son importantes los desafíos antispam

La mayoría de las plataformas sociales convierten el antispam en una política de plataforma. Una empresa decide qué cuenta como cuenta válida, publicación válida, alcance válido o usuario válido.

Bitsocial separa esas cosas. El protocolo brinda a las comunidades una forma de solicitar un desafío antes de aceptar una publicación, pero no obliga a todas las comunidades a utilizar el mismo desafío.

Una comunidad podría usar un captcha. Otro podría usar códigos de invitación. Otro podría requerir una verificación por SMS, un pago, un NFT, un saldo de token, una puntuación de moderación de IA, una prueba de reputación, una lista de permitidos específica de la comunidad o una regla personalizada.

Esa flexibilidad es importante porque el spam cambia. Una regla de spam a nivel de protocolo queda obsoleta. Un desafío a nivel comunitario puede evolucionar sin migrar toda la red.

Para una explicación más detallada, lea [Desafíos antispam personalizados](./custom-challenges.md).

## Cómo funciona la moderación

Bitsocial no está libre de moderación. Es moderación sin un superadministrador global.

Una comunidad puede tener propietarios y moderadores. Las direcciones de moderador son parte del estado comunitario. Cuando un moderador realiza una acción, esa acción puede firmarse. El nodo de la comunidad y los clientes pueden comparar la firma con la lista de moderadores.

Eso le da a la moderación un alcance local:

- un propietario de la comunidad controla esa comunidad
- Los moderadores actúan a través de claves que la comunidad reconoce.
- las aplicaciones aún pueden elegir lo que indexan, clasifican, ocultan o resaltan
- ninguna cuenta de empresa a nivel de protocolo puede borrar todas las identidades o apoderarse de todas las comunidades

En la práctica, esto significa que una comunidad puede eliminar el spam o hacer cumplir reglas dentro de su propio espacio sin convertir sus reglas en leyes para toda la red.

Para ver la vista de políticas, lea [Moderación local, no prohibiciones globales](./local-moderation.md).

## Que aplicaciones agregan

El protocolo no decide cómo debería verse el producto completo.

Una aplicación agrega la experiencia humana en torno al protocolo:

- listas de comunidades predeterminadas
- búsqueda y descubrimiento
- feeds y clasificación
- interfaz de diseño y publicación
- manejo de medios
- herramientas de moderación
- empaquetado para dispositivos móviles, de escritorio o de navegador
- modelo de negocio y valores predeterminados

Es por eso que Bitsocial puede admitir diferentes estilos de aplicaciones. 5chan puede parecer un tablero de imágenes. Seedit puede parecer una discusión estilo foro. Otros clientes pueden crear diferentes superficies de descubrimiento, sistemas de clasificación, vistas de moderación o valores predeterminados de la comunidad mientras siguen usando comunidades Bitsocial compatibles debajo.

El protocolo mantiene la portabilidad de la propiedad y la publicación. Las aplicaciones compiten por la calidad del producto.

## Qué agrega el RPC público

Ejecutar un nodo comunitario peer-to-peer directamente es poderoso, pero no todos quieren administrar una máquina siempre activa.

Public RPC es la capa de servicio que puede hacer que Bitsocial sea más conveniente. Un proveedor público de RPC puede ayudar a los usuarios a administrar comunidades desde un teléfono o un cliente liviano, mientras que el modelo de propiedad a largo plazo aún debería permitir a los usuarios mudarse, autohospedarse o elegir un proveedor de la competencia.

La distinción importa:

- RPC puede ayudar con el tiempo de actividad y la comodidad
- RPC no debería convertirse en custodia permanente
- la relación de propietario debe permanecer ligada a las claves, no a la base de datos de un proveedor

## Lo que Bitsocial no es

Bitsocial no es una red social blockchain. Las redes sociales no necesitan que cada publicación se convierta en una transacción en un libro de contabilidad global.

Bitsocial no es una federación en el sentido de ActivityPub. No es necesario que una comunidad sea una cuenta en un servidor con un dominio, un administrador y una base de datos de servidor.

Bitsocial tampoco es una sola aplicación. Es una capa de protocolo compartido para aplicaciones, comunidades, nodos, enrutadores, proveedores de RPC, servicios de descubrimiento, módulos antispam y herramientas de moderación.

La cuestión no es que todos los usuarios deban comprender todo esto antes de publicar. El punto es que el producto puede parecer normal, mientras que el modelo de propiedad subyacente es diferente.

## Adónde ir a continuación

- [Protocolo de igual a igual](./peer-to-peer-protocol.md) explica el flujo técnico.
- [Descubrimiento de contenido](./content-discovery.md) explica la búsqueda en la red versus la curación de aplicaciones.
- [Desafíos antispam personalizados](./custom-challenges.md) explica el sistema de desafíos.
- [Identidad y propiedad comunitaria](./identity-and-ownership.md) explica clave controlada
  propiedad.
- [Construye tu propio cliente](/build-your-own-client/) explica cómo las aplicaciones independientes pueden aprovechar
  la misma red.
