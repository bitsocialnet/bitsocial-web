# Verificació

Trieu les comprovacions segons el comportament modificat i la incertesa que quedi. Reutilitzeu les proves satisfactòries obtingudes per al mateix estat final; torneu-les a executar després d'edicions rellevants o d'errors. Els requisits explícits de la CI, de la release o de l'usuari continuen aplicant-se.

| Canvi                                                           | Comprovacions adequades                                                                                                             |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Només prosa/comentaris/format                                   | Diff, referències, generadors rellevants; sense build de l'aplicació                                                                |
| Fonts/configuració del flux de treball d'IA                     | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenereu els índexs per a LLM si ha canviat el context |
| Helper o script aïllat                                          | Invocació/fixtures específics i comprovacions de sintaxi o de tipus/lint del codi afectat                                           |
| Canvi en el runtime compartit, dependències, build o integració | Comprovacions específiques del que s'ha vist afectat més les comprovacions de build/tipus/lint pertinents que s'indiquen a sota     |
| Només CSS/tema/layout                                           | Rutes/viewports/temes afectats als navegadors triats; build si han canviat imports, recursos o el processament de CSS               |
| Estat/efectes/rendiment de React                                | Comportament afectat i pautes de React aplicables; Doctor quan els seus diagnòstics resolguin un dubte concret                      |

## Comprovacions del projecte

- `yarn build:verify` selecciona el workspace afectat. Si l'abast és conegut, feu servir `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` o `yarn docs:build:verify`.
- `yarn build` executa intencionadament el build de producció complet del lloc about i de la documentació, inclosos tots els idiomes de la documentació. Feu-lo servir per validar una release sencera o per a canvis que justifiquin aquest abast.
- `yarn lint`, `yarn typecheck` i `yarn format:check` cobreixen els controls existents del repositori; per a una edició acotada d'un script, feu primer les seves comprovacions específiques de sintaxi, fixtures i format.
- Els canvis al manifest o al lockfile requereixen `corepack yarn install`, `yarn deps:check-pinned` i `yarn deps:check-hardened`. `yarn knip` és orientatiu per a dependències i imports.
- Les comprovacions de traducció de la documentació són a [translations.md](translations.md); no executeu l'escriptor massiu de traduccions per a un canvi acotat de la documentació.

## Proves al navegador i responsabilitat

Feu servir Chrome per a canvis petits i aïllats al navegador. Afegiu-hi Firefox i WebKit per a CSS, layout o disseny adaptable compartits, API sensibles al navegador, interaccions àmplies, releases o criteris explícits entre navegadors. Incloeu-hi els layouts mòbils i el comportament tàctil afectats. Canviar la mida del viewport no equival a emular el tacte. Trieu rutes i continguts reals a partir del codi font en lloc de suposar que els exemples estan disponibles.

Feu servir `playwright-cli` a través de `./scripts/pw-session.sh`. Només hi ha un navegador actiu a tota la màquina; els motors seleccionats s'executen un rere l'altre i cada sessió pròpia es tanca exactament, fins i tot després d'un error. Reutilitzeu una sessió autoritzada que pertanyi a qui us invoca sense tancar-la. No feu servir mai una neteja global de navegadors ni atureu un servidor de propietat poc clara. La feina només de documentació no necessita navegador ni servidor.

En la feina de rendiment, compareu el mateix flux amb un viewport, contingut, configuració de xarxa/CPU, mode de build i sobrecàrrega de mesura equivalents. Distingiu les observacions de les causes sospitades. Feu servir la skill de profiling quan aquestes mesures responguin a la petició real.

## Proves finals

Un sol agent s'encarrega de la verificació pesada. Reviseu les càrregues de treball actives i serialitzeu les instal·lacions, els builds o suites completes, Doctor, la feina amb Android/Electron i el profiling del navegador. Informeu de les ordres i els resultats i de les limitacions concretes; la manca de dades o un motor omès no compten com a resultat satisfactori. Els fixtures d'eines verifiquen formats i mecànica, no el descobriment d'extrem a extrem a l'aplicació ni la qualitat de les decisions del model.

## Comprovacions automàtiques de React

`yarn agent:verify` executa els builds seleccionats seguits de `yarn doctor:check` i `yarn perf:check`. `perf:check` inclou l'autoprova de compatibilitat del col·lector i de regressió deliberada, de manera que ni la CI ni el camí de verificació dels agents necessiten una passada a part de `perf:test`. Instal·leu un sol cop les eines de navegador fixades amb `yarn perf:install` (`--with-deps` a la CI de Linux). Feu servir filtres d'objectiu/escenari per a repeticions específiques després de la passada completa pertinent. Els pressupostos dels escenaris són explícits a `scripts/react-perf/config.mjs`; conserveu les proves i corregiu una regressió abans de plantejar-vos un canvi justificat de la línia de base. Els builds de producció normals ometen Bippy; les ordres separades `build:profile:*` aporten la instrumentació oficial de profiling de React.

L'escenari `apps-search` del lloc about espera, després de cada caràcter, que el valor de l'URL i del camp d'entrada s'apliqui abans d'escriure el següent. El seu resultat satisfactori cobreix aquesta seqüència de consultes aplicades, no la capacitat de resposta quan s'escriu ràpidament. Feu servir una reproducció a part amb entrada ràpida quan avalueu la pèrdua de caràcters o la capacitat de resposta de l'entrada.
