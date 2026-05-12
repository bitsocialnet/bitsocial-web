---
title: Inhaltserkennung
description: Wie Bitsocial Peer Discovery von der Kuration auf App-Ebene trennt.
---

# Inhaltserkennung

Bitsocial fügt keinen globalen Feed, Suchindex oder Ranking-Algorithmus in das Protokoll ein. Es unterteilt die Inhaltserkennung in zwei Ebenen:

1. **Netzwerksuche** findet die Peers, die derzeit eine bekannte Community bedienen.
2. **App-Kuration** entscheidet, welche Communities, Boards, Listen oder Beiträge ein Produkt zuerst angezeigt werden.

Dies hält das Protokoll klein und lässt gleichzeitig Raum für die Konkurrenz vieler Entdeckungserlebnisse.

## Netzwerksuche

Jede Community verfügt über eine stabile Adresse, die aus ihrem öffentlichen Schlüssel abgeleitet wird. Wenn ein Client diese Adresse bereits kennt, fragt er leichtgewichtige HTTP-Router ab, um Peers zu finden, die sich als Anbieter dafür angemeldet haben.

Die Router geben nur Provider-Peer-Adressen zurück. Sie speichern keine Beiträge, Metadaten, Benutzerlisten oder ein für Menschen lesbares Community-Verzeichnis. Nachdem der Client Peer-Adressen erhalten hat, stellt er eine Verbindung zu diesen Peers her und ruft die neuesten Community-Metadaten sowie Inhaltszeiger ab und ruft dann die tatsächlichen Beitragsdaten per Hash ab.

Dies beantwortet die Protokollfrage: „Wo kann ich den neuesten Status für diese Community abrufen?“

## App-Kuration

Die separate Produktfrage lautet: „Welche Communities sollte ein Benutzer zuerst sehen?“

Bitsocial überlässt dies den Apps, Listen und Benutzern, anstatt eine einzige Antwort ins Netzwerk zu backen. Beispiele hierfür sind:

- ein Client, der Communitys anzeigt, denen der Benutzer bereits folgt
- eine kuratierte Standardliste für eine App im Reddit-Stil
- Verzeichnisslots für eine App im Imageboard-Stil
- Such- oder Ranking-Indizes, die von einer bestimmten App verwaltet werden
- Direkte Links, die von Benutzern geteilt werden

Apps können verschiedene Dinge indizieren, bewerten, filtern oder hervorheben, ohne diese Entscheidungen in Protokollgesetze umzuwandeln. Wenn die Erkennungsoberfläche einer App nicht nützlich ist, kann eine andere App eine andere auf denselben zugrunde liegenden Communities erstellen.

## Aktuelle Apps

5chan verwendet derzeit bekannte Verzeichnispfade wie `/b/` oder `/g/`. Verzeichniszuweisungen werden heute über eine öffentliche Liste verwaltet. Zukünftige Versionen werden voraussichtlich die Erstellung von In-App-Boards und die Abstimmung über Verzeichnisplätze unterstützen.

Seedit verwendet Standard-Community-Listen für seine Startseite. Communitys können weiterhin außerhalb dieser Standardliste erstellt und geteilt werden.

In beiden Fällen hilft die Liste auf App-Ebene Benutzern dabei, etwas zum Öffnen zu finden, und die Suche auf Protokollebene löst dann die ausgewählte Community in Peers auf.

## Warum diese Spaltung wichtig ist

Ein einzelnes dezentrales Netzwerk benötigt immer noch eine gute Erkennung, aber die Erkennungsschicht sollte austauschbar sein. Das Kernprotokoll von Bitsocial konzentriert sich auf Adressierbarkeit, Peer-Suche, Veröffentlichung und Anti-Spam. Die Kuration liegt oberhalb dieser Ebene, wo Apps mit Verzeichnissen, Standardlisten, Feeds, Such-, Abstimmungs- und Moderationsrichtlinien experimentieren können, ohne dass eine netzwerkweite Migration erforderlich ist.
