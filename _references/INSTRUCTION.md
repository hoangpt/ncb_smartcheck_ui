# HƯỚNG DẪN XÂY DỰNG HỆ THỐNG SMART DOC CHECK (NCB)

Tài liệu này mô tả chi tiết yêu cầu chức năng, quy trình nghiệp vụ và logic xử lý cho hệ thống **Bóc tách & Đối soát Chứng từ (Smart Doc Check)**, dựa trên Mockup UI đã thiết kế.

## 1. Tổng quan hệ thống
Hệ thống giải quyết bài toán xử lý các **File Lô (Batch Files)** dung lượng lớn chứa nhiều bộ chứng từ gộp chung, thực hiện tách tự động (Splitting) theo mã giao dịch (Deal ID), sau đó đối soát dữ liệu OCR với Core System.

### Mục tiêu chính:
1.  **Tự động hóa bóc tách**: Xử lý file scan hàng nghìn trang, cắt thành từng bộ hồ sơ riêng biệt.
2.  **Đối soát thông minh**: So sánh dữ liệu trên giấy (OCR) với dữ liệu hệ thống (Core Banking).
3.  **Kiểm soát rủi ro**: Phát hiện sai lệch số tiền và xác thực chữ ký (Giao dịch viên & Kiểm soát viên).

---

## 2. Quy trình nghiệp vụ chi tiết

### Giai đoạn 1: Xử lý File Lô (Batch Processing & Splitting)
Đây là bước quan trọng nhất để xử lý "File Lô rất to".

1.  **Input**: Người dùng upload file PDF scan (có thể lên tới hàng trăm MB, hàng nghìn trang).
2.  **Processing Logic (Background Job)**:
    *   Hệ thống đọc từng trang (hoặc xử lý song song).
    *   **Nhận diện Deal ID**: Dùng OCR quét khu vực đầu trang/góc trang để tìm mã Deal theo Regex cấu hình (VD: `^(FC|FT|LD)[0-9]{10,}`).
    *   **Phân trang (Page Grouping)**:
        *   Nếu tìm thấy Deal ID mới -> Đánh dấu là trang bắt đầu của Deal mới.
        *   Các trang tiếp theo không có Deal ID (hoặc có cùng ID) -> Gộp vào Deal hiện tại.
        *   Nếu trang không tìm thấy ID và không thuộc mạch văn bản -> Đánh dấu là "Trang vô thừa nhận" (Orphan) hoặc "Trang bìa/Summary".
3.  **Output**:
    *   Danh sách các "Deal ảo" (Virtual Deals) kèm mapping trang (Ví dụ: Deal A = Trang 3-4).
    *   Trạng thái sơ bộ: Valid, Error, Warning.

### Giai đoạn 2: Quản lý & Kiểm tra Lô (Document Manager)
Tại màn hình **Quản lý Lô**, người dùng cần nhìn thấy kết quả của quá trình Split:

*   **Hiển thị trực quan (Visual Map)**: Xem được cấu trúc file sau khi cắt (VD: Trang 1-2 là bìa, 3-4 là Deal 1, ...).
*   **Thao tác thủ công (Manual Correction)**:
    *   Cho phép người dùng "khâu" lại các trang bị cắt sai.
    *   Cho phép tách thủ công nếu hệ thống gộp nhầm.
    *   Xử lý các trang "Orphan".

### Giai đoạn 3: Đối soát & Chấm điểm (Reconciliation & Scoring)
Sau khi cắt thành công, các Deal được chuyển sang trạng thái "Sẵn sàng đối soát".

1.  **Data Extraction (OCR)**:
    *   Trích xuất các trường trọng yếu: **Số tiền (Amount)**, Tên khách hàng, Deal ID.
    *   Cắt ảnh chữ ký (Cropping): Chữ ký GDV (Teller), Chữ ký KSV (Supervisor).
2.  **Matching Logic**:
    *   **So khớp 1-1**: Dùng Deal ID làm khóa chính để query thông tin từ Core System.
    *   **Rule so sánh**:
        *   `Amount (OCR)` == `Amount (System)` -> **MATCHED (100%)**.
        *   `Amount (OCR)` != `Amount (System)` -> **MISMATCH**.
    *   **Signature Verification**: So sánh ảnh chữ ký trên chứng từ với ảnh mẫu (Sample) trong DB User Profile.

### Giai đoạn 4: Xử lý ngoại lệ (Exception Handling)
*   Báo cáo các Deal bị lệch tiền.
*   Cảnh báo chữ ký không khớp.
*   Cảnh báo các trang không thể nhận diện (Unidentified Pages).

---

## 3. Kiến trúc hệ thống đề xuất

### Frontend (ReactJS)
*   **UI Library**: TailwindCSS + Lucide React (như mockup).
*   **State Management**: Quản lý trạng thái Upload Progress và Split Map.
*   **PDF Viewer**: Cần tích hợp thư viện xem PDF mạnh mẽ (như `react-pdf` hoặc `pdf.js`) hỗ trợ:
    *   Lazy loading (vì file rất lớn).
    *   Highlight vùng (như mockup Workbench).
    *   Zoom/Pan mượt mà.

### Backend & Service
*   **Queue System**: Bắt buộc dùng Queue (RabbitMQ/Kafka/Redis Queue) để xử lý file lớn, tránh treo server.
*   **OCR Engine**:
    *   Azure Form Recognizer (Cloud) - hệ thống hiện tại sử dụng Azure Form Recognizer để OCR PDF.
    *   Nên định nghĩa "Vùng quan tâm" (Region of Interest - ROI) để tăng tốc độ và độ chính xác (chỉ OCR vùng Header để tìm Deal ID).
*   **Storage**: MinIO/S3 để lưu file gốc và các file cắt nhỏ (nếu cần tách vật lý).

---

## 4. Đặc tả chức năng màn hình (Dựa trên Mockup)

### 4.1. Màn hình Quản lý Lô (`DocumentManagerView`)
*   **Danh sách File**: Hiển thị tiến trình xử lý (Progress bar).
*   **Chi tiết Sơ đồ cắt (Splitting Map)**:
    *   Hiển thị Grid các trang.
    *   Màu sắc phân biệt trạng thái: Xanh (Valid), Đỏ (Error/Orphan), Xám (Ignored).
    *   Tooltip hiển thị Deal ID nhận diện được.

### 4.2. Màn hình Đối soát (`ReconciliationListView`)
*   Bảng danh sách Deal.
*   Bộ lọc: Chỉ xem các Deal bị sai lệch (Mismatch) để ưu tiên xử lý.
*   Cột trạng thái: Hiển thị Badge rõ ràng (Khớp đúng, Lệch dữ liệu).

### 4.3. Màn hình Workbench (Chi tiết đối soát)
*   **Layout 2 cột**:
    *   **Trái (Viewer)**: Hiển thị đúng trang PDF của Deal đó. Có Overlay Box vẽ đè lên vị trí số tiền/chữ ký.
    *   **Phải (Form)**:
        *   Form so sánh "Side-by-side": Dữ liệu OCR vs Dữ liệu System.
        *   Highlight đỏ ô Số tiền nếu lệch.
        *   Hiển thị ảnh Cut chữ ký vs Ảnh mẫu.

---

## 5. Lưu ý triển khai (Implementation Notes)

1.  **Hiệu năng**: Với file > 1000 trang, không được load toàn bộ PDF vào RAM Client. Cần chia nhỏ hoặc dùng `Range Requests` để load từng trang ảnh.
2.  **Độ chính xác Regex**: Cần khảo sát kỹ quy tắc đánh mã Deal ID của NCB để viết Regex chính xác, tránh cắt nhầm giữa chừng văn bản.
3.  **Audit Log**: Mọi hành động "Sửa sai", "Bỏ qua lỗi" của user (Kiểm soát viên) phải được log lại.
