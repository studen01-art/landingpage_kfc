# PRD — KFC Fried Chicken Promotional Landing Page

## 1. Product Vision

Tạo một landing page hiện đại, bắt mắt cho chiến dịch quảng cáo gà rán KFC, tập trung vào:

- Hình ảnh món ăn hấp dẫn.
- Combo nổi bật.
- CTA đặt món.
- Menu lấy từ CSV.
- Trải nghiệm tốt trên mobile.
- Giao diện có cảm giác fast-food hiện đại, mạnh mẽ và nhiều năng lượng.

## 2. Đối tượng

- Người dùng 16–45 tuổi.
- Người dùng muốn xem nhanh món ăn, combo và ưu đãi.
- Người dùng truy cập chủ yếu bằng điện thoại.

## 3. User Journey

```text
Landing page
   ↓
Hero + CTA
   ↓
Combo nổi bật
   ↓
Menu
   ↓
Ưu đãi
   ↓
CTA đặt món
   ↓
Footer
```

## 4. Các section

### Header

- Logo chữ KFC hoặc placeholder logo.
- Menu:
  - Trang chủ
  - Combo
  - Menu
  - Ưu đãi
  - Liên hệ
- Nút CTA: `Đặt món ngay`
- Header sticky khi scroll.

### Hero

Tiêu đề gợi cảm giác ngon, nóng, giòn.

Ví dụ định hướng copy:

> GÀ GIÒN NÓNG HỔI — BẬT MOOD ĂN NGON!

Subheadline ngắn.

CTA chính:

> Đặt món ngay

CTA phụ:

> Xem menu

Hero cần có ảnh món gà nổi bật ở phía phải trên desktop và phía dưới trên mobile.

### Featured Deals

Hiển thị 3 combo nổi bật.

Mỗi card:

- Ảnh
- Tên combo
- Mô tả
- Giá
- Nút `Chọn món`

### Menu

Render động từ `./data/menu.csv`.

Có filter theo category:

- Combo
- Gà rán
- Burger
- Cơm
- Món ăn nhẹ
- Tráng miệng & thức uống

Các category phải có thể thay đổi dựa trên dữ liệu CSV nếu cần.

### Promotion

Một section quảng cáo ưu đãi:

- Badge `HOT DEAL`
- Headline lớn
- Mô tả
- CTA

Không được khẳng định một chương trình khuyến mãi thật nếu chưa được xác minh.

### Why KFC-style experience

Có thể dùng 3 điểm nổi bật:

1. Gà nóng giòn
2. Nhiều lựa chọn combo
3. Phù hợp ăn một mình hoặc chia sẻ

Đây là copy marketing của landing page, không phải tuyên bố độc lập về chất lượng sản phẩm nếu chưa có nguồn.

### CTA cuối trang

Headline + nút `Đặt món ngay`.

### Footer

- Thông tin thương hiệu/landing page.
- Link tham khảo KFC Việt Nam.
- Disclaimer: `Landing page demo/marketing độc lập — không phải website chính thức của KFC Việt Nam.`

## 5. Functional Requirements

### Menu loading

JavaScript phải:

1. Fetch `./data/menu.csv`.
2. Parse CSV.
3. Validate dữ liệu cơ bản.
4. Render cards.
5. Hiển thị loading state.
6. Hiển thị empty state nếu CSV không có dữ liệu.
7. Hiển thị error state nếu không đọc được CSV.

### Search

Có ô tìm kiếm món ăn.

Tìm theo:

- `name`
- `category`
- `description`

### Filter

Cho phép filter theo category.

### Sort

Có thể thêm:

- Giá thấp → cao
- Giá cao → thấp
- Mặc định

### Modal

Click vào card có thể mở modal:

- Ảnh
- Tên
- Mô tả
- Giá
- CTA

### CTA

Các nút `Đặt món ngay` có thể:

- Scroll tới menu; hoặc
- Mở link đặt hàng chính thức nếu URL đã được cấu hình.

Không tạo hệ thống đặt hàng backend.

## 6. Non-functional Requirements

- Responsive từ 320px trở lên.
- Không layout shift nghiêm trọng.
- Hình ảnh có `alt`.
- Button có trạng thái hover/focus.
- Có keyboard navigation cơ bản.
- Màu chữ có độ tương phản tốt.
- Không phụ thuộc JavaScript để hiển thị thông tin thương hiệu cơ bản.
