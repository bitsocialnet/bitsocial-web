# Sorpreses conegudes

Aquest fitxer fa un seguiment dels punts de confusió específics del repositori que van provocar errors de l'agent.

## Criteris d'entrada

Afegiu una entrada només si totes són certes:

- És específic d'aquest repositori (no consell genèric).
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
- **El que va ser sorprenent:** L'URL local predeterminat no és el port habitual de Vite. El repo espera que `http://bitsocial.localhost:1355` a través de Portless, de manera que comprovar `localhost:3000` o `localhost:5173` pot afectar l'aplicació equivocada o res de res.
- **Impacte:** Les comprovacions del navegador poden fallar o validar l'objectiu equivocat fins i tot quan el servidor de desenvolupament està en bon estat.
- **Mitigació:** utilitzeu primer `http://bitsocial.localhost:1355`. Ometeu-lo només amb `PORTLESS=0 corepack yarn start` quan necessiteu explícitament un port Vite directe.
- **Estat:** confirmat

### Els ganxos de Commitizen bloquegen les confirmacions no interactives

- **Data:** 18-03-2026
- **Observat per:** Codex
- **Context:** fluxos de treball de confirmació impulsats per agents
- **El que va ser sorprenent:** `git commit` activa Commitizen mitjançant Husky i espera l'entrada interactiva de TTY, que penja les intèrprets d'agents no interactius.
- **Impacte:** els agents poden aturar-se indefinidament durant el que hauria de ser un compromís normal.
- **Mitigació:** utilitzeu `git commit --no-verify -m "message"` per a les confirmacions creades per l'agent. Els humans encara poden utilitzar `corepack yarn commit` o `corepack yarn exec cz`.
- **Estat:** confirmat

### Corepack és necessari per evitar Yarn classic

- **Data:** 19-03-2026
- **Observat per:** Codex
- **Context:** migració del gestor de paquets a Yarn 4
- **El que va ser sorprenent:** La màquina encara té una instal·lació clàssica global de Yarn a `PATH`, de manera que executar `yarn` normal es pot resoldre a v1 en lloc de la versió fixada de Yarn 4.
- **Impacte:** Els desenvolupadors poden evitar accidentalment la fixació del gestor de paquets del repo i obtenir un comportament d'instal·lació diferent o una sortida del fitxer de bloqueig.
- **Mitigació:** Utilitzeu `corepack yarn ...` per a les ordres de l'intèrpret d'ordres o executeu primer `corepack enable`, de manera que `yarn` es resolgui a la versió de Yarn 4 fixada.
- **Estat:** confirmat

### S'ha solucionat que els noms d'aplicacions sense port xoquen entre els arbres de treball de Bitsocial Web

- **Data:** 30-03-2026
- **Observat per:** Codex
- **Context:** S'està iniciant `yarn start` en un arbre de treball de Bitsocial Web mentre un altre arbre de treball ja funcionava a través de Portless
- **El que va ser sorprenent:** L'ús del nom literal de l'aplicació Portless `bitsocial` a cada arbre de treball fa que la ruta xoqui, fins i tot quan els ports de suport són diferents, de manera que el segon procés falla perquè `bitsocial.localhost` ja està registrat.
- **Impacte:** Les branques web paral·leles de Bitsocial es poden bloquejar entre elles tot i que Portless està pensat per permetre-les coexistir de manera segura.
- **Mitigació:** Mantingueu l'inici Portless darrere de `scripts/start-dev.mjs`, que ara utilitza una ruta `*.bitsocial.localhost:1355` amb àmbit de branca fora del cas canònic i torna a una ruta amb àmbit de branca quan el nom `bitsocial.localhost` nu està ocupat.
- **Estat:** confirmat

### La previsualització de documents s'utilitza per codificar el port 3001

- **Data:** 30-03-2026
- **Observat per:** Codex
- **Context:** executant `yarn start` juntament amb altres repositoris i agents locals
- **El que va ser sorprenent:** L'ordre root dev va executar l'espai de treball de documents amb `docusaurus start --port 3001`, de manera que tota la sessió de desenvolupament va fallar sempre que un altre procés ja posseïa `3001`, tot i que l'aplicació principal ja utilitzava Portless.
- **Impacte:** `yarn start` podria matar el procés web immediatament després d'arrencar-se, interrompent el treball local no relacionat amb una col·lisió amb el port de documents.
- **Mitigació:** Mantingueu l'inici de documents darrere de `yarn start:docs`, que ara utilitza Portless plus `scripts/start-docs.mjs` per respectar un port lliure injectat o tornar al següent port disponible quan s'executa directament.
- **Estat:** confirmat
