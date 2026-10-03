# Hướng dẫn học Vibe Coding với Antigravity

## Bước 1 — Cho Antigravity đọc tài liệu

Bắt đầu bằng:

> Hãy đọc toàn bộ các file Markdown trong thư mục `docs/`. Chưa code ngay. Hãy tóm tắt architecture và liệt kê các file sẽ tạo.

## Bước 2 — Tạo skeleton

Prompt:

> Dựa trên docs, hãy tạo cấu trúc project và các file HTML/CSS/JS/CSV tối thiểu. Chưa cần làm animation hoặc polish.

## Bước 3 — Làm data layer

Prompt:

> Implement CSV loading và parser theo `03-DATA-CSV.md`. Sau đó render menu từ CSV. Không hard-code menu trong JavaScript.

## Bước 4 — Làm UI

Prompt:

> Implement toàn bộ UI theo `02-UI-UX.md`. Giữ logic CSV hiện tại và không thay đổi architecture.

## Bước 5 — Thêm interaction

Prompt:

> Thêm search, category filter, sort và product modal. Không thêm backend.

## Bước 6 — Polish

Prompt:

> Review toàn bộ landing page như senior frontend developer. Sửa responsive, accessibility, spacing, typography, loading/error states và console errors.

## Bước 7 — QA

Prompt:

> Chạy checklist trong `06-IMPLEMENTATION-CHECKLIST.md`. Với mỗi mục, kiểm tra code thực tế và báo PASS/FAIL. Nếu FAIL, sửa trực tiếp rồi kiểm tra lại.

## Tư duy Vibe Coding

Không yêu cầu AI:

> Làm cho tôi một website đẹp.

Thay vào đó, chia thành:

```text
Requirement
→ Architecture
→ Data
→ UI
→ Interaction
→ QA
```

Mỗi bước có tiêu chí hoàn thành rõ ràng.

## Quy tắc khi sửa

Khi Antigravity sửa code:

1. Nêu file cần sửa.
2. Giải thích ngắn lỗi/vấn đề.
3. Sửa đúng phạm vi.
4. Không tự ý đổi stack.
5. Không tạo backend.
6. Không xóa chức năng đang chạy.
7. Sau sửa phải test lại chức năng liên quan.
