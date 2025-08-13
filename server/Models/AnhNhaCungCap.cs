using System;
using System.Collections.Generic;

namespace server.Models;

public partial class AnhNhaCungCap
{
    public string MaAnhNhaCungCap { get; set; } = null!;

    public string MaNhaCungCap { get; set; } = null!;

    public string MaAnh { get; set; } = null!;

    public int? ThuTuHienThi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguonAnh MaAnhNavigation { get; set; } = null!;

    public virtual NhaCungCap MaNhaCungCapNavigation { get; set; } = null!;
}
