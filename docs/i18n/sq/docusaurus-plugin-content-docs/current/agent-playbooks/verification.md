# Verifikimi

Zgjidhni kontrollet sipas sjelljes që ka ndryshuar dhe pasigurisë që mbetet. Ripërdorni provat e suksesshme për të njëjtën gjendje përfundimtare; riekzekutojini pas redaktimeve ose dështimeve përkatëse. Kërkesat e shprehura të CI-së, të publikimit ose të përdoruesit vlejnë gjithsesi.

| Ndryshimi                                                                            | Kontrollet e përshtatshme                                                                                                       |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Vetëm tekst/komente/formatim                                                         | Diff-i, referencat, gjeneruesit përkatës; pa ndërtim të aplikacionit                                                            |
| Burimet/konfigurimi i rrjedhës së punës me AI                                        | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; rigjeneroni indekset LLM kur ka ndryshuar konteksti |
| Ndihmës ose skript i izoluar                                                         | Thirrje/fixture të fokusuara dhe kontrolle sintakse ose tipash/lint për kodin e prekur                                          |
| Ndryshim i mjedisit të përbashkët të ekzekutimit, varësive, ndërtimit ose integrimit | Kontrolle të fokusuara për pjesët e prekura plus kontrollet përkatëse të ndërtimit/tipave/lint-it më poshtë                     |
| Vetëm CSS/temë/faqosje                                                               | Rrugët/pamjet/temat e prekura në shfletuesit e zgjedhur; ndërtim kur kanë ndryshuar importet, asetet ose përpunimi i CSS-së     |
| Gjendje/efekte/performancë React                                                     | Sjellja e prekur dhe udhëzimet e zbatueshme për React; Doctor kur diagnostikimi i tij zgjidh një shqetësim konkret              |

## Kontrollet e projektit

- `yarn build:verify` zgjedh hapësirën e punës së prekur. Për një fushë të njohur përdorni `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` ose `yarn docs:build:verify`.
- `yarn build` ekzekuton qëllimisht ndërtimin e plotë të prodhimit për about/docs, përfshirë të gjitha gjuhët e dokumentacionit. Përdoreni për validim në shkallën e një publikimi ose për ndryshime që e justifikojnë këtë shtrirje.
- `yarn lint`, `yarn typecheck` dhe `yarn format:check` mbulojnë portat ekzistuese të depos; për një redaktim të ngushtë skripti, përdorni së pari kontrollet e tij të fokusuara të sintaksës/fixture-ve/formatit.
- Ndryshimet në manifest/lockfile kërkojnë `corepack yarn install`, `yarn deps:check-pinned` dhe `yarn deps:check-hardened`. `yarn knip` është vetëm këshillues për varësitë/importet.
- Kontrollet e përkthimit të dokumentacionit gjenden te [translations.md](translations.md); mos e ekzekutoni shkruesin masiv të përkthimeve për një ndryshim të fokusuar në dokumentacion.

## Provat në shfletues dhe pronësia

Përdorni Chrome për ndryshime të vogla dhe të izoluara në shfletues. Shtoni Firefox dhe WebKit për CSS/faqosje/reagueshmëri të përbashkët, API të ndjeshme ndaj shfletuesit, ndërveprime të gjera, publikime ose kritere të shprehura për shumë shfletues. Përfshini faqosjet celulare të prekura dhe sjelljen me prekje. Ripërmasimi i pamjes, më vete, nuk është emulim prekjeje. Zgjidhni rrugët dhe përmbajtjen reale nga kodi burimor, në vend që të supozoni se shembujt janë në dispozicion.

Përdorni `playwright-cli` përmes `./scripts/pw-session.sh`. Në të gjithë makinën mund të jetë aktiv vetëm një shfletues; motorët e zgjedhur ekzekutohen njëri pas tjetrit dhe çdo sesion i saktë në pronësi mbyllet edhe pas një dështimi. Ripërdorni një sesion të autorizuar që e zotëron thirrësi, pa e mbyllur. Mos përdorni kurrë pastrim global të shfletuesve dhe mos ndalni një server pronësia e të cilit është e paqartë. Për punë vetëm me dokumentacion nuk nevojitet as shfletues, as server.

Për punë me performancën, krahasoni të njëjtën rrjedhë me pamje, përmbajtje, cilësime rrjeti/CPU-je, mënyrë ndërtimi dhe ngarkesë matjeje të barasvlershme. Dalloni vëzhgimet nga shkaqet e dyshuara. Përdorni aftësinë e profilizimit kur këto matje i përgjigjen kërkesës reale.

## Provat përfundimtare

Verifikimin e rëndë e zotëron një agjent i vetëm. Inspektoni ngarkesat aktive dhe ekzekutojini në seri instalimet, ndërtimet/suitat e plota, Doctor, punën me Android/Electron dhe profilizimin në shfletues. Raportoni komandat/rezultatet dhe kufizimet specifike; të dhënat që mungojnë ose një motor i anashkaluar nuk janë rezultat kalues. Fixture-t e veglave verifikojnë formatet dhe mekanikën, jo zbulimin real nga aplikacioni nga fillimi në fund apo cilësinë e vendimeve të modelit.

## Kontrollet automatike për React

`yarn agent:verify` ekzekuton ndërtimet e zgjedhura, të ndjekura nga `yarn doctor:check` dhe `yarn perf:check`. `perf:check` përfshin kontrollin e përputhshmërisë së mbledhësit dhe vetëtestin me regresion të qëllimshëm, prandaj as CI-ja, as rruga e verifikimit të agjentit nuk kanë nevojë për një kalim të veçantë `perf:test`. Instaloni një herë veglat e fiksuara të shfletuesit me `yarn perf:install` (`--with-deps` në CI me Linux). Pas kalimit të plotë përkatës, përdorni filtrat e objektivave/skenarëve për riekzekutime të fokusuara. Buxhetet e skenarëve janë të shprehura te `scripts/react-perf/config.mjs`; ruani provat dhe rregulloni një regresion përpara se të shqyrtoni një ndryshim të justifikuar të vijës bazë. Ndërtimet e zakonshme të prodhimit e lënë jashtë Bippy-n; komandat e veçanta `build:profile:*` ofrojnë instrumentimin zyrtar të profilizimit të React.

Skenari `apps-search` i sajtit about e mban ritmin duke pritur, pas çdo karakteri, që vlera e URL-së dhe e fushës së hyrjes të zbatohet. Rezultati i tij kalues mbulon atë sekuencë kërkimesh të zbatuara, jo reagueshmërinë gjatë shtypjes së shpejtë. Kur vlerësoni humbjen e karaktereve ose reagueshmërinë e hyrjes, përdorni një riprodhim të veçantë me hyrje të shpejtë.
