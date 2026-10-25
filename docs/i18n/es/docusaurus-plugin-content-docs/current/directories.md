---
title: Directorios
description: Cómo las aplicaciones de Bitsocial permiten que las comunidades compitan por un nombre temático en lugar de reservarlo para quien lo reclamó primero.
---

# Directorios

En Reddit, un nombre como `r/opensource` solo puede pertenecer a una comunidad, y quien la controla se lo queda. Si sus moderadores toman decisiones que no gustan a los usuarios, la única alternativa es crear `r/opensource2`. La nueva comunidad empieza con cero suscriptores, aunque a la mayoría de quienes se suscribieron a `r/opensource` les importaba el código abierto, no ese equipo de moderación en particular.

Las aplicaciones de Bitsocial evitan esto con los **directorios**. Un directorio es un nombre temático, como `opensource`, por el que compiten las comunidades. La ruta corta de ese nombre abre la comunidad que ocupe el primer puesto en cada momento, de modo que una comunidad mejor puede quedarse con el nombre sin pedir permiso a nadie.

## Cómo funciona

1. **Un código de directorio es un nombre temático.** Seedit usa rutas como `/s/funny`. 5chan usa rutas propias de los imageboards, como `/g/`.
2. **Las comunidades compiten como candidatas.** Cada directorio tiene una lista de comunidades candidatas, cada una con su propia dirección exacta, como `funny-posting.bso`.
3. **La candidata mejor clasificada se queda con la ruta.** Al abrir `/s/funny` se muestra la ganadora actual.
4. **Perder no borra nada.** Una comunidad que no es la ganadora conserva su dirección, sus publicaciones y sus suscriptores, y cualquiera puede seguir abriéndola directamente.

## El nombre es la puerta de entrada, no una identidad

Un código de directorio es solo una ruta de descubrimiento. Todo lo que perdura apunta a una comunidad exacta:

- Suscribirse desde `/s/funny` suscribe a la dirección exacta de la ganadora actual. El código de directorio en sí nunca se guarda como suscripción.
- Los enlaces a publicaciones siempre usan la dirección exacta de la comunidad, así que un enlace antiguo no puede empezar a apuntar a otra comunidad cuando cambia la ganadora.
- Cuando cambia la ganadora, Seedit no toca las suscripciones existentes y pregunta a cada suscriptor si quiere pasarse a la nueva ganadora, conservar ambas o quedarse con la comunidad actual. El cambio automático es una opción que se activa por directorio, y cada cambio automático muestra un aviso con la opción de deshacerlo.

Por tanto, una comunidad rival no se lleva las suscripciones de nadie. Gana el nombre: los nuevos visitantes llegan a ella y los suscriptores existentes pueden elegir con un solo clic. Quienes preferían la comunidad anterior la conservan.

## Por qué no nombres por orden de llegada

- **Sin acaparamiento.** Tener un buen nombre no basta. Una comunidad tiene que seguir siendo la mejor candidata para él.
- **Ningún administrador asigna nombres.** Que un administrador repartiera los nombres recrearía el veto central que Bitsocial se diseñó para eliminar.
- **Los competidores conservan un camino hacia el público.** Una comunidad rival apunta al mismo nombre en lugar de empezar de cero con uno peor.
- **Los clientes coinciden en la ganadora.** Seedit clasifica a las candidatas de forma determinista, así que todos los clientes que leen la misma instantánea finalizada del directorio muestran la misma ganadora. Seedit no pone a otra candidata en su lugar porque la ganadora sea temporalmente inaccesible desde la conexión de un usuario.

## Cómo se eligen hoy las ganadoras

Las candidatas se publican como archivos JSON en el repositorio [bitsocialnet/lists](https://github.com/bitsocialnet/lists), un archivo por directorio, y una comunidad se une a un directorio mediante un pull request a su archivo. Es un paso provisional para arrancar. El objetivo es que la votación sustituya a los pull requests como forma de decidir las ganadoras.

- **Seedit** ordena las candidatas de un directorio por puntuación, después por el momento en que se añadieron y después por dirección. Cada archivo de directorio lleva un número de revisión, y cualquier cambio en sus candidatas o en su ganadora publica una nueva revisión.
- **5chan** celebra una votación por directorio con [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Los clientes intercambian papeletas firmadas a través de libp2p gossipsub y calculan el recuento por sí mismos, sin ningún servidor que cuente los votos. Para votar hace falta tener un 5chan Pass, un token intransferible, y cada titular tiene un voto. Votar por un tablón que todavía no está en la lista lo nomina. Por ahora las votaciones se realizan en la red de pruebas Base Sepolia y, hasta que salgan de ella, los recuentos se muestran pero no reordenan la lista.

## ¿Protocolo o aplicación?

Los directorios no forman parte de PKC, la capa peer-to-peer que almacena y transporta las comunidades. Son una convención que los clientes aplican por encima de ella, junto con las listas predeterminadas y la búsqueda; consulta [Descubrimiento de contenido](./content-discovery.md). Un cliente puede leer los mismos archivos de directorio, publicar los suyos propios u omitir los directorios por completo, y los usuarios siempre pueden abrir cualquier comunidad por su dirección.
