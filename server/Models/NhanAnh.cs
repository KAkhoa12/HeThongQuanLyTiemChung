using System;
using System.Collections.Generic;

namespace server.Models;

public partial class NhanAnh
{
    public string MaNhan { get; set; } = null!;

    public string TenNhan { get; set; } = null!;

    public string? MoTa { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<NguonAnh> NguonAnhs { get; set; } = new List<NguonAnh>();
}
