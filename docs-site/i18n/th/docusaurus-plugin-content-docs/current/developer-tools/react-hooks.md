---
title: ตอบสนองฮุคส์
description: React hooks ไลบรารี่สำหรับการสร้างแอปพลิเคชันโซเชียลแบบกระจายอำนาจบนโปรโตคอล Bitsocial
sidebar_position: 1
---

# ตอบสนองฮุคส์

:::warning Legacy Naming
ปัจจุบันแพ็คเกจนี้ใช้แบบแผนการตั้งชื่อแบบเดิมที่สืบทอดมาจากทางแยกอัปสตรีม การอ้างอิงถึง "plebbit" ในโค้ด, API และการกำหนดค่าจะถูกย้ายไปยัง "bitsocial" ในรุ่นต่อๆ ไป ฟังก์ชันการทำงานไม่ได้รับผลกระทบ
:::

แพ็คเกจ `bitsocial-react-hooks` มอบ React hooks API ที่คุ้นเคยสำหรับการโต้ตอบกับโปรโตคอล Bitsocial โดยจัดการการดึงฟีด ความคิดเห็น และโปรไฟล์ผู้เขียน จัดการบัญชี การเผยแพร่เนื้อหา และการสมัครรับข้อมูลจากชุมชน ทั้งหมดนี้โดยไม่ต้องอาศัยเซิร์ฟเวอร์กลาง

ไลบรารีนี้เป็นอินเทอร์เฟซหลักที่ใช้โดย [5chan](/apps/5chan/) และแอปพลิเคชันไคลเอ็นต์ Bitsocial อื่นๆ

:::note
`bitsocial-react-hooks` เป็นตัวแยกชั่วคราวของ `plebbit/plebbit-react-hooks` ที่ดูแลรักษาไว้เพื่อการพัฒนาโดยใช้ AI มันถูกใช้โดยตรงจาก GitHub แทนที่จะเผยแพร่เป็น npm
:::

## การติดตั้ง

เนื่องจากแพ็กเกจยังไม่ถึงเวลา npm ให้ติดตั้งโดยตรงจาก GitHub โดยปักหมุดไว้ที่คอมมิตแฮชเฉพาะ:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

แทนที่ `<commit-hash>` ด้วยคอมมิตที่คุณต้องการกำหนดเป้าหมาย

## ภาพรวมของ API

ตะขอถูกจัดเป็นหมวดหมู่ตามการใช้งาน ด้านล่างนี้คือบทสรุปของตะขอที่ใช้บ่อยที่สุดในแต่ละประเภท สำหรับลายเซ็น พารามิเตอร์ และประเภทการส่งคืนที่สมบูรณ์ โปรดดู [การอ้างอิง API บน GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### บัญชี

จัดการบัญชีผู้ใช้ภายใน ข้อมูลประจำตัว และการตั้งค่า

- `useAccount(accountName?)` -- ส่งคืนออบเจ็กต์บัญชีที่ใช้งานอยู่ (หรือที่มีชื่อ)
- `useAccounts()` -- ส่งคืนบัญชีที่จัดเก็บไว้ในเครื่องทั้งหมด
- `useAccountComments(options?)` -- ส่งคืนความคิดเห็นที่เผยแพร่โดยบัญชีที่ใช้งานอยู่

### ความคิดเห็น

ดึงข้อมูลและโต้ตอบกับความคิดเห็นและกระทู้แต่ละรายการ

- `useComment(commentCid?)` -- ดึงความคิดเห็นเดียวจาก CID
- `useComments(commentCids?)` -- ดึงความคิดเห็นหลายรายการเป็นชุด
- `useEditedComment(comment?)` -- ส่งคืนความคิดเห็นเวอร์ชันแก้ไขล่าสุด

### ชุมชน

ดึงข้อมูลเมตาของชุมชนและการตั้งค่า

- `useSubplebbit(subplebbitAddress?)` -- ดึงข้อมูลจากชุมชนตามที่อยู่
- `useSubplebbits(subplebbitAddresses?)` -- ดึงข้อมูลหลายชุมชน
- `useSubplebbitStats(subplebbitAddress?)` -- ส่งคืนสมาชิกและจำนวนโพสต์

### ผู้เขียน

ค้นหาโปรไฟล์ผู้เขียนและข้อมูลเมตา

- `useAuthor(authorAddress?)` -- ดึงข้อมูลโปรไฟล์ผู้เขียน
- `useAuthorComments(options?)` -- ส่งคืนความคิดเห็นโดยผู้เขียนที่ระบุ
- `useResolvedAuthorAddress(authorAddress?)` -- แก้ไขที่อยู่ที่มนุษย์สามารถอ่านได้ (เช่น ENS) เป็นที่อยู่โปรโตคอล

### ฟีด

สมัครสมาชิกและแบ่งหน้าฟีดเนื้อหา

- `useFeed(options?)` -- ส่งคืนฟีดที่มีการแบ่งหน้าของโพสต์จากชุมชนตั้งแต่หนึ่งชุมชนขึ้นไป
- `useBufferedFeeds(feedOptions?)` -- บัฟเฟอร์ล่วงหน้าหลายฟีดเพื่อการเรนเดอร์ที่เร็วขึ้น
- `useAuthorFeed(authorAddress?)` -- ส่งคืนฟีดของโพสต์โดยผู้เขียนที่ระบุ

### การดำเนินการ

เผยแพร่เนื้อหาและดำเนินการเขียน

- `usePublishComment(options?)` -- เผยแพร่ความคิดเห็นใหม่หรือการตอบกลับ
- `usePublishVote(options?)` -- ลงคะแนนเห็นด้วยหรือไม่เห็นด้วย
- `useSubscribe(options?)` -- สมัครสมาชิกหรือยกเลิกการสมัครจากชุมชน

### รัฐและ RPC

ตรวจสอบสถานะการเชื่อมต่อและโต้ตอบกับ Bitsocial daemon ระยะไกล

- `useClientsStates(options?)` -- ส่งคืนสถานะการเชื่อมต่อของไคลเอ็นต์ IPFS/pubsub
- `usePlebbitRpcSettings()` -- ส่งคืนการกำหนดค่า RPC daemon ปัจจุบัน

## การพัฒนา

หากต้องการทำงานกับไลบรารี hooks ในเครื่อง:

**สิ่งที่จำเป็นต้องมี:** Node.js, เปิดใช้งาน Corepack, Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

อ้างถึงพื้นที่เก็บข้อมูล README สำหรับคำสั่งทดสอบและสร้าง

## ลิงค์

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **ใบอนุญาต:** GPL-2.0-เท่านั้น
