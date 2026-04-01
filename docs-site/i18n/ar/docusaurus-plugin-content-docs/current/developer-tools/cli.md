---
title: سطر الأوامر
description: واجهة سطر الأوامر لتشغيل عقدة Bitsocial وإنشاء المجتمعات وإدارة عمليات البروتوكول.
sidebar_position: 2
---

# سطر الأوامر

:::warning Legacy Naming
تستخدم هذه الحزمة حاليًا اصطلاحات التسمية القديمة الموروثة من تبعيتها الأولية. سيتم ترحيل المراجع إلى "plebbit" في الأوامر والمخرجات والتكوين إلى "bitsocial" في إصدار مستقبلي. الوظيفة لا تتأثر.
:::

`bitsocial-cli` هي أداة سطر أوامر للتفاعل مع الواجهة الخلفية لبروتوكول Bitsocial. فهو يتيح لك تشغيل برنامج P2P محلي، وإنشاء المجتمعات وتكوينها، ونشر المحتوى - كل ذلك من الجهاز.

إنه مبني على `plebbit-js` ويستخدمه [5chan](/apps/5chan/) و[سيديت](/apps/seedit/) لإنشاء المجتمع وإدارة العقد.

## التثبيت

تتوفر الثنائيات المعدة مسبقًا لأنظمة التشغيل Windows وmacOS وLinux. قم بتنزيل أحدث إصدار لمنصتك من GitHub:

**[التنزيل من إصدارات GitHub](https://github.com/bitsocialnet/bitsocial-cli/releases)**

بعد التنزيل، اجعل الملف الثنائي قابلاً للتنفيذ (نظام التشغيل MacOS/Linux):

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

| الأمر               | الوصف                                           |
| ------------------- | ----------------------------------------------- |
| `daemon`            | ابدأ عقدة Bitsocial P2P                         |
| `create subplebbit` | إنشاء مجتمع جديد                                |
| `subplebbit edit`   | تحديث إعدادات المجتمع (العنوان، الوصف، القواعد) |
| `subplebbit list`   | قائمة المجتمعات المستضافة على هذه العقدة        |
| `subplebbit start`  | ابدأ بخدمة مجتمع محدد                           |
| `subplebbit stop`   | التوقف عن خدمة مجتمع محدد                       |

قم بتشغيل أي أمر باستخدام `--help` لرؤية الخيارات والأعلام المتاحة:

```bash
bitsocial-cli daemon --help
bitsocial-cli create subplebbit --help
```

## سير العمل النموذجي

مسار الإعداد المشترك لاستضافة مجتمع جديد:

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

المجتمع موجود الآن على شبكة Bitsocial ويمكن الوصول إليه من أي عميل متوافق.

## روابط

- **GitHub:** [bitsocialnet/bitsocial-cli](https://github.com/bitsocialnet/bitsocial-cli)
