using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class AnhVaccineVM
{
    public string MaAnhVaccine { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public string MaAnh { get; set; } = null!;

    public int? ThuTuHienThi { get; set; }

    public bool? LaAnhChinh { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
