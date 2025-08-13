using System;
using System.Collections.Generic;

namespace server.Models;

public partial class LoaiDichVu
{
    public string MaLoaiDichVu { get; set; } = null!;

    public string? TenLoai { get; set; }

    public bool? IsDelete { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? NgayTao { get; set; }

    public DateTime? NgayCapNhat { get; set; }

    public virtual ICollection<DichVu> DichVus { get; set; } = new List<DichVu>();
}
