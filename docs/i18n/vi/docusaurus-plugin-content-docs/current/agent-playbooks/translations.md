# Bản dịch

Trang about dùng JSON i18next tại `about/public/translations/{lang}/default.json`. Các bản dịch nguồn của Docusaurus nằm riêng trong `docs/i18n/`.

## Khóa của trang about

Dùng `.agents/skills/translate/SKILL.md`. Xác định các ngôn ngữ hiện có từ ổ đĩa và giữ nguyên placeholder, markup, thuật ngữ kỹ thuật và tên thương hiệu. Với các yêu cầu lớn hơn, các subagent có thể tạo những map độc lập, nhưng một agent cha phải áp dụng tuần tự mọi thao tác ghi vào các ngôn ngữ; trình cập nhật không có cơ chế khóa ghi.

Dùng một đường dẫn map duy nhất thuộc sở hữu của tác vụ. Xem trước bằng `node scripts/update-translations.js --key <key> --map <map.json> --include-en --dry`, rồi áp dụng với cùng các đối số kèm `--write`. Xác minh độ bao phủ/giá trị sau khi ghi và chỉ xóa những map tạm thuộc sở hữu của tác vụ này.

Dùng `--delete` cho các yêu cầu xóa. Xem xét các phát hiện của `--audit --dry` trước khi chạy `--audit --write` đã được ủy quyền; các khóa dịch động cần được rà soát mã nguồn thủ công. Chỉ sao chép tiếng Anh vào mọi ngôn ngữ đối với thuật ngữ kỹ thuật, thương hiệu hoặc placeholder.

## Các trang Docusaurus

`scripts/translate-docs.py` là trình ghi hàng loạt cho mọi trang/ngôn ngữ và không có bộ lọc theo từng tệp; đừng dùng nó cho một chỉnh sửa bản dịch hẹp. `scripts/check-docs-translations.py` là trình xác minh chỉ đọc và hỗ trợ `--locales` và `--paths`.

Giữ các code fence, liên kết, mã nội tuyến, địa chỉ hợp đồng, tiêu đề, bảng và admonition khớp với nguồn tiếng Anh. Xử lý các lỗi của trình xác minh; cảnh báo `frontmatter-untranslated` do tên thương hiệu có thể là điều được dự kiến. Hãy tuân theo `docs/AGENTS.md` và dựng thông qua thư mục gốc khi thay đổi theme hoặc hành vi i18n của tài liệu, để đầu ra tĩnh và Pagefind luôn đồng bộ.

## Rà soát ngữ nghĩa tùy chọn

Với các khóa i18next được chọn, hãy dùng `scripts/jev/translation-README.md`. Với các trang tài liệu, trước tiên hãy chạy `node scripts/jev/docs-translations.mjs --locales it,de --paths browser-p2p.md`. Lệnh này yêu cầu chọn ngôn ngữ/trang một cách tường minh, chạy trình xác minh cấu trúc và báo cáo phần rà soát ngữ nghĩa là chưa được xác minh cho đến khi suy luận trực tiếp được bật. Chỉ thêm `--live` khi tác vụ có ủy quyền nhà cung cấp và ngân sách; cấu hình máy riêng tư dùng chung cung cấp thông tin xác thực và một mô hình đã ghim phiên bản. Biến môi trường và `--model` có thể ghi đè thiết lập đó. Lệnh này không bao giờ chỉnh sửa bản dịch.

Bộ điều hợp trang giữ nguyên ngữ cảnh của toàn trang và giới hạn mỗi trang ở 24 KB, mỗi lần chạy ở 30 cặp. Với các trang lớn hơn, hãy chuẩn bị những cặp đoạn văn nguồn/bản dịch được căn chỉnh tường minh cho `translations.mjs --pairs`; đừng tự động ghép cặp đoạn văn theo chỉ số. Kết quả ngữ nghĩa chỉ mang tính tham khảo: hãy xem xét các vấn đề và mức độ bất định được báo cáo, và giữ lại các kiểm tra tất định về mã/liên kết/địa chỉ.
