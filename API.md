# QLSTK API Documentation (FE Integration)

## 1) Base URL and Conventions

- Base URL (local): `http://localhost:3000`
- API prefix: `/api`
- Content-Type: `application/json`

Protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

Success response shape:

```json
{
  "success": true,
  "data": {}
}
```

Error response shape:

```json
{
  "success": false,
  "message": "Error message"
}
```

## 2) Roles in Current Routes

- `ADMIN`: `POST /api/auth/register`
- `CEO`: `POST/PUT/DELETE /api/regulations`
- `STAFF`: savings operations + reports + `GET /api/regulations`
- `GET /api/roles`: any authenticated user

Role mapping for FE:

- `admin -> ADMIN`
- `giamdoc -> CEO`
- `nhanvien -> STAFF`

## 3) Health

### GET `/api/health`

- Auth: No
- Params: none
- Query: none
- Body: none

Success `200`:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-05-10T09:00:00.000Z"
}
```

## 4) Auth APIs

### POST `/api/auth/login`

- Auth: No
- Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Success `200`:

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>",
    "tokenType": "Bearer",
    "user": {
      "MaNguoiDung": 1,
      "TenDangNhap": "admin",
      "MaVaiTro": 1,
      "TenVaiTro": "ADMIN",
      "MaKH": null
    }
  }
}
```

### POST `/api/auth/register`

- Auth: `ADMIN`
- Body (`MaKH` is not used):

```json
{
  "username": "user01",
  "password": "123456",
  "MaVaiTro": 2
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Tạo tài khoản thành công",
  "data": {
    "MaNguoiDung": 5
  }
}
```

### POST `/api/auth/logout`

- Auth: Yes

Success `200`:

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### GET `/api/auth/me`

- Auth: Yes

Success `200`:

```json
{
  "success": true,
  "data": {
    "MaNguoiDung": 1,
    "TenDangNhap": "admin",
    "MaVaiTro": 1,
    "MaKH": null,
    "TenVaiTro": "ADMIN"
  }
}
```

## 5) Role API

### GET `/api/roles`

- Auth: Yes

Success `200`:

```json
{
  "success": true,
  "data": [
    {
      "MaVaiTro": 1,
      "TenVaiTro": "ADMIN"
    },
    {
      "MaVaiTro": 2,
      "TenVaiTro": "CEO"
    },
    {
      "MaVaiTro": 3,
      "TenVaiTro": "STAFF"
    }
  ]
}
```

## 6) Regulation APIs

Rules:

- `co_ky_han`: `KyHan > 0`
- `khong_ky_han`: `KyHan = 0`
- `ThoiGianGuiToiThieu` is returned in days (`KyHan * 30` for term accounts, `0` for non-term)
- Backend derives `ThoiGianGuiToiThieu` from `KyHan`; FE may send this field, but backend validates basic type and ignores mismatched value.
- `LaiSuat` uses decimal format (example `0.055`)
- `SoTienGuiBanDauToiThieu` is not part of API contract
- `SoTienGuiThemToiThieu` can be sent but is optional for FE

### GET `/api/regulations`

- Auth: `CEO` or `STAFF`

Success `200`:

```json
{
  "success": true,
  "data": [
    {
      "MaLTK": 1,
      "loai": "co_ky_han",
      "KyHan": 3,
      "TenLTK": "Tiet kiem 3 thang",
      "LaiSuat": 0.055,
      "SoTienGuiToiThieu": 1000000,
      "ThoiGianGuiToiThieu": 90
    },
    {
      "MaLTK": 2,
      "loai": "khong_ky_han",
      "KyHan": 0,
      "TenLTK": "Tiet kiem khong ky han",
      "LaiSuat": 0.005,
      "SoTienGuiToiThieu": 100000,
      "ThoiGianGuiToiThieu": 0
    }
  ]
}
```

### POST `/api/regulations`

- Auth: `CEO`
- Body:

```json
{
  "loai": "co_ky_han",
  "KyHan": 3,
  "TenLTK": "Tiet kiem 3 thang",
  "LaiSuat": 0.055,
  "SoTienGuiToiThieu": 1000000,
  "ThoiGianGuiToiThieu": 90,
  "SoTienGuiThemToiThieu": 100000
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Tạo loại tiết kiệm thành công",
  "data": {
    "MaLTK": 7,
    "loai": "co_ky_han",
    "KyHan": 3,
    "TenLTK": "Tiet kiem 3 thang",
    "LaiSuat": 0.055,
    "SoTienGuiToiThieu": 1000000,
    "ThoiGianGuiToiThieu": 90
  }
}
```

### PUT `/api/regulations/:id`

- Auth: `CEO`
- Params: `id` (required, integer > 0)
- Body:

```json
{
  "loai": "khong_ky_han",
  "KyHan": 0,
  "TenLTK": "Tiet kiem khong ky han",
  "LaiSuat": 0.005,
  "SoTienGuiToiThieu": 100000,
  "ThoiGianGuiToiThieu": 0,
  "SoTienGuiThemToiThieu": 50000
}
```

Success `200`:

```json
{
  "success": true,
  "message": "Cập nhật loại tiết kiệm thành công",
  "data": {
    "MaLTK": 1,
    "loai": "khong_ky_han",
    "KyHan": 0,
    "TenLTK": "Tiet kiem khong ky han",
    "LaiSuat": 0.005,
    "SoTienGuiToiThieu": 100000,
    "ThoiGianGuiToiThieu": 0
  }
}
```

### DELETE `/api/regulations/:id`

- Auth: `CEO`
- Params: `id` (required, integer > 0)

Success `200`:

```json
{
  "success": true,
  "message": "Xóa loại tiết kiệm thành công"
}
```

## 7) Savings APIs

Savings responses include enough data for FE to determine term/non-term:

- `MaLTK`
- `KyHan`
- `loai`
- `LaiSuat`

### GET `/api/savings/customers/:maKH`

- Auth: `STAFF`
- Params: `maKH` (required, integer > 0)

Success `200`:

```json
{
  "success": true,
  "data": [
    {
      "MaSTK": 1001,
      "MaKH": 11,
      "MaLTK": 1,
      "HoTen": "Tran Thi B",
      "CMND": "079123456789",
      "DiaChi": "Da Nang",
      "TenLTK": "Tiet kiem 3 thang",
      "loai": "co_ky_han",
      "KyHan": 3,
      "LaiSuat": 0.055,
      "SoDu": 5000000,
      "NgayMoSo": "2026-05-10T09:00:00.000Z"
    }
  ]
}
```

### GET `/api/savings/search`

- Auth: `STAFF`
- Query: at least one is required
- `maSTK` (integer)
- `tenKhachHang` (string, partial match)
- `cmnd` (string, exact match)

Example:

`/api/savings/search?cmnd=079123456789`

Success `200`:

```json
{
  "success": true,
  "data": [
    {
      "MaSTK": 1001,
      "MaKH": 11,
      "MaLTK": 1,
      "HoTen": "Tran Thi B",
      "CMND": "079123456789",
      "DiaChi": "Da Nang",
      "TenLTK": "Tiet kiem 3 thang",
      "loai": "co_ky_han",
      "KyHan": 3,
      "LaiSuat": 0.055,
      "SoDu": 5000000,
      "NgayMoSo": "2026-05-10T09:00:00.000Z"
    }
  ]
}
```

### POST `/api/savings`

- Auth: `STAFF`
- Body:

```json
{
  "HoTen": "Tran Thi B",
  "DiaChi": "Da Nang",
  "CMND": "079123456789",
  "MaLTK": 1,
  "SoTienGui": 5000000
}
```

Behavior:

- If `CMND` exists, API uses existing customer.
- If `CMND` does not exist, API creates customer then opens savings.

Success `201`:

```json
{
  "success": true,
  "message": "Sổ tiết kiệm đã được tạo thành công",
  "data": {
    "MaSTK": 1001,
    "MaKH": 11,
    "MaLTK": 1,
    "TenLTK": "Tiet kiem 3 thang",
    "loai": "co_ky_han",
    "KyHan": 3,
    "LaiSuat": 0.055,
    "SoDu": 5000000
  }
}
```

### POST `/api/savings/:maSTK/deposits`

- Auth: `STAFF`
- Params: `maSTK` (required, integer)
- Body:

```json
{
  "SoTienGui": 1000000
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Phiếu gửi tiền đã được tạo thành công",
  "data": {
    "MaSTK": 1001,
    "SoTienGui": 1000000,
    "SoDu": 6000000
  }
}
```

### POST `/api/savings/:maSTK/withdrawals`

- Auth: `STAFF`
- Params: `maSTK` (required, integer)
- Body:

```json
{
  "SoTienRut": 500000
}
```

Success `201`:

```json
{
  "success": true,
  "message": "Phiếu rút tiền đã được tạo thành công",
  "data": {
    "MaSTK": 1001,
    "SoTienRut": 500000,
    "SoDu": 5500000
  }
}
```

Savings rules currently enforced by backend:

- Term savings (`KyHan > 0`): withdrawal must be full amount.
- Non-term savings (`KyHan = 0`): partial withdrawal is allowed.

## 8) Report APIs

Report endpoints are unchanged in this update cycle.

- `GET /api/reports/daily-revenue`
- `GET /api/reports/monthly-open-close`

## 9) Common HTTP Status

- `200` request success
- `201` resource created
- `400` invalid input / missing required data
- `401` unauthorized / token missing-invalid-expired
- `403` role not allowed
- `404` not found
- `409` conflict data
- `500` internal server error
