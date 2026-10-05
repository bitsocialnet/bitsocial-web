# Oversettelser

About-nettstedet bruker i18next-JSON i `about/public/translations/{lang}/default.json`. Kildeoversettelsene for Docusaurus ligger separat i `docs/i18n/`.

## Nøkler for about-nettstedet

Bruk `.agents/skills/translate/SKILL.md`. Finn gjeldende lokaler fra disken, og bevar plassholdere, markup, tekniske termer og merkenavn. Ved større forespørsler kan underagenter generere uavhengige map-filer, men én foreldreagent utfører hver skriving til lokalene serielt; oppdateringsskriptet har ingen skrivelås.

Bruk en unik sti for map-filen som tilhører oppgaven. Forhåndsvis med `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, og ta det deretter i bruk med de samme argumentene og `--write`. Verifiser dekning/verdier etter skrivingen, og fjern bare de midlertidige map-filene som tilhører denne oppgaven.

Bruk `--delete` for forespurte fjerninger. Gå gjennom funnene fra `--audit --dry` før en autorisert `--audit --write`; dynamiske oversettelsesnøkler krever manuell gjennomgang av kildekoden. Kopier engelsk til alle lokaler bare for en teknisk term, et merkenavn eller en plassholder.

## Docusaurus-sider

`scripts/translate-docs.py` er en masseskriver for alle sider/lokaler og har ikke noe filter per fil; ikke bruk den til en avgrenset oversettelsesendring. `scripts/check-docs-translations.py` er den skrivebeskyttede verifikatoren og støtter `--locales` og `--paths`.

Hold kodeblokker, lenker, inline-kode, kontraktadresser, overskrifter, tabeller og admonitions i samsvar med den engelske kilden. Løs feil fra verifikatoren; `frontmatter-untranslated`-advarsler for merkenavn er forventet. Følg `docs/AGENTS.md`, og bygg via roten når du endrer dokumentasjonens tema eller i18n-atferd, slik at statisk utdata og Pagefind holder seg i takt.

## Valgfri semantisk gjennomgang

For utvalgte i18next-nøkler, bruk `scripts/jev/translation-README.md`. For dokumentasjonssider, kjør `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md` først. Dette krever et eksplisitt utvalg av lokaler/sider, kjører den strukturelle verifikatoren og rapporterer den semantiske gjennomgangen som uverifisert inntil live-inferens er aktivert. Legg til `--live` bare med oppgavens leverandørautorisasjon og budsjett; den delte private maskinkonfigurasjonen leverer legitimasjon og en låst modell. Miljøvariabler og `--model` kan overstyre dette oppsettet. Kommandoen redigerer aldri oversettelser.

Sideadapteren bevarer konteksten for hele siden og begrenser hver side til 24 KB og hver kjøring til 30 par. For større sider, klargjør eksplisitt justerte par av kilde- og oversettelsesavsnitt for `translations.mjs --pairs`; ikke par avsnitt automatisk etter indeks. Semantiske resultater er veiledende: undersøk rapporterte problemer og usikkerhet, og behold de deterministiske sjekkene av kode, lenker og adresser.
