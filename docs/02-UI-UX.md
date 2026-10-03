# UI/UX Specification

## Visual Direction

Phong cách:

- Fast food
- Bold
- Energetic
- Appetizing
- Clean
- High contrast

## Màu sắc

Có thể lấy cảm hứng từ nhận diện KFC:

- Primary: đỏ
- Secondary: trắng
- Text: đen/xám đậm
- Accent: vàng nhạt hoặc màu trung tính cho giá/khuyến mãi

Không cần sao chép nguyên giao diện website KFC.

## Typography

Ưu tiên:

- Bootstrap typography
- Font system hoặc Google Font nếu thực sự cần
- Heading đậm
- Giá món nổi bật

## Cards

Card món ăn:

- Border radius vừa phải.
- Ảnh có tỷ lệ đồng nhất.
- Giá nổi bật.
- CTA rõ ràng.
- Hover nhẹ.

## Hero

Desktop:

```text
--------------------------------------------------
| Text                         | Food image       |
| BIG HEADLINE                |                  |
| Description                 |                  |
| [ORDER NOW] [VIEW MENU]     |                  |
--------------------------------------------------
```

Mobile:

```text
---------------------------
| Headline                |
| Description             |
| CTA                     |
| Food image              |
---------------------------
```

## Responsive Breakpoints

Dùng Bootstrap breakpoints:

- xs: mobile
- sm
- md
- lg
- xl
- xxl

## Interaction

- Smooth scrolling.
- Navbar collapse trên mobile.
- Filter có trạng thái active.
- Card hover nhẹ.
- Modal animation nhẹ.
- Không dùng animation quá nhiều.
- Respect `prefers-reduced-motion`.

## Accessibility

- Semantic HTML.
- `aria-label` cho icon-only buttons.
- Focus state rõ ràng.
- Không dùng màu sắc làm tín hiệu duy nhất.
- Alt text cho hình ảnh.
- Modal có thể đóng bằng Escape.

## UX States

Menu phải có:

### Loading

`Đang tải menu...`

### Success

Hiển thị cards.

### Empty

`Chưa có món phù hợp.`

### Error

`Không thể tải menu. Vui lòng kiểm tra file data/menu.csv.`

## Mobile

Ưu tiên:

1. CTA
2. Combo nổi bật
3. Menu
4. Promotion
5. Footer

Không để bảng dữ liệu rộng gây horizontal scroll.
