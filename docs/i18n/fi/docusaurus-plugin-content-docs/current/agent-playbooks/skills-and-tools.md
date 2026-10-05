# Taidot ja työkalut

Jaetut taidot ovat hakemistossa `.agents/skills/`. Muokkaa näitä lähteitä ja aja sitten `yarn ai-workflow:sync`, joka generoi hakemiston `.claude/skills/` Claude Codea varten. Codex ja Cursor löytävät hakemiston `.agents/skills/` suoraan; älä palauta päällekkäisiä juurihakemistoja `.codex/skills/` tai `.cursor/skills/`.

Jaetut roolikehotteet ovat tiedostoissa `.agents/roles/*.md`. Tämä on repokohtainen lähdemuoto, ei agenttien natiivi löytöpolku. `scripts/ai-workflow-files.mjs` muuntaa nämä lähteet alla luetelluiksi sovelluskohtaisiksi tiedostoiksi; `yarn ai-workflow:sync` kirjoittaa ne. Commitoi generoidut tiedostot lähteidensä kanssa, jotta tuoreessa checkoutissa on natiivi määritys ilman, että generaattoria tarvitsee ajaa ensin. Kun poistat lähteen, poista sen vanhentuneet generoidut tulosteet erikseen; validaattori raportoi ne eikä poista tiedostoja hiljaisesti.

## Natiivit löytöpolut

Tarkistettu virallista dokumentaatiota vasten 2026-09-12:

| Sovellus    | Projektin ohjeet                                                                                      | Tämän repon käyttämät taidot               | Tämän repon käyttämät mukautetut agentit |
| ----------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| Codex       | `AGENTS.md`                                                                                           | `.agents/skills/<name>/SKILL.md`           | Generoitu `.codex/agents/<name>.toml`    |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` on edelleen käytettävissä Cursor-kohtaisiin ehdollisiin sääntöihin | `.agents/skills/<name>/SKILL.md`           | Generoitu `.cursor/agents/<name>.md`     |
| Claude Code | `CLAUDE.md` tuo tiedoston `@AGENTS.md`                                                                | Generoitu `.claude/skills/<name>/SKILL.md` | Generoitu `.claude/agents/<name>.md`     |

Lähteet: [Codexin taidot](https://learn.chatgpt.com/docs/build-skills), [Codexin aliagentit](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cursorin säännöt](https://cursor.com/docs/rules), [Cursorin taidot](https://cursor.com/docs/skills), [Cursorin aliagentit](https://cursor.com/docs/subagents), [Clauden muisti](https://code.claude.com/docs/en/memory), [Clauden taidot](https://code.claude.com/docs/en/skills), [Clauden aliagentit](https://code.claude.com/docs/en/sub-agents).

Älä korvaa natiiveja agenttihakemistoja hakemistolla `.agents/roles` äläkä oleta, että Claude löytää hakemiston `.agents/skills`. Claude voi silti lukea sieltä tiedoston, johon viitataan, tavallisena projektikontekstina. Cursor löytää yhteensopivuussyistä myös hakemiston `.claude/skills`; kopiot pysyvät synkronoituina, mutta Cursorin julkaistu taito-opas ei määrittele, poistetaanko kaksoiskappaleet näiden juurien välillä. Tarkista asennetun sovelluksen taitokatalogi sen sijaan, että lupaisit, ettei päällekkäisiä merkintöjä voi ilmetä.

Tekoälyhakemistot käyttävät `.gitattributes`-tiedoston kautta LF-rivinvaihtoja, jotta generoitu teksti pysyy identtisenä eri alustoilla. Taitojen tukitiedostot kopioidaan tavuina.

## Taidot

| Taito                                | Tarkoitus                                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `commit`                             | Luo valtuutettuja, rajattuja paikallisia committeja                                                       |
| `commit-format`, `issue-format`      | Muotoile ehdotuksia pyydettäessä                                                                          |
| `make-closed-issue`                  | Luo valtuutettu issue, rajattu commit ja PR                                                               |
| `review-and-merge-pr`                | Käy läpi PR-palaute; korjaa, julkaise tai yhdistä vain pyydetyn rajauksen puitteissa                      |
| `fix-merge-conflicts`                | Ratkaise konfliktit ja varmista yhdistetty tulos                                                          |
| `release`                            | Valmistele julkaisun sanamuoto ja suorita valtuutetut julkaisuvaiheet                                     |
| `code-quality-review`                | Katselmoi ei-triviaalit diffit tai nimenomaisesti pyydetty laatuhuoli                                     |
| `retro`                              | Muuta osoitetut virheet kohdennetuiksi tarkistuksiksi tai ohjeiksi, jotka estävät niiden toistumisen      |
| `refactor-pass`, `deslop`            | Olemassa olevien muutosten pyydetty siistiminen                                                           |
| `debug-agent`                        | Näyttöön perustuva virheenjäljitys, tarvittaessa instrumentoinnin avulla                                  |
| `you-might-not-need-an-effect`       | Kohdennettu efektien ja memojen katselmointi                                                              |
| `vercel-react-best-practices`        | Soveltuva React-suorituskykyohjeistus; ohita Next.js- ja palvelinkohtaiset säännöt tässä Vite-asiakkaassa |
| `translate`                          | Generoi käännökset ja vie sitten kartat yhden kirjoittajan kautta                                         |
| `playwright-cli`, `inspect-elements` | Selaintarkistus ja DOM-elementtien yhdistäminen lähdekoodiin                                              |
| `profile-browsing`                   | Rajattu selain- ja React-profilointi                                                                      |
| `test-apk`                           | Varmista toimitettu Android-kumppanikääre                                                                 |
| `impeccable`, `improve-threejs`      | Rajattu käyttöliittymäsuunnittelu ja Three.js-renderöinnin katselmointi                                   |
| `implement-plan`                     | Toteuta suunnitelma, valinnaisesti rajatulla delegoinnilla                                                |
| `readme`                             | Ylläpidä varmennettua projektidokumentaatiota                                                             |
| `context7`                           | Hae versioon sopivaa kirjastodokumentaatiota                                                              |
| `find-skills`                        | Etsi lisää taitoja, kun sitä nimenomaisesti pyydetään                                                     |

## Roolit ja mallit

Säilytä mukautetut roolit `browser-check`, `profiler`, `test-apk`, `translator` ja `reviewer`. Käytä tavalliseen toteutukseen ja koodin kartoitukseen ajoympäristön sisäänrakennettua worker-/general-purpose- tai explorer-roolia. Pääagentti määrittää hyväksymisehdot ja omistajuuden; yksi omistaja ajaa raskaat tarkistukset.

Codexin agenttitiedostot sisältävät kentät `name`, `description` ja `developer_instructions`. `.codex/config.toml` rajaa samanaikaiset aliagentit neljään asetuksella `max_concurrent_threads_per_session`. Jaetut roolimetatiedot sisältävät nimen, kuvauksen ja valinnaisen hiekkalaatikkotilan; niissä ei tarkoituksella ole mallikenttiä.

Jätä malli- ja päättelykentät pois versionhallintaan tallennetuista taidoista ja mukautetuista agenteista kaikissa kolmessa sovelluksessa. Näin ajonaikaiset kutsuvalinnat, käyttäjän oletukset ja periytyminen pääagentilta toimivat kunkin sovelluksen dokumentoidun etusijajärjestyksen mukaisesti. Clauden malliperheiden aliakset vähentävät versioiden ylläpitoa, mutta valitsevat silti perheen; versioitu Cursor-malli vaatii päivityksiä tulevaisuudessa. Pidä tällaiset valinnat tarvittaessa käyttäjä- tai istuntoasetuksissa. Periytyminen ei lupaa, että paras nykyinen malli valitaan automaattisesti. Älä keksi `latest`-aliasta äläkä lisää mallikatalogin selvittämistä rutiinitehtäviin. Katso [Codexin mallivalinta](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Clauden mallivalinta](https://code.claude.com/docs/en/sub-agents#choose-a-model) ja [Cursorin mallivalinta](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` vastaa Codexin hiekkalaatikkoa ja Cursorin asetusta `readonly`; Clauden työkalulista ja roolin ohjeet rajoittavat sen katselmointityönkulkua, mutta Bash-pääsy ei ole käyttöjärjestelmätason hiekkalaatikko.

Jaettujen taitojen frontmatter käyttää soveltuvin osin asetusta `disable-model-invocation: true` käyttäjän käynnistämissä työnkuluissa. Codexin vastaava asetus on tiedostossa `agents/openai.yaml` muodossa `policy.allow_implicit_invocation: false`; validaattori vaatii molemmat. Kutsumetatiedot täydentävät nimenomaisia valtuutussääntöjä; katselmointipyyntö ei koskaan valtuuta julkaisemaan pelkästään siksi, että taito sisältää julkaisuvaiheita.

## Tarkistukset ja löytäminen

- `yarn ai-workflow:sync` generoi yhteensopivuustulosteet uudelleen asennettujen pakettien `js-yaml` ja `smol-toml` avulla.
- `yarn ai-workflow:check` jäsentää lähteet, frontmatterin ja asetustiedostot sekä tarkistaa generoidut tulosteet, kutsumetatiedot, mallikenttien sijoittelun ja pelkkää muotoilua tekevän koukun kytkennät. Se ei tarkista mallitunnisteita palveluntarjoajan katalogia vasten.
- `yarn ai-workflow:test` ajaa eristettyjä Node-fixtureja koukkujen hyötykuormille sekä työnkulun generoinnille ja validoinnille.
- Kun päivität agenttisovelluksen, varmista taitojen ja roolien löytyminen kyseisessä sovelluksessa. Syntaksi- ja vastaavuustarkistukset eivät korvaa lataajan tarkistusta. Lataa sovellus uudelleen, jos olemassa oleva istunto säilyttää vanhan katalogin.
- Koukut edellyttävät, että ajoympäristö luottaa projektiin ja että koukut on katselmoitu; älä ohita luottamusta saadaksesi tarkistuksen läpi. Katso [hooks-setup.md](hooks-setup.md).

## Hyödyllisten ohjeiden ylläpito

Noudata [OpenAI:n taito- ja kehoteohjeistusta](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (tarkistettu 2026-09-12): pidä kuvaukset täsmällisinä, lataa yksityiskohdat vain, kun ne ovat olennaisia, ja säilytä käyttäjän pyytämä rajaus. Jaetut taidot palvelevat eri malleja; säilytä projektikohtaiset invariantit, mutta salli rutiininomaiset toteutusvalinnat.

Pidä taidon tarkoitus, päätösrajat ja olennaiset rajoitteet tiedostossa `SKILL.md`. Linkitä laajat tilakohtaiset komennot tai esimerkit valinnaisina viitteinä. Sijoita laukaisuehdot lyhyiden kuvausten alkuun; pelkkä osuva avainsana ei saa laajentaa tehtävää. Säilytä olemassa olevat kutsumetatiedot, ellei niiden toimintaa ole tarkoitus muuttaa.

Kokeile merkittävän ohjemuutoksen jälkeen muutamaa edustavaa pientä ja suurta pyyntöä. Tarkista, mitkä taidot ja viitteet valittiin, pysyivätkö toimet rajauksen sisällä, vastasiko varmistus muutosta ja valmistuiko valtuutettu työ. Skeema- ja fixture-testit osoittavat työkalujen oikeellisuuden, eivät agentin päätöksenteon laatua.

## Työkalut ja selainten omistajuus

Suosi olemassa olevaa taito- ja työkalukatalogia sekä projektiin asennettuja komentorivityökaluja. Käytä GitHubiin työkalua `gh`, selaintarkistukseen työkalua `playwright-cli` ja virallista, versiokohtaista dokumentaatiota, kun kirjaston toiminnalla on merkitystä. Vältä päällekkäisten taitojen asentamista tai kiinnittämättömän paketin hakemista pelkästään olemassa olevan muotoilijan ajamiseksi.

MCP:n aiheuttama kuorma riippuu ajoympäristöstä: viivästetty työkalujen lataus voi välttää jokaisen skeeman lataamisen etukäteen. Pidä integraatiot olennaisina sen sijaan, että pitäisit MCP:tä itsessään vanhentuneena. Nykyiset komentorivityökaluvalinnat ovat edelleen hyödyllisiä toistettavuuden ja resurssien hallinnan kannalta.

Kaikki selainistunnot käyttävät skriptiä `./scripts/pw-session.sh`, joka sallii koko koneella vain yhden aktiivisen selaimen. Käytä oletuksena tuoretta, eristettyä istuntoa. Pääsy käyttäjän nykyiseen henkilökohtaiseen selaimeen vaatii nimenomaisen valtuutuksen; käytä tätä valtuutusta uudelleen seuraavissa vaiheissa. Valitse selaimet ja näkymäkoot muuttuneen toiminnan mukaan, aja valitut moottorit peräkkäin, sulje täsmälleen nimetty istunto siivousvaiheessa äläkä koskaan käytä komentoja `close-all`/`kill-all`. Katso `playwright-cli`-taito ja [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
