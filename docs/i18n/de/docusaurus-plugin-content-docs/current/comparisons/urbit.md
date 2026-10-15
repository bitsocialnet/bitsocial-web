---
title: Bitsocial und Urbit
description: Wie sich Urbit, ein Netzwerk persönlicher Server mit Ethereum-basierten Urbit IDs und vom Host betriebenen Gruppen in Tlon Messenger, von den Peer-to-Peer-Communities von Bitsocial unterscheidet.
---

# Bitsocial und Urbit

[Urbit](https://urbit.org/) ist ein Netzwerk persönlicher Server. Jeder Nutzer hat einen ständig
laufenden Computer, ein sogenanntes Schiff (Ship), auf dem Urbits eigenes Betriebssystem (Arvo)
läuft, geschrieben in eigenen Sprachen (Nock und Hoon), und das über eine Urbit ID identifiziert
wird. Die wichtigste soziale App ist [Tlon Messenger](https://tlon.io/), entwickelt von Tlon, dem
Unternehmen, das 2013 gegründet wurde, um Urbit zu entwickeln.

Urbit will den gesamten Computing-Stack ersetzen und ist damit ein weit umfassenderes Projekt als
Bitsocial. Seine soziale Schicht folgt jedoch einem Modell, das dem von Bitsocial nahekommt: Eine
Community lebt auf dem Node ihres Eigentümers, und dieser Node entscheidet, was hineinkommt. Die
beiden unterscheiden sich darin, wer einen Server betreiben muss und wie Spam ferngehalten wird.

## Wie Urbit funktioniert

- **Urbit IDs.** Jedes Schiff hat eine Urbit ID: eine Zahl, die als aussprechbarer Name wie
  `~sampel-palnet` dargestellt wird. Layer-1-IDs sind NFTs, deren Eigentumsverhältnisse und
  öffentliche Netzwerkschlüssel in den Azimuth-Contracts auf Ethereum verzeichnet sind. Layer-2-IDs,
  die 2021 eingeführt wurden, um Gebühren zu senken, nutzen einen „naive rollup“: Ihre Transaktionen
  werden gebündelt auf Ethereum veröffentlicht, ihre Eigentumsverhältnisse werden aber nicht im
  Azimuth-Contract gespeichert, und jedes Schiff berechnet sie lokal. Tlon betreibt einen Roller,
  den die Öffentlichkeit kostenlos nutzen kann, laut der
  [Urbit-ID-Dokumentation](https://docs.urbit.org/urbit-id/what-is-urbit-id) und
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Eine feste Hierarchie.** Der Adressraum umfasst 256 Galaxien, 65.536 Sterne und rund 4
  Milliarden Planeten für den Alltagsgebrauch. Galaxien geben Sterne aus, Sterne geben Planeten aus,
  und jeder Planet kann Monde für seine eigenen Geräte ausgeben. Kometen sind kostenlose IDs, die
  ein Schiff für sich selbst erzeugt und die nie die Blockchain berühren. Die Eigentümer der
  Galaxien bilden den Galactic Senate, der über Upgrades der Azimuth-Contracts abstimmt und den
  Vorstand der Urbit Foundation wählt.
- **Netzwerk.** Schiffe tauschen verschlüsselte Pakete Peer-to-Peer aus. Seit Juli 2026 ist das
  Netzwerkprotokoll [Directed Messaging](https://urbit.org/blog/directed-messaging), eine
  inhaltszentrierte Neufassung des älteren Ames-Protokolls. Galaxien übernehmen die Peer-Discovery:
  Jede verfolgt, wo sich die Schiffe unter ihr befinden, und leitet Pakete an sie weiter, bis die
  beiden Schiffe einander direkt erreichen können, oder so lange, wie eine Firewall das verhindert,
  laut dem [Directed-Messaging-Paper](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Gruppen.** In Tlon Messenger wird eine Gruppe vom Schiff ihres Erstellers gehostet. Mitglieder
  senden Nachrichten an den Host, der sie an das Schiff jedes Mitglieds verteilt, und das Schiff
  jedes Mitglieds behält eine eigene Kopie, laut der [Tlon-FAQ](https://tlon.io/posts/faq). Der Host
  kontrolliert Rollen, Kanäle und die Aufnahme. Eine Gruppe kann öffentlich, privat oder geheim
  sein, und sie kann
  [einzelne Schiffe oder ganze ID-Ränge sperren](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanäle sind Chats, Notizbücher oder Sammlungen von Bildern und Links.
- **Hosting.** Wer sich bei Tlon registriert, erhält ein Schiff, das Tlon betreibt, mit Schlüsseln,
  die Tlon in Verwahrung hält. Ein Nutzer kann das Schiff samt seinem Master Ticket exportieren und
  anderswo betreiben: auf einem Gerät von [Native Planet](https://www.nativeplanet.io/) oder mit der
  Vere-Runtime unter Linux, macOS oder Windows. Schiffe können große Dateien noch nicht direkt
  speichern, daher legt Tlon Messenger Bilder und andere Medien in S3-kompatiblem Cloud-Speicher ab.

## Wo sie sich unterscheiden

### Wer einen Server betreiben muss

Bei Urbit ist jeder Teilnehmer ein Server. Die Apps von Tlon sind Frontends für das eigene Schiff
des Nutzers, und selbst das Lesen einer Gruppe läuft darüber. Wer selbst kein Schiff betreibt,
mietet eines, und damit kommt wieder ein Hosting-Anbieter ins Spiel: Tlon hält die Schlüssel
gehosteter Nutzer und behält sich einen begrenzten Zugang für Wartungszwecke vor, auch wenn Nutzer
mit ihrem gesamten Schiff weiterziehen können.

Bei Bitsocial brauchen nur Community-Eigentümer einen ständig laufenden Node. Wer liest und postet,
kann einen Peer-to-Peer-Node in einem Browser-Tab betreiben, und das Konto ist ein Schlüsselpaar,
das die App verwahrt. Siehe [Browser-Peer-to-Peer](/browser-p2p/). Nutzt jemand doch einen
gehosteten Node, soll das Design von Bitsocial es ermöglichen, die Erreichbarkeit zu delegieren,
ohne die Verwahrung der Identität abzugeben. Siehe
[Identität und Eigentum an Communities](/identity-and-ownership/).

### Der Community-Host

Hier stehen sich die beiden am nächsten. Eine Tlon-Gruppe und eine Bitsocial-Community leben beide
auf dem Node ihres Eigentümers. Der Host entscheidet, wer posten darf, wendet die Moderation an und
verteilt das Ergebnis, und keines der beiden Protokolle stellt einen Moderator über den Host. In
beiden Fällen muss der Host online sein. Laut der FAQ von Tlon gilt: Geht der Host offline, „geht
die Gruppe mit ihm unter“, und eine Bitsocial-Community kann keine neuen Beiträge annehmen, solange
ihr Node offline ist.

Inhalte speichern sie unterschiedlich. Das Schiff jedes Mitglieds behält eine Kopie des
Gruppenverlaufs, sodass Mitglieder weiterhin lesen können, was sie bereits erhalten haben, während
der Host ausgefallen ist. Ein Bitsocial-Leser holt den neuesten Stand der Community vom Node der
Community oder von Peers, die sie seeden; eine Community, deren Node offline ist, bleibt also
lesbar, solange Peers sie haben, aber das Netzwerk bewahrt nur den neuesten Stand.

Eine Tlon-Gruppe hat außerdem eine Mitgliederliste, und ihr Host kann die Gruppe auf Einladungen
beschränken. Eine Bitsocial-Community hat keine Mitgliedschaft: Jeder kann sie lesen, und jeder kann
versuchen zu posten, vorbehaltlich ihrer Challenge.

### Spam und Identität

Urbit bekämpft Spam, indem es Identität knapp macht. Die Zahl der Planeten ist fest, und jeder
einzelne wird von einem Stern ausgegeben. Kostenlose Kometen umgehen diese Knappheit, deshalb weisen
Gruppen, in denen die Knappheit greifen soll, Kometen ab: Die Urbit-Dokumentation merkt an, dass
manche Gruppen Kometen ablehnen, und eine Tlon-Gruppe kann den gesamten Kometen-Rang mit einer
einzigen Einstellung sperren. Sobald Kometen ausgeschlossen sind, braucht ein gesperrter Nutzer
einen anderen Planeten vom Eigentümer eines Sterns, um zurückzukehren. Auch Reputation kann der
Hierarchie folgen: Azimuth enthält einen Censures-Contract, mit dem Galaxien und Sterne IDs
markieren können. Weil die Knappheit in den Adressraum eingebaut ist, wirkt sie in jeder Gruppe, die
Kometen abweist, auf dieselbe Weise.

Bitsocial-Identitäten sind kostenlose Schlüsselpaare. Jede Community wählt ihre eigene Challenge,
bevor sie einen Beitrag annimmt, etwa ein Captcha, eine Zahlung, ein Token-Guthaben oder eine
Allowlist, und andere Communities können sich anders entscheiden. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Blockchain und Governance

Die Identitätsschicht von Urbit hängt von Ethereum ab. Die Azimuth-Contracts verzeichnen
Eigentumsverhältnisse und Netzwerkschlüssel auf Layer 1, Layer-2-Transaktionen werden gebündelt auf
Ethereum veröffentlicht, und der Galactic Senate kann den Contract upgraden, der Azimuth steuert.
Dieselben 256 Galaxien übernehmen auch Peer-Discovery und Weiterleitung, sodass eine feste Menge von
Identitäten sowohl die Governance als auch einen Teil des Routings im Netzwerk trägt.

Bitsocial-Identitäten sind Schlüsselpaare, die keine Registrierung brauchen. `.bso`- und
`.eth`-Namen sind optionale Aliasse, die zu ihnen auflösen. Die Peer-Discovery läuft über
HTTP-Router, die nur Provider-Adressen zurückgeben; jeder kann einen betreiben, und Clients können
den Router wechseln, indem sie ihre Konfiguration ändern.

### Umfang

Urbit ist ein Allzweckcomputer. Ein Schiff kann ein Git-Remote, eine persönliche Wissensdatenbank
oder KI-Agenten hosten, und Tlon Messenger ist ein Programm unter vielen. Für Urbit zu entwickeln
heißt meist, Hoon-Apps für Arvo zu schreiben. Bitsocial ist ein Protokoll für öffentliche
Communities, mit Apps wie [5chan](/apps/5chan/) und [Seedit](/apps/seedit/). Es läuft auf dem
bestehenden Stack (libp2p, IPFS und dem Browser), statt ihn zu ersetzen, und seine Clients werden
mit gewöhnlichen Web-Werkzeugen gebaut. Siehe
[Erstellen Sie Ihren eigenen Client](/build-your-own-client/).

### Private Nachrichten

Hier ist Urbit stärker. Direktnachrichten gehen von einem Schiff direkt zum anderen, der gesamte
Datenverkehr zwischen Schiffen ist verschlüsselt, und Gruppen können privat oder geheim sein. Tlon
weist darauf hin, dass Nachrichten bei der Übertragung verschlüsselt, auf dem Schiff aber
unverschlüsselt gespeichert werden. Bitsocial konzentriert sich auf öffentliche Communities und hat
noch keine nativen Direktnachrichten.

## Projektstatus

Urbit hat Umbrüche hinter sich. Im August 2024 entließ die Urbit Foundation, die gemeinnützige
Organisation, die die Kernentwicklung steuert, ihren Geschäftsführer; Gründer Curtis Yarvin kehrte
zurück, um ohne formellen Titel die Strategie zu leiten, mehrere Kernentwickler gingen, und die
finanziellen Reserven der Foundation reichten nur noch für Monate,
[berichtete CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin schlug vor, Azimuth auf ein bestehendes Ethereum-Layer-2 zu verlegen, wahrscheinlich Base,
und fungible „Visa“-Tokens auszugeben, die sich in Planeten umwandeln lassen. Stand Oktober 2026
beschreibt Urbits [ID-Dokumentation](https://docs.urbit.org/urbit-id/what-is-urbit-id) weiterhin
Azimuth auf Ethereum mit seinem naive rollup. Im Oktober 2025 ersetzte der Galactic Senate den
Vorstand der Foundation, und der neue Vorstand ernannte einen neuen Geschäftsführer
([Ankündigung](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

Die Entwicklung geht weiter. Directed Messaging ging mit dem Release 408k am 14. Juli 2026 live. Im
Juni 2026 hat Tlon Messenger
[die öffentliche Registrierung ohne Warteliste geöffnet](https://urbit.org/blog/this-month-in-urbit-june-2026),
und Tlon präsentiert sich inzwischen als Ort, an dem Menschen und KI-Agenten zusammenarbeiten.

## Vergleich

| Frage                     | Urbit                                                                                                             | Bitsocial                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Kategorie                 | Netzwerk persönlicher Server und Betriebssystem                                                                   | Peer-to-Peer-Community-Netzwerk                                                                                        |
| Identität                 | Urbit IDs: rund 4 Milliarden Planeten auf Ethereum oder dessen Layer-2-Rollup, plus kostenlose Kometen            | Ed25519-Schlüsselpaare für Nutzer und Communities                                                                      |
| Wer einen Server betreibt | Jeder Nutzer, auf dem eigenen Schiff oder einem gehosteten                                                        | Community-Eigentümer; wer liest und postet, kann einen Browser-Tab nutzen                                              |
| Wo Beiträge liegen        | Das Schiff des Gruppen-Hosts und eine Kopie auf dem Schiff jedes Mitglieds                                        | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                                             |
| Communities               | Gruppen, gehostet vom Schiff ihres Erstellers, mit Mitgliederlisten                                               | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                                          |
| Spam-Abwehr               | Knappe IDs, von Sternen ausgegeben; Gruppen sperren Schiffe oder ganze Ränge                                      | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                              |
| Moderation                | Rollen und Sperren des Gruppen-Hosts                                                                              | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                                     |
| Peer-Discovery            | Galaxien verfolgen die Schiffe unter ihnen und leiten für sie weiter                                              | HTTP-Router liefern Provider-Peers und speichern keine Inhalte                                                         |
| Governance                | Der Galactic Senate aus 256 Galaxien stimmt über Azimuth-Upgrades ab                                              | Keine Autorität auf Protokollebene über Identitäten oder Communities                                                   |
| Private Nachrichten       | Verschlüsselte Direktnachrichten und Gruppen nur auf Einladung                                                    | Öffentliche Communities; noch keine nativen Direktnachrichten                                                          |
| Wichtigster Kompromiss    | Ein kompletter persönlicher Computer mit privaten Gruppen, aber jeder Nutzer braucht ein ständig laufendes Schiff | Kostenlose Identitäten und Zugang per Browser, aber keine privaten Nachrichten, und nur der neueste Stand wird bewahrt |
