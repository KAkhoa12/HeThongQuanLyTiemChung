using System;
using System.Collections.Generic;

namespace server.Models;

public partial class KeHoachTiem
{
    public string MaKeHoachTiem { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int MuiThu { get; set; }

    public DateOnly? NgayDuKien { get; set; }

    public string? TrangThai { get; set; }

    public virtual DichVu MaDichVuNavigation { get; set; } = null!;

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;

    public virtual ICollection<PhieuTiem> PhieuTiems { get; set; } = new List<PhieuTiem>();
}
