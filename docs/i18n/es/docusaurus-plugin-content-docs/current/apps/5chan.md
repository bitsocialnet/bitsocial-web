---
title: 5chan
description: Un imageboard descentralizado y sin servidores, construido sobre el protocolo Bitsocial, donde cualquiera puede crear y poseer sus propios tablones.
sidebar_position: 1
---

# 5chan

5chan es un imageboard sin servidores, sin administradores y totalmente descentralizado que funciona sobre el protocolo Bitsocial. Mantiene la estructura de directorios habitual de los imageboards, pero introduce la propiedad descentralizada: cualquiera puede crear un tablón y varios tablones pueden competir por el mismo puesto del directorio mediante un mecanismo de votación.

## Descargas

| Plataforma | Enlace                               |
| ---------- | ------------------------------------ |
| Web        | [5chan.app](https://5chan.app)       |
| Escritorio | Disponible para Mac, Windows y Linux |
| Móvil      | Disponible para Android              |

## Cómo funcionan los tablones

5chan organiza el contenido en tablones con la clásica estructura de directorios (por ejemplo, `/b/`, `/g/`). A diferencia de los imageboards tradicionales, donde un administrador central controla todos los tablones, en 5chan cualquier usuario puede crear un tablón y ser su dueño por completo. Cuando varios tablones aspiran al mismo puesto del directorio, compiten por esa posición; consulta [Directorios](/directories/).

### Crear un tablón

Para crear un tablón nuevo necesitas ejecutar `bitsocial-cli` como nodo peer-to-peer. Así te aseguras de que tu tablón se aloja de forma descentralizada, sin depender de ningún servidor central.

### Asignación de directorios

Los tablones candidatos de cada directorio figuran en un archivo `5chan-directories/5chan-<code>-directory.json` del repositorio [bitsocialnet/lists](https://github.com/bitsocialnet/lists), y un tablón se une a un directorio mediante un pull request a ese archivo. Además, 5chan celebra una votación por cada directorio con [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting): cada titular de un 5chan Pass tiene un voto, y votar por un tablón que no está en la lista lo nomina. Por ahora las votaciones se realizan en la red de pruebas Base Sepolia, donde los recuentos se muestran pero no reordenan la lista.

## Interioridades

Por debajo, 5chan usa la capa de cliente compartida del protocolo Bitsocial para sus interacciones de
red. La aplicación web de 5chan.app ejecuta por defecto un nodo Helia en el navegador, así que una
pestaña normal se une a la red como un par más: carga los tablones desde otros pares y publica por
pubsub, sin ningún gateway centralizado de IPFS en el camino del contenido. Consulta
[Peer-to-peer en el navegador](/browser-p2p/) para saber qué implica eso y qué sigue sin poder hacer
un nodo en el navegador.

## Enlaces

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegram**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licencia**: GPL-2.0-only
