# Format de validation et de problème

Utilisez-le lorsque vous proposez ou implémentez des modifications de code significatives.

## Format de suggestion de validation

- **Titre :** Style Commits conventionnel, court, enveloppé de backticks.
- Utilisez `perf` (et non `fix`) pour optimiser les performances.
- **Description :** 2 à 3 phrases informelles facultatives décrivant la solution. Concis, technique, sans puces.

Exemple :

> **Titre du commit :** `fix: correct date formatting in timezone conversion`
>
> Mise à jour de `formatDate()` dans `date-utils.ts` pour gérer correctement les décalages horaires.

## Format de suggestion de problème GitHub

- **Titre :** Aussi court que possible, enveloppé de guillemets.
- **Description :** 2-3 phrases informelles décrivant le problème (pas la solution), comme s'il n'était toujours pas résolu.

Exemple :

> **Problème GitHub :**
>
> - **Titre :** `Date formatting displays incorrect timezone`
> - **Description :** Les horodatages des commentaires affichent des fuseaux horaires incorrects lorsque les utilisateurs consultent des publications de différentes régions. La fonction `formatDate()` ne prend pas en compte les paramètres de fuseau horaire local de l'utilisateur.
