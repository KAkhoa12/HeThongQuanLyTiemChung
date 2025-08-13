using System;
using System.Collections.Generic;

namespace server.Models;

public partial class QuanLy
{
    public string MaQuanLy { get; set; } = null!;

    public string MaNguoiDung { get; set; } = null!;

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
