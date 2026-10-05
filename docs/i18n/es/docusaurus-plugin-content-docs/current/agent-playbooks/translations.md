# Traducciones

El sitio about usa JSON de i18next en `about/public/translations/{lang}/default.json`. Las traducciones fuente de Docusaurus están aparte, en `docs/i18n/`.

## Claves del sitio about

Use `.agents/skills/translate/SKILL.md`. Descubra los idiomas actuales a partir del disco y conserve los marcadores de posición, el marcado, los términos técnicos y los nombres de marca. En peticiones grandes, los agentes hijos pueden generar mapas independientes, pero un único agente padre aplica en serie todas las escrituras de idiomas; el actualizador no tiene bloqueo de escritura.

Use una ruta de mapa única que pertenezca a la tarea. Previsualice con `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` y aplique después con los mismos argumentos y `--write`. Verifique la cobertura y los valores después de escribir y elimine solo los mapas temporales que pertenezcan a esta tarea.

Use `--delete` para las eliminaciones solicitadas. Revise los hallazgos de `--audit --dry` antes de un `--audit --write` autorizado; las claves de traducción dinámicas requieren una revisión manual del código fuente. Copie el inglés en todos los idiomas solo para un término técnico, una marca o un marcador de posición.

## Páginas de Docusaurus

`scripts/translate-docs.py` es un escritor masivo para todas las páginas e idiomas y no tiene filtro por archivo; no lo use para una edición de traducción acotada. `scripts/check-docs-translations.py` es el verificador de solo lectura y admite `--locales` y `--paths`.

Mantenga los bloques de código, enlaces, código en línea, direcciones de contratos, encabezados, tablas y advertencias alineados con el original en inglés. Resuelva los errores del verificador; los avisos `frontmatter-untranslated` por nombres de marca pueden ser esperables. Siga `docs/AGENTS.md` y haga el build desde la raíz cuando cambie el tema de la documentación o el comportamiento de i18n, para que la salida estática y Pagefind sigan alineados.

## Revisión semántica opcional

Para claves de i18next seleccionadas, use `scripts/jev/translation-README.md`. Para páginas de documentación, ejecute primero `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Esto exige una selección explícita de idiomas y páginas, ejecuta el verificador estructural e informa de que la revisión semántica no está verificada hasta que se active la inferencia en vivo. Añada `--live` solo con la autorización de proveedor y el presupuesto de la tarea; la configuración privada compartida de la máquina aporta las credenciales y un modelo fijado. Las variables de entorno y `--model` pueden sobrescribir esa configuración. El comando nunca edita traducciones.

El adaptador de páginas conserva el contexto de la página completa y limita cada página a 24 KB y cada ejecución a 30 pares. Para páginas más grandes, prepare pares de párrafos de origen y traducción alineados explícitamente para `translations.mjs --pairs`; no empareje párrafos automáticamente por índice. Los resultados semánticos son orientativos: revise los problemas y la incertidumbre que se señalen y mantenga las comprobaciones deterministas de código, enlaces y direcciones.
