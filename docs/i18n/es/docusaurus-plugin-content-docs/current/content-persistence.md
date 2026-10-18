---
title: Dónde viven las publicaciones y cuánto duran
description: Por qué las publicaciones de Bitsocial están firmadas y direccionadas por contenido, pero no todos los nodos las almacenan para siempre; quién las mantiene en línea y cómo los archivadores conservan legible el contenido antiguo.
---

# Dónde viven las publicaciones y cuánto duran

Bitsocial no guarda cada publicación en una blockchain ni en la base de datos de una empresa. El nodo
propio de cada comunidad conserva sus publicaciones, los lectores y seeders ayudan a servirlas, y
quien quiera un registro permanente puede conservarlo. Guardar publicaciones para siempre es
**opcional, no obligatorio**: el protocolo no obliga a cada participante a almacenar el historial de
toda la red.

Esta página explica qué significa esto en la práctica, porque «no se guarda para siempre» se puede
malinterpretar fácilmente como «desaparece» o «confía en mí».

## La autenticidad y la disponibilidad son preguntas distintas

Hay dos preguntas diferentes sobre una publicación:

1. **¿Es real?** ¿La escribió este autor y la aceptó esta comunidad?
2. **¿Sigue en línea?** ¿Puede alguien obtenerla hoy?

Bitsocial responde a la primera con criptografía, no con confianza. Cada publicación está firmada por
el par de claves de su autor y, cuando una comunidad la acepta, se guarda bajo un identificador de
contenido (CID): un hash de sus bytes exactos. Quien obtenga una publicación puede comprobar por sí
mismo la firma y el hash. Un nodo, router, gateway o archivo no puede cambiar el texto ni falsificar
una publicación de otra persona sin que falle la comprobación.

La segunda pregunta trata de quién conserva una copia, y esa es la única parte que no está garantizada.

## Quién mantiene las publicaciones en línea

- **El nodo de la comunidad.** El nodo del propietario acepta las publicaciones y las mantiene en su
  base de datos mientras la comunidad las conserve. Es la copia que siempre existe mientras la
  comunidad funciona. Consulta [Protocolo peer-to-peer](/peer-to-peer-protocol/).
- **Lectores.** Las aplicaciones de escritorio como la aplicación Electron de 5chan siembran las
  comunidades que cargan mientras están abiertas; por eso las comunidades populares las sirven muchos
  pares, como los torrents populares. Una pestaña del navegador puede almacenar y validar contenido
  mientras está abierta, pero no es un host duradero.
- **Seeders.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permite a
  cualquiera aportar capacidad siempre activa desde un VPS o una máquina de sobra. Fija las páginas
  más recientes y actualizaciones de publicaciones de las comunidades, y permite que las comunidades
  alojadas detrás de routers domésticos se carguen en navegadores.
- **Archivadores.** Cualquiera puede rastrear comunidades y conservar todo lo que ve. Los archivos son
  servicios normales construidos sobre la red, no una función especial del protocolo.

## Las comunidades eligen su propia retención

Cuánto tiempo conserva una comunidad sus publicaciones antiguas es decisión de su propietario, no una
regla del protocolo. Algunas quieren años de historial. Otras están diseñadas para olvidar: los
tableros de 5chan funcionan como un imageboard; los hilos salen del tablero, pasan a un archivo y se
eliminan del nodo del tablero tras un plazo fijado (48 horas por defecto). Una comunidad también puede
omitir por completo el archivo.

El mismo protocolo admite ambos casos porque la retención es una política que define cada comunidad,
no un coste que deba pagar cada nodo.

## ¿Por qué no guardar todo para siempre?

Una red que exige que cada nodo conserve cada publicación para siempre tiene que pagarlo de algún modo:

- **Las blockchains** hacen que cada nodo completo almacene todo el historial, de modo que los requisitos
  de los nodos crecen con toda la actividad y publicar suele costar una comisión.
- **El almacenamiento de pago**, como el alquiler de almacenamiento de Farcaster, hace que los usuarios
  paguen por conservar su historial y elimina las publicaciones más antiguas que exceden lo pagado.
  Consulta [Bitsocial y Farcaster](/comparisons/farcaster/).
- **Los servidores centrales** lo guardan todo, pero solo mientras una empresa quiera hacerlo y bajo sus
  reglas.

Las redes sociales no necesitan un libro mayor global. No importa que la publicación A se aceptara un
milisegundo antes que la B, y la mayoría de las publicaciones antiguas apenas se leen. Bitsocial deja
que cada nodo de comunidad aloje solo sus propias comunidades, lo que mantiene el alojamiento lo
bastante barato para un portátil, una Raspberry Pi o un VPS pequeño. Consulta [¿Por qué no una blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## La contrapartida

Si nadie conserva una copia de una publicación, puede dejar de estar disponible. El CID de una
publicación nunca cambia, pero un CID solo es una dirección: el contenido se puede obtener únicamente
mientras al menos un nodo lo sirva. Si el nodo de una comunidad se desconecta definitivamente y ningún
lector, seeder ni archivo conservó sus publicaciones, estas se pierden.

Ese es el coste honesto de no exigir un libro mayor global. También es el coste de las plataformas
principales: las publicaciones antiguas desaparecen cuando desaparecen cuentas, servidores o empresas.
La diferencia es que en Bitsocial conservar algo no requiere permiso de nadie.

## Conservar lo importante

- **Ejecuta tú mismo el nodo de la comunidad.** Un propietario que mantiene el nodo en ejecución
  conserva el historial de la comunidad durante el tiempo que indiquen sus ajustes.
- **Siembra.** Dejar abierta una aplicación de escritorio o ejecutar `bitsocial-seeder` mantiene las
  comunidades disponibles para otros.
- **Archiva.** Los archivos independientes mantienen los hilos antiguos legibles y buscables cuando
  una comunidad los descarta. [5archive.org](https://5archive.org) archiva tableros de 5chan y
  [seeditarchive.org](https://seeditarchive.org) archiva comunidades Seedit. Ambos son de código
  abierto, así que cualquiera puede ejecutar un espejo o un archivo competidor.

Como cada publicación archivada sigue estando firmada, un archivo no puede reescribir sin más lo que
dijo alguien: un lector puede verificar la firma de una publicación archivada igual que la de una en vivo.
