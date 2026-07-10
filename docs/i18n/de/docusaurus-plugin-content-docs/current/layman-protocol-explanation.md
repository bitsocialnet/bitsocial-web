---
title: Eine vollständige Erklärung des Bitsocial-Protokolls für Laien
description: Eine verständliche Einführung in Bitsocial-Communitys, Peer-Suche, Veröffentlichung, Anti-Spam-Herausforderungen, Moderation und Apps.
---

# Eine vollständige Erklärung des Bitsocial-Protokolls für Laien

Auf dieser Seite wird Bitsocial erläutert, ohne dass davon ausgegangen wird, dass Sie sich bereits mit Peer-to-Peer-Netzwerken, kryptografischen Schlüsseln, IPFS oder Pubsub auskennen.

Einige Details sind absichtlich vereinfacht. Die technischere Version finden Sie auf der Seite [Peer-to-Peer-Protokoll](./peer-to-peer-protocol.md).

## Die Kurzversion

Bitsocial ist ein Protokoll für soziale Apps, bei dem Communities Eigentum von Schlüsseln und nicht einer Unternehmensdatenbank sind.

Eine Bitsocial-Community hat eine Adresse. Apps verwenden diese Adresse, um Peers zu finden, die der Community dienen, die neuesten Beiträge von diesen Peers abzurufen und neue Beiträge über einen Peer-to-Peer-Nachrichtenkanal zu veröffentlichen. Bevor ein Beitrag angenommen wird, kann die Community eine Anti-Spam-Herausforderung wie ein Captcha, einen Einladungscode, eine Zahlung, eine Token-Prüfung, eine KI-Moderationsprüfung, eine Zulassungsliste oder eine andere codierbare Regel verlangen.

Das ist der Kerngedanke:

1. Eine Community wird durch einen privaten Schlüssel kontrolliert.
2. Der öffentliche Schlüssel gibt der Community eine stabile Adresse.
3. Peers helfen den Lesern, die Community zu finden und abzurufen.
4. Ein Community-Knoten akzeptiert oder lehnt neue Beiträge ab.
5. Die Anti-Spam-Richtlinie gilt für jede Community und nicht für eine globale Plattform.

## Warum Hashes wichtig sind

Ein Hash ist ein kurzer Fingerabdruck für Daten.

Wenn zwei Personen genau dieselbe Datei hashen, erhalten sie denselben Fingerabdruck. Wenn sich die Datei ändert, ändert sich auch der Fingerabdruck. Das macht Hashes nützlich, um Daten zu finden und zu überprüfen, ohne sich darauf verlassen zu müssen, dass ein Unternehmen Ihnen sagt, um welche Datei es sich handelt.

Peer-to-Peer-Systeme nutzen diese Idee ständig. Anstatt eine Website nach „der Datei mit dem Namen photo.png“ zu fragen, kann ein Peer das Netzwerk nach den Daten mit einem bestimmten Fingerabdruck fragen. Wenn ein anderer Peer falsche Daten zurückgibt, schlägt die Hash-Prüfung fehl.

Bitsocial verwendet Hashes und Inhaltskennungen für Beitragsdaten und andere Teile des Community-Status. Der wichtige Punkt ist einfach: Daten können durch das, was sie sind, angesprochen werden, nicht nur durch den Ort, an dem ein Unternehmen sie gehostet hat.

## Warum öffentliche Schlüssel wichtig sind

Ein öffentlicher Schlüssel und ein privater Schlüssel sind ein übereinstimmendes Paar.

Der private Schlüssel ist geheim. Es ist das, was die Kontrolle gibt. Der öffentliche Schlüssel kann sicher weitergegeben werden. Dadurch können alle anderen überprüfen, ob eine Nachricht, ein Update oder eine Moderationsaktion tatsächlich vom passenden privaten Schlüssel stammt.

Auf diese Weise vermeidet Bitsocial normale Plattformkonten. Ein Unternehmen muss die Identität nicht herausgeben. Für eine Datenbankzeile muss der Eigentümer nicht definiert werden. Das Schlüsselpaar ist die Autorität.

Im Klartext:

- Der private Schlüssel ist das Kontrollhandle des Besitzers
- Der öffentliche Schlüssel ist die öffentliche Identität oder Adresse
- Unterschriften beweisen, dass eine Aktion vom Eigentümer ausging

## Was für eine Bitsocial-Community ist

Eine Bitsocial-Community ist nicht nur eine Seite in einer App.

Es verfügt über ein eigenes Schlüsselpaar. Der öffentliche Schlüssel gibt der Community eine stabile Netzwerkadresse. Der private Schlüssel steuert Aktualisierungen des Community-Status, z. B. Metadaten, Regeln, Moderatorenliste, Challenge-Konfiguration und die Zeiger auf die zuletzt akzeptierten Inhalte.

Das bedeutet, dass eine Community eine Schnittstelle überleben kann. Eine App kann es als Pinnwand anzeigen. Eine andere App kann es als Forum anzeigen. Eine zukünftige App kann es in einem profilbasierten Feed anzeigen. Die App kann sich ändern, aber die Community-Adresse verweist immer noch auf dieselbe Community, deren Eigentümer sie ist.

## Wie Lesen funktioniert

Wenn ein Benutzer eine Bitsocial-Community öffnet, fragt die App nicht eine zentrale Datenbank nach der Seite.

Der Fluss ist näher daran:

1. Die App kennt die Community-Adresse bereits oder bezieht sie aus einer Liste, einem Link, einer Suchoberfläche usw
   für Menschen lesbarer Name.
2. Die App fragt Lightweight-Router, welche Peers derzeit diese Community-Adresse bereitstellen.
3. Die Router geben nur Peer-Adressen zurück. Sie geben keine Beiträge, Regeln, Profile oder Community zurück
   Metadaten.
4. Die App stellt eine Verbindung zu Peers her und ruft den neuesten Community-Status ab.
5. Dieser Status enthält Hinweise zum Posten von Inhalten.
6. Die App ruft den Beitragsinhalt von Kollegen ab und stellt ihn in einer normalen sozialen Schnittstelle dar.

Der Router ist nur ein Suchhelfer. Es kommt eher der Frage „Wer hat das?“ gleich. als zu fragen: „Bitte stellen Sie mir die gesamte Website zur Verfügung.“

Weitere Einzelheiten zu dieser Aufteilung finden Sie unter [Inhaltserkennung](./content-discovery.md).

## So funktioniert das Posten

Das Posten unterscheidet sich vom Lesen, da offene Peer-to-Peer-Netzwerke mit Spam verschickt werden können.

Bitsocial wickelt die Veröffentlichung über einen Challenge-Response-Flow ab:

1. Der Benutzer schreibt einen Beitrag oder eine Antwort.
2. Die App fügt sich in das Peer-to-Peer-Nachrichtenthema der Community ein.
3. Die App bittet den Community-Knoten um eine Herausforderung.
4. Der Community-Knoten sendet die Herausforderung zurück.
5. Der Benutzer oder die App schließt die Herausforderung ab.
6. Die App sendet den Beitrag plus die Challenge-Antwort.
7. Der Community-Knoten prüft die Antwort und den Beitrag.
8. Wenn die Prüfung erfolgreich ist, nimmt der Community-Knoten den Beitrag in das nächste Update der Community auf.
9. Andere Leser rufen den aktualisierten Community-Status von Kollegen ab.

Die Herausforderung findet statt, bevor der Beitrag Teil des akzeptierten Community-Status wird. Das ist der wichtige Unterschied zu Systemen, bei denen Spam zuerst angenommen und später ausgeblendet wird.

## Warum Anti-Spam-Herausforderungen wichtig sind

Die meisten sozialen Plattformen machen Anti-Spam zu einer Plattformrichtlinie. Ein Unternehmen entscheidet, was als gültiger Account, gültiger Beitrag, gültige Reichweite oder gültiger Benutzer gilt.

Bitsocial trennt diese Dinge. Das Protokoll gibt Communities die Möglichkeit, eine Challenge zu verlangen, bevor sie einen Beitrag annehmen, aber es zwingt nicht jede Community, die gleiche Challenge zu nutzen.

Eine Community könnte ein Captcha verwenden. Ein anderer könnte Einladungscodes verwenden. Ein anderer könnte einen SMS-Check, eine Zahlung, ein NFT, ein Token-Guthaben, einen KI-Moderationswert, einen Reputationsnachweis, eine Community-spezifische Zulassungsliste oder eine benutzerdefinierte Regel erfordern.

Diese Flexibilität ist wichtig, da sich Spam ändert. Eine Spam-Regel auf Protokollebene wird veraltet. Eine Herausforderung auf Community-Ebene kann entstehen, ohne dass das gesamte Netzwerk migriert werden muss.

Eine detaillierte Erklärung finden Sie unter [Benutzerdefinierte Anti-Spam-Herausforderungen](./custom-challenges.md).

## So funktioniert Moderation

Bitsocial ist nicht moderationsfrei. Es ist Moderation ohne einen globalen Superadmin.

Eine Community kann Besitzer und Moderatoren haben. Moderatoradressen sind Teil des Community-Status. Wenn ein Moderator eine Aktion ausführt, kann diese Aktion signiert werden. Der Community-Knoten und die Clients können die Signatur anhand der Moderatorenliste überprüfen.

Das gibt der Moderation eine lokale Reichweite:

- Ein Community-Eigentümer kontrolliert diese Community
- Moderatoren agieren anhand von Schlüsseln, die die Community erkennt
- Apps können weiterhin auswählen, was sie indizieren, bewerten, ausblenden oder hervorheben
- Kein Unternehmenskonto auf Protokollebene kann jede Identität löschen oder jede Community beschlagnahmen

In der Praxis bedeutet dies, dass eine Community Spam entfernen oder Regeln in ihrem eigenen Bereich durchsetzen kann, ohne ihre Regeln für das gesamte Netzwerk in Gesetz umsetzen zu müssen.

Für die Richtlinienansicht lesen Sie [Lokale Moderation, keine globalen Verbote](./local-moderation.md).

## Welche Apps hinzufügen

Das Protokoll legt nicht fest, wie das gesamte Produkt aussehen soll.

Eine App fügt die menschliche Erfahrung rund um das Protokoll hinzu:

- Standard-Community-Listen
- Suchen und Entdecken
- Feeds und Ranking
- Layout- und Posting-Schnittstelle
- Umgang mit Medien
- Moderationstools
- Mobil-, Desktop- oder Browser-Paketierung
- Geschäftsmodell und Zahlungsausfälle

Deshalb kann Bitsocial verschiedene App-Stile unterstützen. 5chan kann sich wie ein Imageboard anfühlen. Seedit kann sich wie eine Forumsdiskussion anfühlen. Andere Kunden können andere Entdeckungsoberflächen, Ranking-Systeme, Moderationsansichten oder Community-Standards erstellen und dabei weiterhin kompatible Bitsocial-Communitys verwenden.

Das Protokoll hält den Besitz und die Veröffentlichung portierbar. Apps konkurrieren um die Produktqualität.

## Was öffentliches RPC hinzufügt

Der direkte Betrieb eines Peer-to-Peer-Community-Knotens ist leistungsstark, aber nicht jeder möchte einen ständig aktiven Computer verwalten.

Public RPC ist die Serviceschicht, die Bitsocial komfortabler machen kann. Ein öffentlicher RPC-Anbieter kann Benutzern dabei helfen, Communities über ein Telefon oder einen Lightweight-Client zu verwalten, während das langfristige Eigentumsmodell es Benutzern weiterhin ermöglichen sollte, wegzuziehen, sich selbst zu hosten oder einen konkurrierenden Anbieter zu wählen.

Auf die Unterscheidung kommt es an:

- RPC kann zu Betriebszeit und Komfort beitragen
- RPC sollte nicht zur dauerhaften Verwahrung werden
- Die Eigentümerbeziehung sollte an Schlüssel gebunden bleiben und nicht an die Datenbank eines Anbieters

## Was Bitsocial nicht ist

Bitsocial ist kein soziales Blockchain-Netzwerk. In den sozialen Medien muss nicht jeder Beitrag zu einer Transaktion in einem globalen Hauptbuch werden.

Bitsocial ist keine Föderation im Sinne von ActivityPub. Eine Community muss kein Konto auf einem Server mit einer Domäne, einem Administrator und einer Serverdatenbank sein.

Bitsocial ist auch keine App. Es handelt sich um eine gemeinsame Protokollschicht für Apps, Communities, Knoten, Router, RPC-Anbieter, Erkennungsdienste, Anti-Spam-Module und Moderationstools.

Der Punkt ist nicht, dass jeder Benutzer dies alles verstehen muss, bevor er etwas postet. Der Punkt ist, dass sich das Produkt normal anfühlen kann, während das Eigentumsmodell darunter unterschiedlich ist.

## Wohin als nächstes?

- [Peer-to-Peer-Protokoll](./peer-to-peer-protocol.md) erklärt den technischen Ablauf.
- [Inhaltserkennung](./content-discovery.md) erklärt die Netzwerksuche im Vergleich zur App-Kuratierung.
- [Benutzerdefinierte Anti-Spam-Herausforderungen](./custom-challenges.md) erklärt das Challenge-System.
- [Identität und Gemeinschaftseigentum](./identity-and-ownership.md) erklärt schlüsselgesteuert
  Eigentum.
- [Erstellen Sie Ihren eigenen Kunden](/build-your-own-client/) erklärt, wie unabhängige Apps darauf aufbauen können
  das gleiche Netzwerk.
