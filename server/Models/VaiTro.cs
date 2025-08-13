using System;
using System.Collections.Generic;

namespace server.Models;

public partial class VaiTro
{
    public string MaVaiTro { get; set; } = null!;

    public string TenVaiTro { get; set; } = null!;

    public string? MoTa { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<NguoiDung> NguoiDungs { get; set; } = new List<NguoiDung>();

    public virtual ICollection<VaiTroQuyen> VaiTroQuyens { get; set; } = new List<VaiTroQuyen>();
}
