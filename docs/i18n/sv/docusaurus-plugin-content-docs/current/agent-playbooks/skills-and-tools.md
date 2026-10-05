# Skills och verktyg

Delade skills finns i `.agents/skills/`. Redigera de här källorna och kör sedan `yarn ai-workflow:sync` för att generera `.claude/skills/` för Claude Code. Codex och Cursor upptäcker `.agents/skills/` direkt; återställ inte de duplicerade rötterna `.codex/skills/` eller `.cursor/skills/`.

Delade rollprompter finns i `.agents/roles/*.md`. Det här är ett repospecifikt källformat, inte en inbyggd sökväg för agentupptäckt. `scripts/ai-workflow-files.mjs` konverterar de här källorna till de appspecifika filerna nedan; `yarn ai-workflow:sync` skriver dem. Checka in de genererade filerna tillsammans med sina källor, så att en nyutcheckad kopia har den inbyggda konfigurationen utan att någon generator först behöver köras. När du tar bort en källa, ta uttryckligen bort dess föråldrade genererade utdata; valideraren rapporterar dem i stället för att tyst radera filer.

## Inbyggda upptäcktssökvägar

Verifierat mot officiell dokumentation 2026-09-12:

| App         | Projektinstruktioner                                                                  | Skills som används av det här repot        | Egna agenter som används av det här repot |
| ----------- | ------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------- |
| Codex       | `AGENTS.md`                                                                           | `.agents/skills/<name>/SKILL.md`           | Genererad `.codex/agents/<name>.toml`     |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` finns kvar för Cursor-specifika villkorliga regler | `.agents/skills/<name>/SKILL.md`           | Genererad `.cursor/agents/<name>.md`      |
| Claude Code | `CLAUDE.md` importerar `@AGENTS.md`                                                   | Genererad `.claude/skills/<name>/SKILL.md` | Genererad `.claude/agents/<name>.md`      |

Källor: [Codex-skills](https://learn.chatgpt.com/docs/build-skills), [Codex-underagenter](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursor-regler](https://cursor.com/docs/rules), [Cursor-skills](https://cursor.com/docs/skills), [Cursor-underagenter](https://cursor.com/docs/subagents), [Claude-minne](https://code.claude.com/docs/en/memory), [Claude-skills](https://code.claude.com/docs/en/skills), [Claude-underagenter](https://code.claude.com/docs/en/sub-agents).

Ersätt inte de inbyggda agentkatalogerna med `.agents/roles` och anta inte att Claude upptäcker `.agents/skills`. Claude kan ändå läsa en refererad fil där som vanlig projektkontext. Cursor upptäcker också `.claude/skills` för kompatibilitet; kopiorna hålls synkroniserade, men Cursors publicerade guide för skills anger inte någon deduplicering mellan de här rötterna. Kontrollera den installerade appens skill-katalog i stället för att lova att dubbletter inte kan dyka upp.

AI-katalogerna använder LF-radslut via `.gitattributes` så att genererad text förblir identisk på alla plattformar. Stödfiler för skills kopieras byte för byte.

## Skills

| Skill                                | Syfte                                                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Skapa auktoriserade, avgränsade lokala commits                                                                        |
| `commit-format`, `issue-format`      | Formatera förslag på begäran                                                                                          |
| `make-closed-issue`                  | Skapa en auktoriserad issue, en avgränsad commit och en PR                                                            |
| `review-and-merge-pr`                | Triagera PR-feedback; åtgärda/publicera/merga bara inom det begärda omfånget                                          |
| `fix-merge-conflicts`                | Lös konflikter och verifiera det sammanslagna resultatet                                                              |
| `release`                            | Förbered releasetexter och utför auktoriserade releasesteg                                                            |
| `code-quality-review`                | Granska icke-triviala diffar eller ett uttryckligen efterfrågat kvalitetsproblem                                      |
| `retro`                              | Gör påvisade misstag till fokuserade kontroller eller vägledning som förhindrar att de upprepas                       |
| `refactor-pass`, `deslop`            | Begärd uppstädning av befintliga ändringar                                                                            |
| `debug-agent`                        | Bevisbaserad felsökning, med instrumentering vid behov                                                                |
| `you-might-not-need-an-effect`       | Fokuserad granskning av effekter/memo                                                                                 |
| `vercel-react-best-practices`        | Tillämplig vägledning om React-prestanda; hoppa över regler som bara gäller Next.js/servern för den här Vite-klienten |
| `translate`                          | Generera översättningar och applicera sedan kartor via en enda skrivare                                               |
| `playwright-cli`, `inspect-elements` | Verifiering i webbläsare och mappning från DOM till källkod                                                           |
| `profile-browsing`                   | Avgränsad profilering av webbläsare och React                                                                         |
| `test-apk`                           | Verifiera ett tillhandahållet kompletterande Android-omslag                                                           |
| `impeccable`, `improve-threejs`      | Avgränsad gränssnittsdesign och granskning av Three.js-rendering                                                      |
| `implement-plan`                     | Genomför en plan med valfri, avgränsad delegering                                                                     |
| `readme`                             | Underhåll verifierad projektdokumentation                                                                             |
| `context7`                           | Hämta biblioteksdokumentation som passar versionen                                                                    |
| `find-skills`                        | Hitta fler skills när det uttryckligen efterfrågas                                                                    |

## Roller och modeller

Behåll egna roller för `browser-check`, `profiler`, `test-apk`, `translator` och `reviewer`. Använd agentmiljöns inbyggda worker-/general-purpose- eller explorer-roll för vanlig implementation och kodupptäckt. Föräldern tilldelar acceptanskriterier och ägarskap; en enda ägare kör tunga kontroller.

Codex-agentfiler innehåller `name`, `description` och `developer_instructions`. `.codex/config.toml` begränsar antalet samtidiga underagenter till fyra med `max_concurrent_threads_per_session`. Delad rollmetadata innehåller namn, beskrivning och valfritt sandlådeläge; den har avsiktligt inga modellfält.

Utelämna modell- och resonemangsfält i incheckade skills och egna agenter i alla tre apparna. Det ger utrymme för val vid anrop under körning, användarens standardinställningar och arv från föräldern enligt varje apps dokumenterade prioritetsordning. Familjealias för Claude minskar versionsunderhållet men väljer ändå en familj; en versionsangiven Cursor-modell kräver framtida uppdateringar. Spara sådana val i användar-/sessionsinställningar vid behov. Arv utlovar inte att den bästa aktuella modellen väljs automatiskt. Hitta inte på ett `latest`-alias och lägg inte till efterforskningar i modellkataloger i rutinuppgifter. Se [modellval i Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [modellval i Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) och [modellval i Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` mappas till Codex sandlåda och Cursors `readonly`; Claudes verktygslista och rollinstruktionerna begränsar dess granskningsarbetsflöde, men Bash-åtkomst är ingen sandlåda på operativsystemnivå.

Delad skill-frontmatter använder `disable-model-invocation: true` för arbetsflöden som anropas av användaren där det är tillämpligt. Codex motsvarande inställning finns i `agents/openai.yaml` som `policy.allow_implicit_invocation: false`; valideraren kräver båda. Anropsmetadata kompletterar uttryckliga regler för auktorisering; en begäran om granskning auktoriserar aldrig publicering bara för att en skill innehåller publiceringssteg.

## Kontroller och upptäckt

- `yarn ai-workflow:sync` genererar om kompatibilitetsutdata med de installerade `js-yaml` och `smol-toml`.
- `yarn ai-workflow:check` tolkar källor/frontmatter/konfigurationer och kontrollerar genererade utdata, anropsmetadata, var modellfälten placeras och kopplingen av den hook som bara formaterar. Den löser inte upp modellidentifierare mot en leverantörs katalog.
- `yarn ai-workflow:test` kör isolerade Node-fixturer för hook-nyttolaster och för generering/validering av arbetsflödet.
- Efter att du har uppgraderat en agentapplikation, verifiera upptäckten av skills/roller i den applikationen. Syntax-/paritetskontroller ersätter inte en kontroll av inläsaren. Ladda om applikationen om en befintlig session behåller en gammal katalog.
- Hooks kräver agentmiljöns projektförtroende och hook-granskning; kringgå inte förtroendet för att få en kontroll att gå igenom. Se [hooks-setup.md](hooks-setup.md).

## Att underhålla användbara instruktioner

Följ [OpenAI:s vägledning om skills och prompter](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (granskad 2026-09-12): håll beskrivningarna precisa, läs bara in detaljer när de är relevanta och bevara det omfång som användaren har begärt. Delade skills betjänar olika modeller; behåll projektspecifika invarianter men lämna utrymme för rutinmässiga implementationsval.

Håll syftet, beslutsgränserna och de väsentliga begränsningarna för en skill i `SKILL.md`. Länka omfattande lägesspecifika kommandon eller exempel som valfria referenser. Placera utlösande villkor tidigt i korta beskrivningar; ett matchande nyckelord ensamt ska inte vidga uppgiften. Bevara befintlig anropsmetadata om inte dess beteende avsiktligt ändras.

Efter en omfattande instruktionsändring, prova några representativa små och stora förfrågningar. Kontrollera vilka skills/referenser som valdes, om åtgärderna höll sig inom omfånget, om verifieringen motsvarade ändringen och om det auktoriserade arbetet slutfördes. Schema- och fixturtester visar att verktygen fungerar korrekt, inte hur bra agenten fattar beslut.

## Verktyg och webbläsarägarskap

Föredra den befintliga katalogen av skills/verktyg och de CLI:er som finns installerade i projektet. Använd `gh` för GitHub, `playwright-cli` för verifiering i webbläsare och officiell/versionsspecifik dokumentation när biblioteksbeteende spelar roll. Undvik att installera duplicerade skills eller hämta ett paket utan fast version bara för att köra en befintlig formaterare.

MCP-overhead beror på agentmiljön: uppskjuten inläsning av verktyg kan undvika att varje schema läses in i förväg. Håll integrationerna relevanta i stället för att behandla MCP i sig som föråldrat. Befintliga CLI-val är fortfarande användbara för reproducerbarhet och resurskontroll.

Alla webbläsarsessioner använder `./scripts/pw-session.sh`, som upprätthåller en enda aktiv webbläsare på hela maskinen. Använd som standard en ny isolerad session. Åtkomst till den nuvarande personliga webbläsaren kräver uttrycklig auktorisering; återanvänd den auktoriseringen i efterföljande steg. Välj webbläsare/viewports efter det berörda beteendet, kör valda motorer sekventiellt, stäng exakt den namngivna sessionen vid uppstädningen och använd aldrig `close-all`/`kill-all`. Se skillen `playwright-cli` och [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
