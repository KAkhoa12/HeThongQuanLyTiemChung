using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhienDangNhap
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

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
