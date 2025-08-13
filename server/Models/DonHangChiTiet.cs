using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DonHangChiTiet
{
    public string MaDonHangChiTiet { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int SoMuiChuan { get; set; }

    public decimal? DonGiaMui { get; set; }

    public decimal? ThanhTien { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual DonHang MaDonHangNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;
}
