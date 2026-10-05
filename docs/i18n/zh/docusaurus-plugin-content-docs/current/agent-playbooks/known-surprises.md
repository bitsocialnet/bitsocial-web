# 已知意外情况

本文件记录本仓库特有的、曾经导致代理犯错的混淆点。

## 收录标准

只有同时满足以下全部条件时才添加条目：

- 它是本仓库特有的（不是通用建议）。
- 它很可能会在未来的代理身上重演。
- 它有可以照做的具体缓解措施。

如果不确定，请先询问开发者，再添加条目。

## 条目模板

```md
### [Short title]

- **Date:** YYYY-MM-DD
- **Observed by:** agent name or contributor
- **Context:** where/when it happened
- **What was surprising:** concrete unexpected behavior
- **Impact:** what went wrong or could go wrong
- **Mitigation:** exact step future agents should take
- **Status:** confirmed | superseded
```

## 条目

### Vercel 应用的生产域名可能漂移回 Git master 的部署

- **日期：** 2026-04-28
- **发现者：** Tommaso + Codex
- **背景：** 在 Bitsocial Web 应用目录中验证 Seedit 和 5chan 的应用镜像。
- **意外之处：** Vercel 上的 `seedit` 和 `5chan` 项目设置了 `gitProviderOptions.createDeployments = "enabled"`，因此 GitHub `master` 上的推送会被提升到生产域名，而仓库策略要求生产环境的应用镜像只提供发布产物。
- **影响：** 应用目录中的镜像验证徽章可能变成假的，因为生产域名提供的是最新的开发提交，而不是那个把 `index.html` 哈希记录在 `about/src/lib/apps-data.ts` 里的 GitHub 发布 ZIP。
- **缓解措施：** 在添加或刷新镜像验证元数据之前，先用 `vercel api /v9/projects/<project-id>` 检查该 Vercel 项目，确认 `gitProviderOptions.createDeployments = "disabled"`。用 `vercel deploy --prebuilt --prod` 部署发布 ZIP 的内容，开发部署则使用 `seedit-omega.vercel.app` 或 `5chan-omega.vercel.app`。
- **状态：** 已确认

### 除非启动脚本强制使用 HTTPS，否则 Portless 0.11 会复用旧的代理状态

- **日期：** 2026-04-28
- **发现者：** Tommaso + Codex
- **背景：** 把常规的 `yarn start` 流程从旧的 `http://bitsocial.localhost:1355` 代理 URL 升级到 `https://bitsocial.localhost`.
- **意外之处：** 即使已经安装了 `portless@0.11.1`，Portless 依然复用现有的 `~/.portless/proxy.port = 1355` HTTP 代理，并打印出旧的 `:1355` URL。
- **影响：** 仅仅更新包版本和文档是不够的；当贡献者本地还运行着旧的 Portless 状态时，`yarn start` 仍会公布并使用旧的 URL。
- **缓解措施：** 让启动脚本在注册应用路由之前，明确地在 `443` 端口上启动 Portless 的 HTTPS 代理，这样运行流程就会迁移离开持久化的 `1355` 状态，而不是继承它。
- **状态：** 已确认

### Portless 改变了规范的本地应用 URL

- **日期：** 2026-03-18
- **发现者：** Codex
- **背景：** 浏览器验证与冒烟流程
- **意外之处：** 默认的本地 URL 不是常见的 Vite 端口。本仓库期望通过 Portless 提供 `https://bitsocial.localhost` 服务，所以去检查 `localhost:3000` 或 `localhost:5173` 可能命中错误的应用，或者什么都访问不到。
- **影响：** 即使开发服务器一切正常，浏览器检查也可能失败，或者验证了错误的目标。
- **缓解措施：** 优先使用 `https://bitsocial.localhost` 作为起点。只有在确实需要直连 Vite 端口时，才用 `PORTLESS=0 corepack yarn start` 绕过它。
- **状态：** 已确认

### Commitizen 钩子会卡住非交互式提交

- **日期：** 2026-03-18
- **发现者：** Codex
- **背景：** 代理驱动的提交流程
- **意外之处：** `git commit` 会通过 Husky 触发 Commitizen 并等待交互式 TTY 输入，这会让非交互式的代理 shell 挂起。
- **影响：** 代理可能在一次本该正常完成的提交上无限期卡住。
- **缓解措施：** 代理创建的提交使用 `git commit --no-verify -m "message"`。人类仍然可以用 `corepack yarn commit` 或 `corepack yarn exec cz`。
- **状态：** 已确认

### 必须使用 Corepack，才能避开 Yarn classic

- **日期：** 2026-03-19
- **发现者：** Codex
- **背景：** 包管理器迁移到 Yarn 4
- **意外之处：** 这台机器的 `PATH` 上仍装着全局的 Yarn classic，所以直接运行 `yarn` 可能解析到 v1，而不是仓库固定的 Yarn 4 版本。
- **影响：** 开发者可能无意中绕过仓库的包管理器固定策略，得到不同的安装行为或锁文件输出。
- **缓解措施：** shell 命令使用 `corepack yarn ...`，或先运行 `corepack enable`，让直接输入的 `yarn` 解析到固定的 Yarn 4 版本。
- **状态：** 已确认

### 固定的 Portless 应用名会在多个 Bitsocial Web 工作树之间冲突

- **日期：** 2026-03-30
- **发现者：** Codex
- **背景：** 在一个 Bitsocial Web 工作树里运行 `yarn start`，而另一个工作树已经在通过 Portless 提供服务
- **意外之处：** 在每个工作树里都使用字面量 Portless 应用名 `bitsocial`，会让路由本身发生冲突，即便背后的端口不同也一样，于是第二个进程会因为 `bitsocial.localhost` 已被注册而失败。
- **影响：** 并行的 Bitsocial Web 分支会互相阻塞，尽管 Portless 本该让它们安全共存。
- **缓解措施：** 把 Portless 的启动逻辑保留在 `scripts/start-dev.mjs` 里；它现在会在非规范场景下使用按分支划分的 `*.bitsocial.localhost` 路由，并在裸的 `bitsocial.localhost` 名称已被占用时回退到按分支划分的路由。
- **状态：** 已确认

### 文档预览过去硬编码了 3001 端口

- **日期：** 2026-03-30
- **发现者：** Codex
- **背景：** 与其他本地仓库和代理同时运行 `yarn start`
- **意外之处：** 根目录的开发命令用 `docusaurus start --port 3001` 运行文档工作区，因此只要别的进程已经占用 `3001`，整个开发会话就会失败，哪怕主应用早就用上了 Portless。
- **影响：** `yarn start` 可能在 Web 进程刚启动后就把它杀掉，让一次文档端口冲突打断了毫不相干的本地工作。
- **缓解措施：** 把文档启动逻辑保留在 `yarn start:docs` 之后；它现在使用 Portless 加 `scripts/start-docs.mjs`，会采用注入的空闲端口，或在直接运行时回退到下一个可用端口。
- **状态：** 已确认

### 文档的固定 Portless 主机名曾被硬编码

- **日期：** 2026-04-03
- **发现者：** Codex
- **背景：** 在第二个 Bitsocial Web 工作树里运行 `yarn start`，而另一个工作树已经在通过 Portless 提供文档服务
- **意外之处：** `start:docs` 仍然注册字面量主机名 `docs.bitsocial.localhost`，因此即使 about 应用早已知道如何避开自身主机名的 Portless 路由冲突，`yarn start` 依然可能失败。
- **影响：** 并行工作树无法可靠地使用根目录的开发命令，因为文档进程会先退出，随后 `concurrently` 会杀掉会话中的其余进程。
- **缓解措施：** 把文档启动逻辑保留在 `scripts/start-docs.mjs` 里；它现在会推导出与 about 应用相同的、按分支划分的 Portless 主机名，并把这个共享的公开 URL 注入 `/docs` 开发代理的目标地址。
- **状态：** 已确认

### 工作树 shell 可能用不上仓库固定的 Node 版本

- **日期：** 2026-04-03
- **发现者：** Codex
- **背景：** 在 `.claude/worktrees/*` 之类的 Git 工作树或同级工作树检出目录中运行 `yarn start`
- **意外之处：** 某些工作树 shell 会把 `node` 和 `yarn node` 解析到 Homebrew 的 Node `25.2.1`，尽管仓库在 `.nvmrc` 中固定了 `22.12.0`，于是 `yarn start` 可能在错误的运行时下悄悄启动开发脚本。
- **影响：** 主检出目录与工作树之间的开发服务器行为会出现漂移，让问题难以复现，也违反了仓库预期的 Node 22 工具链。
- **缓解措施：** 把开发启动逻辑保留在 `scripts/start-dev.mjs` 和 `scripts/start-docs.mjs` 里；当前 shell 版本不对时，它们现在会用 `.nvmrc` 指定的 Node 可执行文件重新执行自身。shell 环境配置仍应优先使用 `nvm use`。
- **状态：** 已确认

### 重构之后残留的 `docs-site/` 会掩盖缺失的文档源文件

- **日期：** 2026-04-01
- **发现者：** Codex
- **背景：** 把 Docusaurus 项目从 `docs-site/` 移动到 `docs/` 之后的单仓合并清理
- **意外之处：** 即使被跟踪的仓库已经改用 `docs/`，磁盘上仍可能残留旧的 `docs-site/` 目录，里面还留着 `i18n/` 这类过期但重要的文件。这会让重构在本地看起来像是重复了，也可能掩盖被跟踪的文档翻译其实并未真正迁入 `docs/` 的事实。
- **影响：** 代理可能把旧目录当成“垃圾”删掉，从而意外丢失文档翻译的唯一本地副本；也可能继续修改那些仍指向已废弃 `docs-site/` 路径的脚本。
- **缓解措施：** 把 `docs/` 当作唯一规范的文档项目。删除任何本地 `docs-site/` 残留之前，先恢复 `docs/i18n/` 这类被跟踪的源文件，并更新脚本和钩子，让它们不再引用 `docs-site`。
- **状态：** 已确认

### 多语言文档预览会在验证期间让内存占用飙升

- **日期：** 2026-04-01
- **发现者：** Codex
- **背景：** 用 `yarn start:docs` 配合 Playwright 修复文档 i18n、语言路由和 Pagefind 行为
- **意外之处：** 现在默认的文档预览模式会在提供服务之前先完成一次完整的多语言文档构建加 Pagefind 索引，让这个进程与多个 Playwright 或 Chrome 会话共存时，占用的内存会远超普通的 Vite 或单语言 Docusaurus 开发循环。
- **影响：** 机器可能陷入内存紧张，浏览器会话可能崩溃，被中断的运行还可能留下持续吃内存的过期文档服务器或无头浏览器。
- **缓解措施：** 对于不需要验证语言路由或 Pagefind 的文档工作，优先使用 `DOCS_START_MODE=live yarn start:docs`。只有在需要验证翻译后的路由或 Pagefind 时，才使用默认的多语言预览。保持只开一个 Playwright 会话，开新会话前先关掉旧的，验证结束后若不再需要就停掉文档服务器。
- **状态：** 已确认

### `translate-docs.py` 可能让文档语言只翻译一半，或留下损坏的链接目标

- **日期：** 2026-04-06
- **发现者：** Codex
- **背景：** 在 `yarn start:docs` 提供了英文详情页、或语言输出构建失败之后，修复本地化的文档路由和内容
- **意外之处：** 文档翻译流水线同时存在两种本仓库特有的失败模式：当 `tr(...)` 调用采用它无法解析的写法时，`scripts/translate-docs.py` 只会提取 `DocsHome` 文案中的一小部分；同时 `docs/i18n/**` 下的翻译 markdown 可能在链接目标里带着被机器翻译的 slug 或 `ZXQPLACEHOLDER` 残留。
- **影响：** 本地化首页可能悄悄回退到英文，本地化详情页可能显示为未翻译，而且即便源文档本身有效，完整的 `yarn docs:build` 也会因为语言版本的链接损坏而失败。
- **缓解措施：** 修改文档翻译或重新生成语言文件之后，务必在仓库根目录运行 `yarn docs:build`，扫描 `docs/i18n/**` 下的 markdown 是否含有 `ZXQPLACEHOLDER`，并确认翻译后的链接仍指向 `/apps/5chan/` 这类规范文档 slug，而不是被翻译过的 URL 路径。如果 `DocsHome` 的文案有改动，请确认 `scripts/translate-docs.py` 仍能提取全部 `docs.home.*` 文案。
- **状态：** 已确认

### about 站点的无 JS 检查必须走 Portless 路由，而不是独立的 SSR 预览

- **日期：** 2026-04-12
- **发现者：** Codex
- **背景：** 在分支工作树中验证 `about/` 站点的无 JS 支持
- **意外之处：** 独立的 SSR 预览可能看起来一切健康，而真正按分支划分的 Portless 路由仍在提供错误的应用外壳或更旧的进程。在本仓库里，真正的本地契约是 `yarn start` 给出的 Portless 主机名，而不是临时搭起来的预览服务器。
- **影响：** 代理可能错误地宣称无 JS 支持正常，或漏掉只在 `*.bitsocial.localhost` 上出现的回归。
- **缓解措施：** 做 `about/` 的浏览器验证时，务必用 `yarn start` 或 `yarn start:about` 启动真正的本地服务器，并优先测试按分支划分的 Portless URL。如果某个 Portless 主机名看起来是过期的，先检查并停掉旧进程再重新测试。
- **状态：** 已确认

### `chain/` 对 `yarn build:verify` 和 `yarn doctor` 是不可见的

- **日期：** 2026-07-05
- **发现者：** Codex
- **背景：** 在 `chain/` 工作区（用于 `chain.bitsocial.net` 的独立 Vite 应用）加入单仓之后，验证一个只改动 chain/ 的 diff。
- **意外之处：** `scripts/verify-build.mjs` 只识别 `about/`、`docs/` 和 `stats/` 这几个路径前缀，所以只改动 chain/ 的 diff 会打印 "No targeted build checks matched the current diff" 并且完全不跑构建，尽管根 `package.json` 里早就有 `build:chain`。另外，`yarn doctor` 被硬编码为 `react-doctor about -y`，因此 `chain/src` 下的 React 改动完全没有 React Doctor 覆盖。
- **影响：** 验证 chain 改动的代理必须自己知道要直接调用 `yarn build:chain`，而不能信任 `yarn build:verify`；而 `chain/src` 中的 React 问题（副作用、hooks、无用代码）不会被 `yarn doctor` 发现。
- **缓解措施：** `scripts/verify-build.mjs` 现在有了与 `about/` 对应的 `chain/` 分支，`doctor` 和 `doctor:verbose` 现在会在一次调用中运行 `react-doctor --project about,chain -y`。`doctor:score` 仍然只针对 `about`，因为 `--score` 与指向多个项目的 `--project` 组合使用时会静默地什么都不输出；如果需要 chain 的评分，请使用 `yarn react-doctor --project about,chain --verbose -y`（或 `--json`）。
- **状态：** 已确认

### 浏览器 P2P 跑在安全 WebSockets 上；pkc-js 默认拒绝 WebRTC 和 WebTransport

- **日期：** 2026-08-02
- **发现者：** Claude
- **背景：** 撰写关于 Bitsocial 浏览器 P2P 工作方式的落地页和文档文案
- **意外之处：** `@pkcprotocol/pkc-js` 自带一个默认的连接闸门，会在浏览器中拒绝 WebRTC 和 WebTransport 拨号 —— `dist/browser/helia/dial-transport-filter.js` 导出了 `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`。它的源码注释给出了理由：在浏览器里，这些传输会引入漫长且经常失败的连接建立路径（STUN/ICE、certhash 轮换），拖慢加载，而 WebSocket 直接又可靠。博客 P2P 状态面板上的每一个在线节点都显示为 "Secure WebSocket"。这个闸门位于 `node_modules` 中，所以仓库里没有任何线索提示它的存在。
- **影响：** 很容易写出技术上看似合理、实则错误的公开文案 —— 比如把 WebTransport 于 2026 年 3 月进入浏览器 Baseline 说成是让 Bitsocial 浏览器 P2P 成为可能的原因。在开发者发现之前，这个说法已经进入了落地页、对比表格和两个文档页面。公开页面上关于架构的错误说法，恰恰会被本站瞄准的开发者受众逐条核对。
- **缓解措施：** 绝不要根据 libp2p 或浏览器平台在原理上支持什么，去推断 Bitsocial 实际使用哪些传输。查看 `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` 获取当前的拒绝列表，确认 `about/src/` 下不存在 `connectionGater` 覆盖配置，并在做出任何公开声明之前先读一读博客“P2P 状态”面板里的实时传输标签。真正解除浏览器发布限制的上游改动，是 `@libp2p/gossipsub` 15.0.21（2026 年 5 月）中的 gossipsub 单调 seqno 修复；pkc-js 目前搭载的是 16.0.4。
- **状态：** 已确认

### 未翻译文档页里的相对 `./page.md` 链接会破坏每一个本地化构建

- **日期：** 2026-08-02
- **发现者：** Claude
- **背景：** 新增了一个仅有英文的页面 `docs/browser-p2p.md`，它用 `./peer-to-peer-protocol.md` 和 `./apps/5chan.md` 链接到已有文档
- **意外之处：** `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` 下的每个语言目录都镜像了文档树。一个不在这些镜像中的新页面仍会通过英文回退在每种语言里渲染出来，但它的相对 markdown 链接不再能解析 —— Docusaurus 会生成 `/ar/browser-p2p/peer-to-peer-protocol.md/`，并以 "Docusaurus found broken links!" 让构建失败。关键在于，`yarn build:verify` 和 `yarn docs:build:verify` 只构建 `en` 并能干净通过；只有完整的 `yarn docs:build` 才会暴露这个问题，而且它在按字母序排在最前的语言（`ar`）上就会中止。
- **影响：** 一次文档改动可以通过所有快速的本地检查，却依然破坏生产的多语言构建。这个失败看上去还像是与改动无关，因为报错指向的是作者从未碰过的语言路径。
- **缓解措施：** 在任何没有被镜像到 `docs/i18n/**` 的文档页里，使用根相对链接（`/peer-to-peer-protocol/`、`/apps/5chan/`），而不是相对的 `.md` 链接；Docusaurus 会自动为它们加上语言前缀。`docs/build-your-own-client.md` 就是现成的例子。在交付任何新增或链接文档页的改动之前，请运行完整的 `yarn docs:build`，而不只是 `build:verify`。
- **状态：** 已确认

### 并发运行 `update-translations.js` 会悄悄丢键

- **日期：** 2026-08-02
- **发现者：** Claude
- **背景：** 通过 `translate` 技能把 26 个翻译好的 i18next 键应用到全部 36 种语言
- **意外之处：** 每次调用都是对全部 36 个语言文件的一次读-改-写，因此两次调用同时运行会互相覆盖，某个键会毫无报错地消失。而 `translate` 技能明确要求最多并发派生 4 个子代理，它们每个都会调用这个脚本。
- **影响：** 静默失败：键会从任意语言中消失，而 diff 看上去仍然合理。
- **缓解措施：** 绝不要让翻译子代理并发写入语言文件 —— 让它们只输出字典 JSON 文件，然后由父代理串行地逐个应用每个键。应用完成后，用程序化方式验证每个键都存在于全部 35 种非英语语言中，且没有任何值与英文源逐字节相同。
- **状态：** 已确认
- **更新（2026-08-10）：** 这个脚本过去还会把目标解析为 `path.join(process.cwd(), "public", "translations")`，因此文档中从仓库根目录运行的命令会以 "Translations directory not found" 失败，只能在 `about/` 中运行。现在它会从当前目录或脚本自身所在的位置解析工作区，在任何位置都能运行。上面所说的并发陷阱依然存在。

### 开发环境的标注控件可能拦截自动化点击

- **背景：** about 和 chain 站点的右下角有固定控件，而在开发环境中，Agentation 工具栏也出现在那里。
- **缓解措施：** `scripts/pw-session.sh open` 会在重新加载页面之前注册 `window.__NO_DEV_TOOLBAR__ = true`。Agentation 初始化程序也会遵循 `__VISUAL_TESTING__` 和 `__PROFILING__`；源码检查功能仍可独立使用。直接进行浏览器自动化时，必须在加载应用之前设置同样的标志。

### `skills add` 会把 Codex 和 Cursor 的副本安装到被 gitignore 忽略的 `.agents/` 目录

- **日期：** 2026-08-18
- **发现者：** Tommaso + Claude
- **背景：** 使用 `skills` CLI（`vercel-labs/skills`）从 `millionco/react-doctor` 安装 `improve-threejs` 技能。
- **意外之处：** `npx skills add <repo> --skill <name> --agent codex` 和 `--agent cursor` 都会写入 `.agents/skills/<name>/`，而不是 `.codex/skills/` 或 `.cursor/skills/`。`AGENTS.md` 禁止在仓库层级存在 `.agents/` 目录，而且 `.gitignore:29` 会忽略它，因此这两份副本都会悄悄地处于未跟踪状态。只有 `--agent claude-code` 会写入预期的 `.claude/skills/`。另外，文档中给出的逗号分隔形式（`--agent claude-code,codex,cursor`）会以 "Invalid agents" 失败且什么都不安装，尽管每个名称单独使用时都是有效的。
- **影响：** 安装报告成功，但三份工具链副本中有两份落在了永远不会被提交的位置，因此在全新克隆之后，Codex 和 Cursor 会悄无声息地缺少该技能。逗号形式也可能产生一次看似成功、实则什么都没做的安装。
- **当前缓解措施：** 仓库现在把 `.agents/skills` 作为规范源进行跟踪，并通过 `yarn ai-workflow:sync` 生成 Claude 副本。以前对 `.agents` 的禁止规定和忽略规则都已移除。不要把新技能复制到三个彼此独立的根目录；添加技能之后，检查生成结果的一致性以及应用的技能清单。
- **状态：** 已确认
