---
title: React Hooks
description: کتابخانه React hooks برای ساخت برنامه های اجتماعی غیرمتمرکز بر روی پروتکل Bitsocial.
sidebar_position: 1
---

# React Hooks

:::warning نامگذاری میراث
این بسته در حال حاضر از قراردادهای نامگذاری قدیمی استفاده می کند که از فورک بالادست آن به ارث رسیده است. ارجاعات به "plebbit" در کد، APIها و پیکربندی در نسخه بعدی به "bitsocial" منتقل خواهند شد. عملکرد بی تاثیر است.
:::

بسته `bitsocial-react-hooks` یک React hooks API آشنا برای تعامل با پروتکل Bitsocial فراهم می‌کند. این کار واکشی فیدها، نظرات، و نمایه‌های نویسنده، مدیریت حساب‌ها، انتشار محتوا و اشتراک در انجمن‌ها را انجام می‌دهد - همه بدون اتکا به سرور مرکزی.

این کتابخانه رابط اصلی مورد استفاده توسط [5chan](/apps/5chan/) و دیگر برنامه‌های مشتری Bitsocial است.

:::note
`bitsocial-react-hooks` یک فورک موقت از `plebbit/plebbit-react-hooks` است که برای توسعه با کمک هوش مصنوعی نگهداری می‌شود. به‌جای انتشار در npm، مستقیماً از GitHub مصرف می‌شود.
:::

## نصب و راه اندازی

از آنجایی که بسته هنوز روی npm نیست، آن را مستقیماً از GitHub نصب کنید و به یک هش commit خاص پین کنید:

```bash
yarn add https://github.com/bitsocialnet/bitsocial-react-hooks.git#<commit-hash>
```

`<commit-hash>` را با تعهدی که می‌خواهید هدف قرار دهید جایگزین کنید.

## نمای کلی API

قلاب ها به دسته های کاربردی سازماندهی می شوند. در زیر خلاصه ای از پرکاربردترین قلاب ها در هر دسته آورده شده است. برای امضای کامل، پارامترها و انواع بازگشت، به [مرجع کامل API در GitHub](https://github.com/bitsocialnet/bitsocial-react-hooks) مراجعه کنید.

### حساب ها

حساب‌های کاربری محلی، هویت و تنظیمات را مدیریت کنید.

- `useAccount(accountName?)` -- شی حساب فعال (یا با نام) را برمی گرداند
- `useAccounts()` - ​​همه حساب‌های ذخیره‌شده محلی را برمی‌گرداند
- `useAccountComments(options?)` - ​​نظرات منتشر شده توسط حساب فعال را برمی‌گرداند

### نظرات

نظرات و رشته ها را واکشی کنید و با آنها تعامل کنید.

- `useComment(commentCid?)` -- یک نظر را توسط CID خود واکشی می کند
- `useComments(commentCids?)` -- چندین نظر را به صورت دسته ای واکشی می کند
- `useEditedComment(comment?)` -- آخرین نسخه ویرایش شده یک نظر را برمی گرداند

### جوامع

فراداده و تنظیمات انجمن را بازیابی کنید.

- `useSubplebbit(subplebbitAddress?)` -- یک انجمن را بر اساس آدرس واکشی می کند
- `useSubplebbits(subplebbitAddresses?)` -- چندین انجمن را واکشی می کند
- `useSubplebbitStats(subplebbitAddress?)` - ​​تعداد مشترکین و پست‌ها را برمی‌گرداند

### نویسندگان

نمایه های نویسنده و ابرداده را جستجو کنید.

- `useAuthor(authorAddress?)` -- نمایه نویسنده را واکشی می کند
- `useAuthorComments(options?)` - ​​نظرات یک نویسنده خاص را برمی‌گرداند
- `useResolvedAuthorAddress(authorAddress?)` - ​​یک آدرس قابل خواندن توسط انسان (به عنوان مثال، ENS) را به آدرس پروتکل خود حل می کند

### تغذیه می کند

در فیدهای محتوا مشترک شوید و صفحه بندی کنید.

- `useFeed(options?)` - ​​فید صفحه‌بندی شده از پست‌های یک یا چند انجمن را برمی‌گرداند
- `useBufferedFeeds(feedOptions?)` -- فیدهای متعدد را برای رندر سریعتر از قبل بافر می کند
- `useAuthorFeed(authorAddress?)` - ​​فید پست‌های یک نویسنده خاص را برمی‌گرداند

### اقدامات

محتوا را منتشر کنید و عملیات نوشتن را انجام دهید.

- `usePublishComment(options?)` - ​​یک نظر یا پاسخ جدید منتشر کنید
- `usePublishVote(options?)` -- رأی موافق یا مخالف بدهید
- `useSubscribe(options?)` -- اشتراک یا لغو اشتراک در یک انجمن

### ایالات و RPC

وضعیت اتصال را نظارت کنید و با یک شبح Bitsocial راه دور تعامل کنید.

- `useClientsStates(options?)` - ​​وضعیت اتصال مشتریان IPFS/pubsub را برمی‌گرداند
- `usePlebbitRpcSettings()` - ​​پیکربندی شبح RPC فعلی را برمی‌گرداند

## توسعه

برای کار بر روی کتابخانه هوک به صورت محلی:

**پیش نیازها:** Node.js، Corepack فعال، Yarn 4

```bash
git clone https://github.com/bitsocialnet/bitsocial-react-hooks.git
cd bitsocial-react-hooks
corepack enable
yarn install
```

برای دستورات تست و ساخت به مخزن README مراجعه کنید.

## پیوندها

- **GitHub:** [bitsocialnet/bitsocial-react-hooks](https://github.com/bitsocialnet/bitsocial-react-hooks)
- **مجوز:** فقط GPL-2.0
