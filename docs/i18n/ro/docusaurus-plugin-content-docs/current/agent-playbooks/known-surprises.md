# Surprize cunoscute

Acest fișier ține evidența punctelor de confuzie specifice acestui depozit care au dus la greșeli ale agenților.

## Criterii de includere

Adăugați o intrare doar dacă toate condițiile de mai jos sunt îndeplinite:

- Este specifică acestui depozit (nu este un sfat generic).
- Este probabil să reapară pentru agenții viitori.
- Are o mitigare concretă, care poate fi urmată întocmai.

Dacă nu sunteți sigur, întrebați dezvoltatorul înainte de a adăuga o intrare.

## Șablon de intrare

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## Intrări

### Domeniile de producție ale aplicațiilor de pe Vercel pot reveni la deployment-urile din Git master

- **Dată:** 2026-04-28
- **Observat de:** Tommaso + Codex
- **Context:** verificarea mirror-elor aplicațiilor Seedit și 5chan din directorul de aplicații Bitsocial Web.
- **Ce a fost surprinzător:** proiectele Vercel `seedit` și `5chan` aveau `gitProviderOptions.createDeployments = "enabled"`, așa că push-urile pe `master` din GitHub erau promovate pe domeniile de producție, deși politica depozitului cere ca mirror-ele de producție ale aplicațiilor să servească doar artefacte de release.
- **Impact:** insignele de mirror verificat din directorul de aplicații pot deveni false, pentru că domeniile de producție servesc cel mai recent commit de dezvoltare în locul arhivei ZIP de release de pe GitHub, al cărei hash `index.html` este consemnat în `about/src/lib/apps-data.ts`.
- **Mitigare:** înainte de a adăuga sau de a reîmprospăta metadatele de verificare a mirror-elor, inspectați proiectul Vercel cu `vercel api /v9/projects/<project-id>` și confirmați că `gitProviderOptions.createDeployments = "disabled"`. Publicați conținutul arhivei ZIP de release cu `vercel deploy --prebuilt --prod` și folosiți `seedit-omega.vercel.app` sau `5chan-omega.vercel.app` pentru deployment-urile de dezvoltare.
- **Stare:** confirmat

### Portless 0.11 reutilizează starea veche a proxy-ului dacă launcher-ul nu forțează HTTPS

- **Dată:** 2026-04-28
- **Observat de:** Tommaso + Codex
- **Context:** trecerea fluxului obișnuit `yarn start` de la vechiul URL de proxy `http://bitsocial.localhost:1355` la `https://bitsocial.localhost`.
- **Ce a fost surprinzător:** chiar și cu `portless@0.11.1` instalat, Portless refolosea proxy-ul HTTP existent `~/.portless/proxy.port = 1355` și afișa vechiul URL `:1355`.
- **Impact:** actualizarea versiunilor de pachete și a documentației nu este suficientă; `yarn start` poate în continuare să anunțe și să folosească vechiul URL atunci când un contribuitor are pornită o stare Portless veche.
- **Mitigare:** păstrați scripturile de pornire astfel încât să pornească explicit proxy-ul HTTPS Portless pe portul `443` înainte de a înregistra rutele aplicației, pentru ca fluxul de execuție să se desprindă de starea persistentă `1355` în loc să o moștenească.
- **Stare:** confirmat

### Portless schimbă URL-ul local canonic al aplicației

- **Dată:** 2026-03-18
- **Observat de:** Codex
- **Context:** verificări în browser și fluxuri de smoke test
- **Ce a fost surprinzător:** URL-ul local implicit nu este portul obișnuit al Vite. Depozitul așteaptă `https://bitsocial.localhost` prin Portless, așa că verificarea adreselor `localhost:3000` sau `localhost:5173` poate ajunge la aplicația greșită sau la nimic.
- **Impact:** verificările din browser pot eșua sau pot valida ținta greșită chiar și atunci când serverul de dezvoltare funcționează corect.
- **Mitigare:** folosiți `https://bitsocial.localhost` ca primă opțiune. Ocoliți-l cu `PORTLESS=0 corepack yarn start` doar când aveți nevoie explicit de un port Vite direct.
- **Stare:** confirmat

### Hook-urile Commitizen blochează commit-urile neinteractive

- **Dată:** 2026-03-18
- **Observat de:** Codex
- **Context:** fluxuri de commit conduse de agenți
- **Ce a fost surprinzător:** `git commit` declanșează Commitizen prin Husky și așteaptă intrare interactivă de la TTY, ceea ce blochează shell-urile neinteractive ale agenților.
- **Impact:** agenții pot rămâne blocați la nesfârșit în timpul a ceea ce ar trebui să fie un commit obișnuit.
- **Mitigare:** folosiți `git commit --no-verify -m "message"` pentru commit-urile create de agenți. Oamenii pot folosi în continuare `corepack yarn commit` sau `corepack yarn exec cz`.
- **Stare:** confirmat

### Corepack este necesar ca să evitați Yarn classic

- **Dată:** 2026-03-19
- **Observat de:** Codex
- **Context:** migrarea managerului de pachete la Yarn 4
- **Ce a fost surprinzător:** mașina are în continuare o instalare globală de Yarn classic în `PATH`, așa că rularea simplă a comenzii `yarn` poate ajunge la v1 în loc de versiunea Yarn 4 fixată.
- **Impact:** dezvoltatorii pot ocoli din greșeală fixarea managerului de pachete din depozit și pot obține un comportament de instalare sau un lockfile diferite.
- **Mitigare:** folosiți `corepack yarn ...` pentru comenzile din shell sau rulați mai întâi `corepack enable`, astfel încât `yarn` simplu să ajungă la versiunea Yarn 4 fixată.
- **Stare:** confirmat

### Numele fixe de aplicație Portless intră în conflict între worktree-urile Bitsocial Web

- **Dată:** 2026-03-30
- **Observat de:** Codex
- **Context:** pornirea `yarn start` într-un worktree Bitsocial Web în timp ce un alt worktree servea deja prin Portless
- **Ce a fost surprinzător:** folosirea numelui literal de aplicație Portless `bitsocial` în fiecare worktree face ca ruta însăși să intre în conflict, chiar dacă porturile din spate sunt diferite, așa că al doilea proces eșuează pentru că `bitsocial.localhost` este deja înregistrat.
- **Impact:** ramurile paralele Bitsocial Web se pot bloca reciproc, deși Portless este menit tocmai să le lase să coexiste în siguranță.
- **Mitigare:** păstrați pornirea Portless în `scripts/start-dev.mjs`, care folosește acum o rută `*.bitsocial.localhost` legată de ramură în afara cazului canonic și revine la o rută legată de ramură atunci când numele simplu `bitsocial.localhost` este deja ocupat.
- **Stare:** confirmat

### Previzualizarea documentației avea portul 3001 codat rigid

- **Dată:** 2026-03-30
- **Observat de:** Codex
- **Context:** rularea `yarn start` alături de alte depozite locale și alți agenți
- **Ce a fost surprinzător:** comanda de dezvoltare din rădăcină rula workspace-ul de documentație cu `docusaurus start --port 3001`, așa că întreaga sesiune de dezvoltare eșua ori de câte ori un alt proces ocupa deja portul `3001`, deși aplicația principală folosea deja Portless.
- **Impact:** `yarn start` putea opri procesul web imediat după ce acesta pornea, întrerupând activitatea locală fără legătură din cauza unui conflict pe portul documentației.
- **Mitigare:** păstrați pornirea documentației în `yarn start:docs`, care folosește acum Portless plus `scripts/start-docs.mjs` pentru a respecta un port liber injectat sau pentru a trece la următorul port disponibil atunci când este rulat direct.
- **Stare:** confirmat

### Numele de gazdă Portless al documentației era codat rigid

- **Dată:** 2026-04-03
- **Observat de:** Codex
- **Context:** rularea `yarn start` într-un worktree Bitsocial Web secundar în timp ce un alt worktree servea deja documentația prin Portless
- **Ce a fost surprinzător:** `start:docs` înregistra în continuare numele de gazdă literal `docs.bitsocial.localhost`, așa că `yarn start` putea eșua chiar dacă aplicația about știa deja să evite conflictele de rute Portless pentru propriul nume de gazdă.
- **Impact:** worktree-urile paralele nu puteau folosi în mod fiabil comanda de dezvoltare din rădăcină, pentru că procesul documentației se închidea primul, iar `concurrently` oprea apoi restul sesiunii.
- **Mitigare:** păstrați pornirea documentației în `scripts/start-docs.mjs`, care derivă acum același nume de gazdă Portless legat de ramură ca aplicația about și injectează acel URL public comun în ținta proxy-ului de dezvoltare `/docs`.
- **Stare:** confirmat

### Shell-urile din worktree-uri pot rata versiunea de Node fixată în depozit

- **Dată:** 2026-04-03
- **Observat de:** Codex
- **Context:** rularea `yarn start` în worktree-uri Git precum `.claude/worktrees/*` sau în checkout-uri de worktree alăturate
- **Ce a fost surprinzător:** unele shell-uri din worktree-uri rezolvau `node` și `yarn node` către Node `25.2.1` de la Homebrew, deși depozitul fixează `22.12.0` în `.nvmrc`, așa că `yarn start` putea rula în tăcere launcher-ele de dezvoltare pe runtime-ul greșit.
- **Impact:** comportamentul serverului de dezvoltare poate diferi între checkout-ul principal și worktree-uri, ceea ce face erorile greu de reprodus și încalcă lanțul de instrumente Node 22 pe care îl așteaptă depozitul.
- **Mitigare:** păstrați launcher-ele de dezvoltare în `scripts/start-dev.mjs` și `scripts/start-docs.mjs`, care acum se reexecută cu binarul Node din `.nvmrc` atunci când shell-ul curent este pe versiunea greșită. Configurarea shell-ului ar trebui să prefere în continuare `nvm use`.
- **Stare:** confirmat

### Rămășițele din `docs-site/` pot ascunde lipsa sursei documentației după refactorizare

- **Dată:** 2026-04-01
- **Observat de:** Codex
- **Context:** curățarea monorepo-ului după merge, în urma mutării proiectului Docusaurus din `docs-site/` în `docs/`
- **Ce a fost surprinzător:** vechiul folder `docs-site/` poate rămâne pe disc cu fișiere învechite, dar importante, precum `i18n/`, chiar și după ce depozitul urmărit a trecut la `docs/`. Asta face ca refactorizarea să pară duplicată local și poate ascunde faptul că traducerile urmărite ale documentației nu au fost mutate efectiv în `docs/`.
- **Impact:** agenții pot șterge vechiul folder considerându-l „vechitură” și pot pierde din greșeală singura copie locală a traducerilor documentației sau pot continua să editeze scripturi care încă indică spre calea moartă `docs-site/`.
- **Mitigare:** tratați `docs/` ca singurul proiect canonic de documentație. Înainte de a șterge orice rămășiță locală din `docs-site/`, restaurați sursele urmărite precum `docs/i18n/` și actualizați scripturile și hook-urile ca să nu mai facă referire la `docs-site`.
- **Stare:** confirmat

### Previzualizarea multilingvă a documentației poate consuma foarte multă memorie în timpul verificării

- **Dată:** 2026-04-01
- **Observat de:** Codex
- **Context:** remedierea i18n, a rutării pe locale și a comportamentului Pagefind din documentație cu `yarn start:docs` plus Playwright
- **Ce a fost surprinzător:** modul implicit de previzualizare a documentației face acum un build complet multilingv plus indexare Pagefind înainte de a servi, iar menținerea acelui proces în viață alături de mai multe sesiuni Playwright sau Chrome poate consuma mult mai multă memorie decât o buclă obișnuită de dezvoltare Vite sau Docusaurus pe o singură locală.
- **Impact:** mașina poate rămâne fără memorie, sesiunile de browser pot da crash, iar rulările întrerupte pot lăsa în urmă servere de documentație sau browsere headless învechite care continuă să consume memorie.
- **Mitigare:** pentru lucrul la documentație care nu are nevoie de verificarea rutelor pe locale sau a Pagefind, preferați `DOCS_START_MODE=live yarn start:docs`. Folosiți previzualizarea multilingvă implicită doar când trebuie să validați rutele traduse sau Pagefind. Păstrați o singură sesiune Playwright, închideți sesiunile vechi de browser înainte de a deschide altele noi și opriți serverul de documentație după verificare, dacă nu mai aveți nevoie de el.
- **Stare:** confirmat

### `translate-docs.py` poate lăsa localele documentației traduse pe jumătate sau cu ținte de link stricate

- **Dată:** 2026-04-06
- **Observat de:** Codex
- **Context:** remedierea rutelor și a conținutului localizat al documentației după ce `yarn start:docs` a servit pagini de detaliu în engleză sau nu a reușit să construiască ieșirea pe locale
- **Ce a fost surprinzător:** pipeline-ul de traducere a documentației avea simultan două moduri de eșec specifice depozitului: `scripts/translate-docs.py` extrăgea doar un mic subset din mesajele `DocsHome` atunci când apelurile `tr(...)` foloseau forme pe care nu le putea parsa, iar markdown-ul tradus din `docs/i18n/**` putea conține slug-uri traduse automat sau artefacte `ZXQPLACEHOLDER` în interiorul țintelor de link.
- **Impact:** paginile de start localizate pot reveni în tăcere la engleză, paginile de detaliu localizate pot apărea netraduse, iar un `yarn docs:build` complet poate eșua din cauza linkurilor stricate pe locale, chiar dacă documentația sursă este validă.
- **Mitigare:** după modificarea traducerilor documentației sau după regenerarea fișierelor de locale, rulați întotdeauna `yarn docs:build` din rădăcina depozitului, scanați markdown-ul din `docs/i18n/**` după `ZXQPLACEHOLDER` și verificați că linkurile traduse indică în continuare spre slug-uri canonice de documentație, precum `/apps/5chan/`, în loc de căi URL traduse. Dacă textul din `DocsHome` s-a schimbat, confirmați că `scripts/translate-docs.py` încă extrage toate mesajele `docs.home.*`.
- **Stare:** confirmat

### Verificările fără JS ale site-ului about trebuie să folosească ruta Portless, nu o previzualizare SSR de sine stătătoare

- **Dată:** 2026-04-12
- **Observat de:** Codex
- **Context:** verificarea suportului fără JS pentru site-ul `about/` dintr-un worktree de ramură
- **Ce a fost surprinzător:** o previzualizare SSR de sine stătătoare poate părea sănătoasă în timp ce ruta Portless efectivă, legată de ramură, servește încă shell-ul greșit al aplicației sau un proces mai vechi. În acest depozit, contractul local real este numele de gazdă Portless obținut din `yarn start`, nu un server de previzualizare improvizat.
- **Impact:** agenții pot afirma incorect că suportul fără JS funcționează sau pot rata regresii care apar doar pe `*.bitsocial.localhost`.
- **Mitigare:** pentru verificarea în browser a site-ului `about/`, porniți întotdeauna serverul local real cu `yarn start` sau `yarn start:about` și testați mai întâi URL-ul Portless legat de ramură. Dacă un nume de gazdă Portless pare învechit, inspectați și opriți procesul vechi înainte de a retesta.
- **Stare:** confirmat

### `chain/` era invizibil pentru `yarn build:verify` și `yarn doctor`

- **Dată:** 2026-07-05
- **Observat de:** Codex
- **Context:** verificarea unui diff care atingea doar chain/, după ce workspace-ul `chain/` (aplicație Vite de sine stătătoare pentru `chain.bitsocial.net`) a fost adăugat în monorepo.
- **Ce a fost surprinzător:** `scripts/verify-build.mjs` recunoștea doar prefixele de cale `about/`, `docs/` și `stats/`, așa că un diff care atingea doar chain/ afișa „No targeted build checks matched the current diff” și nu rula niciun build, deși `build:chain` exista deja în `package.json` din rădăcină. Separat, `yarn doctor` era codat rigid ca `react-doctor about -y`, așa că modificările React din `chain/src` nu primeau deloc acoperire React Doctor.
- **Impact:** agenții care verificau modificări în chain trebuiau să știe că este nevoie să apeleze direct `yarn build:chain`, în loc să se bazeze pe `yarn build:verify`, iar problemele React din `chain/src` (efecte, hook-uri, cod mort) rămâneau nedetectate de `yarn doctor`.
- **Mitigare:** `scripts/verify-build.mjs` are acum o ramură pentru `chain/` care o oglindește pe cea pentru `about/`, iar `doctor` / `doctor:verbose` rulează acum `react-doctor --project about,chain -y` într-o singură invocare. `doctor:score` rămâne doar pentru `about`, pentru că `--score` nu afișează nimic, în tăcere, atunci când este combinat cu `--project` pentru mai multe proiecte; folosiți `yarn react-doctor --project about,chain --verbose -y` (sau `--json`) dacă aveți nevoie de un scor pentru chain.
- **Stare:** confirmat

### P2P în browser funcționează pe WebSockets securizate; pkc-js respinge implicit WebRTC și WebTransport

- **Dată:** 2026-08-02
- **Observat de:** Claude
- **Context:** redactarea textului pentru pagina de prezentare și pentru documentație despre modul în care funcționează P2P în browser la Bitsocial
- **Ce a fost surprinzător:** `@pkcprotocol/pkc-js` include implicit un connection gater care respinge apelurile WebRTC și WebTransport din browser — `dist/browser/helia/dial-transport-filter.js` exportă `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Comentariul din sursă explică motivul: în browser, acele transporturi adaugă căi lungi de stabilire a conexiunii, care eșuează adesea (STUN/ICE, rotația certhash) și încetinesc încărcarea, în timp ce WebSocket este direct și fiabil. Fiecare peer activ din panoul „P2P status” al blogului afișează „Secure WebSocket”. Gater-ul se află în `node_modules`, așa că nimic din depozit nu îi sugerează existența.
- **Impact:** este foarte ușor să scrii text public plauzibil tehnic, dar fals — de exemplu, să atribui faptului că WebTransport a atins Baseline în browsere în martie 2026 meritul de a fi făcut posibil P2P în browser la Bitsocial. Acea afirmație a ajuns în pagina de prezentare, în tabelul comparativ și în două pagini de documentație înainte ca dezvoltatorul să o observe. Afirmațiile greșite despre arhitectură din paginile publice sunt verificate exact de publicul de dezvoltatori pe care îl vizează site-ul.
- **Mitigare:** nu deduceți niciodată ce transporturi folosește Bitsocial din ceea ce suportă în principiu libp2p sau platforma browserului. Verificați `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` pentru lista curentă de transporturi respinse, confirmați că nu există nicio suprascriere `connectionGater` sub `about/src/` și citiți etichetele de transport afișate în panoul „P2P status” al blogului înainte de a face orice afirmație publică. Schimbarea din upstream care a deblocat efectiv publicarea din browser a fost corecția pentru seqno monoton din gossipsub, apărută în `@libp2p/gossipsub` 15.0.21 (mai 2026); pkc-js livrează în prezent 16.0.4.
- **Stare:** confirmat

### Linkurile relative `./page.md` dintr-o pagină de documentație netradusă strică fiecare build localizat

- **Dată:** 2026-08-02
- **Observat de:** Claude
- **Context:** adăugarea unei pagini noi, doar în engleză, `docs/browser-p2p.md`, care trimitea către documentație existentă prin `./peer-to-peer-protocol.md` și `./apps/5chan.md`
- **Ce a fost surprinzător:** fiecare locală din `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` oglindește arborele documentației. O pagină nouă, absentă din acele oglinzi, se randează totuși în fiecare locală prin revenirea la engleză, dar linkurile ei relative din markdown nu se mai rezolvă — Docusaurus emite `/ar/browser-p2p/peer-to-peer-protocol.md/` și oprește build-ul cu „Docusaurus found broken links!”. Esențial este că `yarn build:verify` și `yarn docs:build:verify` construiesc doar `en` și trec fără probleme; doar un `yarn docs:build` complet scoate problema la iveală, iar acesta se oprește la prima locală în ordine alfabetică (`ar`).
- **Impact:** o modificare a documentației poate trece toate verificările locale rapide și totuși poate strica build-ul multilingv de producție. Eșecul pare, în plus, fără legătură cu modificarea, pentru că eroarea indică o cale de locală pe care autorul nu a atins-o niciodată.
- **Mitigare:** în orice pagină de documentație care nu este oglindită în `docs/i18n/**`, folosiți linkuri raportate la rădăcină (`/peer-to-peer-protocol/`, `/apps/5chan/`) în loc de linkuri relative `.md`; Docusaurus le prefixează automat cu locala. `docs/build-your-own-client.md` este exemplul existent. Rulați un `yarn docs:build` complet — nu doar `build:verify` — înainte de a preda orice modificare care adaugă sau leagă o pagină de documentație.
- **Stare:** confirmat

### Rulările concurente ale `update-translations.js` pierd chei în tăcere

- **Dată:** 2026-08-02
- **Observat de:** Claude
- **Context:** aplicarea a 26 de chei i18next traduse în toate cele 36 de locale prin skill-ul `translate`
- **Ce a fost surprinzător:** fiecare invocare este o citire-modificare-scriere peste toate cele 36 de fișiere de locale, așa că două invocări simultane se suprascriu reciproc și o cheie dispare fără nicio eroare. Skill-ul `translate` indică explicit lansarea a până la 4 subagenți în paralel, fiecare dintre ei apelând scriptul.
- **Impact:** eșecul este silențios: chei dispar din locale arbitrare, iar diff-ul arată în continuare plauzibil.
- **Mitigare:** nu lăsați niciodată subagenții traducători să scrie concurent fișiere de locale — puneți-i să emită doar fișiere JSON de dicționar, apoi aplicați fiecare cheie secvențial din agentul părinte. După aplicare, verificați programatic că fiecare cheie există în toate cele 35 de locale non-engleze și că nicio valoare nu este identică octet cu octet cu sursa engleză.
- **Stare:** confirmat
- **Actualizare (2026-08-10):** înainte, scriptul își calcula ținta și ca `path.join(process.cwd(), "public", "translations")`, așa că comanda documentată, rulată din rădăcina depozitului, eșua cu „Translations directory not found” și trebuia rulată din `about/`. Acum determină workspace-ul pornind de la directorul curent sau de la propria locație și funcționează de oriunde. Capcana de concurență descrisă mai sus rămâne neschimbată.

### Controalele de adnotare din modul de dezvoltare pot intercepta clicurile automatizate

- **Context:** site-urile about și chain au controale fixe în colțul din dreapta jos, unde în modul de dezvoltare apare și bara de instrumente Agentation.
- **Mitigare:** `scripts/pw-session.sh open` înregistrează `window.__NO_DEV_TOOLBAR__ = true` înainte de a reîncărca pagina. Inițializatorul Agentation respectă și `__VISUAL_TESTING__` și `__PROFILING__`; inspecția sursei rămâne disponibilă independent. Automatizarea directă a browserului trebuie să seteze același flag înainte de a încărca aplicația.

### `skills add` instalează copiile pentru Codex și Cursor în directorul `.agents/` ignorat de Git

- **Dată:** 2026-08-18
- **Observat de:** Tommaso + Claude
- **Context:** instalarea skill-ului `improve-threejs` din `millionco/react-doctor` cu CLI-ul `skills` (`vercel-labs/skills`).
- **Ce a fost surprinzător:** `npx skills add <repo> --skill <name> --agent codex` și `--agent cursor` scriu amândouă în `.agents/skills/<name>/`, nu în `.codex/skills/` sau `.cursor/skills/`. `AGENTS.md` interzice un director `.agents/` la nivelul depozitului, iar `.gitignore:29` îl ignoră, așa că ambele copii rămân neurmărite, fără niciun avertisment. Doar `--agent claude-code` scrie în locația așteptată, `.claude/skills/`. Separat, forma documentată cu valori separate prin virgulă (`--agent claude-code,codex,cursor`) eșuează cu „Invalid agents” și nu instalează nimic, deși fiecare nume este valid luat separat.
- **Impact:** instalarea raportează succes, în timp ce două dintre cele trei copii pentru lanțurile de instrumente ajung într-un loc care nu va intra niciodată într-un commit, așa că, după o clonare proaspătă, Codex și Cursor nu au skill-ul, fără ca nimic să semnaleze asta. Forma cu virgulă poate produce și o instalare fără efect, care pare reușită.
- **Mitigare actuală:** depozitul urmărește acum `.agents/skills` ca sursă canonică și generează copiile pentru Claude cu `yarn ai-workflow:sync`. Fosta interdicție privind `.agents` și regula de ignorare au fost eliminate. Nu copiați skill-uri noi în trei rădăcini independente; după adăugarea unui skill, verificați paritatea fișierelor generate și catalogul aplicației.
- **Stare:** confirmat
