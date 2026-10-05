---
title: Bitsocial und ActivityPub
description: Wie sich das Fediverse, mit Mastodon für Microblogging und Lemmy für Communities im Reddit-Stil, von den Peer-to-Peer-Communities von Bitsocial unterscheidet.
---

# Bitsocial und ActivityPub

[ActivityPub](https://www.w3.org/TR/activitypub/) ist der W3C-Standard hinter dem Fediverse. Nutzer
wählen einen Server, eine sogenannte Instanz, die ihr Konto hostet, und die Server tauschen Beiträge
untereinander aus. [Mastodon](https://joinmastodon.org/) ist die bekannteste Microblogging-Software
dafür; [Lemmy](https://join-lemmy.org/) ist ein Link-Aggregator und Forum im Reddit-Stil, aufgebaut
aus thematischen Communities, und kommt damit von allem im Fediverse Bitsocial-Apps wie
[Seedit](/apps/seedit/) am nächsten.

## Wie ActivityPub funktioniert

- **Inboxen und Outboxen.** Jedes Konto hat eine Inbox und eine Outbox. Server stellen Aktivitäten
  in Inboxen auf anderen Servern zu, und jeder empfangende Server speichert seine eigene Kopie
  dessen, was seine Nutzer abonniert haben.
- **Identität im Besitz des Servers.** Konto- und Beitrags-IDs sind HTTPS-Adressen auf der Domain
  des Ursprungsservers. Ein Mastodon-Handle hat die Form `@user@domain` und wird über WebFinger
  aufgelöst, und der Server signiert Föderationsnachrichten im Namen des Nutzers.
- **Clients.** Apps und Browser sprechen nur mit dem eigenen Server des Nutzers, über dessen API.
- **Lemmy-Communities.** Eine Community ist ein Gruppen-Akteur, der auf einer Instanz gehostet wird.
  Nutzer senden Beiträge an die Community, die sie an ihre Follower weiterverbreitet; nach dem
  gemeinsamen Forenstandard
  ([FEP-1b12](https://codeberg.org/fediverse/fep/src/branch/main/fep/1b12/fep-1b12.md)) kann eine
  Community Beiträge zuerst prüfen, bis hin zur manuellen Freigabe durch Moderatoren.
- **Moderation.** Moderation ist auf den jeweiligen Server beschränkt. Admins können Konten sperren,
  ganze Server blockieren oder nur mit Servern auf einer Allowlist föderieren; Lemmy hat zusätzlich
  Moderatoren für jede Community.
- **Spam-Abwehr.** ActivityPub definiert keinen Anti-Spam-Mechanismus. Mastodon und Lemmy
  beschränken Registrierungen mit Freigaben, Einladungen, Bewerbungsfragen, Captchas und
  E-Mail-Prüfungen und setzen danach auf Ratenlimits, Meldungen und Moderation.

## Wo sie sich unterscheiden

### Die Identität gehört einer Domain

Ein Fediverse-Konto gehört zur Domain seines Servers. Mastodon kann Follower auf ein neues Konto
umleiten, aber [Beiträge ziehen nicht mit um](https://docs.joinmastodon.org/user/moving/), der Umzug
muss vom alten Server aus angestoßen werden, und es gilt eine Sperrfrist von 30 Tagen. Bei Bitsocial
sind Profile und Communities Schlüsselpaare, daher ändert ein Wechsel des Hosts oder der App nichts
an der Identität. Siehe [Identität und Eigentum an Communities](/identity-and-ownership/).

### Wo eine Community lebt

Eine Lemmy-Community ähnelt strukturell einer Bitsocial-Community: Beiträge gehen an die Community,
die sie vor dem Weiterverbreiten prüfen kann. Der Unterschied liegt darin, wo sie lebt. Eine
Lemmy-Community kann nur auf der Heimatinstanz ihres Erstellers angelegt werden, der Instanz-Admin
hat [die vollständige Kontrolle](https://join-lemmy.org/docs/users/05-censorship-resistance.html)
über sie, und es gibt keinen dokumentierten Weg, sie auf eine andere Instanz umzuziehen. Eine
Bitsocial-Community ist ihr eigenes Schlüsselpaar: Der Eigentümer kann ihren Node überall betreiben,
und kein Server-Admin steht über ihr.

### Spam-Abwehr

Fediverse-Server stoppen Spam größtenteils bei der Registrierung und moderieren danach. Eine
Bitsocial-Community führt bei jedem Beitrag eine Challenge aus, bevor sie ihn annimmt, und jede
Community wählt ihre eigene: Captcha, Allowlist, Bezahlung oder beliebigen anderen Code. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Betrieb der Infrastruktur

Eine Instanz zu betreiben bedeutet einen ständig laufenden Server mit Domain, TLS und E-Mail.
Mastodon braucht zusätzlich PostgreSQL, Redis und Hintergrund-Worker; Lemmy ist schlanker und kommt
nach eigenen Angaben mit etwa 150 MB RAM aus. Jede Instanz speichert Kopien der entfernten Inhalte,
denen ihre Nutzer folgen. Ein Bitsocial-Community-Node braucht weder Domain noch Zertifikat und
läuft über die Desktop-App oder `bitsocial-cli`.

### Was Server dafür bieten

Fediverse-Server bewahren den vollständigen Verlauf und liefern ihn zuverlässig aus, und Mastodon
hat ausgereifte Moderationswerkzeuge, die über Jahre gewachsen sind. Bitsocial garantiert alte
Inhalte nicht für immer, und seine Moderationswerkzeuge stecken in der jeweiligen App.

## Vergleich

| Frage                  | ActivityPub (Mastodon, Lemmy)                                                                         | Bitsocial                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Kategorie              | Föderierte Server                                                                                     | Peer-to-Peer-Community-Netzwerk                                                       |
| Identität              | Konto auf der Domain eines Servers, vom Server signiert                                               | Ed25519-Schlüsselpaare für Nutzer und Communities                                     |
| Wo Beiträge liegen     | Der Ursprungsserver, plus Kopien auf jedem Server, der folgt                                          | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden            |
| Wer hält es online     | Instanz-Admins                                                                                        | Node des Community-Eigentümers plus helfende Seeder                                   |
| Communities            | Lemmy-Communities, auf einer Instanz gehostet                                                         | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                         |
| Spam-Abwehr            | Registrierungshürden, Ratenlimits, Meldungen und Moderation                                           | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird             |
| Moderation             | Server-Admins und Community-Moderatoren, auf den jeweiligen Server beschränkt                         | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen    |
| Namen                  | Handles der Form `@user@domain` und `!community@domain`                                               | `.bso`- und `.eth`-Namen, die zu Schlüsseln auflösen                                  |
| Browser                | Client des eigenen Servers des Nutzers                                                                | Peer-to-Peer-Node in einem normalen Browser-Tab                                       |
| Wichtigster Kompromiss | Zuverlässiger Verlauf und ausgereifte Moderation, aber Identität und Communities gehören einem Server | Kein Server und keine Domain nötig, aber alte Inhalte sind nicht dauerhaft garantiert |
