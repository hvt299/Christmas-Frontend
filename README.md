<div align="center">

  <h1>🎄 Christmas Wishes Web 🎁</h1>
  <h3>Nền tảng Gửi tặng và Khám phá Hộp quà Giáng Sinh Bí mật</h3>

  <p>
    Một ứng dụng Web hiện đại mang không khí Giáng Sinh ấm áp lên không gian mạng. 
    Hệ thống cho phép người dùng tự tay "đóng gói" những hộp quà ảo với lời chúc ý nghĩa, tùy chỉnh màu sắc, đính kèm âm nhạc và gửi tặng người thân yêu thông qua các đường link chia sẻ độc đáo.
  </p>

  <p>
    🌟 <strong>Hệ sinh thái Lễ hội & SSO:</strong> Dự án này là một phần của <em>Festive Ecosystem</em>, chia sẻ chung hệ thống tài khoản (Single Sign-On - SSO) và cơ sở dữ liệu với dự án Tết Countdown. Người dùng chỉ cần đăng ký một lần để trải nghiệm xuyên suốt các mùa lễ hội!
  </p>

  <p>
    <img src="https://img.shields.io/badge/license-UNLICENSED-red" alt="License">
    <img src="https://img.shields.io/badge/status-Active_Development-success" alt="Status">
    <img src="https://img.shields.io/badge/framework-Next.js_16-black?logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/styling-Tailwind_CSS_4-06B6D4?logo=tailwindcss" alt="Tailwind CSS">
  </p>

</div>

<br />

# 💻 FRONTEND WEB APPLICATION

Đây là Repository chứa mã nguồn **Frontend**, cung cấp giao diện tương tác trực quan, hiệu ứng tuyết rơi lãng mạn, các chuyển động 3D mở hộp quà chân thực và hệ thống phát nhạc nền toàn cục.

## 🛠️ Công nghệ & Phiên bản

Dự án được xây dựng với các công nghệ hiện đại trong hệ sinh thái React/Next.js:

### 🏗️ Core Stack

| Công nghệ | Phiên bản | Vai trò |
|------------|------------|------------|
| **[Next.js](https://nextjs.org/)** | 16.2.6 | Framework React sử dụng App Router, xử lý Layout, Routing & Middleware |
| **[React](https://react.dev/)** | 19.2.6 | Thư viện UI core, xây dựng giao diện Component-based |
| **[react-dom](https://react.dev/learn/rendering-elements)** | 19.2.6 | Thư viện kết xuất DOM cho React |
| **[Zustand](https://zustand-demo.pmnd.rs/)** | 5.0.9 | Quản lý Global State (duy trì trạng thái nhạc nền Giáng sinh xuyên suốt) |

---

### 🎨 UI & Styling

| Công nghệ | Phiên bản | Vai trò |
|------------|------------|------------|
| **[Tailwind CSS](https://tailwindcss.com/)** | 4.0.0 | Utility-first CSS framework (Phiên bản v4 mới nhất) |
| **[lucide-react](https://lucide.dev/)** | 0.562.0 | Bộ icon SVG tối giản, sắc nét (Dùng cho nút bấm, menu, UI elements) |
| **[emoji-picker-react](https://github.com/eprints/emoji-picker-react)** | 4.19.1 | Cung cấp bộ chọn Emoji phong phú để người dùng cá nhân hóa lời chúc Giáng Sinh |

---

### 🌐 Networking & Auth

| Công nghệ | Phiên bản | Vai trò |
|------------|------------|------------|
| **[Axios](https://axios-http.com/)** | 1.16.0 | HTTP Client gọi RESTful API (Giao tiếp với Mongoose Backend) |
| **[@react-oauth/google](https://github.com/MomenSherif/react-oauth)** | 0.13.5 | Cung cấp Provider và Hook xử lý luồng đăng nhập Google OAuth2 |
| **[js-cookie](https://github.com/js-cookie/js-cookie)** | 3.0.5 | Quản lý lưu trữ Token an toàn dưới dạng Cookie cho Middleware |

---

### ✨ Animations & Utilities

| Công nghệ | Phiên bản | Vai trò |
|------------|------------|------------|
| **[framer-motion](https://www.framer.com/motion/)** | 12.23.26 | Thư viện xử lý Animation mượt mà (Hiệu ứng rung, mở nắp hộp quà) |
| **[react-snowfall](https://github.com/cahilfoley/react-snowfall)** | 2.4.0 | Tạo hiệu ứng tuyết rơi toàn màn hình tối ưu hiệu suất |
| **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** | 1.9.4 | Hiệu ứng pháo giấy nổ tung màn hình khoảnh khắc hộp quà được mở |

## 🌟 Tính năng giao diện

* **🎁 Đóng Gói Quà (Create Gift):**
    * Giao diện form nhập liệu trực quan với tính năng tìm kiếm người dùng (Autocomplete) theo thời gian thực.
    * Tích hợp bộ công cụ chọn Emoji thông minh (`emoji-picker-react`), giúp lời chúc thêm phần sinh động và mang đậm dấu ấn cá nhân.
    * Cho phép chọn màu sắc hộp quà (Red Box, Green Box, Gold Box) làm thay đổi toàn bộ theme của món quà.

* **🎀 Mở Quà Tương Tác (Open Gift):**
    * Hộp quà 3D lơ lửng với thẻ tên đính kèm. 
    * Sử dụng `framer-motion` để tạo hiệu ứng nắp hộp bung mở kết hợp với `canvas-confetti` bắn pháo giấy theo đúng tông màu của hộp quà.
    * Tự động phát bản nhạc nền đặc trưng khi người nhận mở thiệp.

* **❄️ Hiệu Ứng Bầu Không Khí (Atmosphere):**
    * Đồng hồ đếm ngược Giáng sinh thông minh tự động thay đổi lời chúc khi bước vào Tuần lễ Giáng sinh.
    * Component Tuyết rơi (`react-snowfall`) chạy nền mượt mà, không cản trở thao tác click của người dùng.
    * Popup mời đăng nhập tinh tế xuất hiện sau 1 giây tại Trang chủ.

* **🎵 Quản lý Âm thanh Toàn cục (Global State):**
    * Sử dụng Zustand để quản lý `useMusicStore`.
    * Nút điều khiển âm thanh thông minh (Tooltip nhấp nháy góc phải) cho phép người dùng tự do bật/tắt nhạc xuyên suốt quá trình sử dụng web.

* **🔐 Xác thực & Định danh (SSO):**
    * Tích hợp đăng nhập nhanh bằng Google mượt mà.
    * Hệ thống tài khoản liên thông hoàn toàn với nền tảng Tết Countdown thông qua JWT Token lưu tại LocalStorage và Cookies.

* **🚫 Custom Pages (Trang 404 Lễ hội):**
    * Giao diện Not Found (404) được thiết kế riêng biệt "chuẩn concept" Giáng sinh (kết hợp hiệu ứng lấp lánh, hộp quà của Ông già Noel).

## 📸 Demo Giao diện

### Trang Chủ & Đếm Ngược
![Home](public/images/demo/home.png)

### Gói Quà Mới
![Create Gift](public/images/demo/create.png)

### Khoảnh Khắc Mở Quà
![Open Gift](public/images/demo/open.png)

### Quản Lý Cài Đặt
![Profile](public/images/demo/profile.png)

## 🚀 Cài đặt & Khởi chạy

### 1️⃣ Yêu cầu hệ thống (Prerequisites)

Dự án được xây dựng trên **Next.js 16** và **React 19**, yêu cầu môi trường tối thiểu:

* **Node.js:** >= 20.x LTS
* **Package Manager:** npm >= 9, yarn, pnpm hoặc bun

### 2️⃣ Clone & Cài đặt Dependencies

```bash
git clone https://github.com/hvt299/Christmas-Wishes-Web.git
cd Christmas-Wishes-Web
npm install
```

### 3️⃣ Cấu hình môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YourSecretKeyHere
```

### 4️⃣ Lệnh chạy (Scripts)

```bash
# Chạy môi trường phát triển (Hot Reload)
npm run dev

# Build ra production (Tối ưu hóa)
npm run build

# Chạy bản production
npm run start
```
Sau khi chạy, truy cập giao diện tại:

http://localhost:3000

## 📂 Cấu trúc dự án

```text
src/
├── app/                 # Next.js App Router (Pages, Layouts, Middleware)
├── components/          # Reusable UI Components (MusicPlayer, Snowfall, Countdown)
├── lib/                 # API Calls (Axios interceptors)
├── store/               # Zustand Global States (useMusicStore)
└── utils/               # Utilities (christmasHelper)
```

## 🔗 Kết nối Backend

Dự án Frontend này bắt buộc phải chạy song song với Backend Service (mặc định ở cổng 3001) để các API Authentication, quản lý Quà tặng và Users có thể hoạt động.

## 👨‍💻 Author

Developed by **Mr.T (hvt299)**  
GitHub: [https://github.com/hvt299](https://github.com/hvt299)