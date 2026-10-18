---
title: Unde se află postările și cât timp rămân disponibile
description: De ce postările Bitsocial sunt semnate și adresate după conținut, dar nu sunt păstrate pentru totdeauna de fiecare nod, cine le ține online și cum arhivele păstrează lizibil conținutul vechi.
---

# Unde se află postările și cât timp rămân disponibile

Bitsocial nu stochează fiecare postare pe un blockchain sau într-o bază de date a unei companii. Nodul
propriu al fiecărei comunități îi păstrează postările, cititorii și seederii ajută la servirea lor, iar
oricine dorește o arhivă permanentă poate păstra una. Păstrarea postărilor pentru totdeauna este
**opțională, nu obligatorie**: protocolul nu obligă fiecare participant să stocheze întregul istoric al
rețelei.

Această pagină explică ce înseamnă asta în practică, deoarece „nu este stocat pentru totdeauna” poate
fi ușor interpretat greșit drept „dispare” sau „ai încredere în mine”.

## Autenticitatea și disponibilitatea sunt întrebări separate

Există două întrebări diferite despre o postare:

1. **Este reală?** A scris-o acest autor și a fost acceptată de această comunitate?
2. **Mai este online?** O poate prelua cineva astăzi?

Bitsocial răspunde la prima întrebare prin criptografie, nu prin încredere. Fiecare postare este semnată
cu perechea de chei a autorului și, odată ce o comunitate o acceptă, este stocată sub un identificator de
conținut (CID): un hash al octeților săi exacți. Oricine preia o postare poate verifica singur semnătura
și hash-ul. Un nod, router, gateway sau arhivă nu poate modifica textul unei postări sau falsifica o
postare a altcuiva fără ca verificarea să eșueze.

A doua întrebare privește cine păstrează o copie, iar aceasta este singura parte care nu este garantată.

## Cine ține postările online

- **Nodul comunității.** Nodul proprietarului acceptă postări și le păstrează în baza sa de date atât
  timp cât comunitatea le păstrează. Aceasta este copia care există mereu cât timp comunitatea rulează.
  Consultați [Protocolul peer-to-peer](/peer-to-peer-protocol/).
- **Cititorii.** Aplicațiile desktop, precum aplicația 5chan Electron, seedează comunitățile pe care le
  încarcă în timp ce rulează, astfel încât comunitățile populare sunt servite de multe noduri, ca
  torrentele populare. O filă de browser poate păstra în cache și valida conținutul cât este deschisă,
  dar nu este o gazdă de durată.
- **Seederii.** [`bitsocial-seeder`](https://github.com/bitsocialnet/bitsocial-seeder) permite oricui să
  contribuie cu capacitate mereu activă de pe un VPS sau o mașină de rezervă. Acesta fixează cele mai
  noi pagini și actualizări de postări ale comunităților, ceea ce face comunitățile din spatele
  routerelor de acasă accesibile din browsere.
- **Arhiviștii.** Oricine poate parcurge comunități și păstra tot ce vede. Arhivele sunt servicii
  obișnuite construite peste rețea, nu un rol special în protocol.

## Comunitățile își aleg propria retenție

Cât timp păstrează o comunitate postările vechi este decizia proprietarului ei, nu o regulă de protocol.
Unele comunități vor ani de istoric. Altele sunt concepute să uite: panourile 5chan funcționează ca un
imageboard, unde firele cad de pe panou, trec într-o arhivă și sunt eliminate din nodul panoului după un
timp stabilit (48 de ore în mod implicit). O comunitate poate omite cu totul și arhiva.

Același protocol le susține pe ambele, deoarece retenția este o politică stabilită de fiecare comunitate,
nu un cost pe care fiecare nod trebuie să îl plătească.

## De ce să nu stocăm totul pentru totdeauna?

O rețea care cere fiecărui nod să păstreze fiecare postare pentru totdeauna trebuie să plătească pentru
asta într-un fel:

- **Blockchain-urile** obligă fiecare nod complet să stocheze întregul istoric, astfel încât cerințele
  nodurilor cresc odată cu toată activitatea, iar publicarea costă de obicei un comision.
- **Stocarea plătită**, ca chiria de stocare a Farcaster, îi face pe utilizatori să plătească pentru a-și
  păstra istoricul și elimină cele mai vechi postări dincolo de cât plătesc. Consultați
  [Bitsocial și Farcaster](/comparisons/farcaster/).
- **Serverele centrale** păstrează totul, dar numai atât timp cât o companie dorește, după regulile ei.

Rețelele sociale nu au nevoie de un registru global. Nu contează dacă postarea A a fost acceptată cu o
milisecundă înaintea postării B, iar majoritatea postărilor vechi sunt citite rareori. Bitsocial lasă
fiecare nod de comunitate să păstreze numai propriile comunități, ceea ce face găzduirea suficient de
ieftină pentru un laptop, un Raspberry Pi sau un VPS mic. Consultați
[De ce nu un blockchain?](/peer-to-peer-protocol/#why-not-a-blockchain)

## Compromisul

Dacă nimeni nu păstrează o copie a unei postări, ea poate deveni indisponibilă. CID-ul unei postări nu
se schimbă niciodată, dar un CID este doar o adresă: conținutul rămâne accesibil numai cât timp cel
puțin un nod îl servește. Dacă nodul unei comunități se oprește definitiv și niciun cititor, seeder sau
arhivă nu i-a păstrat postările, acele postări dispar.

Acesta este costul onest al faptului că nu cerem un registru global. Este și costul pe care îl au deja
toate platformele mari: postările vechi dispar când dispar conturile, serverele sau companiile.
Diferența este că, pe Bitsocial, păstrarea a ceva nu are nevoie de permisiunea nimănui.

## Păstrează ce contează

- **Rulează singur nodul comunității.** Un proprietar de comunitate care ține nodul în funcțiune
  păstrează istoricul comunității atât timp cât îl rețin setările ei.
- **Seed.** Lăsarea deschisă a unei aplicații desktop sau rularea `bitsocial-seeder` menține comunitățile
  disponibile pentru ceilalți.
- **Arhivează.** Arhivele independente păstrează firele vechi lizibile și căutabile după ce o comunitate
  le elimină. [5archive.org](https://5archive.org) arhivează panourile 5chan, iar
  [seeditarchive.org](https://seeditarchive.org) arhivează comunitățile Seedit. Ambele sunt open source,
  așa că oricine poate rula o oglindă sau o arhivă concurentă.

Deoarece fiecare postare arhivată este încă semnată, o arhivă nu poate rescrie pe ascuns ce a spus cineva:
un cititor poate verifica semnătura unei postări arhivate la fel ca pe cea a unei postări live.
