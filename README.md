> **Dự án:** APEX PICKLEBALL ACADEMY  
> **Phong cách thiết kế:** Minimal Tech Aesthetics (Lấy cảm hứng từ [Enode.com](https://enode.com/?ref=minimal.gallery))  
> **Công nghệ sử dụng:** ReactJS 18, Vite 5, Tailwind CSS, Lucide Icons, React Context API, LocalStorage API  

---

## 1. TỔNG QUAN DỰ ÁN & PHÂN TÍCH NGHIỆP VỤ (BA)

### 1.1. Bối cảnh thị trường
Pickleball đang là bộ môn thể thao phát triển nhanh nhất tại Việt Nam và trên thế giới. Nhu cầu tìm kiếm học viện đào tạo bài bản từ con số 0, chuẩn hóa động tác, bảo vệ khớp gối, và nâng bậc DUPR ngày càng tăng vọt. Tuy nhiên, phần lớn các sân tập hiện nay chỉ hoạt động qua tin nhắn Zalo/gọi điện truyền thống, gây ra các vấn đề:
- Tắc nghẽn lịch đặt sân vào khung giờ cao điểm (Peak hours: 17:00 - 22:00).
- Học viên thiếu thông tin minh bạch về giáo trình, trình độ HLV và chính sách bảo hành kết quả.
- Thiếu hệ sinh thái kết hợp giữa: **Đào tạo học viên + Đặt sân tập + Mua sắm dụng cụ chính hãng + Kiến thức luật thi đấu + Quản trị nội dung chủ động**.

### 1.2. Phân tích nghiệp vụ & 5 Chức năng Mở rộng
Đóng vai trò chuyên viên phân tích nghiệp vụ (Business Analyst), nhóm đã nghiên cứu thực tế vận hành của các cụm sân và triển khai **5 CHỨC NĂNG MỞ RỘNG** (vượt yêu cầu tối thiểu 2 chức năng):

| Chức năng mở rộng | Vấn đề thực tế của học viện | Giải pháp hệ thống triển khai |
| :--- | :--- | :--- |
| **1. Hệ thống Đặt sân tập theo giờ (Court Booking)** | Người chơi gặp khó khăn khi tìm sân trống, giá giờ cao điểm không rõ ràng, dễ trùng lịch. | Cho phép chọn ngày trong 7 ngày tới, chọn 4 cụm sân chuyên biệt (Center Court, Pro Performance, Sky View Rooftop, Tactical Drill), chọn khung giờ `06:00 - 22:00` phân loại giá Giờ Thường vs Giờ Cao Điểm, xuất vé đặt sân kèm mã `APEX-COURT-xxxxxx`. |
| **2. Cửa hàng Dụng cụ Pro Shop (Equipment Shop)** | Học viên mới không biết chọn vợt phù hợp, dễ mua nhầm vợt giả hoặc bóng kém chất lượng. | Tích hợp Pro Shop online: lọc theo danh mục & tìm kiếm, xem thông số kỹ thuật, giỏ hàng trượt (`CartDrawer`), áp mã giảm giá `APEXPRO` (hoặc mã do Admin cấu hình), thanh toán và lưu lịch sử đơn hàng `ORD-xxxxxx`. |
| **3. Cẩm nang Kiến thức & Luật chơi (Blog & Rules Hub)** | Luật Pickleball rất đặc thù (Luật Kitchen/Non-Volley Zone, tính điểm đánh đôi `0-0-2`, Third Shot Drop). | Thư viện bài viết chuyên sâu, khung tóm tắt **Quy tắc vàng vùng Kitchen**, modal đọc chi tiết bài viết và cập nhật bài viết mới từ trang Quản trị. |
| **4. Cổng Quản lý Học viên & Lịch sử (Student Dashboard)** | Người học cần theo dõi các khóa đã đăng ký, vé giữ sân và đơn hàng tập trung. | Dashboard cá nhân hóa lưu trữ thời gian thực qua `localStorage`, tra cứu mã ghi danh, mã vé sân và đơn hàng Pro Shop mọi lúc. |
| **5. Hệ thống Quản trị Nội dung & Bán hàng (Admin CMS)** | Chủ sân/Admin cần tự thêm sản phẩm mới, sửa giá, cập nhật nội dung khuyến mãi mà không cần sửa code. | Cung cấp tài khoản Admin riêng biệt (`admin@apex.vn` / `Admin@123`), thêm/sửa/xóa sản phẩm **ngay tại trang bán hàng Pro Shop** hoặc trong **Trang Quản trị CMS** (`AdminPage`): sửa nội dung Trang chủ/Pro Shop/Blog/Giới thiệu/Footer, quản lý khóa học/HLV/bài viết, duyệt trạng thái đơn hàng & lịch đặt, hỗ trợ xuất/nhập JSON sao lưu và khôi phục mặc định. |

---

## 2. QUÁ TRÌNH THỰC HIỆN DỰ ÁN (IMPLEMENTATION PROCESS)

Dự án được triển khai bài bản theo 4 giai đoạn:

1. **Giai đoạn 1 — Khảo sát & Thiết kế kiến trúc thông tin (Information Architecture):**
   - Xác định các nhóm đối tượng sử dụng: *Học viên mới, Người chơi đặt sân, Khách mua dụng cụ, Quản trị viên học viện (Admin)*.
   - Quy hoạch luồng điều hướng rõ ràng trên Navbar nổi: Giới thiệu, Khóa học Pickleball, Tìm sân, Tin tức, Pro Shop, Đăng nhập / Quản trị CMS và Giỏ hàng.

2. **Giai đoạn 2 — Xây dựng Design System & Giao diện Responsive:**
   - Thiết lập Design Tokens trong `tailwind.config.js` và `src/index.css` theo phong cách tối giản công nghệ (Enode style): nền trắng ngà (`#FAFBF9`), bề mặt thẻ trắng (`#FFFFFF`), viền mảnh (`#E2E6DF`), chữ than đậm (`#11181C`), điểm nhấn Xanh Lime (`#B6F05C`).
   - Kết hợp font `Plus Jakarta Sans` cho tiêu đề/nội dung và `JetBrains Mono` cho thông số kỹ thuật, giá tiền, mã vé.
   - Tối ưu bố cục từ Mobile nhỏ (`320px`) đến Desktop (`1440px+`), hỗ trợ `prefers-reduced-motion`.

3. **Giai đoạn 3 — Phát triển Component, Quản lý Trạng thái & Validation:**
   - Chia nhỏ mã nguồn khoa học theo `src/components/`, `src/pages/`, `src/data/`, `src/context/`, `src/utils/`.
   - Xây dựng `SiteDataContext` (`src/context/SiteDataContext.jsx`) làm nguồn dữ liệu trung tâm đồng bộ giữa Admin CMS và các trang hiển thị công khai qua `localStorage`.
   - Kiểm tra dữ liệu đầu vào (Form Validation) tại các biểu mẫu: Đăng ký khóa học, Đặt sân, Liên hệ Ban Quản lý và Đăng nhập/Đăng ký tài khoản (kiểm tra bỏ trống, Regex Email chuẩn, Regex SĐT Việt Nam 10 chữ số đầu `03/05/07/08/09`).

4. **Giai đoạn 4 — Tích hợp Admin CMS, Kiểm thử & Đóng gói:**
   - Phân quyền tài khoản Học viên vs Quản trị viên (`src/utils/auth.js` & `ModalAuth.jsx`), bảo vệ tuyến `/admin` (`AdminPage.jsx`).
   - Kiểm thử quy trình thêm/sửa/xóa sản phẩm, sửa nội dung trang, đặt hàng, đặt sân và biên dịch production bundle bằng `npm run build`.

---

## 3. DANH MỤC TRANG & CHỨC NĂNG CỐT LÕI (CORE REQUIREMENTS)

### 3.1. Trang Chủ (`HomePage.jsx`)
- **Hero Banner:** Tagline tuyển sinh động kèm chỉ báo trạng thái live, tiêu đề nổi bật, nút CTA kép (*Đăng ký khóa học* / *Đặt sân trực tuyến*).
- **Thống kê Bento (Animated Counter):** 4 cụm sân chuẩn USA Pickleball, 1.200+ học viên, 100% HLV IPTPA/PPR, đánh giá `4.9 / 5.0`.
- **Video Showcase & Cơ sở vật chất 5 sao:** Video YouTube autoplay loop, thẻ giới thiệu thảm DecoTurf 8 lớp, camera AI, đội ngũ HLV.
- **Khóa học nổi bật, Lộ trình 4 bước, Banner Đặt sân & Đánh giá học viên (`Testimonials`).**

### 3.2. Trang Khóa Học & Đăng Ký (`CoursesPage.jsx`)
- Danh sách 5 khóa học toàn diện:
  1. *Pickleball Căn Bản & Nền Tảng (Beginner - DUPR 1.0 - 2.5)*
  2. *Chiến Thuật & Kiểm Soát Nâng Cao (Intermediate - DUPR 3.0 - 4.0)*
  3. *Huấn Luyện 1 Kèm 1 Chuyên Sâu (VIP 1-on-1 Coaching)*
  4. *Pickleball Trẻ Em & Thanh Thiếu Niên (Junior Academy)*
  5. *Huấn Luyện Thi Đấu Đỉnh Cao (Tournament Prep)*
- Bộ chuyển đổi nhanh giữa các khóa học, tùy chọn cơ sở tập luyện, hình thức học (Cá nhân 1-1, Nhóm 2/3/4 người) tự động tính học phí theo thời gian thực.
- Form đăng ký giữ chỗ trực tiếp có validation họ tên và SĐT VN 10 số, tự động xuất mã `APEX-xxxxxx` và lưu vào Dashboard + Admin.
- Tab chi tiết bên dưới: **Lộ trình giáo trình từng buổi**, **Lịch khai giảng trong tháng** và **Đội ngũ HLV**.

### 3.3. Trang Giới Thiệu & Liên Hệ (`AboutContactPage.jsx`)
- Lịch sử hình thành theo 3 cột mốc (2021, 2023, 2026) và hồ sơ chi tiết dàn Huấn luyện viên (bằng cấp IPTPA/PPR, chỉ số DUPR).
- **Google Maps Iframe** hiển thị bản đồ vị trí học viện tại 18 Hoàng Cầu, Đống Đa, Hà Nội.
- **Form liên hệ Ban Quản lý** kiểm tra đầy đủ dữ liệu: bỏ trống, định dạng Email Regex và số điện thoại VN 10 chữ số.

### 3.4. Trang Bán Hàng Pro Shop (`ShopPage.jsx` & `CartDrawer.jsx`)
- Lọc sản phẩm theo danh mục (Vợt, Bóng, Giày, Phụ kiện) và tìm kiếm theo tên/thương hiệu/mô tả.
- Hiển thị thông số kỹ thuật, giá bán, giá gốc gạch ngang, trạng thái còn hàng/hết hàng.
- **Dành cho Admin:** Thanh công cụ thêm sản phẩm mới và nút Sửa/Xóa nhanh ngay trên từng thẻ sản phẩm.

### 3.5. Tài khoản & Trang Quản trị CMS (`AdminPage.jsx`)
- **Tài khoản Admin mặc định:**
  - Tài khoản / Email: `admin@apex.vn` (hoặc `admin` ở tab *Quản trị (Admin)*)
  - Mật khẩu: `Admin@123`
- Các phân hệ quản lý: Tổng quan KPI, Sản phẩm Pro Shop, Sửa nội dung các trang, Khóa học, Bài viết & HLV, Đơn hàng & Lịch đặt, Sao lưu/Khôi phục JSON.

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL

### Yêu cầu môi trường
- **Node.js** phiên bản 18 trở lên và **npm**.

### Các bước khởi chạy bản chuẩn (React + Vite)
```bash
# 1. Di chuyển vào thư mục dự án
cd pickleball-academy

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy máy chủ phát triển (Development Server)
npm run dev
```
Truy cập địa chỉ: `http://localhost:5173`

### Chạy bản Build Production ở Local
```bash
# Biên dịch mã nguồn tối ưu ra thư mục dist/
npm run build

# Chạy xem trước bản production (chọn 1 trong 2 lệnh)
npm run preview
# hoặc:
node serve.js
```
*(Ghi chú: Tệp `preview.html` trong thư mục gốc là bản dựng thử tĩnh ban đầu để xem nhanh không cần cài đặt; phiên bản đầy đủ gồm toàn bộ giao diện mới và Admin CMS chạy qua mã nguồn `src/` bằng `npm run dev` hoặc bản build `dist/`).*

---

## 5. HƯỚNG DẪN DEPLOY PUBLIC LÊN GITHUB & VERCEL

Để lấy đường link public ổn định nộp cho Giảng viên:

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở terminal tại thư mục `pickleball-academy`:
```bash
git init
git add .
git commit -m "feat: complete apex pickleball academy with admin cms"
```
2. Đăng nhập [GitHub.com](https://github.com), tạo Repository mới (ví dụ: `pickleball-academy`).
3. Liên kết và đẩy code lên:
```bash
git remote add origin https://github.com/<your-username>/pickleball-academy.git
git branch -M main
git push -u origin main
```

### Bước 2: Deploy lên Vercel (Miễn phí)
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Chọn **"Add New..."** ➔ **"Project"** ➔ Import repository `pickleball-academy`.
3. Giữ nguyên cấu hình mặc định (Vercel tự nhận diện Vite):
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Nhấn **"Deploy"**. Sau khi hoàn tất, cập nhật đường link thật của bạn vào dòng dưới trước khi nộp báo cáo:
   - **Link sản phẩm Live:** `[Chèn link Vercel của bạn sau khi deploy, ví dụ: https://pickleball-academy-xxx.vercel.app]`

---

