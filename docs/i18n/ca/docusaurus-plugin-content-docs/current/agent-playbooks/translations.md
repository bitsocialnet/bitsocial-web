# Traduccions

El lloc about fa servir JSON d'i18next a `about/public/translations/{lang}/default.json`. Les traduccions font de Docusaurus són a part, a `docs/i18n/`.

## Claus del lloc about

Feu servir `.agents/skills/translate/SKILL.md`. Descobriu els idiomes actuals a partir del disc i conserveu els marcadors de posició, el marcatge, els termes tècnics i els noms de marca. En peticions més grans, els agents fills poden generar mapes independents, però un únic agent pare aplica en sèrie totes les escriptures d'idiomes; l'actualitzador no té bloqueig d'escriptura.

Feu servir un camí de mapa únic que pertanyi a la tasca. Previsualitzeu amb `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` i després apliqueu amb els mateixos arguments i `--write`. Verifiqueu la cobertura i els valors després d'escriure i elimineu només els mapes temporals que pertanyin a aquesta tasca.

Feu servir `--delete` per a les eliminacions sol·licitades. Reviseu les troballes de `--audit --dry` abans d'un `--audit --write` autoritzat; les claus de traducció dinàmiques requereixen una revisió manual del codi font. Copieu l'anglès a tots els idiomes només per a un terme tècnic, una marca o un marcador de posició.

## Pàgines de Docusaurus

`scripts/translate-docs.py` és un escriptor massiu per a totes les pàgines i idiomes i no té filtre per fitxer; no el feu servir per a una edició de traducció acotada. `scripts/check-docs-translations.py` és el verificador de només lectura i admet `--locales` i `--paths`.

Mantingueu els blocs de codi, els enllaços, el codi en línia, les adreces de contractes, els encapçalaments, les taules i les advertències alineats amb l'original en anglès. Resoleu els errors del verificador; els avisos `frontmatter-untranslated` per noms de marca poden ser esperables. Seguiu `docs/AGENTS.md` i feu el build des de l'arrel quan canvieu el tema de la documentació o el comportament d'i18n, perquè la sortida estàtica i Pagefind continuïn alineats.

## Revisió semàntica opcional

Per a claus d'i18next seleccionades, feu servir `scripts/jev/translation-README.md`. Per a pàgines de documentació, executeu primer `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Això exigeix una selecció explícita d'idiomes i pàgines, executa el verificador estructural i informa que la revisió semàntica no està verificada fins que s'activi la inferència en directe. Afegiu `--live` només amb l'autorització de proveïdor i el pressupost de la tasca; la configuració privada compartida de la màquina aporta les credencials i un model fixat. Les variables d'entorn i `--model` poden sobreescriure aquesta configuració. L'ordre mai no edita traduccions.

L'adaptador de pàgines conserva el context de la pàgina sencera i limita cada pàgina a 24 KB i cada execució a 30 parells. Per a pàgines més grans, prepareu parells de paràgrafs d'origen i traducció alineats explícitament per a `translations.mjs --pairs`; no aparelleu paràgrafs automàticament per índex. Els resultats semàntics són orientatius: reviseu els problemes i la incertesa que s'assenyalin i mantingueu les comprovacions deterministes de codi, enllaços i adreces.
