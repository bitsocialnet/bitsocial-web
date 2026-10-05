# Vertalingen

De about-site gebruikt i18next-JSON in `about/public/translations/{lang}/default.json`. Docusaurus-bronvertalingen staan apart in `docs/i18n/`.

## Sleutels van de about-site

Gebruik `.agents/skills/translate/SKILL.md`. Bepaal de huidige locales aan de hand van de schijf en behoud placeholders, markup, technische termen en merknamen. Bij grotere verzoeken kunnen child-agents onafhankelijke maps genereren, maar één bovenliggende agent voert elke schrijfactie naar een locale serieel uit; de updater heeft geen schrijfvergrendeling.

Gebruik een uniek map-pad dat bij de taak hoort. Bekijk een voorbeeld met `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` en pas het daarna toe met dezelfde argumenten en `--write`. Controleer na het schrijven de dekking en de waarden, en verwijder alleen de tijdelijke maps die bij deze taak horen.

Gebruik `--delete` voor gevraagde verwijderingen. Bekijk de bevindingen van `--audit --dry` voordat je een geautoriseerde `--audit --write` uitvoert; dynamische vertaalsleutels vereisen een handmatige review van de broncode. Kopieer Engels alleen naar elke locale voor een technische term, merknaam of placeholder.

## Docusaurus-pagina's

`scripts/translate-docs.py` is een bulkschrijver voor alle pagina's en locales en heeft geen filter per bestand; gebruik het niet voor een smalle vertaalwijziging. `scripts/check-docs-translations.py` is de alleen-lezen verifier en ondersteunt `--locales` en `--paths`.

Houd code fences, links, inline code, contractadressen, koppen, tabellen en admonitions in lijn met de Engelse bron. Los fouten van de verifier op; `frontmatter-untranslated`-waarschuwingen voor merknamen zijn te verwachten. Volg `docs/AGENTS.md` en build via de root wanneer je het thema of het i18n-gedrag van de docs wijzigt, zodat de statische uitvoer en Pagefind op elkaar blijven aansluiten.

## Optionele semantische review

Gebruik voor geselecteerde i18next-sleutels `scripts/jev/translation-README.md`. Voer voor documentatiepagina's eerst `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` uit. Dit vereist een expliciete selectie van locales en pagina's, draait de structurele verifier en meldt de semantische review als niet geverifieerd zolang live-inferentie niet is ingeschakeld. Voeg `--live` alleen toe met de providerautorisatie en het budget van de taak; de gedeelde privéconfiguratie van de machine levert de inloggegevens en een vastgepind model. Omgevingsvariabelen en `--model` kunnen die opzet overschrijven. Het commando bewerkt nooit vertalingen.

De pagina-adapter behoudt de context van de hele pagina en beperkt elke pagina tot 24 KB en elke run tot 30 paren. Bereid voor grotere pagina's expliciet uitgelijnde paren van bron- en vertaalalinea's voor met `translations.mjs --pairs`; koppel alinea's niet automatisch op volgorde. Semantische resultaten zijn adviserend: bekijk gemelde problemen en onzekerheden, en behoud de deterministische checks voor code, links en adressen.
