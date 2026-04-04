---
title: Spam Blocker
description: Zentralisierter Spam-Erkennungsdienst mit Risikobewertung, OAuth-Herausforderungen und konfigurierbaren Stufenschwellenwerten.
sidebar_position: 1
---

# Spam Blocker

:::warning Legacy-Benennung
Dieses Paket wurde ursprünglich unter dem Geltungsbereich `@plebbit` veröffentlicht. Es wurde in `@bitsocial/spam-blocker-server` und `@bitsocial/spam-blocker-challenge` umbenannt. Verweise auf die alten Namen erscheinen möglicherweise noch in älterer Dokumentation oder Codebasis.
:::

Spam Blocker ist ein zentraler Spam-Erkennungsdienst, der eingehende Veröffentlichungen bewertet und Risikobewertungen zuweist. Es besteht aus zwei Paketen:

- **`@bitsocial/spam-blocker-server`** – der HTTP-Server, der die Evaluierungs- und Challenge-APIs hostet.
- **`@bitsocial/spam-blocker-challenge`** – ein leichtgewichtiges Client-Paket, das Communities integrieren, um Publikationen zur Evaluierung zu senden.

**Quellcode:** [github.com/bitsocialnet/spam-blocker](https://github.com/bitsocialnet/spam-blocker)

## So funktioniert die Risikobewertung

Jede an den Endpunkt `/evaluate` übermittelte Veröffentlichung erhält eine numerische Risikobewertung. Der Score ist eine gewichtete Kombination mehrerer Signale:

| Signal          | Beschreibung                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kontoalter      | Neuere Konten erhalten höhere Risikobewertungen.                                                                                                                       |
| Karma           | Angesammeltes Gemeinschaftskarma reduziert das Risiko.                                                                                                                 |
| Ruf des Autors  | Vom Hintergrund-Netzwerkindexer erfasste Reputationsdaten.                                                                                                             |
| Inhaltsanalyse  | Heuristiken auf Textebene (Linkdichte, bekannte Spam-Muster usw.).                                                                                                     |
| Geschwindigkeit | Schnell aufeinanderfolgende Beiträge desselben Autors erhöhen das Risiko.                                                                                              |
| IP-Intelligenz  | Geolokalisierung auf Länderebene und Suche nach Bedrohungsfeeds. Es werden nur Ländercodes gespeichert – rohe IP-Adressen werden niemals an Communities weitergegeben. |

## Stufenschwellenwerte

Die Risikobewertung wird einer von vier konfigurierbaren Stufen zugeordnet, die bestimmen, was als nächstes passiert:

1. **Automatisch akzeptieren** – Die Punktzahl ist niedrig genug, dass die Veröffentlichung ohne Beanstandung genehmigt wird.
2. **OAuth-ausreichend** – der Autor muss eine OAuth-Überprüfung durchführen, um fortzufahren.
3. **OAuth-plus-more** – OAuth allein reicht nicht aus; Eine zusätzliche Verifizierung (z. B. CAPTCHA) ist erforderlich.
4. **Automatische Ablehnung** – Punktzahl ist zu hoch; die Veröffentlichung wird entschieden abgelehnt.

Alle Schwellenwerte sind pro Community konfigurierbar.

## Herausforderungsfluss

Wenn eine Veröffentlichung in eine Stufe fällt, die eine Überprüfung erfordert, beginnt der Challenge-Flow:

1. Der Autor wird zunächst aufgefordert, sich über **OAuth** zu authentifizieren (GitHub, Google, Twitter und andere unterstützte Anbieter).
2. Wenn OAuth allein nicht ausreicht (Stufe 3), wird ein **CAPTCHA-Fallback** von Cloudflare Turnstile angeboten.
3. Die OAuth-Identität wird ausschließlich zur Überprüfung verwendet – sie wird **niemals** an die Community oder andere Benutzer weitergegeben.

## API-Endpunkte

### `POST /evaluate`

Reichen Sie eine Veröffentlichung zur Risikobewertung ein. Gibt die berechnete Risikobewertung und die erforderliche Herausforderungsstufe zurück.

### `POST /challenge/verify`

Senden Sie das Ergebnis einer abgeschlossenen Herausforderung (OAuth-Token, CAPTCHA-Lösung oder beides) zur Überprüfung.

### `GET /iframe/:sessionId`

Gibt eine einbettbare HTML-Seite zurück, die die entsprechende Challenge-Benutzeroberfläche für die angegebene Sitzung darstellt.

## Ratenbegrenzung

Ratenbegrenzungen werden dynamisch basierend auf dem Alter und der Reputation des Autors angewendet. Für neuere oder weniger renommierte Autoren gelten strengere Grenzwerte, während für etablierte Autoren großzügigere Grenzwerte gelten. Dies verhindert Spam-Flut, ohne vertrauenswürdige Teilnehmer zu benachteiligen.

## Hintergrund-Netzwerkindexer

Der Server führt einen Hintergrundindexer aus, der das Netzwerk kontinuierlich durchsucht, um Reputationsdaten des Autors zu erstellen und zu verwalten. Diese Daten fließen direkt in die Risikobewertungspipeline ein und ermöglichen es dem System, wiederkehrende gutgläubige Teilnehmer in allen Communities zu erkennen.

## Privatsphäre

Spam Blocker wurde unter Berücksichtigung des Datenschutzes entwickelt:

- OAuth-Identitäten werden nur zur Überprüfung der Herausforderung verwendet und **niemals** an Communities weitergegeben.
- IP-Adressen werden **nur in Ländercodes** aufgelöst; Roh-IPs werden nicht gespeichert oder weitergegeben.

## Datenbank

Der Server verwendet **SQLite** (über `better-sqlite3`) für die lokale Persistenz von Reputationsdaten, Sitzungsstatus und Konfiguration.
