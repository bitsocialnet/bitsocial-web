---
title: Directoare
description: Cum permit aplicațiile Bitsocial comunităților să concureze pentru un nume de subiect, în loc ca acesta să rămână la cine l-a revendicat primul.
---

# Directoare

Pe Reddit, un nume precum `r/opensource` poate aparține unei singure comunități, iar cine îl controlează îl păstrează. Dacă moderatorii fac alegeri care nu le plac utilizatorilor, singura alternativă este pornirea unui `r/opensource2`. Noua comunitate pornește cu zero abonați, deși majoritatea celor care s-au abonat la `r/opensource` țineau la open source, nu la acea echipă de moderare anume.

Aplicațiile Bitsocial evită asta prin **directoare**. Un director este un nume de subiect, cum ar fi `opensource`, pentru care concurează comunitățile. Ruta scurtă pentru acel nume deschide comunitatea aflată în acel moment pe primul loc, astfel încât o comunitate mai bună poate prelua numele fără permisiunea nimănui.

## Cum funcționează

1. **Un cod de director este un nume de subiect.** Seedit folosește rute precum `/s/funny`. 5chan folosește căi de imageboard precum `/g/`.
2. **Comunitățile concurează în calitate de candidate.** Fiecare director are o listă de comunități candidate, fiecare cu propria adresă exactă, cum ar fi `funny-posting.bso`.
3. **Candidata cu cea mai bună poziție câștigă ruta.** Deschiderea `/s/funny` afișează câștigătoarea actuală.
4. **Pierderea nu șterge nimic.** O comunitate care nu este câștigătoare își păstrează adresa, postările și abonații, iar oricine o poate deschide în continuare direct.

## Numele este o ușă de intrare, nu o identitate

Un cod de director este doar o rută de descoperire. Tot ce este durabil indică spre o comunitate exactă:

- Abonarea din `/s/funny` te abonează la adresa exactă a câștigătoarei actuale. Codul de director în sine nu este stocat niciodată ca abonament.
- Linkurile către postări folosesc întotdeauna adresa exactă a comunității, astfel încât un link vechi nu poate începe să indice spre o altă comunitate după ce câștigătoarea se schimbă.
- Când câștigătoarea se schimbă, Seedit lasă neatinse abonamentele existente și îl întreabă pe fiecare abonat dacă vrea să treacă la noua câștigătoare, să le păstreze pe amândouă sau să păstreze comunitatea actuală. Comutarea automată este o setare per director care trebuie activată explicit, iar o comutare automată afișează o notificare cu opțiune de anulare.

Așadar, o comunitate concurentă nu ia abonamentele nimănui. Câștigă numele: vizitatorii noi ajung la ea, iar abonații existenți primesc o alegere dintr-un singur clic. Cei care preferau comunitatea veche o păstrează.

## De ce nu nume după principiul „primul venit”

- **Fără ocuparea abuzivă a numelor.** Deținerea unui nume bun nu este suficientă. O comunitate trebuie să rămână cea mai bună candidată pentru el.
- **Niciun administrator nu atribuie nume.** Alocarea de către un administrator ar recrea dreptul central de veto pe care Bitsocial a fost construit să-l elimine.
- **Concurenții păstrează o cale către public.** O comunitate rivală țintește același nume în loc să o ia de la capăt sub unul mai slab.
- **Clienții cad de acord asupra câștigătoarei.** Seedit ordonează candidatele în mod determinist, așa că orice client care citește același instantaneu finalizat al directorului afișează aceeași câștigătoare. Seedit nu pune o altă candidată în locul câștigătoarei doar pentru că aceasta este temporar inaccesibilă pe conexiunea unui utilizator.

## Cum sunt alese câștigătoarele în prezent

Candidatele sunt publicate ca fișiere JSON în depozitul [bitsocialnet/lists](https://github.com/bitsocialnet/lists), câte un fișier pentru fiecare director, iar o comunitate intră într-un director printr-un pull request către fișierul acestuia. Este o etapă provizorie de pornire. Scopul este ca votul să înlocuiască pull request-urile ca mod de stabilire a câștigătoarelor.

- **Seedit** ordonează candidatele unui director după scor, apoi după momentul adăugării, apoi după adresă. Fiecare fișier de director are un număr de revizie, iar orice modificare a candidatelor sau a câștigătoarei publică o revizie nouă.
- **5chan** organizează câte un vot pentru fiecare director cu [`@bitsocial/pubsub-voting`](https://github.com/bitsocialnet/pubsub-voting). Clienții schimbă buletine de vot semnate prin libp2p gossipsub și calculează singuri rezultatul, fără vreun server care să numere voturile. Pentru a vota trebuie să deții un 5chan Pass, un token netransferabil, iar fiecare deținător are un singur vot. Votul pentru un board care nu este încă pe listă îl nominalizează. Voturile rulează în prezent pe testnetul Base Sepolia și, până când vor ieși de pe testnet, rezultatele sunt afișate, dar nu reordonează lista.

## Protocol sau aplicație?

Directoarele nu fac parte din PKC, stratul peer-to-peer care stochează și transportă comunitățile. Ele sunt o convenție pe care clienții o aplică deasupra lui, alături de listele implicite și căutare; vezi [Descoperirea conținutului](./content-discovery.md). Un client poate citi aceleași fișiere de director, își poate publica propriile fișiere sau poate renunța complet la directoare, iar utilizatorii pot deschide în continuare orice comunitate după adresa ei.
