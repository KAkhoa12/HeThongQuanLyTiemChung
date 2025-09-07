using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DichVuVaccine
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

    public int? ThuTu { get; set; }

    public virtual DichVu MaDichVuNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;
}
