1. Design Language (Ngôn ngữ thiết kế)
•	Color Palette: Sử dụng tông màu thương hiệu NCB (Xanh dương đậm, Đỏ, Trắng) nhưng được điều chỉnh sang dạng Soft UI (màu dịu) để làm việc lâu dài.
o	Primary: Deep Blue (#004A99) cho các thanh điều hướng.
o	Action: Red (#ED1C24) cho các nút quan trọng (Reject) hoặc cảnh báo lỗi.
o	Status: Green (Match), Amber (Review), Red (Mismatch).
•	Typography: Font chữ sans-serif hiện đại, số liệu (DealID, Amount) dùng font Monospace để dễ đối soát.
•	Layout: Layout dạng 3-Panel (Danh sách - Chi tiết - Thao tác) hoặc Split View (Văn bản gốc - Dữ liệu trích xuất).

2. Các màn hình chính (Screens Flow)
Màn hình 1: Dashboard & Upload (Processing Center)
 
Màn hình 2: Results Grid (Kết quả tổng hợp - Task 3)
 
Màn hình 3: The "Workbench" (Chi tiết & Đối soát - Task 2)
 
Màn hình 4: Ngoại lệ
 
Màn hình 5: cấu hình features (OCR, Pattern, …)
 

3. Logic xử lý "Gầm máy" (Technical Suggestion)
Để đạt được UI trên, logic xử lý bên dưới (Backend/AI) cần đi theo luồng sau:
1.	Anchor Detection (Neo vị trí):
o	Dùng trang 5, trang 7 (các trang "SỔ QUỸ" có bảng kê) làm mốc phân chia (Separator).
o	Hoặc detect dòng text "MBxxxx..." ở góc trái trên/dưới để xác định trang bắt đầu.
2.	Deal ID Linking:
o	Quét toàn bộ văn bản để tìm pattern FC... hoặc FT....
o	Mapping: Nếu trang 5 có Deal A, trang 6 không có Deal ID nhưng nằm giữa trang 5 và trang 8 (Deal B), thì trang 6 thuộc Deal A (logic cha-con).
3.	Signature Extraction (Bóc tách chữ ký):
o	Dùng YOLOv8 hoặc LayoutLMv3 để train model nhận diện vùng "Chữ ký".
o	Không cần OCR chữ ký, chỉ cần Crop ảnh vùng đó ra để người dùng so sánh bằng mắt (Visual Compare).
4. Code cấu trúc thư mục đầu ra (Output Structure)
Khi user bấm "Export" hoặc "Save", hệ thống sẽ lưu file theo cấu trúc bạn yêu cầu:
Plaintext
/Export_Data/
├── 2025/
│   ├── 10/
│   │   ├── 18/
│   │   │   ├── FC208TQD251017001.pdf  (Đã cắt trang 5-6)
│   │   │   ├── FC202TQD251017001.pdf  (Đã cắt trang 10-13)
│   │   │   └── ...
│   │   └── Summary_18-10-2025.xlsx (File excel kết quả chấm điểm)
5. Đề xuất công nghệ (Tech Stack)
•	Frontend: ReactJS hoặc VueJS (dùng thư viện react-pdf-highlighter để vẽ bounding box lên PDF cực mượt).
•	Backend: Python (FastAPI/Flask).
•	AI/OCR:
o	PaddleOCR hoặc Azure Form Recognizer (đọc tiếng Việt và bảng biểu rất tốt).
o	OpenCV (để xử lý ảnh, cắt trang).

