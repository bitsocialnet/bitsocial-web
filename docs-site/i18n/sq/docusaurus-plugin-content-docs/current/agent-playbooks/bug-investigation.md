# Rrjedha e punës për hetimin e defekteve

Përdoreni këtë kur raportohet një gabim në një bllok specifik skedari/rreshti/kodi.

## Hapi i parë i detyrueshëm

Para se të redaktoni, kontrolloni historinë e git për kodin përkatës. Kontribuesit e mëparshëm mund të kenë prezantuar sjellje për një rast të skajshëm/zgjidhje.

## Rrjedha e punës

1. Skanoni titujt e kryerjes së fundit (vetëm titujt) për skedarin/zonën:

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspektoni vetëm detyrat përkatëse me dallime të shtrira:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Vazhdoni me riprodhimin dhe rregulloni pasi të keni kuptuar kontekstin e historisë.

## Rregulla për zgjidhjen e problemeve

Kur bllokohet, kërkoni në ueb për rregullime/zgjidhje të fundit.
