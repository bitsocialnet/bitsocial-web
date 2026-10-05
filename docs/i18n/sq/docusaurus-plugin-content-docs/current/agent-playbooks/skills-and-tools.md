# Aftësitë dhe veglat

Aftësitë e përbashkëta ndodhen te `.agents/skills/`. Redaktoni këto burime, pastaj ekzekutoni `yarn ai-workflow:sync` për të gjeneruar `.claude/skills/` për Claude Code. Codex dhe Cursor e zbulojnë drejtpërdrejt `.agents/skills/`; mos i riktheni rrënjët e dublikuara `.codex/skills/` ose `.cursor/skills/`.

Prompt-et e përbashkëta të roleve ndodhen te `.agents/roles/*.md`. Ky është një format burimi specifik për këtë depo, jo një shteg vendas për zbulimin e agjentëve. `scripts/ai-workflow-files.mjs` i shndërron këto burime në skedarët specifikë për secilin aplikacion më poshtë; `yarn ai-workflow:sync` i shkruan ata. Futini në depo skedarët e gjeneruar bashkë me burimet e tyre, që një checkout i ri ta ketë konfigurimin vendas pa pasur nevojë të ekzekutojë më parë një gjenerues. Pasi të hiqni një burim, hiqni shprehimisht daljet e gjeneruara që janë vjetruar; validuesi i raporton ato në vend që t'i fshijë skedarët në heshtje.

## Shtigjet vendase të zbulimit

Verifikuar kundrejt dokumentacionit zyrtar më 2026-09-12:

| Aplikacioni | Udhëzimet e projektit                                                                               | Aftësitë që përdor kjo depo                  | Agjentët e personalizuar që përdor kjo depo |
| ----------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                         | `.agents/skills/<name>/SKILL.md`             | `.codex/agents/<name>.toml` i gjeneruar     |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` mbetet i disponueshëm për rregulla me kusht specifike për Cursor | `.agents/skills/<name>/SKILL.md`             | `.cursor/agents/<name>.md` i gjeneruar      |
| Claude Code | `CLAUDE.md` importon `@AGENTS.md`                                                                   | `.claude/skills/<name>/SKILL.md` i gjeneruar | `.claude/agents/<name>.md` i gjeneruar      |

Burimet: [Aftësitë e Codex](https://learn.chatgpt.com/docs/build-skills), [Nënagjentët e Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Rregullat e Cursor](https://cursor.com/docs/rules), [Aftësitë e Cursor](https://cursor.com/docs/skills), [Nënagjentët e Cursor](https://cursor.com/docs/subagents), [Memoria e Claude](https://code.claude.com/docs/en/memory), [Aftësitë e Claude](https://code.claude.com/docs/en/skills), [Nënagjentët e Claude](https://code.claude.com/docs/en/sub-agents).

Mos i zëvendësoni direktoritë vendase të agjentëve me `.agents/roles` dhe mos supozoni se Claude e zbulon `.agents/skills`. Claude mund të lexojë gjithsesi një skedar të referuar atje si kontekst të zakonshëm projekti. Për përputhshmëri, Cursor zbulon edhe `.claude/skills`; kopjet mbeten të sinkronizuara, por udhëzuesi i tij i publikuar për aftësitë nuk specifikon si i heq dublikatat mes këtyre rrënjëve. Kontrolloni katalogun e aftësive të aplikacionit të instaluar në vend që të premtoni se nuk mund të shfaqen hyrje të dublikuara.

Direktoritë e AI-së përdorin fundrreshta LF përmes `.gitattributes`, që teksti i gjeneruar të mbetet identik në të gjitha platformat. Asetet ndihmëse të aftësive kopjohen bajt për bajt.

## Aftësitë

| Aftësia                              | Qëllimi                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Krijon commit-e lokale të autorizuara dhe brenda fushës së kërkuar                                                     |
| `commit-format`, `issue-format`      | Formaton sugjerimet kur kërkohen                                                                                       |
| `make-closed-issue`                  | Krijon një issue të autorizuar, një commit brenda fushës dhe një PR                                                    |
| `review-and-merge-pr`                | Klasifikon komentet e PR-së; rregullon/publikon/bashkon vetëm brenda fushës së kërkuar                                 |
| `fix-merge-conflicts`                | Zgjidh konfliktet dhe verifikon rezultatin e bashkuar                                                                  |
| `release`                            | Përgatit tekstin e publikimit dhe kryen hapat e autorizuar të publikimit                                               |
| `code-quality-review`                | Rishikon diff-e jo të parëndësishme ose një shqetësim cilësie të kërkuar shprehimisht                                  |
| `retro`                              | I kthen gabimet e dëshmuara në kontrolle ose udhëzime të fokusuara që parandalojnë përsëritjen e tyre                  |
| `refactor-pass`, `deslop`            | Pastrim i kërkuar i ndryshimeve ekzistuese                                                                             |
| `debug-agent`                        | Debugim i bazuar në prova, me instrumentim kur nevojitet                                                               |
| `you-might-not-need-an-effect`       | Rishikim i fokusuar i efekteve/memo-ve                                                                                 |
| `vercel-react-best-practices`        | Udhëzime të zbatueshme për performancën e React; anashkaloni rregullat vetëm për Next.js/serverin për këtë klient Vite |
| `translate`                          | Gjeneron përkthime, pastaj i zbaton hartat përmes një shkruesi të vetëm                                                |
| `playwright-cli`, `inspect-elements` | Verifikim në shfletues dhe lidhje e DOM-it me kodin burimor                                                            |
| `profile-browsing`                   | Profilizim i shfletuesit dhe i React brenda një fushe të kufizuar                                                      |
| `test-apk`                           | Verifikon një mbështjellës shoqërues Android të dhënë                                                                  |
| `impeccable`, `improve-threejs`      | Dizajn i ndërfaqes brenda fushës së kërkuar dhe rishikim i renderimit me Three.js                                      |
| `implement-plan`                     | Zbaton një plan me delegim opsional dhe të kufizuar                                                                    |
| `readme`                             | Mirëmban dokumentacion të verifikuar të projektit                                                                      |
| `context7`                           | Merr dokumentacion bibliotekash të përshtatshëm për versionin                                                          |
| `find-skills`                        | Gjen aftësi shtesë kur kërkohet shprehimisht                                                                           |

## Rolet dhe modelet

Mbani rolet e personalizuara për `browser-check`, `profiler`, `test-apk`, `translator` dhe `reviewer`. Për zbatimin e zakonshëm dhe zbulimin e kodit, përdorni rolin e integruar worker/general-purpose ose explorer të mjedisit të agjentit. Prindi cakton kriteret e pranimit dhe pronësinë; kontrollet e rënda i ekzekuton një pronar i vetëm.

Skedarët e agjentëve të Codex përfshijnë `name`, `description` dhe `developer_instructions`. `.codex/config.toml` i kufizon nënagjentët e njëkohshëm në katër përmes `max_concurrent_threads_per_session`. Meta të dhënat e përbashkëta të roleve përmbajnë emrin, përshkrimin dhe mënyrën opsionale të sandbox-it; ato qëllimisht nuk kanë fusha modeli.

Në të tria aplikacionet, lërini fushat e modelit dhe të arsyetimit jashtë aftësive dhe agjentëve të personalizuar që futen në depo. Kështu lejohen zgjedhjet në kohën e thirrjes, parazgjedhjet e përdoruesit dhe trashëgimia nga prindi sipas përparësisë së dokumentuar të secilit aplikacion. Aliaset e familjeve të Claude e pakësojnë mirëmbajtjen e versioneve, por gjithsesi zgjedhin një familje; një model Cursor me version kërkon përditësime në të ardhmen. Kur nevojiten, mbajini zgjedhje të tilla në cilësimet e përdoruesit/sesionit. Trashëgimia nuk premton zgjedhjen automatike të modelit më të mirë aktual. Mos shpikni një alias `latest` dhe mos shtoni kërkime në katalogun e modeleve te detyrat rutinë. Shihni [zgjedhjen në Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [zgjedhjen në Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) dhe [zgjedhjen në Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` i përgjigjet sandbox-it të Codex dhe `readonly` të Cursor; lista e veglave të Claude dhe udhëzimet e rolit e kufizojnë rrjedhën e tij të rishikimit, por qasja në Bash nuk është sandbox në nivel sistemi operativ.

Frontmatter-i i aftësive të përbashkëta përdor `disable-model-invocation: true` për rrjedhat e punës që i thërret përdoruesi, kur kjo është e zbatueshme. Cilësimi përkatës i Codex ndodhet te `agents/openai.yaml` si `policy.allow_implicit_invocation: false`; validuesi i kërkon të dyja. Meta të dhënat e thirrjes plotësojnë rregullat e shprehura të autorizimit; një kërkesë për rishikim nuk autorizon kurrë publikimin vetëm sepse një aftësi përmban hapa publikimi.

## Kontrollet dhe zbulimi

- `yarn ai-workflow:sync` rigjeneron daljet e përputhshmërisë duke përdorur `js-yaml` dhe `smol-toml` të instaluara.
- `yarn ai-workflow:check` analizon burimet/frontmatter-in/konfigurimet dhe kontrollon daljet e gjeneruara, meta të dhënat e thirrjes, vendosjen e fushave të modelit dhe lidhjen e hook-ut që vetëm formaton. Ai nuk i zgjidh identifikuesit e modeleve kundrejt katalogut të një ofruesi.
- `yarn ai-workflow:test` ekzekuton fixture të izoluara Node për ngarkesat e hook-eve dhe për gjenerimin/validimin e rrjedhës së punës.
- Pas përditësimit të një aplikacioni agjentësh, verifikoni zbulimin e aftësive/roleve në atë aplikacion. Kontrollet e sintaksës/paritetit nuk e zëvendësojnë një kontroll të ngarkuesit. Ringarkojeni aplikacionin nëse një sesion ekzistues mban ende një katalog të vjetër.
- Hook-et kërkojnë besimin te projekti dhe rishikimin e hook-eve nga mjedisi i agjentit; mos e anashkaloni besimin vetëm që një kontroll të kalojë. Shihni [hooks-setup.md](hooks-setup.md).

## Mirëmbajtja e udhëzimeve të dobishme

Ndiqni [udhëzimet e OpenAI për aftësitë dhe prompt-et](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (rishikuar më 2026-09-12): mbajini përshkrimet të sakta, ngarkoni detajet vetëm kur janë të rëndësishme dhe ruani fushën e kërkuar nga përdoruesi. Aftësitë e përbashkëta u shërbejnë modeleve të ndryshme; ruani invariantet specifike të projektit, duke lënë njëkohësisht vend për zgjedhje rutinë zbatimi.

Mbajini te `SKILL.md` qëllimin e një aftësie, kufijtë e vendimeve dhe kufizimet thelbësore. Komandat ose shembujt e konsiderueshëm që vlejnë për një mënyrë të caktuar lidhini si referenca opsionale. Vendosini kushtet e aktivizimit herët, në përshkrime të shkurtra; një fjalë kyçe që përputhet nuk duhet ta zgjerojë vetvetiu detyrën. Ruani meta të dhënat ekzistuese të thirrjes, përveçse kur sjellja e tyre po ndryshohet qëllimisht.

Pas një ndryshimi të konsiderueshëm në udhëzime, provoni disa kërkesa përfaqësuese, të vogla dhe të mëdha. Kontrolloni cilat aftësi/referenca u zgjodhën, nëse veprimet mbetën brenda fushës, nëse verifikimi i përshtatej ndryshimit dhe nëse puna e autorizuar u përfundua. Testet e skemës dhe të fixture-ve vërtetojnë korrektësinë e veglave, jo cilësinë e vendimeve të agjentit.

## Veglat dhe pronësia e shfletuesit

Preferoni katalogun ekzistues të aftësive/veglave dhe CLI-të e instaluara të projektit. Përdorni `gh` për GitHub, `playwright-cli` për verifikimin në shfletues dhe dokumentacion zyrtar/specifik për versionin kur sjellja e bibliotekës ka rëndësi. Shmangni instalimin e aftësive të dublikuara ose shkarkimin e një pakete pa version të fiksuar vetëm për të ekzekutuar një formatues ekzistues.

Kostoja shtesë e MCP-së varet nga mjedisi i agjentit: ngarkimi i shtyrë i veglave mund të shmangë ngarkimin e çdo skeme që në fillim. Mbajini integrimet të rëndësishme për punën, në vend që ta trajtoni vetë MCP-në si të vjetruar. Zgjedhjet ekzistuese të CLI-ve mbeten të dobishme për riprodhueshmërinë dhe kontrollin e burimeve.

Të gjitha sesionet e shfletuesit përdorin `./scripts/pw-session.sh`, i cili imponon një shfletues të vetëm aktiv në të gjithë makinën. Si parazgjedhje, përdorni një sesion të ri dhe të izoluar. Qasja në shfletuesin personal aktual kërkon autorizim të shprehur; ripërdoreni atë autorizim në hapat pasues. Zgjidhni shfletuesit/pamjet sipas sjelljes së prekur, ekzekutoni motorët e zgjedhur njëri pas tjetrit, mbyllni sesionin e saktë me emër gjatë pastrimit dhe mos përdorni kurrë `close-all`/`kill-all`. Shihni aftësinë `playwright-cli` dhe [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
