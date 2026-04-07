---
title: RPC público sin permiso
description: Diseño propuesto para un servicio público Bitsocial RPC con usuarios aislados, permisos específicos y propiedad comunitaria.
---

# RPC público sin permiso

Esta página enmarca el RPC público como una propuesta Bitsocial a nivel de producto en lugar de un muro de detalles de implementación.

## Objetivo en lenguaje sencillo

[Bitsocial Forge](https://bitsocialforge.com) puede ejecutar un servicio RPC público que permite a muchos usuarios administrar sus propias comunidades Bitsocial de forma remota, sin convertir al operador en custodio de esas comunidades.

El servicio debería hacer que los clientes móviles y livianos sean prácticos, preservando al mismo tiempo tres limitaciones:

1. Los usuarios permanecen aislados unos de otros de forma predeterminada.
2. Los permisos siguen siendo explícitos y granulares.
3. La compatibilidad con la solicitud RPC actual y la forma de respuesta se puede conservar durante la implementación.

## ¿Qué problema resuelve?

Hoy en día, el modelo RPC más simple suele ser de todo o nada: una clave de autenticación, un dominio de autoridad, acceso completo. Esto funciona para un único operador pero no para un servicio público multiusuario.

Un RPC público sin permiso necesita un modelo más sólido:

- un servicio puede alojar a muchos usuarios
- cada usuario tiene sus propias comunidades y límites
- Las políticas definidas por el operador pueden evitar abusos.
- el usuario aún puede mudarse o hospedarse por sí mismo más tarde

## Modelo central

### Usuarios

Cada usuario obtiene una credencial de autenticación más un paquete de permisos.

### Comunidades

Las comunidades creadas a través del servicio se asignan a un registro de propietario. Se realiza un seguimiento explícito de la propiedad para que los métodos de gestión puedan dirigirse al usuario adecuado.

### Permisos

Los permisos se basan en la capacidad. En lugar de un valor booleano para "puedo usar RPC", el servidor puede controlar:

- ¿Cuántas comunidades puede crear un usuario?
- qué métodos de gestión están disponibles
- qué operaciones de publicación están permitidas
- ¿Qué límites de tarifas se aplican?
- qué superficies de administración son visibles

### Superficie de administración

El propio RPC público debería centrarse en el comportamiento del RPC de cara al usuario. Las tareas administrativas, como la creación de usuarios, la transferencia de propiedad y la revisión de auditoría, pertenecen a una API y un panel de control independientes.

## Postura de compatibilidad

La documentación orientada al usuario debe utilizar términos de Bitsocial como **comunidad** y **perfil**.

A nivel de cable, la primera implementación aún puede preservar el transporte JSON-RPC actual y la forma de carga útil cuando sea útil para la compatibilidad. En otras palabras: los documentos pueden permanecer nativos de Bitsocial incluso si el período de transición mantiene algunos nombres de métodos orientados a la compatibilidad o formas de solicitud detrás de escena.

## Paquete de permisos propuesto

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Los nombres exactos de los métodos son ilustrativos. La parte importante es la forma de la política: las capacidades individuales se controlan de forma independiente en lugar de agruparse en un token de superusuario.

## Flujo de conexión

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

El conocimiento de los permisos debe seguir siendo opcional. Un cliente que ignora la notificación aún puede comportarse correctamente al manejar fallas de autorización estándar del servidor.

## Aplicación de la propiedad

Cuando el servicio crea una comunidad, debería asignar automáticamente la propiedad al usuario que llama. Desde allí:

- Las acciones de inicio, detención, edición y eliminación de la comunidad están en el ámbito del propietario.
- las respuestas de lista y suscripción se envían de forma predeterminada a las propias comunidades de la persona que llama
- una visibilidad más amplia es un permiso de administrador explícito, no un valor predeterminado

Un caso extremo es muy importante: si un usuario se suscribe a una comunidad que **no** es de su propiedad, el servidor solo debe exponer el estado público que cualquier observador externo debería ver. La configuración exclusiva del propietario o los datos del tiempo de ejecución interno nunca deben filtrarse a través de una API de suscripción.

## Superficie del operador sugerida

La API de administración puede seguir siendo aburrida y explícita:

- listar usuarios
- inspeccionar un usuario
- crear o actualizar usuarios
- eliminar usuarios
- transferir la propiedad comunitaria
- inspeccionar registros de auditoría

La autenticación para esta API de operador debe estar completamente separada de la autenticación RPC del usuario final.

## Fases de implementación

### Fase 1

- establecer la estructura pública del proyecto RPC
- agregar registros de usuario y seguimiento de propiedad
- bifurcar o extender el servidor RPC actual

### Fase 2

- implementar paquetes de permisos
- aplicarlos en la capa del método RPC
- devolver metadatos de permisos al conectarse

### Fase 3

- agregar la API del operador
- agregar registro de auditoría
- agregar autenticación de administrador

### Fase 4

- enviar el panel de administración
- controles de abuso de pruebas
- Reforzar la limitación de tarifas y las cuotas de almacenamiento.

## Preguntas abiertas

### Spam de credenciales de autenticación

Si la creación de autenticación es barata, los servicios públicos pueden necesitar una capa de desafío antes de emitir credenciales. Una ruta posible es reutilizar el propio modelo de desafío comunitario para que la emisión de credenciales herede la misma filosofía antiabuso que el resto de la red.

### Detalles de migración

Algunas implementaciones tempranas aún pueden exponer internamente nombres de métodos orientados a la compatibilidad. Esto debe tratarse como un detalle de migración, no como el vocabulario público permanente de los documentos de Bitsocial.

## Resumen

Esta propuesta realmente trata de una cosa: hacer que la infraestructura pública RPC sea útil sin convertirla en custodia. Un buen RPC Bitsocial público debería sentirse como una asistencia opcional para las comunidades en funcionamiento, no como una nueva plataforma central que reclama la propiedad por la puerta trasera.
