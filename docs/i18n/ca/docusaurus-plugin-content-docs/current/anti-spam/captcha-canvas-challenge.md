---
title: Captcha Canvas Challenge
description: Generador de captcha autònom basat en imatges amb caràcters, dimensions i colors configurables.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Noms heretats
Aquest paquet es va publicar originalment sota l'àmbit `@plebbit`. S'ha canviat de nom a `@bitsocial/captcha-canvas-challenge`. Les referències al nom antic encara poden aparèixer a la documentació o bases de codi més antigues.
:::

Captcha Canvas Challenge és un generador de captcha d'imatges autònom extret originalment de `plebbit-js`. Representa el text aleatori en un llenç HTML i retorna la imatge resultant, que les comunitats poden presentar als autors com un repte de correu brossa.

**Codi font:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Requisits

- **Node.js** >= 22
- **Només per ESM**: aquest paquet no inclou compilacions CommonJS.
- **Dependència entre iguals en temps d'execució:** `@plebbit/plebbit-js` (migració a `@pkc/pkc-js`)

## Instal·lació

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opcions de configuració

| Opció        | Tipus    | Per defecte | Descripció                                                      |
| ------------ | -------- | ----------- | --------------------------------------------------------------- |
| `characters` | `number` | `6`         | Nombre de caràcters aleatoris representats a la imatge captcha. |
| `height`     | `number` | `100`       | Alçada de la imatge generada en píxels.                         |
| `width`      | `number` | `300`       | Amplada de la imatge generada en píxels.                        |
| `colors`     | `string` | `#32cf7e`   | Color primari utilitzat per al text captcha.                    |

## Com funciona

1. El generador tria una cadena aleatòria de la longitud configurada.
2. La cadena es representa en un llenç amb soroll visual per resistir l'OCR.
3. La imatge resultant (i la resposta esperada) es retorna perquè l'aplicació de trucada pugui presentar el repte i després verificar la resposta.

Com que el paquet és un generador d'imatges pur, no gestiona la gestió de la xarxa ni la sessió per si sol. Està pensat per integrar-se en un flux de desafiaments més gran; per exemple, com un dels tipus de desafiament admesos per [Spam Blocker](./spam-blocker.md).
