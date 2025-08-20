using server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

builder.Services.AddSession(options => 
{ 
    options.IdleTimeout = TimeSpan.FromHours(2); 
    options.Cookie.HttpOnly = true; 
    options.Cookie.IsEssential = true; 
});

builder.Services.AddDbContext<HeThongQuanLyTiemChungContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection")));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = config["Jwt:Issuer"],
        ValidAudience = config["Jwt:Audience"],
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
    };
});
builder.Services.AddControllers();
builder.Services.AddAuthorization(options =>
{
    // Policy cho AnhDiaDiem
    options.AddPolicy("AnhDiaDiemCreate", p => p.RequireClaim("Permission", "AnhDiaDiem_CREATE"));
    options.AddPolicy("AnhDiaDiemRead", p => p.RequireClaim("Permission", "AnhDiaDiem_READ"));
    options.AddPolicy("AnhDiaDiemUpdate", p => p.RequireClaim("Permission", "AnhDiaDiem_UPDATE"));
    options.AddPolicy("AnhDiaDiemDelete", p => p.RequireClaim("Permission", "AnhDiaDiem_DELETE"));

    // Policy cho AnhDichVu
    options.AddPolicy("AnhDichVuCreate", p => p.RequireClaim("Permission", "AnhDichVu_CREATE"));
    options.AddPolicy("AnhDichVuRead", p => p.RequireClaim("Permission", "AnhDichVu_READ"));
    options.AddPolicy("AnhDichVuUpdate", p => p.RequireClaim("Permission", "AnhDichVu_UPDATE"));
    options.AddPolicy("AnhDichVuDelete", p => p.RequireClaim("Permission", "AnhDichVu_DELETE"));

    // Policy cho AnhNhaCungCap
    options.AddPolicy("AnhNhaCungCapCreate", p => p.RequireClaim("Permission", "AnhNhaCungCap_CREATE"));
    options.AddPolicy("AnhNhaCungCapRead", p => p.RequireClaim("Permission", "AnhNhaCungCap_READ"));
    options.AddPolicy("AnhNhaCungCapUpdate", p => p.RequireClaim("Permission", "AnhNhaCungCap_UPDATE"));
    options.AddPolicy("AnhNhaCungCapDelete", p => p.RequireClaim("Permission", "AnhNhaCungCap_DELETE"));

    // Policy cho AnhVaccine
    options.AddPolicy("AnhVaccineCreate", p => p.RequireClaim("Permission", "AnhVaccine_CREATE"));
    options.AddPolicy("AnhVaccineRead", p => p.RequireClaim("Permission", "AnhVaccine_READ"));
    options.AddPolicy("AnhVaccineUpdate", p => p.RequireClaim("Permission", "AnhVaccine_UPDATE"));
    options.AddPolicy("AnhVaccineDelete", p => p.RequireClaim("Permission", "AnhVaccine_DELETE"));

    // Policy cho BacSi
    options.AddPolicy("BacSiCreate", p => p.RequireClaim("Permission", "BacSi_CREATE"));
    options.AddPolicy("BacSiRead", p => p.RequireClaim("Permission", "BacSi_READ"));
    options.AddPolicy("BacSiUpdate", p => p.RequireClaim("Permission", "BacSi_UPDATE"));
    options.AddPolicy("BacSiDelete", p => p.RequireClaim("Permission", "BacSi_DELETE"));

    // Policy cho ChiTietNhap
    options.AddPolicy("ChiTietNhapCreate", p => p.RequireClaim("Permission", "ChiTietNhap_CREATE"));
    options.AddPolicy("ChiTietNhapRead", p => p.RequireClaim("Permission", "ChiTietNhap_READ"));
    options.AddPolicy("ChiTietNhapUpdate", p => p.RequireClaim("Permission", "ChiTietNhap_UPDATE"));
    options.AddPolicy("ChiTietNhapDelete", p => p.RequireClaim("Permission", "ChiTietNhap_DELETE"));

    // Policy cho ChiTietThanhLy
    options.AddPolicy("ChiTietThanhLyCreate", p => p.RequireClaim("Permission", "ChiTietThanhLy_CREATE"));
    options.AddPolicy("ChiTietThanhLyRead", p => p.RequireClaim("Permission", "ChiTietThanhLy_READ"));
    options.AddPolicy("ChiTietThanhLyUpdate", p => p.RequireClaim("Permission", "ChiTietThanhLy_UPDATE"));
    options.AddPolicy("ChiTietThanhLyDelete", p => p.RequireClaim("Permission", "ChiTietThanhLy_DELETE"));

    // Policy cho ChiTietXuat
    options.AddPolicy("ChiTietXuatCreate", p => p.RequireClaim("Permission", "ChiTietXuat_CREATE"));
    options.AddPolicy("ChiTietXuatRead", p => p.RequireClaim("Permission", "ChiTietXuat_READ"));
    options.AddPolicy("ChiTietXuatUpdate", p => p.RequireClaim("Permission", "ChiTietXuat_UPDATE"));
    options.AddPolicy("ChiTietXuatDelete", p => p.RequireClaim("Permission", "ChiTietXuat_DELETE"));

    // Policy cho DiaDiem
    options.AddPolicy("DiaDiemCreate", p => p.RequireClaim("Permission", "DiaDiem_CREATE"));
    options.AddPolicy("DiaDiemRead", p => p.RequireClaim("Permission", "DiaDiem_READ"));
    options.AddPolicy("DiaDiemUpdate", p => p.RequireClaim("Permission", "DiaDiem_UPDATE"));
    options.AddPolicy("DiaDiemDelete", p => p.RequireClaim("Permission", "DiaDiem_DELETE"));

    // Policy cho DichVu
    options.AddPolicy("DichVuCreate", p => p.RequireClaim("Permission", "DichVu_CREATE"));
    options.AddPolicy("DichVuRead", p => p.RequireClaim("Permission", "DichVu_READ"));
    options.AddPolicy("DichVuUpdate", p => p.RequireClaim("Permission", "DichVu_UPDATE"));
    options.AddPolicy("DichVuDelete", p => p.RequireClaim("Permission", "DichVu_DELETE"));

    // Policy cho DichVuVaccine
    options.AddPolicy("DichVuVaccineCreate", p => p.RequireClaim("Permission", "DichVuVaccine_CREATE"));
    options.AddPolicy("DichVuVaccineRead", p => p.RequireClaim("Permission", "DichVuVaccine_READ"));
    options.AddPolicy("DichVuVaccineUpdate", p => p.RequireClaim("Permission", "DichVuVaccine_UPDATE"));
    options.AddPolicy("DichVuVaccineDelete", p => p.RequireClaim("Permission", "DichVuVaccine_DELETE"));

    // Policy cho DonHang
    options.AddPolicy("DonHangCreate", p => p.RequireClaim("Permission", "DonHang_CREATE"));
    options.AddPolicy("DonHangRead", p => p.RequireClaim("Permission", "DonHang_READ"));
    options.AddPolicy("DonHangUpdate", p => p.RequireClaim("Permission", "DonHang_UPDATE"));
    options.AddPolicy("DonHangDelete", p => p.RequireClaim("Permission", "DonHang_DELETE"));

    // Policy cho DonHangChiTiet
    options.AddPolicy("DonHangChiTietCreate", p => p.RequireClaim("Permission", "DonHangChiTiet_CREATE"));
    options.AddPolicy("DonHangChiTietRead", p => p.RequireClaim("Permission", "DonHangChiTiet_READ"));
    options.AddPolicy("DonHangChiTietUpdate", p => p.RequireClaim("Permission", "DonHangChiTiet_UPDATE"));
    options.AddPolicy("DonHangChiTietDelete", p => p.RequireClaim("Permission", "DonHangChiTiet_DELETE"));

    // Policy cho DonHangKhuyenMai
    options.AddPolicy("DonHangKhuyenMaiCreate", p => p.RequireClaim("Permission", "DonHangKhuyenMai_CREATE"));
    options.AddPolicy("DonHangKhuyenMaiRead", p => p.RequireClaim("Permission", "DonHangKhuyenMai_READ"));
    options.AddPolicy("DonHangKhuyenMaiUpdate", p => p.RequireClaim("Permission", "DonHangKhuyenMai_UPDATE"));
    options.AddPolicy("DonHangKhuyenMaiDelete", p => p.RequireClaim("Permission", "DonHangKhuyenMai_DELETE"));

    // Policy cho KhuyenMai
    options.AddPolicy("KhuyenMaiCreate", p => p.RequireClaim("Permission", "KhuyenMai_CREATE"));
    options.AddPolicy("KhuyenMaiRead", p => p.RequireClaim("Permission", "KhuyenMai_READ"));
    options.AddPolicy("KhuyenMaiUpdate", p => p.RequireClaim("Permission", "KhuyenMai_UPDATE"));
    options.AddPolicy("KhuyenMaiDelete", p => p.RequireClaim("Permission", "KhuyenMai_DELETE"));

    // Policy cho LichHen
    options.AddPolicy("LichHenCreate", p => p.RequireClaim("Permission", "LichHen_CREATE"));
    options.AddPolicy("LichHenRead", p => p.RequireClaim("Permission", "LichHen_READ"));
    options.AddPolicy("LichHenUpdate", p => p.RequireClaim("Permission", "LichHen_UPDATE"));
    options.AddPolicy("LichHenDelete", p => p.RequireClaim("Permission", "LichHen_DELETE"));

    // Policy cho LichLamViec
    options.AddPolicy("LichLamViecCreate", p => p.RequireClaim("Permission", "LichLamViec_CREATE"));
    options.AddPolicy("LichLamViecRead", p => p.RequireClaim("Permission", "LichLamViec_READ"));
    options.AddPolicy("LichLamViecUpdate", p => p.RequireClaim("Permission", "LichLamViec_UPDATE"));
    options.AddPolicy("LichLamViecDelete", p => p.RequireClaim("Permission", "LichLamViec_DELETE"));

    // Policy cho LichTiemChuan
    options.AddPolicy("LichTiemChuanCreate", p => p.RequireClaim("Permission", "LichTiemChuan_CREATE"));
    options.AddPolicy("LichTiemChuanRead", p => p.RequireClaim("Permission", "LichTiemChuan_READ"));
    options.AddPolicy("LichTiemChuanUpdate", p => p.RequireClaim("Permission", "LichTiemChuan_UPDATE"));
    options.AddPolicy("LichTiemChuanDelete", p => p.RequireClaim("Permission", "LichTiemChuan_DELETE"));

    // Policy cho LoVaccine
    options.AddPolicy("LoVaccineCreate", p => p.RequireClaim("Permission", "LoVaccine_CREATE"));
    options.AddPolicy("LoVaccineRead", p => p.RequireClaim("Permission", "LoVaccine_READ"));
    options.AddPolicy("LoVaccineUpdate", p => p.RequireClaim("Permission", "LoVaccine_UPDATE"));
    options.AddPolicy("LoVaccineDelete", p => p.RequireClaim("Permission", "LoVaccine_DELETE"));

    // Policy cho LoaiDichVu
    options.AddPolicy("LoaiDichVuCreate", p => p.RequireClaim("Permission", "LoaiDichVu_CREATE"));
    options.AddPolicy("LoaiDichVuRead", p => p.RequireClaim("Permission", "LoaiDichVu_READ"));
    options.AddPolicy("LoaiDichVuUpdate", p => p.RequireClaim("Permission", "LoaiDichVu_UPDATE"));
    options.AddPolicy("LoaiDichVuDelete", p => p.RequireClaim("Permission", "LoaiDichVu_DELETE"));

    // Policy cho LoaiKhuyenMai
    options.AddPolicy("LoaiKhuyenMaiCreate", p => p.RequireClaim("Permission", "LoaiKhuyenMai_CREATE"));
    options.AddPolicy("LoaiKhuyenMaiRead", p => p.RequireClaim("Permission", "LoaiKhuyenMai_READ"));
    options.AddPolicy("LoaiKhuyenMaiUpdate", p => p.RequireClaim("Permission", "LoaiKhuyenMai_UPDATE"));
    options.AddPolicy("LoaiKhuyenMaiDelete", p => p.RequireClaim("Permission", "LoaiKhuyenMai_DELETE"));

    // Policy cho NguoiDung
    options.AddPolicy("NguoiDungCreate", p => p.RequireClaim("Permission", "NguoiDung_CREATE"));
    options.AddPolicy("NguoiDungRead", p => p.RequireClaim("Permission", "NguoiDung_READ"));
    options.AddPolicy("NguoiDungUpdate", p => p.RequireClaim("Permission", "NguoiDung_UPDATE"));
    options.AddPolicy("NguoiDungDelete", p => p.RequireClaim("Permission", "NguoiDung_DELETE"));

    // Policy cho NguoiDungQuyen
    options.AddPolicy("NguoiDungQuyenCreate", p => p.RequireClaim("Permission", "NguoiDungQuyen_CREATE"));
    options.AddPolicy("NguoiDungQuyenRead", p => p.RequireClaim("Permission", "NguoiDungQuyen_READ"));
    options.AddPolicy("NguoiDungQuyenUpdate", p => p.RequireClaim("Permission", "NguoiDungQuyen_UPDATE"));
    options.AddPolicy("NguoiDungQuyenDelete", p => p.RequireClaim("Permission", "NguoiDungQuyen_DELETE"));

    // Policy cho NguonAnh
    options.AddPolicy("NguonAnhCreate", p => p.RequireClaim("Permission", "NguonAnh_CREATE"));
    options.AddPolicy("NguonAnhRead", p => p.RequireClaim("Permission", "NguonAnh_READ"));
    options.AddPolicy("NguonAnhUpdate", p => p.RequireClaim("Permission", "NguonAnh_UPDATE"));
    options.AddPolicy("NguonAnhDelete", p => p.RequireClaim("Permission", "NguonAnh_DELETE"));

    // Policy cho NhaCungCap
    options.AddPolicy("NhaCungCapCreate", p => p.RequireClaim("Permission", "NhaCungCap_CREATE"));
    options.AddPolicy("NhaCungCapRead", p => p.RequireClaim("Permission", "NhaCungCap_READ"));
    options.AddPolicy("NhaCungCapUpdate", p => p.RequireClaim("Permission", "NhaCungCap_UPDATE"));
    options.AddPolicy("NhaCungCapDelete", p => p.RequireClaim("Permission", "NhaCungCap_DELETE"));

    // Policy cho NhanAnh
    options.AddPolicy("NhanAnhCreate", p => p.RequireClaim("Permission", "NhanAnh_CREATE"));
    options.AddPolicy("NhanAnhRead", p => p.RequireClaim("Permission", "NhanAnh_READ"));
    options.AddPolicy("NhanAnhUpdate", p => p.RequireClaim("Permission", "NhanAnh_UPDATE"));
    options.AddPolicy("NhanAnhDelete", p => p.RequireClaim("Permission", "NhanAnh_DELETE"));

    // Policy cho PhieuNhap
    options.AddPolicy("PhieuNhapCreate", p => p.RequireClaim("Permission", "PhieuNhap_CREATE"));
    options.AddPolicy("PhieuNhapRead", p => p.RequireClaim("Permission", "PhieuNhap_READ"));
    options.AddPolicy("PhieuNhapUpdate", p => p.RequireClaim("Permission", "PhieuNhap_UPDATE"));
    options.AddPolicy("PhieuNhapDelete", p => p.RequireClaim("Permission", "PhieuNhap_DELETE"));

    // Policy cho PhieuThanhLy
    options.AddPolicy("PhieuThanhLyCreate", p => p.RequireClaim("Permission", "PhieuThanhLy_CREATE"));
    options.AddPolicy("PhieuThanhLyRead", p => p.RequireClaim("Permission", "PhieuThanhLy_READ"));
    options.AddPolicy("PhieuThanhLyUpdate", p => p.RequireClaim("Permission", "PhieuThanhLy_UPDATE"));
    options.AddPolicy("PhieuThanhLyDelete", p => p.RequireClaim("Permission", "PhieuThanhLy_DELETE"));

    // Policy cho PhieuTiem
    options.AddPolicy("PhieuTiemCreate", p => p.RequireClaim("Permission", "PhieuTiem_CREATE"));
    options.AddPolicy("PhieuTiemRead", p => p.RequireClaim("Permission", "PhieuTiem_READ"));
    options.AddPolicy("PhieuTiemUpdate", p => p.RequireClaim("Permission", "PhieuTiem_UPDATE"));
    options.AddPolicy("PhieuTiemDelete", p => p.RequireClaim("Permission", "PhieuTiem_DELETE"));

    // Policy cho PhieuXuat
    options.AddPolicy("PhieuXuatCreate", p => p.RequireClaim("Permission", "PhieuXuat_CREATE"));
    options.AddPolicy("PhieuXuatRead", p => p.RequireClaim("Permission", "PhieuXuat_READ"));
    options.AddPolicy("PhieuXuatUpdate", p => p.RequireClaim("Permission", "PhieuXuat_UPDATE"));
    options.AddPolicy("PhieuXuatDelete", p => p.RequireClaim("Permission", "PhieuXuat_DELETE"));

    // Policy cho QuanLy
    options.AddPolicy("QuanLyCreate", p => p.RequireClaim("Permission", "QuanLy_CREATE"));
    options.AddPolicy("QuanLyRead", p => p.RequireClaim("Permission", "QuanLy_READ"));
    options.AddPolicy("QuanLyUpdate", p => p.RequireClaim("Permission", "QuanLy_UPDATE"));
    options.AddPolicy("QuanLyDelete", p => p.RequireClaim("Permission", "QuanLy_DELETE"));

    // Policy cho Quyen
    options.AddPolicy("QuyenCreate", p => p.RequireClaim("Permission", "Quyen_CREATE"));
    options.AddPolicy("QuyenRead", p => p.RequireClaim("Permission", "Quyen_READ"));
    options.AddPolicy("QuyenUpdate", p => p.RequireClaim("Permission", "Quyen_UPDATE"));
    options.AddPolicy("QuyenDelete", p => p.RequireClaim("Permission", "Quyen_DELETE"));

    // Policy cho ThongTinNguoiDung
    options.AddPolicy("ThongTinNguoiDungCreate", p => p.RequireClaim("Permission", "ThongTinNguoiDung_CREATE"));
    options.AddPolicy("ThongTinNguoiDungRead", p => p.RequireClaim("Permission", "ThongTinNguoiDung_READ"));
    options.AddPolicy("ThongTinNguoiDungUpdate", p => p.RequireClaim("Permission", "ThongTinNguoiDung_UPDATE"));
    options.AddPolicy("ThongTinNguoiDungDelete", p => p.RequireClaim("Permission", "ThongTinNguoiDung_DELETE"));

    // Policy cho TonKhoLo
    options.AddPolicy("TonKhoLoCreate", p => p.RequireClaim("Permission", "TonKhoLo_CREATE"));
    options.AddPolicy("TonKhoLoRead", p => p.RequireClaim("Permission", "TonKhoLo_READ"));
    options.AddPolicy("TonKhoLoUpdate", p => p.RequireClaim("Permission", "TonKhoLo_UPDATE"));
    options.AddPolicy("TonKhoLoDelete", p => p.RequireClaim("Permission", "TonKhoLo_DELETE"));

    // Policy cho Vaccine
    options.AddPolicy("VaccineCreate", p => p.RequireClaim("Permission", "Vaccine_CREATE"));
    options.AddPolicy("VaccineRead", p => p.RequireClaim("Permission", "Vaccine_READ"));
    options.AddPolicy("VaccineUpdate", p => p.RequireClaim("Permission", "Vaccine_UPDATE"));
    options.AddPolicy("VaccineDelete", p => p.RequireClaim("Permission", "Vaccine_DELETE"));


    // Policy cho VaiTroQuyen
    options.AddPolicy("VaiTroQuyenCreate", p => p.RequireClaim("Permission", "VaiTroQuyen_CREATE"));
    options.AddPolicy("VaiTroQuyenRead", p => p.RequireClaim("Permission", "VaiTroQuyen_READ"));
    options.AddPolicy("VaiTroQuyenUpdate", p => p.RequireClaim("Permission", "VaiTroQuyen_UPDATE"));
    options.AddPolicy("VaiTroQuyenDelete", p => p.RequireClaim("Permission", "VaiTroQuyen_DELETE"));

    // Policy cho YeuCauDoiLich
    options.AddPolicy("YeuCauDoiLichCreate", p => p.RequireClaim("Permission", "YeuCauDoiLich_CREATE"));
    options.AddPolicy("YeuCauDoiLichRead", p => p.RequireClaim("Permission", "YeuCauDoiLich_READ"));
    options.AddPolicy("YeuCauDoiLichUpdate", p => p.RequireClaim("Permission", "YeuCauDoiLich_UPDATE"));
    options.AddPolicy("YeuCauDoiLichDelete", p => p.RequireClaim("Permission", "YeuCauDoiLich_DELETE"));
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddCors(op =>
{
    op.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder
            .WithOrigins("http://localhost:5173", "https://localhost:5173","http://localhost:5174", "https://localhost:5174", "https://gmp-project.vercel.app") 
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});
var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "media")),
    RequestPath = "/media"
});
app.UseAuthorization();

app.MapControllers();
app.UseSession();
app.Run();
