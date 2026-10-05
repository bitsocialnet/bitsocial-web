# 技能与工具

共享技能位于 `.agents/skills/`。编辑这些源文件，然后运行 `yarn ai-workflow:sync`，为 Claude Code 生成 `.claude/skills/`。Codex 和 Cursor 会直接发现 `.agents/skills/`；不要恢复重复的 `.codex/skills/` 或 `.cursor/skills/` 根目录。

共享角色提示词位于 `.agents/roles/*.md`。这是本仓库特有的源格式，而不是原生的代理发现路径。`scripts/ai-workflow-files.mjs` 会把这些源文件转换为下面列出的各应用专用文件；`yarn ai-workflow:sync` 负责写入它们。把生成的文件与其源文件一起提交，这样全新检出的仓库无需先运行生成器就具备原生配置。删除某个源文件之后，要显式删除它已过时的生成产物；验证器会报告这些产物，而不会悄悄删除文件。

## 原生发现路径

已于 2026-09-12 对照官方文档核实：

| 应用        | 项目指令                                                          | 本仓库使用的技能                        | 本仓库使用的自定义代理             |
| ----------- | ----------------------------------------------------------------- | --------------------------------------- | ---------------------------------- |
| Codex       | `AGENTS.md`                                                       | `.agents/skills/<name>/SKILL.md`        | 生成的 `.codex/agents/<name>.toml` |
| Cursor      | `AGENTS.md`；`.cursor/rules/*.mdc` 仍可用于 Cursor 专用的条件规则 | `.agents/skills/<name>/SKILL.md`        | 生成的 `.cursor/agents/<name>.md`  |
| Claude Code | `CLAUDE.md` 导入 `@AGENTS.md`                                     | 生成的 `.claude/skills/<name>/SKILL.md` | 生成的 `.claude/agents/<name>.md`  |

来源：[Codex 技能](https://learn.chatgpt.com/docs/build-skills)、[Codex 子代理](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Cursor 规则](https://cursor.com/docs/rules)、[Cursor 技能](https://cursor.com/docs/skills)、[Cursor 子代理](https://cursor.com/docs/subagents)、[Claude 记忆](https://code.claude.com/docs/en/memory)、[Claude 技能](https://code.claude.com/docs/en/skills)、[Claude 子代理](https://code.claude.com/docs/en/sub-agents)。

不要用 `.agents/roles` 取代原生的代理目录，也不要假定 Claude 会发现 `.agents/skills`。Claude 仍然可以把那里被引用的文件当作普通的项目上下文读取。Cursor 出于兼容性也会发现 `.claude/skills`；这些副本保持同步，但它已发布的技能指南并未说明是否会在这些根目录之间去重。请检查已安装应用的技能清单，而不是承诺不会出现重复条目。

AI 目录通过 `.gitattributes` 使用 LF 换行符，使生成的文本在各平台上保持一致。技能的辅助资源按字节原样复制。

## 技能

| 技能                                 | 用途                                                                 |
| ------------------------------------ | -------------------------------------------------------------------- |
| `commit`                             | 创建经授权、范围明确的本地提交                                       |
| `commit-format`、`issue-format`      | 在被要求时给出格式建议                                               |
| `make-closed-issue`                  | 创建经授权的 issue、范围明确的提交和 PR                              |
| `review-and-merge-pr`                | 分拣 PR 反馈；只在所请求的范围内修复/发布/合并                       |
| `fix-merge-conflicts`                | 解决冲突并验证合并后的结果                                           |
| `release`                            | 准备发布说明文字，并执行经授权的发布步骤                             |
| `code-quality-review`                | 审查非平凡的 diff 或明确提出的质量问题                               |
| `retro`                              | 把已经出现过的错误转化为防止复发的针对性检查或指导                   |
| `refactor-pass`、`deslop`            | 按要求清理现有改动                                                   |
| `debug-agent`                        | 基于证据的调试，必要时进行插桩                                       |
| `you-might-not-need-an-effect`       | 有针对性的副作用/memo 审查                                           |
| `vercel-react-best-practices`        | 适用的 React 性能指南；对这个 Vite 客户端跳过 Next.js/仅服务端的规则 |
| `translate`                          | 生成翻译，然后通过单一写入器应用映射                                 |
| `playwright-cli`、`inspect-elements` | 浏览器验证以及从 DOM 到源码的映射                                    |
| `profile-browsing`                   | 限定范围的浏览器与 React 性能分析                                    |
| `test-apk`                           | 验证所提供的配套 Android 包装应用                                    |
| `impeccable`、`improve-threejs`      | 限定范围的界面设计与 Three.js 渲染审查                               |
| `implement-plan`                     | 执行计划，可选择有边界的委派                                         |
| `readme`                             | 维护经过验证的项目文档                                               |
| `context7`                           | 获取与版本相符的库文档                                               |
| `find-skills`                        | 在被明确要求时查找更多技能                                           |

## 角色与模型

保留 `browser-check`、`profiler`、`test-apk`、`translator` 和 `reviewer` 这几个自定义角色。普通的实现和代码探索，请使用代理运行框架内置的 worker/general-purpose 或 explorer 角色。父代理负责分配验收标准和归属；由一个负责人运行重量级检查。

Codex 代理文件包含 `name`、`description` 和 `developer_instructions`。`.codex/config.toml` 通过 `max_concurrent_threads_per_session` 把并发子代理的上限设为四个。共享角色元数据包含名称、描述和可选的沙箱模式；它刻意不包含任何模型字段。

在全部三个应用中，已提交的技能和自定义代理都不要包含模型和推理字段。这样就能按照各应用文档规定的优先级，采用运行时调用的选择、用户默认值以及从父级继承。Claude 系列别名减少了版本维护工作，但仍然选定了一个系列；带版本号的 Cursor 模型则需要日后更新。需要时，把这类选择放在用户/会话设置中。继承并不保证会自动选中当前最好的模型。不要臆造 `latest` 别名，也不要在例行任务中加入模型目录调研。参见 [Codex 模型选择](https://learn.chatgpt.com/docs/agent-configuration/subagents)、[Claude 模型选择](https://code.claude.com/docs/en/sub-agents#choose-a-model) 和 [Cursor 模型选择](https://cursor.com/docs/subagents#model-configuration)。

`sandbox-mode: read-only` 对应 Codex 的沙箱和 Cursor 的 `readonly`；Claude 的工具列表和角色指令会限制它的审查工作流，但 Bash 访问并不是操作系统级别的沙箱。

在适用的情况下，共享技能的 frontmatter 会为用户调用的工作流使用 `disable-model-invocation: true`。Codex 中对应的设置位于 `agents/openai.yaml`，即 `policy.allow_implicit_invocation: false`；验证器要求两者同时存在。调用元数据是对明确授权规则的补充；审查请求绝不会仅仅因为某个技能包含发布步骤，就授权进行发布。

## 检查与发现

- `yarn ai-workflow:sync` 使用已安装的 `js-yaml` 和 `smol-toml` 重新生成兼容性输出。
- `yarn ai-workflow:check` 解析源文件/frontmatter/配置，检查生成的输出、调用元数据、模型字段的位置，以及仅用于格式化的钩子接线。它不会对照提供商的模型目录解析模型标识符。
- `yarn ai-workflow:test` 针对钩子载荷以及工作流的生成/验证运行隔离的 Node fixture。
- 升级代理应用之后，要在该应用中验证技能/角色能否被发现。语法/一致性检查不能替代加载器检查。如果现有会话仍保留着旧的清单，请重新加载应用。
- 钩子需要代理运行框架的项目信任和钩子审查；不要为了让检查通过而绕过信任。参见 [hooks-setup.md](hooks-setup.md)。

## 维护有用的指令

遵循 [OpenAI 关于技能与提示词的指南](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra)（2026-09-12 审阅）：保持描述准确，只在相关时加载细节，并保留用户所请求的范围。共享技能要服务于不同的模型；在允许常规实现选择的同时，保留项目特有的不变量。

把技能的用途、决策边界和关键约束放在 `SKILL.md` 中。篇幅较大、针对特定模式的命令或示例，作为可选参考链接出去。在简短的描述中尽早写明触发条件；仅仅匹配到某个关键词，不应扩大任务范围。除非有意改变其行为，否则保留现有的调用元数据。

对指令做了较大改动之后，用几个有代表性的小请求和大请求实际演练一下。检查选中了哪些技能/参考资料、操作是否保持在范围之内、验证是否与改动相匹配，以及获得授权的工作是否已经完成。Schema 和 fixture 测试确立的是工具的正确性，而不是代理的决策质量。

## 工具与浏览器归属

优先使用现有的技能/工具清单和已安装的项目 CLI。GitHub 操作使用 `gh`，浏览器验证使用 `playwright-cli`，库的行为很关键时查阅官方/特定版本的文档。避免安装重复的技能，也不要仅仅为了运行一个现有的格式化器而去获取未固定版本的包。

MCP 的开销取决于代理运行框架：延迟加载工具可以避免预先加载每一个 schema。让集成与需求保持相关，而不是把 MCP 本身视为过时。现有的 CLI 选择在可复现性和资源控制方面依然有用。

所有浏览器会话都使用 `./scripts/pw-session.sh`，它在全机器范围内只允许一个活动浏览器。默认使用全新的隔离会话。当前访问个人浏览器需要明确授权；在后续步骤中复用该授权。根据受影响的行为选择浏览器/视口，依次运行选定的引擎，在清理时关闭确切命名的会话，并且绝不使用 `close-all`/`kill-all`。参见 `playwright-cli` 技能和 [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md)。
