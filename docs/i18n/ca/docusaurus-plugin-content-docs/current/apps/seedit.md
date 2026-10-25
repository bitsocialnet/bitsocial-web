---
title: Seedit
description: Un fòrum sense servidor i descentralitzat d'estil Reddit basat en el protocol Bitsocial on qualsevol pot crear i tenir comunitats.
sidebar_position: 2
---

# Seedit

Seedit és una alternativa sense servidor, sense administrador i totalment descentralitzada a Reddit d'estil antic, basada en el protocol Bitsocial. Ofereix als usuaris la propietat total de les seves comunitats: qualsevol pot crear-ne una i diverses comunitats poden competir per la mateixa ruta curta, com ara `/s/funny`.

## Descàrregues

| Plataforma | Enllaç                                                      |
| ---------- | ----------------------------------------------------------- |
| Web        | [seedit.app](https://seedit.app)                            |
| Web (ENS)  | `seedit.eth` mitjançant el navegador Brave o IPFS Companion |
| Escriptori | Disponible per a Mac, Windows i Linux                       |
| Mòbil      | Disponible per a Android                                    |

## Com funcionen les comunitats

Seedit organitza el contingut en comunitats semblants als subreddits. Cada comunitat és propietat del seu creador i funciona sense administració centralitzada. Diverses comunitats poden competir per la mateixa ruta de [directori](/directories/), com ara `/s/funny`, que obre la guanyadora actual. Les subscripcions i els enllaços a publicacions sempre apunten a la comunitat exacta.

### Creant una comunitat

Hi ha dues maneres de crear una nova comunitat:

1. **Client d'escriptori**: utilitzeu la GUI integrada a l'aplicació d'escriptori per configurar i configurar la vostra comunitat.
2. **bitsocial-cli** — Executeu l'eina CLI per crear i gestionar comunitats des de la línia d'ordres.

### Llista de comunitats per defecte

Els comptes nous se subscriuen a una llista predeterminada d'adreces exactes de comunitats, definida a `seedit-default-subscriptions.json` al repositori [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Les comunitats candidates dels directoris figuren als fitxers `seedit-directories/seedit-<code>-directory.json` del mateix repositori. Per afegir la vostra comunitat a qualsevol de les dues llistes, envieu una pull request amb els detalls de la vostra comunitat.

## Enllaços

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegrama**: [t.me/seeditreact](https://t.me/seeditreact)
- **Llicència**: només GPL-2.0
