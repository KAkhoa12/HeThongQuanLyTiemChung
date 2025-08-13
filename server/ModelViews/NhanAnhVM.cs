using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class NhanAnhVM
{
    public string MaNhan { get; set; } = null!;

    public string TenNhan { get; set; } = null!;

    public string? MoTa { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
