# Surpriza të njohura

Ky skedar gjurmon pikat konfuze specifike të depove që shkaktuan gabime të agjentëve.

## Kriteret e hyrjes

Shtoni një hyrje vetëm nëse të gjitha janë të vërteta:

- Është specifike për këtë depo (jo këshilla të përgjithshme).
- Ka të ngjarë të përsëritet për agjentët e ardhshëm.
- Ka një zbutje konkrete që mund të ndiqet.

Nëse nuk jeni të sigurt, pyesni zhvilluesin përpara se të shtoni një hyrje.

## Modeli i hyrjes

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

## Regjistrimet

### Portless ndryshon URL-në kanonike lokale të aplikacionit

- **Data:** 2026-03-18
- **Vëzhguar nga:** Codex
- **Konteksti:** Verifikimi i shfletuesit dhe rrjedhja e tymit
- **Ajo që ishte befasuese:** URL-ja lokale e paracaktuar nuk është porti i zakonshëm Vite. Repo pret `https://bitsocial.localhost` përmes Portless, kështu që kontrollimi i `localhost:3000` ose `localhost:5173` mund të godasë aplikacionin e gabuar ose asgjë fare.
- **Ndikimi:** Kontrollet e shfletuesit mund të dështojnë ose të vërtetojnë objektivin e gabuar edhe kur serveri i devijimit është i shëndetshëm.
- **Zbutja:** Përdor `https://bitsocial.localhost` fillimisht. Anashkaloni atë vetëm me `PORTLESS=0 corepack yarn start` kur keni nevojë në mënyrë të qartë për një port të drejtpërdrejtë Vite.
- **Statusi:** i konfirmuar

### Hooks Commitizen bllokojnë angazhimet jo-interaktive

- **Data:** 2026-03-18
- **Vëzhguar nga:** Codex
- **Konteksti:** Rrjedhat e punës së kryerjes së drejtuar nga agjentët
- **Ajo që ishte befasuese:** `git commit` aktivizon Commitizen përmes Husky dhe pret për hyrjen interaktive TTY, e cila varet nga predhat e agjentëve jo-interaktivë.
- **Ndikimi:** Agjentët mund të ngecin për një kohë të pacaktuar gjatë asaj që duhet të jetë një angazhim normal.
- **Zbutja:** Përdor `git commit --no-verify -m "message"` për kryerjet e krijuara nga agjentët. Njerëzit mund të përdorin ende `corepack yarn commit` ose `corepack yarn exec cz`.
- **Statusi:** i konfirmuar

### Corepack kërkohet për të shmangur fijet klasike

- **Data:** 2026-03-19
- **Vëzhguar nga:** Codex
- **Konteksti:** Migrimi i menaxherit të paketës te Yarn 4
- **Ajo që ishte befasuese:** Makina ka ende një instalim klasik të fijeve globale në `PATH`, kështu që ekzekutimi i thjeshtë i `yarn` mund të zgjidhet në v1 në vend të versionit të fijeve të fiksuar 4.
- **Ndikimi:** Zhvilluesit mund të anashkalojnë aksidentalisht fiksimin e menaxherit të paketave të repos dhe të marrin sjellje të ndryshme instalimi ose dalje të skedarit të kyçjes.
- **Zbutja:** Përdor `corepack yarn ...` për komandat e guaskës, ose ekzekuto fillimisht `corepack enable`, kështu që `yarn` i thjeshtë zgjidhet në versionin e fijeve të fiksuar 4.
- **Statusi:** i konfirmuar

### Emrat e fiksuar të aplikacioneve Portless përplasen nëpër pemët e punës të Uebit Bitsocial

- **Data:** 2026-03-30
- **Vëzhguar nga:** Codex
- **Konteksti:** Nisja e `yarn start` në një pemë pune të Uebit Bitsocial ndërsa një pemë tjetër pune po shërbente tashmë përmes Portless
- **Ajo që ishte befasuese:** Përdorimi i emrit të drejtpërdrejtë të aplikacionit Portless `bitsocial` në çdo pemë pune bën që vetë rruga të përplaset, edhe kur portat mbështetëse janë të ndryshme, kështu që procesi i dytë dështon sepse `bitsocial.localhost` është regjistruar tashmë.
- **Ndikimi:** Degët paralele të Uebit Bitsocial mund të bllokojnë njëra-tjetrën edhe pse Portless ka për qëllim t'i lejojë ato të bashkëjetojnë në mënyrë të sigurt.
- **Zbutja:** Mbajeni fillimin Portless pas `scripts/start-dev.mjs`, i cili tani përdor një rrugë `*.bitsocial.localhost` me shtrirje të degës jashtë rastit kanonik dhe kthehet në një rrugë me shtrirje të degës kur emri i zhveshur `bitsocial.localhost` është tashmë i zënë.
- **Statusi:** i konfirmuar

### Pamja paraprake e Docs përdoret në portin 3001 të kodit të fortë

- **Data:** 2026-03-30
- **Vëzhguar nga:** Codex
- **Konteksti:** Ekzekutimi i `yarn start` së bashku me depo dhe agjentë të tjerë lokalë
- **Ajo që ishte befasuese:** Komanda root dev ekzekutoi hapësirën e punës të dokumenteve me `docusaurus start --port 3001`, kështu që i gjithë sesioni i programit dështonte sa herë që një proces tjetër zotëronte tashmë `3001`, edhe pse aplikacioni kryesor përdorte tashmë Portless.
- **Ndikimi:** `yarn start` mund të vrasë procesin e uebit menjëherë pas nisjes së tij, duke ndërprerë punën lokale të palidhur me një përplasje docs-port.
- **Zbutja:** Mbani fillimin e dokumenteve pas `yarn start:docs`, i cili tani përdor Portless plus `scripts/start-docs.mjs` për të nderuar një port të lirë të injektuar ose të kthehet në portin tjetër të disponueshëm kur ekzekutohet drejtpërdrejt.
- **Statusi:** i konfirmuar
