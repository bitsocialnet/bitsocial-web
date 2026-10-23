---
title: Construiește-ți propriul client Bitsocial
description: Ghid pentru dezvoltatorii care lansează clienți Bitsocial independenți, de la imageboard-uri și forumuri până la aplicații sociale de nișă.
---

# Construiește-ți propriul client Bitsocial

Bitsocial nu câștigă având o singură aplicație oficială pentru fiecare caz de utilizare. Câștigă
atunci când mai mulți clienți pot folosi același protocol, concurând în schimb pe interfață,
cultură, descoperire, setări implicite și model de afaceri.

5chan și Seedit sunt primele dovezi că lucrurile funcționează, nu o limită superioară. Un
dezvoltator ar trebui să poată lansa un nou imageboard, un forum, un client de profiluri, o
aplicație socială gândită întâi pentru mobil, un instrument pentru o comunitate de nișă sau un
client centralizat care folosește Bitsocial dedesubt, fără să ceară permisiunea unui proprietar de
platformă.

## Ce pot schimba dezvoltatorii

Un client Bitsocial poate concura pe decizii de produs fără să bifurce întreaga rețea:

- interfața și limbajul vizual
- fluxul de întâmpinare a utilizatorilor noi
- setările implicite ale comunității
- suprafețele de moderare
- modelul de descoperire
- experiența media
- constrângerile de mobil, desktop sau lățime de bandă redusă
- monetizarea și modelul de afaceri

Stratul comun este protocolul. Stratul de produs rămâne deschis concurenței.

## Cea mai rapidă cale de învățare

Începe cu aplicațiile care există deja:

- Încearcă [5chan](https://5chan.app) pentru comunități de tip imageboard anonim.
- Încearcă [Seedit](https://seedit.app) pentru discuții în stil Reddit.
- Citește documentația [Bitsocial React hooks](https://hooks.bitsocial.net/docs/quickstart/) pentru integrarea în partea de client.
- Citește documentația [Bitsocial CLI](/developer-tools/cli/) pentru operațiuni de nod și de comunitate.

Dacă vrei să avansezi rapid, contribuie mai întâi la o aplicație existentă. Dacă interfața, cultura
sau modelul de comunitate pe care le urmărești nu se potrivesc acolo, construiește un client
separat.

## Alege o primă versiune îngustă

Cea mai bună primă versiune nu este o aplicație socială universală. Este un client cu un public
clar și cu un motiv puternic de a exista.

Puncte bune de plecare:

- un client de imageboard mai curat, pentru o cultură anume
- un client de forum gândit întâi pentru mobil
- o aplicație dedicată unei singure comunități, cu setări implicite stricte
- un client pentru comunități de creatori
- un client de descoperire, doar pentru citit
- o consolă de moderare sau de operare
- un client optimizat pentru o limbă, o regiune sau o clasă de dispozitive

Clienții mici sunt utili tocmai pentru că Bitsocial îi lasă să crească în aceeași rețea, în loc să
își închidă utilizatorii într-o bază de date privată.

## Căi de implementare

Există trei căi practice:

1. Bifurcă un client existent atunci când ideea ta este apropiată de 5chan sau Seedit.
2. Construiește un client React nou cu [Bitsocial React hooks](https://hooks.bitsocial.net/).
3. Construiește-ți propria integrare peste API-urile de nod și infrastructura RPC publică.

RPC-ul public ar trebui să facă a treia cale mult mai practică. Un utilizator poate începe printr-un
furnizor RPC găzduit și non-custodial, apoi poate trece la găzduire proprie sau la un furnizor
concurent.

## Principiu de proiectare

Construiește clientul care ar trebui să existe pentru comunitatea ta, apoi lasă clienții compatibili
să concureze în public.
