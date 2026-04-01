# Arbeidsflyt for feilundersøkelse

Bruk dette når en feil er rapportert i en bestemt fil/linje/kodeblokk.

## Obligatorisk første trinn

Før du redigerer, sjekk git-historikken for den relevante koden. Tidligere bidragsytere kan ha introdusert atferd for en kantsak/løsning.

## Arbeidsflyt

1. Skann nylige forpliktelsestitler (bare titler) for filen/området:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspiser bare relevante commits med scoped diff:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Fortsett med reproduksjon og fiks etter å ha forstått historiekonteksten.

## Feilsøkingsregel

Når blokkert, søk på nettet etter nylige rettelser/løsninger.
