# Arbejdsgang for fejlundersøgelse

Brug dette, når en fejl er rapporteret i en bestemt fil/linje/kodeblok.

## Obligatorisk første trin

Før du redigerer, skal du kontrollere git-historikken for den relevante kode. Tidligere bidragydere kan have introduceret adfærd for en kantsag/løsning.

## Arbejdsgang

1. Scan de seneste commit-titler (kun titler) for filen/området:

```bash
# Nylige commit-titler for en bestemt fil
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Nylige commit-titler for et specifikt linjeinterval
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspicer kun relevante commits med scoped diffs:

```bash
# Vis commit besked + diff for én fil
git show <commit-hash> -- path/to/file.tsx
```

3. Fortsæt med reproduktion og rettelse efter at have forstået den historiske kontekst.

## Fejlfindingsregel

Når den er blokeret, søg på nettet efter seneste rettelser/løsninger.
