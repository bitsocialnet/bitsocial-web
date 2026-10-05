# Përkthimet

Sajti about përdor JSON i18next te `about/public/translations/{lang}/default.json`. Përkthimet burimore të Docusaurus ndodhen veçmas te `docs/i18n/`.

## Çelësat e sajtit about

Përdorni `.agents/skills/translate/SKILL.md`. Zbuloni gjuhët aktuale nga disku dhe ruani vendmbajtësit, markup-in, termat teknikë dhe emrat e markave. Për kërkesa më të mëdha, agjentët fëmijë mund të gjenerojnë harta të pavarura, por të gjitha shkrimet në skedarët gjuhësorë i zbaton në seri një prind i vetëm; përditësuesi nuk ka kyç shkrimi.

Përdorni një shteg unik për hartën, në pronësi të detyrës. Shikojeni paraprakisht me `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, pastaj zbatojeni me të njëjtat argumente dhe `--write`. Pas shkrimit verifikoni mbulimin/vlerat dhe hiqni vetëm hartat e përkohshme që i zotëron kjo detyrë.

Përdorni `--delete` për heqjet e kërkuara. Inspektoni gjetjet e `--audit --dry` përpara një `--audit --write` të autorizuar; çelësat dinamikë të përkthimit kërkojnë rishikim manual të kodit burimor. Kopjojeni tekstin anglisht në çdo gjuhë vetëm për një term teknik, një markë ose një vendmbajtës.

## Faqet e Docusaurus

`scripts/translate-docs.py` është një shkrues masiv për të gjitha faqet/gjuhët dhe nuk ka filtër për skedarë të veçantë; mos e përdorni për një redaktim të ngushtë përkthimi. `scripts/check-docs-translations.py` është verifikuesi vetëm për lexim dhe mbështet `--locales` dhe `--paths`.

Mbajini blloqet e kodit, lidhjet, kodin brenda rreshtit, adresat e kontratave, titujt, tabelat dhe kutitë e shënimeve (admonitions) të përputhura me burimin anglisht. Zgjidhni gabimet e verifikuesit; paralajmërimet `frontmatter-untranslated` për emra markash mund të jenë të pritshme. Ndiqni `docs/AGENTS.md` dhe ndërtoni përmes rrënjës kur ndryshoni temën ose sjelljen i18n të dokumentacionit, që dalja statike dhe Pagefind të mbeten të përputhura.

## Rishikimi semantik opsional

Për çelësa të zgjedhur i18next, përdorni `scripts/jev/translation-README.md`. Për faqet e dokumentacionit, ekzekutoni së pari `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Kjo kërkon një përzgjedhje të shprehur gjuhësh/faqesh, ekzekuton verifikuesin strukturor dhe e raporton rishikimin semantik si të paverifikuar derisa të aktivizohet inferenca e drejtpërdrejtë. Shtoni `--live` vetëm me autorizimin e ofruesit dhe buxhetin e detyrës; konfigurimi privat i përbashkët i makinës siguron kredencialet dhe një model të fiksuar. Variablat e mjedisit dhe `--model` mund ta mbishkruajnë këtë konfigurim. Komanda nuk i redakton kurrë përkthimet.

Përshtatësi i faqeve ruan kontekstin e plotë të faqes dhe e kufizon çdo faqe në 24 KB dhe çdo ekzekutim në 30 çifte. Për faqe më të mëdha, përgatitni çifte paragrafësh burim/përkthim të përafruara shprehimisht për `translations.mjs --pairs`; mos i çiftoni paragrafët automatikisht sipas indeksit. Rezultatet semantike janë këshilluese: inspektoni problemet dhe pasiguritë e raportuara dhe ruani kontrollet deterministe të kodit/lidhjeve/adresave.
