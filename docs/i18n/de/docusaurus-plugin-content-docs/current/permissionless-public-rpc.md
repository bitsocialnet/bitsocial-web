---
title: Erlaubnisloser öffentlicher RPC
description: Vorgeschlagener Entwurf für einen öffentlichen Bitsocial-RPC-Dienst mit isolierten Benutzern, eingeschränkten Berechtigungen und Community-Eigentum.
---

# Erlaubnisloser öffentlicher RPC

Diese Seite stellt öffentlichen RPC als einen Bitsocial-Vorschlag auf Produktebene dar und nicht als eine Wand von Implementierungsdetails.

## Klares Ziel

[Bitsocial Forge](https://bitsocialforge.com) kann einen öffentlichen RPC-Dienst betreiben, der es vielen Benutzern ermöglicht, ihre eigenen Bitsocial-Communitys aus der Ferne zu verwalten, ohne den Betreiber zum Verwalter dieser Communities zu machen.

Der Dienst sollte mobile und leichtgewichtige Clients praktisch machen und gleichzeitig drei Einschränkungen wahren:

1. Benutzer bleiben standardmäßig voneinander isoliert.
2. Berechtigungen bleiben explizit und detailliert.
3. Die Kompatibilität mit der aktuellen RPC-Anforderungs- und Antwortform kann während des Rollouts beibehalten werden.

## Welches Problem es löst

Heutzutage ist das einfachste RPC-Modell normalerweise alles oder nichts: ein Authentifizierungsschlüssel, eine Autoritätsdomäne, vollständiger Zugriff. Das funktioniert für einen einzelnen Betreiber, aber nicht für einen öffentlichen Mehrbenutzerdienst.

Ein erlaubnisloser öffentlicher RPC benötigt ein stärkeres Modell:

- Ein Dienst kann viele Benutzer hosten
- Jeder Benutzer erhält seine eigenen Communities und Limits
- Betreiberdefinierte Richtlinien können Missbrauch verhindern
- Der Benutzer kann später immer noch wegziehen oder sich selbst hosten

## Kernmodell

### Benutzer

Jeder Benutzer erhält einen Authentifizierungsnachweis und ein Berechtigungspaket.

### Gemeinschaften

Über den Dienst erstellte Communities werden einem Eigentümerdatensatz zugewiesen. Der Besitz wird explizit nachverfolgt, sodass Verwaltungsmethoden auf den richtigen Benutzer beschränkt werden können.

### Berechtigungen

Berechtigungen sind fähigkeitsbasiert. Anstelle eines booleschen Werts für „kann den RPC verwenden“ kann der Server Folgendes steuern:

- wie viele Communities ein Benutzer erstellen kann
- welche Managementmethoden zur Verfügung stehen
- welche Veröffentlichungsvorgänge zulässig sind
- welche Tarifgrenzen gelten
- welche Admin-Oberflächen sichtbar sind

### Admin-Oberfläche

Der öffentliche RPC selbst sollte sich weiterhin auf das benutzerorientierte RPC-Verhalten konzentrieren. Verwaltungsaufgaben wie Benutzererstellung, Eigentumsübertragung und Prüfungsprüfung gehören zu einer separaten Operator-API und einem separaten Dashboard.

## Kompatibilitätshaltung

Benutzerbezogene Dokumentationen sollten Bitsocial-Begriffe wie **Community** und **Profil** verwenden.

Auf der Drahtebene kann beim ersten Rollout immer noch die aktuelle JSON-RPC-Transport- und Nutzlastform beibehalten werden, sofern dies aus Kompatibilitätsgründen nützlich ist. Mit anderen Worten: Die Dokumente können Bitsocial-nativ bleiben, auch wenn während der Übergangszeit einige kompatible Methodennamen oder Anforderungsformen im Hintergrund bleiben.

## Vorgeschlagenes Berechtigungspaket

```ts
type PermissionBundle = {
  maxCommunities: number; // 0 = unlimited
  methods: {
    createCommunity: boolean;
    startCommunity: boolean;
    stopCommunity: boolean;
    editCommunity: boolean;
    deleteCommunity: boolean;
    publishComment: boolean;
    publishVote: boolean;
    publishCommentEdit: boolean;
    publishCommentModeration: boolean;
    publishCommunityEdit: boolean;
    getComment: boolean;
    getCommentPage: boolean;
    getCommunityPage: boolean;
    fetchContent: boolean;
    resolveAuthorAddress: boolean;
    commentUpdateSubscribe: boolean;
    communityUpdateSubscribe: boolean;
    communityListSubscribe: boolean;
    settingsSubscribe: boolean;
  };
  rateLimits: {
    requestsPerMinute: number;
    publishesPerHour: number;
  };
  storage: {
    maxTotalSize: number;
  };
  scope: {
    canPublishExternal: boolean;
    canReadExternal: boolean;
  };
  admin: {
    canTransferOwnership: boolean;
    canManageUsers: boolean;
    canViewAuditLogs: boolean;
    canViewAllCommunities: boolean;
  };
};
```

Die genauen Methodennamen dienen der Veranschaulichung. Der wichtige Teil ist die Form der Richtlinie: Einzelne Funktionen werden unabhängig voneinander gesteuert und nicht in einem Superuser-Token gebündelt.

## Verbindungsfluss

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Berechtigungsbewusstsein sollte optional bleiben. Ein Client, der die Benachrichtigung ignoriert, kann sich dennoch korrekt verhalten, indem er standardmäßige Autorisierungsfehler vom Server verarbeitet.

## Eigentumsdurchsetzung

Wenn der Dienst eine Community erstellt, sollte er dem aufrufenden Benutzer automatisch die Eigentümerschaft zuweisen. Von dort:

- Community-Start-, Stopp-, Bearbeitungs- und Löschaktionen unterliegen dem Gültigkeitsbereich des Eigentümers
- Listen- und Abonnementantworten beziehen sich standardmäßig auf die eigenen Communities des Anrufers
- Eine umfassendere Sichtbarkeit ist eine explizite Administratorberechtigung und keine Standardeinstellung

Ein Randfall ist von großer Bedeutung: Wenn ein Benutzer einer Community beitritt, die ihm **nicht** gehört, darf der Server nur den öffentlichen Status offenlegen, den jeder externe Beobachter sehen sollte. Konfigurationsdaten, die nur dem Besitzer vorbehalten sind, oder interne Laufzeitdaten sollten niemals über eine Abonnement-API durchsickern.

## Empfohlene Bedienoberfläche

Die Admin-API kann langweilig und explizit bleiben:

- Benutzer auflisten
- Überprüfen Sie einen Benutzer
- Benutzer erstellen oder aktualisieren
- Benutzer löschen
- Gemeinschaftseigentum übertragen
- Überprüfen Sie die Audit-Protokolle

Die Authentifizierung für diese Operator-API sollte vollständig getrennt von der RPC-Authentifizierung des Endbenutzers erfolgen.

## Rollout-Phasen

### Phase 1

- Legen Sie die öffentliche RPC-Projektstruktur fest
- Fügen Sie Benutzerdatensätze und Eigentumsverfolgung hinzu
- Forken oder Erweitern des aktuellen RPC-Servers

### Phase 2

- Berechtigungspakete implementieren
- Erzwingen Sie sie auf der RPC-Methodenebene
- Berechtigungsmetadaten beim Herstellen einer Verbindung zurückgeben

### Phase 3

- Fügen Sie die Operator-API hinzu
- Audit-Logging hinzufügen
- Fügen Sie die Administratorauthentifizierung hinzu

### Phase 4

- Versenden Sie das Admin-Dashboard
- Testmissbrauchskontrollen
- Ratenbegrenzung und Speicherkontingente verschärfen

## Offene Fragen

### Spam mit Authentifizierungsdaten

Wenn die Erstellung von Authentifizierungen kostengünstig ist, benötigen öffentliche Dienste möglicherweise eine Challenge-Schicht, bevor sie Anmeldeinformationen ausstellen. Ein möglicher Weg besteht darin, das Community-Challenge-Modell selbst wiederzuverwenden, sodass die Ausstellung von Anmeldeinformationen dieselbe Anti-Missbrauchs-Philosophie übernimmt wie der Rest des Netzwerks.

### Migrationsdetails

Einige frühe Implementierungen stellen möglicherweise noch intern kompatibilitätsorientierte Methodennamen bereit. Das sollte als Migrationsdetail behandelt werden, nicht als permanentes öffentliches Vokabular der Bitsocial-Dokumente.

## Zusammenfassung

Bei diesem Vorschlag geht es eigentlich um eines: die öffentliche RPC-Infrastruktur nutzbar zu machen, ohne sie zur Verwahrung zu machen. Ein guter öffentlicher Bitsocial RPC sollte sich wie eine optionale Unterstützung für die Führung von Communities anfühlen und nicht wie eine neue zentrale Plattform, die sich durch die Hintertür das Eigentum zurückerobert.
