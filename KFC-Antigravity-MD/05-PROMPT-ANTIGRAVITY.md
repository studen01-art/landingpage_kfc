# Master Prompt — Antigravity

Bạn là senior frontend developer và UI/UX designer.

Hãy xây dựng một landing page quảng cáo gà rán KFC theo đúng các tài liệu trong thư mục `docs/`.

## Mục tiêu

Tạo website frontend/static bằng:

- HTML5
- CSS3
- JavaScript vanilla
- Bootstrap 5 CDN
- CSV database tại `./data/menu.csv`

**TUYỆT ĐỐI KHÔNG tạo backend.**

## Yêu cầu triển khai

### 1. Project structure

Tạo:

```text
index.html
css/style.css
js/app.js
data/menu.csv
assets/images/
```

### 2. Landing page

Bao gồm:

1. Sticky navbar.
2. Hero section.
3. Featured combo.
4. Dynamic menu.
5. Search.
6. Category filter.
7. Sort.
8. Promotion section.
9. Final CTA.
10. Footer.

### 3. Dynamic CSV

Khi page load:

```text
fetch('./data/menu.csv')
```

Parse CSV bằng JavaScript.

Sau đó:

- Validate.
- Render featured products.
- Render menu.
- Filter.
- Search.
- Sort.
- Modal.

### 4. UX

Phải có:

- Loading state.
- Error state.
- Empty state.
- Responsive design.
- Mobile navigation.
- Smooth scroll.
- Accessible buttons.
- Keyboard-friendly modal.
- `prefers-reduced-motion`.

### 5. Design

Thiết kế lấy cảm hứng từ fast-food/KFC:

- đỏ
- trắng
- đen/xám đậm
- CTA nổi bật
- typography mạnh
- food photography lớn

Không copy nguyên layout của website KFC.

### 6. Brand/legal clarity

Đây là landing page demo/marketing độc lập.

Không được viết:

- `Website chính thức của KFC`
- `Được KFC ủy quyền`

trừ khi người dùng cung cấp bằng chứng/ủy quyền.

Có thể ghi:

> Landing page demo/marketing độc lập — không phải website chính thức của KFC Việt Nam.

### 7. Content

Website KFC Việt Nam được dùng làm nguồn tham khảo menu và nhóm sản phẩm. Hãy thiết kế dữ liệu demo dựa trên các nhóm phổ biến như combo, gà rán, burger, cơm, món ăn nhẹ, tráng miệng và thức uống.

Không tự tuyên bố khuyến mãi đang có hiệu lực nếu chưa được xác minh.

### 8. Images

Nếu chưa có asset được cấp phép:

- dùng placeholder;
- hoặc dùng ảnh demo có giấy phép;
- hoặc tạo cấu trúc `assets/images/` để người dùng thay ảnh sau.

Không tự động tải/copy toàn bộ hình ảnh từ website KFC.

### 9. Quality

Sau khi code:

- kiểm tra tất cả link asset;
- kiểm tra CSV;
- kiểm tra console;
- kiểm tra responsive;
- kiểm tra menu khi CSV lỗi;
- kiểm tra modal;
- kiểm tra search;
- kiểm tra filter;
- kiểm tra sort;
- kiểm tra CTA.

## Definition of Done

Chỉ hoàn thành khi:

- `index.html` mở được.
- CSS load đúng.
- Bootstrap load đúng.
- CSV đọc được khi chạy qua static server.
- Menu render từ CSV.
- Không có backend.
- Không có lỗi JavaScript nghiêm trọng.
- Responsive trên mobile/desktop.
- Có README hướng dẫn chạy.
