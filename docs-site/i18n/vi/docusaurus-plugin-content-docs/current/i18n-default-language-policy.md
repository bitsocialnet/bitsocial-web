# Chính sách ngôn ngữ mặc định của i18n

Khách truy cập ẩn danh hiện giải quyết ngôn ngữ theo thứ tự sau:

1. Thông số truy vấn `?lang=`
2. Lựa chọn bộ chọn ngôn ngữ đã lưu từ `localStorage`
3. Mặc định ẩn danh nhận biết khu vực:
   - buộc tiếng Anh ở các khu vực sử dụng nhiều tiếng Anh được liệt kê rõ ràng
   - nếu không thì hãy sử dụng ngôn ngữ của trình duyệt/thiết bị khi đó là một trong những ngôn ngữ được chúng tôi hỗ trợ
4. Quay trở lại `en`

## Nguồn cơ sở

- [Chỉ số năng lực tiếng Anh EF 2025](https://www.ef.edu/epi/) năng lực tiếng Anh cấp quốc gia
- [Điều tra dân số Singapore 2020](https://www.singstat.gov.sg/modules/infographics/census-2020) dành cho Singapore, nơi tiếng Anh là ngôn ngữ ở nhà được sử dụng thường xuyên nhất đối với 48,3% cư dân từ 5 tuổi trở lên

## Các vùng mặc định bằng tiếng Anh được mã hóa

`AT`, `BE`, `CH`, `CZ`, `DE`, `DK`, `FI`, `GR`, `HU`, `MY`, `NL`, `NO`, `PH`, `PL`, `PT`, `RO`, `SE`, `SG`

## Đánh giá ngôn ngữ

| Ngôn ngữ | Khu vực được đánh giá      | Tín hiệu mới nhất                                                                                                                               | Kết quả                                                                                  |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `ar`     | `AE`                       | UAE EF EPI 2025: 487, Trung bình                                                                                                                | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `bn`     | `BD`, `IN`                 | Bangladesh 506, Trung bình; Ấn Độ 484, Trung bình                                                                                               | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `ca`     | `ES`                       | Tây Ban Nha 540, Trung bình                                                                                                                     | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `cs`     | `CZ`                       | Séc 582, Cao                                                                                                                                    | Tiếng Anh trong `CZ`                                                                     |
| `da`     | `DK`                       | Đan Mạch 611, Rất cao                                                                                                                           | Tiếng Anh trong `DK`                                                                     |
| `de`     | `DE`, `AT`, `CH`           | Đức 615, Rất cao; Áo 616, Rất cao; Thụy Sĩ 564, Cao                                                                                             | Tiếng Anh trong `DE`, `AT`, `CH`                                                         |
| `el`     | `GR`, `CY`                 | Hy Lạp 592, Cao; Cyprus 537, Moderate                                                                                                           | Tiếng Anh trong `GR`; ngôn ngữ trình duyệt/thiết bị trong `CY`                           |
| `en`     | Các ngôn ngữ nói tiếng Anh | Ngôn ngữ trình duyệt/thiết bị đã báo cáo `en-*` trong trường hợp phổ biến                                                                       | Tiếng Anh vẫn mặc định                                                                   |
| `es`     | `ES`                       | Tây Ban Nha 540, Trung bình                                                                                                                     | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `fa`     | `IR`                       | Iran 492, Trung bình                                                                                                                            | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `fi`     | `FI`                       | Phần Lan 603, Rất cao                                                                                                                           | Tiếng Anh trong `FI`                                                                     |
| `fil`    | `PH`                       | Philippines 569, Cao                                                                                                                            | Tiếng Anh trong `PH`                                                                     |
| `fr`     | `FR`, `BE`, `CH`           | Pháp 539, Trung bình; Bỉ 608, Rất cao; Thụy Sĩ 564, Cao                                                                                         | Tiếng Anh bằng `BE`, `CH`; ngôn ngữ trình duyệt/thiết bị trong `FR`                      |
| `he`     | `IL`                       | Israel 524, Trung bình                                                                                                                          | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `hi`     | `IN`                       | Ấn Độ 484, Trung bình                                                                                                                           | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `hu`     | `HU`                       | Hungary 590, Cao                                                                                                                                | Tiếng Anh trong `HU`                                                                     |
| `id`     | `ID`                       | Indonesia 471, Trung bình                                                                                                                       | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `it`     | `IT`, `CH`                 | Ý 513, Trung bình; Thụy Sĩ 564, Cao                                                                                                             | Tiếng Anh trong `CH`; ngôn ngữ trình duyệt/thiết bị trong `IT`                           |
| `ja`     | `JP`                       | Nhật Bản 446, Rất thấp                                                                                                                          | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `ko`     | `KR`                       | Hàn Quốc 522, Trung bình                                                                                                                        | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `mr`     | `IN`                       | Ấn Độ 484, Trung bình                                                                                                                           | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `nl`     | `NL`, `BE`                 | Hà Lan 624, Rất cao; Bỉ 608, Rất cao                                                                                                            | Tiếng Anh trong `NL`, `BE`                                                               |
| `no`     | `NO`                       | Na Uy 613, Rất cao                                                                                                                              | Tiếng Anh trong `NO`                                                                     |
| `pl`     | `PL`                       | Ba Lan 600, Rất cao                                                                                                                             | Tiếng Anh trong `PL`                                                                     |
| `pt`     | `PT`, `BR`                 | Bồ Đào Nha 612, Rất cao; Brazil 482, Trung bình                                                                                                 | Tiếng Anh trong `PT`; ngôn ngữ trình duyệt/thiết bị trong `BR`                           |
| `ro`     | `RO`, `MD`                 | Romania 605, Rất cao; Moldova 531, Trung bình                                                                                                   | Tiếng Anh trong `RO`; ngôn ngữ trình duyệt/thiết bị trong `MD`                           |
| `ru`     | `RU`                       | Nga 521, Trung bình                                                                                                                             | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `sq`     | `AL`                       | Albania 532, Trung bình                                                                                                                         | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `sv`     | `SE`, `FI`                 | Thụy Điển 609, Rất cao; Phần Lan 603, Rất cao                                                                                                   | Tiếng Anh trong `SE`, `FI`                                                               |
| `te`     | `IN`                       | Ấn Độ 484, Trung bình                                                                                                                           | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `th`     | `TH`                       | Thái Lan 402, Rất thấp                                                                                                                          | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `tr`     | `TR`                       | Turkiye 488, Trung bình                                                                                                                         | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `uk`     | `UA`                       | Ukraine 526, Trung bình                                                                                                                         | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `ur`     | `PK`, `IN`                 | Pakistan 493, Trung bình; Ấn Độ 484, Trung bình                                                                                                 | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `vi`     | `VN`                       | Việt Nam 500, Trung bình                                                                                                                        | Ngôn ngữ trình duyệt/thiết bị                                                            |
| `zh`     | `CN`, `HK`, `SG`           | Trung Quốc 464, Trung bình; Hồng Kông 538, Trung bình; Điều tra dân số Singapore năm 2020: Tiếng Anh được nói thường xuyên nhất ở nhà với 48,3% | Tiếng Anh trong `SG`; ngôn ngữ trình duyệt/thiết bị trong `CN`, `HK` và các khu vực khác |

Chỉ các phần ghi đè tích cực mới được mã hóa trong logic thời gian chạy. Tất cả các khu vực khác tiếp tục ưu tiên ngôn ngữ của trình duyệt/thiết bị khi nó khớp với một trong các mã ngôn ngữ được hỗ trợ.
