---
title: Bitsocial und Quorum
description: Wie sich Quorum, der Ende-zu-Ende-verschlüsselte Gruppen-Messenger von Quilibrium mit Spaces im Stil von Discord, von den öffentlichen Peer-to-Peer-Communities von Bitsocial unterscheidet.
---

# Bitsocial und Quorum

[Quorum](https://www.quorummessenger.com/) ist ein Gruppen-Messenger von Quilibrium Inc., dem
Unternehmen hinter dem Netzwerk [Quilibrium](https://quilibrium.com/). Er ist wie Discord aufgebaut, mit
Spaces, Kanälen, Rollen und Direktnachrichten, und seine Nachrichten sind
Ende-zu-Ende-verschlüsselt. Er wird neben Bitsocial genannt, weil sich beide als Peer-to-Peer und
zensurresistent beschreiben, mit Gruppen, die ihre eigenen Regeln festlegen. Sie verfolgen
unterschiedliche Ziele: Quorum privaten Gruppenchat, Bitsocial öffentliche Communities, die jeder
lesen kann.

Quilibrium beschreibt sich als dezentrale Alternative zu Cloud-Plattformen: ein Netzwerk von Nodes,
die Daten in einem verschlüsselten Hypergraphen speichern und sich über einen Konsens, den es Proof
of Meaningful Work nennt, auf deren Zustand einigen. Nodes verdienen QUIL, den Token des Netzwerks,
mit dem Nutzungsgebühren bezahlt werden. Quorum begann 2018 als Howler, als Idee für eine private
Discord-Alternative, und wurde laut der
[Geschichte von Quilibrium](https://docs.quilibrium.com/docs/discover/q-story/) die erste App, die
auf Quilibrium live ging. Quilibrium Inc., gegründet von Cassie Heart, entwickelt das Protokoll und
bietet Quorum als einen ihrer Managed Services an
([FAQ](https://docs.quilibrium.com/docs/discover/FAQ/)).

## Wie Quorum funktioniert

Die folgenden Angaben stammen aus dem Quellcode der Quorum-Clients,
[quorum-desktop](https://github.com/QuilibriumNetwork/quorum-desktop) für die Web- und Desktop-Apps
und [quorum-mobile](https://github.com/QuilibriumNetwork/quorum-mobile), Stand Oktober 2026.

- **Identitäten.** Die Master-Identität eines Nutzers ist ein Ed448-Schlüsselsatz, und jedes Gerät
  erhält eigene X448- und Ed448-Schlüssel. Im Browser sind die Schlüssel normalerweise durch einen
  Passkey geschützt; die Mobil-App leitet sie aus einer Wiederherstellungsphrase ab. Adressen sind
  Hashes, die mit `Qm` beginnen, und Nutzer können einen Benutzernamen aus dem Namensdienst von
  Quilibrium anzeigen.
- **Verschlüsselung.** Direktnachrichten nutzen zwischen Geräten den Double Ratchet. Ein Space teilt
  eine einzige Triple-Ratchet-Sitzung unter seinen Mitgliedern, die ihre Nachrichten mit
  Space-spezifischen Schlüsseln signieren. Jeder Space ist verschlüsselt. Laut Quorum verhindert sein
  Message-Brokering, dass Absender und Empfänger miteinander verknüpft werden können, doch der Web-
  und Desktop-Client abonniert alle Posteingänge eines Geräts, einschließlich des in der
  öffentlichen Registrierung des Nutzers aufgeführten, in
  [einer einzigen Anfrage](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/components/context/MessageDB.tsx#L616-L623)
  beim Dienst, der sie daher der Adresse des Nutzers zuordnen kann.
- **Beitreten.** Spaces betritt man über Einladungslinks. Ein Einmal-Link enthält die Schlüssel zum
  Beitreten in der URL; ein öffentlicher Link ruft sie vom Quorum-Dienst ab, und öffentliche Spaces
  können in einem durchsuchbaren Verzeichnis gelistet werden.
- **Transport.** Für Nachrichten verbinden sich die Web-, Desktop- und Mobil-Clients alle über HTTPS
  und einen WebSocket mit einem einzigen Dienst,
  [`api.quorummessenger.com`](https://github.com/QuilibriumNetwork/quorum-desktop/blob/db04b991dfb0f7c9db330bd4f816b08aaa4a6811/src/config/config.quorum.ts#L6-L7).
  Er leitet verschlüsselte Nachrichten an den Posteingang jedes Mitglieds weiter und hält sie vor,
  bis der Client sie bestätigt. Außerdem speichert er Nutzerregistrierungen, freiwillige öffentliche
  Profile, das verschlüsselte Manifest jedes Space (Kanäle, Rollen, Emoji),
  Einladungsmaterial, das öffentliche Verzeichnis und eine optionale verschlüsselte Synchronisierung
  der Einstellungen. Die Node-Software von Quilibrium hat einen Inbox- und Hub-Dienst mit derselben
  Struktur, aber weder die Clients noch die Dokumentation von Quilibrium sagen, wie dieser Dienst
  auf das Netzwerk abgebildet wird.
- **Verlauf.** Der Client jedes Mitglieds speichert eine eigene Kopie des Space im lokalen Speicher,
  und beide Clients holen Nachrichten, die gesendet wurden, während sie offline waren, aus ihren
  Posteingängen beim Dienst ab. Für älteren Verlauf bittet der Web- und Desktop-Client ein Mitglied,
  das online ist, um eine Synchronisierung, während der Mobil-Client ein dauerhaftes Log abspielt,
  das der Dienst für jeden Space führt.
- **Moderation.** Rollen erlauben Löschen, Anpinnen, Stummschalten und Erwähnungen mit `@everyone`.
  Der Client jedes Mitglieds prüft die Signatur jeder Moderationsaktion und wendet sie nur an, wenn
  der Unterzeichner die passende Rolle hat. Der Eigentümer kann ein Mitglied hinauswerfen, wodurch
  die Schlüssel des Space rotiert werden, sodass das hinausgeworfene Mitglied neue Nachrichten nicht
  lesen kann. Ein Space kann signierte Nachrichten verlangen oder Mitgliedern erlauben, unsignierte,
  abstreitbare Nachrichten zu posten. Einträge im öffentlichen Verzeichnis tragen einen Prüfstatus,
  und Nutzer können Spaces und, aus der Mobil-App, einzelne Nachrichten an den Quorum-Dienst melden.
- **Code.** Der Web- und Desktop-Client steht unter der AGPL-3.0, der Mobil-Client unter der
  GPL-3.0. Der Mobil-Client enthält außerdem eine Krypto-Wallet, eine Farcaster-Integration und
  Apex, ein kostenpflichtiges Abonnement, das weiter unten beschrieben wird.

## Wo sie sich unterscheiden

### Private Gruppen und öffentliche Communities

Ein Quorum-Space ist eine Gruppe von Mitgliedern: Nur wer seine Schlüssel besitzt, kann ihn lesen,
und zum Beitreten braucht man einen Einladungslink. Ein öffentlicher Link lässt jeden herein, aber
erst nach dem Beitritt. Eine Bitsocial-Community hat keine Mitgliedschaft. Jeder kann sie lesen, aus
jeder App, ohne beizutreten, und jeder kann versuchen zu posten, vorbehaltlich der Challenge der
Community.

### Was eine Gruppe online hält

Ein Quorum-Space hat keinen Host-Node. Mitglieder senden Nachrichten über den Quorum-Dienst, der
für jedes Mitglied eine Kopie aufbewahrt, bis dessen Client sie abholt, und der Eigentümer muss
nicht online sein, damit sich die anderen unterhalten können. Eine Bitsocial-Community lebt auf dem
Node ihres Eigentümers; dieser Node nimmt jeden Beitrag an oder lehnt ihn ab und veröffentlicht den
neuesten Stand der Community.
Die Community bleibt lesbar, solange Peers sie seeden, kann aber keine neuen Beiträge annehmen,
solange ihr Node offline ist. Siehe [Peer-to-Peer-Protokoll](/peer-to-peer-protocol/).

### Wer die Regeln durchsetzt

Bei Quorum geschieht die Durchsetzung am Netzwerkrand. Der Client jedes Mitglieds entscheidet anhand
der Rolle des Unterzeichners, ob er eine Löschung, ein Anpinnen oder eine Stummschaltung anwendet,
und ein Rauswurf funktioniert, indem alle anderen auf neue Schlüssel umgestellt werden. Daneben
nimmt der Betreiber des Dienstes Meldungen entgegen und prüft das öffentliche Verzeichnis. Bei
Bitsocial geschieht die Durchsetzung am Community-Node: Ein Beitrag, der die Challenge der
Community nicht besteht, wird nie angenommen, und der Node wendet die Entfernungen seiner
Moderatoren an. Siehe
[Lokale Moderation, keine globalen Sperren](/local-moderation/).

### Spam-Abwehr

Quorum hält Spam vor allem über Einladungen fern. Ein Einmal-Link lässt eine Person herein, ein
öffentlicher Link jeden, der ihn hat, und der Eigentümer kann danach Mitglieder hinauswerfen und die
Schlüssel erneuern. Die Clients begrenzen außerdem, wie schnell ein Mitglied senden kann, und der
Web- und Desktop-Client verwirft Space-Nachrichten von jedem Absender über 10 in 10 Sekunden.
Bitsocial-Identitäten sind kostenlose Schlüsselpaare, deshalb wählt jede Community eine Challenge,
die vor der Annahme eines Beitrags läuft, etwa ein Captcha, eine Zahlung, ein Token-Guthaben oder
eine Allowlist. Siehe [Benutzerdefinierte Anti-Spam-Herausforderungen](/custom-challenges/).

### Der Client und das Netzwerk

Eine Quorum-App ist ein Client des Quorum-Dienstes, den Quilibrium Inc. betreibt. Die Apps treten
selbst keinem Peer-to-Peer-Netzwerk bei, daher hängt der Zugang zu einem Space von diesem einen
Endpunkt ab. Unabhängig davon ist Quilibrium ein eigenes Netzwerk: Im Oktober 2026 zeigte sein
[Explorer](https://dashboard.quilibrium.com/) 114 erreichbare Peers und 181 Prover in 99 Shards.

Eine Bitsocial-Web-App kann einen libp2p-Node im Tab betreiben, Community-Inhalte von Peers abrufen
und über gossipsub veröffentlichen. Die Peer-Discovery läuft über HTTP-Router, die nur
Provider-Adressen zurückgeben; jeder kann einen betreiben, und Clients können den Router wechseln,
indem sie ihre Konfiguration ändern. Siehe [Browser-Peer-to-Peer](/browser-p2p/).

### Ökonomie

Quilibrium hat einen Token im Kern. QUIL wird von Nodes geschürft und bezahlt Netzwerkgebühren, und
eine gewrappte Version, wQUIL, zirkuliert auf Ethereum. Quorum selbst ist kostenlos und verlangt
weder eine Zahlung noch eine Telefonnummer. Das optionale Apex-Abonnement kostet
[5 Dollar im Monat](https://github.com/QuilibriumNetwork/quorum-mobile/blob/e566c40ae7411a3cf088f7b7c5b430d4b6d07226/components/apex/ApexSubscribeModal.tsx#L4-L8),
wird in wQUIL, SNAP oder USDC auf Ethereum bezahlt und zwischen Quilibrium Inc. und vier Spaces
aufgeteilt, die der Abonnent auswählt. Bitsocial hat keine Zahlungsschicht im Protokoll; eine
Community kann über ihre Challenge eine Zahlung oder einen Token verlangen.

### Private Nachrichten

Hier ist Quorum stärker. Direktnachrichten und Space-Nachrichten sind Ende-zu-Ende-verschlüsselt mit
Forward Secrecy, und Nachrichteninhalte erreichen den Quorum-Dienst nur als Chiffretext, außer wenn ein
Mitglied eine Nachricht aus der Mobil-App meldet, die dann deren Inhalt an die Moderatoren von
Quorum sendet. Bitsocial konzentriert sich auf öffentliche Communities und hat noch keine nativen
Direktnachrichten. Ein Bitsocial-Beitrag ist mit dem Schlüssel des Community-Nodes verschlüsselt,
während er über pubsub übertragen wird, aber sobald er angenommen ist, ist er öffentlich.

## Projektstatus

Im Oktober 2026 bezeichnete das Quorum-Repository die Web-App als Beta, und die Quorum-Website
führte die Apps für Google Play und den App Store weiterhin als „demnächst verfügbar“. Auch die
beiden Clients laufen auseinander: Die Mobil-App hat die Funktionen Wallet, Farcaster und Apex,
während der Web- und Desktop-Client seine Seiten Wallet und Farcaster als „demnächst verfügbar“
anzeigt, und beide holen den Space-Verlauf auf unterschiedliche Weise nach.

Das Mainnet von Quilibrium erreichte am 30. September 2025 Version 2.1, als das Netzwerk nach einem
Stillstand wieder anlief ([Ankündigung](https://x.com/QuilibriumInc/status/1973082817236984270)).
2026 wurde der Node in Rust neu geschrieben, mit Post-Quanten-Signaturen für den Konsens und einem
Wire-Protokoll, das ältere Nodes nicht sprechen. Teile der Dokumentation beschreiben das Design
statt des laufenden Codes: Sie beschreiben
[Mixnet-Routing](https://docs.quilibrium.com/docs/learn/communication/mixnet-routing/).
Nodes leiten zwar untereinander Datenverkehr über Onion-geroutete Circuits weiter, aber in Node
2.1.0.25 ist der Mixnet-Dienst ein
[Stub](https://github.com/QuilibriumNetwork/monorepo/blob/bba996388e453ec484695c3cf9d8b2f3b4b1e43d/crates/quil-rpc/src/mixnet_service.rs#L29-L31),
der Nachrichten annimmt, ohne sie zu mischen.

## Vergleich

| Frage                        | Quorum                                                                                                                        | Bitsocial                                                                                                              |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Kategorie                    | Ende-zu-Ende-verschlüsselter Gruppen-Messenger von Quilibrium Inc.                                                            | Peer-to-Peer-Community-Netzwerk                                                                                        |
| Identität                    | Ed448-Master-Schlüsselsatz plus gerätespezifische Schlüssel, geschützt durch einen Passkey oder eine Wiederherstellungsphrase | Ed25519-Schlüsselpaare für Nutzer und Communities                                                                      |
| Wer lesen kann               | Mitglieder, die die Schlüssel eines Space besitzen                                                                            | Jeder, aus jeder App                                                                                                   |
| Wo Nachrichten liegen        | Das Gerät jedes Mitglieds; der Quorum-Dienst hält nicht zugestellte Kopien und für Mobilgeräte ein Log pro Space vor          | Der Node des Community-Eigentümers und die Peers, die sie lesen und seeden                                             |
| Womit sich Clients verbinden | Mit dem Quorum-Dienst unter `api.quorummessenger.com`                                                                         | Mit Peers über libp2p, gefunden über HTTP-Router, auch aus einem Browser-Tab                                           |
| Communities                  | Spaces mit Kanälen, Rollen und Einladungslinks                                                                                | Vollwertige Objekte, deren Node Beiträge annimmt oder ablehnt                                                          |
| Spam-Abwehr                  | Einladungslinks, Rauswürfe mit neuen Schlüsseln, clientseitige Ratenbegrenzung                                                | Die Challenge der jeweiligen Community, bevor ein Beitrag angenommen wird                                              |
| Moderation                   | Rollen, die der Client jedes Mitglieds durchsetzt; der Eigentümer wirft hinaus; Meldungen gehen an den Betreiber des Dienstes | Community-Eigentümer moderieren ihre Community; Apps entscheiden, was sie anzeigen                                     |
| Private Nachrichten          | Ende-zu-Ende-verschlüsselte Direktnachrichten                                                                                 | Öffentliche Communities; noch keine nativen Direktnachrichten                                                          |
| Ökonomie                     | Netzwerk-Token QUIL; optionales Apex-Abonnement für 5 Dollar im Monat                                                         | Keine im Protokoll; eine Challenge kann eine Zahlung oder einen Token verlangen                                        |
| Wichtigster Kompromiss       | Private, verschlüsselte Gruppen, aber jeder Client hängt von einem einzigen Dienst ab                                         | Kostenlose Identitäten und Zugang per Browser, aber keine privaten Nachrichten, und nur der neueste Stand wird bewahrt |
