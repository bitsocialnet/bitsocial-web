---
title: Bitsocial en Urbit
description: Hoe Urbit, een netwerk van persoonlijke servers met Urbit ID's op basis van Ethereum en groepen in Tlon Messenger die door hun host worden beheerd, zich verhoudt tot de peer-to-peer-communities van Bitsocial.
---

# Bitsocial en Urbit

[Urbit](https://urbit.org/) is een netwerk van persoonlijke servers. Elke gebruiker heeft een
computer die altijd aanstaat, een schip (ship) genoemd. Een schip draait het eigen besturingssysteem
van Urbit (Arvo), geschreven in Urbits eigen talen (Nock en Hoon), en wordt geïdentificeerd door een
Urbit ID. De belangrijkste sociale app is [Tlon Messenger](https://tlon.io/), gebouwd door Tlon, het
bedrijf dat in 2013 werd opgericht om Urbit te ontwikkelen.

Urbit wil de hele computerstack vervangen en is daarmee een veel breder project dan Bitsocial. De
sociale laag gebruikt echter een model dat dicht bij dat van Bitsocial ligt: een community staat op
de node van haar eigenaar, en die node bepaalt wat er binnenkomt. De twee verschillen in wie een
server moet draaien en in hoe spam wordt buitengehouden.

## Hoe Urbit werkt

- **Urbit ID's.** Elk schip heeft een Urbit ID: een getal dat wordt weergegeven als een
  uitspreekbare naam, zoals `~sampel-palnet`. Layer 1-ID's zijn NFT's waarvan het eigendom en de
  publieke netwerksleutels zijn vastgelegd in de Azimuth-contracten op Ethereum. Layer 2-ID's, die
  in 2021 zijn toegevoegd om kosten te besparen, gebruiken een "naive rollup": hun transacties
  worden in batches op Ethereum geplaatst, maar hun eigendom wordt niet in het Azimuth-contract
  opgeslagen, en elk schip berekent het lokaal. Tlon draait een roller die iedereen gratis kan
  gebruiken, volgens de [Urbit ID-documentatie](https://docs.urbit.org/urbit-id/what-is-urbit-id) en
  [Get on Urbit](https://docs.urbit.org/get-on-urbit).
- **Een vaste hiërarchie.** De adresruimte telt 256 sterrenstelsels, 65.536 sterren en ongeveer 4
  miljard planeten voor dagelijks gebruik. Sterrenstelsels geven sterren uit, sterren geven planeten
  uit, en elke planeet kan manen uitgeven voor haar eigen apparaten. Kometen zijn gratis ID's die
  een schip voor zichzelf genereert en die nooit de blockchain raken. De eigenaren van de
  sterrenstelsels vormen de Galactic Senate, die stemt over upgrades van de Azimuth-contracten en
  het bestuur van de Urbit Foundation kiest.
- **Netwerk.** Schepen wisselen versleutelde pakketten peer-to-peer uit. Sinds juli 2026 is het
  netwerkprotocol [Directed Messaging](https://urbit.org/blog/directed-messaging), een
  contentgerichte herschrijving van het oudere Ames-protocol. Sterrenstelsels zorgen ervoor dat
  peers elkaar vinden: elk sterrenstelsel houdt bij waar de schepen eronder zich bevinden, en stuurt
  pakketten naar hen door totdat de twee schepen elkaar rechtstreeks kunnen bereiken, of zolang een
  firewall dat verhindert, volgens de
  [paper over Directed Messaging](https://urbitsystems.tech/article/v03-i01/directed-messaging).
- **Groepen.** In Tlon Messenger wordt een groep gehost door het schip van de maker. Leden sturen
  berichten naar de host, die ze verspreidt naar het schip van elk lid, en het schip van elk lid
  bewaart een eigen kopie, volgens de [FAQ van Tlon](https://tlon.io/posts/faq). De host beheert
  rollen, kanalen en toelating. Een groep kan openbaar, privé of geheim zijn, en kan
  [afzonderlijke schepen of hele rangen van ID's verbannen](https://github.com/tloncorp/tlon-apps/blob/develop/desk/sur/groups.hoon).
  Kanalen zijn chats, notitieboeken of verzamelingen van afbeeldingen en links.
- **Hosting.** Wie zich bij Tlon aanmeldt, krijgt een schip dat Tlon draait, met sleutels die Tlon
  in bewaring houdt. Een gebruiker kan het schip en het bijbehorende master ticket exporteren en
  elders draaien: op een apparaat van [Native Planet](https://www.nativeplanet.io/), of met de
  Vere-runtime op Linux, macOS of Windows. Schepen kunnen nog geen grote bestanden rechtstreeks
  opslaan, dus zet Tlon Messenger afbeeldingen en andere media in S3-compatibele cloudopslag.

## Waar ze verschillen

### Wie een server moet draaien

Bij Urbit is elke deelnemer een server. De apps van Tlon zijn frontends voor het eigen schip van de
gebruiker, en zelfs het lezen van een groep loopt via dat schip. Wie zelf geen schip draait, huurt
er een, en daarmee komt er weer een hostingprovider in beeld: Tlon bewaart de sleutels van gehoste
gebruikers en houdt beperkte toegang voor onderhoud, al kunnen gebruikers met hun hele schip
vertrekken.

Bij Bitsocial hebben alleen community-eigenaren een node nodig die altijd aanstaat. Lezers en
posters kunnen een peer-to-peer-node in een browsertabblad draaien, en hun account is een
sleutelpaar dat de app bewaart. Zie [Peer-to-peer in de browser](/browser-p2p/). Wanneer iemand wel
een gehoste node gebruikt, is het ontwerp van Bitsocial erop gericht dat die persoon de uptime kan
uitbesteden zonder de identiteit zelf in bewaring te geven. Zie
[Identiteit en gemeenschapseigendom](/identity-and-ownership/).

### De host van de community

Hier liggen de twee het dichtst bij elkaar. Een Tlon-groep en een Bitsocial-community staan allebei
op de node van hun eigenaar. De host bepaalt wie mag posten, past moderatie toe en verspreidt het
resultaat, en geen van beide protocollen plaatst een moderator boven de host. In beide gevallen moet
de host online zijn. De FAQ van Tlon zegt dat als de host offline gaat, "de groep met hen mee
platgaat", en een Bitsocial-community kan geen nieuwe posts accepteren zolang haar node offline is.

Ze slaan inhoud verschillend op. Het schip van elk lid bewaart een kopie van de geschiedenis van de
groep, zodat leden kunnen blijven lezen wat ze al hebben ontvangen terwijl de host offline is. Een
Bitsocial-lezer haalt de nieuwste staat van de community op bij de node van de community of bij
peers die haar seeden, dus een offline community blijft leesbaar zolang peers haar hebben, maar het
netwerk bewaart alleen de nieuwste staat.

Een Tlon-groep heeft ook een ledenlijst, en de host kan de groep alleen op uitnodiging toegankelijk
maken. Een Bitsocial-community heeft geen lidmaatschap: iedereen kan haar lezen, en iedereen kan
proberen te posten, maar moet dan wel de challenge van de community doorstaan.

### Spam en identiteit

Urbit bestrijdt spam door identiteit schaars te maken. Het aantal planeten ligt vast en elke planeet
wordt uitgegeven door een ster. Gratis kometen omzeilen die schaarste, dus groepen die haar overeind
willen houden, weren ze: de documentatie van Urbit vermeldt dat sommige groepen kometen weigeren, en
een Tlon-groep kan met één instelling de hele rang van kometen verbannen. Zodra kometen
buitengesloten zijn, heeft een verbannen gebruiker een andere planeet van de eigenaar van een ster
nodig om terug te komen. Reputatie kan ook de hiërarchie volgen: Azimuth bevat een Censures-contract
waarmee sterrenstelsels en sterren ID's kunnen markeren. Omdat de schaarste in de adresruimte is
ingebouwd, werkt ze op dezelfde manier in elke groep die kometen weert.

Bitsocial-identiteiten zijn gratis sleutelparen. Elke community kiest haar eigen challenge voordat
ze een post accepteert, zoals een captcha, een betaling, een tokensaldo of een allowlist, en andere
communities kunnen anders kiezen. Zie [Aangepaste antispamuitdagingen](/custom-challenges/).

### Blockchain en governance

De identiteitslaag van Urbit is afhankelijk van Ethereum. De Azimuth-contracten leggen het eigendom
en de netwerksleutels van Layer 1 vast, Layer 2-transacties worden in batches op Ethereum geplaatst,
en de Galactic Senate kan het contract upgraden dat Azimuth bestuurt. Dezelfde 256 sterrenstelsels
zorgen ook voor het vinden van peers en het doorsturen van pakketten, zodat een vaste groep
identiteiten zowel de governance als een deel van de routering van het netwerk draagt.

Bitsocial-identiteiten zijn sleutelparen waarvoor geen registratie nodig is. `.bso`- en `.eth`-namen
zijn optionele aliassen die ernaar verwijzen. Peers worden gevonden via HTTP-routers die alleen
adressen van aanbieders teruggeven; iedereen kan zo'n router draaien, en clients kunnen van router
wisselen door hun configuratie aan te passen.

### Reikwijdte

Urbit is een computer voor algemeen gebruik. Een schip kan een Git-remote, een persoonlijke
kennisbank of AI-agents hosten, en Tlon Messenger is één programma van de vele. Bouwen voor Urbit
betekent meestal Hoon-apps schrijven voor Arvo. Bitsocial is een protocol voor openbare communities,
met apps zoals [5chan](/apps/5chan/) en [Seedit](/apps/seedit/). Het draait op de bestaande stack
(libp2p, IPFS en de browser) in plaats van die te vervangen, en de clients worden gebouwd met gewone
webtooling. Zie [Bouw je eigen client](/build-your-own-client/).

### Privéberichten

Hier is Urbit sterker. Directe berichten gaan rechtstreeks van het ene schip naar het andere, al het
verkeer tussen schepen is versleuteld, en groepen kunnen privé of geheim zijn. Tlon merkt op dat
berichten onderweg versleuteld zijn, maar onversleuteld op het schip worden opgeslagen. Bitsocial
richt zich op openbare communities en heeft nog geen ingebouwde privéberichten.

## Projectstatus

Urbit heeft een woelige periode achter de rug. In augustus 2024 ontsloeg de Urbit Foundation, de
non-profitorganisatie die de kernontwikkeling aanstuurt, haar uitvoerend directeur; oprichter Curtis
Yarvin keerde zonder formele titel terug om de strategie te leiden, verschillende kernontwikkelaars
vertrokken, en de reserves van de Foundation reikten nog maar enkele maanden,
[meldde CoinDesk](https://www.coindesk.com/tech/2024/08/21/wartime-ceo-urbits-founder-returns-in-shakeup-at-moonshot-software-project).
Yarvin stelde voor om Azimuth naar een bestaande layer 2 van Ethereum te verhuizen, met Base als
waarschijnlijke keuze, en fungibele "visum"-tokens uit te geven die in planeten kunnen worden
omgezet. In oktober 2026 beschrijft de
[ID-documentatie](https://docs.urbit.org/urbit-id/what-is-urbit-id) van Urbit nog altijd Azimuth op
Ethereum met zijn naive rollup. In oktober 2025 verving de Galactic Senate het bestuur van de
Foundation, en het nieuwe bestuur benoemde een nieuwe uitvoerend directeur
([aankondiging](https://urbit.org/blog/2025-a-new-epoch-for-the-forever-computer)).

De ontwikkeling gaat door. Directed Messaging ging op 14 juli 2026 live met release 408k. In juni
2026
[opende Tlon Messenger openbare aanmeldingen zonder wachtlijst](https://urbit.org/blog/this-month-in-urbit-june-2026),
en Tlon presenteert zichzelf nu als een plek waar mensen en AI-agents samenwerken.

## Vergelijking

| Vraag                  | Urbit                                                                                                              | Bitsocial                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Categorie              | Netwerk van persoonlijke servers en besturingssysteem                                                              | Peer-to-peer-netwerk van communities                                                                              |
| Identiteit             | Urbit ID's: ongeveer 4 miljard planeten op Ethereum of de Layer 2-rollup ervan, plus gratis kometen                | Ed25519-sleutelparen voor gebruikers en communities                                                               |
| Wie draait een server  | Elke gebruiker, op een eigen of gehost schip                                                                       | Community-eigenaren; lezers en posters kunnen een browsertabblad gebruiken                                        |
| Waar posts staan       | Het schip van de groepshost en een kopie op het schip van elk lid                                                  | De node van de community-eigenaar en de peers die de community lezen en seeden                                    |
| Communities            | Groepen gehost door het schip van hun maker, met ledenlijsten                                                      | Volwaardige objecten waarvan de node posts accepteert of weigert                                                  |
| Spambestrijding        | Schaarse ID's uitgegeven door sterren; groepen verbannen schepen of hele rangen                                    | De challenge van elke community voordat een post wordt geaccepteerd                                               |
| Moderatie              | De rollen en bans van de groepshost                                                                                | Community-eigenaren modereren hun community; apps kiezen wat ze tonen                                             |
| Peers vinden           | Sterrenstelsels houden de schepen onder hen bij en sturen pakketten voor hen door                                  | HTTP-routers geven aanbiedende peers terug en slaan geen inhoud op                                                |
| Governance             | De Galactic Senate van 256 sterrenstelsels stemt over upgrades van Azimuth                                         | Geen autoriteit op protocolniveau over identiteiten of communities                                                |
| Privéberichten         | Versleutelde directe berichten en groepen alleen op uitnodiging                                                    | Openbare communities; nog geen ingebouwde privéberichten                                                          |
| Belangrijkste afweging | Een complete persoonlijke computer met privégroepen, maar elke gebruiker heeft een schip nodig dat altijd aanstaat | Gratis identiteiten en toegang via de browser, maar geen privéberichten en alleen de nieuwste staat wordt bewaard |
