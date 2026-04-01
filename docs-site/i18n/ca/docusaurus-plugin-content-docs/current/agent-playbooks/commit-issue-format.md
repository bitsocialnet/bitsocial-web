# Format de compromís i emissió

Utilitzeu-ho quan proposeu o implementeu canvis significatius al codi.

## Format de suggeriment de confirmació

- **Títol:** Estil Convencional Commits, curt, embolicat en backticks.
- Utilitzeu `perf` (no `fix`) per optimitzar el rendiment.
- **Descripció:** Opcional 2-3 frases informals que descriuen la solució. Concís, tècnic, sense punts.

Exemple:

> **Títol de confirmació:** `fix: correct date formatting in timezone conversion`
>
> S'ha actualitzat `formatDate()` a `date-utils.ts` per gestionar correctament els desplaçaments de la zona horària.

## Format de suggeriment de problemes de GitHub

- **Títol:** Tan curt com sigui possible, embolicat amb colla.
- **Descripció:** 2-3 frases informals que descriuen el problema (no la solució), com si encara no s'hagués resolt.

Exemple:

> **Problema de GitHub:**
>
> - **Títol:** `Date formatting displays incorrect timezone`
> - **Descripció:** Les marques de temps dels comentaris mostren zones horàries incorrectes quan els usuaris veuen publicacions de diferents regions. La funció `formatDate()` no té en compte la configuració de la zona horària local de l'usuari.
