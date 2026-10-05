# Xác minh

Hãy chọn các bước kiểm tra dựa trên hành vi đã thay đổi và mức độ bất định còn lại. Tái sử dụng bằng chứng đã thành công cho cùng một trạng thái cuối; chạy lại sau các chỉnh sửa liên quan hoặc khi có lỗi. Các yêu cầu tường minh từ CI, quy trình phát hành hoặc người dùng vẫn được áp dụng.

| Thay đổi                                                   | Các bước kiểm tra phù hợp                                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Chỉ văn bản/chú thích/định dạng                            | Diff, các tham chiếu, các trình sinh liên quan; không cần dựng ứng dụng                                                             |
| Nguồn/cấu hình quy trình AI                                | `yarn ai-workflow:sync`, `yarn ai-workflow:check`, `yarn ai-workflow:test`; tạo lại chỉ mục LLM khi ngữ cảnh thay đổi               |
| Hàm trợ giúp hoặc script độc lập                           | Lệnh gọi/fixture có trọng tâm và kiểm tra cú pháp hoặc kiểu/lint cho phần mã bị ảnh hưởng                                           |
| Thay đổi runtime dùng chung, phụ thuộc, bản dựng, tích hợp | Các kiểm tra có trọng tâm cho phần bị ảnh hưởng cùng với các kiểm tra build/kiểu/lint liên quan bên dưới                            |
| Chỉ CSS/chủ đề/bố cục                                      | Các route/viewport/chủ đề bị ảnh hưởng trên các trình duyệt được chọn; dựng lại khi import, tài nguyên hoặc khâu xử lý CSS thay đổi |
| State/effect/hiệu năng React                               | Hành vi bị ảnh hưởng và hướng dẫn React áp dụng được; dùng Doctor khi chẩn đoán giải đáp được một mối lo cụ thể                     |

## Kiểm tra của dự án

- `yarn build:verify` chọn workspace bị ảnh hưởng. Khi đã biết phạm vi, hãy dùng `yarn build:about`, `yarn build:chain`, `yarn build:stats-monitor` hoặc `yarn docs:build:verify`.
- `yarn build` cố ý chạy toàn bộ bản dựng production cho about/docs, bao gồm mọi ngôn ngữ của tài liệu. Hãy dùng nó để xác thực trên toàn bộ bản phát hành hoặc cho những thay đổi đòi hỏi phạm vi đó.
- `yarn lint`, `yarn typecheck` và `yarn format:check` bao phủ các cổng kiểm tra hiện có của kho lưu trữ; với một chỉnh sửa script hẹp, hãy dùng trước các kiểm tra cú pháp/fixture/định dạng có trọng tâm cho nó.
- Thay đổi manifest/lockfile yêu cầu `corepack yarn install`, `yarn deps:check-pinned` và `yarn deps:check-hardened`. `yarn knip` chỉ mang tính tham khảo đối với phụ thuộc/import.
- Các kiểm tra bản dịch tài liệu nằm trong [translations.md](translations.md); đừng chạy trình ghi bản dịch hàng loạt cho một thay đổi tài liệu có trọng tâm.

## Bằng chứng trình duyệt và quyền sở hữu

Dùng Chrome cho các thay đổi trình duyệt nhỏ và độc lập. Thêm Firefox và WebKit cho CSS/bố cục/khả năng đáp ứng dùng chung, các API nhạy cảm với trình duyệt, tương tác trên diện rộng, bản phát hành, hoặc khi có tiêu chí đa trình duyệt tường minh. Bao gồm cả bố cục di động/hành vi cảm ứng bị ảnh hưởng. Chỉ thay đổi kích thước viewport không phải là giả lập cảm ứng. Hãy chọn route và nội dung thực tế dựa trên mã nguồn thay vì giả định rằng các ví dụ luôn có sẵn.

Dùng `playwright-cli` thông qua `./scripts/pw-session.sh`. Trên toàn máy chỉ có một trình duyệt hoạt động; các engine được chọn chạy lần lượt và mỗi phiên thuộc sở hữu cụ thể đều được đóng kể cả sau khi thất bại. Tái sử dụng một phiên đã được ủy quyền thuộc sở hữu của bên gọi mà không đóng nó. Đừng bao giờ dùng thao tác dọn dẹp trình duyệt toàn cục hay dừng một máy chủ không rõ chủ sở hữu. Công việc chỉ liên quan đến tài liệu không cần trình duyệt/máy chủ.

Với công việc về hiệu năng, hãy so sánh cùng một luồng với viewport, nội dung, thiết lập mạng/CPU, chế độ dựng và chi phí đo lường tương đương. Phân biệt điều quan sát được với nguyên nhân phỏng đoán. Dùng skill profile khi những phép đo này trả lời được yêu cầu thực tế.

## Bằng chứng cuối cùng

Một agent sở hữu việc xác minh nặng. Kiểm tra các khối lượng công việc đang chạy và tuần tự hóa việc cài đặt, bản dựng/bộ kiểm thử đầy đủ, Doctor, công việc Android/Electron và profiling trình duyệt. Báo cáo các lệnh/kết quả và những hạn chế cụ thể; dữ liệu bị thiếu hay một engine bị bỏ qua không phải là kết quả đạt. Fixture của công cụ xác minh định dạng và cơ chế, chứ không phải khả năng khám phá của ứng dụng từ đầu đến cuối hay chất lượng quyết định của mô hình.

## Kiểm tra React tự động

`yarn agent:verify` chạy các bản dựng được chọn, tiếp theo là `yarn doctor:check` và `yarn perf:check`. `perf:check` bao gồm phần tự kiểm tra tính tương thích của bộ thu thập và hồi quy có chủ đích, nên cả CI lẫn luồng xác minh của agent đều không cần một lượt `perf:test` riêng. Cài công cụ trình duyệt đã ghim phiên bản một lần bằng `yarn perf:install` (`--with-deps` trong CI Linux). Dùng bộ lọc mục tiêu/kịch bản cho các lần chạy lại có trọng tâm sau lượt chạy đầy đủ liên quan. Ngân sách của các kịch bản được khai báo tường minh trong `scripts/react-perf/config.mjs`; hãy giữ lại bằng chứng và sửa hồi quy trước khi cân nhắc một thay đổi baseline có lý do chính đáng. Các bản dựng production thông thường không bao gồm Bippy; các lệnh `build:profile:*` riêng biệt cung cấp phần đo đạc profiling React chính thức.

Kịch bản `apps-search` của about được điều nhịp bằng các giá trị URL/đầu vào đã commit cho từng ký tự. Kết quả đạt của nó chỉ bao phủ chuỗi truy vấn đã commit đó, chứ không phải khả năng phản hồi khi gõ nhanh. Hãy dùng một bản tái hiện nhập liệu nhanh riêng khi đánh giá tình trạng mất ký tự hoặc khả năng phản hồi đầu vào.
