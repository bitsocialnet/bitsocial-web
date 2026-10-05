# Skill-uri și instrumente

Skill-urile comune se află în `.agents/skills/`. Editați aceste surse, apoi rulați `yarn ai-workflow:sync` pentru a genera `.claude/skills/` pentru Claude Code. Codex și Cursor descoperă direct `.agents/skills/`; nu restaurați rădăcinile duplicate `.codex/skills/` sau `.cursor/skills/`.

Prompturile comune pentru roluri se află în `.agents/roles/*.md`. Acesta este un format sursă specific depozitului, nu o cale nativă de descoperire a agenților. `scripts/ai-workflow-files.mjs` convertește aceste surse în fișierele specifice fiecărei aplicații, enumerate mai jos; `yarn ai-workflow:sync` le scrie. Includeți fișierele generate în commit împreună cu sursele lor, astfel încât un checkout proaspăt să aibă configurația nativă fără a rula mai întâi un generator. După eliminarea unei surse, eliminați explicit ieșirile generate devenite inutile; validatorul le raportează, în loc să șteargă fișiere în tăcere.

## Căi native de descoperire

Verificat în raport cu documentația oficială la 2026-09-12:

| Aplicație   | Instrucțiuni de proiect                                                                          | Skill-uri folosite de acest depozit       | Agenți personalizați folosiți de acest depozit |
| ----------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------- | ---------------------------------------------- |
| Codex       | `AGENTS.md`                                                                                      | `.agents/skills/<name>/SKILL.md`          | `.codex/agents/<name>.toml`, generat           |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` rămâne disponibil pentru reguli condiționale specifice Cursor | `.agents/skills/<name>/SKILL.md`          | `.cursor/agents/<name>.md`, generat            |
| Claude Code | `CLAUDE.md` importă `@AGENTS.md`                                                                 | `.claude/skills/<name>/SKILL.md`, generat | `.claude/agents/<name>.md`, generat            |

Surse: [Skill-uri Codex](https://learn.chatgpt.com/docs/build-skills), [Subagenți Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Reguli Cursor](https://cursor.com/docs/rules), [Skill-uri Cursor](https://cursor.com/docs/skills), [Subagenți Cursor](https://cursor.com/docs/subagents), [Memoria Claude](https://code.claude.com/docs/en/memory), [Skill-uri Claude](https://code.claude.com/docs/en/skills), [Subagenți Claude](https://code.claude.com/docs/en/sub-agents).

Nu înlocuiți directoarele native de agenți cu `.agents/roles` și nu presupuneți că Claude descoperă `.agents/skills`. Claude poate totuși citi un fișier de acolo, la care se face referire, ca simplu context de proiect. Cursor descoperă și `.claude/skills`, pentru compatibilitate; copiile rămân sincronizate, dar ghidul publicat pentru skill-uri nu precizează cum se deduplică acestea între rădăcini. Verificați catalogul de skill-uri al aplicației instalate, în loc să promiteți că nu pot apărea intrări duplicate.

Directoarele AI folosesc terminații de linie LF prin `.gitattributes`, astfel încât textul generat să rămână identic pe toate platformele. Resursele auxiliare ale skill-urilor sunt copiate octet cu octet.

## Skill-uri

| Skill                                | Scop                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Creează commit-uri locale autorizate și bine delimitate                                                                |
| `commit-format`, `issue-format`      | Formatează sugestii, la cerere                                                                                         |
| `make-closed-issue`                  | Creează un issue autorizat, un commit bine delimitat și un PR                                                          |
| `review-and-merge-pr`                | Triază feedbackul la PR-uri; corectează, publică sau face merge doar în limitele cererii                               |
| `fix-merge-conflicts`                | Rezolvă conflictele și verifică rezultatul integrat                                                                    |
| `release`                            | Pregătește textul release-ului și execută pașii de release autorizați                                                  |
| `code-quality-review`                | Revizuiește diff-uri netriviale sau o problemă de calitate cerută explicit                                             |
| `retro`                              | Transformă greșelile demonstrate în verificări sau îndrumări țintite, care previn repetarea lor                        |
| `refactor-pass`, `deslop`            | Curățarea cerută a modificărilor existente                                                                             |
| `debug-agent`                        | Depanare bazată pe dovezi, cu instrumentare atunci când este nevoie                                                    |
| `you-might-not-need-an-effect`       | Revizuire țintită a efectelor și a memoizării                                                                          |
| `vercel-react-best-practices`        | Îndrumări aplicabile de performanță React; regulile pentru Next.js sau doar pentru server se omit la acest client Vite |
| `translate`                          | Generează traduceri, apoi aplică hărțile printr-un singur proces de scriere                                            |
| `playwright-cli`, `inspect-elements` | Verificare în browser și maparea DOM-ului la sursă                                                                     |
| `profile-browsing`                   | Profilare delimitată a browserului și a React                                                                          |
| `test-apk`                           | Verifică un wrapper Android însoțitor primit                                                                           |
| `impeccable`, `improve-threejs`      | Design de interfață delimitat și revizuirea randării Three.js                                                          |
| `implement-plan`                     | Execută un plan, cu delegare opțională în limite clare                                                                 |
| `readme`                             | Întreține documentație de proiect verificată                                                                           |
| `context7`                           | Obține documentația bibliotecilor potrivită versiunii                                                                  |
| `find-skills`                        | Găsește skill-uri suplimentare, când se cere explicit                                                                  |

## Roluri și modele

Păstrați rolurile personalizate pentru `browser-check`, `profiler`, `test-apk`, `translator` și `reviewer`. Pentru implementarea obișnuită și descoperirea codului, folosiți rolul integrat al harness-ului de tip worker/general-purpose sau explorer. Agentul părinte stabilește criteriile de acceptare și proprietatea; un singur proprietar rulează verificările grele.

Fișierele de agent Codex includ `name`, `description` și `developer_instructions`. `.codex/config.toml` limitează la patru numărul subagenților concurenți prin `max_concurrent_threads_per_session`. Metadatele comune ale rolurilor conțin numele, descrierea și modul sandbox opțional; în mod deliberat, nu au câmpuri de model.

Lăsați câmpurile de model și de raționament în afara skill-urilor și agenților personalizați incluși în depozit, în toate cele trei aplicații. Astfel rămân posibile alegerile făcute la invocare, valorile implicite ale utilizatorului și moștenirea de la părinte, conform ordinii de precedență documentate a fiecărei aplicații. Aliasurile de familie Claude reduc întreținerea legată de versiuni, dar tot aleg o familie; un model Cursor cu versiune fixă necesită actualizări viitoare. Păstrați astfel de alegeri în setările utilizatorului sau ale sesiunii, când este nevoie. Moștenirea nu garantează alegerea automată a celui mai bun model actual. Nu inventați un alias `latest` și nu adăugați cercetarea catalogului de modele la sarcinile de rutină. Consultați [selecția în Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [selecția în Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) și [selecția în Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` corespunde sandboxului din Codex și opțiunii `readonly` din Cursor; lista de instrumente a lui Claude și instrucțiunile rolului îi restricționează fluxul de revizuire, dar accesul la Bash nu este un sandbox la nivelul sistemului de operare.

Frontmatter-ul skill-urilor comune folosește `disable-model-invocation: true` pentru fluxurile invocate de utilizator, acolo unde se aplică. Setarea corespunzătoare din Codex se află în `agents/openai.yaml`, sub forma `policy.allow_implicit_invocation: false`; validatorul le cere pe amândouă. Metadatele de invocare completează regulile explicite de autorizare; o cerere de revizuire nu autorizează niciodată publicarea doar pentru că un skill include pași de publicare.

## Verificări și descoperire

- `yarn ai-workflow:sync` regenerează ieșirile de compatibilitate folosind pachetele instalate `js-yaml` și `smol-toml`.
- `yarn ai-workflow:check` parsează sursele, frontmatter-ul și configurațiile și verifică ieșirile generate, metadatele de invocare, amplasarea câmpurilor de model și conectarea hook-ului care doar formatează. Nu verifică identificatorii de model în catalogul vreunui furnizor.
- `yarn ai-workflow:test` rulează fixture-uri Node izolate pentru payload-urile hook-urilor și pentru generarea și validarea fluxului de lucru.
- După actualizarea unei aplicații de agent, verificați în acea aplicație descoperirea skill-urilor și a rolurilor. Verificările de sintaxă și de paritate nu înlocuiesc o verificare a încărcătorului. Reîncărcați aplicația dacă o sesiune existentă păstrează un catalog vechi.
- Hook-urile necesită încrederea în proiect și revizuirea hook-urilor din harness; nu ocoliți mecanismul de încredere ca să treacă o verificare. Consultați [hooks-setup.md](hooks-setup.md).

## Menținerea unor instrucțiuni utile

Urmați [îndrumările OpenAI despre skill-uri și prompturi](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (consultate la 2026-09-12): păstrați descrierile precise, încărcați detaliile doar când sunt relevante și respectați domeniul cerut de utilizator. Skill-urile comune servesc modele diferite; păstrați invarianții specifici proiectului, lăsând totodată loc alegerilor de implementare de rutină.

Păstrați în `SKILL.md` scopul unui skill, limitele lui de decizie și constrângerile esențiale. Legați comenzile sau exemplele ample, specifice unui anumit mod, ca referințe opționale. Puneți condițiile de declanșare la începutul descrierilor scurte; un simplu cuvânt-cheie care se potrivește nu ar trebui să extindă sarcina. Păstrați metadatele de invocare existente, cu excepția cazului în care comportamentul lor este schimbat intenționat.

După o modificare substanțială a instrucțiunilor, încercați câteva cereri reprezentative, mici și mari. Verificați ce skill-uri și referințe au fost selectate, dacă acțiunile au rămas în limitele cererii, dacă verificarea s-a potrivit cu modificarea și dacă lucrul autorizat a fost dus la capăt. Testele de schemă și fixture-urile stabilesc corectitudinea instrumentelor, nu calitatea deciziilor agentului.

## Instrumente și proprietatea browserului

Preferați catalogul existent de skill-uri și instrumente și CLI-urile instalate ale proiectului. Folosiți `gh` pentru GitHub, `playwright-cli` pentru verificarea în browser și documentația oficială, specifică versiunii, atunci când contează comportamentul bibliotecii. Evitați instalarea de skill-uri duplicate sau descărcarea unui pachet nefixat doar pentru a rula un formator existent.

Costul suplimentar al MCP depinde de harness: încărcarea amânată a instrumentelor poate evita încărcarea tuturor schemelor de la început. Păstrați integrările relevante, în loc să tratați MCP ca fiind depășit în sine. Alegerile existente bazate pe CLI rămân utile pentru reproductibilitate și pentru controlul resurselor.

Toate sesiunile de browser folosesc `./scripts/pw-session.sh`, care impune un singur browser activ la nivelul întregii mașini. Implicit, folosiți o sesiune nouă, izolată. Accesul la browserul personal curent necesită autorizare explicită; refolosiți acea autorizare în pașii următori. Alegeți browserele și viewporturile în funcție de comportamentul afectat, rulați secvențial motoarele selectate, închideți la curățare exact sesiunea denumită și nu folosiți niciodată `close-all`/`kill-all`. Consultați skill-ul `playwright-cli` și [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
