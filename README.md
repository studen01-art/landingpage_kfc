# KFC Promotional Landing Page — Vibe Coding & Antigravity

Dự án Landing Page quảng cáo món ăn KFC được phát triển theo phương pháp **Vibe Coding** với **Google Antigravity**. Website thuần Frontend / Static, không sử dụng bất kỳ backend hay framework phức tạp nào, tích hợp dữ liệu thực đơn động từ CSV, module giỏ hàng và module thanh toán đa phương thức (VietQR, MoMo, ATM, VISA, Mastercard demo).

---

## 🍗 Công Nghệ Sử Dụng (Tech Stack)

* **HTML5**: Thẻ ngữ nghĩa (semantic tags), trợ năng (ARIA, alt text, keyboard navigation, focus visible).
* **CSS3**: Fast-food visual identity (màu đỏ KFC `#E4002B`, vàng kim `#FFC72C`, tương phản cao), responsive mobile-first, `prefers-reduced-motion`.
* **JavaScript ES6+ (Vanilla)**: Fetch API, custom RFC-4180 CSV parser, Cart state management, Payment module.
* **Bootstrap 5.3.3 (CDN)**: Grid layout, Navbar collapse, Offcanvas drawer, Modal, Toast notifications.
* **Bootstrap Icons (CDN)**: Iconography hiện đại, trực quan.
* **QRCode.js (CDN)**: Sinh mã QR động phía frontend.
* **VietQR NAPAS 247**: Tích hợp chuẩn VietQR động với mã ngân hàng MB (BIN 970422).
* **CSV Data**: `./data/menu.csv` là database duy nhất cho thực đơn.
* **Vector Assets**: Hệ thống 25 file SVG vector món ăn & hero KFC trong `./assets/images/`, hoàn toàn độc lập và không phụ thuộc ảnh có bản quyền trên internet.

> **TUYỆT ĐỐI KHÔNG CÓ BACKEND:** Không Node.js server, không Express, không PHP, không Python backend, không MySQL/MongoDB/Firebase, không gọi API thanh toán thật.

---

## 📂 Cấu Trúc Thư Mục

```text
landingpage_kfc/
├── index.html                   # Trang chủ chính (Entry point)
├── README.md                    # Tài liệu hướng dẫn & kỹ thuật dự án
├── css/
│   └── style.css                # Toàn bộ CSS giao diện, giỏ hàng & thanh toán
├── js/
│   ├── app.js                   # Logic đọc CSV, search, filter, sort, modal & giỏ hàng
│   └── payment.js               # Module thanh toán, VietQR, sao chép & quản lý đơn hàng
├── data/
│   └── menu.csv                 # Database CSV duy nhất của thực đơn KFC
├── assets/
│   └── images/                  # 25 file SVG vector món ăn & hero KFC
├── docs/                        # Toàn bộ tài liệu PRD, UI/UX, CSV specs & module prompts
└── KFC-Antigravity-MD/          # Bản sao tài liệu gốc
```

---

## ✨ Các Tính Năng Đã Triển Khai

### 1. Thực Đơn Động & Tìm Kiếm (Menu Module)
- Đọc động từ `./data/menu.csv` với bộ parser RFC-4180 tự viết hỗ trợ dấu phẩy trong ngoặc kép.
- Tự động trích xuất danh mục động: `Combo`, `Gà Rán`, `Burger`, `Cơm`, `Món Ăn Nhẹ`, `Thức Uống & Tráng Miệng`.
- Tìm kiếm realtime theo tên món, danh mục hoặc mô tả.
- Sắp xếp linh hoạt theo giá (Thấp &rarr; Cao, Cao &rarr; Thấp, Mặc định).
- Modal xem chi tiết món ăn kèm bộ chọn số lượng.

### 2. Giỏ Hàng Mua Sắm (Shopping Cart Module)
- Biểu tượng giỏ hàng trên Navbar với huy hiệu hiển thị tổng số lượng món ăn thời gian thực.
- Nút "Thêm giỏ" trực tiếp trên từng thẻ món ăn và trong modal chi tiết.
- Chống trùng lặp dòng sản phẩm: tự động cộng dồn số lượng.
- Ngăn kéo giỏ hàng (Offcanvas Drawer) trượt từ bên phải với bộ tăng/giảm (+/-) số lượng, tự động xóa khi số lượng về 0.
- Xác nhận xóa giỏ hàng trước khi thực hiện để tránh bấm nhầm.
- Lưu trữ bền vững qua LocalStorage (`kfc_demo_cart`), an toàn chống crash khi dữ liệu hỏng.
- Kiểm soát khả dụng: tự động vô hiệu hóa món có `available=false`.

### 3. Thanh Toán & VietQR Checkout (Payment Module - Module 09)
- **Tập trung cấu hình thanh toán (`PAYMENT_CONFIG`)**:
  * Ngân hàng: **MB (Ngân hàng TMCP Quân Đội - BIN 970422)**
  * Số tài khoản: **0934019198**
  * Chủ tài khoản: **Lã Thành Quyết**
- **Định dạng mã đơn hàng tự động**: `KFC-YYYYMMDD-XXXX` (ví dụ: `KFC-20261003-A7F2`), bảo đảm tính duy nhất.
- **VietQR động theo từng đơn hàng**: Mã QR chứa chính xác số tiền đơn hàng và nội dung chuyển khoản là mã đơn hàng.
- **Dự phòng QR Offline**: Tự động chuyển sang QR sinh cục bộ bằng JavaScript nếu không có mạng.
- **1-Click Copy**: Nút sao chép số tài khoản (`0934019198`) và nội dung chuyển khoản kèm Toast thông báo.
- **5 Phương thức thanh toán**:
  1. *QR Code / Chuyển khoản (MB Bank)*: VietQR + thông tin tài khoản + nút xác nhận "Tôi đã thanh toán".
  2. *Ví MoMo (Demo)*: Giao diện demo, thông báo yêu cầu tích hợp cổng MoMo chính thức.
  3. *Thẻ ATM nội địa (Demo)*: Danh sách ngân hàng mô phỏng, bảo mật tuyệt đối không hỏi PIN/OTP.
  4. *Thẻ quốc tế VISA (Demo)*: Giao diện thẻ mô phỏng, cảnh báo an toàn PCI-DSS, không lưu trữ số thẻ/CVV.
  5. *Thẻ quốc tế Mastercard (Demo)*: Giao diện thẻ mô phỏng, bảo mật thông tin.
- **Quản lý trạng thái thanh toán chuẩn**:
  * `pending_payment`: Trạng thái ban đầu khi tạo đơn hàng.
  * `waiting_confirmation`: Chuyển sang sau khi khách bấm "Tôi đã thanh toán" hoặc hoàn tất demo.
  * Tuyệt đối không tự động chuyển thành `paid` khi chưa có webhook xác minh ngân hàng thật.
- **Lưu trữ lịch sử đơn hàng**: Ghi nhận danh sách đơn hàng demo vào LocalStorage (`kfc_demo_orders`).
- **Màn hình xác nhận đơn hàng thành công**: Hiển thị biên lai tóm tắt, mã đơn hàng, trạng thái "Chờ xác nhận thanh toán", thông tin người nhận và ghi nhớ chuyển khoản.

---

## 🚀 Hướng Dẫn Khởi Chạy

Do trình duyệt chặn `fetch('./data/menu.csv')` khi mở trực tiếp file `index.html` qua giao thức `file:///` (chính sách CORS cục bộ), bạn chỉ cần khởi chạy bằng một static web server đơn giản (đây chỉ là server phục vụ file tĩnh development, không phải backend):

### Cách 1: Sử dụng Python
Mở PowerShell tại thư mục dự án và chạy:
```powershell
python -m http.server 8000
```
Sau đó truy cập trình duyệt: `http://localhost:8000`

### Cách 2: Sử dụng VS Code Live Server
Chuột phải vào `index.html` &rarr; chọn **Open with Live Server**.

### Cách 3: Sử dụng Node `npx serve`
```powershell
npx serve .
```

---

## 🔒 Giới Hạn Bản Demo & Yêu Cầu Cho Môi Trường Production

Phiên bản này là **Frontend Static Demo** phục vụ học tập và trình diễn Vibe Coding. Nếu triển khai thực tế trên môi trường Production, hệ thống cần bổ sung:
1. **Backend Server**: Để tiếp nhận đơn hàng, xử lý webhook và quản lý phiên làm việc bảo mật.
2. **Cổng thanh toán (Payment Gateway)**: Kết nối API VietQR Pro / NAPAS, MoMo Merchant API, cổng thanh toán thẻ đạt chuẩn PCI-DSS (VNPAY, OnePay, Stripe...).
3. **Webhook & Tự động đối soát biến động số dư**: Tự động nhận thông báo biến động số dư (IPN/Webhook) từ ngân hàng để chuyển trạng thái từ `waiting_confirmation` sang `paid`.
4. **Cơ sở dữ liệu an toàn**: Lưu trữ dữ liệu khách hàng và lịch sử đơn hàng trên database bảo mật có sao lưu định kỳ.

---

## ⚖️ Tuyên Bố Miễn Trừ Trách Nhiệm (Disclaimer)

*Landing page demo / marketing độc lập phục vụ mục đích học tập & trình diễn Vibe Coding + Antigravity — không phải website chính thức hay hệ thống đặt hàng thương mại của KFC Việt Nam.*
*Nguồn tham khảo thông tin thực đơn: [kfcvietnam.com.vn](https://kfcvietnam.com.vn/).*
