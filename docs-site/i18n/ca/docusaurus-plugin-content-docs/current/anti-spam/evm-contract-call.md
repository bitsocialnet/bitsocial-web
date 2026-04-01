---
title: EVM Contract Call Challenge
description: Repte anti-spam que verifica les condicions de la cadena trucant a un contracte intel·ligent EVM.
sidebar_position: 4
---

# EVM Contract Call Challenge

:::warning Legacy Naming
Aquest paquet es va publicar originalment sota l'àmbit `@plebbit`. S'ha canviat de nom a `@bitsocial/evm-contract-challenge`. Les referències al nom antic encara poden aparèixer a la documentació o bases de codi més antigues.
:::

EVM Contract Call Challenge és un mecanisme anti-spam que verifica les condicions de la cadena abans de permetre una publicació. Originalment extret de `plebbit-js` com a paquet autònom, permet als propietaris de comunitats exigir als autors que compleixin criteris definits per contractes intel·ligents, per exemple, tenir un saldo mínim de testimonis per poder publicar.

**Codi font:** [github.com/bitsocialnet/evm-contract-call](https://github.com/bitsocialnet/evm-contract-call)

## Requisits

- **Node.js** >= 22
- **Només per ESM**: aquest paquet no inclou compilacions CommonJS.
- **Dependència entre iguals en temps d'execució:** `@plebbit/plebbit-js` (migració a `@pkc/pkc-js`)

## Instal·lació

```bash
npm install @bitsocial/evm-contract-challenge
```

## Opcions de configuració

| Opció         | Tipus    | Descripció                                                                                    |
| ------------- | -------- | --------------------------------------------------------------------------------------------- |
| `chainTicker` | `string` | La cadena a consultar (p. ex., `eth`, `matic`, `avax`).                                       |
| `address`     | `string` | L'adreça del contracte intel·ligent per trucar.                                               |
| `abi`         | `string` | El fragment ABI de la funció que es crida.                                                    |
| `condition`   | `string` | Una expressió de comparació avaluada amb el valor de retorn del contracte (p. ex., `> 1000`). |
| `error`       | `string` | El missatge d'error es mostra als autors que no compleixen la condició.                       |

## Exemple

Un propietari de la comunitat que vulgui restringir la publicació als autors que posseeixin més de 1.000 d'un testimoni ERC-20 concret configuraria el repte amb:

- `chainTicker`: `"eth"`
- `address`: l'adreça del contracte del testimoni
- `abi`: l'ABI per a `balanceOf(address)`
- `condition`: `"> 1000"`
- `error`: `"You must hold more than 1,000 tokens to post in this community."`

Quan un autor intenta publicar, el repte truca a `balanceOf` amb l'adreça de l'autor i comprova si el valor retornat compleix la condició. Si ho fa, la publicació continua; en cas contrari, es retorna el missatge d'error configurat.

## Quan utilitzar-lo

EVM Contract Call Challenge és ideal per a:

- **Comunitats controlades per tokens** que restringeixen la publicació als titulars de fitxes.
- **Accés NFT tancat** on es requereix la propietat d'una NFT específica.
- **Espais de govern de DAO** on la participació es limita als titulars de fitxes de govern.

Per a les comunitats que no es basen en la identitat en cadena, considereu [Bloquejador de correu brossa](./spam-blocker.md) o [Repte de vals](./voucher-challenge.md).
