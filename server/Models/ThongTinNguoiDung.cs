using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ThongTinNguoiDung
{
    public string MaThongTin { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public decimal? ChieuCao { get; set; }

    public decimal? CanNang { get; set; }

    public decimal? Bmi { get; set; }

    public string? NhomMau { get; set; }

    public string? BenhNen { get; set; }

    public string? DiUng { get; set; }

    public string? ThuocDangDung { get; set; }

    public bool? TinhTrangMangThai { get; set; }

    public DateOnly? NgayKhamGanNhat { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
