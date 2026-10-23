---
title: Crea tu propio cliente de Bitsocial
description: Guía para desarrolladores que quieran lanzar clientes de Bitsocial independientes, desde imageboards y foros hasta aplicaciones sociales de nicho.
---

# Crea tu propio cliente de Bitsocial

Bitsocial no gana teniendo una única aplicación oficial para cada caso de uso. Gana cuando muchos
clientes pueden compartir el mismo protocolo mientras compiten en interfaz, cultura, descubrimiento,
valores por defecto y modelo de negocio.

5chan y Seedit son las primeras pruebas de que funciona, no un techo. Cualquier desarrollador
debería poder lanzar un nuevo imageboard, un foro, un cliente de perfiles, una aplicación social
pensada para el móvil, una herramienta para una comunidad concreta o incluso un cliente centralizado
que use Bitsocial por debajo, sin pedir permiso al dueño de ninguna plataforma.

## Qué pueden cambiar los desarrolladores

Un cliente de Bitsocial puede competir en decisiones de producto sin bifurcar toda la red:

- la interfaz y el lenguaje visual
- el flujo de bienvenida
- los valores por defecto de la comunidad
- las herramientas de moderación
- el modelo de descubrimiento
- la experiencia multimedia
- las limitaciones de móvil, escritorio o poco ancho de banda
- la monetización y el modelo de negocio

La capa común es el protocolo. La capa de producto está abierta a la competencia.

## La forma más rápida de aprender

Empieza por las aplicaciones que ya existen:

- Prueba [5chan](https://5chan.app) para comunidades de imageboard anónimas.
- Prueba [Seedit](https://seedit.app) para debates al estilo de Reddit.
- Lee la documentación de los [hooks de React de Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) para la integración en el cliente.
- Lee la documentación de la [CLI de Bitsocial](/developer-tools/cli/) para las operaciones de nodo y de comunidad.

Si quieres avanzar rápido, contribuye primero a una aplicación existente. Si la interfaz, la cultura
o el modelo de comunidad que tienes en mente no encajan ahí, crea un cliente aparte.

## Elige una primera versión acotada

La mejor primera versión no es una aplicación social universal. Es un cliente con un público claro y
una razón sólida para existir.

Algunos buenos puntos de partida:

- un cliente de imageboard más limpio para una cultura concreta
- un cliente de foro pensado para el móvil
- una aplicación de una sola comunidad con valores por defecto estrictos
- un cliente para comunidades de creadores
- un cliente de descubrimiento de solo lectura
- una consola de moderación o de operadores
- un cliente optimizado para un idioma, una región o un tipo de dispositivo

Los clientes pequeños son útiles porque Bitsocial les permite crecer dentro de la misma red en lugar
de encerrar a sus usuarios en una base de datos privada.

## Vías de implementación

Hay tres vías prácticas:

1. Bifurcar un cliente existente cuando tu idea se parece a 5chan o a Seedit.
2. Crear un cliente nuevo en React con los [hooks de React de Bitsocial](https://hooks.bitsocial.net/).
3. Crear tu propia integración sobre las API de los nodos y la infraestructura pública de RPC.

La RPC pública debería hacer que la tercera vía sea mucho más práctica. Una persona puede empezar con
un proveedor de RPC alojado y no custodial, y más adelante pasar al autoalojamiento o a un proveedor
de la competencia.

## Principio de diseño

Crea el cliente que debería existir para tu comunidad y deja que los clientes compatibles compitan a
la vista de todos.
