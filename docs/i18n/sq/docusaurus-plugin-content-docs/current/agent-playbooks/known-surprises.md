# Surpriza të njohura

Ky skedar mban shënim pikat e ngatërrimit specifike për këtë depo që kanë shkaktuar gabime të agjentëve.

## Kriteret e shtimit

Shtoni një zë vetëm nëse plotësohen të gjitha kushtet:

- Është specifik për këtë depo (jo këshillë e përgjithshme).
- Ka gjasa të përsëritet për agjentët e ardhshëm.
- Ka një masë zbutëse konkrete që mund të ndiqet.

Nëse nuk jeni të sigurt, pyeteni zhvilluesin përpara se të shtoni një zë.

## Shablloni i zërit

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

## Zërat

### Domenet e prodhimit të aplikacioneve në Vercel mund të rrëshqasin sërish te vendosjet nga dega master e Git

- **Data:** 2026-04-28
- **Vëzhguar nga:** Tommaso + Codex
- **Konteksti:** Verifikimi i pasqyrave të aplikacioneve Seedit dhe 5chan në direktorinë e aplikacioneve të Bitsocial Web.
- **Çfarë ishte befasuese:** Projektet `seedit` dhe `5chan` në Vercel kishin `gitProviderOptions.createDeployments = "enabled"`, prandaj çdo push te `master` në GitHub promovohej te domenet e prodhimit, edhe pse politika e depos pret që pasqyrat e prodhimit të shërbejnë vetëm artefakte publikimi.
- **Ndikimi:** Distinktivët e pasqyrave të verifikuara në direktorinë e aplikacioneve mund të bëhen të rremë, sepse domenet e prodhimit shërbejnë commit-in më të fundit të zhvillimit në vend të ZIP-it të publikimit në GitHub, hash-i i `index.html` të të cilit është regjistruar te `about/src/lib/apps-data.ts`.
- **Zbutja:** Përpara se të shtoni ose rifreskoni metadatat e verifikimit të pasqyrave, kontrolloni projektin në Vercel me `vercel api /v9/projects/<project-id>` dhe konfirmoni `gitProviderOptions.createDeployments = "disabled"`. Vendosni përmbajtjen e ZIP-it të publikimit me `vercel deploy --prebuilt --prod` dhe përdorni `seedit-omega.vercel.app` ose `5chan-omega.vercel.app` për vendosjet e zhvillimit.
- **Statusi:** i konfirmuar

### Portless 0.11 ripërdor gjendjen e vjetër të proxy-t nëse nisësi nuk imponon HTTPS

- **Data:** 2026-04-28
- **Vëzhguar nga:** Tommaso + Codex
- **Konteksti:** Kalimi i rrjedhës së zakonshme `yarn start` nga URL-ja e vjetër e proxy-t `http://bitsocial.localhost:1355` te `https://bitsocial.localhost`.
- **Çfarë ishte befasuese:** Edhe me `portless@0.11.1` të instaluar, Portless ripërdori proxy-n ekzistues HTTP `~/.portless/proxy.port = 1355` dhe shfaqi URL-në e vjetër me `:1355`.
- **Ndikimi:** Përditësimi i versioneve të paketave dhe i dokumentacionit nuk mjafton; `yarn start` mund ta reklamojë dhe ta përdorë ende URL-në e vjetër kur një kontribues ka gjendje të vjetër Portless në punë.
- **Zbutja:** Mbajini skriptet e nisjes në një formë ku e nisin shprehimisht proxy-n HTTPS të Portless në portin `443` përpara se të regjistrojnë rrugët e aplikacionit, që rrjedha gjatë ekzekutimit të largohet nga gjendja e ruajtur `1355` në vend që ta trashëgojë.
- **Statusi:** i konfirmuar

### Portless ndryshon URL-në kanonike lokale të aplikacionit

- **Data:** 2026-03-18
- **Vëzhguar nga:** Codex
- **Konteksti:** Verifikimi në shfletues dhe rrjedhat e provës së shpejtë
- **Çfarë ishte befasuese:** URL-ja lokale e parazgjedhur nuk është porti i zakonshëm i Vite. Depoja pret `https://bitsocial.localhost` përmes Portless, prandaj kontrolli i `localhost:3000` ose `localhost:5173` mund të godasë aplikacionin e gabuar ose asgjë fare.
- **Ndikimi:** Kontrollet në shfletues mund të dështojnë ose të validojnë objektivin e gabuar edhe kur serveri i zhvillimit është në rregull.
- **Zbutja:** Provoni gjithmonë `https://bitsocial.localhost` si adresë të parë. Anashkalojeni me `PORTLESS=0 corepack yarn start` vetëm kur ju duhet shprehimisht një port i drejtpërdrejtë i Vite.
- **Statusi:** i konfirmuar

### Hook-et e Commitizen bllokojnë commit-et jointeraktive

- **Data:** 2026-03-18
- **Vëzhguar nga:** Codex
- **Konteksti:** Rrjedha pune commit-esh të drejtuara nga agjentë
- **Çfarë ishte befasuese:** `git commit` aktivizon Commitizen përmes Husky dhe pret hyrje interaktive nga TTY, gjë që i bllokon guaskat jointeraktive të agjentëve.
- **Ndikimi:** Agjentët mund të ngecin pafundësisht gjatë asaj që duhej të ishte një commit i zakonshëm.
- **Zbutja:** Përdorni `git commit --no-verify -m "message"` për commit-et e krijuara nga agjentët. Njerëzit mund të përdorin ende `corepack yarn commit` ose `corepack yarn exec cz`.
- **Statusi:** i konfirmuar

### Corepack është i domosdoshëm për të shmangur Yarn classic

- **Data:** 2026-03-19
- **Vëzhguar nga:** Codex
- **Konteksti:** Migrimi i menaxherit të paketave te Yarn 4
- **Çfarë ishte befasuese:** Makina ka ende një instalim global të Yarn classic në `PATH`, prandaj ekzekutimi i thjeshtë i `yarn` mund të përfundojë te v1 në vend të versionit të fiksuar Yarn 4.
- **Ndikimi:** Zhvilluesit mund ta anashkalojnë pa dashje fiksimin e menaxherit të paketave në depo dhe të marrin sjellje tjetër instalimi ose një lockfile të ndryshëm.
- **Zbutja:** Përdorni `corepack yarn ...` për komandat në guaskë, ose ekzekutoni së pari `corepack enable` që `yarn` i thjeshtë të përfundojë te versioni i fiksuar Yarn 4.
- **Statusi:** i konfirmuar

### Emrat fiksë të aplikacioneve Portless përplasen mes worktree-ve të Bitsocial Web

- **Data:** 2026-03-30
- **Vëzhguar nga:** Codex
- **Konteksti:** Nisja e `yarn start` në një worktree të Bitsocial Web ndërsa një worktree tjetër po shërbente tashmë përmes Portless
- **Çfarë ishte befasuese:** Përdorimi i emrit të drejtpërdrejtë Portless `bitsocial` në çdo worktree bën që vetë rruga të përplaset, edhe kur portat mbështetëse janë të ndryshme, prandaj procesi i dytë dështon sepse `bitsocial.localhost` është regjistruar tashmë.
- **Ndikimi:** Degët paralele të Bitsocial Web mund të bllokojnë njëra-tjetrën, edhe pse Portless synon t'i lërë ato të bashkëjetojnë pa probleme.
- **Zbutja:** Mbajeni nisjen e Portless pas `scripts/start-dev.mjs`, i cili tani përdor një rrugë `*.bitsocial.localhost` të lidhur me degën jashtë rastit kanonik dhe kthehet te një rrugë e lidhur me degën kur emri i thjeshtë `bitsocial.localhost` është tashmë i zënë.
- **Statusi:** i konfirmuar

### Pamja paraprake e dokumentacionit e kishte portin 3001 të fiksuar në kod

- **Data:** 2026-03-30
- **Vëzhguar nga:** Codex
- **Konteksti:** Ekzekutimi i `yarn start` krahas depove dhe agjentëve të tjerë lokalë
- **Çfarë ishte befasuese:** Komanda e zhvillimit në rrënjë e niste hapësirën e punës së dokumentacionit me `docusaurus start --port 3001`, prandaj i gjithë sesioni i zhvillimit dështonte sa herë që një proces tjetër zotëronte tashmë `3001`, edhe pse aplikacioni kryesor përdorte tashmë Portless.
- **Ndikimi:** `yarn start` mund ta vriste procesin e uebit menjëherë pas nisjes, duke ndërprerë punë lokale krejt të palidhur për shkak të një përplasjeje porti të dokumentacionit.
- **Zbutja:** Mbajeni nisjen e dokumentacionit pas `yarn start:docs`, i cili tani përdor Portless së bashku me `scripts/start-docs.mjs` për të respektuar një port të lirë të injektuar ose për të kaluar te porti i parë i lirë kur ekzekutohet drejtpërdrejt.
- **Statusi:** i konfirmuar

### Emri i hostit Portless për dokumentacionin ishte i fiksuar në kod

- **Data:** 2026-04-03
- **Vëzhguar nga:** Codex
- **Konteksti:** Ekzekutimi i `yarn start` në një worktree dytësor të Bitsocial Web ndërsa një worktree tjetër po shërbente tashmë dokumentacionin përmes Portless
- **Çfarë ishte befasuese:** `start:docs` regjistronte ende emrin e drejtpërdrejtë të hostit `docs.bitsocial.localhost`, prandaj `yarn start` mund të dështonte edhe pse aplikacioni about dinte tashmë t'i shmangte përplasjet e rrugëve Portless për emrin e vet të hostit.
- **Ndikimi:** Worktree-t paralele nuk mund ta përdornin me siguri komandën e zhvillimit në rrënjë, sepse procesi i dokumentacionit dilte i pari dhe më pas `concurrently` e vriste pjesën tjetër të sesionit.
- **Zbutja:** Mbajeni nisjen e dokumentacionit pas `scripts/start-docs.mjs`, i cili tani nxjerr të njëjtin emër hosti Portless të lidhur me degën si aplikacioni about dhe e injekton atë URL publike të përbashkët te objektivi i proxy-t të zhvillimit `/docs`.
- **Statusi:** i konfirmuar

### Guaskat e worktree-ve mund të mos e kapin versionin e fiksuar të Node të depos

- **Data:** 2026-04-03
- **Vëzhguar nga:** Codex
- **Konteksti:** Ekzekutimi i `yarn start` në worktree të Git si `.claude/worktrees/*` ose në checkout-e worktree-sh fqinje
- **Çfarë ishte befasuese:** Disa guaska worktree-sh e zgjidhnin `node` dhe `yarn node` te Node `25.2.1` i Homebrew, edhe pse depoja fikson `22.12.0` te `.nvmrc`, prandaj `yarn start` mund t'i niste nisësit e zhvillimit në heshtje mbi kohën e gabuar të ekzekutimit.
- **Ndikimi:** Sjellja e serverit të zhvillimit mund të ndryshojë mes checkout-it kryesor dhe worktree-ve, duke i bërë defektet të vështira për t'u riprodhuar dhe duke shkelur zinxhirin e pritur të veglave Node 22 të depos.
- **Zbutja:** Mbajini nisësit e zhvillimit pas `scripts/start-dev.mjs` dhe `scripts/start-docs.mjs`, të cilët tani riekzekutohen me binarin Node të `.nvmrc` kur guaska aktuale është në versionin e gabuar. Konfigurimi i guaskës duhet gjithsesi të preferojë `nvm use`.
- **Statusi:** i konfirmuar

### Mbetjet e `docs-site/` mund të fshehin burimin që mungon të dokumentacionit pas rifaktorizimit

- **Data:** 2026-04-01
- **Vëzhguar nga:** Codex
- **Konteksti:** Pastrimi i monorepos pas bashkimit, kur projekti Docusaurus u zhvendos nga `docs-site/` te `docs/`
- **Çfarë ishte befasuese:** Dosja e vjetër `docs-site/` mund të mbetet në disk me skedarë të vjetruar por të rëndësishëm si `i18n/`, edhe pasi depoja e gjurmuar është zhvendosur te `docs/`. Kjo e bën rifaktorizimin të duket i dublikuar lokalisht dhe mund të fshehë faktin që përkthimet e gjurmuara të dokumentacionit nuk u zhvendosën vërtet te `docs/`.
- **Ndikimi:** Agjentët mund ta fshijnë dosjen e vjetër si “mbeturinë” dhe të humbin pa dashje kopjen e vetme lokale të përkthimeve të dokumentacionit, ose të vazhdojnë të redaktojnë skripte që ende tregojnë te shtegu i vdekur `docs-site/`.
- **Zbutja:** Trajtojeni `docs/` si të vetmin projekt kanonik të dokumentacionit. Përpara se të fshini çfarëdo mbetjeje lokale të `docs-site/`, riktheni burimet e gjurmuara si `docs/i18n/` dhe përditësoni skriptet e hook-et që të mos i referohen më `docs-site`.
- **Statusi:** i konfirmuar

### Pamja paraprake shumëgjuhëshe e dokumentacionit mund ta hedhë lart RAM-in gjatë verifikimit

- **Data:** 2026-04-01
- **Vëzhguar nga:** Codex
- **Konteksti:** Rregullimi i i18n-it të dokumentacionit, i rrugëzimit sipas gjuhës dhe i sjelljes së Pagefind me `yarn start:docs` plus Playwright
- **Çfarë ishte befasuese:** Mënyra e parazgjedhur e pamjes paraprake të dokumentacionit tani bën një ndërtim të plotë shumëgjuhësh plus indeksimin me Pagefind përpara se të fillojë të shërbejë, dhe mbajtja e atij procesi gjallë krahas disa sesioneve Playwright ose Chrome mund të konsumojë shumë më tepër RAM se një cikël i zakonshëm zhvillimi me Vite ose me Docusaurus njëgjuhësh.
- **Ndikimi:** Makina mund të mbetet me memorie të kufizuar, sesionet e shfletuesit mund të rrëzohen dhe ekzekutimet e ndërprera mund të lënë pas servera dokumentacioni ose shfletues headless që vazhdojnë të hanë memorie.
- **Zbutja:** Për punë me dokumentacionin që nuk kërkon verifikim të rrugëve sipas gjuhës ose të Pagefind, preferoni `DOCS_START_MODE=live yarn start:docs`. Përdoreni pamjen paraprake shumëgjuhëshe të parazgjedhur vetëm kur ju duhet të validoni rrugët e përkthyera ose Pagefind. Mbani një sesion të vetëm Playwright, mbyllni sesionet e vjetra të shfletuesit përpara se të hapni të reja dhe ndaleni serverin e dokumentacionit pas verifikimit nëse nuk ju duhet më.
- **Statusi:** i konfirmuar

### `translate-docs.py` mund t'i lërë gjuhët e dokumentacionit gjysmë të përkthyera ose me objektiva lidhjesh të prishur

- **Data:** 2026-04-06
- **Vëzhguar nga:** Codex
- **Konteksti:** Rregullimi i rrugëve dhe i përmbajtjes së lokalizuar të dokumentacionit pasi `yarn start:docs` shërbeu faqe detajesh në anglisht ose nuk arriti të ndërtonte daljen për një gjuhë
- **Çfarë ishte befasuese:** Kanali i përkthimit të dokumentacionit kishte njëkohësisht dy mënyra dështimi specifike për këtë depo: `scripts/translate-docs.py` nxirrte vetëm një nëngrup të vogël të mesazheve të `DocsHome` kur thirrjet `tr(...)` përdornin forma që ai nuk i analizonte, dhe markdown-i i përkthyer nën `docs/i18n/**` mund të përmbante slug-e të përkthyer nga makina ose artefakte `ZXQPLACEHOLDER` brenda objektivave të lidhjeve.
- **Ndikimi:** Faqet kryesore të lokalizuara mund të kthehen në heshtje në anglisht, faqet e lokalizuara me detaje mund të duken të papërkthyera dhe një `yarn docs:build` i plotë mund të dështojë për shkak të lidhjeve të prishura në një gjuhë, edhe pse dokumentet burimore janë të vlefshme.
- **Zbutja:** Pas ndryshimit të përkthimeve të dokumentacionit ose rigjenerimit të skedarëve gjuhësorë, ekzekutoni gjithmonë `yarn docs:build` nga rrënja e depos, skanoni markdown-in te `docs/i18n/**` për `ZXQPLACEHOLDER` dhe verifikoni që lidhjet e përkthyera tregojnë ende te slug-et kanonikë të dokumenteve, si `/apps/5chan/`, në vend të shtigjeve URL të përkthyera. Nëse teksti i `DocsHome` ka ndryshuar, konfirmoni që `scripts/translate-docs.py` i nxjerr ende të gjitha mesazhet `docs.home.*`.
- **Statusi:** i konfirmuar

### Kontrollet pa JavaScript për sajtin about duhet të përdorin rrugën Portless, jo një pamje paraprake SSR më vete

- **Data:** 2026-04-12
- **Vëzhguar nga:** Codex
- **Konteksti:** Verifikimi i mbështetjes pa JavaScript për sajtin `about/` nga një worktree dege
- **Çfarë ishte befasuese:** Një pamje paraprake SSR më vete mund të duket në rregull, ndërkohë që rruga reale Portless e lidhur me degën shërben ende guaskën e gabuar të aplikacionit ose një proces më të vjetër. Në këtë depo, kontrata reale lokale është emri i hostit Portless nga `yarn start`, jo një server pamjeje paraprake i improvizuar.
- **Ndikimi:** Agjentët mund të pretendojnë gabimisht se mbështetja pa JavaScript funksionon, ose mund të humbasin regresione që shfaqen vetëm te `*.bitsocial.localhost`.
- **Zbutja:** Për verifikimin në shfletues të `about/`, nisni gjithmonë serverin real lokal me `yarn start` ose `yarn start:about` dhe testoni së pari URL-në Portless të lidhur me degën. Nëse një emër hosti Portless duket i vjetruar, inspektoni dhe ndaleni procesin e vjetër përpara se të ritestoni.
- **Statusi:** i konfirmuar

### `chain/` ishte i padukshëm për `yarn build:verify` dhe `yarn doctor`

- **Data:** 2026-07-05
- **Vëzhguar nga:** Codex
- **Konteksti:** Verifikimi i një diff-i vetëm te chain/ pasi hapësira e punës `chain/` (aplikacion Vite më vete për `chain.bitsocial.net`) u shtua në monorepo.
- **Çfarë ishte befasuese:** `scripts/verify-build.mjs` njihte vetëm prefikset e shtigjeve `about/`, `docs/` dhe `stats/`, prandaj një diff vetëm te chain/ shfaqte "No targeted build checks matched the current diff" dhe nuk ekzekutonte asnjë ndërtim, edhe pse `build:chain` ekzistonte tashmë te `package.json` i rrënjës. Veçmas, `yarn doctor` ishte i fiksuar në kod te `react-doctor about -y`, prandaj ndryshimet React nën `chain/src` nuk merrnin asnjë mbulim nga React Doctor.
- **Ndikimi:** Agjentët që verifikonin ndryshime te chain duhej ta dinin se u takonte të thërrisnin drejtpërdrejt `yarn build:chain` në vend që t'i besonin `yarn build:verify`, dhe problemet React te `chain/src` (efekte, hook-e, kod i vdekur) mbeteshin të pazbuluara nga `yarn doctor`.
- **Zbutja:** `scripts/verify-build.mjs` tani ka një degë `chain/` që pasqyron atë të `about/`, dhe `doctor` / `doctor:verbose` tani ekzekutojnë `react-doctor --project about,chain -y` në një thirrje të vetme. `doctor:score` mbetet vetëm për `about`, sepse `--score` nuk shfaq asgjë, në heshtje, kur kombinohet me `--project` për më shumë se një projekt; përdorni `yarn react-doctor --project about,chain --verbose -y` (ose `--json`) nëse ju duhet një pikëzim për chain.
- **Statusi:** i konfirmuar

### P2P në shfletues punon mbi WebSockets të sigurt; pkc-js i ndalon WebRTC dhe WebTransport si parazgjedhje

- **Data:** 2026-08-02
- **Vëzhguar nga:** Claude
- **Konteksti:** Shkrimi i tekstit të faqes hyrëse dhe të dokumentacionit se si funksionon P2P i Bitsocial në shfletues
- **Çfarë ishte befasuese:** `@pkcprotocol/pkc-js` vjen me një filtër të parazgjedhur lidhjesh që i refuzon thirrjet WebRTC dhe WebTransport në shfletues — `dist/browser/helia/dial-transport-filter.js` eksporton `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Komenti në burim jep arsyen: në shfletues ato transporte shtojnë shtigje të gjata e shpesh të dështuara për vendosjen e lidhjes (STUN/ICE, rrotullim certhash) që e ngadalësojnë ngarkimin, ndërsa WebSocket është i drejtpërdrejtë dhe i besueshëm. Çdo peer i gjallë në panelin e statusit P2P të blogut shfaq "Secure WebSocket". Filtri qëndron te `node_modules`, prandaj asgjë në depo nuk e lë të kuptohet.
- **Ndikimi:** Është shumë e lehtë të shkruhet tekst publik teknikisht i besueshëm por i rremë — për shembull t'i vishet merita WebTransport-it, që arriti statusin Baseline në shfletues në mars 2026, për ta bërë të mundur P2P-në e Bitsocial në shfletues. Ai pretendim përfundoi në faqen hyrëse, në tabelën krahasuese dhe në dy faqe dokumentacioni përpara se ta kapte zhvilluesi. Pretendimet e gabuara për arkitekturën në faqet publike kontrollohen pikërisht nga audienca e zhvilluesve që sajti synon.
- **Zbutja:** Mos e nxirrni kurrë se cilat transporte përdor Bitsocial nga ajo që libp2p ose platforma e shfletuesit mbështet në parim. Kontrolloni `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` për listën aktuale të ndalimeve, konfirmoni që nuk ekziston asnjë mbivendosje `connectionGater` nën `about/src/` dhe lexoni etiketat e gjalla të transportit në panelin "P2P status" të blogut përpara se të bëni çfarëdo pretendimi publik. Ndryshimi upstream që e zhbllokoi vërtet publikimin nga shfletuesi ishte rregullimi i seqno-s monotone në gossipsub te `@libp2p/gossipsub` 15.0.21 (maj 2026); pkc-js aktualisht vjen me 16.0.4.
- **Statusi:** i konfirmuar

### Lidhjet relative `./page.md` nga një faqe dokumentacioni e papërkthyer prishin çdo ndërtim të lokalizuar

- **Data:** 2026-08-02
- **Vëzhguar nga:** Claude
- **Konteksti:** Shtimi i një faqeje të re vetëm në anglisht, `docs/browser-p2p.md`, që lidhej me dokumente ekzistuese përmes `./peer-to-peer-protocol.md` dhe `./apps/5chan.md`
- **Çfarë ishte befasuese:** Çdo gjuhë nën `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` pasqyron pemën e dokumentacionit. Një faqe e re që mungon në ato pasqyra shfaqet gjithsesi në çdo gjuhë përmes kthimit te anglishtja, por lidhjet e saj relative në markdown nuk zgjidhen më — Docusaurus prodhon `/ar/browser-p2p/peer-to-peer-protocol.md/` dhe e dështon ndërtimin me "Docusaurus found broken links!". Thelbësore: `yarn build:verify` dhe `yarn docs:build:verify` ndërtojnë vetëm `en` dhe kalojnë pa asnjë shenjë; vetëm një `yarn docs:build` i plotë e nxjerr në pah, dhe ai ndërpritet te gjuha e parë sipas alfabetit (`ar`).
- **Ndikimi:** Një ndryshim në dokumentacion mund t'i kalojë të gjitha kontrollet e shpejta lokale dhe prapëseprapë ta prishë ndërtimin shumëgjuhësh të prodhimit. Dështimi duket edhe i palidhur me ndryshimin, sepse gabimi përmend një shteg gjuhësor që autori nuk e preku kurrë.
- **Zbutja:** Në çdo faqe dokumentacioni që nuk pasqyrohet te `docs/i18n/**`, përdorni lidhje relative ndaj rrënjës (`/peer-to-peer-protocol/`, `/apps/5chan/`) në vend të lidhjeve relative me `.md`; Docusaurus u vendos automatikisht gjuhën si prefiks. `docs/build-your-own-client.md` është shembulli ekzistues. Ekzekutoni një `yarn docs:build` të plotë — jo vetëm `build:verify` — përpara se të dorëzoni çfarëdo ndryshimi që shton ose lidh një faqe dokumentacioni.
- **Statusi:** i konfirmuar

### Ekzekutimet e njëkohshme të `update-translations.js` humbin çelësa në heshtje

- **Data:** 2026-08-02
- **Vëzhguar nga:** Claude
- **Konteksti:** Zbatimi i 26 çelësave të përkthyer i18next në të 36 gjuhët përmes aftësisë `translate`
- **Çfarë ishte befasuese:** Çdo thirrje është një lexim-modifikim-shkrim mbi të 36 skedarët gjuhësorë, prandaj dy thirrje që ekzekutohen njëkohësisht e shkelin njëra-tjetrën dhe një çelës zhduket pa asnjë gabim. Aftësia `translate` udhëzon shprehimisht nisjen e deri në 4 nënagjentëve njëkohësisht, secili prej të cilëve do ta thërriste skriptin.
- **Ndikimi:** Dështon në heshtje: çelësat zhduken nga gjuhë të rastësishme dhe diff-i vazhdon të duket i besueshëm.
- **Zbutja:** Mos i lini kurrë nënagjentët përkthyes të shkruajnë skedarë gjuhësorë njëkohësisht — bëjini të prodhojnë vetëm skedarë JSON fjalorësh, pastaj zbatojini të gjithë çelësat në mënyrë serike nga agjenti prind. Pas zbatimit, verifikoni në mënyrë programatike që secili çelës ekziston në të 35 gjuhët jo-angleze dhe që asnjë vlerë nuk është identike bajt për bajt me burimin anglisht.
- **Statusi:** i konfirmuar
- **Përditësim (2026-08-10):** Më parë skripti e zgjidhte gjithashtu objektivin e vet si `path.join(process.cwd(), "public", "translations")`, prandaj komanda e dokumentuar nga rrënja e depos dështonte me "Translations directory not found" dhe duhej ekzekutuar nga `about/`. Tani ai e zgjidh hapësirën e punës nga direktoria aktuale ose nga vendndodhja e vet, dhe funksionon nga kudo. Kurthi i njëkohshmërisë i përshkruar më sipër mbetet i pandryshuar.

### Kontrollet e anotimit në zhvillim mund t'i kapin klikimet e automatizuara

- **Konteksti:** Sajtet about dhe chain kanë kontrolle fikse në këndin poshtë djathtas, aty ku në zhvillim shfaqet edhe shiriti i veglave Agentation.
- **Zbutja:** `scripts/pw-session.sh open` regjistron `window.__NO_DEV_TOOLBAR__ = true` përpara se ta ringarkojë faqen. Inicializuesi i Agentation respekton edhe `__VISUAL_TESTING__` dhe `__PROFILING__`; inspektimi i kodit burimor mbetet i disponueshëm në mënyrë të pavarur. Automatizimi i drejtpërdrejtë i shfletuesit duhet ta vendosë të njëjtin flamur përpara se të ngarkojë aplikacionin.

### `skills add` i instalon kopjet për Codex dhe Cursor në direktorinë `.agents/` që injorohet nga Git

- **Data:** 2026-08-18
- **Vëzhguar nga:** Tommaso + Claude
- **Konteksti:** Instalimi i aftësisë `improve-threejs` nga `millionco/react-doctor` me CLI-në `skills` (`vercel-labs/skills`).
- **Çfarë ishte befasuese:** `npx skills add <repo> --skill <name> --agent codex` dhe `--agent cursor` shkruajnë që të dyja te `.agents/skills/<name>/`, jo te `.codex/skills/` ose `.cursor/skills/`. `AGENTS.md` ndalon një direktori `.agents/` në nivel depoje dhe `.gitignore:29` e injoron atë, prandaj të dyja kopjet mbeten në heshtje të pagjurmuara. Vetëm `--agent claude-code` shkruan te `.claude/skills/` e pritur. Veçmas, forma e dokumentuar me presje (`--agent claude-code,codex,cursor`) dështon me "Invalid agents" dhe nuk instalon asgjë, edhe pse secili emër është i vlefshëm më vete.
- **Ndikimi:** Instalimi raporton sukses, ndërkohë që dy nga tri kopjet për zinxhirët e veglave përfundojnë diku ku nuk do të futen kurrë në depo, prandaj pas një klonimi të ri Codex dhe Cursor mbeten në heshtje pa aftësinë. Forma me presje mund të prodhojë gjithashtu një instalim që nuk bën asgjë, por që duket si i suksesshëm.
- **Zbutja aktuale:** Depoja tani e gjurmon `.agents/skills` si burimin e saj kanonik dhe i gjeneron kopjet për Claude me `yarn ai-workflow:sync`. Ndalimi i dikurshëm i `.agents` dhe rregulli përkatës i injorimit janë hequr. Mos i kopjoni aftësitë e reja në tri rrënjë të pavarura; pas shtimit të një aftësie, kontrolloni paritetin e daljeve të gjeneruara dhe katalogun e aplikacionit.
- **Statusi:** i konfirmuar
