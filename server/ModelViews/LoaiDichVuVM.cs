using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class LoaiDichVuVM
{
    public string MaLoaiDichVu { get; set; } = null!;

    public string? TenLoai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
