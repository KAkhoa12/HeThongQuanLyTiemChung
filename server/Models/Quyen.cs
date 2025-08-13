using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Quyen
{
    public string MaQuyen { get; set; } = null!;

    public string TenQuyen { get; set; } = null!;

    public string? MoTa { get; set; }

    public string Module { get; set; } = null!;

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<NguoiDungQuyen> NguoiDungQuyens { get; set; } = new List<NguoiDungQuyen>();

    public virtual ICollection<VaiTroQuyen> VaiTroQuyens { get; set; } = new List<VaiTroQuyen>();
}
