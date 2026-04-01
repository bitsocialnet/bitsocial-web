# Formato de confirmación y emisión

Úselo cuando proponga o implemente cambios de código significativos.

## Formato de sugerencia de confirmación

- **Título:** Estilo de compromisos convencionales, breve, entre comillas invertidas.
- Utilice `perf` (no `fix`) para optimizar el rendimiento.
- **Descripción:** 2 o 3 oraciones informales opcionales que describen la solución. Conciso, técnico, sin viñetas.

Ejemplo:

> **Título de confirmación:** `fix: correct date formatting in timezone conversion`
>
> Se actualizó `formatDate()` en `date-utils.ts` para manejar adecuadamente las compensaciones de zona horaria.

## Formato de sugerencia de problemas de GitHub

- **Título:** Lo más breve posible, entre comillas invertidas.
- **Descripción:** 2-3 oraciones informales que describen el problema (no la solución), como si aún no estuviera resuelto.

Ejemplo:

> **Problema de GitHub:**
>
> - **Título:** `Date formatting displays incorrect timezone`
> - **Descripción:** Las marcas de tiempo de los comentarios muestran zonas horarias incorrectas cuando los usuarios ven publicaciones de diferentes regiones. La función `formatDate()` no tiene en cuenta la configuración de zona horaria local del usuario.
