---
title: Bitsocial y Nostr
description: Cómo se compara el modelo de Nostr basado en relés con las comunidades peer-to-peer de Bitsocial, desde la ruta de los datos y la identidad hasta los grupos, el control del spam y la moderación.
---

# Bitsocial y Nostr

Nostr no encaja del todo ni en la categoría de los sistemas federados ni en la de los sistemas sobre
blockchain. Las instancias no emiten cuentas a los usuarios, y no hay cadena, ni consenso, ni gas,
ni orden global. Nostr se describe mejor como **red social basada en relés**: los usuarios tienen
pares de claves, firman eventos y los publican en relés, que son servidores corrientes que los
almacenan y los sirven ([NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)). El
propio [README](https://github.com/nostr-protocol/nostr) de Nostr dice que no se basa en técnicas
peer-to-peer.

Eso sitúa a Nostr más cerca de Bitsocial que los sistemas federados o basados en blockchain en un
aspecto importante: la identidad es criptográfica y portátil. Las diferencias están en la capa de
datos y en quién controla el acceso.

## Cómo funciona Nostr

- **Eventos y relés.** Cada publicación, perfil o reacción es un evento JSON firmado. Los clientes
  publican eventos en los relés a través de WebSockets y se suscriben con filtros; los relés
  almacenan los eventos y los devuelven. Los relés no se comunican entre sí.
- **Replicación.** Los usuarios suelen publicar en varios relés. Un estudio de 712 relés realizado
  en 2023 encontró la publicación media en 34,6 de ellos
  ([Wei y Tyson](https://arxiv.org/abs/2402.05709)).
- **Encontrar las publicaciones de alguien.** Los usuarios publican una lista de los relés en los
  que escriben y de los que leen
  ([NIP-65](https://github.com/nostr-protocol/nips/blob/master/65.md)), y los clientes obtienen las
  publicaciones de un usuario de sus relés de escritura.
- **Identidad.** Cada usuario es una clave secp256k1 que firma con firmas Schnorr. Las
  especificaciones no definen rotación ni recuperación de claves, así que perder la clave es perder
  la cuenta. Los identificadores opcionales `name@domain`
  ([NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)) se comprueban con un archivo
  en el servidor web de ese dominio.
- **Grupos.** El mecanismo de comunidad recomendado son los grupos basados en relés
  ([NIP-29](https://github.com/nostr-protocol/nips/blob/master/29.md)): un relé aloja un grupo,
  aplica sus reglas de pertenencia y publicación antes de aceptar una publicación, y firma sus
  metadatos. Las antiguas comunidades aprobadas por moderadores
  ([NIP-72](https://github.com/nostr-protocol/nips/blob/master/72.md)) están ahora marcadas como no
  recomendadas en favor de NIP-29.
- **Control del spam.** Cada relé elige su propia barrera: prueba de trabajo
  ([NIP-13](https://github.com/nostr-protocol/nips/blob/master/13.md)), autenticación y listas de
  permitidos ([NIP-42](https://github.com/nostr-protocol/nips/blob/master/42.md)), pago o límites de
  frecuencia. Los clientes añaden listas de silenciados y puntuaciones de confianza.
- **Multimedia.** Las imágenes y los vídeos se suben a servidores de archivos HTTP aparte.

## En qué se diferencian

### Quién almacena y sirve las publicaciones

En Nostr, los relés son la capa de almacenamiento y entrega: un servidor tiene que mantener cada
publicación en línea. En Bitsocial, los enrutadores HTTP solo ayudan a los clientes a encontrar
pares. No almacenan publicaciones, perfiles, metadatos de comunidad ni estado de moderación; los
clientes obtienen el contenido del nodo de la comunidad y de los pares que la siembran. Consulta
[Protocolo peer-to-peer](/peer-to-peer-protocol/).

### Quién controla el acceso

En Nostr, las barreras de escritura pertenecen a los operadores de los relés. Fuera de los grupos
NIP-29, una clave rechazada por un relé puede publicar el mismo evento en cualquier relé que lo
acepte, y lo que ven los lectores depende de qué relés lea su cliente. Un grupo NIP-29 se parece más
a una comunidad de Bitsocial: su relé anfitrión acepta o rechaza las publicaciones. Aun así, el relé
sigue definiendo qué pueden hacer los roles del grupo, y el historial del grupo queda ligado a ese
relé salvo que otro relé acepte hacerse cargo de él.

En Bitsocial, una comunidad es un objeto criptográfico con su propio par de claves. El nodo de la
comunidad ejecuta el desafío que elija el propietario y publica el estado aceptado en la red
peer-to-peer. Consulta [Desafíos antispam personalizados](/custom-challenges/).

### Operar la infraestructura

Un relé es un servidor con un dominio y un endpoint WebSocket, y los relés populares cargan con el
coste de almacenamiento y ancho de banda de lo que sirven. El estudio de 2023 estimó que alrededor
del 95 % de los relés gratuitos no podían cubrir sus costes con donaciones. Un nodo de comunidad de
Bitsocial funciona en hardware de consumo, y los pares que leen una comunidad pueden ayudar a
compartirla.

### Navegador

Un cliente web de Nostr abre conexiones WebSocket directamente con los relés, así que no hace falta
un servidor de aplicación. Una aplicación web de Bitsocial ejecuta un nodo peer-to-peer en la
pestaña y obtiene el contenido de los pares. Consulta [Peer-to-peer en el navegador](/browser-p2p/).

### Contenido antiguo

Las publicaciones de Nostr están ampliamente replicadas entre relés, lo que ayuda a que las antiguas
sobrevivan. Bitsocial conserva el estado más reciente de la comunidad y no garantiza el contenido
antiguo para siempre.

## Comparación

| Pregunta                      | Nostr                                                                                                         | Bitsocial                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Categoría                     | Protocolo basado en relés                                                                                     | Red de comunidades peer-to-peer                                                        |
| Identidad                     | Clave de usuario secp256k1, sin rotación en las especificaciones                                              | Pares de claves Ed25519 para usuarios y comunidades                                    |
| Dónde viven las publicaciones | Relés elegidos por el autor, a menudo muchos                                                                  | El nodo del propietario de la comunidad y los pares que la leen y la siembran          |
| Quién lo mantiene disponible  | Los operadores de los relés                                                                                   | El nodo del propietario de la comunidad más seeders auxiliares                         |
| Comunidades                   | Grupos alojados en relés (NIP-29)                                                                             | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                      |
| Control del spam              | La política de cada relé: prueba de trabajo, autenticación, pago, listas de permitidos, límites de frecuencia | El desafío de cada comunidad antes de aceptar una publicación                          |
| Moderación                    | Políticas de los relés, listas de silenciados en los clientes, etiquetas y denuncias                          | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran            |
| Nombres                       | Identificadores opcionales `name@domain` comprobados por HTTPS                                                | Nombres `.bso` y `.eth` que se resuelven en claves                                     |
| Navegador                     | Cliente WebSocket de los relés                                                                                | Nodo peer-to-peer dentro de una pestaña normal del navegador                           |
| Contrapartida principal       | Identidad portátil y amplia replicación, pero disponibilidad y política dependientes de los relés             | Menos dependencia de relés, pero el contenido antiguo no está garantizado para siempre |
