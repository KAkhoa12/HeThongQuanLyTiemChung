using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietNhap
{
    public string MaChiTiet { get; set; } = null!;

    public string? MaPhieuNhap { get; set; }

    public string? MaLo { get; set; }

    public int? SoLuong { get; set; }

    public decimal? Gia { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual LoVaccine? MaLoNavigation { get; set; }

    public virtual PhieuNhap? MaPhieuNhapNavigation { get; set; }
}
