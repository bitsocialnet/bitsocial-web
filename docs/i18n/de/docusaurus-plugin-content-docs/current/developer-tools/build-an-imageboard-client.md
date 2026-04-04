---
title: Erstellen Sie einen Imageboard-Client
description: Beitragsleitfaden für Phase 1 für Entwickler, die neue Imageboard-Erlebnisse auf Bitsocial bereitstellen möchten.
sidebar_position: 1
---

# Erstellen Sie einen Imageboard-Client

In Phase 1 geht es nicht um eine offizielle App, die die gesamte Kategorie abdeckt. 5chan ist der erste Beweispunkt, aber das eigentliche Ziel ist ein breites Imageboard-Ökosystem: mehrere Bitsocial-Clients mit unterschiedlichen visuellen Sprachen, Moderationsvorgaben, Verzeichnismodellen und Ziel-Communitys.

## Was Phase 1 braucht

- Vertraute Kunden im 4chan-Stil für das Mainstream-Onboarding
- Altchan-inspirierte Kunden mit unterschiedlichen Kulturen und Board-Paketen
- Mobile-First-Clients oder Clients mit geringer Bandbreite
- Single-Community- oder Nischenkunden mit starken Meinungsverschiedenheiten
- Bessere Moderations-, Medien-, Onboarding- oder Discovery-Abläufe als in der ersten App enthalten

## Der schnellste Weg zu helfen

Wenn Sie den kürzesten Weg zum Versand wünschen, tragen Sie zuerst direkt zu 5chan bei:

- Entdecken Sie die Live-App unter [5chan.app](https://5chan.app)
- Überprüfen Sie die Quelle unter [github.com/bitsocialnet/5chan](https://github.com/bitsocialnet/5chan)
- Nehmen Sie am Builder-Chat unter [t.me/fünfchandev](https://t.me/fivechandev)

## Erstellen Sie Ihren eigenen Kunden

Wenn 5chan nicht zur gewünschten Community oder Schnittstelle passt, erstellen Sie stattdessen einen separaten Client. Kompatible Bitsocial-Kunden können dasselbe Netzwerk teilen, ohne dieselben Produktentscheidungen zu treffen.

1. Lernen Sie die protokollorientierten Tools kennen:
   - [Bitsocial React-Hooks](../react-hooks/)
   - [Bitsocial-CLI](../cli/)
2. Entscheiden Sie, welche Art von Imageboard Sie tatsächlich erstellen.
Wählen Sie zunächst die Boardstruktur, die Identitätsannahmen, das Moderationsmodell, den Entdeckungsablauf und die visuelle Sprache aus.
3. Wählen Sie den Implementierungspfad, der zum Projekt passt.
Fork 5chan, wenn Sie mit einer vertrauten Imageboard-Basis schnell vorankommen möchten. Fangen Sie neu an, wenn die Benutzeroberfläche oder das Interaktionsmodell radikal anders sein muss.
4. Versenden Sie eine schmale erste Version.
Ein Client, der einer echten Community gute Dienste leistet, ist wertvoller als ein vager Klon, der alle zufriedenstellen soll.
5. Veröffentlichen Sie das Ergebnis und lassen Sie es von Communities testen.
Bitsocial verbessert sich, wenn externe Entwickler eigensinnige Kunden beliefern, die um die Produktqualität konkurrieren, anstatt darauf zu warten, dass eine offizielle App alles erledigt.

## Designprinzip

Bitsocial gewinnt nicht dadurch, dass es einen einzigen gesegneten Kunden hat. Es gewinnt, wenn viele Kunden koexistieren, sich spalten, spezialisieren und Bedürfnisse erfüllen können, was bei der ersten App nie der Fall sein wird.
