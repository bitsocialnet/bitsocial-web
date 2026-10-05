# Verificare

Alegeți verificările în funcție de comportamentul modificat și de incertitudinea care rămâne. Refolosiți dovezile reușite pentru aceeași stare finală; rulați din nou după editări relevante sau după eșecuri. Cerințele explicite de CI, de release sau ale utilizatorului se aplică în continuare.

| Modificare                                                      | Verificări potrivite                                                                                                              |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Doar text, comentarii sau formatare                             | Diff, referințe, generatoare relevante; fără build al aplicației                                                                  |
| Surse/configurație ale fluxului de lucru AI                     | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; regenerați indexurile LLM când s-a schimbat contextul |
| Helper sau script izolat                                        | Invocare/fixture-uri țintite și verificări de sintaxă sau de tipuri/lint pentru codul afectat                                     |
| Modificare de runtime partajat, dependențe, build sau integrare | Verificări țintite pe zonele afectate, plus verificările relevante de build/tipuri/lint de mai jos                                |
| Doar CSS/temă/layout                                            | Rutele/viewporturile/temele afectate în browserele selectate; build când s-au schimbat importurile, resursele sau procesarea CSS  |
| Stare/efecte/performanță React                                  | Comportamentul afectat și îndrumările React aplicabile; Doctor când diagnosticele lui lămuresc o problemă concretă                |

## Verificări de proiect

- `yarn build:verify` selectează workspace-ul afectat. Pentru un domeniu cunoscut, folosiți `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` sau `yarn docs:build:verify`.
- `yarn build` rulează intenționat build-ul complet de producție pentru about și documentație, inclusiv toate localele documentației. Folosiți-l pentru validarea la nivelul întregului release sau pentru modificări care justifică acest domeniu.
- `yarn lint`, `yarn typecheck` și `yarn format:check` acoperă barierele de verificare existente ale depozitului; pentru o editare restrânsă a unui script, folosiți mai întâi verificările lui țintite de sintaxă, fixture-uri și formatare.
- Modificările de manifest sau de lockfile necesită `corepack yarn install`, `yarn deps:check-pinned` și `yarn deps:check-hardened`. `yarn knip` are rol consultativ pentru dependențe și importuri.
- Verificările traducerilor documentației sunt descrise în [translations.md](translations.md); nu rulați scriptul de scriere în masă a traducerilor pentru o modificare punctuală a documentației.

## Dovezi din browser și proprietatea sesiunilor

Folosiți Chrome pentru modificări mici și izolate în browser. Adăugați Firefox și WebKit pentru CSS, layout sau responsivitate partajate, API-uri sensibile la browser, interacțiuni ample, release-uri sau criterii explicite de compatibilitate între browsere. Includeți layout-urile mobile și comportamentul tactil afectate. O simplă redimensionare a viewportului nu înseamnă emularea atingerii. Alegeți rute și conținut reale pe baza sursei, în loc să presupuneți că exemplele sunt disponibile.

Folosiți `playwright-cli` prin `./scripts/pw-session.sh`. Un singur browser este activ la nivelul întregii mașini; motoarele selectate rulează secvențial, iar fiecare sesiune proprie, identificată exact, se închide chiar și după un eșec. Refolosiți fără să o închideți o sesiune autorizată care aparține apelantului. Nu folosiți niciodată curățarea globală a browserelor și nu opriți un server al cărui proprietar nu este clar. Lucrul exclusiv la documentație nu are nevoie de browser sau de server.

Pentru lucrul la performanță, comparați același flux cu viewport, conținut, setări de rețea/CPU, mod de build și cost de măsurare echivalente. Distingeți observațiile de cauzele bănuite. Folosiți skill-ul de profilare atunci când aceste măsurători răspund la cererea efectivă.

## Dovezi finale

Un singur agent se ocupă de verificarea grea. Inspectați sarcinile active și serializați instalările, build-urile și suitele complete, Doctor, lucrul pe Android/Electron și profilarea în browser. Raportați comenzile și rezultatele lor, precum și limitările concrete; datele lipsă sau un motor omis nu reprezintă un rezultat reușit. Fixture-urile instrumentelor verifică formatele și mecanica, nu descoperirea end-to-end în aplicație sau calitatea deciziilor modelului.

## Verificări React automate

`yarn agent:verify` rulează build-urile selectate, urmate de `yarn doctor:check` și `yarn perf:check`. `perf:check` include autotestul de compatibilitate a colectorului și de regresie deliberată, așa că nici CI, nici calea de verificare a agentului nu au nevoie de o trecere separată `perf:test`. Instalați o singură dată instrumentele de browser fixate cu `yarn perf:install` (`--with-deps` în CI pe Linux). Folosiți filtre de țintă sau de scenariu pentru rulările repetate țintite, după trecerea completă relevantă. Bugetele scenariilor sunt explicite în `scripts/react-perf/config.mjs`; păstrați dovezile și remediați o regresie înainte de a lua în calcul o modificare justificată a liniei de bază. Build-urile obișnuite de producție omit Bippy; comenzile separate `build:profile:*` furnizează instrumentarea oficială de profilare React.

Scenariul `apps-search` din about își stabilește ritmul așteptând, după fiecare caracter, ca valoarea URL-ului și a câmpului de intrare să fie aplicată. Rezultatul lui reușit acoperă acea secvență de interogări aplicate, nu reactivitatea la tastarea rapidă. Folosiți o reproducere separată, cu introducere rapidă, atunci când evaluați pierderea de caractere sau reactivitatea la introducere.
