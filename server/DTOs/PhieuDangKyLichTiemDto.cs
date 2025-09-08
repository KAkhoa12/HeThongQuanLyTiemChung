using System;

namespace server.DTOs;

public class PhieuDangKyLichTiemDto
{
    public string MaPhieuDangKy { get; set; } = null!;

    public string MaKhachHang { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public DateTime NgayDangKy { get; set; }

    public string TrangThai { get; set; } = null!;

    public string? LyDoTuChoi { get; set; }

    public string? GhiChu { get; set; }
}

public class CreatePhieuDangKyLichTiemDto
{
    public string MaKhachHang { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public DateTime? NgayDangKy { get; set; }
    public string? MaDiaDiem { get; set; }

    public string? GhiChu { get; set; }
}

public class UpdatePhieuDangKyLichTiemDto
{
    public string? GhiChu { get; set; }
    public string? MaDiaDiem { get; set; }
    public string? NgayDangKy { get; set; }
}

public class DuyetPhieuDto
{
    public string TrangThai { get; set; } = null!; // "Đã duyệt", "Từ chối"

    public string? LyDoTuChoi { get; set; } // Bắt buộc nếu TrangThai = "Từ chối"
} 