---
title: 5chan
description: Un tablero de imágenes descentralizado y sin servidor construido sobre el protocolo Bitsocial donde cualquiera puede crear y poseer tableros.
sidebar_position: 1
---

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

En el fondo, 5chan utiliza la capa de cliente del protocolo Bitsocial compartido para sus interacciones de red. La aplicación web en 5chan.app también puede ejecutar un nodo Helia en el navegador cuando P2P del navegador está habilitado desde Configuración avanzada, de modo que los lectores pueden cargar desde pares sin una puerta de enlace IPFS centralizada. Consulte la sección P2P del navegador en las notas del protocolo peer-to-peer.

## Enlaces

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegrama**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licencia**: solo GPL-2.0
