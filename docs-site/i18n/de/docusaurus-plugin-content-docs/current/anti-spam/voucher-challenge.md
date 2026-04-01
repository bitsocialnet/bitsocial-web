---
title: Gutschein-Challenge
description: Anti-Spam-Herausforderung, die die Veröffentlichung hinter eindeutigen Gutscheincodes, die von Community-Eigentümern verteilt werden, verhindert.
sidebar_position: 3
---

# Gutschein-Challenge

Voucher Challenge ist ein Anti-Spam-Mechanismus, der die Veröffentlichung von Inhalten hinter eindeutigen Gutscheincodes schützt. Anstatt sich auf die automatische Erkennung zu verlassen, verlagert es das Vertrauen auf den Community-Eigentümer, der Codes manuell an vertrauenswürdige Personen verteilt.

**Quellcode:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Wie es funktioniert

1. Ein Community-Eigentümer generiert einen oder mehrere eindeutige Gutscheincodes.
2. Der Eigentümer verteilt diese Codes über einen Kanal seiner Wahl (Direktnachricht, E-Mail, persönlich usw.) an vertrauenswürdige Autoren.
3. Wenn ein Autor versucht, etwas zu veröffentlichen, fordert das Challenge-System ihn zur Eingabe eines Gutscheincodes auf.
4. Der Code wird validiert – wenn er echt ist und noch nicht verwendet wurde, wird die Veröffentlichung akzeptiert.

Jeder Gutscheincode ist nach der Einlösung an einen bestimmten Autor gebunden und verhindert so eine Wiederverwendung durch andere.

## Wann sollte man es verwenden?

Die Gutschein-Challenge eignet sich am besten für:

- **Communitys, die nur auf Einladung zugänglich sind**, in denen die Mitgliedschaft absichtlich eingeschränkt ist.
- **Kuratierte Räume**, in denen der Eigentümer jeden Teilnehmer persönlich überprüft.
- **High-trust environments** where automated spam scoring is unnecessary or undesirable.

Da es eine manuelle Codeverteilung erfordert, lässt es sich nicht auf große offene Communities skalieren. Erwägen Sie für diese Szenarien stattdessen [Spam-Blocker](./spam-blocker.md) oder [EVM Contract Call Challenge](./evm-contract-call.md).

## Integration

Voucher Challenge lässt sich an dieselbe Challenge-Schnittstelle anschließen, die auch von anderen Anti-Spam-Paketen im Bitsocial-Ökosystem verwendet wird. Community-Eigentümer aktivieren es über ihre Community-Einstellungen und die Herausforderung wird den Autoren automatisch angezeigt, wenn sie versuchen, Beiträge zu veröffentlichen.
