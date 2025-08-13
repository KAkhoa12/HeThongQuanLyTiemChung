using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhieuTiem
{
    public string MaPhieuTiem { get; set; } = null!;

    public string MaLichHen { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public string MaLo { get; set; } = null!;

    public int? MuiThuThucTe { get; set; }

    public DateTime? NgayTiem { get; set; }

    public string? MaBacSi { get; set; }

    public string? PhanUng { get; set; }

    public string? MoTaPhanUng { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual BacSi? MaBacSiNavigation { get; set; }

    public virtual LichHen MaLichHenNavigation { get; set; } = null!;

    public virtual LoVaccine MaLoNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;
}
