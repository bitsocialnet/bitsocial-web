---
title: Captcha Canvas Challenge
description: Générateur de captcha autonome basé sur des images avec caractères, dimensions et couleurs configurables.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Dénomination héritée
Ce package a été initialement publié sous la portée `@plebbit`. Il a été renommé `@bitsocial/captcha-canvas-challenge`. Les références à l’ancien nom peuvent encore apparaître dans d’anciennes documentations ou bases de code.
:::

Captcha Canvas Challenge est un générateur de captcha d'image autonome extrait à l'origine de `plebbit-js`. Il restitue le texte aléatoire sur un canevas HTML et renvoie l'image résultante, que les communautés peuvent présenter aux auteurs comme un défi de spam.

**Code source :** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Exigences

- **Node.js** >= 22
- **ESM uniquement** : ce package ne fournit pas de versions CommonJS.
- **Dépendance des homologues d'exécution :** `@plebbit/plebbit-js` (migration vers `@pkc/pkc-js`)

## Mise en place

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Options de configuration

| Options      | Tapez    | Par défaut | Descriptif                                                   |
| ------------ | -------- | ---------- | ------------------------------------------------------------ |
| `characters` | `number` | `6`        | Nombre de caractères aléatoires rendus dans l'image captcha. |
| `height`     | `number` | `100`      | Hauteur de l'image générée en pixels.                        |
| `width`      | `number` | `300`      | Largeur de l'image générée en pixels.                        |
| `colors`     | `string` | `#32cf7e`  | Couleur primaire utilisée pour le texte captcha.             |

## Comment ça marche

1. Le générateur sélectionne une chaîne aléatoire de la longueur configurée.
2. La chaîne est rendue sur une toile avec un bruit visuel pour résister à l'OCR.
3. L'image résultante (et la réponse attendue) sont renvoyées afin que l'application appelante puisse présenter le défi et vérifier ultérieurement la réponse.

Étant donné que le package est un pur générateur d’images, il ne gère pas seul la mise en réseau ou la gestion de sessions. Il est destiné à être intégré dans un flux de défi plus large -- par exemple, comme l'un des types de défi pris en charge par [Spam Blocker](./spam-blocker.md).
