---
title: Desafío de vales
description: Desafío antispam que impide la publicación detrás de códigos de cupón únicos distribuidos por propietarios de comunidades.
sidebar_position: 3
---

# Desafío de vales

Voucher Challenge es un mecanismo antispam que bloquea la publicación de contenido detrás de códigos de cupón únicos. En lugar de depender de la detección automática, transfiere la confianza al propietario de la comunidad, quien distribuye códigos manualmente a las personas en las que confía.

**Código fuente:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Cómo funciona

1. El propietario de una comunidad genera uno o más códigos de cupón únicos.
2. El propietario distribuye esos códigos a autores de confianza a través de un canal de su elección (mensaje directo, correo electrónico, en persona, etc.).
3. Cuando un autor intenta publicar, el sistema de desafío le solicita un código de cupón.
4. El código se valida; si es genuino y aún no se ha utilizado, se acepta la publicación.

Cada código de cupón está vinculado a un autor específico una vez canjeado, lo que impide que otros lo reutilicen.

## Cuando usarlo

Voucher Challenge es más adecuado para:

- **Comunidades solo para invitados** donde la membresía está restringida intencionalmente.
- **Espacios seleccionados** donde el propietario examina personalmente a cada participante.
- **Entornos de alta confianza** donde la puntuación automatizada de spam es innecesaria o indeseable.

Debido a que requiere distribución manual de código, no se adapta a grandes comunidades abiertas. Para esos escenarios, considere [Bloqueador de spam](./spam-blocker.md) o [Desafío de llamada de contrato EVM](./evm-contract-call.md) en su lugar.

## Integración

Voucher Challenge se conecta a la misma interfaz de desafío utilizada por otros paquetes antispam en el ecosistema Bitsocial. Los propietarios de la comunidad lo habilitan a través de la configuración de su comunidad y el desafío se presenta a los autores automáticamente cuando intentan publicar.
