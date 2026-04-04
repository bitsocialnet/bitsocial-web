---
title: React Hooks
description: مكتبة React Hooks لبناء تطبيقات اجتماعية لامركزية على بروتوكول Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning التسمية التراثية
تستخدم هذه الحزمة حاليًا اصطلاحات التسمية القديمة الموروثة من شوكة المنبع الخاصة بها. سيتم ترحيل المراجع إلى "plebbit" في التعليمات البرمجية وواجهات برمجة التطبيقات والتكوين إلى "bitsocial" في إصدار مستقبلي. لم تتأثر الوظيفة.
:::

توفر الحزمة `bitsocial-react-hooks` واجهة برمجة تطبيقات React Hooks المألوفة للتفاعل مع بروتوكول Bitsocial. وهي تتعامل مع جلب الخلاصات، والتعليقات، وملفات تعريف المؤلفين، وإدارة الحسابات، ونشر المحتوى، والاشتراك في المجتمعات - كل ذلك دون الاعتماد على خادم مركزي.

هذه المكتبة هي الواجهة الأساسية التي يستخدمها [5chan](/apps/5chan/) وتطبيقات عميل Bitsocial الأخرى.

:::note
`bitsocial-react-hooks` عبارة عن شوكة مؤقتة لـ `plebbit/plebbit-react-hooks` يتم الحفاظ عليها للتطوير بمساعدة الذكاء الاصطناعي. يتم استهلاكها مباشرة من GitHub بدلاً من نشرها إلى npm.
:::

## التثبيت

نظرًا لأن الحزمة لم تصل بعد إلى npm، قم بتثبيتها مباشرة من GitHub، مع تثبيتها على تجزئة التزام محددة:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

استبدل `<commit-hash>` بالالتزام الذي تريد استهدافه.

## نظرة عامة على واجهة برمجة التطبيقات

تم تنظيم الخطافات في فئات وظيفية. فيما يلي ملخص للخطافات الأكثر استخدامًا في كل فئة. للحصول على التوقيعات الكاملة والمعلمات وأنواع الإرجاع، راجع [مرجع API الكامل على GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).

### الحسابات

إدارة حسابات المستخدمين المحلية والهوية والإعدادات.

- `useAccount(accountName?)` -- إرجاع كائن الحساب النشط (أو المسمى)
- `useAccounts()` -- إرجاع كافة الحسابات المخزنة محليًا
- `useAccountComments(options?)` -- إرجاع التعليقات المنشورة بواسطة الحساب النشط

### التعليقات

جلب التعليقات الفردية والتفاعل معها threads.

- `useComment(commentCid?)` -- يجلب تعليقًا واحدًا بواسطة معرف العميل (CID) الخاص به
- `useComments(commentCids?)` -- جلب تعليقات متعددة دفعة واحدة
- `useEditedComment(comment?)` -- إرجاع أحدث نسخة معدلة من التعليق

### المجتمعات

استرداد بيانات تعريف المجتمع وإعداداته.

- `useSubplebbit(subplebbitAddress?)` -- جلب المجتمع حسب العنوان
- `useSubplebbits(subplebbitAddresses?)` -- جلب مجتمعات متعددة
- `useSubplebbitStats(subplebbitAddress?)` - إرجاع عدد المشتركين والمشاركات

### المؤلفين

ابحث عن الملفات الشخصية للمؤلفين والبيانات الوصفية.

- `useAuthor(authorAddress?)` -- جلب ملف تعريف المؤلف
- `useAuthorComments(options?)` -- إرجاع التعليقات بواسطة مؤلف محدد
- `useResolvedAuthorAddress(authorAddress?)` -- يحل عنوانًا يمكن قراءته بواسطة الإنسان (على سبيل المثال، ENS) إلى عنوان البروتوكول الخاص به

### الخلاصات

الاشتراك في المحتوى وترقيم صفحاته الخلاصات.

- `useFeed(options?)` -- إرجاع موجز مرقّم للمشاركات من مجتمع واحد أو أكثر
- `useBufferedFeeds(feedOptions?)` -- يقوم بتخزين خلاصات متعددة مؤقتًا مسبقًا لعرض أسرع
- `useAuthorFeed(authorAddress?)` -- يعرض موجزًا للمشاركات التي كتبها مؤلف محدد

### الإجراءات

نشر المحتوى وإجراء عمليات الكتابة.

- `usePublishComment(options?)` -- نشر تعليق جديد أو الرد
- `usePublishVote(options?)` -- التصويت الإيجابي أو السلبي
- `useSubscribe(options?)` -- الاشتراك أو إلغاء الاشتراك من المجتمع

### الحالات وRPC

مراقبة حالة الاتصال والتفاعل مع برنامج Bitsocial البعيد.

- `useClientsStates(options?)` - إرجاع حالة الاتصال لعملاء IPFS/pubsub
- `usePlebbitRpcSettings()` - إرجاع تكوين برنامج RPC الحالي

## التطوير

للعمل على مكتبة الخطافات محليًا:

**المتطلبات الأساسية:** Node.js، تمكين Corepack، Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

ارجع إلى ملف README الخاص بالمستودع للاختبار و أوامر البناء.

## الروابط

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **الترخيص:** GPL-2.0 فقط
