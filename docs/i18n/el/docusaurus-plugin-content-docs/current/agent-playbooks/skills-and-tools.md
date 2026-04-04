# Δεξιότητες και εργαλεία

Χρησιμοποιήστε αυτό το βιβλίο κατά τη ρύθμιση/προσαρμογή δεξιοτήτων και εξωτερικών εργαλείων.

## Προτεινόμενες Δεξιότητες

### Context7 (έγγραφα βιβλιοθήκης)

Για ενημερωμένα έγγραφα σε βιβλιοθήκες.

```bash
npx skills add https://github.com/intellectronica/agent-skills --skill context7
```

### Θεατρικός συγγραφέας CLI

Χρησιμοποιήστε το `playwright-cli` για αυτοματοποίηση προγράμματος περιήγησης (πλοήγηση, αλληλεπίδραση, στιγμιότυπα οθόνης, δοκιμές, εξαγωγή).

```bash
npm install -g @playwright/cli@latest
playwright-cli install --skills
```

Τοποθεσίες εγκατάστασης δεξιοτήτων:

- `.cursor/skills/playwright-cli/`
- `.claude/skills/playwright-cli/`

### Βέλτιστες πρακτικές Vercel React

Για βαθύτερη καθοδήγηση απόδοσης React/Next.

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

### Βρείτε Δεξιότητες

Ανακαλύψτε/εγκαταστήστε δεξιότητες από το ανοιχτό οικοσύστημα.

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

## Σκεπτικό πολιτικής MCP

Αποφύγετε τους διακομιστές MCP του GitHub και του προγράμματος περιήγησης MCP για αυτό το έργο, επειδή προσθέτουν σημαντικές επιβαρύνσεις σχήματος εργαλείου/πλαισίου.

- Λειτουργίες GitHub: χρησιμοποιήστε το `gh` CLI.
- Λειτουργίες προγράμματος περιήγησης: χρησιμοποιήστε το `playwright-cli`.
