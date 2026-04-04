# Arbeidsflyt for feilundersøkelse

Bruk dette når en feil er rapportert i en bestemt fil/linje/kodeblokk.

## Obligatorisk første trinn

Før du redigerer, sjekk git-historikken for den relevante koden. Tidligere bidragsytere kan ha introdusert atferd for en kantsak/løsning.

## Arbeidsflyt

1. Skann nylige forpliktelsestitler (bare titler) for filen/området:

```bash
# Nylige commit-titler for en bestemt fil
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Nylige commit-titler for et spesifikt linjeområde
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspiser bare relevante commits med scoped diff:

```bash
# Vis commit melding + diff for én fil
git show <commit-hash> -- path/to/file.tsx
```

3. Fortsett med reproduksjon og fiks etter å ha forstått historiekonteksten.

## Feilsøkingsregel

Når blokkert, søk på nettet etter nylige rettelser/løsninger.
