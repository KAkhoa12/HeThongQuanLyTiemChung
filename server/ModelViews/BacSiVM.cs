using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class BacSiVM
{
    public string MaBacSi { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public string? ChuyenMon { get; set; }

    public string? SoGiayPhep { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
