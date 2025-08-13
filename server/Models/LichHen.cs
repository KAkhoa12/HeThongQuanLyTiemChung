using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LichHen
{
    public string MaLichHen { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaLichLamViec { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int MuiThu { get; set; }

    public DateTime NgayHen { get; set; }

    public string? TrangThai { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual LichLamViec MaLichLamViecNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;

    public virtual ICollection<PhieuTiem> PhieuTiems { get; set; } = new List<PhieuTiem>();

    public virtual ICollection<YeuCauDoiLich> YeuCauDoiLiches { get; set; } = new List<YeuCauDoiLich>();
}
