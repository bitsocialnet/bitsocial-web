---
title: Descentralizarea Twitter/X
description: "Faza 3 a planului principal: o alternativă descentralizată și bine focalizată la Twitter/X pentru conversații publice axate pe text, cu infrastructură înlocuibilă."
---

# Descentralizarea Twitter/X

Faza 3 este un plan de a construi o alternativă descentralizată și bine focalizată la Twitter/X. În centru se află conversația publică axată pe text: postări scurte, răspunsuri, redistribuiri, urmărirea profilurilor, discuții în timp real și comunități, cu stratul de platformă deschis.

Twitter/X este definit în continuare de postări, text și schimbul de idei. Clientul din Faza 3 ar trebui să concureze prin această experiență de bază și să o facă să funcționeze excepțional de bine.

Această pagină descrie direcția produsului, nu o specificație de lansare definitivă. Interfața exactă, fluxul implicit, modelul de publicitate, funcțiile AI și piața RPC se pot schimba pe măsură ce protocolul și primele aplicații se maturizează.

## Ce ar trebui să demonstreze

Clientul ar trebui să demonstreze că o rețea socială bazată pe profiluri poate evita să devină o platformă custodiană:

- utilizatorii pot deține identități și profiluri
- comunitățile și nodurile de profil pot rămâne peer-to-peer
- comunitățile pot avea efecte de rețea între clienții Bitsocial
- Furnizorii RPC pot face aplicația convenabilă fără a lua custodia
- algoritmii de alimentare pot fi servicii opționale în loc de legea platformei
- alți clienți pot concura în continuare pentru aceeași rețea

Scopul este construirea celui mai bun client posibil pentru conversații publice și demonstrarea capacității de extindere a protocolului.

## Familiar ca scop, înlocuibil prin design

Experiența implicită ar trebui să concureze cu funcția de bază a Twitter/X: un flux principal rapid, postări text, urmăriri, răspunsuri, distribuire prin republicări, comunități, notificări, căutare și o vizualizare For You ordonată care funcționează imediat.

Bitsocial Forge poate rula primul serviciu RPC și feed implicit. Această prestație implicită poate include un feed clasat și reclame, astfel încât aplicația să se simtă completă în prima zi, în loc să ceară utilizatorilor mainstream să adune ei înșiși întreaga stivă.

Diferența este că opțiunea implicită nu trebuie să devină o închisoare. Utilizatorul ar trebui să poată schimba RPC-urile, fluxurile, instanțele, sistemele de clasificare, reclamele și furnizorii de descoperire sau să elimine complet clasificarea. Clientul poate avea opțiuni inițiale clare, păstrând în același timp fiecare serviciu important înlocuibil.

Astfel, clientul este mai personalizabil decât o platformă convențională. Un utilizator poate păstra fluxul implicit clasificat cu reclame. Altul poate folosi un flux cronologic fără clasificare. Altul poate alege un RPC axat pe confidențialitate, un serviciu de descoperire administrat de comunitate, un flux plătit fără reclame sau un algoritm de nișă creat pentru o anumită subcultură.

## Comunități cross-client

Comunitățile ar trebui să fie mult mai importante decât grupurile izolate din cadrul unei singure aplicații.

Pe X/Twitter, comunitățile sunt limitate în interiorul X. Ele pot fi utile, dar moștenesc limitele unei platforme, unui sistem de cont, a unei stive de recomandări și a unei suprafețe de produs.

O comunitate Bitsocial poate fi creată, găzduită, descoperită și utilizată prin clienți diferiți. Astfel, clientul din Faza 3 poate afișa comunități și postări din rețeaua Bitsocial mai largă, nu doar de la utilizatorii care au început în el. O comunitate poate avea simultan activitate dintr-un client imageboard, un client de discuții în stil Reddit, un client de forum de nișă, o aplicație mobilă și clientul din Faza 3.

Acesta este avantajul principal al efectului de rețea: un client se poate simți familiar pentru utilizatorii mainstream, în timp ce atrage valoare de la mulți clienți, noduri comunitare, furnizori RPC și servicii independente.

## Algoritmi opționali de alimentare

Clientul din Faza 3 nu ar trebui să impună tuturor un singur sistem global de clasificare.

Algoritmii de feed ar trebui să fie opționali și activați numai la alegerea utilizatorului. Un utilizator ar putea alege un algoritm dintr-o piață, să schimbe furnizorii, să folosească un algoritm de la o companie, să folosească unul condus de un operator anonim, să folosească unul creat de o comunitate, să ruleze unul personal sau să nu folosească deloc un algoritm.

Furnizorii publici RPC sunt un loc firesc pentru ca aceste servicii să concureze. Ei pot indexa, clasa și recomanda conținut, dar nu ar trebui să dețină utilizatorul sau profilul.

Aceste servicii pot concura și pe forma aplicației în sine. Un RPC poate oferi un feed clasat cu anunțuri. Un altul ar putea oferi un flux cronologic neclasat. Un altul ar putea fi specializat în confidențialitate, traducere, moderare, descoperire a comunității sau un grafic social de nișă.

Dacă economia funcționează, serviciile de feed susținute de RPC ar putea adăuga caracteristici AI similare cu ceea ce platformele mainstream încearcă să introducă în feed-urile lor: traduceri automate, rezumate, răspunsuri asistate de bot, răspunsuri de căutare, asistență pentru moderare sau context în stilul notei comunității.

Aceste caracteristici ar trebui să fie opțiuni de serviciu, nu cerințe de protocol. Un RPC implicit poate concura oferind un feed mai bogat, dar utilizatorii și clienții concurenți ar trebui să poată alege în continuare alternative mai simple, private, cronologice, fără anunțuri sau specifice comunității.

## RPC fără custodie

Fiecare utilizator ar trebui să poată participa ca un nod peer-to-peer complet prin RPC fără a acorda furnizorului RPC dreptul de proprietate asupra identității sau profilului său.

Calea găzduită contează deoarece majoritatea utilizatorilor nu vor începe prin a rula un server. Calea de ieșire contează la fel de mult: un utilizator ar trebui să poată trece la propriul nod de profil pe hardware cu specificații reduse, inclusiv un Raspberry Pi, oricând dorește.

Aceasta este diferența dintre comoditate și custodie.

## Conversația publică, consolidată de Bitsocial Chain

Bitsocial Chain poate aduce nume persistente, plăți, bacșișuri, premii și alte mecanisme financiare direct în conversația publică.

Clientul din Faza 3 rămâne centrat pe postări, text, schimb de idei și discuții în timp real, împărtășind în același timp comunități și efecte de rețea cu alți clienți Bitsocial.
