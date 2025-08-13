using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class PhieuThanhLyVM
{
    public string MaPhieuThanhLy { get; set; } = null!;

    public string? MaDiaDiem { get; set; }

    public DateTime? NgayThanhLy { get; set; }

    public string? TrangThai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
