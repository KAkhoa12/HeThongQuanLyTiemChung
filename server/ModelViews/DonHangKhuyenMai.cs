using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DonHangKhuyenMaiVM
{
    public string MaDonHangKhuyenMai { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaKhuyenMai { get; set; } = null!;

    public decimal? GiamGiaGoc { get; set; }

    public decimal? GiamGiaThucTe { get; set; }

    public DateTime? NgayApDung { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
