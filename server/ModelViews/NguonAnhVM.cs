using System;
using System.Collections.Generic;

namespace server.ModelViews;

public partial class NguonAnhVM
{
    public string MaAnh { get; set; } = null!;

    public string? MaNhan { get; set; }

    public string UrlAnh { get; set; } = null!;

    public string? AltText { get; set; }

    public string? NguoiTai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

}
