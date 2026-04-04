# Bugonderzoeksworkflow

Gebruik dit wanneer een bug wordt gerapporteerd in een specifiek bestand/regel/codeblok.

## Verplichte eerste stap

Controleer vóór het bewerken de gitgeschiedenis op de relevante code. Eerdere bijdragers hebben mogelijk gedrag geïntroduceerd voor een randgeval/oplossing.

## Werkstroom

1. Scan recente committitels (alleen titels) voor het bestand/gebied:

```bash
# Recente committitels voor een specifiek bestand
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recente committitels voor een specifiek regelbereik
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspecteer alleen relevante commits met scoped diffs:

```bash
# Toon commit-bericht + diff voor één bestand
git show <commit-hash> -- path/to/file.tsx
```

3. Ga door met reproductie en herstel nadat u de geschiedeniscontext begrijpt.

## Regel voor probleemoplossing

Wanneer geblokkeerd, zoek op internet naar recente oplossingen/oplossingen.
