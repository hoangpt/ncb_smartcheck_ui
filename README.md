# NCB CheckDocs UI

Giao diện người dùng cho hệ thống kiểm tra tài liệu (CheckDocs), được xây dựng bằng React, TypeScript, và Vite.

## Yêu cầu tiên quyết (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

-   [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS, ví dụ: v18 hoặc mới hơn)
-   npm (thường đi kèm với Node.js)

## Cài đặt (Installation)

1.  **Cài đặt các gói phụ thuộc:**

    Mở terminal tại thư mục gốc của dự án và chạy lệnh:

    ```bash
    npm install
    ```

## Chạy ứng dụng (Running the App)

### Môi trường phát triển (Development)

Để chạy ứng dụng trong môi trường phát triển (dev mode) với tính năng Hot Module Replacement  (HMR):

```bash
npm run dev
```

Sau khi chạy, ứng dụng thường sẽ có thể truy cập tại `http://localhost:5173`.

### Xây dựng bản Production (Building for Production)

Để đóng gói ứng dụng cho môi trường production:

```bash
npm run build
```

Các file sau khi build sẽ nằm trong thư mục `dist`.

Để xem trước bản build production trên máy local:

```bash
npm run preview
```

## Các lệnh có sẵn (Available Scripts)

-   `npm run dev`: Chạy server phát triển.
-   `npm run build`: Kiểm tra type và build ứng dụng ra thư mục `dist`.
-   `npm run lint`: Chạy ESLint để kiểm tra lỗi code.
-   `npm run preview`: Xem trước bản build production.

## Công nghệ sử dụng (Tech Stack)

-   **Core**: [React](https://react.dev/) 19
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Cấu trúc dự án (Project Structure)

-   `src/`: Chứa mã nguồn chính của ứng dụng.
-   `public/`: Chứa các file tĩnh (assets) được phục vụ trực tiếp.
-   `index.html`: File HTML đầu vào.
-   `vite.config.ts`: Cấu hình cho Vite.
-   `tailwind.config.js` / `postcss.config.js`: Cấu hình cho Tailwind CSS.
