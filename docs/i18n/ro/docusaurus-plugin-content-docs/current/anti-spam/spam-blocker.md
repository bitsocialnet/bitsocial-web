---
title: Spam Blocker
description: Serviciu centralizat de detectare a spamului, cu punctare a riscului, provocări OAuth și praguri de nivel configurabile.
sidebar_position: 1
---

# Spam Blocker

Spam Blocker este un serviciu centralizat de detectare a spamului, care evaluează publicările primite și le atribuie scoruri de risc. Este format din două pachete:

- **`@bitsocial/spam-blocker-server`** -- serverul HTTP care găzduiește API-urile de evaluare și de provocare.
- **`@bitsocial/spam-blocker-challenge`** -- un pachet client ușor, pe care comunitățile îl integrează pentru a trimite publicările spre evaluare.

**Cod sursă:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## Cum funcționează punctarea riscului

Fiecare publicare trimisă către endpointul `/evaluate` primește un scor numeric de risc. Scorul este o combinație ponderată a mai multor semnale:

| Semnal               | Descriere                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Vechimea contului    | Conturile mai noi primesc scoruri de risc mai mari.                                                                                   |
| Karma                | Karma acumulată în comunitate reduce riscul.                                                                                          |
| Reputația autorului  | Date de reputație colectate de indexatorul de rețea care rulează în fundal.                                                           |
| Analiza conținutului | Euristici la nivel de text (densitatea linkurilor, tipare de spam cunoscute etc.).                                                    |
| Ritmul de publicare  | Postările rapide și succesive ale aceluiași autor cresc riscul.                                                                       |
| Informații despre IP | Geolocalizare la nivel de țară și interogări în fluxuri de amenințări. Adresele IP brute nu sunt niciodată partajate cu comunitățile. |

## Praguri pe niveluri

Scorul de risc corespunde unuia dintre cele patru niveluri configurabile care determină ce se întâmplă mai departe:

1. **Acceptare automată** -- scorul este suficient de mic încât publicarea este aprobată fără nicio provocare.
2. **OAuth suficient** -- autorul trebuie să finalizeze o verificare OAuth pentru a putea continua.
3. **OAuth plus verificări suplimentare** -- OAuth singur nu este suficient; este necesară o verificare în plus (de exemplu, CAPTCHA).
4. **Respingere automată** -- scorul este prea mare, iar publicarea este respinsă direct.

Toate valorile de prag sunt configurabile pentru fiecare comunitate în parte.

## Fluxul provocărilor

Când o publicare ajunge într-un nivel care necesită verificare, începe fluxul de provocare:

1. Autorului i se cere mai întâi să se autentifice prin **OAuth** (GitHub, Google, Twitter și alți furnizori acceptați).
2. Dacă OAuth singur nu este suficient (nivelul 3), se afișează o **soluție de rezervă cu CAPTCHA**, bazată pe Cloudflare Turnstile.
3. Identitatea OAuth este folosită exclusiv pentru verificare -- ea nu este **niciodată partajată** cu comunitatea sau cu alți utilizatori.

## Endpointuri API

### `POST /evaluate`

Trimite o publicare pentru evaluarea riscului. Returnează scorul de risc calculat și nivelul de provocare necesar.

### `POST /challenge/verify`

Trimite spre verificare rezultatul unei provocări finalizate (token OAuth, soluție CAPTCHA sau ambele).

### `GET /iframe/:sessionId`

Returnează o pagină HTML încorporabilă, care randează interfața de provocare potrivită pentru sesiunea dată.

## Limitarea ratei

Limitele de rată sunt aplicate dinamic, în funcție de vechimea și de reputația autorului. Autorii mai noi sau cu reputație mai scăzută au limite mai stricte, în timp ce autorii consacrați beneficiază de praguri mai generoase. Astfel se previn valurile de spam fără a-i penaliza pe participanții de încredere.

## Indexatorul de rețea din fundal

Serverul rulează un indexator în fundal, care parcurge continuu rețeaua pentru a construi și a menține datele de reputație ale autorilor. Aceste date alimentează direct fluxul de punctare a riscului, permițând sistemului să recunoască participanții de bună-credință care revin în mai multe comunități.

## Confidențialitate

Spam Blocker este proiectat având în vedere confidențialitatea:

- Identitățile OAuth sunt folosite doar pentru verificarea provocărilor și nu sunt **niciodată dezvăluite** comunităților.
- Operatorul serviciului stochează adresele IP brute pentru detectarea abuzurilor și le trimite unui furnizor extern de informații despre IP pentru clasificare.
- Comunitățile primesc doar codul țării, riscul IP și o estimare a tipului de conexiune, niciodată adresa IP brută.

## Bază de date

Serverul folosește **SQLite** (prin `better-sqlite3`) pentru persistența locală a datelor de reputație, a stării sesiunilor și a configurației.
