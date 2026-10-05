# Skills en tools

Gedeelde skills staan in `.agents/skills/`. Bewerk deze bronnen en voer daarna `yarn ai-workflow:sync` uit om `.claude/skills/` voor Claude Code te genereren. Codex en Cursor vinden `.agents/skills/` rechtstreeks; herstel de dubbele roots `.codex/skills/` of `.cursor/skills/` niet.

Gedeelde rolprompts staan in `.agents/roles/*.md`. Dit is een repository-specifiek bronformaat, geen native pad waarin agents worden gevonden. `scripts/ai-workflow-files.mjs` zet deze bronnen om in de app-specifieke bestanden hieronder; `yarn ai-workflow:sync` schrijft ze weg. Commit de gegenereerde bestanden samen met hun bronnen, zodat een verse checkout de native configuratie heeft zonder eerst een generator te draaien. Verwijder na het verwijderen van een bron de verouderde gegenereerde uitvoer expliciet; de validator rapporteert die, in plaats van bestanden stilzwijgend te verwijderen.

## Native detectiepaden

Geverifieerd aan de hand van de officiële documentatie op 2026-09-12:

| App         | Projectinstructies                                                                                  | Skills die deze repository gebruikt           | Aangepaste agents die deze repository gebruikt |
| ----------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                         | `.agents/skills/<name>/SKILL.md`              | Gegenereerde `.codex/agents/<name>.toml`       |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` blijft beschikbaar voor Cursor-specifieke voorwaardelijke regels | `.agents/skills/<name>/SKILL.md`              | Gegenereerde `.cursor/agents/<name>.md`        |
| Claude Code | `CLAUDE.md` importeert `@AGENTS.md`                                                                 | Gegenereerde `.claude/skills/<name>/SKILL.md` | Gegenereerde `.claude/agents/<name>.md`        |

Bronnen: [Codex-skills](https://learn.chatgpt.com/docs/build-skills), [Codex-subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-regels](https://cursor.com/docs/rules), [Cursor-skills](https://cursor.com/docs/skills), [Cursor-subagents](https://cursor.com/docs/subagents), [Claude-geheugen](https://code.claude.com/docs/en/memory), [Claude-skills](https://code.claude.com/docs/en/skills), [Claude-subagents](https://code.claude.com/docs/en/sub-agents).

Vervang de native agentmappen niet door `.agents/roles` en ga er niet van uit dat Claude `.agents/skills` vindt. Claude kan een bestand waarnaar daar wordt verwezen nog steeds lezen als gewone projectcontext. Cursor vindt voor compatibiliteit ook `.claude/skills`; de kopieën blijven gesynchroniseerd, maar de gepubliceerde skillshandleiding van Cursor zegt niets over deduplicatie tussen deze roots. Controleer de skillcatalogus van de geïnstalleerde app in plaats van te beloven dat er geen dubbele vermeldingen kunnen verschijnen.

De AI-mappen gebruiken LF-regeleinden via `.gitattributes`, zodat gegenereerde tekst op alle platforms identiek blijft. Ondersteunende assets van skills worden byte voor byte gekopieerd.

## Skills

| Skill                                | Doel                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `commit`                             | Geautoriseerde, afgebakende lokale commits maken                                                                   |
| `commit-format`, `issue-format`      | Suggesties opmaken wanneer daarom wordt gevraagd                                                                   |
| `make-closed-issue`                  | Een geautoriseerd issue, een afgebakende commit en een PR aanmaken                                                 |
| `review-and-merge-pr`                | PR-feedback triëren; alleen binnen de gevraagde scope fixen, publiceren of mergen                                  |
| `fix-merge-conflicts`                | Conflicten oplossen en het samengevoegde resultaat verifiëren                                                      |
| `release`                            | Releasetekst voorbereiden en geautoriseerde releasestappen uitvoeren                                               |
| `code-quality-review`                | Niet-triviale diffs of een expliciet gevraagd kwaliteitsprobleem reviewen                                          |
| `retro`                              | Aangetoonde fouten omzetten in gerichte checks of richtlijnen die herhaling voorkomen                              |
| `refactor-pass`, `deslop`            | Gevraagde opschoning van bestaande wijzigingen                                                                     |
| `debug-agent`                        | Debuggen op basis van bewijs, met instrumentatie waar nodig                                                        |
| `you-might-not-need-an-effect`       | Gerichte review van effects en memo's                                                                              |
| `vercel-react-best-practices`        | Toepasselijke React-performancerichtlijnen; sla regels voor Next.js of alleen de server over voor deze Vite-client |
| `translate`                          | Vertalingen genereren en de maps daarna via één schrijver toepassen                                                |
| `playwright-cli`, `inspect-elements` | Browserverificatie en koppeling van DOM naar broncode                                                              |
| `profile-browsing`                   | Afgebakende browser- en React-profilering                                                                          |
| `test-apk`                           | Een aangeleverde Android-companionwrapper verifiëren                                                               |
| `impeccable`, `improve-threejs`      | Afgebakend interfaceontwerp en review van Three.js-rendering                                                       |
| `implement-plan`                     | Een plan uitvoeren met optionele, begrensde delegatie                                                              |
| `readme`                             | Geverifieerde projectdocumentatie onderhouden                                                                      |
| `context7`                           | Bibliotheekdocumentatie ophalen die bij de versie past                                                             |
| `find-skills`                        | Extra skills zoeken wanneer daar expliciet om wordt gevraagd                                                       |

## Rollen en modellen

Behoud aangepaste rollen voor `browser-check`, `profiler`, `test-apk`, `translator` en `reviewer`. Gebruik de ingebouwde worker-/general-purpose- of explorer-rol van de harness voor gewone implementatie en het verkennen van code. De bovenliggende agent wijst acceptatiecriteria en eigenaarschap toe; één eigenaar draait zware checks.

Codex-agentbestanden bevatten `name`, `description` en `developer_instructions`. `.codex/config.toml` beperkt het aantal gelijktijdige child-agents tot vier met `max_concurrent_threads_per_session`. Gedeelde rolmetadata bevat de naam, de beschrijving en een optionele sandboxmodus; er zitten bewust geen modelvelden in.

Laat model- en reasoningvelden weg uit gecommitte skills en aangepaste agents in alle drie de apps. Zo blijven keuzes bij het aanroepen tijdens runtime, standaardinstellingen van de gebruiker en overerving van de bovenliggende agent mogelijk volgens de gedocumenteerde voorrangsregels van elke app. Aliassen voor Claude-modelfamilies verminderen versieonderhoud, maar kiezen nog steeds een familie; een Cursor-model met versienummer vereist toekomstige updates. Leg zulke keuzes waar nodig vast in gebruikers- of sessie-instellingen. Overerving belooft niet dat automatisch het beste actuele model wordt gekozen. Verzin geen `latest`-alias en voeg geen onderzoek naar de modelcatalogus toe aan routinetaken. Zie [modelkeuze in Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [modelkeuze in Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) en [modelkeuze in Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` komt overeen met de sandbox van Codex en `readonly` van Cursor; bij Claude beperken de toollijst en de rolinstructies de reviewworkflow, maar Bash-toegang is geen sandbox op OS-niveau.

Gedeelde skill-frontmatter gebruikt waar van toepassing `disable-model-invocation: true` voor workflows die de gebruiker zelf aanroept. De overeenkomstige instelling van Codex staat in `agents/openai.yaml` als `policy.allow_implicit_invocation: false`; de validator vereist beide. Aanroepmetadata vult expliciete autorisatieregels aan; een reviewverzoek geeft nooit toestemming om te publiceren alleen omdat een skill publicatiestappen bevat.

## Checks en detectie

- `yarn ai-workflow:sync` genereert de compatibiliteitsuitvoer opnieuw met de geïnstalleerde `js-yaml` en `smol-toml`.
- `yarn ai-workflow:check` parseert bronnen, frontmatter en configuraties, en controleert gegenereerde uitvoer, aanroepmetadata, de plaatsing van modelvelden en de koppeling van de hook die alleen formatteert. Het controleert modelidentifiers niet tegen de catalogus van een provider.
- `yarn ai-workflow:test` draait geïsoleerde Node-fixtures voor hook-payloads en voor het genereren en valideren van de workflow.
- Controleer na het upgraden van een agentapplicatie of skills en rollen in die applicatie worden gevonden. Syntaxis- en pariteitschecks vervangen geen loadercheck. Herlaad de applicatie als een bestaande sessie een oude catalogus vasthoudt.
- Hooks vereisen het projectvertrouwen en de hookreview van de harness; omzeil het vertrouwen niet om een check te laten slagen. Zie [hooks-setup.md](hooks-setup.md).

## Bruikbare instructies onderhouden

Volg [de richtlijnen van OpenAI voor skills en prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (bekeken op 2026-09-12): houd beschrijvingen precies, laad details alleen wanneer ze relevant zijn en respecteer de scope die de gebruiker heeft gevraagd. Gedeelde skills bedienen verschillende modellen; behoud projectspecifieke invarianten en laat ruimte voor routinematige implementatiekeuzes.

Houd het doel, de beslisgrenzen en de essentiële beperkingen van een skill in `SKILL.md`. Link omvangrijke modusspecifieke commando's of voorbeelden als optionele referenties. Zet triggervoorwaarden vooraan in korte beschrijvingen; een overeenkomend trefwoord alleen mag de taak niet uitbreiden. Behoud bestaande aanroepmetadata, tenzij het gedrag ervan bewust wordt gewijzigd.

Probeer na een substantiële wijziging in de instructies een paar representatieve kleine en grote verzoeken uit. Controleer welke skills en referenties werden geselecteerd, of acties binnen de scope bleven, of de verificatie bij de wijziging paste en of het geautoriseerde werk werd afgerond. Schema- en fixturetests stellen de correctheid van de tooling vast, niet de kwaliteit van de beslissingen van de agent.

## Tools en browsereigenaarschap

Geef de voorkeur aan de bestaande catalogus van skills en tools en aan de geïnstalleerde project-CLI's. Gebruik `gh` voor GitHub, `playwright-cli` voor browserverificatie en officiële, versiespecifieke documentatie wanneer het gedrag van een bibliotheek ertoe doet. Installeer geen dubbele skills en haal geen niet-vastgepind pakket op alleen om een bestaande formatter te draaien.

De overhead van MCP hangt af van de harness: uitgesteld laden van tools kan voorkomen dat elk schema vooraf wordt geladen. Houd integraties relevant in plaats van MCP zelf als achterhaald te behandelen. Bestaande CLI-keuzes blijven nuttig voor reproduceerbaarheid en controle over resources.

Alle browsersessies gebruiken `./scripts/pw-session.sh`, dat machinebreed één actieve browser afdwingt. Begin standaard met een verse, geïsoleerde sessie. Toegang tot de huidige persoonlijke browser vereist expliciete autorisatie; hergebruik die autorisatie in volgende stappen. Kies browsers en viewports op basis van het getroffen gedrag, draai geselecteerde engines na elkaar, sluit bij het opruimen precies de benoemde sessie en gebruik nooit `close-all`/`kill-all`. Zie de `playwright-cli`-skill en [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
