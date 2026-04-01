# Hibavizsgálati munkafolyamat

Használja ezt, ha egy adott fájlban/sorban/kódblokkban hibát jelentenek.

## Kötelező Első lépés

Szerkesztés előtt ellenőrizze a git előzményeit a megfelelő kódhoz. Előfordulhat, hogy a korábbi közreműködők egy szélső eset/kerülő megoldás viselkedését vezették be.

## Munkafolyamat

1. A fájl/terület legutóbbi véglegesítési címeinek vizsgálata (csak a címek):

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Csak a hatókörű eltérésekkel rendelkező releváns commitokat vizsgálja meg:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. A történelem kontextusának megértése után folytassa a sokszorosítást és a javítást.

## Hibaelhárítási szabály

Ha le van tiltva, keressen az interneten a legutóbbi javításokat/kerülő megoldásokat.
