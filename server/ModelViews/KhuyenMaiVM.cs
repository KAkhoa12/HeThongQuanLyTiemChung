using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class KhuyenMaiVM
{
    public string MaKhuyenMai { get; set; } = null!;

    public string? MaLoaiKhuyenMai { get; set; }

    public string? TenKhuyenMai { get; set; }

    public string? LoaiGiam { get; set; }

    public decimal? GiaTriGiam { get; set; }

    public decimal? GiamToiDa { get; set; }

    public decimal? DieuKienToiThieu { get; set; }

    public DateOnly? NgayBatDau { get; set; }

    public DateOnly? NgayKetThuc { get; set; }

    public int? SoLuotDung { get; set; }

    public int? SoLuotDaDung { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
