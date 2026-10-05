# Những bất ngờ đã biết

Tệp này ghi lại các điểm dễ gây nhầm lẫn đặc thù của kho lưu trữ, những thứ đã từng khiến agent mắc lỗi.

## Tiêu chí ghi nhận

Chỉ thêm một mục khi tất cả những điều sau đều đúng:

- Nó đặc thù cho kho lưu trữ này (không phải lời khuyên chung chung).
- Nhiều khả năng nó sẽ lặp lại với các agent về sau.
- Nó có một cách khắc phục cụ thể để làm theo.

Nếu chưa chắc chắn, hãy hỏi nhà phát triển trước khi thêm mục mới.

## Mẫu ghi nhận

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

## Các mục đã ghi nhận

### Tên miền production của app trên Vercel có thể trôi ngược về bản triển khai từ Git master

- **Ngày:** 2026-04-28
- **Người ghi nhận:** Tommaso + Codex
- **Bối cảnh:** Kiểm tra các bản mirror của app Seedit và 5chan trong danh mục ứng dụng của Bitsocial Web.
- **Điều bất ngờ:** Các dự án `seedit` và `5chan` trên Vercel đặt `gitProviderOptions.createDeployments = "enabled"`, nên mỗi lần push lên `master` trên GitHub đều được đưa thẳng lên tên miền production, dù chính sách của kho lưu trữ yêu cầu các bản mirror production chỉ phục vụ artifact của bản phát hành.
- **Ảnh hưởng:** Huy hiệu "mirror đã xác minh" trong danh mục ứng dụng có thể trở nên sai sự thật, vì tên miền production phục vụ commit phát triển mới nhất thay vì tệp ZIP của bản phát hành trên GitHub, vốn có hash `index.html` được ghi trong `about/src/lib/apps-data.ts`.
- **Cách khắc phục:** Trước khi thêm hoặc cập nhật metadata xác minh mirror, hãy kiểm tra dự án Vercel bằng `vercel api /v9/projects/<project-id>` và xác nhận `gitProviderOptions.createDeployments = "disabled"`. Triển khai nội dung tệp ZIP của bản phát hành bằng `vercel deploy --prebuilt --prod`, và dùng `seedit-omega.vercel.app` hoặc `5chan-omega.vercel.app` cho các bản triển khai phát triển.
- **Trạng thái:** đã xác nhận

### Portless 0.11 tái dùng trạng thái proxy cũ trừ khi trình khởi chạy ép dùng HTTPS

- **Ngày:** 2026-04-28
- **Người ghi nhận:** Tommaso + Codex
- **Bối cảnh:** Nâng cấp luồng `yarn start` thông thường từ URL proxy cũ `http://bitsocial.localhost:1355` sang `https://bitsocial.localhost`.
- **Điều bất ngờ:** Ngay cả khi đã cài `portless@0.11.1`, Portless vẫn tái dùng proxy HTTP `~/.portless/proxy.port = 1355` sẵn có và in ra URL cũ `:1355`.
- **Ảnh hưởng:** Chỉ cập nhật phiên bản package và tài liệu là chưa đủ; `yarn start` vẫn có thể quảng bá và dùng URL cũ nếu người đóng góp đang chạy với trạng thái Portless cũ.
- **Cách khắc phục:** Giữ cho các script khởi động chủ động chạy proxy HTTPS của Portless trên cổng `443` trước khi đăng ký route của app, để luồng chạy chuyển hẳn khỏi trạng thái `1355` đã lưu thay vì kế thừa nó.
- **Trạng thái:** đã xác nhận

### Portless thay đổi URL cục bộ chuẩn của app

- **Ngày:** 2026-03-18
- **Người ghi nhận:** Codex
- **Bối cảnh:** Kiểm tra trên trình duyệt và các luồng smoke test
- **Điều bất ngờ:** URL cục bộ mặc định không phải cổng Vite thường thấy. Kho lưu trữ mong đợi `https://bitsocial.localhost` thông qua Portless, nên việc kiểm tra `localhost:3000` hay `localhost:5173` có thể trỏ nhầm app hoặc không trỏ vào đâu cả.
- **Ảnh hưởng:** Các bước kiểm tra trên trình duyệt có thể thất bại hoặc xác nhận nhầm mục tiêu, ngay cả khi máy chủ dev vẫn chạy tốt.
- **Cách khắc phục:** Hãy dùng `https://bitsocial.localhost` trước. Chỉ bỏ qua nó bằng `PORTLESS=0 corepack yarn start` khi bạn thực sự cần một cổng Vite trực tiếp.
- **Trạng thái:** đã xác nhận

### Hook của Commitizen chặn các commit không tương tác

- **Ngày:** 2026-03-18
- **Người ghi nhận:** Codex
- **Bối cảnh:** Các quy trình commit do agent thực hiện
- **Điều bất ngờ:** `git commit` kích hoạt Commitizen thông qua Husky và chờ đầu vào TTY tương tác, khiến shell không tương tác của agent bị treo.
- **Ảnh hưởng:** Agent có thể đứng im vô thời hạn trong một thao tác lẽ ra chỉ là commit bình thường.
- **Cách khắc phục:** Dùng `git commit --no-verify -m "message"` cho các commit do agent tạo. Con người vẫn có thể dùng `corepack yarn commit` hoặc `corepack yarn exec cz`.
- **Trạng thái:** đã xác nhận

### Cần Corepack để không rơi vào Yarn classic

- **Ngày:** 2026-03-19
- **Người ghi nhận:** Codex
- **Bối cảnh:** Chuyển trình quản lý package sang Yarn 4
- **Điều bất ngờ:** Máy vẫn còn một bản Yarn classic cài toàn cục trong `PATH`, nên chạy `yarn` trần có thể trỏ tới v1 thay vì phiên bản Yarn 4 đã được ghim.
- **Ảnh hưởng:** Nhà phát triển có thể vô tình bỏ qua việc ghim trình quản lý package của kho lưu trữ và nhận hành vi cài đặt hoặc kết quả lockfile khác đi.
- **Cách khắc phục:** Dùng `corepack yarn ...` cho các lệnh shell, hoặc chạy `corepack enable` trước để `yarn` trần trỏ tới phiên bản Yarn 4 đã ghim.
- **Trạng thái:** đã xác nhận

### Tên app Portless cố định gây xung đột giữa các worktree của Bitsocial Web

- **Ngày:** 2026-03-30
- **Người ghi nhận:** Codex
- **Bối cảnh:** Chạy `yarn start` trong một worktree Bitsocial Web trong khi một worktree khác đã phục vụ qua Portless
- **Điều bất ngờ:** Dùng đúng tên app Portless `bitsocial` ở mọi worktree khiến chính route bị trùng, kể cả khi các cổng phía sau khác nhau, nên tiến trình thứ hai thất bại vì `bitsocial.localhost` đã được đăng ký.
- **Ảnh hưởng:** Các nhánh Bitsocial Web chạy song song có thể chặn lẫn nhau, dù Portless vốn sinh ra để chúng cùng tồn tại an toàn.
- **Cách khắc phục:** Giữ việc khởi động Portless bên trong `scripts/start-dev.mjs`; script này hiện dùng route `*.bitsocial.localhost` gắn theo nhánh cho những trường hợp ngoài trường hợp chuẩn, và tự lùi về route gắn theo nhánh khi tên `bitsocial.localhost` trần đã bị chiếm.
- **Trạng thái:** đã xác nhận

### Bản xem trước tài liệu từng gán cứng cổng 3001

- **Ngày:** 2026-03-30
- **Người ghi nhận:** Codex
- **Bối cảnh:** Chạy `yarn start` song song với các kho lưu trữ cục bộ và agent khác
- **Điều bất ngờ:** Lệnh dev ở thư mục gốc chạy workspace tài liệu bằng `docusaurus start --port 3001`, nên cả phiên dev thất bại mỗi khi có tiến trình khác đã chiếm `3001`, dù app chính đã dùng Portless.
- **Ảnh hưởng:** `yarn start` có thể tắt tiến trình web ngay sau khi nó vừa khởi động, làm gián đoạn công việc cục bộ không liên quan chỉ vì một xung đột cổng của tài liệu.
- **Cách khắc phục:** Giữ việc khởi động tài liệu sau `yarn start:docs`; lệnh này hiện dùng Portless cùng `scripts/start-docs.mjs` để tôn trọng cổng trống được truyền vào, hoặc lùi về cổng trống kế tiếp khi chạy trực tiếp.
- **Trạng thái:** đã xác nhận

### Tên máy chủ Portless của tài liệu từng bị gán cứng

- **Ngày:** 2026-04-03
- **Người ghi nhận:** Codex
- **Bối cảnh:** Chạy `yarn start` trong một worktree Bitsocial Web phụ trong khi một worktree khác đã phục vụ tài liệu qua Portless
- **Điều bất ngờ:** `start:docs` vẫn đăng ký đúng tên máy chủ `docs.bitsocial.localhost`, nên `yarn start` có thể thất bại dù app about đã biết cách tránh xung đột route Portless cho tên máy chủ của chính nó.
- **Ảnh hưởng:** Các worktree song song không thể dùng lệnh dev ở thư mục gốc một cách đáng tin cậy, vì tiến trình tài liệu thoát trước và `concurrently` sau đó tắt luôn phần còn lại của phiên.
- **Cách khắc phục:** Giữ việc khởi động tài liệu sau `scripts/start-docs.mjs`; script này hiện suy ra cùng một tên máy chủ Portless gắn theo nhánh như app about, và truyền URL công khai dùng chung đó vào đích proxy dev `/docs`.
- **Trạng thái:** đã xác nhận

### Shell trong worktree có thể bỏ sót phiên bản Node đã ghim của kho lưu trữ

- **Ngày:** 2026-04-03
- **Người ghi nhận:** Codex
- **Bối cảnh:** Chạy `yarn start` trong các worktree Git như `.claude/worktrees/*` hoặc các bản checkout worktree ngang hàng
- **Điều bất ngờ:** Một số shell trong worktree trỏ `node` và `yarn node` tới Node `25.2.1` của Homebrew dù kho lưu trữ ghim `22.12.0` trong `.nvmrc`, nên `yarn start` có thể lặng lẽ chạy các trình khởi động dev trên runtime sai.
- **Ảnh hưởng:** Hành vi của máy chủ dev có thể lệch giữa bản checkout chính và các worktree, khiến lỗi khó tái hiện và vi phạm bộ công cụ Node 22 mà kho lưu trữ mong đợi.
- **Cách khắc phục:** Giữ các trình khởi động dev sau `scripts/start-dev.mjs` và `scripts/start-docs.mjs`; chúng hiện tự chạy lại bằng binary Node theo `.nvmrc` khi shell hiện tại đang ở sai phiên bản. Việc thiết lập shell vẫn nên ưu tiên `nvm use`.
- **Trạng thái:** đã xác nhận

### Tàn dư của `docs-site/` có thể che giấu việc thiếu mã nguồn tài liệu sau khi tái cấu trúc

- **Ngày:** 2026-04-01
- **Người ghi nhận:** Codex
- **Bối cảnh:** Dọn dẹp monorepo sau khi merge, tiếp nối việc chuyển dự án Docusaurus từ `docs-site/` sang `docs/`
- **Điều bất ngờ:** Thư mục `docs-site/` cũ có thể còn nằm trên đĩa cùng những tệp đã lỗi thời nhưng quan trọng như `i18n/`, ngay cả sau khi phần được theo dõi trong kho lưu trữ đã chuyển sang `docs/`. Điều đó khiến việc tái cấu trúc trông như bị trùng lặp ở máy cục bộ, và có thể che giấu việc các bản dịch tài liệu được theo dõi thực ra chưa hề được chuyển vào `docs/`.
- **Ảnh hưởng:** Agent có thể xóa thư mục cũ vì tưởng là "rác" rồi vô tình làm mất bản sao cục bộ duy nhất của các bản dịch tài liệu, hoặc tiếp tục sửa những script vẫn trỏ tới đường dẫn `docs-site/` đã chết.
- **Cách khắc phục:** Xem `docs/` là dự án tài liệu chuẩn duy nhất. Trước khi xóa bất kỳ tàn dư `docs-site/` nào trên máy, hãy khôi phục mã nguồn được theo dõi như `docs/i18n/` và cập nhật các script cùng hook để thôi tham chiếu tới `docs-site`.
- **Trạng thái:** đã xác nhận

### Bản xem trước tài liệu đa ngôn ngữ có thể làm tăng vọt RAM khi kiểm tra

- **Ngày:** 2026-04-01
- **Người ghi nhận:** Codex
- **Bối cảnh:** Sửa i18n của tài liệu, định tuyến theo ngôn ngữ và hành vi Pagefind bằng `yarn start:docs` cùng Playwright
- **Điều bất ngờ:** Chế độ xem trước tài liệu mặc định giờ chạy một bản dựng tài liệu đa ngôn ngữ đầy đủ kèm lập chỉ mục Pagefind trước khi phục vụ, và việc duy trì tiến trình đó song song với nhiều phiên Playwright hoặc Chrome có thể ngốn nhiều RAM hơn hẳn một vòng lặp dev Vite hay Docusaurus một ngôn ngữ.
- **Ảnh hưởng:** Máy có thể cạn bộ nhớ, các phiên trình duyệt có thể sập, và những lần chạy bị gián đoạn có thể để lại máy chủ tài liệu hoặc trình duyệt headless cũ tiếp tục chiếm bộ nhớ.
- **Cách khắc phục:** Với công việc tài liệu không cần kiểm tra route theo ngôn ngữ hay Pagefind, hãy ưu tiên `DOCS_START_MODE=live yarn start:docs`. Chỉ dùng bản xem trước đa ngôn ngữ mặc định khi bạn cần xác nhận các route đã dịch hoặc Pagefind. Chỉ giữ một phiên Playwright, đóng các phiên trình duyệt cũ trước khi mở phiên mới, và dừng máy chủ tài liệu sau khi kiểm tra xong nếu không còn cần đến.
- **Trạng thái:** đã xác nhận

### `translate-docs.py` có thể để lại các ngôn ngữ tài liệu dịch dở dang hoặc có đích liên kết hỏng

- **Ngày:** 2026-04-06
- **Người ghi nhận:** Codex
- **Bối cảnh:** Sửa route và nội dung tài liệu bản địa hóa sau khi `yarn start:docs` phục vụ trang chi tiết bằng tiếng Anh hoặc không dựng được đầu ra theo ngôn ngữ
- **Điều bất ngờ:** Pipeline dịch tài liệu cùng lúc có hai kiểu hỏng đặc thù của kho lưu trữ này: `scripts/translate-docs.py` chỉ trích xuất được một phần nhỏ các thông điệp của `DocsHome` khi lời gọi `tr(...)` dùng dạng mà nó không phân tích được, còn markdown đã dịch trong `docs/i18n/**` có thể chứa slug dịch máy hoặc mảnh `ZXQPLACEHOLDER` nằm bên trong đích liên kết.
- **Ảnh hưởng:** Trang chủ bản địa hóa có thể lặng lẽ quay về tiếng Anh, trang chi tiết bản địa hóa có thể hiện ra như chưa dịch, và `yarn docs:build` đầy đủ có thể thất bại vì liên kết hỏng trong bản dịch dù tài liệu nguồn vẫn hợp lệ.
- **Cách khắc phục:** Sau khi thay đổi bản dịch tài liệu hoặc tạo lại các tệp ngôn ngữ, luôn chạy `yarn docs:build` từ thư mục gốc của kho lưu trữ, quét markdown trong `docs/i18n/**` để tìm `ZXQPLACEHOLDER`, và xác nhận các liên kết đã dịch vẫn trỏ tới slug tài liệu chuẩn như `/apps/5chan/` thay vì đường dẫn URL đã dịch. Nếu nội dung của `DocsHome` thay đổi, hãy xác nhận `scripts/translate-docs.py` vẫn trích xuất được đủ mọi thông điệp `docs.home.*`.
- **Trạng thái:** đã xác nhận

### Kiểm tra không-JS cho site about phải dùng route Portless, không dùng bản xem trước SSR độc lập

- **Ngày:** 2026-04-12
- **Người ghi nhận:** Codex
- **Bối cảnh:** Kiểm tra hỗ trợ không-JS cho site `about/` từ một worktree nhánh
- **Điều bất ngờ:** Một bản xem trước SSR độc lập có thể trông vẫn ổn trong khi route Portless gắn theo nhánh thực sự lại đang phục vụ sai app shell hoặc một tiến trình cũ. Trong kho lưu trữ này, cam kết cục bộ thật sự là tên máy chủ Portless do `yarn start` tạo ra, chứ không phải một máy chủ xem trước tạm bợ.
- **Ảnh hưởng:** Agent có thể khẳng định sai rằng hỗ trợ không-JS vẫn hoạt động, hoặc bỏ sót những lỗi hồi quy chỉ xuất hiện trên `*.bitsocial.localhost`.
- **Cách khắc phục:** Khi kiểm tra `about/` trên trình duyệt, luôn khởi động máy chủ cục bộ thật bằng `yarn start` hoặc `yarn start:about` và thử URL Portless gắn theo nhánh trước tiên. Nếu một tên máy chủ Portless có vẻ đã cũ, hãy kiểm tra và dừng tiến trình cũ trước khi thử lại.
- **Trạng thái:** đã xác nhận

### `chain/` không được `yarn build:verify` và `yarn doctor` nhìn thấy

- **Ngày:** 2026-07-05
- **Người ghi nhận:** Codex
- **Bối cảnh:** Kiểm tra một diff chỉ chạm vào chain/ sau khi workspace `chain/` (app Vite độc lập cho `chain.bitsocial.net`) được thêm vào monorepo.
- **Điều bất ngờ:** `scripts/verify-build.mjs` chỉ nhận diện các tiền tố đường dẫn `about/`, `docs/` và `stats/`, nên một diff chỉ chạm vào chain/ in ra "No targeted build checks matched the current diff" và không chạy bản dựng nào cả, dù `build:chain` đã có sẵn trong `package.json` ở thư mục gốc. Ngoài ra, `yarn doctor` bị gán cứng thành `react-doctor about -y`, nên các thay đổi React trong `chain/src` hoàn toàn không được React Doctor kiểm tra.
- **Ảnh hưởng:** Agent kiểm tra thay đổi chain phải tự biết gọi thẳng `yarn build:chain` thay vì tin vào `yarn build:verify`, còn các vấn đề React trong `chain/src` (effect, hook, mã chết) thì `yarn doctor` không phát hiện được.
- **Cách khắc phục:** `scripts/verify-build.mjs` giờ có nhánh xử lý `chain/` tương ứng với nhánh `about/`, và `doctor` / `doctor:verbose` giờ chạy `react-doctor --project about,chain -y` trong một lần gọi duy nhất. `doctor:score` vẫn chỉ dành cho `about`, vì `--score` lặng lẽ không in gì khi kết hợp với `--project` cho nhiều hơn một dự án; hãy dùng `yarn react-doctor --project about,chain --verbose -y` (hoặc `--json`) nếu cần điểm số cho chain.
- **Trạng thái:** đã xác nhận

### P2P trên trình duyệt chạy bằng WebSockets bảo mật; pkc-js mặc định từ chối WebRTC và WebTransport

- **Ngày:** 2026-08-02
- **Người ghi nhận:** Claude
- **Bối cảnh:** Viết nội dung cho trang giới thiệu và tài liệu về cách P2P trên trình duyệt của Bitsocial hoạt động
- **Điều bất ngờ:** `@pkcprotocol/pkc-js` đi kèm một connection gater mặc định từ chối các lệnh dial WebRTC và WebTransport trong trình duyệt — `dist/browser/helia/dial-transport-filter.js` xuất ra `DENIED_DIAL_TRANSPORTS_BY_DEFAULT = ["webrtc", "webrtc-direct", "webtransport"]`. Bình luận trong mã nguồn nêu lý do: trong trình duyệt, những transport đó thêm vào các đường thiết lập kết nối dài và hay thất bại (STUN/ICE, xoay vòng certhash) làm chậm quá trình tải, trong khi WebSocket thì trực tiếp và đáng tin cậy. Mọi peer đang hoạt động trên bảng trạng thái P2P của blog đều hiển thị "Secure WebSocket". Gater này nằm trong `node_modules`, nên không có gì trong kho lưu trữ gợi ý về sự tồn tại của nó.
- **Ảnh hưởng:** Rất dễ viết ra nội dung công khai nghe hợp lý về mặt kỹ thuật nhưng lại sai — chẳng hạn quy công cho việc WebTransport đạt Baseline trên trình duyệt vào tháng 3 năm 2026 là thứ làm cho P2P trên trình duyệt của Bitsocial trở nên khả thi. Khẳng định đó đã lên tới trang giới thiệu, bảng so sánh và hai trang tài liệu trước khi nhà phát triển phát hiện ra. Những khẳng định sai về kiến trúc trên các trang công khai sẽ bị chính nhóm độc giả nhà phát triển mà site nhắm tới đem ra kiểm chứng.
- **Cách khắc phục:** Đừng bao giờ suy ra Bitsocial dùng transport nào chỉ từ những gì libp2p hay nền tảng trình duyệt hỗ trợ về mặt lý thuyết. Hãy kiểm tra `node_modules/@pkcprotocol/pkc-js/dist/browser/helia/dial-transport-filter.js` để biết danh sách từ chối hiện tại, xác nhận không có bản ghi đè `connectionGater` nào trong `about/src/`, và đọc các nhãn transport trực tiếp trên bảng "P2P status" của blog trước khi đưa ra bất kỳ khẳng định công khai nào. Thay đổi ở thượng nguồn thực sự mở đường cho việc đăng bài từ trình duyệt là bản sửa seqno đơn điệu của gossipsub trong `@libp2p/gossipsub` 15.0.21 (tháng 5 năm 2026); pkc-js hiện đi kèm bản 16.0.4.
- **Trạng thái:** đã xác nhận

### Liên kết tương đối `./page.md` từ một trang tài liệu chưa dịch làm hỏng mọi bản dựng bản địa hóa

- **Ngày:** 2026-08-02
- **Người ghi nhận:** Claude
- **Bối cảnh:** Thêm một trang mới chỉ có tiếng Anh, `docs/browser-p2p.md`, liên kết tới tài liệu sẵn có bằng `./peer-to-peer-protocol.md` và `./apps/5chan.md`
- **Điều bất ngờ:** Mỗi ngôn ngữ trong `docs/i18n/<lang>/docusaurus-plugin-content-docs/current/` phản chiếu lại cây tài liệu. Một trang mới vắng mặt trong các bản phản chiếu đó vẫn hiển thị ở mọi ngôn ngữ nhờ cơ chế lùi về tiếng Anh, nhưng các liên kết markdown tương đối của nó thì không còn phân giải được — Docusaurus sinh ra `/ar/browser-p2p/peer-to-peer-protocol.md/` và làm bản dựng thất bại với "Docusaurus found broken links!". Điểm mấu chốt là `yarn build:verify` và `yarn docs:build:verify` chỉ dựng `en` nên vẫn qua sạch sẽ; chỉ một bản `yarn docs:build` đầy đủ mới lộ ra vấn đề, và nó dừng ngay ở ngôn ngữ đầu tiên theo thứ tự bảng chữ cái (`ar`).
- **Ảnh hưởng:** Một thay đổi tài liệu có thể vượt qua mọi bước kiểm tra cục bộ nhanh mà vẫn làm hỏng bản dựng đa ngôn ngữ trên production. Lỗi này còn trông như chẳng liên quan gì tới thay đổi đó, vì thông báo lỗi nêu tên một đường dẫn ngôn ngữ mà tác giả chưa từng động vào.
- **Cách khắc phục:** Trong bất kỳ trang tài liệu nào chưa được phản chiếu vào `docs/i18n/**`, hãy dùng liên kết tính từ gốc (`/peer-to-peer-protocol/`, `/apps/5chan/`) thay cho liên kết `.md` tương đối; Docusaurus sẽ tự thêm tiền tố ngôn ngữ cho chúng. `docs/build-your-own-client.md` là ví dụ sẵn có. Hãy chạy `yarn docs:build` đầy đủ — chứ không chỉ `build:verify` — trước khi bàn giao bất kỳ thay đổi nào thêm mới hoặc liên kết tới một trang tài liệu.
- **Trạng thái:** đã xác nhận

### Các lần chạy `update-translations.js` đồng thời lặng lẽ làm mất khóa

- **Ngày:** 2026-08-02
- **Người ghi nhận:** Claude
- **Bối cảnh:** Áp dụng 26 khóa i18next đã dịch cho toàn bộ 36 ngôn ngữ thông qua skill `translate`
- **Điều bất ngờ:** Mỗi lần gọi là một thao tác đọc-sửa-ghi trên cả 36 tệp ngôn ngữ, nên hai lần gọi chạy cùng lúc sẽ đè lên nhau và một khóa biến mất mà không hề báo lỗi. Skill `translate` lại hướng dẫn rõ việc tạo tối đa 4 subagent chạy đồng thời, mà mỗi subagent đều sẽ gọi script này.
- **Ảnh hưởng:** Thất bại âm thầm: các khóa biến mất khỏi những ngôn ngữ ngẫu nhiên, còn diff vẫn trông hợp lý.
- **Cách khắc phục:** Đừng bao giờ để các subagent dịch ghi tệp ngôn ngữ đồng thời — hãy để chúng chỉ xuất ra các tệp JSON từ điển, rồi áp dụng từng khóa một cách tuần tự từ agent cha. Sau khi áp dụng, hãy kiểm tra bằng chương trình rằng mỗi khóa đều tồn tại trong cả 35 ngôn ngữ không phải tiếng Anh, và không giá trị nào giống hệt từng byte với nguồn tiếng Anh.
- **Trạng thái:** đã xác nhận
- **Cập nhật (2026-08-10):** Trước đây script này còn xác định đích bằng `path.join(process.cwd(), "public", "translations")`, nên lệnh chạy từ thư mục gốc như tài liệu ghi đã thất bại với "Translations directory not found" và phải được chạy từ `about/`. Giờ nó xác định workspace từ thư mục hiện tại hoặc từ vị trí của chính nó, và chạy được từ bất cứ đâu. Cái bẫy chạy đồng thời nêu trên thì vẫn không đổi.

### Các nút điều khiển chú thích trong môi trường phát triển có thể chặn những cú nhấp tự động

- **Bối cảnh:** Trang about và chain có các nút điều khiển cố định ở góc dưới bên phải, nơi thanh công cụ Agentation cũng xuất hiện trong môi trường phát triển.
- **Cách khắc phục:** `scripts/pw-session.sh open` đăng ký `window.__NO_DEV_TOOLBAR__ = true` trước khi tải lại trang. Trình khởi tạo Agentation cũng tôn trọng `__VISUAL_TESTING__` và `__PROFILING__`; tính năng kiểm tra mã nguồn vẫn dùng được một cách độc lập. Tự động hóa trình duyệt trực tiếp phải đặt cùng cờ đó trước khi tải ứng dụng.

### `skills add` cài bản sao cho Codex và Cursor vào thư mục `.agents/` bị gitignore

- **Ngày:** 2026-08-18
- **Người ghi nhận:** Tommaso + Claude
- **Bối cảnh:** Cài skill `improve-threejs` từ `millionco/react-doctor` bằng CLI `skills` (`vercel-labs/skills`).
- **Điều bất ngờ:** `npx skills add <repo> --skill <name> --agent codex` và `--agent cursor` đều ghi vào `.agents/skills/<name>/`, chứ không phải `.codex/skills/` hay `.cursor/skills/`. `AGENTS.md` cấm thư mục `.agents/` ở cấp kho lưu trữ và `.gitignore:29` bỏ qua nó, nên cả hai bản sao đều lặng lẽ không được theo dõi. Chỉ `--agent claude-code` ghi vào `.claude/skills/` như mong đợi. Ngoài ra, dạng phân tách bằng dấu phẩy được ghi trong tài liệu (`--agent claude-code,codex,cursor`) thất bại với "Invalid agents" và không cài gì cả, dù từng tên đều hợp lệ khi dùng riêng.
- **Ảnh hưởng:** Lệnh cài báo thành công trong khi hai trong ba bản sao cho các bộ công cụ lại nằm ở nơi sẽ không bao giờ được commit, nên Codex và Cursor lặng lẽ thiếu skill đó sau một lần clone mới. Dạng dấu phẩy cũng có thể tạo ra một lần cài không làm gì nhưng trông như thành công.
- **Cách khắc phục hiện tại:** Kho lưu trữ giờ theo dõi `.agents/skills` như nguồn chuẩn và sinh các bản sao cho Claude bằng `yarn ai-workflow:sync`. Lệnh cấm `.agents` trước đây và quy tắc bỏ qua đã được gỡ bỏ. Đừng sao chép skill mới vào ba thư mục gốc độc lập; hãy kiểm tra tính tương đồng của các tệp được sinh và danh mục của ứng dụng sau khi thêm một skill.
- **Trạng thái:** đã xác nhận
