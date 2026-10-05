# Verifisering

Velg sjekker ut fra den endrede atferden og usikkerheten som gjenstår. Gjenbruk vellykkede bevis for den samme sluttilstanden; kjør på nytt etter relevante endringer eller feil. Eksplisitte krav fra CI, utgivelser eller brukeren gjelder fortsatt.

| Endring                                                      | Passende sjekker                                                                                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Bare prosa/kommentarer/formatering                           | Diff, referanser, relevante generatorer; ikke noe appbygg                                                                         |
| Kilder/konfigurasjon for AI-arbeidsflyten                    | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; generer LLM-indekser på nytt når konteksten er endret |
| Isolert hjelpefunksjon eller skript                          | Målrettet kjøring/fixtures og syntaks- eller type-/lint-sjekker for den berørte koden                                             |
| Endring i delt kjøretid, avhengighet, bygg eller integrasjon | Målrettede sjekker av det som berøres, pluss de relevante bygg-/type-/lint-sjekkene nedenfor                                      |
| Bare CSS/tema/layout                                         | Berørte ruter/visningsporter/temaer i utvalgte nettlesere; bygg når imports, ressurser eller CSS-behandling er endret             |
| React-tilstand/effekter/ytelse                               | Berørt atferd og gjeldende React-veiledning; Doctor når diagnostikken kan avklare et konkret problem                              |

## Prosjektsjekker

- `yarn build:verify` velger det berørte arbeidsområdet. For et kjent omfang, bruk `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` eller `yarn docs:build:verify`.
- `yarn build` kjører bevisst hele produksjonsbygget for about/docs, inkludert alle dokumentasjonslokaler. Bruk det til validering av hele utgivelsen eller til endringer som tilsier det omfanget.
- `yarn lint`, `yarn typecheck` og `yarn format:check` dekker repoets eksisterende porter; for en smal skriptendring, bruk først de målrettede syntaks-/fixture-/formateringssjekkene for den.
- Endringer i manifest/låsefil krever `corepack yarn install`, `yarn deps:check-pinned` og `yarn deps:check-hardened`. `yarn knip` er veiledende for avhengigheter/imports.
- Sjekker for dokumentasjonsoversettelser står i [translations.md](translations.md); ikke kjør masseskriveren for oversettelser ved en avgrenset dokumentasjonsendring.

## Nettleserbevis og eierskap

Bruk Chrome for små, isolerte nettleserendringer. Legg til Firefox og WebKit for delt CSS/layout/responsivitet, nettlesersensitive API-er, brede interaksjoner, utgivelser eller eksplisitte krav på tvers av nettlesere. Ta med berørte mobillayouter og berøringsatferd. Å endre størrelsen på visningsporten alene er ikke berøringsemulering. Velg faktiske ruter og faktisk innhold fra kildekoden i stedet for å anta at eksempler er tilgjengelige.

Bruk `playwright-cli` gjennom `./scripts/pw-session.sh`. Én nettleser er aktiv på hele maskinen; utvalgte motorer kjøres etter hverandre, og hver nøyaktige økt du eier, lukkes også etter feil. Gjenbruk en autorisert økt som eies av den som kalte deg, uten å lukke den. Bruk aldri global nettleseropprydding, og stopp aldri en server med uklart eierskap. Det trengs ingen nettleser eller server for arbeid som bare gjelder dokumentasjon.

For ytelsesarbeid, sammenlign den samme flyten med tilsvarende visningsport, innhold, nettverks-/CPU-innstillinger, byggemodus og måleoverhead. Skill mellom observasjoner og mistenkte årsaker. Bruk profileringsferdigheten når disse målingene svarer på selve forespørselen.

## Endelige bevis

Én agent eier tung verifisering. Undersøk aktive arbeidslaster og kjør installasjoner, bygg/fulle testsuiter, Doctor, Android-/Electron-arbeid og nettleserprofilering serielt. Rapporter kommandoer/utfall og konkrete begrensninger; manglende data eller en motor som ble hoppet over, er ikke et bestått resultat. Fixtures for verktøyene verifiserer formater og mekanikk, ikke ende-til-ende-oppdagelse i appene eller kvaliteten på modellens beslutninger.

## Automatiske React-sjekker

`yarn agent:verify` kjører de valgte byggene etterfulgt av `yarn doctor:check` og `yarn perf:check`. `perf:check` inkluderer selvtesten for innsamlerens kompatibilitet og for en bevisst regresjon, så verken CI eller agentens verifiseringsløp trenger en egen `perf:test`-kjøring. Installer det låste nettleserverktøyet én gang med `yarn perf:install` (`--with-deps` i Linux-CI). Bruk mål-/scenariofiltre for målrettede nye kjøringer etter den fulle relevante kjøringen. Scenariobudsjettene er eksplisitte i `scripts/react-perf/config.mjs`; ta vare på bevisene og rett en regresjon før du vurderer en begrunnet endring av baseline. Vanlige produksjonsbygg utelater Bippy; egne `build:profile:*`-kommandoer leverer offisiell React-profileringsinstrumentering.

About-scenarioet `apps-search` holder tempoet ved å vente etter hvert tegn til URL- og inndataverdien er oppdatert. Et bestått resultat dekker denne sekvensen av oppdaterte søk, ikke responsen ved rask skriving. Bruk en separat reproduksjon med rask inndata når du vurderer tapte tegn eller inndatarespons.
