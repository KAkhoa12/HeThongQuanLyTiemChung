using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class LichHenVM
{
    public string MaLichHen { get; set; } = null!;

    public string MaDonHang { get; set; } = null!;

    public string MaLichLamViec { get; set; } = null!;

    public string MaVaccine { get; set; } = null!;

    public int MuiThu { get; set; }

    public DateTime NgayHen { get; set; }

    public string? TrangThai { get; set; }

    public string? GhiChu { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }


}
