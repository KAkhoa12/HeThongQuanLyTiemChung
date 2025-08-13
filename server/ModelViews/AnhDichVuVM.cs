using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class AnhDichVuVM
{
    public string MaAnhDichVu { get; set; } = null!;

    public string? MaAnh { get; set; }

    public string? MaDichVu { get; set; }

    public bool? LaAnhChinh { get; set; }

    public int? ThuTuHienThi { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
