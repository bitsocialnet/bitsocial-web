# Käännökset

About-sivusto käyttää i18next-JSON-tiedostoja polussa `about/public/translations/{lang}/default.json`. Docusauruksen lähdekäännökset ovat erikseen hakemistossa `docs/i18n/`.

## About-sivuston avaimet

Käytä ohjetta `.agents/skills/translate/SKILL.md`. Selvitä nykyiset kieliversiot levyltä ja säilytä paikkamerkit, merkintäkoodi, tekniset termit ja brändinimet. Suuremmissa pyynnöissä aliagentit voivat tuottaa toisistaan riippumattomia karttoja, mutta yksi pääagentti tekee jokaisen kieliversion kirjoituksen sarjassa; päivitysskriptissä ei ole kirjoituslukkoa.

Käytä yksilöllistä, tehtävän omistamaa karttapolkua. Esikatsele komennolla `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` ja vie sitten muutokset samoilla argumenteilla ja valinnalla `--write`. Varmista kattavuus ja arvot kirjoittamisen jälkeen ja poista vain tämän tehtävän omistamat väliaikaiset kartat.

Käytä valintaa `--delete` pyydettyihin poistoihin. Tarkastele `--audit --dry` -havaintoja ennen valtuutettua `--audit --write` -ajoa; dynaamiset käännösavaimet vaativat lähdekoodin manuaalisen tarkastelun. Kopioi englanninkielinen teksti jokaiseen kieliversioon vain, kun kyse on teknisestä termistä, brändistä tai paikkamerkistä.

## Docusaurus-sivut

`scripts/translate-docs.py` on kaikkien sivujen ja kieliversioiden massakirjoitin, eikä siinä ole tiedostokohtaista suodatinta; älä käytä sitä suppeaan käännösmuutokseen. `scripts/check-docs-translations.py` on vain lukeva tarkistin ja tukee valintoja `--locales` ja `--paths`.

Pidä koodilohkot, linkit, rivinsisäinen koodi, sopimusosoitteet, otsikot, taulukot ja huomautuslohkot linjassa englanninkielisen lähteen kanssa. Korjaa tarkistimen virheet; brändinimiä koskevia `frontmatter-untranslated`-varoituksia voi odottaa. Noudata tiedostoa `docs/AGENTS.md` ja kokoa juuren kautta, kun muutat dokumentaation teemaa tai i18n-toimintaa, jotta staattinen tuloste ja Pagefind pysyvät linjassa.

## Valinnainen semanttinen katselmointi

Valituille i18next-avaimille käytä ohjetta `scripts/jev/translation-README.md`. Dokumentaatiosivuille aja ensin `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Komento vaatii nimenomaisen kieliversio- ja sivuvalinnan, ajaa rakenteellisen tarkistimen ja raportoi semanttisen katselmoinnin varmistamattomaksi, kunnes live-päättely on otettu käyttöön. Lisää `--live` vain, kun tehtävällä on palveluntarjoajan valtuutus ja budjetti; jaettu yksityinen konekohtainen määritys tarjoaa tunnistetiedot ja kiinnitetyn mallin. Ympäristömuuttujat ja `--model` voivat ohittaa tämän määrityksen. Komento ei koskaan muokkaa käännöksiä.

Sivusovitin säilyttää koko sivun kontekstin ja rajaa jokaisen sivun 24 kilotavuun ja jokaisen ajon 30 pariin. Suuremmille sivuille valmistele nimenomaisesti kohdistetut lähde- ja käännöskappaleparit komennolle `translations.mjs --pairs`; älä muodosta kappalepareja automaattisesti järjestysnumeron perusteella. Semanttiset tulokset ovat neuvoa-antavia: tarkastele raportoituja ongelmia ja epävarmuutta ja säilytä deterministiset koodi-, linkki- ja osoitetarkistukset.
