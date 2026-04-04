---
title: Luvaton julkinen RPC
description: Ehdotettu suunnittelu julkiselle Bitsocial RPC -palvelulle, jossa on yksittäisiä käyttäjiä, suojattuja käyttöoikeuksia ja yhteisön omistajuus.
---

# Luvaton julkinen RPC

Alkuperäinen julkinen RPC-ehdotus toimi GitHub-ongelmana, joka oli kirjoitettu vanhalla plebbit-terminologialla. Tämä sivu kirjoittaa tämän idean uudelleen Bitsocial-kielellä ja kehystää sen tuotetason ehdotukseksi toteutusyksityiskohtien seinän sijaan.

## Selkeäkielinen tavoite

Bitsocial Forge voi käyttää julkista RPC-palvelua, jonka avulla monet käyttäjät voivat hallita omia Bitsocial-yhteisöjään etänä ilman, että operaattori tulee näiden yhteisöjen ylläpitäjäksi.

Palvelun tulee tehdä mobiili- ja kevyistä asiakkaista käytännöllisiä säilyttäen samalla kolme rajoitusta:

1. Käyttäjät pysyvät oletuksena eristettyinä toisistaan.
2. Luvat pysyvät yksiselitteisinä ja yksityiskohtaisina.
3. Yhteensopivuus nykyisen RPC-pyynnön ja vastauksen muodon kanssa voidaan säilyttää käyttöönoton aikana.

## Minkä ongelman se ratkaisee

Nykyään yksinkertaisin RPC-malli on yleensä kaikki tai ei mitään: yksi todennusavain, yksi auktoriteettialue, täysi käyttöoikeus. Se toimii yhdelle operaattorille, mutta ei julkiselle monen käyttäjän palvelulle.

Luvaton julkinen RPC tarvitsee vahvemman mallin:

- yksi palvelu voi isännöidä useita käyttäjiä
- jokainen käyttäjä saa omat yhteisönsä ja rajoituksensa
- operaattorin määrittelemät käytännöt voivat estää väärinkäytön
- käyttäjä voi silti muuttaa pois tai isännöidä itseään myöhemmin

## Perusmalli

### Käyttäjät

Jokainen käyttäjä saa todennustunnuksen ja käyttöoikeuspaketin.

### yhteisöt

Palvelun kautta luodut yhteisöt liitetään omistajatietueeseen. Omistajuutta seurataan eksplisiittisesti, jotta hallintamenetelmät voidaan rajata oikealle käyttäjälle.

### Käyttöoikeudet

Käyttöoikeudet ovat kykyperusteisia. Yhden loogisen arvon "voi käyttää RPC:tä" sijaan palvelin voi hallita:

- kuinka monta yhteisöä käyttäjä voi luoda
- mitä hallintamenetelmiä on saatavilla
- mitkä julkaisutoiminnot ovat sallittuja
- mitä hintarajoituksia sovelletaan
- mitkä järjestelmänvalvojan pinnat ovat näkyvissä

### Admin pinta

Julkisen RPC:n tulisi itse keskittyä käyttäjien osoittamaan RPC-käyttäytymiseen. Hallinnolliset tehtävät, kuten käyttäjien luominen, omistajuuden siirto ja tarkastusten tarkistus, kuuluvat erilliseen operaattorin sovellusliittymään ja kojelautaan.

## Yhteensopivuusasento

Käyttäjille tarkoitetussa dokumentaatiossa tulee käyttää Bitsocial-termejä, kuten **yhteisö** ja **profiili**.

Langatasolla ensimmäinen käyttöönotto voi silti säilyttää nykyisen JSON-RPC-kuljetuksen ja hyötykuorman muodon, jos se on hyödyllistä yhteensopivuuden kannalta. Toisin sanoen: dokumenttien ei enää tarvitse puhua kuten vanhoja plebbit-dokumentteja, vaikka siirtymäkauden aikana säilyisikin joitain vanhoja menetelmien nimiä tai pyyntömuotoja kulissien takana.

## Ehdotettu lupapaketti

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

Tarkat menetelmien nimet ovat havainnollistavia. Tärkeä osa on käytännön muoto: yksittäisiä ominaisuuksia ohjataan itsenäisesti sen sijaan, että ne yhdistettäisiin yhdeksi pääkäyttäjätunnukseksi.

## Yhteysvirta

```text
client connects with auth credential
-> server validates the credential
-> server loads the user's permission bundle
-> server returns a permissions notification
-> client proceeds with the subset of actions it is allowed to use
```

Lupatietoisuuden tulisi pysyä valinnaisena. Asiakas, joka jättää huomioimatta ilmoituksen, voi silti toimia oikein käsittelemällä palvelimen normaalin valtuutusvirheitä.

## Omistusoikeuden täytäntöönpano

Kun palvelu luo yhteisön, sen pitäisi automaattisesti määrittää omistajuus soittavalle käyttäjälle. Sieltä:

- yhteisön aloitus-, lopetus-, muokkaus- ja poistotoiminnot ovat omistajan piirissä
- lista- ja tilausvastaukset ovat oletusarvoisesti soittajan omia yhteisöjä
- laajempi näkyvyys on nimenomainen järjestelmänvalvojan lupa, ei oletusarvo

Yhdellä reunalla on paljon merkitystä: jos käyttäjä tilaa yhteisön, jota hän **ei** omista, palvelimen tulee paljastaa vain julkinen tila, joka kaikkien ulkopuolisten tarkkailijoiden tulisi nähdä. Vain omistajien määritykset tai sisäiset ajonaikaiset tiedot eivät saa koskaan vuotaa tilaussovellusliittymän kautta.

## Suositeltu käyttöpinta

Admin API voi pysyä tylsänä ja selkeänä:

- luettelo käyttäjistä
- tarkastaa yksi käyttäjä
- luoda tai päivittää käyttäjiä
- poista käyttäjiä
- siirtää yhteisön omistusoikeus
- tarkastaa tarkastuslokit

Tämän operaattorin API:n todennuksen tulee olla täysin erillään loppukäyttäjän RPC-todennusta.

## Käyttöönottovaiheet

### Vaihe 1

- perustaa julkinen RPC-projektirakenne
- lisätä käyttäjätietueita ja omistajuuden seurantaa
- haaraa tai laajentaa nykyistä RPC-palvelinta

### Vaihe 2

- ottaa käyttöön lupapaketit
- pakottaa ne RPC-menetelmäkerroksessa
- palauttaa käyttöoikeuksien metatiedot yhteyden yhteydessä

### Vaihe 3

- lisää operaattorin API
- lisää tarkastusloki
- lisää järjestelmänvalvojan todennus

### Vaihe 4

- lähetä järjestelmänvalvojan hallintapaneeli
- testaa väärinkäytön valvontaa
- tiukentaa korkorajoituksia ja varastointikiintiöitä

## Avoimet kysymykset

### Todennettu roskaposti

Jos todennusten luominen on halpaa, julkiset palvelut saattavat tarvita haastekerroksen ennen valtuustietojen myöntämistä. Yksi mahdollinen tapa on käyttää itse yhteisön haastemallia uudelleen, jotta valtakirjojen myöntäminen perii saman väärinkäytösten vastaisen filosofian kuin muu verkosto.

### Perinnöllinen nimeäminen

Jotkut varhaiset toteutukset saattavat silti paljastaa vanhoja menetelmänimiä sisäisesti yhteensopivuuden vuoksi. Sitä tulisi käsitellä siirtymäyksityiskohtana, ei Bitsocial-dokumenttien pysyvänä julkisena sanastona.

## Yhteenveto

Tässä ehdotuksessa on oikeastaan kyse yhdestä asiasta: julkisen RPC-infrastruktuurin tekemisestä hyödylliseksi ilman, että siitä tehdään säilöönottoa. Hyvän julkisen Bitsocial RPC:n pitäisi tuntua valinnaiselta apuyhteisöltä, ei uudelta keskusalustalta, joka palauttaa omistuksen takaoven kautta.
