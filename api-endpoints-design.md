# Thiết Kế API và Endpoint - QuanLySoTietKiem_Backend

## Quy ước chung

- Base URL: `/api`
- Header xác thực cho API cần đăng nhập: `Authorization: Bearer <accessToken>`
- Dạng phản hồi chung:
  - Thành công: `{ success: true, message?, data? }`
  - Thất bại: `{ success: false, message, details? }`
- Mã trạng thái thường dùng:
  - `200`: thành công
  - `201`: tạo mới thành công
  - `400`: dữ liệu không hợp lệ
  - `401`: chưa đăng nhập / sai xác thực
  - `403`: không đủ quyền
  - `404`: không tìm thấy dữ liệu
  - `500`: lỗi hệ thống

## Trạng Thái Hiện Tại

### API

| Chức năng | Method | Endpoint | Trạng thái |
|---|---:|---|---|
| Kiểm tra route auth | GET | `/api/auth` 
| Đăng nhập | POST | `/api/auth/login`
| Lấy danh sách loại tiết kiệm | GET | `/api/regulations
| Cập nhật quy định loại tiết kiệm | PUT | `/api/regulations/:id` 
| Lấy danh sách sổ tiết kiệm của user | GET | `/api/savings` 
| Mở sổ tiết kiệm | POST | `/api/savings` | 


| Chức năng | Ghi chú |
|---|---|
| Tạo tài khoản mới 
| Đăng xuất 
| Refresh token
| Đổi mật khẩu
| Tra cứu sổ tiết kiệm theo nhiều tiêu chí 
| Gửi thêm tiền vào sổ 
| Rút tiền khỏi sổ |  |
| Lập báo cáo doanh số hoạt động ngày | |
| Lập báo cáo mở/đóng sổ tháng |  |
| Quản lý thêm/xóa loại kỳ hạn | |
| Quản lý thay đổi thời gian gửi tối thiểu và lãi suất theo nghiệp vụ đầy đủ |  `PUT /api/regulations/:id` |

## Thiết Kế Theo Đặc Tả

### 3.1 Mở sổ tiết kiệm

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/savings` | Có | Mở sổ tiết kiệm và tạo phiếu gửi tiền đầu tiên |

**Request body**

```json
{
  "MaLTK": 1,
  "SoTienGui": 1000000
}
```

**Response thành công**

```json
{
  "success": true,
  "message": "Sổ tiết kiệm đã được tạo thành công",
  "data": {
    "MaSTK": 123
  }
}
```

**Ghi chú thiết kế**

- Theo luồng hiện tại, `POST /api/savings` vừa mở sổ vừa tạo phiếu gửi tiền đầu tiên.
- Nếu muốn tách rõ nghiệp vụ ở giao diện, vẫn có thể giữ endpoint này làm thao tác chính.

### 3.2 Lập phiếu gửi tiền

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/savings/:maSTK/deposits` | Có | Tạo phiếu gửi tiền cho một sổ tiết kiệm đã tồn tại |

**Request body**

```json
{
  "SoTienGui": 500000
}
```

**Response thành công**

```json
{
  "success": true,
  "message": "Phiếu gửi tiền đã được tạo thành công",
  "data": {
    "MaPGT": 456,
    "MaSTK": 123
  }
}
```

### 3.3 Lập phiếu rút tiền

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/savings/:maSTK/withdrawals` | Có | Tạo phiếu rút tiền cho sổ tiết kiệm |

**Request body**

```json
{
  "SoTienRut": 300000
}
```

**Response thành công**

```json
{
  "success": true,
  "message": "Phiếu rút tiền đã được tạo thành công",
  "data": {
    "MaPRT": 789,
    "MaSTK": 123
  }
}
```

**Ghi chú thiết kế**

- Endpoint này chưa có trong code hiện tại.
- Cần kiểm tra điều kiện rút tối thiểu, ngày mở sổ, kỳ hạn và số dư.

### 3.4 Tra cứu sổ tiết kiệm

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/savings/search` | Có | Tra cứu sổ tiết kiệm theo mã sổ, tên khách hàng, CMND/CCCD hoặc ngày mở sổ |

**Query params đề xuất**

- `maSTK`
- `tenKhachHang`
- `cmnd`
- `ngayMoSo`

Ví dụ:

`/api/savings/search?maSTK=123`

**Response thành công**

```json
{
  "success": true,
  "data": [
    {
      "MaSTK": 123,
      "HoTen": "Nguyen Van A",
      "CMND": "123456789",
      "TenLTK": "Ky han 3 thang",
      "SoDu": 1000000,
      "NgayMoSo": "2026-04-10T10:00:00.000Z"
    }
  ]
}
```

**Response không tìm thấy**

```json
{
  "success": false,
  "message": "Không tìm thấy dữ liệu phù hợp"
}
```

**Ghi chú thiết kế**

- Endpoint này chưa có trong code hiện tại.
- Nên cho phép ít nhất một tiêu chí tìm kiếm bắt buộc.

### 3.5 Báo cáo doanh số hoạt động ngày

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/reports/daily-revenue` | Có | Báo cáo tổng thu, tổng chi, chênh lệch theo loại tiết kiệm trong một ngày |

**Query params đề xuất**

- `date=YYYY-MM-DD`

Ví dụ:

`/api/reports/daily-revenue?date=2026-04-10`

**Response thành công**

```json
{
  "success": true,
  "data": [
    {
      "STT": 1,
      "TenLTK": "Ky han 3 thang",
      "TongThu": 5000000,
      "TongChi": 300000,
      "ChenhLech": 4700000
    }
  ]
}
```

**Response không có dữ liệu**

```json
{
  "success": false,
  "message": "Không có dữ liệu giao dịch trong khoảng thời gian đã chọn"
}
```

**Ghi chú thiết kế**

- Endpoint này chưa có trong code hiện tại.
- Nên tổng hợp từ phiếu gửi tiền và phiếu rút tiền theo ngày.

### 3.6 Báo cáo mở/đóng sổ tháng

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/reports/monthly-open-close` | Có | Báo cáo số sổ mở/đóng theo ngày trong tháng, theo loại tiết kiệm |

**Query params đề xuất**

- `maLTK`
- `month=MM`
- `year=YYYY`

Ví dụ:

`/api/reports/monthly-open-close?maLTK=1&month=4&year=2026`

**Response thành công**

```json
{
  "success": true,
  "data": [
    {
      "STT": 1,
      "TenLTK": "Ky han 3 thang",
      "Ngay": "2026-04-10",
      "SoSoMo": 2,
      "SoSoDong": 1,
      "ChenhLech": 1
    }
  ]
}
```

**Response không có dữ liệu**

```json
{
  "success": false,
  "message": "Không có biến động mở/đóng sổ trong tháng đã chọn"
}
```

**Ghi chú thiết kế**

- Endpoint này chưa có trong code hiện tại.
- Dữ liệu nguồn dự kiến lấy từ `SO_TIET_KIEM` và các trường ngày đóng nếu có.

### 3.7 Thay đổi quy định số lượng kỳ hạn và tiền gửi tối thiểu

**Đề xuất endpoint**

| Method | Endpoint | Auth | Vai trò |
|---|---|---|---|
| GET | `/api/regulations` | Có | Xem danh sách loại tiết kiệm hiện tại |
| POST | `/api/regulations` | Có | Thêm loại tiết kiệm mới |
| PUT | `/api/regulations/:id` | Có | Sửa loại tiết kiệm hiện có |
| DELETE | `/api/regulations/:id` | Có | Xóa loại tiết kiệm |

**Request tạo mới đề xuất**

```json
{
  "KyHan": 3,
  "TenLTK": "Ky han 3 thang",
  "LaiSuat": 5.0,
  "SoTienGuiToiThieu": 1000000,
  "SoTienGuiThemToiThieu": 100000
}
```

### 3.8 Thay đổi thời gian gửi tối thiểu và lãi suất

**Đề xuất endpoint hiện có và mở rộng**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| PUT | `/api/regulations/:id` | Có | Cập nhật lãi suất và mức tiền gửi tối thiểu cho loại tiết kiệm |

**Request body hiện tại**

```json
{
  "LaiSuat": 5.5,
  "SoTienGuiToiThieu": 1000000,
  "SoTienGuiThemToiThieu": 100000
}
```

**Ghi chú thiết kế**

- Hiện backend chỉ xử lý một phần nghiệp vụ này.
- Nếu cần tách rõ theo UI, có thể giữ chung một màn hình quản lý quy định.

### 3.9 Tạo tài khoản

**Đề xuất endpoint**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/register` | Có, chỉ admin | Tạo tài khoản mới cho người dùng |

**Request body đề xuất**

```json
{
  "username": "user01",
  "password": "123456",
  "role": 2,
  "maKH": 1
}
```

**Response thành công**

```json
{
  "success": true,
  "message": "Tạo tài khoản thành công",
  "data": {
    "MaNguoiDung": 10
  }
}
```

**Ghi chú thiết kế**

- Endpoint này chưa có trong code hiện tại.
- Nên chỉ cho admin thao tác.
- Nên hash mật khẩu trước khi lưu.

### 3.10 Đăng nhập

**Endpoint hiện có**

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | Không | Xác thực username/password và trả JWT |

**Request body**

```json
{
  "username": "testuser",
  "password": "test123"
}
```

**Response thành công**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "username": "testuser",
      "role": 1,
      "roleName": "Admin",
      "customerId": 1
    }
  }
}
```

## Gợi Ý Phân Rã Endpoint Cho Frontend

### Auth

- `POST /api/auth/login`
- `POST /api/auth/register`  
- `POST /api/auth/logout`  
- `GET /api/auth/me`  

### Savings

- `GET /api/savings`
- `POST /api/savings`
- `GET /api/savings/search`
- `POST /api/savings/:maSTK/deposits`
- `POST /api/savings/:maSTK/withdrawals`
- `GET /api/savings/:maSTK`

### Regulations

- `GET /api/regulations`
- `POST /api/regulations`
- `PUT /api/regulations/:id`
- `DELETE /api/regulations/:id`

### Reports

- `GET /api/reports/daily-revenue`
- `GET /api/reports/monthly-open-close`