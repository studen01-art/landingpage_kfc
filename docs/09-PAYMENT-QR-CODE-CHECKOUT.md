# MODULE 09 — PAYMENT & QR-CODE CHECKOUT

## 1. MỤC TIÊU

Hãy xây dựng và tích hợp **module Thanh toán** cho website KFC Fried Chicken Landing Page hiện tại.

Module thanh toán phải được tích hợp trực tiếp với:

* Giỏ hàng hiện tại.
* Quy trình Checkout hiện tại.
* Hệ thống mã đơn hàng.
* Giao diện responsive.
* Dữ liệu sản phẩm từ `./data/menu.csv`.

Website vẫn giữ nguyên kiến trúc:

* HTML5
* CSS3
* Vanilla JavaScript
* Bootstrap 5 CDN
* CSV làm nguồn dữ liệu sản phẩm
* Không backend.
* Không Node.js/Express.
* Không PHP.
* Không Python server.
* Không SQL/NoSQL database.
* Không gọi API thanh toán thật.

Đây là **demo thanh toán frontend**, không phải hệ thống xử lý thanh toán thật.

---

# 2. ĐỌC PROJECT TRƯỚC KHI CODE

Trước khi thay đổi bất kỳ file nào, hãy đọc toàn bộ:

```text
docs/00-README.md
docs/01-PRD.md
docs/02-UI-UX.md
docs/03-DATA-CSV.md
docs/04-TECHNICAL-RULES.md
docs/05-PROMPT-ANTIGRAVITY.md
docs/06-IMPLEMENTATION-CHECKLIST.md
docs/07-RUN-AND-LEARN.md
docs/08-CART-MODULE.md
```

Sau đó kiểm tra code hiện tại:

```text
index.html
css/style.css
js/app.js
js/cart.js (nếu tồn tại)
data/menu.csv
```

Không được tự ý viết lại toàn bộ website.

Phải tích hợp module thanh toán vào kiến trúc hiện tại.

---

# 3. THÔNG TIN TÀI KHOẢN NHẬN TIỀN

Sử dụng thông tin thanh toán demo sau:

```text
Ngân hàng: MB
Số tài khoản: 0934019198
Chủ tài khoản: Lã Thành Quyết
```

Thông tin này phải được tập trung trong một cấu hình JavaScript, ví dụ:

```js
const PAYMENT_CONFIG = {
    bankName: "MB",
    accountNumber: "0934019198",
    accountName: "Lã Thành Quyết"
};
```

Không hard-code thông tin tài khoản ở nhiều nơi trong HTML/JS.

---

# 4. NỘI DUNG CHUYỂN KHOẢN

Nội dung chuyển khoản bắt buộc phải chứa:

```text
MÃ ĐƠN HÀNG
```

Ví dụ:

```text
KFC-20261003-AB12
```

Khi tạo đơn hàng mới, hệ thống phải tự động sinh mã đơn hàng duy nhất.

Ví dụ format:

```text
KFC-YYYYMMDD-XXXX
```

Trong đó:

```text
YYYY = năm
MM = tháng
DD = ngày
XXXX = chuỗi ký tự ngẫu nhiên
```

Ví dụ:

```text
KFC-20261003-A7F2
```

Nội dung chuyển khoản mặc định:

```text
KFC-20261003-A7F2
```

Không sử dụng tên khách hàng làm nội dung chuyển khoản mặc định.

---

# 5. CÁC PHƯƠNG THỨC THANH TOÁN

Xây dựng giao diện cho 5 phương thức:

1. QR-Code / Chuyển khoản ngân hàng
2. MoMo
3. ATM
4. VISA
5. MASTER CARD

Giao diện có thể sử dụng Bootstrap Tabs, Nav Pills hoặc Cards.

Ví dụ:

```text
┌──────────────────────────────────────────┐
│             CHỌN PHƯƠNG THỨC             │
├──────────────────────────────────────────┤
│                                          │
│  [ QR CODE ] [ MoMo ] [ ATM ]            │
│  [ VISA ]    [ MASTER CARD ]             │
│                                          │
└──────────────────────────────────────────┘
```

---

# 6. PHƯƠNG THỨC 1 — QR CODE

Đây là phương thức thanh toán chính.

Sau khi khách chọn:

```text
QR CODE / CHUYỂN KHOẢN
```

Hiển thị:

```text
THANH TOÁN BẰNG QR CODE

Mã đơn hàng:
KFC-20261003-A7F2

Số tiền:
197.000 ₫

Ngân hàng:
MB

Số tài khoản:
0934019198

Chủ tài khoản:
Lã Thành Quyết

Nội dung chuyển khoản:
KFC-20261003-A7F2
```

Hiển thị QR Code ở vị trí nổi bật.

---

# 7. TẠO QR CODE

QR Code phải chứa thông tin chuyển khoản tương ứng với:

```text
Bank: MB
Account: 0934019198
Account name: Lã Thành Quyết
Amount: Tổng tiền đơn hàng
Transfer content: Mã đơn hàng
```

Ưu tiên sử dụng chuẩn VietQR.

Nếu cần thư viện QR:

* Có thể sử dụng thư viện QR Code CDN.
* Hoặc sử dụng QR generator phù hợp với frontend.
* Không tạo backend chỉ để sinh QR.

QR phải được sinh động theo đơn hàng.

Ví dụ:

```text
Đơn hàng A
→ QR chứa số tiền A
→ Nội dung A

Đơn hàng B
→ QR chứa số tiền B
→ Nội dung B
```

Không được dùng một QR tĩnh cho tất cả đơn hàng nếu QR có thể chứa số tiền và nội dung đơn hàng.

---

# 8. THÔNG TIN QR CODE

Bên dưới QR Code hiển thị:

```text
Quét mã QR bằng ứng dụng ngân hàng để thanh toán

Số tiền:
197.000 ₫

Nội dung:
KFC-20261003-A7F2
```

Có nút:

```text
[ Sao chép số tài khoản ]
[ Sao chép nội dung ]
[ Tôi đã thanh toán ]
```

Khi click:

```text
Sao chép số tài khoản
```

copy:

```text
0934019198
```

Khi click:

```text
Sao chép nội dung
```

copy:

```text
KFC-20261003-A7F2
```

Hiển thị Bootstrap Toast:

```text
Đã sao chép!
```

---

# 9. NÚT "TÔI ĐÃ THANH TOÁN"

Khi người dùng click:

```text
TÔI ĐÃ THANH TOÁN
```

Không được giả lập việc ngân hàng đã xác nhận giao dịch.

Hiển thị cảnh báo:

```text
Bạn đã xác nhận đã thực hiện thanh toán.

Trong phiên bản demo này, hệ thống chưa thể tự động xác minh giao dịch ngân hàng.
Đơn hàng sẽ được ghi nhận ở trạng thái "Chờ xác nhận thanh toán".
```

Sau đó chuyển trạng thái đơn hàng:

```text
pending_payment
```

sang:

```text
waiting_confirmation
```

---

# 10. PHƯƠNG THỨC MOMO

Tạo tab:

```text
MoMo
```

Hiển thị giao diện:

```text
THANH TOÁN QUA MOMO

Tổng tiền:
197.000 ₫

Mã đơn hàng:
KFC-20261003-A7F2
```

Vì website không có backend/API MoMo thật:

Không được giả lập API thanh toán thật.

Hiển thị:

```text
Đây là giao diện thanh toán MoMo demo.
Liên kết thanh toán MoMo thật cần được tích hợp qua cổng thanh toán/API chính thức.
```

Có thể hiển thị nút:

```text
[ Tiếp tục thanh toán MoMo ]
```

Khi click, hiển thị:

```text
Chức năng thanh toán MoMo thật chưa được kết nối trong phiên bản frontend demo.
```

Không tạo một giao dịch giả và không thông báo rằng tiền đã được thanh toán.

---

# 11. PHƯƠNG THỨC ATM

Tạo tab:

```text
ATM
```

Hiển thị:

```text
THANH TOÁN QUA ATM

Tổng tiền:
197.000 ₫

Mã đơn hàng:
KFC-20261003-A7F2
```

Vì đây là frontend-only:

Không được yêu cầu người dùng nhập:

* Số PIN ATM.
* OTP thật.
* Mật khẩu ngân hàng.
* Thông tin đăng nhập ngân hàng.

Không xây dựng form giả lập thu thập thông tin nhạy cảm.

Hiển thị thông báo:

```text
Thanh toán ATM trực tuyến cần kết nối với cổng thanh toán hoặc ngân hàng.
Phiên bản hiện tại chỉ mô phỏng giao diện thanh toán.
```

---

# 12. PHƯƠNG THỨC VISA

Tạo tab:

```text
VISA
```

Có thể hiển thị giao diện card payment demo:

```text
THANH TOÁN VISA

Số thẻ
[ Nhập số thẻ demo ]

Tên chủ thẻ
[ Nhập tên ]

Ngày hết hạn
[ MM/YY ]

CVV
[ *** ]
```

TUYỆT ĐỐI KHÔNG lưu dữ liệu thẻ vào:

```text
localStorage
sessionStorage
CSV
HTML
JavaScript variable
```

Không gửi dữ liệu thẻ đi đâu.

Không triển khai thanh toán thẻ thật.

Nên thêm chú thích:

```text
Đây chỉ là giao diện demo.
Không nhập thông tin thẻ thật.
```

Nếu không cần mô phỏng form nhập thẻ, có thể chỉ hiển thị:

```text
Thanh toán VISA cần tích hợp cổng thanh toán chuyên dụng.
```

Ưu tiên phương án an toàn này.

---

# 13. PHƯƠNG THỨC MASTER CARD

Tương tự VISA.

Hiển thị:

```text
MASTER CARD

Tổng tiền:
197.000 ₫

Mã đơn hàng:
KFC-20261003-A7F2
```

Thông báo:

```text
Thanh toán Mastercard thật cần được tích hợp qua payment gateway.
Phiên bản hiện tại là frontend demo.
```

Không lưu dữ liệu thẻ.

Không giả lập giao dịch thành công.

---

# 14. QUY TRÌNH CHECKOUT MỚI

Luồng người dùng:

```text
MENU
   ↓
ADD TO CART
   ↓
CART
   ↓
CHECKOUT
   ↓
NHẬP THÔNG TIN KHÁCH HÀNG
   ↓
TẠO MÃ ĐƠN HÀNG
   ↓
CHỌN PHƯƠNG THỨC THANH TOÁN
   ↓
QR / MOMO / ATM / VISA / MASTER CARD
   ↓
THANH TOÁN
   ↓
XÁC NHẬN
   ↓
ORDER SUCCESS
```

---

# 15. THÔNG TIN KHÁCH HÀNG

Checkout cần có:

```text
Họ và tên *
Số điện thoại *
Địa chỉ nhận hàng *
Ghi chú
```

Validate:

* Họ tên không được rỗng.
* Số điện thoại hợp lệ.
* Địa chỉ không được rỗng.

Không cần thu thập dữ liệu không cần thiết.

---

# 16. ORDER OBJECT

Tạo cấu trúc đơn hàng tương tự:

```js
{
    orderId: "KFC-20261003-A7F2",
    createdAt: "2026-10-03T13:00:00",
    customer: {
        name: "...",
        phone: "...",
        address: "...",
        note: "..."
    },
    items: [
        {
            id: "combo-01",
            name: "Combo Gà Rán",
            price: 59000,
            quantity: 2
        }
    ],
    subtotal: 118000,
    paymentMethod: "qr",
    paymentStatus: "waiting_confirmation",
    transferContent: "KFC-20261003-A7F2"
}
```

---

# 17. PAYMENT METHOD VALUES

Sử dụng các value thống nhất:

```js
qr
momo
atm
visa
mastercard
```

Ví dụ:

```js
paymentMethod: "qr"
```

---

# 18. PAYMENT STATUS

Sử dụng:

```text
pending_payment
waiting_confirmation
paid
cancelled
```

Trong frontend demo:

Không tự chuyển:

```text
pending_payment
→ paid
```

chỉ vì người dùng click nút.

QR:

```text
pending_payment
→ waiting_confirmation
```

sau khi khách click:

```text
Tôi đã thanh toán
```

Trạng thái:

```text
waiting_confirmation
```

---

# 19. LƯU ĐƠN HÀNG

Có thể dùng:

```js
localStorage
```

để demo.

Ví dụ:

```js
const ORDER_STORAGE_KEY = "kfc_demo_orders";
```

Lưu danh sách đơn hàng:

```js
[
    {
        orderId: "...",
        ...
    }
]
```

Không sử dụng localStorage để lưu:

* số thẻ
* CVV
* PIN
* OTP
* mật khẩu ngân hàng

---

# 20. TRANG / MODAL XÁC NHẬN ĐƠN HÀNG

Sau khi tạo đơn hàng hiển thị:

```text
ĐẶT HÀNG THÀNH CÔNG

Mã đơn hàng:
KFC-20261003-A7F2

Tổng thanh toán:
197.000 ₫

Phương thức:
QR Code / Chuyển khoản

Trạng thái:
Chờ xác nhận thanh toán
```

Nếu QR:

```text
Quét QR để thanh toán.

Ngân hàng: MB
Số tài khoản: 0934019198
Chủ tài khoản: Lã Thành Quyết
Nội dung: KFC-20261003-A7F2
```

---

# 21. NÚT SAU KHI ĐẶT HÀNG

Có:

```text
[ Xem thông tin đơn hàng ]
[ Về trang chủ ]
```

Nếu là QR:

```text
[ Sao chép mã đơn hàng ]
[ Sao chép nội dung chuyển khoản ]
```

---

# 22. HIỂN THỊ SỐ TIỀN

Tạo helper:

```js
function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
}
```

Ví dụ:

```text
59000
```

hiển thị:

```text
59.000 ₫
```

---

# 23. TẠO ORDER ID

Tạo helper:

```js
function generateOrderId() {
    // YYYYMMDD + random code
}
```

Ví dụ kết quả:

```text
KFC-20261003-A7F2
```

Không được sử dụng ID trùng nhau trong localStorage.

---

# 24. QR CODE DATA

Tạo một hàm:

```js
function buildPaymentQrData(order) {
    // Build dữ liệu QR dựa trên:
    // ngân hàng
    // số tài khoản
    // tên tài khoản
    // số tiền
    // nội dung chuyển khoản
}
```

QR phải được render từ dữ liệu của chính đơn hàng.

Không hard-code:

```text
197000
```

Không hard-code:

```text
KFC-20261003-A7F2
```

---

# 25. PAYMENT CONFIG

Tạo cấu hình trung tâm:

```js
const PAYMENT_CONFIG = {
    bankName: "MB",
    accountNumber: "0934019198",
    accountName: "Lã Thành Quyết",
    qrProvider: "vietqr"
};
```

Nếu cần bank BIN để tạo VietQR, xác định đúng mã ngân hàng MB trong quá trình implementation.

Không tự đoán hoặc hard-code sai mã ngân hàng.

---

# 26. UI/UX

Thiết kế phù hợp với giao diện KFC hiện tại.

Phong cách:

* Hiện đại.
* Rõ ràng.
* Dễ thao tác.
* Mobile-first.
* Payment information dễ đọc.
* QR Code đủ lớn để quét trên điện thoại.

Payment modal/card:

```text
┌───────────────────────────────────────┐
│             THANH TOÁN                │
├───────────────────────────────────────┤
│                                       │
│   Mã đơn: KFC-20261003-A7F2           │
│   Tổng tiền: 197.000 ₫                │
│                                       │
│ [QR] [MoMo] [ATM] [VISA] [MASTER]    │
│                                       │
│          ┌───────────────┐            │
│          │               │            │
│          │    QR CODE    │            │
│          │               │            │
│          └───────────────┘            │
│                                       │
│ Ngân hàng: MB                         │
│ STK: 0934019198                       │
│ Chủ TK: Lã Thành Quyết                │
│ Nội dung: KFC-20261003-A7F2           │
│                                       │
│ [ Sao chép nội dung ]                 │
│ [ Tôi đã thanh toán ]                 │
└───────────────────────────────────────┘
```

---

# 27. RESPONSIVE

Desktop:

* Payment modal/card rộng khoảng 600–800px.
* QR hiển thị rõ.
* Payment methods nằm ngang.

Mobile:

* Modal gần full width.
* Payment method buttons có thể xuống dòng.
* QR không vượt quá chiều rộng màn hình.
* Các nút đủ lớn để thao tác bằng ngón tay.

---

# 28. ACCESSIBILITY

Phải hỗ trợ:

* Keyboard navigation.
* `aria-label`.
* Focus state.
* Escape để đóng modal.
* Button không dùng `<div>` giả button.
* Input có `<label>`.

QR Code phải có alt text:

```text
Mã QR thanh toán cho đơn hàng KFC-20261003-A7F2
```

---

# 29. SECURITY

Không được:

```text
eval()
```

Không lưu:

```text
card number
CVV
PIN
OTP
bank password
```

Không gửi dữ liệu thanh toán tới server ngoài.

Không giả lập API ngân hàng.

Không tuyên bố:

```text
Thanh toán thành công
```

khi chưa có hệ thống xác minh thật.

---

# 30. ERROR HANDLING

Phải xử lý:

### Không có giỏ hàng

Hiển thị:

```text
Giỏ hàng đang trống.
```

### Tổng tiền bằng 0

Không cho checkout.

### Không tạo được order

Hiển thị:

```text
Không thể tạo đơn hàng. Vui lòng thử lại.
```

### QR không render được

Hiển thị:

```text
Không thể tạo mã QR.
Vui lòng sử dụng thông tin chuyển khoản bên dưới.
```

### localStorage lỗi

Website vẫn phải hoạt động ở mức cơ bản.

---

# 31. JAVASCRIPT FUNCTIONS

Ưu tiên tổ chức code thành các function:

```js
generateOrderId()
createOrder()
saveOrder()
loadOrders()

selectPaymentMethod()
renderPaymentMethod()

buildPaymentQrData()
renderPaymentQr()

copyAccountNumber()
copyTransferContent()

confirmPayment()

formatCurrency()

showPaymentModal()
closePaymentModal()

showToast()
```

Nếu project hiện tại đã có function tương đương thì tái sử dụng thay vì tạo duplicate.

---

# 32. FILE ĐƯỢC PHÉP THAY ĐỔI

Có thể chỉnh sửa:

```text
index.html
css/style.css
js/app.js
js/cart.js
```

Có thể tạo:

```text
js/payment.js
```

nếu module thanh toán đủ lớn.

Nếu tạo `js/payment.js`, phải cập nhật:

```html
<script src="js/payment.js"></script>
```

đúng thứ tự dependency.

---

# 33. KHÔNG ĐƯỢC PHÁ VỠ CHỨC NĂNG CŨ

Sau khi thêm payment module, các chức năng sau phải tiếp tục hoạt động:

* Load menu CSV.
* Search.
* Filter category.
* Sort.
* Add to cart.
* Increase quantity.
* Decrease quantity.
* Remove item.
* Clear cart.
* Cart badge.
* localStorage cart.
* Checkout.

Không được thay đổi cấu trúc CSV nếu không cần thiết.

---

# 34. TEST CASE

Sau khi implementation, kiểm tra tối thiểu:

### Test 1

Add sản phẩm vào cart.

Expected:

```text
Cart count tăng.
```

### Test 2

Mở checkout.

Expected:

```text
Thông tin sản phẩm và tổng tiền chính xác.
```

### Test 3

Nhập thông tin khách hàng hợp lệ.

Expected:

```text
Tạo Order ID.
```

### Test 4

Chọn QR.

Expected:

```text
QR được tạo.
```

Thông tin:

```text
MB
0934019198
Lã Thành Quyết
Order ID
Tổng tiền
```

phải chính xác.

### Test 5

Click:

```text
Sao chép số tài khoản
```

Expected:

```text
0934019198
```

được copy.

### Test 6

Click:

```text
Sao chép nội dung
```

Expected:

```text
Order ID
```

được copy.

### Test 7

Click:

```text
Tôi đã thanh toán
```

Expected:

```text
paymentStatus = waiting_confirmation
```

Không được tự động thành:

```text
paid
```

### Test 8

Chọn MoMo.

Expected:

```text
Hiển thị giao diện demo.
Không gọi API thật.
```

### Test 9

Chọn ATM.

Expected:

```text
Hiển thị thông tin demo.
Không yêu cầu PIN/OTP.
```

### Test 10

Chọn VISA.

Expected:

```text
Không lưu dữ liệu thẻ.
```

### Test 11

Chọn MASTER CARD.

Expected:

```text
Không lưu dữ liệu thẻ.
```

### Test 12

Refresh trang.

Expected:

```text
Cart vẫn được khôi phục nếu localStorage hoạt động.
Orders demo vẫn tồn tại nếu đã lưu.
```

### Test 13

Mobile.

Expected:

```text
Payment modal không tràn màn hình.
QR dễ nhìn.
Button dễ thao tác.
```

---

# 35. QUAN TRỌNG — GIỚI HẠN THANH TOÁN THẬT

Website hiện tại chỉ là:

```text
Frontend Demo
```

Không được tuyên bố rằng:

```text
Đã tích hợp thanh toán ngân hàng thật.
```

Không được tuyên bố:

```text
MoMo đã kết nối.
```

Không được tuyên bố:

```text
VISA/Mastercard đã thanh toán thật.
```

Không được xác nhận tiền đã vào tài khoản.

Muốn triển khai production cần tích hợp:

```text
Payment Gateway
Backend
Webhook
Transaction Verification
Order Management
Security
```

và quy trình xác thực thanh toán thực tế.

---

# 36. DISCLAIMER

Trong giao diện demo thanh toán, thêm thông báo phù hợp:

```text
Lưu ý: Đây là giao diện thanh toán demo. Phiên bản hiện tại chưa kết nối hệ thống xác minh giao dịch ngân hàng hoặc cổng thanh toán thực tế.
```

Đặc biệt với VISA/Mastercard:

```text
Không nhập thông tin thẻ thật vào phiên bản demo này.
```

---

# 37. YÊU CẦU CODE QUALITY

Code phải:

* Dễ đọc.
* Có comment ở phần xử lý payment.
* Không duplicate logic.
* Không hard-code tổng tiền.
* Không hard-code order ID.
* Không hard-code dữ liệu QR theo từng đơn hàng.
* Dùng function rõ ràng.
* Tách payment logic khỏi UI nếu có thể.
* Không làm ảnh hưởng menu/cart hiện tại.

---

# 38. DEFINITION OF DONE

Module hoàn thành khi:

* [ ] Checkout hoạt động.
* [ ] Tạo Order ID.
* [ ] Tính đúng tổng tiền.
* [ ] QR được tạo theo từng đơn hàng.
* [ ] QR chứa đúng số tiền.
* [ ] QR chứa đúng nội dung chuyển khoản.
* [ ] Ngân hàng hiển thị MB.
* [ ] STK hiển thị 0934019198.
* [ ] Chủ tài khoản hiển thị Lã Thành Quyết.
* [ ] Có nút copy STK.
* [ ] Có nút copy nội dung.
* [ ] Có trạng thái chờ xác nhận.
* [ ] Có MoMo demo.
* [ ] Có ATM demo.
* [ ] Có VISA demo.
* [ ] Có Mastercard demo.
* [ ] Không lưu thông tin thẻ.
* [ ] Không lưu CVV/PIN/OTP.
* [ ] Không có backend.
* [ ] Không gọi API thanh toán thật.
* [ ] Responsive.
* [ ] Accessibility cơ bản.
* [ ] Không phá vỡ Cart module.
* [ ] Không phá vỡ Menu module.
* [ ] Không có lỗi JavaScript trong Console.

---

# 39. FINAL REPORT

Sau khi hoàn thành, hãy báo cáo:

```text
1. Files created
2. Files modified
3. Payment flow
4. QR implementation
5. Order ID format
6. Payment status
7. LocalStorage keys
8. Test cases đã chạy
9. Known limitations
10. Những phần cần backend/payment gateway nếu triển khai production
```

Cuối cùng hãy kiểm tra toàn bộ website từ đầu đến cuối:

```text
Menu
→ Add Cart
→ Cart
→ Checkout
→ Customer Info
→ Order ID
→ Payment Method
→ QR
→ Confirm Payment
→ Order Success
```

Không kết thúc task chỉ sau khi viết code. Phải thực hiện kiểm tra và sửa các lỗi phát hiện được.
