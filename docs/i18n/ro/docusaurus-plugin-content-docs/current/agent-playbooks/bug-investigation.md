# Flux de lucru pentru investigarea erorilor

Utilizați acest lucru atunci când o eroare este raportată într-un anumit fișier/linie/bloc de cod.

## Primul pas obligatoriu

Înainte de editare, verificați istoricul git pentru codul relevant. Este posibil ca colaboratorii anteriori să fi introdus un comportament pentru un caz limită/o soluție de soluție.

## Fluxul de lucru

1. Scanați titlurile de comitere recente (numai titluri) pentru fișier/zonă:

```bash
# Titluri de comitere recente pentru un anumit fișier
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Titluri de comitere recente pentru un anumit interval de linii
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspectați numai comiterile relevante cu diferențe în domeniu:

```bash
# Afișează mesajul de comitere + dif. pentru un fișier
git show <commit-hash> -- path/to/file.tsx
```

3. Continuați cu reproducerea și reparați după înțelegerea contextului istoric.

## Regula de depanare

Când este blocat, căutați pe web remedieri/soluții de soluție recente.
