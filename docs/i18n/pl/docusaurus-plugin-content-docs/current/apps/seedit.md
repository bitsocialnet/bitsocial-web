---
title: Seedit
description: Bezserwerowe, zdecentralizowane forum w stylu Reddit zbudowane na protokole Bitsocial, na którym każdy może tworzyć społeczności i posiadać je.
sidebar_position: 2
---

# Seedit

nasionko to bezserwerowa, pozbawiona administratora i w pełni zdecentralizowana alternatywa dla Reddita w starym stylu, zbudowana na protokole Bitsocial. Daje użytkownikom pełną własność nad swoimi społecznościami — każdy może je utworzyć, a wiele społeczności może konkurować o tę samą krótką ścieżkę, taką jak `/s/funny`.

## Pliki do pobrania

| Platforma  | Link                                                     |
| ---------- | -------------------------------------------------------- |
| Sieć       | [seedit.app](https://seedit.app)                         |
| Sieć (ENS) | `seedit.eth` przez przeglądarkę Brave lub IPFS Companion |
| Pulpit     | Dostępne dla komputerów Mac, Windows i Linux             |
| Komórka    | Dostępne dla Androida                                    |

## Jak działają społeczności

Seedit organizuje treści w społeczności podobne do subredditów. Każda społeczność jest własnością swojego twórcy i działa bez scentralizowanej administracji. Wiele społeczności może konkurować o tę samą ścieżkę [katalogu](/directories/), taką jak `/s/funny`, która otwiera aktualnego zwycięzcę. Subskrypcje i linki do postów zawsze wskazują konkretną społeczność.

### Tworzenie społeczności

Istnieją dwa sposoby utworzenia nowej społeczności:

1. **Klient stacjonarny** — Użyj wbudowanego interfejsu GUI w aplikacji komputerowej, aby skonfigurować i skonfigurować swoją społeczność.
2. **bitsocial-cli** — Uruchom narzędzie CLI, aby tworzyć społeczności i zarządzać nimi z wiersza poleceń.

### Domyślna lista społeczności

Nowe konta subskrybują domyślną listę konkretnych społeczności zdefiniowaną w `seedit-default-subscriptions.json` w repozytorium [bitsocialnet/lists](https://github.com/bitsocialnet/lists). Kandydaci do katalogów są wymienieni w plikach `seedit-directories/seedit-<code>-directory.json` w tym samym repozytorium. Aby dodać społeczność do którejkolwiek z tych list, prześlij żądanie ściągnięcia, podając szczegóły społeczności.

## Spinki do mankietów

- **GitHub**: [github.com/bitsocialnet/seedit](https://github.com/bitsocialnet/seedit)
- **Telegram**: [t.me/seeditreact](https://t.me/seeditreact)
- **Licencja**: tylko GPL-2.0
