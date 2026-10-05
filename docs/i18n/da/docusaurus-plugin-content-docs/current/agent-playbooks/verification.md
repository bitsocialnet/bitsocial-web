# Verifikation

Vælg kontroller ud fra den ændrede adfærd og den usikkerhed, der er tilbage. Genbrug vellykkede beviser for den samme endelige tilstand; kør igen efter relevante redigeringer eller fejl. Eksplicitte krav fra CI, release eller brugeren gælder stadig.

| Ændring                                                       | Passende kontroller                                                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Kun prosa/kommentarer/formatering                             | Diff, referencer, relevante generatorer; intet app-build                                                                     |
| Kilder/konfiguration til AI-arbejdsgangen                     | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenerér LLM-indekser, når konteksten er ændret |
| Isoleret hjælper eller script                                 | Fokuseret kørsel/fixtures og syntaks- eller type-/lint-kontroller af den berørte kode                                        |
| Ændring af delt runtime, afhængighed, build eller integration | Fokuserede kontroller af det berørte plus de relevante build-/type-/lint-kontroller nedenfor                                 |
| Kun CSS/tema/layout                                           | Berørte ruter/viewports/temaer i udvalgte browsere; build, når imports, assets eller CSS-behandlingen er ændret              |
| React-state/effects/ydeevne                                   | Berørt adfærd og relevant React-vejledning; Doctor, når diagnostikken afklarer et konkret problem                            |

## Projektkontroller

- `yarn build:verify` vælger det berørte workspace. Ved et kendt omfang bruges `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` eller `yarn docs:build:verify`.
- `yarn build` kører bevidst det fulde produktionsbuild af about/docs, inklusive alle docs-sprog. Brug det til validering af hele releasen eller til ændringer, der berettiger det omfang.
- `yarn lint`, `yarn typecheck` og `yarn format:check` dækker repoets eksisterende porte; ved en snæver scriptændring bruges først scriptets egne fokuserede syntaks-/fixture-/formatkontroller.
- Ændringer i manifest/lockfil kræver `corepack yarn install`, `yarn deps:check-pinned` og `yarn deps:check-hardened`. `yarn knip` er vejledende for afhængigheder/imports.
- Kontroller af docs-oversættelser er beskrevet i [translations.md](translations.md); kør ikke bulk-skriveren til oversættelser ved en fokuseret docs-ændring.

## Browserbeviser og ejerskab

Brug Chrome til små, isolerede browserændringer. Tilføj Firefox og WebKit ved delt CSS/layout/responsivitet, browserfølsomme API'er, brede interaktioner, releases eller eksplicitte krav om understøttelse på tværs af browsere. Medtag berørte mobillayouts/touch-adfærd. En ændring af viewportstørrelsen alene er ikke touch-emulering. Vælg faktiske ruter og faktisk indhold ud fra kildekoden i stedet for at antage, at eksemplerne er tilgængelige.

Brug `playwright-cli` gennem `./scripts/pw-session.sh`. Kun én browser er aktiv ad gangen på hele maskinen; de valgte motorer kører sekventielt, og hver session, du ejer, lukkes ved sit præcise navn, også efter en fejl. Genbrug en autoriseret session, som kalderen ejer, uden at lukke den. Brug aldrig global browseroprydning, og stop aldrig en server med uklart ejerskab. Arbejde, der kun angår dokumentation, kræver hverken browser eller server.

Ved ydeevnearbejde sammenlignes det samme flow med tilsvarende viewport, indhold, netværks-/CPU-indstillinger, buildtilstand og måleoverhead. Skeln mellem observationer og formodede årsager. Brug profile-skillen, når disse målinger besvarer den egentlige forespørgsel.

## Endelige beviser

Én agent ejer den tunge verifikation. Undersøg aktive arbejdsbelastninger, og serialisér installationer, builds/fulde testsuiter, Doctor, Android-/Electron-arbejde og browserprofilering. Rapportér kommandoer/resultater og konkrete begrænsninger; manglende data eller en oversprunget motor er ikke et bestået resultat. Tooling-fixtures verificerer formater og mekanik, ikke end-to-end-opdagelse i appen eller kvaliteten af modellens beslutninger.

## Automatiske React-kontroller

`yarn agent:verify` kører de valgte builds efterfulgt af `yarn doctor:check` og `yarn perf:check`. `perf:check` omfatter selvtesten for collector-kompatibilitet og bevidste regressioner, så hverken CI eller agentens verifikationsvej har brug for et separat `perf:test`-gennemløb. Installér det fastlåste browserværktøj én gang med `yarn perf:install` (`--with-deps` i Linux-CI). Brug mål-/scenariefiltre til fokuserede genkørsler efter det fulde relevante gennemløb. Scenariebudgetterne er angivet eksplicit i `scripts/react-perf/config.mjs`; bevar beviserne, og ret en regression, før du overvejer en begrundet ændring af baseline. Almindelige produktionsbuilds udelader Bippy; separate `build:profile:*`-kommandoer leverer officiel profileringsinstrumentering til React.

About-sitets `apps-search`-scenarie afvikles i takt med committede URL-/inputværdier for hvert tegn. Et bestået resultat dækker den committede forespørgselssekvens, ikke responsivitet ved hurtig indtastning. Brug en separat reproduktion med hurtigt input, når du vurderer tabte tegn eller inputresponsivitet.
