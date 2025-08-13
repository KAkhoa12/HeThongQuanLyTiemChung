using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DonHangKhuyenMai
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

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual KhuyenMai MaKhuyenMaiNavigation { get; set; } = null!;
}
