using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class LichTiemChuanVM
{
    public string MaLichTiemChuan { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int MuiThu { get; set; }

    public int? TuoiThangToiThieu { get; set; }

    public int? TuoiThangToiDa { get; set; }

    public int? SoNgaySauMuiTruoc { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }
}
