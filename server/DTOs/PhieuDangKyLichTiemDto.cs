using System;

namespace server.DTOs;

public class PhieuDangKyLichTiemDto
{
    public string MaPhieuDangKy { get; set; } = null!;

    public string MaKhachHang { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public string MaBacSi { get; set; } = null!;

    public DateTime NgayDangKy { get; set; }

    public DateTime NgayHenTiem { get; set; }

    public string GioHenTiem { get; set; } = null!;

    public string TrangThai { get; set; } = null!;

    public string? LyDoTuChoi { get; set; }

    public string? GhiChu { get; set; }
}

public class CreatePhieuDangKyLichTiemDto
{
    public string MaKhachHang { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public string MaBacSi { get; set; } = null!;

    public DateTime NgayHenTiem { get; set; }

    public string GioHenTiem { get; set; } = null!;

    public string? GhiChu { get; set; }
}

public class UpdatePhieuDangKyLichTiemDto
{
    public DateTime? NgayHenTiem { get; set; }

    public string? GioHenTiem { get; set; }

    public string? GhiChu { get; set; }
}

public class DuyetPhieuDto
{
    public string TrangThai { get; set; } = null!; // "Đã duyệt", "Từ chối"

    public string? LyDoTuChoi { get; set; } // Bắt buộc nếu TrangThai = "Từ chối"
} 