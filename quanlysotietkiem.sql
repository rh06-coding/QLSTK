use QLSOTIETKIEM
go

CREATE TABLE KHACH_HANG(
	MaKH int primary key IDENTITY(1,1) not null,
	HoTen nvarchar(100) not null,
	CMND varchar(20) unique not null,
	DiaChi nvarchar(255)
)

CREATE TABLE LOAI_TIET_KIEM(
	MaLTK int primary key IDENTITY(1,1) not null,
	KyHan int not null,
	TenLTK nvarchar(150) not null,
	LaiSuat decimal(10, 5) not null,
	SoTienGuiToiThieu int not null,
	SoTienGuiThemToiThieu int not null
)

CREATE TABLE VAI_TRO(
	MaVaiTro int primary key IDENTITY(1,1) not null,
	TenVaiTro varchar(50) not null
)

CREATE TABLE CHUC_NANG(
	MaChucNang int primary key IDENTITY(1,1) not null,
	TenChucNang nvarchar(100) not null,
	URL varchar(255) not null,
	Method varchar(10) not null
)

CREATE TABLE SO_TIET_KIEM(
	MaSTK int primary key IDENTITY(1,1) not null,
	MaKH int,
	MaLTK int,
	SoDu int default 0,
	NgayMoSo datetime default getdate(),
	CapNhatLuc datetime default getdate(),
	DongSoLuc datetime null,
	CONSTRAINT FK_STK_KHACHHANG FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
	CONSTRAINT FK_STK_LOAITIETKIEM FOREIGN KEY (MaLTK) REFERENCES LOAI_TIET_KIEM(MaLTK)
)

CREATE TABLE NGUOI_DUNG(
	MaNguoiDung int primary key IDENTITY(1,1) not null,
	TenDangNhap varchar(50) not null,
	MatKhau varchar(255) unique not null,
	MaVaiTro int,
	MaKH int,
	CONSTRAINT FK_ND_VAITRO FOREIGN KEY (MaVaiTro) REFERENCES VAI_TRO(MaVaiTro),
    CONSTRAINT FK_ND_KHACHHANG FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH)
)

CREATE TABLE PHAN_QUYEN(
	MaVaiTro int,
	MaChucNang int,
	primary key(MaVaiTro, MaChucNang),
	CONSTRAINT FK_PQ_VAITRO FOREIGN KEY (MaVaiTro) REFERENCES VAI_TRO(MaVaiTro),
    CONSTRAINT FK_PQ_CHUCNANG FOREIGN KEY (MaChucNang) REFERENCES CHUC_NANG(MaChucNang)
)

CREATE TABLE PHIEU_GUI_TIEN(
	MaPGT int primary key IDENTITY(1,1) not null,
	MaKH int,
	MaSTK int,
	SoTienGui int not null,
	NgayGui datetime default getdate(),
	CONSTRAINT FK_PGT_KHACHHANG FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    CONSTRAINT FK_PGT_SOTIETKIEM FOREIGN KEY (MaSTK) REFERENCES SO_TIET_KIEM(MaSTK)
)

CREATE TABLE PHIEU_RUT_TIEN(
	MaPRT int primary key IDENTITY(1,1) not null,
	MaKH int,
	MaSTK int,
	SoTienRut int not null,
	NgayRut datetime default getdate(),
	CONSTRAINT FK_PRT_KHACHHANG FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    CONSTRAINT FK_PRT_SOTIETKIEM FOREIGN KEY (MaSTK) REFERENCES SO_TIET_KIEM(MaSTK)
)

--Đảm bảo số dư không bị âm
ALTER TABLE SO_TIET_KIEM
ADD CONSTRAINT CHK_SoDu CHECK (SoDu >= 0)

--Đảm bảo số tiền nạp thêm mỗi lần tối thiểu là 100.000đ
ALTER TABLE PHIEU_GUI_TIEN
ADD CONSTRAINT CHK_SoTienGui_ToiThieu CHECK (SoTienGui >= 100000)

--Đảm bảo số tiền rút phải lớn hơn 0
ALTER TABLE PHIEU_RUT_TIEN
ADD CONSTRAINT CHK_SoTienRut CHECK (SoTienRut > 0)

GO
CREATE OR ALTER PROCEDURE sp_ThucHienRutTien
    @MaKH INT,
    @MaSTK INT,
    @SoTienRut INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SoDuHienTai INT, @NgayMoSo DATETIME, @DongSoLuc DATETIME;
    DECLARE @KyHan INT, @LaiSuat DECIMAL(10,5);
    DECLARE @SoNgayDaGui INT, @SoThangDaGui INT;
    DECLARE @RowCount INT;

    -- Lấy thông tin sổ tiết kiệm
    SELECT
        @SoDuHienTai = s.SoDu,
        @NgayMoSo = s.NgayMoSo,
        @DongSoLuc = s.DongSoLuc,
        @KyHan = l.KyHan,
        @LaiSuat = l.LaiSuat
    FROM SO_TIET_KIEM s
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    WHERE s.MaSTK = @MaSTK AND s.MaKH = @MaKH;

    -- Lưu ngay số dòng trả về
    SET @RowCount = @@ROWCOUNT;

    -- Kiểm tra sổ tồn tại
    IF @RowCount = 0
        THROW 50001, N'Lỗi: Sổ tiết kiệm không tồn tại hoặc không khớp với mã khách hàng!', 1;

    -- Kiểm tra sổ đã đóng chưa
    IF @DongSoLuc IS NOT NULL
        THROW 50002, N'Lỗi: Sổ tiết kiệm này đã tất toán, không thể giao dịch!', 1;

    -- Kiểm tra số dư
    IF @SoTienRut > @SoDuHienTai
        THROW 50003, N'Lỗi: Số dư không đủ để thực hiện giao dịch rút tiền!', 1;

    -- Tính thời gian đã gửi
    SET @SoNgayDaGui = DATEDIFF(DAY, @NgayMoSo, GETDATE());
    SET @SoThangDaGui = DATEDIFF(MONTH, @NgayMoSo, GETDATE());

    -- Kiểm tra theo kỳ hạn
    IF @KyHan = 0 
    BEGIN
        IF @SoNgayDaGui <= 15
            THROW 50004, N'Lỗi: Loại không kỳ hạn phải gửi trên 15 ngày mới được rút!', 1;
    END
    ELSE 
    BEGIN
        IF @SoThangDaGui < @KyHan
            THROW 50005, N'Lỗi: Sổ có kỳ hạn chưa đến ngày đáo hạn, không được phép rút!', 1;

        IF @SoTienRut != @SoDuHienTai
            THROW 50006, N'Lỗi: Sổ có kỳ hạn bắt buộc phải rút toàn bộ (tất toán)!', 1;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Cập nhật số dư
        UPDATE SO_TIET_KIEM
        SET SoDu = SoDu - @SoTienRut,
            CapNhatLuc = GETDATE()
        WHERE MaSTK = @MaSTK;

        -- Ghi phiếu rút (MaPRT tự động tăng)
        INSERT INTO PHIEU_RUT_TIEN (MaKH, MaSTK, SoTienRut, NgayRut)
        VALUES (@MaKH, @MaSTK, @SoTienRut, GETDATE());

        -- Tự động đóng sổ nếu hết tiền
        IF (@SoDuHienTai - @SoTienRut) = 0
        BEGIN
            UPDATE SO_TIET_KIEM
            SET DongSoLuc = GETDATE()
            WHERE MaSTK = @MaSTK;
        END

        COMMIT TRANSACTION;
        PRINT N'Giao dịch rút tiền thành công!';

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

GO
CREATE OR ALTER PROCEDURE sp_ThucHienGuiTien
    @MaKH INT,
    @MaSTK INT,
    @SoTienGui INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @SoDuHienTai INT, @DongSoLuc DATETIME, @NgayMoSo DATETIME;
    DECLARE @SoTienGuiToiThieu INT, @KyHan INT;
    DECLARE @RowCount INT, @SoThangDaGui INT;

    -- Lấy thông tin sổ và loại tiết kiệm (Bổ sung thêm NgayMoSo và KyHan)
    SELECT 
        @SoDuHienTai = s.SoDu,
        @DongSoLuc = s.DongSoLuc,
        @NgayMoSo = s.NgayMoSo,
        @KyHan = l.KyHan,
        @SoTienGuiToiThieu = l.SoTienGuiThemToiThieu
    FROM SO_TIET_KIEM s
    JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK
    WHERE s.MaSTK = @MaSTK AND s.MaKH = @MaKH;

    SET @RowCount = @@ROWCOUNT;

    -- Kiểm tra sổ tồn tại
    IF @RowCount = 0
        THROW 50011, N'Lỗi: Sổ tiết kiệm không tồn tại hoặc không khớp với mã khách hàng!', 1;

    -- Kiểm tra sổ đã đóng chưa
    IF @DongSoLuc IS NOT NULL
        THROW 50012, N'Lỗi: Sổ tiết kiệm đã tất toán, không thể gửi thêm!', 1;

    -- Kiểm tra số tiền gửi thêm tối thiểu
    IF @SoTienGui < @SoTienGuiToiThieu
        THROW 50013, N'Lỗi: Số tiền gửi thêm không được nhỏ hơn quy định của loại tiết kiệm!', 1;

    -- Chỉ cho phép gửi thêm đúng kỳ hạn (đối với loại có kỳ hạn)
    IF @KyHan > 0 
    BEGIN
        SET @SoThangDaGui = DATEDIFF(MONTH, @NgayMoSo, GETDATE());
        -- Nếu số tháng đã gửi chia hết cho Kỳ hạn -> Đúng lúc đáo hạn mới được gửi thêm
        -- (Ví dụ: kỳ hạn 3 tháng -> chỉ được gửi thêm ở tháng thứ 3, 6, 9...)
        IF @SoThangDaGui % @KyHan != 0 OR @SoThangDaGui = 0
            THROW 50014, N'Lỗi: Đối với sổ có kỳ hạn, chỉ nhận gửi thêm tiền vào đúng ngày đáo hạn!', 1;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Cộng tiền vào sổ
        UPDATE SO_TIET_KIEM
        SET SoDu = SoDu + @SoTienGui,
            CapNhatLuc = GETDATE()
        WHERE MaSTK = @MaSTK;

        -- Ghi phiếu gửi
        INSERT INTO PHIEU_GUI_TIEN (MaKH, MaSTK, SoTienGui, NgayGui)
        VALUES (@MaKH, @MaSTK, @SoTienGui, GETDATE());

        COMMIT TRANSACTION;
        PRINT N'Giao dịch gửi tiền thành công!';

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO

USE QLSOTIETKIEM    
GO 

---------------------------------------------------------
-- 1. LÀM SẠCH DỮ LIỆU (Tránh lỗi khóa ngoại)
---------------------------------------------------------
DELETE FROM PHIEU_RUT_TIEN; 
DELETE FROM PHIEU_GUI_TIEN; 
DELETE FROM SO_TIET_KIEM;   
DELETE FROM LOAI_TIET_KIEM; 
DELETE FROM KHACH_HANG;     

---------------------------------------------------------
-- 2. KHỞI TẠO DỮ LIỆU BẰNG BIẾN ĐỘNG (Bảo vệ ID)
---------------------------------------------------------
DECLARE @KH_A INT, @KH_B INT;
DECLARE @LTK_0 INT, @LTK_3 INT, @LTK_6 INT;
DECLARE @STK_1 INT, @STK_2 INT, @STK_3 INT, @STK_4 INT, @STK_5 INT;

-- KHÁCH HÀNG
INSERT INTO KHACH_HANG (HoTen, CMND, DiaChi) VALUES (N'Nguyễn Văn A', '123456789', N'TP.HCM');
SET @KH_A = SCOPE_IDENTITY();

INSERT INTO KHACH_HANG (HoTen, CMND, DiaChi) VALUES (N'Trần Thị B', '987654321', N'Hà Nội');
SET @KH_B = SCOPE_IDENTITY();

-- LOẠI TIẾT KIỆM
INSERT INTO LOAI_TIET_KIEM (KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu) 
VALUES (0, N'Không kỳ hạn', 0.5, 1000000, 100000);
SET @LTK_0 = SCOPE_IDENTITY();

INSERT INTO LOAI_TIET_KIEM (KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu) 
VALUES (3, N'Kỳ hạn 3 tháng', 5.0, 1000000, 100000);
SET @LTK_3 = SCOPE_IDENTITY();

INSERT INTO LOAI_TIET_KIEM (KyHan, TenLTK, LaiSuat, SoTienGuiToiThieu, SoTienGuiThemToiThieu) 
VALUES (6, N'Kỳ hạn 6 tháng', 5.5, 1000000, 100000);
SET @LTK_6 = SCOPE_IDENTITY();

-- SỔ TIẾT KIỆM
-- Sổ 1: Không kỳ hạn, đủ 15 ngày
INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo) 
VALUES (@KH_A, @LTK_0, 1000000, DATEADD(DAY, -20, GETDATE()));
SET @STK_1 = SCOPE_IDENTITY();

-- Sổ 2: 3 tháng, ĐÃ ĐÁO HẠN
INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo) 
VALUES (@KH_A, @LTK_3, 5000000, DATEADD(MONTH, -3, GETDATE()));
SET @STK_2 = SCOPE_IDENTITY();

-- Sổ 3: 3 tháng, CHƯA ĐÁO HẠN
INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo) 
VALUES (@KH_B, @LTK_3, 2000000, DATEADD(MONTH, -1, GETDATE()));
SET @STK_3 = SCOPE_IDENTITY();

-- Sổ 4: 6 tháng, ĐÃ ĐÁO HẠN
INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo) 
VALUES (@KH_A, @LTK_6, 10000000, DATEADD(MONTH, -6, GETDATE()));
SET @STK_4 = SCOPE_IDENTITY();

-- Sổ 5: 6 tháng, CHƯA ĐÁO HẠN
INSERT INTO SO_TIET_KIEM (MaKH, MaLTK, SoDu, NgayMoSo) 
VALUES (@KH_B, @LTK_6, 8000000, DATEADD(MONTH, -2, GETDATE()));
SET @STK_5 = SCOPE_IDENTITY();

---------------------------------------------------------
-- 3. KỊCH BẢN TEST CHI TIẾT
---------------------------------------------------------
PRINT N'=====================================================';
PRINT N'BẮT ĐẦU KIỂM TRA NGHIỆP VỤ';
PRINT N'=====================================================';

PRINT N'>> Case 1: Gửi thêm 500.000đ vào Sổ 1 (Hợp lệ)';
BEGIN TRY EXEC sp_ThucHienGuiTien @KH_A, @STK_1, 500000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 2: Gửi thêm 50.000đ vào Sổ 1 (Báo lỗi tối thiểu)';
BEGIN TRY EXEC sp_ThucHienGuiTien @KH_A, @STK_1, 50000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 3: Rút 300.000đ từ Sổ 1 (Hợp lệ)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_A, @STK_1, 300000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 4: Rút tiền Sổ 3 (Báo lỗi chưa đáo hạn)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_B, @STK_3, 1000000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 5: Rút một phần Sổ 2 (Báo lỗi bắt buộc tất toán)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_A, @STK_2, 1000000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 6: Tất toán 5.000.000đ Sổ 2 (Hợp lệ)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_A, @STK_2, 5000000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 7: Giao dịch trên sổ đã đóng ở Case 6 (Báo lỗi)';
BEGIN TRY EXEC sp_ThucHienGuiTien @KH_A, @STK_2, 200000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 8: Khách B rút tiền Sổ 1 của Khách A (Báo lỗi)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_B, @STK_1, 100000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 9: Tất toán 10.000.000đ Sổ 4 kỳ hạn 6 tháng (Hợp lệ)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_A, @STK_4, 10000000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

PRINT N'>> Case 10: Rút tiền Sổ 5 kỳ hạn 6 tháng (Báo lỗi chưa đáo hạn)';
BEGIN TRY EXEC sp_ThucHienRutTien @KH_B, @STK_5, 8000000; END TRY BEGIN CATCH PRINT ERROR_MESSAGE(); END CATCH;

---------------------------------------------------------
-- 4. TỔNG HỢP KẾT QUẢ ĐỂ ĐỐI SOÁT
---------------------------------------------------------
PRINT '';
PRINT N'=====================================================';
PRINT N'BÁO CÁO TỔNG HỢP SAU TEST';
PRINT N'=====================================================';

-- Kiểm tra trạng thái các sổ
SELECT 
    s.MaSTK, 
    k.HoTen,
    l.TenLTK,
    s.SoDu, 
    CONVERT(VARCHAR(10), s.NgayMoSo, 103) AS NgayMoSo, 
    CONVERT(VARCHAR(10), s.DongSoLuc, 103) AS DongSoLuc 
FROM SO_TIET_KIEM s
JOIN KHACH_HANG k ON s.MaKH = k.MaKH
JOIN LOAI_TIET_KIEM l ON s.MaLTK = l.MaLTK;

-- Kiểm tra lịch sử giao dịch
SELECT 'GUI TIEN' AS GiaoDich, MaSTK, SoTienGui AS SoTien, NgayGui AS ThoiGian FROM PHIEU_GUI_TIEN
UNION ALL
SELECT 'RUT TIEN' AS GiaoDich, MaSTK, SoTienRut AS SoTien, NgayRut AS ThoiGian FROM PHIEU_RUT_TIEN
ORDER BY MaSTK, ThoiGian;