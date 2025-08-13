using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DichVuVaccineVM
{
    public string MaDichVuVaccine { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int SoMuiChuan { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
