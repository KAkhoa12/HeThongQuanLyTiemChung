using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class PhieuNhapVM
{
    public string MaPhieuNhap { get; set; } = null!;

    public string? MaNhaCungCap { get; set; }

    public DateTime? NgayNhap { get; set; }

    public decimal? TongTien { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
