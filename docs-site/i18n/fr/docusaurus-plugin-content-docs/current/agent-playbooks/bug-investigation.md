# Flux de travail d'enquête sur les bogues

Utilisez-le lorsqu'un bug est signalé dans un fichier/ligne/bloc de code spécifique.

## Première étape obligatoire

Avant de modifier, vérifiez l'historique git pour le code concerné. Les contributeurs précédents peuvent avoir introduit un comportement pour un cas limite/une solution de contournement.

## Flux de travail

1. Analysez les titres de commit récents (titres uniquement) pour le fichier/la zone :

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspectez uniquement les commits pertinents avec des différences étendues :

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Continuez la reproduction et corrigez après avoir compris le contexte historique.

## Règle de dépannage

En cas de blocage, recherchez sur le Web les correctifs/solutions de contournement récents.
