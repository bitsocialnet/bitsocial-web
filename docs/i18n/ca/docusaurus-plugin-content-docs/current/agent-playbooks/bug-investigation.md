# Flux de treball d'investigació d'errors

Utilitzeu-ho quan s'informa d'un error en un bloc de fitxer/línia/codi específic.

## Primer pas obligatori

Abans d'editar, comproveu l'historial de git per trobar el codi rellevant. És possible que els col·laboradors anteriors hagin introduït un comportament per a un cas o una solució alternativa.

## Flux de treball

1. Escaneja els títols de confirmació recents (només els títols) per al fitxer/àrea:

```bash
# Títols de confirmació recents per a un fitxer específic
git log --oneline -10 -- src/components/post-desktop/post-desktop.tsx

# Títols de confirmació recents per a un interval de línies concret
git blame -L 120,135 src/components/post-desktop/post-desktop.tsx
```

2. Inspeccioneu només les confirmacions rellevants amb diferències d'abast:

```bash
# Mostra missatge de confirmació + diferència per a un fitxer
git show <commit-hash> -- path/to/file.tsx
```

3. Continuar amb la reproducció i arreglar després d'entendre el context històric.

## Regla de resolució de problemes

Quan estigui bloquejat, cerqueu al web solucions o solucions alternatives recents.
