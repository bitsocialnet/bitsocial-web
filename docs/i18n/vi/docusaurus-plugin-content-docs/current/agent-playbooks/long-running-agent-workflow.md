# Công việc agent chạy dài

Hãy dùng trạng thái tác vụ bền vững khi công việc cần được tiếp tục hoặc bàn giao, hoặc khi một lần chạy đơn lẻ đủ dài để việc nén ngữ cảnh có thể làm mất dấu phần việc còn lại. Tác vụ nhỏ không cần bảng hay tệp tiến độ. Với công việc dùng chung, hãy giữ một `feature-list.json` và `progress.md` ngắn gọn trong `docs/agent-runs/<slug>/` riêng cho tác vụ, dùng các mẫu sẵn có khi hữu ích.

Ghi lại kết quả được yêu cầu, nhánh/worktree hiện tại, quyền sở hữu tệp, các thay đổi đã hoàn tất, các bước kiểm tra cùng kết quả, các tiến trình/phiên mình sở hữu, và bước chưa giải quyết tiếp theo. Đừng lưu thông tin xác thực hay các bản kết xuất mã nguồn tùy tiện. Chỉ đánh dấu một tính năng là hoàn tất khi tiêu chí chấp nhận của nó đã được xác minh.

Khi tiếp tục, hãy kiểm tra trạng thái Git, tiến độ mới nhất và mã nguồn liên quan trước khi chỉnh sửa. Tái sử dụng các tài nguyên tương thích mà mình sở hữu; chỉ khởi động máy chủ dev khi bước kiểm tra tiếp theo cần đến. Chọn các bước kiểm tra theo mức ảnh hưởng bằng [verification.md](https://github.com/bitsocialnet/bitsocial-web/blob/master/docs/agent-playbooks/verification.md), thay vì lặp lại một lượt kiểm tra đầy đủ khi không có gì thay đổi.

Giữ các phần việc được ủy thác có liên quan trong phạm vi rõ ràng và không chồng chéo. Một agent sở hữu các bước kiểm tra nặng và các phiên trình duyệt. Cập nhật trạng thái bền vững khi một lát cắt đã hoàn thành, một vướng mắc hoặc một lần bàn giao làm thay đổi những gì người đóng góp tiếp theo cần biết; đừng ghi nhật ký mọi lệnh một cách máy móc.
