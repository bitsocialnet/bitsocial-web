# Buggutredningsarbetsflöde

Använd detta när en bugg rapporteras i en specifik fil/rad/kodblock.

## Obligatoriskt första steg

Innan du redigerar, kontrollera git-historiken för den relevanta koden. Tidigare bidragsgivare kan ha introducerat beteende för ett kantfall/lösning.

## Arbetsflöde

1. Skanna senaste commit-titlar (endast titlar) för filen/området:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspektera endast relevanta commits med scoped diffs:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Fortsätt med reproduktion och fixa efter att ha förstått det historiska sammanhanget.

## Felsökningsregel

När den är blockerad, sök på webben efter senaste korrigeringar/lösningar.
