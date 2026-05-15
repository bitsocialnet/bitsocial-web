---
title: Aplicația emblematică Bitsocial
description: "Clientul Bitsocial propus pe bază de profil: familiar ca X/Twitter în mod implicit, dar cu RPC-uri, fluxuri, algoritmi, anunțuri și comunități înlocuibile."
---

# Aplicația emblematică Bitsocial

Aplicația emblematică Bitsocial este primul client bazat pe profil propus pentru rețea. Cea mai simplă comparație este: familiar ca X/Twitter în mod implicit, dar cu stratul platformei rupt deschis.

Ar adăuga profiluri, urmăriri, răspunsuri, fluxuri, comunități, notificări și conversații publice în timp real, păstrând în același timp serviciile de bază înlocuibile. 5chan demonstrează că comunitățile anonime pot funcționa. Seedit se îndreaptă către discuții persistente. Aplicația emblematică ar aduce acele efecte de rețea într-un flux social de masă fără a face o companie proprietara graficului.

Această pagină descrie direcția produsului, nu o specificație de lansare blocată. Interfața exactă, feedul implicit, modelul de anunț, funcțiile AI și piața RPC se pot schimba pe măsură ce protocolul și aplicațiile timpurii se maturizează.

## Ce ar trebui să demonstreze

Aplicația ar trebui să demonstreze că o rețea socială bazată pe profil poate evita să devină o platformă de custodie:

- utilizatorii pot deține identități și profiluri
- comunitățile și nodurile de profil pot rămâne peer-to-peer
- comunitățile pot avea efecte de rețea între clienții Bitsocial
- Furnizorii RPC pot face aplicația convenabilă fără a lua custodia
- algoritmii de alimentare pot fi servicii opționale în loc de legea platformei
- alți clienți pot concura în continuare pentru aceeași rețea

Ideea este să nu faci singurul client Bitsocial. Ideea este să facem primul client larg care să arate cât de departe se poate întinde protocolul.

## Familiar în mod implicit, înlocuibil prin design

Experiența implicită ar trebui să fie competitivă cu aplicațiile obișnuite de conversație publică: un flux de acasă rapid, urmăriri, răspunsuri, distribuție în stil repost, comunități, notificări, căutare și o vizualizare clasată pentru tine care funcționează imediat.

Bitsocial Forge poate rula primul serviciu RPC și feed implicit. Această prestație implicită poate include un feed clasat și reclame, astfel încât aplicația să se simtă completă în prima zi, în loc să ceară utilizatorilor mainstream să adune ei înșiși întreaga stivă.

Diferența este că implicit nu ar trebui să devină închisoarea. Un utilizator ar trebui să poată schimba RPC-uri, fluxuri, instanțe, sisteme de clasare, anunțuri și furnizori de descoperire sau să elimine complet clasarea. Aplicația poate fi obișnuită la prima lansare, păstrând în același timp orice serviciu major înlocuibil.

Acest lucru face aplicația mai personalizabilă decât o platformă convențională. Un utilizator poate păstra feedul clasat implicit cu anunțuri. Altul ar putea folosi un flux cronologic fără clasare. Altul ar putea alege un RPC axat pe confidențialitate, un serviciu de descoperire administrat de comunitate, un feed plătit fără anunțuri sau un algoritm de nișă construit pentru o anumită subcultură.

## Comunități cross-client

Comunitățile ar trebui să fie mult mai importante decât grupurile izolate din cadrul unei singure aplicații.

Pe X/Twitter, comunitățile sunt limitate în interiorul X. Ele pot fi utile, dar moștenesc limitele unei platforme, unui sistem de cont, a unei stive de recomandări și a unei suprafețe de produs.

O comunitate Bitsocial poate fi creată, găzduită, descoperită și utilizată prin diferiți clienți. Aceasta înseamnă că aplicația emblematică poate afișa comunități și postări din rețeaua mai largă Bitsocial, nu numai de la utilizatorii care au început în cadrul aplicației emblematice. O comunitate ar putea avea activitate de la un client imageboard, un client de discuții în stil Reddit, un client de forum de nișă, o aplicație mobilă și aplicația emblematică în același timp.

Acesta este avantajul principal al efectului de rețea: un client se poate simți familiar pentru utilizatorii mainstream, în timp ce atrage valoare de la mulți clienți, noduri comunitare, furnizori RPC și servicii independente.

## Algoritmi opționali de alimentare

Aplicația emblematică nu ar trebui să forțeze un singur sistem de clasare global asupra tuturor.

Algoritmii de feed ar trebui să fie activați. Un utilizator ar putea alege un algoritm dintr-o piață, să schimbe furnizorii, să folosească un algoritm de la o companie, să folosească unul condus de un operator anonim, să folosească unul creat de o comunitate, să ruleze unul personal sau să nu folosească deloc un algoritm.

Furnizorii publici RPC sunt un loc firesc pentru ca aceste servicii să concureze. Ei pot indexa, clasa și recomanda conținut, dar nu ar trebui să dețină utilizatorul sau profilul.

Aceste servicii pot concura și pe forma aplicației în sine. Un RPC poate oferi un feed clasat cu anunțuri. Un altul ar putea oferi un flux cronologic neclasat. Un altul ar putea fi specializat în confidențialitate, traducere, moderare, descoperire a comunității sau un grafic social de nișă.

Dacă economia funcționează, serviciile de feed susținute de RPC ar putea adăuga caracteristici AI similare cu ceea ce platformele mainstream încearcă să introducă în feed-urile lor: traduceri automate, rezumate, răspunsuri asistate de bot, răspunsuri de căutare, asistență pentru moderare sau context în stilul notei comunității.

Aceste caracteristici ar trebui să fie opțiuni de serviciu, nu cerințe de protocol. Un RPC implicit poate concura oferind un feed mai bogat, dar utilizatorii și clienții concurenți ar trebui să poată alege în continuare alternative mai simple, private, cronologice, fără anunțuri sau specifice comunității.

## RPC fără custodie

Fiecare utilizator ar trebui să poată participa ca un nod peer-to-peer complet prin RPC fără a acorda furnizorului RPC dreptul de proprietate asupra identității sau profilului său.

Calea găzduită contează deoarece majoritatea utilizatorilor nu vor începe prin a rula un server. Calea de ieșire contează la fel de mult: un utilizator ar trebui să poată trece la propriul nod de profil pe hardware cu specificații reduse, inclusiv un Raspberry Pi, oricând dorește.

Aceasta este diferența dintre comoditate și custodie.

## De ce poate deveni o aplicație totul

Dacă Bitsocial Network oferă aplicațiilor denumire durabilă, plăți, bacșișuri, premii și alte linii financiare, aplicația emblematică ar putea deveni mult mai mult decât un client de feed.

Constrângerea importantă este că aplicația nu ar trebui să devină noul proprietar al rețelei. Poate fi un client mare, poate chiar cel mai popular client, lăsând totuși loc pentru aplicații concurente, RPC-uri concurente, algoritmi de feed concurenți și noduri de profil auto-găzduite.
