using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DichVu
{
    public string MaDichVu { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string? MoTa { get; set; }

    public decimal? Gia { get; set; }

    public string? MaLoaiDichVu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<AnhDichVu> AnhDichVus { get; set; } = new List<AnhDichVu>();

    public virtual ICollection<DichVuVaccine> DichVuVaccines { get; set; } = new List<DichVuVaccine>();

    public virtual LoaiDichVu? MaLoaiDichVuNavigation { get; set; }
}
