using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuDangKyLichTiem
{
    public string MaPhieuDangKy { get; set; } = null!;

    public string MaKhachHang { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public string MaBacSi { get; set; } = null!;

    public DateTime NgayDangKy { get; set; }

    public DateTime NgayHenTiem { get; set; }

    public string GioHenTiem { get; set; } = null!;

    public string TrangThai { get; set; } = null!; // "Chờ duyệt", "Đã duyệt", "Từ chối", "Hoàn thành"

    public string? LyDoTuChoi { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    // Navigation properties
    public virtual NguoiDung MaKhachHangNavigation { get; set; } = null!;
    public virtual DichVu MaDichVuNavigation { get; set; } = null!;
    public virtual BacSi MaBacSiNavigation { get; set; } = null!;
} 