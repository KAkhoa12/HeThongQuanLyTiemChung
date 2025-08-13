using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class VaccineVM
{
    public string MaVaccine { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? NhaSanXuat { get; set; }

    public int? TuoiBatDauTiem { get; set; }

    public int? TuoiKetThucTiem { get; set; }

    public string? HuongDanSuDung { get; set; }

    public string? PhongNgua { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }


}
