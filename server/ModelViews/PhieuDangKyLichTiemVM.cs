using System;

namespace server.ModelViews;

public class PhieuDangKyLichTiemVM
{
    public string MaPhieuDangKy { get; set; } = null!;

    public string MaKhachHang { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaBacSi { get; set; } = null!;

    public DateTime NgayDangKy { get; set; }

    public DateTime NgayHenTiem { get; set; }

    public string GioHenTiem { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public string? LyDoTuChoi { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    // Additional properties for display
    public string? TenKhachHang { get; set; }
    public string? MaDonHangDisplay { get; set; }
    public string? TenBacSi { get; set; }
    public string? SoDienThoaiKhachHang { get; set; }
    public string? EmailKhachHang { get; set; }
} 