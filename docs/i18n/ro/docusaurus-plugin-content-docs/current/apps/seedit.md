---
title: Seedit
description: Un forum descentralizat, în stil Reddit, fără server, construit pe protocolul Bitsocial, unde oricine poate crea și deține comunități.
sidebar_position: 2
---

# Seedit

Seedit este o alternativă fără server, fără administrator și complet descentralizată la stilul vechi Reddit, construită pe protocolul Bitsocial. Oferă utilizatorilor proprietatea completă asupra comunităților lor - oricine poate crea una, iar mai multe comunități pot concura pentru aceeași rută scurtă, cum ar fi `/s/funny`.

## Descărcări

| Platformă | Link                                               |
| --------- | -------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                   |
| Web (ENS) | `seedit.eth` prin browser Brave sau IPFS Companion |
| Desktop   | Disponibil pentru Mac, Windows și Linux            |
| Mobil     | Disponibil pentru Android                          |

## Cum funcționează comunitățile

Seedit organizează conținutul în comunități similare subreddit-urilor. Fiecare comunitate este deținută de creatorul ei și funcționează fără administrare centralizată. Mai multe comunități pot concura pentru aceeași rută de [director](/directories/), cum ar fi `/s/funny`, care deschide câștigătoarea actuală. Abonamentele și linkurile către postări indică întotdeauna spre comunitatea exactă.

### Crearea unei comunități

Există două moduri de a crea o nouă comunitate:

1. **Client desktop** — Utilizați interfața grafică încorporată în aplicația desktop pentru a vă configura și configura comunitatea.
2. **bitsocial-cli** — Rulați instrumentul CLI pentru a crea și gestiona comunități din linia de comandă.

### Lista comunității implicită

Conturile noi se abonează la o listă implicită de comunități specifice, definită în `seedit-default-subscriptions.json` din depozitul [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Candidatele pentru directoare sunt listate în fișierele `seedit-directories/seedit-<code>-directory.json` din același depozit. Pentru a adăuga comunitatea dvs. în oricare dintre liste, trimiteți o cerere de extragere cu detaliile comunității.

## Legături

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegramă**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licență**: numai GPL-2.0
