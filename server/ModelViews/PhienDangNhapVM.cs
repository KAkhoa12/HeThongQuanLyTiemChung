using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class PhienDangNhapVM
{
    public string MaPhien { get; set; } = null!;

    public string AccessToken { get; set; } = null!;

    public string RefreshToken { get; set; } = null!;

    public DateTime ThoiHan { get; set; }

    public DateTime ThoiHanRefresh { get; set; }

    public string MaNguoiDung { get; set; } = null!;

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
