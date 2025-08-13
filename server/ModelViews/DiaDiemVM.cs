using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class DiaDiemVM
{
    public string MaDiaDiem { get; set; } = null!;

    public string Ten { get; set; } = null!;

    public string DiaChi { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public string? Email { get; set; }

    public string? MoTa { get; set; }

    public string? GioMoCua { get; set; }

    public int? SucChua { get; set; }

    public string? LoaiDiaDiem { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
