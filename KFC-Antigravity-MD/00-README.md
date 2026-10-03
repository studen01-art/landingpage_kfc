# KFC Landing Page — Antigravity Vibe Coding

## Mục tiêu

Xây dựng một landing page quảng cáo món ăn KFC bằng **HTML + CSS + JavaScript thuần**, sử dụng **Bootstrap qua CDN** và dữ liệu menu từ file CSV tại `./data/`.

Đây là website frontend/static. **Không tạo backend, API server, PHP, Node.js server, database server hoặc framework backend.**

## Nguồn tham khảo

Website tham khảo menu và phong cách nội dung:

- https://kfcvietnam.com.vn/

Chỉ sử dụng website trên làm **nguồn tham khảo về danh mục món, cách trình bày và cảm hứng giao diện**. Không giả lập rằng landing page này là website chính thức của KFC.

## Stack bắt buộc

- HTML5
- CSS3
- JavaScript ES6+
- Bootstrap 5 qua CDN
- CSV tại `./data/menu.csv`
- Không backend
- Không React/Vue/Angular
- Không PHP/Node.js/Python server
- Không database server

## Cấu trúc thư mục mong muốn

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
│   ├── images/
│   └── icons/
└── docs/
    └── *.md
```

## Nguyên tắc

1. Mobile-first, responsive.
2. Ưu tiên tốc độ tải.
3. Không nhúng dữ liệu món ăn trực tiếp vào HTML nếu dữ liệu có thể lấy từ CSV.
4. JavaScript đọc CSV và render menu.
5. Không dùng `innerHTML` với dữ liệu chưa được kiểm soát nếu có thể tránh.
6. Không hard-code giá/menu trong JavaScript.
7. Các CTA chỉ mô phỏng hành vi frontend nếu không có backend.
8. Form đăng ký/nhận ưu đãi có thể validate phía client nhưng không gửi dữ liệu lên server.
9. Ghi rõ trong UI nếu đây là landing page demo/marketing độc lập, tránh gây hiểu nhầm là website chính thức.

## Lưu ý về hình ảnh

Hình ảnh trên website KFC Việt Nam là tài sản của thương hiệu. Khi triển khai thật, chỉ sử dụng hình ảnh khi có quyền sử dụng phù hợp. Trong quá trình học/vibe coding, có thể dùng placeholder hoặc ảnh được cấp phép thay thế.

## Cách chạy

Do trình duyệt có thể chặn `fetch('./data/menu.csv')` khi mở `index.html` trực tiếp bằng `file://`, nên khi phát triển hãy chạy bằng một static server đơn giản, ví dụ VS Code Live Server.

Điều này **không phải backend của dự án**; chỉ là cách phục vụ file tĩnh trong môi trường development.
