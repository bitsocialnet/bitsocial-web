# Skills og værktøjer

Delte skills ligger i `.agents/skills/`. Redigér disse kilder, og kør derefter `yarn ai-workflow:sync` for at generere `.claude/skills/` til Claude Code. Codex og Cursor finder `.agents/skills/` direkte; genskab ikke de duplikerede rodmapper `.codex/skills/` eller `.cursor/skills/`.

Delte rolleprompts ligger i `.agents/roles/*.md`. Det er et repo-specifikt kildeformat, ikke en native sti til opdagelse af agenter. `scripts/ai-workflow-files.mjs` konverterer disse kilder til de app-specifikke filer nedenfor; `yarn ai-workflow:sync` skriver dem. Commit de genererede filer sammen med deres kilder, så et frisk checkout har den native konfiguration uden først at skulle køre en generator. Når du fjerner en kilde, skal du selv fjerne dens forældede genererede output; validatoren rapporterer dem i stedet for at slette filer i stilhed.

## Native opdagelsesstier

Verificeret mod den officielle dokumentation den 2026-09-12:

| App         | Projektinstruktioner                                                                             | Skills, som dette repo bruger              | Brugerdefinerede agenter, som dette repo bruger |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ | ----------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                      | `.agents/skills/<name>/SKILL.md`           | Genereret `.codex/agents/<name>.toml`           |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` er fortsat tilgængelig til Cursor-specifikke betingede regler | `.agents/skills/<name>/SKILL.md`           | Genereret `.cursor/agents/<name>.md`            |
| Claude Code | `CLAUDE.md` importerer `@AGENTS.md`                                                              | Genereret `.claude/skills/<name>/SKILL.md` | Genereret `.claude/agents/<name>.md`            |

Kilder: [Codex-skills](https://learn.chatgpt.com/docs/build-skills), [Codex-subagenter](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-regler](https://cursor.com/docs/rules), [Cursor-skills](https://cursor.com/docs/skills), [Cursor-subagenter](https://cursor.com/docs/subagents), [Claude-hukommelse](https://code.claude.com/docs/en/memory), [Claude-skills](https://code.claude.com/docs/en/skills), [Claude-subagenter](https://code.claude.com/docs/en/sub-agents).

Erstat ikke de native agentmapper med `.agents/roles`, og antag ikke, at Claude finder `.agents/skills`. Claude kan stadig læse en refereret fil dér som almindelig projektkontekst. Cursor finder af kompatibilitetshensyn også `.claude/skills`; kopierne holdes synkroniseret, men Cursors offentliggjorte vejledning om skills angiver ikke, om der deduplikeres på tværs af disse rodmapper. Tjek skill-kataloget i den installerede app i stedet for at love, at dublerede poster ikke kan forekomme.

AI-mapperne bruger LF-linjeskift via `.gitattributes`, så genereret tekst forbliver identisk på tværs af platforme. Understøttende skill-assets kopieres som rå bytes.

## Skills

| Skill                                | Formål                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Opret autoriserede, afgrænsede lokale commits                                                                    |
| `commit-format`, `issue-format`      | Formatforslag, når der bliver bedt om dem                                                                        |
| `make-closed-issue`                  | Opret et autoriseret issue, en afgrænset commit og en PR                                                         |
| `review-and-merge-pr`                | Triagér PR-feedback; ret/publicér/merge kun inden for det ønskede omfang                                         |
| `fix-merge-conflicts`                | Løs konflikter, og verificér det flettede resultat                                                               |
| `release`                            | Forbered release-tekster, og udfør autoriserede release-trin                                                     |
| `code-quality-review`                | Gennemgå ikke-trivielle diffs eller en eksplicit efterspurgt kvalitetsbekymring                                  |
| `retro`                              | Omsæt påviste fejl til fokuserede kontroller eller retningslinjer, der forhindrer gentagelser                    |
| `refactor-pass`, `deslop`            | Efterspurgt oprydning i eksisterende ændringer                                                                   |
| `debug-agent`                        | Evidensbaseret fejlfinding, med instrumentering når det er nødvendigt                                            |
| `you-might-not-need-an-effect`       | Fokuseret gennemgang af effects/memo                                                                             |
| `vercel-react-best-practices`        | Relevant vejledning om React-ydeevne; spring regler, der kun gælder Next.js/serveren, over for denne Vite-klient |
| `translate`                          | Generér oversættelser, og anvend derefter oversættelseskortene gennem én enkelt skriver                          |
| `playwright-cli`, `inspect-elements` | Browserverifikation og kobling fra DOM til kildekode                                                             |
| `profile-browsing`                   | Afgrænset browser- og React-profilering                                                                          |
| `test-apk`                           | Verificér en leveret Android-wrapper til ledsagerappen                                                           |
| `impeccable`, `improve-threejs`      | Afgrænset interfacedesign og gennemgang af Three.js-rendering                                                    |
| `implement-plan`                     | Udfør en plan med valgfri, afgrænset uddelegering                                                                |
| `readme`                             | Vedligehold verificeret projektdokumentation                                                                     |
| `context7`                           | Hent biblioteksdokumentation, der passer til den anvendte version                                                |
| `find-skills`                        | Find yderligere skills, når det eksplicit efterspørges                                                           |

## Roller og modeller

Behold brugerdefinerede roller til `browser-check`, `profiler`, `test-apk`, `translator` og `reviewer`. Brug agentmiljøets indbyggede worker-/general-purpose- eller explorer-rolle til almindelig implementering og kodeopdagelse. Forældreagenten fastlægger acceptkriterier og ejerskab; én ejer kører de tunge kontroller.

Codex-agentfiler indeholder `name`, `description` og `developer_instructions`. `.codex/config.toml` begrænser antallet af samtidige underagenter til fire med `max_concurrent_threads_per_session`. Delte rollemetadata indeholder navn, beskrivelse og en valgfri sandbox-tilstand; de har bevidst ingen modelfelter.

Udelad model- og ræsonneringsfelter i committede skills og brugerdefinerede agenter i alle tre apps. Så kan valg ved selve kaldet, brugerens standardindstillinger og arv fra forælderen gælde i henhold til hver apps dokumenterede præcedens. Claudes familiealiasser mindsker vedligeholdelsen af versioner, men vælger stadig en familie; en versioneret Cursor-model kræver opdateringer fremover. Gem sådanne valg i bruger-/sessionsindstillinger, når det er nødvendigt. Arv lover ikke, at den bedste aktuelle model automatisk bliver valgt. Opfind ikke et `latest`-alias, og læg ikke research i modelkataloger ind i rutineopgaver. Se [modelvalg i Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [modelvalg i Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) og [modelvalg i Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` svarer til Codex' sandbox og Cursors `readonly`; Claudes værktøjsliste og rolleinstruktionerne begrænser dens review-arbejdsgang, men Bash-adgang er ikke en sandbox på OS-niveau.

Frontmatter i delte skills bruger `disable-model-invocation: true` til arbejdsgange, som brugeren selv kalder, hvor det er relevant. Codex' tilsvarende indstilling ligger i `agents/openai.yaml` som `policy.allow_implicit_invocation: false`; validatoren kræver begge. Kaldsmetadata supplerer de eksplicitte autorisationsregler; en anmodning om review autoriserer aldrig publicering, blot fordi en skill indeholder publiceringstrin.

## Kontroller og opdagelse

- `yarn ai-workflow:sync` regenererer kompatibilitetsoutput med de installerede `js-yaml` og `smol-toml`.
- `yarn ai-workflow:check` parser kilder/frontmatter/konfigurationer og kontrollerer genereret output, kaldsmetadata, placeringen af modelfelter og opkoblingen af hooket, der kun formaterer. Det slår ikke modelidentifikatorer op i en udbyders katalog.
- `yarn ai-workflow:test` kører isolerede Node-fixtures for hook-payloads og for generering/validering af arbejdsgangen.
- Efter opgradering af en agentapplikation skal du verificere, at skills/roller bliver fundet i den applikation. Syntaks- og paritetskontroller erstatter ikke en kontrol af selve indlæsningen. Genindlæs applikationen, hvis en eksisterende session holder fast i et gammelt katalog.
- Hooks kræver agentmiljøets projekttillid og gennemgang af hooks; omgå ikke tillidsmekanismen for at få en kontrol til at bestå. Se [hooks-setup.md](hooks-setup.md).

## Vedligeholdelse af nyttige instruktioner

Følg [OpenAIs vejledning om skills og prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (gennemgået 2026-09-12): hold beskrivelser præcise, indlæs kun detaljer, når de er relevante, og bevar det omfang, brugeren har bedt om. Delte skills betjener forskellige modeller; bevar projektspecifikke invarianter, men giv plads til rutinemæssige implementeringsvalg.

Hold en skills formål, beslutningsgrænser og væsentlige begrænsninger i `SKILL.md`. Henvis til omfattende tilstandsspecifikke kommandoer eller eksempler som valgfrie referencer. Placér udløsende betingelser tidligt i korte beskrivelser; et matchende nøgleord alene bør ikke udvide opgaven. Bevar eksisterende kaldsmetadata, medmindre adfærden bevidst ændres.

Efter en væsentlig ændring af instruktionerne skal du afprøve nogle få repræsentative små og store anmodninger. Tjek, hvilke skills/referencer der blev valgt, om handlingerne holdt sig inden for omfanget, om verifikationen passede til ændringen, og om det autoriserede arbejde blev fuldført. Skema- og fixture-tests fastslår, at værktøjerne fungerer korrekt, ikke hvor gode agentens beslutninger er.

## Værktøjer og browserejerskab

Foretræk det eksisterende katalog af skills/værktøjer og de installerede projekt-CLI'er. Brug `gh` til GitHub, `playwright-cli` til browserverifikation og officiel/versionsspecifik dokumentation, når bibliotekers adfærd har betydning. Undgå at installere duplikerede skills eller hente en ikke-fastlåst pakke blot for at køre en eksisterende formatter.

MCP-overhead afhænger af agentmiljøet: udskudt indlæsning af værktøjer kan undgå, at hvert skema indlæses på forhånd. Hold integrationerne relevante i stedet for at betragte MCP i sig selv som forældet. Eksisterende CLI-valg er fortsat nyttige af hensyn til reproducerbarhed og ressourcestyring.

Alle browsersessioner bruger `./scripts/pw-session.sh`, som håndhæver én aktiv browser på hele maskinen. Brug som standard en frisk, isoleret session. Adgang til den aktuelle personlige browser kræver eksplicit autorisation; genbrug den autorisation i de efterfølgende trin. Vælg browsere/viewports ud fra den berørte adfærd, kør de valgte motorer sekventielt, luk præcis den navngivne session under oprydningen, og brug aldrig `close-all`/`kill-all`. Se `playwright-cli`-skillen og [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
