using System;

namespace server.ModelViews;

public partial class PhieuDangKyLichTiemVM
{
    public string MaPhieuDangKy { get; set; } = null!;
    public string MaKhachHang { get; set; } = null!;
    public string MaDichVu { get; set; } = null!;
    public string? NgayDangKy { get; set; }
    public string TrangThai { get; set; } = null!;
    public string? LyDoTuChoi { get; set; }
    public string? GhiChu { get; set; }
    public bool? IsDelete { get; set; }
    public bool? IsActive { get; set; }
    public string? NgayTao { get; set; }
    public string? NgayCapNhat { get; set; }
    
    // Navigation properties
    public string? TenKhachHang { get; set; }
    public string? SoDienThoaiKhachHang { get; set; }
    public string? EmailKhachHang { get; set; }
    public string? TenDichVu { get; set; }
    public string? MaDonHangDisplay { get; set; }
} 