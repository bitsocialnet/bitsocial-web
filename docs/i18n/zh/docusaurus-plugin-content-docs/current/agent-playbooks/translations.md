# 翻译工作流程

该项目使用`public/translations/{lang}/default.json`中的i18next翻译文件。

## 规则

不要手动编辑每个语言文件。使用`scripts/update-translations.js`。

## 添加或更新密钥

1. 创建一个临时字典文件，例如`translations-temp.json`：

```json
{
  "en": "English text",
  "es": "Spanish text",
  "fr": "French text",
  "de": "German text"
}
```

2. 应用平移图：

```bash
node scripts/update-translations.js --key my_new_key --map translations-temp.json --include-en --write
```

3. 删除临时词典文件。

## 其他有用的命令

```bash
# 将密钥从英语复制到所有语言（试运行然后写入）
node scripts/update-translations.js --key some_key --from en --dry
node scripts/update-translations.js --key some_key --from en --write

# 从所有语言中删除密钥
node scripts/update-translations.js --key obsolete_key --delete --write

# 审核未使用的翻译密钥
node scripts/update-translations.js --audit --dry
node scripts/update-translations.js --audit --write
```
