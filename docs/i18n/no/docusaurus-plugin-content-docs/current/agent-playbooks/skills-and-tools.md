# Ferdigheter og verktøy

Delte ferdigheter ligger i `.agents/skills/`. Rediger disse kildene, og kjør deretter `yarn ai-workflow:sync` for å generere `.claude/skills/` for Claude Code. Codex og Cursor finner `.agents/skills/` direkte; ikke gjenopprett de dupliserte rotmappene `.codex/skills/` eller `.cursor/skills/`.

Delte rolleprompter ligger i `.agents/roles/*.md`. Dette er et repospesifikt kildeformat, ikke en native sti der agenter oppdages. `scripts/ai-workflow-files.mjs` konverterer disse kildene til de appspesifikke filene nedenfor; `yarn ai-workflow:sync` skriver dem. Sjekk inn de genererte filene sammen med kildene deres, slik at en fersk utsjekk har den native konfigurasjonen uten å kjøre en generator først. Når du fjerner en kilde, fjern de foreldede genererte filene eksplisitt; validatoren rapporterer dem i stedet for å slette filer i stillhet.

## Native oppdagelsesstier

Verifisert mot offisiell dokumentasjon 2026-09-12:

| App         | Prosjektinstruksjoner                                                                              | Ferdigheter dette repoet bruker           | Egendefinerte agenter dette repoet bruker |
| ----------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| Codex       | `AGENTS.md`                                                                                        | `.agents/skills/<name>/SKILL.md`          | Generert `.codex/agents/<name>.toml`      |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` er fortsatt tilgjengelig for Cursor-spesifikke betingede regler | `.agents/skills/<name>/SKILL.md`          | Generert `.cursor/agents/<name>.md`       |
| Claude Code | `CLAUDE.md` importerer `@AGENTS.md`                                                                | Generert `.claude/skills/<name>/SKILL.md` | Generert `.claude/agents/<name>.md`       |

Kilder: [Codex-ferdigheter](https://learn.chatgpt.com/docs/build-skills), [Codex-underagenter](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-regler](https://cursor.com/docs/rules), [Cursor-ferdigheter](https://cursor.com/docs/skills), [Cursor-underagenter](https://cursor.com/docs/subagents), [Claude-minne](https://code.claude.com/docs/en/memory), [Claude-ferdigheter](https://code.claude.com/docs/en/skills), [Claude-underagenter](https://code.claude.com/docs/en/sub-agents).

Ikke erstatt de native agentmappene med `.agents/roles`, og ikke anta at Claude oppdager `.agents/skills`. Claude kan fortsatt lese en fil det henvises til der, som vanlig prosjektkontekst. Cursor oppdager også `.claude/skills` av kompatibilitetshensyn; kopiene holdes synkronisert, men Cursors publiserte veiledning for ferdigheter sier ikke noe om deduplisering på tvers av disse rotmappene. Sjekk ferdighetskatalogen i den installerte appen i stedet for å love at dupliserte oppføringer ikke kan dukke opp.

AI-mappene bruker LF-linjeskift gjennom `.gitattributes`, slik at generert tekst forblir identisk på tvers av plattformer. Støttefiler for ferdigheter kopieres byte for byte.

## Ferdigheter

| Ferdighet                            | Formål                                                                                                    |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `commit`                             | Lage autoriserte, avgrensede lokale commits                                                               |
| `commit-format`, `issue-format`      | Formatere forslag når det blir bedt om det                                                                |
| `make-closed-issue`                  | Opprette en autorisert issue, en avgrenset commit og en PR                                                |
| `review-and-merge-pr`                | Sortere tilbakemeldinger på PR-er; rette/publisere/merge bare innenfor det forespurte omfanget            |
| `fix-merge-conflicts`                | Løse konflikter og verifisere det sammenslåtte resultatet                                                 |
| `release`                            | Forberede utgivelsestekst og utføre autoriserte utgivelsessteg                                            |
| `code-quality-review`                | Gjennomgå ikke-trivielle differ eller et eksplisitt forespurt kvalitetsproblem                            |
| `retro`                              | Gjøre påviste feil om til målrettede sjekker eller veiledning som hindrer gjentakelse                     |
| `refactor-pass`, `deslop`            | Forespurt opprydding i eksisterende endringer                                                             |
| `debug-agent`                        | Bevisbasert feilsøking, med instrumentering ved behov                                                     |
| `you-might-not-need-an-effect`       | Målrettet gjennomgang av effekter/memo                                                                    |
| `vercel-react-best-practices`        | Gjeldende React-ytelsesveiledning; hopp over regler for Next.js eller bare server for denne Vite-klienten |
| `translate`                          | Generere oversettelser og deretter ta i bruk map-filer gjennom én enkelt skriver                          |
| `playwright-cli`, `inspect-elements` | Nettleserverifisering og kobling fra DOM til kildekode                                                    |
| `profile-browsing`                   | Avgrenset nettleser- og React-profilering                                                                 |
| `test-apk`                           | Verifisere en levert Android-wrapper for følgeappen                                                       |
| `impeccable`, `improve-threejs`      | Avgrenset grensesnittdesign og gjennomgang av Three.js-rendering                                          |
| `implement-plan`                     | Gjennomføre en plan med valgfri, avgrenset delegering                                                     |
| `readme`                             | Vedlikeholde verifisert prosjektdokumentasjon                                                             |
| `context7`                           | Hente biblioteksdokumentasjon som passer til versjonen                                                    |
| `find-skills`                        | Finne flere ferdigheter når det eksplisitt blir bedt om det                                               |

## Roller og modeller

Behold egendefinerte roller for `browser-check`, `profiler`, `test-apk`, `translator` og `reviewer`. Bruk harnessens innebygde worker-/general-purpose- eller explorer-rolle til vanlig implementering og kodeutforsking. Foreldreagenten tildeler akseptansekriterier og eierskap; én eier kjører tunge sjekker.

Codex-agentfiler inneholder `name`, `description` og `developer_instructions`. `.codex/config.toml` begrenser antall samtidige underagenter til fire med `max_concurrent_threads_per_session`. Delte rollemetadata inneholder navn, beskrivelse og valgfri sandkassemodus; de har bevisst ingen modellfelt.

Utelat modell- og resonneringsfelt fra innsjekkede ferdigheter og egendefinerte agenter i alle tre appene. Det gir rom for valg ved kjøring, brukerens standardinnstillinger og arv fra foreldreagenten i tråd med hver apps dokumenterte forrangsregler. Familiealiaser for Claude reduserer versjonsvedlikehold, men velger fortsatt en familie; en versjonert Cursor-modell krever fremtidige oppdateringer. Hold slike valg i bruker-/øktinnstillinger ved behov. Arv lover ikke at den beste gjeldende modellen velges automatisk. Ikke finn på et `latest`-alias, og ikke legg til research i modellkataloger i rutineoppgaver. Se [modellvalg i Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [modellvalg i Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) og [modellvalg i Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` tilsvarer sandkassen i Codex og `readonly` i Cursor; for Claude begrenser verktøylisten og rolleinstruksjonene gjennomgangsarbeidsflyten, men Bash-tilgang er ikke en sandkasse på OS-nivå.

Delt frontmatter for ferdigheter bruker `disable-model-invocation: true` for arbeidsflyter som brukeren starter selv, der det er relevant. Den tilsvarende innstillingen i Codex ligger i `agents/openai.yaml` som `policy.allow_implicit_invocation: false`; validatoren krever begge. Metadata for kall supplerer eksplisitte autorisasjonsregler; en forespørsel om gjennomgang gir aldri tillatelse til publisering bare fordi en ferdighet inneholder publiseringssteg.

## Sjekker og oppdagelse

- `yarn ai-workflow:sync` genererer kompatibilitetsfilene på nytt med installert `js-yaml` og `smol-toml`.
- `yarn ai-workflow:check` parser kilder/frontmatter/konfigurasjoner og sjekker genererte filer, kallmetadata, plasseringen av modellfelt og koblingen av hooken som bare formaterer. Den slår ikke opp modellidentifikatorer i en leverandørs katalog.
- `yarn ai-workflow:test` kjører isolerte Node-fixtures for hook-nyttelaster og generering/validering av arbeidsflyten.
- Etter at du har oppgradert en agentapplikasjon, verifiser at ferdigheter/roller oppdages i den applikasjonen. Syntaks-/paritetssjekker erstatter ikke en sjekk av innlastingen. Last inn applikasjonen på nytt hvis en eksisterende økt holder på en gammel katalog.
- Hooks krever harnessens prosjekttillit og hook-gjennomgang; ikke omgå tilliten for å få en sjekk til å bestå. Se [hooks-setup.md](hooks-setup.md).

## Vedlikehold av nyttige instruksjoner

Følg [OpenAIs veiledning om ferdigheter og prompter](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (gjennomgått 2026-09-12): hold beskrivelsene presise, last inn detaljer bare når de er relevante, og hold deg innenfor omfanget brukeren ba om. Delte ferdigheter betjener ulike modeller; behold prosjektspesifikke invarianter og gi rom for rutinemessige implementeringsvalg.

Hold en ferdighets formål, beslutningsgrenser og vesentlige begrensninger i `SKILL.md`. Lenk til omfattende modusspesifikke kommandoer eller eksempler som valgfrie referanser. Plasser utløserbetingelser tidlig i korte beskrivelser; et samsvarende nøkkelord alene skal ikke utvide oppgaven. Behold eksisterende kallmetadata med mindre atferden bevisst endres.

Etter en betydelig endring i instruksjonene, prøv ut noen representative små og store forespørsler. Sjekk hvilke ferdigheter/referanser som ble valgt, om handlingene holdt seg innenfor omfanget, om verifiseringen passet til endringen, og om det autoriserte arbeidet ble fullført. Skjema- og fixture-tester fastslår at verktøyene er korrekte, ikke kvaliteten på agentens beslutninger.

## Verktøy og eierskap til nettleseren

Foretrekk den eksisterende ferdighets-/verktøykatalogen og prosjektets installerte CLI-er. Bruk `gh` for GitHub, `playwright-cli` for nettleserverifisering og offisiell/versjonsspesifikk dokumentasjon når bibliotekets atferd betyr noe. Unngå å installere dupliserte ferdigheter eller hente en ulåst pakke bare for å kjøre en eksisterende formaterer.

MCP-overhead avhenger av harnessen: utsatt innlasting av verktøy kan unngå at hvert skjema lastes inn på forhånd. Hold integrasjonene relevante i stedet for å behandle MCP i seg selv som foreldet. Eksisterende CLI-valg er fortsatt nyttige for reproduserbarhet og ressurskontroll.

Alle nettleserøkter bruker `./scripts/pw-session.sh`, som håndhever én aktiv nettleser på hele maskinen. Bruk som standard en fersk, isolert økt. Tilgang til den nåværende personlige nettleseren krever eksplisitt autorisasjon; gjenbruk den autorisasjonen i påfølgende steg. Velg nettlesere/visningsporter ut fra den berørte atferden, kjør utvalgte motorer etter hverandre, lukk nøyaktig den navngitte økten under opprydding, og bruk aldri `close-all`/`kill-all`. Se ferdigheten `playwright-cli` og [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
