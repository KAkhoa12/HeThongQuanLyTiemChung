using System;
using System.Collections.Generic;

namespace server.Models;

public partial class AnhDiaDiem
{
    public string MaAnhDiaDiem { get; set; } = null!;

    public string MaDiaDiem { get; set; } = null!;

    public string MaAnh { get; set; } = null!;

    public bool? LaAnhChinh { get; set; }

    public int? ThuTuHienThi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual NguonAnh MaAnhNavigation { get; set; } = null!;

    public virtual DiaDiem MaDiaDiemNavigation { get; set; } = null!;
}
