---
title: Bitsocial und Lapis Net
description: Wie sich Lapis Net, ein soziales Peer-to-Peer-Protokoll in Kotlin mit Vertrauenswerten pro Betrachter und durch Bitcoin gestützter Sichtbarkeit, von Bitsocial unterscheidet.
---

# Bitsocial und Lapis Net

[Lapis Net](https://net.lapisproject.dev/) ist ein Peer-to-Peer-Protokoll für soziale Netzwerke,
geschrieben in Kotlin für die JVM. Es ist unabhängig zu ähnlichen Grundlagen wie Bitsocial gelangt:
Identitäten als Schlüsselpaare, Inhaltsspeicherung im Stil von IPFS und libp2p-Gossipsub. Die beiden
unterscheiden sich darin, wo sie Spam-Filterung und Kuration ansiedeln. Lapis gibt jedem Betrachter
einen persönlichen Vertrauensgraphen und lässt Bitcoin- und Lightning-Zahlungen die Sichtbarkeit
erhöhen; Bitsocial lässt jede Community entscheiden, was veröffentlicht werden darf.

Lapis ist ein funktionierender Prototyp. Laut seinem
[Repository](https://github.com/lapisproject-dev/Lapis-Net) gab es im Oktober 2026 noch kein
öffentliches Netzwerk, und zwei Nodes miteinander zu verbinden war ein manueller Schritt.

## Wie Lapis funktioniert

- **Identitäten.** Jede Identität ist ein secp256k1-Schlüsselpaar, kompatibel mit
  Bitcoin-Schlüsseln, an das ein Ed25519-Schlüssel für die libp2p-Peer-ID gebunden ist.
- **Speicherung und Verbreitung.** Inhalte werden mit Nabu gespeichert, einer IPFS-Implementierung
  auf libp2p (DHT und Bitswap), und mit libp2p-Gossipsub verbreitet.
- **Bewertung.** Vier optionale Werte setzen auf einem Kern auf, der sich bei der Kuration neutral
  verhält:
  - Veritas, ein Web of Trust, berechnet aus dem eigenen Vertrauensgraphen jedes Betrachters
  - Virtus, Sichtbarkeit, die durch On-Chain- oder Lightning-Zahlungsnachweise gestützt wird, deren
    Wirkung mit der Zeit nachlässt
  - Karma, kostenlose Likes, gewichtet nach Veritas
  - Madli, ein Reputationswert, den Nodes über das Verhalten der jeweils anderen führen
- **Messaging.** Ende-zu-Ende-verschlüsselte Direktnachrichten, Sprachanrufe zwischen zwei Personen
  und ein E-Mail-ähnliches asynchrones Nachrichtensystem gehören zum Projekt.
- **Clients.** Jeder Nutzer betreibt einen JVM-Node. Der Referenz-Client ist eine Weboberfläche, die
  dieser lokale Node ausliefert.

## Wo sie sich unterscheiden

### Wer Spam filtert

Lapis filtert beim Betrachter. Inhalte verbreiten sich, dann entscheiden der Vertrauensgraph jedes
Betrachters und die Zahlungsregeln der genutzten App, was sichtbar wird. Bitsocial filtert bei der
Community: Ein Beitrag muss die Challenge der Community bestehen, bevor der Community-Node ihn
annimmt, sodass abgelehnter Spam nie Teil der Community wird. Siehe
[Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Wer die Macht hat

Bei Lapis entscheidet jeder Betrachter, wem er vertraut, und der Betreiber jeder App entscheidet,
wie bezahlte Sichtbarkeit dort funktioniert. Bei Bitsocial legt ein Community-Eigentümer die Regeln
für diese eine Community fest, und Apps entscheiden, was sie anzeigen. Keines der beiden Systeme hat
einen Administrator auf Protokollebene.

### Ökonomie

Lapis baut Bitcoin- und Lightning-Zahlungsnachweise in seinen Sichtbarkeitswert ein. Bitsocial hat
keine Zahlungsschicht im Protokoll; eine Community kann über ihre Challenge eine Zahlung oder einen
Token verlangen.

### Browser

Bitsocial-Apps können einen Peer-to-Peer-Node in einem normalen Browser-Tab betreiben. Siehe
[Browser-Peer-to-Peer](/browser-p2p/). Die Browser-Oberfläche von Lapis ist eine lokale Seite, die
der JVM-Node des Nutzers ausliefert.

### Umfang

Lapis bündelt Direktnachrichten, Sprachanrufe und Mail. Bitsocial konzentriert sich auf öffentliche
Communities und hat noch keine nativen Direktnachrichten.

## Vergleich

| Frage                  | Lapis Net                                                                                        | Bitsocial                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Kategorie              | Soziales Peer-to-Peer-Protokoll (Prototyp)                                                       | Peer-to-Peer-Community-Netzwerk                                                                    |
| Identität              | secp256k1-Schlüsselpaar mit gebundener Ed25519-Peer-ID                                           | Ed25519-Schlüsselpaare für Nutzer und Communities                                                  |
| Wo Beiträge liegen     | Nabu-Speicher (IPFS auf libp2p) auf teilnehmenden Nodes                                          | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                         |
| Communities            | Kein Community-Objekt; Kuration erfolgt pro Betrachter und pro App                               | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                      |
| Spam-Abwehr            | Vertrauensgraph des Betrachters, bezahlte Sichtbarkeit, Lightning-Einlagen für erste Nachrichten | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                          |
| Moderation             | Vertrauensgraph jedes Betrachters; App-Betreiber legen Regeln für bezahlte Sichtbarkeit fest     | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                 |
| Ökonomie               | Bitcoin- und Lightning-Zahlungsnachweise in der Bewertung                                        | Keine im Protokoll; eine Challenge kann eine Zahlung oder einen Token verlangen                    |
| Browser                | Lokale Weboberfläche, von einem JVM-Node ausgeliefert                                            | Peer-to-Peer-Node in einem normalen Browser-Tab                                                    |
| Netzwerk               | Prototyp ohne öffentliches Netzwerk                                                              | Live-Netzwerk mit Apps wie [5chan](/apps/5chan/) und [Seedit](/apps/seedit/)                       |
| Wichtigster Kompromiss | Umfangreiche eingebaute Reputation und Messaging, aber noch kein öffentliches Netzwerk           | Kleinerer Kern, der im Browser läuft, aber keine eingebaute Reputation und keine Direktnachrichten |

## Könnten sie zusammenarbeiten?

Bitsocial-Challenges sind beliebiger Code, also könnte ein Vertrauenswert im Stil von Lapis zu einer
Challenge werden. Die eingebaute Challenge `whitelist` kann bereits Listen erlaubter Adressen von
URLs lesen. Ein Dienst, der die Bitsocial-Adressen veröffentlicht, denen ein Veritas-Graph vertraut,
könnte diesen Autoren erlauben, in einer Community ein CAPTCHA zu überspringen. Dafür bräuchte es
eine Möglichkeit, eine Lapis-Identität mit einer Bitsocial-Adresse zu verknüpfen, und so etwas gibt
es heute nicht.
