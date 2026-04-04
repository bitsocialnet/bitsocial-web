---
title: React Hooks
description: Biblioteca React Hooks para crear aplicaciones sociales descentralizadas en el protocolo Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning Nomenclatura heredada
Este paquete actualmente utiliza convenciones de nomenclatura heredadas de su bifurcación ascendente. Las referencias a "plebbit" en el código, las API y la configuración se migrarán a "bitsocial" en una versión futura. La funcionalidad no se ve afectada.
:::

El paquete `bitsocial-react-hooks` proporciona una API de ganchos React familiar para interactuar con el protocolo Bitsocial. Se encarga de buscar feeds, comentarios y perfiles de autor, administrar cuentas, publicar contenido y suscribirse a comunidades, todo sin depender de un servidor central.

Esta biblioteca es la interfaz principal utilizada por [5chan](/apps/5chan/) y otras aplicaciones cliente de Bitsocial.

:::note
`bitsocial-react-hooks` es una bifurcación temporal de `plebbit/plebbit-react-hooks` mantenida para el desarrollo asistido por IA. Se consume directamente desde GitHub en lugar de publicarse en npm.
:::

## Instalación

Debido a que el paquete aún no está en npm, instálelo directamente desde GitHub, fijándolo a un hash de confirmación específico:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

Reemplace `<commit-hash>` con la confirmación a la que desea dirigirse.

## Descripción general de la API

Los ganchos están organizados en categorías funcionales. A continuación se muestra un resumen de los ganchos más utilizados en cada categoría. Para firmas, parámetros y tipos de retorno completos, consulte la [referencia completa de API en GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### Cuentas

Administre cuentas de usuarios locales, identidades y configuraciones.

- `useAccount(accountName?)`: devuelve el objeto de cuenta activo (o con nombre)
- `useAccounts()`: devuelve todas las cuentas almacenadas localmente
- `useAccountComments(options?)`: devuelve comentarios publicados por la cuenta activa

### Comentarios

Obtenga e interactúe con comentarios e hilos individuales.

- `useComment(commentCid?)`: recupera un único comentario por su CID
- `useComments(commentCids?)`: recupera varios comentarios por lotes
- `useEditedComment(comment?)`: devuelve la última versión editada de un comentario.

### Comunidades

Recuperar metadatos y configuraciones de la comunidad.

- `useSubplebbit(subplebbitAddress?)`: busca una comunidad por dirección
- `useSubplebbits(subplebbitAddresses?)`: recupera múltiples comunidades
- `useSubplebbitStats(subplebbitAddress?)`: devuelve el número de suscriptores y publicaciones.

### Autores

Busque perfiles de autor y metadatos.

- `useAuthor(authorAddress?)`: recupera un perfil de autor
- `useAuthorComments(options?)`: devuelve comentarios de un autor específico
- `useResolvedAuthorAddress(authorAddress?)`: resuelve una dirección legible por humanos (por ejemplo, ENS) en su dirección de protocolo

### Feeds

Suscríbete y pagina canales de contenido.

- `useFeed(options?)`: devuelve un feed paginado de publicaciones de una o más comunidades
- `useBufferedFeeds(feedOptions?)`: almacena previamente en búfer varios feeds para un renderizado más rápido
- `useAuthorFeed(authorAddress?)`: devuelve un feed de publicaciones de un autor específico

### Acciones

Publicar contenido y realizar operaciones de escritura.

- `usePublishComment(options?)`: publica un nuevo comentario o responde
- `usePublishVote(options?)`: emitir un voto a favor o en contra
- `useSubscribe(options?)`: suscribirse o darse de baja de una comunidad

### Estados y RPC

Supervise el estado de la conexión e interactúe con un demonio Bitsocial remoto.

- `useClientsStates(options?)`: devuelve el estado de conexión de los clientes IPFS/pubsub
- `usePlebbitRpcSettings()`: devuelve la configuración actual del demonio RPC

## Desarrollo

Para trabajar en la biblioteca de ganchos localmente:

**Requisitos previos:** Node.js, Corepack habilitado, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

Consulte el archivo README del repositorio para obtener comandos de prueba y compilación.

## Enlaces

- **GitHub:** [referencia completa de API en GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **Licencia:** GPL-2.0 únicamente
