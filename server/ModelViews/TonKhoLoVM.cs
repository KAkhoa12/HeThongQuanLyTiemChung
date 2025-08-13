using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class TonKhoLoVM
{
    public string MaTonKho { get; set; } = null!;

    public string? MaDiaDiem { get; set; }

    public string? MaLo { get; set; }

    public int? SoLuong { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
