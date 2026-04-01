# Pracovní postup vyšetřování chyb

Použijte toto, když je hlášena chyba v konkrétním souboru/řádku/bloku kódu.

## Povinný první krok

Před úpravou zkontrolujte historii git pro příslušný kód. Předchozí přispěvatelé možná zavedli chování pro okrajový případ / řešení.

## Pracovní postup

1. Skenování posledních názvů odevzdání (pouze tituly) pro soubor/oblast:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Kontrolujte pouze relevantní odevzdání s rozsahem rozdílů:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Pokračujte v reprodukci a opravte po pochopení kontextu historie.

## Pravidlo pro odstraňování problémů

Po zablokování vyhledejte na webu poslední opravy/náhradní řešení.
