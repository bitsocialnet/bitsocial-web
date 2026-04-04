# Hibavizsgálati munkafolyamat

Használja ezt, ha egy adott fájlban/sorban/kódblokkban hibát jelentenek.

## Kötelező Első lépés

Szerkesztés előtt ellenőrizze a git előzményeit a megfelelő kódhoz. Előfordulhat, hogy a korábbi közreműködők egy szélső eset/kerülő megoldás viselkedését vezették be.

## Munkafolyamat

1. A fájl/terület legutóbbi véglegesítési címeinek vizsgálata (csak a címek):

```bash
# Legutóbbi véglegesítési címek egy adott fájlhoz
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Legutóbbi véglegesítési címek egy adott sortartományhoz
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Csak a hatókörű eltérésekkel rendelkező releváns commitokat vizsgálja meg:

```bash
# A véglegesítési üzenet + diff megjelenítése egy fájlnál
git show <commit-hash> -- path/to/file.tsx
```

3. A történelem kontextusának megértése után folytassa a sokszorosítást és a javítást.

## Hibaelhárítási szabály

Ha le van tiltva, keressen az interneten a legutóbbi javításokat/kerülő megoldásokat.
