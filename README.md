# HOANGGIA FURNITURE 3D AI

Nền tảng mới cho thiết kế và tái dựng **đồ nội thất rời** từ ảnh: bàn, ghế, sofa, armchair, giường rời, tủ và kệ rời.

## V1.0 có thể thực hiện

- Giao diện tiếng Việt, responsive (điện thoại/máy tính).
- Tải ảnh và xem trước ảnh cục bộ (chưa upload máy chủ).
- Cấu hình loại nội thất, kích thước mm, độ chi tiết, định dạng mục tiêu.
- Tạo/sao chép/tải đặc tả AI theo quy tắc xác nhận/suy luận/cần xác nhận.
- Nhập mô hình OBJ/GLB/GLTF có sẵn và xem 3D bằng Three.js.
- Xuất lại OBJ từ hình học 3D thực đang mở.

## Giới hạn hiện tại

**Chưa có bộ máy tự động biến ảnh thành mesh**; GitHub Pages chỉ lưu trữ frontend tĩnh. Cần dịch vụ dựng hình, backend và cơ chế xử lý tệp để biến ảnh thành mô hình 3D tự động. **Xuất FBX chưa được tích hợp.** Không được nhầm chức năng tạo đặc tả AI với tạo model thực.

## Triển khai

Repo: `hoanggiaktsda-beep/HOANGGIA-FURNITURE-3D-AI`.

GitHub → Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/(root)` → Save.

Trang: https://hoanggiaktsda-beep.github.io/HOANGGIA-FURNITURE-3D-AI/

Đường dẫn công cụ: https://hoanggiaktsda-beep.github.io/HOANGGIA-FURNITURE-3D-AI/#create-model

Các module Three.js được tải từ esm.sh nên cần Internet khi sử dụng trình xem. GLTF có asset phụ có thể không tải được khi chọn tệp rời; nên dùng GLB hoặc OBJ độc lập.
