---
title: Vytvořte si vlastního klienta Bitsocial
description: Průvodce pro tvůrce, kteří chtějí vydat nezávislé klienty Bitsocial, od imageboardů a fór po specializované sociální aplikace.
---

# Vytvořte si vlastního klienta Bitsocial

Bitsocial nezvítězí tím, že bude mít jednu oficiální aplikaci pro každý účel. Zvítězí ve chvíli, kdy
bude mnoho klientů sdílet stejný protokol a zároveň spolu soupeřit v rozhraní, kultuře, objevování
obsahu, výchozím nastavení a obchodním modelu.

5chan a Seedit jsou první důkazy, ne strop. Tvůrce by měl být schopen vydat nový imageboard, fórum,
profilového klienta, mobilně orientovanou sociální aplikaci, nástroj pro úzce zaměřenou komunitu
nebo centralizovaného klienta, který pod kapotou používá Bitsocial, aniž by k tomu potřeboval
svolení vlastníka platformy.

## Co mohou tvůrci měnit

Klient Bitsocial může soupeřit v produktových rozhodnutích, aniž by musel forkovat celou síť:

- rozhraní a vizuální jazyk
- průběh onboardingu
- výchozí nastavení komunit
- moderační rozhraní
- model objevování obsahu
- práce s médii
- omezení mobilních, desktopových nebo nízkopásmových prostředí
- monetizace a obchodní model

Společnou vrstvou je protokol. Produktová vrstva je otevřená konkurenci.

## Nejrychlejší způsob, jak se to naučit

Začněte u aplikací, které už existují:

- Vyzkoušejte [5chan](https://5chan.app) pro anonymní imageboardové komunity.
- Vyzkoušejte [Seedit](https://seedit.app) pro diskuse ve stylu Redditu.
- Přečtěte si dokumentaci [React hooků pro Bitsocial](https://hooks.bitsocial.net/docs/quickstart/) k integraci na
  straně klienta.
- Přečtěte si dokumentaci [Bitsocial CLI](/developer-tools/cli/) k provozu uzlu a správě komunit.

Pokud chcete postupovat rychle, přispějte nejdřív do některé existující aplikace. Pokud vám
rozhraní, kultura ani model komunity nevyhovují, postavte samostatného klienta.

## Zvolte úzce vymezenou první verzi

Nejlepší první verze není univerzální sociální aplikace. Je to klient s jedním jasným publikem a
jedním silným důvodem k existenci.

Dobré výchozí body jsou například:

- přehlednější imageboardový klient pro jednu konkrétní kulturu
- fórový klient primárně pro mobily
- aplikace pro jedinou komunitu s přísným výchozím nastavením
- klient pro komunity tvůrců
- klient jen pro čtení zaměřený na objevování obsahu
- moderační nebo operátorská konzole
- klient optimalizovaný pro určitý jazyk, region nebo třídu zařízení

Malí klienti dávají smysl, protože Bitsocial jim umožňuje růst v rámci téže sítě, místo aby své
uživatele uzavírali do soukromé databáze.

## Cesty k implementaci

Existují tři praktické cesty:

1. Forkněte existujícího klienta, pokud je váš nápad blízký 5chanu nebo Seeditu.
2. Postavte nového React klienta s [React hooky pro Bitsocial](https://hooks.bitsocial.net/).
3. Postavte vlastní integraci nad API uzlu a veřejnou RPC infrastrukturou.

Veřejné RPC by mělo třetí cestu výrazně zpraktičtit. Uživatel může začít u hostovaného
nekustodiálního poskytovatele RPC a později přejít na vlastní hosting nebo ke konkurenčnímu
poskytovateli.

## Návrhový princip

Postavte klienta, který by pro vaši komunitu měl existovat, a pak nechte kompatibilní klienty
soupeřit na veřejnosti.
