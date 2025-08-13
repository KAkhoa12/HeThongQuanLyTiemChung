using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietThanhLy
{
    public string MaChiTiet { get; set; } = null!;

    public string? MaPhieuThanhLy { get; set; }

    public string? MaLo { get; set; }

    public int? SoLuong { get; set; }

    public string? LyDo { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual LoVaccine? MaLoNavigation { get; set; }

    public virtual PhieuThanhLy? MaPhieuThanhLyNavigation { get; set; }
}
