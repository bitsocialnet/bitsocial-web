---
title: Bitsocial dhe Reticulum
description: Si krahasohet Reticulum, grumbulli kriptografik i rrjetëzimit për LoRa dhe lidhje të tjera me brez të ngushtë, me Bitsocial, dhe nëse Bitsocial mund të funksionojë mbi të.
---

# Bitsocial dhe Reticulum

[Reticulum](https://reticulum.network/) është një grumbull rrjetëzimi i bazuar në kriptografi për
ndërtimin e rrjeteve mbi çfarëdo bartësi që është në dispozicion: radio LoRa, radio me paketa,
lidhje serike, Wi-Fi, Ethernet, TCP, UDP ose I2P. Ai përmendet shpesh pranë Bitsocial, sepse që të
dy e heqin kompaninë që qëndron në mes. Megjithatë e bëjnë këtë në shtresa të ndryshme, prandaj e
plotësojnë njëri-tjetrin dhe nuk janë konkurrentë.

## Shtresa të ndryshme

Reticulum zëvendëson shtresën e rrjetit. Ai u jep aplikacioneve pika fundore të enkriptuara dhe të
rrugëzueshme pa adresa IP, DNS, autoritete certifikimi apo llogari, dhe është projektuar që të
vazhdojë të funksionojë edhe në lidhje aq të ngadalta sa 5 bit në sekondë, me një MTU prej 500
bajtësh. Ai nuk përcakton postime, komunitete apo moderim; këto i shtojnë aplikacionet që ndërtohen
mbi të.

Bitsocial është një protokoll social. Ai funksionon mbi grumbullin IPFS/libp2p përmes lidhjeve të
zakonshme me internetin, përfshirë edhe nga një skedë shfletuesi, dhe përcakton komunitetet,
publikimet dhe sfidat kundër spamit për secilin komunitet. Shihni
[Protokolli Peer-to-Peer](/peer-to-peer-protocol/) dhe [Peer-to-Peer në shfletues](/browser-p2p/).

Në grumbullin e Bitsocial, Reticulum do të zinte përafërsisht vendin e libp2p-së, jo vendin e
protokollit Bitsocial.

## Si funksionon Reticulum

- **Identitetet.** Një identitet Reticulum është një grup çelësash 512-bitësh: një çelës X25519 për
  enkriptimin dhe një çelës Ed25519 për nënshkrimet.
- **Destinacionet.** Aplikacionet krijojnë destinacione, të adresuara me një hash SHA-256 të
  shkurtuar në 16 bajt. Paketat nuk mbartin adresë burimi.
- **Njoftimet.** Një destinacion bëhet i arritshëm kur dërgon një njoftim (announce). Nyjet e
  transportit e përcjellin njoftimin dhe mbajnë mend hapin e radhës në rrugën e kthimit, kështu që
  asnjë nyje nuk ka nevojë për hartën e të gjithë rrjetit.
- **Enkriptimi.** Trafiku enkriptohet si parazgjedhje, me çelësa efemerë dhe fshehtësi të përparme
  (forward secrecy).
- **LXMF.** Shtresa e mesazhimit [LXMF](https://github.com/markqvist/LXMF) shton mesazhe të
  nënshkruara, dorëzim të drejtpërdrejtë dhe ruajtje-e-përcjellje përmes nyjeve të përhapjes për
  marrësit që janë jashtë linje.

Ndër aplikacionet e ndërtuara në këtë mënyrë janë [Sideband](https://github.com/markqvist/Sideband)
për mesazhim dhe [Nomad Network](https://github.com/markqvist/NomadNet) për mesazhim dhe faqe të
strehuara. Manuali i Reticulum mban një
[listë programesh](https://reticulum.network/manual/software.html).

## Krahasimi

| Pyetja                | Reticulum                                                                                                                              | Bitsocial                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Çfarë është           | Grumbull rrjetëzimi                                                                                                                    | Protokoll social peer-to-peer dhe aplikacione                                                                           |
| I projektuar për      | Çdo bartës, deri te lidhjet e ngadalta radio                                                                                           | Lidhje me internetin, përfshirë skedat e shfletuesit                                                                    |
| Identiteti            | Grup çelësash X25519 dhe Ed25519                                                                                                       | Çifte çelësash Ed25519 për përdoruesit dhe komunitetet                                                                  |
| Adresat               | Hash i një identiteti dhe i emrit të aplikacionit                                                                                      | Hash i çelësit publik të një komuniteti                                                                                 |
| Gjetja e një homologu | Njoftime të përhapura nga nyjet e transportit                                                                                          | Ruterët HTTP kthejnë homologët ofrues                                                                                   |
| Veçoritë sociale      | I shtojnë aplikacione si Nomad Network                                                                                                 | Komunitetet, postimet, përgjigjet dhe moderimi janë pjesë e protokollit                                                 |
| Kontrolli i spamit    | Kufizime shpejtësie për njoftimet në çdo ndërfaqe; vula LXMF me provë pune (proof-of-work) që një marrës ose një nyje mund t'i kërkojë | Sfida e secilit komunitet përpara se një postim të pranohet                                                             |
| Dorëzimi jashtë linje | Nyjet e përhapjes LXMF i ruajnë dhe i përcjellin mesazhet                                                                              | Homologët vazhdojnë të shërbejnë gjendjen më të fundit të një komuniteti; publikimi kërkon që nyja e tij të jetë online |

## A mund të funksionojë Bitsocial mbi Reticulum?

Jo sot. Bitsocial nuk ka transport për Reticulum, dhe modeli i tij i të dhënave supozon gjerësi
brezi interneti: një klient merr meta të dhënat e komunitetit dhe përmbajtjen e postimeve nga
homologët dhe shkëmben mesazhe pubsub, gjë që përshtatet keq me lidhje të ndërtuara rreth paketave
500-bajtëshe dhe me xhiro që matet në bit ose kilobit në sekondë.

Rruga realiste është më e ngushtë: një klient që funksionon mbi një rrjet lokal mesh kur është i
shkëputur, dhe që më pas sinkronizohet me rrjetin më të gjerë Bitsocial sapo arrin një homolog ose
një portë me qasje në internet. Kjo do të kërkonte një klient dhe një urë të re, jo një ndryshim në
protokoll, dhe nuk është pjesë e planit aktual të zhvillimit.

## Për ndërtuesit

Reticulum publikohet nën [Licencën Reticulum](https://reticulum.network/manual/license.html): kushte
të stilit MIT plus dy kufizime. Softueri nuk mund të përdoret në sisteme të projektuara për t'u
shkaktuar dëm njerëzve, as për krijimin e grupeve të të dhënave për trajnimin e AI-së ose të mësimit
makinerik. Lexojeni përpara se të përfshini kod të Reticulum në një aplikacion Bitsocial.

Zbatimi referencë është [shkruar në Python](https://github.com/markqvist/Reticulum). Mirëmbajtësit e
Reticulum paralajmërojnë se disa përshtatje jozyrtare të Reticulum dhe LXMF janë gjeneruar nga
makina dhe mbartin pretendime licence që ata i konsiderojnë të pavlefshme, prandaj preferoni
zbatimin referencë ose programet e listuara në manual.
