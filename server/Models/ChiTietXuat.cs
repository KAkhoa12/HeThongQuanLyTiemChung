using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietXuat
{
    public string MaChiTiet { get; set; } = null!;

    public string? MaPhieuXuat { get; set; }

    public string? MaLo { get; set; }

    public int? SoLuong { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual LoVaccine? MaLoNavigation { get; set; }

    public virtual PhieuXuat? MaPhieuXuatNavigation { get; set; }
}
