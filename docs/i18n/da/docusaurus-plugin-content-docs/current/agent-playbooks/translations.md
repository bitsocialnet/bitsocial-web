# Oversættelser

About-sitet bruger i18next-JSON i `about/public/translations/{lang}/default.json`. Docusaurus' kildeoversættelser ligger separat i `docs/i18n/`.

## Nøgler på about-sitet

Brug `.agents/skills/translate/SKILL.md`. Find de aktuelle sprog på disken, og bevar pladsholdere, markup, tekniske termer og brandnavne. Ved større opgaver kan underagenter generere uafhængige oversættelseskort, men én forældreagent anvender alle skrivninger til sprogfilerne serielt; opdateringsscriptet har ingen skrivelås.

Brug en unik sti til kortet, som ejes af opgaven. Forhåndsvis med `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, og anvend derefter med de samme argumenter og `--write`. Verificér dækning og værdier efter skrivningen, og fjern kun de midlertidige kort, som denne opgave ejer.

Brug `--delete` til fjernelser, der er bedt om. Gennemgå fundene fra `--audit --dry` før en autoriseret `--audit --write`; dynamiske oversættelsesnøgler kræver manuel gennemgang af kildekoden. Kopiér kun den engelske tekst ind i alle sprog, når det drejer sig om en teknisk term, et brand eller en pladsholder.

## Docusaurus-sider

`scripts/translate-docs.py` er en bulk-skriver for alle sider/sprog og har intet filter pr. fil; brug den ikke til en snæver oversættelsesrettelse. `scripts/check-docs-translations.py` er den skrivebeskyttede verifikator og understøtter `--locales` og `--paths`.

Hold kodeblokke, links, inline-kode, kontraktadresser, overskrifter, tabeller og admonitions på linje med den engelske kilde. Løs verifikatorens fejl; advarsler af typen `frontmatter-untranslated` for brandnavne kan være forventelige. Følg `docs/AGENTS.md`, og byg via roden, når du ændrer docs-temaet eller i18n-adfærden, så statisk output og Pagefind forbliver på linje.

## Valgfri semantisk gennemgang

Til udvalgte i18next-nøgler bruges `scripts/jev/translation-README.md`. Til dokumentationssider køres først `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Det kræver et eksplicit valg af sprog/sider, kører den strukturelle verifikator og rapporterer den semantiske gennemgang som uverificeret, indtil live-inferens er slået til. Tilføj kun `--live`, når opgaven har udbyderautorisation og budget til det; den delte private maskinkonfiguration leverer legitimationsoplysninger og en fastlåst model. Miljøvariabler og `--model` kan tilsidesætte den opsætning. Kommandoen redigerer aldrig oversættelser.

Sideadapteren bevarer hele sidens kontekst og begrænser hver side til 24 KB og hver kørsel til 30 par. Til større sider forbereder du eksplicit afstemte par af kilde- og oversættelsesafsnit til `translations.mjs --pairs`; par ikke afsnit automatisk efter indeks. Semantiske resultater er vejledende: gennemgå de rapporterede problemer og den rapporterede usikkerhed, og behold de deterministiske kontroller af kode, links og adresser.
