---
title: Peer-to-peer în browser
description: Cum rulează o aplicație web Bitsocial un nod libp2p real în fila de browser, ce transporturi folosește și corecția din amonte din 2026 care a făcut ca publicarea dintr-o filă să funcționeze.
---

# Peer-to-peer în browser

O aplicație web Bitsocial nu trebuie să fie clientul serverului altcuiva. Poate rula un nod
[Helia](https://helia.io/) chiar în fila de browser, se poate alătura aceleiași rețele peer-to-peer
ca nodurile desktop și CLI, poate prelua conținutul comunităților de la peeri și poate publica prin
pubsub.

Această pagină explică ce înseamnă asta în practică, ce transporturi folosește, ce nu poate face încă
și de ce publicarea dintr-o filă a început să funcționeze abia în 2026.

Pentru arhitectura de rețea în ansamblu, consultați [Protocolul peer-to-peer](/peer-to-peer-protocol/).

## Ce rulează în filă

Când P2P în browser este activ, pagina găzduiește un nod libp2p real:

- inițiază conexiuni către alți peeri prin WebSockets securizate
- preia și verifică conținutul comunităților de la acei peeri, nu de la un gateway IPFS
- participă la gossipsub, așa că publicarea unei postări nu are nevoie de un furnizor pubsub găzduit
- folosește aceeași stivă de client de protocol (`pkc-js`) ca orice altă aplicație Bitsocial

Consecința practică este că niciun operator de gateway nu se interpune între un cititor web și o
comunitate. Nu există un singur endpoint HTTPS care să poată fi presat să renunțe la o comunitate
pentru toți utilizatorii de browser deodată.

## Cum se conectează nodurile din browser

`pkc-js` contactează peerii prin **WebSockets securizate**. Conexiunile WebRTC și WebTransport sunt
refuzate implicit printr-un connection gater, pentru că în browser adaugă trasee lungi de stabilire a
conexiunii, care eșuează adesea — negociere STUN/ICE, rotația certhash —, iar acestea încetinesc
încărcarea paginii, în timp ce WebSocket oferă un transport direct și fiabil. Apelanții care vor
anume WebRTC sau WebTransport pot suprascrie gater-ul prin
`libp2pJsClientsOptions[].libp2pOptions.connectionGater`.

Consecința practică este că un peer din browser se conectează la noduri care expun un endpoint WSS,
ceea ce înseamnă că acele noduri au nevoie de un domeniu și de un certificat semnat de o autoritate
de certificare. Peerii aflați în spatele conexiunilor casnice, fără așa ceva, sunt atinși indirect,
nu contactați direct din filă.

## De ce publicarea din browser a început să funcționeze abia în 2026

Peer-to-peer în browser nu este o idee nouă. Ce s-a schimbat în 2026 este că _postările_ unui nod din
browser ajung acum la restul rețelei.

Specificația pubsub din libp2p cere ca `seqno` al unui mesaj să fie un întreg pe 64 de biți,
big-endian, care crește liniar. `js-libp2p-gossipsub` genera în schimb 8 octeți aleatori, în timp ce
go-libp2p-pubsub și rust-libp2p foloseau amândouă un contor. Kubo 0.40+ activează implicit
`BasicSeqnoValidator`, care respinge orice mesaj al cărui seqno nu este mai mare decât cel mai mare
văzut deja de la acel peer.

Efectul era că majoritatea mesajelor publicate de un nod JavaScript — inclusiv un nod din browser —
erau eliminate în tăcere de peerii Kubo. Un test de reproducere a măsurat că ajungeau între 2 și 8
din 30 de mesaje.

Problema a fost diagnosticată în
[js-libp2p-gossipsub#545](https://github.com/ChainSafe/js-libp2p-gossipsub/issues/545) și rezolvată
în **`@libp2p/gossipsub` 15.0.21**, în mai 2026. Până când a apărut acea corecție, un nod din browser
se putea conecta și putea citi, dar postările lui dispăreau în mare parte pe drumul spre peerii Go.
`pkc-js` livrează `@libp2p/gossipsub` 16.0.4, ulterior acelei corecții.

## Ce nu poate face încă un nod din browser

Un nod din browser este un peer real, nu un server. Are alte limite decât un nod desktop sau unul
mereu pornit:

- de obicei nu poate accepta conexiuni de intrare arbitrare din internetul public
- funcționează doar cât timp fila este deschisă, deci nu este o gazdă de durată pentru datele unei comunități
- nu se poate alătura unui DHT libp2p, motiv pentru care descoperirea trece prin routere HTTP
- se potrivește prost pentru seeding la scară mare

Găzduirea completă a unei comunități rămâne treaba unei aplicații desktop, a `bitsocial-cli` sau a
altui nod mereu pornit. P2P în browser schimbă cine poate _citi și posta_ fără gateway; nu elimină
nevoia de peeri care rămân online.

## Routerele HTTP nu sunt gateway-uri

Clienții din browser interoghează în continuare
[routere HTTP](/peer-to-peer-protocol/#public-key-based-addressing) pentru a afla ce peeri furnizează
în acest moment adresa unei comunități. Acesta este asteriscul onest de lângă „peer-to-peer pur în
browser” și merită să fim preciși în privința lui:

- un router stochează doar adresele peerilor pentru o adresă de conținut
- nu stochează, nu servește și nici măcar nu cunoaște conținutul comunității
- clienții interoghează mai multe routere în paralel și combină rezultatele
- oricine poate rula unul, iar schimbarea routerelor este o modificare de configurare, fără migrare de date

După descoperire, transferul de conținut și traficul pubsub circulă peer-to-peer. Un router care
dispare vă costă o cale de căutare, nu datele. Un gateway IPFS, în schimb, se află pe traseul
conținutului.

## Unde rulează asta astăzi

- [5chan](/apps/5chan/) rulează implicit P2P pur în browser, în aplicația web de la
  [5chan.app](https://5chan.app).

## Soluția de rezervă prin gateway

Accesul prin gateway există în continuare ca traseu de compatibilitate pentru browserele sau rețelele
care nu se pot alătura direct. Consultați [Soluția de rezervă prin gateway](/peer-to-peer-protocol/#gateway-fallback).
Arhitectura țintă este P2P în browser mai întâi, cu gateway-urile ca soluție de rezervă opțională, nu
ca blocaj implicit.
