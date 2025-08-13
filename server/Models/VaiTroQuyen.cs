using System;
using System.Collections.Generic;

namespace server.Models;

public partial class VaiTroQuyen
{
    public string MaVaiTro { get; set; } = null!;

    public string MaQuyen { get; set; } = null!;

    public DateTime? NgayTao { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual Quyen MaQuyenNavigation { get; set; } = null!;

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;
}
