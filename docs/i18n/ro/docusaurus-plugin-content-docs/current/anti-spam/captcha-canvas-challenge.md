---
title: Captcha Canvas Challenge
description: Generator de captcha autonom, bazat pe imagini, cu caractere, dimensiuni și culori configurabile.
sidebar_position: 2
---

# Captcha Canvas Challenge

:::warning Denumire moștenită
Acest pachet a fost publicat inițial în domeniul de aplicare `@plebbit`. A fost redenumit în `@bitsocial/captcha-canvas-challenge`. Referințele la vechiul nume pot apărea în continuare în documentația sau bazele de coduri mai vechi.
:::

Captcha Canvas Challenge este un generator de captcha de imagine independent extras inițial din `plebbit-js`. Redă textul randomizat pe o pânză HTML și returnează imaginea rezultată, pe care comunitățile o pot prezenta autorilor ca o provocare de spam.

**Cod sursă:** [github.com/bitsocialnet/captcha-canvas-challenge](https://github.com/bitsocialnet/captcha-canvas-challenge)

## Cerințe

- **Node.js** >= 22
- **Numai ESM** -- acest pachet nu include versiuni CommonJS.
- **Dependență de peertime de execuție:** `@plebbit/plebbit-js` (migrează la `@pkc/pkc-js`)

## Instalare

```bash
npm install @bitsocial/captcha-canvas-challenge
```

## Opțiuni de configurare

| Opțiunea     | Tip      | Implicit  | Descriere                                                  |
| ------------ | -------- | --------- | ---------------------------------------------------------- |
| `characters` | `number` | `6`       | Numărul de caractere aleatorii redate în imaginea captcha. |
| `height`     | `number` | `100`     | Înălțimea imaginii generate în pixeli.                     |
| `width`      | `number` | `300`     | Lățimea imaginii generate în pixeli.                       |
| `colors`     | `string` | `#32cf7e` | Culoarea primară folosită pentru textul captcha.           |

## Cum funcționează

1. Generatorul alege un șir aleatoriu de lungimea configurată.
2. Șirul este redat pe o pânză cu zgomot vizual pentru a rezista la OCR.
3. Imaginea rezultată (și răspunsul așteptat) sunt returnate, astfel încât aplicația care apelează să poată prezenta provocarea și să verifice ulterior răspunsul.

Deoarece pachetul este un generator de imagini pur, nu se ocupă de gestionarea rețelelor sau a sesiunilor de unul singur. Este destinat să fie integrat într-un flux de provocări mai larg -- de exemplu, ca unul dintre tipurile de provocări acceptate de [Spam Blocker](./spam-blocker.md).
