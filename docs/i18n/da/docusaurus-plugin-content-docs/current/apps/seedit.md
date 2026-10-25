---
title: Seedit
description: Et serverløst, decentraliseret Reddit-stil forum bygget på Bitsocial-protokollen, hvor alle kan oprette og eje fællesskaber.
sidebar_position: 2
---

# Seedit

Seedit er et serverløst, adminløst og fuldt decentraliseret alternativ til gammeldags Reddit, bygget på Bitsocial-protokollen. Det giver brugerne fuldstændigt ejerskab over deres fællesskaber - alle kan oprette et, og flere fællesskaber kan konkurrere om den samme korte rute, f.eks. `/s/funny`.

## Downloads

| Platform  | Link                                                |
| --------- | --------------------------------------------------- |
| Web       | [seedit.app](https://seedit.app)                    |
| Web (ENS) | `seedit.eth` via Brave browser eller IPFS Companion |
| Desktop   | Tilgængelig til Mac, Windows og Linux               |
| Mobil     | Tilgængelig til Android                             |

## Hvordan fællesskaber fungerer

Seedit organiserer indhold i fællesskaber, der ligner subreddits. Hvert fællesskab ejes af dets skaber og fungerer uden centraliseret administration. Flere fællesskaber kan konkurrere om den samme rute i et [katalog](/directories/), f.eks. `/s/funny`, som åbner den aktuelle vinder. Abonnementer og links til opslag peger altid på det præcise fællesskab.

### At skabe et fællesskab

Der er to måder at oprette et nyt fællesskab på:

1. **Desktop-klient** — Brug den indbyggede GUI i desktopapplikationen til at konfigurere og konfigurere dit fællesskab.
2. **bitsocial-cli** — Kør CLI-værktøjet for at oprette og administrere fællesskaber fra kommandolinjen.

### Standard fællesskabsliste

Nye konti abonnerer på en standardliste med præcise fællesskabsadresser, der er defineret i `seedit-default-subscriptions.json` i repositoriet [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Katalogkandidater står i filerne `seedit-directories/seedit-<code>-directory.json` i samme repository. For at tilføje dit fællesskab til en af listerne skal du indsende en pull request med dit fællesskabs detaljer.

## Links

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licens**: Kun GPL-2.0
