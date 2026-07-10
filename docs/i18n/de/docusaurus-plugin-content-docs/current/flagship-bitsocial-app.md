---
title: Twitter/X dezentralisieren
description: "Phase 3 des Masterplans: eine fokussierte, dezentrale Alternative zu Twitter/X für textorientierte öffentliche Gespräche, mit austauschbarer Infrastruktur."
---

# Twitter/X dezentralisieren

Phase 3 sieht den Aufbau einer fokussierten, dezentralen Alternative zu Twitter/X vor. Im Mittelpunkt stehen textorientierte öffentliche Gespräche: kurze Beiträge, Antworten, Reposts, Follows, Diskussionen in Echtzeit und Communities, wobei die Plattformebene aufgebrochen wird.

Twitter/X wird noch immer durch Beiträge, Text und den Austausch von Ideen bestimmt. Der Phase-3-Client sollte bei diesem Kernerlebnis konkurrieren und es außergewöhnlich gut umsetzen.

Diese Seite beschreibt die Produktrichtung, keine festgeschriebene Veröffentlichungsspezifikation. Die genaue Oberfläche, der Standard-Feed, das Anzeigenmodell, die AI-Funktionen und der RPC-Marktplatz können sich ändern, während das Protokoll und die ersten Apps reifen.

## Was der Client beweisen sollte

Der Client sollte beweisen, dass ein profilbasiertes soziales Netzwerk vermeiden kann, zu einer verwahrenden Plattform zu werden:

- Nutzer können ihre Identitäten und Profile besitzen
- Communities und Profilknoten können peer-to-peer bleiben
- Communities können Netzwerkeffekte über Bitsocial-Clients hinweg tragen
- RPC-Anbieter können den Client bequem nutzbar machen, ohne die Verwahrung zu übernehmen
- Feed-Algorithmen können optionale Dienste statt von der Plattform vorgegebener Regeln sein
- andere Clients können weiterhin um dasselbe Netzwerk konkurrieren

Ziel ist es, den stärksten möglichen Client für öffentliche Gespräche zu bauen und zu zeigen, wie weit das Protokoll reichen kann.

## Im Zweck vertraut, im Design austauschbar

Das Standarderlebnis sollte mit dem Kern von Twitter/X konkurrieren: ein schneller Startseiten-Feed, Textbeiträge, Follows, Antworten, Verbreitung über Reposts, Communities, Benachrichtigungen, Suche und eine gerankte For You-Ansicht, die sofort funktioniert.

Bitsocial Forge kann den ersten Standard-RPC und Feed-Dienst betreiben. Dieser Standard kann einen gerankten Feed und Anzeigen enthalten, damit sich der Client vom ersten Tag an vollständig anfühlt, anstatt von gewöhnlichen Nutzern zu verlangen, den gesamten Stack selbst zusammenzustellen.

Der Unterschied ist, dass der Standard nicht zum Gefängnis werden darf. Nutzer sollten RPCs, Feeds, Instanzen, Ranking-Systeme, Anzeigen und Discovery-Anbieter wechseln oder das Ranking vollständig entfernen können. Der Client kann beim ersten Start klare Vorgaben machen und dennoch jeden wichtigen Dienst austauschbar halten.

Dadurch lässt sich der Client stärker anpassen als eine herkömmliche Plattform. Ein Nutzer könnte beim gerankten Standard-Feed mit Anzeigen bleiben. Ein anderer könnte einen chronologischen Feed ohne Ranking nutzen. Ein weiterer könnte einen datenschutzorientierten RPC, einen von der Community betriebenen Discovery-Dienst, einen kostenpflichtigen werbefreien Feed oder einen Nischenalgorithmus für eine bestimmte Subkultur wählen.

## Clientübergreifende Communities

Communities sollten wesentlich wichtiger sein als isolierte Gruppen innerhalb einer einzelnen App.

Auf X/Twitter sind Communities auf X beschränkt. Sie können nützlich sein, erben aber die Grenzen einer Plattform, eines Kontosystems, eines Empfehlungs-Stacks und einer Produktoberfläche.

Eine Bitsocial-Community kann über verschiedene Clients erstellt, gehostet, entdeckt und genutzt werden. Der Phase-3-Client kann dadurch Communities und Beiträge aus dem weiteren Bitsocial-Netzwerk anzeigen, nicht nur von Nutzern, die in diesem Client begonnen haben. Eine Community könnte gleichzeitig Aktivitäten aus einem Imageboard-Client, einem Diskussionsclient im Reddit-Stil, einem spezialisierten Forum-Client, einer mobilen App und dem Phase-3-Client enthalten.

Das ist der entscheidende Netzwerkeffekt: Ein Client kann sich für gewöhnliche Nutzer vertraut anfühlen und zugleich aus vielen Clients, Community-Knoten, RPC-Anbietern und unabhängigen Diensten Nutzen ziehen.

## Optionale Feed-Algorithmen

Der Phase-3-Client sollte nicht allen ein einziges globales Ranking-System aufzwingen.

Feed-Algorithmen sollten aktiv gewählt werden. Nutzer könnten einen Algorithmus auf einem Marktplatz auswählen, den Anbieter wechseln, den Algorithmus eines Unternehmens, eines anonymen Betreibers oder einer Community verwenden, einen eigenen betreiben oder ganz auf einen Algorithmus verzichten.

Öffentliche RPC-Anbieter sind ein natürlicher Wettbewerbsort für diese Dienste. Sie können Inhalte indexieren, ranken und empfehlen, sollten aber weder den Nutzer noch das Profil besitzen.

Diese Dienste können auch bei der Form des Clients selbst konkurrieren. Ein RPC könnte einen gerankten Feed mit Anzeigen bereitstellen. Ein anderer könnte einen ungerankten chronologischen Feed anbieten. Ein weiterer könnte sich auf Datenschutz, Übersetzung, Moderation, Community-Discovery oder einen sozialen Nischengraphen spezialisieren.

Wenn das wirtschaftliche Modell funktioniert, könnten RPC-gestützte Feed-Dienste AI-Funktionen hinzufügen, die den Funktionen ähneln, welche etablierte Plattformen in ihre Feeds integrieren wollen: automatische Übersetzungen, Zusammenfassungen, botgestützte Antworten, Suchantworten, Moderationshilfe oder Kontext nach Art von Community Notes.

Diese Funktionen sollten wählbare Dienste und keine Protokollanforderungen sein. Ein Standard-RPC kann mit einem reichhaltigeren Feed konkurrieren, aber Nutzer und konkurrierende Clients sollten weiterhin einfachere, private, chronologische, werbefreie oder communityspezifische Alternativen wählen können.

## Nicht verwahrender RPC

Jeder Nutzer sollte über RPC als vollständiger Peer-to-Peer-Knoten teilnehmen können, ohne dem RPC-Anbieter das Eigentum an seiner Identität oder seinem Profil zu übertragen.

Der gehostete Weg ist wichtig, weil die meisten Nutzer nicht damit beginnen werden, einen Server zu betreiben. Der Ausstieg ist ebenso wichtig: Nutzer sollten jederzeit auf einen eigenen Profilknoten mit einfacher Hardware, einschließlich eines Raspberry Pi, wechseln können.

Das ist der Unterschied zwischen Bequemlichkeit und Verwahrung.

## Öffentliche Gespräche, gestärkt durch Bitsocial Chain

Bitsocial Chain kann dauerhafte Namen, Zahlungen, Trinkgelder, Auszeichnungen und weitere finanzielle Möglichkeiten direkt in öffentliche Gespräche bringen.

Der Phase-3-Client bleibt auf Beiträge, Text, Ideenaustausch und Diskussionen in Echtzeit ausgerichtet und teilt zugleich Communities und Netzwerkeffekte mit anderen Bitsocial-Clients.
