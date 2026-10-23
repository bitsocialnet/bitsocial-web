---
title: Erstellen Sie Ihren eigenen Bitsocial-Client
description: Leitfaden für alle, die eigenständige Bitsocial-Clients veröffentlichen wollen, von Imageboards und Foren bis zu Social-Apps für Nischen.
---

# Erstellen Sie Ihren eigenen Bitsocial-Client

Bitsocial gewinnt nicht dadurch, dass es für jeden Anwendungsfall eine offizielle App gibt. Es
gewinnt, wenn viele Clients dasselbe Protokoll nutzen und dabei über Oberfläche, Kultur, Entdeckung,
Voreinstellungen und Geschäftsmodell miteinander konkurrieren.

5chan und Seedit sind frühe Belege dafür, keine Obergrenze. Wer entwickelt, sollte ein neues
Imageboard, ein Forum, einen Profil-Client, eine Mobile-First-Social-App, ein Werkzeug für eine
Nischen-Community oder auch einen zentralisierten Client veröffentlichen können, der Bitsocial im
Unterbau nutzt, ohne dafür einen Plattformbetreiber um Erlaubnis zu fragen.

## Was Entwickler verändern können

Ein Bitsocial-Client kann bei Produktentscheidungen konkurrieren, ohne das gesamte Netzwerk zu forken:

- Oberfläche und visuelle Sprache
- Onboarding-Ablauf
- Voreinstellungen der Community
- Moderationsoberflächen
- Modell für die Entdeckung von Inhalten
- Medienerlebnis
- Vorgaben für Mobilgeräte, Desktop oder geringe Bandbreite
- Monetarisierung und Geschäftsmodell

Die gemeinsame Schicht ist das Protokoll. Die Produktschicht steht dem Wettbewerb offen.

## Der schnellste Weg zum Einstieg

Beginnen Sie mit den Apps, die es bereits gibt:

- Probieren Sie [5chan](https://5chan.app) für anonyme Imageboard-Communities aus.
- Probieren Sie [Seedit](https://seedit.app) für Diskussionen im Reddit-Stil aus.
- Lesen Sie die Dokumentation zu den [Bitsocial React Hooks](https://hooks.bitsocial.net/docs/quickstart/) für die Integration auf Client-Seite.
- Lesen Sie die Dokumentation zur [Bitsocial CLI](/developer-tools/cli/) für den Betrieb von Knoten und Communities.

Wenn Sie schnell vorankommen wollen, tragen Sie zunächst zu einer bestehenden App bei. Passt die
Oberfläche, die Kultur oder das Community-Modell, das Ihnen vorschwebt, dort nicht hinein, bauen Sie
einen eigenen Client.

## Wählen Sie eine eng umrissene erste Version

Die beste erste Version ist keine universelle Social-App. Sie ist ein Client mit einer klaren
Zielgruppe und einem starken Grund zu existieren.

Gute Ausgangspunkte sind unter anderem:

- ein aufgeräumterer Imageboard-Client für eine bestimmte Kultur
- ein Forum-Client, der zuerst für Mobilgeräte gedacht ist
- eine App für eine einzelne Community mit strengen Voreinstellungen
- ein Client für Creator-Communities
- ein Client, der nur zum Lesen und Entdecken dient
- eine Konsole für Moderation oder Betrieb
- ein Client, der für eine Sprache, eine Region oder eine Geräteklasse optimiert ist

Kleine Clients sind nützlich, weil Bitsocial sie in dasselbe Netzwerk hineinwachsen lässt, statt
ihre Nutzer in einer privaten Datenbank einzuschließen.

## Wege zur Umsetzung

Es gibt drei praktikable Wege:

1. Forken Sie einen bestehenden Client, wenn Ihre Idee nahe an 5chan oder Seedit liegt.
2. Bauen Sie einen neuen React-Client mit den [Bitsocial React Hooks](https://hooks.bitsocial.net/).
3. Bauen Sie eine eigene Integration auf Basis der Knoten-APIs und der öffentlichen RPC-Infrastruktur.

Öffentliche RPC sollte den dritten Weg deutlich praktikabler machen. Nutzer können über einen
gehosteten, nicht verwahrenden RPC-Anbieter einsteigen und später zum Selbsthosting oder zu einem
konkurrierenden Anbieter wechseln.

## Gestaltungsprinzip

Bauen Sie den Client, den es für Ihre Community geben sollte, und lassen Sie kompatible Clients
danach öffentlich miteinander konkurrieren.
