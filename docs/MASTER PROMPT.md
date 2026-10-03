# MASTER PROMPT — BUILD KFC LANDING PAGE

Bạn là một **Senior Frontend Developer + UI/UX Designer**, chuyên phát triển website bằng HTML/CSS/JavaScript và Vibe Coding.

Tôi đã chuẩn bị một bộ tài liệu Markdown trong thư mục `docs/`.

## NHIỆM VỤ QUAN TRỌNG

**Trước khi viết bất kỳ code nào, hãy đọc toàn bộ các file `.md` trong thư mục `docs/`.**

Đặc biệt phải đọc:

```text
docs/00-README.md
docs/01-PRD.md
docs/02-UI-UX.md
docs/03-DATA-CSV.md
docs/04-TECHNICAL-RULES.md
docs/05-PROMPT-ANTIGRAVITY.md
docs/06-IMPLEMENTATION-CHECKLIST.md
docs/07-RUN-AND-LEARN.md
```

Sau khi đọc xong, hãy hiểu toàn bộ yêu cầu và thực hiện dự án.

---

# 1. YÊU CẦU CỐT LÕI

Xây dựng một **Landing Page quảng cáo gà rán KFC**.

Website phải là **frontend/static website**.

### Công nghệ BẮT BUỘC

* HTML5
* CSS3
* JavaScript Vanilla
* Bootstrap 5 thông qua CDN
* CSV làm nguồn dữ liệu
* Không sử dụng framework frontend

### TUYỆT ĐỐI KHÔNG ĐƯỢC TẠO BACKEND

Không được sử dụng:

* Node.js backend
* Express
* PHP
* Laravel
* Python backend
* Django
* Flask
* MySQL
* PostgreSQL
* MongoDB
* Firebase backend
* Supabase backend
* REST API
* GraphQL
* Server-side rendering
* API server

Database duy nhất của project là:

```text
./data/menu.csv
```

---

# 2. NGUỒN THAM KHẢO

Website tham khảo:

https://kfcvietnam.com.vn/

Sử dụng website này để:

* Tham khảo cách phân loại menu.
* Tham khảo tên/dạng sản phẩm.
* Tham khảo cách trình bày món ăn.
* Tham khảo phong cách visual fast-food.
* Tham khảo bố cục marketing.

**Không được tuyên bố website này là website chính thức của KFC.**

Không tự động copy toàn bộ hình ảnh từ website KFC.

Nếu chưa có hình ảnh được cấp phép:

* sử dụng placeholder;
* hoặc tạo cấu trúc asset để tôi thay ảnh sau.

---

# 3. ĐỌC TÀI LIỆU TRƯỚC KHI CODE

Sau khi đọc toàn bộ `docs/*.md`, hãy thực hiện theo thứ tự:

```text
READ DOCUMENTATION
        ↓
UNDERSTAND REQUIREMENTS
        ↓
ANALYZE PROJECT
        ↓
CREATE IMPLEMENTATION PLAN
        ↓
CREATE FILE STRUCTURE
        ↓
IMPLEMENT DATA LAYER
        ↓
IMPLEMENT UI
        ↓
IMPLEMENT INTERACTIONS
        ↓
TEST
        ↓
FIX
        ↓
FINAL QA
```

Không được bỏ qua bước đọc tài liệu.

---

# 4. BƯỚC 1 — PHÂN TÍCH

Trước khi code, hãy kiểm tra project hiện tại.

Nếu project chưa có cấu trúc phù hợp, hãy tạo:

```text
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── data/
│   └── menu.csv
├── assets/
│   └── images/
└── docs/
    └── *.md
```

Nếu file/thư mục đã tồn tại:

* Không tạo bản sao không cần thiết.
* Không xóa dữ liệu hiện có nếu chưa cần.
* Tận dụng code hiện tại nếu phù hợp.

---

# 5. BƯỚC 2 — DATA

File dữ liệu chính:

```text
./data/menu.csv
```

CSV có cấu trúc:

```csv
id,name,category,description,price,image_url,featured,available
```

JavaScript phải đọc dữ liệu bằng:

```javascript
fetch('./data/menu.csv')
```

Sau đó:

```text
CSV
 ↓
Parse
 ↓
Validate
 ↓
Normalize
 ↓
Filter/Search/Sort
 ↓
Render
```

### QUAN TRỌNG

Không được hard-code danh sách món ăn trong:

```text
index.html
```

hoặc:

```text
app.js
```

Menu phải được render từ CSV.

---

# 6. BƯỚC 3 — LANDING PAGE

Landing page phải có các section:

## Header

Bao gồm:

* Logo/brand area.
* Navigation.
* Trang chủ.
* Combo.
* Menu.
* Ưu đãi.
* Liên hệ.
* CTA `Đặt món ngay`.

Header responsive.

Mobile phải có hamburger menu Bootstrap.

---

## Hero

Thiết kế nổi bật, hấp dẫn, mang phong cách fast-food.

Ví dụ định hướng:

> GÀ GIÒN NÓNG HỔI — BẬT MOOD ĂN NGON!

Có:

* Heading lớn.
* Description.
* CTA chính.
* CTA xem menu.
* Hình món ăn nổi bật.

Desktop:

```text
TEXT                         IMAGE
TEXT                         IMAGE
CTA                          IMAGE
```

Mobile:

```text
TEXT
CTA
IMAGE
```

---

# 7. FEATURED COMBO

Hiển thị các món có:

```text
featured=true
```

Mỗi card gồm:

* Image.
* Name.
* Description.
* Price.
* CTA.

Không hard-code danh sách featured.

---

# 8. MENU

Tạo section menu lấy hoàn toàn từ CSV.

Các category có thể gồm:

```text
Combo
Gà rán
Burger
Cơm
Món ăn nhẹ
Tráng miệng & thức uống
```

Category phải được tạo dựa trên dữ liệu thực tế trong CSV.

Không hard-code category nếu có thể lấy động từ data.

---

# 9. SEARCH

Thêm ô tìm kiếm món ăn.

Search theo:

```text
name
category
description
```

Ví dụ:

Người dùng nhập:

```text
gà
```

thì hiển thị các món liên quan.

Search phải hoạt động realtime hoặc gần realtime.

---

# 10. FILTER

Tạo filter category.

Ví dụ:

```text
[Tất cả]
[Combo]
[Gà rán]
[Burger]
[Cơm]
[Snack]
[Đồ uống]
```

Category phải được lấy từ CSV.

---

# 11. SORT

Cho phép:

```text
Mặc định
Giá thấp → cao
Giá cao → thấp
```

Giá trong CSV phải là số.

Ví dụ:

```text
59000
```

Hiển thị:

```text
59.000 ₫
```

---

# 12. PRODUCT MODAL

Khi click vào món ăn:

Mở Bootstrap Modal.

Modal hiển thị:

* Hình ảnh.
* Tên món.
* Category.
* Description.
* Price.
* Availability.
* CTA.

Modal phải lấy dữ liệu từ object menu hiện tại.

Không tạo dữ liệu riêng cho modal.

---

# 13. PROMOTION SECTION

Tạo section marketing nổi bật.

Ví dụ:

```text
HOT DEAL

BỮA ĂN NGON — CHIA SẺ NIỀM VUI

Khám phá các lựa chọn hấp dẫn...
```

Có CTA.

### LƯU Ý

Không được tự khẳng định một chương trình khuyến mãi thực tế của KFC nếu chưa có dữ liệu xác minh.

Không viết các câu như:

```text
KFC đang giảm 50%
```

nếu CSV/tài liệu không cung cấp thông tin đó.

---

# 14. FINAL CTA

Cuối landing page có một CTA lớn:

```text
SẴN SÀNG CHO MỘT BỮA GÀ GIÒN?

[ĐẶT MÓN NGAY]
```

CTA có thể:

* scroll tới menu;
* hoặc dẫn tới URL chính thức nếu URL đó được cấu hình.

Không tạo hệ thống checkout/backend.

---

# 15. FOOTER

Footer gồm:

* Brand.
* Navigation.
* Contact/demo information.
* Link website tham khảo.
* Copyright.

Thêm disclaimer:

```text
Landing page demo/marketing độc lập — không phải website chính thức của KFC Việt Nam.
```

---

# 16. UI/UX

Tuân thủ `docs/02-UI-UX.md`.

Phong cách:

* Fast food.
* Bold.
* Energetic.
* Appetizing.
* Clean.
* High contrast.

Màu chủ đạo có thể lấy cảm hứng từ KFC:

```text
Red
White
Black/Dark Gray
```

Không cần copy nguyên giao diện website KFC.

---

# 17. RESPONSIVE

Website phải hoạt động tốt trên:

```text
320px
375px
414px
768px
992px
1200px+
```

Đặc biệt kiểm tra:

* Navbar.
* Hero.
* Product cards.
* Filter.
* Search.
* Modal.
* Footer.

Không được xuất hiện horizontal scrollbar không cần thiết.

---

# 18. ACCESSIBILITY

Phải có:

* Semantic HTML.
* `alt` cho image.
* Keyboard navigation.
* Visible focus state.
* Accessible buttons.
* `aria-label` cho icon-only button.
* Modal đóng được bằng Escape.
* Contrast phù hợp.

---

# 19. LOADING / ERROR / EMPTY STATE

Khi đang load CSV:

```text
Đang tải menu...
```

Nếu CSV lỗi:

```text
Không thể tải menu.
Vui lòng kiểm tra file data/menu.csv.
```

Nếu không có món phù hợp:

```text
Chưa có món phù hợp.
```

Không để website trắng khi xảy ra lỗi.

---

# 20. JAVASCRIPT ARCHITECTURE

Trong `app.js`, ưu tiên cấu trúc:

```javascript
loadMenu()
parseCSV()
normalizeItem()
validateItem()
formatPrice()
getCategories()
filterItems()
searchItems()
sortItems()
renderMenu()
renderFeatured()
showProductModal()
bindEvents()
```

Không nhất thiết phải sử dụng đúng tên function trên, nhưng architecture phải rõ ràng.

---

# 21. SECURITY / CODE QUALITY

Không sử dụng:

```javascript
eval()
```

Hạn chế `innerHTML`.

Ưu tiên:

```javascript
element.textContent = value;
```

Kiểm tra dữ liệu trước khi render.

Không đưa dữ liệu người dùng trực tiếp vào HTML mà không xử lý.

---

# 22. IMAGES

Nếu CSV có:

```text
image_url
```

thì sử dụng image URL/path đó.

Nếu không có image:

```text
assets/images/placeholder.jpg
```

Không để broken image.

Có thể tạo fallback bằng JavaScript.

---

# 23. BOOTSTRAP

Dùng Bootstrap 5 CDN.

Có thể sử dụng:

* Navbar
* Container
* Grid
* Card
* Button
* Modal
* Badge
* Form
* Dropdown

Không cần tự viết lại các component Bootstrap nếu không cần.

CSS custom chỉ dùng để tạo visual identity riêng.

---

# 24. KHÔNG OVER-ENGINEER

Đây là project học:

**Vibe Coding + Antigravity + Frontend + CSV.**

Không tạo architecture phức tạp.

Không thêm:

* Build system không cần thiết.
* Backend.
* API.
* Database server.
* Authentication.
* CMS.
* Framework.

Giữ project dễ đọc và dễ học.

---

# 25. SAU KHI CODE

Sau khi hoàn thành implementation:

### Kiểm tra:

```text
[ ] index.html
[ ] Bootstrap
[ ] CSS
[ ] JavaScript
[ ] CSV
[ ] Images
[ ] Navbar
[ ] Hero
[ ] Featured
[ ] Menu
[ ] Search
[ ] Filter
[ ] Sort
[ ] Modal
[ ] Promotion
[ ] CTA
[ ] Footer
[ ] Responsive
[ ] Accessibility
[ ] Error state
[ ] Empty state
```

Sau đó kiểm tra JavaScript console.

Nếu phát hiện lỗi:

1. Xác định nguyên nhân.
2. Sửa.
3. Test lại.
4. Không chỉ báo lỗi cho tôi nếu bạn có thể tự sửa.

---

# 26. QUY TẮC KHI LÀM VIỆC

Không hỏi tôi những câu hỏi không cần thiết.

Nếu có một chi tiết nhỏ chưa được xác định:

* chọn phương án hợp lý;
* triển khai;
* ghi chú ngắn trong báo cáo cuối.

Chỉ hỏi tôi khi thiếu thông tin **bắt buộc** để tiếp tục.

Không tự ý thay đổi stack.

Không thêm backend.

Không chuyển CSV sang database server.

Không hard-code menu.

---

# 27. CÁCH BÁO CÁO

Sau khi hoàn thành, hãy báo cáo theo format:

## Completed

Liệt kê các phần đã hoàn thành.

## Files Created/Modified

```text
index.html
css/style.css
js/app.js
data/menu.csv
...
```

## Features

Liệt kê:

* CSV loading
* Search
* Filter
* Sort
* Modal
* Responsive
* etc.

## Validation

Cho biết:

```text
CSV: PASS
JavaScript: PASS
Responsive: PASS
Menu rendering: PASS
Search: PASS
Filter: PASS
Sort: PASS
Modal: PASS
```

## Remaining Issues

Nếu còn vấn đề thì liệt kê rõ.

Nếu không còn:

```text
No known issues.
```

---

# 28. QUAN TRỌNG NHẤT

Hãy nhớ:

> **Đọc toàn bộ Markdown trước → hiểu yêu cầu → lập kế hoạch → code → test → sửa lỗi → QA.**

Không bỏ qua tài liệu.

Không tạo backend.

Không hard-code menu.

Không dùng framework frontend ngoài Bootstrap.

Database duy nhất:

```text
./data/menu.csv
```

Bắt đầu bằng việc **đọc toàn bộ file Markdown trong `docs/` và phân tích project hiện tại**. Sau đó triển khai toàn bộ website.
