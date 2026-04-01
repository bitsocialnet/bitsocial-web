# Surprize cunoscute

Acest fișier urmărește punctele de confuzie specifice depozitului care au cauzat greșelile agentului.

## Criterii de intrare

Adăugați o intrare numai dacă toate sunt adevărate:

- Este specific acestui depozit (nu sfaturi generice).
- Este probabil să se repete pentru viitorii agenți.
- Are o atenuare concretă care poate fi urmată.

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

### Portless modifică adresa URL canonică a aplicației locale

- **Data:** 2026-03-18
- **Observat de:** Codex
- **Context:** Verificarea browserului și fluxurile de fum
- **Ce a fost surprinzător:** URL-ul local implicit nu este portul obișnuit Vite. Repo se așteaptă ca `http://bitsocial.localhost:1355` prin Portless, așa că verificarea `localhost:3000` sau `localhost:5173` poate lovi aplicația greșită sau nimic.
- **Impact:** Verificările browserului pot eșua sau valida ținta greșită chiar și atunci când serverul de dezvoltare este sănătos.
- **Atenuare:** utilizați mai întâi `http://bitsocial.localhost:1355`. Ocoliți-l doar cu `PORTLESS=0 corepack yarn start` atunci când aveți nevoie în mod explicit de un port Vite direct.
- **Stare:** confirmată

### Cârligele Commitizen blochează comiterile non-interactive

- **Data:** 2026-03-18
- **Observat de:** Codex
- **Context:** fluxuri de lucru de comitere bazate pe agent
- **Ce a fost surprinzător:** `git commit` declanșează Commitizen prin Husky și așteaptă intrarea interactivă TTY, care blochează shell-urile de agenți non-interactiv.
- **Impact:** Agenții se pot bloca pe termen nelimitat în timpul a ceea ce ar trebui să fie o comitere normală.
- **Atenuare:** Folosiți `git commit --no-verify -m "message"` pentru comiterile create de agent. Oamenii pot folosi în continuare `corepack yarn commit` sau `corepack yarn exec cz`.
- **Stare:** confirmată

### Corepack este necesar pentru a evita Yarn classic

- **Data:** 2026-03-19
- **Observat de:** Codex
- **Context:** Migrarea managerului de pachete la Yarn 4
- **Ceea ce a fost surprinzător:** Mașina are încă o instalare globală Yarn clasică pe `PATH`, așa că rularea simplă a `yarn` se poate rezolva la v1 în loc de versiunea Yarn 4 fixată.
- **Impact:** Dezvoltatorii pot ocoli accidental fixarea managerului de pachete din repo și pot obține un comportament diferit de instalare sau fișier de blocare.
- **Atenuare:** Folosiți `corepack yarn ...` pentru comenzile shell sau rulați mai întâi `corepack enable`, astfel încât `yarn` să se rezolve la versiunea Yarn 4 fixată.
- **Stare:** confirmată

### Numele aplicațiilor Portless remediate se ciocnesc în arborele de lucru Bitsocial Web

- **Data:** 2026-03-30
- **Observat de:** Codex
- **Context:** Pornirea `yarn start` într-un arbore de lucru Bitsocial Web în timp ce un alt arbore de lucru era deja difuzat prin Portless
- **Ceea ce a fost surprinzător:** Utilizarea numelui literal al aplicației Portless `bitsocial` în fiecare arbore de lucru face ca ruta în sine să se ciocnească, chiar și atunci când porturile de rezervă sunt diferite, astfel încât al doilea proces eșuează deoarece `bitsocial.localhost` este deja înregistrat.
- **Impact:** ramurile Bitsocial Web paralele se pot bloca reciproc, chiar dacă Portless este menit să le permită să coexiste în siguranță.
- **Atenuare:** Păstrați pornirea fără port în spatele `scripts/start-dev.mjs`, care acum folosește o rută `*.bitsocial.localhost:1355` cu ramuri în afara cazului canonic și se întoarce la o rută cu ramuri atunci când numele `bitsocial.localhost` gol este deja ocupat.
- **Stare:** confirmată

### Previzualizarea documentelor este folosită pentru a codifica hard portul 3001

- **Data:** 2026-03-30
- **Observat de:** Codex
- **Context:** Rularea `yarn start` împreună cu alți repoziții și agenți locali
- **Ceea ce a fost surprinzător:** Comanda root dev a rulat spațiul de lucru docs cu `docusaurus start --port 3001`, așa că întreaga sesiune de dev a eșuat ori de câte ori un alt proces deținea deja `3001`, chiar dacă aplicația principală folosea deja Portless.
- **Impact:** `yarn start` ar putea ucide procesul de pornire imediat după ce a pornit Docs. Lucrări locale fără legătură cu o coliziune cu un port documente.
- **Atenuare:** Păstrați pornirea documentelor în spatele `yarn start:docs`, care acum utilizează Portless plus `scripts/start-docs.mjs` pentru a onora un port liber injectat sau pentru a reveni la următorul port disponibil atunci când este rulat direct.
- **Stare:** confirmată
