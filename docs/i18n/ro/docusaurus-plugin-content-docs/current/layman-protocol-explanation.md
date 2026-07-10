---
title: O explicație completă a protocolului Bitsocial
description: O prezentare simplă în limba engleză a comunităților Bitsocial, căutare peer, publicare, provocări anti-spam, moderare și aplicații.
---

# O explicație completă a protocolului Bitsocial

Această pagină explică Bitsocial fără a presupune că înțelegeți deja rețelele peer-to-peer, cheile criptografice, IPFS sau pubsub.

Unele detalii sunt simplificate intenționat. Pentru versiunea mai tehnică, citiți pagina [Protocolul peer-to-peer](./peer-to-peer-protocol.md).

## Varianta scurtă

Bitsocial este un protocol pentru aplicațiile sociale în care comunitățile sunt deținute de chei și nu de o bază de date a companiei.

O comunitate Bitsocial are o adresă. Aplicațiile folosesc acea adresă pentru a găsi colegi care servesc comunitatea, pentru a prelua cele mai recente postări de la acei colegi și pentru a publica postări noi printr-un canal de mesaje peer-to-peer. Înainte ca o postare să fie acceptată, comunitatea poate solicita o provocare anti-spam, cum ar fi un captcha, un cod de invitație, o plată, o verificare a simbolurilor, o verificare a moderarii AI, o listă de permise sau orice altă regulă care poate fi codificată.

Aceasta este ideea de bază:

1. O comunitate este controlată de o cheie privată.
2. Cheia publică oferă comunității o adresă stabilă.
3. Colegii îi ajută pe cititori să găsească și să aducă comunitatea.
4. Un nod comunitar acceptă sau respinge postări noi.
5. Politica anti-spam aparține fiecărei comunități, nu unei singure platforme globale.

## De ce contează hashurile

Un hash este o amprentă scurtă pentru date.

Dacă doi oameni trimit exact același fișier, primesc aceeași amprentă. Dacă fișierul se modifică, amprenta se schimbă. Acest lucru face ca hashurile să fie utile pentru găsirea și verificarea datelor fără a avea încredere într-o companie care vă va spune ce este fișierul.

Sistemele peer-to-peer folosesc această idee în mod constant. În loc să ceară unui site web „fișierul numit photo.png”, un coleg poate cere rețelei datele cu o anumită amprentă. Dacă un alt peer returnează datele greșite, verificarea hash eșuează.

Bitsocial folosește hash-uri și identificatori de conținut pentru datele postărilor și alte părți ale stării comunității. Punctul important este simplu: datele pot fi abordate după ceea ce sunt, nu numai după locul în care o companie le-a găzduit.

## De ce contează cheile publice

O cheie publică și o cheie privată sunt o pereche potrivită.

Cheia privată este secretă. Este lucrul care dă control. Cheia publică poate fi partajată în siguranță. Le permite tuturor să verifice dacă un mesaj, o actualizare sau o acțiune de moderare a venit cu adevărat de la cheia privată corespunzătoare.

Acesta este modul în care Bitsocial evită conturile normale de platformă. O companie nu trebuie să emită identitatea. Un rând de bază de date nu trebuie să definească proprietarul. Perechea de chei este autoritatea.

În termeni simpli:

- cheia privată este controlul proprietarului
- cheia publică este identitatea sau adresa publică
- semnăturile dovedesc că o acțiune a venit de la proprietar

## Ce este o comunitate Bitsocial

O comunitate Bitsocial nu este doar o pagină într-o singură aplicație.

Are propria pereche de taste. Cheia publică oferă comunității o adresă de rețea stabilă. Cheia privată controlează actualizările stării comunității, cum ar fi metadatele, regulile, lista moderatorilor, configurația provocării și indicatorii către cel mai recent conținut acceptat.

Asta înseamnă că o comunitate poate supraviețui unei singure interfețe. O aplicație o poate afișa ca panou. O altă aplicație o poate afișa ca forum. O aplicație viitoare o poate afișa într-un feed bazat pe profil. Aplicația se poate schimba, dar adresa comunității indică în continuare aceeași comunitate deținută.

## Cum funcționează lectura

Când un utilizator deschide o comunitate Bitsocial, aplicația nu solicită o bază de date centrală pentru pagină.

Fluxul este mai aproape de aceasta:

1. Aplicația știe deja adresa comunității sau o obține dintr-o listă, un link, o suprafață de căutare sau
   nume care poate fi citit de om.
2. Aplicația întreabă routerelor ușoare care colegii furnizează în prezent adresa comunității respective.
3. Routerele returnează numai adrese peer. Nu returnează postări, reguli, profiluri sau comunitate
   metadate.
4. Aplicația se conectează la colegi și preia cea mai recentă stare a comunității.
5. Acea stare conține indicatoare pentru a posta conținut.
6. Aplicația preia conținutul postării de la colegi și îl redă într-o interfață socială normală.

Routerul este doar un ajutor de căutare. Este mai aproape de a întreba „cine are asta?” decât să întrebi „te rog să-mi servești tot site-ul”.

Pentru mai multe detalii despre această împărțire, citiți [Descoperirea conținutului](./content-discovery.md).

## Cum funcționează postarea

Postarea este diferită de citire, deoarece rețelele deschise peer-to-peer pot fi spam.

Bitsocial gestionează publicarea printr-un flux provocare-răspuns:

1. Utilizatorul scrie o postare sau un răspuns.
2. Aplicația se alătură subiectului de mesaj peer-to-peer al comunității.
3. Aplicația solicită nodului comunității o provocare.
4. Nodul comunității trimite înapoi provocarea.
5. Utilizatorul sau aplicația finalizează provocarea.
6. Aplicația trimite postarea plus răspunsul la provocare.
7. Nodul comunității verifică răspunsul și postarea.
8. Dacă trece, nodul comunității acceptă postarea în următoarea actualizare a comunității.
9. Alți cititori preiau starea actualizată a comunității de la colegi.

Provocarea are loc înainte ca postul să devină parte a statului comunitar acceptat. Aceasta este diferența importantă față de sistemele în care spam-ul este acceptat mai întâi și ascuns mai târziu.

## De ce contează provocările anti-spam

Majoritatea platformelor sociale transformă anti-spam-ul într-o politică a platformei. O companie decide ce contează drept cont valid, postare validă, acoperire validă sau utilizator valid.

Bitsocial separă aceste lucruri. Protocolul oferă comunităților o modalitate de a solicita o provocare înainte de a accepta o postare, dar nu obligă fiecare comunitate să folosească aceeași provocare.

O comunitate ar putea folosi un captcha. Altul ar putea folosi coduri de invitație. Un alt ar putea necesita o verificare prin SMS, o plată, un NFT, un sold de simbol, un scor de moderare AI, o dovadă a reputației, o listă de permisiuni specifică comunității sau o regulă personalizată.

Această flexibilitate contează deoarece spamul se schimbă. O regulă de spam la nivel de protocol devine învechită. O provocare la nivel de comunitate poate evolua fără a migra întreaga rețea.

Pentru explicația concentrată, citiți [Provocări personalizate anti-spam](./custom-challenges.md).

## Cum funcționează moderarea

Bitsocial nu este fără moderare. Este moderare fără un super-administrator global.

O comunitate poate avea proprietari și moderatori. Adresele moderatorilor fac parte din starea comunității. Când un moderator face o acțiune, acțiunea respectivă poate fi semnată. Nodul comunității și clienții pot verifica semnătura față de lista de moderatori.

Asta conferă moderației un domeniu local:

- un proprietar de comunitate controlează acea comunitate
- moderatorii acționează prin chei pe care comunitatea le recunoaște
- aplicațiile pot alege în continuare ceea ce indexează, clasifică, ascund sau evidențiază
- niciun cont de companie la nivel de protocol nu poate șterge fiecare identitate sau pune mâna pe fiecare comunitate

În practică, aceasta înseamnă că o comunitate poate elimina spam-ul sau poate aplica reguli în interiorul propriului spațiu fără a-și transforma regulile în lege pentru întreaga rețea.

Pentru vizualizarea politicii, citiți [Moderare locală, nu interdicții globale](./local-moderation.md).

## Ce aplicații adaugă

Protocolul nu decide cum ar trebui să arate întregul produs.

O aplicație adaugă experiența umană în jurul protocolului:

- listele de comunități implicite
- căutare și descoperire
- fluxuri și clasament
- interfață de aspect și postare
- manipularea mass-media
- instrumente de moderare
- ambalaj mobil, desktop sau browser
- modelul de afaceri și valorile implicite

De aceea, Bitsocial poate suporta diferite stiluri de aplicații. 5chan se poate simți ca un tablou de imagine. Seedit poate simți ca o discuție în stilul forumului. Alți clienți pot construi diferite suprafețe de descoperire, sisteme de clasare, vizualizări de moderare sau setări implicite ale comunității, folosind în continuare comunități Bitsocial compatibile dedesubt.

Protocolul menține proprietatea și publicarea portabile. Aplicațiile concurează pentru calitatea produsului.

## Ce adaugă RPC public

Rularea directă a unui nod de comunitate peer-to-peer este puternică, dar nu toată lumea vrea să gestioneze o mașină permanentă.

Public RPC este nivelul de serviciu care poate face Bitsocial mai convenabil. Un furnizor public RPC poate ajuta utilizatorii să gestioneze comunitățile de la un telefon sau un client ușor, în timp ce modelul de proprietate pe termen lung ar trebui să permită utilizatorilor să se îndepărteze, să se autogăzduiască sau să aleagă un furnizor concurent.

Distincția contează:

- RPC poate ajuta cu timpul de funcționare și comoditate
- RPC nu ar trebui să devină custodia permanentă
- relația cu proprietarul ar trebui să rămână legată de chei, nu de baza de date a unui singur furnizor

## Ce nu este Bitsocial

Bitsocial nu este o rețea socială blockchain. Rețelele sociale nu au nevoie de fiecare postare pentru a deveni o tranzacție într-un singur registru global.

Bitsocial nu este o federație în sensul ActivityPub. O comunitate nu trebuie să fie un cont pe un server cu un domeniu, un administrator și o bază de date de server.

Bitsocial, de asemenea, nu este o singură aplicație. Este un strat de protocol partajat pentru aplicații, comunități, noduri, routere, furnizori RPC, servicii de descoperire, module anti-spam și instrumente de moderare.

Ideea nu este că fiecare utilizator trebuie să înțeleagă toate acestea înainte de a posta. Ideea este că produsul se poate simți normal, în timp ce modelul de proprietate dedesubt este diferit.

## Unde să mergi mai departe

- [Protocolul peer-to-peer](./peer-to-peer-protocol.md) explică fluxul tehnic.
- [Descoperirea conținutului](./content-discovery.md) explică căutarea în rețea versus curatarea aplicațiilor.
- [Provocări personalizate anti-spam](./custom-challenges.md) explică sistemul de provocare.
- [Identitatea și proprietatea comunitară](./identity-and-ownership.md) explică controlat prin cheie
  proprietate.
- [Construiește-ți propriul client](/build-your-own-client/) explică cum se pot construi aplicațiile independente
  aceeași rețea.
