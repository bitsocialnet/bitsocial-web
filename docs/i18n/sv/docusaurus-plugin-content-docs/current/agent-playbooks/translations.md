# Översättningar

About-sajten använder i18next-JSON i `about/public/translations/{lang}/default.json`. Översättningarna av Docusaurus-källorna finns separat i `docs/i18n/`.

## Nycklar för about-sajten

Använd `.agents/skills/translate/SKILL.md`. Ta reda på de aktuella lokalerna från disken och bevara platshållare, markup, tekniska termer och varumärkesnamn. Vid större förfrågningar kan underagenter generera oberoende kartor, men en enda föräldraagent applicerar varje skrivning till lokalerna seriellt; uppdateraren har inget skrivlås.

Använd en unik kartsökväg som ägs av uppgiften. Förhandsgranska med `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` och applicera sedan med samma argument och `--write`. Verifiera täckning/värden efter skrivningen och ta bara bort de tillfälliga kartor som den här uppgiften äger.

Använd `--delete` för begärda borttagningar. Granska fynden från `--audit --dry` innan en auktoriserad `--audit --write`; dynamiska översättningsnycklar kräver manuell granskning av källkoden. Kopiera engelska till varje lokal bara för en teknisk term, ett varumärke eller en platshållare.

## Docusaurus-sidor

`scripts/translate-docs.py` är en massskrivare för alla sidor/lokaler och har inget filter per fil; använd den inte för en smal översättningsändring. `scripts/check-docs-translations.py` är den skrivskyddade verifieraren och stöder `--locales` och `--paths`.

Håll kodblock, länkar, inlinekod, kontraktsadresser, rubriker, tabeller och admonitions i linje med den engelska källan. Åtgärda verifierarens fel; varningar av typen `frontmatter-untranslated` för varumärkesnamn kan vara väntade. Följ `docs/AGENTS.md` och bygg via roten när du ändrar dokumentationens tema eller i18n-beteende, så att den statiska utdatan och Pagefind förblir i linje.

## Valfri semantisk granskning

För utvalda i18next-nycklar, använd `scripts/jev/translation-README.md`. För dokumentationssidor, kör först `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Det kräver ett uttryckligt val av lokal/sida, kör den strukturella verifieraren och rapporterar den semantiska granskningen som overifierad tills live-inferens är aktiverad. Lägg bara till `--live` om uppgiften har auktorisering och budget för leverantören; den delade privata maskinkonfigurationen tillhandahåller autentiseringsuppgifter och en versionslåst modell. Miljövariabler och `--model` kan åsidosätta den uppsättningen. Kommandot redigerar aldrig översättningar.

Sidadaptern bevarar hela sidans kontext och begränsar varje sida till 24 KB och varje körning till 30 par. För större sidor, förbered uttryckligen sammanpassade par av käll- och översättningsstycken för `translations.mjs --pairs`; para inte automatiskt ihop stycken efter index. Semantiska resultat är rådgivande: granska rapporterade problem och osäkerheter, och behåll de deterministiska kontrollerna av kod, länkar och adresser.
