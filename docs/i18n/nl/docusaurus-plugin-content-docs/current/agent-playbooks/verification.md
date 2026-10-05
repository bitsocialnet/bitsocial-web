# Verificatie

Kies checks op basis van het gewijzigde gedrag en de onzekerheid die nog overblijft. Hergebruik geslaagd bewijs voor dezelfde eindtoestand; voer checks opnieuw uit na relevante wijzigingen of fouten. Expliciete eisen vanuit CI, releases of de gebruiker blijven gelden.

| Wijziging                                                      | Passende checks                                                                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Alleen tekst/commentaar/opmaak                                 | Diff, verwijzingen, relevante generators; geen app-build                                                                             |
| Bronnen/configuratie van de AI-workflow                        | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; genereer LLM-indexen opnieuw als de context is gewijzigd |
| Geïsoleerde helper of script                                   | Gerichte aanroep/fixtures en syntaxis- of type-/lintchecks voor de betreffende code                                                  |
| Wijziging in gedeelde runtime, dependency, build of integratie | Gerichte checks voor wat geraakt wordt, plus de relevante build-/type-/lintchecks hieronder                                          |
| Alleen CSS/thema/layout                                        | Getroffen routes/viewports/thema's in geselecteerde browsers; een build wanneer imports, assets of CSS-verwerking zijn gewijzigd     |
| React-state/effects/performance                                | Getroffen gedrag en toepasselijke React-richtlijnen; Doctor wanneer de diagnostiek een concreet probleem beantwoordt                 |

## Projectchecks

- `yarn build:verify` selecteert de getroffen workspace. Gebruik voor een bekende scope `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` of `yarn docs:build:verify`.
- `yarn build` voert bewust de volledige productiebuild van about/docs uit, inclusief alle docs-locales. Gebruik dit voor validatie van de hele release of voor wijzigingen die die scope rechtvaardigen.
- `yarn lint`, `yarn typecheck` en `yarn format:check` dekken de bestaande poorten van de repository af; gebruik voor een smalle scriptwijziging eerst de gerichte syntaxis-, fixture- en opmaakchecks ervan.
- Wijzigingen in manifest of lockfile vereisen `corepack yarn install`, `yarn deps:check-pinned` en `yarn deps:check-hardened`. `yarn knip` is adviserend voor dependencies/imports.
- Checks voor docs-vertalingen staan in [translations.md](translations.md); draai de bulkvertaalschrijver niet voor een gerichte docs-wijziging.

## Browserbewijs en eigenaarschap

Gebruik Chrome voor kleine, geïsoleerde browserwijzigingen. Voeg Firefox en WebKit toe voor gedeelde CSS/layout/responsiviteit, browsergevoelige API's, brede interacties, releases of expliciete cross-browsercriteria. Neem getroffen mobiele layouts en touchgedrag mee. Alleen de viewport aanpassen is geen touch-emulatie. Kies echte routes en inhoud op basis van de broncode in plaats van aan te nemen dat voorbeelden beschikbaar zijn.

Gebruik `playwright-cli` via `./scripts/pw-session.sh`. Er is machinebreed één browser actief; geselecteerde engines draaien na elkaar en elke exacte sessie die je bezit wordt gesloten, ook na een fout. Hergebruik een geautoriseerde sessie van de aanroeper zonder die te sluiten. Gebruik nooit globale browseropruiming en stop nooit een server waarvan onduidelijk is wie de eigenaar is. Voor werk dat alleen documentatie betreft is geen browser of server nodig.

Vergelijk bij performancewerk dezelfde flow met een gelijkwaardige viewport, inhoud, netwerk-/CPU-instellingen, buildmodus en meetoverhead. Maak onderscheid tussen waarnemingen en vermoede oorzaken. Gebruik de profile-skill wanneer deze metingen de eigenlijke vraag beantwoorden.

## Eindbewijs

Eén agent is eigenaar van zware verificatie. Bekijk actieve workloads en voer installaties, builds/volledige suites, Doctor, Android-/Electron-werk en browserprofilering na elkaar uit. Rapporteer commando's en uitkomsten en specifieke beperkingen; ontbrekende gegevens of een overgeslagen engine is geen geslaagd resultaat. Tooling-fixtures verifiëren formaten en mechanismen, niet de end-to-end-detectie door apps of de kwaliteit van modelbeslissingen.

## Automatische React-checks

`yarn agent:verify` voert de geselecteerde builds uit, gevolgd door `yarn doctor:check` en `yarn perf:check`. `perf:check` bevat de selftest voor compatibiliteit van de collector en voor een bewust ingebouwde regressie, dus noch CI noch het verificatiepad van de agent heeft een aparte `perf:test`-run nodig. Installeer de vastgepinde browsertooling eenmalig met `yarn perf:install` (`--with-deps` in Linux-CI). Gebruik target- en scenariofilters voor gerichte herhalingen na de volledige relevante run. Scenariobudgetten staan expliciet in `scripts/react-perf/config.mjs`; bewaar het bewijs en los een regressie op voordat je een gerechtvaardigde aanpassing van de baseline overweegt. Gewone productiebuilds laten Bippy weg; aparte `build:profile:*`-commando's leveren de officiële React-profileringsinstrumentatie.

Het about-scenario `apps-search` bepaalt zijn tempo door na elk teken te wachten tot de URL- en invoerwaarde zijn doorgevoerd. Een geslaagd resultaat dekt die reeks doorgevoerde zoekopdrachten, niet de responsiviteit bij snel typen. Gebruik een aparte reproductie met snelle invoer wanneer je tekenverlies of de responsiviteit van invoer beoordeelt.
