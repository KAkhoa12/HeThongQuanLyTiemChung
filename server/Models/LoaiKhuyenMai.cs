using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LoaiKhuyenMai
{
    public string MaLoaiKhuyenMai { get; set; } = null!;

    public string? TenLoai { get; set; }

    public string? MoTa { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<KhuyenMai> KhuyenMais { get; set; } = new List<KhuyenMai>();
}
