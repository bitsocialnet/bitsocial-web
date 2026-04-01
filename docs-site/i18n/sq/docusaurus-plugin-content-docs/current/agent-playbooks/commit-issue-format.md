# Formati i zotimit dhe lëshimit

Përdoreni këtë kur propozoni ose zbatoni ndryshime domethënëse të kodit.

## Formati i sugjerimit të zotimit

- **Titulli:** Stili Conventional Commits, i shkurtër, i mbështjellë me kuti të pasme.
- Përdor `perf` (jo `fix`) për optimizimet e performancës.
- **Përshkrim:** Fakultative 2-3 fjali joformale që përshkruajnë zgjidhjen. Koncize, teknike, pa pika.

Shembull:

> **Titulli i zotimit:** `fix: correct date formatting in timezone conversion`
>
> `formatDate()` u përditësua në `date-utils.ts` për të trajtuar siç duhet kompensimet e zonës kohore.

## Formati i sugjerimit të problemit të GitHub

- **Titulli:** Sa më i shkurtër që të jetë e mundur, i mbështjellë me kurriz.
- **Përshkrimi:** 2-3 fjali joformale që përshkruajnë problemin (jo zgjidhjen), sikur ende të pazgjidhura.

Shembull:

> **Çështja GitHub:**
>
> - **Titulli:** `Date formatting displays incorrect timezone`
> - **Përshkrimi:** Vula kohore e komenteve tregojnë zona kohore të pasakta kur përdoruesit shohin postime nga rajone të ndryshme. Funksioni `formatDate()` nuk merr parasysh cilësimet lokale të zonës kohore të përdoruesit.
