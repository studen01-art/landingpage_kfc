# Data Specification — CSV

## File

```text
./data/menu.csv
```

## Encoding

UTF-8.

## CSV Header

```csv
id,name,category,description,price,image_url,featured,available
```

## Field Definitions

| Field | Type | Required | Description |
|---|---|---:|---|
| id | string | yes | ID duy nhất |
| name | string | yes | Tên món |
| category | string | yes | Nhóm món |
| description | string | no | Mô tả |
| price | number | yes | Giá VNĐ, chỉ lưu số |
| image_url | string | no | URL ảnh hoặc path local |
| featured | boolean | yes | `true` / `false` |
| available | boolean | yes | `true` / `false` |

## Example

```csv
id,name,category,description,price,image_url,featured,available
combo-01,Combo Gà Rán 1 Người,Combo,"Gà rán + khoai tây + Pepsi",59000,assets/images/combo-01.jpg,true,true
combo-02,Combo Gà Rán 2 Miếng,Combo,"2 miếng gà + khoai tây + Pepsi",91000,assets/images/combo-02.jpg,true,true
burger-01,Combo Burger Zinger,Burger,"Burger gà + khoai tây + Pepsi",79000,assets/images/zinger.jpg,false,true
rice-01,Combo Cơm Gà,Cơm,"Cơm gà + Pepsi",56000,assets/images/rice.jpg,false,true
```

## Important

Các tên món và giá trong file ví dụ chỉ là **dữ liệu demo/tham khảo**. Trước khi public, phải kiểm tra lại thông tin trên website KFC Việt Nam.

Website KFC Việt Nam hiện hiển thị nhiều nhóm như Value Deals, New Products, Combo for 1, Combo for sharing, Fried & Roasted, Rice/Burger/Pasta, Snack, Dessert & Drinks. citeturn0search0

## CSV Parser

Không cần thư viện CSV nếu dữ liệu đơn giản.

Nếu tự viết parser:

- Hỗ trợ comma.
- Hỗ trợ quoted values.
- Hỗ trợ escaped quote `""`.
- Hỗ trợ newline cuối file.
- Không giả định mọi description đều không có dấu phẩy.

Nếu muốn dùng thư viện ngoài, phải ghi rõ CDN trong `index.html`.

## Data Flow

```text
./data/menu.csv
      ↓
fetch()
      ↓
parseCSV()
      ↓
validateMenuData()
      ↓
filter/sort/search
      ↓
renderMenu()
```
