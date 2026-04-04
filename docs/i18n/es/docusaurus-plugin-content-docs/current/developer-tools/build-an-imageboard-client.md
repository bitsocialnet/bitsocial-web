---
title: Construir un cliente de tablero de imágenes
description: Guía de contribución de la fase 1 para desarrolladores que desean ofrecer nuevas experiencias de tableros de imágenes en Bitsocial.
sidebar_position: 1
---

# Construir un cliente de tablero de imágenes

La Fase 1 no se trata de una aplicación oficial que cubra toda la categoría. 5chan es el primer punto de prueba, pero el objetivo real es un amplio ecosistema de tablero de imágenes: múltiples clientes de Bitsocial con diferentes lenguajes visuales, valores predeterminados de moderación, modelos de directorio y comunidades objetivo.

## Lo que necesita la Fase 1

- Clientes familiares estilo 4chan para la incorporación general
- Clientes inspirados en Altchan con diferentes culturas y paquetes de tableros
- Clientes móviles primero o de bajo ancho de banda
- Clientes de una sola comunidad o de nicho con valores predeterminados muy obstinados
- Mejores flujos de moderación, medios, incorporación o descubrimiento que los que incluye la primera aplicación

## La forma más rápida de ayudar

Si desea el camino más corto hacia el envío, primero contribuya directamente a 5chan:

- Explora la aplicación en vivo en [5chan.aplicación](https://5chan.app)
- Revise la fuente en [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Únase al chat del constructor en [t.me/fivechandev](https://t.me/fivechandev)

## Construye tu propio cliente

Si 5chan no coincide con la comunidad o interfaz que desea, cree un cliente separado. Los clientes de Bitsocial compatibles pueden compartir la misma red sin compartir las mismas decisiones de producto.

1. Conozca las herramientas orientadas al protocolo:
   - [Ganchos de reacción de Bitsocial](../react-hooks/)
   - [CLI bitsocial](../cli/)
2. Decide qué tipo de tablero de imágenes estás construyendo realmente.
Elija primero la estructura del tablero, los supuestos de identidad, el modelo de moderación, el flujo de descubrimiento y el lenguaje visual.
3. Elija la ruta de implementación que se ajuste al proyecto.
Bifurca 5chan si quieres moverte rápido con una base de tablero de imágenes familiar. Empiece de nuevo si la interfaz de usuario o el modelo de interacción necesitan ser radicalmente diferentes.
4. Envíe una primera versión estrecha.
Un cliente que sirve bien a una comunidad real es más valioso que un clon vago destinado a satisfacer a todos.
5. Publica el resultado y deja que las comunidades lo prueben.
Bitsocial mejora cuando los constructores externos envían clientes obstinados que compiten por la calidad del producto en lugar de esperar a que una aplicación oficial lo haga todo.

## Principio de diseño

Bitsocial no gana por tener un cliente bendito. Se gana cuando muchos clientes pueden coexistir, bifurcarse, especializarse y satisfacer necesidades que la primera aplicación nunca podrá satisfacer.
