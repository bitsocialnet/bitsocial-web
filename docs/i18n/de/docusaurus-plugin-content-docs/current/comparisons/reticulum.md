---
title: Bitsocial und Reticulum
description: Wie sich Reticulum, der kryptografische Netzwerk-Stack für LoRa und andere Verbindungen mit geringer Bandbreite, von Bitsocial unterscheidet und ob Bitsocial darüber laufen könnte.
---

# Bitsocial und Reticulum

[Reticulum](https://reticulum.network/) ist ein kryptografiebasierter Netzwerk-Stack, mit dem sich
Netze über jeden verfügbaren Träger aufbauen lassen: LoRa-Funk, Packet Radio, serielle Verbindungen,
WLAN, Ethernet, TCP, UDP oder I2P. Er wird oft im selben Atemzug wie Bitsocial genannt, weil beide
das Unternehmen in der Mitte überflüssig machen. Sie tun das allerdings auf unterschiedlichen
Schichten und ergänzen sich daher, statt miteinander zu konkurrieren.

## Unterschiedliche Schichten

Reticulum ersetzt die Netzwerkschicht. Es stellt Anwendungen verschlüsselte, routbare Endpunkte ohne
IP-Adressen, DNS, Zertifizierungsstellen oder Konten bereit und ist darauf ausgelegt, selbst auf
Verbindungen mit nur 5 Bit pro Sekunde und einer MTU von 500 Byte weiterzufunktionieren. Beiträge,
Communities oder Moderation definiert es nicht; das ergänzen die Anwendungen, die darauf aufbauen.

Bitsocial ist ein soziales Protokoll. Es läuft auf dem IPFS/libp2p-Stack über gewöhnliche
Internetverbindungen, auch direkt aus einem Browser-Tab, und definiert Communities, Publikationen
und Anti-Spam-Challenges pro Community. Siehe [Peer-to-Peer-Protokoll](/peer-to-peer-protocol/) und
[Browser-Peer-to-Peer](/browser-p2p/).

Im Stack von Bitsocial säße Reticulum ungefähr dort, wo libp2p sitzt, und nicht dort, wo das
Bitsocial-Protokoll sitzt.

## Wie Reticulum funktioniert

- **Identitäten.** Eine Reticulum-Identität ist ein 512-Bit-Schlüsselsatz: ein X25519-Schlüssel für
  die Verschlüsselung und ein Ed25519-Schlüssel für Signaturen.
- **Ziele (Destinations).** Anwendungen legen Ziele an, die über einen auf 16 Byte gekürzten
  SHA-256-Hash adressiert werden. Pakete tragen keine Absenderadresse.
- **Announces.** Ein Ziel wird erreichbar, indem es ein Announce aussendet. Transportknoten leiten
  es weiter und merken sich den nächsten Hop zurück, sodass kein Knoten eine Karte des gesamten
  Netzes braucht.
- **Verschlüsselung.** Der Datenverkehr ist standardmäßig verschlüsselt, mit kurzlebigen Schlüsseln
  und Forward Secrecy.
- **LXMF.** Die Messaging-Schicht [LXMF](https://github.com/markqvist/LXMF) ergänzt signierte
  Nachrichten, direkte Zustellung sowie Store-and-Forward über Propagation-Knoten für Empfänger, die
  gerade offline sind.

Zu den so gebauten Anwendungen gehören [Sideband](https://github.com/markqvist/Sideband) für
Messaging und [Nomad Network](https://github.com/markqvist/NomadNet) für Messaging und gehostete
Seiten. Das Reticulum-Handbuch führt eine
[Liste von Programmen](https://reticulum.network/manual/software.html).

## Vergleich

| Frage              | Reticulum                                                                                                        | Bitsocial                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Was es ist         | Netzwerk-Stack                                                                                                   | Soziales Peer-to-Peer-Protokoll und Apps                                                                        |
| Ausgelegt für      | Jeden Träger, bis hin zu langsamen Funkverbindungen                                                              | Internetverbindungen, auch Browser-Tabs                                                                         |
| Identität          | Schlüsselsatz aus X25519 und Ed25519                                                                             | Ed25519-Schlüsselpaare für Nutzer und Communities                                                               |
| Adressen           | Hash aus einer Identität und einem Anwendungsnamen                                                               | Hash des öffentlichen Schlüssels einer Community                                                                |
| Peers finden       | Announces, die Transportknoten verbreiten                                                                        | HTTP-Router liefern Provider-Peers                                                                              |
| Soziale Funktionen | Werden von Anwendungen wie Nomad Network ergänzt                                                                 | Communities, Beiträge, Antworten und Moderation im Protokoll                                                    |
| Spam-Abwehr        | Announce-Ratenlimits pro Schnittstelle; LXMF-Proof-of-Work-Stempel, die ein Empfänger oder Knoten verlangen kann | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                       |
| Offline-Zustellung | LXMF-Propagation-Knoten speichern Nachrichten und leiten sie weiter                                              | Peers liefern weiterhin den neuesten Stand einer Community aus; zum Veröffentlichen muss ihr Knoten online sein |

## Könnte Bitsocial über Reticulum laufen?

Derzeit nicht. Bitsocial hat keinen Reticulum-Transport, und sein Datenmodell setzt
Internetbandbreite voraus: Ein Client ruft Community-Metadaten und Beitragsinhalte von Peers ab und
tauscht Pubsub-Nachrichten aus. Das passt schlecht zu Verbindungen, die auf 500-Byte-Pakete und einen
Durchsatz von einigen Bit oder Kilobit pro Sekunde ausgelegt sind.

Realistisch ist ein schmalerer Weg: ein Client, der ohne Internetverbindung über ein lokales Mesh
funktioniert und sich mit dem übrigen Bitsocial-Netzwerk synchronisiert, sobald ein Peer oder
Gateway mit Internetzugang erreichbar ist. Das wäre ein neuer Client samt Brücke, keine Änderung am
Protokoll, und es steht nicht auf der aktuellen Roadmap.

## Für Entwickler

Reticulum wird unter der
[Reticulum-Lizenz](https://reticulum.network/manual/license.html) veröffentlicht: MIT-artige
Bedingungen plus zwei Einschränkungen. Die Software darf weder in Systemen eingesetzt werden, die
darauf ausgelegt sind, Menschen zu schaden, noch zur Erstellung von Trainingsdatensätzen für KI oder
maschinelles Lernen. Lesen Sie die Lizenz, bevor Sie Reticulum-Code in eine Bitsocial-App einbinden.

Die Referenzimplementierung ist [in Python geschrieben](https://github.com/markqvist/Reticulum). Die
Reticulum-Maintainer warnen, dass mehrere inoffizielle Portierungen von Reticulum und LXMF maschinell
erzeugt sind und Lizenzansprüche erheben, die sie für nichtig halten. Greifen Sie daher besser zur
Referenzimplementierung oder zu den im Handbuch aufgeführten Programmen.
