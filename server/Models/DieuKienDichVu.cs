using System;
using System.Collections.Generic;

namespace server.Models;

public partial class DieuKienDichVu
{
    public string MaDieuKien { get; set; } = null!;

    public string MaDichVu { get; set; } = null!;

    public int? TuoiThangToiThieu { get; set; }

    public int? TuoiThangToiDa { get; set; }

    public string? GioiTinh { get; set; }

    public string? GhiChu { get; set; }

    public virtual DichVu MaDichVuNavigation { get; set; } = null!;
}
