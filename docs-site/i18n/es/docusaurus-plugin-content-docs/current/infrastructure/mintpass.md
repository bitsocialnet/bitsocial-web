---
title: paso de menta
description: Sistema de autenticación basado en NFT que ayuda a las comunidades Bitsocial a verificar usuarios y reducir los ataques sybil.
sidebar_position: 2
---

# paso de menta

Mintpass es un sistema de autenticación basado en NFT para comunidades Bitsocial. Los usuarios crean un NFT de verificación intransferible después de completar un desafío (como SMS OTP), y las comunidades pueden verificar la propiedad del NFT para protegerse contra ataques sybil como votos falsos, evasión de prohibiciones y spam.

- **GitHub**: [bitsocialnet/mintpass](https://github.com/bitsocialnet/mintpass)
- **Licencia**: MIT

## Cómo funciona

El flujo de verificación tiene cuatro pasos:

1. **Solicitud**: el usuario visita `mintpass.org/request` para comenzar el proceso.
2. **Desafío**: el usuario completa una verificación de contraseña de un solo uso por SMS.
3. **Mint**: tras la verificación exitosa, se acuña un NFT intransferible en la billetera del usuario.
4. **Verificar**: las comunidades consultan la propiedad de NFT para confirmar que el usuario ha sido verificado.

Debido a que el NFT no es transferible, permanece vinculado a la billetera que completó la verificación, lo que impide que los usuarios intercambien o vendan su estado verificado.

## Estructura del proyecto

El repositorio está organizado en tres áreas principales:

| Directorio   | Propósito                                                   |
| ------------ | ----------------------------------------------------------- |
| `contracts/` | Contratos inteligentes de solidez para la verificación NFT. |
| `challenge/` | Capa de integración para el sistema de desafío Bitsocial.   |
| `web/`       | Next.js y React frontend para el flujo de acuñación.        |

## Privacidad y manejo de datos

Mintpass adopta un enfoque de datos mínimos:

- **Los datos operativos** (códigos OTP, tokens de sesión) se almacenan en Redis con TTL cortos y vencen automáticamente.
- **La asociación Mint** (el vínculo entre una identidad verificada y una billetera) es el único registro persistente.

No se conservan números de teléfono ni datos personales una vez que se cierra la ventana de verificación.

## Capas de seguridad opcionales

Los operadores comunitarios pueden habilitar protecciones adicionales según su modelo de amenaza:

- **Comprobaciones de reputación de IP**: califique las solicitudes entrantes comparándolas con bases de datos de abusos conocidos.
- **Evaluación de riesgos telefónicos**: marque números desechables o VoIP antes de realizar una impugnación.
- **Bloqueo geográfico**: restringe la verificación a regiones específicas.
- **Enfriamientos por IP**: limita la velocidad de los intentos de verificación repetidos desde la misma dirección.

## Pila de tecnología

| Capa      | Tecnología                                |
| --------- | ----------------------------------------- |
| Contratos | Solidez, desplegada con Hardhat y Foundry |
| Interfaz  | Siguiente.js + Reaccionar                 |
| Red       | Base (Etereum L2)                         |

La implementación en Base mantiene bajos los costos del gas y al mismo tiempo hereda las garantías de seguridad de Ethereum.

## Hoja de ruta

Las mejoras planificadas incluyen:

- **Opción de pago para acuñar**: permite que las comunidades exijan una pequeña tarifa por acuñar, lo que agrega una barrera económica para la sibila.
- **Señales de verificación adicionales**: vaya más allá de los SMS a otras señales de identidad.
- **Herramientas de administración ampliadas**: paneles y controles más completos para operadores comunitarios.
