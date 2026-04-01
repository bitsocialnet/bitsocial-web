---
title: 5chan
description: O placă de imagini descentralizată, fără server, construită pe protocolul Bitsocial, unde oricine poate crea și deține panouri.
sidebar_position: 1
---

:::warning[Legacy naming]
Baza de cod a acestui proiect încă folosește denumirea moștenită „plebbit” dinainte de rebrand-ul Bitsocial. Numele pachetelor, referințele API și o anumită terminologie internă vor fi actualizate într-o versiune viitoare. Funcționalitatea descrisă aici este actuală - doar denumirea este depășită.
:::

# 5chan

5chan este o placă de imagini fără server, fără administrator și complet descentralizată, care rulează pe protocolul Bitsocial. Urmează structura familiară a directoarelor imaginilor în timp ce introduce proprietatea descentralizată - oricine poate crea un tablou, iar mai multe forumuri pot concura pentru același slot de director printr-un mecanism de vot.

## Descărcări

| Platformă | Link                                    |
| --------- | --------------------------------------- |
| Web       | [5chan.app](https://5chan.app)          |
| Desktop   | Disponibil pentru Mac, Windows și Linux |
| Mobil     | Disponibil pentru Android               |

## Cum funcționează plăcile

5chan organizează conținutul în panouri folosind un aspect clasic de director (de exemplu, `/b/`, `/g/`). Spre deosebire de panourile de imagine tradiționale în care un administrator central controlează fiecare panou, 5chan permite oricărui utilizator să-și creeze și să dețină pe deplin propria placă. Când mai multe consilii vizează același slot de director, ele concurează pentru acea poziție prin vot.

### Crearea unei table

Pentru a crea o nouă placă, trebuie să rulați `bitsocial-cli` ca nod peer-to-peer. Acest lucru vă asigură că placa dumneavoastră este găzduită într-un mod descentralizat, fără a vă baza pe niciun server central.

### Atribuții de director

Atribuțiile de slot de director (care placă apare la ce cale) sunt gestionate în prezent prin solicitări de extragere GitHub către fișierul `5chan-directories.json`. Acesta este un proces temporar — versiunile viitoare vor sprijini crearea de forumuri în aplicație și votul bazat pe pubsub pentru a gestiona automat atribuirile directoarelor.

## Interne

Sub capotă, 5chan folosește stratul API plebbit-js pentru interacțiunile sale de protocol. După cum s-a menționat în avertismentul de mai sus, aceste referințe interne poartă încă o denumire moștenită care precede rebrand-ul Bitsocial.

## Legături

- **GitHub**: [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- **Telegramă**: [t.me/fivechandev](https://t.me/fivechandev)
- **Licență**: numai GPL-2.0
