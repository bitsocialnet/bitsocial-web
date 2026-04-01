---
title: 5chan
description: Un tablero de imágenes descentralizado y sin servidor construido sobre el protocolo Bitsocial donde cualquiera puede crear y poseer tableros.
sidebar_position: 1
---

:::warning[Legacy naming]
El código base de este proyecto todavía utiliza el nombre heredado "plebbit" anterior al cambio de marca de Bitsocial. Los nombres de los paquetes, las referencias de API y parte de la terminología interna se actualizarán en una versión futura. La funcionalidad que se describe aquí está actualizada; sólo el nombre está desactualizado.
:::

# 5chan

5chan es un tablero de imágenes sin servidor, sin administrador y totalmente descentralizado que se ejecuta en el protocolo Bitsocial. Sigue la estructura familiar del directorio del tablero de imágenes al tiempo que introduce la propiedad descentralizada: cualquiera puede crear un tablero y varios tableros pueden competir por el mismo espacio en el directorio a través de un mecanismo de votación.

## Descargas

| Plataforma | Enlace                                |
| ---------- | ------------------------------------- |
| Web        | [5chan.aplicación](https://5chan.app) |
| Escritorio | Disponible para Mac, Windows y Linux  |
| Móvil      | Disponible para Android               |

## como funcionan los tableros

5chan organiza el contenido en tableros utilizando un diseño de directorio clásico (por ejemplo, `/b/`, `/g/`). A diferencia de los tableros de imágenes tradicionales donde un administrador central controla cada tablero, 5chan permite a cualquier usuario crear y poseer completamente su propio tablero. Cuando varias juntas directivas apuntan al mismo puesto del directorio, compiten por esa posición mediante votación.

### Creando un tablero

Para crear una nueva placa, debe ejecutar `bitsocial-cli` como un nodo peer-to-peer. Esto garantiza que su tablero esté alojado de manera descentralizada sin depender de ningún servidor central.

### Asignaciones de directorio

Las asignaciones de ranuras de directorio (qué placa aparece en qué ruta) se administran actualmente a través de solicitudes de extracción de GitHub al archivo `5chan-directories.json`. Este es un proceso temporal: las versiones futuras admitirán la creación de tableros en la aplicación y la votación basada en pubsub para manejar las asignaciones de directorio automáticamente.

## Internos

En el fondo, 5chan utiliza la capa API plebbit-js para sus interacciones de protocolo. Como se señaló en la advertencia anterior, estas referencias internas aún llevan nombres heredados anteriores al cambio de marca de Bitsocial.

## Enlaces

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegrama**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licencia**: solo GPL-2.0
