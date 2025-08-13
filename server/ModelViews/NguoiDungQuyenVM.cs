using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class NguoiDungQuyenVM
{
    public string MaNguoiDung { get; set; } = null!;

    public string MaQuyen { get; set; } = null!;

    public DateTime? NgayTao { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
