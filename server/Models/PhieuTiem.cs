using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuTiem
{
    public string MaPhieuTiem { get; set; } = null!;

    public DateTime? NgayTiem { get; set; }

    public string? MaBacSi { get; set; }

    public string? PhanUng { get; set; }

    public string? MoTaPhanUng { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public string? MaDichVu { get; set; }

    public string? TrangThai { get; set; }

    public string? MaNguoiDung { get; set; }

    public string? MaKeHoachTiem { get; set; }

    public virtual ICollection<ChiTietPhieuTiem> ChiTietPhieuTiems { get; set; } = new List<ChiTietPhieuTiem>();

    public virtual BacSi? MaBacSiNavigation { get; set; }

    public virtual DichVu? MaDichVuNavigation { get; set; }

    public virtual KeHoachTiem? MaKeHoachTiemNavigation { get; set; }

    public virtual NguoiDung? MaNguoiDungNavigation { get; set; }
}
