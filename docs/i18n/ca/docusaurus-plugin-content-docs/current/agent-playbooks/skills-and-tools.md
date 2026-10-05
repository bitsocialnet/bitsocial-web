# Skills i eines

Les skills compartides són a `.agents/skills/`. Editeu aquestes fonts i després executeu `yarn ai-workflow:sync` per generar `.claude/skills/` per a Claude Code. Codex i Cursor descobreixen `.agents/skills/` directament; no restaureu les arrels duplicades `.codex/skills/` ni `.cursor/skills/`.

Els prompts de rols compartits són a `.agents/roles/*.md`. És un format d'origen propi d'aquest repositori, no un camí natiu de descobriment d'agents. `scripts/ai-workflow-files.mjs` converteix aquestes fonts en els fitxers específics de cada aplicació que s'indiquen a sota; `yarn ai-workflow:sync` els escriu. Feu commit dels fitxers generats juntament amb les seves fonts perquè un checkout nou tingui la configuració nativa sense haver d'executar abans cap generador. Després d'eliminar una font, elimineu explícitament les seves sortides generades obsoletes; el validador les assenyala en lloc d'esborrar fitxers en silenci.

## Camins natius de descobriment

Verificat amb la documentació oficial el 2026-09-12:

| Aplicació   | Instruccions del projecte                                                                               | Skills que fa servir aquest repositori   | Agents personalitzats que fa servir aquest repositori |
| ----------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                             | `.agents/skills/<name>/SKILL.md`         | `.codex/agents/<name>.toml` generat                   |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` continua disponible per a regles condicionals específiques de Cursor | `.agents/skills/<name>/SKILL.md`         | `.cursor/agents/<name>.md` generat                    |
| Claude Code | `CLAUDE.md` importa `@AGENTS.md`                                                                        | `.claude/skills/<name>/SKILL.md` generat | `.claude/agents/<name>.md` generat                    |

Fonts: [skills de Codex](https://learn.chatgpt.com/docs/build-skills), [subagents de Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [regles de Cursor](https://cursor.com/docs/rules), [skills de Cursor](https://cursor.com/docs/skills), [subagents de Cursor](https://cursor.com/docs/subagents), [memòria de Claude](https://code.claude.com/docs/en/memory), [skills de Claude](https://code.claude.com/docs/en/skills), [subagents de Claude](https://code.claude.com/docs/en/sub-agents).

No substituïu els directoris natius d'agents per `.agents/roles` ni doneu per fet que Claude descobreix `.agents/skills`. Claude pot llegir igualment un fitxer d'allà al qual es faci referència com a context normal del projecte. Cursor també descobreix `.claude/skills` per compatibilitat; les còpies es mantenen sincronitzades, però la seva guia publicada de skills no especifica si deduplica entre aquestes arrels. Reviseu el catàleg de skills de l'aplicació instal·lada en lloc de prometre que no poden aparèixer entrades duplicades.

Els directoris d'IA fan servir finals de línia LF mitjançant `.gitattributes` perquè el text generat sigui idèntic a totes les plataformes. Els recursos de suport de les skills es copien byte a byte.

## Skills

| Skill                                | Propòsit                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `commit`                             | Crear commits locals autoritzats i acotats                                                                         |
| `commit-format`, `issue-format`      | Suggerir formats quan es demani                                                                                    |
| `make-closed-issue`                  | Crear una issue, un commit acotat i un PR autoritzats                                                              |
| `review-and-merge-pr`                | Classificar el feedback d'un PR; corregir/publicar/fusionar només dins de l'abast sol·licitat                      |
| `fix-merge-conflicts`                | Resoldre conflictes i verificar el resultat fusionat                                                               |
| `release`                            | Preparar el text de la release i fer els passos de release autoritzats                                             |
| `code-quality-review`                | Revisar diffs no trivials o una qüestió de qualitat demanada explícitament                                         |
| `retro`                              | Convertir errors demostrats en comprovacions o pautes concretes que n'evitin la repetició                          |
| `refactor-pass`, `deslop`            | Neteja sol·licitada de canvis existents                                                                            |
| `debug-agent`                        | Depuració basada en proves, amb instrumentació quan calgui                                                         |
| `you-might-not-need-an-effect`       | Revisió específica d'efectes/memo                                                                                  |
| `vercel-react-best-practices`        | Pautes de rendiment de React aplicables; ometeu les regles de Next.js o només de servidor per a aquest client Vite |
| `translate`                          | Generar traduccions i després aplicar els mapes mitjançant un únic escriptor                                       |
| `playwright-cli`, `inspect-elements` | Verificació al navegador i correspondència entre el DOM i el codi font                                             |
| `profile-browsing`                   | Profiling acotat del navegador i de React                                                                          |
| `test-apk`                           | Verificar un wrapper Android complementari proporcionat                                                            |
| `impeccable`, `improve-threejs`      | Disseny d'interfícies acotat i revisió del renderitzat amb Three.js                                                |
| `implement-plan`                     | Executar un pla amb delegació opcional i limitada                                                                  |
| `readme`                             | Mantenir documentació del projecte verificada                                                                      |
| `context7`                           | Obtenir documentació de biblioteques adequada a la versió                                                          |
| `find-skills`                        | Cercar skills addicionals quan es demani explícitament                                                             |

## Rols i models

Mantingueu els rols personalitzats per a `browser-check`, `profiler`, `test-apk`, `translator` i `reviewer`. Feu servir el rol integrat de worker/propòsit general o d'explorador de l'entorn per a la implementació habitual i l'exploració del codi. L'agent pare assigna els criteris d'acceptació i la propietat; un únic responsable executa les comprovacions pesades.

Els fitxers d'agents de Codex inclouen `name`, `description` i `developer_instructions`. `.codex/config.toml` limita a quatre els agents fills simultanis mitjançant `max_concurrent_threads_per_session`. Les metadades compartides dels rols contenen el nom, la descripció i un mode de sandbox opcional; deliberadament no tenen camps de model.

No incloeu camps de model ni de raonament a les skills i als agents personalitzats confirmats al repositori en cap de les tres aplicacions. Així es respecten les eleccions en invocar, els valors per defecte de l'usuari i l'herència de l'agent pare segons la precedència documentada de cada aplicació. Els àlies de família de Claude redueixen el manteniment de versions, però continuen triant una família; un model de Cursor amb versió requerirà actualitzacions futures. Deseu aquestes eleccions a la configuració de l'usuari o de la sessió quan calgui. L'herència no garanteix que es triï automàticament el millor model actual. No us inventeu un àlies `latest` ni afegiu recerca al catàleg de models a les tasques rutinàries. Consulteu [selecció a Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [selecció a Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) i [selecció a Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` correspon al sandbox de Codex i a `readonly` de Cursor; a Claude, la llista d'eines i les instruccions del rol restringeixen el seu flux de revisió, però l'accés a Bash no és un sandbox a nivell del sistema operatiu.

El frontmatter compartit de les skills fa servir `disable-model-invocation: true` per als fluxos que invoca l'usuari, quan escau. El paràmetre equivalent de Codex és a `agents/openai.yaml` com a `policy.allow_implicit_invocation: false`; el validador exigeix tots dos. Les metadades d'invocació complementen les regles d'autorització explícita; una petició de revisió mai no autoritza una publicació pel simple fet que una skill inclogui passos de publicació.

## Comprovacions i descobriment

- `yarn ai-workflow:sync` regenera les sortides de compatibilitat fent servir `js-yaml` i `smol-toml` instal·lats.
- `yarn ai-workflow:check` analitza fonts, frontmatter i configuracions, i comprova les sortides generades, les metadades d'invocació, la ubicació dels camps de model i el cablatge del hook que només formata. No resol els identificadors de model contra el catàleg d'un proveïdor.
- `yarn ai-workflow:test` executa fixtures aïllats de Node per a les càrregues útils dels hooks i per a la generació i validació del flux de treball.
- Després d'actualitzar una aplicació d'agents, verifiqueu en aquesta aplicació que descobreix les skills i els rols. Les comprovacions de sintaxi i de paritat no substitueixen una comprovació del carregador. Recarregueu l'aplicació si una sessió existent conserva un catàleg antic.
- Els hooks requereixen la confiança en el projecte i la revisió de hooks de l'entorn; no eludiu la confiança perquè una comprovació passi. Consulteu [hooks-setup.md](hooks-setup.md).

## Mantenir instruccions útils

Seguiu la [guia d'OpenAI sobre skills i prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (revisada el 2026-09-12): mantingueu descripcions precises, carregueu els detalls només quan siguin rellevants i respecteu l'abast que ha demanat l'usuari. Les skills compartides serveixen models diferents; conserveu les invariants pròpies del projecte i deixeu marge per a les decisions rutinàries d'implementació.

Mantingueu a `SKILL.md` el propòsit d'una skill, els seus límits de decisió i les seves restriccions essencials. Enllaceu les ordres o els exemples extensos específics d'un mode com a referències opcionals. Poseu les condicions d'activació al principi de descripcions breus; una paraula clau coincident no hauria d'ampliar la tasca per si sola. Conserveu les metadades d'invocació existents tret que se'n canviï el comportament de manera intencionada.

Després d'un canvi important a les instruccions, proveu unes quantes peticions representatives, petites i grans. Comproveu quines skills i referències s'han seleccionat, si les accions s'han mantingut dins de l'abast, si la verificació s'ha ajustat al canvi i si la feina autoritzada s'ha completat. Les proves d'esquemes i de fixtures demostren que les eines funcionen correctament, no la qualitat de les decisions de l'agent.

## Eines i propietat del navegador

Preferiu el catàleg existent de skills i eines i les CLI instal·lades al projecte. Feu servir `gh` per a GitHub, `playwright-cli` per a la verificació al navegador i documentació oficial o específica de la versió quan importi el comportament d'una biblioteca. Eviteu instal·lar skills duplicades o baixar un paquet sense versió fixada només per executar un formatador que ja existeix.

La sobrecàrrega de MCP depèn de l'entorn: la càrrega diferida d'eines pot evitar carregar tots els esquemes per endavant. Mantingueu només integracions rellevants en lloc de considerar obsolet MCP en si mateix. Les CLI que ja es fan servir continuen sent útils per a la reproductibilitat i el control de recursos.

Totes les sessions del navegador fan servir `./scripts/pw-session.sh`, que imposa un únic navegador actiu a tota la màquina. Per defecte, feu servir una sessió nova i aïllada. L'accés al navegador personal actual requereix autorització explícita; reutilitzeu aquesta autorització en els passos següents. Trieu navegadors i viewports segons el comportament afectat, executeu els motors seleccionats un rere l'altre, tanqueu exactament la sessió amb nom durant la neteja i no feu servir mai `close-all`/`kill-all`. Consulteu la skill `playwright-cli` i [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
