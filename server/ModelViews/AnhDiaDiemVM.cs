using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class AnhDiaDiemVM
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
}
