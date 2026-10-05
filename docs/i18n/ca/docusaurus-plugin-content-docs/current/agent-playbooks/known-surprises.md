# Sorpreses conegudes

Aquest fitxer fa el seguiment dels punts de confusió específics d'aquest repositori que han provocat errors dels agents.

## Criteris d'entrada

Afegiu una entrada només si es compleix tot això:

- És específic d'aquest repositori (no és un consell genèric).
- És probable que es repeteixi per a futurs agents.
- Té una mitigació concreta que es pot seguir.

Si teniu dubtes, pregunteu-ho al desenvolupador abans d'afegir una entrada.

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

### Els dominis de producció de les aplicacions a Vercel poden tornar a desplegaments de master de Git

- **Data:** 2026-04-28
- **Observat per:** Tommaso + Codex
- **Context:** verificació dels miralls de les aplicacions Seedit i 5chan al directori d'aplicacions de Bitsocial Web.
- **Què va sorprendre:** els projectes `seedit` i `5chan` de Vercel tenien `gitProviderOptions.createDeployments = "enabled"`, de manera que les pujades a `master` de GitHub es promocionaven als dominis de producció encara que la política del repositori espera que els miralls de producció serveixin només artefactes de versió.
- **Impacte:** les insígnies de mirall verificat del directori d'aplicacions poden esdevenir falses perquè els dominis de producció serveixen el darrer commit de desenvolupament en lloc del ZIP de la versió publicada a GitHub, el hash de l'`index.html` de la qual queda registrat a `about/src/lib/apps-data.ts`.
- **Mitigació:** abans d'afegir o actualitzar metadades de verificació de miralls, comproveu el projecte de Vercel amb `vercel api /v9/projects/<project-id>` i confirmeu que `gitProviderOptions.createDeployments = "disabled"`. Desplegueu el contingut del ZIP de la versió amb `vercel deploy --prebuilt --prod` i feu servir `seedit-omega.vercel.app` o `5chan-omega.vercel.app` per als desplegaments de desenvolupament.
- **Estat:** confirmat

### Portless 0.11 reutilitza l'estat de proxy antic tret que el llançador forci HTTPS

- **Data:** 2026-04-28
- **Observat per:** Tommaso + Codex
- **Context:** migració del flux habitual de `yarn start` des de l'antic URL de proxy `http://bitsocial.localhost:1355` cap a `https://bitsocial.localhost`.
- **Què va sorprendre:** fins i tot amb `portless@0.11.1` instal·lat, Portless reutilitzava el proxy HTTP existent `~/.portless/proxy.port = 1355` i imprimia l'URL antic amb `:1355`.
- **Impacte:** actualitzar les versions dels paquets i la documentació no n'hi ha prou; `yarn start` encara pot anunciar i utilitzar l'URL antic quan un col·laborador té estat antic de Portless en execució.
- **Mitigació:** feu que els scripts d'inici arrenquin explícitament el proxy HTTPS de Portless al port `443` abans de registrar les rutes de l'aplicació, perquè el flux d'execució s'allunyi de l'estat `1355` persistit en lloc d'heretar-lo.
- **Estat:** confirmat

### Portless canvia l'URL canònic de l'aplicació local

- **Data:** 2026-03-18
- **Observat per:** Codex
- **Context:** verificació al navegador i fluxos de comprovació ràpida
- **Què va sorprendre:** l'URL local per defecte no és el port habitual de Vite. El repositori espera `https://bitsocial.localhost` a través de Portless, de manera que comprovar `localhost:3000` o `localhost:5173` pot apuntar a l'aplicació equivocada o directament a res.
- **Impacte:** les comprovacions al navegador poden fallar o validar l'objectiu equivocat encara que el servidor de desenvolupament funcioni bé.
- **Mitigació:** proveu `https://bitsocial.localhost` en primer lloc. Ometeu-lo amb `PORTLESS=0 corepack yarn start` només quan necessiteu explícitament un port de Vite directe.
- **Estat:** confirmat

### Els hooks de Commitizen bloquegen els commits no interactius

- **Data:** 2026-03-18
- **Observat per:** Codex
- **Context:** fluxos de treball de commits impulsats per agents
- **Què va sorprendre:** `git commit` activa Commitizen a través de Husky i espera entrada interactiva de TTY, cosa que penja els shells no interactius dels agents.
- **Impacte:** els agents es poden encallar indefinidament durant el que hauria de ser un commit normal.
- **Mitigació:** feu servir `git commit --no-verify -m "message"` per als commits creats per agents. Les persones encara poden fer servir `corepack yarn commit` o `corepack yarn exec cz`.
- **Estat:** confirmat

### Cal Corepack per evitar Yarn classic

- **Data:** 2026-03-19
- **Observat per:** Codex
- **Context:** migració del gestor de paquets a Yarn 4
- **Què va sorprendre:** la màquina encara té una instal·lació global de Yarn classic al `PATH`, de manera que executar `yarn` a seques es pot resoldre a la v1 en lloc de la versió fixada de Yarn 4.
- **Impacte:** els desenvolupadors es poden saltar accidentalment la fixació del gestor de paquets del repositori i obtenir un comportament d'instal·lació o un lockfile diferents.
- **Mitigació:** feu servir `corepack yarn ...` per a les ordres de shell, o executeu abans `corepack enable` perquè `yarn` a seques es resolgui a la versió fixada de Yarn 4.
- **Estat:** confirmat

### Els noms fixos d'aplicació de Portless xoquen entre worktrees de Bitsocial Web

- **Data:** 2026-03-30
- **Observat per:** Codex
- **Context:** execució de `yarn start` en un worktree de Bitsocial Web mentre un altre worktree ja servia a través de Portless
- **Què va sorprendre:** fer servir el nom literal d'aplicació de Portless `bitsocial` a tots els worktrees fa que la ruta mateixa xoqui, encara que els ports subjacents siguin diferents, de manera que el segon procés falla perquè `bitsocial.localhost` ja està registrat.
- **Impacte:** les branques paral·leles de Bitsocial Web es poden bloquejar entre elles tot i que Portless està pensat perquè puguin coexistir sense problemes.
- **Mitigació:** mantingueu l'arrencada de Portless darrere de `scripts/start-dev.mjs`, que ara fa servir una ruta `*.bitsocial.localhost` amb àmbit de branca fora del cas canònic i recorre a una ruta amb àmbit de branca quan el nom `bitsocial.localhost` sense prefix ja està ocupat.
- **Estat:** confirmat

### La previsualització de la documentació codificava el port 3001 de manera fixa

- **Data:** 2026-03-30
- **Observat per:** Codex
- **Context:** execució de `yarn start` juntament amb altres repositoris i agents locals
- **Què va sorprendre:** l'ordre de desenvolupament de l'arrel executava l'espai de treball de la documentació amb `docusaurus start --port 3001`, de manera que tota la sessió de desenvolupament fallava sempre que un altre procés ja ocupava el `3001`, encara que l'aplicació principal ja fes servir Portless.
- **Impacte:** `yarn start` podia matar el procés web just després d'arrencar i interrompia feina local no relacionada per una col·lisió al port de la documentació.
- **Mitigació:** mantingueu l'arrencada de la documentació darrere de `yarn start:docs`, que ara fa servir Portless més `scripts/start-docs.mjs` per respectar un port lliure injectat o recórrer al següent port disponible quan s'executa directament.
- **Estat:** confirmat

### El nom d'amfitrió de Portless per a la documentació estava codificat de manera fixa

- **Data:** 2026-04-03
- **Observat per:** Codex
- **Context:** execució de `yarn start` en un worktree secundari de Bitsocial Web mentre un altre worktree ja servia la documentació a través de Portless
- **Què va sorprendre:** `start:docs` encara registrava el nom d'amfitrió literal `docs.bitsocial.localhost`, de manera que `yarn start` podia fallar tot i que l'aplicació about ja sabia com evitar les col·lisions de rutes de Portless per al seu propi nom d'amfitrió.
- **Impacte:** els worktrees paral·lels no podien fer servir de manera fiable l'ordre de desenvolupament de l'arrel perquè el procés de la documentació sortia primer i llavors `concurrently` matava la resta de la sessió.
- **Mitigació:** mantingueu l'arrencada de la documentació darrere de `scripts/start-docs.mjs`, que ara deriva el mateix nom d'amfitrió de Portless amb àmbit de branca que l'aplicació about i injecta aquest URL públic compartit a l'objectiu del proxy de desenvolupament de `/docs`.
- **Estat:** confirmat

### Els shells dels worktrees poden no agafar la versió de Node fixada al repositori

- **Data:** 2026-04-03
- **Observat per:** Codex
- **Context:** execució de `yarn start` en worktrees de Git com ara `.claude/worktrees/*` o en còpies de worktrees germans
- **Què va sorprendre:** alguns shells de worktree resolien `node` i `yarn node` cap al Node `25.2.1` de Homebrew tot i que el repositori fixa `22.12.0` a `.nvmrc`, de manera que `yarn start` podia executar en silenci els llançadors de desenvolupament amb el runtime equivocat.
- **Impacte:** el comportament del servidor de desenvolupament pot divergir entre la còpia principal i els worktrees, cosa que fa que els errors siguin difícils de reproduir i incompleix la cadena d'eines de Node 22 que el repositori dona per descomptada.
- **Mitigació:** mantingueu els llançadors de desenvolupament darrere de `scripts/start-dev.mjs` i `scripts/start-docs.mjs`, que ara es tornen a executar amb el binari de Node de `.nvmrc` quan el shell actual té la versió equivocada. La configuració del shell hauria de continuar prioritzant `nvm use`.
- **Estat:** confirmat

### Les restes de `docs-site/` poden amagar que falta codi font de documentació després de la refactorització

- **Data:** 2026-04-01
- **Observat per:** Codex
- **Context:** neteja del monorepo posterior a la fusió, després de moure el projecte de Docusaurus de `docs-site/` a `docs/`
- **Què va sorprendre:** la carpeta antiga `docs-site/` pot quedar-se al disc amb fitxers obsolets però importants com ara `i18n/`, fins i tot després que el repositori versionat s'hagi mogut a `docs/`. Això fa que la refactorització sembli duplicada en local i pot amagar que les traduccions de la documentació versionades no s'havien mogut realment a `docs/`.
- **Impacte:** els agents poden suprimir la carpeta antiga com si fos “brossa” i perdre accidentalment l'única còpia local de les traduccions de la documentació, o bé continuar editant scripts que encara apunten al camí mort `docs-site/`.
- **Mitigació:** tracteu `docs/` com l'únic projecte de documentació canònic. Abans de suprimir cap resta local de `docs-site/`, restaureu el codi font versionat com ara `docs/i18n/` i actualitzeu els scripts i els hooks perquè deixin de fer referència a `docs-site`.
- **Estat:** confirmat

### La previsualització multiidioma de la documentació pot disparar la RAM durant la verificació

- **Data:** 2026-04-01
- **Observat per:** Codex
- **Context:** correcció de la i18n de la documentació, l'encaminament per idioma i el comportament de Pagefind amb `yarn start:docs` més Playwright
- **Què va sorprendre:** el mode de previsualització per defecte de la documentació ara fa una compilació completa multiidioma més la indexació de Pagefind abans de servir res, i mantenir aquest procés viu juntament amb diverses sessions de Playwright o de Chrome pot consumir molta més RAM que un bucle de desenvolupament normal de Vite o de Docusaurus amb un sol idioma.
- **Impacte:** la màquina es pot quedar sense memòria, les sessions de navegador poden petar i les execucions interrompudes poden deixar enrere servidors de documentació obsolets o navegadors sense interfície que continuen consumint memòria.
- **Mitigació:** per a feina de documentació que no necessiti verificar rutes per idioma ni Pagefind, prioritzeu `DOCS_START_MODE=live yarn start:docs`. Feu servir la previsualització multiidioma per defecte només quan hàgiu de validar rutes traduïdes o Pagefind. Mantingueu una única sessió de Playwright, tanqueu les sessions de navegador antigues abans d'obrir-ne de noves i atureu el servidor de documentació després de la verificació si ja no el necessiteu.
- **Estat:** confirmat

### `translate-docs.py` pot deixar idiomes de la documentació traduïts a mitges o amb enllaços trencats

- **Data:** 2026-04-06
- **Observat per:** Codex
- **Context:** correcció de les rutes i el contingut localitzats de la documentació després que `yarn start:docs` servís pàgines de detall en anglès o no aconseguís generar la sortida per idioma
- **Què va sorprendre:** el procés de traducció de la documentació tenia dos modes de fallada específics del repositori alhora: `scripts/translate-docs.py` només extreia un subconjunt petit dels missatges de `DocsHome` quan les crides `tr(...)` feien servir formes que no sabia analitzar, i el markdown traduït sota `docs/i18n/**` podia contenir slugs traduïts automàticament o artefactes `ZXQPLACEHOLDER` dins dels destins dels enllaços.
- **Impacte:** les pàgines d'inici localitzades poden recórrer silenciosament a l'anglès, les pàgines de detall localitzades poden semblar sense traduir i un `yarn docs:build` complet pot fallar per enllaços trencats en un idioma encara que la documentació d'origen sigui vàlida.
- **Mitigació:** després de canviar les traduccions de la documentació o de regenerar els fitxers d'idioma, executeu sempre `yarn docs:build` des de l'arrel del repositori, cerqueu `ZXQPLACEHOLDER` al markdown de `docs/i18n/**` i comproveu que els enllaços traduïts continuen apuntant als slugs canònics de la documentació, com ara `/apps/5chan/`, en lloc de camins d'URL traduïts. Si ha canviat el text de `DocsHome`, confirmeu que `scripts/translate-docs.py` encara extreu tots els missatges `docs.home.*`.
- **Estat:** confirmat

### Les comprovacions sense JS del lloc about han de fer servir la ruta de Portless, no una previsualització SSR independent

- **Data:** 2026-04-12
- **Observat per:** Codex
- **Context:** verificació del suport sense JS del lloc `about/` des d'un worktree de branca
- **Què va sorprendre:** una previsualització SSR independent pot semblar correcta mentre la ruta real de Portless amb àmbit de branca encara serveix l'embolcall d'aplicació equivocat o un procés antic. En aquest repositori, el contracte local real és el nom d'amfitrió de Portless que dona `yarn start`, no un servidor de previsualització improvisat.
- **Impacte:** els agents poden afirmar per error que el suport sense JS funciona, o passar per alt regressions que només apareixen a `*.bitsocial.localhost`.
- **Mitigació:** per a la verificació al navegador d'`about/`, engegueu sempre el servidor local real amb `yarn start` o `yarn start:about` i proveu primer l'URL de Portless amb àmbit de branca. Si un nom d'amfitrió de Portless sembla obsolet, inspeccioneu i atureu el procés antic abans de tornar a provar.
- **Estat:** confirmat

### `chain/` era invisible per a `yarn build:verify` i `yarn doctor`

- **Data:** 2026-07-05
- **Observat per:** Codex
- **Context:** verificació d'un diff que només tocava chain/ després que l'espai de treball `chain/` (aplicació de Vite independent per a `chain.bitsocial.net`) s'afegís al monorepo.
- **Què va sorprendre:** `scripts/verify-build.mjs` només reconeixia els prefixos de camí `about/`, `docs/` i `stats/`, de manera que un diff que només tocava chain/ imprimia «No targeted build checks matched the current diff» i no executava cap compilació, encara que `build:chain` ja existia al `package.json` de l'arrel. A banda d'això, `yarn doctor` estava codificat de manera fixa com a `react-doctor about -y`, de manera que els canvis de React sota `chain/src` no rebien cap cobertura de React Doctor.
- **Impacte:** els agents que verificaven canvis de chain havien de saber que calia cridar `yarn build:chain` directament en lloc de confiar en `yarn build:verify`, i els problemes de React a `chain/src` (efectes, hooks, codi mort) passaven desapercebuts per a `yarn doctor`.
- **Mitigació:** `scripts/verify-build.mjs` ara té una branca `chain/` que replica la d'`about/`, i `doctor` / `doctor:verbose` ara executen `react-doctor --project about,chain -y` en una sola invocació. `doctor:score` continua sent només per a `about` perquè `--score` no imprimeix res, i sense avisar, quan es combina amb `--project` per a més d'un projecte; feu servir `yarn react-doctor --project about,chain --verbose -y` (o `--json`) si cal una puntuació de chain.
- **Estat:** confirmat

### El P2P al navegador funciona sobre WebSockets segurs; pkc-js denega WebRTC i WebTransport per defecte

- **Data:** 2026-08-02
- **Observat per:** Claude
- **Context:** redacció de text per a la pàgina d'entrada i per a la documentació sobre com funciona el P2P al navegador de Bitsocial
- **Què va sorprendre:** `@pkcprotocol/pkc-js` inclou un filtre de connexions per defecte que rebutja els intents de connexió per WebRTC i WebTransport al navegador: `dist/browser/helia/dial-transport-filter.js` exporta `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. El comentari del codi font en dona el motiu: al navegador, aquests transports afegeixen camins d'establiment de connexió llargs i que sovint fallen (STUN/ICE, rotació de certhash) que alenteixen les càrregues, mentre que WebSocket és directe i fiable. Tots els peers actius del panell d'estat P2P del blog mostren «Secure WebSocket». El filtre viu a `node_modules`, de manera que res del repositori no en dona cap pista.
- **Impacte:** és molt fàcil escriure text públic tècnicament versemblant però fals; per exemple, atribuir a l'arribada de WebTransport al Baseline dels navegadors el març de 2026 el fet que el P2P al navegador de Bitsocial sigui possible. Aquesta afirmació va arribar a la pàgina d'entrada, a la taula comparativa i a dues pàgines de documentació abans que el desenvolupador se n'adonés. Les afirmacions errònies sobre l'arquitectura en pàgines públiques les revisa exactament el públic desenvolupador al qual s'adreça el lloc.
- **Mitigació:** no deduïu mai quins transports utilitza Bitsocial a partir del que libp2p o la plataforma del navegador admeten en principi. Consulteu `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` per veure la llista de denegació actual, confirmeu que no hi ha cap substitució de `connectionGater` sota `about/src/` i llegiu les etiquetes de transport en directe al panell «P2P status» del blog abans de fer cap afirmació pública. El canvi upstream que realment va desbloquejar la publicació des del navegador va ser la correcció del seqno monotònic de gossipsub a `@libp2p/gossipsub` 15.0.21 (maig de 2026); pkc-js actualment inclou la 16.0.4.
- **Estat:** confirmat

### Els enllaços relatius `./page.md` des d'una pàgina de documentació sense traduir trenquen totes les compilacions localitzades

- **Data:** 2026-08-02
- **Observat per:** Claude
- **Context:** addició d'una pàgina nova només en anglès, `docs/browser-p2p.md`, que enllaçava amb documentació existent mitjançant `./peer-to-peer-protocol.md` i `./apps/5chan.md`
- **Què va sorprendre:** cada idioma sota `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` replica l'arbre de la documentació. Una pàgina nova que no hi sigui es continua renderitzant en tots els idiomes gràcies a la reserva en anglès, però els seus enllaços de markdown relatius ja no es resolen: Docusaurus genera `/ar/browser-p2p/peer-to-peer-protocol.md/` i fa fallar la compilació amb «Docusaurus found broken links!». El punt clau és que `yarn build:verify` i `yarn docs:build:verify` només compilen `en` i passen sense cap problema; només ho revela un `yarn docs:build` complet, que s'atura al primer idioma per ordre alfabètic (`ar`).
- **Impacte:** un canvi a la documentació pot superar totes les comprovacions locals ràpides i, tot i així, trencar la compilació multiidioma de producció. A més, la fallada sembla no tenir cap relació amb el canvi, perquè l'error anomena un camí d'idioma que l'autor no ha tocat mai.
- **Mitigació:** a qualsevol pàgina de documentació que no estigui replicada a `docs/i18n/**`, feu servir enllaços relatius a l'arrel (`/peer-to-peer-protocol/`, `/apps/5chan/`) en lloc d'enllaços relatius `.md`; Docusaurus hi afegeix el prefix de l'idioma automàticament. `docs/build-your-own-client.md` n'és l'exemple existent. Executeu un `yarn docs:build` complet, no només `build:verify`, abans de lliurar cap canvi que afegeixi o enllaci una pàgina de documentació.
- **Estat:** confirmat

### Les execucions concurrents de `update-translations.js` perden claus en silenci

- **Data:** 2026-08-02
- **Observat per:** Claude
- **Context:** aplicació de 26 claus d'i18next traduïdes als 36 idiomes mitjançant la skill `translate`
- **Què va sorprendre:** cada invocació és una lectura-modificació-escriptura sobre els 36 fitxers d'idioma, de manera que dues invocacions simultànies s'esclafen mútuament i una clau desapareix sense cap error. La skill `translate` indica explícitament que es generin fins a 4 subagents concurrents, i cadascun cridaria l'script.
- **Impacte:** falla en silenci: desapareixen claus d'idiomes arbitraris i el diff continua semblant plausible.
- **Mitigació:** no deixeu mai que els subagents traductors escriguin fitxers d'idioma de manera concurrent: feu que només emetin fitxers JSON de diccionari i després apliqueu totes les claus de manera seriada des de l'agent pare. Un cop aplicades, verifiqueu programàticament que cada clau existeix als 35 idiomes que no són l'anglès i que cap valor no és idèntic byte a byte a l'original en anglès.
- **Estat:** confirmat
- **Actualització (2026-08-10):** abans, l'script també resolia el seu objectiu com a `path.join(process.cwd(), "public", "translations")`, de manera que l'ordre documentada des de l'arrel del repositori fallava amb «Translations directory not found» i s'havia d'executar des d'`about/`. Ara resol el workspace a partir del directori actual o de la seva pròpia ubicació, i funciona des de qualsevol lloc. El parany de concurrència descrit més amunt no ha canviat.

### Els controls d'anotació de desenvolupament poden interceptar clics automatitzats

- **Context:** els llocs about i chain tenen controls fixos a la cantonada inferior dreta, on en desenvolupament també apareix la barra d'eines d'Agentation.
- **Mitigació:** `scripts/pw-session.sh open` registra `window.__NO_DEV_TOOLBAR__ = true` abans de recarregar la pàgina. L'inicialitzador d'Agentation també respecta `__VISUAL_TESTING__` i `__PROFILING__`; la inspecció del codi font continua disponible de manera independent. L'automatització directa del navegador ha d'establir el mateix indicador abans de carregar l'aplicació.

### `skills add` instal·la les còpies de Codex i Cursor al directori `.agents/`, ignorat per git

- **Data:** 2026-08-18
- **Observat per:** Tommaso + Claude
- **Context:** instal·lació de la skill `improve-threejs` des de `millionco/react-doctor` amb la CLI `skills` (`vercel-labs/skills`).
- **Què va sorprendre:** `npx skills add <repo> --skill <name> --agent codex` i `--agent cursor` escriuen tots dos a `.agents/skills/<name>/`, no a `.codex/skills/` ni a `.cursor/skills/`. `AGENTS.md` prohibeix un directori `.agents/` a nivell de repositori i `.gitignore:29` l'ignora, de manera que totes dues còpies queden fora del control de versions en silenci. Només `--agent claude-code` escriu a l'esperat `.claude/skills/`. A més, la forma documentada separada per comes (`--agent claude-code,codex,cursor`) falla amb «Invalid agents» i no instal·la res, tot i que cada nom és vàlid per separat.
- **Impacte:** la instal·lació informa d'èxit mentre dues de les tres còpies de les eines acaben en un lloc que no es confirmarà mai, de manera que Codex i Cursor es queden sense la skill després d'un clon nou sense que ningú se n'adoni. La forma amb comes també pot produir una instal·lació buida que sembla un èxit.
- **Mitigació actual:** ara el repositori versiona `.agents/skills` com a font canònica i genera les còpies per a Claude amb `yarn ai-workflow:sync`. S'han eliminat l'antiga prohibició de `.agents` i la regla que l'ignorava. No copieu skills noves a tres arrels independents; després d'afegir una skill, comproveu la paritat del que s'ha generat i el catàleg de l'aplicació.
- **Estat:** confirmat
