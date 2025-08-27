using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DonHangChiTietVM
{
    public string MaDonHangChiTiet { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string? MaDichVu { get; set; }

    public int SoMuiChuan { get; set; }

    public decimal? DonGiaMui { get; set; }

    public decimal? ThanhTien { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
