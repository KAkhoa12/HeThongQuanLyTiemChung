using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DiaDiem",
                columns: table => new
                {
                    maDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    diaChi = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    soDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    moTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gioMoCua = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    sucChua = table.Column<int>(type: "int", nullable: true),
                    loaiDiaDiem = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DiaDiem__1C7F9DAF1C9956CF", x => x.maDiaDiem);
                });

            migrationBuilder.CreateTable(
                name: "LoaiDichVu",
                columns: table => new
                {
                    maLoaiDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    tenLoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LoaiDich__9A9DA689CEE5B89C", x => x.maLoaiDichVu);
                });

            migrationBuilder.CreateTable(
                name: "LoaiKhuyenMai",
                columns: table => new
                {
                    maLoaiKhuyenMai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    tenLoai = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    moTa = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LoaiKhuy__08E7B55315812EBE", x => x.maLoaiKhuyenMai);
                });

            migrationBuilder.CreateTable(
                name: "NhanAnh",
                columns: table => new
                {
                    maNhan = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    tenNhan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NhanAnh__83085ED087E4C8BC", x => x.maNhan);
                });

            migrationBuilder.CreateTable(
                name: "Quyen",
                columns: table => new
                {
                    maQuyen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    tenQuyen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    module = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Quyen__97001DA3065B48CB", x => x.maQuyen);
                });

            migrationBuilder.CreateTable(
                name: "Vaccine",
                columns: table => new
                {
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    nhaSanXuat = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    tuoiBatDauTiem = table.Column<int>(type: "int", nullable: true),
                    tuoiKetThucTiem = table.Column<int>(type: "int", nullable: true),
                    huongDanSuDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phongNgua = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Vaccine__C3084F9ECBF53FB9", x => x.maVaccine);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    maVaiTro = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    tenVaiTro = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VaiTro__BFC88AB70B5A0A5F", x => x.maVaiTro);
                });

            migrationBuilder.CreateTable(
                name: "PhieuThanhLy",
                columns: table => new
                {
                    maPhieuThanhLy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ngayThanhLy = table.Column<DateTime>(type: "datetime", nullable: true),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhieuTha__4DB6029553C3A6EE", x => x.maPhieuThanhLy);
                    table.ForeignKey(
                        name: "FK__PhieuThan__maDia__2DE6D218",
                        column: x => x.maDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                });

            migrationBuilder.CreateTable(
                name: "DichVu",
                columns: table => new
                {
                    maDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    moTa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    gia = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    maLoaiDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DichVu__80F48B0989ADE15A", x => x.maDichVu);
                    table.ForeignKey(
                        name: "FK__DichVu__maLoaiDi__03F0984C",
                        column: x => x.maLoaiDichVu,
                        principalTable: "LoaiDichVu",
                        principalColumn: "maLoaiDichVu");
                });

            migrationBuilder.CreateTable(
                name: "KhuyenMai",
                columns: table => new
                {
                    maKhuyenMai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maLoaiKhuyenMai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    tenKhuyenMai = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    loaiGiam = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    giaTriGiam = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    giamToiDa = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    dieuKienToiThieu = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    ngayBatDau = table.Column<DateOnly>(type: "date", nullable: true),
                    ngayKetThuc = table.Column<DateOnly>(type: "date", nullable: true),
                    soLuotDung = table.Column<int>(type: "int", nullable: true),
                    soLuotDaDung = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__KhuyenMa__87BEDDE9B125734B", x => x.maKhuyenMai);
                    table.ForeignKey(
                        name: "FK__KhuyenMai__maLoa__42E1EEFE",
                        column: x => x.maLoaiKhuyenMai,
                        principalTable: "LoaiKhuyenMai",
                        principalColumn: "maLoaiKhuyenMai");
                });

            migrationBuilder.CreateTable(
                name: "NguonAnh",
                columns: table => new
                {
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNhan = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    urlAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    altText = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    nguoiTai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguonAnh__184D7736282309AD", x => x.maAnh);
                    table.ForeignKey(
                        name: "FK__NguonAnh__maNhan__3E52440B",
                        column: x => x.maNhan,
                        principalTable: "NhanAnh",
                        principalColumn: "maNhan");
                });

            migrationBuilder.CreateTable(
                name: "LichTiemChuan",
                columns: table => new
                {
                    maLichTiemChuan = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    muiThu = table.Column<int>(type: "int", nullable: false),
                    tuoiThangToiThieu = table.Column<int>(type: "int", nullable: true),
                    tuoiThangToiDa = table.Column<int>(type: "int", nullable: true),
                    soNgaySauMuiTruoc = table.Column<int>(type: "int", nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LichTiem__6B09F439B057333C", x => x.maLichTiemChuan);
                    table.ForeignKey(
                        name: "FK__LichTiemC__maVac__00200768",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "VaiTroQuyen",
                columns: table => new
                {
                    maVaiTro = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maQuyen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__VaiTroQu__96B88B6D1839DB06", x => new { x.maVaiTro, x.maQuyen });
                    table.ForeignKey(
                        name: "FK__VaiTroQuy__maQuy__4BAC3F29",
                        column: x => x.maQuyen,
                        principalTable: "Quyen",
                        principalColumn: "maQuyen");
                    table.ForeignKey(
                        name: "FK__VaiTroQuy__maVai__4AB81AF0",
                        column: x => x.maVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "maVaiTro");
                });

            migrationBuilder.CreateTable(
                name: "DichVuVaccine",
                columns: table => new
                {
                    maDichVuVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    soMuiChuan = table.Column<int>(type: "int", nullable: false),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DichVuVa__EC4E1E7164275528", x => x.maDichVuVaccine);
                    table.ForeignKey(
                        name: "FK__DichVuVac__maDic__0E6E26BF",
                        column: x => x.maDichVu,
                        principalTable: "DichVu",
                        principalColumn: "maDichVu");
                    table.ForeignKey(
                        name: "FK__DichVuVac__maVac__0F624AF8",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "AnhDiaDiem",
                columns: table => new
                {
                    maAnhDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    laAnhChinh = table.Column<bool>(type: "bit", nullable: true),
                    thuTuHienThi = table.Column<int>(type: "int", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AnhDiaDi__11AFA013741D3687", x => x.maAnhDiaDiem);
                    table.ForeignKey(
                        name: "FK__AnhDiaDie__maAnh__66603565",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                    table.ForeignKey(
                        name: "FK__AnhDiaDie__maDia__656C112C",
                        column: x => x.maDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                });

            migrationBuilder.CreateTable(
                name: "AnhDichVu",
                columns: table => new
                {
                    maAnhDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    laAnhChinh = table.Column<bool>(type: "bit", nullable: true),
                    thuTuHienThi = table.Column<int>(type: "int", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AnhDichV__07C3CE77BFF61503", x => x.maAnhDichVu);
                    table.ForeignKey(
                        name: "FK__AnhDichVu__maAnh__07C12930",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                    table.ForeignKey(
                        name: "FK__AnhDichVu__maDic__06CD04F7",
                        column: x => x.maDichVu,
                        principalTable: "DichVu",
                        principalColumn: "maDichVu");
                });

            migrationBuilder.CreateTable(
                name: "AnhVaccine",
                columns: table => new
                {
                    maAnhVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    thuTuHienThi = table.Column<int>(type: "int", nullable: true),
                    laAnhChinh = table.Column<bool>(type: "bit", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AnhVacci__9BF0A5842EB0BEB6", x => x.maAnhVaccine);
                    table.ForeignKey(
                        name: "FK__AnhVaccin__maAnh__0B91BA14",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                    table.ForeignKey(
                        name: "FK__AnhVaccin__maVac__0A9D95DB",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaiTro = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    matKhau = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    soDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ngaySinh = table.Column<DateOnly>(type: "date", nullable: true),
                    diaChi = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__446439EA70F6DD99", x => x.maNguoiDung);
                    table.ForeignKey(
                        name: "FK__NguoiDung__maAnh__4E88ABD4",
                        column: x => x.maVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "maVaiTro");
                    table.ForeignKey(
                        name: "FK__NguoiDung__maAnh__4F7CD00D",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                });

            migrationBuilder.CreateTable(
                name: "NhaCungCap",
                columns: table => new
                {
                    maNhaCungCap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    nguoiLienHe = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    soDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    diaChi = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NhaCungC__D0B4D6DE9EA7702A", x => x.maNhaCungCap);
                    table.ForeignKey(
                        name: "FK__NhaCungCa__maAnh__151B244E",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                });

            migrationBuilder.CreateTable(
                name: "BacSi",
                columns: table => new
                {
                    maBacSi = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    chuyenMon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    soGiayPhep = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BacSi__F48AA2377FD9FA0E", x => x.maBacSi);
                    table.ForeignKey(
                        name: "FK__BacSi__maNguoiDu__5CD6CB2B",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "DonHang",
                columns: table => new
                {
                    maDonHang = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiemYeuThich = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ngayDat = table.Column<DateTime>(type: "datetime", nullable: true),
                    tongTienGoc = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    tongTienThanhToan = table.Column<decimal>(type: "decimal(12,2)", nullable: false),
                    trangThaiDon = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DonHang__871D381917A744E7", x => x.maDonHang);
                    table.ForeignKey(
                        name: "FK__DonHang__maDiaDi__395884C4",
                        column: x => x.maDiaDiemYeuThich,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                    table.ForeignKey(
                        name: "FK__DonHang__maNguoi__3864608B",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "NguoiDungQuyen",
                columns: table => new
                {
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maQuyen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__6D143830CA7CAD0C", x => new { x.maNguoiDung, x.maQuyen });
                    table.ForeignKey(
                        name: "FK__NguoiDung__maNgu__52593CB8",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                    table.ForeignKey(
                        name: "FK__NguoiDung__maQuy__534D60F1",
                        column: x => x.maQuyen,
                        principalTable: "Quyen",
                        principalColumn: "maQuyen");
                });

            migrationBuilder.CreateTable(
                name: "PhienDangNhap",
                columns: table => new
                {
                    maPhien = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    accessToken = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    refreshToken = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    thoiHan = table.Column<DateTime>(type: "datetime", nullable: false),
                    thoiHanRefresh = table.Column<DateTime>(type: "datetime", nullable: false),
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhienDan__49A5B118D2384D7A", x => x.maPhien);
                    table.ForeignKey(
                        name: "FK__PhienDang__maNgu__5629CD9C",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "QuanLy",
                columns: table => new
                {
                    maQuanLy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__QuanLy__449603AD29CA2479", x => x.maQuanLy);
                    table.ForeignKey(
                        name: "FK__QuanLy__maNguoiD__60A75C0F",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "ThongTinNguoiDung",
                columns: table => new
                {
                    maThongTin = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNguoiDung = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    chieuCao = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    canNang = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    bmi = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    nhomMau = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    benhNen = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diUng = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    thuocDangDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tinhTrangMangThai = table.Column<bool>(type: "bit", nullable: true),
                    ngayKhamGanNhat = table.Column<DateOnly>(type: "date", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ThongTin__63FCB54AD367D815", x => x.maThongTin);
                    table.ForeignKey(
                        name: "FK__ThongTinN__maNgu__59063A47",
                        column: x => x.maNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "AnhNhaCungCap",
                columns: table => new
                {
                    maAnhNhaCungCap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNhaCungCap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maAnh = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    thuTuHienThi = table.Column<int>(type: "int", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__AnhNhaCu__F4360067F9154EE9", x => x.maAnhNhaCungCap);
                    table.ForeignKey(
                        name: "FK__AnhNhaCun__maAnh__18EBB532",
                        column: x => x.maAnh,
                        principalTable: "NguonAnh",
                        principalColumn: "maAnh");
                    table.ForeignKey(
                        name: "FK__AnhNhaCun__maNha__17F790F9",
                        column: x => x.maNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "maNhaCungCap");
                });

            migrationBuilder.CreateTable(
                name: "LoVaccine",
                columns: table => new
                {
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNhaCungCap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    soLo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ngaySanXuat = table.Column<DateOnly>(type: "date", nullable: true),
                    ngayHetHan = table.Column<DateOnly>(type: "date", nullable: true),
                    soLuongNhap = table.Column<int>(type: "int", nullable: true),
                    soLuongHienTai = table.Column<int>(type: "int", nullable: true),
                    giaNhap = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LoVaccin__7A3EB73C86F7BDC2", x => x.maLo);
                    table.ForeignKey(
                        name: "FK__LoVaccine__maNha__1CBC4616",
                        column: x => x.maNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "maNhaCungCap");
                    table.ForeignKey(
                        name: "FK__LoVaccine__maVac__1BC821DD",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "LichLamViec",
                columns: table => new
                {
                    maLichLamViec = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maBacSi = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ngayLam = table.Column<DateOnly>(type: "date", nullable: false),
                    gioBatDau = table.Column<TimeOnly>(type: "time", nullable: false),
                    gioKetThuc = table.Column<TimeOnly>(type: "time", nullable: false),
                    soLuongCho = table.Column<int>(type: "int", nullable: false),
                    daDat = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LichLamV__7D0410EFF30DFC6B", x => x.maLichLamViec);
                    table.ForeignKey(
                        name: "FK__LichLamVi__maBac__4A8310C6",
                        column: x => x.maBacSi,
                        principalTable: "BacSi",
                        principalColumn: "maBacSi");
                    table.ForeignKey(
                        name: "FK__LichLamVi__maDia__4B7734FF",
                        column: x => x.maDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                });

            migrationBuilder.CreateTable(
                name: "PhieuDangKyLichTiem",
                columns: table => new
                {
                    maPhieuDangKy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maKhachHang = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDichVu = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maBacSi = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ngayDangKy = table.Column<DateTime>(type: "datetime", nullable: false),
                    ngayHenTiem = table.Column<DateTime>(type: "datetime", nullable: false),
                    gioHenTiem = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    lyDoTuChoi = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhieuDan__NewKey", x => x.maPhieuDangKy);
                    table.ForeignKey(
                        name: "FK__PhieuDan__maBac__NewConstraint3",
                        column: x => x.maBacSi,
                        principalTable: "BacSi",
                        principalColumn: "maBacSi");
                    table.ForeignKey(
                        name: "FK__PhieuDan__maDic__NewConstraint2",
                        column: x => x.maDichVu,
                        principalTable: "DichVu",
                        principalColumn: "maDichVu");
                    table.ForeignKey(
                        name: "FK__PhieuDan__maKha__NewConstraint1",
                        column: x => x.maKhachHang,
                        principalTable: "NguoiDung",
                        principalColumn: "maNguoiDung");
                });

            migrationBuilder.CreateTable(
                name: "DonHangChiTiet",
                columns: table => new
                {
                    maDonHangChiTiet = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDonHang = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    soMuiChuan = table.Column<int>(type: "int", nullable: false),
                    donGiaMui = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    thanhTien = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DonHangC__7212B475698B2C68", x => x.maDonHangChiTiet);
                    table.ForeignKey(
                        name: "FK__DonHangCh__maDon__3C34F16F",
                        column: x => x.maDonHang,
                        principalTable: "DonHang",
                        principalColumn: "maDonHang");
                    table.ForeignKey(
                        name: "FK__DonHangCh__maVac__3D2915A8",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "DonHangKhuyenMai",
                columns: table => new
                {
                    maDonHangKhuyenMai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDonHang = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maKhuyenMai = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    giamGiaGoc = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    giamGiaThucTe = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    ngayApDung = table.Column<DateTime>(type: "datetime", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DonHangK__67C32372730B7070", x => x.maDonHangKhuyenMai);
                    table.ForeignKey(
                        name: "FK__DonHangKh__maDon__45BE5BA9",
                        column: x => x.maDonHang,
                        principalTable: "DonHang",
                        principalColumn: "maDonHang");
                    table.ForeignKey(
                        name: "FK__DonHangKh__maKhu__46B27FE2",
                        column: x => x.maKhuyenMai,
                        principalTable: "KhuyenMai",
                        principalColumn: "maKhuyenMai");
                });

            migrationBuilder.CreateTable(
                name: "PhieuNhap",
                columns: table => new
                {
                    maPhieuNhap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maNhaCungCap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maQuanLy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ngayNhap = table.Column<DateTime>(type: "datetime", nullable: true),
                    tongTien = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhieuNha__E27639346EBA01D5", x => x.maPhieuNhap);
                    table.ForeignKey(
                        name: "FK__PhieuNhap__MaQua__NewConstraint4",
                        column: x => x.maQuanLy,
                        principalTable: "QuanLy",
                        principalColumn: "maQuanLy");
                    table.ForeignKey(
                        name: "FK__PhieuNhap__maNha__1F98B2C1",
                        column: x => x.maNhaCungCap,
                        principalTable: "NhaCungCap",
                        principalColumn: "maNhaCungCap");
                });

            migrationBuilder.CreateTable(
                name: "PhieuXuat",
                columns: table => new
                {
                    maPhieuXuat = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiemXuat = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maDiaDiemNhap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maQuanLy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    ngayXuat = table.Column<DateTime>(type: "datetime", nullable: true),
                    loaiXuat = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhieuXua__2A661240486A4DD4", x => x.maPhieuXuat);
                    table.ForeignKey(
                        name: "FK__PhieuXuat__MaQua__NewConstraint",
                        column: x => x.maQuanLy,
                        principalTable: "QuanLy",
                        principalColumn: "maQuanLy");
                    table.ForeignKey(
                        name: "FK__PhieuXuat__maDia__2645B050",
                        column: x => x.maDiaDiemXuat,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                    table.ForeignKey(
                        name: "FK__PhieuXuat__maDia__2739D489",
                        column: x => x.maDiaDiemNhap,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietThanhLy",
                columns: table => new
                {
                    maChiTiet = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maPhieuThanhLy = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    lyDo = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChiTietT__99964888EF363A6A", x => x.maChiTiet);
                    table.ForeignKey(
                        name: "FK__ChiTietTh__maPhi__30C33EC3",
                        column: x => x.maPhieuThanhLy,
                        principalTable: "PhieuThanhLy",
                        principalColumn: "maPhieuThanhLy");
                    table.ForeignKey(
                        name: "FK__ChiTietTha__maLo__31B762FC",
                        column: x => x.maLo,
                        principalTable: "LoVaccine",
                        principalColumn: "maLo");
                });

            migrationBuilder.CreateTable(
                name: "TonKhoLo",
                columns: table => new
                {
                    maTonKho = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDiaDiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TonKhoLo__C3E0BF615ACA4846", x => x.maTonKho);
                    table.ForeignKey(
                        name: "FK__TonKhoLo__maDiaD__3493CFA7",
                        column: x => x.maDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "maDiaDiem");
                    table.ForeignKey(
                        name: "FK__TonKhoLo__maLo__3587F3E0",
                        column: x => x.maLo,
                        principalTable: "LoVaccine",
                        principalColumn: "maLo");
                });

            migrationBuilder.CreateTable(
                name: "LichHen",
                columns: table => new
                {
                    maLichHen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maDonHang = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maLichLamViec = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    muiThu = table.Column<int>(type: "int", nullable: false),
                    ngayHen = table.Column<DateTime>(type: "datetime", nullable: false),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ghiChu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LichHen__FBFE3223EFA716D4", x => x.maLichHen);
                    table.ForeignKey(
                        name: "FK__LichHen__maDonHa__503BEA1C",
                        column: x => x.maDonHang,
                        principalTable: "DonHang",
                        principalColumn: "maDonHang");
                    table.ForeignKey(
                        name: "FK__LichHen__maLichL__51300E55",
                        column: x => x.maLichLamViec,
                        principalTable: "LichLamViec",
                        principalColumn: "maLichLamViec");
                    table.ForeignKey(
                        name: "FK__LichHen__maVacci__5224328E",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietNhap",
                columns: table => new
                {
                    maChiTiet = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maPhieuNhap = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    gia = table.Column<decimal>(type: "decimal(12,2)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChiTietN__99964888BEA3827A", x => x.maChiTiet);
                    table.ForeignKey(
                        name: "FK__ChiTietNh__maPhi__22751F6C",
                        column: x => x.maPhieuNhap,
                        principalTable: "PhieuNhap",
                        principalColumn: "maPhieuNhap");
                    table.ForeignKey(
                        name: "FK__ChiTietNha__maLo__236943A5",
                        column: x => x.maLo,
                        principalTable: "LoVaccine",
                        principalColumn: "maLo");
                });

            migrationBuilder.CreateTable(
                name: "ChiTietXuat",
                columns: table => new
                {
                    maChiTiet = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maPhieuXuat = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    soLuong = table.Column<int>(type: "int", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ChiTietX__99964888FAFBED70", x => x.maChiTiet);
                    table.ForeignKey(
                        name: "FK__ChiTietXu__maPhi__2A164134",
                        column: x => x.maPhieuXuat,
                        principalTable: "PhieuXuat",
                        principalColumn: "maPhieuXuat");
                    table.ForeignKey(
                        name: "FK__ChiTietXua__maLo__2B0A656D",
                        column: x => x.maLo,
                        principalTable: "LoVaccine",
                        principalColumn: "maLo");
                });

            migrationBuilder.CreateTable(
                name: "PhieuTiem",
                columns: table => new
                {
                    maPhieuTiem = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maLichHen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maVaccine = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maLo = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    muiThuThucTe = table.Column<int>(type: "int", nullable: true),
                    ngayTiem = table.Column<DateTime>(type: "datetime", nullable: true),
                    maBacSi = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    phanUng = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    moTaPhanUng = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PhieuTie__4BEEAEF35F4FAF1E", x => x.maPhieuTiem);
                    table.ForeignKey(
                        name: "FK__PhieuTiem__maBac__5AB9788F",
                        column: x => x.maBacSi,
                        principalTable: "BacSi",
                        principalColumn: "maBacSi");
                    table.ForeignKey(
                        name: "FK__PhieuTiem__maLic__57DD0BE4",
                        column: x => x.maLichHen,
                        principalTable: "LichHen",
                        principalColumn: "maLichHen");
                    table.ForeignKey(
                        name: "FK__PhieuTiem__maLo__59C55456",
                        column: x => x.maLo,
                        principalTable: "LoVaccine",
                        principalColumn: "maLo");
                    table.ForeignKey(
                        name: "FK__PhieuTiem__maVac__58D1301D",
                        column: x => x.maVaccine,
                        principalTable: "Vaccine",
                        principalColumn: "maVaccine");
                });

            migrationBuilder.CreateTable(
                name: "YeuCauDoiLich",
                columns: table => new
                {
                    maYeuCau = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    maLichHen = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    ngayHenMoi = table.Column<DateTime>(type: "datetime", nullable: false),
                    lyDo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    trangThai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    isDelete = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: true),
                    ngayTao = table.Column<DateTime>(type: "datetime", nullable: true),
                    ngayCapNhat = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__YeuCauDo__765F6DD63B02AAE0", x => x.maYeuCau);
                    table.ForeignKey(
                        name: "FK__YeuCauDoi__maLic__55009F39",
                        column: x => x.maLichHen,
                        principalTable: "LichHen",
                        principalColumn: "maLichHen");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnhDiaDiem_maAnh",
                table: "AnhDiaDiem",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_AnhDiaDiem_maDiaDiem",
                table: "AnhDiaDiem",
                column: "maDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_AnhDichVu_maAnh",
                table: "AnhDichVu",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_AnhDichVu_maDichVu",
                table: "AnhDichVu",
                column: "maDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_AnhNhaCungCap_maAnh",
                table: "AnhNhaCungCap",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_AnhNhaCungCap_maNhaCungCap",
                table: "AnhNhaCungCap",
                column: "maNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_AnhVaccine_maAnh",
                table: "AnhVaccine",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_AnhVaccine_maVaccine",
                table: "AnhVaccine",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "UQ__BacSi__446439EBDE1365ED",
                table: "BacSi",
                column: "maNguoiDung",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietNhap_maLo",
                table: "ChiTietNhap",
                column: "maLo");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietNhap_maPhieuNhap",
                table: "ChiTietNhap",
                column: "maPhieuNhap");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietThanhLy_maLo",
                table: "ChiTietThanhLy",
                column: "maLo");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietThanhLy_maPhieuThanhLy",
                table: "ChiTietThanhLy",
                column: "maPhieuThanhLy");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietXuat_maLo",
                table: "ChiTietXuat",
                column: "maLo");

            migrationBuilder.CreateIndex(
                name: "IX_ChiTietXuat_maPhieuXuat",
                table: "ChiTietXuat",
                column: "maPhieuXuat");

            migrationBuilder.CreateIndex(
                name: "IX_DichVu_maLoaiDichVu",
                table: "DichVu",
                column: "maLoaiDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_DichVuVaccine_maDichVu",
                table: "DichVuVaccine",
                column: "maDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_DichVuVaccine_maVaccine",
                table: "DichVuVaccine",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_maDiaDiemYeuThich",
                table: "DonHang",
                column: "maDiaDiemYeuThich");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_maNguoiDung",
                table: "DonHang",
                column: "maNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangChiTiet_maDonHang",
                table: "DonHangChiTiet",
                column: "maDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangChiTiet_maVaccine",
                table: "DonHangChiTiet",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangKhuyenMai_maDonHang",
                table: "DonHangKhuyenMai",
                column: "maDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangKhuyenMai_maKhuyenMai",
                table: "DonHangKhuyenMai",
                column: "maKhuyenMai");

            migrationBuilder.CreateIndex(
                name: "IX_KhuyenMai_maLoaiKhuyenMai",
                table: "KhuyenMai",
                column: "maLoaiKhuyenMai");

            migrationBuilder.CreateIndex(
                name: "IX_LichHen_maDonHang",
                table: "LichHen",
                column: "maDonHang");

            migrationBuilder.CreateIndex(
                name: "IX_LichHen_maLichLamViec",
                table: "LichHen",
                column: "maLichLamViec");

            migrationBuilder.CreateIndex(
                name: "IX_LichHen_maVaccine",
                table: "LichHen",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_LichLamViec_maBacSi",
                table: "LichLamViec",
                column: "maBacSi");

            migrationBuilder.CreateIndex(
                name: "IX_LichLamViec_maDiaDiem",
                table: "LichLamViec",
                column: "maDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_LichTiemChuan_maVaccine",
                table: "LichTiemChuan",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_LoVaccine_maNhaCungCap",
                table: "LoVaccine",
                column: "maNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_LoVaccine_maVaccine",
                table: "LoVaccine",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_maAnh",
                table: "NguoiDung",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_maVaiTro",
                table: "NguoiDung",
                column: "maVaiTro");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDungQuyen_maQuyen",
                table: "NguoiDungQuyen",
                column: "maQuyen");

            migrationBuilder.CreateIndex(
                name: "IX_NguonAnh_maNhan",
                table: "NguonAnh",
                column: "maNhan");

            migrationBuilder.CreateIndex(
                name: "IX_NhaCungCap_maAnh",
                table: "NhaCungCap",
                column: "maAnh");

            migrationBuilder.CreateIndex(
                name: "IX_PhienDangNhap_maNguoiDung",
                table: "PhienDangNhap",
                column: "maNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDangKyLichTiem_maBacSi",
                table: "PhieuDangKyLichTiem",
                column: "maBacSi");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDangKyLichTiem_maDichVu",
                table: "PhieuDangKyLichTiem",
                column: "maDichVu");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuDangKyLichTiem_maKhachHang",
                table: "PhieuDangKyLichTiem",
                column: "maKhachHang");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhap_maNhaCungCap",
                table: "PhieuNhap",
                column: "maNhaCungCap");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuNhap_maQuanLy",
                table: "PhieuNhap",
                column: "maQuanLy");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuThanhLy_maDiaDiem",
                table: "PhieuThanhLy",
                column: "maDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTiem_maBacSi",
                table: "PhieuTiem",
                column: "maBacSi");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTiem_maLichHen",
                table: "PhieuTiem",
                column: "maLichHen");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTiem_maLo",
                table: "PhieuTiem",
                column: "maLo");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuTiem_maVaccine",
                table: "PhieuTiem",
                column: "maVaccine");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuat_maDiaDiemNhap",
                table: "PhieuXuat",
                column: "maDiaDiemNhap");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuat_maDiaDiemXuat",
                table: "PhieuXuat",
                column: "maDiaDiemXuat");

            migrationBuilder.CreateIndex(
                name: "IX_PhieuXuat_maQuanLy",
                table: "PhieuXuat",
                column: "maQuanLy");

            migrationBuilder.CreateIndex(
                name: "UQ__QuanLy__446439EB297BE629",
                table: "QuanLy",
                column: "maNguoiDung",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ThongTinNguoiDung_maNguoiDung",
                table: "ThongTinNguoiDung",
                column: "maNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_TonKhoLo_maDiaDiem",
                table: "TonKhoLo",
                column: "maDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_TonKhoLo_maLo",
                table: "TonKhoLo",
                column: "maLo");

            migrationBuilder.CreateIndex(
                name: "IX_VaiTroQuyen_maQuyen",
                table: "VaiTroQuyen",
                column: "maQuyen");

            migrationBuilder.CreateIndex(
                name: "IX_YeuCauDoiLich_maLichHen",
                table: "YeuCauDoiLich",
                column: "maLichHen");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnhDiaDiem");

            migrationBuilder.DropTable(
                name: "AnhDichVu");

            migrationBuilder.DropTable(
                name: "AnhNhaCungCap");

            migrationBuilder.DropTable(
                name: "AnhVaccine");

            migrationBuilder.DropTable(
                name: "ChiTietNhap");

            migrationBuilder.DropTable(
                name: "ChiTietThanhLy");

            migrationBuilder.DropTable(
                name: "ChiTietXuat");

            migrationBuilder.DropTable(
                name: "DichVuVaccine");

            migrationBuilder.DropTable(
                name: "DonHangChiTiet");

            migrationBuilder.DropTable(
                name: "DonHangKhuyenMai");

            migrationBuilder.DropTable(
                name: "LichTiemChuan");

            migrationBuilder.DropTable(
                name: "NguoiDungQuyen");

            migrationBuilder.DropTable(
                name: "PhienDangNhap");

            migrationBuilder.DropTable(
                name: "PhieuDangKyLichTiem");

            migrationBuilder.DropTable(
                name: "PhieuTiem");

            migrationBuilder.DropTable(
                name: "ThongTinNguoiDung");

            migrationBuilder.DropTable(
                name: "TonKhoLo");

            migrationBuilder.DropTable(
                name: "VaiTroQuyen");

            migrationBuilder.DropTable(
                name: "YeuCauDoiLich");

            migrationBuilder.DropTable(
                name: "PhieuNhap");

            migrationBuilder.DropTable(
                name: "PhieuThanhLy");

            migrationBuilder.DropTable(
                name: "PhieuXuat");

            migrationBuilder.DropTable(
                name: "KhuyenMai");

            migrationBuilder.DropTable(
                name: "DichVu");

            migrationBuilder.DropTable(
                name: "LoVaccine");

            migrationBuilder.DropTable(
                name: "Quyen");

            migrationBuilder.DropTable(
                name: "LichHen");

            migrationBuilder.DropTable(
                name: "QuanLy");

            migrationBuilder.DropTable(
                name: "LoaiKhuyenMai");

            migrationBuilder.DropTable(
                name: "LoaiDichVu");

            migrationBuilder.DropTable(
                name: "NhaCungCap");

            migrationBuilder.DropTable(
                name: "DonHang");

            migrationBuilder.DropTable(
                name: "LichLamViec");

            migrationBuilder.DropTable(
                name: "Vaccine");

            migrationBuilder.DropTable(
                name: "BacSi");

            migrationBuilder.DropTable(
                name: "DiaDiem");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "VaiTro");

            migrationBuilder.DropTable(
                name: "NguonAnh");

            migrationBuilder.DropTable(
                name: "NhanAnh");
        }
    }
}
