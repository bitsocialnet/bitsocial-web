---
title: Voucher Challenge
description: Topluluk sahipleri tarafından dağıtılan benzersiz kupon kodlarının arkasında yayınlamayı engelleyen anti-spam mücadelesi.
sidebar_position: 3
---

# Voucher Challenge

Kupon Mücadelesi, benzersiz kupon kodlarının ardında içerik yayınlanmasını engelleyen bir anti-spam mekanizmasıdır. Otomatik algılamaya güvenmek yerine, güveni, kodları güvendikleri kişilere manuel olarak dağıtan topluluk sahibine kaydırır.

**Kaynak kodu:** [github.com/bitsocialnet/voucher-challenge](https://github.com/bitsocialnet/voucher-challenge)

## Nasıl Çalışır?

1. Bir topluluk sahibi bir veya daha fazla benzersiz kupon kodu oluşturur.
2. Sahibi, bu kodları güvenilir yazarlara kendi seçtikleri bir kanal aracılığıyla (doğrudan mesaj, e-posta, şahsen vb.) dağıtır.
3. Bir yazar yayınlamaya çalıştığında, meydan okuma sistemi ondan bir kupon kodu ister.
4. Kod doğrulanır; orijinalse ve henüz kullanılmamışsa yayın kabul edilir.

Her kupon kodu, kullanıldıktan sonra belirli bir yazara bağlanır ve başkaları tarafından yeniden kullanılması engellenir.

## Ne Zaman Kullanılmalı?

Kupon Yarışması aşağıdakiler için en uygunudur:

- Üyeliğin kasıtlı olarak kısıtlandığı **yalnızca davetli toplulukları**.
- Sahibinin her katılımcıyı kişisel olarak incelediği **özelleştirilmiş alanlar**.
- Otomatik spam puanlamanın gereksiz veya istenmediği **yüksek güven ortamları**.

Manuel kod dağıtımı gerektirdiğinden büyük açık topluluklara ölçeklenemez. Bu senaryolar için bunun yerine [Spam Blocker](./spam-blocker.md) veya [EVM Contract Call Challenge](./evm-contract-call.md) seçeneğini düşünün.

## Entegrasyon

Voucher Challenge, Bitsocial ekosistemindeki diğer anti-spam paketleri tarafından kullanılan aynı sorgulama arayüzüne bağlanır. Topluluk sahipleri bunu kendi topluluk ayarları aracılığıyla etkinleştirir ve meydan okuma, gönderi paylaşmaya çalıştıklarında yazarlara otomatik olarak sunulur.
