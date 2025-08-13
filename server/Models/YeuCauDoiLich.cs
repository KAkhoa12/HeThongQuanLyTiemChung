using System;
using System.Collections.Generic;

namespace server.Models;

public partial class YeuCauDoiLich
{
    public string MaYeuCau { get; set; } = null!;

    public string MaLichHen { get; set; } = null!;

    public DateTime NgayHenMoi { get; set; }

    public string? LyDo { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual LichHen MaLichHenNavigation { get; set; } = null!;
}
