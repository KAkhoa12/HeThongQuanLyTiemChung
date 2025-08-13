using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DonHangVM
{
    public string MaDonHang { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public string? MaDiaDiemYeuThich { get; set; }

    public DateTime? NgayDat { get; set; }

    public decimal TongTienGoc { get; set; }

    public decimal TongTienThanhToan { get; set; }

    public string? TrangThaiDon { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }


}
