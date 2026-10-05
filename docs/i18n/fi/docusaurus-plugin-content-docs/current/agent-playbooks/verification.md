# Varmistus

Valitse tarkistukset muuttuneen toiminnan ja jäljellä olevan epävarmuuden perusteella. Käytä onnistunutta näyttöä uudelleen, kun lopputila on sama; aja uudelleen olennaisten muokkausten tai epäonnistumisten jälkeen. Nimenomaiset CI-, julkaisu- ja käyttäjävaatimukset ovat edelleen voimassa.

| Muutos                                                                           | Sopivat tarkistukset                                                                                                              |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Vain proosa/kommentit/muotoilu                                                   | Diff, viittaukset, asiaankuuluvat generaattorit; ei sovelluksen koontia                                                           |
| Tekoälytyönkulun lähteet/asetukset                                               | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; generoi LLM-indeksit uudelleen, kun konteksti muuttui |
| Erillinen apuohjelma tai skripti                                                 | Kohdennettu ajo/fixturet sekä muutetun koodin syntaksi- tai tyyppi-/lint-tarkistukset                                             |
| Muutos jaettuun ajonaikaiseen koodiin, riippuvuuteen, koontiin tai integraatioon | Kohdennetut tarkistukset muutetulle alueelle sekä alla luetellut asiaankuuluvat koonti-/tyyppi-/lint-tarkistukset                 |
| Vain CSS/teema/asettelu                                                          | Muutetut reitit/näkymäkoot/teemat valituissa selaimissa; koonti, kun tuonnit, resurssit tai CSS-käsittely muuttuivat              |
| React-tila/efektit/suorituskyky                                                  | Muuttunut toiminta ja soveltuva React-ohjeistus; Doctor, kun sen diagnostiikka selvittää konkreettisen huolenaiheen               |

## Projektin tarkistukset

- `yarn build:verify` valitsee muutetun työtilan. Kun rajaus on tiedossa, käytä komentoa `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` tai `yarn docs:build:verify`.
- `yarn build` ajaa tarkoituksella koko tuotantotason about-/docs-koonnin, mukaan lukien kaikki dokumentaation kieliversiot. Käytä sitä koko julkaisun kattavaan validointiin tai muutoksiin, jotka edellyttävät tätä laajuutta.
- `yarn lint`, `yarn typecheck` ja `yarn format:check` kattavat repon olemassa olevat portit; kapeassa skriptimuutoksessa käytä ensin sen kohdennettuja syntaksi-, fixture- ja muotoilutarkistuksia.
- Manifesti- tai lukkotiedostomuutokset edellyttävät komentoja `corepack yarn install`, `yarn deps:check-pinned` ja `yarn deps:check-hardened`. `yarn knip` on riippuvuuksien ja tuontien osalta neuvoa-antava.
- Dokumentaation käännöstarkistukset kuvataan sivulla [translations.md](translations.md); älä aja massakäännöskirjoitinta kohdennetussa dokumentaatiomuutoksessa.

## Selaintodisteet ja omistajuus

Käytä Chromea pieniin, erillisiin selainmuutoksiin. Lisää Firefox ja WebKit, kun kyse on jaetusta CSS:stä, asettelusta tai responsiivisuudesta, selainherkistä API-rajapinnoista, laajoista vuorovaikutuksista, julkaisuista tai nimenomaisista selainten välisistä kriteereistä. Ota mukaan muuttuneet mobiiliasettelut ja kosketuskäyttäytyminen. Pelkkä näkymän koon muuttaminen ei ole kosketuksen emulointia. Valitse todelliset reitit ja sisältö lähdekoodin perusteella sen sijaan, että olettaisit esimerkkien olevan saatavilla.

Käytä `playwright-cli`-työkalua skriptin `./scripts/pw-session.sh` kautta. Koko koneella on kerrallaan yksi aktiivinen selain; valitut moottorit ajetaan peräkkäin, ja jokainen oma istunto suljetaan täsmällisellä nimellään myös epäonnistumisen jälkeen. Käytä valtuutettua, kutsujan omistamaa istuntoa uudelleen sulkematta sitä. Älä koskaan käytä globaalia selainsiivousta äläkä pysäytä palvelinta, jonka omistaja on epäselvä. Pelkkä dokumentaatiotyö ei vaadi selainta tai palvelinta.

Suorituskykytyössä vertaa samaa kulkua vastaavalla näkymäkoolla, sisällöllä, verkko- ja suoritinasetuksilla, koontitilalla ja mittauskuormalla. Erota havainnot epäillyistä syistä. Käytä profilointitaitoa, kun nämä mittaukset vastaavat varsinaiseen pyyntöön.

## Lopulliset todisteet

Yksi agentti omistaa raskaan varmistuksen. Tarkastele käynnissä olevia työkuormia ja sarjallista asennukset, koonnit ja täydet testisarjat, Doctorin, Android- ja Electron-työn sekä selainprofiloinnin. Raportoi komennot ja tulokset sekä täsmälliset rajoitukset; puuttuva data tai väliin jätetty moottori ei ole hyväksytty tulos. Työkalujen fixturet varmistavat muodot ja mekaniikan, eivät sitä, löytääkö sovellus asiat päästä päähän, eivätkä mallin päätöksenteon laatua.

## Automaattiset React-tarkistukset

`yarn agent:verify` ajaa valitut koonnit ja niiden jälkeen komennot `yarn doctor:check` ja `yarn perf:check`. `perf:check` sisältää keräimen yhteensopivuus- ja tahallisen regression itsetestin, joten CI tai agentin varmistuspolku ei tarvitse erillistä `perf:test`-ajoa. Asenna kiinnitetyt selaintyökalut kerran komennolla `yarn perf:install` (Linux-CI:ssä `--with-deps`). Käytä kohde- ja skenaariosuodattimia kohdennettuihin uudelleenajoihin koko asiaankuuluvan ajon jälkeen. Skenaarioiden budjetit on määritetty nimenomaisesti tiedostossa `scripts/react-perf/config.mjs`; säilytä todisteet ja korjaa regressio ennen kuin harkitset perusteltua vertailutason muutosta. Tavalliset tuotantokoonnit jättävät Bippyn pois; erilliset `build:profile:*`-komennot tarjoavat Reactin virallisen profilointi-instrumentoinnin.

About-sivuston `apps-search`-skenaariota tahditetaan jokaisen merkin kohdalla vahvistetuilla URL- ja syötearvoilla. Sen hyväksytty tulos kattaa tämän vahvistettujen kyselyjen sarjan, ei nopean kirjoittamisen responsiivisuutta. Käytä erillistä nopean syötteen toisintoa, kun arvioit merkkien katoamista tai syötteen responsiivisuutta.
