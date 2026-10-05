---
title: Ang Bitsocial at ang Reticulum
description: Kung paano maihahambing sa Bitsocial ang Reticulum, ang kriptograpikong networking stack para sa LoRa at iba pang link na mababa ang bandwidth, at kung maaaring tumakbo ang Bitsocial sa ibabaw nito.
---

# Ang Bitsocial at ang Reticulum

Ang [Reticulum](https://reticulum.network/) ay isang networking stack na nakabatay sa kriptograpiya
para sa pagbuo ng mga network sa ibabaw ng anumang carrier na available: mga LoRa radio, packet
radio, mga serial link, Wi-Fi, Ethernet, TCP, UDP o I2P. Madalas itong mabanggit kasabay ng
Bitsocial dahil pareho nilang inaalis ang kumpanyang nakapagitna. Ginagawa nila ito sa magkaibang
layer, kaya nagpupunuan sila sa halip na magkakumpitensya.

## Magkaibang layer

Pinapalitan ng Reticulum ang network layer. Binibigyan nito ang mga application ng mga naka-encrypt
na endpoint na maaaring i-route nang walang IP address, DNS, certificate authority o account, at
dinisenyo ito upang patuloy na gumana kahit sa mga link na kasimbagal ng 5 bit bawat segundo na may
500-byte na MTU. Hindi nito tinutukoy ang mga post, komunidad o pagmo-moderate; ang mga application
na itinayo sa ibabaw nito ang nagdaragdag ng mga iyon.

Ang Bitsocial ay isang social protocol. Tumatakbo ito sa IPFS/libp2p stack sa ibabaw ng mga
ordinaryong koneksyon sa internet, kabilang ang mula sa isang browser tab, at tinutukoy nito ang mga
komunidad, mga publikasyon at mga anti-spam na hamon para sa bawat komunidad. Tingnan ang
[Protokol ng Peer-to-Peer](/peer-to-peer-protocol/) at
[Peer-to-Peer sa Browser](/browser-p2p/).

Sa stack ng Bitsocial, mapupuwesto ang Reticulum humigit-kumulang sa kinalalagyan ng libp2p, hindi
sa kinalalagyan ng protocol ng Bitsocial.

## Paano gumagana ang Reticulum

- **Mga identity.** Ang identity sa Reticulum ay isang 512-bit na keyset: isang X25519 key para sa
  encryption at isang Ed25519 key para sa mga pirma.
- **Mga destination.** Gumagawa ang mga application ng mga destination, na naka-address gamit ang
  SHA-256 hash na pinaikli sa 16 na byte. Walang dalang source address ang mga packet.
- **Mga announce.** Nagiging naaabot ang isang destination sa pamamagitan ng pagpapadala ng announce.
  Ipinapasa ito ng mga transport node at tinatandaan nila ang susunod na hop pabalik, kaya walang
  node na nangangailangan ng mapa ng buong network.
- **Encryption.** Naka-encrypt ang trapiko bilang default, gamit ang mga ephemeral key at forward
  secrecy.
- **LXMF.** Nagdaragdag ang messaging layer na [LXMF](https://github.com/markqvist/LXMF) ng mga
  pirmadong mensahe, direktang paghahatid, at store-and-forward sa pamamagitan ng mga propagation
  node para sa mga tatanggap na offline.

Kabilang sa mga application na binuo sa ganitong paraan ang
[Sideband](https://github.com/markqvist/Sideband) para sa pagmemensahe at ang
[Nomad Network](https://github.com/markqvist/NomadNet) para sa pagmemensahe at mga naka-host na
pahina. Nagpapanatili ang manwal ng Reticulum ng
[listahan ng mga programa](https://reticulum.network/manual/software.html).

## Paghahambing

| Tanong                  | Reticulum                                                                                                                     | Bitsocial                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ano ito                 | Networking stack                                                                                                              | Peer-to-peer na social protocol at mga app                                                                                  |
| Dinisenyo para sa       | Anumang carrier, hanggang sa mabagal na mga radio link                                                                        | Mga koneksyon sa internet, kabilang ang mga browser tab                                                                     |
| Identity                | Keyset na X25519 at Ed25519                                                                                                   | Mga Ed25519 keypair para sa mga user at komunidad                                                                           |
| Mga address             | Hash ng isang identity at ng pangalan ng application                                                                          | Hash ng pampublikong key ng isang komunidad                                                                                 |
| Paghahanap ng peer      | Mga announce na ikinakalat ng mga transport node                                                                              | Nagbabalik ang mga HTTP router ng mga provider peer                                                                         |
| Mga social na feature   | Idinaragdag ng mga application gaya ng Nomad Network                                                                          | Mga komunidad, post, sagot at pagmo-moderate sa loob mismo ng protocol                                                      |
| Kontrol sa spam         | Mga limitasyon sa rate ng announce bawat interface; mga LXMF proof-of-work stamp na maaaring hingin ng isang tatanggap o node | Ang hamon ng bawat komunidad bago tanggapin ang isang post                                                                  |
| Paghahatid nang offline | Nag-iimbak at nagpapasa ng mga mensahe ang mga LXMF propagation node                                                          | Patuloy na inihahatid ng mga peer ang pinakabagong estado ng komunidad; kailangang online ang node nito para makapaglathala |

## Maaari bang tumakbo ang Bitsocial sa ibabaw ng Reticulum?

Hindi sa ngayon. Walang Reticulum transport ang Bitsocial, at ipinapalagay ng data model nito ang
bandwidth ng internet: kumukuha ang isang kliyente ng metadata ng komunidad at nilalaman ng post
mula sa mga peer at nakikipagpalitan ng mga mensahe ng pubsub, na hindi gaanong akma sa mga link na
nakabatay sa 500-byte na packet at sa throughput na sinusukat sa bit o kilobit bawat segundo.

Mas makitid ang makatotohanang landas: isang kliyenteng gumagana sa isang lokal na mesh habang
walang koneksyon, at saka nagsi-sync sa mas malawak na network ng Bitsocial kapag naaabot na ang
isang peer o gateway na may access sa internet. Bagong kliyente at bridge iyon sa halip na pagbabago
sa protocol, at wala ito sa kasalukuyang roadmap.

## Para sa mga tagabuo

Inilathala ang Reticulum sa ilalim ng
[Reticulum License](https://reticulum.network/manual/license.html): mga tuntuning katulad ng MIT
kasama ang dalawang paghihigpit. Hindi maaaring gamitin ang software sa mga sistemang dinisenyo
upang manakit ng tao, o sa paglikha ng mga training dataset para sa AI o machine learning. Basahin
ito bago isama ang code ng Reticulum sa isang Bitsocial app.

Ang reference implementation ay [nakasulat sa Python](https://github.com/markqvist/Reticulum).
Nagbababala ang mga maintainer ng Reticulum na ilang hindi opisyal na port ng Reticulum at LXMF ang
gawa ng makina at may dalang mga pahayag tungkol sa lisensya na itinuturing nilang walang bisa, kaya
mas piliin ang reference implementation o ang mga programang nakalista sa manwal.
