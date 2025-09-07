using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietPhieuTiem
{
    public string MaChiTietPhieuTiem { get; set; } = null!;

    public string MaPhieuTiem { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int MuiTiemThucTe { get; set; }

    public int ThuTu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual PhieuTiem MaPhieuTiemNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;
}
