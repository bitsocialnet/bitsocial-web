# Virheiden tutkimisen työnkulku

Käytä tätä, kun vika ilmoitetaan tietyssä tiedostossa/rivissä/koodilohkossa.

## Pakollinen ensimmäinen askel

Ennen muokkaamista tarkista asianmukainen koodi git-historiasta. Aiemmat kirjoittajat ovat saattaneet ottaa käyttöön toiminnan reunatapauksessa/kiertotavan.

## Työnkulku

1. Tarkista tiedoston/alueen viimeisimmät toimitusotsikot (vain otsikot):

```bash
# Recent commit titles for a specific file
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Recent commit titles for a specific line range
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Tarkista vain asiaankuuluvat sitoumukset, joissa on laajennettu ero:

```bash
# Show commit message + diff for one file
git show <commit-hash> -- path/to/file.tsx
```

3. Jatka kopiointia ja korjaa, kun olet ymmärtänyt historiallisen kontekstin.

## Vianetsintäsääntö

Kun olet estetty, etsi verkosta viimeisimpiä korjauksia/kiertotapoja.
