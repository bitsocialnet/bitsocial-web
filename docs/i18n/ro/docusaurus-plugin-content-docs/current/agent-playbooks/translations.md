# Traduceri

Site-ul about folosește fișiere JSON i18next în `about/public/translations/{lang}/default.json`. Traducerile surselor Docusaurus se află separat, în `docs/i18n/`.

## Chei pentru site-ul about

Folosiți `.agents/skills/translate/SKILL.md`. Descoperiți localele curente de pe disc și păstrați placeholderele, markupul, termenii tehnici și numele de brand. Pentru cereri mai mari, agenții copii pot genera hărți independente, dar un singur agent părinte aplică serial fiecare scriere în locale; scriptul de actualizare nu are blocaj de scriere.

Folosiți o cale unică pentru hartă, care aparține sarcinii. Previzualizați cu `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, apoi aplicați cu aceleași argumente și `--write`. După scriere, verificați acoperirea și valorile și eliminați doar hărțile temporare care aparțin acestei sarcini.

Folosiți `--delete` pentru eliminările cerute. Inspectați constatările `--audit --dry` înainte de un `--audit --write` autorizat; cheile de traducere dinamice necesită o revizuire manuală a sursei. Copiați textul în engleză în fiecare locală doar pentru un termen tehnic, un brand sau un placeholder.

## Pagini Docusaurus

`scripts/translate-docs.py` scrie în masă toate paginile și localele și nu are filtru per fișier; nu îl folosiți pentru o editare punctuală a traducerilor. `scripts/check-docs-translations.py` este verificatorul care doar citește și suportă `--locales` și `--paths`.

Păstrați blocurile de cod, linkurile, codul inline, adresele de contracte, titlurile, tabelele și admonițiile aliniate cu sursa în engleză. Rezolvați erorile verificatorului; avertismentele `frontmatter-untranslated` cauzate de nume de brand pot fi de așteptat. Urmați `docs/AGENTS.md` și faceți build-ul din rădăcină atunci când modificați tema documentației sau comportamentul i18n, ca ieșirea statică și Pagefind să rămână aliniate.

## Revizuire semantică opțională

Pentru chei i18next selectate, folosiți `scripts/jev/translation-README.md`. Pentru paginile de documentație, rulați mai întâi `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Comanda cere o selecție explicită de locale și pagini, rulează verificatorul structural și raportează revizuirea semantică drept neverificată până când este activată inferența live. Adăugați `--live` doar cu autorizarea pentru furnizor și bugetul sarcinii; configurația privată comună a mașinii furnizează credențialele și un model fixat. Variabilele de mediu și `--model` pot suprascrie această configurare. Comanda nu editează niciodată traducerile.

Adaptorul pentru pagini păstrează contextul întregii pagini și limitează fiecare pagină la 24 KB și fiecare rulare la 30 de perechi. Pentru pagini mai mari, pregătiți perechi de paragrafe sursă/traducere aliniate explicit pentru `translations.mjs --pairs`; nu împerecheați automat paragrafele după index. Rezultatele semantice sunt orientative: inspectați problemele și incertitudinile raportate și păstrați verificările deterministe pentru cod, linkuri și adrese.
