using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuDangKyLichTiem
{
    public string MaPhieuDangKy { get; set; } = null!;

    public string MaKhachHang { get; set; } = null!;

    public DateTime NgayDangKy { get; set; }

    public string TrangThai { get; set; } = null!;

    public string? LyDoTuChoi { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? MaDichVu { get; set; }

    public string? MaDiaDiem { get; set; }

    public string? MaDonHang { get; set; }

    public virtual DiaDiem? MaDiaDiemNavigation { get; set; }

    public virtual DichVu? MaDichVuNavigation { get; set; }

    public virtual DonHang? MaDonHangNavigation { get; set; }

    public virtual NguoiDung MaKhachHangNavigation { get; set; } = null!;
}
