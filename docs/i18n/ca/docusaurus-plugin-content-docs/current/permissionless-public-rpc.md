---
title: RPC públic sense permís
description: Disseny proposat per a un servei públic de Bitsocial RPC amb usuaris aïllats, permisos d'abast i propietat de la comunitat.
---

# RPC públic sense permís

Aquesta pàgina emmarca RPC públic com una proposta Bitsocial a nivell de producte en lloc d'un mur de detalls d'implementació.

## Objectiu de llenguatge senzill

[Bitsocial Forge](https://bitsocialforge.com) pot executar un servei públic RPC que permet a molts usuaris gestionar les seves pròpies comunitats Bitsocial de forma remota, sense convertir l'operador en un custodi d'aquestes comunitats.

El servei hauria de fer que els clients mòbils i lleugers siguin pràctics tot preservant tres limitacions:

1. Els usuaris es mantenen aïllats els uns dels altres per defecte.
2. Els permisos es mantenen explícits i granulars.
3. La compatibilitat amb la sol·licitud RPC actual i la forma de resposta es pot preservar durant el llançament.

## Quin problema soluciona

Avui en dia, el model RPC més senzill sol ser tot o res: una clau d'autenticació, un domini d'autoritat, accés complet. Això funciona per a un únic operador però no per a un servei públic multiusuari.

Un RPC públic sense permís necessita un model més fort:

- un servei pot allotjar molts usuaris
- cada usuari té les seves pròpies comunitats i límits
- Les polítiques definides per l'operador poden prevenir l'abús
- l'usuari encara pot allunyar-se o allotjar-se més tard

## Model bàsic

### Usuaris

Cada usuari obté una credencial d'autenticació més un paquet de permisos.

### Comunitats

Les comunitats creades mitjançant el servei s'assignen a un registre de propietari. La propietat es fa un seguiment explícit de manera que els mètodes de gestió es poden abastar a l'usuari adequat.

### Permisos

Els permisos es basen en capacitats. En lloc d'un booleà per "pot utilitzar l'RPC", el servidor pot controlar:

- quantes comunitats pot crear un usuari
- quins mètodes de gestió estan disponibles
- quines operacions de publicació estan permeses
- quins límits de tarifa s'apliquen
- quines superfícies d'administració són visibles

### Superfície administrativa

El propi RPC públic s'hauria de centrar en el comportament dels RPC davant dels usuaris. Les tasques administratives, com ara la creació d'usuaris, la transferència de propietat i la revisió d'auditoria, pertanyen a una API i un tauler d'operador separats.

## Posició de compatibilitat

La documentació orientada a l'usuari hauria d'utilitzar termes de Bitsocial com ara **comunitat** i **perfil**.

A nivell de cable, el primer llançament encara pot conservar la forma actual de transport i càrrega útil JSON-RPC quan això sigui útil per a la compatibilitat. En altres paraules: els documents poden romandre natius de Bitsocial, fins i tot si el període de transició manté alguns noms de mètodes orientats a la compatibilitat o formes de sol·licitud entre bastidors.

## Paquet de permisos proposat

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

Els noms exactes dels mètodes són il·lustratius. La part important és la forma de la política: les capacitats individuals es controlen de manera independent en lloc d'agrupar-se en un testimoni de superusuari.

## Flux de connexió

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

La consciència dels permisos hauria de ser opcional. Un client que ignora la notificació encara pot comportar-se correctament gestionant errors d'autorització estàndard del servidor.

## Compliment de la propietat

Quan el servei crea una comunitat, hauria d'assignar automàticament la propietat a l'usuari que truca. A partir d'aquí:

- Les accions d'inici, aturada, edició i supressió de la comunitat són de l'àmbit del propietari
- les respostes de llista i subscripció per defecte a les comunitats de la persona que truca
- una visibilitat més àmplia és un permís d'administració explícit, no un predeterminat

Un cas extrem importa molt: si un usuari es subscriu a una comunitat que **no** és propietari, el servidor només ha d'exposar l'estat públic que hauria de veure qualsevol observador extern. La configuració només del propietari o les dades de temps d'execució internes no s'han de filtrar mai a través d'una API de subscripció.

## Superfície de l'operador recomanada

L'API d'administració pot quedar avorrida i explícita:

- llista d'usuaris
- inspeccionar un usuari
- crear o actualitzar usuaris
- eliminar usuaris
- transferir la propietat de la comunitat
- inspeccionar els registres d'auditoria

L'autenticació d'aquesta API de l'operador hauria de ser completament independent de l'autenticació RPC de l'usuari final.

## Fases de desplegament

### Fase 1

- establir l'estructura pública del projecte RPC
- afegir registres d'usuari i seguiment de la propietat
- bifurca o amplia el servidor RPC actual

### Fase 2

- implementar paquets de permisos
- apliqueu-los a la capa del mètode RPC
- retornar les metadades dels permisos a connectar

### Fase 3

- afegir l'API de l'operador
- afegir el registre d'auditoria
- afegir l'autenticació d'administrador

### Fase 4

- envia el tauler d'administració
- prova els controls d'abús
- endurir la limitació de tarifes i les quotes d'emmagatzematge

## Preguntes obertes

### Correu brossa de credencials d'autenticació

Si la creació d'autenticació és barata, els serveis públics poden necessitar una capa de desafiament abans d'emetre credencials. Una possible ruta és reutilitzar el mateix model de desafiament de la comunitat perquè l'emissió de credencials hereti la mateixa filosofia anti-abús que la resta de la xarxa.

### Detalls de la migració

Algunes implementacions primerenques encara poden exposar internament noms de mètodes orientats a la compatibilitat. Això s'ha de tractar com un detall de migració, no com el vocabulari públic permanent dels documents de Bitsocial.

## Resum

Aquesta proposta tracta realment d'una cosa: fer que la infraestructura pública RPC sigui útil sense fer-la de custòdia. Un bon bitsocial RPC públic hauria de sentir-se com una assistència opcional per executar comunitats, no com una nova plataforma central que reclama la propietat per la porta del darrere.
