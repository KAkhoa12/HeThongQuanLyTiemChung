using System;
using System.Collections.Generic;

namespace server.Models;

public partial class AnhVaccine
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

    public virtual NguonAnh MaAnhNavigation { get; set; } = null!;

    public virtual Vaccine MaVaccineNavigation { get; set; } = null!;
}
