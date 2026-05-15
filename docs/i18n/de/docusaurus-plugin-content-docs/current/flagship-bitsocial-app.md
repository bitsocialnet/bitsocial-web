---
title: Flaggschiff-Bitsocial-App
description: "Der vorgeschlagene profilbasierte Bitsocial-Client: standardmäßig vertraut mit X/Twitter, aber mit austauschbaren RPCs, Feeds, Algorithmen, Anzeigen und Communities."
---

# Flaggschiff-Bitsocial-App

Die Flaggschiff-App Bitsocial ist der vorgeschlagene erste profilbasierte Client für das Netzwerk. Der einfachste Vergleich ist: standardmäßig wie X/Twitter, aber mit aufgebrochener Plattformschicht.

Es würde Profile, Follower, Antworten, Feeds, Communities, Benachrichtigungen und öffentliche Konversationen in Echtzeit hinzufügen und gleichzeitig die zugrunde liegenden Dienste austauschbar halten. 5chan beweist, dass anonyme Communities funktionieren können. Seedit strebt eine anhaltende Diskussion an. Die Flaggschiff-App würde diese Netzwerkeffekte in einen Mainstream-Social-Feed übertragen, ohne dass ein Unternehmen zum Eigentümer des Diagramms wird.

Diese Seite beschreibt die Produktrichtung, keine gesperrte Release-Spezifikation. Die genaue Schnittstelle, der Standard-Feed, das Anzeigenmodell, die KI-Funktionen und der RPC-Marktplatz können sich ändern, wenn das Protokoll und die ersten Apps ausgereift sind.

## Was es beweisen sollte

Die App soll beweisen, dass ein profilbasiertes soziales Netzwerk nicht zur Depotplattform werden kann:

- Benutzer können Identitäten und Profile besitzen
- Communities und Profilknoten können Peer-to-Peer bleiben
- Communities können Netzwerkeffekte über Bitsocial-Clients hinweg übertragen
- RPC-Anbieter können die App komfortabel gestalten, ohne das Sorgerecht zu übernehmen
- Feed-Algorithmen können optionale Dienste anstelle von Plattformgesetzen sein
- Andere Kunden können weiterhin um dasselbe Netzwerk konkurrieren

Es geht nicht darum, den einzigen Bitsocial-Kunden zu machen. Es geht darum, den ersten breiten Client zu erstellen, der zeigt, wie weit das Protokoll reichen kann.

## Standardmäßig vertraut, konstruktiv austauschbar

Das Standarderlebnis sollte mit gängigen öffentlichen Konversations-Apps konkurrenzfähig sein: ein schneller Home-Feed, Follower, Antworten, Verteilung im Repost-Stil, Communities, Benachrichtigungen, Suche und eine Rangliste für Sie, die sofort funktioniert.

Bitsocial Forge kann den ersten Standard-RPC- und Feed-Dienst ausführen. Diese Standardeinstellung kann einen Rangfolge-Feed und Anzeigen umfassen, sodass sich die App vom ersten Tag an vollständig anfühlt, anstatt dass Mainstream-Benutzer den gesamten Stapel selbst zusammenstellen müssen.

Der Unterschied besteht darin, dass die Zahlungsunfähigkeit nicht zum Gefängnis werden sollte. Ein Benutzer sollte in der Lage sein, RPCs, Feeds, Instanzen, Ranking-Systeme, Anzeigen und Discovery-Anbieter zu wechseln oder das Ranking vollständig zu entfernen. Die App kann beim ersten Start angepasst werden, während alle wichtigen Dienste austauschbar bleiben.

Dadurch ist die App anpassbarer als eine herkömmliche Plattform. Ein Nutzer behält möglicherweise den Standard-Ranking-Feed mit Anzeigen bei. Ein anderer verwendet möglicherweise einen chronologischen Feed ohne Rangfolge. Ein anderer könnte sich für einen datenschutzorientierten RPC, einen von der Community betriebenen Discovery-Dienst, einen kostenpflichtigen, werbefreien Feed oder einen Nischenalgorithmus entscheiden, der für eine bestimmte Subkultur entwickelt wurde.

## Kundenübergreifende Communities

Communities sollten viel wichtiger sein als isolierte Gruppen innerhalb einer App.

Auf X/Twitter sind Communities auf X beschränkt. Sie können nützlich sein, erben jedoch die Grenzen einer Plattform, eines Kontosystems, eines Empfehlungsstapels und einer Produktoberfläche.

Eine Bitsocial-Community kann über verschiedene Clients erstellt, gehostet, entdeckt und genutzt werden. Das bedeutet, dass die Flaggschiff-App Communities und Beiträge aus dem breiteren Bitsocial-Netzwerk anzeigen kann, nicht nur von Benutzern, die in der Flaggschiff-App gestartet sind. Eine Community könnte gleichzeitig Aktivitäten von einem Imageboard-Client, einem Diskussions-Client im Reddit-Stil, einem Nischenforum-Client, einer mobilen App und der Flaggschiff-App haben.

Das ist der Kernvorteil des Netzwerkeffekts: Ein Client kann sich den Mainstream-Benutzern vertraut anfühlen und dennoch von vielen Clients, Community-Knoten, RPC-Anbietern und unabhängigen Diensten profitieren.

## Optionale Feed-Algorithmen

Die Flaggschiff-App sollte nicht jedem ein globales Ranking-System aufzwingen.

Feed-Algorithmen sollten Opt-in sein. Ein Benutzer könnte einen Algorithmus von einem Marktplatz auswählen, den Anbieter wechseln, einen Algorithmus eines Unternehmens verwenden, einen von einem anonymen Betreiber ausgeführten verwenden, einen von einer Community erstellten verwenden, einen persönlichen verwenden oder überhaupt keinen Algorithmus verwenden.

Öffentliche RPC-Anbieter sind ein natürlicher Ort für den Wettbewerb dieser Dienste. Sie können Inhalte indizieren, bewerten und empfehlen, sollten aber weder Eigentümer des Benutzers noch des Profils sein.

Diese Dienste können auch hinsichtlich der Form der App selbst konkurrieren. Ein RPC könnte einen Rangfolge-Feed mit Anzeigen bereitstellen. Ein anderer könnte einen chronologischen Feed ohne Rangfolge bereitstellen. Ein anderer könnte sich auf Datenschutz, Übersetzung, Moderation, Community Discovery oder einen Nischen-Social-Graph spezialisieren.

Wenn die Wirtschaftlichkeit funktioniert, könnten RPC-gestützte Feed-Dienste KI-Funktionen hinzufügen, die denen ähneln, die Mainstream-Plattformen in ihre Feeds integrieren wollen: automatische Übersetzungen, Zusammenfassungen, Bot-gestützte Antworten, Suchantworten, Moderationsunterstützung oder Kontext im Community-Notiz-Stil.

Bei diesen Funktionen sollte es sich um Dienstoptionen und nicht um Protokollanforderungen handeln. Ein Standard-RPC kann mit einem reichhaltigeren Feed konkurrieren, aber Benutzer und konkurrierende Kunden sollten dennoch die Möglichkeit haben, einfachere, private, chronologische, werbefreie oder Community-spezifische Alternativen zu wählen.

## RPC ohne Verwahrung

Jeder Benutzer sollte über RPC als vollständiger Peer-to-Peer-Knoten teilnehmen können, ohne dem RPC-Anbieter das Eigentum an seiner Identität oder seinem Profil zu übertragen.

Der gehostete Pfad ist wichtig, da die meisten Benutzer zunächst keinen Server ausführen. Ebenso wichtig ist der Exit-Pfad: Ein Benutzer sollte in der Lage sein, jederzeit zu seinem eigenen Profilknoten auf Hardware mit geringer Spezifikation, einschließlich eines Raspberry Pi, zu wechseln.

Das ist der Unterschied zwischen Bequemlichkeit und Sorgerecht.

## Warum daraus eine Alles-App werden kann

Wenn Bitsocial Network Apps dauerhafte Namen, Zahlungen, Trinkgelder, Auszeichnungen und andere Finanzschienen bietet, könnte die Flaggschiff-App viel mehr als nur ein Feed-Client werden.

Die wichtige Einschränkung besteht darin, dass die App nicht der neue Eigentümer des Netzwerks werden darf. Es kann sich um einen großen Client handeln, vielleicht sogar um den beliebtesten Client, der dennoch Platz für konkurrierende Apps, konkurrierende RPCs, konkurrierende Feed-Algorithmen und selbst gehostete Profilknoten lässt.
