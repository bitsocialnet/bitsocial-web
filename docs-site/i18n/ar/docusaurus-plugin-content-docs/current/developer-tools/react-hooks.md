---
title: رد فعل السنانير
description: مكتبة React Hooks لبناء تطبيقات اجتماعية لامركزية على بروتوكول Bitsocial.
sidebar_position: 1
---

# رد فعل السنانير

:::warning Legacy Naming
تستخدم هذه الحزمة حاليًا اصطلاحات التسمية القديمة الموروثة من شوكة المنبع الخاصة بها. سيتم ترحيل المراجع إلى "plebbit" في التعليمات البرمجية وواجهات برمجة التطبيقات والتكوين إلى "bitsocial" في إصدار مستقبلي. الوظيفة لا تتأثر.
:::

توفر الحزمة `bitsocial-react-hooks` واجهة برمجة تطبيقات React Hooks المألوفة للتفاعل مع بروتوكول Bitsocial. فهو يتعامل مع جلب الخلاصات والتعليقات وملفات تعريف المؤلف وإدارة الحسابات ونشر المحتوى والاشتراك في المجتمعات - كل ذلك دون الاعتماد على خادم مركزي.

هذه المكتبة هي الواجهة الأساسية التي يستخدمها [5chan](/apps/5chan/) وتطبيقات عميل Bitsocial الأخرى.

:::note
`bitsocial-react-hooks` عبارة عن شوكة مؤقتة لـ `plebbit/plebbit-react-hooks` تم صيانتها للتطوير بمساعدة الذكاء الاصطناعي. يتم استهلاكه مباشرة من GitHub بدلاً من نشره على npm.
:::

## التثبيت

نظرًا لأن الحزمة لم تصل بعد إلى npm، قم بتثبيتها مباشرة من GitHub، مع تثبيتها على تجزئة التزام محددة:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

استبدل `<commit-hash>` بالالتزام الذي تريد استهدافه.

## نظرة عامة على واجهة برمجة التطبيقات

يتم تنظيم الخطافات في فئات وظيفية. فيما يلي ملخص للخطافات الأكثر استخدامًا في كل فئة. للحصول على التوقيعات الكاملة والمعلمات وأنواع الإرجاع، راجع [مرجع API الكامل على GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks).)

### الحسابات

إدارة حسابات المستخدمين المحليين والهوية والإعدادات.

- `useAccount(accountName?)` - إرجاع كائن الحساب النشط (أو المسمى).
- `useAccounts()` - إرجاع جميع الحسابات المخزنة محليًا
- `useAccountComments(options?)` - إرجاع التعليقات المنشورة بواسطة الحساب النشط

### التعليقات

جلب والتفاعل مع التعليقات والمواضيع الفردية.

- `useComment(commentCid?)` - يجلب تعليقًا واحدًا بواسطة CID الخاص به
- `useComments(commentCids?)` - جلب تعليقات متعددة دفعة واحدة
- `useEditedComment(comment?)` - يعرض أحدث نسخة معدلة من التعليق

### المجتمعات

استرداد البيانات التعريفية والإعدادات للمجتمع.

- `useSubplebbit(subplebbitAddress?)` - جلب المجتمع حسب العنوان
- `useSubplebbits(subplebbitAddresses?)` - جلب مجتمعات متعددة
- `useSubplebbitStats(subplebbitAddress?)` - يعرض عدد المشتركين والمشاركات

### المؤلفون

ابحث عن الملفات الشخصية للمؤلفين والبيانات الوصفية.

- `useAuthor(authorAddress?)` - جلب ملف تعريف المؤلف
- `useAuthorComments(options?)` - إرجاع التعليقات بواسطة مؤلف محدد
- `useResolvedAuthorAddress(authorAddress?)` - يحل العنوان الذي يمكن قراءته بواسطة الإنسان (على سبيل المثال، ENS) إلى عنوان البروتوكول الخاص به

### يغذي

الاشتراك في خلاصات المحتوى وترقيم صفحاتها.

- `useFeed(options?)` - يعرض موجزًا مرقّمًا للمشاركات من مجتمع واحد أو أكثر
- `useBufferedFeeds(feedOptions?)` - يقوم بتخزين خلاصات متعددة مؤقتًا مسبقًا لعرض أسرع
- `useAuthorFeed(authorAddress?)` - يعرض موجزًا للمشاركات التي كتبها مؤلف محدد

### الإجراءات

نشر المحتوى وتنفيذ عمليات الكتابة.

- `usePublishComment(options?)` - نشر تعليق أو رد جديد
- `usePublishVote(options?)` - قم بالتصويت الإيجابي أو السلبي
- `useSubscribe(options?)` - الاشتراك أو إلغاء الاشتراك في المجتمع

### الدول وRPC

مراقبة حالة الاتصال والتفاعل مع برنامج Bitsocial البعيد.

- `useClientsStates(options?)` - يُرجع حالة الاتصال لعملاء IPFS/pubsub
- `usePlebbitRpcSettings()` - إرجاع التكوين الخفي الحالي لـ RPC

## التنمية

للعمل على مكتبة الخطافات محليًا:

**المتطلبات الأساسية:** Node.js، تمكين Corepack، Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

ارجع إلى الملف README الخاص بالمستودع للحصول على أوامر الاختبار والإنشاء.

## روابط

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **الترخيص:** GPL-2.0 فقط
