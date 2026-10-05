# Skill và công cụ

Các skill dùng chung nằm trong `.agents/skills/`. Hãy chỉnh sửa các nguồn này, rồi chạy `yarn ai-workflow:sync` để sinh `.claude/skills/` cho Claude Code. Codex và Cursor khám phá trực tiếp `.agents/skills/`; đừng khôi phục các thư mục gốc trùng lặp `.codex/skills/` hay `.cursor/skills/`.

Các prompt vai trò dùng chung nằm trong `.agents/roles/*.md`. Đây là một định dạng nguồn riêng của kho lưu trữ, không phải đường dẫn khám phá agent gốc. `scripts/ai-workflow-files.mjs` chuyển các nguồn này thành các tệp riêng cho từng ứng dụng bên dưới; `yarn ai-workflow:sync` ghi chúng ra. Hãy commit các tệp được sinh cùng với nguồn của chúng để một bản checkout mới có sẵn cấu hình gốc mà không cần chạy trình sinh trước. Sau khi xóa một nguồn, hãy xóa một cách tường minh các đầu ra được sinh đã lỗi thời của nó; trình xác thực sẽ báo cáo chúng chứ không âm thầm xóa tệp.

## Đường dẫn khám phá gốc

Đã đối chiếu với tài liệu chính thức vào ngày 2026-09-12:

| Ứng dụng    | Chỉ dẫn dự án                                                                                  | Skill mà kho lưu trữ này dùng              | Agent tùy chỉnh mà kho lưu trữ này dùng |
| ----------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| Codex       | `AGENTS.md`                                                                                    | `.agents/skills/<name>/SKILL.md`           | `.codex/agents/<name>.toml` được sinh   |
| Cursor      | `AGENTS.md`; `.cursor/rules/*.mdc` vẫn dùng được cho các quy tắc có điều kiện riêng của Cursor | `.agents/skills/<name>/SKILL.md`           | `.cursor/agents/<name>.md` được sinh    |
| Claude Code | `CLAUDE.md` import `@AGENTS.md`                                                                | `.claude/skills/<name>/SKILL.md` được sinh | `.claude/agents/<name>.md` được sinh    |

Nguồn: [Skill của Codex](https://learn.chatgpt.com/docs/build-skills), [Subagent của Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Quy tắc của Cursor](https://cursor.com/docs/rules), [Skill của Cursor](https://cursor.com/docs/skills), [Subagent của Cursor](https://cursor.com/docs/subagents), [Bộ nhớ của Claude](https://code.claude.com/docs/en/memory), [Skill của Claude](https://code.claude.com/docs/en/skills), [Subagent của Claude](https://code.claude.com/docs/en/sub-agents).

Đừng thay thế các thư mục agent gốc bằng `.agents/roles` hay giả định rằng Claude khám phá `.agents/skills`. Claude vẫn có thể đọc một tệp được tham chiếu ở đó như ngữ cảnh dự án thông thường. Cursor cũng khám phá `.claude/skills` để tương thích; các bản sao vẫn được giữ đồng bộ, nhưng hướng dẫn về skill mà Cursor công bố không nêu rõ việc loại bỏ trùng lặp giữa các thư mục gốc này. Hãy kiểm tra danh mục skill của ứng dụng đã cài thay vì hứa rằng các mục trùng lặp không thể xuất hiện.

Các thư mục AI dùng ký tự xuống dòng LF thông qua `.gitattributes` để văn bản được sinh giữ nguyên giống hệt trên mọi nền tảng. Các tài nguyên hỗ trợ của skill được sao chép nguyên từng byte.

## Skill

| Skill                                | Mục đích                                                                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `commit`                             | Tạo các commit cục bộ được ủy quyền, có phạm vi rõ ràng                                                                |
| `commit-format`, `issue-format`      | Gợi ý định dạng khi được yêu cầu                                                                                       |
| `make-closed-issue`                  | Tạo issue được ủy quyền, commit có phạm vi rõ ràng và PR                                                               |
| `review-and-merge-pr`                | Phân loại phản hồi PR; chỉ sửa/công bố/merge trong phạm vi được yêu cầu                                                |
| `fix-merge-conflicts`                | Giải quyết xung đột và xác minh kết quả sau khi merge                                                                  |
| `release`                            | Chuẩn bị nội dung phát hành và thực hiện các bước phát hành được ủy quyền                                              |
| `code-quality-review`                | Review các diff không tầm thường hoặc một mối lo về chất lượng được yêu cầu tường minh                                 |
| `retro`                              | Biến những lỗi đã được chứng minh thành các bước kiểm tra hoặc hướng dẫn có trọng tâm để ngăn tái diễn                 |
| `refactor-pass`, `deslop`            | Dọn dẹp các thay đổi hiện có khi được yêu cầu                                                                          |
| `debug-agent`                        | Gỡ lỗi dựa trên bằng chứng, có đo đạc (instrumentation) khi cần                                                        |
| `you-might-not-need-an-effect`       | Review có trọng tâm về effect/memo                                                                                     |
| `vercel-react-best-practices`        | Hướng dẫn hiệu năng React áp dụng được; bỏ qua các quy tắc dành riêng cho Next.js/phía máy chủ đối với client Vite này |
| `translate`                          | Tạo bản dịch, rồi áp dụng các map thông qua một trình ghi duy nhất                                                     |
| `playwright-cli`, `inspect-elements` | Xác minh trên trình duyệt và ánh xạ từ DOM về mã nguồn                                                                 |
| `profile-browsing`                   | Profiling trình duyệt và React trong phạm vi xác định                                                                  |
| `test-apk`                           | Xác minh một bản bao bọc Android đi kèm được cung cấp                                                                  |
| `impeccable`, `improve-threejs`      | Thiết kế giao diện trong phạm vi xác định và review việc kết xuất Three.js                                             |
| `implement-plan`                     | Thực thi một kế hoạch, có thể ủy thác trong giới hạn                                                                   |
| `readme`                             | Duy trì tài liệu dự án đã được xác minh                                                                                |
| `context7`                           | Truy xuất tài liệu thư viện phù hợp với phiên bản                                                                      |
| `find-skills`                        | Tìm thêm skill khi được yêu cầu tường minh                                                                             |

## Vai trò và mô hình

Giữ các vai trò tùy chỉnh cho `browser-check`, `profiler`, `test-apk`, `translator` và `reviewer`. Dùng vai trò worker/general-purpose hoặc explorer có sẵn của harness cho việc triển khai và khám phá mã thông thường. Agent cha giao tiêu chí chấp nhận và quyền sở hữu; một bên sở hữu chạy các bước kiểm tra nặng.

Tệp agent của Codex bao gồm `name`, `description` và `developer_instructions`. `.codex/config.toml` giới hạn số agent con chạy đồng thời ở mức bốn bằng `max_concurrent_threads_per_session`. Siêu dữ liệu vai trò dùng chung chứa tên, mô tả và chế độ sandbox tùy chọn; nó cố ý không có trường mô hình nào.

Không đưa các trường mô hình và suy luận vào skill và agent tùy chỉnh đã commit ở cả ba ứng dụng. Điều này cho phép lựa chọn khi gọi lúc chạy, mặc định của người dùng và kế thừa từ agent cha theo thứ tự ưu tiên được ghi trong tài liệu của từng ứng dụng. Bí danh dòng mô hình của Claude giảm việc duy trì phiên bản nhưng vẫn chọn một dòng; một mô hình Cursor có gắn phiên bản sẽ cần cập nhật về sau. Hãy giữ những lựa chọn như vậy trong thiết lập người dùng/phiên khi cần. Việc kế thừa không hứa hẹn tự động chọn mô hình tốt nhất hiện có. Đừng tự bịa ra bí danh `latest` hay thêm việc nghiên cứu danh mục mô hình vào các tác vụ thường ngày. Xem [Cách chọn mô hình của Codex](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Cách chọn mô hình của Claude](https://code.claude.com/docs/en/sub-agents#choose-a-model) và [Cách chọn mô hình của Cursor](https://cursor.com/docs/subagents#model-configuration).

`sandbox-mode: read-only` ánh xạ tới sandbox của Codex và `readonly` của Cursor; danh sách công cụ của Claude và chỉ dẫn vai trò giới hạn quy trình review của nó, nhưng quyền truy cập Bash không phải là sandbox ở cấp hệ điều hành.

Frontmatter của skill dùng chung sử dụng `disable-model-invocation: true` cho các quy trình do người dùng gọi khi phù hợp. Thiết lập tương ứng của Codex nằm trong `agents/openai.yaml` dưới dạng `policy.allow_implicit_invocation: false`; trình xác thực yêu cầu cả hai. Siêu dữ liệu gọi bổ sung cho các quy tắc ủy quyền tường minh; một yêu cầu review không bao giờ cho phép công bố chỉ vì một skill có chứa các bước công bố.

## Kiểm tra và khám phá

- `yarn ai-workflow:sync` tạo lại các đầu ra tương thích bằng `js-yaml` và `smol-toml` đã cài đặt.
- `yarn ai-workflow:check` phân tích nguồn/frontmatter/cấu hình, kiểm tra các đầu ra được sinh, siêu dữ liệu gọi, vị trí của trường mô hình và phần kết nối hook chỉ dùng để định dạng. Nó không đối chiếu định danh mô hình với danh mục của nhà cung cấp.
- `yarn ai-workflow:test` chạy các fixture Node tách biệt cho payload của hook và cho việc sinh/xác thực quy trình.
- Sau khi nâng cấp một ứng dụng agent, hãy xác minh việc khám phá skill/vai trò ngay trong ứng dụng đó. Kiểm tra cú pháp/tính tương đồng không thay thế được việc kiểm tra trình nạp. Tải lại ứng dụng nếu một phiên hiện có vẫn giữ danh mục cũ.
- Hook yêu cầu cơ chế tin cậy dự án và việc review hook của harness; đừng vượt qua cơ chế tin cậy chỉ để một bước kiểm tra đạt. Xem [hooks-setup.md](hooks-setup.md).

## Duy trì các chỉ dẫn hữu ích

Hãy làm theo [hướng dẫn về skill và prompt của OpenAI](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) (xem xét ngày 2026-09-12): giữ mô tả chính xác, chỉ nạp chi tiết khi liên quan, và giữ đúng phạm vi người dùng yêu cầu. Skill dùng chung phục vụ nhiều mô hình khác nhau; hãy giữ lại các bất biến riêng của dự án trong khi vẫn cho phép các lựa chọn triển khai thông thường.

Giữ mục đích, ranh giới quyết định và các ràng buộc thiết yếu của một skill trong `SKILL.md`. Liên kết các lệnh hoặc ví dụ dài dành riêng cho từng chế độ như tài liệu tham khảo tùy chọn. Đặt điều kiện kích hoạt sớm trong phần mô tả ngắn; chỉ riêng việc khớp một từ khóa không nên làm mở rộng tác vụ. Giữ nguyên siêu dữ liệu gọi hiện có trừ khi hành vi của nó đang được thay đổi có chủ đích.

Sau một thay đổi đáng kể về chỉ dẫn, hãy thử vài yêu cầu nhỏ và lớn mang tính đại diện. Kiểm tra skill/tài liệu tham khảo nào đã được chọn, các hành động có nằm trong phạm vi không, việc xác minh có tương xứng với thay đổi không, và công việc được ủy quyền đã hoàn tất chưa. Các bài kiểm thử schema và fixture xác lập tính đúng đắn của công cụ, không phải chất lượng quyết định của agent.

## Công cụ và quyền sở hữu trình duyệt

Ưu tiên danh mục skill/công cụ hiện có và các CLI đã cài trong dự án. Dùng `gh` cho GitHub, `playwright-cli` cho việc xác minh trên trình duyệt, và tài liệu chính thức/theo đúng phiên bản khi hành vi của thư viện là quan trọng. Tránh cài các skill trùng lặp hoặc tải một gói không ghim phiên bản chỉ để chạy một trình định dạng sẵn có.

Chi phí của MCP phụ thuộc vào harness: việc nạp công cụ trì hoãn có thể tránh phải nạp mọi schema ngay từ đầu. Hãy giữ các tích hợp phù hợp với nhu cầu thay vì coi bản thân MCP là lỗi thời. Các lựa chọn CLI hiện có vẫn hữu ích cho khả năng tái lập và kiểm soát tài nguyên.

Mọi phiên trình duyệt đều dùng `./scripts/pw-session.sh`, script này đảm bảo chỉ có một trình duyệt hoạt động trên toàn máy. Mặc định dùng một phiên mới, tách biệt. Việc truy cập trình duyệt cá nhân hiện tại cần được ủy quyền tường minh; hãy tái sử dụng sự ủy quyền đó ở các bước tiếp theo. Chọn trình duyệt/viewport theo hành vi bị ảnh hưởng, chạy lần lượt các engine được chọn, đóng đúng phiên có tên cụ thể khi dọn dẹp, và không bao giờ dùng `close-all`/`kill-all`. Xem skill `playwright-cli` và [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md).
