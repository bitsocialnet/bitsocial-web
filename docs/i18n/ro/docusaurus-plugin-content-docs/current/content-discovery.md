---
title: Descoperirea conținutului
description: Cum separă Bitsocial descoperirea de la egal la nivel de aplicație.
---

# Descoperirea conținutului

Bitsocial nu include un feed global, un index de căutare sau un algoritm de clasare în protocol. Separă descoperirea conținutului în două straturi:

1. **Căutare în rețea** găsește colegii care deservesc în prezent o comunitate cunoscută.
2. **Curarea aplicației** decide ce comunități, panouri, liste sau postări afișează mai întâi un produs.

Acest lucru menține protocolul mic în timp ce lasă loc pentru multe experiențe de descoperire pentru a concura.

## Căutare în rețea

Fiecare comunitate are o adresă stabilă derivată din cheia sa publică. Când un client știe deja acea adresă, interogează routerele HTTP ușoare pentru a găsi colegi care s-au anunțat ca furnizori pentru aceasta.

Routerele returnează numai adresele de la egal la furnizor. Nu stochează postări, metadate, liste de utilizatori sau un director de comunități care poate fi citit de om. After the client receives peer addresses, it connects to those peers and fetches the latest community metadata plus content pointers, then fetches the actual post data by hash.

Acesta răspunde la întrebarea de protocol: „De unde pot prelua cea mai recentă stare pentru această comunitate?”

## Curatarea aplicației

Întrebarea separată despre produs este: „Ce comunități ar trebui să vadă mai întâi un utilizator?”

Bitsocial lasă asta aplicațiilor, listelor și utilizatorilor, în loc să furnizeze un răspuns în rețea. Exemplele includ:

- un client care arată comunitățile pe care utilizatorul le urmărește deja
- o listă prestabilită pentru o aplicație în stil Reddit
- sloturi pentru directoare pentru o aplicație în stil imageboard
- indici de căutare sau clasare menținute de o anumită aplicație
- link-uri directe partajate de utilizatori

Aplicațiile pot indexa, clasifica, filtra sau evidenția diferite lucruri fără a transforma aceste alegeri în lege de protocol. Dacă suprafața de descoperire a unei aplicații nu este utilă, o altă aplicație poate construi una diferită pe aceleași comunități subiacente.

## Aplicații curente

5chan utilizează în prezent căi de director familiare, cum ar fi `/b/` sau `/g/`. Directory assignments are managed through a public list today, with future versions expected to support in-app board creation and voting for directory slots.

Seedit folosește listele de comunități implicite pentru prima pagină. Comunitățile pot fi în continuare create și partajate în afara acelei liste prestabilite.

În ambele cazuri, lista la nivel de aplicație îi ajută pe utilizatori să găsească ceva de deschis, iar căutarea la nivel de protocol rezolvă apoi comunitatea aleasă către colegi.

## De ce contează această scindare

O singură rețea descentralizată mai are nevoie de o descoperire bună, dar stratul de descoperire ar trebui să fie înlocuibil. Protocolul de bază al Bitsocial se concentrează pe adresabilitate, căutare peer, publicare și anti-spam. Curation lives above that layer, where apps can experiment with directories, default lists, feeds, search, voting, and moderation policies without requiring a network-wide migration.
