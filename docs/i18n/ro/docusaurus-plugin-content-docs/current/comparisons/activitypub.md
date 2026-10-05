---
title: Bitsocial și ActivityPub
description: Cum se compară Fediverse, cu Mastodon pentru microblogging și Lemmy pentru comunități în stilul Reddit, cu comunitățile peer-to-peer ale Bitsocial.
---

# Bitsocial și ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) este standardul W3C din spatele Fediverse.
Utilizatorii aleg un server, numit instanță, care le găzduiește contul, iar serverele schimbă postări
între ele. [Mastodon](https://joinmastodon.org/) este cel mai cunoscut software de microblogging din
acest ecosistem; [Lemmy](https://join-lemmy.org/) este un agregator de linkuri și un forum în stilul
Reddit, alcătuit din comunități tematice, ceea ce îl face cel mai apropiat echivalent din Fediverse
al aplicațiilor Bitsocial precum [Seedit](/apps/seedit/).

## Cum funcționează ActivityPub

- **Inboxuri și outboxuri.** Fiecare cont are un inbox și un outbox. Serverele livrează activități în
  inboxurile de pe alte servere, iar fiecare server destinatar își stochează propria copie a ceea ce
  urmăresc utilizatorii săi.
- **Identitate deținută de server.** ID-urile conturilor și ale postărilor sunt adrese HTTPS pe
  domeniul serverului de origine. Un handle Mastodon are forma `@user@domain`, este rezolvat prin
  WebFinger, iar serverul semnează mesajele de federare în numele utilizatorului.
- **Clienți.** Aplicațiile și browserele comunică doar cu serverul propriu al utilizatorului, prin
  API-ul acelui server.
- **Comunitățile Lemmy.** O comunitate este un actor de grup găzduit pe o singură instanță.
  Utilizatorii trimit postări către comunitate, care le retransmite urmăritorilor ei; conform
  standardului comun pentru forumuri
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)), o
  comunitate poate valida mai întâi postările, până la aprobarea manuală de către moderatori.
- **Moderare.** Moderarea este locală fiecărui server. Administratorii pot suspenda conturi, pot bloca
  servere întregi sau pot federa doar cu serverele dintr-o listă de permisiuni; Lemmy are în plus
  moderatori pentru fiecare comunitate.
- **Controlul spamului.** ActivityPub nu definește niciun mecanism anti-spam. Mastodon și Lemmy
  filtrează înregistrările prin aprobare, invitații, întrebări de înscriere, captcha și verificarea
  e-mailului, apoi se bazează pe limite de rată, raportări și moderare.

## Unde diferă

### Identitatea aparține unui domeniu

Un cont din Fediverse aparține domeniului serverului său. Mastodon poate redirecționa urmăritorii
către un cont nou, dar [postările nu se mută](https://docs.joinmastodon.org/user/moving/), mutarea
trebuie inițiată de pe vechiul server și există o perioadă de așteptare de 30 de zile. În Bitsocial,
profilurile și comunitățile sunt perechi de chei, așa că schimbarea gazdei sau a aplicației nu
schimbă identitatea. Consultați [Identitatea și proprietatea comunității](/identity-and-ownership/).

### Unde se află o comunitate

O comunitate Lemmy este structural apropiată de una Bitsocial: postările ajung la comunitate, care le
poate verifica înainte de a le retransmite. Diferența ține de locul în care se află. O comunitate
Lemmy poate fi creată doar pe instanța de origine a creatorului ei, administratorul instanței are
[control deplin](https://join-lemmy.org/docs/users/05-censorship-resistance.html) asupra ei și nu
există o metodă documentată de a o muta pe altă instanță. O comunitate Bitsocial este propria ei
pereche de chei: proprietarul îi poate rula nodul oriunde și niciun administrator de server nu stă
deasupra ei.

### Controlul spamului

Serverele Fediverse opresc spamul mai ales la înregistrare și moderează ulterior. O comunitate
Bitsocial rulează o provocare pentru fiecare postare înainte de a o accepta, iar fiecare comunitate o
alege pe a sa: captcha, listă de permisiuni, plată sau orice alt cod. Consultați
[Provocări personalizate anti-spam](/custom-challenges/).

### Operarea infrastructurii

A rula o instanță înseamnă un server mereu pornit, cu domeniu, TLS și e-mail. Mastodon mai are nevoie
de PostgreSQL, Redis și procese worker care rulează în fundal; Lemmy este mai ușor, cu aproximativ
150 MB de RAM, după propriile cifre. Fiecare instanță stochează copii ale conținutului de la distanță
pe care îl urmăresc utilizatorii ei. Un nod de comunitate Bitsocial nu are nevoie de domeniu sau
certificat și rulează din aplicația desktop sau din `bitsocial-cli`.

### Ce oferă serverele în schimb

Serverele Fediverse păstrează istoricul complet și îl servesc în mod fiabil, iar Mastodon are
instrumente de moderare mature, construite de-a lungul anilor. Bitsocial nu garantează conținutul
vechi pentru totdeauna, iar instrumentele sale de moderare se află în fiecare aplicație.

## Comparație

| Întrebare              | ActivityPub (Mastodon, Lemmy)                                                          | Bitsocial                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Categorie              | Servere federate                                                                       | Rețea de comunități peer-to-peer                                                          |
| Identitate             | Cont pe domeniul unui server, semnat de server                                         | Perechi de chei Ed25519 pentru utilizatori și comunități                                  |
| Unde se află postările | Serverul de origine, plus copii pe fiecare server care urmărește                       | Nodul proprietarului comunității și peerii care o citesc și o seedează                    |
| Cine îl ține online    | Administratorii instanțelor                                                            | Nodul proprietarului comunității, plus seederi ajutători                                  |
| Comunități             | Comunități Lemmy găzduite pe o singură instanță                                        | Obiecte de prim rang, al căror nod acceptă sau respinge postări                           |
| Controlul spamului     | Bariere la înregistrare, limite de rată, raportări și moderare                         | Provocarea fiecărei comunități, înainte ca o postare să fie acceptată                     |
| Moderare               | Administratorii serverelor și moderatorii comunităților, local pe fiecare server       | Proprietarii comunităților își moderează comunitatea; aplicațiile aleg ce afișează        |
| Nume                   | Handle-uri `@user@domain` și `!community@domain`                                       | Nume `.bso` și `.eth` care se rezolvă în chei                                             |
| Browser                | Client al serverului propriu al utilizatorului                                         | Nod peer-to-peer într-o filă obișnuită de browser                                         |
| Compromisul principal  | Istoric fiabil și moderare matură, dar identitatea și comunitățile aparțin unui server | Nu e nevoie de server sau domeniu, dar conținutul vechi nu este garantat pentru totdeauna |
