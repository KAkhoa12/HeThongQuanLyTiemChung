using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LoaiKhuyenMaiVM
{
    public string MaLoaiKhuyenMai { get; set; } = null!;

    public string? TenLoai { get; set; }

    public string? MoTa { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
