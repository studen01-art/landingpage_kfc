# PROMPT — BUILD CART MODULE

Bạn là Senior Frontend Developer.

Website hiện tại là landing page quảng cáo gà rán KFC được xây dựng bằng:

* HTML5
* CSS3
* JavaScript Vanilla
* Bootstrap 5 CDN
* CSV tại `./data/menu.csv`

## NHIỆM VỤ

Hãy đọc toàn bộ tài liệu hiện có trong thư mục:

```text
docs/
```

Đặc biệt:

```text
00-README.md
01-PRD.md
02-UI-UX.md
03-DATA-CSV.md
04-TECHNICAL-RULES.md
05-PROMPT-ANTIGRAVITY.md
06-IMPLEMENTATION-CHECKLIST.md
07-RUN-AND-LEARN.md
```

Sau đó xây dựng thêm **MODULE GIỎ HÀNG (SHOPPING CART)** cho website.

---

# 1. NGUYÊN TẮC QUAN TRỌNG

Module giỏ hàng phải hoạt động hoàn toàn ở frontend.

### BẮT BUỘC

Sử dụng:

```text
HTML
CSS
JavaScript Vanilla
Bootstrap
CSV
```

### TUYỆT ĐỐI KHÔNG

Không tạo:

* Backend
* API
* Node.js server
* PHP
* Database server
* MySQL
* MongoDB
* Firebase
* Supabase
* REST API
* GraphQL
* Authentication server
* Payment gateway

Giỏ hàng chỉ là **frontend shopping cart demo**.

---

# 2. DATABASE / DATA SOURCE

Nguồn sản phẩm duy nhất:

```text
./data/menu.csv
```

Không tạo một danh sách sản phẩm khác trong JavaScript.

Mỗi sản phẩm trong giỏ hàng phải tham chiếu tới product data đã load từ CSV.

CSV hiện có:

```csv
id,name,category,description,price,image_url,featured,available
```

Giỏ hàng cần sử dụng tối thiểu:

```text
id
name
price
image_url
available
```

---

# 3. KIẾN TRÚC GIỎ HÀNG

Luồng hoạt động:

```text
menu.csv
   ↓
loadMenu()
   ↓
products
   ↓
Add to Cart
   ↓
Cart State
   ↓
Cart UI
   ↓
Checkout Demo
```

Cart state phải được quản lý bằng JavaScript.

Ví dụ:

```javascript
let cart = [];
```

Mỗi item trong cart có thể có cấu trúc:

```javascript
{
    id: "combo-01",
    name: "Combo Gà Rán",
    price: 59000,
    image_url: "assets/images/combo-01.jpg",
    quantity: 2
}
```

Không lưu toàn bộ product object nếu không cần thiết.

---

# 4. NÚT "THÊM VÀO GIỎ"

Mỗi product card phải có:

```text
[ Thêm vào giỏ ]
```

Khi click:

```text
Product
   ↓
Add to Cart
   ↓
Update cart state
   ↓
Update cart badge
   ↓
Update cart drawer/modal
```

Nếu sản phẩm đã tồn tại trong giỏ:

```text
quantity += 1
```

Không tạo item duplicate.

Ví dụ:

```text
Gà Rán
x 1
```

click thêm lần nữa:

```text
Gà Rán
x 2
```

---

# 5. CART ICON

Thêm biểu tượng giỏ hàng vào Navbar.

Ví dụ:

```text
Trang chủ
Combo
Menu
Ưu đãi
🛒 (3)
```

Badge phải hiển thị:

```text
TỔNG SỐ LƯỢNG SẢN PHẨM
```

Ví dụ:

```text
Gà x 2
Burger x 1
```

Badge:

```text
3
```

Không phải số loại sản phẩm.

---

# 6. CART DRAWER / CART MODAL

Khi click icon giỏ hàng:

Hiển thị một:

**Bootstrap Offcanvas**

hoặc:

**Bootstrap Modal**

Ưu tiên sử dụng:

```text
Bootstrap Offcanvas
```

Cart panel phải có:

```text
-----------------------------
GIỎ HÀNG

Gà Rán
[image]
59.000 ₫

[-]  2  [+]

Thành tiền: 118.000 ₫
-----------------------------

Burger
[image]
79.000 ₫

[-]  1  [+]

Thành tiền: 79.000 ₫
-----------------------------

Tạm tính:
197.000 ₫

[ XÓA GIỎ HÀNG ]

[ THANH TOÁN ]
-----------------------------
```

---

# 7. TĂNG / GIẢM SỐ LƯỢNG

Mỗi item có:

```text
[-] [quantity] [+]
```

### Khi click +

```text
quantity += 1
```

### Khi click -

```text
quantity -= 1
```

Nếu quantity giảm xuống:

```text
0
```

thì tự động xóa sản phẩm khỏi cart.

---

# 8. XÓA SẢN PHẨM

Mỗi cart item có nút:

```text
×
```

Click:

```text
removeFromCart(productId)
```

Sau đó:

* cập nhật cart;
* cập nhật badge;
* cập nhật total;
* render lại UI.

---

# 9. XÓA TOÀN BỘ GIỎ HÀNG

Có button:

```text
Xóa giỏ hàng
```

Khi click:

Hiển thị confirmation trước khi xóa.

Ví dụ:

```text
Bạn có chắc muốn xóa toàn bộ sản phẩm trong giỏ hàng?
```

Có:

```text
[Hủy]
[Xóa]
```

Không xóa ngay nếu người dùng chưa xác nhận.

---

# 10. EMPTY CART

Nếu cart không có sản phẩm:

Hiển thị:

```text
🛒

Giỏ hàng đang trống.

Hãy chọn món yêu thích của bạn!

[ XEM MENU ]
```

CTA:

```text
Xem menu
```

click sẽ đóng cart và scroll tới section menu.

---

# 11. CART TOTAL

Tính:

```text
subtotal = sum(price × quantity)
```

Ví dụ:

```text
Gà = 59.000 × 2
Burger = 79.000 × 1

Subtotal = 197.000 ₫
```

Format tiền:

```text
197.000 ₫
```

Không lưu chuỗi format tiền vào CSV.

CSV chỉ lưu:

```text
197000
```

---

# 12. CHECKOUT DEMO

Nút:

```text
Thanh toán
```

**KHÔNG tạo hệ thống thanh toán thật.**

Không gọi API.

Không gửi dữ liệu đến server.

Khi click `Thanh toán`, mở một Bootstrap Modal:

```text
ĐẶT MÓN — DEMO

Tổng đơn hàng:
197.000 ₫

Họ tên:
[________________]

Số điện thoại:
[________________]

Địa chỉ nhận hàng:
[________________]

[ XÁC NHẬN ĐẶT MÓN ]
```

Đây chỉ là frontend demo.

---

# 13. FORM CHECKOUT

Validate phía client:

### Họ tên

Required.

### Số điện thoại

Required.

Kiểm tra định dạng cơ bản.

### Địa chỉ

Required.

Nếu invalid:

Hiển thị validation message.

Ví dụ:

```text
Vui lòng nhập họ tên.
```

hoặc:

```text
Số điện thoại không hợp lệ.
```

---

# 14. SAU KHI ĐẶT HÀNG

Khi người dùng click:

```text
Xác nhận đặt món
```

Không gửi request tới server.

Hiển thị confirmation:

```text
🎉 ĐẶT MÓN THÀNH CÔNG!

Đây là bản demo frontend.
Đơn hàng chưa được gửi tới hệ thống KFC.

Tổng đơn hàng:
197.000 ₫

Cảm ơn bạn!
```

Sau đó có thể:

```text
[ VỀ TRANG CHỦ ]
```

hoặc:

```text
[ TIẾP TỤC MUA HÀNG ]
```

---

# 15. LOCALSTORAGE

Được phép sử dụng:

```javascript
localStorage
```

để lưu cart.

Mục đích:

```text
Browser
   ↓
localStorage
   ↓
cart
```

Khi người dùng:

1. Thêm sản phẩm.
2. Refresh page.

Giỏ hàng vẫn giữ nguyên.

Key đề xuất:

```text
kfc_demo_cart
```

---

# 16. LOCALSTORAGE RULES

Khi cart thay đổi:

```javascript
localStorage.setItem(
    "kfc_demo_cart",
    JSON.stringify(cart)
);
```

Khi page load:

```javascript
localStorage.getItem("kfc_demo_cart")
```

Sau đó validate dữ liệu.

Nếu localStorage chứa dữ liệu lỗi:

```text
Không làm crash website.
```

Fallback:

```javascript
cart = [];
```

---

# 17. PRODUCT AVAILABILITY

Nếu:

```text
available=false
```

thì không được cho phép thêm vào cart.

Product card phải hiển thị:

```text
Hết hàng
```

và disable:

```text
[ Thêm vào giỏ ]
```

Nếu một product trong cart sau đó không còn available:

Không crash.

Có thể hiển thị:

```text
Sản phẩm hiện không còn khả dụng.
```

và disable checkout nếu cần.

---

# 18. CART EVENT ARCHITECTURE

Ưu tiên sử dụng event delegation khi phù hợp.

Các action:

```text
add
increase
decrease
remove
clear
checkout
```

Có thể sử dụng:

```javascript
data-action="add"
data-action="increase"
data-action="decrease"
data-action="remove"
```

Ví dụ:

```html
<button
    data-action="add"
    data-product-id="combo-01">
    Thêm vào giỏ
</button>
```

Điều này giúp code dễ mở rộng.

---

# 19. JAVASCRIPT FUNCTIONS

Có thể tổ chức:

```javascript
addToCart(productId)
removeFromCart(productId)
increaseQuantity(productId)
decreaseQuantity(productId)
clearCart()
getCartCount()
getCartSubtotal()
saveCart()
loadCart()
renderCart()
updateCartBadge()
openCart()
closeCart()
openCheckout()
validateCheckout()
completeDemoOrder()
```

Không bắt buộc phải đúng tên function nhưng architecture phải rõ ràng.

---

# 20. UI/UX

Cart phải phù hợp với design hiện tại.

Không tạo một UI hoàn toàn khác.

Sử dụng:

* Bootstrap
* CSS hiện tại
* Typography hiện tại
* Border radius hiện tại
* Button style hiện tại

Cart phải responsive.

### Desktop

Cart Offcanvas khoảng:

```text
400px - 480px
```

### Mobile

Cart chiếm gần như toàn bộ màn hình:

```text
width: 100%;
```

---

# 21. CART UX

Khi thêm sản phẩm:

Có feedback nhẹ:

```text
✓ Đã thêm vào giỏ
```

Không sử dụng alert browser nếu có thể tránh.

Có thể dùng:

* Toast Bootstrap
* Small notification

Ví dụ:

```text
┌────────────────────┐
│ ✓ Đã thêm vào giỏ  │
└────────────────────┘
```

Toast tự biến mất sau vài giây.

---

# 22. ACCESSIBILITY

Cart phải hỗ trợ:

* Keyboard.
* Focus.
* Escape để đóng Offcanvas.
* aria-label cho các nút `+`, `-`, `x`.
* Button không chỉ chứa icon mà không có label accessible.

Ví dụ:

```html
<button
    aria-label="Tăng số lượng Gà Rán">
    +
</button>
```

---

# 23. SECURITY

Không sử dụng:

```javascript
eval()
```

Không tin tưởng dữ liệu từ localStorage.

Parse JSON bằng:

```javascript
JSON.parse()
```

và kiểm tra dữ liệu.

Không render dữ liệu user bằng `innerHTML` nếu không cần.

Ưu tiên:

```javascript
textContent
```

---

# 24. KHÔNG PHÁ VỠ CODE HIỆN TẠI

Đây là yêu cầu rất quan trọng.

Trước khi sửa:

1. Đọc `index.html`.
2. Đọc `css/style.css`.
3. Đọc `js/app.js`.
4. Hiểu architecture hiện tại.

Sau đó tích hợp Cart vào architecture hiện tại.

Không được:

* Xóa menu hiện tại.
* Xóa search.
* Xóa filter.
* Xóa sort.
* Xóa modal sản phẩm.
* Xóa responsive.
* Xóa các section hiện có.

Module Cart phải là **extension**, không phải rewrite toàn bộ project.

---

# 25. FILE ĐƯỢC PHÉP SỬA

Có thể sửa:

```text
index.html
css/style.css
js/app.js
```

Có thể tạo thêm nếu thực sự cần:

```text
js/cart.js
```

Nếu tạo `cart.js`, phải giải thích lý do.

Không tạo backend.

Không tạo database mới.

---

# 26. DATA FLOW SAU KHI CÓ CART

Architecture cuối cùng:

```text
                    menu.csv
                       │
                       ▼
                  loadMenu()
                       │
                       ▼
                 Product State
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
         Menu UI              Cart UI
             │                   │
             │ Add               │
             └─────────┬─────────┘
                       ▼
                   Cart State
                       │
                       ▼
                  localStorage
                       │
                       ▼
                  Checkout Demo
```

---

# 27. DEFINITION OF DONE

Module Cart chỉ được xem là hoàn thành khi tất cả điều kiện sau PASS:

```text
[ ] Cart icon xuất hiện trong Navbar
[ ] Cart badge hoạt động
[ ] Add to cart hoạt động
[ ] Không duplicate product
[ ] Quantity tăng
[ ] Quantity giảm
[ ] Quantity = 0 → remove
[ ] Remove item hoạt động
[ ] Clear cart hoạt động
[ ] Confirmation trước khi clear
[ ] Subtotal chính xác
[ ] Price format chính xác
[ ] Empty cart state
[ ] Cart Offcanvas/Modal
[ ] Toast khi thêm món
[ ] localStorage persistence
[ ] Reload page vẫn giữ cart
[ ] Invalid localStorage không làm crash
[ ] unavailable product không add được
[ ] Checkout modal
[ ] Checkout validation
[ ] Demo order confirmation
[ ] Không có backend
[ ] Không có API
[ ] Responsive mobile
[ ] Responsive desktop
[ ] Accessibility
[ ] Không console error
```

---

# 28. TEST SCENARIO

Sau khi code xong, hãy tự test các scenario:

## Scenario 1

Load website lần đầu.

Expected:

```text
Cart = 0
```

## Scenario 2

Add một món.

Expected:

```text
Cart = 1
```

## Scenario 3

Add cùng món lần nữa.

Expected:

```text
Cart = 2
```

Không tạo hai dòng sản phẩm.

## Scenario 4

Click `+`.

Expected:

```text
quantity + 1
```

## Scenario 5

Click `-`.

Expected:

```text
quantity - 1
```

## Scenario 6

Quantity = 1 → click `-`.

Expected:

```text
Product removed
```

## Scenario 7

Refresh browser.

Expected:

```text
Cart vẫn còn
```

## Scenario 8

Clear cart.

Expected:

```text
Confirmation
↓
Cart = empty
```

## Scenario 9

Checkout với form trống.

Expected:

```text
Validation error
```

## Scenario 10

Checkout hợp lệ.

Expected:

```text
Demo order success
```

Không gửi request tới server.

---

# 29. FINAL QA

Sau khi hoàn thành:

1. Kiểm tra console.
2. Kiểm tra Network.
3. Đảm bảo không có API request nào do Cart tạo ra.
4. Kiểm tra localStorage.
5. Test desktop.
6. Test mobile.
7. Test refresh.
8. Test empty cart.
9. Test unavailable product.
10. Test checkout.

Nếu phát hiện lỗi thì tự sửa trước khi báo cáo.

---

# 30. FINAL REPORT

Sau khi hoàn thành hãy báo cáo:

## Files Modified

```text
...
```

## Files Created

```text
...
```

## Cart Features

```text
✓ Add to cart
✓ Quantity
✓ Remove
✓ Clear
✓ Total
✓ LocalStorage
✓ Checkout demo
...
```

## Tests

```text
PASS / FAIL
```

## Known Issues

Nếu không có:

```text
No known issues.
```

---

# BẮT ĐẦU

Trước tiên:

1. Đọc toàn bộ `docs/*.md`.
2. Kiểm tra project hiện tại.
3. Đọc `index.html`, `css/style.css`, `js/app.js`.
4. Hiểu architecture hiện tại.
5. Lập kế hoạch tích hợp Cart.
6. Triển khai.
7. Test.
8. Sửa lỗi.
9. Chạy Final QA.
10. Báo cáo kết quả.

**Không tạo backend.**

**Không tạo API.**

**Không thay đổi công nghệ.**

**Không phá vỡ các chức năng hiện tại.**

**Module Cart phải tích hợp vào website hiện tại thay vì viết lại toàn bộ website.**