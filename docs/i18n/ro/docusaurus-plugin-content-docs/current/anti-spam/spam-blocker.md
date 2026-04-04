---
title: Spam Blocker
description: Serviciu centralizat de detectare a spamului cu punctaj de risc, provocări OAuth și praguri de nivel configurabile.
sidebar_position: 1
---

# Spam Blocker

:::warning Denumire moștenită
Acest pachet a fost publicat inițial în domeniul de aplicare `@plebbit`. A fost redenumit în `@bitsocial/spam-blocker-server` și `@bitsocial/spam-blocker-challenge`. Referințele la nume vechi pot apărea în continuare în documentația sau bazele de coduri mai vechi.
:::

Spam Blocker este un serviciu centralizat de detectare a spam-ului care evaluează publicațiile primite și atribuie scoruri de risc. Este format din două pachete:

- **`@bitsocial/spam-blocker-server`** -- serverul HTTP care găzduiește API-urile de evaluare și provocare.
- **`@bitsocial/spam-blocker-challenge`** -- un pachet de clienți ușor pe care comunitățile îl integrează pentru a trimite publicații pentru evaluare.

**Cod sursă:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cum funcționează scorul de risc

Fiecare publicație trimisă la punctul final `/evaluate` primește un scor de risc numeric. Scorul este o combinație ponderată de mai multe semnale:

| Semnal              | Descriere                                                                                                                                                   |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vârsta contului     | Conturile mai noi primesc scoruri de risc mai mari.                                                                                                         |
| Karma               | Karma comunității acumulată reduce riscul.                                                                                                                  |
| Reputația autorului | Date de reputație colectate de indexorul de rețea de fundal.                                                                                                |
| Analiză de conținut | Euristice la nivel de text (densitatea linkurilor, modele cunoscute de spam etc.).                                                                          |
| Viteza              | Postările rapide succesive ale aceluiași autor cresc riscul.                                                                                                |
| Inteligență IP      | Geolocalizare la nivel de țară și căutări de amenințări. Sunt stocate doar codurile de țară -- adresele IP brute nu sunt niciodată partajate comunităților. |

## Praguri de nivel

Scorul de risc se mapează la unul dintre cele patru niveluri configurabile care determină ce se întâmplă în continuare:

1. **Acceptare automată** -- scorul este suficient de scăzut pentru ca publicația să fie aprobată fără nicio provocare.
2. **OAuth-sufficient** -- autorul trebuie să finalizeze o verificare OAuth pentru a continua.
3. **OAuth-plus-more** -- OAuth singur nu este suficient; este necesară o verificare suplimentară (de exemplu, CAPTCHA).
4. **Respingere automată** -- scorul este prea mare; publicația este respinsă definitiv.

Toate valorile de prag sunt configurabile pentru fiecare comunitate.

## Fluxul provocării

Când o publicație se încadrează într-un nivel care necesită verificare, începe fluxul provocării:

1. Autorului i se solicită mai întâi să se autentifice prin **OAuth** (GitHub, Google, Twitter și alți furnizori acceptați).
2. Dacă numai OAuth este insuficient (nivelul 3), este prezentat o **CAPTCHA alternativă** alimentată de Cloudflare Turnstile.
3. Identitatea OAuth este folosită numai pentru verificare -- **nu este niciodată partajată** comunității sau altor utilizatori.

## Puncte finale API

### `POST /evaluate`

Trimiteți o publicație pentru evaluarea riscurilor. Returnează scorul de risc calculat și nivelul de provocare necesar.

### `POST /challenge/verify`

Trimiteți rezultatul unei provocări finalizate (token OAuth, soluție CAPTCHA sau ambele) pentru verificare.

### `GET /iframe/:sessionId`

Returnează o pagină HTML încorporabilă care redă interfața de utilizare de provocare adecvată pentru sesiunea dată.

## Limitarea ratei

Limitele ratelor sunt aplicate dinamic în funcție de vârsta și reputația autorului. Autorii mai noi sau cu o reputație mai scăzută se confruntă cu limite mai stricte, în timp ce autorii consacrați se bucură de praguri mai generoase. Acest lucru previne inundațiile de spam fără a penaliza participanții de încredere.

## Indexator de rețea de fundal

Serverul rulează un indexator de fundal care accesează continuu cu crawlere rețeaua pentru a construi și menține datele despre reputația autorului. Aceste date se alimentează direct în conducta de evaluare a riscurilor, permițând sistemului să recunoască participanții repetați de bună-credință din comunități.

## Confidențialitate

Spam Blocker este proiectat ținând cont de confidențialitate:

- Identitățile OAuth sunt folosite numai pentru verificarea provocării și **nu sunt niciodată divulgate** comunităților.
- Adresele IP sunt rezolvate în **numai coduri de țară**; IP-urile brute nu sunt stocate sau partajate.

## Baza de date

Serverul folosește **SQLite** (prin `better-sqlite3`) pentru persistența locală a datelor despre reputație, starea sesiunii și configurația.
