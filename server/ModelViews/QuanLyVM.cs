using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class QuanLyVM
{
    public string MaQuanLy { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
