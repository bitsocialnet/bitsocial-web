---
title: CLI
description: واجهة سطر الأوامر لتشغيل عقدة Bitsocial وإنشاء المجتمعات وإدارة عمليات البروتوكول.
sidebar_position: 2
---

# CLI

:::warning التسمية التراثية
تستخدم هذه الحزمة حاليًا اصطلاحات التسمية القديمة الموروثة من تبعيتها الأولية. سيتم ترحيل المراجع إلى "plebbit" في الأوامر والمخرجات والتكوين إلى "bitsocial" في إصدار مستقبلي. لم تتأثر الوظيفة.
:::

`bitsocial-cli` هي أداة سطر أوامر للتفاعل مع الواجهة الخلفية لبروتوكول Bitsocial. فهو يتيح لك تشغيل برنامج P2P محلي، وإنشاء المجتمعات وتكوينها، ونشر المحتوى - كل ذلك من الوحدة الطرفية.

تم إنشاؤه فوق `plebbit-js` ويستخدمه [5chan](/apps/5chan/) و[Seedit](/apps/seedit/) لإنشاء المجتمع وإدارة العقد.

## التثبيت

تتوفر الثنائيات المعدة مسبقًا لأنظمة Windows وmacOS وLinux. قم بتنزيل أحدث إصدار لنظامك الأساسي من GitHub:

**[التنزيل من إصدارات GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

بعد التنزيل، اجعل الملف الثنائي قابلاً للتنفيذ (macOS/Linux):

```bash
chmod +x bitsocial-cli
```

## تشغيل البرنامج الخفي

الاستخدام الأكثر شيوعًا لـ CLI هو تشغيل عقدة Bitsocial. يبدأ البرنامج الخفي طبقة شبكة P2P ويكشف عن واجهة برمجة التطبيقات المحلية التي يمكن للعملاء الاتصال بها.

```bash
bitsocial-cli daemon
```

عند التشغيل لأول مرة، يقوم البرنامج الخفي بإخراج الروابط إلى **WebUI**، وهي واجهة رسومية قائمة على المتصفح لإدارة العقدة والمجتمعات والإعدادات. يعد هذا مفيدًا إذا كنت تفضل واجهة المستخدم الرسومية على الأوامر الطرفية.

## الأوامر الرئيسية

| يأمر                | وصف                                             |
| ------------------- | ----------------------------------------------- |
| `daemon`            | ابدأ عقدة Bitsocial P2P                         |
| `create subplebbit` | إنشاء مجتمع جديد                                |
| `subplebbit edit`   | تحديث إعدادات المجتمع (العنوان والوصف والقواعد) |
| `subplebbit list`   | قائمة المجتمعات المستضافة على هذه العقدة        |
| `subplebbit start`  | البدء في خدمة مجتمع معين                        |
| `subplebbit stop`   | التوقف عن خدمة مجتمع معين                       |

قم بتشغيل أي أمر باستخدام `--help` لرؤية الخيارات والأعلام المتاحة:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## سير العمل النموذجي

تدفق الإعداد الشائع لاستضافة مجتمع جديد:

```bash
# 1. Start the daemon
bitsocial-cli daemon

# 2. In another terminal, create a community
bitsocial-cli create subplebbit

# 3. Configure the community
bitsocial-cli subplebbit edit <address> --title "My Community" --description "A decentralized forum"

# 4. Start serving it
bitsocial-cli subplebbit start <address>
```

المجتمع موجود الآن على شبكة Bitsocial ويمكن الوصول إليه من أي شبكة متوافقة العميل.

## الروابط

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
