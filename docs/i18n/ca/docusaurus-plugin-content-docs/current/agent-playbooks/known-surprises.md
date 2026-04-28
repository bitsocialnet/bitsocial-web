# Sorpreses conegudes

Aquest fitxer fa un seguiment dels punts de confusió específics del repositori que van provocar errors de l'agent.

## Criteris d'entrada

Afegiu una entrada només si totes són certes:

- És específic d'aquest repositori (no consells genèrics).
- És probable que es repeteixi per als futurs agents.
- Té una mitigació concreta que es pot seguir.

Si no esteu segurs, pregunteu al desenvolupador abans d'afegir una entrada.

## Plantilla d'entrada

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Entrades

### Portless canvia l'URL de l'aplicació local canònica

- **Data:** 18-03-2026
- **Observat per:** Codex
- **Context:** verificació del navegador i fluxos de fum
- **El que va ser sorprenent:** L'URL local predeterminat no és el port habitual de Vite. El repo espera que `https://bitsocial.localhost` a través de Portless, de manera que comprovar `localhost:3000` o `localhost:5173` pot afectar l'aplicació equivocada o res de res.
- **Impacte:** Les comprovacions del navegador poden fallar o validar l'objectiu equivocat fins i tot quan el servidor de desenvolupament està en bon estat.
- **Mitigació:** utilitzeu primer `https://bitsocial.localhost`. Ometeu-lo només amb `PORTLESS=0 corepack yarn start` quan necessiteu explícitament un port Vite directe.
- **Estat:** confirmat

### Els ganxos de Commitizen bloquegen les confirmacions no interactives

- **Data:** 18-03-2026
- **Observat per:** Codex
- **Context:** fluxos de treball de confirmació impulsats per agents
- **El que va ser sorprenent:** `git commit` activa Commitizen a través de Husky i espera l'entrada interactiva de TTY, que penja intèrprets d'agents no interactius.
- **Impacte:** els agents poden aturar-se indefinidament durant el que hauria de ser un compromís normal.
- **Mitigació:** utilitzeu `git commit --no-verify -m "message"` per a les confirmacions creades per l'agent. Els humans encara poden utilitzar `corepack yarn commit` o `corepack yarn exec cz`.
- **Estat:** confirmat

### Corepack és necessari per evitar Yarn classic

- **Data:** 19-03-2026
- **Observat per:** Codex
- **Context:** migració del gestor de paquets a Yarn 4
- **El que va ser sorprenent:** La màquina encara té una instal·lació clàssica global de Yarn a `PATH`, de manera que executar `yarn` normal es pot resoldre a v1 en lloc de la versió fixada de Yarn 4.
- **Impacte:** Els desenvolupadors poden evitar accidentalment la fixació del gestor de paquets del repositori i obtenir un comportament d'instal·lació diferent o una sortida del fitxer de bloqueig.
- **Mitigació:** utilitzeu `corepack yarn ...` per a les ordres de l'intèrpret d'ordres o executeu primer `corepack enable`, de manera que `yarn` es resolgui a la versió de Yarn 4 fixada.
- **Estat:** confirmat

### S'ha solucionat que els noms d'aplicacions sense port xoquen entre els arbres de treball de Bitsocial Web

- **Data:** 30-03-2026
- **Observat per:** Codex
- **Context:** S'està iniciant `yarn start` en un arbre de treball de Bitsocial Web mentre un altre arbre de treball ja funcionava a través de Portless
- **El que va ser sorprenent:** L'ús del nom literal de l'aplicació Portless `bitsocial` a cada arbre de treball fa que la ruta xoqui, fins i tot quan els ports de suport són diferents, de manera que el segon procés falla perquè `bitsocial.localhost` ja està registrat.
- **Impacte:** Les branques web paral·leles de Bitsocial es poden bloquejar entre elles tot i que Portless està pensat per permetre-les coexistir de manera segura.
- **Mitigació:** Mantingueu l'inici sense port darrere de `scripts/start-dev.mjs`, que ara utilitza una ruta `*.bitsocial.localhost` amb àmbit de branca fora del cas canònic i torna a una ruta amb àmbit de branca quan el nom `bitsocial.localhost` nu està ocupat.
- **Estat:** confirmat

### La previsualització de documents s'utilitza per codificar el port 3001

- **Data:** 30-03-2026
- **Observat per:** Codex
- **Context:** executant `yarn start` juntament amb altres repositoris i agents locals
- **El que va ser sorprenent:** L'ordre root dev va executar l'espai de treball de documents amb `docusaurus start --port 3001`, de manera que tota la sessió de desenvolupament va fallar sempre que un altre procés ja posseïa `3001`, tot i que l'aplicació principal ja utilitzava Portless.
- **Impacte:** `yarn start` podria matar el procés web immediatament després d'arrencar-se, interrompent el treball local no relacionat amb una col·lisió amb el port de documents.
- **Mitigació:** Mantingueu l'inici de documents darrere de `yarn start:docs`, que ara utilitza Portless plus `scripts/start-docs.mjs` per respectar un port lliure injectat o tornar al següent port disponible quan s'executa directament.
- **Estat:** confirmat

### Documents corregits El nom d'amfitrió sense port estava codificat en dur

- **Data:** 2026-04-03
- **Observat per:** Codex
- **Context:** Execució de `yarn start` en un arbre de treball secundari de Bitsocial Web mentre un altre arbre de treball ja publicava documents mitjançant Portless
- **El que va ser sorprenent:** `start:docs` encara registrava el nom d'amfitrió `docs.bitsocial.localhost` literal, de manera que `yarn start` podria fallar tot i que l'aplicació sobre ja sabia com evitar col·lisions de ruta sense port per al seu propi nom d'amfitrió.
- **Impacte:** Els arbres de treball paral·lels no van poder utilitzar de manera fiable l'ordre de desenvolupament de l'arrel perquè primer es va sortir del procés de documents i després `concurrently` va acabar amb la resta de la sessió.
- **Mitigació:** Mantingueu l'inici de documents darrere de `scripts/start-docs.mjs`, que ara deriva el mateix nom d'amfitrió Portless amb àmbit de branca que l'aplicació sobre i injecta l'URL públic compartit a l'objectiu del proxy de desenvolupament `/docs`.
- **Estat:** confirmat

### Els shells de l'arbre de treball poden perdre la versió del node fixada del repo

- **Data:** 2026-04-03
- **Observat per:** Codex
- **Context:** Execució de `yarn start` en arbres de treball de Git com ara `.claude/worktrees/*` o comprovacions de l'arbre de treball dels germans
- **El que va ser sorprenent:** Algunes intèrprets d'arbre de treball van resoldre `node` i `yarn node` al node Homebrew `25.2.1` tot i que els pins de repo `22.12.0` a `.nvmrc`, de manera que els `.nvmrc`Q s'executaven en silenci, de manera que els `.nvmrc`Q s'executen en silenci. el temps d'execució incorrecte.
- **Impacte:** El comportament del servidor de desenvolupament pot derivar entre la caixa principal i els arbres de treball, fent que els errors siguin difícils de reproduir i violant la cadena d'eines del Node 22 esperada del repo.
- **Mitigació:** Mantingueu els llançadors de desenvolupadors darrere de `scripts/start-dev.mjs` i `scripts/start-docs.mjs`, que ara es tornen a executar sota el binari del node `.nvmrc` quan l'intèrpret d'ordres actual es troba a la versió incorrecta. La configuració del Shell encara hauria de preferir `nvm use`.
- **Estat:** confirmat

### Les restes de `docs-site/` poden amagar la font de documents que falten després del refactor

- **Data:** 01-04-2026
- **Observat per:** Codex
- **Context:** neteja de monorepo posterior a la fusió després de moure el projecte Docusaurus de `docs-site/` a `docs/`
- **El que va ser sorprenent:** L'antiga carpeta `docs-site/` pot romandre al disc amb fitxers obsolets però importants com `i18n/`, fins i tot després que el dipòsit de seguiment es mogués a `docs/`. Això fa que el refactor sembli duplicat localment i pot amagar el fet que les traduccions de documents amb seguiment no s'han mogut realment a `docs/`.
- **Impacte:** els agents poden suprimir la carpeta antiga com a "brossa" i perdre accidentalment l'única còpia local de les traduccions de documents, o continuar editant scripts que encara apunten al camí `docs-site/` mort.
- **Mitigació:** Tracteu `docs/` com l'únic projecte de documents canònics. Abans de suprimir les restes de `docs-site/` locals, restaureu la font de seguiment com `docs/i18n/` i actualitzeu els scripts i els ganxos per deixar de fer referència a `docs-site`.
- **Estat:** confirmat

### La previsualització de documents multilocal pot augmentar la memòria RAM durant la verificació

- **Data:** 01-04-2026
- **Observat per:** Codex
- **Context:** S'estan corregint docs i18n, l'encaminament local i el comportament de Pagefind amb `yarn start:docs` més Playwright
- **El que va ser sorprenent:** El mode de previsualització de documents predeterminat ara fa una compilació completa de documents multilocal i la indexació de Pagefind abans de publicar-lo, i mantenir aquest procés viu juntament amb diverses sessions de Playwright o Chrome pot consumir molta més memòria RAM que un bucle de desenvolupament de Vite o Docusaurus d'un sol local.
- **Impacte:** La màquina pot quedar limitada per la memòria, les sessions del navegador poden fallar i les execucions interrompudes poden deixar servidors de documents obsolets o navegadors sense cap que segueixen consumint memòria.
- **Mitigació:** per a treballs de documents que no necessiten verificació de la ruta local o de Pagefind, preferiu `DOCS_START_MODE=live yarn start:docs`. Utilitzeu només la previsualització multilocal predeterminada quan necessiteu validar rutes traduïdes o Pagefind. Manteniu una única sessió de Playwright, tanqueu les antigues sessions del navegador abans d'obrir-ne de noves i atureu el servidor de documents després de la verificació si ja no el necessiteu.
- **Estat:** confirmat
