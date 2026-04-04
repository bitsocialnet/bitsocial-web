---
title: Spam Blocker
description: Centralizovaná služba detekce spamu s hodnocením rizik, výzvami OAuth a konfigurovatelnými prahovými hodnotami úrovní.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy Pojmenování
Tento balíček byl původně publikován v rozsahu `@plebbit`. Byl přejmenován na `@bitsocial/spam-blocker-server` a `@bitsocial/spam-blocker-challenge`. Odkazy na stará jména se mohou stále objevovat ve starší dokumentaci nebo kódových základnách.
:::

Spam Blocker je centralizovaná služba pro detekci spamu, která vyhodnocuje příchozí publikace a přiřazuje skóre rizik. Skládá se ze dvou balíčků:

- **`@bitsocial/spam-blocker-server`** -- HTTP server, který hostí rozhraní API pro hodnocení a výzvy.
- **`@bitsocial/spam-blocker-challenge`** – odlehčený klientský balíček, který komunity integrují a posílají publikace k vyhodnocení.

**Zdrojový kód:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Jak funguje hodnocení rizika

Každá publikace odeslaná do koncového bodu `/evaluate` obdrží číselné skóre rizika. Skóre je vážená kombinace několika signálů:

| Signál           | Popis                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Account age      | Novější účty dostávají vyšší skóre rizika.                                                                                                    |
| Karma            | Nahromaděná komunitní karma snižuje riziko.                                                                                                   |
| Pověst autora    | Údaje o pověsti shromážděné indexátorem sítě na pozadí.                                                                                       |
| Obsahová analýza | Heuristika na úrovni textu (hustota odkazů, známé vzorce spamu atd.).                                                                         |
| Rychlost         | Rychle po sobě jdoucí příspěvky od stejného autora zvyšují riziko.                                                                            |
| IP inteligence   | Geolokace na úrovni země a vyhledávání zdrojů hrozeb. Ukládají se pouze kódy zemí – nezpracované adresy IP nejsou nikdy sdíleny s komunitami. |

## Hranice úrovně

Skóre rizika se mapuje do jedné ze čtyř konfigurovatelných úrovní, které určují, co se stane dál:

1. **Automatické přijetí** – skóre je dostatečně nízké, aby byla publikace schválena bez jakýchkoliv problémů.
2. **OAuth-dostatečné** – autor musí provést ověření OAuth, aby mohl pokračovat.
3. **OAuth-plus-more** -- Samotné OAuth nestačí; je vyžadováno další ověření (např. CAPTCHA).
4. **Automatické odmítnutí** – skóre je příliš vysoké; zveřejnění je zcela odmítnuto.

Všechny prahové hodnoty jsou konfigurovatelné pro každou komunitu.

## Challenge Flow

Když publikace spadá do úrovně, která vyžaduje ověření, začne tok výzvy:

1. Autor je nejprve vyzván k ověření prostřednictvím **OAuth** (GitHub, Google, Twitter a další podporovaní poskytovatelé).
2. Pokud samotné OAuth nestačí (úroveň 3), zobrazí se **záložní CAPTCHA** využívající Cloudflare Turnstile.
3. Identita OAuth slouží výhradně k ověření – **nikdy není sdílena** s komunitou ani jinými uživateli.

## Koncové body API

### `POST /evaluate`

Odeslat publikaci k vyhodnocení rizik. Vrátí vypočítané skóre rizika a požadovanou úroveň výzvy.

### `POST /challenge/verify`

Odešlete výsledek dokončené výzvy (token OAuth, řešení CAPTCHA nebo obojí) k ověření.

### `GET /iframe/:sessionId`

Vrátí vložitelnou stránku HTML, která vykreslí příslušné uživatelské rozhraní výzvy pro danou relaci.

## Omezení sazby

Limity sazeb jsou aplikovány dynamicky na základě věku a pověsti autora. Novější autoři nebo autoři s nižší reputací čelí přísnějším limitům, zatímco zavedení autoři si užívají štědřejší limity. Tím se zabrání záplavám nevyžádané pošty bez penalizace důvěryhodných účastníků.

## Pozadí Network Indexer

Server spouští indexátor na pozadí, který nepřetržitě prochází síť, aby vytvořil a udržoval data o pověsti autora. Tato data se přivádějí přímo do procesu hodnocení rizik, což umožňuje systému rozpoznat opakující se účastníky dobré víry napříč komunitami.

## soukromí

Spam Blocker je navržen s ohledem na soukromí:

- Identity OAuth se používají pouze pro ověření výzvy a **nikdy se nesdělují** komunitám.
- IP adresy jsou přeloženy na **pouze kódy zemí**; nezpracované IP adresy nejsou uloženy ani sdíleny.

## databáze

Server používá **SQLite** (prostřednictvím `better-sqlite3`) pro místní perzistenci dat reputace, stavu relace a konfigurace.
