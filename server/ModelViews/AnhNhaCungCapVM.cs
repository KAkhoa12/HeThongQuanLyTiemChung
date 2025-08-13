using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class AnhNhaCungCapVM
{
    public string MaAnhNhaCungCap { get; set; } = null!;

    public string MaNhaCungCap { get; set; } = null!;

    public string MaAnh { get; set; } = null!;

    public int? ThuTuHienThi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
