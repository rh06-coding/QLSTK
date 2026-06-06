# 📒 Quản Lý Sổ Tiết Kiệm (QLSTK)

> **SE104** — Hệ thống quản lý sổ tiết kiệm ngân hàng  
> Backend API xây dựng trên **Node.js / Express 5** với cơ sở dữ liệu **SQL Server**.

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Kiến trúc](#-kiến-trúc)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Biến môi trường](#-biến-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Docker](#-docker)
- [API Endpoints](#-api-endpoints)
- [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
- [Testing](#-testing)
- [CI/CD](#-cicd)

---

## ✨ Tính năng

| Module           | Mô tả                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| **Xác thực**     | Đăng nhập / đăng ký / đăng xuất bằng JWT, mã hoá mật khẩu với bcrypt |
| **Phân quyền**   | 3 vai trò: `ADMIN`, `CEO` (Giám đốc), `STAFF` (Nhân viên)            |
| **Quy định**     | CRUD loại tiết kiệm (kỳ hạn, lãi suất, số tiền tối thiểu…)          |
| **Sổ tiết kiệm** | Mở sổ, tra cứu, gửi thêm tiền, rút tiền / tất toán                  |
| **Báo cáo**      | Doanh thu theo ngày, mở/đóng sổ theo tháng                           |
| **Bảo mật**      | Helmet, CORS, Rate Limiting, giới hạn body 10 KB                     |

---

## 🏗 Kiến trúc

```
src/
├── config/          # Cấu hình kết nối DB
├── controllers/     # Xử lý request/response
│   ├── authController.js
│   ├── customerController.js
│   ├── regulationController.js
│   ├── reportController.js
│   ├── roleController.js
│   └── savingsController.js
├── middlewares/      # Auth middleware, error handler
│   ├── authMiddleware.js
│   └── errorHandler.js
├── routes/          # Định nghĩa API routes
│   ├── auth.js
│   ├── health.js
│   ├── regulations.js
│   ├── reports.js
│   ├── roles.js
│   └── savings.js
├── services/        # Business logic
│   ├── authService.js
│   ├── customerService.js
│   ├── regulationService.js
│   ├── reportService.js
│   ├── roleService.js
│   └── savingsService.js
├── utils/           # Hàm tiện ích
├── scripts/         # Scripts hỗ trợ (check DB…)
└── index.js         # Entry point
```

---

## 💻 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x
- **SQL Server** 2019+ (hoặc SQL Server Express)
- _(Tùy chọn)_ **Docker** & **Docker Compose**

---

## ⚙ Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd QLSTK
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo cơ sở dữ liệu

Chạy file SQL để khởi tạo database, bảng, stored procedures và dữ liệu mẫu:

```bash
# Sử dụng SQL Server Management Studio (SSMS) hoặc sqlcmd:
sqlcmd -S localhost -U sa -P <your_password> -i quanlysotietkiem.sql
```

### 4. Cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin kết nối SQL Server của bạn
```

---

## 🔐 Biến môi trường

| Biến                  | Mô tả                          | Mặc định    |
| --------------------- | ------------------------------- | ----------- |
| `PORT`                | Port chạy server                | `3000`      |
| `DB_USER`             | Username SQL Server             | `sa`        |
| `DB_PASSWORD`         | Password SQL Server             | —           |
| `DB_SERVER`           | Địa chỉ SQL Server             | `localhost` |
| `DB_NAME`             | Tên database                    | `QuanLySoTietKiem` |
| `DB_PORT`             | Port SQL Server                 | `1433`      |
| `DB_ENCRYPT`          | Mã hoá kết nối                  | `false`     |
| `DB_TRUST_SERVER_CERT`| Tin tưởng cert tự ký            | `true`      |
| `JWT_SECRET`          | Secret key cho JWT              | —           |
| `CORS_ORIGIN`         | Danh sách origin được phép (phân tách bởi dấu `,`) | `*` |

---

## 🚀 Chạy ứng dụng

### Development (auto-reload với nodemon)

```bash
npm run dev
```

### Production

```bash
npm start
```

### Kiểm tra kết nối DB

```bash
npm run db:check
```

Server sẽ chạy tại `http://localhost:3000` (hoặc port được cấu hình trong `.env`).

---

## 🐳 Docker

Chạy toàn bộ stack (API + SQL Server) bằng Docker Compose:

```bash
# Khởi động
docker compose up -d

# Xem logs
docker compose logs -f

# Dừng
docker compose down
```

**Containers:**

| Container          | Mô tả                        | Port          |
| ------------------ | ----------------------------- | ------------- |
| `qlstk-sqlserver`  | SQL Server 2022 Express       | `127.0.0.1:1433` |
| `qlstk-api`        | Node.js API                   | `127.0.0.1:3000` |

---

## 📡 API Endpoints

> Xem chi tiết tại [API.md](./API.md)

### Health

| Method | Endpoint       | Auth | Mô tả              |
| ------ | -------------- | ---- | ------------------- |
| `GET`  | `/api/health`  | ❌   | Kiểm tra trạng thái |

### Xác thực

| Method | Endpoint             | Auth    | Mô tả                 |
| ------ | -------------------- | ------- | ---------------------- |
| `POST` | `/api/auth/login`    | ❌      | Đăng nhập              |
| `POST` | `/api/auth/register` | `ADMIN` | Tạo tài khoản mới     |
| `POST` | `/api/auth/logout`   | ✅      | Đăng xuất              |
| `GET`  | `/api/auth/me`       | ✅      | Thông tin người dùng   |

### Vai trò

| Method | Endpoint     | Auth | Mô tả              |
| ------ | ------------ | ---- | ------------------- |
| `GET`  | `/api/roles` | ✅   | Danh sách vai trò   |

### Quy định (Loại tiết kiệm)

| Method   | Endpoint               | Auth  | Mô tả            |
| -------- | ---------------------- | ----- | ----------------- |
| `GET`    | `/api/regulations`     | ✅    | Danh sách loại TK |
| `POST`   | `/api/regulations`     | `CEO` | Tạo loại TK mới  |
| `PUT`    | `/api/regulations/:id` | `CEO` | Cập nhật loại TK  |
| `DELETE` | `/api/regulations/:id` | `CEO` | Xoá loại TK      |

### Sổ tiết kiệm

| Method | Endpoint                          | Auth    | Mô tả                      |
| ------ | --------------------------------- | ------- | --------------------------- |
| `GET`  | `/api/savings/customers/:maKH`    | `STAFF` | Danh sách sổ theo khách hàng |
| `GET`  | `/api/savings/search`             | `STAFF` | Tìm kiếm sổ tiết kiệm      |
| `POST` | `/api/savings`                    | `STAFF` | Mở sổ tiết kiệm mới         |
| `POST` | `/api/savings/:maSTK/deposits`    | `STAFF` | Gửi thêm tiền               |
| `POST` | `/api/savings/:maSTK/withdrawals` | `STAFF` | Rút tiền / tất toán         |

### Báo cáo

| Method | Endpoint                          | Auth    | Mô tả                  |
| ------ | --------------------------------- | ------- | ----------------------- |
| `GET`  | `/api/reports/daily-revenue`      | `STAFF` | Báo cáo doanh thu ngày  |
| `GET`  | `/api/reports/monthly-open-close` | `STAFF` | Báo cáo mở/đóng sổ     |

---

## 🗄 Cơ sở dữ liệu

### Sơ đồ các bảng chính

```
KHACH_HANG          LOAI_TIET_KIEM        VAI_TRO
├── MaKH (PK)       ├── MaLTK (PK)        ├── MaVaiTro (PK)
├── HoTen            ├── KyHan             └── TenVaiTro
├── CMND (Unique)    ├── TenLTK
└── DiaChi           ├── LaiSuat           NGUOI_DUNG
                     ├── SoTienGuiToiThieu ├── MaNguoiDung (PK)
SO_TIET_KIEM         └── SoTienGuiThemTT   ├── TenDangNhap
├── MaSTK (PK)                             ├── MatKhau
├── MaKH (FK)       PHIEU_GUI_TIEN        ├── MaVaiTro (FK)
├── MaLTK (FK)      ├── MaPGT (PK)        └── MaKH (FK)
├── SoDu             ├── MaKH (FK)
├── NgayMoSo         ├── MaSTK (FK)        PHIEU_RUT_TIEN
├── CapNhatLuc       ├── SoTienGui         ├── MaPRT (PK)
└── DongSoLuc        └── NgayGui           ├── MaKH (FK)
                                           ├── MaSTK (FK)
                                           ├── SoTienRut
                                           └── NgayRut
```

### Stored Procedures

| Procedure             | Mô tả                                         |
| --------------------- | ---------------------------------------------- |
| `sp_ThucHienGuiTien`  | Xử lý gửi tiền (kiểm tra nghiệp vụ + cộng lãi) |
| `sp_ThucHienRutTien`  | Xử lý rút tiền / tất toán (kiểm tra đáo hạn, tính lãi) |

### Tài khoản mẫu

| Username | Password | Vai trò  |
| -------- | -------- | -------- |
| `admin`  | `123456` | ADMIN    |
| `ceo`    | `123456` | CEO      |
| `staff`  | `123456` | STAFF    |

---

## 🧪 Testing

```bash
# Chạy tất cả tests
npm test

# Chạy test với watch mode
npx jest --watch
```

Cấu trúc thư mục test:

```
tests/
├── unit/           # Unit tests
└── integration/    # Integration tests
```

**Tech stack test:** Jest + Supertest

---

## 🔄 CI/CD

Dự án sử dụng **GitHub Actions** cho CI:

- Tự động chạy trên mọi `push` / `pull_request` vào nhánh `main` hoặc `master`
- Test trên Node.js **18.x** và **20.x**
- Pipeline: `checkout` → `install` → `test`

---

## 📄 Tài liệu bổ sung

- [API.md](./API.md) — Chi tiết API endpoints & request/response format
- [quanlysotietkiem.sql](./quanlysotietkiem.sql) — Script khởi tạo database

---

## 📝 License

ISC
