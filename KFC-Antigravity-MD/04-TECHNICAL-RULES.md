# Technical Rules for Antigravity

## MUST

1. Tạo `index.html` làm entry point.
2. Tạo `css/style.css`.
3. Tạo `js/app.js`.
4. Tạo `data/menu.csv`.
5. Dùng Bootstrap 5 qua CDN.
6. JavaScript vanilla.
7. Dữ liệu menu phải đọc từ CSV.
8. Không hard-code danh sách menu trong JS.
9. Không có backend.
10. Không tạo API.
11. Không tạo server application.
12. Không sử dụng database server.
13. Không dùng localStorage như database chính.
14. Không yêu cầu build step phức tạp.

## MUST NOT

Không tạo:

- Express
- Node.js backend
- PHP
- Laravel
- Django
- Flask
- Firebase backend
- Supabase backend
- MySQL
- PostgreSQL
- MongoDB
- REST API nội bộ
- GraphQL server

## CDN

Bootstrap có thể được load bằng CDN.

Ví dụ:

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
  rel="stylesheet"
>
```

JavaScript Bootstrap bundle có thể được load trước `</body>`.

## Architecture

```text
index.html
    |
    +-- css/style.css
    |
    +-- js/app.js
             |
             +-- fetch ./data/menu.csv
             |
             +-- parse CSV
             |
             +-- filter/search/sort
             |
             +-- render DOM
```

## JavaScript Modules

Nên chia logic thành các function:

```text
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

Không bắt buộc tách thành nhiều JS file.

## Security

Không sử dụng `eval()`.

Không chèn trực tiếp dữ liệu CSV vào HTML bằng template string nếu không cần.

Ưu tiên:

```js
element.textContent = value;
```

thay vì:

```js
element.innerHTML = value;
```

## Error Handling

Nếu fetch thất bại:

- Console log lỗi kỹ thuật.
- UI hiển thị thông báo thân thiện.
- Không để trang trắng.

## Price

CSV lưu:

```text
59000
```

JavaScript format:

```text
59.000 ₫
```

Không lưu `59.000đ` trong field price.

## Images

Ưu tiên local:

```text
assets/images/...
```

Nếu chưa có ảnh thật, dùng placeholder.

Không hotlink hình ảnh có bản quyền chỉ để tránh việc tải asset vào project.

## External Links

Các link ra website chính thức phải dùng `target="_blank"` và:

```html
rel="noopener noreferrer"
```

## Browser Compatibility

Ưu tiên các API JavaScript hiện đại phổ biến:

- fetch
- async/await
- URL
- Array methods
- DOM APIs

Không cần polyfill nếu không có yêu cầu hỗ trợ trình duyệt cũ.
