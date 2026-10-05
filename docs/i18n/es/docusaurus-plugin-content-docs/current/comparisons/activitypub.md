---
title: Bitsocial y ActivityPub
description: Cómo se compara el Fediverse, con Mastodon para microblogging y Lemmy para comunidades al estilo de Reddit, con las comunidades peer-to-peer de Bitsocial.
---

# Bitsocial y ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) es el estándar del W3C detrás del Fediverse. Los
usuarios eligen un servidor, llamado instancia, que aloja su cuenta, y los servidores intercambian
publicaciones entre sí. [Mastodon](https://joinmastodon.org/) es su software de microblogging más
conocido; [Lemmy](https://join-lemmy.org/) es un agregador de enlaces y foro al estilo de Reddit
formado por comunidades temáticas, lo que lo convierte en el equivalente más cercano dentro del
Fediverse a aplicaciones de Bitsocial como [Seedit](/apps/seedit/).

## Cómo funciona ActivityPub

- **Bandejas de entrada y de salida.** Cada cuenta tiene una bandeja de entrada (inbox) y una de
  salida (outbox). Los servidores entregan actividades en las bandejas de entrada de otros
  servidores, y cada servidor receptor guarda su propia copia de lo que siguen sus usuarios.
- **Identidad en manos del servidor.** Los ID de cuentas y publicaciones son direcciones HTTPS en el
  dominio del servidor de origen. Un handle de Mastodon tiene la forma `@user@domain` y se resuelve
  con WebFinger, y el servidor firma los mensajes de federación en nombre del usuario.
- **Clientes.** Las aplicaciones y los navegadores solo hablan con el servidor del propio usuario, a
  través de la API de ese servidor.
- **Comunidades de Lemmy.** Una comunidad es un actor de grupo alojado en una instancia. Los
  usuarios envían publicaciones a la comunidad, que las redifunde a sus seguidores; según el
  estándar común para foros
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), una
  comunidad puede validar antes las publicaciones, incluso mediante aprobación manual de los
  moderadores.
- **Moderación.** La moderación es local a cada servidor. Los administradores pueden suspender
  cuentas, bloquear servidores enteros o federar solo con los servidores de una lista de permitidos;
  Lemmy tiene además moderadores para cada comunidad.
- **Control del spam.** ActivityPub no define ningún mecanismo antispam. Mastodon y Lemmy filtran
  los registros con aprobación, invitaciones, preguntas de solicitud, captchas y verificación del
  correo electrónico, y después se apoyan en límites de frecuencia, denuncias y moderación.

## En qué se diferencian

### La identidad pertenece a un dominio

Una cuenta del Fediverse pertenece al dominio de su servidor. Mastodon puede redirigir a los
seguidores a una cuenta nueva, pero
[las publicaciones no se trasladan](https://docs.joinmastodon.org/user/moving/), la mudanza tiene
que iniciarse desde el servidor antiguo y hay un periodo de espera de 30 días. En Bitsocial, los
perfiles y las comunidades son pares de claves, así que cambiar de anfitrión o de aplicación no
cambia la identidad. Consulta [Identidad y propiedad de las comunidades](/identity-and-ownership/).

### Dónde vive una comunidad

Una comunidad de Lemmy se parece estructuralmente a una de Bitsocial: las publicaciones van a la
comunidad, que puede revisarlas antes de redifundirlas. La diferencia es dónde vive. Una comunidad
de Lemmy solo puede crearse en la instancia de origen de su creador, el administrador de la
instancia tiene [control total](https://join-lemmy.org/docs/users/05-censorship-resistance.html)
sobre ella y no hay ninguna forma documentada de trasladarla a otra instancia. Una comunidad de
Bitsocial es su propio par de claves: el propietario puede ejecutar su nodo en cualquier sitio, y
ningún administrador de servidor está por encima de ella.

### Control del spam

Los servidores del Fediverse frenan el spam sobre todo en el registro y moderan después. Una
comunidad de Bitsocial ejecuta un desafío en cada publicación antes de aceptarla, y cada comunidad
elige el suyo: captcha, lista de permitidos, pago o cualquier otro código. Consulta
[Desafíos antispam personalizados](/custom-challenges/).

### Operar la infraestructura

Operar una instancia implica un servidor siempre encendido con dominio, TLS y correo electrónico.
Mastodon necesita además PostgreSQL, Redis y procesos en segundo plano; Lemmy es más ligero, con
unos 150 MB de RAM según sus propias cifras. Cada instancia guarda copias del contenido remoto que
siguen sus usuarios. Un nodo de comunidad de Bitsocial no necesita dominio ni certificado y funciona
desde la aplicación de escritorio o `bitsocial-cli`.

### Lo que ofrecen los servidores a cambio

Los servidores del Fediverse conservan el historial completo y lo sirven de forma fiable, y Mastodon
tiene herramientas de moderación maduras desarrolladas durante años. Bitsocial no garantiza el
contenido antiguo para siempre, y sus herramientas de moderación están en cada aplicación.

## Comparación

| Pregunta                      | ActivityPub (Mastodon, Lemmy)                                                                      | Bitsocial                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Categoría                     | Servidores federados                                                                               | Red de comunidades peer-to-peer                                                               |
| Identidad                     | Cuenta en el dominio de un servidor, firmada por el servidor                                       | Pares de claves Ed25519 para usuarios y comunidades                                           |
| Dónde viven las publicaciones | El servidor de origen, más copias en cada servidor con seguidores                                  | El nodo del propietario de la comunidad y los pares que la leen y la siembran                 |
| Quién lo mantiene disponible  | Los administradores de las instancias                                                              | El nodo del propietario de la comunidad más seeders auxiliares                                |
| Comunidades                   | Comunidades de Lemmy alojadas en una instancia                                                     | Objetos de primera clase cuyo nodo acepta o rechaza publicaciones                             |
| Control del spam              | Barreras en el registro, límites de frecuencia, denuncias y moderación                             | El desafío de cada comunidad antes de aceptar una publicación                                 |
| Moderación                    | Administradores de servidores y moderadores de comunidades, local a cada servidor                  | Los propietarios moderan su comunidad; las aplicaciones eligen qué muestran                   |
| Nombres                       | Handles `@user@domain` y `!community@domain`                                                       | Nombres `.bso` y `.eth` que se resuelven en claves                                            |
| Navegador                     | Cliente del servidor del propio usuario                                                            | Nodo peer-to-peer dentro de una pestaña normal del navegador                                  |
| Contrapartida principal       | Historial fiable y moderación madura, pero la identidad y las comunidades pertenecen a un servidor | No hace falta servidor ni dominio, pero el contenido antiguo no está garantizado para siempre |
