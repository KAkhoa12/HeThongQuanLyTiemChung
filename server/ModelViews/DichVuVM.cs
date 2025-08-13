using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DichVuVM
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
}
