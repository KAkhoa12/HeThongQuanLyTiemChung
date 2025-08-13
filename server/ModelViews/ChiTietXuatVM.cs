using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class ChiTietXuatVM
{
    public string MaChiTiet { get; set; } = null!;

    public string? MaPhieuXuat { get; set; }

    public string? MaLo { get; set; }

    public int? SoLuong { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
