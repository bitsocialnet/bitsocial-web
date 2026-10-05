# Verifiering

Välj kontroller utifrån det ändrade beteendet och den osäkerhet som återstår. Återanvänd lyckade bevis för samma sluttillstånd; kör om efter relevanta ändringar eller misslyckanden. Uttryckliga krav från CI, release eller användaren gäller fortfarande.

| Ändring                                                       | Lämpliga kontroller                                                                                                         |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Endast prosa/kommentarer/formatering                          | Diff, referenser, relevanta generatorer; inget appbygge                                                                     |
| Källor/konfiguration för AI-arbetsflödet                      | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; generera om LLM-index när kontexten har ändrats |
| Isolerad hjälpfunktion eller isolerat skript                  | Riktat anrop/fixturer samt syntax- eller typ-/lintkontroller för den berörda koden                                          |
| Ändring av delad körmiljö, beroenden, bygge eller integration | Riktade kontroller av det som berörs plus relevanta bygg-/typ-/lintkontroller nedan                                         |
| Endast CSS/tema/layout                                        | Berörda rutter/viewports/teman i valda webbläsare; bygg när importer, tillgångar eller CSS-bearbetning har ändrats          |
| React-tillstånd/effekter/prestanda                            | Berört beteende och tillämplig React-vägledning; Doctor när diagnostiken kan avgöra en konkret fråga                        |

## Projektkontroller

- `yarn build:verify` väljer den berörda arbetsytan. För ett känt omfång, använd `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` eller `yarn docs:build:verify`.
- `yarn build` kör avsiktligt hela produktionsbygget för about/docs, inklusive alla lokaler i dokumentationen. Använd det för validering av hela releasen eller för ändringar som motiverar det omfånget.
- `yarn lint`, `yarn typecheck` och `yarn format:check` täcker repots befintliga grindar; vid en smal skriptändring, använd först skriptets riktade syntax-/fixtur-/formatkontroller.
- Ändringar i manifest/låsfil kräver `corepack yarn install`, `yarn deps:check-pinned` och `yarn deps:check-hardened`. `yarn knip` är rådgivande för beroenden/importer.
- Kontroller för dokumentationsöversättningar finns i [translations.md](translations.md); kör inte den storskaliga översättningsskrivaren för en avgränsad dokumentationsändring.

## Webbläsarbevis och ägarskap

Använd Chrome för små, isolerade webbläsarändringar. Lägg till Firefox och WebKit för delad CSS/layout/responsivitet, webbläsarkänsliga API:er, breda interaktioner, releaser eller uttryckliga kriterier för flera webbläsare. Ta med berörda mobillayouter och berört pekbeteende. Att bara ändra viewportens storlek är ingen pekemulering. Välj faktiska rutter och faktiskt innehåll utifrån källkoden i stället för att anta att exemplen finns tillgängliga.

Använd `playwright-cli` via `./scripts/pw-session.sh`. Bara en webbläsare är aktiv åt gången på hela maskinen; valda motorer körs sekventiellt, och varje exakt ägd session stängs även efter ett misslyckande. Återanvänd en auktoriserad session som anroparen äger utan att stänga den. Använd aldrig global webbläsarstädning och stoppa aldrig en server med oklart ägarskap. Ingen webbläsare eller server behövs för arbete som bara rör dokumentation.

Vid prestandaarbete, jämför samma flöde med likvärdig viewport, likvärdigt innehåll, likvärdiga nätverks-/CPU-inställningar, samma byggläge och samma mätoverhead. Skilj mellan observationer och misstänkta orsaker. Använd skillen profile när de här mätningarna besvarar den faktiska förfrågan.

## Slutliga bevis

En agent äger den tunga verifieringen. Granska aktiva arbetslaster och serialisera installationer, byggen/fullständiga testsviter, Doctor, Android-/Electron-arbete och webbläsarprofilering. Rapportera kommandon/utfall och specifika begränsningar; saknade data eller en överhoppad motor är inte ett godkänt resultat. Verktygsfixturer verifierar format och mekanik, inte upptäckt i appen från början till slut eller modellens beslutskvalitet.

## Automatiska React-kontroller

`yarn agent:verify` kör de valda byggena följt av `yarn doctor:check` och `yarn perf:check`. `perf:check` omfattar självtestet för kollektorkompatibilitet och avsiktlig regression, så varken CI eller agentens verifieringsväg behöver en separat körning av `perf:test`. Installera de versionslåsta webbläsarverktygen en gång med `yarn perf:install` (`--with-deps` i Linux-CI). Använd mål-/scenariofilter för riktade omkörningar efter den fullständiga relevanta körningen. Scenariobudgetarna anges uttryckligen i `scripts/react-perf/config.mjs`; bevara bevisen och åtgärda en regression innan du överväger en motiverad ändring av baslinjen. Vanliga produktionsbyggen utelämnar Bippy; separata `build:profile:*`-kommandon tillhandahåller officiell instrumentering för React-profilering.

About-sajtens scenario `apps-search` väntar efter varje tecken tills värdet i URL:en och inmatningsfältet har tillämpats innan nästa tecken skrivs. Ett godkänt resultat täcker den sekvensen av tillämpade frågor, inte responsiviteten vid snabbt skrivande. Använd en separat reproduktion med snabb inmatning när du utvärderar teckenförlust eller hur snabbt inmatningen reagerar.
