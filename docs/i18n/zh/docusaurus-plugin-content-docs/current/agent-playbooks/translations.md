# 翻译

about 站点使用位于 `about/public/translations/{lang}/default.json` 的 i18next JSON。Docusaurus 的源翻译单独存放在 `docs/i18n/` 中。

## About 站点的键

使用 `.agents/skills/translate/SKILL.md`。从磁盘上发现当前的语言，并保留占位符、标记、技术术语和品牌名称。对于较大的请求，子代理可以生成彼此独立的映射，但必须由一个父代理串行完成每一次语言写入；更新器没有写入锁。

使用任务专属且唯一的映射路径。先用 `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry` 预览，再用相同的参数加上 `--write` 应用。写入之后验证覆盖范围和取值，并且只删除本任务拥有的临时映射。

需要删除时使用 `--delete`。在经授权运行 `--audit --write` 之前，先检查 `--audit --dry` 的发现；动态翻译键需要人工审阅源码。只有技术术语、品牌或占位符，才把英文复制到每种语言中。

## Docusaurus 页面

`scripts/translate-docs.py` 是面向所有页面/语言的批量写入器，没有按文件过滤的功能；不要用它做小范围的翻译修改。`scripts/check-docs-translations.py` 是只读验证器，支持 `--locales` 和 `--paths`。

让代码围栏、链接、行内代码、合约地址、标题、表格和提示块与英文源保持一致。解决验证器报告的错误；品牌名称导致的 `frontmatter-untranslated` 警告可能属于预期。遵循 `docs/AGENTS.md`，并在修改文档主题或 i18n 行为时通过根目录构建，让静态输出与 Pagefind 保持一致。

## 可选的语义审查

对于选定的 i18next 键，使用 `scripts/jev/translation-README.md`。对于文档页面，先运行 `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`。它要求显式选择语言/页面，会运行结构验证器，并在启用实时推理之前把语义审查报告为未验证。只有在具备该任务的提供商授权和预算时才添加 `--live`；共享的私有机器配置会提供凭据和固定版本的模型。环境变量和 `--model` 可以覆盖这一设置。该命令从不编辑翻译。

页面适配器会保留整页上下文，并把每个页面限制为 24 KB、每次运行限制为 30 对。对于更大的页面，请为 `translations.mjs --pairs` 准备显式对齐的源文/译文段落对；不要按索引自动配对段落。语义结果仅供参考：检查报告的问题和不确定性，并保留确定性的代码/链接/地址检查。
