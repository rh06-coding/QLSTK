# BÁO CÁO ĐỒ ÁN
# HỆ THỐNG QUẢN LÝ SỔ TIẾT KIỆM

---

# CHƯƠNG 2: XÁC ĐỊNH VÀ MÔ HÌNH HÓA YÊU CẦU

## 2.1. Phân loại và bảng trách nhiệm các yêu cầu phần mềm

### 2.1.1. Các yêu cầu nghiệp vụ

| STT | Tên yêu cầu | Biểu mẫu | Quy định | Ghi chú |
|:---:|---|---|---|---|
| 1 | Mở sổ tiết kiệm | BM1 | QĐ1 | |
| 2 | Lập phiếu gửi tiền | BM2 | QĐ2 | |
| 3 | Lập phiếu rút tiền | BM3 | QĐ3 | |
| 4 | Tra cứu sổ tiết kiệm | BM4 | | |
| 5 | Lập báo cáo tháng | BM5.1, BM5.2 | | |
| 6 | Thay đổi quy định | | QĐ6 | |

*Bảng 2.1. Bảng danh sách các yêu cầu nghiệp vụ*

---

**Danh sách các biểu mẫu và quy định**

#### 1. Biểu mẫu 1 và quy định 1

**Biểu mẫu BM1: Sổ Tiết Kiệm**

| BM1: | Sổ Tiết Kiệm | |
|---|:---:|---|
| Mã số: ............................................ | | Loại tiết kiệm: .................................. |
| Khách hàng: ..................................... | | CMND: ........................................... |
| Địa chỉ: ........................................... | | Ngày mở sổ: .................................... |
| Số tiền gửi: ...................................... | | |

**Quy định QĐ1:**

> QĐ1: Có 3 loại tiết kiệm (không kỳ hạn, 3 tháng, 6 tháng). Số tiền gửi (ban đầu) tối thiểu là 1.000.000đ

---

#### 2. Biểu mẫu 2 và quy định 2

**Biểu mẫu BM2: Phiếu Gửi Tiền**

| BM2: | Phiếu Gửi Tiền | |
|---|:---:|---|
| Mã số: ……………………………….. | | Khách hàng: ………………………… |
| Ngày gửi: …………………………… | | Số tiền gửi: ………………………… |

**Quy định QĐ2:**

> QĐ2: Chỉ nhận gửi thêm tiền khi đến kỳ hạn tính lãi suất của các loại tiết kiệm tương ứng. Số tiền gửi thêm tối thiểu là 100.000đ

---

#### 3. Biểu mẫu 3 và quy định 3

**Biểu mẫu BM3: Phiếu Rút Tiền**

| BM3: | Phiếu Rút Tiền | |
|---|:---:|---|
| Mã số: ……………………………… | | Khách hàng: …………………………… |
| Ngày rút: ……………………………… | | Số tiền rút: ……………………………… |

**Quy định QĐ3:**

> QĐ3: Lãi suất là 0.5% đối với loại không kỳ hạn, 5% với kỳ hạn 3 tháng và 5.5% với kỳ hạn 6 tháng. Tiền lãi 1 năm = số dư × lãi suất của loại tiết kiệm tương ứng. Loại tiết kiệm có kỳ hạn chỉ được rút khi quá kỳ hạn và phải rút hết toàn bộ, khi này tiền lãi được tính với mức lãi suất của loại không kỳ hạn. Loại tiết kiệm không kỳ hạn được rút khi gửi trên 15 ngày. Sổ sau khi rút hết tiền sẽ tự động đóng.

---

#### 4. Biểu mẫu 4

**Biểu mẫu BM4: Danh Sách Sổ Tiết Kiệm**

| BM4: | | Danh Sách Sổ Tiết Kiệm | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **STT** | **Mã Số** | | **Loại Tiết Kiệm** | **Khách Hàng** | **Số Dư** |
| 1 | | | | | |
| 2 | | | | | |

---

#### 5. Biểu mẫu 5

**Biểu mẫu BM5.1: Báo Cáo Doanh Số Hoạt Động Ngày**

| BM5.1 | | Báo Cáo Doanh Số Hoạt Động Ngày | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Ngày:............................................... | | | | | |
| **STT** | **Loại Tiết Kiệm** | | **Tổng Thu** | **Tổng Chi** | **Chênh Lệch** |
| 1 | | | | | |
| 2 | | | | | |

**Biểu mẫu BM5.2: Báo Cáo Mở/Đóng Sổ Tháng**

| BM5.2 | | Báo Cáo Mở/Đóng Sổ Tháng | | | | |
|---|:---:|:---:|:---:|:---:|---|:---:|
| Loại tiết kiệm:................................... | | | | | Tháng:............................................. | |
| **STT** | **Ngày** | | **Số Sổ Mở** | **Số Sổ Đóng** | | **Chênh Lệch** |
| 1 | | | | | | |
| 2 | | | | | | |

---

#### 6. Quy định 6

**Quy định QĐ6:**

> QĐ6: Người dùng có thể thay đổi các quy định như sau:
> - QĐ1: Thay đổi số lượng các loại kỳ hạn, tiền gửi tối thiểu.
> - QĐ3: Thay đổi thời gian gửi tối thiểu và lãi suất các loại kỳ hạn.

---

**Bảng trách nhiệm yêu cầu nghiệp vụ:**

| STT | Nghiệp vụ | Người dùng | Phần mềm | Ghi chú |
|:---:|---|---|---|---|
| 1 | Mở sổ tiết kiệm | Cung cấp thông tin người dùng | Kiểm tra quy định, ghi nhận và xuất sổ | Cho phép hủy tạo lập, hủy bỏ yêu cầu không thỏa quy định |
| 2 | Lập phiếu gửi tiền | Cung cấp thông tin người dùng, sổ tiết kiệm, số tiền cần gửi | Kiểm tra quy định, ghi nhận và xuất phiếu | Cho phép hủy cập nhật, hủy bỏ giao dịch không thỏa quy định |
| 3 | Lập phiếu rút tiền | Cung cấp thông tin người dùng, số tiết kiệm, số tiền cần rút | Kiểm tra quy định, tính toán cập nhật lại số dư và xuất phiếu | Hủy bỏ giao dịch không thỏa quy định; thông báo nếu không đủ số dư |
| 4 | Tra cứu sổ | Cung cấp thông tin sổ | Tìm và xuất thông tin thỏa yêu cầu | Kết quả xuất ra màn hình hoặc máy in |
| 5 | Lập báo cáo doanh số | Cung cấp thời gian, dữ liệu muốn báo cáo | Thống kê và xuất dữ liệu liên quan | Giúp giám đốc theo dõi biến động dòng tiền |
| 6 | Thay đổi quy định | Cung cấp thông tin về các quy định cần thay đổi | Ghi nhận lại quy định mới | Chỉ quản lý mới thực hiện |

*Bảng 2.2. Bảng trách nhiệm yêu cầu nghiệp vụ*

---

### 2.1.2. Các yêu cầu chất lượng

#### a. Yêu cầu tiến hóa

| STT | Nghiệp vụ | Tham số cần thay đổi |
|:---:|---|---|
| 1 | Thay đổi quy định lập phiếu gửi tiền | Thay đổi các loại kỳ hạn |
| 2 | Thay đổi quy định lập phiếu rút tiền | Thay đổi lãi suất kỳ hạn; thay đổi số ngày gửi tối thiểu để rút tiền |

*Bảng 2.3. Danh sách các yêu cầu tiến hóa*

| STT | Nghiệp vụ | Người dùng | Phần mềm |
|:---:|---|---|---|
| 1 | Thay đổi quy định lập phiếu gửi tiền | Cho biết kỳ hạn của sổ và số tiền tối thiểu | Ghi nhận giá trị mới và thay đổi cách thức kiểm tra |
| 2 | Thay đổi quy định lập phiếu rút tiền | Cho biết lãi suất, số tiền được rút, ngày gửi tối thiểu | Ghi nhận giá trị và thay đổi cách thức kiểm tra |

*Bảng 2.4. Bảng trách nhiệm yêu cầu tiến hóa*

---

#### b. Yêu cầu hiệu quả

**Cấu hình tối thiểu:** CPU Pentium III 533, RAM 128MB, Đĩa cứng 10GB.

| STT | Nghiệp vụ | Tốc độ xử lý |
|:---:|---|---|
| 1 | Mở sổ tiết kiệm | 50 yêu cầu/1 giờ |
| 2 | Lập phiếu gửi tiền | 50 yêu cầu/1 giờ |
| 3 | Lập phiếu rút tiền | 50 yêu cầu/1 giờ |
| 4 | Tra cứu sổ | Ngay tức thì |
| 5 | Lập báo cáo doanh số | Dưới 10 giây |
| 6 | Thay đổi quy định | Ngay tức thì |

*Bảng 2.5. Danh sách các yêu cầu hiệu quả*

| STT | Nghiệp vụ | Người dùng | Phần mềm |
|:---:|---|---|---|
| 1 | Mở sổ tiết kiệm | Chuẩn bị thông tin nhập | Thực hiện đúng theo yêu cầu |
| 2 | Lập phiếu gửi tiền | Chuẩn bị thông tin nhập | Thực hiện đúng theo yêu cầu |
| 3 | Lập phiếu rút tiền | Chuẩn bị thông tin nhập | Thực hiện đúng theo yêu cầu |
| 4 | Tra cứu sổ | Chuẩn bị thông tin nhập | Thực hiện đúng theo yêu cầu |
| 5 | Lập báo cáo doanh số | Chuẩn bị thông tin nhập | Thực hiện đúng theo yêu cầu |
| 6 | Thay đổi quy định | | Thực hiện đúng theo yêu cầu |

*Bảng 2.6. Bảng trách nhiệm yêu cầu hiệu quả*

---

#### c. Yêu cầu tiện dụng

| STT | Nghiệp vụ | Mức độ dễ học | Mức độ dễ sử dụng | Ghi chú |
|:---:|---|---|---|---|
| 1 | Mở sổ tiết kiệm | 10 phút hướng dẫn | Dễ thao tác. Tỉ lệ phạm lỗi trung bình là 1% | |
| 2 | Lập phiếu gửi tiền | 10 phút hướng dẫn | Dễ thao tác. Tỉ lệ phạm lỗi trung bình là 1% | |
| 3 | Lập phiếu rút tiền | 10 phút hướng dẫn | Tỉ lệ phạm lỗi trung bình là 1% | |
| 4 | Tra cứu sổ | Không cần hướng dẫn | Không biết nhiều về sổ muốn tìm | |
| 5 | Lập báo cáo doanh số | Không cần hướng dẫn | Không có ghi nhớ về số tiền ra vào | |
| 6 | Thay đổi quy định | 10 phút hướng dẫn | Dễ nắm bắt, thực hiện | |

*Bảng 2.7. Danh sách các yêu cầu tiện dụng*

| STT | Nghiệp vụ | Người dùng | Phần mềm | Ghi chú |
|:---:|---|---|---|---|
| 1 | Mở sổ tiết kiệm | Đọc tài liệu hướng dẫn | Thực hiện đúng theo yêu cầu | |
| 2 | Lập phiếu gửi tiền | Đọc tài liệu hướng dẫn | Thực hiện đúng theo yêu cầu | |
| 3 | Lập phiếu rút tiền | Đọc tài liệu hướng dẫn | Thực hiện đúng theo yêu cầu | |
| 4 | Tra cứu sổ | | Thực hiện đúng theo yêu cầu | |
| 5 | Lập báo cáo doanh số | | Thực hiện đúng theo yêu cầu | |
| 6 | Thay đổi quy định | Đọc tài liệu hướng dẫn | Thực hiện đúng theo yêu cầu | |

*Bảng 2.8. Bảng trách nhiệm yêu cầu tiện dụng*

---

#### d. Yêu cầu tương thích

| STT | Nghiệp vụ | Đối tượng liên quan | Chú thích |
|:---:|---|---|---|
| 1 | Mở sổ tiết kiệm | Từ API | Độc lập phiên bản |
| 2 | Lập phiếu gửi tiền | Từ API | Độc lập phiên bản |
| 3 | Lập phiếu rút tiền | Từ API | Độc lập phiên bản |
| 4 | Lập báo cáo doanh số | Từ cơ sở dữ liệu | |

*Bảng 2.9. Danh sách các yêu cầu tương thích*

| STT | Nghiệp vụ | Đối tượng liên quan | Chú thích |
|:---:|---|---|---|
| 1 | Mở sổ tiết kiệm | Từ API | Độc lập phiên bản |
| 2 | Lập phiếu gửi tiền | Từ API | Độc lập phiên bản |
| 3 | Lập phiếu rút tiền | Từ API | Độc lập phiên bản |
| 4 | Lập báo cáo doanh số | Từ cơ sở dữ liệu | |

*Bảng 2.10. Bảng trách nhiệm yêu cầu tương thích*

---

### 2.1.3. Các yêu cầu hệ thống

#### a. Yêu cầu bảo mật

| STT | Nghiệp vụ | Quản trị hệ thống | Giám đốc | Nhân viên |
|:---:|---|:---:|:---:|:---:|
| 1 | Phân quyền | X | | |
| 2 | Tiếp nhận | | | X |
| 3 | Mở sổ tiết kiệm | | | X |
| 4 | Lập phiếu gửi tiết kiệm | | | X |
| 5 | Tra cứu sổ | | | X |
| 6 | Lập báo cáo doanh số | | | X |
| 7 | Thay đổi quy định lập phiếu gửi tiền | X | X | |
| 8 | Thay đổi quy định lập phiếu rút tiền | X | X | |

*Bảng 2.11. Danh sách các yêu cầu bảo mật*

| STT | Nghiệp vụ | Người dùng | Phần mềm | Ghi chú |
|---|---|---|---|---|
| 1 | Quản trị hệ thống | Cho biết người dùng mới và quyền hạn | Ghi nhận và thực hiện đúng | |
| 2 | Giám đốc | Cung cấp tên và mật khẩu | Ghi nhận và thực hiện đúng | |
| 3 | Nhân viên | Cung cấp tên và mật khẩu | Ghi nhận và thực hiện đúng | |
| 4 | Khác | | | Tên chung |

*Bảng 2.12. Bảng trách nhiệm yêu cầu bảo mật*

---

#### b. Yêu cầu an toàn

| STT | Nghiệp vụ | Đối tượng |
|:---:|---|---|
| 1 | Phục hồi | Sổ tiết kiệm, phiếu, báo cáo |
| 2 | Xóa một sổ tiết kiệm | Các sổ tiết kiệm |
| 3 | Không cho phép xóa | N/A |

*Bảng 2.13. Danh sách các yêu cầu an toàn*

| STT | Nghiệp vụ | Người dùng | Phần mềm |
|:---:|---|---|---|
| 1 | Phục hồi | Cung cấp thông tin liên quan | Hỗ trợ phục hồi |
| 2 | Xóa một sổ tiết kiệm | Cung cấp thông tin sổ cần xóa | Thực hiện xóa |
| 3 | Không cho phép xóa | | Thực hiện đúng theo yêu cầu |

*Bảng 2.14. Bảng trách nhiệm yêu cầu an toàn*

---

### 2.1.4. Các yêu cầu công nghệ

| STT | Yêu cầu | Mô tả chi tiết | Ghi chú |
|:---:|---|---|---|
| 1 | Dễ sửa lỗi | Xác định lỗi trong vòng 15 phút | Không ảnh hưởng chức năng khác |
| 2 | Dễ bảo trì | Cập nhật phiên bản mới tối đa trong 1 ngày | Không ảnh hưởng chức năng cũ |
| 3 | Tái sử dụng | Xây dựng phần mềm tương tự (thẻ ATM) trong 5 ngày | Cùng với các yêu cầu |
| 4 | Dễ mang chuyển | Chuyển hệ quản trị mới trong tối đa 2 ngày | Cùng với các yêu cầu |

*Bảng 2.15. Danh sách các yêu cầu công nghệ*

---

## 2.2. Sơ đồ luồng dữ liệu cho từng yêu cầu

### 2.2.1. Sơ đồ luồng dữ liệu cho yêu cầu mở sổ tiết kiệm

**Biểu mẫu:**

| BM1: | Sổ Tiết Kiệm | |
|---|:---:|---|
| Mã số: ............................................ | | Loại tiết kiệm: .................................. |
| Khách hàng: ..................................... | | CMND: ........................................... |
| Địa chỉ: ........................................... | | Ngày mở sổ: .................................... |
| Số tiền gửi: ...................................... | | |

**Quy định:**

> QĐ1: Có 3 loại tiết kiệm (không kỳ hạn, 3 tháng, 6 tháng). Số tiền gửi (ban đầu) tối thiểu là 1.000.000đ

**Các luồng dữ liệu:**

- **D1:** Tên khách hàng, địa chỉ, loại tiết kiệm, CMND, số tiền gửi, ngày mở sổ
- **D2:** Không có
- **D3:** Số tiền gửi (ban đầu) tối thiểu
- **D4:** Sổ tiết kiệm (D1 + Mã số sổ tiết kiệm)
- **D5:** D4
- **D6:** D4

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Kiểm tra xem "số tiền gửi" (D1) có thỏa mãn "số tiền gửi ban đầu tối thiểu" (D3) hay không.
- Bước 4: Nếu không thỏa mãn thì xuống Bước 8.
- Bước 5: Ghi D4 vào bộ nhớ phụ.
- Bước 6: Xuất D5 ra màn hình.
- Bước 7: Xuất D6 ra máy in (nếu cần).
- Bước 8: Kết thúc.

*Sơ đồ 2.1. Luồng dữ liệu cho yêu cầu mở sổ tiết kiệm*

---

### 2.2.2. Sơ đồ luồng dữ liệu cho yêu cầu lập phiếu gửi tiền

**Biểu mẫu:**

| BM2: | Phiếu Gửi Tiền | |
|---|:---:|---|
| Mã số: ……………………………….. | | Khách hàng: ………………………… |
| Ngày gửi: …………………………… | | Số tiền gửi: ………………………… |

**Quy định:**

> QĐ2: Chỉ nhận gửi thêm tiền khi đến kỳ hạn tính lãi suất của các loại tiết kiệm tương ứng. Số tiền gửi thêm tối thiểu là 100.000đ

**Các luồng dữ liệu:**

- **D1:** Mã số sổ tiết kiệm, tên khách hàng, số tiền gửi, ngày lập phiếu
- **D2:** Không có
- **D3:** Số tiền gửi tối thiểu, kỳ hạn tính lãi suất, lần cập nhật gần nhất
- **D4:** Phiếu gửi tiền (D1 + Mã số phiếu gửi tiền)
- **D5:** D4
- **D6:** D4

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Kiểm tra "Ngày lập phiếu" (D1) có thỏa mãn "kỳ hạn tính lãi suất" (D3).
- Bước 4: Kiểm tra "Số tiền gửi" ≥ "Số tiền gửi tối thiểu".
- Bước 5: Nếu không thỏa tất cả quy định trên thì tới Bước 12.
- Bước 6: Kiểm tra xem lần cập nhật gần nhất là khi nào.
  - Nếu lần cập nhật cuối cách đây chưa quá 1 tháng thì tới Bước 9.
- Bước 7: Tính toán số dư mới:
  - Đối với loại tiết kiệm **có kỳ hạn**:
    - Bước 7.1: Tính số dư tại ngày đáo hạn: `SDđh = P × (1 + rkh × n/12)`
    - Bước 7.2: Tính toán số dư hiện tại: `SDht = SDđh × (1 + rkkh × ndư/12)`
  - Đối với loại tiết kiệm **không kỳ hạn**: `SDht = P × (1 + rkkh × n/12)`
- Bước 9: Lưu D4 xuống bộ nhớ phụ, cập nhật số dư trong sổ tiết kiệm.
- Bước 10: Xuất D5 ra máy in (nếu có yêu cầu).
- Bước 11: Trả D6 cho người dùng.
- Bước 12: Kết thúc.

*Sơ đồ 2.2. Sơ đồ luồng dữ liệu cho yêu cầu lập phiếu gửi tiền*

---

### 2.2.3. Sơ đồ luồng dữ liệu cho yêu cầu lập phiếu rút tiền

**Biểu mẫu:**

| BM3: | Phiếu Rút Tiền | |
|---|:---:|---|
| Mã số: ……………………………… | | Khách hàng: …………………………… |
| Ngày rút: ……………………………… | | Số tiền rút: ……………………………… |

**Quy định:**

> QĐ3: Lãi suất là 0.5% đối với loại không kỳ hạn, 5% với kỳ hạn 3 tháng và 5.5% với kỳ hạn 6 tháng. Tiền lãi 1 năm = số dư × lãi suất của loại tiết kiệm tương ứng. Loại tiết kiệm có kỳ hạn chỉ được rút khi quá kỳ hạn và phải rút hết toàn bộ, khi này tiền lãi được tính với mức lãi suất của loại không kỳ hạn. Loại tiết kiệm không kỳ hạn được rút khi gửi trên 15 ngày. Sổ sau khi rút hết tiền sẽ tự động đóng.

**Các luồng dữ liệu:**

- **D1:** Mã số sổ tiết kiệm, tên khách hàng, ngày rút, số tiền rút cụ thể (đối với loại không kỳ hạn)
- **D2:** Không có
- **D3:** Kỳ hạn lãi suất, lãi suất ứng với loại sổ tiết kiệm, lần cập nhật gần nhất
- **D4:** Phiếu rút tiền (D1 + mã số phiếu rút tiền)
- **D5:** D4
- **D6:** D4

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Kiểm tra xem đã đóng sổ (tất toán) hay chưa, nếu rồi thì tới bước 12.
- Bước 4: Xét "Loại tiết kiệm" (D3).
- Bước 5: Kiểm tra xem đã đến kỳ hạn lãi suất chưa.
- Bước 6: Nếu không thỏa quy định trên thì tới Bước 12.
- Bước 7: Kiểm tra xem lần cập nhật gần nhất là khi nào.
  - Nếu lần cập nhật cuối cách đây chưa quá 1 tháng thì tới Bước 9.
- Bước 8: Tính toán số dư mới:
  - Đối với loại tiết kiệm **có kỳ hạn**:
    - Bước 8.1: Tính số dư tại ngày đáo hạn: `SDđh = P × (1 + rkh × n/12)`
    - Bước 8.2: Tính toán số dư hiện tại: `SDht = SDđh × (1 + rkkh × ndư/12)`
  - Đối với loại tiết kiệm **không kỳ hạn**: `SDht = P × (1 + rkkh × ndư/12)`
- Bước 9: Lưu D4 xuống bộ nhớ phụ, cập nhật số dư sổ tiết kiệm:
  - Đối với loại tiết kiệm có kỳ hạn: Số dư = 0 (tất toán đóng sổ)
  - Đối với loại tiết kiệm không kỳ hạn: Số dư = Số dư - Số tiền rút
- Bước 10: Xuất D5 ra máy in (nếu có yêu cầu).
- Bước 11: Trả D6 cho người dùng.
- Bước 12: Kết thúc.

*Sơ đồ 2.3. Sơ đồ luồng dữ liệu cho yêu cầu lập phiếu rút tiền*

---

### 2.2.4. Sơ đồ luồng dữ liệu yêu cầu tra cứu sổ

**Biểu mẫu:**

| BM4: | | Danh Sách Sổ Tiết Kiệm | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **STT** | **Mã Số** | | **Loại Tiết Kiệm** | **Khách Hàng** | **Số Dư** |
| 1 | | | | | |
| 2 | | | | | |

**Các luồng dữ liệu:**

- **D1:** Tên khách hàng, CMND
- **D2:** Không có
- **D3:** Danh sách sổ tiết kiệm (Mã số, loại tiết kiệm, khách hàng, số dư, ngày cập nhật gần nhất)
- **D4:** Danh sách sổ tiết kiệm sau khi được cập nhật
- **D5:** D4
- **D6:** D4

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Tính toán lại số dư nếu lần cập nhật gần nhất cách đây hơn 1 tháng và lần cập nhật gần nhất quá ngày đáo hạn (đối với loại có kỳ hạn).
- Bước 4: Lưu D4 xuống bộ nhớ phụ (nếu có cập nhật).
- Bước 5: Xuất D5 ra máy in (nếu cần).
- Bước 6: Trả D6 cho người dùng.
- Bước 7: Kết thúc.

*Sơ đồ 2.4. Sơ đồ luồng dữ liệu cho yêu cầu tra cứu sổ*

---

### 2.2.5. Lập báo cáo số tháng

#### 2.2.5.1. Sơ đồ luồng dữ liệu cho yêu cầu lập báo cáo doanh số hoạt động ngày

**Biểu mẫu:**

| BM5.1 | | Báo Cáo Doanh Số Hoạt Động Ngày | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Ngày:............................................... | | | | | |
| **STT** | **Loại Tiết Kiệm** | | **Tổng Thu** | **Tổng Chi** | **Chênh Lệch** |
| 1 | | | | | |
| 2 | | | | | |

**Các luồng dữ liệu:**

- **D1:** Thời gian
- **D2:** Không có
- **D3:** Thông tin các phiếu gửi tiền và rút tiền thỏa mãn D1
- **D4:** Không có
- **D5:** Thông tin về báo cáo
- **D6:** D5

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Lập báo cáo.
- Bước 4: Xuất D5 ra máy in (nếu có).
- Bước 5: Xuất D6 ra cho người dùng.

*Sơ đồ 2.5.1. Sơ đồ luồng dữ liệu cho yêu cầu lập báo cáo doanh số hoạt động ngày*

---

#### 2.2.5.2. Sơ đồ luồng dữ liệu cho yêu cầu lập báo cáo mở/đóng sổ tháng

**Biểu mẫu:**

| BM5.2 | | Báo Cáo Mở/Đóng Sổ Tháng | | | | |
|---|:---:|:---:|:---:|:---:|---|:---:|
| Loại tiết kiệm:................................... | | | | | Tháng:............................................. | |
| **STT** | **Ngày** | | **Số Sổ Mở** | **Số Sổ Đóng** | | **Chênh Lệch** |
| 1 | | | | | | |
| 2 | | | | | | |

**Các luồng dữ liệu:**

- **D1:** Loại sổ tiết kiệm, tháng
- **D2:** Không có
- **D3:** Số sổ mở, số sổ đóng cho mỗi ngày
- **D4:** Không có
- **D5:** Báo cáo
- **D6:** D5

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Lập báo cáo.
- Bước 4: Xuất D5 ra máy in (nếu có).
- Bước 5: Xuất D6 ra cho người dùng.

*Sơ đồ 2.5.2. Sơ đồ luồng dữ liệu cho yêu cầu lập báo cáo mở/đóng sổ tháng*

---

### 2.2.6. Sơ đồ luồng dữ liệu cho yêu cầu thay đổi quy định

**Quy định:**

> QĐ6: Người dùng có thể thay đổi các quy định như sau:
> - QĐ6.1: Thay đổi số lượng các loại kỳ hạn, tiền gửi tối thiểu.
> - QĐ6.2: Thay đổi thời gian gửi tối thiểu và lãi suất các loại kỳ hạn.

#### 2.2.6.1. Thay đổi số lượng các loại kỳ hạn, tiền gửi tối thiểu

**Quy định QĐ6.1:**

> QĐ6.1: Người dùng có thể thay đổi số lượng các loại kỳ hạn, tiền gửi tối thiểu.

**Các luồng dữ liệu:**

- **D1:** Thông tin muốn thay đổi (Thêm/Xóa các kỳ hạn hoặc sửa số tiền gửi tối thiểu)
- **D2:** Không có
- **D3:** Các loại kỳ hạn đã có
- **D4:** D1
- **D5:** Danh sách các loại kỳ hạn sau cập nhật
- **D6:** D5

**Thuật toán:**

- Bước 1: Lấy D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Nếu thêm các kỳ hạn thì kiểm tra thông tin loại tiết kiệm mới có trùng không, nếu có thì chuyển sang Bước 6.
- Bước 4: Lưu D4 xuống bộ nhớ phụ.
- Bước 5: Thông báo về người dùng danh sách đã được cập nhật.
- Bước 6: Kết thúc.

*Sơ đồ 2.6.1. Sơ đồ luồng dữ liệu cho yêu cầu thay đổi số lượng các loại kỳ hạn, tiền gửi tối thiểu*

---

#### 2.2.6.2. Sơ đồ luồng dữ liệu cho yêu cầu thay đổi thời gian gửi tối thiểu và lãi suất các loại kỳ hạn

**Quy định QĐ6.2:**

> QĐ6.2: Người dùng có thể thay đổi thời gian gửi tối thiểu và lãi suất các loại kỳ hạn.

**Các luồng dữ liệu:**

- **D1:** Thông tin cần thay đổi
- **D2:** Không có
- **D3:** Thời gian gửi tối thiểu, lãi suất của các loại kỳ hạn
- **D4:** D1
- **D5:** Không có
- **D6:** Thông báo đã cập nhật thành công

**Thuật toán:**

- Bước 1: Nhận D1 từ người dùng.
- Bước 2: Đọc D3 từ bộ nhớ phụ.
- Bước 3: Lưu D4 xuống bộ nhớ phụ.
- Bước 4: Xuất D6 cho người dùng.
- Bước 5: Kết thúc.

*Sơ đồ 2.6.2. Sơ đồ luồng dữ liệu cho yêu cầu thay đổi thời gian gửi tối thiểu, lãi suất các kỳ hạn*

---

# CHƯƠNG 3: THIẾT KẾ HỆ THỐNG

## 3.1. Kiến trúc hệ thống

Một ứng dụng web cho việc quản lý sổ tiết kiệm, có chức năng hiển thị thông tin số tài khoản, tên chủ sở hữu, số dư, lãi suất, ngày tạo sổ, ngày rút sổ. Ứng dụng gồm có 3 lớp:

1. **Lớp Presentation:** để hiển thị danh sách các sổ tiết kiệm. Ứng dụng làm Presentation là trình duyệt như FireFox, Chrome,...

2. **Lớp Business:** để xử lý các yêu cầu riêng của ứng dụng — cụ thể là lấy danh sách các sổ tiết kiệm để hiển thị cho người dùng — lớp Business sử dụng Express để xây dựng các API endpoint. Mỗi endpoint sẽ chứa các hàm xử lý tương ứng với từng yêu cầu từ phía người dùng. Trong quá trình xử lý, lớp Business sử dụng module fs để đọc dữ liệu từ file JSON, sau đó phân tích (parse) nội dung thành các đối tượng hoặc mảng JSON để phục vụ cho việc xử lý và trả về kết quả.

3. **Lớp Data:** để quản lý dữ liệu của ứng dụng, là danh sách sổ tiết kiệm được lưu trữ trong SQL Server. Lớp Data sẽ chứa các thành phần liên quan đến database như truy vấn và cập nhật dữ liệu.

**Mô tả quá trình hoạt động của Web:**

- Người dùng truy cập trang web thông qua trình duyệt bằng giao thức HTTP. Server sử dụng Node.js để tải và trả về giao diện ban đầu, hiển thị các biểu mẫu phục vụ cho các thao tác của người dùng.
- Phía client đảm bảo việc xử lý giao diện và tương tác. Khi người dùng thực hiện các thao tác (như nhập dữ liệu, gửi biểu mẫu), client sẽ gửi các request đến server thông qua giao thức HTTP, sử dụng các API đã được định nghĩa sẵn (RESTful API).
- Server tiếp nhận yêu cầu và xử lý bằng Node.js. Trong khi đó, server sẽ truy xuất dữ liệu từ cơ sở dữ liệu SQL Server, sau đó đóng gói dữ liệu dưới dạng JSON và gửi lại cho client thông qua HTTP.
- Khi nhận được dữ liệu phản hồi, client sẽ xử lý và hiển thị thông tin lên giao diện theo thiết kế đã định trước.
- Ví dụ, khi người dùng tạo một phiếu gửi tiền mới, sau khi điền đầy đủ thông tin và gửi biểu mẫu, một request sẽ được gửi đến server. Node.js sẽ tiếp nhận, xử lý yêu cầu và tạo một bản ghi mới trong SQL Server. Sau đó, server gửi phản hồi về cho client. Cuối cùng, React sẽ cập nhật giao diện và hiển thị thông tin phiếu gửi tiền vừa được tạo thành công.

*Sơ đồ 3.1. Sơ đồ kiến trúc hệ thống*

---

## 3.2. Mô tả các thành phần hệ thống

| Lớp | Thành phần | Mô tả |
|---|:---:|---|
| Lớp Presentation | Client Browser | Nơi người dùng trực tiếp tương tác (Ví dụ: Chrome, Firefox, …). Chịu trách nhiệm hiển thị giao diện và ghi nhận các thao tác của người dùng |
| Lớp Business | Node.js | Là máy chủ ứng dụng (Application server). Tiếp nhận yêu cầu từ trình duyệt, xử lý logic (Ví dụ: tính toán, kiểm tra, …) và giao tiếp với cơ sở dữ liệu |
| | JSON | Định dạng dạng chuỗi nhẹ, được sử dụng trong việc truyền tải và lưu trữ các đối tượng trong JavaScript, đồng thời để trao đổi thông tin chuẩn hóa giữa máy chủ Node.js và các thành phần khác |
| | Request, Response | **Request:** Yêu cầu do trình duyệt gửi xuống từ máy khách xuống máy chủ. **Response:** Phản hồi kết quả trả về từ máy chủ cho máy khách sau khi xử lý xong |
| Data | SQL Server | Hệ quản trị cơ sở dữ liệu — nơi chịu trách nhiệm nhận các câu lệnh truy vấn từ Node.js và thực thi việc quản lý dữ liệu |
| | Database | Nơi lưu trữ vật lý các dữ liệu thực tế của hệ thống (Ví dụ: thông tin khách hàng, phiếu gửi tiền…) |

---

# CHƯƠNG 4: THIẾT KẾ CƠ SỞ DỮ LIỆU

## 4.1. Thuật toán lập sơ đồ ERD

### 4.1.1. Xét yêu cầu mở sổ tiết kiệm

**Biểu mẫu liên quan: BM1**

| BM1: | Sổ Tiết Kiệm | |
|---|:---:|---|
| Mã số: ............................................ | | Loại tiết kiệm: .................................. |
| Khách hàng: ..................................... | | CMND: ........................................... |
| Địa chỉ: ........................................... | | Ngày mở sổ: .................................... |
| Số tiền gửi: ...................................... | | |

**Quy định liên quan: QĐ1**

> QĐ1: Có 3 loại tiết kiệm (không kỳ hạn, 3 tháng, 6 tháng). Số tiền gửi (ban đầu) tối thiểu là 1.000.000đ

- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.1
- **Các thuộc tính mới:** MaKh, HoTen, CMND, DiaChi, MaSTK, NgayMoSo, SoDu, SoTienGuiToiThieu, TenLTK
- **Thiết kế dữ liệu:** table SO\_TIET\_KIEM, table KHACH\_HANG, table LOAI\_TIET\_KIEM
- **Các thuộc tính trừu tượng:** NgayDaoHan

*Sơ đồ 4.1. Sơ đồ ERD yêu cầu mở sổ tiết kiệm*

---

### 4.1.2. Xét yêu cầu lập phiếu gửi tiền

**Biểu mẫu liên quan: BM2**

| BM2: | Phiếu Gửi Tiền | |
|---|:---:|---|
| Mã số: ……………………………….. | | Khách hàng: ………………………… |
| Ngày gửi: …………………………… | | Số tiền gửi: ………………………… |

**Quy định liên quan: QĐ2**

> QĐ2: Chỉ nhận gửi thêm tiền khi đến kỳ hạn tính lãi suất của các loại tiết kiệm tương ứng. Số tiền gửi thêm tối thiểu là 100.000đ

- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.2
- **Các thuộc tính mới:** MaPGT, NgayGui, SoTienGui, SoTienGuiThemToiThieu, CapNhatLuc
- **Thiết kế dữ liệu:** table SO\_TIET\_KIEM, table KHACH\_HANG, table LOAI\_TIET\_KIEM, table PHIEU\_GUI\_TIEN
- **Các thuộc tính trừu tượng:** NgayDaoHan

*Sơ đồ 4.2. Sơ đồ ERD yêu cầu lập phiếu gửi tiền*

---

### 4.1.3. Xét yêu cầu lập phiếu rút tiền

**Biểu mẫu liên quan: BM3**

| BM3: | Phiếu Rút Tiền | |
|---|:---:|---|
| Mã số: ……………………………… | | Khách hàng: …………………………… |
| Ngày rút: ……………………………… | | Số tiền rút: ……………………………… |

**Quy định liên quan: QĐ3**

> QĐ3: Lãi suất là 0.5% đối với loại không kỳ hạn, 5% với kỳ hạn 3 tháng và 5.5% với kỳ hạn 6 tháng. Tiền lãi 1 năm = số dư × lãi suất của loại tiết kiệm tương ứng. Loại tiết kiệm có kỳ hạn chỉ được rút khi quá kỳ hạn và phải rút hết toàn bộ, khi này tiền lãi được tính với mức lãi suất của loại không kỳ hạn. Loại tiết kiệm không kỳ hạn được rút khi gửi trên 15 ngày. Sổ sau khi rút hết tiền sẽ tự động đóng.

- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.3
- **Các thuộc tính mới:** MaPRT, NgayRut, SoTienRut, LaiSuat
- **Thiết kế dữ liệu:** table SO\_TIET\_KIEM, table KHACH\_HANG, table LOAI\_TIET\_KIEM, table PHIEU\_RUT\_TIEN
- **Các thuộc tính trừu tượng:** NgayDaoHan

*Sơ đồ 4.3. Sơ đồ ERD yêu cầu lập phiếu rút tiền*

---

### 4.1.4. Xét yêu cầu tra cứu sổ

**Biểu mẫu liên quan: BM4**

| BM4: | | Danh Sách Sổ Tiết Kiệm | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **STT** | **Mã Số** | | **Loại Tiết Kiệm** | **Khách Hàng** | **Số Dư** |
| 1 | | | | | |
| 2 | | | | | |

- **Quy định liên quan:** Không có
- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.4
- **Các thuộc tính mới:** Không có
- **Thiết kế dữ liệu:** table SO\_TIET\_KIEM, table KHACH\_HANG, table LOAI\_TIET\_KIEM
- **Các thuộc tính trừu tượng:** Không có

*Sơ đồ 4.4. Sơ đồ ERD yêu cầu tra cứu sổ*

---

### 4.1.5. Xét yêu cầu lập báo cáo doanh số hoạt động ngày

**Biểu mẫu liên quan: BM5.1**

| BM5.1 | | Báo Cáo Doanh Số Hoạt Động Ngày | | | |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Ngày:............................................... | | | | | |
| **STT** | **Loại Tiết Kiệm** | | **Tổng Thu** | **Tổng Chi** | **Chênh Lệch** |
| 1 | | | | | |
| 2 | | | | | |

- **Quy định liên quan:** Không có
- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.5.1
- **Các thuộc tính mới:** Không có
- **Thiết kế dữ liệu:** table LOAI\_TIET\_KIEM, table PHIEU\_RUT\_TIEN, table PHIEU\_GUI\_TIEN, table SO\_TIET\_KIEM
- **Các thuộc tính trừu tượng:** ChenhLech

*Sơ đồ 4.5. Sơ đồ ERD yêu cầu lập báo cáo hoạt động ngày*

---

### 4.1.6. Xét yêu cầu lập báo cáo đóng/mở sổ

**Biểu mẫu liên quan: BM5.2**

| BM5.2 | | Báo Cáo Mở/Đóng Sổ Tháng | | | | |
|---|:---:|:---:|:---:|:---:|---|:---:|
| Loại tiết kiệm:................................... | | | | | Tháng:............................................. | |
| **STT** | **Ngày** | | **Số Sổ Mở** | **Số Sổ Đóng** | | **Chênh Lệch** |
| 1 | | | | | | |
| 2 | | | | | | |

- **Sơ đồ luồng dữ liệu:** Sơ đồ 2.5.2
- **Các thuộc tính mới:** DongSoLuc
- **Thiết kế dữ liệu:** table SO\_TIET\_KIEM
- **Các thuộc tính trừu tượng:** ChenhLech, SoSoDong, SoSoMo

*Sơ đồ 4.6. Sơ đồ ERD yêu cầu lập báo cáo đóng/mở sổ*

---

### 4.1.7. Xét chức năng phân quyền

- **Biểu mẫu liên quan:** Không có
- **Quy định liên quan:** Không có
- **Sơ đồ luồng dữ liệu:** Không có
- **Các thuộc tính mới:** MaNguoiDung, TenDangNhap, MatKhau, MaVaiTro, MaChucNang, TenChucNang, URL, Method, TenVaiTro
- **Thiết kế dữ liệu:** table KHACH\_HANG, table NGUOI\_DUNG, table VAI\_TRO, table CHUC\_NANG, table PHAN\_QUYEN
- **Các thuộc tính trừu tượng:** Không có

*Sơ đồ 4.7. Sơ đồ ERD chức năng phân quyền*

---

## 4.2. Sơ đồ ERD hoàn chỉnh

*Sơ đồ 4.8. Sơ đồ ERD hoàn chỉnh*

---

## 4.3. Danh sách các bảng dữ liệu (table) trong sơ đồ

| STT | Tên Bảng Dữ Liệu | Diễn Giải |
|:---:|---|---|
| 1 | **KHACH\_HANG** | Lưu hồ sơ thông tin cá nhân và định danh của khách hàng |
| 2 | **LOAI\_TIET\_KIEM** | Lưu danh sách các loại hình tiết kiệm, kỳ hạn và quy định tiền gửi |
| 3 | **SO\_TIET\_KIEM** | Lưu trữ thông tin chi tiết về các sổ tiết kiệm đã mở của khách hàng |
| 4 | **PHIEU\_GUI\_TIEN** | Lưu hồ sơ các giao dịch gửi tiền vào sổ tiết kiệm |
| 5 | **PHIEU\_RUT\_TIEN** | Lưu hồ sơ các giao dịch rút tiền từ sổ tiết kiệm |
| 6 | **NGUOI\_DUNG** | Lưu thông tin tài khoản đăng nhập, mật khẩu và liên kết vai trò |
| 7 | **VAI\_TRO** | Lưu danh sách các vai trò trong hệ thống (Admin, Staff, Customer) |
| 8 | **CHUC\_NANG** | Lưu danh mục các chức năng, URL và phương thức thực thi hệ thống |
| 9 | **PHAN\_QUYEN** | Lưu thông tin chi tiết việc phân quyền chức năng cho từng vai trò |

*Bảng 4.1. Danh sách các bảng dữ liệu trong sơ đồ*

---

## 4.4. Mô tả từng bảng dữ liệu

### 4.4.1. Bảng KHACH\_HANG

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaKH | int | Khóa chính | Mã định danh khách hàng |
| 2 | HoTen | nvarchar(100) | | Họ và tên khách hàng |
| 3 | CMND | varchar(20) | Unique | Số chứng minh nhân dân/CCCD |
| 4 | DiaChi | nvarchar(255) | | Địa chỉ liên lạc |

*Bảng 4.2. Bảng mô tả bảng KHACH\_HANG*

---

### 4.4.2. Bảng LOAI\_TIET\_KIEM

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaLTK | int | Khóa chính | Mã loại tiết kiệm |
| 2 | KyHan | int | | Kỳ hạn gửi (số tháng) |
| 3 | TenLTK | nvarchar(150) | | Tên loại tiết kiệm |
| 4 | LaiSuat | decimal(10,5) | | Lãi suất tiền gửi |
| 5 | SoTienGuiToiThieu | int | | Số tiền gửi tối thiểu để mở sổ |
| 6 | SoTienGuiThemToiThieu | int | | Số tiền tối thiểu cho mỗi lần gửi thêm |

*Bảng 4.3. Bảng mô tả bảng LOAI\_TIET\_KIEM*

---

### 4.4.3. Bảng SO\_TIET\_KIEM

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaSTK | int | Khóa chính | Mã sổ tiết kiệm |
| 2 | MaKH | int | Khóa ngoại liên kết với table KHACH\_HANG | Liên kết tới khách hàng |
| 3 | MaLTK | int | Khóa ngoại liên kết với table LOAI\_TIET\_KIEM | Liên kết tới loại tiết kiệm |
| 4 | SoDu | int | | Số tiền hiện có trong sổ |
| 5 | NgayMoSo | timestamp | | Thời điểm mở sổ |
| 6 | CapNhatLuc | timestamp | | Lần cập nhật số dư gần nhất |
| 7 | DongSoLuc | timestamp | | Thời điểm tất toán/đóng sổ |

*Bảng 4.4. Bảng mô tả bảng SO\_TIET\_KIEM*

---

### 4.4.4. Bảng PHIEU\_GUI\_TIEN

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaPGT | int | Khóa chính | Mã phiếu gửi tiền |
| 2 | MaKH | int | Khóa ngoại liên kết với table KHACH\_HANG | Mã khách hàng thực hiện gửi |
| 3 | MaSTK | int | Khóa ngoại liên kết với table SO\_TIET\_KIEM | Mã sổ tiết kiệm nhận tiền |
| 4 | SoTienGui | int | | Số tiền gửi thêm vào sổ |
| 5 | NgayGui | timestamp | | Thời điểm thực hiện giao dịch |

*Bảng 4.5. Bảng mô tả bảng PHIEU\_GUI\_TIEN*

---

### 4.4.5. Bảng PHIEU\_RUT\_TIEN

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaPRT | int | Khóa chính | Mã phiếu rút tiền |
| 2 | MaKH | int | Khóa ngoại liên kết với table KHACH\_HANG | Mã khách hàng thực hiện rút |
| 3 | MaSTK | int | Khóa ngoại liên kết với table SO\_TIET\_KIEM | Mã sổ tiết kiệm rút tiền |
| 4 | SoTienRut | int | | Số tiền rút ra khỏi sổ |
| 5 | NgayRut | timestamp | | Thời điểm thực hiện giao dịch |

*Bảng 4.6. Bảng mô tả bảng PHIEU\_RUT\_TIEN*

---

### 4.4.6. Bảng NGUOI\_DUNG

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaNguoiDung | int | Khóa chính | ID người dùng |
| 2 | TenDangNhap | varchar(50) | | Tên tài khoản hệ thống |
| 3 | MatKhau | varchar(255) | Unique | Mật khẩu (nên mã hóa) |
| 4 | MaVaiTro | int | Khóa ngoại liên kết với table VAI\_TRO | Liên kết vai trò (Admin/Staff/...) |
| 5 | MaKH | int | Khóa ngoại liên kết với table KHACH\_HANG | Liên kết tới thông tin khách hàng |

*Bảng 4.7. Bảng mô tả bảng NGUOI\_DUNG*

---

### 4.4.7. Bảng VAI\_TRO

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaVaiTro | int | Khóa chính | Mã định danh vai trò |
| 2 | TenVaiTro | varchar(50) | | Tên quyền hạn (Admin, Staff...) |

*Bảng 4.8. Bảng mô tả bảng VAI\_TRO*

---

### 4.4.8. Bảng CHUC\_NANG

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaChucNang | int | Khóa chính | Mã định danh chức năng |
| 2 | TenChucNang | nvarchar(100) | | Tên chức năng hệ thống |
| 3 | URL | varchar(255) | | Đường dẫn truy cập chức năng |
| 4 | Method | varchar(10) | | Phương thức (GET, POST...) |

*Bảng 4.9. Bảng mô tả bảng CHUC\_NANG*

---

### 4.4.9. Bảng PHAN\_QUYEN

| STT | Thuộc tính | Kiểu dữ liệu | Ràng buộc | Diễn giải |
|:---:|---|---|---|---|
| 1 | MaVaiTro | int | Khóa chính + Khóa ngoại liên kết tới table VAI\_TRO | Mã vai trò được cấp quyền |
| 2 | MaChucNang | int | Khóa chính + Khóa ngoại liên kết tới table CHUC\_NANG | Mã chức năng được phép dùng |

*Bảng 4.10. Bảng mô tả bảng PHAN\_QUYEN*
