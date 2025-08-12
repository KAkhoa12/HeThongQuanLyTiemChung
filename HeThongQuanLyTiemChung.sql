-- Tạo cơ sở dữ liệu
CREATE DATABASE HeThongQuanLyTiemChung;
GO

USE HeThongQuanLyTiemChung;
GO

-- 12. NhanAnh
CREATE TABLE NhanAnh (
    maNhan VARCHAR(100) PRIMARY KEY,
    tenNhan NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(255),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- 13. NguonAnh
CREATE TABLE NguonAnh (
    maAnh VARCHAR(100) PRIMARY KEY,
    maNhan VARCHAR(100),
    urlAnh NVARCHAR(255) NOT NULL,
    altText NVARCHAR(100),
    nguoiTai VARCHAR(100),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNhan) REFERENCES NhanAnh(maNhan)
);

-- 1. VaiTro
CREATE TABLE VaiTro (
    maVaiTro VARCHAR(100) PRIMARY KEY,
    tenVaiTro NVARCHAR(50) NOT NULL,
    moTa NVARCHAR(255),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- 2. Quyen
CREATE TABLE Quyen (
    maQuyen VARCHAR(100) PRIMARY KEY,
    tenQuyen NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(255),
    module NVARCHAR(50) NOT NULL,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- 3. VaiTroQuyen
CREATE TABLE VaiTroQuyen (
    maVaiTro VARCHAR(100),
    maQuyen VARCHAR(100),
    ngayTao DATETIME,
    isDelete BIT,
    isActive BIT,
    ngayCapNhat DATETIME,
    PRIMARY KEY (maVaiTro, maQuyen),
    FOREIGN KEY (maVaiTro) REFERENCES VaiTro(maVaiTro),
    FOREIGN KEY (maQuyen) REFERENCES Quyen(maQuyen)
);

-- 4. NguoiDung
CREATE TABLE NguoiDung (
    maNguoiDung VARCHAR(100) PRIMARY KEY,
    maVaiTro VARCHAR(100) NOT NULL,
    ten NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    matKhau NVARCHAR(100) NOT NULL,
    soDienThoai NVARCHAR(20),
    ngaySinh DATE,
    diaChi NVARCHAR(200),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
	maAnh VARCHAR(100)
    FOREIGN KEY (maVaiTro) REFERENCES VaiTro(maVaiTro),
	FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
);

-- 5. NguoiDungQuyen
CREATE TABLE NguoiDungQuyen (
    maNguoiDung VARCHAR(100),
    maQuyen VARCHAR(100),
    ngayTao DATETIME,
    isDelete BIT,
    isActive BIT,
    ngayCapNhat DATETIME,
    PRIMARY KEY (maNguoiDung, maQuyen),
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maQuyen) REFERENCES Quyen(maQuyen)
);

-- 6. PhienDangNhap
CREATE TABLE PhienDangNhap (
    maPhien VARCHAR(100) PRIMARY KEY,
    accessToken NVARCHAR(255) NOT NULL,
    refreshToken NVARCHAR(255) NOT NULL,
    thoiHan DATETIME NOT NULL,
    thoiHanRefresh DATETIME NOT NULL,
    maNguoiDung VARCHAR(100) NOT NULL,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- 7. ThongTinNguoiDung
CREATE TABLE ThongTinNguoiDung (
    maThongTin VARCHAR(100) PRIMARY KEY,
    maNguoiDung VARCHAR(100) NOT NULL,
    chieuCao DECIMAL(5,2),
    canNang DECIMAL(5,2),
    bmi DECIMAL(5,2),
    nhomMau NVARCHAR(10),
    benhNen NVARCHAR(MAX),
    diUng NVARCHAR(MAX),
    thuocDangDung NVARCHAR(MAX),
    tinhTrangMangThai BIT,
    ngayKhamGanNhat DATE,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- 8. BacSi
CREATE TABLE BacSi (
    maBacSi VARCHAR(100) PRIMARY KEY,
    maNguoiDung VARCHAR(100) NOT NULL UNIQUE,
    chuyenMon NVARCHAR(100),
    soGiayPhep NVARCHAR(50),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- 9. QuanLy
CREATE TABLE QuanLy (
    maQuanLy VARCHAR(100) PRIMARY KEY,
    maNguoiDung VARCHAR(100) NOT NULL UNIQUE,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung)
);

-- 10. DiaDiem
CREATE TABLE DiaDiem (
    maDiaDiem VARCHAR(100) PRIMARY KEY,
    ten NVARCHAR(100) NOT NULL,
    diaChi NVARCHAR(255) NOT NULL,
    soDienThoai NVARCHAR(20),
    email NVARCHAR(100),
    moTa NVARCHAR(MAX),
    gioMoCua NVARCHAR(100),
    sucChua INT,
    loaiDiaDiem NVARCHAR(20),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- 14. AnhDiaDiem
CREATE TABLE AnhDiaDiem (
    maAnhDiaDiem VARCHAR(100) PRIMARY KEY,
    maDiaDiem VARCHAR(100) NOT NULL,
    maAnh VARCHAR(100) NOT NULL,
    laAnhChinh BIT,
    thuTuHienThi INT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDiaDiem) REFERENCES DiaDiem(maDiaDiem),
    FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
);


-- 15. DichVu
-- Danh mục vaccine
CREATE TABLE Vaccine (
    maVaccine VARCHAR(100) PRIMARY KEY,
    ten NVARCHAR(100) NOT NULL,
    nhaSanXuat NVARCHAR(100),
    tuoiBatDauTiem INT,
    tuoiKetThucTiem INT,
	huongDanSuDung nvarchar(max),
	phongNgua nvarchar(max),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- Lịch tiêm chuẩn (WHO / EPI / CDC)
CREATE TABLE LichTiemChuan (
    maLichTiemChuan VARCHAR(100) PRIMARY KEY,
    maVaccine VARCHAR(100) NOT NULL,
    muiThu INT NOT NULL,
    tuoiThangToiThieu INT,
    tuoiThangToiDa INT,
    soNgaySauMuiTruoc INT NULL,      -- NULL nếu là mũi đầu
    ghiChu NVARCHAR(MAX),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maVaccine) REFERENCES Vaccine(maVaccine)
);

-- Loại dịch vụ (gói, lẻ, khuyến mãi...)
CREATE TABLE LoaiDichVu (
    maLoaiDichVu VARCHAR(100) PRIMARY KEY,
    tenLoai NVARCHAR(100),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME
);

-- Dịch vụ (sản phẩm bán ra)
CREATE TABLE DichVu (
    maDichVu VARCHAR(100) PRIMARY KEY,
    ten NVARCHAR(100) NOT NULL,
    moTa NVARCHAR(MAX),
    gia DECIMAL(10,2),
    maLoaiDichVu VARCHAR(100),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maLoaiDichVu) REFERENCES LoaiDichVu(maLoaiDichVu)
);
create table AnhDichVu (
	maAnhDichVu varchar(100) primary key,
	maAnh varchar(100),
	maDichVu varchar(100),
	laAnhChinh BIT,
    thuTuHienThi INT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDichVu) REFERENCES DichVu(maDichVu),
    FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
)
-- 17. AnhVaccine
CREATE TABLE AnhVaccine (
    maAnhVaccine VARCHAR(100) PRIMARY KEY,
    maVaccine VARCHAR(100) NOT NULL,
    maAnh VARCHAR(100) NOT NULL,
    thuTuHienThi INT,
	laAnhChinh BIT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maVaccine) REFERENCES Vaccine(maVaccine),
    FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
);

-- Dịch vụ chứa những vaccine nào & số mũi chuẩn
CREATE TABLE DichVuVaccine (
    maDichVuVaccine VARCHAR(100) PRIMARY KEY,
    maDichVu VARCHAR(100) NOT NULL,
    maVaccine VARCHAR(100) NOT NULL,
    soMuiChuan INT NOT NULL,
    ghiChu NVARCHAR(MAX),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDichVu) REFERENCES DichVu(maDichVu),
    FOREIGN KEY (maVaccine) REFERENCES Vaccine(maVaccine)
);

-- Lịch hẹn thực tế của khách hàng
CREATE TABLE LichHen (
    maLichHen VARCHAR(100) PRIMARY KEY,
    maDonHang VARCHAR(100) NOT NULL,
    maLichTiemChuan VARCHAR(100) NOT NULL,
    ngayHen DATETIME,
    trangThai NVARCHAR(20),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maLichTiemChuan) REFERENCES LichTiemChuan(maLichTiemChuan)
);

-- 20. NhaCungCap
CREATE TABLE NhaCungCap (
    maNhaCungCap VARCHAR(100) PRIMARY KEY,
    ten NVARCHAR(100) NOT NULL,
    nguoiLienHe NVARCHAR(100),
    soDienThoai NVARCHAR(20),
    diaChi NVARCHAR(200),
    maAnh VARCHAR(100),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
);

-- 21. AnhNhaCungCap
CREATE TABLE AnhNhaCungCap (
    maAnhNhaCungCap VARCHAR(100) PRIMARY KEY,
    maNhaCungCap VARCHAR(100) NOT NULL,
    maAnh VARCHAR(100) NOT NULL,
    thuTuHienThi INT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNhaCungCap) REFERENCES NhaCungCap(maNhaCungCap),
    FOREIGN KEY (maAnh) REFERENCES NguonAnh(maAnh)
);



-- Lô vaccine
CREATE TABLE LoVaccine (
    maLo VARCHAR(100) PRIMARY KEY,
    maVaccine VARCHAR(100) NOT NULL,
    maNhaCungCap VARCHAR(100) NOT NULL,
    soLo NVARCHAR(50),
    ngaySanXuat DATE,
    ngayHetHan DATE,
    soLuongNhap INT,               -- tổng nhập ban đầu
    soLuongHienTai INT,            -- còn trong kho
    giaNhap DECIMAL(12,2),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maVaccine) REFERENCES Vaccine(maVaccine),
    FOREIGN KEY (maNhaCungCap) REFERENCES NhaCungCap(maNhaCungCap)
);


-- Phiếu nhập
CREATE TABLE PhieuNhap (
    maPhieuNhap VARCHAR(100) PRIMARY KEY,
    maNhaCungCap VARCHAR(100),
    ngayNhap DATETIME,
    tongTien DECIMAL(12,2),
    trangThai NVARCHAR(20),         -- PENDING | COMPLETED
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maNhaCungCap) REFERENCES NhaCungCap(maNhaCungCap)
);
CREATE TABLE ChiTietNhap (
    maChiTiet VARCHAR(100) PRIMARY KEY,
    maPhieuNhap VARCHAR(100),
    maLo VARCHAR(100),
    soLuong INT,
    gia DECIMAL(12,2),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maPhieuNhap) REFERENCES PhieuNhap(maPhieuNhap),
    FOREIGN KEY (maLo) REFERENCES LoVaccine(maLo)
);

-- Phiếu xuất (dùng cho cả xuất bán & chuyển kho)
CREATE TABLE PhieuXuat (
    maPhieuXuat VARCHAR(100) PRIMARY KEY,
    maDiaDiemXuat VARCHAR(100),         -- kho xuất
    maDiaDiemNhap VARCHAR(100),         -- kho nhận (NULL = xuất cho khách)
    ngayXuat DATETIME,
    loaiXuat NVARCHAR(20),              -- BAN_HANG | CHUYEN_KHO
    trangThai NVARCHAR(20),             -- PENDING | COMPLETED
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDiaDiemXuat) REFERENCES DiaDiem(maDiaDiem),
    FOREIGN KEY (maDiaDiemNhap) REFERENCES DiaDiem(maDiaDiem)
);
CREATE TABLE ChiTietXuat (
    maChiTiet VARCHAR(100) PRIMARY KEY,
    maPhieuXuat VARCHAR(100),
    maLo VARCHAR(100),
    soLuong INT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maPhieuXuat) REFERENCES PhieuXuat(maPhieuXuat),
    FOREIGN KEY (maLo) REFERENCES LoVaccine(maLo)
);

-- Phiếu thanh lý
CREATE TABLE PhieuThanhLy (
    maPhieuThanhLy VARCHAR(100) PRIMARY KEY,
    maDiaDiem VARCHAR(100),
    ngayThanhLy DATETIME,
    trangThai NVARCHAR(20),            -- PENDING | COMPLETED
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDiaDiem) REFERENCES DiaDiem(maDiaDiem)
);
CREATE TABLE ChiTietThanhLy (
    maChiTiet VARCHAR(100) PRIMARY KEY,
    maPhieuThanhLy VARCHAR(100),
    maLo VARCHAR(100),
    soLuong INT,
    lyDo NVARCHAR(255),
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maPhieuThanhLy) REFERENCES PhieuThanhLy(maPhieuThanhLy),
    FOREIGN KEY (maLo) REFERENCES LoVaccine(maLo)
);
-- Tồn kho lô tại từng địa điểm
CREATE TABLE TonKhoLo (
    maTonKho VARCHAR(100) PRIMARY KEY,
    maDiaDiem VARCHAR(100),
    maLo VARCHAR(100),
    soLuong INT,
    isDelete BIT,
    isActive BIT,
    ngayTao DATETIME,
    ngayCapNhat DATETIME,
    FOREIGN KEY (maDiaDiem) REFERENCES DiaDiem(maDiaDiem),
    FOREIGN KEY (maLo) REFERENCES LoVaccine(maLo)
);

CREATE TABLE DonHang (
    maDonHang            VARCHAR(100) PRIMARY KEY,
    maNguoiDung          VARCHAR(100) NOT NULL,   -- khách
    maDiaDiemYeuThich    VARCHAR(100),            -- phòng/kho yêu cầu
    ngayDat              DATETIME,
    tongTienGoc          DECIMAL(12,2) NOT NULL,  -- trước khuyến mãi
    tongTienThanhToan    DECIMAL(12,2) NOT NULL,  -- sau khuyến mãi
    trangThaiDon         NVARCHAR(30),            -- PENDING | CONFIRMED | COMPLETED | CANCELLED
    ghiChu               NVARCHAR(MAX),
    isDelete             BIT,
    isActive             BIT,
    ngayTao              DATETIME,
    ngayCapNhat          DATETIME,
    FOREIGN KEY (maNguoiDung)       REFERENCES NguoiDung(maNguoiDung),
    FOREIGN KEY (maDiaDiemYeuThich) REFERENCES DiaDiem(maDiaDiem)
);

-- Chi tiết gói-vaccine trong đơn (để biết gói nào gồm những vaccine gì)
CREATE TABLE DonHangChiTiet (
    maDonHangChiTiet VARCHAR(100) PRIMARY KEY,
    maDonHang        VARCHAR(100) NOT NULL,
    maVaccine        VARCHAR(100) NOT NULL,
    soMuiChuan       INT NOT NULL,          -- số mũi theo gói
    donGiaMui        DECIMAL(12,2),         -- giá 1 mũi (trước KM)
    thanhTien        DECIMAL(12,2),         -- soMuiChuan * donGiaMui
    isDelete         BIT,
    isActive         BIT,
    ngayTao          DATETIME,
    ngayCapNhat      DATETIME,
    FOREIGN KEY (maDonHang) REFERENCES DonHang(maDonHang),
    FOREIGN KEY (maVaccine)  REFERENCES Vaccine(maVaccine)
);
-- Loại khuyến mãi (phân nhóm coupon)
CREATE TABLE LoaiKhuyenMai (
    maLoaiKhuyenMai VARCHAR(100) PRIMARY KEY,
    tenLoai         NVARCHAR(100),
    moTa            NVARCHAR(255),
    isDelete        BIT,
    isActive        BIT,
    ngayTao         DATETIME,
    ngayCapNhat     DATETIME
);

-- Coupon / chương trình giảm giá
CREATE TABLE KhuyenMai (
    maKhuyenMai     VARCHAR(100) PRIMARY KEY,
    maLoaiKhuyenMai VARCHAR(100),
    tenKhuyenMai    NVARCHAR(255),
    loaiGiam        NVARCHAR(20),      -- PERCENT | FIXED
    giaTriGiam      DECIMAL(12,2),
    giamToiDa       DECIMAL(12,2),     -- giới hạn khi giảm %
    dieuKienToiThieu DECIMAL(12,2),    -- đơn từ bao nhiêu mới áp dụng
    ngayBatDau      DATE,
    ngayKetThuc     DATE,
    soLuotDung      INT,               -- tổng số lượt dùng
    soLuotDaDung    INT DEFAULT 0,
    trangThai       NVARCHAR(20),      -- ACTIVE | INACTIVE | EXPIRED
    isDelete        BIT,
    isActive        BIT,
    ngayTao         DATETIME,
    ngayCapNhat     DATETIME,
    FOREIGN KEY (maLoaiKhuyenMai) REFERENCES LoaiKhuyenMai(maLoaiKhuyenMai)
);

-- Liên kết coupon với đơn hàng
CREATE TABLE DonHangKhuyenMai (
    maDonHangKhuyenMai VARCHAR(100) PRIMARY KEY,
    maDonHang          VARCHAR(100) NOT NULL,
    maKhuyenMai        VARCHAR(100) NOT NULL,
    giamGiaGoc         DECIMAL(12,2), -- số tiền giảm trước giới hạn
    giamGiaThucTe      DECIMAL(12,2), -- số tiền giảm sau giới hạn
    ngayApDung         DATETIME,
    isDelete           BIT,
    isActive           BIT,
    ngayTao            DATETIME,
    ngayCapNhat        DATETIME,
    FOREIGN KEY (maDonHang)   REFERENCES DonHang(maDonHang),
    FOREIGN KEY (maKhuyenMai) REFERENCES KhuyenMai(maKhuyenMai)
);
-- Lịch làm việc của bác sĩ
CREATE TABLE LichLamViec (
    maLichLamViec VARCHAR(100) PRIMARY KEY,
    maBacSi       VARCHAR(100) NOT NULL,
    maDiaDiem     VARCHAR(100) NOT NULL,
    ngayLam       DATE NOT NULL,
    gioBatDau     TIME NOT NULL,
    gioKetThuc    TIME NOT NULL,
    soLuongCho    INT NOT NULL,        -- slot tối đa
    daDat         INT DEFAULT 0,       -- slot đã đặt
    trangThai     NVARCHAR(20),        -- OPEN | FULL | CANCELLED
    isDelete      BIT,
    isActive      BIT,
    ngayTao       DATETIME,
    ngayCapNhat   DATETIME,
    FOREIGN KEY (maBacSi)  REFERENCES BacSi(maBacSi),
    FOREIGN KEY (maDiaDiem) REFERENCES DiaDiem(maDiaDiem)
);

-- Lịch hẹn tiêm của khách
CREATE TABLE LichHen (
    maLichHen          VARCHAR(100) PRIMARY KEY,
    maDonHang          VARCHAR(100) NOT NULL,
    maLichLamViec      VARCHAR(100) NOT NULL,
    maVaccine          VARCHAR(100) NOT NULL,
    muiThu             INT NOT NULL,
    ngayHen            DATETIME NOT NULL,
    trangThai          NVARCHAR(20),   -- SCHEDULED | COMPLETED | NO_SHOW | CANCELLED
    ghiChu             NVARCHAR(MAX),
    isDelete           BIT,
    isActive           BIT,
    ngayTao            DATETIME,
    ngayCapNhat        DATETIME,
    FOREIGN KEY (maDonHang)     REFERENCES DonHang(maDonHang),
    FOREIGN KEY (maLichLamViec) REFERENCES LichLamViec(maLichLamViec),
    FOREIGN KEY (maVaccine)     REFERENCES Vaccine(maVaccine)
);

-- Đổi lịch
CREATE TABLE YeuCauDoiLich (
    maYeuCau      VARCHAR(100) PRIMARY KEY,
    maLichHen     VARCHAR(100) NOT NULL,
    ngayHenMoi    DATETIME NOT NULL,
    lyDo          NVARCHAR(MAX),
    trangThai     NVARCHAR(20),   -- PENDING | APPROVED | REJECTED
    isDelete      BIT,
    isActive      BIT,
    ngayTao       DATETIME,
    ngayCapNhat   DATETIME,
    FOREIGN KEY (maLichHen) REFERENCES LichHen(maLichHen)
);

